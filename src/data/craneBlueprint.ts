import {DifficultyTier,PartShapeKind,type VehicleBlueprint,type VehicleCategory,type PartSpec} from '../types/game';
import {MATH_TEXT,type MathTextKey} from '../i18n/mathText';
export function createCraneBlueprint(category:VehicleCategory):VehicleBlueprint{
 const parts:PartSpec[]=[];
 const add=(id:string,label:MathTextKey,scale:[number,number,number],pos:[number,number,number],deps:string[],color='#64748b')=>{const text=MATH_TEXT[label];parts.push({id,name:text[0],nameEn:text[1],nameAr:text[2],roleHint:text[0],roleHintEn:text[1],roleHintAr:text[2],shape:PartShapeKind.APPARATUS_BASE,scale,targetPos:pos,primaryColor:color,secondaryColor:'#334155',materialKind:'body',dependsOn:deps,explodeOffset:[pos[0]*.3,.8,0],snapRadius:.7});};
 add('base','base',[3.8,.16,2.4],[0,.08,0],[]);
 add('tower','craneTower',[.25,1.3,.3],[0,.81,0],['base']);
 add('foot-a','craneBrace',[.10,1.04,.16],[-.225,.63,0],['tower']);parts.at(-1)!.targetRot=[0,0,-Math.atan(.45/.94)];
 add('foot-b','craneBrace',[.10,1.04,.16],[.225,.63,0],['tower']);parts.at(-1)!.targetRot=[0,0,Math.atan(.45/.94)];
 add('hinge','cranePivot',[.32,.18,.45],[0,1.50,0],['tower']);
 add('cross-beam','craneBeam',[3.25,.12,.22],[0,1.62,0],['hinge'],'#fbbf24');
 add('cable','cable',[.025,.5,.025],[-.96,1.31,0],['cross-beam']);
 add('load','craneLoad',[.34,.30,.34],[-.96,.91,0],['cable'],'#38bdf8');
 add('counter-cable','cable',[.025,.5,.025],[.32,1.31,0],['cross-beam']);
 add('counterweight','craneCounterweight',[.34,.30,.34],[.32,.91,0],['counter-cable'],'#fb923c');
 const title=MATH_TEXT.groupsTitle,goal=MATH_TEXT.groupsGoal,why=MATH_TEXT.groupsWhy,note=MATH_TEXT.craneAge;
 const discovery=([0,1,2]as const).map(i=>({howItWorks:why[i],realRecord:goal[i],didYouKnow:note[i]}));
 return{id:'math-groups',stageNumber:0,category,tier:DifficultyTier.DISCOVERY,name:title[0],nameEn:title[1],nameAr:title[2],subtitle:goal[0],subtitleEn:goal[1],subtitleAr:goal[2],tierLabel:note[0],tierLabelEn:note[1],tierLabelAr:note[2],ageNote:note[0],ageNoteEn:note[1],ageNoteAr:note[2],staticStructure:true,discoveryMode:'observation',discovery:discovery[0],discoveryEn:discovery[1],discoveryAr:discovery[2],parts};
}
