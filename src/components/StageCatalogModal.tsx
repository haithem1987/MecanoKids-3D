import React, { useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Download,
  Gem,
  Lock,
  Save,
  Search,
  Star,
  Timer,
  Trash2,
  Trophy,
  Unlock,
  Upload,
  X,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  DifficultyTier,
  LanguageCode,
  PlayerProgress,
  VehicleBlueprint,
  VehicleCategory,
  VisualStyleMode,
} from '../types/game';
import { formatStopwatchMs } from '../utils/speedrun';
import { canPlayStage } from '../utils/entitlements';

interface StageCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  blueprints: VehicleBlueprint[];
  currentBlueprintId: string;
  progress: PlayerProgress;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
  onSelectBlueprint: (id: string) => void;
  onToggleFreeWorkshop: () => void;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  onOpenProgression: () => void;
  onOpenLeaderboard: () => void;
  dailyVehicleName: string;
  dailyRarePartName: string;
  isDailyCompletedToday: boolean;
  onOpenDailyChallenge: () => void;
  onSaveNow: () => void;
  onExportSave: () => void;
  onImportSaveFile: (file: File) => void;
  onResetAllProgress: () => void;
  onOpenUpgrade: (reason: 'stages') => void;
}

const TIER_UNLOCK_THRESHOLDS: Record<DifficultyTier, number> = {
  [DifficultyTier.DISCOVERY]: 0,
  [DifficultyTier.WORKSHOP]: 3,
  [DifficultyTier.ENGINEER]: 10,
  [DifficultyTier.EXPERT]: 25,
  [DifficultyTier.MASTER]: 45,
};

