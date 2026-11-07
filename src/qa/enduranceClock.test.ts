import { describe, expect, it } from 'vitest';
import { advanceEnduranceClock, createEnduranceClock } from './enduranceClock';

describe('durée d’endurance réellement visible', () => {
  it('ne compte pas une pause de dix minutes dans un onglet caché', () => {
    let clock = createEnduranceClock(0, true);
    clock = advanceEnduranceClock(clock, 2000, false);
    clock = advanceEnduranceClock(clock, 602000, true);
    clock = advanceEnduranceClock(clock, 605000, true);
    expect(clock.wallMs).toBe(605000);
    expect(clock.visibleMs).toBe(5000);
  });
  it('traite un démarrage caché et les interruptions répétées', () => {
    let clock = createEnduranceClock(100, false);
    clock = advanceEnduranceClock(clock, 1100, true);
    clock = advanceEnduranceClock(clock, 2100, false);
    clock = advanceEnduranceClock(clock, 3100, true);
    clock = advanceEnduranceClock(clock, 4100, false);
    expect(clock.visibleMs).toBe(2000);
    expect(clock.wallMs).toBe(4000);
  });
});
