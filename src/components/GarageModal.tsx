import React, { useMemo, useState } from 'react';
import {
  Award,
  Check,
  EyeOff,
  Gem,
  Lock,
  Play,
  Star,
  Timer,
  Warehouse,
  Wrench,
  X,
} from 'lucide-react';
import { RARE_COLLECTIBLES_CATALOG } from '../data/dailyChallenges';
import { getLiveryPreset } from '../data/liveries';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, PlayerProgress, VehicleBlueprint } from '../types/game';
import { formatStopwatchMs } from '../utils/speedrun';

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  localizedBlueprints: VehicleBlueprint[];
  localizedDailyBlueprint: VehicleBlueprint;
  todayDateKey: string;
  progress: PlayerProgress;
  onLoadVehicle: (blueprintId: string, startTestDrive: boolean) => void;
}

export const GarageModal: React.FC<GarageModalProps> = ({
  isOpen,
  onClose,
  language,
  localizedBlueprints,
  localizedDailyBlueprint,
  todayDateKey,
  progress,
  onLoadVehicle,
}) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'vault'>('vehicles');

  const completedVehicleItems = useMemo(() => {
    const items: Array<{
      blueprint: VehicleBlueprint;
      stars: number;
      bestTimeMs: number | null;
      completedAt: number;
    }> = [];

    const todayDailyEntry = progress.dailyChallenge.completedByDate[todayDateKey];
    if (todayDailyEntry) {
      items.push({
        blueprint: localizedDailyBlueprint,
        stars: todayDailyEntry.stars,
        bestTimeMs: todayDailyEntry.bestTimeMs ?? null,
        completedAt: todayDailyEntry.completedAt,
      });
    }

    for (const bp of localizedBlueprints) {
      const rec = progress.completedStages[bp.id];
      if (rec?.completed) {
        items.push({
          blueprint: bp,
          stars: rec.stars,
          bestTimeMs: rec.bestTimeMs ?? null,
          completedAt: rec.completedAt ?? 0,
        });
      }
    }

    return items.sort((a, b) => b.completedAt - a.completedAt);
  }, [
    localizedBlueprints,
    localizedDailyBlueprint,
    progress.completedStages,
    progress.dailyChallenge.completedByDate,
    todayDateKey,
  ]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const collectedRareSet = new Set(progress.dailyChallenge.collectedRareIds);
  const totalRepairsCount = Object.values(progress.repairedStages).reduce(
    (sum, n) => sum + (n || 0),
    0,
  );
  const patentsCount = Object.keys(progress.engineeringPatents).length;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="garage-modal-title"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
              <Warehouse className="w-3.5 h-3.5 shrink-0" />
              <span>{t.garageNavBtn}</span>
            </div>
            <h2
              id="garage-modal-title"
              className="mt-1 font-display text-xl sm:text-2xl font-bold text-slate-900"
            >
              {t.garageModalTitle}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">{t.garageModalSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeGarageAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Bar + Tabs */}
        <div className="px-6 pt-4 pb-3 border-b border-slate-200 space-y-3 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <p className="text-[11px] font-medium text-slate-500">{t.garageKpiVehicles}</p>
              <p className="mt-0.5 font-mono tabular-nums text-lg font-bold text-slate-900">
                {completedVehicleItems.length}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <p className="text-[11px] font-medium text-slate-500">{t.garageKpiPatents}</p>
              <p className="mt-0.5 font-mono tabular-nums text-lg font-bold text-sky-800">
                {patentsCount}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <p className="text-[11px] font-medium text-slate-500">{t.garageKpiRepairs}</p>
              <p className="mt-0.5 font-mono tabular-nums text-lg font-bold text-emerald-800">
                {totalRepairsCount}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <p className="text-[11px] font-medium text-slate-500">{t.garageKpiRareVault}</p>
              <p className="mt-0.5 font-mono tabular-nums text-lg font-bold text-amber-700">
                {collectedRareSet.size} / {RARE_COLLECTIBLES_CATALOG.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('vehicles')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'vehicles'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.garageTabVehicles(completedVehicleItems.length)}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.garageTabRareVault(collectedRareSet.size, RARE_COLLECTIBLES_CATALOG.length)}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'vehicles' ? (
            completedVehicleItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <Warehouse className="w-7 h-7 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">{t.garageEmptyTitle}</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">{t.garageEmptyDesc}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {completedVehicleItems.map(({ blueprint, stars, bestTimeMs }) => {
                  const customLiveryId = progress.customLiveries[blueprint.id] ?? 'original';
                  const liverySpec = getLiveryPreset(customLiveryId);
                  const hasPatent = Boolean(progress.engineeringPatents[blueprint.id]);
                  const repairCount = progress.repairedStages[blueprint.id] ?? 0;
                  const hasMasterNoSil = Boolean(progress.masterNoSilhouetteStages[blueprint.id]);
                  const swatchPrimary =
                    customLiveryId === 'original'
                      ? (blueprint.parts[0]?.primaryColor ?? liverySpec.primaryHex)
                      : liverySpec.primaryHex;

                  return (
                    <div
                      key={blueprint.id}
                      className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-4 h-8 rounded-sm border border-black/15 shrink-0"
                              style={{ backgroundColor: swatchPrimary }}
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-slate-500 truncate">
                                {blueprint.isDailyBonus
                                  ? t.dailyBonusStageLabel
                                  : `${t.stageLabel(blueprint.stageNumber)} · ${blueprint.tierLabel}`}
                              </p>
                              <h3 className="font-display text-base font-bold text-slate-900 truncate">
                                {blueprint.name}
                              </h3>
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-0.5 shrink-0">
                            {Array.from({ length: 3 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3.5 h-3.5 ${
                                  idx < stars
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Metadata & Engineering Honours */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                            {liverySpec.label[language]}
                          </span>

                          {bestTimeMs !== null && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 font-mono tabular-nums font-semibold text-sky-900">
                              <Timer className="w-3 h-3 text-sky-600 shrink-0" />
                              <span>{formatStopwatchMs(bestTimeMs)}</span>
                            </span>
                          )}

                          {hasPatent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 font-semibold text-emerald-800">
                              <Award className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{t.garagePatentTag}</span>
                            </span>
                          )}

                          {repairCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 font-semibold text-amber-900">
                              <Wrench className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{t.garageRepairedTag(repairCount)}</span>
                            </span>
                          )}

                          {hasMasterNoSil && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 font-semibold text-indigo-800">
                              <EyeOff className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span>{t.garageMasterTag}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onLoadVehicle(blueprint.id, false);
                          }}
                          className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                        >
                          {t.garageLoadBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onLoadVehicle(blueprint.id, true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                        >
                          <Play className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.garageTestDriveBtn}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {RARE_COLLECTIBLES_CATALOG.map((rare) => {
                const isCollected = collectedRareSet.has(rare.id);
                return (
                  <div
                    key={rare.id}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      isCollected
                        ? 'bg-amber-50/55 border-amber-300'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isCollected
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCollected ? <Gem className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-amber-800 truncate">
                          {rare.alloyBadge[language]}
                        </span>
                        {isCollected && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{rare.name[language]}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isCollected ? rare.roleHint[language] : t.dailyVaultLockedStatus}
                      </p>
                      <p className="text-[11px] text-slate-500 pt-0.5">
                        {rare.vehicleOrigin[language]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
