import {PerspectiveCamera,Vector3} from 'three';
import {describe,it,expect} from 'vitest';
import {getFittedCameraPosition,getViewportCameraScale} from './cameraFraming';
describe('cadrage de l’établi dans les zones réservées',()=>{
 it('conserve la largeur visible quand le canvas devient vertical',()=>{
  for(const aspect of [.3,.5,.75,1])expect(getViewportCameraScale(aspect)*aspect).toBeCloseTo(1);
 });
 it('garde la direction et la cible du préréglage',()=>{
  expect(getFittedCameraPosition([4,3,5],[0,1,0],.5)).toEqual([8,5,10]);
  expect(getFittedCameraPosition([4,3,5],[0,1,0],1.5)).toEqual([4,3,5]);
 });
 it('borne le recul lors des redimensionnements transitoires',()=>{
  for(const aspect of [0,-1,Infinity,NaN,.001])expect(getViewportCameraScale(aspect)).toBeGreaterThanOrEqual(1);
  expect(getViewportCameraScale(.001)).toBe(4);
 });
 it('garde les coins du grand château dans le cadre sur les canvas verticaux',()=>{
  for(const aspect of [.4,.6,1]){
    const camera=new PerspectiveCamera(44,aspect,.1,100);camera.position.fromArray(getFittedCameraPosition([4.4,3.2,4.9],[0,.9,0],aspect));camera.lookAt(0,.9,0);camera.updateMatrixWorld(true);
    for(const x of [-1.75,1.75])for(const y of [.06,1.60])for(const z of [-1.75,1.75]){
      const screen=new Vector3(x,y,z).project(camera);expect(Math.abs(screen.x)).toBeLessThan(1);expect(Math.abs(screen.y)).toBeLessThan(1);
    }
  }
 });

});
