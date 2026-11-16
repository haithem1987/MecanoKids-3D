import * as THREE from 'three';
import type {MathPartEntry} from './mathActivityScene';
import {craneTilt,type CraneChallenge} from '../data/craneBalance';
import type {LanguageCode} from '../types/game';

export function createCraneBalanceScene(entries:()=>Map<string,MathPartEntry>,challenge:CraneChallenge,language:LanguageCode='en'){
 const group=new THREE.Group();group.name='crane-balance-markers';
 const resources:THREE.Texture[]=[];
 const label=(text:string,width=.32)=>{
  const holder=new THREE.Group();group.add(holder);
  if(typeof document==='undefined')return holder;
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;
  const context=canvas.getContext('2d');if(!context)return holder;
  context.fillStyle='#ffffff';context.fillRect(0,0,256,128);context.fillStyle='#0c4a6e';context.font='bold 76px sans-serif';context.textAlign='center';context.textBaseline='middle';context.fillText(text,128,64,245);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;resources.push(texture);
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false}));sprite.scale.set(width,width/2,1);holder.add(sprite);return holder;
 };
 const format=(value:number)=>new Intl.NumberFormat(language).format(value);
 const marks=challenge.distances.map(distance=>({distance,object:label(format(distance))}));
 const pivotLabel=label(format(0)),loadDistanceLabel=label(format(challenge.loadDistance));
 const loadLabel=label(`${format(challenge.load)} kg`,.5),counterLabels=new Map(challenge.masses.map(mass=>[mass,label(`${format(mass)} kg`,.5)]));
 const pickTargets=marks.map(mark=>({distance:mark.distance,object:mark.object}));
 const pose=(id:string,x:number,y:number,rotation=0)=>{const entry=entries().get(id);if(!entry)return;entry.group.position.set(x,y,entry.spec.targetPos[2]);entry.group.rotation.set(...entry.spec.targetRot??[0,0,0]);entry.group.rotation.z+=rotation;entry.group.scale.set(1,1,1);};
 const apply=(mass:number,distance:number,angle=craneTilt(challenge,mass,distance),lift=0)=>{
  pose('cross-beam',0,1.62,angle);
  const loadX=-challenge.loadDistance*.32*Math.cos(angle),loadTop=1.62-challenge.loadDistance*.32*Math.sin(angle),counterX=distance*.32*Math.cos(angle),counterTop=1.62+distance*.32*Math.sin(angle);
  pose('load',loadX,loadTop-.71+lift);pose('cable',loadX,loadTop-.31+lift/2);
  const rope=entries().get('cable');if(rope)rope.group.scale.y=Math.max(.1,1-lift/.5);
  pose('counterweight',counterX,counterTop-.71);pose('counter-cable',counterX,counterTop-.31);
  pivotLabel.position.set(0,1.78,.18);loadDistanceLabel.position.set(loadX,loadTop+.16,.18);
  loadLabel.position.set(loadX,loadTop-.88+lift,.28);
  for(const [weight,object]of counterLabels){object.visible=weight===mass;object.position.set(counterX,counterTop-.88,.28);}
  for(const mark of marks){const fractional=!Number.isInteger(mark.distance);mark.object.visible=!fractional||mark.distance===distance;mark.object.position.set(mark.distance*.32*Math.cos(angle),1.62+mark.distance*.32*Math.sin(angle)+(fractional?.40:.16),.18);}
  group.updateMatrixWorld(true);
 };
 const restore=()=>{for(const id of ['cross-beam','load','cable','counterweight','counter-cable']){const entry=entries().get(id);if(entry){entry.group.position.fromArray(entry.spec.targetPos);entry.group.rotation.set(...entry.spec.targetRot??[0,0,0]);entry.group.scale.set(1,1,1);}}};
 const dispose=()=>{restore();group.removeFromParent();group.traverse(object=>{if(object instanceof THREE.Sprite)object.material.dispose();});for(const texture of resources)texture.dispose();group.clear();};
 return{group,apply,restore,dispose,pickTargets};
}
