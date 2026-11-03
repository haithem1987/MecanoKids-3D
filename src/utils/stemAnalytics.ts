import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { DifficultyTier, LanguageCode, PlayerProgress, VehicleCategory } from '../types/game';

export type StemPillarId =
  | 'sequential_logic'
  | 'spatial_3d'
  | 'diagnostic_analysis'
  | 'technical_lexicon';

export interface StemPillarScore {
  id: StemPillarId;
  score: number; // 0..100
  title: string;
  summary: string;
  evidenceLine: string;
}

export type DiplomaMilestoneId =
  | 'diploma_1'
  | 'diploma_10'
  | 'diploma_25'
  | 'diploma_50'
  | 'diploma_100';

export interface DiplomaMilestoneEvaluation {
  id: DiplomaMilestoneId;
  requiredVehicles: number;
  unlocked: boolean;
  rankTitle: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
}

export interface StemCompetencyReport {
  completedVehicles: number;
  totalCatalogVehicles: number;
  totalStars: number;
  maxCatalogStars: number;
  flawlessThreeStarCount: number;
  patentsCount: number;
  repairsCompletedCount: number;
  noSilhouetteCount: number;
  uniqueFamiliesExplored: number;
  distinctPartsMastered: number;
  overallStemIndex: number;
  pillars: StemPillarScore[];
  diplomas: DiplomaMilestoneEvaluation[];
  highestUnlockedDiploma: DiplomaMilestoneEvaluation | null;
}

export const DIPLOMA_MILESTONES: ReadonlyArray<{
  id: DiplomaMilestoneId;
  requiredVehicles: number;
  rankTitle: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
}> = [
  {
    id: 'diploma_1',
    requiredVehicles: 1,
    rankTitle: {
      fr: 'Brevet d’Initiation Mécanique',
      en: 'Junior Mechanical Initiation Certificate',
      ar: 'شهادة التمهيد في الهندسة الميكانيكية',
    },
    subtitle: {
      fr: 'Premier assemblage tridimensionnel complet validé à l’atelier',
      en: 'First complete 3D mechanical assembly validated in the workshop',
      ar: 'إتمام أول تجميع ميكانيكي ثلاثي الأبعاد بنجاح في الورشة',
    },
  },
  {
    id: 'diploma_10',
    requiredVehicles: 10,
    rankTitle: {
      fr: 'Diplôme d’Apprenti Mécanicien',
      en: 'Apprentice Mechanic Diploma',
      ar: 'دبلوم الميكانيكي المتدرب',
    },
    subtitle: {
      fr: '10 machines assemblées dans le respect de l’ordre structurel',
      en: '10 machines assembled following structural engineering order',
      ar: 'تجميع 10 مركبات وفق التسلسل الهندسي السليم',
    },
  },
  {
    id: 'diploma_25',
    requiredVehicles: 25,
    rankTitle: {
      fr: 'Diplôme de Constructeur Confirmé',
      en: 'Certified Mechanical Builder Diploma',
      ar: 'دبلوم البنّاء الميكانيكي المعتمد',
    },
    subtitle: {
      fr: '25 engins maîtrisés à travers plusieurs familles techniques',
      en: '25 machines mastered across multiple engineering families',
      ar: 'إتقان بناء 25 آلة عبر عدة عائلات تقنية',
    },
  },
  {
    id: 'diploma_50',
    requiredVehicles: 50,
    rankTitle: {
      fr: 'Diplôme d’Ingénieur Chef d’Atelier',
      en: 'Chief Workshop Engineer Diploma',
      ar: 'دبلوم كبير مهندسي الورشة',
    },
    subtitle: {
      fr: '50 architectures complexes montées, inspectées et testées en 3D',
      en: '50 complex architectures assembled, inspected, and tested in 3D',
      ar: 'تركيب وفحص واختبار 50 بنية ميكانيكية متقدمة ثلاثية الأبعاد',
    },
  },
  {
    id: 'diploma_100',
    requiredVehicles: 100,
    rankTitle: {
      fr: 'Grand Diplôme d’Honneur des 100 Machines',
      en: 'Grand Master Diploma of 100 Machines',
      ar: 'الدبلوم الشرفي الأعلى لمئة آلة',
    },
    subtitle: {
      fr: 'Maîtrise intégrale des 100 modèles terrestres, marins, aériens et spatiaux',
      en: 'Complete mastery of all 100 land, sea, air, construction, and space machines',
      ar: 'إتقان كامل لجميع المركبات المئة البرية والبحرية والجوية والفضائية',
    },
  },
];

