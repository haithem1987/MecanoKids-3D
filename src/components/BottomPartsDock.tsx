import React from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Compass,
  Lock,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  CameraPreset,
  PartSpec,
  VehicleBlueprint,
  VisualStyleMode,
} from '../types/game';

interface BottomPartsDockProps {
  blueprint: VehicleBlueprint;
  totalStages: number;
  placedPartIds: string[];
  stagedPartId: string | null;
  activeDragPartId: string | null;
  hintPartId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  explodedFactor: number;
  onChangeExploded: (val: number) => void;
  cameraPreset: CameraPreset;
  onSelectCamera: (preset: CameraPreset) => void;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
  muted: boolean;
  onToggleMute: () => void;
  onResetStage: () => void;
  onStartPartDrag: (partId: string) => void;
  onClickPartCard: (partId: string) => void;
  onOpenCatalog: () => void;
  onOpenVictoryModal: () => void;
  hasNextStage: boolean;
  onGoNextStage: () => void;
  onOpenTour: () => void;
  statusMessage: string | null;
}

export const BottomPartsDock: React.FC<BottomPartsDockProps> = ({
  blueprint,
  totalStages,
  placedPartIds,
  stagedPartId,
  activeDragPartId,
  hintPartId,
  collapsed,
  onToggleCollapse,
  explodedFactor,
  onChangeExploded,
  cameraPreset,
  onSelectCamera,
  visualStyle,
  onSelectStyle,
  muted,
  onToggleMute,
  onResetStage,
  onStartPartDrag,
  onClickPartCard,
  onOpenCatalog,
  onOpenVictoryModal,
  hasNextStage,
  onGoNextStage,
  onOpenTour,
  statusMessage,
}) => {
  const placedSet = new Set(placedPartIds);
  const isStageCompleted = placedPartIds.length === blueprint.parts.length;

  const getMissingDepName = (part: PartSpec): string | null => {
    for (const depId of part.dependsOn) {
      if (!placedSet.has(depId)) {
        return blueprint.parts.find((p) => p.id === depId)?.name ?? 'Base';
      }
    }
    return null;
  };

  return (
    <section
      aria-label="Établi des pièces et commandes 3D"
      className="pointer-events-none fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95vw] max-w-[960px] flex flex-col items-center"
    >
      {/* Contextual helper banner when needed */}
      {statusMessage && !collapsed && (
        <div className="pointer-events-auto mb-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-sm">
          {statusMessage}
        </div>
      )}

      {/* Collapse / Expand Tab (Cinema / Zen 3D Mode) */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-b-0 border-slate-200 rounded-t-lg text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer min-h-[36px]"
        title="Raccourci clavier : H"
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Ouvrir l&apos;établi ({placedPartIds.length}/{blueprint.parts.length})</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Réduire l&apos;établi</span>
          </>
        )}
      </button>

      {/* Main Dock Panel (Solid surface — zero backdrop-filter over WebGL) */}
      {!collapsed && (
        <div className="pointer-events-auto w-full bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          {/* Row 1: Quiet Unboxed Stage Metadata + Completion Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-display text-base font-bold text-slate-900">
                {blueprint.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Stage <span className="font-mono tabular-nums font-semibold text-slate-800">{blueprint.stageNumber}</span> sur{' '}
                <span className="font-mono tabular-nums">{totalStages}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{blueprint.tierLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-sky-700">
                Pièces : {placedPartIds.length} / {blueprint.parts.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile quick access to Catalog & Styles */}
              <button
                type="button"
                onClick={onOpenCatalog}
                className="md:hidden px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md whitespace-nowrap cursor-pointer"
              >
                Stages
              </button>

              {isStageCompleted ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenVictoryModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fiche Découverte</span>
                  </button>
                  {hasNextStage && (
                    <button
                      type="button"
                      onClick={onGoNextStage}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Stage suivant
                    </button>
                  )}
                </div>
              ) : (
                <span className="hidden sm:inline text-xs text-slate-500">
                  Glisse une pièce vers sa silhouette guide 3D (ou clique dessus puis sur le modèle)
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Horizontal Parts Tray */}
          <div
            data-tour="parts-tray"
            className="flex items-stretch gap-2.5 overflow-x-auto py-3 select-none"
          >
            {(() => {
              const firstAvailableId =
                blueprint.parts.find((p) => !placedSet.has(p.id) && getMissingDepName(p) === null)
                  ?.id ?? blueprint.parts[0]?.id;

              return blueprint.parts.map((part, idx) => {
                const isPlaced = placedSet.has(part.id);
                const missingDep = getMissingDepName(part);
                const isLocked = !isPlaced && missingDep !== null;
                const isSelected = stagedPartId === part.id || activeDragPartId === part.id;
                const isHinted = hintPartId === part.id && !isPlaced;

                return (
                  <button
                    key={part.id}
                    type="button"
                    data-tour={part.id === firstAvailableId ? 'first-part-card' : undefined}
                  disabled={isPlaced}
                  onPointerDown={(e) => {
                    if (isPlaced) return;
                    // Left mouse button or touch starts drag-to-3D immediately
                    if (e.button === 0 || e.pointerType !== 'mouse') {
                      onStartPartDrag(part.id);
                    }
                  }}
                  onClick={() => {
                    if (!isPlaced) {
                      onClickPartCard(part.id);
                    }
                  }}
                  title={`${part.name} — ${part.roleHint}`}
                  className={`group shrink-0 w-44 text-left p-2.5 rounded-lg border transition-transform duration-150 flex flex-col justify-between min-h-[76px] ${
                    isPlaced
                      ? 'bg-slate-50 border-slate-200 opacity-65 cursor-default'
                      : isSelected
                        ? 'bg-sky-50 border-sky-600 -translate-y-0.5 cursor-grab active:cursor-grabbing'
                        : isHinted
                          ? 'bg-amber-50 border-amber-500 -translate-y-0.5 cursor-grab'
                          : isLocked
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300 cursor-pointer'
                            : 'bg-white border-slate-200 hover:border-sky-500 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono tabular-nums text-[11px] text-slate-400">
                      0{idx + 1}
                    </span>
                    <span
                      className="w-3.5 h-3.5 rounded-sm border border-black/10 shrink-0"
                      style={{ backgroundColor: part.primaryColor }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {part.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[11px]">
                      {isPlaced ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <Check className="w-3 h-3 shrink-0" />
                          <span className="truncate">Fixée</span>
                        </span>
                      ) : isLocked ? (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Lock className="w-3 h-3 shrink-0" />
                          <span className="truncate">Après : {missingDep}</span>
                        </span>
                      ) : isHinted ? (
                        <span className="text-amber-700 font-semibold truncate">
                          Conseillée par Léo
                        </span>
                      ) : (
                        <span className="text-sky-700 font-medium truncate">
                          Prête à assembler
                        </span>
                      )}
                    </div>
                  </div>
                  </button>
                );
              });
            })()}
          </div>

          {/* Row 3: Workshop Controls (Exploded Slider + Camera Angles + Mobile Style + Audio + Reset) */}
          <div
            data-tour="camera-controls"
            className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100"
          >
            {/* Labeled Exploded-View Slider */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="exploded-slider"
                className="text-xs font-medium text-slate-700 whitespace-nowrap"
              >
                Vue éclatée :{' '}
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {Math.round(explodedFactor * 100)} %
                </span>
              </label>
              <input
                id="exploded-slider"
                type="range"
                min={0}
                max={100}
                step={2}
                value={Math.round(explodedFactor * 100)}
                onChange={(e) => onChangeExploded(Number(e.target.value) / 100)}
                className="w-28 sm:w-36 accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Mobile-only 3 Visual Modes Switcher */}
            <div className="flex md:hidden items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(
                [
                  [VisualStyleMode.WOOD, 'Bois'],
                  [VisualStyleMode.BLOCKS, 'Blocs'],
                  [VisualStyleMode.REALISTIC, 'Réaliste'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onSelectStyle(mode)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    visualStyle === mode
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Camera Angle Segmented Controls */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="Angles de caméra">
              <Compass className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5 hidden sm:block" />
              {(
                [
                  [CameraPreset.ISO, 'Vue 3/4'],
                  [CameraPreset.FRONT, 'Face'],
                  [CameraPreset.SIDE, 'Profil'],
                  [CameraPreset.TOP, 'Dessus'],
                ] as const
              ).map(([preset, label]) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSelectCamera(preset)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    cameraPreset === preset
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Guide, Audio & Reset Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenTour}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
                title="Relancer le tour du propriétaire"
              >
                <CircleHelp className="w-3.5 h-3.5" />
                <span>Guide</span>
              </button>

              <button
                type="button"
                onClick={onToggleMute}
                aria-label={muted ? 'Activer le son' : 'Couper le son'}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{muted ? 'Muet' : 'Son'}</span>
              </button>

              <button
                type="button"
                onClick={onResetStage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recommencer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
