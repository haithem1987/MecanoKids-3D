import {useEffect} from 'react';
import type {ComponentProps} from 'react';
import {createMathActivityScene} from '../three/mathActivityScene';
import {useSceneReady} from '../hooks/useSceneReady';
import {additionBridgeAddedCount} from '../data/additionBridge';
import type {MathActivityTrial} from './MathActivityTrial';

export function AdditionBridgeBuildScene({engine,placedPartIds,sceneRevision}:{engine:ComponentProps<typeof MathActivityTrial>['engine'];placedPartIds:readonly string[];sceneRevision:string}){
 const ready=useSceneReady(engine);
 useEffect(()=>{
  const scene=engine.current;if(!ready||!scene)return;
  const controller=createMathActivityScene('addition',()=>scene.placedPartEntries);
  scene.turntableGroup.add(controller.group);
  const previous=scene.applyMechanismPose,apply=()=>controller.apply([2,additionBridgeAddedCount(placedPartIds)],0);
  scene.applyMechanismPose=apply;apply();scene.wakeRender();
  return()=>{if(scene.applyMechanismPose===apply)scene.applyMechanismPose=previous;controller.dispose();scene.wakeRender();};
 },[engine,ready,placedPartIds,sceneRevision]);
 return null;
}
