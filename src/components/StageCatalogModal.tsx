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
import { CATALOG_BROWSE_TEXT, LOCAL_ADMIN_LABEL, MASTER_BUILD_TEXT, UI_TRANSLATIONS } from '../i18n/translations';
import { CATEGORIES, CATEGORY_META, getCategoryLabel } from '../data/categories';
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
import { localAdminActive } from '../utils/localAdmin';

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

const normalizeSearch = (value: string) => value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();

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
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'master-expansion' | VehicleCategory | null>(null);
  const [tierFilter, setTierFilter] = useState<'all' | DifficultyTier>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const normalizedQuery = normalizeSearch(searchQuery);

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter((bp) => {
      if (categoryFilter === 'master-expansion') {
        if (!bp.masterExpansion || bp.tier !== DifficultyTier.MASTER) return false;
      } else if (categoryFilter && categoryFilter !== 'all' && bp.category !== categoryFilter) return false;
      if (tierFilter !== 'all' && bp.tier !== tierFilter) return false;
      if (normalizedQuery) {
        const matchStage = String(bp.stageNumber) === normalizedQuery;
        const matchName = normalizeSearch(bp.name).includes(normalizedQuery);
        const matchSub = normalizeSearch(bp.subtitle).includes(normalizedQuery);
        if (!matchStage && !matchName && !matchSub) return false;
      }
      return true;
    }).sort((a,b) => a.tier-b.tier || a.stageNumber-b.stageNumber);
  }, [blueprints, categoryFilter, normalizedQuery, tierFilter]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const locale = language === 'fr' ? 0 : language === 'en' ? 1 : 2;
  const browse = CATALOG_BROWSE_TEXT;
  const showStages = categoryFilter !== null || normalizedQuery !== '' || tierFilter !== 'all';
  const chooseWorld = (category: 'all' | 'master-expansion' | VehicleCategory) => {
    setCategoryFilter(category);
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const returnToWorlds = () => {
    setCategoryFilter(null);
    setTierFilter('all');
    setSearchQuery('');
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const completedRecords = Object.values(progress.completedStages).filter((r) => r.completed);
  const completedCount = completedRecords.length;
  const totalStars = completedRecords.reduce((sum, r) => sum + (r.stars || 0), 0);
  const maxStars = blueprints.length * 3;

  const isStageUnlocked = (bp: VehicleBlueprint): boolean => {
    if (bp.masterExpansion && progress.ageProfile === '11-12') return true;
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

  const categoryLabel = (cat: VehicleCategory) => getCategoryLabel(cat, language);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-title"
    >
      <div className="w-full max-w-5xl h-full sm:h-auto max-h-[92svh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div>
            <h2 id="catalog-title" className="font-display text-2xl font-bold text-slate-900">
              {t.catalogTitle}
            </h2>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeCatalogAria}
              className="flex min-h-16 min-w-16 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-sky-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-4 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
            <div className="relative max-w-xl">
              <Search aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input type="search" aria-label={browse.search[locale]} placeholder={browse.search[locale]}
                value={searchQuery} onChange={event => setSearchQuery(event.target.value)}
                className="min-h-16 w-full rounded-xl border border-slate-300 bg-white pe-4 ps-12 text-base focus-visible:outline-2 focus-visible:outline-sky-700" />
            </div>
            {!showStages ? (
              <section aria-labelledby="catalog-worlds">
                <h3 id="catalog-worlds" className="mb-3 text-xl font-bold text-slate-900">{browse.choose[locale]}</h3>
                {(progress.ageProfile === '11-12' || localAdminActive) && blueprints.some(bp => bp.masterExpansion && bp.tier === DifficultyTier.MASTER) && (
                  <button type="button" data-catalog-master onClick={() => chooseWorld('master-expansion')}
                    className="mb-3 flex min-h-16 w-full items-center gap-3 rounded-xl border border-indigo-300 bg-indigo-50 px-4 text-start font-bold text-indigo-950 hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-700">
                    <Trophy aria-hidden="true" className="h-6 w-6 shrink-0" />
                    {MASTER_BUILD_TEXT.advanced[locale]}
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {CATEGORIES.filter(category => blueprints.some(bp => bp.category === category)).map(category => (
                    <button key={category} type="button" data-catalog-world={category} onClick={() => chooseWorld(category)}
                      className="flex min-h-24 flex-col items-start justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-start text-base font-bold text-slate-900 shadow-sm hover:border-sky-500 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-700">
                      <span aria-hidden="true" className="text-3xl">{CATEGORY_META[category].emoji}</span>
                      <span>{categoryLabel(category)}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => chooseWorld('all')} className="mt-3 min-h-16 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-sky-900">
                  {t.filterAll}
                </button>
              </section>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={returnToWorlds} className="min-h-16 rounded-xl border border-slate-300 bg-white px-4 font-semibold text-sky-900">
                  {browse.worlds[locale]}
                </button>
                <h3 className="text-xl font-bold text-slate-900">
                  {categoryFilter === 'master-expansion' ? MASTER_BUILD_TEXT.advanced[locale]
                    : categoryFilter && categoryFilter !== 'all' ? categoryLabel(categoryFilter) : t.filterAll}
                </h3>
              </div>
            )}
            <details className="rounded-xl border border-slate-200 bg-white px-3">
              <summary className="flex min-h-16 cursor-pointer items-center font-semibold text-slate-700">{browse.tools[locale]}</summary>
              <div className="flex flex-wrap items-center gap-2 pb-3">
                <select aria-label={t.allTiersLabel} value={tierFilter} onChange={event => setTierFilter(event.target.value === 'all' ? 'all' : Number(event.target.value) as DifficultyTier)}
                  className="min-h-12 rounded-lg border border-slate-300 bg-white px-3">
                  <option value="all">{t.allTiersLabel}</option>
                  {tiers.map(({ tier, title }) => <option key={tier} value={tier}>{title}</option>)}
                </select>
                {([
                  [VisualStyleMode.WOOD, t.styleWoodShort], [VisualStyleMode.BLOCKS, t.styleBlocksShort],
                  [VisualStyleMode.REALISTIC, t.styleRealisticShort], [VisualStyleMode.COMICS, t.styleComicsShort],
                ] as const).map(([mode, label]) => (
                  <button key={mode} type="button" aria-pressed={visualStyle === mode} onClick={() => onSelectStyle(mode)}
                    className="min-h-12 rounded-lg border border-slate-300 px-3 text-sm font-semibold aria-pressed:bg-sky-100">{label}</button>
                ))}
                <button type="button" onClick={onToggleFreeWorkshop} title={t.unlockAllTitle} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold">
                  <Unlock className="h-4 w-4" />{progress.freeWorkshopUnlocked ? t.freeAccessActive : t.unlockAllBtn}
                </button>
                <button type="button" onClick={() => { onClose(); onOpenLeaderboard(); }} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold">
                  <Timer className="h-4 w-4" />{t.leaderboardNavBtn}
                </button>
                <button type="button" onClick={onOpenProgression} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold">
                  <Trophy className="h-4 w-4" />{t.openProgressionBtn(unlockedBadgesCount, totalBadgesCount)}
                </button>
              </div>
            </details>
          </div>

        {/* Scrollable 5-Tier Catalog List */}
        <div className="px-4 py-5 space-y-8 sm:px-6">
          {localAdminActive && <p className="rounded-xl border border-sky-200 bg-sky-50 p-3 font-semibold text-sky-950">{LOCAL_ADMIN_LABEL[language]}</p>}
          {/* Daily Mechanical Challenge Spotlight Banner */}
          {!showStages && <div className="p-4 bg-amber-50/55 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
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
          </div>}

          {showStages && (filteredBlueprints.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm font-medium text-slate-600">{t.noStagesMatch}</p>
              <button
                type="button"
                onClick={returnToWorlds}
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {items.map((bp) => {
                      const unlocked = localAdminActive || Boolean(bp.virtualLab) || isStageUnlocked(bp);
                      const paywalled =
                        !localAdminActive && !bp.virtualLab && unlocked && !canPlayStage(progress.licenseState, bp.stageNumber, bp.masterExpansion);
                      const record = progress.completedStages[bp.id];
                      const inProg = progress.inProgressStages[bp.id];
                      const placedCount = inProg?.placedPartIds.length ?? 0;
                      const isCurrent = bp.id === currentBlueprintId;

                      return (
                        <button
                          key={bp.id}
                          type="button"
                          data-catalog-stage={bp.id}
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
                                <span aria-hidden="true">{CATEGORY_META[bp.category].emoji} </span>{t.stageLabel(bp.stageNumber)}
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

                            <h4 className="mt-2 font-display text-lg font-bold text-slate-900">
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
          ))}
        </div>

        {/* Dedicated LocalStorage Save Management Bar */}
        <details className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6">
          <summary className="flex min-h-16 cursor-pointer items-center font-semibold">{t.savePanelTitle}</summary>
          <p className="mb-3 text-sm text-slate-600">{t.savePanelDesc(completedCount, blueprints.length, totalStars, maxStars)}</p>
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
        </details>
        </div>
      </div>
    </div>
  );
};
