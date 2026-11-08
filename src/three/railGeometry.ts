import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {PartSpec} from '../types/game';
import type {PartMaterialSet} from './materials';
/** Real railway wheelset: two thin steel treads, inner flanges, axle and visible spokes. */
export function createRailWheelset(spec:PartSpec,mats:PartMaterialSet){
 const group=new THREE.Group(),gauge=spec.scale[0],radius=spec.scale[1]/2,width=spec.scale[2];
 const cylinder=(r:number,length:number,material:THREE.Material)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,length,20),material);mesh.rotation.z=Math.PI/2;return mesh;};
 const axle=cylinder(.035,gauge+.13,mats.metalAccent);group.add(axle);
 for(const side of [-1,1]){const bearing=new THREE.Mesh(new THREE.BoxGeometry(.10,.24,.12),mats.metalAccent);bearing.name='rail-bearing';bearing.position.set(side*gauge*.33,.12,0);group.add(bearing);}
 for(const side of [-1,1]){
  const wheel=new THREE.Group();wheel.name='rail-wheel';wheel.position.x=side*gauge/2;
  wheel.add(cylinder(radius,width,mats.metalAccent));
  const face=cylinder(radius*.73,width+.008,mats.primary);wheel.add(face);
  const flange=cylinder(radius+.025,.018,mats.metalAccent);flange.position.x=-side*(width/2+.014);wheel.add(flange);
  const spokeGeometries=Array.from({length:3},(_,spoke)=>new THREE.BoxGeometry(width+.014,radius*1.30,.022).rotateX(spoke*Math.PI/3));const spokes=mergeGeometries(spokeGeometries);for(const geometry of spokeGeometries)geometry.dispose();wheel.add(new THREE.Mesh(spokes,mats.secondary));
  const hub=cylinder(radius*.20,width+.06,mats.secondary);wheel.add(hub);
  const pin=cylinder(.025,width+.075,mats.secondary);pin.position.y=-radius*.36;wheel.add(pin);group.add(wheel);
 }
 return group;
}
export function createRailTrack(gauge=1.06,length=4.70,headTop=.1575,detailScale=1){
 const group=new THREE.Group(),steel=new THREE.MeshStandardMaterial({color:0x94a3b8,metalness:.75,roughness:.32}),wood=new THREE.MeshStandardMaterial({color:0x72543a,roughness:.9});
 for(const side of [-1,1]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.055*detailScale,.075*detailScale,length),steel);rail.position.set(side*gauge/2,headTop-.0375*detailScale,0);group.add(rail);}
 const count=Math.max(5,Math.ceil(length/.45));for(let i=0;i<count;i++){const tie=new THREE.Mesh(new THREE.BoxGeometry(gauge+.38*detailScale,.07*detailScale,.14*detailScale),wood);tie.position.set(0,headTop-.11*detailScale,-length/2+.15+i*(length-.30)/(count-1));group.add(tie);}
 return group;
}
export function disposeRailTrack(group:THREE.Group){group.removeFromParent();const materials=new Set<THREE.Material>();group.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);}});for(const material of materials)material.dispose();}

/** Sloping, tapered railway cab nose with a windshield on the sloping upper surface. */
export function createHighSpeedRailNose(spec:PartSpec,mats:PartMaterialSet){
 const [width,height,length]=spec.scale,w=width/2,h=height/2,l=length/2,root=new THREE.Group();
 const vertices=[-w,-h,-l,w,-h,-l,-w,h,-l,w,h,-l,-w*.32,-h,l,w*.32,-h,l,-w*.25,-h*.38,l,w*.25,-h*.38,l];
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex([0,1,3,0,3,2,4,6,7,4,7,5,0,4,5,0,5,1,2,3,7,2,7,6,0,2,6,0,6,4,1,5,7,1,7,3]);geometry.computeVertexNormals();root.add(new THREE.Mesh(geometry,mats.primary));
 const glass=new THREE.BufferGeometry(),upper=(z:number)=>h-(z+l)/length*(h*1.38)+.008;
 const rear=-l*.68,front=-l*.05;
 glass.setAttribute('position',new THREE.Float32BufferAttribute([-w*.73,upper(rear),rear,w*.73,upper(rear),rear,-w*.43,upper(front),front,w*.43,upper(front),front],3));glass.setIndex([0,2,1,1,2,3]);glass.computeVertexNormals();root.add(new THREE.Mesh(glass,mats.glass));return root;
}

export function createMaglevGuideway(length=4.70,top=.24,scale=1){
 const root=new THREE.Group(),concrete=new THREE.MeshStandardMaterial({color:0x94a3b8,roughness:.80}),guide=new THREE.MeshStandardMaterial({color:0x38bdf8,metalness:.4,roughness:.3});
 const beam=new THREE.Mesh(new THREE.BoxGeometry(.85*scale,.17*scale,length),concrete);beam.position.y=top-.085*scale;root.add(beam);
 for(const side of [-1,1]){const strip=new THREE.Mesh(new THREE.BoxGeometry(.045*scale,.012*scale,length),guide);strip.position.set(side*.30*scale,top+.006*scale,0);root.add(strip);}
 return root;
}

/** Rotate the two wheels, never their stationary axle-box supports. */
export function setRailWheelsetTravel(group:THREE.Group,travel:number,radius:number,modelScale=1){
 const angle=travel/Math.max(.001,radius*modelScale);group.traverse(object=>{if(object.name==='rail-wheel')object.rotation.x=angle;});return angle;
}
