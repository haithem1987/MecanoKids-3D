import { syncUnlockedBadgesMap } from '../data/badges';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import {
  buildDailyBlueprintForDate,
  createEmptyDailyChallengeState,
  getTodayDateKey,
  RARE_COLLECTIBLES_CATALOG,
} from '../data/dailyChallenges';
import {
  CameraPreset,
  DailyChallengeState,
  DailyCompletionEntry,
  DifficultyTier,
  LanguageCode,
  PlayerProgress,
  SpeedrunRecord,
  StageCompletionRecord,
  StageInProgressRecord,
  VehicleCategory,
  VisualStyleMode,
} from '../types/game';
import { MAX_SPEEDRUN_HISTORY } from './speedrun';

export const SAVE_STORAGE_KEY = 'mecanokids_3d_save_v2';
const LEGACY_STORAGE_KEY = 'mecanokids_3d_progress_v1';

const VALID_STYLES = new Set<string>([
  VisualStyleMode.WOOD,
  VisualStyleMode.BLOCKS,
  VisualStyleMode.REALISTIC,
]);

const VALID_CAMERAS = new Set<string>([
  CameraPreset.ISO,
  CameraPreset.FRONT,
  CameraPreset.SIDE,
  CameraPreset.TOP,
]);

const VALID_CATEGORIES = new Set<string>([
  VehicleCategory.CAR,
  VehicleCategory.BOAT,
  VehicleCategory.PLANE,
  VehicleCategory.CONSTRUCTION,
  VehicleCategory.SPACE,
]);

const VALID_RARE_IDS = new Set<string>(RARE_COLLECTIBLES_CATALOG.map((r) => r.id));

export function createDefaultProgress(
  language: LanguageCode = 'fr',
  keepTutorialSeen = false,
): PlayerProgress {
  return {
    currentBlueprintId: VEHICLE_BLUEPRINTS[0].id,
    lastStandardBlueprintId: VEHICLE_BLUEPRINTS[0].id,
    inProgressStages: {},
    completedStages: {},
    dailyChallenge: createEmptyDailyChallengeState(),
    speedrunRecords: [],
    timerModeEnabled: false,
    unlockedBadges: {},
    language,
    preferredStyle: VisualStyleMode.WOOD,
    cameraPreset: CameraPreset.ISO,
    freeWorkshopUnlocked: false,
    muted: false,
    tutorialSeen: keepTutorialSeen,
    lastSavedAt: Date.now(),
  };
}

function sanitizeDailyChallenge(raw: unknown): DailyChallengeState {
  const empty = createEmptyDailyChallengeState();
  if (!raw || typeof raw !== 'object') return empty;

  const obj = raw as Record<string, unknown>;
  const completedByDate: Record<string, DailyCompletionEntry> = {};

  if (obj.completedByDate && typeof obj.completedByDate === 'object') {
    for (const [dateKey, entry] of Object.entries(
      obj.completedByDate as Record<string, unknown>,
    )) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !entry || typeof entry !== 'object') continue;
      const e = entry as Record<string, unknown>;
      completedByDate[dateKey] = {
        stars: typeof e.stars === 'number' ? Math.max(1, Math.min(3, Math.round(e.stars))) : 3,
        completedAt: typeof e.completedAt === 'number' ? e.completedAt : Date.now(),
        rareCollectibleId:
          typeof e.rareCollectibleId === 'string' ? e.rareCollectibleId : '',
        templateId: typeof e.templateId === 'string' ? e.templateId : '',
        bestTimeMs:
          typeof e.bestTimeMs === 'number' && e.bestTimeMs > 0
            ? Math.round(e.bestTimeMs)
            : undefined,
      };
    }
  }

  const collectedSet = new Set<string>();
  if (Array.isArray(obj.collectedRareIds)) {
    for (const id of obj.collectedRareIds) {
      if (typeof id === 'string' && VALID_RARE_IDS.has(id)) {
        collectedSet.add(id);
      }
    }
  }
  for (const entry of Object.values(completedByDate)) {
    if (VALID_RARE_IDS.has(entry.rareCollectibleId)) {
      collectedSet.add(entry.rareCollectibleId);
    }
  }

  const currentStreak =
    typeof obj.currentStreak === 'number' ? Math.max(0, Math.round(obj.currentStreak)) : 0;
  const bestStreak =
    typeof obj.bestStreak === 'number'
      ? Math.max(currentStreak, Math.round(obj.bestStreak))
      : currentStreak;
  const lastCompletedDate =
    typeof obj.lastCompletedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(obj.lastCompletedDate)
      ? obj.lastCompletedDate
      : null;

  return {
    completedByDate,
    collectedRareIds: Array.from(collectedSet),
    currentStreak,
    bestStreak,
    lastCompletedDate,
  };
}

