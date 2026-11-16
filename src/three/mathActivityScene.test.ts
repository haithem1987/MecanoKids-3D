import {buildPartMeshGroup} from './partGeometries';
import {VisualStyleMode} from '../types/game';
import {describe,expect,it} from 'vitest';
import * as THREE from 'three';
import {createMathBlueprints} from '../data/mathBlueprints';
import {MATH_ACTIVITY_KINDS,mathStart,mathSolution} from '../data/mathActivities';
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
   expect(controller.pickTargets().length).toBe(kind==='symmetry'?9:bp.parts.filter(part=>part.id.startsWith('token-')).length);
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

describe('essais mécaniques, pas validation de formulaire',()=>{
 const model=(kind:typeof MATH_ACTIVITY_KINDS[number])=>{const bp=createMathBlueprints(VehicleCategory.MATHS).find(bp=>bp.id===`math-${kind}`)!;const entries=new Map(bp.parts.map(spec=>{const group=new THREE.Group();group.position.fromArray(spec.targetPos);return[spec.id,{spec,group}];}));return{entries,scene:createMathActivityScene(kind,()=>entries)};};
 it('fait traverser la tortue seulement lorsque la passerelle rejoint son appui',()=>{for(const kind of ['addition','fractions']as const){const {scene}=model(kind),runner=scene.group.getObjectByName('math-runner')!;scene.apply(mathStart(kind),0,1,true);const stopped=runner.position.x;scene.apply(mathSolution(kind,0),0,0,true);const start=runner.position.x;scene.apply(mathSolution(kind,0),0,1,true);expect(runner.position.x).toBeGreaterThan(start+.9);expect(stopped).toBeLessThan(runner.position.x);scene.dispose();}});
 it('lève le vrai chargement avec le bon gabarit de fixations ou de plateau',()=>{for(const kind of ['groups','area']as const){const {scene,entries}=model(kind);scene.apply(mathStart(kind),0,1,true);const blocked=entries.get('load')!.group.position.y;scene.apply(mathSolution(kind,0),0,1,true);expect(entries.get('load')!.group.position.y).toBeGreaterThan(blocked+.5);scene.dispose();}});
 it('couple physiquement les deux engrenages en sens inverse même si la prévision est fausse',()=>{const {scene,entries}=model('ratio');scene.apply([0,3],0,1,true);const drive=entries.get('drive-wheel')!.group.quaternion.clone(),driven=entries.get('driven-wheel')!.group.quaternion.clone();expect(entries.get('load')!.group.position.y).toBeCloseTo(.30+2*Math.PI*2*.02);scene.apply([0,1],0,.25,true);expect(entries.get('drive-wheel')!.group.quaternion.equals(drive)).toBe(false);expect(entries.get('driven-wheel')!.group.quaternion.equals(driven)).toBe(false);scene.dispose();});
});

it('construit des roues dentées alignées sur leurs axes avec un tambour de levage',()=>{const bp=createMathBlueprints(VehicleCategory.MATHS).find(bp=>bp.id==='math-ratio')!,small=bp.parts.find(part=>part.id==='drive-wheel')!,large=bp.parts.find(part=>part.id==='driven-wheel')!;expect(small.mathGearTeeth).toBe(12);expect(large.mathGearTeeth).toBe(18);expect(Math.abs(small.targetPos[0]-large.targetPos[0])).toBeCloseTo((small.scale[0]+large.scale[0])/2);const mesh=buildPartMeshGroup(small,VisualStyleMode.BLOCKS,false,1),size=new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3());expect(size.x).toBeGreaterThan(.55);expect(size.y).toBeGreaterThan(.55);expect(size.z).toBeLessThan(.12);const driven=buildPartMeshGroup(large,VisualStyleMode.BLOCKS,false,1);expect(driven.children.length).toBeGreaterThan(3);for(const root of [mesh,driven])root.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();for(const material of Array.isArray(object.material)?object.material:[object.material])material.dispose();}});});
