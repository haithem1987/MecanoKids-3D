import { VEHICLE_BLUEPRINTS } from './blueprints';
import {
  BadgeEvaluation,
  BadgeIconKind,
  DifficultyTier,
  LanguageCode,
  StageCompletionRecord,
  VehicleCategory,
} from '../types/game';

interface BadgeDefinition {
  id: string;
  icon: BadgeIconKind;
  accentColor: 'sky' | 'amber' | 'emerald' | 'indigo' | 'rose';
  title: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  evaluate: (stats: ComputedScoreStats, lang: LanguageCode) => {
    unlocked: boolean;
    currentValue: number;
    targetValue: number;
    progressLabel: string;
  };
}

export interface ComputedScoreStats {
  completedCount: number;
  totalStages: number;
  totalStars: number;
  maxStars: number;
  perfectCount: number;
  tier1Completed: number;
  carStars: number;
  carMaxStars: number;
  boatStars: number;
  boatMaxStars: number;
  planeStars: number;
  planeMaxStars: number;
}

export interface PlayerProgressionSummary {
  stats: ComputedScoreStats;
  rankTitle: string;
  nextRankLabel: string | null;
  badges: BadgeEvaluation[];
  unlockedCount: number;
}

export function computeScoreStats(
  completedStages: Record<string, StageCompletionRecord>,
): ComputedScoreStats {
  let completedCount = 0;
  let totalStars = 0;
  let perfectCount = 0;
  let tier1Completed = 0;
  let carStars = 0;
  let boatStars = 0;
  let planeStars = 0;

  let carCount = 0;
  let boatCount = 0;
  let planeCount = 0;

  for (const bp of VEHICLE_BLUEPRINTS) {
    if (bp.category === VehicleCategory.CAR) carCount++;
    else if (bp.category === VehicleCategory.BOAT) boatCount++;
    else if (bp.category === VehicleCategory.PLANE) planeCount++;

    const rec = completedStages[bp.id];
    if (!rec?.completed) continue;

    completedCount++;
    const stars = Math.max(1, Math.min(3, rec.stars || 1));
    totalStars += stars;

    if (stars === 3) {
      perfectCount++;
    }
    if (bp.tier === DifficultyTier.DISCOVERY) {
      tier1Completed++;
    }
    if (bp.category === VehicleCategory.CAR) {
      carStars += stars;
    } else if (bp.category === VehicleCategory.BOAT) {
      boatStars += stars;
    } else if (bp.category === VehicleCategory.PLANE) {
      planeStars += stars;
    }
  }

  return {
    completedCount,
    totalStages: VEHICLE_BLUEPRINTS.length,
    totalStars,
    maxStars: VEHICLE_BLUEPRINTS.length * 3,
    perfectCount,
    tier1Completed,
    carStars,
    carMaxStars: carCount * 3,
    boatStars,
    boatMaxStars: boatCount * 3,
    planeStars,
    planeMaxStars: planeCount * 3,
  };
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-mechanic',
    icon: BadgeIconKind.WRENCH,
    accentColor: 'sky',
    title: {
      fr: 'Premier Mécanicien',
      ar: 'الميكانيكي الأول',
    },
    description: {
      fr: 'Assembler complètement ton tout premier véhicule dans l’atelier 3D.',
      ar: 'إكمال تجميع أول مركبة لك بالكامل داخل الورشة ثلاثية الأبعاد.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.completedCount, 1);
      return {
        unlocked: s.completedCount >= 1,
        currentValue: cur,
        targetValue: 1,
        progressLabel: lang === 'ar' ? `${cur} / 1 مركبة` : `${cur} / 1 véhicule`,
      };
    },
  },
  {
    id: 'precision-hand',
    icon: BadgeIconKind.TARGET,
    accentColor: 'emerald',
    title: {
      fr: 'Main de Précision',
      ar: 'يد الدقة المتقنة',
    },
    description: {
      fr: 'Obtenir un score parfait de 3 étoiles (zéro erreur) sur un niveau.',
      ar: 'تحقيق نتيجة كاملة (3 نجوم بدون أي خطأ) في إحدى المراحل.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.perfectCount, 1);
      return {
        unlocked: s.perfectCount >= 1,
        currentValue: cur,
        targetValue: 1,
        progressLabel: lang === 'ar' ? `${cur} / 1 مرحلة بـ 3★` : `${cur} / 1 niveau à 3★`,
      };
    },
  },
  {
    id: 'discovery-graduate',
    icon: BadgeIconKind.COMPASS,
    accentColor: 'sky',
    title: {
      fr: 'Diplômé Découverte',
      ar: 'خريج مستوى الاستكشاف',
    },
    description: {
      fr: 'Terminer les 3 véhicules du Palier 1 Découverte (terre, mer et air).',
      ar: 'إنهاء مركبات المستوى الأول الثلاث (البر والبحر والجو).',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.tier1Completed, 3);
      return {
        unlocked: s.tier1Completed >= 3,
        currentValue: cur,
        targetValue: 3,
        progressLabel: lang === 'ar' ? `${cur} / 3 مراحل` : `${cur} / 3 stages`,
      };
    },
  },
  {
    id: 'road-captain',
    icon: BadgeIconKind.CAR,
    accentColor: 'amber',
    title: {
      fr: 'As du Volant',
      ar: 'بطل المركبات البرية',
    },
    description: {
      fr: 'Obtenir au moins 7 étoiles sur 9 sur l’ensemble des voitures et camions.',
      ar: 'جمع 7 نجوم على الأقل من أصل 9 في فئة السيارات والشاحنات.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.carStars, 7);
      return {
        unlocked: s.carStars >= 7,
        currentValue: cur,
        targetValue: 7,
        progressLabel: `${s.carStars} / 7 ★`,
      };
    },
  },
  {
    id: 'sea-navigator',
    icon: BadgeIconKind.ANCHOR,
    accentColor: 'indigo',
    title: {
      fr: 'Capitaine des Mers',
      ar: 'قبطان أعالي البحار',
    },
    description: {
      fr: 'Obtenir au moins 7 étoiles sur 9 sur les voiliers et navires.',
      ar: 'جمع 7 نجوم على الأقل من أصل 9 في فئة القوارب والسفن.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.boatStars, 7);
      return {
        unlocked: s.boatStars >= 7,
        currentValue: cur,
        targetValue: 7,
        progressLabel: `${s.boatStars} / 7 ★`,
      };
    },
  },
  {
    id: 'sky-pilot',
    icon: BadgeIconKind.PLANE,
    accentColor: 'rose',
    title: {
      fr: 'Pilote des Airs',
      ar: 'طيار الأجواء المحترف',
    },
    description: {
      fr: 'Obtenir au moins 7 étoiles sur 9 sur les avions et l’hélicoptère.',
      ar: 'جمع 7 نجوم على الأقل من أصل 9 في فئة الطائرات والمروحيات.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.planeStars, 7);
      return {
        unlocked: s.planeStars >= 7,
        currentValue: cur,
        targetValue: 7,
        progressLabel: `${s.planeStars} / 7 ★`,
      };
    },
  },
  {
    id: 'expert-assembler',
    icon: BadgeIconKind.AWARD,
    accentColor: 'amber',
    title: {
      fr: 'Expert Assembleur',
      ar: 'خبير التجميع الميكانيكي',
    },
    description: {
      fr: 'Cumuler au moins 18 étoiles de réussite sur les niveaux du carnet.',
      ar: 'جمع 18 نجمة تفوق على الأقل عبر مراحل اللعبة المختلفة.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.totalStars, 18);
      return {
        unlocked: s.totalStars >= 18,
        currentValue: cur,
        targetValue: 18,
        progressLabel: `${s.totalStars} / 18 ★`,
      };
    },
  },
  {
    id: 'flawless-streak',
    icon: BadgeIconKind.STAR,
    accentColor: 'emerald',
    title: {
      fr: 'Virtuose Sans Faute',
      ar: 'أستاذ الدقة بلا أخطاء',
    },
    description: {
      fr: 'Réussir 5 niveaux différents avec le score maximal de 3 étoiles.',
      ar: 'إنجاز 5 مراحل مختلفة بالعلامة الكاملة (3 نجوم بدون أخطاء).',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.perfectCount, 5);
      return {
        unlocked: s.perfectCount >= 5,
        currentValue: cur,
        targetValue: 5,
        progressLabel: lang === 'ar' ? `${cur} / 5 مراحل بـ 3★` : `${cur} / 5 niveaux à 3★`,
      };
    },
  },
  {
    id: 'master-engineer',
    icon: BadgeIconKind.TROPHY,
    accentColor: 'amber',
    title: {
      fr: 'Grand Ingénieur 3D',
      ar: 'كبير المهندسين 3D',
    },
    description: {
      fr: 'Terminer les 9 véhicules avec un score d’excellence d’au moins 25 étoiles sur 27.',
      ar: 'إتمام جميع المركبات الـ 9 بنتيجة امتياز لا تقل عن 25 نجمة من 27.',
    },
    evaluate: (s) => {
      const unlocked = s.completedCount >= 9 && s.totalStars >= 25;
      const cur = Math.min(s.totalStars, 25);
      return {
        unlocked,
        currentValue: unlocked ? 25 : Math.min(cur, s.completedCount < 9 ? 24 : 25),
        targetValue: 25,
        progressLabel: `${s.totalStars} / 25 ★ (${s.completedCount}/9)`,
      };
    },
  },
];

