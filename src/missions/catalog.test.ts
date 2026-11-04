import { describe, it, expect } from 'vitest';
import { MISSIONS } from './catalog';
import { validateMission, isMissionI18n } from './schema';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';

describe('MISSIONS catalog', () => {
  it('has exactly 15 missions', () => {
    expect(MISSIONS).toHaveLength(15);
  });

  it('every mission passes schema validation', () => {
    for (const m of MISSIONS) {
      expect(() => validateMission(m)).not.toThrow();
    }
  });

  it('every mission references an existing vehicle', () => {
    const ids = new Set(VEHICLE_BLUEPRINTS.map((b) => b.id));
    for (const m of MISSIONS) {
      expect(ids.has(m.vehicule)).toBe(true);
    }
  });

  it('every mission has explication translated in fr, en and ar', () => {
    for (const m of MISSIONS) {
      expect(isMissionI18n(m.explication)).toBe(true);
    }
  });

  it('every mission has unique id', () => {
    const ids = MISSIONS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every objectif, etape and conditionReussite is translated in 3 langs', () => {
    for (const m of MISSIONS) {
      for (const o of m.objectifs) expect(isMissionI18n(o)).toBe(true);
      for (const e of m.etapes) expect(isMissionI18n(e)).toBe(true);
      for (const c of m.conditionsReussite) expect(isMissionI18n(c)).toBe(true);
    }
  });
});
