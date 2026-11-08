import {PartShapeKind,type PartSpec,type VehicleBlueprint} from '../types/game';
import {RAIL_WORKSHOP_TEXT,RAIL_MAGLEV_TEXT} from '../i18n/translations';
type V=[number,number,number];
export const RAIL_BLUEPRINT_IDS=['train-steam-loco','car-heritage-steam-loco','car-tgv-express','car-metro-tramway','car-maglev-shinkansen'] as const;
export const isRailBlueprint=(id:string):boolean=>RAIL_BLUEPRINT_IDS.some(candidate=>candidate===id);
export const isMaglevBlueprint=(id:string)=>id==='car-maglev-shinkansen';
type Label=Exclude<keyof typeof RAIL_WORKSHOP_TEXT,'age'|'tier'>|'magneticShoe';
const box=PartShapeKind.APPARATUS_BASE,steel='#64748b';
function part(id:string,label:Label,scale:V,targetPos:V,dependsOn:string[]=[],color=steel,shape=box):PartSpec{
 const text=label==='magneticShoe'?RAIL_MAGLEV_TEXT.shoe:RAIL_WORKSHOP_TEXT[label];return{id,name:text.name[0],nameEn:text.name[1],nameAr:text.name[2],roleHint:text.hint[0],roleHintEn:text.hint[1],roleHintAr:text.hint[2],shape,primaryColor:color,secondaryColor:'#cbd5e1',materialKind:'body',scale,targetPos,dependsOn,explodeOffset:[targetPos[0]*.3,.55,targetPos[2]*.18],snapRadius:.8};
}
function wheelset(id:string,z:number,diameter:number,dependsOn:string,color:string):PartSpec{return{...part(id,'axle',[1.06,diameter,.08],[0,.1575+diameter/2,z],[dependsOn],color,PartShapeKind.WHEEL_AXLE),railWheelset:true};}
function steam(primary:string):PartSpec[]{
 const p=[part('rail-frame','frame',[.96,.14,3.04],[0,.60,.40],[],steel)];
 for(const[index,z]of[-.20,.35,.90].entries())p.push(wheelset(`rail-driver-${index}`,z,.44,'rail-frame',primary));
 for(const[index,z]of[1.35,1.66].entries())p.push(wheelset(`rail-pilot-${index}`,z,.26,'rail-frame',steel));
 p.push(wheelset('rail-trailing',-.83,.28,'rail-frame',steel));
 p.push(part('rail-boiler','boiler',[.72,.72,1.85],[0,.94,.55],['rail-frame'],primary,PartShapeKind.TRAIN_BOILER));
 p.push(part('rail-cab','cab',[.94,.76,.72],[0,1.05,-.66],['rail-frame'],primary));
 p.push(part('rail-cab-roof','roof',[1.08,.10,.90],[0,1.48,-.66],['rail-cab'],'#1e293b'));
 for(const side of [-1,1])p.push(part(`rail-window-${side}`,'window',[.025,.28,.39],[side*.483,1.21,-.66],['rail-cab'],'#7dd3fc'));
 p.push(part('rail-chimney','chimney',[.23,.48,.23],[0,1.51,1.06],['rail-boiler'],'#1e293b',PartShapeKind.LAB_CYLINDER));
 p.push(part('rail-tender-frame','frame',[.96,.14,.90],[0,.4875,-1.61],['rail-frame'],steel));
 for(const[index,z]of[-1.80,-1.42].entries())p.push(wheelset(`rail-tender-axle-${index}`,z,.26,'rail-tender-frame',steel));
 p.push(part('rail-tender','tender',[.86,.40,.80],[0,.7575,-1.61],['rail-tender-frame'],primary));
 p.push(part('rail-coal','coal',[.72,.12,.65],[0,1.0175,-1.61],['rail-tender'],'#27272a'));
 p.push(part('rail-coupling','coupling',[.12,.09,.20],[0,.52,-1.105],['rail-frame','rail-tender-frame'],'#334155'));
 for(const side of [-1,1]){
  const rod=part(`rail-rod-${side}`,'rod',[.055,.055,1.10],[side*.605,.3775-.0792,.35],['rail-driver-0','rail-driver-1','rail-driver-2'],'#cbd5e1');rod.structuralJoints=['rail-driver-0','rail-driver-2'];p.push(rod);
  p.push(part(`rail-piston-${side}`,'piston',[.20,.20,.31],[side*.40,.50,1.28],['rail-frame','rail-pilot-0'],steel,PartShapeKind.LAB_CYLINDER));p.at(-1)!.targetRot=[Math.PI/2,0,0];
 }
 return p;
}
function modern(primary:string,tram:boolean,maglev=false):PartSpec[]{
 const p=[part('rail-frame','frame',[1.0,.14,3.82],[0,.51,0],[],steel)];
 if(maglev){for(const lane of [-1,1]){const frame=`rail-magnetic-frame-${lane}`;p.push(part(frame,'magneticShoe',[.12,.08,3.15],[lane*.44,.42,0],['rail-frame'],steel));for(const side of [-1,1])p.push(part(`rail-magnetic-shoe-${lane}-${side}`,'magneticShoe',[.16,.16,.70],[lane*.53,.35,side*1.12],[frame],primary));}}
 else for(const side of [-1,1]){
  const bogie=`rail-bogie-${side}`;p.push(part(bogie,'bogie',[.90,.10,.85],[0,.40,side*1.12],['rail-frame'],steel));
  for(const[index,z]of[-.29,.29].entries())p.push(wheelset(`rail-axle-${side}-${index}`,side*1.12+z,.30,bogie,steel));
 }
 p.push(part('rail-body','body',[1.0,.75,tram?3.62:3.30],[0,.95,tram?0:-.12],['rail-frame'],primary));
 p.push(part('rail-roof','roof',[1.04,.10,tram?3.67:3.40],[0,1.375,tram?0:-.12],['rail-body'],'#e2e8f0'));
 p.push(part('rail-front-window','window',[.78,.30,.025],[0,1.12,tram?1.825:1.55],['rail-body'],'#164e63'));
 if(!tram){const nose=part('rail-nose','nose',[1.0,.75,.60],[0,.95,1.80],['rail-frame','rail-body'],primary);nose.railNose=true;p.push(nose);}
 for(const side of [-1,1]){
  p.push(part(`rail-side-window-${side}`,'window',[.025,.27,2.55],[side*.513,1.10,-.1],['rail-body'],'#164e63'));
  p.push(part(`rail-door-${side}`,'door',[.035,.62,.32],[side*.53,.90,tram?.70:-.80],['rail-body'],'#cbd5e1'));
 }
 const panto=part('rail-pantograph','pantograph',[.06,.44,.06],[0,1.60,-.55],['rail-roof'],'#64748b',PartShapeKind.LAB_CYLINDER);panto.targetRot=[0,0,.55];p.push(panto);
 p.push(part('rail-pantograph-contact','pantograph',[.70,.055,.09],[0,1.80,-.55],['rail-pantograph'],'#64748b'));
 return p;
}
/** Replace generic car bodies while retaining catalogue identity, category, tier and progression stage. */
export function applyRailBlueprint(blueprint:VehicleBlueprint):VehicleBlueprint{
 if(!isRailBlueprint(blueprint.id))return blueprint;
 const primary=blueprint.parts.find(p=>p.shape===PartShapeKind.TRAIN_BOILER)?.primaryColor??blueprint.parts.find(p=>p.shape===PartShapeKind.CAR_CABIN)?.primaryColor??'#0d9488';
 const isSteam=blueprint.id==='train-steam-loco'||blueprint.id==='car-heritage-steam-loco',parts=isSteam?steam(primary):modern(primary,blueprint.id==='car-metro-tramway',isMaglevBlueprint(blueprint.id));
 const age=(locale:0|1|2)=>{const original=[blueprint.ageNote,blueprint.ageNoteEn??blueprint.ageNote,blueprint.ageNoteAr??blueprint.ageNote][locale];return`${original.split('·')[0].trim()} · ${RAIL_WORKSHOP_TEXT.age[locale].replace('{count}',String(parts.length))}`;};
 return{...blueprint,parts,ageNote:age(0),ageNoteEn:age(1),ageNoteAr:age(2)};
}
