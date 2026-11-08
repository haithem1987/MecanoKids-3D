import {DifficultyTier,PartShapeKind as Shape,type VehicleCategory,type VehicleBlueprint,type PartSpec} from '../types/game';
import {MATH_TEXT,type MathTextKey} from '../i18n/mathText';
import {MATH_ACTIVITY_KINDS,type MathActivityKind} from './mathActivities';
type Vec=[number,number,number];
const blue='#38bdf8',gold='#fbbf24',slate='#64748b';
export const MATH_LEVEL_KEYS:Record<MathActivityKind,MathTextKey>={addition:'levelAddition',groups:'levelGroups',fractions:'levelFractions',area:'levelArea',symmetry:'levelSymmetry',ratio:'levelRatio'};
function part(id:string,label:MathTextKey,shape:Shape,scale:Vec,targetPos:Vec,color:string,dependsOn:string[]):PartSpec{
 const name=MATH_TEXT[label],hint=MATH_TEXT.place;
 return{id,name:name[0],nameEn:name[1],nameAr:name[2],roleHint:hint[0],roleHintEn:hint[1],roleHintAr:hint[2],shape,scale,targetPos,primaryColor:color,secondaryColor:slate,materialKind:'body',dependsOn,explodeOffset:[targetPos[0]*.4,.8,targetPos[2]*.4],snapRadius:.76};
}
export function mathTokenPosition(kind:MathActivityKind,index:number):Vec{
 if(kind==='addition')return[index<5?-1.4+(index%5)*.3:.2+(index%5)*.3,.275,.65];
 if(kind==='groups')return[(index%5-2)*.4,.275,(Math.floor(index/5)-1.5)*.4];
 if(kind==='fractions')return[(index-3.5)*.3,.20,-.3];
 if(kind==='area')return[(index%4-1.5)*.4,.24,(Math.floor(index/4)-1.5)*.4];
 if(kind==='symmetry'){const right=index>=9,i=index%9;return[(right ? .85 : -1.45)+(i%3)*.3,.24,(Math.floor(i/3)-1)*.4];}
 if(index<6)return[-1+(index%2)*.32,.275,(Math.floor(index/2)-1)*.4];
 return[.38+((index-6)%3)*.32,.275,(Math.floor((index-6)/3)-1)*.4];
}
export const MATH_TOKEN_COUNTS:Record<MathActivityKind,number>={addition:10,groups:20,fractions:8,area:16,symmetry:18,ratio:15};
export function createMathBlueprints(category:VehicleCategory):VehicleBlueprint[]{
 return MATH_ACTIVITY_KINDS.map(kind=>{
  const title=MATH_TEXT[`${kind}Title`],goal=MATH_TEXT[`${kind}Goal`],why=MATH_TEXT[`${kind}Why`],level=MATH_TEXT[MATH_LEVEL_KEYS[kind]],note=MATH_TEXT.ageNote;
  const parts=[part('base','base',Shape.APPARATUS_BASE,[3.5,.16,2.5],[0,.08,0],'#334155',[])];
  for(let i=0;i<MATH_TOKEN_COUNTS[kind];i++){
   const flat=kind==='fractions'||kind==='area'||kind==='symmetry',size:Vec=kind==='fractions'?[.285,.08,.5]:flat?[.28,.16,.28]:[.23,.23,.23];
   parts.push(part(`token-${i}`,'token',flat||kind==='addition'?Shape.APPARATUS_BASE:kind==='groups'?Shape.PENDULUM_BOB:Shape.LAB_CYLINDER,size,mathTokenPosition(kind,i),kind==='ratio'?i<6?blue:gold:kind==='addition'?i<5?blue:gold:blue,['base']));
  }
  if(kind==='symmetry')parts.push(part('axis','axis',Shape.APPARATUS_BASE,[.035,.06,1.5],[0,.22,0],gold,['base']));
  else parts.push(part('reference','reference',Shape.APPARATUS_BASE,[2.7,.035,.04],[0,.20,.96],gold,['base']));
  const discovery=([0,1,2]as const).map(i=>({howItWorks:why[i],realRecord:goal[i],didYouKnow:note[i]}));
  return{id:`math-${kind}`,stageNumber:0,category,tier:DifficultyTier.DISCOVERY,name:title[0],nameEn:title[1],nameAr:title[2],subtitle:goal[0],subtitleEn:goal[1],subtitleAr:goal[2],tierLabel:level[0],tierLabelEn:level[1],tierLabelAr:level[2],ageNote:note[0],ageNoteEn:note[1],ageNoteAr:note[2],staticStructure:true,discoveryMode:'observation',discovery:discovery[0],discoveryEn:discovery[1],discoveryAr:discovery[2],parts};
 });
}
