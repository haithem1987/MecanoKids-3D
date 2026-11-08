import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import type {LanguageCode} from '../types/game';
import {SCIENCE_DISCOVERY_TEXT} from '../i18n/translations';
import {useSceneReady} from '../hooks/useSceneReady';
import {SCIENCE_DISCOVERY_MODELS,getScienceDiscoveryKind,scienceDiscoveryOutcome,scienceDiscoverySuccess} from '../data/scienceDiscovery';
import {createScienceDiscoveryScene,type DiscoveryPartEntry} from '../three/scienceDiscoveryScene';
import {MissionPanel,MissionOptions,missionButton} from './MissionPanel';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
import {useSpeech} from '../utils/speech';
interface ScienceDiscoveryEngine {
 turntableGroup:THREE.Group;placedPartEntries:Map<string,DiscoveryPartEntry>;
 renderer:THREE.WebGLRenderer;camera:THREE.PerspectiveCamera;reducedMotion:boolean;
 applyMechanismPose?:()=>void;wakeRender:()=>void;
}
export function ScienceDiscoveryTrial({engine,language,blueprintId,sceneRevision}:{engine:{current:ScienceDiscoveryEngine|null};language:LanguageCode;blueprintId:string;sceneRevision:string}){
 const kind=getScienceDiscoveryKind(blueprintId),model=kind?SCIENCE_DISCOVERY_MODELS[kind]:undefined;
 const [draft,setDraft]=useState<readonly number[]>(model?.start??[]),[applied,setApplied]=useState<readonly number[]>(model?.start??[]),[attempt,setAttempt]=useState(0),[phase,setPhase]=useState<'ready'|'observing'|'done'>('ready');
 const sceneReady=useSceneReady(engine),controllerRef=useRef<ReturnType<typeof createScienceDiscoveryScene>|null>(null),startedAt=useRef(0),published=useRef(0),runRef=useRef<()=>void>(()=>{}),{isSupported,toggle}=useSpeech();
 const locale=language==='fr'?0:language==='en'?1:2,t=SCIENCE_DISCOVERY_TEXT as Record<string,readonly[string,string,string]>;
 const word=(key:string)=>t[key]?.[locale]??'';
 const run=()=>{if(phase==='observing')return;startedAt.current=performance.now();setApplied([...draft]);setAttempt(value=>value+1);setPhase('observing');};runRef.current=run;
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||!kind)return;
  const controller=createScienceDiscoveryScene(kind,()=>scene.placedPartEntries);controllerRef.current=controller;scene.turntableGroup.add(controller.group);
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),canvas=scene.renderer.domElement;let press:[number,number]|undefined;
  const down=(event:PointerEvent)=>{press=[event.clientX,event.clientY];};
  const click=(event:MouseEvent)=>{
   if(!press||Math.hypot(event.clientX-press[0],event.clientY-press[1])>10)return;
   const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.x)/rect.width*2-1,-(event.clientY-rect.y)/rect.height*2+1);scene.turntableGroup.updateMatrixWorld(true);ray.setFromCamera(pointer,scene.camera);
   for(const id of controller.activeIds){const target=scene.placedPartEntries.get(id)?.group;if(!target)continue;const anchor=target.getWorldPosition(new THREE.Vector3()).project(scene.camera),distance=Math.hypot((anchor.x-pointer.x)*rect.width/2,(anchor.y-pointer.y)*rect.height/2);if(ray.intersectObject(target,true).length||anchor.z>=-1&&anchor.z<=1&&distance<=32){runRef.current();break;}}
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('click',click);
  return()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('click',click);controller.dispose();controllerRef.current=null;scene.wakeRender();};
 },[engine,kind,sceneRevision,sceneReady]);
 useEffect(()=>{
  const scene=engine.current,controller=controllerRef.current;if(!sceneReady||!scene||!controller||!kind)return;
  const previous=scene.applyMechanismPose;let elapsed=0,frame=0;
  const apply=()=>controller.apply(applied,elapsed,scene.reducedMotion);scene.applyMechanismPose=apply;
  const continuous=(kind==='fan'||kind==='solar')&&applied[0]>0||kind==='pendulum'||kind==='alarm'&&applied[0]===1&&applied[1]===1||kind==='radio';
  const draw=(now:number)=>{
   elapsed=attempt?(scene.reducedMotion?3:Math.max(0,(now-startedAt.current)/1000)):0;apply();scene.wakeRender();
   if(attempt&&elapsed>=3&&published.current!==attempt){published.current=attempt;setPhase('done');const result=t[scienceDiscoveryOutcome(kind,applied)];if(result)window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId,kind:`science-discovery-${kind}`,result,success:scienceDiscoverySuccess(kind,applied),settings:applied}}));}
   if(attempt&&!scene.reducedMotion&&(elapsed<3||continuous))frame=requestAnimationFrame(draw);
  };
  frame=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(frame);if(scene.applyMechanismPose===apply)scene.applyMechanismPose=previous;controller.restore();scene.wakeRender();};
 },[engine,kind,sceneRevision,sceneReady,applied,attempt]);
 if(!kind||!model)return null;
 const result=phase==='ready'?word('ready'):word(scienceDiscoveryOutcome(kind,applied)),goal=word(`${kind}Goal`);
 const reset=()=>{setDraft([...model.start]);setApplied([...model.start]);setAttempt(0);published.current=0;setPhase('ready');};
 return <WorkshopMissionPortal><MissionPanel language={language} title={word(`${kind}Title`)} attributes={{'data-science-discovery':kind,'data-science-discovery-phase':phase,'data-science-discovery-success':phase==='done'&&scienceDiscoverySuccess(kind,applied),'data-science-discovery-settings':applied.join(',')}} status={result}
  fields={model.controls.map((control,index)=>({id:control.id,label:word(control.label),content:<MissionOptions label={word(control.label)} value={draft[index]} options={control.options.map((key,value)=>({value,label:word(key)}))} onChange={value=>setDraft(previous=>previous.map((item,slot)=>slot===index?value:item))}/>}))}
  info={<><p>{goal}</p><p>{result}</p><p>{word('touch')}</p></>} onListen={isSupported?()=>toggle(`science-discovery-${blueprintId}`,`${goal} ${result}`,language):undefined}
  actions={<><button type="button" data-mission-primary data-science-discovery-run className={missionButton} disabled={phase==='observing'} onClick={run}>{word('run')}</button><button type="button" data-mission-reset data-science-discovery-reset className={missionButton} onClick={reset}>{word('reset')}</button></>}/></WorkshopMissionPortal>;
}
