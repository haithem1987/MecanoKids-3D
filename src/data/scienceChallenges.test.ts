import { describe, expect, it } from 'vitest';
import { meetsChallenge, observeChallenge, SCIENCE_CHALLENGES } from './scienceChallenges';
import { VEHICLE_BLUEPRINTS } from './blueprints';

describe('Mini-laboratoire', () => {
  it('requires both switches to close a series loop', () => {
    const series = SCIENCE_CHALLENGES['elec-led-circuit'][2];
    expect([0, 1, 2, 3].map(setting => observeChallenge(series, setting))).toEqual(['off', 'off', 'off', 'on']);
  });

  it('distinguishes balancing by moving closer from balancing by moving farther', () => {
    const [, heavy, near] = SCIENCE_CHALLENGES['phys-lever-class1'];
    expect([1, 2, 3, 4].filter(distance => meetsChallenge(heavy, distance))).toEqual([4]);
    expect([1, 2, 3, 4].filter(distance => meetsChallenge(near, distance))).toEqual([1]);
  });

  it('requires different atoms to complete water and carbon dioxide', () => {
    const [water, repair] = SCIENCE_CHALLENGES['chem-water-molecule'];
    const [carbon] = SCIENCE_CHALLENGES['chem-co2-molecule'];
    expect(meetsChallenge(water, 1)).toBe(true);
    expect(meetsChallenge(repair, 2)).toBe(false);
    expect(meetsChallenge(carbon, 1)).toBe(false);
    expect(meetsChallenge(carbon, 2)).toBe(true);
  });

  it('attaches every challenge to a playable blueprint and starts before the goal', () => {
    for (const [id, challenges] of Object.entries(SCIENCE_CHALLENGES)) {
      expect(VEHICLE_BLUEPRINTS.some(blueprint => blueprint.id === id)).toBe(true);
      for (const challenge of challenges) expect(meetsChallenge(challenge, challenge.start)).toBe(false);
    }
  });
});
