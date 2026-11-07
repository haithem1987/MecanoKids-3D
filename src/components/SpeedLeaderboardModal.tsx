import { getCategoryLabel } from '../data/categories';
import React, { useMemo, useState } from 'react';
import {
  Play,
  Star,
  Timer,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  DifficultyTier,
  LanguageCode,
  SpeedrunRecord,
  VehicleBlueprint,
  VehicleCategory,
} from '../types/game';
import {
  formatSecondsPerPart,
  formatStopwatchMs,
  getBestRecordsByBlueprint,
} from '../utils/speedrun';

interface SpeedLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  timerModeEnabled: boolean;
  onToggleTimerMode: (nextEnabled: boolean) => void;
  records: SpeedrunRecord[];
  localizedBlueprints: VehicleBlueprint[];
  currentBlueprint: VehicleBlueprint;
  onStartTimedStage: (blueprintId: string) => void;
  onClearLeaderboard: () => void;
}

export const SpeedLeaderboardModal: React.FC<SpeedLeaderboardModalProps> = ({
  isOpen,
  onClose,
  language,
  timerModeEnabled,
  onToggleTimerMode,
  records,
  localizedBlueprints,
  currentBlueprint,
  onStartTimedStage,
  onClearLeaderboard,

}) => {
  const [activeTab, setActiveTab] = useState<'stage_bests' | 'all_runs'>('stage_bests');
  const [tierFilter, setTierFilter] = useState<'all' | DifficultyTier>('all');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const blueprintById = useMemo(
    () => new Map(localizedBlueprints.map((bp) => [bp.id, bp])),
    [localizedBlueprints],
  );

  const bestPerStage = useMemo(
    () => getBestRecordsByBlueprint(records),
    [records],
  );

  const displayedList = useMemo(() => {
    const base = activeTab === 'stage_bests' ? bestPerStage : records;
    if (tierFilter === 'all') return base;
    return base.filter((r) => r.tier === tierFilter);
  }, [activeTab, bestPerStage, records, tierFilter]);

  const fastestOverallMs = useMemo(() => {
    if (records.length === 0) return null;
    return Math.min(...records.map((r) => r.timeMs));
  }, [records]);

  const bestPaceRecord = useMemo(() => {
    if (records.length === 0) return null;
    return records.reduce((best, cur) => {
      const curRatio = cur.timeMs / Math.max(1, cur.partsCount);
      const bestRatio = best.timeMs / Math.max(1, best.partsCount);
      return curRatio < bestRatio ? cur : best;
    }, records[0]);
  }, [records]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];

  const resolveVehicleName = (rec: SpeedrunRecord): string => {
    const liveBp = blueprintById.get(rec.blueprintId);
    if (liveBp) return liveBp.name;
    if (language === 'ar' && rec.vehicleNameAr) return rec.vehicleNameAr;
    if (language === 'en' && rec.vehicleNameEn) return rec.vehicleNameEn;
    return rec.vehicleNameFr ?? rec.blueprintId;
  };

  const categoryLabel = (cat: VehicleCategory) => getCategoryLabel(cat, language);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="speed-leaderboard-title"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Timer className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{timerModeEnabled ? t.timerActiveLabel : t.timerOffLabel}</span>
            </div>
            <h2
              id="speed-leaderboard-title"
              className="mt-1 font-display text-2xl font-bold text-slate-900"
            >
              {t.leaderboardTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">{t.leaderboardSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeLeaderboardAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Mode Control Strip */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5 max-w-xl">
            <p className="text-sm font-bold text-slate-900">{t.timerModeSwitchTitle}</p>
            <p className="text-xs text-slate-600">{t.timerModeSwitchDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleTimerMode(!timerModeEnabled)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap min-h-[40px] cursor-pointer ${
                timerModeEnabled
                  ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                  : 'bg-sky-600 border-sky-600 text-white hover:bg-sky-700'
              }`}
            >
              <Timer className="w-3.5 h-3.5 shrink-0" />
              <span>{timerModeEnabled ? t.timerDisableAction : t.timerEnableAction}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onStartTimedStage(currentBlueprint.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-900 bg-sky-50 border border-sky-200 hover:bg-sky-100 rounded-lg transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 shrink-0" />
              <span>{t.leaderboardTimeAttackCurrentBtn}</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* KPI Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">{t.leaderboardKpiRuns}</p>
              <p className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900">
                {records.length}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">{t.leaderboardKpiFastest}</p>
              <p className="mt-1 font-mono tabular-nums text-xl font-bold text-sky-700">
                {fastestOverallMs !== null ? formatStopwatchMs(fastestOverallMs) : '—'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500">{t.leaderboardKpiBestPace}</p>
              <p className="mt-1 font-mono tabular-nums text-xl font-bold text-emerald-700">
                {bestPaceRecord
                  ? formatSecondsPerPart(
                      bestPaceRecord.timeMs,
                      bestPaceRecord.partsCount,
                      language,
                    )
                  : '—'}
              </p>
            </div>
          </div>

          {/* Filter Tabs: Stage Personal Bests vs Top Runs + Tier Filter */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('stage_bests')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'stage_bests'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.leaderboardTabStageRecords(bestPerStage.length)}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all_runs')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'all_runs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.leaderboardTabTopRuns(records.length)}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setTierFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  tierFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.allTiersLabel}
              </button>
              {(
                [
                  DifficultyTier.DISCOVERY,
                  DifficultyTier.WORKSHOP,
                  DifficultyTier.ENGINEER,
                  DifficultyTier.EXPERT,
                  DifficultyTier.MASTER,
                ] as const
              ).map((tierNum) => (
                <button
                  key={tierNum}
                  type="button"
                  onClick={() => setTierFilter(tierNum)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    tierFilter === tierNum
                      ? 'bg-white text-sky-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tierPillLabel(tierNum)}
                </button>
              ))}
            </div>
          </div>

          {/* Local Leaderboard Table or Empty State */}
          {(displayedList.length === 0 ? (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900">
                {t.leaderboardEmptyTitle}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {t.leaderboardEmptyDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  onStartTimedStage(currentBlueprint.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 shrink-0" />
                <span>{t.leaderboardStartFirstRunBtn}</span>
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3.5 text-start w-12">{t.leaderboardColRank}</th>
                    <th className="py-2.5 px-3.5 text-start">{t.leaderboardColVehicle}</th>
                    <th className="py-2.5 px-3.5 text-start">{t.leaderboardColTime}</th>
                    <th className="py-2.5 px-3.5 text-start hidden sm:table-cell">
                      {t.leaderboardColPace}
                    </th>
                    <th className="py-2.5 px-3.5 text-start hidden md:table-cell">
                      {t.leaderboardColPrecision}
                    </th>
                    <th className="py-2.5 px-3.5 text-end">{t.leaderboardColAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedList.map((rec, idx) => {
                    const rank = idx + 1;
                    const canReplay =
                      !rec.isDailyBonus || rec.blueprintId === currentBlueprint.id || blueprintById.has(rec.blueprintId);

                    return (
                      <tr
                        key={rec.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-3.5 font-mono tabular-nums font-bold text-slate-700">
                          {rank <= 3 ? (
                            <span
                              className={
                                rank === 1
                                  ? 'text-amber-600'
                                  : rank === 2
                                    ? 'text-slate-600'
                                    : 'text-amber-800'
                              }
                            >
                              #{rank}
                            </span>
                          ) : (
                            <span>#{rank}</span>
                          )}
                        </td>

                        <td className="py-3 px-3.5">
                          <p className="font-display text-sm font-bold text-slate-900">
                            {resolveVehicleName(rec)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {rec.isDailyBonus
                              ? t.dailyBonusStageLabel
                              : t.stageLabel(rec.stageNumber)}
                            {' · '}
                            {categoryLabel(rec.category)}
                            {' · '}
                            {t.partsCountLabel(rec.partsCount)}
                          </p>
                        </td>

                        <td className="py-3 px-3.5 font-mono tabular-nums text-sm font-bold text-sky-700 whitespace-nowrap">
                          {formatStopwatchMs(rec.timeMs)}
                        </td>

                        <td className="py-3 px-3.5 font-mono tabular-nums text-slate-600 whitespace-nowrap hidden sm:table-cell">
                          {formatSecondsPerPart(rec.timeMs, rec.partsCount, language)}
                        </td>

                        <td className="py-3 px-3.5 hidden md:table-cell">
                          <span className="inline-flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: rec.stars }).map((_, sIdx) => (
                              <Star
                                key={sIdx}
                                className="w-3.5 h-3.5 fill-amber-400 text-amber-500"
                              />
                            ))}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-end whitespace-nowrap">
                          {canReplay && (
                            <button
                              type="button"
                              onClick={() => {
                                onStartTimedStage(rec.blueprintId);
                                onClose();
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
                            >
                              <Play className="w-3 h-3 shrink-0" />
                              <span>{t.leaderboardBeatTimeBtn}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Footer: Optional Reset Leaderboard Times */}
        {records.length > 0 && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
            {confirmClear ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmClear(false);
                    onClearLeaderboard();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                >
                  {t.confirmClearLeaderboardBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                >
                  {t.cancelResetBtn}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer min-h-[36px]"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t.clearLeaderboardBtn}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
