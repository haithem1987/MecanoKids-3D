import { describe, expect, it } from 'vitest';
import { VEHICLE_BLUEPRINTS } from './blueprints';
import { WORKSHOP_ADVENTURES, adventureProgress } from './adventures';

describe('aventures dans le catalogue commun', () => {
  it('relie trois parcours de trois ateliers réels sans atelier parallèle', () => {
    const ids = new Set(VEHICLE_BLUEPRINTS.map(bp => bp.id));
    expect(WORKSHOP_ADVENTURES).toHaveLength(3);
    for (const route of WORKSHOP_ADVENTURES) {
      expect(route.steps).toHaveLength(3);
      expect(new Set(route.steps).size).toBe(3);
      expect(route.steps.every(id => ids.has(id))).toBe(true);
    }
  });
  it('reprend le premier atelier incomplet même si les suivants sont déjà terminés', () => {
    const progress = { completedStages: { a: { completed: true, stars: 3, bestMistakes: 0 }, c: { completed: true, stars: 3, bestMistakes: 0 } } };
    expect(adventureProgress(['a', 'b', 'c'], progress)).toEqual({ completed: 2, total: 3, nextId: 'b', finished: false });
    expect(adventureProgress(['a', 'c'], progress).finished).toBe(true);
  });
});
