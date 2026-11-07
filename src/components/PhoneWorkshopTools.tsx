import {usePhoneLayout} from '../hooks/usePhoneLayout';
import {useEffect,useRef} from 'react';
import {Camera,Undo2,Volume2,Crosshair} from 'lucide-react';
import {PHONE_HUD_TEXT,UI_TRANSLATIONS} from '../i18n/translations';
import {CameraPreset,type LanguageCode} from '../types/game';
export function PhoneWorkshopTools({language,preset,onCamera,onUndo,canUndo,onListen}:{language:LanguageCode;preset:CameraPreset;onCamera:(preset:CameraPreset)=>void;onUndo:()=>void;canUndo:boolean;onListen:()=>void}){
 const phone=usePhoneLayout();
 const t=UI_TRANSLATIONS[language],locale=language==='fr'?0:language==='en'?1:2,ref=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{const close=(event:PointerEvent)=>{if(ref.current&&!ref.current.contains(event.target as Node))ref.current.open=false;};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[]);
 const button='flex min-h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-sky-950 shadow-sm';
 if(!phone)return null;
 return <nav data-tour="camera-controls" data-phone-toolbar aria-label={t.cameraAnglesAria} className="hud-phone-tools pointer-events-auto">
  <details ref={ref} className="phone-camera-menu relative"><summary className={`${button} cursor-pointer`} aria-label={t.cameraAnglesAria}><Camera className="h-5 w-5" aria-hidden/><span>{PHONE_HUD_TEXT.view[locale]}</span></summary>
   <div className="phone-camera-options absolute z-30 grid w-64 grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
    {([CameraPreset.ISO,CameraPreset.FRONT,CameraPreset.SIDE,CameraPreset.TOP] as const).map((view,index)=><button key={view} type="button" className={`${button} w-full aria-pressed:bg-sky-100`} aria-pressed={preset===view} onClick={()=>{onCamera(view);if(ref.current)ref.current.open=false;}}>{[t.camIso,t.camFront,t.camSide,t.camTop][index]}</button>)}
    <button type="button" className={`${button} col-span-2 w-full`} onClick={()=>{onCamera(preset);if(ref.current)ref.current.open=false;}}><Crosshair className="h-5 w-5" aria-hidden/>{t.recenterBtn}</button>
   </div>
  </details>
  <button type="button" className={`${button} disabled:opacity-40`} disabled={!canUndo} aria-label={t.undoBtn} onClick={onUndo}><Undo2 className="h-5 w-5" aria-hidden/><span>{t.undoBtn}</span></button>
  <button type="button" className={button} aria-label={t.replayInstructionAria} onClick={onListen}><Volume2 className="h-5 w-5" aria-hidden/><span>{PHONE_HUD_TEXT.listen[locale]}</span></button>
 </nav>;
}
