import { describe, expect, it } from 'vitest';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { PartShapeKind as S, VehicleBlueprint } from '../types/game';
import { isAssemblyComplete } from './assemblyValidation';
import { validateCircuit } from '../hooks/useCircuitValidator';
import { validateValence } from '../hooks/useValenceValidator';

const experiments = VEHICLE_BLUEPRINTS.filter((bp) => bp.experiment);
const ids = (bp: VehicleBlueprint) => bp.parts.map((p) => p.id);
const find = (id: string) => structuredClone(VEHICLE_BLUEPRINTS.find((bp) => bp.id === id)!);

describe('réussite sur les vrais modèles du catalogue', () => {
  it.each(VEHICLE_BLUEPRINTS)('$id : le montage complet peut réussir', (bp) => {
    expect(isAssemblyComplete(bp, ids(bp))).toBe(true);
  });
  it.each(experiments)('$id : aucune pièce manquante ne permet de réussir', (bp) => {
    for (const p of bp.parts) expect(isAssemblyComplete(bp, ids(bp).filter((id) => id !== p.id))).toBe(false);
    expect(isAssemblyComplete(bp, [])).toBe(false);
    expect(isAssemblyComplete(bp, [...ids(bp), ids(bp)[0]])).toBe(false);
    expect(isAssemblyComplete(bp, [...ids(bp).slice(1), 'unknown'])).toBe(false);
  });
  it('refuse l’ancien inventaire de l’eau avec un seul hydrogène', () => {
    const bp = find('chem-water-molecule');
    bp.parts = bp.parts.filter((p) => p.id !== 'atom-right' && p.id !== 'bond-right');
    expect(isAssemblyComplete(bp, ids(bp))).toBe(false);
  });
  it('compte les doubles liaisons et refuse un CO₂ à liaisons simples', () => {
    const bp = find('chem-co2-molecule');
    expect(validateValence(bp, new Set(ids(bp))).isComplete).toBe(true);
    const bond = bp.parts.find((p) => p.id === 'bond-left')!;
    bond.shape = S.BOND_SINGLE;
    expect(validateValence(bp, new Set(ids(bp))).isComplete).toBe(false);
  });
  it('refuse les liaisons vers le même atome ou un atome inexistant', () => {
    const bp = find('chem-water-molecule');
    bp.parts.find((p) => p.id === 'bond-left')!.bond!.atoms = ['atom-central', 'atom-central'];
    expect(validateValence(bp, new Set(ids(bp))).isComplete).toBe(false);
    bp.parts.find((p) => p.id === 'bond-left')!.bond!.atoms = ['atom-central', 'missing'];
    expect(validateValence(bp, new Set(ids(bp))).isComplete).toBe(false);
  });
  it('refuse le circuit LED sans retour électrique malgré toutes les pièces posées', () => {
    const bp = find('elec-led-circuit');
    const wire = bp.parts.find((p) => p.electrical?.[0] === 'led')!;
    wire.electrical = undefined;
    expect(validateCircuit(bp, new Set(ids(bp))).isComplete).toBe(false);
  });
  it('refuse une branche électrique détachée ou une boucle absente', () => {
    const bp = find('elec-solar-toy');
    bp.parts.filter((p) => p.electrical?.includes('capacitor')).forEach((p) => { p.electrical = ['missing', 'capacitor']; });
    expect(validateCircuit(bp, new Set(ids(bp))).isComplete).toBe(false);
    bp.experiment!.circuit = [];
    expect(validateCircuit(bp, new Set(ids(bp))).isComplete).toBe(false);
  });
});
