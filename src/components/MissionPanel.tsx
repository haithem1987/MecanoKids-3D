import {useEffect,useId,useRef,useState,type ReactNode} from 'react';
import {ChevronLeft,ChevronRight,Info,Settings2,Volume2,X} from 'lucide-react';
import {MISSION_PANEL_TEXT,PHONE_HUD_TEXT,SCIENCE_CHALLENGE_TEXT,UI_TRANSLATIONS} from '../i18n/translations';
import type {LanguageCode} from '../types/game';
import {usePhoneLayout} from '../hooks/usePhoneLayout';
export type MissionField={id:string;label:string;content:ReactNode};
export const missionButton='mission-button min-h-16 min-w-16 rounded-xl border border-sky-200 bg-white px-2 py-1 text-xs font-semibold text-sky-950 hover:bg-sky-50 aria-pressed:bg-sky-100 disabled:opacity-40';
export function MissionOptions({label,options,value,onChange}:{label:string;options:readonly {value:number;label:string}[];value:number;onChange:(value:number)=>void}){
 return <>
  <select data-mission-select aria-label={label} className="mission-native-select min-h-16 w-full min-w-0 rounded-xl border border-sky-200 bg-white px-2 text-sm font-semibold text-sky-950" value={value} onChange={event=>onChange(Number(event.target.value))}>
   {options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
  </select>
  <div className="mission-button-options flex flex-wrap gap-1">{options.map(option=><button type="button" data-mission-value={option.value} key={option.value} className={missionButton} aria-pressed={option.value===value} onClick={()=>onChange(option.value)}>{option.label}</button>)}</div>
 </>;
}
function FieldPager({fields,language}:{fields:readonly MissionField[];language:LanguageCode}){
 const [page,setPage]=useState(0),current=Math.min(page,Math.max(0,fields.length-1)),field=fields[current];
 const locale=language==='fr'?0:language==='en'?1:2,t=MISSION_PANEL_TEXT;
 if(!field)return null;
 return <div data-mission-current={field.id} className="mission-field-pager space-y-1">
  <div className="flex min-h-16 items-center gap-1">
   {fields.length>1&&<button type="button" data-mission-previous className={missionButton} aria-label={t.previous[locale]} disabled={current===0} onClick={()=>setPage(Math.max(0,current-1))}><ChevronLeft className="h-5 w-5 rtl:-scale-x-100" aria-hidden/></button>}
   <h3 className="min-w-0 flex-1 text-center text-sm font-bold text-sky-950">{field.label}{fields.length>1&&<span className="block text-xs font-normal">{current+1} / {fields.length}</span>}</h3>
   {fields.length>1&&<button type="button" data-mission-next className={missionButton} aria-label={t.next[locale]} disabled={current===fields.length-1} onClick={()=>setPage(current+1)}><ChevronRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden/></button>}
  </div>
  <div data-mission-field={field.id}>{field.content}</div>
 </div>;
}
type DataAttributes={ [key:`data-${string}`]:string|number|boolean|undefined };
export function MissionPanel({language,title,ready=true,fields=[],actions,info,status,onListen,speaking=false,attributes={},closeOnChange=false}:{
 language:LanguageCode;title:string;ready?:boolean;fields?:readonly MissionField[];actions?:ReactNode;info:ReactNode;status?:ReactNode;
 onListen?:()=>void;speaking?:boolean;attributes?:DataAttributes;closeOnChange?:boolean;
}){
 const phone=usePhoneLayout(),[controlsOpen,setControlsOpen]=useState(false),[infoOpen,setInfoOpen]=useState(false);
 const root=useRef<HTMLElement|null>(null),infoId=useId(),locale=language==='fr'?0:language==='en'?1:2,t=MISSION_PANEL_TEXT;
 useEffect(()=>{const outside=(event:PointerEvent)=>{if(root.current&&!root.current.contains(event.target as Node)){setControlsOpen(false);setInfoOpen(false);}};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[]);
 const listenLabel=speaking?UI_TRANSLATIONS[language].voiceStopBtn:SCIENCE_CHALLENGE_TEXT.listen[locale];
 const content=<>
  {phone&&ready&&<div className="mission-status line-clamp-1 text-xs text-sky-950" role="status" aria-live="polite">{status||title}</div>}
  {ready&&fields.length>0&&<div data-mission-parameters className="mission-parameters" hidden={phone&&!controlsOpen} style={{display:phone&&!controlsOpen?'none':undefined}} onChangeCapture={()=>{if(phone&&closeOnChange)setControlsOpen(false);}}><FieldPager fields={fields} language={language}/></div>}
  <div className="mission-actions flex gap-1" onClickCapture={event=>{if((event.target as HTMLElement).closest('[data-mission-primary],[data-mission-reset]')){setControlsOpen(false);setInfoOpen(false);}}}>
   {phone&&ready&&fields.length>0&&<button type="button" data-mission-open-controls className={missionButton} aria-expanded={controlsOpen} aria-label={t.controls[locale]} onClick={()=>{setInfoOpen(false);setControlsOpen(v=>!v);}}><Settings2 className="mx-auto h-5 w-5" aria-hidden/><span>{t.controls[locale]}</span></button>}
   {ready&&actions}
   {onListen&&<button type="button" className={`${missionButton} mission-listen`} aria-label={listenLabel} onClick={onListen}><Volume2 className="mx-auto h-5 w-5" aria-hidden/><span>{PHONE_HUD_TEXT.listen[locale]}</span></button>}
   <button type="button" data-mission-open-info className={missionButton} aria-label={t.info[locale]} aria-expanded={infoOpen} aria-controls={infoId} onClick={()=>{setControlsOpen(false);setInfoOpen(v=>!v);}}><Info className="mx-auto h-5 w-5" aria-hidden/><span>{t.infoShort[locale]}</span></button>
  </div>
  {infoOpen&&<section id={infoId} className="mission-information rounded-xl border border-sky-200 bg-white p-3 text-sky-950 shadow-lg" aria-label={t.info[locale]}>
   <div className="mission-information-body space-y-2"><h3 className="font-bold">{title}</h3>{info}</div>
   <div className="mt-2 flex gap-1">{onListen&&<button type="button" className={`${missionButton} flex-1`} onClick={onListen}>{listenLabel}</button>}<button type="button" className={`${missionButton} flex-1`} onClick={()=>setInfoOpen(false)}><X className="mx-auto h-5 w-5" aria-hidden/>{t.close[locale]}</button></div>
  </section>}
 </>;
 if(phone)return <section {...attributes} ref={element=>{root.current=element;}} data-mission-shell data-phone-mission data-ready={ready} className="mission-panel" aria-label={title} onKeyDown={event=>{if(event.key==='Escape'){setControlsOpen(false);setInfoOpen(false);event.stopPropagation();}}}>{content}</section>;
 return <details {...attributes} ref={element=>{root.current=element;}} data-mission-shell data-ready={ready} className="mission-panel rounded-xl border border-sky-200 bg-white p-2 text-sky-950 shadow">
  <summary className="min-h-16 cursor-pointer content-center px-2 font-bold">{title}{status&&<span className="block line-clamp-1 text-xs font-normal" role="status">{status}</span>}</summary>
  <div className="mission-content space-y-2">{content}</div>
 </details>;
}
