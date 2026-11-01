import React, { useState } from 'react';
import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  Car,
  CheckCircle2,
  Compass,
  Flame,
  Gem,
  Hammer,
  Lock,
  Plane,
  Rocket,
  Star,
  Target,
  Timer,
  Trophy,
  Wrench,
  X,
} from 'lucide-react';
import { PlayerProgressionSummary } from '../data/badges';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { BadgeEvaluation, BadgeIconKind, LanguageCode } from '../types/game';

interface ProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCatalog: () => void;
  language: LanguageCode;
  progression: PlayerProgressionSummary;
}

export function renderBadgeIcon(icon: BadgeIconKind, className = 'w-5 h-5'): React.ReactNode {
  switch (icon) {
    case BadgeIconKind.WRENCH:
      return <Wrench className={className} />;
    case BadgeIconKind.TARGET:
      return <Target className={className} />;
    case BadgeIconKind.COMPASS:
      return <Compass className={className} />;
    case BadgeIconKind.CAR:
      return <Car className={className} />;
    case BadgeIconKind.ANCHOR:
      return <Anchor className={className} />;
    case BadgeIconKind.PLANE:
      return <Plane className={className} />;
    case BadgeIconKind.HAMMER:
      return <Hammer className={className} />;
    case BadgeIconKind.ROCKET:
      return <Rocket className={className} />;
    case BadgeIconKind.CALENDAR:
      return <Calendar className={className} />;
    case BadgeIconKind.FLAME:
      return <Flame className={className} />;
    case BadgeIconKind.GEM:
      return <Gem className={className} />;
    case BadgeIconKind.TIMER:
      return <Timer className={className} />;
    case BadgeIconKind.AWARD:
      return <Award className={className} />;
    case BadgeIconKind.STAR:
      return <Star className={className} />;
    case BadgeIconKind.TROPHY:
    default:
      return <Trophy className={className} />;
  }
}

const ACCENT_STYLES: Record<
  BadgeEvaluation['accentColor'],
  { iconBox: string; barFill: string; borderUnlocked: string }
> = {
  sky: {
    iconBox: 'bg-sky-600 text-white',
    barFill: 'bg-sky-600',
    borderUnlocked: 'border-sky-300 bg-sky-50/40',
  },
  amber: {
    iconBox: 'bg-amber-500 text-white',
    barFill: 'bg-amber-500',
    borderUnlocked: 'border-amber-300 bg-amber-50/45',
  },
  emerald: {
    iconBox: 'bg-emerald-600 text-white',
    barFill: 'bg-emerald-600',
    borderUnlocked: 'border-emerald-300 bg-emerald-50/40',
  },
  indigo: {
    iconBox: 'bg-indigo-600 text-white',
    barFill: 'bg-indigo-600',
    borderUnlocked: 'border-indigo-300 bg-indigo-50/40',
  },
  rose: {
    iconBox: 'bg-rose-600 text-white',
    barFill: 'bg-rose-600',
    borderUnlocked: 'border-rose-300 bg-rose-50/40',
  },
};

