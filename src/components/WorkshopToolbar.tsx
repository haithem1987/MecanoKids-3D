import React from 'react';
import {
  CircleHelp,
  Compass,
  EyeOff,
  Layers,
  MapPin,
  Paintbrush,
  RotateCcw,
  Speech,
  Timer,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import {
  CameraPreset,
  LanguageCode,
  VisualStyleMode,
  WorkbenchEnvironmentMode,
} from '../types/game';
import { speechEngine } from '../utils/speech';

interface WorkshopToolbarProps {
  language: LanguageCode;
  xRayMode: boolean;
  onToggleXRay: () => void;
  environmentMode: WorkbenchEnvironmentMode;
  onToggleEnvironment: () => void;
  noSilhouetteMode: boolean;
  onToggleNoSilhouette: () => void;
  onOpenStudio: () => void;
  isDiagnosticActive: boolean;
  onStartDiagnostic: () => void;
  timerModeEnabled: boolean;
  onToggleTimerMode: () => void;
  voiceAutoRead: boolean;
  onToggleVoiceAutoRead: () => void;
  onOpenTour: () => void;
  muted: boolean;
  onToggleMute: () => void;
  onResetStage: () => void;
  explodedFactor: number;
  onChangeExploded: (val: number) => void;
  cameraPreset: CameraPreset;
  onSelectCamera: (preset: CameraPreset) => void;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
}

export const WorkshopToolbar: React.FC<WorkshopToolbarProps> = ({
  language,
  xRayMode,
  onToggleXRay,
  environmentMode,
  onToggleEnvironment,
  noSilhouetteMode,
  onToggleNoSilhouette,
  onOpenStudio,
  isDiagnosticActive,
  onStartDiagnostic,
  timerModeEnabled,
  onToggleTimerMode,
  voiceAutoRead,
  onToggleVoiceAutoRead,
  onOpenTour,
  muted,
  onToggleMute,
  onResetStage,
  explodedFactor,
  onChangeExploded,
  cameraPreset,
  onSelectCamera,
  visualStyle,
  onSelectStyle,
}) => {
  const t = UI_TRANSLATIONS[language];

  return (
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
        <button
          type="button"
          onClick={onToggleXRay}
          title={t.xRayTitle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer ${
            xRayMode
              ? 'bg-sky-50 border-sky-400 text-sky-900 hover:bg-sky-100'
              : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>{xRayMode ? t.xRayActiveBtn : t.xRayBtn}</span>
        </button>

        <button
          type="button"
          onClick={onToggleEnvironment}
          title={t.envSwitchTitle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer ${
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

        <button
          type="button"
          onClick={onOpenStudio}
          title={t.studioModalTitle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer"
        >
          <Paintbrush className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>{t.studioBtn}</span>
        </button>

        <button
          type="button"
          onClick={onToggleNoSilhouette}
          title={t.noSilhouetteTitle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer ${
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

        {!isDiagnosticActive && (
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden md:inline">{t.diagnosticBtn}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleTimerMode}
          title={t.timerModeSwitchDesc}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer ${
            timerModeEnabled
              ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
              : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Timer
            className={`w-3.5 h-3.5 shrink-0 ${timerModeEnabled ? 'text-sky-600' : 'text-slate-500'}`}
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer ${
              voiceAutoRead
                ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                : 'bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Speech
              className={`w-3.5 h-3.5 shrink-0 ${voiceAutoRead ? 'text-sky-600' : 'text-slate-500'}`}
            />
            <span className="hidden xl:inline">{t.voiceAutoToggleShort}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenTour}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer"
          title={t.guideBtnTitle}
        >
          <CircleHelp className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden xl:inline">{t.guideBtn}</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? t.unmuteAria : t.muteAria}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer"
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[48px] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{t.resetBtn}</span>
        </button>
      </div>
    </div>
  );
};
