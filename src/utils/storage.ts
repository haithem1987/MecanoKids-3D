import { syncUnlockedBadgesMap } from '../data/badges';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import {
  buildDailyBlueprintForDate,
  createEmptyDailyChallengeState,
  getTodayDateKey,
  RARE_COLLECTIBLES_CATALOG,
} from '../data/dailyChallenges';
import {
  AgeProfile,
  CameraPreset,
  DailyChallengeState,
  DailyCompletionEntry,
  DifficultyTier,
  EngineeringPatentRecord,
  LanguageCode,
  LicenseState,
  LiveryPresetId,
  MultiProfileStore,
  PlayerProfile,
  PlayerProgress,
  ProfileAvatarColor,
  ProfileAvatarIcon,
  SpeedrunRecord,
  StageCompletionRecord,
  StageInProgressRecord,
  VehicleCategory,
  VisualStyleMode,
  WorkbenchEnvironmentMode,
} from '../types/game';
import { VALID_LIVERY_IDS } from '../data/liveries';
import type { Tier as LicenseTier } from './entitlements';
import { createEmptyDailyStreakState, sanitizeDailyStreak } from './dailyStreak';
import { createDefaultParentalSettings, sanitizeParentalSettings } from './sessionTimer';
import { MAX_SPEEDRUN_HISTORY } from './speedrun';

export const SAVE_STORAGE_KEY = 'mecanokids_3d_save_v2';
export const PROFILES_STORAGE_KEY = 'mecanokids_3d_profiles_v1';
const LEGACY_STORAGE_KEY = 'mecanokids_3d_progress_v1';

export const MAX_LOCAL_PROFILES = 8;

const VALID_AGE_PROFILES = new Set<AgeProfile>(['5-7', '8-10', '11-12']);

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

const VALID_AVATAR_COLORS = new Set<ProfileAvatarColor>([
  'sky',
  'amber',
  'emerald',
  'indigo',
  'rose',
]);

const VALID_AVATAR_ICONS = new Set<ProfileAvatarIcon>([
  'wrench',
  'car',
  'rocket',
  'anchor',
  'plane',
]);

const VALID_RARE_IDS = new Set<string>(RARE_COLLECTIBLES_CATALOG.map((r) => r.id));

export function getDefaultProfileName(lang: LanguageCode, index = 1): string {
  if (lang === 'ar') return `الميكانيكي ${index}`;
  if (lang === 'en') return `Builder ${index}`;
  return `Mécanicien ${index}`;
}

