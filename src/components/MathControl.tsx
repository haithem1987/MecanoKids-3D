import {MATH_TEXT} from '../i18n/translations';
import {MissionOptions} from './MissionPanel';
import type {LanguageCode} from '../types/game';
import type {MathControl as Control} from '../data/mathActivities';
export function MathControl({control,value,onChange,language}:{control:Control;value:number;onChange:(value:number)=>void;language:LanguageCode}){
 const locale=language==='fr'?0:language==='en'?1:2,label=MATH_TEXT[control.label][locale],options=control.options.map(option=>({value:option.value,label:option.label?MATH_TEXT[option.label][locale]:String(option.value)})),index=options.findIndex(option=>option.value===value);
 if(options.length<=3)return <MissionOptions label={label} value={value} options={options} onChange={onChange}/>;
 const button='min-h-16 min-w-16 rounded-xl border border-sky-200 bg-white text-xl text-sky-950 disabled:opacity-40';
 return <div className="flex min-w-0 gap-1"><button type="button" className={button} disabled={index<=0} aria-label={`${MATH_TEXT.less[locale]} ${label}`} onClick={()=>onChange(options[index-1].value)}>−</button><select data-mission-select className="min-h-16 min-w-0 flex-1 rounded-xl border border-sky-200 bg-white px-2 text-center text-sm font-bold text-sky-950" aria-label={label} value={value} onChange={event=>onChange(Number(event.target.value))}>{options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select><button type="button" className={button} disabled={index>=options.length-1} aria-label={`${MATH_TEXT.more[locale]} ${label}`} onClick={()=>onChange(options[index+1].value)}>+</button></div>;
}
