import { mkdirSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { VEHICLE_BLUEPRINTS } from '../src/data/blueprints';
import { getLocalizedBlueprint } from '../src/i18n/translations';
import { buildPartMeshGroup } from '../src/three/partGeometries';
import { PartShapeKind, VehicleCategory, VisualStyleMode } from '../src/types/game';
import { validateCircuit } from '../src/hooks/useCircuitValidator';
import { validateValence } from '../src/hooks/useValenceValidator';
import { isAssemblyComplete } from '../src/utils/assemblyValidation';

// Audit read-only of the catalogue. AABB gaps are review candidates, not
// physical connection proofs; this does not simulate pointer interaction.
const minimumComponents: Record<string, Partial<Record<PartShapeKind, number>>> = {
  'chem-water-molecule': { [PartShapeKind.ATOM_OXYGEN]: 1, [PartShapeKind.ATOM_HYDROGEN]: 2, [PartShapeKind.BOND_SINGLE]: 2 },
  'chem-co2-molecule': { [PartShapeKind.ATOM_CARBON]: 1, [PartShapeKind.ATOM_OXYGEN]: 2, [PartShapeKind.BOND_DOUBLE]: 2 },
  'elec-led-circuit': { [PartShapeKind.RESISTOR]: 1, [PartShapeKind.WIRE_JUMPER]: 1 },
  'elec-motor-fan': { [PartShapeKind.MICRO_MOTOR]: 1 },
  'elec-solar-toy': { [PartShapeKind.SOLAR_PANEL]: 1 },
};
const rows = VEHICLE_BLUEPRINTS.map((bp) => {
  const errors: string[] = [];
  const ids = new Set(bp.parts.map((p) => p.id));
  if (ids.size !== bp.parts.length) errors.push('duplicate-part-id');
  if (!Object.values(VehicleCategory).includes(bp.category)) errors.push('invalid-category');
  const reachable = new Set<string>();
  for (let round = 0; round < bp.parts.length; round++) {
    for (const p of bp.parts) {
      if (p.dependsOn.every((d) => reachable.has(d))) reachable.add(p.id);
    }
  }
  if (reachable.size !== bp.parts.length) errors.push('dependency-cycle-or-missing');
  const bounds = new Map<string, THREE.Box3>();
  let meshes = 0;
  for (const p of bp.parts) {
    if (!p.scale.every((v) => Number.isFinite(v) && v > 0)
      || ![...p.targetPos, ...(p.targetRot ?? []), ...p.explodeOffset].every(Number.isFinite)
      || !Number.isFinite(p.snapRadius) || p.snapRadius <= 0) errors.push(`invalid-transform:${p.id}`);
    if (p.dependsOn.some((d) => !ids.has(d))) errors.push(`missing-dependency:${p.id}`);
    // Blocks has no canvas textures: exercise actual geometry in Node without
    // mocking a DOM or a GPU. Materials and all geometry are disposed below.
    // Rare parts normally force canvas-backed gold textures; disable that
    // material flag only. Dimensions, shape and target transform stay intact.
    const group = buildPartMeshGroup({ ...p, isRarePart: false }, VisualStyleMode.BLOCKS, true, 1);
    group.position.fromArray(p.targetPos);
    group.rotation.set(...(p.targetRot ?? [0, 0, 0]));
    group.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty() || ![...box.min.toArray(), ...box.max.toArray()].every(Number.isFinite)) {
      errors.push(`invalid-geometry:${p.id}`);
    }
    bounds.set(p.id, box);
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      meshes++;
      const position = object.geometry.getAttribute('position');
      if (!position || !Array.from(position.array).every(Number.isFinite)) errors.push(`invalid-vertices:${p.id}`);
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((m) => m.dispose());
    });
  }
  const gaps: { part: string; dependency: string; distance: number }[] = [];
  for (const p of bp.parts) {
    const box = bounds.get(p.id)!;
    for (const dependency of p.dependsOn) {
      const other = bounds.get(dependency);
      if (!other) continue;
      const distance = Math.hypot(...(['x', 'y', 'z'] as const).map((axis) =>
        Math.max(0, other.min[axis] - box.max[axis], box.min[axis] - other.max[axis])));
      if (distance > 0.05) gaps.push({ part: p.id, dependency, distance: Number(distance.toFixed(3)) });
    }
  }
  const en = getLocalizedBlueprint(bp, 'en');
  const ar = getLocalizedBlueprint(bp, 'ar');
  return {
    id: bp.id, name: bp.name, category: bp.category, tier: bp.tier,
    parts: bp.parts.length, meshes, errors, gaps,
    assemblyComplete: isAssemblyComplete(bp, [...ids]),
    components: bp.parts.map((p) => ({ id: p.id, shape: p.shape })),
    missingMinimumComponents: Object.entries(minimumComponents[bp.id] ?? {}).flatMap(([shape, required]) => {
      const actual = bp.parts.filter((p) => p.shape === shape).length;
      return actual < required ? [{ shape, required, actual }] : [];
    }),
    englishNameUnchanged: en.name === bp.name,
    englishPartsUnchanged: en.parts.filter((p, i) => p.name === bp.parts[i].name).map((p) => p.id),
    arabicMissingNames: ar.parts.filter((p) => !/[\u0600-\u06ff]/u.test(p.name)).map((p) => p.id),
    circuitEmptyAccepted: bp.category === VehicleCategory.ELECTRONICS ? validateCircuit(bp, new Set()).isComplete : null,
    fullValence: bp.category === VehicleCategory.CHEMISTRY ? validateValence(bp, ids) : null,
  };
});
const summary = {
  models: rows.length,
  parts: rows.reduce((n, row) => n + row.parts, 0),
  uniqueIds: new Set(rows.map((row) => row.id)).size,
  structuralErrors: rows.filter((row) => row.errors.length),
  semanticFailures: rows.filter((row) => !row.assemblyComplete || row.missingMinimumComponents.length || row.circuitEmptyAccepted === true || row.fullValence?.isComplete === false),
  categories: Object.values(VehicleCategory).map((category) => {
    const models = rows.filter((row) => row.category === category);
    return { category, models: models.length, parts: models.reduce((n, row) => n + row.parts, 0),
      gapCandidates: models.filter((row) => row.gaps.length).length,
      englishNameUnchanged: models.filter((row) => row.englishNameUnchanged).length,
      englishPartsUnchanged: models.reduce((n, row) => n + row.englishPartsUnchanged.length, 0),
      arabicMissingNames: models.reduce((n, row) => n + row.arabicMissingNames.length, 0),
      maxMeshes: Math.max(...models.map((row) => row.meshes)) };
  }),
};
mkdirSync('docs/qa', { recursive: true });
writeFileSync('docs/qa/workshops-audit.json', JSON.stringify({ summary, models: rows }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
if (summary.structuralErrors.length || summary.semanticFailures.length || summary.uniqueIds !== summary.models) process.exitCode = 1;
