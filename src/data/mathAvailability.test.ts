import {describe,it,expect} from 'vitest';
import {isMathWorkshopAvailable} from './mathAvailability';
import {craneBalanced,craneChallenge,craneTilt} from './craneBalance';
import {createCraneBlueprint} from './craneBlueprint';
import {VehicleCategory} from '../types/game';
import {createCraneBalanceScene} from '../three/craneBalanceScene';
import * as THREE from 'three';

describe('maths selon les acquis et sans remplissage répétitif',()=>{
 it('ne propose les petits nombres qu’aux 5–7 ans, jamais aux grands',()=>{
  expect(isMathWorkshopAvailable('math-addition','5-7')).toBe(true);
  for(const age of ['8-10','11-12',undefined]as const)expect(isMathWorkshopAvailable('math-addition',age)).toBe(false);
  expect(isMathWorkshopAvailable('car-solar-city','11-12')).toBe(true);
 });
 it('retire les quatre prototypes de tous les parcours enfant',()=>{
  for(const age of ['5-7','8-10','11-12']as const)for(const kind of ['fractions','area','symmetry','ratio'])expect(isMathWorkshopAvailable(`math-${kind}`,age)).toBe(false);
  expect(isMathWorkshopAvailable('math-fractions','11-12',true)).toBe(true);
 });
 it('propose un problème entier au primaire et un choix de masse avec décimaux au collège',()=>{
  expect(isMathWorkshopAvailable('math-groups','5-7')).toBe(false);
  const junior=craneChallenge('8-10'),senior=craneChallenge('11-12');
  expect(junior.masses).toEqual([3]);expect(junior.distances.every(Number.isInteger)).toBe(true);
  expect(craneBalanced(junior,3,2)).toBe(true);expect(craneTilt(junior,3,1)).toBeGreaterThan(0);expect(craneTilt(junior,3,4)).toBeLessThan(0);
  const solutions=senior.masses.flatMap(mass=>senior.distances.filter(distance=>craneBalanced(senior,mass,distance)).map(distance=>[mass,distance]));
  expect(solutions).toEqual([[5,1.5]]);expect(craneBalanced(senior,3,2.5)).toBe(false);
 });
 it('remplace les vingt points par dix pièces structurelles et fait réellement pencher puis lever la charge',()=>{
  const bp=createCraneBlueprint(VehicleCategory.MATHS);expect(bp.parts).toHaveLength(10);expect(bp.parts.some(part=>part.id.startsWith('token-'))).toBe(false);
  const entries=new Map(bp.parts.map(spec=>{const group=new THREE.Group();group.position.fromArray(spec.targetPos);return[spec.id,{spec,group}];}));
  const challenge=craneChallenge('8-10'),scene=createCraneBalanceScene(()=>entries,challenge);
  scene.apply(3,1);expect(entries.get('cross-beam')!.group.rotation.z).toBeGreaterThan(0);
  scene.apply(3,2);expect(entries.get('cross-beam')!.group.rotation.z).toBe(0);
  const y=entries.get('load')!.group.position.y;scene.apply(3,2,0,.4);expect(entries.get('load')!.group.position.y).toBeCloseTo(y+.4);
  scene.dispose();expect(entries.get('load')!.group.position.toArray()).toEqual(entries.get('load')!.spec.targetPos);
 });
});
