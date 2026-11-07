import {PerspectiveCamera,Vector3} from 'three';
export async function canvasFraming(canvas){
 return canvas.evaluate(node=>{
  const rect=node.getBoundingClientRect(),main=node.closest('main'),phone=matchMedia('(max-width: 639px), (max-height: 500px) and (pointer: coarse)').matches,landscape=phone&&matchMedia('(orientation: landscape) and (max-height: 500px) and (pointer: coarse)').matches,portrait=phone&&!landscape,smallLandscape=landscape&&rect.width<640;
  let left=8,right=8,top=8,bottom=8;
  const inline=panel=>{if(panel.x+panel.width/2<rect.x+rect.width/2)left=Math.max(left,panel.right-rect.x+12);else right=Math.max(right,rect.right-panel.left+12);};
  for(const part of main?.querySelectorAll('[data-parts-palette],[data-floating-camera],[data-phone-toolbar],.hud-title,.workbench-mission')??[]){
   const panel=part.getBoundingClientRect();if(!panel.width||!panel.height)continue;
   if(part.matches('.hud-title')){if(portrait)top=Math.max(top,panel.bottom-rect.top+8);continue;}
   if(part.matches('.workbench-mission')){if(phone){if(portrait||smallLandscape)bottom=Math.max(bottom,rect.bottom-panel.top+8);else inline(panel);}continue;}
   if(phone&&portrait){if(part.matches('[data-parts-palette]'))bottom=Math.max(bottom,rect.bottom-panel.top+8);else if(part.matches('[data-phone-toolbar]'))top=Math.max(top,panel.bottom-rect.top+8);}else inline(panel);
  }
  return{x:rect.x,y:rect.y,width:rect.width,height:rect.height,aspect:Math.min(Math.max(1,rect.width-left-right),Math.max(1,rect.height-top-bottom))/rect.height,offset:(right-left)/2,offsetY:(bottom-top)/2};
 });
}
export async function canvasTarget(canvas){const box=await canvasFraming(canvas);return{x:box.x+box.width/2-box.offset,y:box.y+box.height/2-box.offsetY};}
export function isoProjection(box,position){
 const camera=new PerspectiveCamera(44,box.width/box.height,.1,100),scale=Math.max(1,1/Math.max(.25,box.aspect));
 camera.setViewOffset(box.width,box.height,box.offset,box.offsetY,box.width,box.height);camera.position.set(4.4,3.2,4.9).sub(new Vector3(0,.9,0)).multiplyScalar(scale).add(new Vector3(0,.9,0));camera.lookAt(0,.9,0);camera.updateMatrixWorld(true);
 const point=new Vector3(...position).project(camera);return{x:box.x+(point.x+1)/2*box.width,y:box.y+(1-point.y)/2*box.height};
}