function computeRankInfo(
  totalStars: number,
  lang: LanguageCode,
): { rankTitle: string; nextRankLabel: string | null } {
  const ranks =
    lang === 'ar'
      ? [
          { min: 0, title: 'متدرّب فضولي' },
          { min: 3, title: 'ميكانيكي ناشئ' },
          { min: 9, title: 'فني الورشة' },
          { min: 18, title: 'خبير التجميع' },
          { min: 25, title: 'كبير المهندسين 3D' },
        ]
      : [
          { min: 0, title: 'Apprenti Curieux' },
          { min: 3, title: 'Jeune Mécanicien' },
          { min: 9, title: "Technicien d'Atelier" },
          { min: 18, title: 'Expert Assembleur' },
          { min: 25, title: 'Grand Ingénieur 3D' },
        ];

  let currentIdx = 0;
  for (let i = 0; i < ranks.length; i++) {
    if (totalStars >= ranks[i].min) {
      currentIdx = i;
    }
  }

  const next = ranks[currentIdx + 1];
  if (!next) {
    return {
      rankTitle: ranks[currentIdx].title,
      nextRankLabel: null,
    };
  }

  const needed = next.min - totalStars;
  return {
    rankTitle: ranks[currentIdx].title,
    nextRankLabel:
      lang === 'ar'
        ? `ينقصك ${needed} ★ لرتبة «${next.title}»`
        : `Encore ${needed} ★ pour le rang « ${next.title} »`,
  };
}

