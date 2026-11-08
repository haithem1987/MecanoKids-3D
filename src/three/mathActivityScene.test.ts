import {describe,expect,it} from 'vitest';
import * as THREE from 'three';
import {createMathBlueprints} from '../data/mathBlueprints';
import {MATH_ACTIVITY_KINDS,mathSolution} from '../data/mathActivities';
import {VehicleCategory} from '../types/game';
import {createMathActivityScene,type MathPartEntry} from './mathActivityScene';
describe('mathématiques dans la scène commune',()=>{
 it('manipule les vrais groupes assemblés puis restaure les pièces sans modifier les plans',()=>{
  const blueprints=createMathBlueprints(VehicleCategory.PHYSICS);
  for(const kind of MATH_ACTIVITY_KINDS){
   const bp=blueprints.find(bp=>bp.id===`math-${kind}`)!,entries=new Map<string,MathPartEntry>();
   for(const spec of bp.parts){const group=new THREE.Group();group.position.fromArray(spec.targetPos);entries.set(spec.id,{group,spec});}
   const before=JSON.stringify(bp),controller=createMathActivityScene(kind,()=>entries);
   for(let level=0;level<3;level++){
    controller.apply(mathSolution(kind,level),level);
    for(const entry of entries.values())expect([...entry.group.position.toArray(),...entry.group.scale.toArray()].every(Number.isFinite)).toBe(true);
   }
   expect(controller.pickTargets().length).toBe(kind==='symmetry'?9:bp.parts.length-2);
   controller.dispose();expect(controller.group.children).toHaveLength(0);
   for(const entry of entries.values()){expect(entry.group.position.toArray()).toEqual(entry.spec.targetPos);expect(entry.group.scale.toArray()).toEqual([1,1,1]);}
   expect(JSON.stringify(bp)).toBe(before);
  }
 });
 it('conserve la longueur de l’unité pour les quarts et les huitièmes',()=>{
  const bp=createMathBlueprints(VehicleCategory.PHYSICS).find(bp=>bp.id==='math-fractions')!,entries=new Map(bp.parts.map(spec=>{const group=new THREE.Group();group.position.fromArray(spec.targetPos);return[spec.id,{spec,group}];}));
  const controller=createMathActivityScene('fractions',()=>entries);
  controller.apply([3,4],1);const quarter=entries.get('token-0')!.group.scale.x;
  controller.apply([6,8],1);const eighth=entries.get('token-0')!.group.scale.x;
  expect(quarter*4).toBe(eighth*8);controller.dispose();
 });
});
