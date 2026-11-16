import {DifficultyTier,PartShapeKind as Shape,type VehicleCategory,type VehicleBlueprint,type PartSpec} from '../types/game';
import {MATH_TEXT,type MathTextKey} from '../i18n/mathText';
import {MATH_ACTIVITY_KINDS,type MathActivityKind} from './mathActivities';
import {createCraneBlueprint} from './craneBlueprint';
type Vec=[number,number,number];
const blue='#38bdf8',gold='#fbbf24',slate='#64748b';
export const MATH_LEVEL_KEYS:Record<MathActivityKind,MathTextKey>={addition:'levelAddition',groups:'levelGroups',fractions:'levelFractions',area:'levelArea',symmetry:'levelSymmetry',ratio:'levelRatio'};
function part(id:string,label:MathTextKey,shape:Shape,scale:Vec,targetPos:Vec,color:string,dependsOn:string[]):PartSpec{
 const hintKey:MathTextKey=label==='post'?'postHint':label==='beam'?'beamHint':label==='plank'?'plankHint':label==='bolt'?'boltHint':label==='tile'?'tileHint':label==='brace'?'braceHint':label==='gearSmall'||label==='gearLarge'?'gearHint':label==='cable'?'cableHint':label==='load'?'loadHint':label==='winch'?'winchHint':label==='reference'?'referenceHint':'place';
 const name=MATH_TEXT[label],hint=MATH_TEXT[hintKey];
 return{id,name:name[0],nameEn:name[1],nameAr:name[2],roleHint:hint[0],roleHintEn:hint[1],roleHintAr:hint[2],shape,scale,targetPos,primaryColor:color,secondaryColor:slate,materialKind:'body',dependsOn,explodeOffset:[targetPos[0]*.4,.8,targetPos[2]*.4],snapRadius:.76};
}
export function mathTokenPosition(kind:MathActivityKind,index:number):Vec{
 if(kind==='addition')return[-1.4+(index+.5)*.28,.70,0];
 if(kind==='fractions')return[-1.4+(index%4)*.43,.205,.85+Math.floor(index/4)*.45];
 if(kind==='groups')return[-1.45+(index%5)*.29,.22,.65+Math.floor(index/5)*.21];
 if(kind==='area')return[(index%4-1.5)*.32,.48,(Math.floor(index/4)-1.5)*.32];
 if(kind==='symmetry'){const right=index>=9,i=index%9;return[(right?.85:-1.45)+(i%3)*.3,.46+Math.floor(i/3)*.32,-.25];}
 const small=index>=6,i=small?index-6:index;return[(small?-.55:.20)+(i%3)*.11,1.08-Math.floor(i/3)*.12,.23];
}
export const MATH_TOKEN_COUNTS:Record<MathActivityKind,number>={addition:5,groups:20,fractions:8,area:16,symmetry:18,ratio:15};
export function createMathBlueprints(category:VehicleCategory):VehicleBlueprint[]{
 return MATH_ACTIVITY_KINDS.map(kind=>{
  if(kind==='groups')return createCraneBlueprint(category);
  const title=MATH_TEXT[`${kind}Title`],goal=MATH_TEXT[`${kind}Goal`],why=MATH_TEXT[`${kind}Why`],level=MATH_TEXT[MATH_LEVEL_KEYS[kind]],note=kind==='addition'?MATH_TEXT.bridgeAge:MATH_TEXT.ageNote;
  const parts=[part('base','base',Shape.APPARATUS_BASE,[3.8,.16,3],[0,.08,0],'#334155',[])];
  const add=(id:string,label:MathTextKey,size:Vec,pos:Vec,color=slate,deps=['base'],shape=Shape.APPARATUS_BASE)=>parts.push(part(id,label,shape,size,pos,color,deps));
  if(kind==='addition'||kind==='fractions'){
   add('left-foot','post',[.3,.48,.8],[-1.7,.40,0]);add('right-foot','post',[.3,.48,.8],[1.4,.40,0]);
   add('left-pad','beam',[.42,.10,.8],[-1.7,.69,0],gold,['left-foot']);add('right-pad','beam',[.42,.10,.8],[1.4,.69,0],gold,['right-foot']);
   if(kind==='addition'){parts.find(p=>p.id==='left-foot')!.targetPos[0]=-1.57;parts.find(p=>p.id==='left-pad')!.targetPos[0]=-1.57;parts.find(p=>p.id==='right-foot')!.targetPos[0]=.17;parts.find(p=>p.id==='right-pad')!.targetPos[0]=.17;}
   if(kind==='fractions'){
    for(const x of [-1.6,0])add(`ruler-post-${x}`,'post',[.035,.96,.035],[x,.64,-.75]);
    add('reference','reference',[1.6,.035,.06],[-.8,1.12,-.75],gold,['ruler-post--1.6','ruler-post-0']);
   }
  }else{
   for(const side of [-1,1])add(`post-${side}`,'post',[.16,1.6,.30],[side*1.6,.96,-.25]);
   add('cross-beam','beam',[3.36,.16,.35],[0,1.84,-.25],gold,['post--1','post-1']);
   if(kind==='area'){
    const x=0;
    add('winch','winch',[.26,.16,.26],[x,1.73,-.25],'#2563eb',['cross-beam'],Shape.LAB_CYLINDER);
    parts.at(-1)!.targetRot=[Math.PI/2,0,0];
    add('cable','cable',[.035,kind==='area'?.73:1.09,.035],[x,kind==='area'?1.285:1.105,-.25],'#334155',['winch']);
    add('load','load',[.38,.34,.38],[x,kind==='area'?.75:.39,-.25],'#b77930',['cable']);
   }
   if(kind==='symmetry'){
    add('axis','axis',[.025,1.4,.025],[0,1.03,-.25],gold,['cross-beam']);
    for(const side of [-1,1]){for(let i=0;i<4;i++)add(`grid-post-${side}-${i}`,'post',[.045,.96,.12],[side*.7+side*i*.3,.78,-.25]);for(let i=0;i<4;i++)add(`grid-beam-${side}-${i}`,'beam',[.98,.045,.12],[side*1.15,.30+i*.32,-.25]);}
   }

   if(kind==='ratio'){
    for(const [id,x,diameter,teeth] of [['drive-wheel',-.55,.6,12],['driven-wheel',.20,.9,18]] as const){
     add(id==='drive-wheel'?'drive-axle':'driven-axle','axle',[.08,.50,.08],[x,1.35,-.15],slate,['cross-beam'],Shape.LAB_CYLINDER);
     parts.at(-1)!.targetRot=[Math.PI/2,0,0];
     add(id,id==='drive-wheel'?'gearSmall':'gearLarge',[diameter,.10,diameter],[x,1.35,.10],id==='drive-wheel'?blue:gold,[id==='drive-wheel'?'drive-axle':'driven-axle'],Shape.LAB_CYLINDER);
     parts.at(-1)!.targetRot=[Math.PI/2,0,0];parts.at(-1)!.mathGearTeeth=teeth;
    }
    add('cable','cable',[.025,.9,.025],[.22,.80,.235],'#334155',['driven-wheel']);add('load','load',[.30,.28,.30],[.22,.30,.235],'#b77930',['cable']);
   }
  }
  for(let i=0;i<MATH_TOKEN_COUNTS[kind];i++){
   const size:Vec=kind==='fractions'?[.4,.09,.38]:kind==='addition'?[.28,.09,.38]:kind==='symmetry'?[.07,.45,.07]:kind==='area'?[.315,.10,.315]:[.055,.055,.055];
   const label:MathTextKey=kind==='addition'||kind==='fractions'?'plank':kind==='area'?'tile':kind==='symmetry'?'brace':'reference';
   const deps=kind==='addition'?i?['left-pad','right-pad',`token-${i-1}`]:['left-pad','right-pad']:kind==='fractions'?['left-pad','right-pad']:kind==='ratio'?['drive-wheel','driven-wheel']:kind==='symmetry'?parts.filter(p=>p.id.startsWith('grid-beam-')).map(p=>p.id):['cross-beam'];
   parts.push(part(`token-${i}`,label,Shape.APPARATUS_BASE,size,mathTokenPosition(kind,i),kind==='ratio'?i<6?gold:blue:kind==='addition'?i<2?blue:gold:blue,deps));
   if(kind==='symmetry')parts.at(-1)!.targetRot=[0,0,i<9?Math.PI/4:-Math.PI/4];
  }
  const discovery=([0,1,2]as const).map(i=>({howItWorks:why[i],realRecord:goal[i],didYouKnow:note[i]}));
  return{id:`math-${kind}`,stageNumber:0,category,tier:DifficultyTier.DISCOVERY,name:title[0],nameEn:title[1],nameAr:title[2],subtitle:goal[0],subtitleEn:goal[1],subtitleAr:goal[2],tierLabel:level[0],tierLabelEn:level[1],tierLabelAr:level[2],ageNote:note[0],ageNoteEn:note[1],ageNoteAr:note[2],staticStructure:true,discoveryMode:'observation',discovery:discovery[0],discoveryEn:discovery[1],discoveryAr:discovery[2],parts};
 });
}
