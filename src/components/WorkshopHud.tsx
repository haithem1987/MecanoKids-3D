import { PhoneWorkshopTools } from './PhoneWorkshopTools';
import {Settings2,Undo2,Volume2,Play,Sparkles,ArrowRight,Crosshair} from 'lucide-react';
import { formatStopwatchMs } from '../utils/speedrun';
import React from 'react';
import { PHONE_HUD_TEXT, UI_TRANSLATIONS } from '../i18n/translations';
import {
  CameraPreset,
  LanguageCode,
  LiveryPresetId,
  VehicleBlueprint,
  VisualStyleMode,
  WorkbenchEnvironmentMode,
} from '../types/game';
import { isAssemblyComplete } from '../utils/assemblyValidation';
import { PartsTray, TrayPosition } from './PartsTray';

interface WorkshopHudProps {
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
  explodedFactor: number;
  onChangeExploded: (val: number) => void;
  cameraPreset: CameraPreset;
  onSelectCamera: (preset: CameraPreset) => void;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
  muted: boolean;
  onToggleMute: () => void;
  onReplayInstruction: () => void;
  voiceAutoRead: boolean;
  onToggleVoiceAutoRead: () => void;
  timerModeEnabled: boolean;
  liveElapsedMs: number;
  personalBestMs: number | null;
  onToggleTimerMode: () => void;
  onOpenLeaderboard: () => void;
  onUndo: () => void;
  canUndo: boolean;
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
  // Parts tray state
  partsTrayPosition: TrayPosition;
  onChangePartsTrayPosition: (pos: TrayPosition) => void;
}