const BLUEPRINT_MAP = new Map(VEHICLE_BLUEPRINTS.map((bp) => [bp.id, bp]));

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function computeStemCompetencyReport(
  progress: PlayerProgress,
  lang: LanguageCode,
): StemCompetencyReport {
  const completedEntries = Object.entries(progress.completedStages).filter(
    ([bpId, rec]) => rec.completed && BLUEPRINT_MAP.has(bpId),
  );

  const completedVehicles = completedEntries.length;
  const totalCatalogVehicles = VEHICLE_BLUEPRINTS.length;
  const maxCatalogStars = totalCatalogVehicles * 3;

  let totalStars = 0;
  let flawlessThreeStarCount = 0;
  let multiLayerBuildsCount = 0;
  let weightedTierPoints = 0;
  const familiesSet = new Set<VehicleCategory>();
  let totalPartsInstalled = 0;

  for (const [bpId, rec] of completedEntries) {
    totalStars += rec.stars;
    if (rec.stars >= 3 && rec.bestMistakes === 0) {
      flawlessThreeStarCount += 1;
    }
    const bp = BLUEPRINT_MAP.get(bpId);
    if (bp) {
      familiesSet.add(bp.category);
      totalPartsInstalled += bp.parts.length;
      if (bp.tier >= DifficultyTier.WORKSHOP) {
        multiLayerBuildsCount += 1;
      }
      weightedTierPoints += bp.tier;
    }
  }

  const patentsCount = Object.keys(progress.engineeringPatents).length;
  const repairsCompletedCount = Object.values(progress.repairedStages).reduce(
    (sum, n) => sum + (typeof n === 'number' ? n : 0),
    0,
  );
  const noSilhouetteCount = Object.keys(progress.masterNoSilhouetteStages).length;
  const uniqueFamiliesExplored = familiesSet.size;
  const timedRunsCount = progress.speedrunRecords.length;

  // 1. Sequential & Structural Logic (0..100)
  // Rewards progression across stages and higher-tier multi-dependency vehicles
  const sequentialScore = clampPercent(
    completedVehicles === 0
      ? 0
      : Math.min(60, completedVehicles * 2.2) +
          Math.min(40, multiLayerBuildsCount * 2.5 + weightedTierPoints * 0.35),
  );

  // 2. 3D Visuo-Spatial Precision (0..100)
  // Rewards zero-mistake 3-star accuracy, completed volume, and No-Silhouette builds
  const accuracyRatio = completedVehicles > 0 ? flawlessThreeStarCount / completedVehicles : 0;
  const spatialScore = clampPercent(
    completedVehicles === 0
      ? 0
      : accuracyRatio * 55 +
          Math.min(25, completedVehicles * 1.1) +
          Math.min(20, noSilhouetteCount * 5),
  );

  // 3. Diagnostic & Troubleshooting (0..100)
  // Rewards active fault-finding missions, timed runs, and zero-error discipline
  const diagnosticScore = clampPercent(
    repairsCompletedCount === 0 && completedVehicles === 0
      ? 0
      : Math.min(65, repairsCompletedCount * 13) +
          Math.min(20, timedRunsCount * 4) +
          Math.min(15, flawlessThreeStarCount * 1.5),
  );

  // 4. Mechanical Culture & Trilingual Lexicon (0..100)
  // Rewards Engineering Patent quizzes passed, family diversity (5 universes), and parts vocabulary
  const lexiconScore = clampPercent(
    completedVehicles === 0 && patentsCount === 0
      ? 0
      : Math.min(50, patentsCount * 10) +
          uniqueFamiliesExplored * 6 +
          Math.min(20, totalPartsInstalled * 0.25),
  );

  const pillars: StemPillarScore[] =
    lang === 'ar'
      ? [
          {
            id: 'sequential_logic',
            score: sequentialScore,
            title: 'المنطق التسلسلي والهيكلي',
            summary: 'احترام ترتيب التجميع الميكانيكي (الهيكل الحامل ثم المحرك ثم المقصورة).',
            evidenceLine: `${completedVehicles} مركبة مكتملة · ${multiLayerBuildsCount} بنية متعددة الطبقات`,
          },
          {
            id: 'spatial_3d',
            score: spatialScore,
            title: 'الإدراك البصري المكاني ثلاثي الأبعاد',
            summary: 'دقة توجيه القطع في الفضاء ثلاثي الأبعاد والتركيب بدون أطياف إرشادية.',
            evidenceLine: `${flawlessThreeStarCount} تجميع بلا أخطاء (3★) · ${noSilhouetteCount} بوضع الخبير بدون طيف`,
          },
          {
            id: 'diagnostic_analysis',
            score: diagnosticScore,
            title: 'التشخيص وإصلاح الأعطال',
            summary: 'رصد القطع المختلّة فوق المجسّم وفكّها وإعادة تركيبها بالترتيب الصحيح.',
            evidenceLine: `${repairsCompletedCount} مهمة إصلاح ناجحة · ${timedRunsCount} سباق زمن مسجّل`,
          },
          {
            id: 'technical_lexicon',
            score: lexiconScore,
            title: 'الثقافة والمفردات الهندسية',
            summary: 'استيعاب وظيفة كل قطعة واجتياز اختبارات براءة المهندس عبر العائلات الخمس.',
            evidenceLine: `${patentsCount} براءة مهندس · ${uniqueFamiliesExplored}/5 عائلات · ${totalPartsInstalled} قطعة مركّبة`,
          },
        ]
      : lang === 'en'
        ? [
            {
              id: 'sequential_logic',
              score: sequentialScore,
              title: 'Sequential & Structural Logic',
              summary: 'Respecting structural assembly dependencies (frame → drivetrain → bodywork).',
              evidenceLine: `${completedVehicles} completed builds · ${multiLayerBuildsCount} multi-layer machines`,
            },
            {
              id: 'spatial_3d',
              score: spatialScore,
              title: '3D Visuo-Spatial Precision',
              summary: 'Accurate 3D orientation, zero-mistake builds, and Master No-Silhouette deductions.',
              evidenceLine: `${flawlessThreeStarCount} flawless builds (3★) · ${noSilhouetteCount} without guide silhouettes`,
            },
            {
              id: 'diagnostic_analysis',
              score: diagnosticScore,
              title: 'Diagnostic & Troubleshooting',
              summary: 'Identifying misaligned parts on the 3D model, extracting them, and rebuilding cleanly.',
              evidenceLine: `${repairsCompletedCount} repair missions · ${timedRunsCount} timed precision runs`,
            },
            {
              id: 'technical_lexicon',
              score: lexiconScore,
              title: 'Mechanical Culture & Lexicon',
              summary: 'Mastering real-world engineering principles and passing Patent Quizzes across 5 universes.',
              evidenceLine: `${patentsCount} engineering patents · ${uniqueFamiliesExplored}/5 families · ${totalPartsInstalled} parts installed`,
            },
          ]
        : [
            {
              id: 'sequential_logic',
              score: sequentialScore,
              title: 'Logique séquentielle & structurelle',
              summary: 'Respect de l’ordre mécanique porteur (châssis → motorisation → carrosserie).',
              evidenceLine: `${completedVehicles} véhicules terminés · ${multiLayerBuildsCount} engins multicouches`,
            },
            {
              id: 'spatial_3d',
              score: spatialScore,
              title: 'Repérage visuo-spatial 3D',
              summary: 'Précision de pose dans l’espace 3D, montages sans faute et mode Sans silhouette.',
              evidenceLine: `${flawlessThreeStarCount} montages sans faute (3★) · ${noSilhouetteCount} sans silhouette guide`,
            },
            {
              id: 'diagnostic_analysis',
              score: diagnosticScore,
              title: 'Esprit d’analyse & diagnostic',
              summary: 'Repérage des anomalies sur le modèle 3D, démontage ciblé et remise en état.',
              evidenceLine: `${repairsCompletedCount} missions réparation · ${timedRunsCount} chronos officiels`,
            },
            {
              id: 'technical_lexicon',
              score: lexiconScore,
              title: 'Culture & lexique mécanique',
              summary: 'Compréhension du rôle réel des pièces et réussite aux quiz Brevet d’Ingénieur.',
              evidenceLine: `${patentsCount} brevets obtenus · ${uniqueFamiliesExplored}/5 univers · ${totalPartsInstalled} pièces posées`,
            },
          ];

  const overallStemIndex = clampPercent(
    (sequentialScore + spatialScore + diagnosticScore + lexiconScore) / 4,
  );

  const diplomas: DiplomaMilestoneEvaluation[] = DIPLOMA_MILESTONES.map((m) => ({
    id: m.id,
    requiredVehicles: m.requiredVehicles,
    unlocked: completedVehicles >= m.requiredVehicles,
    rankTitle: m.rankTitle,
    subtitle: m.subtitle,
  }));

  const unlockedDiplomas = diplomas.filter((d) => d.unlocked);
  const highestUnlockedDiploma =
    unlockedDiplomas.length > 0 ? unlockedDiplomas[unlockedDiplomas.length - 1] : null;

  return {
    completedVehicles,
    totalCatalogVehicles,
    totalStars,
    maxCatalogStars,
    flawlessThreeStarCount,
    patentsCount,
    repairsCompletedCount,
    noSilhouetteCount,
    uniqueFamiliesExplored,
    distinctPartsMastered: totalPartsInstalled,
    overallStemIndex,
    pillars,
    diplomas,
    highestUnlockedDiploma,
  };
}

