import React, { useEffect, useRef, useState } from 'react';
import {
  CircleHelp,
  Compass,
  EyeOff,
  Layers,
  MapPin,
  MoreHorizontal,
  Paintbrush,
  RefreshCw,
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
  onReplayInstruction: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onResetStage: () => void;
  explodedFactor: number;
  onChangeExploded: (val: number) => void;
  cameraPreset: CameraPreset;
  onSelectCamera: (preset: CameraPreset) => void;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
}

const STYLE_OPTIONS = [
  { mode: VisualStyleMode.WOOD,     emoji: '🪵', labelKey: 'styleWoodShort' as const },
  { mode: VisualStyleMode.BLOCKS,   emoji: '🧱', labelKey: 'styleBlocksShort' as const },
  { mode: VisualStyleMode.REALISTIC, emoji: '✨', labelKey: 'styleRealisticShort' as const },
];

const CAMERA_OPTIONS = [
  { preset: CameraPreset.ISO,   labelKey: 'camIso' as const },
  { preset: CameraPreset.FRONT, labelKey: 'camFront' as const },
  { preset: CameraPreset.SIDE,  labelKey: 'camSide' as const },
  { preset: CameraPreset.TOP,   labelKey: 'camTop' as const },
];

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
  onReplayInstruction,
  onUndo,
  canUndo,
  onResetStage,
  explodedFactor,
  onChangeExploded,
  cameraPreset,
  onSelectCamera,
  visualStyle,
  onSelectStyle,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overflowOpen) return;
    const handler = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [overflowOpen]);

  return (
    <div
      data-tour="camera-controls"
      className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100"
    >
      {/* ── Visual style pills ── */}
      <div
        className="flex items-center gap-0.5 p-1 bg-slate-100 rounded-xl"
        role="group"
        aria-label={t.styleWood + ' / ' + t.styleBlocks + ' / ' + t.styleRealistic}
      >
        {STYLE_OPTIONS.map(({ mode, emoji, labelKey }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSelectStyle(mode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer min-h-[36px] ${
              visualStyle === mode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span aria-hidden="true">{emoji}</span>
            <span className="hidden sm:inline">{t[labelKey]}</span>
          </button>
        ))}
      </div>

      {/* ── Camera angle pills ── */}
      <div
        className="flex items-center gap-0.5 p-1 bg-slate-100 rounded-xl"
        role="group"
        aria-label={t.cameraAnglesAria}
      >
        <Compass className="w-3.5 h-3.5 text-slate-400 mx-1 hidden sm:block shrink-0" aria-hidden />
        {CAMERA_OPTIONS.map(({ preset, labelKey }) => (
          <button
            key={preset}
            type="button"
            onClick={() => onSelectCamera(preset)}
            className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
              cameraPreset === preset
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t[labelKey]}
          </button>
        ))}
      </div>

      {/* ── Primary action buttons ── */}
      <div className="flex items-center gap-1.5 ms-auto">
        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title={t.undoBtn}
          className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-default min-h-[40px] min-w-[40px] text-slate-700 bg-slate-100 hover:enabled:bg-slate-200"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span className="hidden lg:inline">{t.undoBtn}</span>
        </button>

        {/* Diagnostic */}
        {!isDiagnosticActive && (
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="hidden md:inline">{t.diagnosticBtn}</span>
          </button>
        )}

        {/* Mute */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? t.unmuteAria : t.muteAria}
          className="flex items-center justify-center px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0 min-h-[40px] min-w-[40px] cursor-pointer"
        >
          {muted
            ? <VolumeX className="w-4 h-4 shrink-0" />
            : <Volume2 className="w-4 h-4 shrink-0" />}
        </button>

        {/* ⋯ Overflow menu */}
        <div ref={overflowRef} className="relative">
          <button
            type="button"
            onClick={() => setOverflowOpen((o) => !o)}
            aria-label="Plus d'outils"
            aria-expanded={overflowOpen}
            className={`flex items-center justify-center px-2.5 py-2 rounded-xl transition-colors min-h-[40px] min-w-[40px] cursor-pointer ${
              overflowOpen
                ? 'bg-sky-100 text-sky-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <MoreHorizontal className="w-4 h-4 shrink-0" />
          </button>

          {overflowOpen && (
            <div className="absolute end-0 bottom-full mb-2 z-50 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 overflow-hidden">
              {/* XRay */}
              <button
                type="button"
                onClick={() => { onToggleXRay(); setOverflowOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  xRayMode ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 text-sky-500" />
                {xRayMode ? t.xRayActiveBtn : t.xRayBtn}
              </button>

              {/* No silhouette */}
              <button
                type="button"
                onClick={() => { onToggleNoSilhouette(); setOverflowOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  noSilhouetteMode ? 'bg-indigo-50 text-indigo-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <EyeOff className="w-4 h-4 shrink-0 text-indigo-500" />
                {noSilhouetteMode ? t.noSilhouetteActiveBtn : t.noSilhouetteBtn}
              </button>

              {/* Environment */}
              <button
                type="button"
                onClick={() => { onToggleEnvironment(); setOverflowOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  environmentMode === 'auto_thematic' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0 text-emerald-500" />
                {environmentMode === 'auto_thematic' ? t.envThematicBtn : t.envStudioBtn}
              </button>

              {/* Studio / Livrée */}
              <button
                type="button"
                onClick={() => { onOpenStudio(); setOverflowOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Paintbrush className="w-4 h-4 shrink-0 text-sky-500" />
                {t.studioBtn}
              </button>

              <div className="border-t border-slate-100 my-1" />

              {/* Exploded view */}
              <div className="px-4 py-2.5 flex items-center gap-3">
                <label htmlFor="exploded-slider-overflow" className="text-xs font-medium text-slate-600 whitespace-nowrap shrink-0">
                  {t.explodedViewLabel} <span className="font-mono font-semibold text-slate-800">{Math.round(explodedFactor * 100)}%</span>
                </label>
                <input
                  id="exploded-slider-overflow"
                  type="range"
                  min={0} max={100} step={2}
                  value={Math.round(explodedFactor * 100)}
                  onChange={(e) => onChangeExploded(Number(e.target.value) / 100)}
                  className="flex-1 accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="border-t border-slate-100 my-1" />

              {/* Timer */}
              <button
                type="button"
                onClick={() => { onToggleTimerMode(); setOverflowOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  timerModeEnabled ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Timer className={`w-4 h-4 shrink-0 ${timerModeEnabled ? 'text-sky-600' : 'text-slate-400'}`} />
                {timerModeEnabled ? t.timerActiveLabel : t.timerToggleBtn}
              </button>

              {/* Voice auto-read */}
              {speechEngine.isSupported() && (
                <button
                  type="button"
                  onClick={() => { onToggleVoiceAutoRead(); setOverflowOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    voiceAutoRead ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Speech className={`w-4 h-4 shrink-0 ${voiceAutoRead ? 'text-sky-600' : 'text-slate-400'}`} />
                  {t.voiceAutoToggleShort}
                </button>
              )}

              {/* Replay instruction */}
              {speechEngine.isSupported() && (
                <button
                  type="button"
                  onClick={() => { onReplayInstruction(); setOverflowOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 shrink-0 text-slate-400" />
                  {t.replayInstructionAria}
                </button>
              )}

              {/* Tour */}
              <button
                type="button"
                onClick={() => { onOpenTour(); setOverflowOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <CircleHelp className="w-4 h-4 shrink-0 text-slate-400" />
                {t.guideBtn}
              </button>

              <div className="border-t border-slate-100 my-1" />

              {/* Reset */}
              <button
                type="button"
                onClick={() => { onResetStage(); setOverflowOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                {t.resetBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
