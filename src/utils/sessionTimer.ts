import { getTodayDateKey } from '../data/dailyChallenges';
import { DailyLimitMinutesOption, ParentalSettings } from '../types/game';

export const VALID_DAILY_LIMIT_OPTIONS: readonly DailyLimitMinutesOption[] = [15, 20, 30, 45];
export const ASSEMBLY_GRACE_MAX_SECONDS = 180;
export const ASSEMBLY_GRACE_MIN_COMPLETION_RATIO = 0.5;

export function createDefaultParentalSettings(
  todayKey: string = getTodayDateKey(),
): ParentalSettings {
  return {
    dailyLimitMinutes: null,
    consumedTodaySeconds: 0,
    consumedDateKey: todayKey,
    extraGrantedMinutesToday: 0,
  };
}

export function sanitizeParentalSettings(
  raw: unknown,
  todayKey: string = getTodayDateKey(),
): ParentalSettings {
  const fallback = createDefaultParentalSettings(todayKey);
  if (!raw || typeof raw !== 'object') return fallback;

  const obj = raw as Record<string, unknown>;
  const dailyLimitMinutes: DailyLimitMinutesOption | null =
    typeof obj.dailyLimitMinutes === 'number' &&
    (VALID_DAILY_LIMIT_OPTIONS as readonly number[]).includes(obj.dailyLimitMinutes)
      ? (obj.dailyLimitMinutes as DailyLimitMinutesOption)
      : null;

  const storedDateKey =
    typeof obj.consumedDateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(obj.consumedDateKey)
      ? obj.consumedDateKey
      : todayKey;

  const isSameDay = storedDateKey === todayKey;

  const consumedTodaySeconds = isSameDay
    ? typeof obj.consumedTodaySeconds === 'number' && obj.consumedTodaySeconds >= 0
      ? Math.min(86_400, Math.round(obj.consumedTodaySeconds))
      : 0
    : 0;

  const extraGrantedMinutesToday = isSameDay
    ? typeof obj.extraGrantedMinutesToday === 'number' && obj.extraGrantedMinutesToday >= 0
      ? Math.min(240, Math.round(obj.extraGrantedMinutesToday))
      : 0
    : 0;

  return {
    dailyLimitMinutes,
    consumedTodaySeconds,
    consumedDateKey: todayKey,
    extraGrantedMinutesToday,
  };
}

export interface GentleTimerStatus {
  isLimitEnabled: boolean;
  effectiveLimitSeconds: number | null;
  consumedSeconds: number;
  remainingSeconds: number | null;
  isInAssemblyGrace: boolean;
  graceRemainingSeconds: number;
  shouldShowCurtain: boolean;
}

/**
 * Evaluates whether the Gentle Session Timer should allow active play,
 * enter a non-frustrating "finish current vehicle" grace window (>= 50% parts placed, max 3 min),
 * or lower the calm end-of-session curtain.
 */
export function evaluateGentleTimerStatus(params: {
  settings: ParentalSettings;
  todayKey: string;
  currentPlacedCount: number;
  currentTotalParts: number;
  graceElapsedSeconds: number;
}): GentleTimerStatus {
  const {
    settings,
    todayKey,
    currentPlacedCount,
    currentTotalParts,
    graceElapsedSeconds,
  } = params;

  const consumedSeconds =
    settings.consumedDateKey === todayKey ? Math.max(0, settings.consumedTodaySeconds) : 0;
  const extraMinutes =
    settings.consumedDateKey === todayKey ? Math.max(0, settings.extraGrantedMinutesToday) : 0;

  if (settings.dailyLimitMinutes === null) {
    return {
      isLimitEnabled: false,
      effectiveLimitSeconds: null,
      consumedSeconds,
      remainingSeconds: null,
      isInAssemblyGrace: false,
      graceRemainingSeconds: 0,
      shouldShowCurtain: false,
    };
  }

  const effectiveLimitSeconds = (settings.dailyLimitMinutes + extraMinutes) * 60;
  const remainingSeconds = Math.max(0, effectiveLimitSeconds - consumedSeconds);

  if (remainingSeconds > 0) {
    return {
      isLimitEnabled: true,
      effectiveLimitSeconds,
      consumedSeconds,
      remainingSeconds,
      isInAssemblyGrace: false,
      graceRemainingSeconds: 0,
      shouldShowCurtain: false,
    };
  }

  // Time budget reached 0: check Gentle Assembly Grace Rule (>= 50% assembled and not yet finished)
  const ratio =
    currentTotalParts > 0 ? currentPlacedCount / currentTotalParts : 0;
  const qualifiesForGrace =
    currentPlacedCount > 0 &&
    currentPlacedCount < currentTotalParts &&
    ratio >= ASSEMBLY_GRACE_MIN_COMPLETION_RATIO &&
    graceElapsedSeconds < ASSEMBLY_GRACE_MAX_SECONDS;

  if (qualifiesForGrace) {
    return {
      isLimitEnabled: true,
      effectiveLimitSeconds,
      consumedSeconds,
      remainingSeconds: 0,
      isInAssemblyGrace: true,
      graceRemainingSeconds: Math.max(0, ASSEMBLY_GRACE_MAX_SECONDS - graceElapsedSeconds),
      shouldShowCurtain: false,
    };
  }

  return {
    isLimitEnabled: true,
    effectiveLimitSeconds,
    consumedSeconds,
    remainingSeconds: 0,
    isInAssemblyGrace: false,
    graceRemainingSeconds: 0,
    shouldShowCurtain: true,
  };
}

export function formatMinutesClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
