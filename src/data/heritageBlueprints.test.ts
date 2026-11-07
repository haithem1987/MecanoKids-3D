import { describe, expect, it } from 'vitest';
import { Vector3, Euler } from 'three';
import { HERITAGE_BLUEPRINTS } from './heritageBlueprints';
const get = (model: string, id: string) => {
  const p = HERITAGE_BLUEPRINTS.find(b=>b.id===`expansion-${model}`)?.parts.find(p=>p.id===id);
  if(!p) throw Error(`${model}/${id}`);
  return p;
};
const top = (model:string,id:string) => {const p=get(model,id); return p.targetPos[1]+p.scale[1]/2;};
const bottom = (model:string,id:string) => {const p=get(model,id); return p.targetPos[1]-p.scale[1]/2;};
describe('raccords des ateliers avancés et historiques',()=>{
  it('laisse une porte praticable sous le linteau du château',()=>{
    expect(bottom('castle','gate-lintel')).toBeCloseTo(1);
    for(const side of [-1,1]) expect(top('castle',`jamb-${side}-1`)).toBeCloseTo(bottom('castle','gate-lintel'));
    const wall=get('castle','jamb-1-0'); expect(wall.targetPos[0]-wall.scale[0]/2).toBeGreaterThan(.3);
    for(const x of [-1.35,1.35]) for(const z of [-1.35,1.35]) for(let level=1;level<3;level++)
      expect(bottom('castle',`tower-${x}-${z}-${level}`)).toBeCloseTo(top('castle',`tower-${x}-${z}-${level-1}`));
  });
  it('raccorde toutes les perches de la yourte aux montants et à la couronne',()=>{
    for(let i=0;i<12;i++){
      const r=get('yurt',`rafter-${i}`), post=get('yurt',`post-${i}`);
      const end=(sign:number)=>new Vector3(0,sign*r.scale[1]/2,0).applyEuler(new Euler(...(r.targetRot??[0,0,0]))).add(new Vector3(...r.targetPos));
      expect(end(-1).distanceTo(new Vector3(post.targetPos[0],top('yurt',post.id),post.targetPos[2]))).toBeLessThan(.001);
      const upper=end(1);expect(upper.y).toBeCloseTo(1.73);expect(Math.hypot(upper.x,upper.z)).toBeCloseTo(.2);
    }
  });
  it('relie sans vide le treuil, le câble et la charge du portique',()=>{
    expect(top('gantry','cable')).toBeCloseTo(get('gantry','winch').targetPos[1]);
    expect(bottom('gantry','cable')).toBeCloseTo(top('gantry','load'));
    for(const side of [-1,1]) for(const lane of [-1,1]) for(let level=1;level<3;level++)
      expect(bottom('gantry',`post-${side}-${lane}-${level}`)).toBeCloseTo(top('gantry',`post-${side}-${lane}-${level-1}`));
  });
  it('empile les tambours et transmet le poids du toit aux chapiteaux',()=>{
    for(const side of [-1,1]) for(let row=0;row<4;row++){
      expect(bottom('temple',`drum-${side}-${row}-0`)).toBeCloseTo(top('temple','plinth-2'));
      for(let level=1;level<4;level++) expect(bottom('temple',`drum-${side}-${row}-${level}`)).toBeCloseTo(top('temple',`drum-${side}-${row}-${level-1}`));
      expect(bottom('temple',`capital-${side}-${row}`)).toBeCloseTo(top('temple',`drum-${side}-${row}-3`));
      expect(bottom('temple',`long-beam-${side}`)).toBeCloseTo(top('temple',`capital-${side}-${row}`));
    }
  });
  it('raccorde les diagonales inclinées aux deux niveaux du treillis',()=>{
    for(const lane of [-1,1])for(let i=0;i<3;i++){
      const d=get('truss',`truss-diagonal-${lane}-${i}`);
      for(const sign of [-1,1]){
        const v=new Vector3(0,sign*d.scale[1]/2,0).applyEuler(new Euler(...(d.targetRot??[0,0,0]))).add(new Vector3(...d.targetPos));
        expect([1.17,1.77].some(y=>Math.abs(v.y-y)<.001)).toBe(true);
        expect([-1.8,-.6,.6,1.8].some(x=>Math.abs(v.x-x)<.001)).toBe(true);
      }
    }
  });

  it('raccorde les extrémités des quinze fils de la tour solaire à leurs composants',()=>{
    const model=HERITAGE_BLUEPRINTS.find(b=>b.id==='expansion-beacon')!;
    const wires=model.parts.filter(p=>p.electrical);expect(wires).toHaveLength(15);
    for(const wire of wires)for(const [index,sign] of [-1,1].entries()){
      const endpoint=new Vector3(sign*wire.scale[2]/2,0,0).applyEuler(new Euler(...(wire.targetRot??[0,0,0]))).add(new Vector3(...wire.targetPos));
      const target=model.parts.find(p=>p.id===wire.electrical![index])!;
      for(const axis of [0,1,2])expect(Math.abs(endpoint.getComponent(axis)-target.targetPos[axis]),`${wire.id}/${target.id}/${axis}`).toBeLessThanOrEqual(target.scale[axis]/2+.001);
    }
  });

  it('fait rejoindre chaque barre du dôme aux deux nœuds correspondants',()=>{
    const model=HERITAGE_BLUEPRINTS.find(b=>b.id==='expansion-dome')!;
    const struts=model.parts.filter(p=>p.structuralJoints);expect(model.parts).toHaveLength(58);expect(struts).toHaveLength(40);
    for(const rod of struts)for(const [index,sign] of [-1,1].entries()){
      const endpoint=new Vector3(0,sign*rod.scale[1]/2,0).applyEuler(new Euler(...(rod.targetRot??[0,0,0]))).add(new Vector3(...rod.targetPos));
      const joint=model.parts.find(p=>p.id===rod.structuralJoints![index])!;
      expect(endpoint.distanceTo(new Vector3(...joint.targetPos)),`${rod.id}/${joint.id}`).toBeLessThan(.00001);
    }
  });

});
