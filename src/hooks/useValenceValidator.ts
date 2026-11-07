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
 * All pieces must be placed. Covalent experiments validate both endpoints and
 * bond order, including over-bonded atoms. Legacy fixtures use dependencies.
 * Ionic lattices and apparatus do not use covalent valence rules.
 */
export function validateValence(
  blueprint: VehicleBlueprint,
  placedPartIds: Set<string>,
): ValenceValidationResult {
  if (blueprint.category !== VehicleCategory.CHEMISTRY) {
    return { isComplete: true, unsatisfiedAtoms: [] };
  }

  const unsatisfied: string[] = blueprint.parts.filter((p) => !placedPartIds.has(p.id)).map((p) => p.id);
  if (blueprint.experiment && blueprint.experiment.kind !== 'molecule') {
    return { isComplete: unsatisfied.length === 0, unsatisfiedAtoms: unsatisfied };
  }
  const bondShapes = new Set<PartShapeKind>([PartShapeKind.BOND_SINGLE, PartShapeKind.BOND_DOUBLE]);
  const bondParts = blueprint.parts.filter((p) => bondShapes.has(p.shape));

  for (const part of blueprint.parts) {
    if (!placedPartIds.has(part.id)) continue;
    const required = VALENCE[part.shape];
    if (required === undefined) continue;
    // Count placed bonds adjacent in either direction of the dependency graph
    const adjacentBonds = bondParts.filter(
      (bond) =>
        placedPartIds.has(bond.id) &&
        (bond.bond ? bond.bond.atoms.includes(part.id) : bond.dependsOn.includes(part.id) || part.dependsOn.includes(bond.id)),
    );
    const satisfiedBonds = adjacentBonds.reduce((sum, bond) => sum + (bond.shape === PartShapeKind.BOND_DOUBLE ? 2 : 1), 0);
    if (satisfiedBonds !== required) unsatisfied.push(part.id);
  }

  for (const bond of bondParts) {
    if (!bond.bond) {
      if (blueprint.experiment?.kind === 'molecule') unsatisfied.push(bond.id);
      continue;
    }
    const [a, b] = bond.bond.atoms;
    if (a === b || ![a, b].every((id) => placedPartIds.has(id) && blueprint.parts.some((p) => p.id === id && VALENCE[p.shape] !== undefined))
      || bond.bond.order !== (bond.shape === PartShapeKind.BOND_DOUBLE ? 2 : 1)) unsatisfied.push(bond.id);
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
