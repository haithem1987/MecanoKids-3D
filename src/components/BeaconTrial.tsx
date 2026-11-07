import {MissionPanel,MissionOptions,missionButton} from './MissionPanel';
import {MISSION_PANEL_TEXT} from '../i18n/translations';
import {useEffect,useState} from 'react';
import * as THREE from 'three';
import {BEACON_TRIAL_TEXT,SCIENCE_CHALLENGE_TEXT} from '../i18n/translations';
import type {LanguageCode,PartSpec} from '../types/game';
import {getBeaconOutcome,type BeaconSettings} from '../utils/beaconPower';
import {useSpeech} from '../utils/speech';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
interface BeaconScene {
 turntableGroup:THREE.Group;placedPartEntries:Map<string,{group:THREE.Group;spec:PartSpec}>;
 renderer:THREE.WebGLRenderer;camera:THREE.PerspectiveCamera;wakeRender:()=>void;applyMechanismPose?:()=>void;
}
export function BeaconTrial({engine,language,sceneRevision}:{engine:{current:BeaconScene|null};language:LanguageCode;sceneRevision:string}){
 const [settings,setSettings]=useState<BeaconSettings>({source:'solar',daylight:true,charged:true});
 const [draft,setDraft]=useState<BeaconSettings>({source:'solar',daylight:true,charged:true});
 const outcome=getBeaconOutcome(settings),on=outcome.endsWith('On');
 const locale=language==='fr'?0:language==='en'?1:2,t=BEACON_TRIAL_TEXT;
 const {toggle,isSupported}=useSpeech();
 useEffect(()=>{
  const scene=engine.current;if(!scene)return;
  const lever=new THREE.Group();lever.position.set(.75,.54,.7);lever.rotation.z=settings.source==='solar'?-.4:.4;
  const handle=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.28,12),new THREE.MeshStandardMaterial({color:'#f8fafc'}));handle.position.y=.14;lever.add(handle);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),new THREE.MeshStandardMaterial({color:'#6366f1'}));knob.position.y=.28;lever.add(knob);scene.turntableGroup.add(lever);
  const originals=new Map<THREE.MeshStandardMaterial,{color:THREE.Color;emissive:THREE.Color;intensity:number}>();
  const remember=(material:THREE.MeshStandardMaterial)=>{
    let saved=originals.get(material);
    if(!saved){saved={color:material.color.clone(),emissive:material.emissive.clone(),intensity:material.emissiveIntensity};originals.set(material,saved);}
    return saved;
  };
  // Resolve current groups on every rendered frame, including replacements after a style change.
  const applyAppearance=()=>{
    scene.placedPartEntries.get('beacon-lamp')?.group.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      const materials=Array.isArray(object.material)?object.material:[object.material];
      for(const material of materials)if(material instanceof THREE.MeshStandardMaterial&&material.transparent){
        remember(material);material.color.set(on?'#fef08a':'#475569');material.emissive.set(on?'#facc15':'#000000');material.emissiveIntensity=on?2:0;
      }
    });
    const visited=new Set<THREE.MeshStandardMaterial>();
    for(const [id,entry]of scene.placedPartEntries)if(id.startsWith('beacon-solar-')&&!id.includes('mount'))entry.group.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      const materials=Array.isArray(object.material)?object.material:[object.material];
      for(const material of materials)if(material instanceof THREE.MeshStandardMaterial&&!visited.has(material)){
        visited.add(material);material.color.copy(remember(material).color).multiplyScalar(settings.daylight?1:.35);
      }
    });
  };
  scene.applyMechanismPose=applyAppearance;
  const canvas=scene.renderer.domElement,ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let pressed:[number,number]|undefined;
  const down=(e:PointerEvent)=>{pressed=[e.clientX,e.clientY];};
  const click=(e:MouseEvent)=>{
   if(!pressed||Math.hypot(e.clientX-pressed[0],e.clientY-pressed[1])>10)return;
   const bounds=canvas.getBoundingClientRect();pointer.set((e.clientX-bounds.x)/bounds.width*2-1,-(e.clientY-bounds.y)/bounds.height*2+1);scene.turntableGroup.updateMatrixWorld(true);ray.setFromCamera(pointer,scene.camera);
   const selector=scene.placedPartEntries.get('beacon-selector');
   if(ray.intersectObjects(selector?[selector.group,lever]:[lever],true).length){const next:BeaconSettings={...settings,source:settings.source==='solar'?'battery':'solar'};setSettings(next);setDraft(next);}
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('click',click);scene.wakeRender();
  return()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('click',click);if(scene.applyMechanismPose===applyAppearance)scene.applyMechanismPose=undefined;originals.forEach((saved,material)=>{material.color.copy(saved.color);material.emissive.copy(saved.emissive);material.emissiveIntensity=saved.intensity;});lever.removeFromParent();handle.geometry.dispose();handle.material.dispose();knob.geometry.dispose();knob.material.dispose();scene.wakeRender();};
 },[engine,sceneRevision,settings.source,settings.daylight,settings.charged,on]);
 const controls=[{label:'source',options:['solar','battery'],selected:draft.source,onChange:(value:string)=>setDraft(s=>({...s,source:value==='solar'?'solar':'battery'}))},
  {label:'light',options:['day','night'],selected:draft.daylight?'day':'night',onChange:(value:string)=>setDraft(s=>({...s,daylight:value==='day'}))},
  {label:'charge',options:['full','empty'],selected:draft.charged?'full':'empty',onChange:(value:string)=>setDraft(s=>({...s,charged:value==='full'}))}] as const;
 return <WorkshopMissionPortal><MissionPanel language={language} title={t.title[locale]} attributes={{'data-beacon-outcome':outcome,'data-beacon-source':settings.source}} status={t[outcome][locale]}
  fields={controls.map(control=>({id:control.label,label:t[control.label][locale],content:<fieldset data-beacon-control={control.label}><legend className="sr-only">{t[control.label][locale]}</legend><MissionOptions label={t[control.label][locale]} value={control.options.findIndex(option=>option===control.selected)} options={control.options.map((option,value)=>({value,label:t[option][locale]}))} onChange={value=>control.onChange(control.options[value])}/></fieldset>}))}
  info={<><p>{t[outcome][locale]}</p><p>{t.touch[locale]}</p></>} onListen={isSupported?()=>toggle('beacon',t[outcome][locale],language):undefined}
  actions={<button type="button" data-mission-primary className={`${missionButton} bg-sky-100`} onClick={()=>setSettings({...draft})}>{MISSION_PANEL_TEXT.observe[locale]}</button>}/></WorkshopMissionPortal>;
}
