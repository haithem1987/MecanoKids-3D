import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  CameraPreset,
  LanguageCode,
  PartAnimationKind,
  PartSpec,
  VehicleBlueprint,
  VehicleCategory,
  VisualStyleMode,
} from '../types/game';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  createGuideGhostMaterial,
  createRadialShadowTexture,
  createTurntableTexture,
} from '../three/materials';
import { buildPartMeshGroup } from '../three/partGeometries';
import { soundEngine } from '../audio/soundEngine';

// Pre-allocated math helpers at module scope (zero GC in render loop)
const _mouseNDC = new THREE.Vector2();
const _dragPlane = new THREE.Plane();
const _camDir = new THREE.Vector3();
const _planeAnchor = new THREE.Vector3();
const _intersectPt = new THREE.Vector3();
const _targetVec = new THREE.Vector3();
const _projectedVec = new THREE.Vector3();
const _sparkDummy = new THREE.Object3D();

const SPARK_COUNT = 28;

const CAMERA_PRESET_VECTORS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  [CameraPreset.ISO]: { pos: [4.4, 3.2, 4.9], target: [0, 0.9, 0] },
  [CameraPreset.FRONT]: { pos: [0, 1.9, 6.2], target: [0, 0.9, 0] },
  [CameraPreset.SIDE]: { pos: [6.2, 1.9, 0], target: [0, 0.9, 0] },
  [CameraPreset.TOP]: { pos: [0.01, 6.8, 0.9], target: [0, 0.7, 0] },
};

export interface DragFeedbackOverlay {
  partName: string;
  status: 'magnet' | 'dragging' | 'locked';
  message: string;
  x: number;
  y: number;
}

interface WorkshopCanvasProps {
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  placedPartIds: string[];
  visualStyle: VisualStyleMode;
  explodedFactor: number;
  cameraPreset: CameraPreset;
  cameraPresetNonce: number;
  activeDragPartId: string | null;
  stagedPartId: string | null;
  hintPartId: string | null;
  onPartSnapped: (partId: string) => void;
  onPartDropRejected: (reason: string) => void;
  onDragEndSignal: () => void;
  onStartCanvasDrag: (partId: string) => void;
}

interface SparkParticle {
  active: boolean;
  life: number;
  maxLife: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
}

function disposeObject3D(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else if (mesh.material) {
        mesh.material.dispose();
      }
    }
  });
}