// --- Événements anonymes (aucun identifiant enfant) ---

export type AnalyticsEvent =
  | 'game_started'
  | 'tutorial_completed'
  | 'mission_started'
  | 'part_selected'
  | 'part_snapped'
  | 'assembly_failed'
  | 'undo_used'
  | 'hint_requested'
  | 'mission_completed'
  | 'diagnostic_solved'
  | 'paywall_shown'
  | 'purchase_completed';

interface EventEntry {
  event: AnalyticsEvent;
  props?: Record<string, unknown>;
}

const _queue: EventEntry[] = [];

export function track(event: AnalyticsEvent, props?: Record<string, unknown>): void {
  _queue.push({ event, props });
  if (typeof window !== 'undefined') {
    (window as unknown as { zaraz?: { track: (e: string, p?: unknown) => void } }).zaraz?.track(
      event,
      props,
    );
  }
}

/** Exposed only for unit tests */
export function _getQueue(): ReadonlyArray<EventEntry> {
  return _queue;
}
export function _clearQueue(): void {
  _queue.length = 0;
}

// --- Sentry (erreurs WebGL uniquement, lazy-loadé) ---

let _sentryLoaded = false;

export async function captureWebGLError(err: unknown): Promise<void> {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;
  try {
    const sentry = await import('@sentry/browser');
    if (!_sentryLoaded) {
      sentry.init({ dsn, release: import.meta.env.VITE_APP_VERSION as string | undefined });
      _sentryLoaded = true;
    }
    sentry.captureException(err, { tags: { subsystem: 'webgl' } });
  } catch {
    // Ignore si Sentry ne peut pas se charger (hors-ligne, CSP, etc.)
  }
}

// --- Cloudflare Web Analytics beacon ---

export function initAnalytics(): void {
  const token = import.meta.env.VITE_CF_ANALYTICS_TOKEN as string | undefined;
  if (!token || typeof document === 'undefined') return;
  if (document.querySelector('script[data-cf-beacon]')) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(script);
}
