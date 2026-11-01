import { getPreviousDateKey, getTodayDateKey } from '../data/dailyChallenges';
import {
  DailyChallengeState,
  DailyStreakMilestoneId,
  DailyStreakState,
  LanguageCode,
} from '../types/game';

export interface StreakMilestoneSpec {
  id: DailyStreakMilestoneId;
  daysRequired: number;
  title: Record<LanguageCode, string>;
  rewardLabel: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
}

export const STREAK_MILESTONES: StreakMilestoneSpec[] = [
  {
    id: 'streak_3',
    daysRequired: 3,
    title: {
      fr: 'Étincelle d’Atelier (3 jours)',
      en: 'Workshop Spark (3 days)',
      ar: 'شرارة الورشة (3 أيام)',
    },
    rewardLabel: {
      fr: 'Badge Flamme d’Atelier',
      en: 'Workshop Flame Badge',
      ar: 'وسام شعلة الورشة',
    },
    description: {
      fr: 'Pratique la mécanique 3 jours consécutifs pour allumer durablement ta flamme d’apprenti.',
      en: 'Engage in the 3D workshop for 3 consecutive days to ignite your apprentice flame.',
      ar: 'شارك في الورشة الميكانيكية لمدة 3 أيام متتالية لإشعال شعلة المثابرة.',
    },
  },
  {
    id: 'streak_7',
    daysRequired: 7,
    title: {
      fr: 'Gardien de la Flamme (7 jours)',
      en: 'Keeper of the Flame (7 days)',
      ar: 'حارس الشعلة (7 أيام)',
    },
    rewardLabel: {
      fr: 'Peinture exclusive « Flamme d’Or » + Badge',
      en: 'Exclusive "Flame Gold" Livery + Badge',
      ar: 'طلاء «ذهب الشعلة» الحصري + وسام',
    },
    description: {
      fr: 'Atteins 7 jours d’affilée pour débloquer la finition métallisée « Flamme d’Or » dans la Cabine de Peinture !',
      en: 'Reach 7 days in a row to unlock the metallic "Flame Gold" finish inside the Paint Booth!',
      ar: 'حقق سلسلة 7 أيام متتالية لفتح طلاء «ذهب الشعلة» المعدني الحصري في كابينة الطلاء!',
    },
  },
  {
    id: 'streak_14',
    daysRequired: 14,
    title: {
      fr: 'Ingénieur Assidu (14 jours)',
      en: 'Dedicated Engineer (14 days)',
      ar: 'المهندس المثابر (14 يوماً)',
    },
    rewardLabel: {
      fr: 'Pass Atelier Libre (100 stages déverrouillés)',
      en: 'Free Workshop Pass (All 100 stages unlocked)',
      ar: 'تصريح الورشة الحرة (فتح جميع المراحل الـ 100)',
    },
    description: {
      fr: 'Maintiens ta série pendant 14 jours consécutifs pour déverrouiller automatiquement l’accès libre aux 100 engins !',
      en: 'Keep your streak alive for 14 consecutive days to unlock instant Free Workshop access to all 100 machines!',
      ar: 'واظب لمدة 14 يوماً متتالياً لفتح الوصول الحر التلقائي إلى جميع المجسّمات الـ 100!',
    },
  },
  {
    id: 'streak_30',
    daysRequired: 30,
    title: {
      fr: 'Flamme Légendaire (30 jours)',
      en: 'Legendary Flame (30 days)',
      ar: 'الشعلة الأسطورية (30 يوماً)',
    },
    rewardLabel: {
      fr: 'Sceau d’Honneur Maître 30 Jours',
      en: '30-Day Grand Master Seal of Honor',
      ar: 'ختم الشرف لكبير المهندسين (30 يوماً)',
    },
    description: {
      fr: 'Un mois complet de passion mécanique quotidienne dans l’atelier 3D !',
      en: 'A full month of daily hands-on mechanical engineering in the 3D workshop!',
      ar: 'شهر كامل من الشغف الهندسي والتركيب اليومي المتواصل في الورشة!',
    },
  },
];

const MAX_STORED_ACTIVE_DATES = 90;

export function createEmptyDailyStreakState(): DailyStreakState {
  return {
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    activeDates: [],
    unlockedMilestones: {},
  };
}

export function getEffectiveDailyStreak(
  streak: DailyStreakState,
  todayKey: string = getTodayDateKey(),
): {
  displayCount: number;
  isActiveToday: boolean;
  isAtRiskToday: boolean;
} {
  if (!streak.lastActiveDate || streak.currentStreak <= 0) {
    return {
      displayCount: 0,
      isActiveToday: false,
      isAtRiskToday: false,
    };
  }

  if (streak.lastActiveDate === todayKey) {
    return {
      displayCount: streak.currentStreak,
      isActiveToday: true,
      isAtRiskToday: false,
    };
  }

  const yesterdayKey = getPreviousDateKey(todayKey);
  if (streak.lastActiveDate === yesterdayKey) {
    return {
      displayCount: streak.currentStreak,
      isActiveToday: false,
      isAtRiskToday: true,
    };
  }

  return {
    displayCount: 0,
    isActiveToday: false,
    isAtRiskToday: false,
  };
}

