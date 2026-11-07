import { isPhoneLayout } from '../hooks/usePhoneLayout';
import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertTriangle, Check, Gem, Lock, Wrench } from 'lucide-react';
import { applyLiveryToPartSpec } from '../data/liveries';
import { getPartShapeSvg } from '../utils/partShape';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  LanguageCode,
  LiveryPresetId,
  PartSpec,
  VehicleBlueprint,
} from '../types/game';

export type TrayPosition = 'bottom' | 'left' | 'right';

interface PartsTrayProps {
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  placedPartIds: string[];
  faultyPartIds: string[];
  liveryPreset: LiveryPresetId;
  stagedPartId: string | null;
  activeDragPartId: string | null;
  hintPartId: string | null;
  position: TrayPosition;
  onStartPartDrag: (partId: string) => void;
  onClickPartCard: (partId: string) => void;
}

export const PartsTray: React.FC<PartsTrayProps> = ({
  language,
  blueprint,
  placedPartIds,
  faultyPartIds,
  liveryPreset,
  stagedPartId,
  activeDragPartId,
  hintPartId,
  position,
  onStartPartDrag,
  onClickPartCard,
}) => {
  const t = UI_TRANSLATIONS[language];
  const placedSet = new Set(placedPartIds);
  const faultySet = new Set(faultyPartIds);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trayId = useId();
  const [readyOnly, setReadyOnly] = useState(true);

  const getMissingDepName = (part: PartSpec): string | null => {
    for (const depId of part.dependsOn) {
      if (!placedSet.has(depId)) {
        return blueprint.parts.find((p) => p.id === depId)?.name ?? '';
      }
    }
    return null;
  };

  const firstAvailableId = blueprint.parts.find(
    (part) => !placedSet.has(part.id) && !faultySet.has(part.id) && getMissingDepName(part) === null,
  )?.id;

  // Follow the next available piece without reacting to unrelated parent renders.
  useEffect(() => {
    if (!scrollRef.current || !firstAvailableId) return;
    const el = scrollRef.current.querySelector<HTMLElement>(
      `[data-part-id="${firstAvailableId}"]`,
    );
    if (el) {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [position, blueprint.id, firstAvailableId]);

  const isVertical = true;

  const unplaced = blueprint.parts.filter((p) => !placedSet.has(p.id));
  const placed = blueprint.parts.filter((p) => placedSet.has(p.id));
  const sorted = [...unplaced.filter(p => getMissingDepName(p) === null), ...unplaced.filter(p => getMissingDepName(p) !== null), ...placed];

  const partCards = sorted.map((part, sortedIdx) => {
    const originalIdx = blueprint.parts.indexOf(part);
    const paintedSpec = applyLiveryToPartSpec(part, liveryPreset);
    const isPlaced = placedSet.has(part.id);
    const isFaultyMounted = !isPlaced && faultySet.has(part.id);
    const missingDep = getMissingDepName(part);
    const isLocked = !isPlaced && !isFaultyMounted && missingDep !== null;
    const isSelected = stagedPartId === part.id || activeDragPartId === part.id;
    const isHinted = hintPartId === part.id && !isPlaced;
    const showSeparator = isPlaced && sortedIdx > 0 && !placedSet.has(sorted[sortedIdx - 1].id);

    return (
      <React.Fragment key={part.id}>
        {showSeparator && (
          <div data-part-separator className={`shrink-0 flex ${isVertical ? 'flex-row items-center' : 'flex-col items-center justify-center'} gap-1 px-1`}>
            <div className={isVertical ? 'h-px w-8 bg-slate-200' : 'w-px h-12 bg-slate-200'} />
            <span className="text-[10px] text-slate-400 whitespace-nowrap">{placed.length}✓</span>
          </div>
        )}
      <button
        key={part.id}
        type="button"
        data-part-id={part.id}
        hidden={readyOnly && isLocked}
        style={{ display: readyOnly && isLocked ? 'none' : undefined }}
        disabled={isPlaced}
        onPointerDown={(e) => {
          if (isPlaced || isFaultyMounted || e.pointerType === 'touch' && isPhoneLayout()) return;
          if (e.button === 0 || e.pointerType !== 'mouse') {
            onStartPartDrag(part.id);
          }
        }}
        onClick={() => {
          if (!isPlaced) onClickPartCard(part.id);
        }}
        title={`${part.name} — ${part.roleHint}`}
        aria-label={`${String(originalIdx + 1).padStart(2, '0')} ${part.name}. ${part.roleHint.trim().replace(/[.!?؟]+$/, '')}. ${isPlaced ? t.partStatusPlaced : isFaultyMounted ? t.diagnosticBtn : isLocked ? t.partStatusLockedAfter(missingDep ?? '') : t.partStatusReady}`}
        aria-pressed={!isPlaced && isSelected}
        className={`group shrink-0 text-start p-2.5 rounded-lg border transition-transform duration-150 flex flex-col justify-between min-h-[80px] min-w-[80px] ${
          isVertical ? 'w-full' : 'w-36'
        } ${
          isPlaced
            ? 'bg-slate-50 border-slate-200 opacity-65 cursor-default'
            : isFaultyMounted
              ? 'bg-amber-50 border-amber-500 cursor-pointer'
              : isSelected
                ? 'bg-sky-50 border-sky-600 -translate-y-0.5 cursor-grab active:cursor-grabbing'
                : isHinted
                  ? 'bg-amber-50 border-amber-500 -translate-y-0.5 cursor-grab'
                  : part.isRarePart && !isLocked
                    ? 'bg-amber-50/65 border-amber-400 hover:border-amber-500 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing'
                    : isLocked
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300 cursor-pointer'
                      : 'bg-white border-slate-200 hover:border-sky-500 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing'
        }`}
      >
        {/* Miniature: color swatch thumbnail */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono tabular-nums text-[11px] text-slate-400">
            {String(originalIdx + 1).padStart(2, '0')}
            {part.isRarePart ? ` · ${t.rarePartCardLabel}` : ''}
          </span>
          {isFaultyMounted ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          ) : part.isRarePart ? (
            <Gem className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          ) : (
            <span
              className="part-thumbnail shrink-0"
              dangerouslySetInnerHTML={{ __html: getPartShapeSvg(part.roleHint, paintedSpec.primaryColor, part) }}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="mt-1">
          <p className="text-xs font-semibold text-slate-900 line-clamp-2 min-h-[2rem] break-words">{part.name}</p>
          <div className="mt-0.5 flex items-center gap-1 text-[11px]">
            {isPlaced ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <Check className="w-3 h-3 shrink-0" />
                <span className="truncate">{t.partStatusPlaced}</span>
              </span>
            ) : isFaultyMounted ? (
              <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                <Wrench className="w-3 h-3 shrink-0" />
                <span className="truncate">{t.diagnosticBtn}</span>
              </span>
            ) : isLocked ? (
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Lock className="w-3 h-3 shrink-0" />
                <span className="truncate">{t.partStatusLockedAfter(missingDep ?? '')}</span>
              </span>
            ) : isHinted ? (
              <span className="text-amber-700 font-semibold truncate">{t.partStatusHinted}</span>
            ) : (
              <span className="text-sky-700 font-medium truncate">{t.partStatusReady}</span>
            )}
          </div>
        </div>
      </button>
      </React.Fragment>
    );
  });

  return <aside data-parts-palette data-tour="parts-tray" className={`floating-parts pointer-events-auto absolute top-2 bottom-2 z-20 flex min-h-0 flex-col gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-md ${position==='right'?'end-2':'start-2'}`}>
    <button type="button" aria-label={readyOnly?t.trayShowAll:t.trayShowReady} aria-pressed={readyOnly} onClick={()=>setReadyOnly(value=>!value)} className="min-h-[64px] min-w-[64px] shrink-0 rounded-xl bg-sky-50 px-1 text-xs font-semibold text-sky-950">{readyOnly?t.trayShowAll:t.trayShowReady}<span className="block">{t.partsCounter(placedPartIds.length,blueprint.parts.length)}</span></button>
    <div ref={scrollRef} id={trayId} className="parts-list min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">{partCards}</div>
  </aside>;
};
