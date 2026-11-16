import * as THREE from 'three';
import type {PartSpec} from '../types/game';
import {mathReferenceMask,mathSolution,mathSuccess,type MathActivityKind} from '../data/mathActivities';
import {MATH_TOKEN_COUNTS,mathTokenPosition} from '../data/mathBlueprints';
import {createConstructionPlayActor} from './constructionPlayScene';
export interface MathPartEntry{group:THREE.Group;spec:PartSpec}
function plate(width=3){
 if(typeof document==='undefined')return undefined;
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const context=canvas.getContext('2d');if(!context)return undefined;
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(width,width/8),new THREE.MeshBasicMaterial({map:texture,depthWrite:false}));plane.rotation.x=-Math.PI/2;
 let previous='';return{plane,texture,update:(text:string)=>{if(text===previous)return;previous=text;context.fillStyle='#f8fafc';context.fillRect(0,0,1024,128);context.fillStyle='#0c4a6e';context.font='bold 96px sans-serif';context.textAlign='center';context.textBaseline='middle';context.fillText(text,512,64,990);texture.needsUpdate=true;}};
}
export function createMathActivityScene(kind:MathActivityKind,entries:()=>Map<string,MathPartEntry>,labels?:{unit:string}){
 const group=new THREE.Group();group.name=`math-mechanism-${kind}`;
 const seams:THREE.LineSegments[]=[],seamMaterial=new THREE.LineBasicMaterial({color:0x075985});
 if(kind==='addition'||kind==='fractions')for(const [id,entry]of entries())if(id.startsWith('token-'))entry.group.traverse(node=>{if(node instanceof THREE.Mesh&&!(node.material instanceof THREE.MeshBasicMaterial&&node.material.side===THREE.BackSide)){const seam=new THREE.LineSegments(new THREE.EdgesGeometry(node.geometry),seamMaterial);node.add(seam);seams.push(seam);}});
 const touched=new Set<string>(),box=(w:number,h:number,d:number,color:number,opacity=1)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1}));group.add(mesh);return mesh;};
 const bridge=kind==='addition'||kind==='fractions',runner=bridge?createConstructionPlayActor('castle'):new THREE.Group();runner.name='math-runner';group.add(runner);
 if(kind==='symmetry'){runner.add(new THREE.Mesh(new THREE.BoxGeometry(.3,.14,.30),new THREE.MeshStandardMaterial({color:0xf59e0b})));}
 const unit=kind==='fractions'?plate(1.6):undefined;
 if(unit){unit.plane.rotation.x=0;unit.plane.position.set(-.8,1.34,-.70);unit.update(labels?.unit??'1');group.add(unit.plane);}
 const water=bridge?box(1,.018,.64,0x38bdf8,.65):undefined;
 const targetFrame=Array.from({length:4},()=>box(1,.025,1,0x38bdf8,.30));
 const outlines=Array.from({length:Math.max(20,MATH_TOKEN_COUNTS[kind])},()=>box(.10,.025,.10,0x38bdf8,.35));
 const loadMarker=box(.52,.025,.52,0x38bdf8,.5);loadMarker.name='math-target';
 const pose=(id:string,position?:readonly number[],scale?:readonly number[],turn=0)=>{const entry=entries().get(id);if(!entry)return;touched.add(id);entry.group.position.fromArray(position??entry.spec.targetPos);entry.group.scale.fromArray(scale??[1,1,1]);entry.group.rotation.set(...entry.spec.targetRot??[0,0,0]);if(turn)entry.group.rotateY(turn);entry.group.visible=true;};
 const rope=(x:number,top:number,bottom:number,z:number)=>{const spec=entries().get('cable')?.spec;if(spec)pose('cable',[x,(top+bottom)/2,z],[1,Math.max(.02,top-bottom)/spec.scale[1],1]);};
 const restore=()=>{for(const id of touched){const entry=entries().get(id);if(entry){entry.group.position.fromArray(entry.spec.targetPos);entry.group.scale.set(1,1,1);entry.group.rotation.set(...entry.spec.targetRot??[0,0,0]);entry.group.visible=true;}}};
 const apply=(settings:readonly number[],level:number,progress=0,attempted=false)=>{
  const [a=0,b=0]=settings,solution=mathSolution(kind,level),success=mathSuccess(kind,settings,level),lift=attempted&&success?.65*progress:0;
  for(const node of [...targetFrame,...outlines])node.visible=false;loadMarker.visible=false;
  for(let i=0;i<MATH_TOKEN_COUNTS[kind];i++){
   const entry=entries().get(`token-${i}`);if(!entry)continue;
   const position=new THREE.Vector3(...mathTokenPosition(kind,i)),scale=new THREE.Vector3(1,1,1);let chosen=false;
   if(kind==='addition'){const blue=i<5,slot=i%5;chosen=slot<(blue?a:b);if(chosen)position.set(-1.4+((blue?slot:a+slot)+.5)*.28,.70,0);}
   if(kind==='fractions'){chosen=i<a;scale.x=4/(b===8?8:4);if(chosen)position.set(-1.6+(i+.5)*1.6/(b===8?8:4),.70,0);}
   if(kind==='groups'){const row=Math.floor(i/5),column=i%5;chosen=row<a&&column<b;if(chosen)position.set(-1.35+column*.27,.47,-.45+row*.27);}
   if(kind==='area'){chosen=i%4<a&&Math.floor(i/4)<b;if(chosen)position.y=.48+lift;else{position.set(-1.45+i*.18,.185,1.12);scale.setScalar(.5);}}
   if(kind==='symmetry'){const local=i%9,left=i<9,mask=left?mathReferenceMask(level):a;chosen=Boolean(mask&(1<<local));position.y=.46+Math.floor(local/3)*.32;}
   if(kind==='ratio'){const driven=i<6,slot=driven?i:i-6;chosen=slot<(driven?a:b);position.y+=chosen?.15:0;}
   pose(entry.spec.id,position.toArray(),scale.toArray());if(kind==='symmetry')entry.group.visible=chosen;
  }
  if(bridge){
   const needed=kind==='addition'?(solution[0]+solution[1])*.28:1.6*solution[0]/solution[1],actual=kind==='addition'?(a+b)*.28:1.6*a/(b===8?8:4),start=kind==='addition'?-1.4:-1.6,end=start+needed;
   pose('left-foot',[start-.17,.40,0]);pose('left-pad',[start-.17,.69,0]);pose('right-foot',[end+.17,.40,0]);pose('right-pad',[end+.17,.69,0]);
   for(let i=0;i<2;i++){targetFrame[i].visible=true;targetFrame[i].scale.set(needed,1,.025);targetFrame[i].position.set(start+needed/2,.69,i===0?-.25:.25);}
   if(water){water.scale.x=needed;water.position.set(start+needed/2,.18,0);}
   const travel=success?needed+.34:Math.max(0,Math.min(actual,needed)-.12);runner.position.set(start-.17+(attempted?travel*progress:0),.745,0);runner.rotation.y=-Math.PI/2;
   loadMarker.visible=true;loadMarker.position.set(end,.76,0);
  }else if(kind==='groups'){
   const rows=solution[0],columns=solution[1];for(let i=0;i<rows*columns;i++){outlines[i].visible=true;outlines[i].position.set(-1.35+(i%columns)*.27,.415,-.45+Math.floor(i/columns)*.27);}
   pose('load',[1.12,.39+lift,-.25]);rope(1.12,1.65,.56+lift,-.25);pose('winch',undefined,undefined,lift*8);loadMarker.visible=true;loadMarker.position.set(1.12,1.21,-.25);
  }else if(kind==='area'){
   const width=solution[0]*.32,length=solution[1]*.32,x=-.64+width/2,z=-.64+length/2;
   for(let i=0;i<4;i++)targetFrame[i].visible=true;
   targetFrame[0].position.set(x,.46,-.64);targetFrame[1].position.set(x,.46,-.64+length);targetFrame[0].scale.set(width,1,.025);targetFrame[1].scale.copy(targetFrame[0].scale);
   targetFrame[2].position.set(-.64,.46,z);targetFrame[3].position.set(-.64+width,.46,z);targetFrame[2].scale.set(.025,1,length);targetFrame[3].scale.copy(targetFrame[2].scale);
   pose('load',[0,.75+lift,-.25]);rope(0,1.65,.92+lift,-.25);loadMarker.visible=true;loadMarker.position.set(0,1.58,-.25);
  }else if(kind==='symmetry'){
   for(let i=0;i<9;i++){outlines[i].visible=true;outlines[i].position.fromArray(mathTokenPosition(kind,i+9));outlines[i].position.y=.46+Math.floor(i/3)*.32;outlines[i].scale.set(.7,8,.7);}
   runner.position.set(-1.4+(attempted?(success?2.8:1.4)*progress:0),1.99,-.25);loadMarker.visible=true;loadMarker.position.set(1.4,1.97,-.25);
  }else{
   const input=attempted?b*progress:0,output=input*2/3,goal=solution[0],height=.30+output*Math.PI*2*.02;
   pose('drive-wheel',undefined,undefined,input*Math.PI*2);pose('driven-wheel',undefined,undefined,-output*Math.PI*2);
   pose('load',[.22,height,.235]);rope(.22,1.35,height+.14,.235);
   loadMarker.visible=true;loadMarker.position.set(.22,.30+goal*Math.PI*2*.02+.15,.235);
  }
  group.updateMatrixWorld(true);
 };
 const pickTargets=()=>[...entries()].flatMap(([id,entry])=>id.startsWith('token-')&&!(kind==='symmetry'&&Number(id.slice(6))<9)?[{object:kind==='symmetry'&&!entry.group.visible?outlines[Number(id.slice(6))-9]:entry.group,index:kind==='symmetry'?Number(id.slice(6))-9:Number(id.slice(6))}]:[]);
 const dispose=()=>{restore();for(const seam of seams){seam.removeFromParent();seam.geometry.dispose();}seamMaterial.dispose();group.removeFromParent();group.traverse(node=>{if(node instanceof THREE.Mesh){node.geometry.dispose();for(const material of Array.isArray(node.material)?node.material:[node.material]){const map=(material as THREE.MeshBasicMaterial).map;map?.dispose();material.dispose();}}});group.clear();};
 return{group,apply,restore,dispose,pickTargets};
}
