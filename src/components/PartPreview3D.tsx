import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildPartMeshGroup } from '../three/partGeometries';
import { PartSpec, VisualStyleMode } from '../types/game';

/** Returns true on low-end hardware where WebGL preview should be skipped. */
export function isLowEndDevice(
  concurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 4,
  dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 2,
): boolean {
  return concurrency <= 2 || dpr <= 1;
}

interface PartPreview3DProps {
  part: PartSpec | null;
  size?: number;
}

export const PartPreview3D: React.FC<PartPreview3DProps> = ({ part, size = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    meshGroup: THREE.Group | null;
    animId: number;
    isDragging: boolean;
    lastPointer: { x: number; y: number };
    rotY: number;
    rotX: number;
  } | null>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Init renderer once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 0, 0);

    stateRef.current = {
      renderer,
      scene,
      camera,
      meshGroup: null,
      animId: 0,
      isDragging: false,
      lastPointer: { x: 0, y: 0 },
      rotY: 0,
      rotX: 0.15,
    };

    const animate = () => {
      const s = stateRef.current;
      if (!s) return;
      s.animId = requestAnimationFrame(animate);
      if (s.meshGroup && !prefersReducedMotion && !s.isDragging) {
        s.rotY += 0.012;
      }
      if (s.meshGroup) {
        s.meshGroup.rotation.y = s.rotY;
        s.meshGroup.rotation.x = s.rotX;
      }
      s.renderer.render(s.scene, s.camera);
    };
    animate();

    return () => {
      const s = stateRef.current;
      if (!s) return;
      cancelAnimationFrame(s.animId);
      s.meshGroup?.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      s.renderer.dispose();
      stateRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap mesh when part changes
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;

    // Dispose previous mesh
    if (s.meshGroup) {
      s.scene.remove(s.meshGroup);
      s.meshGroup.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      s.meshGroup = null;
    }

    if (!part) return;

    const group = buildPartMeshGroup(part, VisualStyleMode.REALISTIC, false, 4);
    // Normalize scale to fit the preview viewport
    const box = new THREE.Box3().setFromObject(group);
    const span = new THREE.Vector3();
    box.getSize(span);
    const maxSpan = Math.max(span.x, span.y, span.z);
    if (maxSpan > 0) group.scale.setScalar(1.8 / maxSpan);
    // Center vertically
    const center = new THREE.Vector3();
    box.getCenter(center);
    group.position.sub(center.multiplyScalar(1.8 / maxSpan));

    s.scene.add(group);
    s.meshGroup = group;
    s.rotY = 0;
    s.rotX = 0.15;
  }, [part]);

  // Pointer drag handlers for manual rotation
  const onPointerDown = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s) return;
    s.isDragging = true;
    s.lastPointer = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s || !s.isDragging) return;
    const dx = e.clientX - s.lastPointer.x;
    const dy = e.clientY - s.lastPointer.y;
    s.rotY += dx * 0.015;
    s.rotX += dy * 0.015;
    s.lastPointer = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => {
    const s = stateRef.current;
    if (s) s.isDragging = false;
  };

  if (!part) return null;

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size, touchAction: 'none', cursor: 'grab', display: 'block' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-label={part.name}
    />
  );
};