function sanitizeSpeedrunRecords(raw: unknown): SpeedrunRecord[] {
  if (!Array.isArray(raw)) return [];
  const valid: SpeedrunRecord[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    if (typeof r.blueprintId !== 'string' || typeof r.timeMs !== 'number' || r.timeMs <= 0) {
      continue;
    }
    const category =
      typeof r.category === 'string' && VALID_CATEGORIES.has(r.category)
        ? (r.category as VehicleCategory)
        : VehicleCategory.CAR;
    const tierNum = typeof r.tier === 'number' ? Math.max(1, Math.min(5, Math.round(r.tier))) : 1;

    valid.push({
      id: typeof r.id === 'string' && r.id ? r.id : `${r.blueprintId}-${Date.now()}-${valid.length}`,
      blueprintId: r.blueprintId,
      stageNumber: typeof r.stageNumber === 'number' ? Math.max(0, Math.round(r.stageNumber)) : 0,
      category,
      tier: tierNum as DifficultyTier,
      partsCount: typeof r.partsCount === 'number' ? Math.max(1, Math.round(r.partsCount)) : 4,
      timeMs: Math.round(r.timeMs),
      mistakesCount: typeof r.mistakesCount === 'number' ? Math.max(0, Math.round(r.mistakesCount)) : 0,
      stars: typeof r.stars === 'number' ? Math.max(1, Math.min(3, Math.round(r.stars))) : 3,
      achievedAt: typeof r.achievedAt === 'number' ? r.achievedAt : Date.now(),
      isDailyBonus: Boolean(r.isDailyBonus),
      vehicleNameFr: typeof r.vehicleNameFr === 'string' ? r.vehicleNameFr : undefined,
      vehicleNameEn: typeof r.vehicleNameEn === 'string' ? r.vehicleNameEn : undefined,
      vehicleNameAr: typeof r.vehicleNameAr === 'string' ? r.vehicleNameAr : undefined,
    });
  }
  valid.sort((a, b) => a.timeMs - b.timeMs);
  return valid.slice(0, MAX_SPEEDRUN_HISTORY);
}

