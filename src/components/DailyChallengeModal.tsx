import { getCategoryLabel } from '../data/categories';
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Gem,
  Lock,
  RotateCcw,
  Star,
  X,
} from 'lucide-react';
import {
  formatCountdownHMS,
  getActiveDailyStreak,
  getSecondsUntilNextDaily,
  RARE_COLLECTIBLES_CATALOG,
  RareCollectibleSpec,
} from '../data/dailyChallenges';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  DailyChallengeState,
  LanguageCode,
  VehicleBlueprint,
  VehicleCategory,
} from '../types/game';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  todayDateKey: string;
  dailyBlueprint: VehicleBlueprint;
  todayRareSpec: RareCollectibleSpec;
  dailyState: DailyChallengeState;
  isCurrentlyOnWorkbench: boolean;
  inProgressPartCount: number;
  onStartDailyBuild: (resetIfCompleted?: boolean) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  language,
  todayDateKey,
  dailyBlueprint,
  todayRareSpec,
  dailyState,
  isCurrentlyOnWorkbench,
  inProgressPartCount,
  onStartDailyBuild,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => getSecondsUntilNextDaily());

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(getSecondsUntilNextDaily());
    const id = window.setInterval(() => {
      setSecondsLeft(getSecondsUntilNextDaily());
    }, 1000);
    return () => window.clearInterval(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;

  const todayCompletion = dailyState.completedByDate[todayDateKey];
  const isCompletedToday = Boolean(todayCompletion);
  const activeStreak = getActiveDailyStreak(dailyState, todayDateKey);
  const collectedSet = new Set(dailyState.collectedRareIds);
  const totalRareCount = RARE_COLLECTIBLES_CATALOG.length;

  const categoryLabel = (cat: VehicleCategory) => getCategoryLabel(cat, language);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-challenge-title"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-mono tabular-nums">{todayDateKey}</span>
              <span aria-hidden="true">·</span>
              <span>{categoryLabel(dailyBlueprint.category)}</span>
            </div>
            <h2
              id="daily-challenge-title"
              className="mt-1 font-display text-2xl font-bold text-slate-900"
            >
              {t.dailyModalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">{t.dailyModalSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeDailyAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Metrics Strip: Countdown, Daily Streak, Rare Vault */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{t.dailyResetInLabel}</span>
              </div>
              <p className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900">
                {formatCountdownHMS(secondsLeft)}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t.dailyStreakLabel}</span>
                </span>
                <span className="font-mono tabular-nums text-slate-500">
                  {t.dailyBestStreakLabel(dailyState.bestStreak)}
                </span>
              </div>
              <p className="mt-1 font-display text-xl font-bold text-slate-900">
                {t.dailyStreakValue(activeStreak)}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Gem className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{t.dailyRareVaultKpiLabel}</span>
              </div>
              <p className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900">
                {collectedSet.size} / {totalRareCount}
              </p>
            </div>
          </div>

          {/* Today's Featured Bonus Prototype + Rare Collector Part */}
          <div className="p-5 bg-amber-50/45 border border-amber-200 rounded-xl space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-900/80">
                  <span className="font-semibold text-amber-900">
                    {t.dailyTodayVehicleSection}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {t.partsCountLabel(dailyBlueprint.parts.length)}
                  </span>
                  {inProgressPartCount > 0 &&
                    inProgressPartCount < dailyBlueprint.parts.length && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-sky-800">
                          {t.statusInProgress(inProgressPartCount, dailyBlueprint.parts.length)}
                        </span>
                      </>
                    )}
                </div>

                <h3 className="font-display text-xl font-bold text-slate-900">
                  {dailyBlueprint.name}
                </h3>
                <p className="text-sm text-slate-700 max-w-2xl">{dailyBlueprint.subtitle}</p>
              </div>

              {isCompletedToday && todayCompletion && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.statusCompleted}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: todayCompletion.stars }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-500"
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Rare Part Spotlight */}
            <div className="pt-4 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-amber-900">
                      {t.dailyRareSpotlightLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{todayRareSpec.alloyBadge[language]}</span>
                  </div>
                  <p className="mt-0.5 font-display text-base font-bold text-slate-900">
                    {todayRareSpec.name[language]}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {todayRareSpec.roleHint[language]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isCompletedToday ? (
                  <button
                    type="button"
                    onClick={() => {
                      onStartDailyBuild(true);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-amber-300 hover:bg-amber-50 rounded-lg transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.dailyReplayBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onStartDailyBuild(false);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
                  >
                    <span>
                      {isCurrentlyOnWorkbench ? t.dailyActiveNowBtn : t.dailyPlayBtn}
                    </span>
                    <ForwardArrow className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 7-Slot Rare Collector Parts Vault */}
          <div className="space-y-3">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                {t.dailyVaultTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.dailyVaultSubtitle(collectedSet.size, totalRareCount)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RARE_COLLECTIBLES_CATALOG.map((item, idx) => {
                const isCollected = collectedSet.has(item.id);
                const isTodayItem = item.id === todayRareSpec.id;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      isCollected
                        ? 'bg-amber-50/40 border-amber-300'
                        : isTodayItem
                          ? 'bg-sky-50/40 border-sky-300'
                          : 'bg-slate-50 border-slate-200 opacity-80'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isCollected
                          ? 'bg-amber-500 text-white'
                          : isTodayItem
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCollected ? (
                        <Gem className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="truncate">
                          {String(idx + 1).padStart(2, '0')} · {item.alloyBadge[language]}
                        </span>
                        <span
                          className={`font-semibold shrink-0 ${
                            isCollected ? 'text-emerald-700' : 'text-slate-500'
                          }`}
                        >
                          {isCollected
                            ? t.dailyVaultCollectedStatus
                            : t.dailyVaultLockedStatus}
                        </span>
                      </div>

                      <p className="mt-1 font-display text-sm font-bold text-slate-900 truncate">
                        {item.name[language]}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">
                        {item.roleHint[language]}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500 truncate">
                        {categoryLabel(item.category)} · {item.vehicleOrigin[language]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
