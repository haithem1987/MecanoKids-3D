import { describe, it, expect } from 'vitest';
import { validateCircuit } from './useCircuitValidator';
import { VehicleCategory, DifficultyTier, PartShapeKind } from '../types/game';
import type { VehicleBlueprint } from '../types/game';

const makeBp = (category: VehicleCategory, deps: Record<string, string[]>): VehicleBlueprint => ({
  id: 'test',
  stageNumber: 1,
  name: 'Test',
  subtitle: '',
  category,
  tier: DifficultyTier.DISCOVERY,
  tierLabel: '',
  ageNote: '',
  discovery: { howItWorks: '', realRecord: '', didYouKnow: '' },
  parts: Object.entries(deps).map(([id, dependsOn]) => ({
    id,
    name: id,
    roleHint: '',
    shape: PartShapeKind.BREADBOARD,
    primaryColor: '#fff',
    secondaryColor: '#000',
    materialKind: 'body',
    scale: [1, 1, 1],
    targetPos: [0, 0, 0],
    explodeOffset: [0, 0, 0],
    dependsOn,
    snapRadius: 0.3,
  })),
});

describe('validateCircuit', () => {
  it('passes for non-electronics category', () => {
    const bp = makeBp(VehicleCategory.CAR, { chassis: [], wheel: ['chassis'] });
    const result = validateCircuit(bp, new Set(['chassis']));
    expect(result.isComplete).toBe(true);
  });

  it('complete circuit when all deps placed', () => {
    const bp = makeBp(VehicleCategory.ELECTRONICS, {
      battery: [],
      resistor: ['battery'],
      led: ['resistor'],
    });
    const result = validateCircuit(bp, new Set(['battery', 'resistor', 'led']));
    expect(result.isComplete).toBe(true);
    expect(result.missingConnections).toHaveLength(0);
  });

  it('incomplete when a dep is missing', () => {
    const bp = makeBp(VehicleCategory.ELECTRONICS, {
      battery: [],
      resistor: ['battery'],
      led: ['resistor'],
    });
    const result = validateCircuit(bp, new Set(['battery', 'led']));
    expect(result.isComplete).toBe(false);
    expect(result.missingConnections).toContain('resistor');
  });

  it('does not accept a partial circuit as complete', () => {
    const bp = makeBp(VehicleCategory.ELECTRONICS, {
      battery: [],
      resistor: ['battery'],
      led: ['resistor'],
    });
    const result = validateCircuit(bp, new Set(['battery']));
    expect(result.isComplete).toBe(false);
    expect(result.missingConnections).toEqual(expect.arrayContaining(['resistor', 'led']));
  });
});
