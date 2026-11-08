import {useEffect} from 'react';
import type * as THREE from 'three';
import {isRailBlueprint,isMaglevBlueprint} from '../data/railBlueprints';
import {useSceneReady} from '../hooks/useSceneReady';
import {createRailTrack,createMaglevGuideway,disposeRailTrack} from '../three/railGeometry';
/** Assembly scenery only; the vehicle mission supplies a track fitted to its miniature scale. */
export function RailWorkshopTrack({engine,blueprintId,sceneRevision}:{engine:{current:{turntableGroup:THREE.Group;wakeRender:()=>void}|null};blueprintId:string;sceneRevision:string}){
 const ready=useSceneReady(engine);
 useEffect(()=>{const scene=engine.current;if(!ready||!scene||!isRailBlueprint(blueprintId))return;const track=isMaglevBlueprint(blueprintId)?createMaglevGuideway():createRailTrack();scene.turntableGroup.add(track);scene.wakeRender();return()=>{disposeRailTrack(track);scene.wakeRender();};},[engine,blueprintId,sceneRevision,ready]);
 return null;
}
