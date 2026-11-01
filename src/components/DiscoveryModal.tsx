import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Eye,
  Lightbulb,
  Star,
  Trophy,
  X,
} from 'lucide-react';
import { renderBadgeIcon } from './ProgressionModal';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { BadgeEvaluation, LanguageCode, VehicleBlueprint } from '../types/game';

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  isCompleted: boolean;
  starsEarned: number;
  newlyUnlockedBadges: BadgeEvaluation[];
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
              <span>{t.stageLabel(blueprint.stageNumber)}</span>
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

          {isCompleted && hasNextStage && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNextStage();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
            >
              <span>{t.goToNextStageBtn}</span>
              <ForwardArrow className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
