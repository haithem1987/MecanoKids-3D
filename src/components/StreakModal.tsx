import React from 'react';
import { Award, CheckCircle2, Flame, Lock, Paintbrush, Trophy, X } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { DailyStreakState, LanguageCode } from '../types/game';
import {
  getEffectiveDailyStreak,
  getLastSevenDaysTimeline,
  STREAK_MILESTONES,
} from '../utils/dailyStreak';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  dailyStreak: DailyStreakState;
  todayDateKey: string;
  onOpenPaintBooth: () => void;
  onOpenProgression: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  language,
  dailyStreak,
  todayDateKey,
  onOpenPaintBooth,
  onOpenProgression,
}) => {
  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const { displayCount, isActiveToday, isAtRiskToday } = getEffectiveDailyStreak(
    dailyStreak,
    todayDateKey,
  );
  const weekTimeline = getLastSevenDaysTimeline(dailyStreak, todayDateKey);
  const bestCount = Math.max(dailyStreak.bestStreak, displayCount);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-700">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-600 shrink-0" />
              <span>{t.streakCurrentLabel}</span>
            </div>
            <h2
              id="streak-modal-title"
              className="mt-1 font-display text-xl sm:text-2xl font-bold text-slate-900"
            >
              {t.streakModalTitle}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">{t.streakModalSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeStreakAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Status & KPI Cards */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isActiveToday
                ? 'bg-orange-50/75 border-orange-300'
                : isAtRiskToday
                  ? 'bg-amber-50/75 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isActiveToday
                    ? 'bg-orange-500 text-white'
                    : isAtRiskToday
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Flame
                  className={`w-6 h-6 ${isActiveToday ? 'fill-white' : ''}`}
                />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-900">
                  {t.streakDaysUnit(displayCount)}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
                  {isActiveToday
                    ? t.streakStatusActiveToday(displayCount)
                    : isAtRiskToday
                      ? t.streakStatusKeepAliveToday(displayCount)
                      : t.streakStatusStartToday}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-center min-w-[92px]">
                <p className="text-[11px] font-medium text-slate-500">{t.streakCurrentLabel}</p>
                <p className="font-mono tabular-nums text-base font-bold text-orange-700">
                  {displayCount}
                </p>
              </div>
              <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-center min-w-[92px]">
                <p className="text-[11px] font-medium text-slate-500">{t.streakBestLabel}</p>
                <p className="font-mono tabular-nums text-base font-bold text-slate-900">
                  {bestCount}
                </p>
              </div>
            </div>
          </div>

          {/* 7-Day Activity Strip */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500">{t.streakRecentWeekTitle}</h3>
            <div className="grid grid-cols-7 gap-2">
              {weekTimeline.map((day) => (
                <div
                  key={day.dateKey}
                  className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 ${
                    day.active
                      ? 'bg-orange-50 border-orange-300 text-orange-950'
                      : day.isToday
                        ? 'bg-white border-sky-400 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="font-mono tabular-nums text-[11px] font-semibold">
                    {day.isToday ? t.streakTodayTag : day.dayNumber}
                  </span>
                  <Flame
                    className={`w-4 h-4 ${
                      day.active
                        ? 'fill-orange-500 text-orange-600'
                        : 'text-slate-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Rewards List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">{t.streakMilestonesTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STREAK_MILESTONES.map((milestone) => {
                const isUnlocked =
                  Boolean(dailyStreak.unlockedMilestones[milestone.id]) ||
                  bestCount >= milestone.daysRequired;
                const progressVal = Math.min(bestCount, milestone.daysRequired);
                const pct = Math.min(
                  100,
                  Math.round((progressVal / milestone.daysRequired) * 100),
                );

                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                      isUnlocked
                        ? 'bg-amber-50/55 border-amber-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Award
                            className={`w-4 h-4 shrink-0 ${
                              isUnlocked ? 'text-orange-600' : 'text-slate-400'
                            }`}
                          />
                          <span>{milestone.title[language]}</span>
                        </span>

                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.streakRewardUnlockedTag}</span>
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs font-semibold text-orange-800">
                        {milestone.rewardLabel[language]}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {milestone.description[language]}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-600">
                        <span>
                          {progressVal} / {milestone.daysRequired}
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isUnlocked ? 'bg-orange-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {milestone.id === 'streak_7' && isUnlocked && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenPaintBooth();
                          }}
                          className="mt-1.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-white border border-amber-300 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Paintbrush className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.streakOpenPaintBoothBtn}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenProgression();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px] cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t.viewAllBadgesBtn}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
          >
            {t.admire3DBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