export const StageCatalogModal: React.FC<StageCatalogModalProps> = ({
  isOpen,
  onClose,
  language,
  blueprints,
  currentBlueprintId,
  progress,
  visualStyle,
  onSelectStyle,
  onSelectBlueprint,
  onToggleFreeWorkshop,
  unlockedBadgesCount,
  totalBadgesCount,
  onOpenProgression,
  onOpenLeaderboard,
  dailyVehicleName,
  dailyRarePartName,
  isDailyCompletedToday,
  onOpenDailyChallenge,
  onSaveNow,
  onExportSave,
  onImportSaveFile,
  onResetAllProgress,
  onOpenUpgrade,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | VehicleCategory>('all');
  const [tierFilter, setTierFilter] = useState<'all' | DifficultyTier>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter((bp) => {
      if (categoryFilter !== 'all' && bp.category !== categoryFilter) return false;
      if (tierFilter !== 'all' && bp.tier !== tierFilter) return false;
      if (normalizedQuery) {
        const matchStage = String(bp.stageNumber) === normalizedQuery;
        const matchName = bp.name.toLowerCase().includes(normalizedQuery);
        const matchSub = bp.subtitle.toLowerCase().includes(normalizedQuery);
        if (!matchStage && !matchName && !matchSub) return false;
      }
      return true;
    });
  }, [blueprints, categoryFilter, normalizedQuery, tierFilter]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const completedRecords = Object.values(progress.completedStages).filter((r) => r.completed);
  const completedCount = completedRecords.length;
  const totalStars = completedRecords.reduce((sum, r) => sum + (r.stars || 0), 0);
  const maxStars = blueprints.length * 3;

  const isStageUnlocked = (bp: VehicleBlueprint): boolean => {
    if (progress.freeWorkshopUnlocked) return true;
    if (bp.id === currentBlueprintId) return true;
    if (progress.completedStages[bp.id]?.completed) return true;
    if ((progress.inProgressStages[bp.id]?.placedPartIds.length ?? 0) > 0) return true;

    const needed = TIER_UNLOCK_THRESHOLDS[bp.tier] ?? 0;
    if (completedCount >= needed) return true;

    const prevBp = blueprints[bp.stageNumber - 2];
    if (prevBp && progress.completedStages[prevBp.id]?.completed) return true;

    return false;
  };

  const tiers: Array<{ tier: DifficultyTier; title: string; subtitle: string }> = [
    {
      tier: DifficultyTier.DISCOVERY,
      title: t.tier1Title,
      subtitle: t.tier1Subtitle,
    },
    {
      tier: DifficultyTier.WORKSHOP,
      title: t.tier2Title,
      subtitle: t.tier2Subtitle,
    },
    {
      tier: DifficultyTier.ENGINEER,
      title: t.tier3Title,
      subtitle: t.tier3Subtitle,
    },
    {
      tier: DifficultyTier.EXPERT,
      title: t.tier4Title,
      subtitle: t.tier4Subtitle,
    },
    {
      tier: DifficultyTier.MASTER,
      title: t.tier5Title,
      subtitle: t.tier5Subtitle,
    },
  ];

  const categoryLabel = (cat: VehicleCategory): string => {
    switch (cat) {
      case VehicleCategory.CAR:
        return t.catCar;
      case VehicleCategory.BOAT:
        return t.catBoat;
      case VehicleCategory.PLANE:
        return t.catPlane;
      case VehicleCategory.CONSTRUCTION:
        return t.catConstruction;
      case VehicleCategory.SPACE:
        return t.catSpace;
      case VehicleCategory.AEROSPACE:
      default:
        return t.filterAerospace;
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-title"
    >
      <div className="w-full max-w-5xl max-h-[92vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div>
            <h2 id="catalog-title" className="font-display text-2xl font-bold text-slate-900">
              {t.catalogTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{t.catalogSubtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLeaderboard();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
            >
              <Timer className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="hidden sm:inline">{t.leaderboardNavBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenProgression}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.openProgressionBtn(unlockedBadgesCount, totalBadgesCount)}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeCatalogAria}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter, Search & Visual Mode Toolbar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 space-y-2.5">
          {/* Row 1: 5 Mechanical Families + 3 Visual Modes + Free Unlock */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
              {(
                [
                  ['all', t.filterAll],
                  [VehicleCategory.CAR, t.filterCars],
                  [VehicleCategory.BOAT, t.filterBoats],
                  [VehicleCategory.PLANE, t.filterPlanes],
                  [VehicleCategory.CONSTRUCTION, t.filterConstruction],
                  [VehicleCategory.SPACE, t.filterSpace],
                  [VehicleCategory.AEROSPACE, t.filterAerospace],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCategoryFilter(val)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === val
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
                {(
                  [
                    [VisualStyleMode.WOOD, t.styleWoodShort],
                    [VisualStyleMode.BLOCKS, t.styleBlocksShort],
                    [VisualStyleMode.REALISTIC, t.styleRealisticShort],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onSelectStyle(mode)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      visualStyle === mode
                        ? 'bg-white text-sky-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onToggleFreeWorkshop}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  progress.freeWorkshopUnlocked
                    ? 'bg-sky-50 border-sky-300 text-sky-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title={t.unlockAllTitle}
              >
                <Unlock className="w-3.5 h-3.5 shrink-0" />
                <span>{progress.freeWorkshopUnlocked ? t.freeAccessActive : t.unlockAllBtn}</span>
              </button>
            </div>
          </div>

          {/* Row 2: 5 Difficulty Tiers Quick Filter + Search Input */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
              <button
                type="button"
                onClick={() => setTierFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
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
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    tierFilter === tierNum
                      ? 'bg-white text-sky-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tierPillLabel(tierNum)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-[220px] max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full ps-8 pe-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
                {t.showingCountLabel(filteredBlueprints.length, blueprints.length)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable 5-Tier Catalog List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
          {/* Daily Mechanical Challenge Spotlight Banner */}
          <div className="p-4 bg-amber-50/55 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-900">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold">{t.dailyCatalogBannerTitle}</span>
                  {isDailyCompletedToday && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.statusCompleted}</span>
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-0.5 font-display text-base font-bold text-slate-900">
                  {dailyVehicleName}
                  <span className="font-sans font-normal text-xs text-slate-600">
                    {' · '}
                    {dailyRarePartName}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDailyChallenge();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-amber-950 bg-white border border-amber-300 hover:bg-amber-100/70 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
            >
              {t.dailyCatalogBannerCta}
            </button>
          </div>

          {filteredBlueprints.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm font-medium text-slate-600">{t.noStagesMatch}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setTierFilter('all');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
              >
                {t.clearSearchLabel}
              </button>
            </div>
          ) : (
            tiers.map(({ tier, title, subtitle }) => {
              const items = filteredBlueprints.filter((bp) => bp.tier === tier);
              if (items.length === 0) return null;

              const neededForTier = TIER_UNLOCK_THRESHOLDS[tier] ?? 0;

              return (
                <div key={tier}>
                  <div className="mb-3">
                    <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {items.map((bp) => {
                      const unlocked = isStageUnlocked(bp);
                      const paywalled =
                        unlocked && !canPlayStage(progress.licenseState, bp.stageNumber);
                      const record = progress.completedStages[bp.id];
                      const inProg = progress.inProgressStages[bp.id];
                      const placedCount = inProg?.placedPartIds.length ?? 0;
                      const isCurrent = bp.id === currentBlueprintId;

                      return (
                        <button
                          key={bp.id}
                          type="button"
                          disabled={!unlocked && !paywalled}
                          onClick={() => {
                            if (paywalled) {
                              onOpenUpgrade('stages');
                            } else if (unlocked) {
                              onSelectBlueprint(bp.id);
                              onClose();
                            }
                          }}
                          className={`text-start p-4 rounded-xl border transition-colors flex flex-col justify-between min-h-[152px] ${
                            paywalled
                              ? 'bg-amber-50/60 border-amber-200 hover:border-amber-400 cursor-pointer'
                              : !unlocked
                                ? 'bg-slate-50 border-slate-200 opacity-65 cursor-not-allowed'
                                : isCurrent
                                  ? 'bg-sky-50/70 border-sky-600 cursor-pointer'
                                  : 'bg-white border-slate-200 hover:border-sky-500 cursor-pointer'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                              <span>
                                {t.stageLabel(bp.stageNumber)}
                                {' · '}
                                {categoryLabel(bp.category)}
                              </span>
                              {record?.completed ? (
                                <span
                                  className="inline-flex items-center gap-0.5 text-amber-500"
                                  aria-label={`${record.stars}`}
                                >
                                  {Array.from({ length: record.stars }).map((_, idx) => (
                                    <Star
                                      key={idx}
                                      className="w-3.5 h-3.5 fill-amber-400 text-amber-500"
                                    />
                                  ))}
                                </span>
                              ) : paywalled ? (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[10px] bg-amber-100 px-1.5 py-0.5 rounded">
                                  <Lock className="w-3 h-3 shrink-0" />
                                  Pass Famille
                                </span>
                              ) : !unlocked ? (
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                              ) : null}
                            </div>

                            <h4 className="mt-1.5 font-display text-base font-bold text-slate-900">
                              {bp.name}
                            </h4>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                              {bp.subtitle}
                            </p>
                          </div>

                          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                            <span className="font-mono tabular-nums text-slate-600">
                              {t.partsCountLabel(bp.parts.length)}
                              {record?.bestTimeMs
                                ? ` · ${formatStopwatchMs(record.bestTimeMs)}`
                                : ''}
                            </span>

                            {paywalled ? (
                              <span className="font-semibold text-amber-700 text-xs">
                                Débloquer
                              </span>
                            ) : placedCount > 0 && placedCount < bp.parts.length ? (
                              <span className="font-semibold text-amber-700">
                                {t.statusInProgress(placedCount, bp.parts.length)}
                              </span>
                            ) : record?.completed ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>{t.statusCompleted}</span>
                              </span>
                            ) : unlocked ? (
                              <span className="font-semibold text-sky-700">
                                {isCurrent ? t.statusCurrentActive : t.statusBuild}
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                {t.unlockRequirement(neededForTier)}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dedicated LocalStorage Save Management Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-900">{t.savePanelTitle}</p>
            <p className="text-xs text-slate-500">
              {t.savePanelDesc(completedCount, blueprints.length, totalStars, maxStars)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImportSaveFile(file);
                }
                e.target.value = '';
              }}
            />

            <button
              type="button"
              onClick={onSaveNow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer min-h-[36px]"
            >
              <Save className="w-3.5 h-3.5 shrink-0" />
              <span>{t.saveNowBtn}</span>
            </button>

            <button
              type="button"
              onClick={onExportSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-h-[36px]"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>{t.exportSaveBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-h-[36px]"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span>{t.importSaveBtn}</span>
            </button>

            {confirmingReset ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingReset(false);
                    onResetAllProgress();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                >
                  {t.confirmResetBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer min-h-[36px]"
                >
                  {t.cancelResetBtn}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer min-h-[36px]"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t.resetAllBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