export function recordDailyEngagement(
  prev: DailyStreakState,
  todayKey: string = getTodayDateKey(),
): {
  nextStreak: DailyStreakState;
  extendedToday: boolean;
  newlyUnlockedMilestones: StreakMilestoneSpec[];
} {
  if (prev.lastActiveDate === todayKey && prev.currentStreak > 0) {
    return {
      nextStreak: prev,
      extendedToday: false,
      newlyUnlockedMilestones: [],
    };
  }

  const yesterdayKey = getPreviousDateKey(todayKey);
  const nextCurrent =
    prev.lastActiveDate === yesterdayKey ? Math.max(1, prev.currentStreak + 1) : 1;
  const nextBest = Math.max(prev.bestStreak, nextCurrent);

  const dateSet = new Set(prev.activeDates);
  dateSet.add(todayKey);
  const nextActiveDates = Array.from(dateSet)
    .sort()
    .slice(-MAX_STORED_ACTIVE_DATES);

  const nextMilestones: Record<string, number> = { ...prev.unlockedMilestones };
  const newlyUnlockedMilestones: StreakMilestoneSpec[] = [];
  const now = Date.now();

  for (const m of STREAK_MILESTONES) {
    if (nextBest >= m.daysRequired && !nextMilestones[m.id]) {
      nextMilestones[m.id] = now;
      newlyUnlockedMilestones.push(m);
    }
  }

  return {
    nextStreak: {
      currentStreak: nextCurrent,
      bestStreak: nextBest,
      lastActiveDate: todayKey,
      activeDates: nextActiveDates,
      unlockedMilestones: nextMilestones,
    },
    extendedToday: true,
    newlyUnlockedMilestones,
  };
}

export function getLastSevenDaysTimeline(
  streak: DailyStreakState,
  todayKey: string = getTodayDateKey(),
): Array<{
  dateKey: string;
  dayNumber: string;
  isToday: boolean;
  active: boolean;
}> {
  const activeSet = new Set(streak.activeDates);
  if (streak.lastActiveDate) {
    activeSet.add(streak.lastActiveDate);
  }

  const days: string[] = [todayKey];
  let cursor = todayKey;
  for (let i = 0; i < 6; i++) {
    cursor = getPreviousDateKey(cursor);
    days.unshift(cursor);
  }

  return days.map((dKey) => ({
    dateKey: dKey,
    dayNumber: dKey.slice(8, 10),
    isToday: dKey === todayKey,
    active: activeSet.has(dKey),
  }));
}

export function sanitizeDailyStreak(
  raw: unknown,
  fallbackDailyChallenge?: DailyChallengeState,
): DailyStreakState {
  const empty = createEmptyDailyStreakState();

  // Migrate seamlessly from DailyChallengeState if dailyStreak did not exist yet
  if (!raw || typeof raw !== 'object') {
    if (fallbackDailyChallenge && fallbackDailyChallenge.bestStreak > 0) {
      const migratedDates = Object.keys(fallbackDailyChallenge.completedByDate)
        .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k))
        .sort()
        .slice(-MAX_STORED_ACTIVE_DATES);
      const best = Math.max(
        fallbackDailyChallenge.bestStreak,
        fallbackDailyChallenge.currentStreak,
      );
      const unlockedMilestones: Record<string, number> = {};
      const now = Date.now();
      for (const m of STREAK_MILESTONES) {
        if (best >= m.daysRequired) {
          unlockedMilestones[m.id] = now;
        }
      }
      return {
        currentStreak: Math.max(0, fallbackDailyChallenge.currentStreak),
        bestStreak: best,
        lastActiveDate: fallbackDailyChallenge.lastCompletedDate,
        activeDates: migratedDates,
        unlockedMilestones,
      };
    }
    return empty;
  }

  const obj = raw as Record<string, unknown>;
  const currentStreak =
    typeof obj.currentStreak === 'number' ? Math.max(0, Math.round(obj.currentStreak)) : 0;
  const bestStreak =
    typeof obj.bestStreak === 'number'
      ? Math.max(currentStreak, Math.round(obj.bestStreak))
      : currentStreak;
  const lastActiveDate =
    typeof obj.lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(obj.lastActiveDate)
      ? obj.lastActiveDate
      : null;

  const activeSet = new Set<string>();
  if (Array.isArray(obj.activeDates)) {
    for (const d of obj.activeDates) {
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        activeSet.add(d);
      }
    }
  }
  if (lastActiveDate) {
    activeSet.add(lastActiveDate);
  }

  const unlockedMilestones: Record<string, number> = {};
  if (obj.unlockedMilestones && typeof obj.unlockedMilestones === 'object') {
    for (const [mId, ts] of Object.entries(obj.unlockedMilestones as Record<string, unknown>)) {
      if (typeof ts === 'number' && ts > 0) {
        unlockedMilestones[mId] = ts;
      }
    }
  }
  const now = Date.now();
  for (const m of STREAK_MILESTONES) {
    if (bestStreak >= m.daysRequired && !unlockedMilestones[m.id]) {
      unlockedMilestones[m.id] = now;
    }
  }

  return {
    currentStreak,
    bestStreak,
    lastActiveDate,
    activeDates: Array.from(activeSet).sort().slice(-MAX_STORED_ACTIVE_DATES),
    unlockedMilestones,
  };
}
