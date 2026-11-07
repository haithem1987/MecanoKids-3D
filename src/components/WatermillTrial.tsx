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
  return <WorkshopMissionPortal><section data-watermill-flow={flow} className="space-y-3 rounded-xl border border-sky-200 bg-white p-3 text-sky-950">
    <h2 className="font-bold">{t.title[locale]}</h2><p role="status">{status}</p>
    <div className="flex flex-wrap gap-2">{(['stop','slow','fast'] as const).map((label,index)=><button key={label} type="button" data-watermill-set={index} aria-pressed={flow===index}
      className="min-h-16 min-w-16 rounded-xl border border-sky-200 px-3 py-2 font-semibold aria-pressed:bg-sky-100" onClick={()=>setFlow(index as 0|1|2)}>{t[label][locale]}</button>)}</div>
    {isSupported&&<button type="button" className="min-h-16 rounded-xl border border-sky-200 px-3 font-semibold" onClick={()=>toggle('watermill',status,language)}>{SCIENCE_CHALLENGE_TEXT.listen[locale]}</button>}
  </section></WorkshopMissionPortal>;
}
