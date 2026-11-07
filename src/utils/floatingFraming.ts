import {isPhoneLayout} from '../hooks/usePhoneLayout';
export function getFloatingFrame(width:number,height:number,left:number,right:number,top=0,bottom=0) {
 const usableWidth=Math.max(1,width-left-right),usableHeight=Math.max(1,height-top-bottom);
 return {aspect:Math.min(usableWidth,usableHeight)/Math.max(1,height),offset:(right-left)/2,offsetY:(bottom-top)/2};
}
/** Measure visible UI rails; smartphone controls reserve the top/bottom rather than both sides. */
export function measureFloatingFraming(container:HTMLElement){
 const rect=container.getBoundingClientRect(),main=container.closest('main'),phone=isPhoneLayout(),landscape=phone&&window.matchMedia('(orientation: landscape) and (max-height: 500px) and (pointer: coarse)').matches,portrait=phone&&!landscape,smallLandscape=landscape&&rect.width<640;
 let left=8,right=8,top=8,bottom=8;
 const inline=(panel:DOMRect)=>{if(panel.x+panel.width/2<rect.x+rect.width/2)left=Math.max(left,panel.right-rect.x+12);else right=Math.max(right,rect.right-panel.left+12);};
 for(const node of main?.querySelectorAll('[data-parts-palette],[data-floating-camera],[data-phone-toolbar],.hud-title,.workbench-mission')??[]){
  const panel=node.getBoundingClientRect();if(!panel.width||!panel.height)continue;
  if(node.matches('.hud-title')){if(portrait)top=Math.max(top,panel.bottom-rect.top+8);continue;}
  if(node.matches('.workbench-mission')){if(phone){if(portrait||smallLandscape)bottom=Math.max(bottom,rect.bottom-panel.top+8);else inline(panel);}continue;}
  if(phone&&portrait){if(node.matches('[data-parts-palette]'))bottom=Math.max(bottom,rect.bottom-panel.top+8);else if(node.matches('[data-phone-toolbar]'))top=Math.max(top,panel.bottom-rect.top+8);}
  else inline(panel);
 }
 return getFloatingFrame(rect.width,rect.height,left,right,top,bottom);
}
