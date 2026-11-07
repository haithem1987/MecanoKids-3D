import { describe, expect, it } from 'vitest';
import { VIRTUAL_LAB_TEXT } from '../i18n/translations';
import { VIRTUAL_LAB_GROUPS, VIRTUAL_LAB_MODELS, runVirtualLab, type VirtualLabId } from './virtualLabs';

export const winningSettings = {
  newton: [2], venturi: [2, 1, 0, 0], rocket: [1, 1], balance: [0, 0],
  phase: [1], dna: [0, 1, 2, 3], slime: [1], ph: [2, 2],
  conductivity: [2], resistance: [1], logic: [2, 0, 0], capillary: [1, 1], erosion: [2, 1],
} satisfies Record<VirtualLabId, number[]>;

const ids = Object.values(VIRTUAL_LAB_GROUPS).flat();
describe('virtual science labs', () => {
  it.each(ids)('%s has a reachable mission and localized controls for every outcome', id => {
    const { start, sizes, success } = VIRTUAL_LAB_MODELS[id];
    const { controls, outcomes } = VIRTUAL_LAB_TEXT[id];
    expect(start).toHaveLength(sizes.length);
    expect(controls.map(options => options.length - 1)).toEqual(sizes);
    const combinations = sizes.reduce<number[][]>((sets, size) => sets.flatMap(set => Array.from({ length: size }, (_, value) => [...set, value])), [[]]);
    for (const settings of combinations) {
      for (const previous of id === 'dna' ? [0, 1, 2, 3, 4] : [0]) {
        expect(outcomes[runVirtualLab(id, settings, previous)]?.every(Boolean)).toBe(true);
      }
    }
    const outcome = id === 'dna'
      ? winningSettings.dna.reduce((state, action) => runVirtualLab(id, [action], state), 0)
      : runVirtualLab(id, winningSettings[id]);
    expect(outcome).toBe(success);
    expect(runVirtualLab(id, start)).not.toBe(success);
  });

  it('keeps the DNA sequence recoverable and distinguishes both pressure experiments', () => {
    expect(runVirtualLab('dna', [3], 1)).toBe(1);
    expect(runVirtualLab('dna', [1], 1)).toBe(2);
    expect(runVirtualLab('venturi', [2, 1, 1, 0])).toBe(3);
    expect(runVirtualLab('venturi', [0, 0, 1, 1])).toBe(4);
  });

  it('uses the truth tables of AND, OR and NOT', () => {
    for (const a of [0, 1]) for (const b of [0, 1]) {
      expect(Boolean(runVirtualLab('logic', [0, a, b]))).toBe(Boolean(a && b));
      expect(Boolean(runVirtualLab('logic', [1, a, b]))).toBe(Boolean(a || b));
      expect(Boolean(runVirtualLab('logic', [2, a, b]))).toBe(!a);
    }
  });
});
