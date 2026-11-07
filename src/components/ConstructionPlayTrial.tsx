import {useEffect,useRef,useState} from 'react';
import {useSceneReady} from '../hooks/useSceneReady';
import * as THREE from 'three';
import type {LanguageCode,PartSpec} from '../types/game';
import {CONSTRUCTION_PLAY_TEXT} from '../i18n/translations';
import {getConstructionPlayKind,getGantryPose,getPlayRoute} from '../data/constructionPlay';
import {createConstructionPlayActor,disposeConstructionPlayActor} from '../three/constructionPlayScene';
import {MissionPanel,MissionOptions,missionButton} from './MissionPanel';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
import {useSpeech} from '../utils/speech';
interface ConstructionPlayScene {
 turntableGroup:THREE.Group;placedPartEntries:Map<string,{group:THREE.Group;spec:PartSpec}>;
 renderer:THREE.WebGLRenderer;camera:THREE.PerspectiveCamera;reducedMotion:boolean;
 applyMechanismPose?:()=>void;wakeRender:()=>void;
}
type Phase='ready'|'moving'|'blocked'|'done';
export function ConstructionPlayTrial({engine,language,blueprintId,sceneRevision}:{engine:{current:ConstructionPlayScene|null};language:LanguageCode;blueprintId:string;sceneRevision:string}){
 const kind=getConstructionPlayKind(blueprintId),locale=language==='fr'?0:language==='en'?1:2,t=CONSTRUCTION_PLAY_TEXT;
 const sceneReady=useSceneReady(engine);
 const [step,setStep]=useState(0),[route,setRoute]=useState(0),[phase,setPhase]=useState<Phase>('ready'),[attempt,setAttempt]=useState(0);
 const actorRef=useRef<THREE.Group|null>(null),progressRef=useRef(0),gantryRef=useRef(getGantryPose(0)),advanceRef=useRef<()=>void>(()=>{});
 const {isSupported,toggle}=useSpeech();
 const advance=()=>{if(phase==='moving'||phase==='done')return;if(kind==='gantry'){setPhase('moving');setStep(previous=>Math.min(3,previous+1));}else{progressRef.current=0;setPhase('moving');setAttempt(previous=>previous+1);}};
 advanceRef.current=advance;
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||!kind)return;
  const actor=createConstructionPlayActor(kind);actorRef.current=actor;scene.turntableGroup.add(actor);
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),canvas=scene.renderer.domElement;let press:[number,number]|undefined;
  const down=(event:PointerEvent)=>{press=[event.clientX,event.clientY];};
  const click=(event:MouseEvent)=>{
   if(!press||Math.hypot(event.clientX-press[0],event.clientY-press[1])>10)return;
   const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.x)/rect.width*2-1,-(event.clientY-rect.y)/rect.height*2+1);scene.turntableGroup.updateMatrixWorld(true);ray.setFromCamera(pointer,scene.camera);
   const target=kind==='gantry'?scene.placedPartEntries.get('load')?.group:actor;
   if(target){
    const anchor=target.getWorldPosition(new THREE.Vector3()).project(scene.camera);
    const distance=Math.hypot((anchor.x-pointer.x)*rect.width/2,(anchor.y-pointer.y)*rect.height/2);
    // Tiny actors retain the same forgiving 64 px touch target as assembly anchors.
    if(ray.intersectObject(target,true).length||(anchor.z>=-1&&anchor.z<=1&&distance<=32))advanceRef.current();
   }
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('click',click);scene.wakeRender();
  return()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('click',click);disposeConstructionPlayActor(actor);actorRef.current=null;scene.wakeRender();};
 },[engine,kind,blueprintId,sceneRevision,sceneReady]);
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||kind!=='gantry')return;
  const apply=()=>{
   const pose=gantryRef.current;
   for(const id of ['trolley','winch']){const entry=scene.placedPartEntries.get(id);if(entry)entry.group.position.x=pose.x;}
   const load=scene.placedPartEntries.get('load');if(load)load.group.position.set(pose.x,pose.y,0);
   const cable=scene.placedPartEntries.get('cable');if(cable){cable.group.position.set(pose.x,pose.cableY,0);cable.group.scale.y=pose.cableLength/1.595;}
  };
  scene.applyMechanismPose=apply;apply();scene.wakeRender();
  return()=>{if(scene.applyMechanismPose===apply)scene.applyMechanismPose=undefined;for(const id of ['trolley','winch','load','cable']){const entry=scene.placedPartEntries.get(id);if(entry){entry.group.position.fromArray(entry.spec.targetPos);entry.group.scale.set(1,1,1);}}scene.wakeRender();};
 },[engine,kind,sceneRevision,sceneReady]);
 useEffect(()=>{
  const scene=engine.current,actor=actorRef.current;if(!sceneReady||!scene||!actor||!kind)return;
  const from={...gantryRef.current},target=getGantryPose(step),path=getPlayRoute(kind,blueprintId,route===0),fromProgress=phase==='moving'?progressRef.current:0,endPosition=new THREE.Vector3(...path.end);
  if(kind!=='gantry'&&phase!=='moving'){progressRef.current=phase==='done'||phase==='blocked'?1:0;actor.position.fromArray(progressRef.current?path.end:path.start);scene.wakeRender();return;}
  let frame=0;const start=performance.now(),duration=scene.reducedMotion?0:kind==='gantry'?900:2200;
  const draw=(now:number)=>{
   const p=duration===0?1:Math.min(1,(now-start)/duration),smooth=p*p*(3-2*p);
   if(kind==='gantry'){gantryRef.current={x:THREE.MathUtils.lerp(from.x,target.x,smooth),y:THREE.MathUtils.lerp(from.y,target.y,smooth),cableY:THREE.MathUtils.lerp(from.cableY,target.cableY,smooth),cableLength:THREE.MathUtils.lerp(from.cableLength,target.cableLength,smooth)};}
   else{const position=fromProgress+(1-fromProgress)*smooth;progressRef.current=position;actor.position.fromArray(path.start).lerp(endPosition,position);if(kind==='truss'){const x=actor.position.x;actor.position.y=Math.abs(x)>1.8?1.07-(Math.abs(x)-1.8)*Math.tan(.32):1.07;}}
   scene.wakeRender();
   if(p<1)frame=requestAnimationFrame(draw);
   else if(phase==='moving'){
    const success=kind==='gantry'?step===3:route===0;
    setPhase(success?'done':kind==='gantry'?'ready':'blocked');
    if(success)window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId,kind:'construction-play',result:t[`${kind}Done`],success:true,settings:[kind==='gantry'?step:route]}}));
   }
  };
  frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);
 // Phase is intentionally not a dependency: completing an animation preserves the final pose.
 },[engine,kind,blueprintId,sceneRevision,step,route,attempt,sceneReady]);
 if(!kind)return null;
 const title=t[kind][locale],goal=t[`${kind}Goal`][locale],result=phase==='done'?t[`${kind}Done`][locale]:t[phase][locale];
 const reset=()=>{setStep(0);setRoute(0);setPhase('ready');setAttempt(value=>value+1);progressRef.current=0;};
 return <WorkshopMissionPortal><MissionPanel language={language} title={title} attributes={{'data-construction-play':kind,'data-construction-phase':phase,'data-construction-step':step}} status={result}
  fields={kind==='gantry'?[]:[{id:'route',label:t.route[locale],content:<MissionOptions label={t.route[locale]} value={route} options={[{value:0,label:t.clear[locale]},{value:1,label:t.blockedRoute[locale]}]} onChange={value=>{setRoute(value);setPhase('ready');progressRef.current=0;}}/>}]}
  info={<><p>{goal}</p><p>{result}</p><p>{t.touch[locale]}</p></>} onListen={isSupported?()=>toggle(`construction-${blueprintId}`,`${goal} ${result}`,language):undefined}
  actions={<><button type="button" data-mission-primary data-construction-advance className={missionButton} disabled={phase==='moving'||phase==='done'} onClick={advance}>{kind==='gantry'?t[step===0?'lift':step===1?'move':'lower'][locale]:t.go[locale]}</button><button type="button" data-mission-reset data-construction-reset className={missionButton} disabled={phase==='moving'} onClick={reset}>{t.reset[locale]}</button></>}/></WorkshopMissionPortal>;
}
