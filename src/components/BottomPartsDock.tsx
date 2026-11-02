import React from 'react';
import {
  AlertTriangle,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Compass,
  EyeOff,
  Gem,
  Layers,
  Lock,
  MapPin,
  Paintbrush,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Speech,
  Square,
  Timer,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';
import { applyLiveryToPartSpec } from '../data/liveries';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  CameraPreset,
  LanguageCode,
  LiveryPresetId,
  PartSpec,
  VehicleBlueprint,
  VisualStyleMode,
  WorkbenchEnvironmentMode,
} from '../types/game';
import { formatStopwatchMs } from '../utils/speedrun';
import { speechEngine } from '../utils/speech';
import { getPartShapeSvg } from '../utils/partShape';

interface BottomPartsDockProps {
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  totalStages: number;
  placedPartIds: string[];
  liveryPreset: LiveryPresetId;
  testDriveActive: boolean;
  onToggleTestDrive: () => void;
  xRayMode: boolean;
  onToggleXRay: () => void;
  environmentMode: WorkbenchEnvironmentMode;
  onToggleEnvironment: () => void;
  noSilhouetteMode: boolean;
  onToggleNoSilhouette: () => void;
  onOpenStudio: () => void;
  hasPatent: boolean;
  onOpenQuiz: () => void;
  diagnosticInfo: { faultyPartIds: string[]; missingLeft: number } | null;
  onStartDiagnostic: () => void;
  onQuitDiagnostic: () => void;
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
  voiceAutoRead: boolean;
  onToggleVoiceAutoRead: () => void;
  timerModeEnabled: boolean;
  liveElapsedMs: number;
  personalBestMs: number | null;
  onToggleTimerMode: () => void;
  onOpenLeaderboard: () => void;
  onResetStage: () => void;
  onSaveNow: () => void;
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
  language,
  blueprint,
  totalStages,
  placedPartIds,
  liveryPreset,
  testDriveActive,
  onToggleTestDrive,
  xRayMode,
  onToggleXRay,
  environmentMode,
  onToggleEnvironment,
  noSilhouetteMode,
  onToggleNoSilhouette,
  onOpenStudio,
  hasPatent,
  onOpenQuiz,
  diagnosticInfo,
  onStartDiagnostic,
  onQuitDiagnostic,
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
  voiceAutoRead,
  onToggleVoiceAutoRead,
  timerModeEnabled,
  liveElapsedMs,
  personalBestMs,
  onToggleTimerMode,
  onOpenLeaderboard,
  onResetStage,
  onSaveNow,
  onStartPartDrag,
  onClickPartCard,
  onOpenCatalog,
  onOpenVictoryModal,
  hasNextStage,
  onGoNextStage,
  onOpenTour,
  statusMessage,
}) => {
  const t = UI_TRANSLATIONS[language];
  const placedSet = new Set(placedPartIds);
  const faultySet = new Set(diagnosticInfo?.faultyPartIds ?? []);
  const isDiagnosticActive = diagnosticInfo !== null;
  const isStageCompleted =
    !isDiagnosticActive && placedPartIds.length === blueprint.parts.length;

  const getMissingDepName = (part: PartSpec): string | null => {
    for (const depId of part.dependsOn) {
      if (!placedSet.has(depId)) {
        return blueprint.parts.find((p) => p.id === depId)?.name ?? '';
      }
    }
    return null;
  };

  return (
    <section
      aria-label={t.dockAriaLabel}
      className="pointer-events-none fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95vw] max-w-[1040px] flex flex-col items-center"
    >
      {/* Contextual helper banner when needed */}
      {statusMessage && !collapsed && (
        <div className="pointer-events-auto mb-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-sm text-center">
          {statusMessage}
        </div>
      )}

      {/* Collapse / Expand Tab (Cinema / Zen 3D Mode) */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-b-0 border-slate-200 rounded-t-lg text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer min-h-[36px]"
        title={t.shortcutH}
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 shrink-0" />
            <span>
              {t.openWorkbench(placedPartIds.length, blueprint.parts.length)}
              {timerModeEnabled && !isDiagnosticActive
                ? ` · ${formatStopwatchMs(liveElapsedMs)}`
                : ''}
            </span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            <span>{t.collapseWorkbench}</span>
          </>
        )}
      </button>

      {/* Main Dock Panel (Solid surface — zero backdrop-filter over WebGL) */}
      {!collapsed && (
        <div className="pointer-events-auto w-full bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          {/* Diagnostic & Repair Active Banner */}
          {isDiagnosticActive && diagnosticInfo && (
            <div className="mb-3 px-3.5 py-2 bg-amber-50 border border-amber-300 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-amber-950">
                <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {t.diagnosticActiveBanner(
                    diagnosticInfo.faultyPartIds.length,
                    diagnosticInfo.missingLeft,
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={onQuitDiagnostic}
                className="px-2.5 py-1 text-xs font-semibold text-amber-950 bg-white border border-amber-300 hover:bg-amber-100 rounded-md transition-colors cursor-pointer"
              >
                {t.diagnosticQuitBtn}
              </button>
            </div>
          )}

          {/* Row 1: Stage Metadata + Live Stopwatch + Completion Actions (3D Test Drive / Patent Quiz / Discovery / Next) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-display text-base font-bold text-slate-900">
                {blueprint.name}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-700">
                {blueprint.isDailyBonus
                  ? t.dailyBonusStageLabel
                  : t.stageOf(blueprint.stageNumber, totalStages)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{blueprint.tierLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-sky-700">
                {t.partsCounter(placedPartIds.length, blueprint.parts.length)}
              </span>

              {timerModeEnabled && !isDiagnosticActive && (
                <>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={onOpenLeaderboard}
                    title={t.leaderboardTitle}
                    className="inline-flex items-center gap-1.5 font-mono tabular-nums font-bold text-sky-900 hover:text-sky-700 hover:underline cursor-pointer"
                  >
                    <Timer className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{formatStopwatchMs(liveElapsedMs)}</span>
                    {personalBestMs !== null && (
                      <span className="font-sans font-normal text-slate-500">
                        ({t.personalBestShort(formatStopwatchMs(personalBestMs))})
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onSaveNow}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                title={t.savePanelTitle}
              >
                <Save className="w-3 h-3 shrink-0" />
                <span>{t.autoSavedBadge}</span>
              </button>

              {/* Mobile / Tablet quick access to Catalog */}
              <button
                type="button"
                onClick={onOpenCatalog}
                className="xl:hidden px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md whitespace-nowrap cursor-pointer"
              >
                {t.stagesBtn}
              </button>

              {isStageCompleted ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleTestDrive}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                      testDriveActive
                        ? 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600'
                        : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                    }`}
                  >
                    {testDriveActive ? (
                      <Square className="w-3 h-3 shrink-0" />
                    ) : (
                      <Play className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{testDriveActive ? t.testDriveActiveBtn : t.testDriveBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenQuiz}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                      hasPatent
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                        : 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{hasPatent ? t.quizPassedBtn : t.quizOpenBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenVictoryModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.discoveryBtn}</span>
                  </button>

                  {(hasNextStage || blueprint.isDailyBonus) && (
                    <button
                      type="button"
                      onClick={onGoNextStage}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {blueprint.isDailyBonus ? t.returnToStagesBtn : t.nextStageBtn}
                    </button>
                  )}
                </div>
              ) : blueprint.isDailyBonus && !isDiagnosticActive ? (
                <button
                  type="button"
                  onClick={onGoNextStage}
                  className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  {t.returnToStagesBtn}
                </button>
              ) : !isDiagnosticActive ? (
                <span className="hidden 2xl:inline text-xs text-slate-500">
                  {t.dragInstruction}
                </span>
              ) : null}
            </div>
          </div>

          {/* Row 2: Horizontal Parts Tray */}
          <div
            data-tour="parts-tray"
            className="flex items-stretch gap-2.5 overflow-x-auto py-3 select-none"
          >
            {(() => {
              const unplaced = blueprint.parts.filter((p) => !placedSet.has(p.id));
              const placed = blueprint.parts.filter((p) => placedSet.has(p.id));
              const sorted = [...unplaced, ...placed];

              const firstAvailableId =
                unplaced.find(
                  (p) => !faultySet.has(p.id) && getMissingDepName(p) === null,
                )?.id ?? sorted[0]?.id;

              return sorted.map((part, idx) => {
                const paintedSpec = applyLiveryToPartSpec(part, liveryPreset);
                const isPlaced = placedSet.has(part.id);
                const isFaultyMounted = !isPlaced && faultySet.has(part.id);
                const missingDep = getMissingDepName(part);
                const isLocked = !isPlaced && !isFaultyMounted && missingDep !== null;
                const isSelected = stagedPartId === part.id || activeDragPartId === part.id;
                const isHinted = hintPartId === part.id && !isPlaced;
                const originalIdx = blueprint.parts.indexOf(part);

                // Separator before the first placed part
                const showSeparator = isPlaced && idx > 0 && !placedSet.has(sorted[idx - 1].id);

                return (
                  <React.Fragment key={part.id}>
                    {showSeparator && (
                      <div className="shrink-0 flex flex-col items-center justify-center gap-1 px-1">
                        <div className="w-px h-12 bg-slate-200" />
                        <span className="text-[10px] text-slate-400 whitespace-nowrap rotate-90 origin-center">
                          {placed.length}✓
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      data-tour={part.id === firstAvailableId ? 'first-part-card' : undefined}
                      disabled={isPlaced}
                      onPointerDown={(e) => {
                        if (isPlaced || isFaultyMounted) return;
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
                      className={`group shrink-0 w-44 text-start p-2.5 rounded-lg border transition-transform duration-150 flex flex-col justify-between min-h-[76px] ${
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
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono tabular-nums text-[11px] text-slate-400">
                          {String(originalIdx + 1).padStart(2, '0')}
                          {part.isRarePart ? ` · ${t.rarePartCardLabel}` : ''}
                        </span>
                        {isFaultyMounted ? (
                          <AlertTriangle
                            className="w-3.5 h-3.5 text-amber-600 shrink-0"
                            aria-hidden="true"
                          />
                        ) : part.isRarePart ? (
                          <Gem
                            className="w-3.5 h-3.5 text-amber-600 shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className="shrink-0"
                            style={{ width: 40, height: 40 }}
                            dangerouslySetInnerHTML={{
                              __html: getPartShapeSvg(part.roleHint, paintedSpec.primaryColor),
                            }}
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div className="mt-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {part.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-[11px]">
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
                              <span className="truncate">
                                {t.partStatusLockedAfter(missingDep ?? '')}
                              </span>
                            </span>
                          ) : isHinted ? (
                            <span className="text-amber-700 font-semibold truncate">
                              {t.partStatusHinted}
                            </span>
                          ) : (
                            <span className="text-sky-700 font-medium truncate">
                              {t.partStatusReady}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </React.Fragment>
                );
              });
            })()}
          </div>

          {/* Row 3: Workshop Controls (Exploded Slider + Camera + X-Ray / Decor / Studio / No-Silhouette / Repair + Audio + Reset) */}
          <div
            data-tour="camera-controls"
            className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100"
          >
            {/* Labeled Exploded-View Slider */}
            <div className="flex items-center gap-2.5">
              <label
                htmlFor="exploded-slider"
                className="text-xs font-medium text-slate-700 whitespace-nowrap"
              >
                {t.explodedViewLabel}{' '}
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
                className="w-20 sm:w-28 accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Mobile/Tablet 3 Visual Modes Switcher */}
            <div className="flex xl:hidden items-center gap-1 p-1 bg-slate-100 rounded-lg">
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
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
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
            <div
              className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
              role="group"
              aria-label={t.cameraAnglesAria}
            >
              <Compass className="w-3.5 h-3.5 text-slate-500 mx-1 hidden sm:block shrink-0" />
              {(
                [
                  [CameraPreset.ISO, t.camIso],
                  [CameraPreset.FRONT, t.camFront],
                  [CameraPreset.SIDE, t.camSide],
                  [CameraPreset.TOP, t.camTop],
                ] as const
              ).map(([preset, label]) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSelectCamera(preset)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    cameraPreset === preset
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Advanced 3D Tools & Game Modes + Audio + Reset */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* X-Ray Cutaway Mode */}
              <button
                type="button"
                onClick={onToggleXRay}
                title={t.xRayTitle}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer ${
                  xRayMode
                    ? 'bg-sky-50 border-sky-400 text-sky-900 hover:bg-sky-100'
                    : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{xRayMode ? t.xRayActiveBtn : t.xRayBtn}</span>
              </button>

              {/* Thematic vs Studio Turntable Environment */}
              <button
                type="button"
                onClick={onToggleEnvironment}
                title={t.envSwitchTitle}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer ${
                  environmentMode === 'auto_thematic'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                    : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">
                  {environmentMode === 'auto_thematic' ? t.envThematicBtn : t.envStudioBtn}
                </span>
              </button>

              {/* Paint Booth & 3D Postcard Studio */}
              <button
                type="button"
                onClick={onOpenStudio}
                title={t.studioModalTitle}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
              >
                <Paintbrush className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{t.studioBtn}</span>
              </button>

              {/* Master No-Silhouette Mode */}
              <button
                type="button"
                onClick={onToggleNoSilhouette}
                title={t.noSilhouetteTitle}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer ${
                  noSilhouetteMode
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-900 hover:bg-indigo-100'
                    : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">
                  {noSilhouetteMode ? t.noSilhouetteActiveBtn : t.noSilhouetteBtn}
                </span>
              </button>

              {/* Diagnostic & Repair Mode Launcher */}
              {!isDiagnosticActive && (
                <button
                  type="button"
                  onClick={onStartDiagnostic}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="hidden md:inline">{t.diagnosticBtn}</span>
                </button>
              )}

              {/* Stopwatch Mode Toggle */}
              <button
                type="button"
                onClick={onToggleTimerMode}
                title={t.timerModeSwitchDesc}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer ${
                  timerModeEnabled
                    ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                    : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Timer
                  className={`w-3.5 h-3.5 shrink-0 ${
                    timerModeEnabled ? 'text-sky-600' : 'text-slate-500'
                  }`}
                />
                <span className="hidden lg:inline">
                  {timerModeEnabled ? t.timerActiveLabel : t.timerToggleBtn}
                </span>
              </button>

              {speechEngine.isSupported() && (
                <button
                  type="button"
                  onClick={onToggleVoiceAutoRead}
                  title={t.voiceAutoReadDesc}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer ${
                    voiceAutoRead
                      ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                      : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Speech
                    className={`w-3.5 h-3.5 shrink-0 ${
                      voiceAutoRead ? 'text-sky-600' : 'text-slate-500'
                    }`}
                  />
                  <span className="hidden xl:inline">{t.voiceAutoToggleShort}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenTour}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
                title={t.guideBtnTitle}
              >
                <CircleHelp className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">{t.guideBtn}</span>
              </button>

              <button
                type="button"
                onClick={onToggleMute}
                aria-label={muted ? t.unmuteAria : t.muteAria}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
              >
                {muted ? (
                  <VolumeX className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={onResetStage}
                title={t.resetBtn}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t.resetBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
