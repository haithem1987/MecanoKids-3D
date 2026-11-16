import {MathControl} from './MathControl';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import type {LanguageCode} from '../types/game';
import {MATH_TEXT} from '../i18n/mathText';
import {getMathActivityKind,mathControls,mathEquation,mathStart,mathSuccess,mathTap,mathFeedback} from '../data/mathActivities';
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
 const kind=getMathActivityKind(blueprintId),[level,setLevel]=useState(0),[settings,setSettings]=useState<readonly number[]>(()=>kind==='addition'?[2,3]:kind?mathStart(kind):[]),[phase,setPhase]=useState<'ready'|'observing'|'done'>('ready'),[attempt,setAttempt]=useState(0);
 const progressRef=useRef(0),trialRef=useRef(false);
 const sceneReady=useSceneReady(engine),controllerRef=useRef<ReturnType<typeof createMathActivityScene>|null>(null),tapRef=useRef<(index:number)=>void>(()=>{}),{isSupported,toggle}=useSpeech();
 const locale=language==='fr'?0:language==='en'?1:2;
 tapRef.current=index=>{if(!kind||kind==='addition'||phase==='observing')return;progressRef.current=0;trialRef.current=false;setSettings(previous=>mathTap(kind,index,previous));setPhase('ready');};
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||!kind)return;
  const controller=createMathActivityScene(kind,()=>scene.placedPartEntries,{unit:MATH_TEXT.unit[locale]});controllerRef.current=controller;scene.turntableGroup.add(controller.group);
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
 },[engine,kind,sceneReady,sceneRevision,locale]);
 useEffect(()=>{
  const scene=engine.current,controller=controllerRef.current;if(!sceneReady||!scene||!controller)return;
  const previous=scene.applyMechanismPose,apply=()=>controller.apply(settings,level,progressRef.current,trialRef.current);scene.applyMechanismPose=apply;apply();scene.wakeRender();
  return()=>{if(scene.applyMechanismPose===apply)scene.applyMechanismPose=previous;controller.restore();scene.wakeRender();};
 },[engine,sceneReady,sceneRevision,settings,level,locale]);
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||!kind||phase!=='observing')return;
  let frame=0;const start=performance.now(),duration=scene.reducedMotion?0:2600;progressRef.current=0;trialRef.current=true;
  const draw=(now:number)=>{
   const p=duration?Math.min(1,(now-start)/duration):1;progressRef.current=p;controllerRef.current?.apply(settings,level,p,true);scene.wakeRender();
   if(p<1){frame=requestAnimationFrame(draw);return;}
   const success=mathSuccess(kind,settings,level);setPhase('done');
   window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId,kind:kind==='addition'?'math-addition-construction-v3':`math-${kind}-mechanism-v2`,result:success?MATH_TEXT[`${kind}Why`]:MATH_TEXT[mathFeedback(kind,settings,level)],success,settings:[level,...settings]}}));
  };frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);
 },[engine,sceneReady,kind,blueprintId,phase,attempt,settings,level]);
 if(!kind)return null;
 const goal=MATH_TEXT[`${kind}Goal`][locale],success=phase==='done'&&mathSuccess(kind,settings,level),status=phase==='done'?MATH_TEXT[mathFeedback(kind,settings,level)][locale]:phase==='observing'?MATH_TEXT.running[locale]:MATH_TEXT.ready[locale];
 const reset=()=>{progressRef.current=0;trialRef.current=false;setSettings(mathStart(kind));setPhase('ready');};
 if(kind==='addition')return <WorkshopMissionPortal><MissionPanel initiallyOpen language={language} title={MATH_TEXT.additionTitle[locale]} attributes={{'data-math-activity':kind,'data-math-phase':phase,'data-math-success':success,'data-math-level':0,'data-math-settings':'2,3'}} fields={[]} intro={<div className="space-y-2 rounded-xl bg-sky-50 p-3"><p>{MATH_TEXT.bridgeBuilt[locale]}</p><p data-addition-equation className="text-xl font-bold">2 + 3 = 5</p><p>{phase==='observing'?MATH_TEXT.running[locale]:success?MATH_TEXT.additionWhy[locale]:MATH_TEXT.bridgeCross[locale]}</p></div>} info={<p>{MATH_TEXT.additionWhy[locale]}</p>} onListen={isSupported?()=>toggle('addition-built',MATH_TEXT.bridgeBuilt[locale]+' '+MATH_TEXT.additionWhy[locale],language):undefined} actions={<button type="button" data-mission-primary data-math-run className={missionButton} disabled={phase==='observing'} onClick={()=>{setAttempt(value=>value+1);setPhase('observing');}}>{MATH_TEXT.bridgeCross[locale]}</button>}/></WorkshopMissionPortal>;
 return <WorkshopMissionPortal><MissionPanel initiallyOpen intro={<div data-math-mission-brief className="space-y-2 rounded-xl bg-sky-50 p-2 text-sm text-sky-950"><p className="text-xs font-bold">{MATH_TEXT.challenge[locale]} {level+1} / 3</p><p>{MATH_TEXT[`${kind}Task`][locale]}</p><p className="font-bold">{MATH_TEXT.target[locale]} : {mathEquation(kind,settings,level,true)}</p>{phase!=='ready'&&<p role="status">{phase==='observing'?MATH_TEXT.running[locale]:MATH_TEXT[`${mathFeedback(kind,settings,level)}Short`][locale]}</p>}</div>} language={language} title={MATH_TEXT[`${kind}Title`][locale]} attributes={{'data-math-activity':kind,'data-math-phase':phase,'data-math-success':success,'data-math-level':level,'data-math-settings':settings.join(',')}}
  fields={[
   {id:'level',label:MATH_TEXT.challenge[locale],content:<MissionOptions label={MATH_TEXT.challenge[locale]} value={level} options={[0,1,2].map(value=>({value,label:MATH_TEXT[(['challenge1','challenge2','challenge3']as const)[value]][locale]}))} onChange={value=>{setLevel(value);reset();}}/>},
   ...mathControls(kind,level).map((control,index)=>({id:control.id,label:MATH_TEXT[control.label][locale],content:<fieldset disabled={phase==='observing'}><MathControl control={control} language={language} value={settings[index]} onChange={value=>{progressRef.current=0;trialRef.current=false;setSettings(previous=>previous.map((item,slot)=>slot===index?value:item));setPhase('ready');}}/></fieldset>})),
  ]}
  info={<><p>{goal}</p><p>{MATH_TEXT.target[locale]} : {mathEquation(kind,settings,level,true)}</p><p>{status}</p>{success&&<p>{MATH_TEXT[`${kind}Why`][locale]}</p>}<p>{MATH_TEXT.touch[locale]}</p></>}
  onListen={isSupported?()=>toggle(`math-${blueprintId}`,`${goal} ${MATH_TEXT.target[locale]} ${mathEquation(kind,settings,level,true)}. ${status} ${success?MATH_TEXT[`${kind}Why`][locale]:''}`,language):undefined}
  actions={<><button type="button" data-mission-primary data-math-run className={missionButton} disabled={phase==='observing'} onClick={()=>{setAttempt(value=>value+1);setPhase('observing');}}>{MATH_TEXT.check[locale]}</button>{success&&level<2?<button type="button" data-math-next className={missionButton} onClick={()=>{setLevel(value=>value+1);reset();}}>{MATH_TEXT.nextChallenge[locale]}</button>:<button type="button" data-mission-reset data-math-reset className={missionButton} onClick={reset}>{MATH_TEXT.reset[locale]}</button>}</>}/></WorkshopMissionPortal>;
}
