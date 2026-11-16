import type {VehicleBlueprint} from '../types/game';

/** The initial two planks are part of the problem, never an answer selected in a form. */
export function additionBridgePlacedParts(blueprint:VehicleBlueprint,saved:readonly string[]):string[]{
 const valid=new Set(blueprint.parts.map(part=>part.id));
 const initial=blueprint.parts.filter(part=>!part.id.startsWith('token-')||part.id==='token-0'||part.id==='token-1').map(part=>part.id);
 return [...new Set([...initial,...saved.filter(id=>valid.has(id))])];
}
export const additionBridgeAddedCount=(placed:readonly string[])=>[2,3,4].filter(index=>placed.includes(`token-${index}`)).length;
