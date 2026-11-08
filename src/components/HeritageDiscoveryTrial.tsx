import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {getHeritageDiscoveryKind,domeLoadPath,hasComparedLoads} from '../data/heritageDiscoveries';
import {HERITAGE_DISCOVERY_TEXT as T} from '../i18n/translations';
import type {LanguageCode,PartSpec} from '../types/game';
import {useSceneReady} from '../hooks/useSceneReady';
import {useSpeech} from '../utils/speech';
import {MissionPanel,MissionOptions,missionButton} from './MissionPanel';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
interface Scene{turntableGroup:THREE.Group;placedPartEntries:Map<string,{group:THREE.Group;spec:PartSpec}>;wakeRender:()=>void;reducedMotion:boolean;}
export function HeritageDiscoveryTrial({engine,blueprintId,language,sceneRevision}:{engine:{current:Scene|null};blueprintId:string;language:LanguageCode;sceneRevision:string}){
 const kind=getHeritageDiscoveryKind(blueprintId),ready=useSceneReady(engine),locale=language==='fr'?0:language==='en'?1:2;
 const [choice,setChoice]=useState(0),[attempt,setAttempt]=useState(0),[running,setRunning]=useState(false),[tested,setTested]=useState<readonly number[]>([]),[result,setResult]=useState<keyof typeof T>('ready');
 const layer=useRef<THREE.Group|null>(null),{isSupported,toggle}=useSpeech();
 useEffect(()=>{
  const scene=engine.current;if(!scene||!ready||!kind)return;
  const root=new THREE.Group();layer.current=root;scene.turntableGroup.add(root);
  return()=>{root.removeFromParent();root.traverse(node=>{if(node instanceof THREE.Mesh||node instanceof THREE.Line){node.geometry.dispose();for(const material of Array.isArray(node.material)?node.material:[node.material])material.dispose();}});layer.current=null;for(const entry of scene.placedPartEntries.values())if(entry.spec.id.startsWith('felt-'))entry.group.visible=true;scene.wakeRender();};
 },[engine,ready,kind,sceneRevision]);
 useEffect(()=>{
  const scene=engine.current,root=layer.current;if(!scene||!root||!kind||!attempt||!running)return;
  const dispose=()=>{for(const child of [...root.children]){child.traverse(node=>{if(node instanceof THREE.Mesh||node instanceof THREE.Line){node.geometry.dispose();for(const material of Array.isArray(node.material)?node.material:[node.material])material.dispose();}});child.removeFromParent();}};
  dispose();let frame=0;const particles:THREE.Mesh[]=[];
  if(kind==='shelter'){
   for(const entry of scene.placedPartEntries.values())if(entry.spec.id.startsWith('felt-'))entry.group.visible=choice===1;
   for(let i=0;i<12;i++){const particle=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),new THREE.MeshBasicMaterial({color:0x38bdf8}));root.add(particle);particles.push(particle);}
  }else{
   const indices=choice===0?[0,1,2,3,4,5,6,7]:[0,1];
   for(const index of indices){const path=domeLoadPath(index),points=choice===0?path:path.slice(1),line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(point=>new THREE.Vector3(...point))),new THREE.LineBasicMaterial({color:0xf59e0b,depthTest:false}));line.renderOrder=5;root.add(line);
    const marker=new THREE.Mesh(new THREE.SphereGeometry(.065,10,6),new THREE.MeshBasicMaterial({color:0xfbbf24,depthTest:false}));marker.userData.path=points;marker.renderOrder=6;root.add(marker);particles.push(marker);}
   const load=new THREE.Mesh(new THREE.BoxGeometry(.22,.22,.22),new THREE.MeshStandardMaterial({color:0xd97706}));const start=domeLoadPath(0)[choice===0?0:1];load.position.set(start[0],start[1]+.16,start[2]);root.add(load);
  }
  const start=performance.now(),duration=scene.reducedMotion?0:2400;
  const draw=(now:number)=>{
   const p=duration?Math.min(1,(now-start)/duration):1;
   particles.forEach((particle,index)=>{
    if(kind==='shelter'){const travel=(p+index/particles.length)%1;particle.position.set(-1.85+travel*(choice===1?.55:3.7),.4+(index%4)*.18,(Math.floor(index/4)-1)*.45);}
    else{const path=particle.userData.path as readonly (readonly [number,number,number])[],distance=p*(path.length-1),segment=Math.min(path.length-2,Math.floor(distance)),a=path[segment],b=path[segment+1];particle.position.set(...a).lerp(new THREE.Vector3(...b),Math.min(1,distance-segment));}
   });scene.wakeRender();
   if(p<1)frame=requestAnimationFrame(draw);
   else{const next=[...new Set([...tested,choice])],success=kind==='shelter'?choice===1:hasComparedLoads(next),key=kind==='shelter'?(choice===1?'sheltered':'exposed'):success?'compared':choice===0?'central':'lateral';setTested(next);setResult(key);setRunning(false);window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId,kind:'heritage-'+kind,result:T[key],settings:[choice],success}}));}
  };frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);dispose();for(const entry of scene.placedPartEntries.values())if(entry.spec.id.startsWith('felt-'))entry.group.visible=true;scene.wakeRender();};
 },[engine,ready,kind,sceneRevision,attempt]);
 if(!kind)return null;
 const goal=T[`${kind}Goal`][locale];
 return <WorkshopMissionPortal><MissionPanel language={language} title={T[kind][locale]} status={T[result][locale]} attributes={{'data-heritage-discovery':kind,'data-heritage-result':result}} fields={[{id:'choice',label:T[kind==='shelter'?'cover':'position'][locale],content:<MissionOptions label={T[kind==='shelter'?'cover':'position'][locale]} value={choice} options={(kind==='shelter'?[T.open,T.closed]:[T.top,T.side]).map((text,value)=>({value,label:text[locale]}))} onChange={setChoice}/>}]} info={<><p>{goal}</p><p>{T[result][locale]}</p></>} onListen={isSupported?()=>toggle('heritage-discovery',goal+' '+T[result][locale],language):undefined} actions={<><button type="button" data-mission-primary className={missionButton} disabled={running||!ready} onClick={()=>{setRunning(true);setResult('running');setAttempt(n=>n+1);}}>{T.run[locale]}</button><button type="button" data-mission-reset className={missionButton} disabled={running} onClick={()=>{setChoice(0);setTested([]);setAttempt(0);setResult('ready');}}>{T.reset[locale]}</button></>}/></WorkshopMissionPortal>;
}
