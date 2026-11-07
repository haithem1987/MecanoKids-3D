import {describe,it,expect} from 'vitest';
import {getConstructionPlayKind,getGantryPose,getPlayRoute} from './constructionPlay';
describe('missions après construction',()=>{
 it('réserve les missions aux structures compatibles',()=>{expect(getConstructionPlayKind('expansion-gantry')).toBe('gantry');expect(getConstructionPlayKind('chem-water-molecule')).toBeUndefined();});
 it('lève avant de transporter puis dépose sur le même plan',()=>{const initial=getGantryPose(0),lift=getGantryPose(1),move=getGantryPose(2),drop=getGantryPose(3);expect(lift.y).toBeGreaterThan(initial.y);expect(lift.x).toBe(0);expect(move.y).toBe(lift.y);expect(drop.x).toBe(move.x);expect(drop.y).toBe(initial.y);for(const step of [0,1,2,3]){const p=getGantryPose(step);expect(p.cableY+p.cableLength/2).toBeCloseTo(2.4);expect(p.cableY-p.cableLength/2).toBeCloseTo(p.y+.21);}});
 it('fait passer le visiteur au centre de la porte, sous le linteau',()=>{for(const id of ['expansion-castle','expansion-keep']){const route=getPlayRoute('castle',id,true);expect(route.start[0]).toBe(0);expect(route.end[0]).toBe(0);expect(route.end[2]).toBeLessThan(route.start[2]);expect(route.end[1]+.4).toBeLessThan(1.0);}});
 it('garde le trajet du temple entre les deux rangées de colonnes',()=>{const route=getPlayRoute('temple','expansion-temple',true);expect(route.start[0]).toBe(0);expect(route.end[0]).toBe(0);expect(route.end[2]).toBeLessThan(-1);expect(getPlayRoute('temple','expansion-temple',false).end[0]).toBe(.95);});
 it('fait traverser le véhicule au centre des garde-corps',()=>{const route=getPlayRoute('truss','expansion-truss',true);expect(route.start[0]).toBeLessThan(-2);expect(route.end[0]).toBeGreaterThan(2);expect(route.start[2]).toBe(0);expect(route.end[2]).toBe(0);});
});
