import type {VehicleBlueprint} from '../types/game';
/** Manual voice stays usable even when automatic narration is disabled. */
export function getWorkshopInstruction(blueprint:VehicleBlueprint,placedIds:readonly string[],preferredId:string|null):string {
 const placed=new Set(placedIds);
 const preferred=blueprint.parts.find(part=>part.id===preferredId&&!placed.has(part.id));
 const next=preferred??blueprint.parts.find(part=>!placed.has(part.id)&&part.dependsOn.every(id=>placed.has(id)));
 return next?`${next.name}. ${next.roleHint}`:`${blueprint.name}. ${blueprint.discovery.howItWorks}`;
}
