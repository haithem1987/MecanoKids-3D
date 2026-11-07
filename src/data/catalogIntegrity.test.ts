import { describe, expect, it } from 'vitest';
import { VEHICLE_BLUEPRINTS } from './blueprints';
import { getLocalizedBlueprint } from '../i18n/translations';
import { VehicleCategory } from '../types/game';

describe('intégrité de tous les ateliers', () => {
  it('conserve des identifiants uniques et une progression continue', () => {
    expect(new Set(VEHICLE_BLUEPRINTS.map((bp) => bp.id)).size).toBe(VEHICLE_BLUEPRINTS.length);
    expect(VEHICLE_BLUEPRINTS.map((bp) => bp.stageNumber)).toEqual(
      VEHICLE_BLUEPRINTS.map((_, index) => index + 1),
    );
    for (const category of Object.values(VehicleCategory)) {
      expect(VEHICLE_BLUEPRINTS.some((bp) => bp.category === category)).toBe(true);
    }
  });

  it.each(VEHICLE_BLUEPRINTS)('$id : pièces valides et ordre de montage réalisable', (bp) => {
    expect(bp.parts.length).toBeGreaterThan(0);
    expect(Object.values(VehicleCategory)).toContain(bp.category);
    const ids = new Set(bp.parts.map((p) => p.id));
    expect(ids.size).toBe(bp.parts.length);
    const placed = new Set<string>();
    for (const p of bp.parts) {
      expect(p.scale.every((value) => Number.isFinite(value) && value > 0)).toBe(true);
      expect([...p.targetPos, ...(p.targetRot ?? []), ...p.explodeOffset].every(Number.isFinite)).toBe(true);
      expect(p.snapRadius).toBeGreaterThan(0);
      expect(Number.isFinite(p.snapRadius)).toBe(true);
      for (const dependency of p.dependsOn) expect(ids.has(dependency)).toBe(true);
    }
    for (let round = 0; round < bp.parts.length; round++) {
      for (const p of bp.parts) {
        if (p.dependsOn.every((dependency) => placed.has(dependency))) placed.add(p.id);
      }
    }
    expect(placed.size).toBe(bp.parts.length);
    for (const language of ['fr', 'en', 'ar'] as const) {
      const localized = getLocalizedBlueprint(bp, language);
      expect(localized.category).toBe(bp.category);
      expect(localized.parts.map((p) => [p.id, p.shape, p.dependsOn, p.targetPos, p.targetRot])).toEqual(
        bp.parts.map((p) => [p.id, p.shape, p.dependsOn, p.targetPos, p.targetRot]),
      );
    }
  });
});
