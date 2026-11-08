import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import type {LanguageCode} from '../types/game';
import {MATH_TEXT} from '../i18n/mathText';
import {getMathActivityKind,mathControls,mathEquation,mathStart,mathSuccess,mathTap} from '../data/mathActivities';
import {createMathActivityScene,type MathPartEntry} from '../three/mathActivityScene';
import {useSceneReady} from '../hooks/useSceneReady';
import {MissionPanel,MissionOptions,missionButton} from './MissionPanel';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
import {useSpeech} from '../utils/speech';
interface MathActivityEngine{
 turntableGroup:THREE.Group;placedPartEntries:Map<string,MathPartEntry>;renderer:THREE.WebGLRenderer;
 camera:THREE.PerspectiveCamera;reducedMotion:boolean;applyMechanismPose?:()=>void;wakeRender:()=>void;
}
export function MathActivityTrial({engine,language,blueprintId,sceneRevision}:{engine:{current:MathActivityEngine|null};language:LanguageCode;blueprintId:string;sceneRevision:string}){
 const kind=getMathActivityKind(blueprintId),[level,setLevel]=useState(0),[settings,setSettings]=useState<readonly number[]>(()=>kind?mathStart(kind):[]),[phase,setPhase]=useState<'ready'|'observing'|'done'>('ready'),[attempt,setAttempt]=useState(0);
 const sceneReady=useSceneReady(engine),controllerRef=useRef<ReturnType<typeof createMathActivityScene>|null>(null),tapRef=useRef<(index:number)=>void>(()=>{}),{isSupported,toggle}=useSpeech();
 const locale=language==='fr'?0:language==='en'?1:2;
 tapRef.current=index=>{if(!kind||phase==='observing')return;setSettings(previous=>mathTap(kind,index,previous));setPhase('ready');};
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||!kind)return;
  const controller=createMathActivityScene(kind,()=>scene.placedPartEntries);controllerRef.current=controller;scene.turntableGroup.add(controller.group);
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),canvas=scene.renderer.domElement;let press:[number,number]|undefined;
  const down=(event:PointerEvent)=>{press=[event.clientX,event.clientY];};
  const click=(event:MouseEvent)=>{
   if(!press||Math.hypot(event.clientX-press[0],event.clientY-press[1])>10)return;
   const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.x)/rect.width*2-1,-(event.clientY-rect.y)/rect.height*2+1);scene.turntableGroup.updateMatrixWorld(true);ray.setFromCamera(pointer,scene.camera);
   const targets=controller.pickTargets(),hits=ray.intersectObjects(targets.map(target=>target.object),true);
   for(const hit of hits){const target=targets.find(candidate=>{let object:THREE.Object3D|null=hit.object;while(object){if(object===candidate.object)return true;object=object.parent;}return false;});if(target){tapRef.current(target.index);return;}}
   const closest=targets.map(target=>{const point=target.object.getWorldPosition(new THREE.Vector3()).project(scene.camera);return{...target,z:point.z,distance:Math.hypot((point.x-pointer.x)*rect.width/2,(point.y-pointer.y)*rect.height/2)};}).filter(target=>target.z>=-1&&target.z<=1&&target.distance<=32).sort((a,b)=>a.distance-b.distance)[0];
   if(closest)tapRef.current(closest.index);
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('click',click);
  return()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('click',click);controller.dispose();controllerRef.current=null;scene.wakeRender();};
 },[engine,kind,sceneReady,sceneRevision]);
 useEffect(()=>{
  const scene=engine.current,controller=controllerRef.current;if(!sceneReady||!scene||!controller)return;
  const previous=scene.applyMechanismPose,apply=()=>controller.apply(settings,level);scene.applyMechanismPose=apply;apply();scene.wakeRender();
  return()=>{if(scene.applyMechanismPose===apply)scene.applyMechanismPose=previous;controller.restore();scene.wakeRender();};
 },[engine,sceneReady,sceneRevision,settings,level]);
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||!kind||phase!=='observing')return;
  const timer=window.setTimeout(()=>{
   const success=mathSuccess(kind,settings,level);setPhase('done');
   window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId,kind:`math-${kind}`,result:success?MATH_TEXT[`${kind}Why`]:MATH_TEXT.explore,success,settings:[level,...settings]}}));
  },scene.reducedMotion?0:650);
  return()=>window.clearTimeout(timer);
 },[engine,sceneReady,kind,blueprintId,phase,attempt,settings,level]);
 if(!kind)return null;
 const goal=MATH_TEXT[`${kind}Goal`][locale],success=phase==='done'&&mathSuccess(kind,settings,level),status=phase==='done'?MATH_TEXT[success?'success':'explore'][locale]:MATH_TEXT.ready[locale];
 const reset=()=>{setSettings(mathStart(kind));setPhase('ready');};
 return <WorkshopMissionPortal><MissionPanel language={language} title={MATH_TEXT[`${kind}Title`][locale]} attributes={{'data-math-activity':kind,'data-math-phase':phase,'data-math-success':success,'data-math-level':level,'data-math-settings':settings.join(',')}} status={status}
  fields={[
   {id:'level',label:MATH_TEXT.challenge[locale],content:<MissionOptions label={MATH_TEXT.challenge[locale]} value={level} options={[0,1,2].map(value=>({value,label:MATH_TEXT[(['challenge1','challenge2','challenge3']as const)[value]][locale]}))} onChange={value=>{setLevel(value);reset();}}/>},
   ...mathControls(kind,level).map((control,index)=>({id:control.id,label:MATH_TEXT[control.label][locale],content:<MissionOptions label={MATH_TEXT[control.label][locale]} value={settings[index]} options={control.options.map(option=>({value:option.value,label:option.label?MATH_TEXT[option.label][locale]:String(option.value)}))} onChange={value=>{setSettings(previous=>previous.map((item,slot)=>slot===index?value:item));setPhase('ready');}}/>})),
  ]}
  info={<><p>{goal}</p><p>{MATH_TEXT.target[locale]} : {mathEquation(kind,settings,level,true)}</p><p>{status}</p>{success&&<p>{MATH_TEXT[`${kind}Why`][locale]}</p>}<p>{MATH_TEXT.touch[locale]}</p></>}
  onListen={isSupported?()=>toggle(`math-${blueprintId}`,`${goal} ${MATH_TEXT.target[locale]} ${mathEquation(kind,settings,level,true)}. ${status}`,language):undefined}
  actions={<><button type="button" data-mission-primary data-math-run className={missionButton} disabled={phase==='observing'} onClick={()=>{setAttempt(value=>value+1);setPhase('observing');}}>{MATH_TEXT.check[locale]}</button><button type="button" data-mission-reset data-math-reset className={missionButton} onClick={reset}>{MATH_TEXT.reset[locale]}</button></>}/></WorkshopMissionPortal>;
}
