import * as THREE from 'three';
import { observeChallenge, type ScienceTrial } from '../data/scienceChallenges';

export function buildScienceChallengeScene(trial: ScienceTrial) {
  const root = new THREE.Group();
  const targets = new Map<THREE.Object3D, number>();
  const { challenge, setting } = trial;
  const result = observeChallenge(challenge, setting);
  const slate = 0x475569, gold = 0xfbbf24, blue = 0x38bdf8;
  const part = (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, action?: number) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 0.55 }));
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    root.add(mesh);
    if (action !== undefined) targets.set(mesh, action);
    return mesh;
  };
  const box = (w: number, h: number, d: number, color: number, x: number, y: number, z: number, action?: number) =>
    part(new THREE.BoxGeometry(w, h, d), color, x, y, z, action);
  const ball = (r: number, color: number, x: number, y: number, z: number, action?: number) =>
    part(new THREE.SphereGeometry(r, 20, 14), color, x, y, z, action);
  const rod = (a: THREE.Vector3, b: THREE.Vector3, radius: number, color: number, action?: number) => {
    const delta = b.clone().sub(a);
    const center = a.clone().addScaledVector(delta, 0.5);
    const mesh = part(new THREE.CylinderGeometry(radius, radius, delta.length(), 12), color, center.x, center.y, center.z, action);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  };
  const at = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);

  if (challenge.kind === 'circuit') {
    box(3.2, 0.16, 1.86, 0x164e63, 0, 0.12, 0);
    box(0.47, 0.34, 0.61, slate, -1.14, 0.37, 0);
    const lamp = ball(0.25, result === 'on' ? gold : slate, 1.14, 0.51, 0);
    if (result === 'on') lamp.material.emissive.setHex(0xf59e0b);
    const wire = 0xd97706;
    for (const x of [-1.14, 1.14]) rod(at(x, 0.29, -0.58), at(x, 0.29, 0.58), 0.043, wire);
    rod(at(-1.14, 0.29, -0.58), at(1.14, 0.29, -0.58), 0.043, wire);
    let last = -1.14;
    for (let index = 0; index < challenge.switches; index++) {
      const x = challenge.switches === 1 ? 0 : (index - 0.5) * 0.94;
      const closed = Boolean(setting & (1 << index));
      rod(at(last, 0.29, 0.58), at(x - 0.22, 0.29, 0.58), 0.043, wire);
      box(0.63, 0.14, 0.48, closed ? 0x15803d : blue, x, 0.27, 0.58, index);
      for (const side of [-1, 1]) ball(0.077, gold, x + side * 0.22, 0.39, 0.58, index);
      rod(at(x - 0.22, 0.4, 0.58), at(x + 0.22, closed ? 0.4 : 0.68, 0.58), 0.055, gold, index);
      last = x + 0.22;
    }
    rod(at(last, 0.29, 0.58), at(1.14, 0.29, 0.58), 0.043, wire);
  } else if (challenge.kind === 'lever') {
    box(3.15, 0.15, 1.1, slate, 0, 0.12, 0);
    part(new THREE.ConeGeometry(0.32, 0.66, 4), slate, 0, 0.5, 0);
    const arm = new THREE.Group();
    root.add(arm);
    arm.position.y = 0.85;
    arm.rotation.z = result === 'movingDown' ? -0.18 : result === 'fixedDown' ? 0.18 : 0;
    arm.add(box(2.88, 0.12, 0.37, gold, 0, 0, 0));
    for (let value = 1; value <= 4; value++) {
      arm.add(box(0.24, 0.13, 0.49, value === setting ? 0x0284c7 : blue, value * 0.31, 0.065, 0, value));
    }
    arm.add(box(0.25, 0.18 * challenge.fixedMass, 0.32, slate, -challenge.fixedDistance * 0.31, 0.065 + 0.09 * challenge.fixedMass, 0));
    arm.add(box(0.25, 0.18 * challenge.movingMass, 0.32, 0x0284c7, setting * 0.31, 0.12 + 0.09 * challenge.movingMass, 0, setting));
  } else {
    const water = challenge.centre === 'O';
    const red = 0xef4444, white = 0xf8fafc;
    const y = water ? 0.75 : 1.08;
    ball(0.28, water ? red : slate, 0, 1.08, 0);
    ball(water ? 0.16 : 0.25, water ? white : red, -0.72, y, 0);
    if (setting) ball(setting === 1 ? 0.16 : 0.25, setting === 1 ? white : red, 0.72, y, 0);
    for (const z of water ? [0] : [-0.064, 0.064]) {
      rod(at(-0.72, y, z), at(0, 1.08, z), 0.044, slate);
      if (setting) rod(at(0, 1.08, z), at(0.72, y, z), 0.044, slate);
    }
    for (const [value, color] of [slate, white, red].entries()) {
      const x = (value - 1) * 0.66;
      box(0.53, 0.14, 0.5, setting === value ? gold : blue, x, 0.14, 0.79, value);
      if (value) ball(value === 1 ? 0.13 : 0.2, color, x, 0.34, 0.79, value);
    }
  }
  return { root, targets };
}
