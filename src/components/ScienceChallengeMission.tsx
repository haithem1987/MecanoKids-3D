import {useState} from 'react';
import {CATALOG_BROWSE_TEXT,SCIENCE_CHALLENGE_TEXT,VIRTUAL_LAB_UI,MISSION_PANEL_TEXT} from '../i18n/translations';
import {meetsChallenge,observeChallenge,type ScienceChallenge,type ScienceTrial} from '../data/scienceChallenges';
import type {LanguageCode} from '../types/game';
import {useSpeech} from '../utils/speech';
import {MissionPanel,MissionOptions,missionButton,type MissionField} from './MissionPanel';
export function ScienceChallengeMission({blueprintId,challenges,trial,language,assembled,onTrial,onAction}:{
 blueprintId:string;challenges:readonly ScienceChallenge[];trial?:ScienceTrial;language:LanguageCode;assembled:boolean;
 onTrial:(trial:ScienceTrial|undefined)=>void;onAction:(value:number)=>void;
}){
 const locale=language==='fr'?0:language==='en'?1:2,t=SCIENCE_CHALLENGE_TEXT;
 const [selected,setSelected]=useState(0),{isSupported,toggle,isSpeaking,activeId}=useSpeech();
 const chosen=challenges[Math.min(selected,challenges.length-1)];
 if(!chosen)return null;
 const challenge=trial?.challenge??chosen,result=trial&&observeChallenge(trial.challenge,trial.setting),solved=Boolean(trial&&meetsChallenge(trial.challenge,trial.setting));
 const goal=challenge.kind==='circuit'?t[challenge.target==='on'?'circuitGoalOn':'circuitGoalOff']:challenge.kind==='lever'?t.leverGoal:t.moleculeGoal;
 const explanation=challenge.kind==='circuit'?t.circuitWhy:challenge.kind==='lever'?t.leverWhy:challenge.centre==='C'?t.carbonWhy:t.waterWhy;
 const guidance=assembled?goal[locale]:VIRTUAL_LAB_UI.assemble[locale];
 const start=()=>onTrial({blueprintId,challenge,setting:challenge.start});
 let fields:MissionField[];
 if(!trial)fields=[{id:'challenge',label:MISSION_PANEL_TEXT.choose[locale],content:<div data-science-choice><MissionOptions label={MISSION_PANEL_TEXT.choose[locale]} value={selected} options={challenges.map((item,value)=>({value,label:t[item.id][locale]}))} onChange={setSelected}/></div>}];
 else if(challenge.kind==='circuit')fields=Array.from({length:challenge.switches},(_,index)=>{
  const closed=Number(Boolean(trial.setting&(1<<index))),label=`${t.switch[locale]} ${index+1}`;
  return {id:String(index),label,content:<fieldset data-science-switch={index}><legend className="sr-only">{label}</legend><MissionOptions label={label} value={closed} options={[{value:0,label:t.opened[locale]},{value:1,label:t.closed[locale]}]} onChange={value=>{if(value!==closed)onAction(index);}}/></fieldset>};
 });
 else {
  const options=challenge.kind==='lever'?[1,2,3,4].map(value=>({value,label:`${t.distance[locale]} ${value}`})):([t.empty,t.hydrogen,t.oxygen] as const).map((label,value)=>({value,label:label[locale]}));
  const label=challenge.kind==='lever'?t.distance[locale]:t[challenge.id][locale];
  fields=[{id:'action',label,content:<fieldset data-science-action-control><legend className="sr-only">{label}</legend><MissionOptions label={label} value={trial.setting} options={options} onChange={onAction}/></fieldset>}];
 }
 return <MissionPanel language={language} title={trial?t[challenge.id][locale]:VIRTUAL_LAB_UI.mission[locale]} attributes={{'data-science-mission':blueprintId}} ready={assembled} fields={fields}
  status={result&&(solved?t.solved[locale]:t[result][locale])}
  info={<><p>{guidance}</p>{trial&&<p>{CATALOG_BROWSE_TEXT.scienceTouch[locale]}</p>}<div data-science-result role="status">{result&&<p>{t[result][locale]}</p>}{solved&&<p><strong>{t.solved[locale]}</strong> {explanation[locale]}</p>}</div></>}
  onListen={isSupported?()=>toggle(`science-${blueprintId}`,[guidance,result&&t[result][locale],solved&&explanation[locale]].filter(Boolean).join('. '),language):undefined} speaking={isSpeaking&&activeId===`science-${blueprintId}`}
  actions={<><button type="button" data-mission-primary data-science-start={challenge.id} className={`${missionButton} bg-sky-100`} aria-label={trial?t.restart[locale]:t[challenge.id][locale]} onClick={start}>{MISSION_PANEL_TEXT[trial?'replay':'run'][locale]}</button>
   {trial&&<button type="button" data-mission-reset className={missionButton} aria-label={CATALOG_BROWSE_TEXT.resetScience[locale]} onClick={()=>onTrial(undefined)}>{MISSION_PANEL_TEXT.assemble[locale]}</button>}</>}/>;
}
