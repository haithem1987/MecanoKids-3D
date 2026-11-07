import * as THREE from 'three';
import type {ConstructionPlayKind} from '../data/constructionPlay';
function box(w:number,h:number,d:number,color:number){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));}
export function createConstructionPlayActor(kind:ConstructionPlayKind){
 const group=new THREE.Group();
 if(kind==='gantry'){
  const pad=box(.66,.08,.66,0x38bdf8);pad.position.set(.72,.345,0);group.add(pad);
 }else if(kind==='truss'){
  const body=box(.38,.15,.30,0x38bdf8);body.position.y=.15;group.add(body);
  const parcel=box(.22,.20,.22,0xfbbf24);parcel.position.y=.325;group.add(parcel);
  for(const x of [-.13,.13])for(const z of [-.17,.17]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.045,12),new THREE.MeshStandardMaterial({color:0x334155}));wheel.rotation.x=Math.PI/2;wheel.position.set(x,.075,z);group.add(wheel);}
 }else{
  const shell=new THREE.Mesh(new THREE.SphereGeometry(.15,16,10),new THREE.MeshStandardMaterial({color:0x14b8a6}));shell.scale.set(1,.65,1.15);shell.position.y=.16;group.add(shell);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.075,12,8),new THREE.MeshStandardMaterial({color:0xa3e635}));head.position.set(0,.15,-.20);group.add(head);
  for(const x of [-.13,.13])for(const z of [-.08,.08]){const flipper=box(.10,.035,.07,0xa3e635);flipper.position.set(x,.02,z);group.add(flipper);}
  for(const x of [-.035,.035]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.012,8,6),new THREE.MeshBasicMaterial({color:0x0f172a}));eye.position.set(x,.18,-.26);group.add(eye);}
 }
 return group;
}
export function disposeConstructionPlayActor(group:THREE.Group){group.removeFromParent();group.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];for(const material of materials)material.dispose();}});}
