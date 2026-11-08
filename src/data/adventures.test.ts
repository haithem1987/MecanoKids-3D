import { describe, expect, it } from 'vitest';
import { VEHICLE_BLUEPRINTS } from './blueprints';
import { WORKSHOP_ADVENTURES, adventureProgress } from './adventures';

describe('aventures dans le catalogue commun', () => {
  it('relie dix-sept parcours de trois à cinq ateliers réels sans atelier parallèle', () => {
    const ids = new Set(VEHICLE_BLUEPRINTS.map(bp => bp.id));
    expect(WORKSHOP_ADVENTURES).toHaveLength(17);
    for (const route of WORKSHOP_ADVENTURES) {
      expect(route.steps.length).toBeGreaterThanOrEqual(3);
      expect(route.steps.length).toBeLessThanOrEqual(5);
      expect(new Set(route.steps).size).toBe(route.steps.length);
      expect(route.steps.every(id => ids.has(id))).toBe(true);
    }
  });
  it('reprend le premier atelier incomplet même si les suivants sont déjà terminés', () => {
    const progress = { completedStages: { a: { completed: true, stars: 3, bestMistakes: 0 }, c: { completed: true, stars: 3, bestMistakes: 0 } } };
    expect(adventureProgress(['a', 'b', 'c'], progress)).toMatchObject({ completed: 2, built: 2, total: 3, nextId: 'b', nextAction: 'build', finished: false });
    expect(adventureProgress(['a', 'c'], progress).finished).toBe(true);
  });
  it('couvre tous les laboratoires et les onze nouvelles expériences originales', () => {
    const covered = new Set<string>(WORKSHOP_ADVENTURES.flatMap(route => [...route.steps]));
    for (const bp of VEHICLE_BLUEPRINTS.filter(bp => bp.virtualLab)) expect(covered.has(bp.id), bp.id).toBe(true);
    for (const id of ['elec-motor-fan', 'elec-alarm-buzzer', 'elec-solar-toy', 'elec-radio-receiver', 'phys-inclined-plane', 'phys-magnet-compass', 'phys-pendulum', 'phys-prism-light', 'chem-salt-crystal', 'chem-beaker-setup', 'chem-balance-scale', 'expansion-yurt', 'expansion-dome']) expect(covered.has(id), id).toBe(true);
  });
  it('reprend l’essai après construction et ne valide ni un résultat intermédiaire ni une ancienne entrée sans preuve', () => {
    const progress = { completedStages: { a: { completed: true, stars: 3, bestMistakes: 0 }, b: { completed: true, stars: 3, bestMistakes: 0 } } };
    const base = { blueprintId: 'a', kind: 'lab', result: ['fr', 'en', 'ar'] as const, observedAt: 1, attempts: 1 };
    for (const success of [undefined, false]) {
      const state = adventureProgress(['a', 'b'], progress, { version: 1, observations: [{ ...base, success }] }, id => id === 'a');
      expect(state).toMatchObject({ built: 2, completed: 1, observed: 0, nextId: 'a', nextAction: 'try', finished: false });
    }
    expect(adventureProgress(['a', 'b'], progress, { version: 1, observations: [{ ...base, success: true }] }, id => id === 'a')).toMatchObject({ completed: 2, observed: 1, finished: true });
  });
  it('une observation seule ne remplace pas une construction terminée', () => {
    const state = adventureProgress(['a'], { completedStages: {} }, { version: 1, observations: [{ blueprintId: 'a', kind: 'lab', result: ['fr', 'en', 'ar'], observedAt: 1, attempts: 1, success: true }] }, () => true);
    expect(state).toMatchObject({ built: 0, completed: 0, nextAction: 'build', finished: false });
  });
});
