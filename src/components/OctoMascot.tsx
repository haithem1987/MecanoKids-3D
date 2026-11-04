import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OctoMascotProps {
  width?: number;
  className?: string;
}

function buildTentacle(
  i: number,
  total: number,
  waveOffset: number,
  mat: THREE.MeshStandardMaterial,
  tipMat: THREE.MeshStandardMaterial,
): THREE.Group {
  const angle = (i / total) * Math.PI * 2;
  const spread = 1.1;
  const points: THREE.Vector3[] = [
    new THREE.Vector3(Math.cos(angle) * 0.6, -0.7, Math.sin(angle) * 0.6),
    new THREE.Vector3(
      Math.cos(angle) * spread + Math.cos(angle + waveOffset) * 0.3,
      -1.2,
      Math.sin(angle) * spread + Math.sin(angle + waveOffset) * 0.3,
    ),
    new THREE.Vector3(
      Math.cos(angle) * (spread + 0.5),
      -1.8 + Math.sin(waveOffset) * 0.2,
      Math.sin(angle) * (spread + 0.5),
    ),
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 16, 0.07, 6, false);
  const tube = new THREE.Mesh(geo, mat);

  const tipGeo = new THREE.SphereGeometry(0.11, 8, 8);
  const tip = new THREE.Mesh(tipGeo, tipMat);
  const end = points[2];
  tip.position.copy(end);

  const g = new THREE.Group();
  g.add(tube);
  g.add(tip);
  return g;
}

export function OctoMascot({ width = 180, className }: OctoMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const W = width;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, W);
    el.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.5, 5);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x818cf8, 0.8);
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x6d28d9, roughness: 0.4, metalness: 0.1 });
    const tentMat = new THREE.MeshStandardMaterial({ color: 0x5b21b6, roughness: 0.5, metalness: 0.05 });
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.3 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b });
    const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });

    // Body group
    const group = new THREE.Group();

    // Tentacles (behind body — added first)
    const tentacleGroup = new THREE.Group();
    const TENTACLE_COUNT = 8;
    for (let i = 0; i < TENTACLE_COUNT; i++) {
      tentacleGroup.add(buildTentacle(i, TENTACLE_COUNT, 0, tentMat, tipMat));
    }
    group.add(tentacleGroup);

    // Body
    const bodyGeo = new THREE.SphereGeometry(1, 32, 32);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.scale.y = 0.85;
    group.add(body);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const pupilGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const shineGeo = new THREE.SphereGeometry(0.05, 8, 8);

    const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
    eyeL.position.set(-0.35, 0.18, 0.88);
    const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
    eyeR.position.set(0.35, 0.18, 0.88);

    const pupilL = new THREE.Mesh(pupilGeo, blackMat);
    pupilL.position.set(-0.35, 0.16, 1.02);
    const pupilR = new THREE.Mesh(pupilGeo, blackMat);
    pupilR.position.set(0.35, 0.16, 1.02);

    const shineL = new THREE.Mesh(shineGeo, shineMat);
    shineL.position.set(-0.28, 0.24, 1.08);
    const shineR = new THREE.Mesh(shineGeo, shineMat);
    shineR.position.set(0.42, 0.24, 1.08);

    group.add(eyeL, eyeR, pupilL, pupilR, shineL, shineR);
    scene.add(group);

    if (reduced) {
      renderer.render(scene, camera);
      return () => {
        renderer.dispose();
        el.removeChild(renderer.domElement);
      };
    }

    // Animation loop
    let animId = 0;
    let blinkTimer = 0;
    let blinkPhase = 0; // 0=idle, 1=closing, 2=opening
    let blinkT = 0;
    const BLINK_INTERVAL = 4000;
    const BLINK_DURATION = 300;

    const clock = new THREE.Clock();
    let time = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      // Body float + rotate
      group.rotation.y += 0.008;
      group.position.y = Math.sin(time * 1.5) * 0.08;

      // Tentacle wave — rebuild is expensive; rotate instead
      for (let i = 0; i < TENTACLE_COUNT; i++) {
        const t = tentacleGroup.children[i] as THREE.Group;
        t.rotation.z = Math.sin(time * 2 + i * 0.8) * 0.15;
        t.rotation.x = Math.cos(time * 1.5 + i * 0.6) * 0.08;
      }

      // Blink
      blinkTimer += delta * 1000;
      if (blinkPhase === 0 && blinkTimer > BLINK_INTERVAL) {
        blinkPhase = 1;
        blinkTimer = 0;
        blinkT = 0;
      }
      if (blinkPhase === 1) {
        blinkT += delta * 1000;
        const p = Math.min(blinkT / (BLINK_DURATION / 2), 1);
        eyeL.scale.y = 1 - 0.95 * p;
        if (blinkT >= BLINK_DURATION / 2) { blinkPhase = 2; blinkT = 0; }
      } else if (blinkPhase === 2) {
        blinkT += delta * 1000;
        const p = Math.min(blinkT / (BLINK_DURATION / 2), 1);
        eyeL.scale.y = 0.05 + 0.95 * p;
        if (blinkT >= BLINK_DURATION / 2) { blinkPhase = 0; blinkTimer = 0; eyeL.scale.y = 1; }
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      bodyGeo.dispose();
      eyeGeo.dispose();
      pupilGeo.dispose();
      shineGeo.dispose();
      [bodyMat, tentMat, tipMat, whiteMat, blackMat, shineMat].forEach(m => m.dispose());
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [width]);

  return <div ref={containerRef} style={{ width, height: width }} className={className} aria-hidden="true" />;
}