export const WorkshopCanvas: React.FC<WorkshopCanvasProps> = ({
  language,
  blueprint,
  placedPartIds,
  visualStyle,
  explodedFactor,
  cameraPreset,
  cameraPresetNonce,
  activeDragPartId,
  stagedPartId,
  hintPartId,
  onPartSnapped,
  onPartDropRejected,
  onDragEndSignal,
  onStartCanvasDrag,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [webglLost, setWebglLost] = useState(false);
  const [dragHud, setDragHud] = useState<DragFeedbackOverlay | null>(null);

  // Mutable refs synchronized with React props so WebGL canvas never tears down
  const propsRef = useRef({
    language,
    blueprint,
    placedPartIds,
    visualStyle,
    explodedFactor,
    activeDragPartId,
    stagedPartId,
    hintPartId,
    onPartSnapped,
    onPartDropRejected,
    onDragEndSignal,
    onStartCanvasDrag,
  });

  useEffect(() => {
    propsRef.current = {
      language,
      blueprint,
      placedPartIds,
      visualStyle,
      explodedFactor,
      activeDragPartId,
      stagedPartId,
      hintPartId,
      onPartSnapped,
      onPartDropRejected,
      onDragEndSignal,
      onStartCanvasDrag,
    };
  }, [
    language,
    blueprint,
    placedPartIds,
    visualStyle,
    explodedFactor,
    activeDragPartId,
    stagedPartId,
    hintPartId,
    onPartSnapped,
    onPartDropRejected,
    onDragEndSignal,
    onStartCanvasDrag,
  ]);

  // Scene object references for dynamic rebuilds without recreating WebGLRenderer
  const engineRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    turntableGroup: THREE.Group;
    turntableTopMesh: THREE.Mesh;
    assembledGroup: THREE.Group;
    silhouettesGroup: THREE.Group;
    dragContainer: THREE.Group;
    sparksMesh: THREE.InstancedMesh;
    sparks: SparkParticle[];
    placedPartEntries: Map<string, { group: THREE.Group; spec: PartSpec; popScale: number }>;
    silhouetteEntries: Map<string, { group: THREE.Group; spec: PartSpec; stateKey: string }>;
    draggedMesh: { partId: string; group: THREE.Group; spec: PartSpec; magnetized: boolean } | null;
    cameraTransition: { active: boolean; pos: THREE.Vector3; target: THREE.Vector3 };
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    triggerSparks: (origin: [number, number, number]) => void;
  } | null>(null);

  // 1. Initialize WebGLRenderer & Studio Scene ONCE
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.className = 'block w-full h-full touch-none select-none';
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f6f9);
    scene.fog = new THREE.FogExp2(0xf4f6f9, 0.028);

    // Mandatory studio environment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      44,
      Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight),
      0.1,
      100,
    );
    camera.position.set(4.4, 3.2, 4.9);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.8;
    controls.maxDistance = 10.5;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.target.set(0, 0.9, 0);
    controls.update();

    // 3-Point Warm/Cool Studio Rig
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xcbd5e1, 0.95);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.75);
    keyLight.position.set(5.5, 8.5, 6.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    const d = 4.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 22;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.85);
    rimLight.position.set(-5.0, 4.5, -5.5);
    scene.add(rimLight);

    // Subtle Infinite Workshop Floor Plane
    const studioFloor = new THREE.Mesh(
      new THREE.CircleGeometry(28, 48),
      new THREE.MeshStandardMaterial({
        color: 0xeef2f7,
        roughness: 0.92,
        metalness: 0.02,
      }),
    );
    studioFloor.rotation.x = -Math.PI / 2;
    studioFloor.position.y = -0.22;
    studioFloor.receiveShadow = true;
    scene.add(studioFloor);

    // Turntable Pedestal Group
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);

    const baseRim = new THREE.Mesh(
      new THREE.CylinderGeometry(2.68, 2.82, 0.2, 48),
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.42,
        metalness: 0.55,
      }),
    );
    baseRim.position.y = -0.11;
    baseRim.receiveShadow = true;
    turntableGroup.add(baseRim);

    const turntableTopMat = new THREE.MeshStandardMaterial({
      map: createTurntableTexture(propsRef.current.visualStyle, maxAnisotropy),
      roughness: 0.58,
      metalness: 0.08,
    });
    const turntableTopMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2.58, 2.58, 0.04, 48),
      turntableTopMat,
    );
    turntableTopMesh.position.y = 0;
    turntableTopMesh.receiveShadow = true;
    turntableGroup.add(turntableTopMesh);

    // Soft Radial Contact Shadow Plane (offset on Y + polygonOffset so zero Z-fighting)
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 3.8),
      new THREE.MeshBasicMaterial({
        map: createRadialShadowTexture(),
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      }),
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.024;
    turntableGroup.add(contactShadow);

    const assembledGroup = new THREE.Group();
    const silhouettesGroup = new THREE.Group();
    turntableGroup.add(assembledGroup);
    turntableGroup.add(silhouettesGroup);

    const dragContainer = new THREE.Group();
    scene.add(dragContainer);

    // Celebration Sparks InstancedMesh (>20 repeated items -> InstancedMesh with frustumCulled=false)
    const sparkGeo = new THREE.OctahedronGeometry(0.065, 0);
    const sparkMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.65,
      roughness: 0.25,
    });
    const sparksMesh = new THREE.InstancedMesh(sparkGeo, sparkMat, SPARK_COUNT);
    sparksMesh.frustumCulled = false;
    const sparks: SparkParticle[] = [];
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparks.push({
        active: false,
        life: 0,
        maxLife: 0.7,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
      });
      _sparkDummy.position.set(0, -50, 0);
      _sparkDummy.scale.setScalar(0.001);
      _sparkDummy.updateMatrix();
      sparksMesh.setMatrixAt(i, _sparkDummy.matrix);
    }
    sparksMesh.instanceMatrix.needsUpdate = true;
    sparksMesh.computeBoundingSphere();
    scene.add(sparksMesh);

    const triggerSparks = (origin: [number, number, number]) => {
      for (let i = 0; i < SPARK_COUNT; i++) {
        const sp = sparks[i];
        sp.active = true;
        sp.life = 0;
        sp.maxLife = 0.55 + Math.random() * 0.35;
        sp.pos.set(origin[0], origin[1], origin[2]);
        const theta = (i / SPARK_COUNT) * Math.PI * 2 + Math.random() * 0.3;
        const speed = 1.6 + Math.random() * 2.2;
        sp.vel.set(
          Math.cos(theta) * speed,
          1.8 + Math.random() * 2.2,
          Math.sin(theta) * speed,
        );
      }
    };

    const cameraTransition = {
      active: false,
      pos: new THREE.Vector3(4.4, 3.2, 4.9),
      target: new THREE.Vector3(0, 0.9, 0),
    };

    controls.addEventListener('start', () => {
      cameraTransition.active = false;
    });

    engineRef.current = {
      renderer,
      scene,
      camera,
      controls,
      turntableGroup,
      turntableTopMesh,
      assembledGroup,
      silhouettesGroup,
      dragContainer,
      sparksMesh,
      sparks,
      placedPartEntries: new Map(),
      silhouetteEntries: new Map(),
      draggedMesh: null,
      cameraTransition,
      isSoftwareGl,
      maxAnisotropy,
      triggerSparks,
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Handle WebGL Context Loss
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglLost(true);
    };
    const onContextRestored = () => {
      setWebglLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Continuous Game Loop with Software-WebGL fenceSync guard
    const clock = new THREE.Clock();
    let frameId = 0;
    let unmounted = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (unmounted) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (unmounted) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.elapsedTime;
      const eng = engineRef.current;
      const currentProps = propsRef.current;

      if (eng) {
        // Smooth camera preset interpolation
        if (eng.cameraTransition.active) {
          const factor = 1 - Math.exp(-6.5 * dt);
          eng.camera.position.lerp(eng.cameraTransition.pos, factor);
          eng.controls.target.lerp(eng.cameraTransition.target, factor);
          if (eng.camera.position.distanceTo(eng.cameraTransition.pos) < 0.03) {
            eng.cameraTransition.active = false;
          }
        }
        eng.controls.update();

        const isCompleted =
          currentProps.placedPartIds.length === currentProps.blueprint.parts.length &&
          currentProps.blueprint.parts.length > 0;

        // Celebrate completed vehicle with gentle turntable rotation & mechanical animations
        if (isCompleted && !eng.draggedMesh) {
          eng.turntableGroup.rotation.y += dt * 0.42;
          if (currentProps.blueprint.category === VehicleCategory.BOAT) {
            eng.assembledGroup.position.y = Math.sin(elapsed * 2.4) * 0.04;
            eng.assembledGroup.rotation.z = Math.sin(elapsed * 1.8) * 0.035;
          } else if (currentProps.blueprint.category === VehicleCategory.PLANE) {
            eng.assembledGroup.position.y = 0.08 + Math.sin(elapsed * 2.6) * 0.05;
            eng.assembledGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.03;
          } else {
            eng.assembledGroup.position.y = THREE.MathUtils.damp(eng.assembledGroup.position.y, 0, 8, dt);
            eng.assembledGroup.rotation.z = THREE.MathUtils.damp(eng.assembledGroup.rotation.z, 0, 8, dt);
          }
        } else {
          // Smoothly align turntable back to 0 during active assembly so coordinates match silhouettes cleanly
          eng.turntableGroup.rotation.y = THREE.MathUtils.damp(eng.turntableGroup.rotation.y, 0, 7, dt);
          eng.assembledGroup.position.y = THREE.MathUtils.damp(eng.assembledGroup.position.y, 0, 8, dt);
          eng.assembledGroup.rotation.z = THREE.MathUtils.damp(eng.assembledGroup.rotation.z, 0, 8, dt);
        }

        // Update placed parts (spring pop + exploded view damping + mechanical animation)
        const exp = currentProps.explodedFactor;
        eng.placedPartEntries.forEach((entry) => {
          const { group, spec } = entry;
          const tx = spec.targetPos[0] + spec.explodeOffset[0] * exp;
          const ty = spec.targetPos[1] + spec.explodeOffset[1] * exp;
          const tz = spec.targetPos[2] + spec.explodeOffset[2] * exp;

          group.position.x = THREE.MathUtils.damp(group.position.x, tx, 10, dt);
          group.position.y = THREE.MathUtils.damp(group.position.y, ty, 10, dt);
          group.position.z = THREE.MathUtils.damp(group.position.z, tz, 10, dt);

          entry.popScale = THREE.MathUtils.damp(entry.popScale, 1.0, 12, dt);
          group.scale.setScalar(entry.popScale);

          if (isCompleted && spec.animation) {
            if (spec.animation === PartAnimationKind.SPIN_X) {
              group.rotation.x += dt * 7.5;
            } else if (spec.animation === PartAnimationKind.SPIN_Y) {
              group.rotation.y += dt * 9.5;
            } else if (spec.animation === PartAnimationKind.SPIN_Z) {
              group.rotation.z += dt * 13.0;
            } else if (spec.animation === PartAnimationKind.SWAY_Y) {
              group.rotation.y = Math.sin(elapsed * 2.0) * 0.22;
            }
          }
        });

        // Gentle hover float on staged (clicked) part when not actively pointer-dragging
        if (eng.draggedMesh && !currentProps.activeDragPartId && currentProps.stagedPartId) {
          eng.draggedMesh.group.position.y = 1.65 + Math.sin(elapsed * 3.0) * 0.06;
          eng.draggedMesh.group.rotation.y = Math.sin(elapsed * 1.4) * 0.25;
        }

        // Update celebration sparks
        let sparksDirty = false;
        for (let i = 0; i < SPARK_COUNT; i++) {
          const sp = eng.sparks[i];
          if (!sp.active) continue;
          sparksDirty = true;
          sp.life += dt;
          if (sp.life >= sp.maxLife) {
            sp.active = false;
            _sparkDummy.position.set(0, -50, 0);
            _sparkDummy.scale.setScalar(0.001);
          } else {
            sp.vel.y -= 5.2 * dt;
            sp.pos.addScaledVector(sp.vel, dt);
            const scale = 1 - sp.life / sp.maxLife;
            _sparkDummy.position.copy(sp.pos);
            _sparkDummy.rotation.set(sp.life * 6, sp.life * 4, 0);
            _sparkDummy.scale.setScalar(scale);
          }
          _sparkDummy.updateMatrix();
          eng.sparksMesh.setMatrixAt(i, _sparkDummy.matrix);
        }
        if (sparksDirty) {
          eng.sparksMesh.instanceMatrix.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      unmounted = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      disposeObject3D(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      engineRef.current = null;
    };
  }, []);

  // 2. Camera Preset Transitions
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;
    const preset = CAMERA_PRESET_VECTORS[cameraPreset];
    eng.cameraTransition.pos.set(preset.pos[0], preset.pos[1], preset.pos[2]);
    eng.cameraTransition.target.set(preset.target[0], preset.target[1], preset.target[2]);
    eng.cameraTransition.active = true;
  }, [cameraPreset, cameraPresetNonce]);

  // 3. Rebuild Turntable Surface & Placed / Silhouette Meshes when Blueprint, Style, Placed Parts, or Hint change
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    // Update turntable texture for the selected visual style
    const topMat = eng.turntableTopMesh.material as THREE.MeshStandardMaterial;
    topMat.map = createTurntableTexture(visualStyle, eng.maxAnisotropy);
    topMat.needsUpdate = true;

    // Rebuild Placed Meshes cleanly (preserving pop animation for newly snapped part)
    const prevIds = new Set(eng.placedPartEntries.keys());
    disposeObject3D(eng.assembledGroup);
    eng.assembledGroup.clear();
    eng.placedPartEntries.clear();

    const placedSet = new Set(placedPartIds);

    for (const partSpec of blueprint.parts) {
      if (placedSet.has(partSpec.id)) {
        const meshGroup = buildPartMeshGroup(
          partSpec,
          visualStyle,
          eng.isSoftwareGl,
          eng.maxAnisotropy,
        );
        const isNewlyAdded = !prevIds.has(partSpec.id) && placedPartIds[placedPartIds.length - 1] === partSpec.id;
        meshGroup.position.set(
          partSpec.targetPos[0] + partSpec.explodeOffset[0] * explodedFactor,
          partSpec.targetPos[1] + partSpec.explodeOffset[1] * explodedFactor,
          partSpec.targetPos[2] + partSpec.explodeOffset[2] * explodedFactor,
        );
        const startScale = isNewlyAdded ? 1.2 : 1.0;
        meshGroup.scale.setScalar(startScale);
        eng.assembledGroup.add(meshGroup);
        eng.placedPartEntries.set(partSpec.id, {
          group: meshGroup,
          spec: partSpec,
          popScale: startScale,
        });

        if (isNewlyAdded) {
          eng.triggerSparks(partSpec.targetPos);
        }
      }
    }

    // Rebuild Guide Silhouettes for Remaining Parts
    disposeObject3D(eng.silhouettesGroup);
    eng.silhouettesGroup.clear();
    eng.silhouetteEntries.clear();

    for (const partSpec of blueprint.parts) {
      if (placedSet.has(partSpec.id)) continue;

      const depsMet = partSpec.dependsOn.every((depId) => placedSet.has(depId));
      // In Tier 3 (Engineer), only show silhouettes whose dependencies are met (or hinted) to build genuine spatial mastery!
      if (blueprint.tier === 3 && !depsMet && hintPartId !== partSpec.id && activeDragPartId !== partSpec.id && stagedPartId !== partSpec.id) {
        continue;
      }

      const stateKey: 'ready' | 'locked' | 'hint' =
        hintPartId === partSpec.id || stagedPartId === partSpec.id
          ? 'hint'
          : depsMet
            ? 'ready'
            : 'locked';

      const ghostMat = createGuideGhostMaterial(stateKey);
      const ghostGroup = buildPartMeshGroup(
        partSpec,
        visualStyle,
        eng.isSoftwareGl,
        eng.maxAnisotropy,
        ghostMat,
      );
      ghostGroup.position.set(
        partSpec.targetPos[0],
        partSpec.targetPos[1],
        partSpec.targetPos[2],
      );
      ghostGroup.userData = { silhouettePartId: partSpec.id, depsMet };
      eng.silhouettesGroup.add(ghostGroup);
      eng.silhouetteEntries.set(partSpec.id, {
        group: ghostGroup,
        spec: partSpec,
        stateKey,
      });
    }
  }, [blueprint, placedPartIds, visualStyle, hintPartId, stagedPartId, activeDragPartId]);

  // 4. Manage Staged / Dragged Floating 3D Part & Pointer Projection
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const activeId = activeDragPartId || stagedPartId;

    // Clear existing floating part
    if (eng.draggedMesh) {
      disposeObject3D(eng.draggedMesh.group);
      eng.dragContainer.clear();
      eng.draggedMesh = null;
    }

    if (!activeId) {
      eng.controls.enabled = true;
      setDragHud(null);
      return;
    }

    const spec = blueprint.parts.find((p) => p.id === activeId);
    if (!spec) return;

    const dragGroup = buildPartMeshGroup(
      spec,
      visualStyle,
      eng.isSoftwareGl,
      eng.maxAnisotropy,
    );
    // Initial staging position slightly elevated above front of turntable
    dragGroup.position.set(-1.55, 1.65, 1.45);
    eng.dragContainer.add(dragGroup);
    eng.draggedMesh = {
      partId: spec.id,
      group: dragGroup,
      spec,
      magnetized: false,
    };

    if (activeDragPartId) {
      eng.controls.enabled = false;
    }
  }, [activeDragPartId, stagedPartId, blueprint, visualStyle]);

  // 5. Global Pointer Drag & Click-to-Snap Handlers
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const raycaster = new THREE.Raycaster();

    const handlePointerMove = (e: PointerEvent) => {
      const currentProps = propsRef.current;
      const engine = engineRef.current;
      if (!engine || !currentProps.activeDragPartId || !engine.draggedMesh) return;

      const rect = engine.renderer.domElement.getBoundingClientRect();
      _mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const spec = engine.draggedMesh.spec;
      _targetVec.set(spec.targetPos[0], spec.targetPos[1], spec.targetPos[2]);

      // Build camera-facing drag plane passing through target anchor so 3D depth always aligns naturally!
      engine.camera.getWorldDirection(_camDir);
      _planeAnchor.copy(_targetVec);
      _dragPlane.setFromNormalAndCoplanarPoint(_camDir, _planeAnchor);

      raycaster.setFromCamera(_mouseNDC, engine.camera);
      if (raycaster.ray.intersectPlane(_dragPlane, _intersectPt)) {
        _intersectPt.y = Math.max(0.22, _intersectPt.y);

        const placedSet = new Set(currentProps.placedPartIds);
        const missingDeps = spec.dependsOn.filter((d) => !placedSet.has(d));
        const dist = _intersectPt.distanceTo(_targetVec);
        const withinSnap = dist <= spec.snapRadius;

        const silEntry = engine.silhouetteEntries.get(spec.id);

        if (withinSnap && missingDeps.length === 0) {
          // Magnetic pull into exact target position!
          engine.draggedMesh.group.position.lerp(_targetVec, 0.58);
          if (!engine.draggedMesh.magnetized) {
            engine.draggedMesh.magnetized = true;
            soundEngine.playMagnetHover();
            if (silEntry) {
              const magMat = createGuideGhostMaterial('magnet');
              silEntry.group.traverse((ch) => {
                if ((ch as THREE.Mesh).isMesh) (ch as THREE.Mesh).material = magMat;
              });
            }
          }

          const t = UI_TRANSLATIONS[currentProps.language];
          _projectedVec.copy(_targetVec).project(engine.camera);
          setDragHud({
            partName: spec.name,
            status: 'magnet',
            message: t.dragReleaseToSnap(spec.name),
            x: ((_projectedVec.x + 1) / 2) * rect.width,
            y: ((-_projectedVec.y + 1) / 2) * rect.height - 46,
          });
        } else {
          const t = UI_TRANSLATIONS[currentProps.language];
          engine.draggedMesh.group.position.copy(_intersectPt);
          if (engine.draggedMesh.magnetized) {
            engine.draggedMesh.magnetized = false;
            if (silEntry) {
              const resetMat = createGuideGhostMaterial(missingDeps.length === 0 ? 'ready' : 'locked');
              silEntry.group.traverse((ch) => {
                if ((ch as THREE.Mesh).isMesh) (ch as THREE.Mesh).material = resetMat;
              });
            }
          }

          if (withinSnap && missingDeps.length > 0) {
            const firstMissingName =
              currentProps.blueprint.parts.find((p) => p.id === missingDeps[0])?.name ?? '';
            setDragHud({
              partName: spec.name,
              status: 'locked',
              message: t.dragPlaceFirst(firstMissingName),
              x: e.clientX - rect.left,
              y: e.clientY - rect.top - 48,
            });
          } else {
            setDragHud({
              partName: spec.name,
              status: 'dragging',
              message: t.dragApproachGuide(spec.name),
              x: e.clientX - rect.left,
              y: e.clientY - rect.top - 48,
            });
          }
        }
      }
    };

    const handlePointerUp = () => {
      const currentProps = propsRef.current;
      const engine = engineRef.current;
      if (!engine || !currentProps.activeDragPartId || !engine.draggedMesh) return;

      const t = UI_TRANSLATIONS[currentProps.language];
      const spec = engine.draggedMesh.spec;
      const placedSet = new Set(currentProps.placedPartIds);
      const missingDeps = spec.dependsOn.filter((d) => !placedSet.has(d));

      if (engine.draggedMesh.magnetized && missingDeps.length === 0) {
        soundEngine.playSnapSuccess(currentProps.visualStyle);
        currentProps.onPartSnapped(spec.id);
      } else if (missingDeps.length > 0) {
        const firstMissingName =
          currentProps.blueprint.parts.find((p) => p.id === missingDeps[0])?.name ?? '';
        soundEngine.playGentleBounce();
        currentProps.onPartDropRejected(
          t.dropRejectedMissingDep(firstMissingName, spec.name),
        );
      } else {
        soundEngine.playGentleBounce();
      }

      engine.controls.enabled = true;
      setDragHud(null);
      currentProps.onDragEndSignal();
    };

    // Also allow clicking directly on the target 3D silhouette when a part is staged!
    const handleCanvasClick = (e: MouseEvent) => {
      const currentProps = propsRef.current;
      const engine = engineRef.current;
      if (!engine || !currentProps.stagedPartId || currentProps.activeDragPartId) return;

      const rect = engine.renderer.domElement.getBoundingClientRect();
      _mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_mouseNDC, engine.camera);
      const silEntry = engine.silhouetteEntries.get(currentProps.stagedPartId);
      if (!silEntry) return;

      const hits = raycaster.intersectObject(silEntry.group, true);
      if (hits.length > 0) {
        const placedSet = new Set(currentProps.placedPartIds);
        const missingDeps = silEntry.spec.dependsOn.filter((d) => !placedSet.has(d));
        if (missingDeps.length === 0) {
          soundEngine.playSnapSuccess(currentProps.visualStyle);
          currentProps.onPartSnapped(silEntry.spec.id);
        } else {
          const t = UI_TRANSLATIONS[currentProps.language];
          const firstMissingName =
            currentProps.blueprint.parts.find((p) => p.id === missingDeps[0])?.name ?? '';
          soundEngine.playGentleBounce();
          currentProps.onPartDropRejected(
            t.dropRejectedMissingDep(firstMissingName, silEntry.spec.name),
          );
        }
      }
    };

    const handleCanvasPointerDown = (e: PointerEvent) => {
      const currentProps = propsRef.current;
      const engine = engineRef.current;
      if (!engine || !currentProps.stagedPartId || currentProps.activeDragPartId || !engine.draggedMesh) {
        return;
      }

      const rect = engine.renderer.domElement.getBoundingClientRect();
      _mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_mouseNDC, engine.camera);
      const hits = raycaster.intersectObject(engine.draggedMesh.group, true);
      if (hits.length > 0) {
        engine.controls.enabled = false;
        currentProps.onStartCanvasDrag(currentProps.stagedPartId);
      }
    };

    const domEl = eng.renderer.domElement;
    domEl.addEventListener('pointerdown', handleCanvasPointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('click', handleCanvasClick);

    return () => {
      domEl.removeEventListener('pointerdown', handleCanvasPointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  const t = UI_TRANSLATIONS[language];

  return (
    <div dir="ltr" className="relative w-full h-full overflow-hidden">
      {/* Isolated WebGL mount container */}
      <div ref={canvasMountRef} className="w-full h-full" />

      {/* Accessible Semantic Drag & Snap Feedback Overlay (no backdrop-blur over WebGL) */}
      {dragHud && (
        <div
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          style={{
            transform: `translate3d(${Math.max(16, dragHud.x)}px, ${Math.max(16, dragHud.y)}px, 0) translateX(-50%)`,
          }}
          className={`pointer-events-none absolute top-0 left-0 z-20 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm border transition-colors whitespace-nowrap ${
            dragHud.status === 'magnet'
              ? 'bg-emerald-600 text-white border-emerald-700'
              : dragHud.status === 'locked'
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          {dragHud.message}
        </div>
      )}

      {/* WebGL Context Lost Fallback */}
      {webglLost && (
        <div
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          className="absolute inset-0 z-30 flex items-center justify-center bg-slate-50 p-6 text-center"
        >
          <div className="max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {t.webglResetTitle}
            </h2>
            <p className="text-sm text-slate-600">{t.webglResetDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
};
