import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {VEHICLE_BLUEPRINTS} from '../data/blueprints';
import {SCIENCE_DISCOVERY_IDS,SCIENCE_DISCOVERY_MODELS} from '../data/scienceDiscovery';
import {createScienceDiscoveryScene,type DiscoveryPartEntry} from './scienceDiscoveryScene';
function setup(id:string){const bp=VEHICLE_BLUEPRINTS.find(bp=>bp.id===id)!;const entries=new Map<string,DiscoveryPartEntry>(bp.parts.map(spec=>{const group=new THREE.Group();group.position.fromArray(spec.targetPos);group.rotation.fromArray([...(spec.targetRot??[0,0,0]),'XYZ']);return[spec.id,{group,spec}];}));return entries;}
describe('effets scientifiques sur les pièces assemblées',()=>{
 it('modifie la scène construite et restaure les pièces au démontage dans les onze ateliers',()=>{
  for(const[id,kind]of Object.entries(SCIENCE_DISCOVERY_IDS)){
   const entries=setup(id),trial=createScienceDiscoveryScene(kind,()=>entries),model=SCIENCE_DISCOVERY_MODELS[kind];
   trial.apply(kind==='balance'?model.start:model.solution,3,false);
   const visible=trial.group.children.filter(child=>child.visible).length;const moved=[...entries.values()].some(entry=>!entry.group.position.equals(new THREE.Vector3(...entry.spec.targetPos))||!entry.group.scale.equals(new THREE.Vector3(1,1,1))||!entry.group.visible||entry.group.rotation.toArray().slice(0,3).some((angle,index)=>angle!==(entry.spec.targetRot??[0,0,0])[index]));
   expect(visible>0||moved,id).toBe(true);
   let disposed=0;trial.group.traverse(object=>{if(object instanceof THREE.Mesh)object.geometry.addEventListener('dispose',()=>disposed++);});trial.dispose();expect(disposed).toBeGreaterThan(0);expect(trial.group.children).toHaveLength(0);
   for(const entry of entries.values()){expect(entry.group.position.toArray()).toEqual(entry.spec.targetPos);expect(entry.group.visible).toBe(true);expect(entry.group.scale.toArray()).toEqual([1,1,1]);}
  }
 });
 it('garde tige et masse reliées au même pivot pour toutes les longueurs',()=>{
  const entries=setup('phys-pendulum'),trial=createScienceDiscoveryScene('pendulum',()=>entries);
  for(const length of [0,1]){trial.apply([length,1],.4,false);const rod=entries.get('rod')!.group,bob=entries.get('bob')!.group,pivot=new THREE.Vector3(0,1.9,0);expect(rod.position.distanceTo(pivot)*2+.1).toBeCloseTo(bob.position.distanceTo(pivot));}
  trial.dispose();
 });
 it('ne crée pas des couleurs absentes de la source rouge',()=>{
  const entries=setup('phys-prism-light'),trial=createScienceDiscoveryScene('prism',()=>entries);trial.apply([2],3,true);expect(entries.get('spectrum-0')!.group.visible).toBe(true);for(let i=1;i<6;i++)expect(entries.get(`spectrum-${i}`)!.group.visible).toBe(false);trial.dispose();
 });
 it('oriente le pôle nord de la boussole dans le sens du champ sortant du pôle nord de l’aimant',()=>{
  const entries=setup('phys-magnet-compass'),trial=createScienceDiscoveryScene('compass',()=>entries);
  for(const setting of [0,1,2]){trial.apply([setting],3,true);const magnet=entries.get('magnet')!.group,needle=entries.get('needle')!.group,northMagnet=new THREE.Vector3(0,1,0).applyQuaternion(magnet.quaternion),northNeedle=new THREE.Vector3(0,0,1).applyQuaternion(needle.quaternion);expect(northMagnet.dot(northNeedle)).toBeCloseTo(1);expect(northNeedle.dot(needle.position.clone().sub(magnet.position).setY(0).normalize())).toBeCloseTo(1);}
  trial.dispose();
 });

});
