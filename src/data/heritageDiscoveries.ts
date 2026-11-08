export type HeritageDiscoveryKind='shelter'|'loadpaths';
export function getHeritageDiscoveryKind(id:string):HeritageDiscoveryKind|undefined{return id==='expansion-yurt'?'shelter':id==='expansion-dome'?'loadpaths':undefined;}
export function domeLoadPath(index:number):readonly [readonly [number,number,number],readonly [number,number,number],readonly [number,number,number]]{
 const angle=index*Math.PI/4;return [[0,1.95,0],[.98*Math.cos(angle+Math.PI/8),1.1,.98*Math.sin(angle+Math.PI/8)],[1.4*Math.cos(angle),.25,1.4*Math.sin(angle)]];
}
export const hasComparedLoads=(attempts:readonly number[])=>attempts.includes(0)&&attempts.includes(1);
