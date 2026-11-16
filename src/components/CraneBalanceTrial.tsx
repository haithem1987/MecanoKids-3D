import {useEffect,useRef,useState,type ComponentProps} from 'react';
import * as THREE from 'three';
import type {AgeProfile,LanguageCode} from '../types/game';
import type {MathActivityTrial} from './MathActivityTrial';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
import {MissionPanel,missionButton} from './MissionPanel';
import {MATH_TEXT} from '../i18n/translations';
import {craneBalanced,craneChallenge,craneTilt} from '../data/craneBalance';
import {createCraneBalanceScene} from '../three/craneBalanceScene';
import {useSceneReady} from '../hooks/useSceneReady';
import {useSpeech} from '../utils/speech';

export function CraneBalanceTrial({engine,language,ageProfile,sceneRevision}:{engine:ComponentProps<typeof MathActivityTrial>['engine'];language:LanguageCode;ageProfile?:AgeProfile;sceneRevision:string}){
 const challenge=craneChallenge(ageProfile),locale=language==='fr'?0:language==='en'?1:2;
 const [mass,setMass]=useState(challenge.masses[0]),[distance,setDistance]=useState(1),[phase,setPhase]=useState<'ready'|'lifting'|'done'>('ready');
 const controllerRef=useRef<ReturnType<typeof createCraneBalanceScene>|null>(null),angleRef=useRef(craneTilt(challenge,mass,distance)),liftRef=useRef(0),chooseRef=useRef<(distance:number)=>void>(()=>{});
 const ready=useSceneReady(engine),{toggle,isSupported}=useSpeech(),balanced=craneBalanced(challenge,mass,distance);
 const choose=(value:number)=>{if(phase==='lifting'||value===distance)return;setDistance(value);setPhase('ready');liftRef.current=0;};chooseRef.current=choose;
 useEffect(()=>{
  const scene=engine.current;if(!ready||!scene)return;
  const controller=createCraneBalanceScene(()=>scene.placedPartEntries,craneChallenge(ageProfile),language);controllerRef.current=controller;scene.turntableGroup.add(controller.group);
  const canvas=scene.renderer.domElement,ray=new THREE.Raycaster();let press:[number,number]|undefined;
  const down=(event:PointerEvent)=>{press=[event.clientX,event.clientY];};
  const click=(event:MouseEvent)=>{if(!press||Math.hypot(event.clientX-press[0],event.clientY-press[1])>10)return;const rect=canvas.getBoundingClientRect(),pointer=new THREE.Vector2((event.clientX-rect.x)/rect.width*2-1,-(event.clientY-rect.y)/rect.height*2+1);scene.turntableGroup.updateMatrixWorld(true);ray.setFromCamera(pointer,scene.camera);const hit=ray.intersectObjects(controller.pickTargets.filter(target=>target.object.visible).map(target=>target.object),true)[0];if(hit){const target=controller.pickTargets.find(target=>hit.object.parent===target.object);if(target)chooseRef.current(target.distance);}};
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('click',click);
  return()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('click',click);controller.dispose();controllerRef.current=null;scene.wakeRender();};
 },[engine,ready,ageProfile,sceneRevision,language]);
 useEffect(()=>{
  const scene=engine.current,controller=controllerRef.current;if(!ready||!scene||!controller)return;
  const previous=scene.applyMechanismPose,apply=()=>controller.apply(mass,distance,angleRef.current,liftRef.current);scene.applyMechanismPose=apply;
  const from=angleRef.current,to=craneTilt(craneChallenge(ageProfile),mass,distance),start=performance.now();let frame=0;
  const draw=(now:number)=>{const p=scene.reducedMotion?1:Math.min(1,(now-start)/650);angleRef.current=from+(to-from)*(1-(1-p)**3);apply();scene.wakeRender();if(p<1)frame=requestAnimationFrame(draw);};frame=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(frame);if(scene.applyMechanismPose===apply)scene.applyMechanismPose=previous;};
 },[engine,ready,ageProfile,sceneRevision,mass,distance,language]);
 useEffect(()=>{
  const scene=engine.current;if(!ready||!scene||phase!=='lifting')return;
  let frame=0;const start=performance.now();
  const draw=(now:number)=>{const p=scene.reducedMotion?1:Math.min(1,(now-start)/1500);liftRef.current=.4*p;controllerRef.current?.apply(mass,distance,0,liftRef.current);scene.wakeRender();if(p<1){frame=requestAnimationFrame(draw);return;}setPhase('done');window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId:'math-groups',kind:'math-groups-balance-v3',result:MATH_TEXT.craneDone,settings:[mass,distance],success:true}}));};frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);
 },[engine,ready,phase,mass,distance]);
 const feedback=craneTilt(challenge,mass,distance)>0?challenge.advanced?'craneLoadHeavy':'craneLoadHeavyFixed':challenge.advanced?'craneCounterHeavy':'craneCounterHeavyFixed';
 const goal=MATH_TEXT[challenge.advanced?'craneAdvanced':'craneIntro'][locale],status=MATH_TEXT[phase==='done'?'craneDone':balanced?'craneLevel':feedback][locale];
 const format=(value:number)=>new Intl.NumberFormat(language).format(value);
 return <WorkshopMissionPortal><MissionPanel initiallyOpen language={language} title={MATH_TEXT.groupsTitle[locale]} attributes={{'data-crane-balance':true,'data-crane-age':ageProfile,'data-crane-mass':mass,'data-crane-distance':distance,'data-crane-phase':phase,'data-crane-balanced':balanced}} intro={<div data-math-mission-brief className="space-y-2 rounded-xl bg-sky-50 p-2 text-sm"><p>{goal}</p><p role="status" aria-live="polite" className="font-bold">{status}</p>{phase==='done'&&<p>{format(challenge.load)} × {format(challenge.loadDistance)} = {format(mass)} × {format(distance)}</p>}</div>} fields={[
  ...(challenge.masses.length>1?[{id:'mass',label:MATH_TEXT.craneMass[locale],content:<div className="flex gap-2">{challenge.masses.map(value=><button key={value} type="button" data-crane-mass-choice={value} className={missionButton} disabled={phase==='lifting'} aria-pressed={mass===value} onClick={()=>{if(value===mass)return;setMass(value);liftRef.current=0;setPhase('ready');}}>{format(value)} kg</button>)}</div>}]:[]),
  {id:'distance',label:MATH_TEXT.craneDistance[locale],content:<div className="flex flex-wrap gap-1">{challenge.distances.map(value=><button type="button" key={value} data-crane-distance-choice={value} className={missionButton} disabled={phase==='lifting'} aria-pressed={distance===value} onClick={()=>choose(value)}>{format(value)}{challenge.advanced?' m':''}</button>)}</div>},
 ]} info={<p>{MATH_TEXT.craneRule[locale]}</p>} onListen={isSupported?()=>toggle('crane-goal',goal+' '+status,language):undefined} actions={<button type="button" data-mission-primary data-crane-lift className={missionButton} disabled={!balanced||phase!=='ready'} onClick={()=>setPhase('lifting')}>{MATH_TEXT.craneLift[locale]}</button>}/></WorkshopMissionPortal>;
}
