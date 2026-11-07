import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { PartShapeKind, VisualStyleMode, type PartSpec } from '../types/game';
import { buildPartMeshGroup } from './partGeometries';

function withPartMeshes<T>(parts: PartSpec[], test: (meshes: THREE.Mesh[][]) => T): T {
  const groups = parts.map((part) => {
    const group = buildPartMeshGroup({ ...part, isRarePart: false }, VisualStyleMode.BLOCKS, true, 1);
    group.position.fromArray(part.targetPos);
    group.updateMatrixWorld(true);
    const meshes: THREE.Mesh[] = [];
    group.traverse((child) => { if (child instanceof THREE.Mesh) meshes.push(child); });
    return meshes;
  });
  try {
    return test(groups);
  } finally {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    for (const mesh of groups.flat()) {
      geometries.add(mesh.geometry);
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) materials.add(material);
    }
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
  }
}

function axisGap(first: THREE.Mesh, second: THREE.Mesh, axis: 'x' | 'y' | 'z'): number {
  const a = new THREE.Box3().setFromObject(first, true);
  const b = new THREE.Box3().setFromObject(second, true);
  return Math.max(0, b.min[axis] - a.max[axis], a.min[axis] - b.max[axis]);
}

const attachments = VEHICLE_BLUEPRINTS.flatMap((model) => model.parts.flatMap((part) => {
  if (!['high-gain-dish', 'top-radar', 'stern-solar', 'main-thrusters', 'propeller'].includes(part.id)
    && !(model.id === 'crane-tower' && part.id === 'hook')) return [];
  const support = model.parts.find((candidate) => candidate.id === part.dependsOn[0]);
  if (!support || (part.id === 'propeller' && ![PartShapeKind.PLANE_FUSELAGE, PartShapeKind.RADIAL_ENGINE].includes(support.shape))) return [];
  return [{ model: model.id, part, support }];
}));

describe('raccords mécaniques des pièces montées', () => {
  it.each(attachments)('$model : $part.id rejoint $support.id au niveau des maillages', ({ part, support }) => {
    withPartMeshes([part, support], ([partMeshes, supportMeshes]) => {
      // Use the actual mount on each attachment, excluding propeller blades and outer panels.
      const mount = partMeshes[0];
      const candidateSupports = part.id === 'propeller'
        ? [support.shape === PartShapeKind.PLANE_FUSELAGE ? supportMeshes[2] : supportMeshes[0]]
        : part.id === 'top-radar' || part.id === 'main-thrusters' ? [supportMeshes[0]] : supportMeshes;
      const distance = Math.min(...candidateSupports.map((mesh) => Math.hypot(
        axisGap(mount, mesh, 'x'), axisGap(mount, mesh, 'y'), axisGap(mount, mesh, 'z'),
      )));
      expect(distance).toBeLessThan(0.012);

      // Cast through the mounting axis so overlapping outer bounds cannot hide a gap.
      const axis = part.id === 'propeller' || part.id === 'main-thrusters' ? 'z' : 'y';
      const approach = part.id === 'main-thrusters' ? 1 : -1;
      const origin = new THREE.Vector3(...part.targetPos);
      origin[axis] -= 0.8 * approach;
      const direction = new THREE.Vector3();
      direction[axis] = approach;
      const mountBounds = new THREE.Box3().setFromObject(mount, true);
      const mountingFace = approach < 0 ? mountBounds.min[axis] : mountBounds.max[axis];
      const surface = new THREE.Raycaster(origin, direction).intersectObjects(candidateSupports, false)[0];
      expect(surface, 'surface au centre du point de fixation').toBeDefined();
      const gap = (surface.point[axis] - mountingFace) * approach;
      expect(gap).toBeLessThan(0.018);
      // The wide nozzle plate seats inside the rounded tail. Check the exposed
      // bell separately, since the tail tip protrudes past the plate rim.
      expect(gap).toBeGreaterThan(part.id === 'main-thrusters' ? -0.15 : -0.08);

      if (part.id === 'main-thrusters') {
        const bell = partMeshes[1];
        const exhaust = new THREE.Vector3(0, -1, 0).transformDirection(bell.matrixWorld);
        expect(exhaust.z).toBeCloseTo(-1);
        expect(bell.getWorldPosition(new THREE.Vector3()).z).toBeLessThan(mount.getWorldPosition(new THREE.Vector3()).z);
        const exhaustRim = new THREE.Box3().setFromObject(bell, true).min.z;
        expect(surface.point.z - exhaustRim).toBeGreaterThan(0.25);
      }
    });
  });

  it('un changement d’épaisseur du fuselage conserve sa longueur réelle', () => {
    const model = VEHICLE_BLUEPRINTS.find((entry) => entry.id === 'plane-aeroclub')!;
    const fuselage = model.parts.find((part) => part.id === 'fuselage')!;
    const thinner: PartSpec = { ...fuselage, scale: [fuselage.scale[0], fuselage.scale[1] / 2, fuselage.scale[2]] };
    withPartMeshes([fuselage, thinner], ([[body], [thinBody]]) => {
      const bounds = new THREE.Box3().setFromObject(body, true).getSize(new THREE.Vector3());
      const thinBounds = new THREE.Box3().setFromObject(thinBody, true).getSize(new THREE.Vector3());
      expect(thinBounds.z).toBeCloseTo(bounds.z, 6);
      expect(thinBounds.x).toBeCloseTo(bounds.x, 6);
      expect(thinBounds.y).toBeCloseTo(bounds.y / 2, 6);
    });
  });
});
