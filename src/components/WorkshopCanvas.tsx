import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { applyLiveryToPartSpec } from '../data/liveries';
import {
  CameraPreset,
  LanguageCode,
  LiveryPresetId,
  PartAnimationKind,
  PartSpec,
  VehicleBlueprint,
  VehicleCategory,
  VisualStyleMode,
  WorkbenchEnvironmentMode,
} from '../types/game';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  createDiagnosticFaultMaterial,
  createGuideGhostMaterial,
  createRadialShadowTexture,
  createGroundTexture,
  createThematicTurntableTexture,
  createTurntableTexture,
  createXRayCutawayMaterial,
} from '../three/materials';
import { buildPartMeshGroup } from '../three/partGeometries';
import {
  buildThematicEnvironment,
  isOuterShellPartForXRay,
  ThematicSceneArtifacts,
} from '../three/thematicEnvironment';
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

const CAMERA_PRESET_VECTORS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
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
  liveryPreset: LiveryPresetId;
  environmentMode: WorkbenchEnvironmentMode;
  xRayMode: boolean;
  testDriveActive: boolean;
  noSilhouetteMode: boolean;
  faultyPartIds: string[];
  onExtractFaultyPart?: (partId: string) => void;
  onRegisterSnapshotCapture?: (fn: (() => string | null) | null) => void;
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
  workshopTheme?: import('../types/game').WorkshopThemeConfig;
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
  liveryPreset,
  environmentMode,
  xRayMode,
  testDriveActive,
  noSilhouetteMode,
  faultyPartIds,
  onExtractFaultyPart,
  onRegisterSnapshotCapture,
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
  workshopTheme,
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
    liveryPreset,
    environmentMode,
    xRayMode,
    testDriveActive,
    noSilhouetteMode,
    faultyPartIds,
    onExtractFaultyPart,
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
      liveryPreset,
      environmentMode,
      xRayMode,
      testDriveActive,
      noSilhouetteMode,
      faultyPartIds,
      onExtractFaultyPart,
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
    liveryPreset,
    environmentMode,
    xRayMode,
    testDriveActive,
    noSilhouetteMode,
    faultyPartIds,
    onExtractFaultyPart,
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
    baseRimMesh: THREE.Mesh;
    hemiLight: THREE.HemisphereLight;
    studioFloorMesh: THREE.Mesh;
    thematicContainer: THREE.Group;
    thematicArtifacts: ThematicSceneArtifacts | null;
    assembledGroup: THREE.Group;
    faultyGroup: THREE.Group;
    silhouettesGroup: THREE.Group;
    dragContainer: THREE.Group;
    sparksMesh: THREE.InstancedMesh;
    sparks: SparkParticle[];
    placedPartEntries: Map<string, { group: THREE.Group; spec: PartSpec; popScale: number }>;
    faultyPartEntries: Map<string, { group: THREE.Group; spec: PartSpec; baseY: number }>;
    silhouetteEntries: Map<string, { group: THREE.Group; spec: PartSpec; stateKey: string }>;
    draggedMesh: { partId: string; group: THREE.Group; spec: PartSpec; magnetized: boolean } | null;
    anchorIndicator: THREE.Mesh | null;
    cameraTransition: { active: boolean; pos: THREE.Vector3; target: THREE.Vector3 };
    isSoftwareGl: boolean;
    reducedMotion: boolean;
    maxAnisotropy: number;
    triggerSparks: (origin: [number, number, number]) => void;
    wakeRender: () => void;
  } | null>(null);

  // 1. Initialize WebGLRenderer & Studio Scene ONCE
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // M5: detect software renderer AND weak real GPUs (Intel HD < 4000, Adreno < 500, Mali < G57)
    const { isSoftwareGl, isWeakGpu } = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl') as WebGLRenderingContext | null;
      if (!gl) return { isSoftwareGl: true, isWeakGpu: true };
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : (gl as WebGLRenderingContext).RENDERER;
      const gpu = String(gl.getParameter(param));
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
      const soft = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      const weak = soft ||
        /Intel.*HD.*(2[0-9]{3}|3[0-9]{3})\b/i.test(gpu) ||     // Intel HD 2000-3999
        /Adreno\s*(3[0-9]{2}|4[0-9]{2})\b/i.test(gpu) ||        // Adreno 300-499
        /Mali-T/i.test(gpu) ||                                    // Mali-T series (all old)
        /Mali-G[1-4][0-9]\b/i.test(gpu) ||                       // Mali-G10 – G49
        /Mali-G5[0-6]\b/i.test(gpu);                              // Mali-G50 – G56 (G57 is boundary)
      return { isSoftwareGl: soft, isWeakGpu: weak };
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isWeakGpu ? 1.5 : 2));
    renderer.shadowMap.enabled = !isWeakGpu;
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
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    controls.enableDamping = !isSoftwareGl && !reducedMotion;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.6;
    controls.maxDistance = 12.5;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.target.set(0, 0.9, 0);
    controls.update();

    // 3-Point Warm/Cool Studio Rig
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xcbd5e1, 0.95);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.75);
    keyLight.position.set(5.5, 8.5, 6.0);
    keyLight.castShadow = !isWeakGpu;
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

    const thematicContainer = new THREE.Group();
    const assembledGroup = new THREE.Group();
    const faultyGroup = new THREE.Group();
    const silhouettesGroup = new THREE.Group();
    turntableGroup.add(thematicContainer);
    turntableGroup.add(assembledGroup);
    turntableGroup.add(faultyGroup);
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
      baseRimMesh: baseRim,
      hemiLight,
      studioFloorMesh: studioFloor,
      thematicContainer,
      thematicArtifacts: null,
      assembledGroup,
      faultyGroup,
      silhouettesGroup,
      dragContainer,
      sparksMesh,
      sparks,
      placedPartEntries: new Map(),
      faultyPartEntries: new Map(),
      silhouetteEntries: new Map(),
      draggedMesh: null,
      anchorIndicator: null,
      cameraTransition,
      isSoftwareGl,
      reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
      maxAnisotropy,
      triggerSparks,
      wakeRender: () => { /* assigned below */ },
    };

    // Expose synchronous WebGL capture callback (must call renderer.render right before toDataURL!)
    if (onRegisterSnapshotCapture) {
      onRegisterSnapshotCapture(() => {
        const engNow = engineRef.current;
        if (!engNow) return null;
        try {
          engNow.renderer.render(engNow.scene, engNow.camera);
          return engNow.renderer.domElement.toDataURL('image/png');
        } catch {
          return null;
        }
      });
    }

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
      wakeRender();
    });
    resizeObserver.observe(container);

    // M5: render-on-demand — only call render() when scene has moved
    let needsRender = true;
    let idleSince = -1;
    let loopRunning = true;

    function wakeRender() {
      needsRender = true;
      idleSince = -1;
      if (!loopRunning && !unmounted) {
        loopRunning = true;
        frameId = requestAnimationFrame(tick);
      }
    }

    controls.addEventListener('change', wakeRender);
    if (engineRef.current) engineRef.current.wakeRender = wakeRender;

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
      let hasContinuousAnim = false;

      if (eng) {
        // Smooth camera preset interpolation (instant if prefers-reduced-motion)
        if (eng.cameraTransition.active) {
          const factor = eng.reducedMotion ? 1 : 1 - Math.exp(-6.5 * dt);
          eng.camera.position.lerp(eng.cameraTransition.pos, factor);
          eng.controls.target.lerp(eng.cameraTransition.target, factor);
          if (eng.reducedMotion || eng.camera.position.distanceTo(eng.cameraTransition.pos) < 0.03) {
            eng.cameraTransition.active = false;
          }
        }
        eng.controls.update();

        const isCompleted =
          currentProps.placedPartIds.length === currentProps.blueprint.parts.length &&
          currentProps.blueprint.parts.length > 0 &&
          currentProps.faultyPartIds.length === 0;

        const isTestDrive = isCompleted && currentProps.testDriveActive && !eng.draggedMesh;

        if (eng.thematicArtifacts) {
          eng.thematicArtifacts.testDriveFxGroup.visible = isTestDrive;
        }

        if (isTestDrive) {
          // Axe 1.1: Dynamic 3D Test Drive choreography per mechanical family!
          eng.turntableGroup.rotation.y += dt * 0.24;
          const cat = currentProps.blueprint.category;

          if (cat === VehicleCategory.CAR || cat === VehicleCategory.CONSTRUCTION) {
            // Road / track sprint: high-frequency suspension micro-bounce & slight forward pitch
            eng.assembledGroup.position.y = 0.015 + Math.abs(Math.sin(elapsed * 18.0)) * 0.016;
            eng.assembledGroup.rotation.x = Math.sin(elapsed * 9.0) * 0.015 - 0.02;
            eng.assembledGroup.rotation.z = Math.sin(elapsed * 4.5) * 0.018;
          } else if (cat === VehicleCategory.BOAT) {
            // Oceanic swell: pitching & rolling across 3D waves
            eng.assembledGroup.position.y = 0.055 + Math.sin(elapsed * 2.8) * 0.055;
            eng.assembledGroup.rotation.x = Math.sin(elapsed * 2.3) * 0.068;
            eng.assembledGroup.rotation.z = Math.cos(elapsed * 1.9) * 0.058;
          } else if (cat === VehicleCategory.PLANE) {
            // Banked hover flight & climb
            eng.assembledGroup.position.y = 0.32 + Math.sin(elapsed * 2.4) * 0.075;
            eng.assembledGroup.rotation.x = -0.055 + Math.sin(elapsed * 1.8) * 0.035;
            eng.assembledGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.11;
          } else {
            // SPACE: Orbital liftoff hover above plasma plume!
            eng.assembledGroup.position.y = 0.44 + Math.sin(elapsed * 3.2) * 0.06;
            eng.assembledGroup.rotation.x = Math.sin(elapsed * 2.1) * 0.025;
            eng.assembledGroup.rotation.z = Math.cos(elapsed * 1.7) * 0.028;
          }

          // Animate dynamic Test-Drive FX meshes (zero GC)
          if (eng.thematicArtifacts) {
            const fx = eng.thematicArtifacts.animatedMeshes;
            for (let i = 0; i < fx.roadStripes.length; i++) {
              const dash = fx.roadStripes[i];
              const baseZ = (dash.userData.baseZ as number) ?? 0;
              const scrolled = ((baseZ - elapsed * 4.2 + 2.2) % 4.4 + 4.4) % 4.4 - 2.2;
              dash.position.z = scrolled;
            }
            for (let i = 0; i < fx.waterRings.length; i++) {
              const ring = fx.waterRings[i];
              const phase = (ring.userData.phase as number) ?? 0;
              const pulse = 1 + Math.sin(elapsed * 3.4 + phase) * 0.09;
              ring.scale.set(pulse, pulse, 1);
            }
            for (let i = 0; i < fx.thrusterFlames.length; i++) {
              const flame = fx.thrusterFlames[i];
              const flicker = 0.86 + Math.sin(elapsed * 32.0 + i * 2.1) * 0.18;
              flame.scale.set(1, flicker, 1);
            }
          }
        } else if (isCompleted && !eng.draggedMesh) {
          // Gentle showcase rotation when completed (idle)
          eng.turntableGroup.rotation.y += dt * 0.42;
          eng.assembledGroup.rotation.x = THREE.MathUtils.damp(eng.assembledGroup.rotation.x, 0, 8, dt);
          if (currentProps.blueprint.category === VehicleCategory.BOAT) {
            eng.assembledGroup.position.y = Math.sin(elapsed * 2.4) * 0.04;
            eng.assembledGroup.rotation.z = Math.sin(elapsed * 1.8) * 0.035;
          } else if (currentProps.blueprint.category === VehicleCategory.PLANE) {
            eng.assembledGroup.position.y = 0.08 + Math.sin(elapsed * 2.6) * 0.05;
            eng.assembledGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.03;
          } else if (currentProps.blueprint.category === VehicleCategory.SPACE) {
            eng.assembledGroup.position.y = 0.09 + Math.sin(elapsed * 1.9) * 0.055;
            eng.assembledGroup.rotation.z = Math.sin(elapsed * 1.2) * 0.025;
          } else {
            eng.assembledGroup.position.y = THREE.MathUtils.damp(eng.assembledGroup.position.y, 0, 8, dt);
            eng.assembledGroup.rotation.z = THREE.MathUtils.damp(eng.assembledGroup.rotation.z, 0, 8, dt);
          }
        } else {
          // Smoothly align turntable back to 0 during active assembly or Diagnostic repair
          eng.turntableGroup.rotation.y = THREE.MathUtils.damp(eng.turntableGroup.rotation.y, 0, 7, dt);
          eng.assembledGroup.position.y = THREE.MathUtils.damp(eng.assembledGroup.position.y, 0, 8, dt);
          eng.assembledGroup.rotation.x = THREE.MathUtils.damp(eng.assembledGroup.rotation.x, 0, 8, dt);
          eng.assembledGroup.rotation.z = THREE.MathUtils.damp(eng.assembledGroup.rotation.z, 0, 8, dt);
        }

        // Update placed parts (spring pop + exploded view damping + mechanical animation)
        const exp = currentProps.explodedFactor;
        const speedBoost = isTestDrive ? 2.65 : 1.0;

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
              group.rotation.x += dt * 7.5 * speedBoost;
            } else if (spec.animation === PartAnimationKind.SPIN_Y) {
              group.rotation.y += dt * 9.5 * speedBoost;
            } else if (spec.animation === PartAnimationKind.SPIN_Z) {
              group.rotation.z += dt * 13.0 * speedBoost;
            } else if (spec.animation === PartAnimationKind.SWAY_Y) {
              group.rotation.y = Math.sin(elapsed * (isTestDrive ? 3.8 : 2.0)) * (isTestDrive ? 0.34 : 0.22);
            }
          } else if (isTestDrive && spec.id.includes('axle')) {
            group.rotation.x += dt * 11.0;
          }
        });

        // Subtle looseness oscillation on Diagnostic faulty parts so they look mechanically unfastened
        eng.faultyPartEntries.forEach((entry) => {
          entry.group.position.y = entry.baseY + Math.sin(elapsed * 4.2) * 0.025;
        });

        // Gentle hover float on staged (clicked) part when not actively pointer-dragging
        if (eng.draggedMesh && !currentProps.activeDragPartId && currentProps.stagedPartId) {
          eng.draggedMesh.group.position.y = 1.65 + Math.sin(elapsed * 3.0) * 0.06;
          eng.draggedMesh.group.rotation.y = Math.sin(elapsed * 1.4) * 0.25;
        }

        // Pulsing anchor ring
        if (eng.anchorIndicator) {
          const pulse = 0.85 + Math.sin(elapsed * 4.0) * 0.15;
          eng.anchorIndicator.scale.setScalar(pulse);
          (eng.anchorIndicator.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(elapsed * 4.0) * 0.2;
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

        // M5: compute whether any continuous animation is running (must render every frame)
        const hasActiveSparks = eng.sparks.some((s) => s.active);
        hasContinuousAnim =
          isTestDrive ||
          (isCompleted && !eng.draggedMesh) ||
          (eng.draggedMesh !== null && currentProps.stagedPartId !== null && currentProps.activeDragPartId === null) ||
          eng.cameraTransition.active ||
          eng.anchorIndicator !== null ||
          eng.faultyPartEntries.size > 0 ||
          hasActiveSparks;
      }

      // M5: render only when needed; stop loop after 500ms of inactivity

      if (hasContinuousAnim || needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
        if (!hasContinuousAnim) {
          if (idleSince < 0) idleSince = performance.now();
        } else {
          idleSince = -1;
        }
      } else {
        if (idleSince < 0) idleSince = performance.now();
      }

      const shouldStop = !hasContinuousAnim && !needsRender && idleSince > 0 && performance.now() - idleSince > 500;
      if (shouldStop) {
        loopRunning = false;
        return;
      }

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      unmounted = true;
      if (onRegisterSnapshotCapture) {
        onRegisterSnapshotCapture(null);
      }
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
  }, [onRegisterSnapshotCapture]);

  // 2. Camera Preset Transitions
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;
    const preset = CAMERA_PRESET_VECTORS[cameraPreset];
    eng.cameraTransition.pos.set(preset.pos[0], preset.pos[1], preset.pos[2]);
    eng.cameraTransition.target.set(preset.target[0], preset.target[1], preset.target[2]);
    eng.cameraTransition.active = true;
  }, [cameraPreset, cameraPresetNonce]);

  // 2a-bis. Auto-orient toward the staged part's anchor (guided mode only, no active drag)
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng || activeDragPartId) return;
    if (!stagedPartId) return;
    const spec = blueprint.parts.find((p) => p.id === stagedPartId);
    if (!spec) return;
    // Pan the orbit target toward the anchor; keep camera position (just reorient the pivot)
    eng.cameraTransition.target.set(spec.targetPos[0], spec.targetPos[1], spec.targetPos[2]);
    eng.cameraTransition.pos.copy(eng.camera.position);
    eng.cameraTransition.active = true;
  }, [stagedPartId, activeDragPartId, blueprint.parts]);

  // 2b. Rebuild Thematic Turntable Surface, Perimeter Props & Test-Drive FX when Category, Environment Mode, or Visual Style changes
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const topMat = eng.turntableTopMesh.material as THREE.MeshStandardMaterial;
    topMat.map =
      environmentMode === 'auto_thematic'
        ? createThematicTurntableTexture(blueprint.category, eng.maxAnisotropy)
        : createTurntableTexture(visualStyle, eng.maxAnisotropy);
    topMat.needsUpdate = true;

    disposeObject3D(eng.thematicContainer);
    eng.thematicContainer.clear();

    const artifacts = buildThematicEnvironment(
      blueprint.category,
      environmentMode === 'auto_thematic',
    );
    artifacts.testDriveFxGroup.visible = false;
    eng.thematicContainer.add(artifacts.propsGroup);
    eng.thematicContainer.add(artifacts.testDriveFxGroup);
    eng.thematicArtifacts = artifacts;
    eng.wakeRender();
  }, [blueprint.category, environmentMode, visualStyle]);

  // 2c. Apply workshop ground theme when workshopTheme changes
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng || !workshopTheme) return;

    const { groundPreset } = workshopTheme;
    const floorMat = eng.studioFloorMesh.material as THREE.MeshStandardMaterial;
    const groundTex = createGroundTexture(groundPreset, eng.maxAnisotropy);
    floorMat.map = groundTex;
    floorMat.needsUpdate = true;

    // Adjust rim and scene bg to match ground preset
    const rimMat = eng.baseRimMesh.material as THREE.MeshStandardMaterial;
    if (groundPreset === 'circuit') {
      rimMat.color.setHex(0x001a2e);
      eng.hemiLight.color.setHex(0x001a2e);
    } else if (groundPreset === 'moon') {
      rimMat.color.setHex(0x1a1a22);
      eng.hemiLight.color.setHex(0x9090c0);
    } else if (groundPreset === 'grass') {
      rimMat.color.setHex(0x2d5a27);
      eng.hemiLight.color.setHex(0xe0f2e0);
    } else if (groundPreset === 'water') {
      rimMat.color.setHex(0x0d4d6b);
      eng.hemiLight.color.setHex(0xd0eeff);
    } else if (groundPreset === 'snow') {
      rimMat.color.setHex(0x8899aa);
      eng.hemiLight.color.setHex(0xeef4fb);
    } else {
      rimMat.color.setHex(0x334155);
      eng.hemiLight.color.setHex(0xe0f2fe);
    }
    rimMat.needsUpdate = true;
    eng.wakeRender();
  }, [workshopTheme]);

  // 3. Rebuild Placed, Diagnostic Faulty & Silhouette Meshes when Blueprint, Style, Livery, X-Ray, No-Silhouette, Placed/Faulty Parts, or Hint change
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    // Rebuild Placed Meshes cleanly (preserving pop animation for newly snapped part)
    const prevIds = new Set(eng.placedPartEntries.keys());
    disposeObject3D(eng.assembledGroup);
    eng.assembledGroup.clear();
    eng.placedPartEntries.clear();

    const placedSet = new Set(placedPartIds);
    const faultySet = new Set(faultyPartIds);

    for (const rawSpec of blueprint.parts) {
      if (placedSet.has(rawSpec.id)) {
        const tintedSpec = applyLiveryToPartSpec(rawSpec, liveryPreset);
        const isCutawayShell =
          xRayMode && isOuterShellPartForXRay(tintedSpec, blueprint.parts);
        const cutawayOverride = isCutawayShell
          ? createXRayCutawayMaterial(tintedSpec.primaryColor)
          : undefined;

        const meshGroup = buildPartMeshGroup(
          tintedSpec,
          visualStyle,
          eng.isSoftwareGl,
          eng.maxAnisotropy,
          cutawayOverride,
        );
        if (isCutawayShell) {
          meshGroup.traverse((ch) => {
            if ((ch as THREE.Mesh).isMesh) {
              ch.renderOrder = 3;
            }
          });
        }

        const isNewlyAdded =
          !prevIds.has(rawSpec.id) &&
          placedPartIds[placedPartIds.length - 1] === rawSpec.id;
        meshGroup.position.set(
          rawSpec.targetPos[0] + rawSpec.explodeOffset[0] * explodedFactor,
          rawSpec.targetPos[1] + rawSpec.explodeOffset[1] * explodedFactor,
          rawSpec.targetPos[2] + rawSpec.explodeOffset[2] * explodedFactor,
        );
        const startScale = isNewlyAdded ? 1.2 : 1.0;
        meshGroup.scale.setScalar(startScale);
        eng.assembledGroup.add(meshGroup);
        eng.placedPartEntries.set(rawSpec.id, {
          group: meshGroup,
          spec: tintedSpec,
          popScale: startScale,
        });

        if (isNewlyAdded) {
          eng.triggerSparks(rawSpec.targetPos);
        }
      }
    }

    // Rebuild Faulty / Misaligned Parts for Diagnostic & Repair Mode
    disposeObject3D(eng.faultyGroup);
    eng.faultyGroup.clear();
    eng.faultyPartEntries.clear();

    for (let idx = 0; idx < blueprint.parts.length; idx++) {
      const partSpec = blueprint.parts[idx];
      if (!faultySet.has(partSpec.id) || placedSet.has(partSpec.id)) continue;

      const faultMat = createDiagnosticFaultMaterial();
      const faultMeshGroup = buildPartMeshGroup(
        partSpec,
        visualStyle,
        eng.isSoftwareGl,
        eng.maxAnisotropy,
        faultMat,
      );
      const sideSign = idx % 2 === 0 ? 1 : -1;
      const baseY = partSpec.targetPos[1] + 0.16;
      faultMeshGroup.position.set(
        partSpec.targetPos[0] + sideSign * 0.14,
        baseY,
        partSpec.targetPos[2] + 0.08,
      );
      faultMeshGroup.rotation.set(0.18 * sideSign, 0.24, -0.2 * sideSign);
      faultMeshGroup.userData = { faultyPartId: partSpec.id };
      eng.faultyGroup.add(faultMeshGroup);
      eng.faultyPartEntries.set(partSpec.id, {
        group: faultMeshGroup,
        spec: partSpec,
        baseY,
      });
    }

    // Rebuild Guide Silhouettes for Remaining Parts
    disposeObject3D(eng.silhouettesGroup);
    eng.silhouettesGroup.clear();
    eng.silhouetteEntries.clear();

    for (const partSpec of blueprint.parts) {
      // Do not show a blue guide silhouette on a slot currently occupied by a faulty orange part
      if (placedSet.has(partSpec.id) || faultySet.has(partSpec.id)) continue;

      const depsMet = partSpec.dependsOn.every((depId) => placedSet.has(depId));
      const isHinted = hintPartId === partSpec.id;
      const isFocusedPart =
        isHinted ||
        activeDragPartId === partSpec.id ||
        stagedPartId === partSpec.id;

      // Axe 3.1: Master Silhouette-Free Mode ("Mode Maître Sans Silhouette")
      // Hides all guide silhouettes unless explicitly hinted via Mechanical Guide (or turned visible during close-range magnetic snap)
      if (!noSilhouetteMode) {
        if ((blueprint.tier === 3 || blueprint.tier === 4) && !depsMet && !isFocusedPart) {
          continue;
        }
        if (blueprint.tier >= 5 && !isFocusedPart && !(placedSet.size === 0 && depsMet)) {
          continue;
        }
      }

      const stateKey: 'ready' | 'locked' | 'hint' =
        isHinted || (!noSilhouetteMode && stagedPartId === partSpec.id)
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
      // In Master No-Silhouette Mode, keep silhouette invisible until close-range magnet snap (or explicit hint)
      ghostGroup.visible = !noSilhouetteMode || isHinted;
      ghostGroup.userData = { silhouettePartId: partSpec.id, depsMet };
      eng.silhouettesGroup.add(ghostGroup);
      eng.silhouetteEntries.set(partSpec.id, {
        group: ghostGroup,
        spec: partSpec,
        stateKey,
      });
    }
    eng.wakeRender();
  }, [
    blueprint,
    placedPartIds,
    faultyPartIds,
    visualStyle,
    liveryPreset,
    xRayMode,
    noSilhouetteMode,
    hintPartId,
    stagedPartId,
    activeDragPartId,
  ]);

  // 4. Manage Staged / Dragged Floating 3D Part & Pointer Projection
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const activeId = activeDragPartId || stagedPartId;

    // Clear existing floating part + anchor indicator
    if (eng.draggedMesh) {
      disposeObject3D(eng.draggedMesh.group);
      eng.dragContainer.clear();
      eng.draggedMesh = null;
    }
    if (eng.anchorIndicator) {
      disposeObject3D(eng.anchorIndicator);
      eng.scene.remove(eng.anchorIndicator);
      eng.anchorIndicator = null;
    }

    if (!activeId) {
      eng.controls.enabled = true;
      setDragHud(null);
      return;
    }

    const rawSpec = blueprint.parts.find((p) => p.id === activeId);
    if (!rawSpec) return;

    const tintedSpec = applyLiveryToPartSpec(rawSpec, liveryPreset);

    const dragGroup = buildPartMeshGroup(
      tintedSpec,
      visualStyle,
      eng.isSoftwareGl,
      eng.maxAnisotropy,
    );
    // Initial staging position slightly elevated above front of turntable
    dragGroup.position.set(-1.55, 1.65, 1.45);
    eng.dragContainer.add(dragGroup);
    eng.draggedMesh = {
      partId: rawSpec.id,
      group: dragGroup,
      spec: tintedSpec,
      magnetized: false,
    };

    // Anchor ring at target position
    if (rawSpec) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(rawSpec.snapRadius * 0.75, 0.04, 8, 32),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55, depthWrite: false }),
      );
      ring.position.set(rawSpec.targetPos[0], rawSpec.targetPos[1], rawSpec.targetPos[2]);
      ring.rotation.x = Math.PI / 2;
      eng.scene.add(ring);
      eng.anchorIndicator = ring;
    }

    if (activeDragPartId) {
      eng.controls.enabled = false;
    }
    eng.wakeRender();
  }, [activeDragPartId, stagedPartId, blueprint, visualStyle, liveryPreset]);

  // 5. Global Pointer Drag, Diagnostic Click-to-Extract & Click-to-Snap Handlers
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
        const occupiedByFaulty = currentProps.faultyPartIds.includes(spec.id);
        const missingDeps = spec.dependsOn.filter((d) => !placedSet.has(d));
        const dist = _intersectPt.distanceTo(_targetVec);
        const withinSnap = dist <= spec.snapRadius;

        const silEntry = engine.silhouetteEntries.get(spec.id);

        if (withinSnap && missingDeps.length === 0 && !occupiedByFaulty) {
          // Magnetic pull into exact target position!
          engine.draggedMesh.group.position.lerp(_targetVec, 0.58);
          if (!engine.draggedMesh.magnetized) {
            engine.draggedMesh.magnetized = true;
            navigator.vibrate?.(50);
            soundEngine.playMagnetHover();
            if (silEntry) {
              silEntry.group.visible = true;
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
              silEntry.group.visible =
                !currentProps.noSilhouetteMode || currentProps.hintPartId === spec.id;
              const resetMat = createGuideGhostMaterial(missingDeps.length === 0 ? 'ready' : 'locked');
              silEntry.group.traverse((ch) => {
                if ((ch as THREE.Mesh).isMesh) (ch as THREE.Mesh).material = resetMat;
              });
            }
          }

          if (withinSnap && occupiedByFaulty) {
            setDragHud({
              partName: spec.name,
              status: 'locked',
              message: t.diagnosticClickFaultyHint(spec.name),
              x: e.clientX - rect.left,
              y: e.clientY - rect.top - 48,
            });
          } else if (withinSnap && missingDeps.length > 0) {
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
      const occupiedByFaulty = currentProps.faultyPartIds.includes(spec.id);
      const missingDeps = spec.dependsOn.filter((d) => !placedSet.has(d));

      if (engine.draggedMesh.magnetized && missingDeps.length === 0 && !occupiedByFaulty) {
        navigator.vibrate?.(80);
        soundEngine.playSnapSuccess(currentProps.visualStyle);
        currentProps.onPartSnapped(spec.id);
      } else if (occupiedByFaulty) {
        soundEngine.playGentleBounce();
        currentProps.onPartDropRejected(t.diagnosticClickFaultyHint(spec.name));
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

    // Click handler: supports Diagnostic faulty part extraction AND click-to-snap on target silhouette!
    const handleCanvasClick = (e: MouseEvent) => {
      const currentProps = propsRef.current;
      const engine = engineRef.current;
      if (!engine || currentProps.activeDragPartId) return;

      const rect = engine.renderer.domElement.getBoundingClientRect();
      _mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_mouseNDC, engine.camera);

      // 1. Check if clicking a faulty/misaligned orange part in Diagnostic & Repair Mode
      if (currentProps.faultyPartIds.length > 0 && currentProps.onExtractFaultyPart) {
        for (const [fId, fEntry] of engine.faultyPartEntries.entries()) {
          const fHits = raycaster.intersectObject(fEntry.group, true);
          if (fHits.length > 0) {
            soundEngine.playDiagnosticExtract();
            engine.triggerSparks(fEntry.spec.targetPos);
            currentProps.onExtractFaultyPart(fId);
            return;
          }
        }
      }

      // 2. Check if clicking target silhouette when a part is staged (and silhouettes are allowed)
      if (!currentProps.stagedPartId || currentProps.noSilhouetteMode) return;

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
      if (
        !engine ||
        !currentProps.stagedPartId ||
        currentProps.activeDragPartId ||
        !engine.draggedMesh
      ) {
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
      {/* touch-action:none prevents browser scroll/zoom from stealing pointer events during part drag */}
      <div ref={canvasMountRef} className="w-full h-full" style={{ touchAction: 'none' }} />

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
          {dragHud.status === 'magnet' ? '✓ ' : dragHud.status === 'locked' ? '⚠ ' : ''}{dragHud.message}
        </div>
      )}

      {/* Floating Recenter button — always visible, bottom-right of canvas */}
      <button
        type="button"
        aria-label={t.recenterBtn}
        title={t.recenterBtn}
        onClick={() => {
          const eng = engineRef.current;
          if (!eng) return;
          const preset = CAMERA_PRESET_VECTORS[cameraPreset];
          eng.cameraTransition.pos.set(preset.pos[0], preset.pos[1], preset.pos[2]);
          eng.cameraTransition.target.set(preset.target[0], preset.target[1], preset.target[2]);
          eng.cameraTransition.active = true;
        }}
        className="pointer-events-auto absolute bottom-4 end-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-slate-200 shadow text-slate-600 hover:text-slate-900 transition-colors text-base select-none"
      >
        ⌖
      </button>

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
