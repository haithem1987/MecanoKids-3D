import React from 'react';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Play,
  Save,
  Sparkles,
  Square,
  Timer,
  Wrench,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  CameraPreset,
  LanguageCode,
  LiveryPresetId,
  VehicleBlueprint,
  VisualStyleMode,
  WorkbenchEnvironmentMode,
} from '../types/game';
import { formatStopwatchMs } from '../utils/speedrun';
import { PartsTray, TrayPosition } from './PartsTray';
import { WorkshopToolbar } from './WorkshopToolbar';

interface BottomPartsDockProps {
  language: LanguageCode;
  blueprint: VehicleBlueprint;
  totalStages: number;
  placedPartIds: string[];
  faultyPartIds: string[];
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
  onPartDraggedOut: () => void;
  onOpenCatalog: () => void;
  onOpenVictoryModal: () => void;
  hasNextStage: boolean;
  onGoNextStage: () => void;
  onOpenTour: () => void;
  statusMessage: string | null;
  // Parts tray state
  partsTrayVisible: boolean;
  partsTrayPosition: TrayPosition;
  onTogglePartsTray: () => void;
  onChangePartsTrayPosition: (pos: TrayPosition) => void;
}

export const BottomPartsDock: React.FC<BottomPartsDockProps> = ({
  language,
  blueprint,
  totalStages,
  placedPartIds,
  faultyPartIds,
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
  onPartDraggedOut,
  onOpenCatalog,
  onOpenVictoryModal,
  hasNextStage,
  onGoNextStage,
  onOpenTour,
  statusMessage,
  partsTrayVisible,
  partsTrayPosition,
  onTogglePartsTray,
  onChangePartsTrayPosition,
}) => {
  const t = UI_TRANSLATIONS[language];
  const isDiagnosticActive = diagnosticInfo !== null;
  const isStageCompleted =
    !isDiagnosticActive && placedPartIds.length === blueprint.parts.length;

  return (
    <section
      aria-label={t.dockAriaLabel}
      className="pointer-events-none fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95vw] max-w-[1040px] flex flex-col items-center"
    >
      {/* Contextual helper banner */}
      {statusMessage && !collapsed && (
        <div className="pointer-events-auto mb-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-sm text-center">
          {statusMessage}
        </div>
      )}

      {/* Collapse / Expand Tab */}
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

      {/* Main Dock Panel */}
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

          {/* Row 1: Stage Metadata + Completion Actions */}
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

          {/* Row 2: Parts Tray (bottom position only; left/right rendered by App.tsx) */}
          {partsTrayPosition === 'bottom' && (
            <div className="py-3 border-b border-slate-100">
              <PartsTray
                language={language}
                blueprint={blueprint}
                placedPartIds={placedPartIds}
                faultyPartIds={faultyPartIds}
                liveryPreset={liveryPreset}
                stagedPartId={stagedPartId}
                activeDragPartId={activeDragPartId}
                hintPartId={hintPartId}
                visible={partsTrayVisible}
                position="bottom"
                onStartPartDrag={onStartPartDrag}
                onClickPartCard={onClickPartCard}
                onToggleVisible={onTogglePartsTray}
                onChangePosition={onChangePartsTrayPosition}
                onPartDraggedOut={onPartDraggedOut}
              />
            </div>
          )}

          {/* Row 3: Workshop Controls */}
          <WorkshopToolbar
            language={language}
            xRayMode={xRayMode}
            onToggleXRay={onToggleXRay}
            environmentMode={environmentMode}
            onToggleEnvironment={onToggleEnvironment}
            noSilhouetteMode={noSilhouetteMode}
            onToggleNoSilhouette={onToggleNoSilhouette}
            onOpenStudio={onOpenStudio}
            isDiagnosticActive={isDiagnosticActive}
            onStartDiagnostic={onStartDiagnostic}
            timerModeEnabled={timerModeEnabled}
            onToggleTimerMode={onToggleTimerMode}
            voiceAutoRead={voiceAutoRead}
            onToggleVoiceAutoRead={onToggleVoiceAutoRead}
            onOpenTour={onOpenTour}
            muted={muted}
            onToggleMute={onToggleMute}
            onResetStage={onResetStage}
            explodedFactor={explodedFactor}
            onChangeExploded={onChangeExploded}
            cameraPreset={cameraPreset}
            onSelectCamera={onSelectCamera}
            visualStyle={visualStyle}
            onSelectStyle={onSelectStyle}
          />
        </div>
      )}
    </section>
  );
};