export function createDefaultProgress(
  language: LanguageCode = 'fr',
  keepTutorialSeen = false,
): PlayerProgress {
  return {
    licenseState: { tier: 'discovery' as const },
    currentBlueprintId: VEHICLE_BLUEPRINTS[0].id,
    lastStandardBlueprintId: VEHICLE_BLUEPRINTS[0].id,
    inProgressStages: {},
    completedStages: {},
    dailyChallenge: createEmptyDailyChallengeState(),
    dailyStreak: createEmptyDailyStreakState(),
    speedrunRecords: [],
    timerModeEnabled: false,
    unlockedBadges: {},
    customLiveries: {},
    engineeringPatents: {},
    repairedStages: {},
    masterNoSilhouetteStages: {},
    noSilhouetteMode: false,
    environmentMode: 'auto_thematic',
    language,
    preferredStyle: VisualStyleMode.WOOD,
    cameraPreset: CameraPreset.ISO,
    freeWorkshopUnlocked: false,
    muted: false,
    volumeSfx: 1,
    volumeVoice: 1,
    classroomSilent: false,
    tbiMode: false,
    voiceAutoRead: false,
    tutorialSeen: keepTutorialSeen,
    diagnosticTutorialSeen: false,
    partsTrayPosition: 'bottom',
    partsTrayAutoHide: true,
    licenseActive: false,
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

const VALID_LICENSE_TIERS = new Set<LicenseTier>(['discovery', 'family', 'school']);

function sanitizeLicenseState(raw: unknown): LicenseState | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const obj = raw as Record<string, unknown>;
  const tier = typeof obj.tier === 'string' && VALID_LICENSE_TIERS.has(obj.tier as LicenseTier)
    ? (obj.tier as LicenseTier)
    : undefined;
  if (!tier) return undefined;
  return {
    tier,
    ...(typeof obj.schoolOrg === 'string' ? { schoolOrg: obj.schoolOrg } : {}),
    ...(typeof obj.expiresAt === 'string' ? { expiresAt: obj.expiresAt } : {}),
  };
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
  const dailyStreak = sanitizeDailyStreak(obj.dailyStreak, dailyChallenge);
  const speedrunRecords = sanitizeSpeedrunRecords(obj.speedrunRecords);

  const rawUnlocked: Record<string, number> = {};
  if (obj.unlockedBadges && typeof obj.unlockedBadges === 'object') {
    for (const [badgeId, ts] of Object.entries(obj.unlockedBadges as Record<string, unknown>)) {
      if (typeof ts === 'number' && ts > 0) {
        rawUnlocked[badgeId] = ts;
      }
    }
  }

  // Backfill any badges earned from completedStages, dailyChallenge, speedrunRecords & dailyStreak
  const { updatedUnlocked } = syncUnlockedBadgesMap(
    completedStages,
    rawUnlocked,
    dailyChallenge,
    speedrunRecords,
    dailyStreak,
  );

  const customLiveries: Record<string, LiveryPresetId> = {};
  if (obj.customLiveries && typeof obj.customLiveries === 'object') {
    for (const [bpId, liv] of Object.entries(obj.customLiveries as Record<string, unknown>)) {
      if (
        typeof liv === 'string' &&
        VALID_LIVERY_IDS.has(liv as LiveryPresetId) &&
        liv !== 'original'
      ) {
        customLiveries[bpId] = liv as LiveryPresetId;
      }
    }
  }

  const engineeringPatents: Record<string, EngineeringPatentRecord> = {};
  if (obj.engineeringPatents && typeof obj.engineeringPatents === 'object') {
    for (const [bpId, rec] of Object.entries(obj.engineeringPatents as Record<string, unknown>)) {
      if (!rec || typeof rec !== 'object') continue;
      const r = rec as Record<string, unknown>;
      if (typeof r.score === 'number' && r.score > 0) {
        engineeringPatents[bpId] = {
          score: Math.max(1, Math.min(3, Math.round(r.score))),
          total: typeof r.total === 'number' ? Math.max(1, Math.round(r.total)) : 3,
          passedAt: typeof r.passedAt === 'number' ? r.passedAt : Date.now(),
        };
      }
    }
  }

  const repairedStages: Record<string, number> = {};
  if (obj.repairedStages && typeof obj.repairedStages === 'object') {
    for (const [bpId, count] of Object.entries(obj.repairedStages as Record<string, unknown>)) {
      if (typeof count === 'number' && count > 0) {
        repairedStages[bpId] = Math.round(count);
      }
    }
  }

  const masterNoSilhouetteStages: Record<string, number> = {};
  if (obj.masterNoSilhouetteStages && typeof obj.masterNoSilhouetteStages === 'object') {
    for (const [bpId, ts] of Object.entries(
      obj.masterNoSilhouetteStages as Record<string, unknown>,
    )) {
      if (typeof ts === 'number' && ts > 0) {
        masterNoSilhouetteStages[bpId] = ts;
      }
    }
  }

  const environmentMode: WorkbenchEnvironmentMode =
    obj.environmentMode === 'studio' ? 'studio' : 'auto_thematic';

  const VALID_TIERS = new Set(['discovery', 'family', 'school']);
  const rawLic = obj.licenseState as Record<string, unknown> | undefined;
  const licTier =
    rawLic && typeof rawLic.tier === 'string' && VALID_TIERS.has(rawLic.tier)
      ? (rawLic.tier as 'discovery' | 'family' | 'school')
      : 'discovery';
  const licenseState = {
    tier: licTier,
    ...(rawLic?.schoolOrg && typeof rawLic.schoolOrg === 'string'
      ? { schoolOrg: rawLic.schoolOrg }
      : {}),
    ...(rawLic?.expiresAt && typeof rawLic.expiresAt === 'string'
      ? { expiresAt: rawLic.expiresAt }
      : {}),
  };

  return {
    licenseState,
    currentBlueprintId: candidateBpId,
    lastStandardBlueprintId,
    inProgressStages,
    completedStages,
    dailyChallenge,
    dailyStreak,
    speedrunRecords,
    timerModeEnabled: Boolean(obj.timerModeEnabled),
    unlockedBadges: updatedUnlocked,
    customLiveries,
    engineeringPatents,
    repairedStages,
    masterNoSilhouetteStages,
    noSilhouetteMode: Boolean(obj.noSilhouetteMode),
    environmentMode,
    language,
    preferredStyle,
    cameraPreset,
    freeWorkshopUnlocked:
      Boolean(obj.freeWorkshopUnlocked) || Boolean(dailyStreak.unlockedMilestones.streak_14),
    muted: Boolean(obj.muted),
    volumeSfx: typeof obj.volumeSfx === 'number' ? Math.min(1, Math.max(0, obj.volumeSfx)) : 1,
    volumeVoice: typeof obj.volumeVoice === 'number' ? Math.min(1, Math.max(0, obj.volumeVoice)) : 1,
    classroomSilent: Boolean(obj.classroomSilent),
    tbiMode: Boolean(obj.tbiMode),
    voiceAutoRead: Boolean(obj.voiceAutoRead),
    tutorialSeen: Boolean(obj.tutorialSeen),
    diagnosticTutorialSeen: Boolean(obj.diagnosticTutorialSeen),
    partsTrayPosition:
      obj.partsTrayPosition === 'left' || obj.partsTrayPosition === 'right'
        ? obj.partsTrayPosition
        : 'bottom',
    partsTrayAutoHide: obj.partsTrayAutoHide !== false,
    classCode: typeof obj.classCode === 'string' && /^[A-Z0-9]{4,20}$/.test(obj.classCode) ? obj.classCode : undefined,
    licenseKey: typeof obj.licenseKey === 'string' ? obj.licenseKey : undefined,
    licenseType: ['classe', 'ecole', 'reseau'].includes(obj.licenseType as string) ? (obj.licenseType as 'classe' | 'ecole' | 'reseau') : undefined,
    licenseExpiry: typeof obj.licenseExpiry === 'string' ? obj.licenseExpiry : undefined,
    licenseSeats: typeof obj.licenseSeats === 'number' ? obj.licenseSeats : undefined,
    licenseActive: Boolean(obj.licenseActive),
    ageProfile:
      typeof obj.ageProfile === 'string' && VALID_AGE_PROFILES.has(obj.ageProfile as AgeProfile)
        ? (obj.ageProfile as AgeProfile)
        : undefined,
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

export function createNewPlayerProfile(params: {
  name: string;
  avatarColor?: ProfileAvatarColor;
  avatarIcon?: ProfileAvatarIcon;
  language?: LanguageCode;
  progressOverride?: PlayerProgress;
  index?: number;
}): PlayerProfile {
  const lang = params.language ?? params.progressOverride?.language ?? 'fr';
  const trimmedName = params.name.trim() || getDefaultProfileName(lang, params.index ?? 1);
  const now = Date.now();
  return {
    id: `profile-${now}-${Math.random().toString(36).slice(2, 7)}`,
    name: trimmedName.slice(0, 28),
    avatarColor:
      params.avatarColor && VALID_AVATAR_COLORS.has(params.avatarColor)
        ? params.avatarColor
        : 'sky',
    avatarIcon:
      params.avatarIcon && VALID_AVATAR_ICONS.has(params.avatarIcon)
        ? params.avatarIcon
        : 'wrench',
    createdAt: now,
    updatedAt: now,
    progress: params.progressOverride ?? createDefaultProgress(lang, false),
  };
}

function sanitizeProfile(raw: unknown, index: number): PlayerProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const progress = sanitizeProgress(obj.progress);
  const name =
    typeof obj.name === 'string' && obj.name.trim()
      ? obj.name.trim().slice(0, 28)
      : getDefaultProfileName(progress.language, index + 1);
  const avatarColor: ProfileAvatarColor =
    typeof obj.avatarColor === 'string' && VALID_AVATAR_COLORS.has(obj.avatarColor as ProfileAvatarColor)
      ? (obj.avatarColor as ProfileAvatarColor)
      : 'sky';
  const avatarIcon: ProfileAvatarIcon =
    typeof obj.avatarIcon === 'string' && VALID_AVATAR_ICONS.has(obj.avatarIcon as ProfileAvatarIcon)
      ? (obj.avatarIcon as ProfileAvatarIcon)
      : 'wrench';
  const now = Date.now();

  return {
    id:
      typeof obj.id === 'string' && obj.id.trim()
        ? obj.id.trim()
        : `profile-${now}-${index}`,
    name,
    avatarColor,
    avatarIcon,
    createdAt: typeof obj.createdAt === 'number' ? obj.createdAt : now,
    updatedAt: typeof obj.updatedAt === 'number' ? obj.updatedAt : now,
    progress,
  };
}

export function sanitizeMultiProfileStore(raw: unknown): MultiProfileStore {
  const todayKey = getTodayDateKey();
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const parentalSettings = sanitizeParentalSettings(obj.parentalSettings, todayKey);
    if (Array.isArray(obj.profiles) && obj.profiles.length > 0) {
      const profiles: PlayerProfile[] = [];
      const seenIds = new Set<string>();
      for (let i = 0; i < obj.profiles.length && profiles.length < MAX_LOCAL_PROFILES; i++) {
        const sanitized = sanitizeProfile(obj.profiles[i], i);
        if (sanitized && !seenIds.has(sanitized.id)) {
          seenIds.add(sanitized.id);
          profiles.push(sanitized);
        }
      }
      if (profiles.length > 0) {
        const activeProfileId =
          typeof obj.activeProfileId === 'string' && seenIds.has(obj.activeProfileId)
            ? obj.activeProfileId
            : profiles[0].id;
        return { activeProfileId, profiles, parentalSettings };
      }
    }
  }

  // Automatic migration from single-profile SAVE_STORAGE_KEY (mecanokids_3d_save_v2)
  const existingProgress = loadPlayerProgress();
  const initialProfile = createNewPlayerProfile({
    name: getDefaultProfileName(existingProgress.language, 1),
    avatarColor: 'sky',
    avatarIcon: 'wrench',
    progressOverride: existingProgress,
    index: 1,
  });

  return {
    activeProfileId: initialProfile.id,
    profiles: [initialProfile],
    parentalSettings: createDefaultParentalSettings(todayKey),
  };
}

export function loadMultiProfileStore(): MultiProfileStore {
  if (typeof window === 'undefined') {
    const defaultProg = createDefaultProgress();
    const initial = createNewPlayerProfile({
      name: getDefaultProfileName(defaultProg.language, 1),
      progressOverride: defaultProg,
    });
    return {
      activeProfileId: initial.id,
      profiles: [initial],
      parentalSettings: createDefaultParentalSettings(),
    };
  }

  try {
    const rawProfiles = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    if (rawProfiles) {
      return sanitizeMultiProfileStore(JSON.parse(rawProfiles));
    }
  } catch {
    // Fallback to migrating v2 progress
  }

  const migratedStore = sanitizeMultiProfileStore(null);
  saveMultiProfileStore(migratedStore);
  return migratedStore;
}

export function saveMultiProfileStore(store: MultiProfileStore): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(store));
    const active =
      store.profiles.find((p) => p.id === store.activeProfileId) ?? store.profiles[0];
    if (active) {
      savePlayerProgress(active.progress);
    }
    return true;
  } catch {
    return false;
  }
}

export function downloadProgressBackup(progress: PlayerProgress, profileName?: string): void {
  if (typeof document === 'undefined') return;
  const json = JSON.stringify(progress, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const datePart = new Date().toISOString().slice(0, 10);
  const safeSlug = profileName
    ? `-${profileName
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 20)}`
    : '';
  link.href = url;
  link.download = `mecanokids-3d${safeSlug}-${datePart}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
