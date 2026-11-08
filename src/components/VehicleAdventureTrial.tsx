import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import type {LanguageCode,PartSpec,VehicleBlueprint} from '../types/game';
import {PartShapeKind} from '../types/game';
import {VEHICLE_ADVENTURE_TEXT,RAIL_ADVENTURE_TEXT,RAIL_MAGLEV_TEXT} from '../i18n/translations';
import {checkVehicleAdventure,getVehicleAdventureKind,getVehicleAdventurePose,vehicleAdventureStageCount,type VehicleAdventureFeedback,type VehicleAdventureSettings} from '../data/vehicleAdventures';
import {createVehicleAdventureVisuals,disposeVehicleAdventureVisuals,measureVehicleAdventureModel} from '../three/vehicleAdventureScene';
import {createRailTrack,createMaglevGuideway,setRailWheelsetTravel} from '../three/railGeometry';
import {isMaglevBlueprint} from '../data/railBlueprints';
import {useSceneReady} from '../hooks/useSceneReady';
import {useSpeech} from '../utils/speech';
import {MissionPanel,MissionOptions,missionButton,type MissionField} from './MissionPanel';
import {WorkshopMissionPortal} from './WorkshopMissionPortal';
interface VehicleScene{placedPartEntries:Map<string,{group:THREE.Group;spec:PartSpec}>;turntableGroup:THREE.Group;assembledGroup:THREE.Group;renderer:THREE.WebGLRenderer;camera:THREE.PerspectiveCamera;reducedMotion:boolean;applyMechanismPose?:()=>void;wakeRender:()=>void}
type Pose=ReturnType<typeof getVehicleAdventurePose>;
type TextKey=keyof typeof VEHICLE_ADVENTURE_TEXT;
const actions={delivery:['prepare','deliver','unload'],navigation:['prepare','sail','dock'],flight:['prepare','takeoff','fly','land'],site:['prepare','lift','position','lower'],rover:['prepare','approach','scan'],orbit:['prepare','orient','transmit'],launch:['prepare','ignite','launch','return'],rail:['prepare','deliver','dock']} as const;
const fieldLabels={delivery:['deliveryRoute','balanceField'],navigation:['navigationPower','heading'],flight:['flightAltitude','balanceField'],site:['siteGround','siteClearance'],rover:['roverGround','energyField'],orbit:['orbitSun','antennaField'],launch:['launchPayload','fuelField'],rail:['deliveryRoute','balanceField']} as const;
const options={delivery:[['direct','detour'],['unbalanced','balanced']],navigation:[['stopped','powered'],['current','buoys']],flight:[['low','clearHeight'],['unbalanced','balanced']],site:[['sloped','stable'],['occupied','free']],rover:[['rough','smooth'],['empty','charged']],orbit:[['shade','sunlight'],['antennaBlocked','antennaClear']],launch:[['unbalanced','balanced'],['fuelEmpty','fuelReady']],rail:[['direct','detour'],['unbalanced','balanced']]} as const;
export function VehicleAdventureTrial({engine,blueprint,language,sceneRevision}:{engine:{current:VehicleScene|null};blueprint:VehicleBlueprint;language:LanguageCode;sceneRevision:string}){
 const kind=getVehicleAdventureKind(blueprint),locale=language==='fr'?0:language==='en'?1:2,t=VEHICLE_ADVENTURE_TEXT,sceneReady=useSceneReady(engine);
 const [settings,setSettings]=useState<VehicleAdventureSettings>([0,0]),[stage,setStage]=useState(0),[feedback,setFeedback]=useState<VehicleAdventureFeedback>('ready'),[attempt,setAttempt]=useState(0);
 const stageRef=useRef(stage);stageRef.current=stage;
 const visualRef=useRef<ReturnType<typeof createVehicleAdventureVisuals>|null>(null),modelRef=useRef<ReturnType<typeof measureVehicleAdventureModel>|null>(null),poseRef=useRef<Pose|null>(null),advanceRef=useRef<()=>void>(()=>{});
 const {isSupported,toggle}=useSpeech();
 const emit=(success:boolean,result:readonly [string,string,string])=>window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId:blueprint.id,kind:'vehicle-adventure',result,success,settings:[...settings,stage]}}));
 const advance=()=>{
  if(!kind||feedback==='moving'||feedback==='done'||!sceneReady)return;
  if(stage===0){const verdict=checkVehicleAdventure(kind,settings);setFeedback(verdict);if(verdict==='prepared')setStage(1);else emit(false,t[verdict]);}
  else{setFeedback('moving');setStage(previous=>Math.min(vehicleAdventureStageCount(kind),previous+1));}
 };
 advanceRef.current=advance;
 useEffect(()=>{
  const scene=engine.current;if(!sceneReady||!scene||!kind)return;
  const model=measureVehicleAdventureModel(scene.assembledGroup);modelRef.current=model;
  const original={position:scene.assembledGroup.position.clone(),quaternion:scene.assembledGroup.quaternion.clone(),scale:scene.assembledGroup.scale.clone()};
  const ground=original.position.y+model.bounds.min.y*original.scale.y,visual=createVehicleAdventureVisuals(kind,model.frame);visualRef.current=visual;scene.turntableGroup.add(visual.root);
  if(kind==='rail')visual.root.add(isMaglevBlueprint(blueprint.id)?createMaglevGuideway(model.frame.halfDepth*2+model.frame.travel+.50,ground-.03*model.frame.scale,model.frame.scale):createRailTrack(1.06*model.frame.scale,model.frame.halfDepth*2+model.frame.travel+.50,ground+.025*model.frame.scale,model.frame.scale));
  poseRef.current=getVehicleAdventurePose(kind,stage,model.frame);
  const center=new THREE.Vector3(),rotation=new THREE.Quaternion(),yaw=new THREE.Quaternion(),yAxis=new THREE.Vector3(0,1,0),from=new THREE.Vector3(),to=new THREE.Vector3(),unitY=new THREE.Vector3(0,1,0);
  const apply=()=>{
   const pose=poseRef.current;if(!pose)return;
   yaw.setFromAxisAngle(yAxis,pose.yaw);rotation.copy(original.quaternion).multiply(yaw);scene.assembledGroup.quaternion.copy(rotation);scene.assembledGroup.scale.setScalar(model.frame.scale);
   center.copy(model.center).multiplyScalar(model.frame.scale).applyQuaternion(rotation);
   const destination=visual.direction(pose.travel,0,ground+model.frame.height/2+pose.lift);
   scene.assembledGroup.position.copy(destination).sub(center);
   if(kind==='rail'){for(const entry of scene.placedPartEntries.values()){if(entry.spec.railWheelset)setRailWheelsetTravel(entry.group,pose.travel+model.frame.travel/2,entry.spec.scale[1]/2,model.frame.scale);else if(entry.spec.structuralJoints){const driver=scene.placedPartEntries.get(entry.spec.structuralJoints[0]);if(driver?.spec.railWheelset){const angle=(pose.travel+model.frame.travel/2)/(driver.spec.scale[1]/2*model.frame.scale),pin=driver.spec.scale[1]/2*.36;entry.group.position.fromArray(entry.spec.targetPos);entry.group.position.y+=pin*(1-Math.cos(angle));entry.group.position.z-=pin*Math.sin(angle);}}}}
   const sideExtent=model.frame.axis==='x'?model.frame.halfDepth:model.frame.halfWidth,frontExtent=model.frame.axis==='x'?model.frame.halfWidth:model.frame.halfDepth;
   if(kind==='delivery')visual.cargo.position.copy(pose.signal?visual.direction(model.frame.travel/2,Math.min(1.7,sideExtent+.23),ground):visual.direction(pose.travel,0,ground+model.frame.height+.025));
   else if(kind==='site')visual.cargo.position.copy(visual.direction(pose.travel+frontExtent+.18,0,ground+pose.cargoLift));
   visual.signal.visible=pose.signal;visual.signal.position.copy(kind==='orbit'?visual.direction(0,1.75,.04):kind==='rover'?visual.rock?.position??visual.direction(pose.travel):kind==='site'?visual.cargo.position:visual.direction(model.frame.travel/2,Math.min(1.7,sideExtent+.23),ground+.025));
   visual.flame.visible=kind==='launch'&&(stageRef.current===2||stageRef.current===3);visual.flame.scale.y=.5;visual.flame.position.copy(destination);visual.flame.position.y=ground+pose.lift-.0875;
   visual.scan.visible=pose.signal&&(kind==='rover'||kind==='orbit');
   if(visual.scan.visible){from.copy(destination);to.copy(kind==='rover'&&visual.rock?visual.rock.position:visual.direction(0,1.75,.64));visual.scan.position.copy(from).add(to).multiplyScalar(.5);const length=from.distanceTo(to);visual.scan.scale.y=length;visual.scan.quaternion.setFromUnitVectors(unitY,to.sub(from).normalize());}
   if(visual.rock)visual.rock.material.color.set(pose.signal?0xfbbf24:0x9ca3af);
  };
  scene.applyMechanismPose=apply;apply();scene.wakeRender();
  const canvas=scene.renderer.domElement,ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let press:[number,number]|undefined;
  const down=(event:PointerEvent)=>{press=[event.clientX,event.clientY];};
  const click=(event:MouseEvent)=>{
   if(!press||Math.hypot(event.clientX-press[0],event.clientY-press[1])>10)return;
   const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.x)/rect.width*2-1,-(event.clientY-rect.y)/rect.height*2+1);scene.turntableGroup.updateMatrixWorld(true);ray.setFromCamera(pointer,scene.camera);
   const anchor=scene.assembledGroup.localToWorld(model.center.clone()).project(scene.camera),distance=Math.hypot((anchor.x-pointer.x)*rect.width/2,(anchor.y-pointer.y)*rect.height/2);
   if(ray.intersectObject(scene.assembledGroup,true).length||(anchor.z>=-1&&anchor.z<=1&&distance<=32))advanceRef.current();
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('click',click);
  return()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('click',click);if(scene.applyMechanismPose===apply)scene.applyMechanismPose=undefined;scene.assembledGroup.position.copy(original.position);scene.assembledGroup.quaternion.copy(original.quaternion);scene.assembledGroup.scale.copy(original.scale);if(kind==='rail')for(const entry of scene.placedPartEntries.values()){if(entry.spec.railWheelset)setRailWheelsetTravel(entry.group,0,entry.spec.scale[1]/2);if(entry.spec.structuralJoints)entry.group.position.fromArray(entry.spec.targetPos);}disposeVehicleAdventureVisuals(visual.root);visualRef.current=null;modelRef.current=null;scene.wakeRender();};
 // Appearance changes reconstruct the local objects and preserve the current step, without recording a new trial.
 },[engine,blueprint.id,kind,sceneRevision,sceneReady]);
 useEffect(()=>{
  const scene=engine.current,visual=visualRef.current;if(!sceneReady||!scene||!visual)return;
  visual.barrier.visible=feedback==='obstacle'||feedback==='clearance'||feedback==='balance';scene.wakeRender();
 },[engine,feedback,settings,sceneRevision,sceneReady]);
 useEffect(()=>{
  const scene=engine.current,model=modelRef.current;if(!sceneReady||!scene||!model||!kind)return;
  const target=getVehicleAdventurePose(kind,stage,model.frame),from=poseRef.current??target;let frame=0;const start=performance.now(),duration=feedback==='moving'&&!scene.reducedMotion?kind==='site'?1300:1800:0;
  const draw=(now:number)=>{
   const progress=duration===0?1:Math.min(1,(now-start)/duration),p=progress*progress*(3-2*progress);
   poseRef.current={travel:THREE.MathUtils.lerp(from.travel,target.travel,p),lift:THREE.MathUtils.lerp(from.lift,target.lift,p),yaw:THREE.MathUtils.lerp(from.yaw,target.yaw,p),cargoLift:THREE.MathUtils.lerp(from.cargoLift,target.cargoLift,p),signal:progress===1&&target.signal};scene.wakeRender();
   if(progress<1)frame=requestAnimationFrame(draw);
   else if(feedback==='moving'){const done=stage===vehicleAdventureStageCount(kind);setFeedback(done?'done':'prepared');if(done)emit(true,kind==='rail'?(isMaglevBlueprint(blueprint.id)?RAIL_MAGLEV_TEXT.done:RAIL_ADVENTURE_TEXT.done):t[`${kind}Done`]);}
  };
  frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);
 // Completing a step changes its label, not the geometry or the discovery record.
 },[engine,blueprint.id,kind,stage,attempt,sceneRevision,sceneReady]);
 if(!kind)return null;
 const sail=kind==='navigation'&&blueprint.parts.some(part=>part.shape===PartShapeKind.BOAT_SAIL),title=(kind==='rail'?RAIL_ADVENTURE_TEXT.title:t[`${kind}Title`])[locale],goal=(kind==='rail'?RAIL_ADVENTURE_TEXT.goal:t[`${kind}Goal`])[locale],status=feedback==='done'?(kind==='rail'?(isMaglevBlueprint(blueprint.id)?RAIL_MAGLEV_TEXT.done:RAIL_ADVENTURE_TEXT.done):t[`${kind}Done`])[locale]:t[feedback][locale];
 const fields:MissionField[]=fieldLabels[kind].flatMap((field,index)=>{
  if(kind==='delivery'&&index===1)return[];
  const label=kind==='rail'?RAIL_ADVENTURE_TEXT[index===0?'signal':'speed'][locale]:sail&&index===0?t.wind[locale]:t[field][locale],labels:readonly TextKey[]=sail&&index===0?['slackSail','trimmedSail']:options[kind][index];
  return[{id:String(index),label,content:<fieldset disabled={feedback==='moving'||stage>0}><MissionOptions label={label} value={settings[index]} options={kind==='rail'?([0,1].map(value=>({value,label:RAIL_ADVENTURE_TEXT[index===0?value===0?'busy':'clear':value===0?'fast':'cautious'][locale]}))):labels.map((key,value)=>({value,label:t[key][locale]}))} onChange={value=>setSettings(previous=>index===0?[value,previous[1]]:[previous[0],value])}/></fieldset>}];
 });
 const action=actions[kind][Math.min(stage,actions[kind].length-1)],reset=()=>{setStage(0);setFeedback('ready');setSettings([0,0]);setAttempt(value=>value+1);};
 return <WorkshopMissionPortal><MissionPanel language={language} title={title} attributes={{'data-vehicle-adventure':kind,'data-vehicle-stage':stage,'data-vehicle-feedback':feedback,'data-vehicle-frame':JSON.stringify(modelRef.current?{...modelRef.current.frame,ground:modelRef.current.bounds.min.y}:undefined)}} status={status} fields={fields}
  info={<><p>{goal}</p><p>{status}</p><p>{t.touch[locale]}</p></>} onListen={isSupported?()=>toggle(`vehicle-adventure-${blueprint.id}`,`${goal} ${status}`,language):undefined}
  actions={<><button type="button" data-mission-primary data-vehicle-advance className={missionButton} disabled={feedback==='moving'||feedback==='done'||!sceneReady} onClick={advance}>{kind==='rail'&&stage>0?RAIL_ADVENTURE_TEXT[stage===1?'depart':'stop'][locale]:t[action][locale]}</button><button type="button" data-mission-reset data-vehicle-reset className={missionButton} disabled={feedback==='moving'} onClick={reset}>{t.replay[locale]}</button></>}/></WorkshopMissionPortal>;
}
