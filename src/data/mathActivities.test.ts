import {describe,expect,it} from 'vitest';
import {MATH_ACTIVITY_KINDS,getMathActivityKind,mathControls,mathReferenceMask,mathSolution,mathStart,mathSuccess,mathTap,reflectMathMask} from './mathActivities';
import {createMathBlueprints} from './mathBlueprints';
import {VehicleCategory} from '../types/game';
describe('mathématiques manipulables',()=>{
 it('prépare six assemblages réels sans chevauchement entre les éléments à compter',()=>{
  const blueprints=createMathBlueprints(VehicleCategory.PHYSICS);
  expect(blueprints).toHaveLength(6);
  for(const bp of blueprints){
   expect(getMathActivityKind(bp.id)).toBeDefined();expect(bp.parts.length).toBeGreaterThanOrEqual(10);
   const placed=new Set<string>();for(const part of bp.parts){expect(part.dependsOn.every(id=>placed.has(id))).toBe(true);placed.add(part.id);expect(part.scale.every(value=>value>0&&Number.isFinite(value))).toBe(true);}
   const tokens=bp.parts.filter(part=>part.id.startsWith('token-'));
   for(const a of tokens)for(const b of tokens)if(a!==b){const overlaps=a.targetPos.every((value,index)=>Math.abs(value-b.targetPos[index])<(a.scale[index]+b.scale[index])/2-.001);expect(overlaps,`${bp.id}:${a.id}/${b.id}`).toBe(false);}
  }
 });
 it('propose dix-huit défis résolubles par les mêmes commandes accessibles',()=>{
  for(const kind of MATH_ACTIVITY_KINDS)for(let level=0;level<3;level++){
   const solution=mathSolution(kind,level);expect(mathSuccess(kind,solution,level),`${kind}:${level}`).toBe(true);
   for(const [index,control]of mathControls(kind,level).entries())expect(control.options.some(option=>option.value===solution[index]),`${kind}:${level}:${control.id}`).toBe(true);
   expect(mathSuccess(kind,mathStart(kind),level)).toBe(false);
  }
 });
 it('accepte les décompositions additives, groupes commutés et fractions équivalentes',()=>{
  expect(mathSuccess('addition',[3,2],0)).toBe(true);expect(mathSuccess('addition',[0,5],0)).toBe(true);expect(mathSuccess('addition',[-1,6],0)).toBe(false);
  expect(mathSuccess('groups',[4,3],1)).toBe(true);expect(mathSuccess('fractions',[4,8],0)).toBe(true);expect(mathSuccess('fractions',[6,8],1)).toBe(true);
  expect(mathSuccess('area',[2,3],0)).toBe(true);expect(mathSuccess('ratio',[3,2],0)).toBe(false);
 });
 it('atteint chaque objectif par la manipulation directe des objets du plateau',()=>{
  for(const kind of MATH_ACTIVITY_KINDS)for(let level=0;level<3;level++){
   let state=mathStart(kind);const solution=mathSolution(kind,level);
   if(kind==='addition'||kind==='ratio'){for(let i=0;i<solution[0];i++)state=mathTap(kind,0,state);for(let i=0;i<solution[1];i++)state=mathTap(kind,kind==='addition'?5:6,state);}
   else if(kind==='groups')state=mathTap(kind,(solution[0]-1)*5+solution[1]-1,state);
   else if(kind==='area')state=mathTap(kind,(solution[1]-1)*4+solution[0]-1,state);
   else if(kind==='fractions')state=mathTap(kind,solution[0]-1,state);
   else for(let i=0;i<9;i++)if(solution[0]&(1<<i))state=mathTap(kind,i,state);
   expect(mathSuccess(kind,state,level),`${kind}:${level}`).toBe(true);
  }
 });
 it('distingue une vraie réflexion d’une translation ou d’une rotation',()=>{
  for(let level=0;level<3;level++){
   const mask=mathReferenceMask(level),options=mathControls('symmetry',level)[0].options;
   expect(new Set(options.map(option=>option.value)).size).toBe(4);
   expect(reflectMathMask(reflectMathMask(mask))).toBe(mask);
   expect(mathSuccess('symmetry',[mask],level)).toBe(false);
  }
 });
});
