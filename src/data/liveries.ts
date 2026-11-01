import { LanguageCode, LiveryPresetId, PartSpec } from '../types/game';

export interface LiveryPresetSpec {
  id: LiveryPresetId;
  primaryHex: string;
  secondaryHex: string;
  swatchHex: string;
  requiredStreakDays?: number;
  label: Record<LanguageCode, string>;
}

export const LIVERY_PRESETS: LiveryPresetSpec[] = [
  {
    id: 'original',
    primaryHex: '#0284c7',
    secondaryHex: '#e2e8f0',
    swatchHex: '#38bdf8',
    label: {
      fr: 'Série d’Origine',
      en: 'Factory Original',
      ar: 'الطلاء الأصلي',
    },
  },
  {
    id: 'fire_red',
    primaryHex: '#dc2626',
    secondaryHex: '#fef2f2',
    swatchHex: '#dc2626',
    label: {
      fr: 'Rouge Pompier',
      en: 'Fire Engine Red',
      ar: 'أحمر الإطفاء',
    },
  },
  {
    id: 'racing_blue',
    primaryHex: '#2563eb',
    secondaryHex: '#dbeafe',
    swatchHex: '#2563eb',
    label: {
      fr: 'Bleu Course',
      en: 'Racing Blue',
      ar: 'أزرق السباق',
    },
  },
  {
    id: 'safety_yellow',
    primaryHex: '#eab308',
    secondaryHex: '#1e293b',
    swatchHex: '#eab308',
    label: {
      fr: 'Jaune Chantier',
      en: 'Heavy Duty Yellow',
      ar: 'أصفر الورشات',
    },
  },
  {
    id: 'emerald_green',
    primaryHex: '#059669',
    secondaryHex: '#ecfdf5',
    swatchHex: '#059669',
    label: {
      fr: 'Vert Émeraude',
      en: 'Emerald Racing',
      ar: 'أخضر زمردي',
    },
  },
  {
    id: 'titanium_silver',
    primaryHex: '#64748b',
    secondaryHex: '#f1f5f9',
    swatchHex: '#94a3b8',
    label: {
      fr: 'Titane Brossé',
      en: 'Brushed Titanium',
      ar: 'تيتانيوم مصقول',
    },
  },
  {
    id: 'solar_orange',
    primaryHex: '#ea580c',
    secondaryHex: '#fff7ed',
    swatchHex: '#ea580c',
    label: {
      fr: 'Orange Solaire',
      en: 'Solar Orange',
      ar: 'برتقالي شمسي',
    },
  },
  {
    id: 'royal_indigo',
    primaryHex: '#4f46e5',
    secondaryHex: '#eef2ff',
    swatchHex: '#4f46e5',
    label: {
      fr: 'Indigo Spatial',
      en: 'Orbital Indigo',
      ar: 'نيلي فضائي',
    },
  },
  {
    id: 'flame_gold',
    primaryHex: '#d97706',
    secondaryHex: '#fef3c7',
    swatchHex: '#f59e0b',
    requiredStreakDays: 7,
    label: {
      fr: 'Flamme d’Or (Série 7j)',
      en: 'Flame Gold (7d Streak)',
      ar: 'ذهب الشعلة (سلسلة 7 أيام)',
    },
  },
];

export const VALID_LIVERY_IDS = new Set<LiveryPresetId>(LIVERY_PRESETS.map((l) => l.id));

export function getLiveryPreset(liveryId?: LiveryPresetId): LiveryPresetSpec {
  if (!liveryId || liveryId === 'original') return LIVERY_PRESETS[0];
  return LIVERY_PRESETS.find((l) => l.id === liveryId) ?? LIVERY_PRESETS[0];
}

/**
 * Applies a custom workshop paint livery to a part while preserving 24K Gold rare parts
 * and dark mechanical/tire contrast.
 */
export function applyLiveryToPartSpec(spec: PartSpec, liveryId?: LiveryPresetId): PartSpec {
  if (!liveryId || liveryId === 'original' || spec.isRarePart) {
    return spec;
  }

  const preset = getLiveryPreset(liveryId);
  if (spec.materialKind === 'dark_mech') {
    return {
      ...spec,
      secondaryColor: preset.primaryHex,
    };
  }

  return {
    ...spec,
    primaryColor: preset.primaryHex,
    secondaryColor: preset.secondaryHex,
  };
}