export function sanitizeProgress(raw: unknown): PlayerProgress {
  const fallback = createDefaultProgress();
  if (!raw || typeof raw !== 'object') return fallback;

  const obj = raw as Record<string, unknown>;
  const blueprintMap = new Map(VEHICLE_BLUEPRINTS.map((bp) => [bp.id, bp]));

  const todayKey = getTodayDateKey();
  const todayDaily = buildDailyBlueprintForDate(todayKey);
  blueprintMap.set(todayDaily.blueprint.id, todayDaily.blueprint);

  const lastStandardBlueprintId =
    typeof obj.lastStandardBlueprintId === 'string' &&
    !obj.lastStandardBlueprintId.startsWith('daily-') &&
    blueprintMap.has(obj.lastStandardBlueprintId)
      ? obj.lastStandardBlueprintId
      : typeof obj.currentBlueprintId === 'string' &&
          !obj.currentBlueprintId.startsWith('daily-') &&
          blueprintMap.has(obj.currentBlueprintId)
        ? obj.currentBlueprintId
        : VEHICLE_BLUEPRINTS[0].id;

  const candidateBpId =
    typeof obj.currentBlueprintId === 'string' && blueprintMap.has(obj.currentBlueprintId)
      ? obj.currentBlueprintId
      : lastStandardBlueprintId;

  const language: LanguageCode =
    obj.language === 'ar' ? 'ar' : obj.language === 'en' ? 'en' : 'fr';

  const preferredStyle: VisualStyleMode =
    typeof obj.preferredStyle === 'string' && VALID_STYLES.has(obj.preferredStyle)
      ? (obj.preferredStyle as VisualStyleMode)
      : VisualStyleMode.WOOD;

  const cameraPreset: CameraPreset =
    typeof obj.cameraPreset === 'string' && VALID_CAMERAS.has(obj.cameraPreset)
      ? (obj.cameraPreset as CameraPreset)
      : CameraPreset.ISO;

  const completedStages: Record<string, StageCompletionRecord> = {};
  if (obj.completedStages && typeof obj.completedStages === 'object') {
    for (const [bpId, rec] of Object.entries(obj.completedStages as Record<string, unknown>)) {
      if (bpId.startsWith('daily-') || !blueprintMap.has(bpId) || !rec || typeof rec !== 'object')
        continue;
      const r = rec as Record<string, unknown>;
      if (r.completed) {
        completedStages[bpId] = {
          completed: true,
          stars:
            typeof r.stars === 'number' ? Math.max(1, Math.min(3, Math.round(r.stars))) : 3,
          bestMistakes:
            typeof r.bestMistakes === 'number' ? Math.max(0, Math.round(r.bestMistakes)) : 0,
          bestTimeMs:
            typeof r.bestTimeMs === 'number' && r.bestTimeMs > 0
              ? Math.round(r.bestTimeMs)
              : undefined,
          completedAt: typeof r.completedAt === 'number' ? r.completedAt : undefined,
        };
      }
    }
  }

  const inProgressStages: Record<string, StageInProgressRecord> = {};
  if (obj.inProgressStages && typeof obj.inProgressStages === 'object') {
    for (const [bpId, rec] of Object.entries(obj.inProgressStages as Record<string, unknown>)) {
      const bp = blueprintMap.get(bpId);
      if (!bp || !rec || typeof rec !== 'object') continue;
      const r = rec as Record<string, unknown>;
      const validPartIds = new Set(bp.parts.map((p) => p.id));
      const placedPartIds = Array.isArray(r.placedPartIds)
        ? r.placedPartIds.filter(
            (id): id is string => typeof id === 'string' && validPartIds.has(id),
          )
        : [];
      const uniquePlaced = Array.from(new Set(placedPartIds));
      inProgressStages[bpId] = {
        placedPartIds: uniquePlaced,
        mistakesCount:
          typeof r.mistakesCount === 'number' ? Math.max(0, Math.round(r.mistakesCount)) : 0,
        elapsedMs:
          typeof r.elapsedMs === 'number' && r.elapsedMs >= 0 ? Math.round(r.elapsedMs) : 0,
        updatedAt: typeof r.updatedAt === 'number' ? r.updatedAt : Date.now(),
      };
    }
  }

  const dailyChallenge = sanitizeDailyChallenge(obj.dailyChallenge);
  const speedrunRecords = sanitizeSpeedrunRecords(obj.speedrunRecords);

  const rawUnlocked: Record<string, number> = {};
  if (obj.unlockedBadges && typeof obj.unlockedBadges === 'object') {
    for (const [badgeId, ts] of Object.entries(obj.unlockedBadges as Record<string, unknown>)) {
      if (typeof ts === 'number' && ts > 0) {
        rawUnlocked[badgeId] = ts;
      }
    }
  }

  // Backfill any badges earned from completedStages, dailyChallenge & speedrunRecords
  const { updatedUnlocked } = syncUnlockedBadgesMap(
    completedStages,
    rawUnlocked,
    dailyChallenge,
    speedrunRecords,
  );

  return {
    currentBlueprintId: candidateBpId,
    lastStandardBlueprintId,
    inProgressStages,
    completedStages,
    dailyChallenge,
    speedrunRecords,
    timerModeEnabled: Boolean(obj.timerModeEnabled),
    unlockedBadges: updatedUnlocked,
    language,
    preferredStyle,
    cameraPreset,
    freeWorkshopUnlocked: Boolean(obj.freeWorkshopUnlocked),
    muted: Boolean(obj.muted),
    tutorialSeen: Boolean(obj.tutorialSeen),
    lastSavedAt: typeof obj.lastSavedAt === 'number' ? obj.lastSavedAt : Date.now(),
  };
}

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined') return createDefaultProgress();
  try {
    const rawV2 = window.localStorage.getItem(SAVE_STORAGE_KEY);
    if (rawV2) {
      return sanitizeProgress(JSON.parse(rawV2));
    }

    const rawLegacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawLegacy) {
      const migrated = sanitizeProgress(JSON.parse(rawLegacy));
      savePlayerProgress(migrated);
      return migrated;
    }
  } catch {
    // Fallback to clean progress if localStorage is blocked or malformed
  }
  return createDefaultProgress();
}

export function savePlayerProgress(progress: PlayerProgress): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const payload: PlayerProgress = {
      ...progress,
      lastSavedAt: Date.now(),
    };
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function downloadProgressBackup(progress: PlayerProgress): void {
  if (typeof document === 'undefined') return;
  const json = JSON.stringify(progress, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const datePart = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `mecanokids-3d-sauvegarde-${datePart}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
