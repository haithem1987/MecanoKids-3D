import {useEffect,useState} from 'react';
import {WORKSHOP_ADVENTURES,adventureProgress} from '../data/adventures';
import {supportsWorkshopPlay} from '../data/workshopActivities';
import {canOpenWorkshop} from '../utils/workshopAccess';
import {localAdminActive} from '../utils/localAdmin';
import {useDiscoveryNotebook} from './useDiscoveryNotebook';
import type {PlayerProgress,VehicleBlueprint} from '../types/game';
const key=(id:string)=>'octogears-active-adventure:'+encodeURIComponent(id);
function read(id:string){try{return localStorage.getItem(key(id))??'';}catch{return '';}}
export function useAdventureContinuation(profileId:string,progress:PlayerProgress,blueprints:readonly VehicleBlueprint[],currentId:string){
 const [selection,setSelection]=useState(()=>({profileId,routeId:read(profileId)})),{notebook}=useDiscoveryNotebook(profileId);
 useEffect(()=>{const choose=(event:Event)=>{const detail=(event as CustomEvent<{profileId:string;routeId:string}>).detail;if(detail?.profileId!==profileId||!WORKSHOP_ADVENTURES.some(route=>route.id===detail.routeId))return;try{localStorage.setItem(key(profileId),detail.routeId);}catch{/* Selection remains usable for this session. */}setSelection({profileId,routeId:detail.routeId});};window.addEventListener('octogears:adventure-selected',choose);return()=>window.removeEventListener('octogears:adventure-selected',choose);},[profileId]);
 const routeId=selection.profileId===profileId?selection.routeId:read(profileId),route=WORKSHOP_ADVENTURES.find(route=>route.id===routeId);
 if(!route)return undefined;
 const steps:readonly string[]=route.steps,index=steps.indexOf(currentId),requires=(id:string)=>{const bp=blueprints.find(bp=>bp.id===id);return Boolean(bp&&supportsWorkshopPlay(bp));};
 const journey=adventureProgress(steps,progress,notebook,requires),current=journey.steps[index];
 if(index<0||!current?.completed)return undefined;
 const next=blueprints.find(bp=>bp.id===steps[index+1]);
 return next&&canOpenWorkshop(next,progress,blueprints,localAdminActive)?next.id:undefined;
}
