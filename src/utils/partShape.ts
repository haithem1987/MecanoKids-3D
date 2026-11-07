import {PartShapeKind, type PartSpec} from '../types/game';
const svg=(content:string)=>`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;
function profile(points:readonly [number,number][],fill:string):string{
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const scale=34/Math.max(maxX-minX,maxY-minY,.001),cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  return svg(`<polygon points="${points.map(([x,y])=>`${20+(x-cx)*scale},${20-(y-cy)*scale}`).join(' ')}" fill="${fill}" stroke="#475569" stroke-width="1.2"/>`);
}
/** Decorative thumbnails follow geometry, so language changes do not change their meaning. */
export function getPartShapeSvg(roleHint: string, color: string, spec?: PartSpec): string {
  const canonical:Partial<Record<PartShapeKind,string>>={
    [PartShapeKind.WHEEL_AXLE]:'wheel',[PartShapeKind.CAR_CHASSIS]:'chassis',[PartShapeKind.ENGINE_BLOCK]:'engine',
    [PartShapeKind.CAR_CABIN]:'cab',[PartShapeKind.PLANE_PROPELLER]:'propeller',[PartShapeKind.HELI_MAIN_BLADES]:'propeller',
    [PartShapeKind.SUPPORT_FRAME]:'frame',[PartShapeKind.HELI_CABIN]:'cab',[PartShapeKind.BOAT_CABIN]:'cab',
  };
  const r = (spec && canonical[spec.shape] || roleHint).toLowerCase();
  const fill = /^#[0-9a-f]{3,8}$/i.test(color)?color:'#64748b';
  if(spec){
    const shape=spec.shape;
    if(shape===PartShapeKind.ARCH_STONE&&spec.archStone){
      const a=spec.archStone,points:[number,number][]=[];
      for(let i=0;i<=20;i++){const angle=a.startAngle+(a.endAngle-a.startAngle)*i/20;points.push([a.outerRadius*Math.cos(angle),a.outerRadius*Math.sin(angle)]);}
      if(a.innerRadius>0)for(let i=20;i>=0;i--){const angle=a.startAngle+(a.endAngle-a.startAngle)*i/20;points.push([a.innerRadius*Math.cos(angle),a.innerRadius*Math.sin(angle)]);}else points.push([0,0]);
      return profile(points,fill);
    }
    if(shape===PartShapeKind.ARCH_SPANDREL&&spec.archSpandrel){
      const a=spec.archSpandrel,points:[number,number][]=[[0,a.radius]];
      for(let i=1;i<=20;i++){const angle=Math.PI/2*(1-i/20);points.push([a.side*a.radius*Math.cos(angle),a.radius*Math.sin(angle)]);}points.push([a.side*a.halfWidth,0],[a.side*a.halfWidth,a.radius]);return profile(points,fill);
    }
    if(shape===PartShapeKind.APPARATUS_BASE){
      const [x,y,z]=spec.scale,project=(a:number,b:number,c:number):[number,number]=>[a-c,b+(a+c)*.35];
      const vertices=[project(-x/2,y/2,-z/2),project(x/2,y/2,-z/2),project(x/2,y/2,z/2),project(-x/2,y/2,z/2),project(x/2,-y/2,-z/2),project(x/2,-y/2,z/2),project(-x/2,-y/2,z/2)];
      const xs=vertices.map(p=>p[0]),ys=vertices.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2,scale=34/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));
      const face=(indices:number[],opacity:number)=>`<polygon points="${indices.map(i=>`${20+(vertices[i][0]-cx)*scale},${20-(vertices[i][1]-cy)*scale}`).join(' ')}" fill="${fill}" opacity="${opacity}" stroke="#475569" stroke-width=".8"/>`;
      return svg(face([0,1,2,3],.65)+face([1,4,5,2],.85)+face([2,5,6,3],1));
    }
    if(shape===PartShapeKind.LAB_CYLINDER||shape===PartShapeKind.PENDULUM_ROD){
      const max=Math.max(spec.scale[0],spec.scale[1]),width=Math.max(4,30*spec.scale[0]/max),height=Math.max(3,28*spec.scale[1]/max),x=(40-width)/2,y=(40-height)/2,ry=Math.min(5,width/5);
      return svg(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="#475569"/><ellipse cx="20" cy="${y+height}" rx="${width/2}" ry="${ry}" fill="${fill}" stroke="#475569"/><ellipse cx="20" cy="${y}" rx="${width/2}" ry="${ry}" fill="${fill}" stroke="#475569"/>`);
    }
    if([PartShapeKind.PENDULUM_BOB,PartShapeKind.ATOM_HYDROGEN,PartShapeKind.ATOM_OXYGEN,PartShapeKind.ATOM_CARBON].includes(shape))return svg(`<circle cx="20" cy="20" r="15" fill="${fill}" stroke="#475569"/><ellipse cx="15" cy="13" rx="5" ry="3" fill="white" opacity=".5"/>`);
    if(shape===PartShapeKind.LAB_CONE)return svg(`<path d="M5 32L20 5L35 32Z" fill="${fill}" stroke="#475569"/><ellipse cx="20" cy="32" rx="15" ry="4" fill="${fill}" stroke="#475569"/>`);
    if(shape===PartShapeKind.WIRE_JUMPER)return svg(`<path d="M4 31C5 2 35 2 36 31" fill="none" stroke="${fill}" stroke-width="4"/><path d="M4 31V37M36 31V37" stroke="#64748b" stroke-width="3"/>`);
    if(shape===PartShapeKind.RESISTOR)return svg(`<path d="M1 20H39" stroke="#64748b" stroke-width="3"/><rect x="8" y="13" width="24" height="14" rx="4" fill="${fill}" stroke="#475569"/><path d="M14 13V27M20 13V27M26 13V27" stroke="#475569" stroke-width="2"/>`);
    if(shape===PartShapeKind.LED_COMPONENT)return svg(`<path d="M14 27V37M26 27V37" stroke="#64748b" stroke-width="2"/><path d="M10 27V17A10 10 0 0 1 30 17V27Z" fill="${fill}" stroke="#475569"/><path d="M5 9L2 6M35 9L38 6M20 3V0" stroke="#64748b" stroke-width="2"/>`);
    if(shape===PartShapeKind.SOLAR_PANEL||shape===PartShapeKind.SOLAR_PANEL_ARRAY)return svg(`<path d="M6 9H34V32H6Z" fill="${fill}" stroke="#475569"/><path d="M15 9V32M25 9V32M6 20H34" stroke="white" stroke-width="1.3"/>`);
  }
  const stroke = 'rgba(0,0,0,0.18)';

  if (r.includes('roue') || r.includes('wheel') || r.includes('tire') || r.includes('pneu')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><circle cx="20" cy="20" r="8" fill="white" stroke="${stroke}" stroke-width="1.5"/></svg>`;
  }
  if (r.includes('châssis') || r.includes('chassis') || r.includes('frame') || r.includes('cadre')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="2" y="13" width="36" height="14" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><ellipse cx="11" cy="20" rx="4" ry="4" fill="white" stroke="${stroke}" stroke-width="1"/><ellipse cx="29" cy="20" rx="4" ry="4" fill="white" stroke="${stroke}" stroke-width="1"/></svg>`;
  }
  if (r.includes('moteur') || r.includes('engine') || r.includes('motor')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="8" y="10" width="24" height="20" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><rect x="2" y="14" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/><rect x="2" y="21" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/><rect x="32" y="14" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/><rect x="32" y="21" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/></svg>`;
  }
  if (r.includes('habitacle') || r.includes('cab') || r.includes('cockpit') || r.includes('cabine')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="8,30 32,30 28,12 12,12" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/></svg>`;
  }
  if (r.includes('hélice') || r.includes('helice') || r.includes('propeller') || r.includes('propulseur')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="20" cy="11" rx="5" ry="9" fill="${fill}" stroke="${stroke}" stroke-width="1.2" transform="rotate(0 20 20)"/><ellipse cx="20" cy="11" rx="5" ry="9" fill="${fill}" stroke="${stroke}" stroke-width="1.2" transform="rotate(120 20 20)"/><ellipse cx="20" cy="11" rx="5" ry="9" fill="${fill}" stroke="${stroke}" stroke-width="1.2" transform="rotate(240 20 20)"/><circle cx="20" cy="20" r="3.5" fill="white" stroke="${stroke}" stroke-width="1"/></svg>`;
  }
  return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="20,3 37,20 20,37 3,20" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/></svg>`;
}