export function evaluatePlayerProgression(
  completedStages: Record<string, StageCompletionRecord>,
  unlockedBadges: Record<string, number>,
  lang: LanguageCode,
): PlayerProgressionSummary {
  const stats = computeScoreStats(completedStages);
  const { rankTitle, nextRankLabel } = computeRankInfo(stats.totalStars, lang);

  const badges: BadgeEvaluation[] = BADGE_DEFINITIONS.map((def) => {
    const res = def.evaluate(stats, lang);
    const unlocked = res.unlocked || Boolean(unlockedBadges[def.id]);
    return {
      id: def.id,
      icon: def.icon,
      accentColor: def.accentColor,
      title: def.title[lang],
      description: def.description[lang],
      unlocked,
      currentValue: unlocked ? res.targetValue : res.currentValue,
      targetValue: res.targetValue,
      progressLabel: res.progressLabel,
      unlockedAt: unlockedBadges[def.id],
    };
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return {
    stats,
    rankTitle,
    nextRankLabel,
    badges,
    unlockedCount,
  };
}

export function syncUnlockedBadgesMap(
  completedStages: Record<string, StageCompletionRecord>,
  existingUnlocked: Record<string, number>,
): {
  updatedUnlocked: Record<string, number>;
  newlyUnlockedIds: string[];
} {
  const stats = computeScoreStats(completedStages);
  const updatedUnlocked: Record<string, number> = { ...existingUnlocked };
  const newlyUnlockedIds: string[] = [];
  const now = Date.now();

  for (const def of BADGE_DEFINITIONS) {
    const res = def.evaluate(stats, 'fr');
    if (res.unlocked && !updatedUnlocked[def.id]) {
      updatedUnlocked[def.id] = now;
      newlyUnlockedIds.push(def.id);
    }
  }

  return { updatedUnlocked, newlyUnlockedIds };
}
