import {PartShapeKind,VehicleCategory,type VehicleBlueprint} from '../types/game';
import {getConstructionPlayKind} from './constructionPlay';
import {getScienceChallenges} from './scienceChallenges';
import {isRailBlueprint} from './railBlueprints';
import {FLEET_CONSTRUCTION_SPACE_SEEDS} from './fleetConstructionSpace';
import {FLEET_AEROSPACE_SEEDS} from './fleetAerospatiale';
const spaceArchetypes=new Map([...FLEET_CONSTRUCTION_SPACE_SEEDS,...FLEET_AEROSPACE_SEEDS].map(seed=>[seed.id,seed.archetype]));
export type VehicleAdventureKind='delivery'|'navigation'|'flight'|'site'|'rover'|'orbit'|'launch'|'rail';
export const VEHICLE_ADVENTURE_CATEGORIES:readonly VehicleCategory[]=[VehicleCategory.CAR,VehicleCategory.BOAT,VehicleCategory.PLANE,VehicleCategory.CONSTRUCTION,VehicleCategory.SPACE,VehicleCategory.AEROSPACE];
/** Stable archetypes disambiguate reused meshes; handcrafted models fall back to structural features. */
export function getVehicleAdventureKind(blueprint:VehicleBlueprint):VehicleAdventureKind|undefined{
 if(!VEHICLE_ADVENTURE_CATEGORIES.includes(blueprint.category)||blueprint.staticStructure||blueprint.virtualLab||blueprint.experiment||blueprint.interactiveTrial||getScienceChallenges(blueprint.id)||getConstructionPlayKind(blueprint.id)||blueprint.id==='master-drawbridge'||blueprint.id==='master-bridge')return undefined;
 if(isRailBlueprint(blueprint.id))return'rail';
 const shapes=new Set(blueprint.parts.map(part=>part.shape));
 if(blueprint.category===VehicleCategory.BOAT)return'navigation';
 if(blueprint.category===VehicleCategory.PLANE)return'flight';
 if(blueprint.category===VehicleCategory.CAR)return'delivery';
 if(blueprint.category===VehicleCategory.CONSTRUCTION)return [PartShapeKind.EXCAVATOR_ARM,PartShapeKind.FORKLIFT_MAST,PartShapeKind.BOAT_CRANE].some(shape=>shapes.has(shape))?'site':'delivery';
 const archetype=spaceArchetypes.get(blueprint.id);
 if(archetype==='orbital_satellite')return'orbit';
 if(archetype==='space_rocket')return'launch';
 if(archetype==='planetary_rover')return'rover';
 if(archetype==='winged_orbiter_station')return /station|iss-module/.test(blueprint.id)?'orbit':'flight';
 if(shapes.has(PartShapeKind.ROVER_MAST_CAM)||shapes.has(PartShapeKind.WHEEL_AXLE)||shapes.has(PartShapeKind.CATERPILLAR_TRACK))return'rover';
 if(shapes.has(PartShapeKind.PLANE_FUSELAGE))return'flight';
 if(shapes.has(PartShapeKind.SOLAR_PANEL_ARRAY)||shapes.has(PartShapeKind.PARABOLIC_DISH))return'orbit';
 if(shapes.has(PartShapeKind.ROCKET_STAGE)||shapes.has(PartShapeKind.ROCKET_NOZZLE_CLUSTER))return'launch';
 if(shapes.has(PartShapeKind.PLANE_WING)||shapes.has(PartShapeKind.DELTA_WING))return'flight';
 return'orbit';
}
export type VehicleAdventureSettings=readonly [number,number];
export type VehicleAdventureFeedback='ready'|'obstacle'|'energy'|'balance'|'clearance'|'prepared'|'moving'|'done';
/** Wrong choices explain a condition and keep the current construction intact. */
export function checkVehicleAdventure(kind:VehicleAdventureKind,settings:VehicleAdventureSettings):Exclude<VehicleAdventureFeedback,'ready'|'moving'|'done'>{
 if(kind==='rail')return settings[0]!==1?'obstacle':settings[1]!==1?'balance':'prepared';
 if(kind==='delivery')return settings[0]===1?'prepared':'obstacle';
 if(kind==='navigation')return settings[0]!==1?'energy':settings[1]!==1?'obstacle':'prepared';
 if(kind==='flight')return settings[0]!==1?'clearance':settings[1]!==1?'balance':'prepared';
 if(kind==='site')return settings[0]!==1?'balance':settings[1]!==1?'clearance':'prepared';
 if(kind==='rover')return settings[0]!==1?'obstacle':settings[1]!==1?'energy':'prepared';
 if(kind==='orbit')return settings[0]!==1?'energy':settings[1]!==1?'clearance':'prepared';
 return settings[0]!==1?'balance':settings[1]!==1?'energy':'prepared';
}
export const vehicleAdventureStageCount=(kind:VehicleAdventureKind)=>kind==='flight'||kind==='launch'||kind==='site'?4:3;
export interface VehicleAdventureFrame{scale:number;radius:number;travel:number;axis:'x'|'z';height:number;halfWidth:number;halfDepth:number}
export function getVehicleAdventureFrame(width:number,height:number,depth:number):VehicleAdventureFrame{
 const safe=(value:number)=>Number.isFinite(value)&&value>0?value:.25,w=safe(width),h=safe(height),d=safe(depth),radius=Math.hypot(w/2,d/2),scale=Math.min(1,1.35/radius,2.4/h);
 return{scale,radius:radius*scale,travel:Math.min(.85,Math.max(.35,2.2-radius*scale)),axis:d>w?'z':'x',height:h*scale,halfWidth:w*scale/2,halfDepth:d*scale/2};
}
export function getVehicleAdventurePose(kind:VehicleAdventureKind,stage:number,frame:VehicleAdventureFrame):{travel:number;lift:number;yaw:number;cargoLift:number;signal:boolean}{
 const final=vehicleAdventureStageCount(kind),last=Math.max(0,Math.min(final,stage));
 const travel=(last>=2?1:0)*frame.travel/2;
 if(kind==='rail')return{travel:last>=3?frame.travel/2:last===2?0:-frame.travel/2,lift:0,yaw:0,cargoLift:0,signal:last===final};
 if(kind==='flight')return{travel:last>=3?travel:-frame.travel/2,lift:last===2||last===3?.55:0,yaw:0,cargoLift:0,signal:last===final};
 if(kind==='launch')return{travel:0,lift:last===2?.15:last===3?.85:0,yaw:0,cargoLift:0,signal:last===final};
 if(kind==='orbit')return{travel:0,lift:last>=2?.30:0,yaw:last>=2?.35:0,cargoLift:0,signal:last===final};
 if(kind==='site')return{travel:last>=3?travel:-frame.travel/2,lift:0,yaw:0,cargoLift:last===2||last===3?.45:0,signal:last===final};
 return{travel:last>=2?travel:-frame.travel/2,lift:0,yaw:kind==='navigation'&&last>=2?.12:0,cargoLift:0,signal:last===final};
}
