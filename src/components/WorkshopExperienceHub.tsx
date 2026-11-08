import {supportsWorkshopPlay} from '../data/workshopActivities';
import {useEffect} from 'react';
import {AdventureNotebookModal} from './AdventureNotebookModal';
import {recordDiscoveryObservation,type NotebookText,type DiscoveryObservation} from '../utils/discoveryNotebook';
import {canOpenWorkshop} from '../utils/workshopAccess';
import {localAdminActive} from '../utils/localAdmin';
import {VIRTUAL_LAB_TEXT,SCIENCE_CHALLENGE_TEXT} from '../i18n/translations';
import {VIRTUAL_LAB_MODELS,type VirtualLabTrial} from '../data/virtualLabs';
import {meetsChallenge,observeChallenge,type ScienceTrial} from '../data/scienceChallenges';
import type {LanguageCode,PlayerProgress,VehicleBlueprint} from '../types/game';
export function WorkshopExperienceHub({isOpen,onClose,profileId,language,progress,blueprints,blueprint,labTrial,scienceTrial,onOpenBlueprint}:{isOpen:boolean;onClose:()=>void;profileId:string;language:LanguageCode;progress:PlayerProgress;blueprints:readonly VehicleBlueprint[];blueprint:VehicleBlueprint;labTrial?:VirtualLabTrial;scienceTrial?:ScienceTrial;onOpenBlueprint:(id:string)=>void}){
 useEffect(()=>{
  const save=(event:Event)=>{
   const detail=(event as CustomEvent<DiscoveryObservation>).detail;
   if(!detail||detail.blueprintId!==blueprint.id||typeof detail.kind!=='string'||!Array.isArray(detail.result)||detail.result.length!==3||!detail.result.every(text=>typeof text==='string'))return;
   recordDiscoveryObservation(profileId,detail);
  };
  window.addEventListener('octogears:workshop-discovery',save);return()=>window.removeEventListener('octogears:workshop-discovery',save);
 },[profileId,blueprint.id]);
 useEffect(()=>{
  if(!labTrial||labTrial.id!==blueprint.virtualLab)return;
  const result=VIRTUAL_LAB_TEXT[labTrial.id].outcomes[labTrial.outcome] as NotebookText|undefined;
  if(result)window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId:blueprint.id,kind:'lab-'+labTrial.id,result,settings:labTrial.settings,success:labTrial.outcome===VIRTUAL_LAB_MODELS[labTrial.id].success}}));
 },[profileId,blueprint.id,blueprint.virtualLab,labTrial]);
 useEffect(()=>{
  if(!scienceTrial||scienceTrial.blueprintId!==blueprint.id)return;
  const result=SCIENCE_CHALLENGE_TEXT[observeChallenge(scienceTrial.challenge,scienceTrial.setting)];
  window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId:blueprint.id,kind:'science-'+scienceTrial.challenge.id,result,settings:[scienceTrial.setting],success:meetsChallenge(scienceTrial.challenge,scienceTrial.setting)}}));
 },[profileId,blueprint.id,scienceTrial]);
 return <AdventureNotebookModal isOpen={isOpen} onClose={onClose} profileId={profileId} language={language} progress={progress} blueprints={blueprints} supportsPlay={supportsWorkshopPlay} canOpenBlueprint={bp=>canOpenWorkshop(bp,progress,blueprints,localAdminActive)} onOpenBlueprint={onOpenBlueprint}/>;
}
