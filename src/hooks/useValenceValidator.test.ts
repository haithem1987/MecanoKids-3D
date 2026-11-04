import { describe, it, expect } from 'vitest';
import { validateValence } from './useValenceValidator';
import { VehicleCategory, DifficultyTier, PartShapeKind } from '../types/game';
import type { VehicleBlueprint } from '../types/game';

const makeBp = (
  category: VehicleCategory,
  parts: { id: string; shape: PartShapeKind; dependsOn: string[] }[],
): VehicleBlueprint => ({
  id: 'test',
  stageNumber: 1,
  name: 'Test',
  subtitle: '',
  category,
  tier: DifficultyTier.DISCOVERY,
  tierLabel: '',
  ageNote: '',
  discovery: { howItWorks: '', realRecord: '', didYouKnow: '' },
  parts: parts.map((p) => ({
    ...p,
    name: p.id,
    roleHint: '',
    primaryColor: '#fff',
    secondaryColor: '#000',
    materialKind: 'body',
    scale: [1, 1, 1],
    targetPos: [0, 0, 0],
    explodeOffset: [0, 0, 0],
    snapRadius: 0.3,
  })),
});

describe('validateValence', () => {
  it('passes for non-chemistry category', () => {
    const bp = makeBp(VehicleCategory.CAR, [
      { id: 'o', shape: PartShapeKind.ATOM_OXYGEN, dependsOn: [] },
    ]);
    expect(validateValence(bp, new Set(['o'])).isComplete).toBe(true);
  });

  it('complete water molecule: O + 2×H with bonds', () => {
    const bp = makeBp(VehicleCategory.CHEMISTRY, [
      { id: 'o', shape: PartShapeKind.ATOM_OXYGEN, dependsOn: [] },
      { id: 'b1', shape: PartShapeKind.BOND_SINGLE, dependsOn: ['o'] },
      { id: 'h1', shape: PartShapeKind.ATOM_HYDROGEN, dependsOn: ['b1'] },
      { id: 'b2', shape: PartShapeKind.BOND_SINGLE, dependsOn: ['o'] },
      { id: 'h2', shape: PartShapeKind.ATOM_HYDROGEN, dependsOn: ['b2'] },
    ]);
    const placed = new Set(['o', 'b1', 'h1', 'b2', 'h2']);
    const result = validateValence(bp, placed);
    expect(result.isComplete).toBe(true);
    expect(result.unsatisfiedAtoms).toHaveLength(0);
  });

  it('incomplete: oxygen with only one bond placed', () => {
    const bp = makeBp(VehicleCategory.CHEMISTRY, [
      { id: 'o', shape: PartShapeKind.ATOM_OXYGEN, dependsOn: [] },
      { id: 'b1', shape: PartShapeKind.BOND_SINGLE, dependsOn: ['o'] },
      { id: 'h1', shape: PartShapeKind.ATOM_HYDROGEN, dependsOn: ['b1'] },
    ]);
    const result = validateValence(bp, new Set(['o', 'b1', 'h1']));
    expect(result.isComplete).toBe(false);
    expect(result.unsatisfiedAtoms).toContain('o');
  });

  it('ignores valence of unplaced atoms', () => {
    const bp = makeBp(VehicleCategory.CHEMISTRY, [
      { id: 'o', shape: PartShapeKind.ATOM_OXYGEN, dependsOn: [] },
    ]);
    // O not placed → no valence check
    expect(validateValence(bp, new Set()).isComplete).toBe(true);
  });

  it('hydrogen satisfied by one bond', () => {
    const bp = makeBp(VehicleCategory.CHEMISTRY, [
      { id: 'o', shape: PartShapeKind.ATOM_OXYGEN, dependsOn: [] },
      { id: 'b1', shape: PartShapeKind.BOND_SINGLE, dependsOn: ['o'] },
      { id: 'h1', shape: PartShapeKind.ATOM_HYDROGEN, dependsOn: ['b1'] },
      { id: 'b2', shape: PartShapeKind.BOND_SINGLE, dependsOn: ['o'] },
      { id: 'h2', shape: PartShapeKind.ATOM_HYDROGEN, dependsOn: ['b2'] },
    ]);
    const result = validateValence(bp, new Set(['o', 'b1', 'h1', 'b2', 'h2']));
    expect(result.isComplete).toBe(true);
  });
});
