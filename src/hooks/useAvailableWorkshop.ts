import {useEffect,useMemo} from 'react';
import type {PlayerProgress,VehicleBlueprint} from '../types/game';
import {isMathWorkshopAvailable} from '../data/mathAvailability';
import {mathPrototypesActive} from '../utils/localAdmin';

/** Saved progress survives release/age changes; selection never reopens a withdrawn activity. */
export function useAvailableWorkshop(blueprints:readonly VehicleBlueprint[],progress:PlayerProgress,daily:VehicleBlueprint,setProgress:(update:(previous:PlayerProgress)=>PlayerProgress)=>void){
 const rawBlueprint=useMemo(()=>{
  if(progress.currentBlueprintId===daily.id)return daily;
  const available=(id:string)=>blueprints.find(bp=>bp.id===id&&isMathWorkshopAvailable(id,progress.ageProfile,mathPrototypesActive));
  return available(progress.currentBlueprintId)??available(progress.lastStandardBlueprintId)??blueprints[0];
 },[blueprints,progress.currentBlueprintId,progress.lastStandardBlueprintId,progress.ageProfile,daily]);
 useEffect(()=>{
  if(isMathWorkshopAvailable(progress.currentBlueprintId,progress.ageProfile,mathPrototypesActive))return;
  setProgress(previous=>({...previous,currentBlueprintId:rawBlueprint.id,lastStandardBlueprintId:rawBlueprint.id}));
 },[progress.currentBlueprintId,progress.ageProfile,rawBlueprint.id,setProgress]);
 const currentIndex=blueprints.findIndex(bp=>bp.id===rawBlueprint.id);
 const nextBlueprint=blueprints.slice(currentIndex+1).find(bp=>isMathWorkshopAvailable(bp.id,progress.ageProfile,mathPrototypesActive));
 return{rawBlueprint,currentIndex,nextBlueprint,hasNextStage:currentIndex>=0&&Boolean(nextBlueprint)};
}