export const ProgressionModal: React.FC<ProgressionModalProps> = ({
  isOpen,
  onClose,
  onBackToCatalog,
  language,
  progression,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const { stats, rankTitle, nextRankLabel, badges, unlockedCount } = progression;
  const lockedCount = badges.length - unlockedCount;
  const starPercent = stats.maxStars > 0 ? Math.round((stats.totalStars / stats.maxStars) * 100) : 0;

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    return true;
  });

  const familyBreakdown = [
    {
      id: 'car',
      label: t.catCar,
      stars: stats.carStars,
      maxStars: stats.carMaxStars,
      color: 'bg-amber-500',
    },
    {
      id: 'boat',
      label: t.catBoat,
      stars: stats.boatStars,
      maxStars: stats.boatMaxStars,
      color: 'bg-sky-600',
    },
    {
      id: 'plane',
      label: t.catPlane,
      stars: stats.planeStars,
      maxStars: stats.planeMaxStars,
      color: 'bg-emerald-600',
    },
    {
      id: 'construction',
      label: t.catConstruction,
      stars: stats.constructionStars,
      maxStars: stats.constructionMaxStars,
      color: 'bg-rose-600',
    },
    {
      id: 'space',
      label: t.catSpace,
      stars: stats.spaceStars,
      maxStars: stats.spaceMaxStars,
      color: 'bg-indigo-600',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="progression-modal-title"
    >
      <div className="w-full max-w-4xl max-h-[92vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <h2
              id="progression-modal-title"
              className="font-display text-2xl font-bold text-slate-900"
            >
              {t.progressionModalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{t.progressionModalSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeProgressionAria}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Mechanic Rank & Global Score Bar */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{t.rankLabel}</p>
                  <p className="font-display text-xl font-bold text-slate-900">{rankTitle}</p>
                </div>
              </div>

              <div className="text-xs font-semibold text-sky-800">
                {nextRankLabel ?? t.maxRankReached}
              </div>
            </div>

            {/* Global Star Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span>{t.kpiStarsLabel}</span>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  {stats.totalStars} / {stats.maxStars} ★ ({starPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${starPercent}%` }}
                />
              </div>
            </div>

            {/* 4 Clean KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">{t.kpiStarsLabel}</p>
                <p className="mt-1 font-mono tabular-nums text-lg font-bold text-slate-900">
                  {stats.totalStars}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {stats.maxStars}</span>
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">{t.kpiCompletedLabel}</p>
                <p className="mt-1 font-mono tabular-nums text-lg font-bold text-slate-900">
                  {stats.completedCount}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {stats.totalStages}</span>
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">{t.kpiPerfectLabel}</p>
                <p className="mt-1 font-mono tabular-nums text-lg font-bold text-emerald-700">
                  {stats.perfectCount}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {stats.totalStages}</span>
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">{t.kpiBadgesLabel}</p>
                <p className="mt-1 font-mono tabular-nums text-lg font-bold text-sky-700">
                  {unlockedCount}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {badges.length}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Score Breakdown by Mechanical Family */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-2.5">
              {t.familyScoresTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {familyBreakdown.map((fam) => {
                const pct = fam.maxStars > 0 ? Math.round((fam.stars / fam.maxStars) * 100) : 0;
                return (
                  <div
                    key={fam.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-800">{fam.label}</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        {fam.stars} / {fam.maxStars} ★
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${fam.color} transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievement Badges Grid */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {t.badgesSectionTitle}
              </h3>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(
                  [
                    ['all', t.badgeFilterAll(badges.length)],
                    ['unlocked', t.badgeFilterUnlocked(unlockedCount)],
                    ['locked', t.badgeFilterLocked(lockedCount)],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFilter(val)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      filter === val
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map((badge) => {
                const palette = ACCENT_STYLES[badge.accentColor];
                const ratio =
                  badge.targetValue > 0
                    ? Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100))
                    : 0;

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between min-h-[164px] transition-colors ${
                      badge.unlocked
                        ? palette.borderUnlocked
                        : 'bg-slate-50/70 border-slate-200 opacity-85'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            badge.unlocked
                              ? palette.iconBox
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {renderBadgeIcon(badge.icon, 'w-5 h-5')}
                        </div>

                        {badge.unlocked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.badgeUnlockedLabel}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.badgeLockedLabel}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="mt-3 font-display text-base font-bold text-slate-900">
                        {badge.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-200/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono tabular-nums font-semibold text-slate-700">
                          {badge.progressLabel}
                        </span>
                        <span className="font-mono tabular-nums text-slate-500">
                          {ratio}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            badge.unlocked ? palette.barFill : 'bg-slate-400'
                          }`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px] cursor-pointer"
          >
            <BackIcon className="w-4 h-4 shrink-0" />
            <span>{t.backToCatalogBtn}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
