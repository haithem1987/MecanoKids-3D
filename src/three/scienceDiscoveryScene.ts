import * as THREE from 'three';
import type {PartSpec} from '../types/game';
import {scienceDiscoveryPose,type ScienceDiscoveryKind} from '../data/scienceDiscovery';
export interface DiscoveryPartEntry {group:THREE.Group;spec:PartSpec}
const mesh=(geometry:THREE.BufferGeometry,color:number)=>new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color}));
export function createScienceDiscoveryScene(kind:ScienceDiscoveryKind,entries:()=>Map<string,DiscoveryPartEntry>){
 const group=new THREE.Group();group.name=`science-discovery-${kind}`;
 const shade=mesh(new THREE.BoxGeometry(.42,.035,.35),0x334155);shade.name='shade';shade.position.set(0,.73,-.42);group.add(shade);
 const rings=new THREE.Group();rings.name='signal';
 for(let i=0;i<3;i++){const ring=mesh(new THREE.TorusGeometry(.18+i*.08,.018,6,24),0xfbbf24);ring.rotation.x=-Math.PI/2;ring.position.set(.6,.76+i*.07,.2);rings.add(ring);}group.add(rings);
 const airflow=new THREE.Group();airflow.name='airflow';
 for(let i=0;i<4;i++){const cone=mesh(new THREE.ConeGeometry(.045,.16,8),0x38bdf8);cone.position.set(.15+(i%2)*.45,1.15+Math.floor(i/2)*.17,0);airflow.add(cone);}group.add(airflow);
 const sun=mesh(new THREE.SphereGeometry(.10,12,8),0xfbbf24);sun.name='sun';sun.position.set(-.6,1.35,0);group.add(sun);
 const liquid=mesh(new THREE.CylinderGeometry(.235,.235,.25,24),0x7dd3fc);liquid.material.transparent=true;liquid.material.opacity=.35;liquid.material.depthWrite=false;liquid.name='liquid';liquid.position.set(0,1.0,0);group.add(liquid);
 const grains=new THREE.Group();grains.name='grains';
 for(let i=0;i<12;i++){const grain=mesh(new THREE.IcosahedronGeometry(.027,0),0xfef3c7);grain.position.set(Math.sin(i*2.4)*.16,.91+(i%3)*.04,Math.cos(i*2.4)*.16);grains.add(grain);}group.add(grains);
 const bonds=new THREE.Group();bonds.name='lattice';
 for(let x=0;x<2;x++)for(let y=0;y<2;y++)for(let z=0;z<2;z++)for(let axis=0;axis<3;axis++){
  const a=[x,y,z],b=[x,y,z];if(a[axis])continue;b[axis]=1;
  const start=new THREE.Vector3((a[0]-.5)*.5,.6+a[1]*.5,(a[2]-.5)*.5),end=new THREE.Vector3((b[0]-.5)*.5,.6+b[1]*.5,(b[2]-.5)*.5),delta=end.clone().sub(start);
  const bond=mesh(new THREE.CylinderGeometry(.015,.015,.5,8),0xe2e8f0);bond.position.copy(start).add(end).multiplyScalar(.5);bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());bonds.add(bond);
 }group.add(bonds);
 const redRay=mesh(new THREE.BoxGeometry(.45,.025,.025),0xef4444);redRay.name='red-ray';redRay.position.set(-.35,.42,0);group.add(redRay);
 const touched=new Set<string>();
 const get=(id:string)=>{const entry=entries().get(id);if(entry)touched.add(id);return entry;};
 const resetEntry=(entry:DiscoveryPartEntry)=>{entry.group.position.fromArray(entry.spec.targetPos);entry.group.rotation.fromArray([...(entry.spec.targetRot??[0,0,0]),'XYZ']);entry.group.scale.set(1,1,1);entry.group.visible=true;};
 const restore=()=>{for(const id of touched){const entry=entries().get(id);if(entry)resetEntry(entry);}};
 const apply=(settings:readonly number[],time:number,reducedMotion:boolean)=>{
  restore();for(const object of group.children)object.visible=false;
  const pose=scienceDiscoveryPose(kind,settings,time,reducedMotion);
  if(kind==='fan'||kind==='solar'){
   const fan=get('fan');if(fan)fan.group.rotation.y=pose.fanAngle;
   airflow.visible=settings[0]>0;airflow.position.y=reducedMotion?0:(time*.2)% .18;
   if(kind==='solar'){sun.visible=settings[0]>0;sun.position.x=settings[0]===1?-.95:-.6;sun.position.y=settings[0]===1?.95:1.35;shade.visible=settings[0]===0;shade.position.set(-.6,.61,0);}
  }else if(kind==='alarm'){
   shade.visible=Boolean(settings[1]);rings.visible=Boolean(settings[0]&&settings[1]);
   const pulse=reducedMotion?1:1+Math.sin(time*7)*.12;rings.scale.set(pulse,1,pulse);
  }else if(kind==='radio'){
   rings.visible=true;const strength=settings[0]===1?1:.35;rings.scale.set(strength,1,strength);rings.position.set(.05,.03,0);
   if(!reducedMotion)rings.position.y+=Math.sin(time*5)*.03;
   const antenna=get('antenna');if(antenna)antenna.group.rotation.z=(settings[0]-1)*.2;
  }else if(kind==='ramp'){
   const height=[.3,.6,.9][settings[0]],angle=Math.atan(height/1.5),ramp=get('ramp'),load=get('load');
   if(ramp){ramp.group.scale.y=height/.6;ramp.group.position.y=.23+height/2;}
   if(load){const x=.58-pose.rampProgress*1.16;load.group.position.set(x-Math.sin(angle)*.11,.23+(x+.75)/1.5*height+Math.cos(angle)*.11,0);load.group.rotation.z=angle;}
  }else if(kind==='compass'){
   const magnet=get('magnet'),needle=get('needle');
   if(magnet){magnet.group.position.set(.3+Math.cos(pose.magnetAngle)*.85,.34,Math.sin(pose.magnetAngle)*.85);magnet.group.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(-Math.cos(pose.magnetAngle),0,-Math.sin(pose.magnetAngle)));}
   if(needle)needle.group.rotation.y=-Math.PI/2-pose.magnetAngle;
  }else if(kind==='pendulum'){
   const a=pose.pendulumAngle,length=pose.pendulumLength,rod=get('rod'),bob=get('bob');
   if(rod){rod.group.scale.y=length/1.1;rod.group.rotation.z=a;rod.group.position.set(Math.sin(a)*length/2,1.9-Math.cos(a)*length/2,0);}
   if(bob){bob.group.position.set(Math.sin(a)*(length+.1),1.9-Math.cos(a)*(length+.1),0);bob.group.rotation.z=a;}
  }else if(kind==='balance'){
   const angle=[.18,0,-.18][settings[0]],c=Math.cos(angle),s=Math.sin(angle);
   for(const id of ['beam','pan-left','pan-right','load','counterweight']){
    const entry=get(id);if(!entry)continue;const [x,y,z]=entry.spec.targetPos;entry.group.position.set(x*c-(y-1)*s,1+x*s+(y-1)*c,z);entry.group.rotation.z=id==='beam'?angle:0;
    if(id==='counterweight')entry.group.scale.setScalar([.7,1,1.35][settings[0]]);
   }
  }else if(kind==='salt'){
   bonds.visible=Boolean(settings[0]);const amount=pose.latticeProgress;
   for(const [id,entry]of entries())if(id.startsWith('ion-')){get(id);const [x,y,z]=entry.spec.targetPos,index=parseInt(id.slice(4),2),scatter=new THREE.Vector3(Math.sin(index*2.1)*.9,.4+(index%3)*.35,Math.cos(index*2.1)*.9);entry.group.position.copy(scatter).lerp(new THREE.Vector3(x,y,z),amount);}
   bonds.scale.setScalar(settings[0]?Math.max(.01,amount):1);bonds.position.y=.85*(1-bonds.scale.y);
  }else if(kind==='beaker'){
   liquid.visible=true;grains.visible=pose.dissolved<1;for(const grain of grains.children)grain.scale.setScalar(1-pose.dissolved*.95);
   const stirring=Boolean(settings[1]);grains.rotation.y=stirring&&!reducedMotion?time*3:0;
   grains.position.y=settings[0]===1?-.04:0;
  }else if(kind==='prism'){
   const source=settings[0],incoming=get('incoming-ray');if(incoming)incoming.group.visible=source===1;
   for(let i=0;i<6;i++){const entry=get(`spectrum-${i}`);if(entry)entry.group.visible=source===1||source===2&&i===0;}
   redRay.visible=source===2;const lamp=get('lamp');if(lamp)lamp.group.scale.setScalar(source?1.06:1);
  }
  group.updateMatrixWorld(true);
 };
 const dispose=()=>{restore();group.removeFromParent();const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();group.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);}});for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose();group.clear();};
 const activeIds:Record<ScienceDiscoveryKind,readonly string[]>={fan:['fan'],solar:['fan','solar'],alarm:['sensor','buzzer'],radio:['antenna','speaker'],ramp:['load'],compass:['magnet','needle'],pendulum:['bob'],balance:['counterweight'],salt:['ion-111'],beaker:['beaker'],prism:['prism']};
 return{group,apply,restore,dispose,activeIds:activeIds[kind]};
}