export const WorkshopHud: React.FC<WorkshopHudProps> = ({
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
  explodedFactor,
  onChangeExploded,
  cameraPreset,
  onSelectCamera,
  visualStyle,
  onSelectStyle,
  muted,
  onToggleMute,
  onReplayInstruction,
  voiceAutoRead,
  onToggleVoiceAutoRead,
  timerModeEnabled,
  liveElapsedMs,
  personalBestMs,
  onToggleTimerMode,
  onOpenLeaderboard,
  onUndo,
  canUndo,
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
  partsTrayPosition,
  onChangePartsTrayPosition,
}) => {
  const t = UI_TRANSLATIONS[language];
  const locale=language==='fr'?0:language==='en'?1:2;
  const settingsRef=React.useRef<HTMLDetailsElement>(null);
  React.useEffect(()=>{
    const close=(event:PointerEvent)=>{if(settingsRef.current&&!settingsRef.current.contains(event.target as Node))settingsRef.current.open=false;};
    document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);
  },[]);
  const isDiagnosticActive = diagnosticInfo !== null;
  const isStageCompleted =
    !isDiagnosticActive && isAssemblyComplete(blueprint, placedPartIds);

  const side = partsTrayPosition === 'right' ? 'right' : 'left';
  const button = 'pointer-events-auto min-h-16 min-w-16 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-sky-950 shadow-sm';
  return <div data-workshop-hud data-palette-side={side} className="pointer-events-none absolute inset-0 z-20">
    <PartsTray language={language} blueprint={blueprint} placedPartIds={placedPartIds} faultyPartIds={faultyPartIds}
      liveryPreset={liveryPreset} stagedPartId={stagedPartId} activeDragPartId={activeDragPartId} hintPartId={hintPartId}
      position={side} onStartPartDrag={id=>{if(settingsRef.current)settingsRef.current.open=false;onStartPartDrag(id);}} onClickPartCard={id=>{if(settingsRef.current)settingsRef.current.open=false;onClickPartCard(id);}}
      />
    <PhoneWorkshopTools language={language} preset={cameraPreset} onCamera={onSelectCamera} onUndo={onUndo} canUndo={canUndo} onListen={onReplayInstruction}/>
    <div className="hud-title absolute top-2 start-1/2 max-w-[calc(100%-16rem)] rounded-xl bg-white/90 px-3 py-2 text-center text-xs text-sky-950">
      <strong className="block truncate">{blueprint.name}</strong><span className="hud-counter">{t.partsCounter(placedPartIds.length,blueprint.parts.length)}</span>{timerModeEnabled&&<span className="block font-mono">{formatStopwatchMs(liveElapsedMs)}</span>}
    </div>
    <nav data-tour="camera-controls" data-floating-camera aria-label={t.cameraAnglesAria} className={`pointer-events-auto absolute top-2 flex max-h-[calc(100%-6rem)] flex-col gap-1 overflow-y-auto overscroll-contain ${side==='right'?'start-2':'end-2'}`}>
      {([['iso',t.camIso],['front',t.camFront],['side',t.camSide],['top',t.camTop]] as const).map(([preset,label])=><button key={preset} type="button" aria-pressed={cameraPreset===preset} onClick={()=>onSelectCamera(preset as CameraPreset)} className={`${button} w-16 px-1 aria-pressed:bg-sky-100`}>{label}</button>)}
      <button type="button" onClick={()=>onSelectCamera(cameraPreset)} aria-label={t.recenterBtn} className={button}><Crosshair className="h-6 w-6" aria-hidden /></button>
      <button type="button" disabled={!canUndo} onClick={onUndo} aria-label={t.undoBtn} className={`${button} disabled:opacity-40`}><Undo2 className="h-6 w-6" aria-hidden /></button>
      <button type="button" onClick={onReplayInstruction} aria-label={t.replayInstructionAria} className={button}><Volume2 className="h-6 w-6" aria-hidden /></button>
    </nav>
    <details ref={settingsRef} onKeyDown={event=>{if(event.key==='Escape')event.currentTarget.open=false;}} className={`hud-settings pointer-events-auto absolute bottom-2 ${side==='right'?'start-2':'end-2'}`}>
      <summary className={`${button} flex w-16 cursor-pointer items-center justify-center text-xl`} aria-label={t.hudTools}><Settings2 className="h-6 w-6" aria-hidden /><span className="phone-tool-label">{PHONE_HUD_TEXT.settings[locale]}</span></summary>
      <div className={`absolute bottom-full mb-2 max-h-[min(70svh,calc(100svh-12rem))] w-[min(22rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl ${side==='right'?'start-0':'end-0'}`}>
        <h2 className="mb-2 font-bold text-sky-950">{t.hudTools}</h2>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={button} onClick={onOpenCatalog}>{t.stagesBtn}</button>
          <button type="button" className={button} onClick={onSaveNow}>{t.autoSavedBadge}</button>
          <button type="button" className={button} onClick={onToggleMute}>{muted?t.unmuteAria:t.muteAria}</button>
          <button type="button" className={button} onClick={onToggleVoiceAutoRead}>{t.voiceAutoToggleShort}</button>
          <button type="button" className={button} onClick={onToggleXRay}>{xRayMode?t.xRayActiveBtn:t.xRayBtn}</button>
          <button type="button" className={button} onClick={onToggleNoSilhouette}>{noSilhouetteMode?t.noSilhouetteActiveBtn:t.noSilhouetteBtn}</button>
          <button type="button" className={button} onClick={onToggleEnvironment}>{environmentMode==='auto_thematic'?t.envThematicBtn:t.envStudioBtn}</button>
          <button type="button" className={button} onClick={onOpenStudio}>{t.studioBtn}</button>
          <button type="button" className={button} onClick={isDiagnosticActive?onQuitDiagnostic:onStartDiagnostic}>{isDiagnosticActive?t.diagnosticQuitBtn:t.diagnosticBtn}</button>
          <button type="button" className={button} onClick={onToggleTimerMode}>{timerModeEnabled?t.timerActiveLabel:t.timerToggleBtn}</button>
          <button type="button" className={button} onClick={onResetStage}>{t.resetBtn}</button>
          <button type="button" className={button} onClick={onOpenTour}>{t.guideBtn}</button>
          {isStageCompleted&&<button type="button" className={button} onClick={onOpenQuiz}>{hasPatent?t.quizPassedBtn:t.quizOpenBtn}</button>}
          {isStageCompleted&&<button type="button" className={button} onClick={onOpenVictoryModal}>{t.discoveryBtn}</button>}
          {([['wood',t.styleWood],['blocks',t.styleBlocks],['realistic',t.styleRealistic],['comics',t.styleComics]] as const).map(([style,label])=><button type="button" key={style} aria-pressed={visualStyle===style} onClick={()=>onSelectStyle(style as VisualStyleMode)} className={button}>{label}</button>)}
          <button type="button" aria-pressed={side==='left'} className={button} onClick={()=>onChangePartsTrayPosition('left')}>{t.trayPositionStart}</button>
          <button type="button" aria-pressed={side==='right'} className={button} onClick={()=>onChangePartsTrayPosition('right')}>{t.trayPositionEnd}</button>
        </div>
        <label className="mt-3 block text-sm text-sky-950">{t.explodedViewLabel}<input aria-label={t.explodedViewLabel} type="range" min="0" max="100" value={Math.round(explodedFactor*100)} onChange={event=>onChangeExploded(Number(event.target.value)/100)} className="block min-h-16 w-full" /></label>
      </div>
    </details>
    {!isStageCompleted&&(statusMessage||diagnosticInfo)&&<div role="status" aria-live="polite" className="hud-status pointer-events-none absolute bottom-3 start-1/2 w-[min(28rem,calc(100%-16rem))] rounded-xl bg-slate-900/90 px-3 py-2 text-center text-xs text-white">{diagnosticInfo?t.diagnosticActiveBanner(diagnosticInfo.faultyPartIds.length,diagnosticInfo.missingLeft):statusMessage}</div>}
    {isStageCompleted&&<div className="hud-completion pointer-events-auto absolute bottom-2 flex justify-center gap-1">
      {!blueprint.staticStructure&&!blueprint.virtualLab&&blueprint.id!=='master-drawbridge'&&<button type="button" aria-label={testDriveActive?t.testDriveActiveBtn:t.testDriveBtn} title={t.testDriveBtn} className={`${button} bg-amber-50 text-xl`} onClick={onToggleTestDrive}><Play className="h-6 w-6" aria-hidden /></button>}
      <button type="button" aria-label={t.discoveryBtn} title={t.discoveryBtn} className={`${button} text-xl`} onClick={onOpenVictoryModal}><Sparkles className="h-6 w-6" aria-hidden /></button>
      {(hasNextStage||blueprint.isDailyBonus)&&<button type="button" aria-label={t.nextStageBtn} title={t.nextStageBtn} className={`${button} bg-sky-100 text-xl`} onClick={onGoNextStage}><ArrowRight className="h-6 w-6 rtl:-scale-x-100" aria-hidden /></button>}
    </div>}
  </div>;
};
