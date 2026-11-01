import React from 'react';
import { Check, Lightbulb, Lock, Wrench, X } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, PartSpec, VehicleBlueprint } from '../types/game';

interface MechanicHintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  placedPartIds: string[];
  hintPartId: string | null;
  onHighlightHintPart: (partId: string | null) => void;
}

export const MechanicHintDrawer: React.FC<MechanicHintDrawerProps> = ({
  isOpen,
  onClose,
  language,
  blueprint,
  placedPartIds,
  hintPartId,
  onHighlightHintPart,
}) => {
  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const placedSet = new Set(placedPartIds);

  const nextValidPart =
    blueprint.parts.find(
      (p) => !placedSet.has(p.id) && p.dependsOn.every((dep) => placedSet.has(dep)),
    ) ?? null;

  const getMissingDepName = (part: PartSpec): string | null => {
    for (const depId of part.dependsOn) {
      if (!placedSet.has(depId)) {
        return blueprint.parts.find((p) => p.id === depId)?.name ?? '';
      }
    }
    return null;
  };

  return (
    <aside
      aria-label={t.mechanicDrawerAria}
      className={`fixed top-16 bottom-4 z-30 w-[92vw] max-w-md bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden ${
        isRtl ? 'left-4' : 'right-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.mechanicTitle}
            </h2>
            <p className="text-xs text-slate-500">{t.mechanicSubtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeMechanicAria}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Next Recommended Part Highlight Card */}
      <div className="p-4 bg-amber-50/70 border-b border-amber-200/80 space-y-3">
        {nextValidPart ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-amber-900">
                {t.recommendedNextTitle}
              </span>
              <button
                type="button"
                onClick={() => onHighlightHintPart(nextValidPart.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>{t.highlightOn3DBtn}</span>
              </button>
            </div>

            <div className="p-3 bg-white border border-amber-200 rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-900">{nextValidPart.name}</p>
                <span
                  className="w-4 h-4 rounded-sm border border-black/10 shrink-0"
                  style={{ backgroundColor: nextValidPart.primaryColor }}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {nextValidPart.roleHint}
              </p>
            </div>
          </>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-900 leading-relaxed">
            {t.vehicleCompletedCongrats(blueprint.name)}
          </div>
        )}
      </div>

      {/* Complete Mechanical Assembly Plan */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/40">
        <h3 className="text-xs font-semibold text-slate-500 pb-1">
          {t.allPartsChecklistTitle} ({placedPartIds.length}/{blueprint.parts.length})
        </h3>

        {blueprint.parts.map((part, idx) => {
          const isPlaced = placedSet.has(part.id);
          const missingDep = getMissingDepName(part);
          const isReady = !isPlaced && missingDep === null;
          const isHinted = hintPartId === part.id && !isPlaced;

          return (
            <div
              key={part.id}
              onClick={() => {
                if (isReady) {
                  onHighlightHintPart(part.id);
                }
              }}
              className={`p-3 rounded-lg border transition-colors ${
                isPlaced
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : isHinted
                    ? 'bg-amber-50 border-amber-400 cursor-pointer'
                    : isReady
                      ? 'bg-white border-sky-200 hover:border-sky-400 cursor-pointer'
                      : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono tabular-nums text-xs text-slate-400 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="w-3 h-3 rounded-xs border border-black/10 shrink-0"
                    style={{ backgroundColor: part.primaryColor }}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {part.name}
                  </span>
                </div>

                {isPlaced ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.partStatusPlaced}</span>
                  </span>
                ) : missingDep ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                    <Lock className="w-3 h-3" />
                    <span>{t.partStatusLockedAfter(missingDep)}</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-sky-700 shrink-0">
                    {t.partStatusReady}
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {part.roleHint}
              </p>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
