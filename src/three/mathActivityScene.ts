import * as THREE from 'three';
import type {PartSpec} from '../types/game';
import {mathEquation,mathReferenceMask,type MathActivityKind} from '../data/mathActivities';
import {MATH_TOKEN_COUNTS} from '../data/mathBlueprints';
export interface MathPartEntry{group:THREE.Group;spec:PartSpec}
function formulaPlate(){
 if(typeof document==='undefined')return undefined;
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;
 const context=canvas.getContext('2d');if(!context)return undefined;
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(3,.375),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));plane.rotation.x=-Math.PI/2;
 let previous='';
 return{plane,update:(text:string)=>{if(previous===text)return;previous=text;context.clearRect(0,0,1024,128);context.fillStyle='#f8fafc';context.fillRect(0,0,1024,128);context.fillStyle='#0c4a6e';context.font='bold 58px sans-serif';context.textAlign='center';context.textBaseline='middle';context.fillText(text,512,64,990);texture.needsUpdate=true;},texture};
}
export function createMathActivityScene(kind:MathActivityKind,entries:()=>Map<string,MathPartEntry>){
 const group=new THREE.Group();group.name=`math-activity-${kind}`;
 const geometry=new THREE.BoxGeometry(.31,.025,.31),material=new THREE.MeshBasicMaterial({color:0xfde68a});
 const halos=Array.from({length:MATH_TOKEN_COUNTS[kind]},()=>{const halo=new THREE.Mesh(geometry,material);group.add(halo);return halo;});
 const borderGeometry=new THREE.BoxGeometry(1,.035,1),borderMaterial=new THREE.MeshBasicMaterial({color:0xf59e0b});
 const borders=Array.from({length:4},()=>{const border=new THREE.Mesh(borderGeometry,borderMaterial);border.visible=false;group.add(border);return border;});
 const target=formulaPlate(),current=formulaPlate();
 if(target){target.plane.position.set(0,.215,-1.02);group.add(target.plane);}
 if(current){current.plane.position.set(0,.215,1.09);group.add(current.plane);}
 const touched=new Set<string>();
 const restore=()=>{for(const id of touched){const entry=entries().get(id);if(entry){entry.group.position.fromArray(entry.spec.targetPos);entry.group.scale.set(1,1,1);entry.group.visible=true;}}};
 const apply=(settings:readonly number[],level:number,blend=1)=>{
  const [a=0,b=0]=settings;for(const border of borders)border.visible=false;
  for(let index=0;index<MATH_TOKEN_COUNTS[kind];index++){
   const entry=entries().get(`token-${index}`);if(!entry)continue;touched.add(entry.spec.id);
   const position=new THREE.Vector3(...entry.spec.targetPos),scale=new THREE.Vector3(1,1,1);let chosen=false;
   if(kind==='addition'){
    const blue=index<5,slot=index%5;chosen=slot<(blue?a:b);position.z=chosen?-.25:.65;position.y=chosen?.40:.27;
   }else if(kind==='groups'){
    const row=Math.floor(index/5),column=index%5;chosen=row<a&&column<b;
    if(!chosen){position.z=.82;position.x=(index-9.5)*.13;scale.setScalar(.38);}else position.y=.43;
   }else if(kind==='fractions'){
    const denominator=b===8?8:4;position.x=((index%denominator)-(denominator-1)/2)*2.4/denominator;position.z=-.3+Math.floor(index/denominator)*.65;
    chosen=index<a;position.y=chosen?.43:.25;scale.x=8/denominator;scale.y=chosen?1:.30;
   }else if(kind==='area'){
    chosen=index%4<a&&Math.floor(index/4)<b;position.y=chosen?.32:.235;scale.y=chosen?1:.2;
   }else if(kind==='symmetry'){
    const local=index%9,row=Math.floor(local/3),left=index<9,mask=left?mathReferenceMask(level):a;
    chosen=Boolean(mask&(1<<local));position.y=.16+(chosen?(row+1)*.10:.012);scale.y=chosen?(row+1)*1.25:.15;
   }else{
    const blue=index<6,slot=blue?index:index-6;chosen=slot<(blue?a:b);position.y=chosen?.40:.245;scale.y=chosen?1:.15;
   }
   entry.group.position.lerp(position,blend);entry.group.scale.lerp(scale,blend);entry.group.visible=true;
   const halo=halos[index];halo.visible=chosen;halo.position.set(position.x,.205,position.z);halo.scale.set(kind==='fractions'?8/(b===8?8:4):1,1,kind==='fractions'?1.8:1);
  }
  if(kind==='area'){
   const width=a*.4,length=b*.4,x=-.8+width/2,z=-.8+length/2;
   for(let i=0;i<4;i++)borders[i].visible=true;
   borders[0].position.set(x,.25,-.8);borders[1].position.set(x,.25,-.8+length);borders[0].scale.set(width,1,.035);borders[1].scale.copy(borders[0].scale);
   borders[2].position.set(-.8,.25,z);borders[3].position.set(-.8+width,.25,z);borders[2].scale.set(.035,1,length);borders[3].scale.copy(borders[2].scale);
  }
  target?.update(`→ ${mathEquation(kind,settings,level,true)}`);current?.update(mathEquation(kind,settings,level));group.updateMatrixWorld(true);
 };
 const pickTargets=()=>[...entries()].flatMap(([id,entry])=>id.startsWith('token-')&&!(kind==='symmetry'&&Number(id.slice(6))<9)?[{object:entry.group,index:kind==='symmetry'?Number(id.slice(6))-9:Number(id.slice(6))}]:[]);
 const dispose=()=>{restore();group.removeFromParent();geometry.dispose();material.dispose();borderGeometry.dispose();borderMaterial.dispose();for(const plate of[target,current])if(plate){plate.texture.dispose();plate.plane.geometry.dispose();plate.plane.material.dispose();}group.clear();};
 return{group,apply,restore,dispose,pickTargets};
}
