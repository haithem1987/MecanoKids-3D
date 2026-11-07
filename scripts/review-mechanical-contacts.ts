import * as THREE from 'three';
import { readFileSync, writeFileSync } from 'node:fs';
import { VEHICLE_BLUEPRINTS } from '../src/data/blueprints';
import { buildPartMeshGroup } from '../src/three/partGeometries';
import { VisualStyleMode } from '../src/types/game';

const reviewPath = 'docs/qa/mechanical-contact-review.json';
// Keep the original candidates and distances even when the catalogue audit is refreshed.
const baseline = JSON.parse(readFileSync(reviewPath, 'utf8')) as {
  id: string; candidates: { part: string; dependency: string; distance: number }[];
}[];
const separation = (a: THREE.Box3, b: THREE.Box3) => Math.hypot(...(['x', 'y', 'z'] as const).map((axis) => Math.max(0, b.min[axis] - a.max[axis], a.min[axis] - b.max[axis])));
const results = baseline.map((row) => {
  const bp = VEHICLE_BLUEPRINTS.find((model) => model.id === row.id)!;
  const bounds = new Map<string, THREE.Box3>();
  for (const part of bp.parts) {
    const group = buildPartMeshGroup({ ...part, isRarePart: false }, VisualStyleMode.BLOCKS, true, 1);
    group.position.fromArray(part.targetPos); group.updateMatrixWorld(true);
    bounds.set(part.id, new THREE.Box3().setFromObject(group));
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
    });
  }
  return { id: bp.id, name: bp.name, category: bp.category, candidates: row.candidates.map(({ part: id, dependency, distance }) => {
    const part = bp.parts.find((p) => p.id === id)!;
    const nearest = bp.parts.filter((p) => p.id !== part.id).map((p) => ({ id: p.id, distance: Number(separation(bounds.get(part.id)!, bounds.get(p.id)!).toFixed(4)) })).sort((a, b) => a.distance - b.distance);
    return { part: id, dependency, distance, shape: part.shape, position: part.targetPos, scale: part.scale, rotation: part.targetRot, nearest: nearest.slice(0, 4) };
  }) };
});
writeFileSync(reviewPath, JSON.stringify(results, null, 2) + '\n');
console.log(`${results.length} modèles, ${results.reduce((sum, row) => sum + row.candidates.length, 0)} paires mesurées.`);
