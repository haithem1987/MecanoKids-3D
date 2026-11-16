import {describe,it,expect} from 'vitest';
import {additionBridgePlacedParts,additionBridgeAddedCount} from './additionBridge';
import {createMathBlueprints} from './mathBlueprints';
import {VehicleCategory} from '../types/game';
import {isAssemblyComplete} from '../utils/assemblyValidation';

describe('addition construite sur la passerelle',()=>{
 const bp=createMathBlueprints(VehicleCategory.MATHS).find(bp=>bp.id==='math-addition')!;
 it('commence avec deux vraies lames et exactement trois emplacements libres',()=>{
  const initial=additionBridgePlacedParts(bp,[]);
  expect(initial.filter(id=>id.startsWith('token-'))).toEqual(['token-0','token-1']);
  expect(bp.parts.filter(part=>!initial.includes(part.id)).map(part=>part.id)).toEqual(['token-2','token-3','token-4']);
  expect(isAssemblyComplete(bp,initial)).toBe(false);
  expect(additionBridgeAddedCount(initial)).toBe(0);
 });
 it('relie le comptage aux poses et ferme exactement le pont avec la troisième lame',()=>{
  let placed=additionBridgePlacedParts(bp,[]);
  for(let added=1;added<=3;added++){
   placed=[...placed,`token-${added+1}`];
   expect(additionBridgeAddedCount(placed)).toBe(added);
   expect(isAssemblyComplete(bp,placed)).toBe(added===3);
  }
  const planks=bp.parts.filter(part=>part.id.startsWith('token-'));
  for(let i=1;i<planks.length;i++)expect(planks[i].targetPos[0]-planks[i-1].targetPos[0]).toBeCloseTo(planks[i].scale[0]);
  expect(planks[0].primaryColor).toBe(planks[1].primaryColor);
  expect(planks[2].primaryColor).not.toBe(planks[1].primaryColor);
 });
 it('retire les cinq anciennes lames de réserve et garde une reprise cohérente',()=>{
  const restored=additionBridgePlacedParts(bp,bp.parts.map(part=>part.id).concat(['token-5','token-9']));
  expect(restored).toHaveLength(10);expect(isAssemblyComplete(bp,restored)).toBe(true);
  expect(additionBridgePlacedParts(bp,[])).toHaveLength(7);
 });
});
