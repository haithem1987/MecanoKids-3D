import {MissionPanel,missionButton} from './MissionPanel';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import type {LanguageCode,PartSpec} from '../types/game';
import {AQUEDUCT_TRIAL_TEXT,SCIENCE_CHALLENGE_TEXT} from '../i18n/translations';
import {useSpeech} from '../utils/speech';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
interface AqueductScene {
 turntableGroup:THREE.Group;placedPartEntries:Map<string,{group:THREE.Group;spec:PartSpec}>;
 renderer:THREE.WebGLRenderer;camera:THREE.PerspectiveCamera;reducedMotion:boolean;
 applyMechanismPose?:()=>void;wakeRender:()=>void;
}
export function AqueductTrial({engine,language,sceneRevision}:{engine:{current:AqueductScene|null};language:LanguageCode;sceneRevision:string}){
 const [phase,setPhase]=useState<'supported'|'released'|'flowing'>('supported');
 const waterRef=useRef<{water:THREE.Mesh<THREE.BoxGeometry,THREE.MeshStandardMaterial>;drops:THREE.InstancedMesh}|null>(null);
 const locale=language==='fr'?0:language==='en'?1:2,t=AQUEDUCT_TRIAL_TEXT;
 const {toggle,isSupported}=useSpeech();
 useEffect(()=>{
  const scene=engine.current;if(!scene)return;
  const water=new THREE.Mesh(new THREE.BoxGeometry(4.5,.025,.43),new THREE.MeshStandardMaterial({color:'#38bdf8',transparent:true,opacity:.70}));water.position.set(0,1.68,0);
  const drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.025,8,6),new THREE.MeshBasicMaterial({color:'#7dd3fc'}),12);
  water.visible=false;drops.visible=false;scene.turntableGroup.add(water,drops);waterRef.current={water,drops};scene.wakeRender();
  return()=>{water.removeFromParent();drops.removeFromParent();water.geometry.dispose();water.material.dispose();drops.dispose();drops.geometry.dispose();if(drops.material instanceof THREE.Material)drops.material.dispose();waterRef.current=null;scene.wakeRender();};
 },[engine,sceneRevision]);
 useEffect(()=>{
  const scene=engine.current;if(!scene)return;
  const apply=()=>{for(const entry of scene.placedPartEntries.values())if(entry.spec.temporarySupport)entry.group.visible=phase==='supported';};
  scene.applyMechanismPose=apply;
  const water=waterRef.current;if(water){water.water.visible=phase==='flowing';water.drops.visible=phase==='flowing';}
  const canvas=scene.renderer.domElement,ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let press:[number,number]|undefined;
  const down=(event:PointerEvent)=>{press=[event.clientX,event.clientY];};
  const click=(event:MouseEvent)=>{
   if(phase!=='supported'||!press||Math.hypot(event.clientX-press[0],event.clientY-press[1])>10)return;
   const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.x)/rect.width*2-1,-(event.clientY-rect.y)/rect.height*2+1);scene.turntableGroup.updateMatrixWorld(true);ray.setFromCamera(pointer,scene.camera);
   const supports=[...scene.placedPartEntries.values()].filter(entry=>entry.spec.temporarySupport&&entry.group.visible).map(entry=>entry.group);
   if(ray.intersectObjects(supports,true).length)setPhase('released');
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('click',click);scene.wakeRender();
  return()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('click',click);if(scene.applyMechanismPose===apply)scene.applyMechanismPose=undefined;for(const entry of scene.placedPartEntries.values())if(entry.spec.temporarySupport)entry.group.visible=true;scene.wakeRender();};
 },[engine,phase,sceneRevision]);
 useEffect(()=>{
  const scene=engine.current,water=waterRef.current;if(!scene||!water||phase!=='flowing')return;
  let frame=0;const start=performance.now(),dummy=new THREE.Object3D();
  const draw=(now:number)=>{
   const time=scene.reducedMotion?0:(now-start)/1000;
   for(let i=0;i<12;i++){dummy.position.set(-2.2+((i/12*4.4+time*.8)%4.4),1.71,Math.sin(i)*.09);dummy.updateMatrix();water.drops.setMatrixAt(i,dummy.matrix);}
   water.drops.instanceMatrix.needsUpdate=true;scene.wakeRender();if(!scene.reducedMotion)frame=requestAnimationFrame(draw);
  };
  frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);
 },[engine,phase,sceneRevision]);
 return <WorkshopMissionPortal><MissionPanel language={language} title={t.title[locale]} attributes={{'data-aqueduct-phase':phase}} status={t[phase][locale]}
  info={<><p>{t[phase][locale]}</p><p>{t.touch[locale]}</p></>} onListen={isSupported?()=>toggle('aqueduct',t[phase][locale],language):undefined}
  actions={<><button type="button" data-mission-primary data-aqueduct-centering className={missionButton} onClick={()=>setPhase(phase==='supported'?'released':'supported')}>{t[phase==='supported'?'remove':'restore'][locale]}</button><button type="button" data-mission-reset data-aqueduct-water disabled={phase==='supported'} className={missionButton} onClick={()=>setPhase(phase==='flowing'?'released':'flowing')}>{t[phase==='flowing'?'stop':'water'][locale]}</button></>}/></WorkshopMissionPortal>;
}
