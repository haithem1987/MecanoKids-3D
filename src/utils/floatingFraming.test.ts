import {describe,it,expect} from 'vitest';
import {getFloatingFrame} from './floatingFraming';
describe('zone de pose entre les palettes flottantes',()=>{
 it('place la cible hors des pièces et des vues caméra sur téléphone',()=>{
  const frame=getFloatingFrame(430,834,84,124),target=430/2-frame.offset;expect(target).toBe(195);expect(target).toBeGreaterThan(84);expect(target).toBeLessThan(430-124);expect(frame.aspect).toBeCloseTo(222/834);
 });
 it('inverse le décalage quand la palette change de côté, sans changer le zoom',()=>{
  const first=getFloatingFrame(430,834,84,124),other=getFloatingFrame(430,834,124,84);expect(first.aspect).toBe(other.aspect);expect(first.offset).toBe(-other.offset);
 });
});
