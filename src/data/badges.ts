import { VEHICLE_BLUEPRINTS } from './blueprints';
import {
  BadgeEvaluation,
  BadgeIconKind,
  DailyChallengeState,
  DifficultyTier,
  LanguageCode,
  SpeedrunRecord,
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
  tier5Completed: number;
  carStars: number;
  carMaxStars: number;
  boatStars: number;
  boatMaxStars: number;
  planeStars: number;
  planeMaxStars: number;
  constructionStars: number;
  constructionMaxStars: number;
  spaceStars: number;
  spaceMaxStars: number;
  dailyCompletedCount: number;
  rarePartsCollected: number;
  timedRunsCount: number;
  fastestTimeMs: number | null;
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
  dailyChallenge?: DailyChallengeState,
  speedrunRecords?: SpeedrunRecord[],
): ComputedScoreStats {
  let completedCount = 0;
  let totalStars = 0;
  let perfectCount = 0;
  let tier1Completed = 0;
  let tier5Completed = 0;

  let carStars = 0;
  let boatStars = 0;
  let planeStars = 0;
  let constructionStars = 0;
  let spaceStars = 0;

  let carCount = 0;
  let boatCount = 0;
  let planeCount = 0;
  let constructionCount = 0;
  let spaceCount = 0;

  for (const bp of VEHICLE_BLUEPRINTS) {
    if (bp.category === VehicleCategory.CAR) carCount++;
    else if (bp.category === VehicleCategory.BOAT) boatCount++;
    else if (bp.category === VehicleCategory.PLANE) planeCount++;
    else if (bp.category === VehicleCategory.CONSTRUCTION) constructionCount++;
    else if (bp.category === VehicleCategory.SPACE) spaceCount++;

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
    } else if (bp.tier === DifficultyTier.MASTER) {
      tier5Completed++;
    }

    if (bp.category === VehicleCategory.CAR) {
      carStars += stars;
    } else if (bp.category === VehicleCategory.BOAT) {
      boatStars += stars;
    } else if (bp.category === VehicleCategory.PLANE) {
      planeStars += stars;
    } else if (bp.category === VehicleCategory.CONSTRUCTION) {
      constructionStars += stars;
    } else if (bp.category === VehicleCategory.SPACE) {
      spaceStars += stars;
    }
  }

  const dailyCompletedCount = dailyChallenge
    ? Object.keys(dailyChallenge.completedByDate).length
    : 0;
  const rarePartsCollected = dailyChallenge ? dailyChallenge.collectedRareIds.length : 0;
  const timedRunsCount = speedrunRecords ? speedrunRecords.length : 0;
  const fastestTimeMs =
    speedrunRecords && speedrunRecords.length > 0
      ? Math.min(...speedrunRecords.map((r) => r.timeMs))
      : null;

  return {
    completedCount,
    totalStages: VEHICLE_BLUEPRINTS.length,
    totalStars,
    maxStars: VEHICLE_BLUEPRINTS.length * 3,
    perfectCount,
    tier1Completed,
    tier5Completed,
    carStars,
    carMaxStars: carCount * 3,
    boatStars,
    boatMaxStars: boatCount * 3,
    planeStars,
    planeMaxStars: planeCount * 3,
    constructionStars,
    constructionMaxStars: constructionCount * 3,
    spaceStars,
    spaceMaxStars: spaceCount * 3,
    dailyCompletedCount,
    rarePartsCollected,
    timedRunsCount,
    fastestTimeMs,
  };
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-mechanic',
    icon: BadgeIconKind.WRENCH,
    accentColor: 'sky',
    title: {
      fr: 'Premier Mécanicien',
      en: 'First Mechanic',
      ar: 'الميكانيكي الأول',
    },
    description: {
      fr: 'Assembler complètement ton tout premier véhicule dans l’atelier 3D.',
      en: 'Fully assemble your very first vehicle in the 3D workshop.',
      ar: 'إكمال تجميع أول مركبة لك بالكامل داخل الورشة ثلاثية الأبعاد.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.completedCount, 1);
      return {
        unlocked: s.completedCount >= 1,
        currentValue: cur,
        targetValue: 1,
        progressLabel:
          lang === 'ar'
            ? `${cur} / 1 مركبة`
            : lang === 'en'
              ? `${cur} / 1 vehicle`
              : `${cur} / 1 véhicule`,
      };
    },
  },
  {
    id: 'precision-hand',
    icon: BadgeIconKind.TARGET,
    accentColor: 'emerald',
    title: {
      fr: 'Main de Précision',
      en: 'Precision Hand',
      ar: 'يد الدقة المتقنة',
    },
    description: {
      fr: 'Obtenir un score parfait de 3 étoiles (zéro erreur) sur un niveau.',
      en: 'Achieve a flawless 3-star score (zero mistakes) on a stage.',
      ar: 'تحقيق نتيجة كاملة (3 نجوم بدون أي خطأ) في إحدى المراحل.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.perfectCount, 1);
      return {
        unlocked: s.perfectCount >= 1,
        currentValue: cur,
        targetValue: 1,
        progressLabel:
          lang === 'ar'
            ? `${cur} / 1 مرحلة بـ 3★`
            : lang === 'en'
              ? `${cur} / 1 stage at 3★`
              : `${cur} / 1 niveau à 3★`,
      };
    },
  },
  {
    id: 'daily-craftsman',
    icon: BadgeIconKind.CALENDAR,
    accentColor: 'amber',
    title: {
      fr: 'Artisan du Défi du Jour',
      en: 'Daily Challenge Craftsman',
      ar: 'بطل تحدي اليوم',
    },
    description: {
      fr: 'Terminer un Défi Mécanique du Jour et débloquer une pièce rare en or.',
      en: 'Complete a Daily Mechanical Challenge and unlock a 24K gold rare part.',
      ar: 'إتمام تحدٍ ميكانيكي يومي وربح أول قطعة نادرة مذهّبة.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.dailyCompletedCount, 1);
      return {
        unlocked: s.dailyCompletedCount >= 1,
        currentValue: cur,
        targetValue: 1,
        progressLabel:
          lang === 'ar'
            ? `${cur} / 1 تحدٍ يومي`
            : lang === 'en'
              ? `${cur} / 1 daily build`
              : `${cur} / 1 défi du jour`,
      };
    },
  },
  {
    id: 'rare-collector',
    icon: BadgeIconKind.GEM,
    accentColor: 'emerald',
    title: {
      fr: 'Collectionneur de Pièces Rares',
      en: 'Rare Parts Collector',
      ar: 'جامع القطع النادرة',
    },
    description: {
      fr: 'Réunir au moins 3 pièces rares de collection différentes dans ta vitrine.',
      en: 'Collect at least 3 distinct gleaming rare parts inside your workshop vault.',
      ar: 'جمع 3 قطع نادرة مذهّبة على الأقل داخل خزانة الورشة.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.rarePartsCollected, 3);
      return {
        unlocked: s.rarePartsCollected >= 3,
        currentValue: cur,
        targetValue: 3,
        progressLabel:
          lang === 'ar'
            ? `${s.rarePartsCollected} / 3 قطع نادرة`
            : lang === 'en'
              ? `${s.rarePartsCollected} / 3 rare parts`
              : `${s.rarePartsCollected} / 3 pièces rares`,
      };
    },
  },
  {
    id: 'speed-sprinter',
    icon: BadgeIconKind.TIMER,
    accentColor: 'sky',
    title: {
      fr: 'Éclair du Chronomètre',
      en: 'Stopwatch Lightning',
      ar: 'برق المؤقّت السريع',
    },
    description: {
      fr: 'Assembler complètement un véhicule en moins de 45 secondes avec le mode Chronomètre actif.',
      en: 'Assemble an entire vehicle in under 45 seconds with Stopwatch Mode enabled.',
      ar: 'إتمام تجميع مركبة كاملة في أقل من 45 ثانية أثناء تفعيل وضع المؤقّت.',
    },
    evaluate: (s, lang) => {
      const unlocked = s.fastestTimeMs !== null && s.fastestTimeMs <= 45_000;
      const bestSec =
        s.fastestTimeMs !== null ? `${(s.fastestTimeMs / 1000).toFixed(1)}s` : '—';
      return {
        unlocked,
        currentValue: unlocked ? 1 : 0,
        targetValue: 1,
        progressLabel:
          lang === 'ar'
            ? `أفضل زمن: ${bestSec} (الهدف ≤ 45ث)`
            : lang === 'en'
              ? `Best: ${bestSec} (goal ≤ 45s)`
              : `Record : ${bestSec} (objectif ≤ 45s)`,
      };
    },
  },
  {
    id: 'discovery-graduate',
    icon: BadgeIconKind.COMPASS,
    accentColor: 'sky',
    title: {
      fr: 'Diplômé Découverte',
      en: 'Discovery Graduate',
      ar: 'خريج مستوى الاستكشاف',
    },
    description: {
      fr: 'Terminer au moins 10 véhicules du Palier 1 Découverte.',
      en: 'Complete at least 10 vehicles from Tier 1 Discovery.',
      ar: 'إتمام 10 مركبات على الأقل من المستوى الأول للاستكشاف.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.tier1Completed, 10);
      return {
        unlocked: s.tier1Completed >= 10,
        currentValue: cur,
        targetValue: 10,
        progressLabel: lang === 'ar' ? `${cur} / 10 مراحل` : `${cur} / 10 stages`,
      };
    },
  },
  {
    id: 'road-captain',
    icon: BadgeIconKind.CAR,
    accentColor: 'amber',
    title: {
      fr: 'As de la Route & du Rail',
      en: 'Road & Rail Ace',
      ar: 'بطل البر والقطارات',
    },
    description: {
      fr: 'Obtenir au moins 25 étoiles sur les voitures, camions et trains.',
      en: 'Earn at least 25 stars across cars, rescue trucks, and trains.',
      ar: 'جمع 25 نجمة على الأقل في فئة السيارات والشاحنات والقطارات.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.carStars, 25);
      return {
        unlocked: s.carStars >= 25,
        currentValue: cur,
        targetValue: 25,
        progressLabel: `${s.carStars} / 25 ★`,
      };
    },
  },
  {
    id: 'sea-navigator',
    icon: BadgeIconKind.ANCHOR,
    accentColor: 'indigo',
    title: {
      fr: 'Capitaine des Mers & Abysses',
      en: 'Captain of the Seas',
      ar: 'قبطان البحار والأعماق',
    },
    description: {
      fr: 'Obtenir au moins 25 étoiles sur les voiliers, navires et sous-marins.',
      en: 'Earn at least 25 stars across sailboats, ships, and submersibles.',
      ar: 'جمع 25 نجمة على الأقل في فئة القوارب والسفن والغواصات.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.boatStars, 25);
      return {
        unlocked: s.boatStars >= 25,
        currentValue: cur,
        targetValue: 25,
        progressLabel: `${s.boatStars} / 25 ★`,
      };
    },
  },
  {
    id: 'sky-pilot',
    icon: BadgeIconKind.PLANE,
    accentColor: 'rose',
    title: {
      fr: 'Pilote des Airs',
      en: 'Sky Aviator',
      ar: 'طيار الأجواء المحترف',
    },
    description: {
      fr: 'Obtenir au moins 25 étoiles sur les avions, hydravions et drones.',
      en: 'Earn at least 25 stars across aircraft, helicopters, jets, and drones.',
      ar: 'جمع 25 نجمة على الأقل في فئة الطائرات والمروحيات والدرون.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.planeStars, 25);
      return {
        unlocked: s.planeStars >= 25,
        currentValue: cur,
        targetValue: 25,
        progressLabel: `${s.planeStars} / 25 ★`,
      };
    },
  },
  {
    id: 'site-builder',
    icon: BadgeIconKind.HAMMER,
    accentColor: 'amber',
    title: {
      fr: 'Bâtisseur des Grands Chantiers',
      en: 'Heavy Site Builder',
      ar: 'مهندس البناء والزراعة',
    },
    description: {
      fr: 'Obtenir au moins 25 étoiles sur les pelleteuses, grues et machines agricoles.',
      en: 'Earn at least 25 stars across excavators, cranes, and farm machines.',
      ar: 'جمع 25 نجمة على الأقل في فئة آليات البناء والجرارات والحصادات.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.constructionStars, 25);
      return {
        unlocked: s.constructionStars >= 25,
        currentValue: cur,
        targetValue: 25,
        progressLabel: `${s.constructionStars} / 25 ★`,
      };
    },
  },
  {
    id: 'space-pioneer',
    icon: BadgeIconKind.ROCKET,
    accentColor: 'indigo',
    title: {
      fr: 'Pionnier de l’Espace',
      en: 'Space & Robotics Pioneer',
      ar: 'رائد الفضاء والروبوتات',
    },
    description: {
      fr: 'Obtenir au moins 25 étoiles sur les fusées, rovers, satellites et stations.',
      en: 'Earn at least 25 stars across rockets, rovers, satellites, and stations.',
      ar: 'جمع 25 نجمة على الأقل في فئة الصواريخ والعربات الكوكبية والمحطات.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.spaceStars, 25);
      return {
        unlocked: s.spaceStars >= 25,
        currentValue: cur,
        targetValue: 25,
        progressLabel: `${s.spaceStars} / 25 ★`,
      };
    },
  },
  {
    id: 'expert-assembler',
    icon: BadgeIconKind.AWARD,
    accentColor: 'amber',
    title: {
      fr: 'Expert Assembleur',
      en: 'Expert Assembler',
      ar: 'خبير التجميع الميكانيكي',
    },
    description: {
      fr: 'Cumuler au moins 60 étoiles de réussite à travers le carnet des stages.',
      en: 'Accumulate at least 60 stars across the workshop stage catalog.',
      ar: 'جمع 60 نجمة تفوق على الأقل عبر مراحل اللعبة المختلفة.',
    },
    evaluate: (s) => {
      const cur = Math.min(s.totalStars, 60);
      return {
        unlocked: s.totalStars >= 60,
        currentValue: cur,
        targetValue: 60,
        progressLabel: `${s.totalStars} / 60 ★`,
      };
    },
  },
  {
    id: 'flawless-streak',
    icon: BadgeIconKind.STAR,
    accentColor: 'emerald',
    title: {
      fr: 'Virtuose Sans Faute',
      en: 'Flawless Virtuoso',
      ar: 'أستاذ الدقة بلا أخطاء',
    },
    description: {
      fr: 'Réussir 20 niveaux différents avec le score maximal de 3 étoiles.',
      en: 'Complete 20 distinct stages with a perfect 3-star rating.',
      ar: 'إنجاز 20 مرحلة مختلفة بالعلامة الكاملة (3 نجوم بدون أخطاء).',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.perfectCount, 20);
      return {
        unlocked: s.perfectCount >= 20,
        currentValue: cur,
        targetValue: 20,
        progressLabel:
          lang === 'ar'
            ? `${cur} / 20 مرحلة بـ 3★`
            : lang === 'en'
              ? `${cur} / 20 stages at 3★`
              : `${cur} / 20 niveaux à 3★`,
      };
    },
  },
  {
    id: 'architect-fifty',
    icon: BadgeIconKind.COMPASS,
    accentColor: 'sky',
    title: {
      fr: 'Architecte des 50 Machines',
      en: 'Architect of 50 Machines',
      ar: 'مهندس الـ 50 آلة',
    },
    description: {
      fr: 'Assembler complètement 50 véhicules différents dans l’atelier 3D.',
      en: 'Fully assemble 50 distinct vehicles in the 3D workshop.',
      ar: 'إتمام بناء 50 مركبة وآلة مختلفة بالكامل في الورشة.',
    },
    evaluate: (s, lang) => {
      const cur = Math.min(s.completedCount, 50);
      return {
        unlocked: s.completedCount >= 50,
        currentValue: cur,
        targetValue: 50,
        progressLabel:
          lang === 'ar'
            ? `${cur} / 50 مركبة`
            : lang === 'en'
              ? `${cur} / 50 vehicles`
              : `${cur} / 50 véhicules`,
      };
    },
  },
  {
    id: 'master-engineer',
    icon: BadgeIconKind.TROPHY,
    accentColor: 'amber',
    title: {
      fr: 'Maître des 100 Objets 3D',
      en: 'Master of 100 3D Machines',
      ar: 'كبير بناة الـ 100 مجسّم',
    },
    description: {
      fr: 'Terminer les 100 objets mécaniques avec au moins 250 étoiles sur 300 !',
      en: 'Complete all 100 mechanical objects with at least 250 out of 300 stars!',
      ar: 'إتمام جميع المجسّمات الميكانيكية الـ 100 برصيد لا يقل عن 250 نجمة من 300!',
    },
    evaluate: (s) => {
      const unlocked = s.completedCount >= 100 && s.totalStars >= 250;
      const cur = Math.min(s.completedCount, 100);
      return {
        unlocked,
        currentValue: unlocked ? 100 : cur,
        targetValue: 100,
        progressLabel: `${s.completedCount}/100 · ${s.totalStars}/250 ★`,
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
          { min: 9, title: 'ميكانيكي ناشئ' },
          { min: 30, title: 'فني الورشة' },
          { min: 75, title: 'خبير التجميع' },
          { min: 140, title: 'مهندس النظم المتقدمة' },
          { min: 210, title: 'كبير المصممين الصناعيين' },
          { min: 270, title: 'أسطورة البناء الميكانيكي 3D' },
        ]
      : lang === 'en'
        ? [
            { min: 0, title: 'Curious Apprentice' },
            { min: 9, title: 'Junior Mechanic' },
            { min: 30, title: 'Workshop Technician' },
            { min: 75, title: 'Expert Assembler' },
            { min: 140, title: 'Systems Engineer' },
            { min: 210, title: 'Chief Mechanical Architect' },
            { min: 270, title: 'Legendary Master of 100 Machines' },
          ]
        : [
            { min: 0, title: 'Apprenti Curieux' },
            { min: 9, title: 'Jeune Mécanicien' },
            { min: 30, title: "Technicien d'Atelier" },
            { min: 75, title: 'Expert Assembleur' },
            { min: 140, title: 'Ingénieur Systèmes' },
            { min: 210, title: 'Architecte Mécanique en Chef' },
            { min: 270, title: 'Maître Légendaire des 100 Objets' },
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
        : lang === 'en'
          ? `${needed} more ★ for "${next.title}"`
          : `Encore ${needed} ★ pour le rang « ${next.title} »`,
  };
}

export function evaluatePlayerProgression(
  completedStages: Record<string, StageCompletionRecord>,
  unlockedBadges: Record<string, number>,
  lang: LanguageCode,
  dailyChallenge?: DailyChallengeState,
  speedrunRecords?: SpeedrunRecord[],
): PlayerProgressionSummary {
  const stats = computeScoreStats(completedStages, dailyChallenge, speedrunRecords);
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
  dailyChallenge?: DailyChallengeState,
  speedrunRecords?: SpeedrunRecord[],
): {
  updatedUnlocked: Record<string, number>;
  newlyUnlockedIds: string[];
} {
  const stats = computeScoreStats(completedStages, dailyChallenge, speedrunRecords);
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
