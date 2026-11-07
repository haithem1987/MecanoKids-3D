import {describe,expect,it} from 'vitest';
import {Vector3} from 'three';
import {HERITAGE_BLUEPRINTS,WATERWHEEL_PIVOT} from '../data/heritageBlueprints';
import {getAxialRotationPose} from './axialRotation';
const wheel=HERITAGE_BLUEPRINTS.find(b=>b.id==='expansion-watermill')!.parts.filter(p=>p.animationSpeed!==undefined);
describe('rotation rigide des éléments de la roue à eau',()=>{
 it('conserve le pivot et les distances entre toutes les pièces à tous les angles',()=>{
  expect(wheel).toHaveLength(25);
  const pivot=new Vector3(...WATERWHEEL_PIVOT);
  for(const angle of [0,.4,Math.PI/2,Math.PI,2*Math.PI]){
   for(const piece of wheel){const pose=getAxialRotationPose(piece,angle);expect(pose.position.distanceTo(pivot)).toBeCloseTo(new Vector3(...piece.targetPos).distanceTo(pivot));}
   for(let i=1;i<wheel.length;i++){
    const a=wheel[i-1],b=wheel[i];expect(getAxialRotationPose(a,angle).position.distanceTo(getAxialRotationPose(b,angle).position)).toBeCloseTo(new Vector3(...a.targetPos).distanceTo(new Vector3(...b.targetPos)));
   }
  }
 });
 it('retrouve exactement les positions et orientations du montage après un tour',()=>{
  for(const piece of wheel){const before=getAxialRotationPose(piece,0),after=getAxialRotationPose(piece,2*Math.PI);expect(before.position.distanceTo(after.position)).toBeLessThan(1e-10);expect(Math.abs(before.quaternion.dot(after.quaternion))).toBeCloseTo(1);}
 });
});
