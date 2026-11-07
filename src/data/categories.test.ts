import { describe, expect, it } from 'vitest';
import { CATEGORIES, CATEGORY_META, getCategoryLabel } from './categories';
import { VehicleCategory } from '../types/game';
import { UI_TRANSLATIONS } from '../i18n/translations';

describe('registre des catégories', () => {
  it('couvre chaque catégorie dans les trois langues sans libellé par défaut', () => {
    expect(CATEGORIES).toEqual(Object.values(VehicleCategory));
    expect(Object.keys(CATEGORY_META)).toHaveLength(CATEGORIES.length);
    for (const lang of ['fr', 'en', 'ar'] as const) {
      const labels = CATEGORIES.map((category) => getCategoryLabel(category, lang));
      expect(new Set(labels).size).toBe(CATEGORIES.length);
      for (const label of labels) expect(label.trim().length).toBeGreaterThan(0);
      expect(getCategoryLabel(VehicleCategory.CHEMISTRY, lang)).toBe(UI_TRANSLATIONS[lang].filterChemistry);
      expect(getCategoryLabel(VehicleCategory.PHYSICS, lang)).toBe(UI_TRANSLATIONS[lang].filterPhysics);
      expect(UI_TRANSLATIONS[lang].filterAll).not.toContain('100');
      expect(UI_TRANSLATIONS[lang].catalogTitle).not.toContain('100');
    }
  });
});
