import { validateCircuit } from '../hooks/useCircuitValidator';
import { validateValence } from '../hooks/useValenceValidator';
import { VehicleBlueprint } from '../types/game';

export function isAssemblyComplete(blueprint: VehicleBlueprint, placedIds: readonly string[]): boolean {
  const placed = new Set(placedIds);
  if (!blueprint.parts.length || placed.size !== blueprint.parts.length || placed.size !== placedIds.length) return false;
  if (!blueprint.parts.every((p) => placed.has(p.id) && p.dependsOn.every((id) => placed.has(id)))) return false;
  for (const [shape, required] of Object.entries(blueprint.experiment?.requiredShapes ?? {})) {
    if (blueprint.parts.filter((p) => p.shape === shape).length !== required) return false;
  }
  return validateCircuit(blueprint, placed).isComplete && validateValence(blueprint, placed).isComplete;
}
