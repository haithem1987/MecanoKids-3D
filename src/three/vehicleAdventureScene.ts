import * as THREE from 'three';
import {getVehicleAdventureFrame,type VehicleAdventureFrame,type VehicleAdventureKind} from '../data/vehicleAdventures';
function mesh(w:number,h:number,d:number,color:number){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));}
export function measureVehicleAdventureModel(group:THREE.Group){
 group.updateWorldMatrix(true,true);const inverse=group.matrixWorld.clone().invert(),bounds=new THREE.Box3();
 group.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.computeBoundingBox();if(object.geometry.boundingBox){const local=object.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,object.matrixWorld));bounds.union(local);}}});
 if(bounds.isEmpty())bounds.setFromCenterAndSize(new THREE.Vector3(0,.5,0),new THREE.Vector3(1,1,1));
 const size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());return{bounds,center,frame:getVehicleAdventureFrame(size.x,size.y,size.z)};
}
export function createVehicleAdventureVisuals(kind:VehicleAdventureKind,frame:VehicleAdventureFrame){
 const root=new THREE.Group(),cargo=new THREE.Group(),barrier=new THREE.Group();
 const material=(color:number)=>new THREE.MeshStandardMaterial({color});
 const direction=(distance:number,side=0,y=.05)=>new THREE.Vector3(frame.axis==='x'?distance:side,y,frame.axis==='z'?distance:side);
 const flag=new THREE.Group();const pole=mesh(.035,.38,.035,0x64748b),banner=mesh(.18,.12,.025,0x38bdf8);pole.position.y=.19;banner.position.set(.075,.32,0);flag.add(pole,banner);flag.position.copy(direction(frame.travel/2,Math.min(1.65,(frame.axis==='x'?frame.halfDepth:frame.halfWidth)+.24)));root.add(flag);
 const cone=new THREE.Mesh(new THREE.ConeGeometry(.12,.24,12),material(0xfb923c));cone.position.y=.13;barrier.position.copy(direction(Math.min(1.7,(frame.axis==='x'?frame.halfWidth:frame.halfDepth)+.22)));barrier.add(cone);root.add(barrier);
 const crate=mesh(.20,.20,.20,0xfbbf24),pallet=mesh(.26,.035,.26,0xa97642);crate.position.y=.12;pallet.position.y=.018;cargo.add(crate,pallet);root.add(cargo);
 const signal=new THREE.Mesh(new THREE.TorusGeometry(.18,.035,8,20),new THREE.MeshBasicMaterial({color:0x22c55e}));signal.rotation.x=Math.PI/2;signal.position.copy(direction(frame.travel/2,0,.04));signal.visible=false;root.add(signal);
 const flame=new THREE.Mesh(new THREE.ConeGeometry(.12,.35,12),new THREE.MeshBasicMaterial({color:0xfb923c}));flame.rotation.z=Math.PI;flame.visible=false;root.add(flame);
 const scan=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1,8),new THREE.MeshBasicMaterial({color:0x38bdf8,transparent:true,opacity:.65}));scan.visible=false;root.add(scan);
 let rock:THREE.Mesh<THREE.DodecahedronGeometry,THREE.MeshStandardMaterial>|undefined;
 if(kind==='navigation'){
  const water=new THREE.Mesh(new THREE.CircleGeometry(2.30,40),new THREE.MeshBasicMaterial({color:0x38bdf8,transparent:true,opacity:.10,depthWrite:false}));water.rotation.x=-Math.PI/2;water.position.y=.025;root.add(water);
  for(const side of [-1,1]){const buoy=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),material(side<0?0xf97316:0x22c55e));buoy.position.copy(direction(frame.travel/2,side*Math.min(1.6,(frame.axis==='x'?frame.halfDepth:frame.halfWidth)+.25),.12));root.add(buoy);}
 }else if(kind==='rover'){
  rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.14,0),material(0x9ca3af));rock.position.copy(direction(frame.travel/2,Math.min(1.65,(frame.axis==='x'?frame.halfDepth:frame.halfWidth)+.23),.18));root.add(rock);
 }else if(kind==='orbit'){
  const mast=mesh(.05,.55,.05,0x64748b);mast.position.copy(direction(0,1.75,.30));const dish=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),material(0x38bdf8));dish.position.copy(direction(0,1.75,.64));root.add(mast,dish);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),new THREE.MeshBasicMaterial({color:0xfacc15}));sun.position.copy(direction(-1.7,-.30,2.35));root.add(sun);
 }else if(kind==='flight'){
  for(const side of [-1,1]){const beacon=new THREE.Mesh(new THREE.SphereGeometry(.07,12,8),new THREE.MeshBasicMaterial({color:side<0?0xfbbf24:0x38bdf8}));beacon.position.copy(direction(frame.travel/2,side*Math.min(1.6,(frame.axis==='x'?frame.halfDepth:frame.halfWidth)+.18),frame.height/2+.65));root.add(beacon);}
 }else if(kind==='launch'){
  const pad=new THREE.Mesh(new THREE.TorusGeometry(Math.min(.6,frame.radius+.12),.025,8,32),material(0x38bdf8));pad.rotation.x=-Math.PI/2;pad.position.y=.035;root.add(pad);
 }else if(kind!=='rail'){
  for(const distance of [-.6,0,.6]){const dash=mesh(frame.axis==='x'?.20:.035,.012,frame.axis==='z'?.20:.035,0xf8fafc);dash.position.copy(direction(distance,-Math.min(1.8,(frame.axis==='x'?frame.halfDepth:frame.halfWidth)+.15),.03));root.add(dash);}
 }
 cargo.visible=kind==='delivery'||kind==='site';barrier.visible=false;
 return{root,cargo,crate,barrier,signal,flame,scan,rock,flag,direction};
}
export function disposeVehicleAdventureVisuals(root:THREE.Group){
 root.removeFromParent();const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();root.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);}});for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose();
}
