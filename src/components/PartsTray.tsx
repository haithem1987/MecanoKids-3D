import React, { useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Gem,
  Lock,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Wrench,
} from 'lucide-react';
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
  visible: boolean;
  position: TrayPosition;
  onStartPartDrag: (partId: string) => void;
  onClickPartCard: (partId: string) => void;
  onToggleVisible: () => void;
  onChangePosition: (pos: TrayPosition) => void;
  /** Called when the pointer leaves the tray while a drag is active — collapses the tray without interrupting the gesture */
  onPartDraggedOut?: () => void;
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
  visible,
  position,
  onStartPartDrag,
  onClickPartCard,
  onToggleVisible,
  onChangePosition,
  onPartDraggedOut,
}) => {
  const t = UI_TRANSLATIONS[language];
  const placedSet = new Set(placedPartIds);
  const faultySet = new Set(faultyPartIds);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getMissingDepName = (part: PartSpec): string | null => {
    for (const depId of part.dependsOn) {
      if (!placedSet.has(depId)) {
        return blueprint.parts.find((p) => p.id === depId)?.name ?? '';
      }
    }
    return null;
  };

  // Scroll to first available part when tray reopens
  useEffect(() => {
    if (!visible || !scrollRef.current) return;
    const firstAvailable = blueprint.parts.find(
      (p) => !placedSet.has(p.id) && !faultySet.has(p.id) && getMissingDepName(p) === null,
    );
    if (!firstAvailable) return;
    const el = scrollRef.current.querySelector<HTMLElement>(
      `[data-part-id="${firstAvailable.id}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const isVertical = position === 'left' || position === 'right';

  const positionPicker = (
    <div className="flex items-center gap-1 shrink-0">
      {(['bottom', 'left', 'right'] as TrayPosition[]).map((pos) => {
        const Icon = pos === 'bottom' ? PanelBottom : pos === 'left' ? PanelLeft : PanelRight;
        return (
          <button
            key={pos}
            type="button"
            onClick={() => onChangePosition(pos)}
            title={pos}
            className={`p-1 rounded transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center ${
              position === pos
                ? 'bg-sky-100 text-sky-700'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
          </button>
        );
      })}
    </div>
  );

  const toggleButton = (
    <button
      type="button"
      onClick={onToggleVisible}
      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[32px]"
      title={visible ? t.collapseWorkbench : t.openWorkbench(placedPartIds.length, blueprint.parts.length)}
    >
      {isVertical ? (
        visible
          ? position === 'left'
            ? <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
            : <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          : position === 'left'
            ? <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            : <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
      ) : visible ? (
        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <ChevronUp className="w-3.5 h-3.5 shrink-0" />
      )}
    </button>
  );

  const unplaced = blueprint.parts.filter((p) => !placedSet.has(p.id));
  const placed = blueprint.parts.filter((p) => placedSet.has(p.id));
  const sorted = [...unplaced, ...placed];

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
          <div className={`shrink-0 flex ${isVertical ? 'flex-row items-center' : 'flex-col items-center justify-center'} gap-1 px-1`}>
            <div className={isVertical ? 'h-px w-8 bg-slate-200' : 'w-px h-12 bg-slate-200'} />
            <span className="text-[10px] text-slate-400 whitespace-nowrap">{placed.length}✓</span>
          </div>
        )}
      <button
        key={part.id}
        type="button"
        data-part-id={part.id}
        disabled={isPlaced}
        onPointerDown={(e) => {
          if (isPlaced || isFaultyMounted) return;
          if (e.button === 0 || e.pointerType !== 'mouse') {
            onStartPartDrag(part.id);
          }
        }}
        onClick={() => {
          if (!isPlaced) onClickPartCard(part.id);
        }}
        title={`${part.name} — ${part.roleHint}`}
        className={`group shrink-0 text-start p-2.5 rounded-lg border transition-transform duration-150 flex flex-col justify-between min-h-[76px] min-w-[120px] ${
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
              className="shrink-0"
              style={{ width: 40, height: 40 }}
              dangerouslySetInnerHTML={{ __html: getPartShapeSvg(part.roleHint, paintedSpec.primaryColor) }}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="mt-1">
          <p className="text-xs font-semibold text-slate-900 truncate">{part.name}</p>
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

  if (isVertical) {
    const side = position === 'left' ? 'left-3' : 'right-3';
    return (
      <div
        className={`pointer-events-none fixed ${side} top-1/2 -translate-y-1/2 z-20 flex ${
          position === 'left' ? 'flex-row' : 'flex-row-reverse'
        } items-center gap-1`}
      >
        {/* Toggle tab */}
        <div className="pointer-events-auto flex flex-col items-center bg-white border border-slate-200 rounded-lg shadow-sm py-1">
          {toggleButton}
          {positionPicker}
        </div>

        {/* Cards panel */}
        {visible && (
          <div
            ref={scrollRef}
            className="pointer-events-auto flex flex-col gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-y-auto max-h-[70vh] select-none"
            style={{ width: 160 }}
            onPointerLeave={() => { if (activeDragPartId) onPartDraggedOut?.(); }}
          >
            {partCards}
          </div>
        )}
      </div>
    );
  }

  // Bottom position: horizontal strip rendered inline (inside BottomPartsDock)
  return (
    <div data-tour="parts-tray" className="flex flex-col gap-1.5">
      {/* Header row: toggle + position picker */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1">
          {toggleButton}
          <span className="text-xs text-slate-500 font-medium">
            {t.partsCounter(placedPartIds.length, blueprint.parts.length)}
          </span>
        </div>
        {positionPicker}
      </div>

      {/* Cards row */}
      {visible && (
        <div
          ref={scrollRef}
          className="flex items-stretch gap-2.5 overflow-x-auto pb-1 select-none"
          onPointerLeave={() => { if (activeDragPartId) onPartDraggedOut?.(); }}
        >
          {partCards}
        </div>
      )}
    </div>
  );
};
