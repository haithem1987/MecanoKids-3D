import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Eye,
  Gem,
  Lightbulb,
  RotateCcw,
  Star,
  Timer,
  Trophy,
  X,
} from 'lucide-react';
import { RareCollectibleSpec } from '../data/dailyChallenges';
import { renderBadgeIcon } from './ProgressionModal';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { BadgeEvaluation, LanguageCode, VehicleBlueprint } from '../types/game';
import {
  formatDeltaMs,
  formatSecondsPerPart,
  formatStopwatchMs,
} from '../utils/speedrun';

export interface TimedCompletionResult {
  timeMs: number;
  isNewRecord: boolean;
  previousBestMs: number | null;
}

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  isCompleted: boolean;
  starsEarned: number;
  newlyUnlockedBadges: BadgeEvaluation[];
  rareRewardSpec?: RareCollectibleSpec | null;
  onOpenDailyVault?: () => void;
  timedResult?: TimedCompletionResult | null;
  onOpenLeaderboard?: () => void;
  onRetryTimedRun?: () => void;
  onOpenProgression: () => void;
  hasNextStage: boolean;
  onNextStage: () => void;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  isOpen,
  onClose,
  language,
  blueprint,
  isCompleted,
  starsEarned,
  newlyUnlockedBadges,
  rareRewardSpec,
  onOpenDailyVault,
  timedResult,
  onOpenLeaderboard,
  onRetryTimedRun,
  onOpenProgression,
  hasNextStage,
  onNextStage,
}) => {
  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discovery-modal-title"
    >
      <div className="w-full max-w-2xl max-h-[88vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Top Banner */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>
                {blueprint.isDailyBonus
                  ? t.dailyBonusStageLabel
                  : t.stageLabel(blueprint.stageNumber)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{blueprint.tierLabel}</span>
              {isCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: starsEarned }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </span>
                </>
              )}
            </div>
            <h2
              id="discovery-modal-title"
              className="mt-1 font-display text-2xl font-bold text-slate-900"
            >
              {isCompleted
                ? t.discoveryCompletedTitle(blueprint.name)
                : t.discoveryPreviewTitle(blueprint.name)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeDiscoveryAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {!isCompleted ? (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
                <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t.discoveryLockedTitle}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.discoveryLockedDesc(blueprint.parts.length, blueprint.name)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Official Stopwatch Speedrun Result Card */}
              {timedResult && (
                <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="font-bold text-sky-950">
                          {t.discoveryTimerCardTitle}
                        </span>
                        {timedResult.isNewRecord && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-bold text-emerald-700">
                              {t.discoveryNewRecordTag}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="mt-0.5 font-mono tabular-nums text-lg font-bold text-slate-900">
                        {formatStopwatchMs(timedResult.timeMs)}
                        <span className="font-sans font-normal text-xs text-slate-600">
                          {' · '}
                          {formatSecondsPerPart(
                            timedResult.timeMs,
                            blueprint.parts.length,
                            language,
                          )}
                        </span>
                      </p>

                      {timedResult.previousBestMs !== null && (
                        <p className="text-xs font-mono tabular-nums text-slate-500">
                          {t.discoveryPreviousBestLabel(
                            formatStopwatchMs(timedResult.previousBestMs),
                            formatDeltaMs(timedResult.timeMs - timedResult.previousBestMs),
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {onRetryTimedRun && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onRetryTimedRun();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.retryTimedRunBtn}</span>
                      </button>
                    )}
                    {onOpenLeaderboard && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenLeaderboard();
                        }}
                        className="px-3 py-2 text-xs font-semibold text-sky-900 bg-white border border-sky-300 hover:bg-sky-100/70 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {t.openLeaderboardBtn}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Rare Collector Part Reward Banner (Daily Mechanical Challenge) */}
              {blueprint.isDailyBonus && rareRewardSpec && (
                <div className="p-4 bg-amber-50/75 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Gem className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-950">
                        {t.dailyRareUnlockedBannerTitle}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-slate-900">
                        {rareRewardSpec.name[language]}
                      </p>
                      <p className="text-xs text-slate-600">
                        {rareRewardSpec.alloyBadge[language]}
                      </p>
                    </div>
                  </div>

                  {onOpenDailyVault && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDailyVault();
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-amber-950 bg-white border border-amber-300 hover:bg-amber-100/70 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {t.openDailyVaultBtn}
                    </button>
                  )}
                </div>
              )}

              {/* Newly Unlocked Achievement Badges Celebration Banner */}
              {newlyUnlockedBadges.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{t.newBadgesUnlockedBannerTitle(newlyUnlockedBadges.length)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProgression();
                      }}
                      className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
                    >
                      {t.viewAllBadgesBtn}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {newlyUnlockedBadges.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center gap-2.5 p-2.5 bg-white border border-amber-200 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                          {renderBadgeIcon(b.icon, 'w-4 h-4')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{b.title}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{b.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{t.discoveryBadgeLocal}</span>
                </div>

                {newlyUnlockedBadges.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenProgression();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.viewAllBadgesBtn}</span>
                  </button>
                )}
              </div>

              <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-xl">
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {t.howItWorksTitle}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {blueprint.discovery.howItWorks}
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.realRecordTitle}
                  </h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {blueprint.discovery.realRecord}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.didYouKnowTitle}
                  </h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {blueprint.discovery.didYouKnow}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px] cursor-pointer"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>{t.admire3DBtn}</span>
          </button>

          {isCompleted && (hasNextStage || blueprint.isDailyBonus) && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNextStage();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
            >
              <span>
                {blueprint.isDailyBonus ? t.returnToStagesBtn : t.goToNextStageBtn}
              </span>
              <ForwardArrow className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
