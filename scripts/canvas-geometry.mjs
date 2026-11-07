import {PerspectiveCamera,Vector3} from 'three';
export async function canvasFraming(canvas){
 return canvas.evaluate(node=>{
  const rect=node.getBoundingClientRect(),main=node.closest('main');let left=8,right=8;
  for(const selector of ['[data-parts-palette]','[data-floating-camera]']){const panel=main?.querySelector(selector)?.getBoundingClientRect();if(!panel)continue;if(panel.x+panel.width/2<rect.x+rect.width/2)left=Math.max(left,panel.right-rect.x+12);else right=Math.max(right,rect.right-panel.left+12);}
  return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,aspect:Math.max(1,rect.width-left-right)/rect.height,offset:(right-left)/2};
 });
}
export async function canvasTarget(canvas){const box=await canvasFraming(canvas);return{x:box.x+box.width/2-box.offset,y:box.y+box.height/2};}
export function isoProjection(box,position){
 const camera=new PerspectiveCamera(44,box.width/box.height,.1,100),scale=Math.max(1,1/Math.max(.25,box.aspect));
 camera.setViewOffset(box.width,box.height,box.offset,0,box.width,box.height);camera.position.set(4.4,3.2,4.9).sub(new Vector3(0,.9,0)).multiplyScalar(scale).add(new Vector3(0,.9,0));camera.lookAt(0,.9,0);camera.updateMatrixWorld(true);
 const point=new Vector3(...position).project(camera);return{x:box.x+(point.x+1)/2*box.width,y:box.y+(1-point.y)/2*box.height};
}
