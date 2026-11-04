import { VehicleBlueprint, VehicleCategory, PartShapeKind } from '../types/game';

export interface ValenceValidationResult {
  isComplete: boolean;
  unsatisfiedAtoms: string[];
}

const VALENCE: Partial<Record<PartShapeKind, number>> = {
  [PartShapeKind.ATOM_HYDROGEN]: 1,
  [PartShapeKind.ATOM_OXYGEN]: 2,
  [PartShapeKind.ATOM_CARBON]: 4,
  [PartShapeKind.ATOM_CHLORINE]: 1,
};

/**
 * Validates that every placed atom in a chemistry blueprint has its declared
 * number of bonds satisfied by the placed bond parts connected to it via dependsOn.
 * Non-chemistry blueprints always pass.
 */
export function validateValence(
  blueprint: VehicleBlueprint,
  placedPartIds: Set<string>,
): ValenceValidationResult {
  if (blueprint.category !== VehicleCategory.CHEMISTRY) {
    return { isComplete: true, unsatisfiedAtoms: [] };
  }

  const unsatisfied: string[] = [];
  const bondShapes = new Set<PartShapeKind>([PartShapeKind.BOND_SINGLE, PartShapeKind.BOND_DOUBLE]);
  const bondParts = blueprint.parts.filter((p) => bondShapes.has(p.shape));

  for (const part of blueprint.parts) {
    if (!placedPartIds.has(part.id)) continue;
    const required = VALENCE[part.shape];
    if (required === undefined) continue;
    // Count placed bonds adjacent in either direction of the dependency graph
    const satisfiedBonds = bondParts.filter(
      (bond) =>
        placedPartIds.has(bond.id) &&
        (bond.dependsOn.includes(part.id) || part.dependsOn.includes(bond.id)),
    ).length;
    if (satisfiedBonds < required) unsatisfied.push(part.id);
  }

  return { isComplete: unsatisfied.length === 0, unsatisfiedAtoms: [...new Set(unsatisfied)] };
}

export function useValenceValidator(
  blueprint: VehicleBlueprint | null,
  placedPartIds: Set<string>,
): ValenceValidationResult {
  if (!blueprint) return { isComplete: false, unsatisfiedAtoms: [] };
  return validateValence(blueprint, placedPartIds);
}
