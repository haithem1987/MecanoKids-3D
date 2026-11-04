import { VehicleBlueprint, VehicleCategory } from '../types/game';

export interface CircuitValidationResult {
  isComplete: boolean;
  missingConnections: string[];
}

/**
 * Validates that an electronics blueprint has a complete circuit:
 * every part that declares dependsOn[] has all its declared dependencies
 * placed, forming a connected graph from battery to output.
 *
 * For non-electronics blueprints, always returns complete (positional snap
 * logic handles validation instead).
 */
export function validateCircuit(
  blueprint: VehicleBlueprint,
  placedPartIds: Set<string>,
): CircuitValidationResult {
  if (blueprint.category !== VehicleCategory.ELECTRONICS) {
    return { isComplete: true, missingConnections: [] };
  }

  const missing: string[] = [];

  for (const part of blueprint.parts) {
    if (!placedPartIds.has(part.id)) continue;
    for (const dep of part.dependsOn) {
      if (!placedPartIds.has(dep)) {
        missing.push(dep);
      }
    }
  }

  return {
    isComplete: missing.length === 0,
    missingConnections: [...new Set(missing)],
  };
}

export function useCircuitValidator(
  blueprint: VehicleBlueprint | null,
  placedPartIds: Set<string>,
): CircuitValidationResult {
  if (!blueprint) return { isComplete: false, missingConnections: [] };
  return validateCircuit(blueprint, placedPartIds);
}
