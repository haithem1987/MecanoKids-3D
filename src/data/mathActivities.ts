import type {MathTextKey} from '../i18n/mathText';
export const MATH_ACTIVITY_KINDS=['addition','groups','fractions','area','symmetry','ratio'] as const;
export type MathActivityKind=typeof MATH_ACTIVITY_KINDS[number];
export interface MathControl{id:string;label:MathTextKey;options:readonly{value:number;label?:MathTextKey}[]}
const numbers=(length:number,start=0)=>Array.from({length},(_,i)=>({value:i+start}));
export function getMathActivityKind(id:string):MathActivityKind|undefined{return MATH_ACTIVITY_KINDS.find(kind=>id===`math-${kind}`);}
export const mathStart=(kind:MathActivityKind):readonly number[]=>kind==='groups'||kind==='area'?[1,1]:kind==='fractions'?[0,4]:kind==='symmetry'?[0]:[0,0];
export const mathReferenceMask=(level:number)=>[0b001000110,0b110001001,0b101011010][Math.min(2,Math.max(0,level))];
export function reflectMathMask(mask:number){let result=0;for(let i=0;i<9;i++)if(mask&(1<<i))result|=1<<(Math.floor(i/3)*3+2-i%3);return result;}
export function rotateMathMask(mask:number){let result=0;for(let i=0;i<9;i++)if(mask&(1<<i))result|=1<<((i%3)*3+2-Math.floor(i/3));return result;}
export function mathControls(kind:MathActivityKind,level:number):readonly MathControl[]{
 if(kind==='addition')return[{id:'a',label:'blue',options:numbers(6)},{id:'b',label:'yellow',options:numbers(6)}];
 if(kind==='groups')return[{id:'a',label:'rows',options:numbers(4,1)},{id:'b',label:'columns',options:numbers(5,1)}];
 if(kind==='fractions')return[{id:'a',label:'numerator',options:numbers(9)},{id:'b',label:'denominator',options:[{value:4},{value:8}]}];
 if(kind==='area')return[{id:'a',label:'width',options:numbers(4,1)},{id:'b',label:'length',options:numbers(4,1)}];
 if(kind==='symmetry'){const mask=mathReferenceMask(level);return[{id:'a',label:'pattern',options:[{value:0,label:'empty'},{value:mask,label:'copy'},{value:rotateMathMask(mask),label:'rotated'},{value:reflectMathMask(mask),label:'reflected'}]}];}
 return[{id:'a',label:'blue',options:numbers(7)},{id:'b',label:'yellow',options:numbers(10)}];
}
export function mathSolution(kind:MathActivityKind,level:number):readonly number[]{
 const l=Math.min(2,Math.max(0,level));
 if(kind==='addition')return[[2,3],[4,3],[5,4]][l];
 if(kind==='groups')return[[2,3],[3,4],[4,5]][l];
 if(kind==='fractions')return[[2,4],[3,4],[5,4]][l];
 if(kind==='area')return[[3,2],[4,3],[4,4]][l];
 if(kind==='symmetry')return[reflectMathMask(mathReferenceMask(l))];
 return[(l+1)*2,(l+1)*3];
}
export function mathSuccess(kind:MathActivityKind,settings:readonly number[],level:number){
 const target=mathSolution(kind,level),[a=0,b=0]=settings;
 if(kind==='addition')return Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&a<=5&&b>=0&&b<=5&&a+b===target[0]+target[1];
 if(kind==='groups')return Number.isInteger(a)&&Number.isInteger(b)&&a>=1&&a<=4&&b>=1&&b<=5&&a*b===target[0]*target[1];
 if(kind==='fractions')return a*target[1]===target[0]*b&&(b===4||b===8);
 if(kind==='area')return a*b===target[0]*target[1]&&2*(a+b)===2*(target[0]+target[1]);
 return target.every((value,index)=>settings[index]===value);
}
export function mathEquation(kind:MathActivityKind,settings:readonly number[],level:number,target=false){
 const [a=0,b=0]=target?mathSolution(kind,level):settings;
 if(kind==='addition')return `${a} + ${b} = ${a+b}`;
 if(kind==='groups')return `${a} × ${b} = ${a*b}`;
 if(kind==='fractions')return `${a} / ${b}`;
 if(kind==='area')return `A = ${a*b} u² · P = ${2*(a+b)} u`;
 if(kind==='symmetry')return '↔';
 return `${level+1} × (2 : 3) → ${a} : ${b}`;
}
/** The same mutations are used by direct 3D taps and accessible controls. */
export function mathTap(kind:MathActivityKind,index:number,settings:readonly number[]):readonly number[]{
 const [a=0,b=0]=settings;
 if(kind==='addition')return index<5?[(a+1)%6,b]:[a,(b+1)%6];
 if(kind==='groups')return[Math.floor(index/5)+1,index%5+1];
 if(kind==='fractions')return[index+1,b];
 if(kind==='area')return[index%4+1,Math.floor(index/4)+1];
 if(kind==='symmetry')return[a^(1<<index)];
 return index<6?[(a+1)%7,b]:[a,(b+1)%10];
}
