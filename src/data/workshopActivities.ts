import {getMathActivityKind} from './mathActivities';
import type {VehicleBlueprint} from '../types/game';
import {getConstructionPlayKind} from './constructionPlay';
import {getHeritageDiscoveryKind} from './heritageDiscoveries';
import {getScienceDiscoveryKind} from './scienceDiscovery';
import {getVehicleAdventureKind} from './vehicleAdventures';
import {getScienceChallenges} from './scienceChallenges';
export function getWorkshopActivity(bp:VehicleBlueprint){
 if(getMathActivityKind(bp.id))return 'math';
 if(bp.virtualLab)return 'virtual-lab';
 if(getScienceChallenges(bp.id))return 'science-challenge';
 if(bp.interactiveTrial||bp.id==='master-drawbridge')return 'mechanism';
 if(getConstructionPlayKind(bp.id))return 'construction';
 if(getHeritageDiscoveryKind(bp.id))return 'heritage';
 if(getScienceDiscoveryKind(bp.id))return 'science-discovery';
 if(getVehicleAdventureKind(bp))return 'vehicle';
 return undefined;
}
export const supportsWorkshopPlay=(bp:VehicleBlueprint)=>Boolean(getWorkshopActivity(bp));
export const usesWorkshopMissionPortal=(bp:VehicleBlueprint)=>{const activity=getWorkshopActivity(bp);return Boolean(activity&&activity!=='virtual-lab'&&activity!=='science-challenge');};
