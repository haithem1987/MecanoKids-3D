import {MissionPanel,MissionOptions,missionButton} from './MissionPanel';
import {MISSION_PANEL_TEXT} from '../i18n/translations';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { WATERMILL_TRIAL_TEXT, SCIENCE_CHALLENGE_TEXT } from '../i18n/translations';
import type { LanguageCode } from '../types/game';
import { useSpeech } from '../utils/speech';
import { WorkshopMissionPortal } from './WorkshopMissionPortal';
interface MillScene {
  turntableGroup: THREE.Group;
  mechanismElapsed: number;
  mechanismRate: number;
  wakeRender: () => void;
}
export function WatermillTrial({ engine, language, sceneRevision }: {
  engine: {current:MillScene|null}; language:LanguageCode; sceneRevision:string;
}) {
  const [flow,setFlow]=useState<0|1|2>(0);
  const [draftFlow,setDraftFlow]=useState<0|1|2>(0);
  const locale=language==='fr'?0:language==='en'?1:2;
  const t=WATERMILL_TRIAL_TEXT;
  const {toggle,isSupported}=useSpeech();
  useEffect(()=>{
    const scene=engine.current;if(!scene)return;
    const water=new THREE.Mesh(new THREE.BoxGeometry(2.35,.025,.52),new THREE.MeshStandardMaterial({color:'#38bdf8',transparent:true,opacity:.70}));
    water.position.set(.6,.28,.9);water.visible=flow>0;scene.turntableGroup.add(water);
    scene.mechanismRate=flow===0?0:flow===1?.45:1.4;scene.wakeRender();
    return()=>{water.removeFromParent();water.geometry.dispose();water.material.dispose();scene.mechanismRate=0;scene.wakeRender();};
  },[engine,flow,sceneRevision]);
  useEffect(()=>{
    const scene=engine.current;if(scene)scene.mechanismElapsed=0;
    return()=>{if(scene){scene.mechanismRate=1;scene.mechanismElapsed=0;}};
  },[engine]);
  const status=t[flow===0?'off':flow===1?'low':'high'][locale];
  return <WorkshopMissionPortal><MissionPanel language={language} title={t.title[locale]} attributes={{'data-watermill-flow':flow}} status={status}
    fields={[{id:'flow',label:MISSION_PANEL_TEXT.flow[locale],content:<div data-watermill-control><MissionOptions label={MISSION_PANEL_TEXT.flow[locale]} value={draftFlow} options={(['stop','slow','fast'] as const).map((key,value)=>({value,label:t[key][locale]}))} onChange={value=>setDraftFlow(value as 0|1|2)}/></div>}]}
    info={<p>{status}</p>} onListen={isSupported?()=>toggle('watermill',status,language):undefined}
    actions={<><button type="button" data-mission-primary className={`${missionButton} bg-sky-100`} onClick={()=>setFlow(draftFlow)}>{MISSION_PANEL_TEXT.run[locale]}</button><button type="button" data-mission-reset className={missionButton} disabled={flow===0} onClick={()=>{setFlow(0);setDraftFlow(0);}}>{t.stop[locale]}</button></>}/></WorkshopMissionPortal>;
}
