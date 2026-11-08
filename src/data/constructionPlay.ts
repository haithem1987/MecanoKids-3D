export type ConstructionPlayKind = 'gantry' | 'castle' | 'temple' | 'truss';
const kinds: Readonly<Record<string, ConstructionPlayKind>> = {
 'master-bridge':'truss', 'expansion-gantry':'gantry', 'expansion-castle':'castle', 'expansion-keep':'castle',
 'expansion-temple':'temple', 'expansion-truss':'truss',
};
export const getConstructionPlayKind=(blueprintId:string):ConstructionPlayKind|undefined=>kinds[blueprintId];
export type PlayPosition=readonly [number,number,number];
export function getPlayRoute(kind:ConstructionPlayKind,blueprintId:string,clearRoute:boolean):{start:PlayPosition;end:PlayPosition}{
 if(kind==='truss')return{start:[-2.35,.90,0],end:clearRoute?[2.35,.90,0]:[-1.65,1.07,.30]};
 if(kind==='temple')return{start:[clearRoute?0:.95,.42,clearRoute?1.35:1.75],end:clearRoute?[0,.42,-1.1]:[.95,.42,1.53]};
 const keep=blueprintId==='expansion-keep';
 return{start:[clearRoute?0:keep?.38:.72,.20,keep?1.35:2.05],end:clearRoute?[0,.20,keep?.25:.55]:[keep?.38:.72,.20,keep?1.0:1.76]};
}
export function getGantryPose(step:number){
 const lifted=step===1||step===2, x=step>=2?.72:0, y=lifted?1.245:.595;
 return{x,y,cableLength:2.4-(y+.21),cableY:(2.4+y+.21)/2};
}
