/** Preserve horizontal framing when panels make the canvas taller than it is wide. */
export function getViewportCameraScale(aspect: number): number {
  return Math.max(1, 1 / Math.max(.25, Number.isFinite(aspect) && aspect > 0 ? aspect : 1));
}
export function getFittedCameraPosition(position: readonly [number,number,number], target: readonly [number,number,number], aspect: number): [number,number,number] {
  const scale=getViewportCameraScale(aspect);
  return [target[0]+(position[0]-target[0])*scale,target[1]+(position[1]-target[1])*scale,target[2]+(position[2]-target[2])*scale];
}

export function getPartFocusDistance(scale: readonly [number,number,number], aspect:number):number {
  const width=Math.max(...scale);
  return Math.max(7.5,width*.7/(Math.tan(22*Math.PI/180)*Math.max(.25,Math.min(1,aspect))));
}
