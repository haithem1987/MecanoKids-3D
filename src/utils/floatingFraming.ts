export function getFloatingFrame(width:number,height:number,left:number,right:number) {
 return {aspect:Math.max(1,width-left-right)/Math.max(1,height),offset:(right-left)/2};
}
/** Measure the side palettes without shrinking or moving the canvas itself. */
export function measureFloatingFraming(container: HTMLElement) {
  const rect=container.getBoundingClientRect(),main=container.closest('main');
  let left=8,right=8;
  for(const selector of ['[data-parts-palette]','[data-floating-camera]']){
    const panel=main?.querySelector(selector)?.getBoundingClientRect();if(!panel)continue;
    if(panel.x+panel.width/2<rect.x+rect.width/2)left=Math.max(left,panel.right-rect.x+12);
    else right=Math.max(right,rect.right-panel.left+12);
  }
  return getFloatingFrame(rect.width,rect.height,left,right);
}
