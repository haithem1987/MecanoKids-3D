import { HERITAGE_BUILD_TEXT, HERITAGE_PART_TEXT, HERITAGE_JUNIOR_TEXT, MASTER_BUILD_TEXT } from '../i18n/translations';
import { DifficultyTier, PartAnimationKind, PartShapeKind, VehicleCategory, type PartSpec, type VehicleBlueprint } from '../types/game';
import { bridgeParts } from './masterBlueprints';
type V = [number, number, number];
const box = PartShapeKind.APPARATUS_BASE;
const wood = '#a97642';
const stone = '#b8a88d';
function part(id: string, label: keyof typeof HERITAGE_PART_TEXT, scale: V, targetPos: V, dependsOn: string[] = [], primaryColor = stone, targetRot?: V, shape = box): PartSpec {
  const text = HERITAGE_PART_TEXT[label];
  return { id, name: text.name[0], nameEn: text.name[1], nameAr: text.name[2], roleHint: text.hint[0], roleHintEn: text.hint[1], roleHintAr: text.hint[2],
    shape, scale, targetPos, dependsOn, primaryColor, secondaryColor: '#64748b', materialKind: 'body', targetRot,
    explodeOffset: [targetPos[0] * .3, .6, targetPos[2] * .3], snapRadius: .6 };
}
function castle(): PartSpec[] {
  const p = [part('foundation', 'base', [3.5, .14, 3.5], [0, .13, 0])];
  // Four corner towers: separate structural storeys and four crown blocks each.
  for (const x of [-1.35, 1.35]) for (const z of [-1.35, 1.35]) {
    let anchor = 'foundation';
    for (let level = 0; level < 3; level++) {
      const id = `tower-${x}-${z}-${level}`;
      p.push(part(id, 'tower', [.58, .40, .58], [x, .4 + level * .4, z], [anchor])); anchor = id;
    }
    for (const dx of [-.20, .20]) for (const dz of [-.20, .20]) p.push(part(`crown-${x}-${z}-${dx}-${dz}`, 'battlement', [.18, .20, .18], [x + dx, 1.5, z + dz], [anchor]));
  }
  // Each wall is three courses. The front deliberately retains a central gateway.
  for (const side of [-1, 1]) for (let section = 0; section < 3; section++) {
    const offset = (section - 1) * .72;
    for (let level = 0; level < 2; level++) {
      const id = `side-${side}-${section}-${level}`;
      p.push(part(id, 'wall', [.22, .40, .72], [side * 1.35, .4 + .4 * level, offset], [level ? `side-${side}-${section}-0` : 'foundation']));
    }
    p.push(part(`side-top-${side}-${section}`, 'battlement', [.22, .20, .28], [side * 1.35, 1.10, offset], [`side-${side}-${section}-1`]));
  }
  for (let section = 0; section < 3; section++) for (let level = 0; level < 2; level++) {
    const id = `rear-${section}-${level}`;
    p.push(part(id, 'wall', [.72, .4, .22], [(section - 1) * .72, .4 + level * .4, -1.35], [level ? `rear-${section}-0` : 'foundation']));
  }
  for (const side of [-1, 1]) for (let level = 0; level < 2; level++) p.push(part(`jamb-${side}-${level}`, 'wall', [.72, .4, .22], [side * .72, .4 + level * .4, 1.35], [level ? `jamb-${side}-0` : 'foundation']));
  p.push(part('gate-lintel', 'lintel', [1.44, .22, .28], [0, 1.11, 1.35], ['jamb--1-1', 'jamb-1-1']));
  for (const x of [-.55, 0, .55]) p.push(part(`gate-crown-${x}`, 'battlement', [.2, .18, .28], [x, 1.31, 1.35], ['gate-lintel']));
  return p;
}
function yurt(): PartSpec[] {
  const p = [part('floor', 'floor', [2.9, .12, 2.9], [0, .12, 0], [], wood)];
  const n = 12, radius = 1.25;
  const posts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = i * Math.PI * 2 / n, id = `post-${i}`; posts.push(id);
    p.push(part(id, 'post', [.09, 1.0, .09], [radius * Math.cos(a), .68, radius * Math.sin(a)], ['floor'], wood));
  }
  p.push(part('roof-ring', 'beam', [.42, .10, .42], [0, 1.73, 0], posts, wood, undefined, PartShapeKind.LAB_CYLINDER));
  for (let i = 0; i < n; i++) {
    const a = i * Math.PI * 2 / n;
    // A Y-axis rod joins the eave (r=1.25,y=1.18) to the ring (r=.2,y=1.73).
    const length = Math.hypot(1.05, .55), tilt = Math.atan2(1.05, .55);
    p.push(part(`rafter-${i}`, 'pole', [.065, length, .065], [.725 * Math.cos(a), 1.455, .725 * Math.sin(a)], [`post-${i}`, 'roof-ring'], wood, [0, -a, tilt], PartShapeKind.LAB_CYLINDER));
    if (i !== 3) {
      const b = a + Math.PI / n, chord = 2 * radius * Math.sin(Math.PI / n);
      p.push(part(`felt-${i}`, 'cover', [chord, .94, .045], [radius * Math.cos(Math.PI / n) * Math.cos(b), .69, radius * Math.cos(Math.PI / n) * Math.sin(b)], [`post-${i}`, `post-${(i + 1) % n}`], '#e7d8bd', [0, Math.PI / 2 - b, 0]));
    }
  }
  const entryA = Math.PI / 2, entryB = 2 * Math.PI / 3;
  for (const [index, a] of [entryA, entryB].entries()) p.push(part(`door-jamb-${index}`, 'post', [.12, 1.0, .12], [radius * Math.cos(a), .68, radius * Math.sin(a)], [`post-${index + 3}`], wood));
  const doorAngle = (entryA + entryB) / 2;
  p.push(part('door-lintel', 'lintel', [2 * radius * Math.sin(Math.PI / n) + .12, .12, .12], [radius * Math.cos(Math.PI / n) * Math.cos(doorAngle), 1.18, radius * Math.cos(Math.PI / n) * Math.sin(doorAngle)], ['door-jamb-0', 'door-jamb-1'], wood, [0, Math.PI / 2 - doorAngle, 0]));
  p.push(part('felt-roof', 'roof', [2.66, .70, 2.66], [0, 1.51, 0], Array.from({length:n}, (_,i)=>`rafter-${i}`), '#ead6af', undefined, PartShapeKind.LAB_CONE));
  return p;
}
function gantry(): PartSpec[] {
  const p: PartSpec[] = [];
  for (const side of [-1, 1]) {
    const x = side * 1.24, foot = `foot-${side}`;
    p.push(part(foot, 'base', [.65, .18, 1.50], [x, .15, 0], [], '#475569'));
    for (const lane of [-1, 1]) {
      const z = lane * .48;
      let anchor = foot;
      for (let level = 0; level < 3; level++) {
        const id = `post-${side}-${lane}-${level}`;
        p.push(part(id, 'post', [.14, .50, .14], [x, .49 + level * .50, z], [anchor], '#e7a62f')); anchor = id;
      }
    }
    for (let level = 0; level < 3; level++) {
      const ids = [-1, 1].map(lane=>`post-${side}-${lane}-${level}`);
      p.push(part(`tie-${side}-${level}`, 'beam', [.18, .10, .96], [x, .70 + level * .5, 0], ids, '#64748b'));
      const length = Math.hypot(.96, .50);
      p.push(part(`brace-${side}-${level}`, 'brace', [.075, length, .075], [x, .49 + level * .50, 0], ids, '#475569', [Math.atan2(.96, .5), 0, 0]));
    }
    p.push(part(`cap-${side}`, 'beam', [.34, .15, 1.20], [x, 1.815, 0], [-1, 1].map(lane=>`post-${side}-${lane}-2`), '#e7a62f'));
  }
  for (const lane of [-1, 1]) for (let section = 0; section < 4; section++) {
    const id = `bridge-${lane}-${section}`;
    p.push(part(id, 'beam', [.62, .18, .12], [-.93 + section * .62, 1.98, lane * .43], ['cap--1', 'cap-1'], '#e7a62f'));
  }
  for (let section = 0; section < 5; section++) p.push(part(`cross-${section}`, 'beam', [.10, .09, .86], [-1.24 + section * .62, 2.105, 0], ['cap--1', 'cap-1', ...[-1,1].flatMap(lane=>Array.from({length:4},(_,i)=>`bridge-${lane}-${i}`))], '#475569'));
  p.push(part('trolley', 'trolley', [.55, .14, 1.02], [0, 2.22, 0], ['cross-2'], '#2563eb'));
  p.push(part('winch', 'winch', [.25, .42, .25], [0, 2.40, 0], ['trolley'], '#64748b', [Math.PI / 2, 0, 0], PartShapeKind.LAB_CYLINDER));
  p.push(part('cable', 'cable', [.045, 1.595, .045], [0, 1.6025, 0], ['winch'], '#334155'));
  p.push(part('load', 'load', [.50, .42, .50], [0, .595, 0], ['cable'], '#a97642'));
  return p;
}
function truss(): PartSpec[] {
  const p = bridgeParts();
  for (const lane of [-1, 1]) {
    const z = lane * .55;
    for (let i=0;i<4;i++) p.push(part(`truss-post-${lane}-${i}`, 'post', [.095,.60,.095], [-1.8+i*1.2,1.47,z], [`cap-${i}`, ...(i<3?[`rail-${i}-${lane}`]:[`rail-2-${lane}`])], '#2563eb'));
    for (let i=0;i<3;i++) {
      const anchors=[`truss-post-${lane}-${i}`,`truss-post-${lane}-${i+1}`],x=-1.2+i*1.2;
      p.push(part(`truss-chord-${lane}-${i}`, 'beam', [1.2,.095,.095], [x,1.77,z], anchors, '#2563eb'));
      p.push(part(`truss-diagonal-${lane}-${i}`, 'brace', [.075,Math.hypot(1.2,.60),.075], [x,1.47,z], anchors, '#d97706', [0,0,(i%2?1:-1)*Math.atan2(1.2,.60)]));
    }
  }
  return p;
}
function temple(): PartSpec[] {
  const p:PartSpec[]=[];
  for(let level=0;level<3;level++) p.push(part(`plinth-${level}`,'base',[3.2-level*.30,.12,3.6-level*.3],[0,.12+level*.12,0],level?[`plinth-${level-1}`]:[],'#cfc2a6'));
  const capitals:string[]=[];
  for(const side of [-1,1]) for(let row=0;row<4;row++) {
    let anchor='plinth-2'; const x=side*.95,z=-1.1+row*(2.2/3);
    for(let level=0;level<4;level++) {const id=`drum-${side}-${row}-${level}`;p.push(part(id,'drum',[.30,.26,.30],[x,.55+level*.26,z],[anchor],'#e7ddc9',undefined,PartShapeKind.LAB_CYLINDER));anchor=id;}
    const cap=`capital-${side}-${row}`;capitals.push(cap);p.push(part(cap,'capital',[.44,.12,.44],[x,1.52,z],[anchor],'#e7ddc9'));
  }
  const beams:string[]=[];
  for(const side of [-1,1]) {
    const id=`long-beam-${side}`;beams.push(id);p.push(part(id,'beam',[.30,.16,2.64],[side*.95,1.66,0],capitals.filter(id=>id.startsWith(`capital-${side}-`)),'#d1bea1'));
    const end=`end-beam-${side}`;beams.push(end);p.push(part(end,'beam',[1.90,.16,.30],[0,1.66,side*1.1],[`capital--1-${side<0?0:3}`,`capital-1-${side<0?0:3}`],'#d1bea1'));
  }
  const halfWidth=1.12/2,angle=.5;
  for(const side of [-1,1]) p.push(part(`roof-${side}`,'roofPanel',[1.12,.10,2.84],[side*halfWidth*Math.cos(angle),1.74+halfWidth*Math.sin(angle),0],beams,'#b96c44',[0,0,-side*angle]));
  return p;
}
export const WATERWHEEL_PIVOT: V = [.6,.92,.9];
function watermill(): PartSpec[] {
  const p=[part('mill-floor','floor',[2.6,.14,2],[0,.13,-.3],[],stone)];
  for(const x of [-.9,.9])for(const z of [-1,-.1])for(let level=0;level<2;level++) p.push(part(`mill-post-${x}-${z}-${level}`,'post',[.14,.70,.14],[x,.55+level*.7,z],[level?`mill-post-${x}-${z}-0`:'mill-floor'],wood));
  const beams:string[]=[];
  for(const side of [-1,1]){
    const z=side<0?-1:-.1;
    const a=`mill-beam-x-${side}`,b=`mill-beam-z-${side}`;beams.push(a,b);
    p.push(part(a,'beam',[1.94,.12,.14],[0,1.66,z],[-.9,.9].map(x=>`mill-post-${x}-${z}-1`),wood));
    p.push(part(b,'beam',[.14,.12,.9],[side*.9,1.66,-.55],[-1,-.1].map(z=>`mill-post-${side*.9}-${z}-1`),wood));
  }
  for(const side of [-1,1]) p.push(part(`mill-roof-${side}`,'roofPanel',[1.1,.10,1.22],[side*.55*Math.cos(.5),1.72+.55*Math.sin(.5),-.55],beams,'#aa6346',[0,0,-side*.5]));
  for(const x of [-.6,0,.6])p.push(part(`mill-rear-${x}`,'infill',[.6,.60,.10],[x,.50,-1],['mill-floor'],stone));
  for(const side of [-1,1])p.push(part(`mill-side-${side}`,'infill',[.10,.60,.9],[side*.9,.50,-.55],['mill-floor'],stone));
  p.push(part('mill-rear-upper','infill',[1.8,.60,.10],[0,1.1,-1],['mill-rear--0.6','mill-rear-0','mill-rear-0.6'],stone));
  for(const [i,z]of[-.6,1.15].entries()){
    p.push(part(`bearing-foot-${i}`,'base',[.44,.14,.40],[.6,.13,z],['mill-floor'],stone));
    p.push(part(`bearing-post-${i}`,'post',[.20,.61,.20],[.6,.505,z],[`bearing-foot-${i}`],wood));
    p.push(part(`bearing-${i}`,'bearing',[.24,.22,.20],[.6,.92,z],[`bearing-post-${i}`],'#64748b'));
  }
  p.push(part('wheel-shaft','shaft',[.10,1.95,.10],[.6,.92,.275],['bearing-0','bearing-1'],'#64748b',[Math.PI/2,0,0],PartShapeKind.LAB_CYLINDER));
  const moving=(piece:PartSpec)=>{piece.animation=PartAnimationKind.SPIN_Z;piece.motionPivot=[...WATERWHEEL_PIVOT];piece.animationSpeed=.8;p.push(piece);};
  moving(part('waterwheel-hub','hub',[.25,.46,.25],WATERWHEEL_PIVOT,['wheel-shaft'],wood,[Math.PI/2,0,0],PartShapeKind.LAB_CYLINDER));
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    moving(part(`waterwheel-spoke-${i}`,'spoke',[.065,.65,.08],[.6+.325*Math.cos(a),.92+.325*Math.sin(a),.9],['waterwheel-hub'],wood,[0,0,a-Math.PI/2]));
  }
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,b=a+Math.PI/8,r=.65*Math.cos(Math.PI/8);
    moving(part(`waterwheel-rim-${i}`,'rim',[2*.65*Math.sin(Math.PI/8),.065,.10],[.6+r*Math.cos(b),.92+r*Math.sin(b),.9],[`waterwheel-spoke-${i}`,`waterwheel-spoke-${(i+1)%8}`],wood,[0,0,b+Math.PI/2]));
    moving(part(`waterwheel-paddle-${i}`,'paddle',[.16,.10,.38],[.6+.65*Math.cos(a),.92+.65*Math.sin(a),.9],[`waterwheel-rim-${i}`,`waterwheel-rim-${(i+7)%8}`],wood,[0,0,a]));
  }
  for(let i=0;i<4;i++)p.push(part(`channel-floor-${i}`,'channel',[.60,.08,.58],[-.3+i*.6,.22,.9],['mill-floor'],'#83949c'));
  for(const side of [-1,1])p.push(part(`channel-wall-${side}`,'channel',[2.40,.18,.08],[.6,.31,.9+side*.33],Array.from({length:4},(_,i)=>`channel-floor-${i}`),'#83949c'));
  return p;
}
function keep(): PartSpec[] {
  const p=[part('keep-foundation','base',[1.55,.14,1.55],[0,.13,0])];
  const tops:string[]=[];
  for(let side=0;side<3;side++){
    let anchor='keep-foundation';
    for(let level=0;level<3;level++){
      const id=`keep-wall-${side}-${level}`,x=side===0?0:side===1?-.6:.6,z=side===0?-.6:0;
      p.push(part(id,'wall',side===0?[1.2,.35,.18]:[.18,.35,1.2],[x,.375+level*.35,z],[anchor]));anchor=id;
    }
    tops.push(anchor);
  }
  for(const side of [-1,1])for(let level=0;level<2;level++)p.push(part(`keep-jamb-${side}-${level}`,'wall',[.24,.35,.18],[side*.38,.375+level*.35,.6],[level?`keep-jamb-${side}-0`:'keep-foundation']));
  p.push(part('keep-lintel','lintel',[1.2,.35,.18],[0,1.075,.6],['keep-jamb--1-1','keep-jamb-1-1']));
  p.push(part('keep-platform','floor',[1.38,.10,1.38],[0,1.30,0],[...tops,'keep-lintel']));
  for(const x of [-.55,0,.55])for(const z of [-.55,0,.55])if(x!==0||z!==0)p.push(part(`keep-merlon-${x}-${z}`,'battlement',[.24,.24,.24],[x,1.47,z],['keep-platform']));
  return p;
}
function beacon():PartSpec[]{
  const p=[part('beacon-foundation','base',[2.6,.14,2.4],[0,.13,0],[],'#94a3b8')];
  for(const x of [-.45,.45])for(const z of [-.4,.4]){
    const foot=`beacon-foot-${x}-${z}`;p.push(part(foot,'base',[.28,.10,.28],[x,.25,z],['beacon-foundation'],'#64748b'));
    for(let level=0;level<3;level++)p.push(part(`beacon-post-${x}-${z}-${level}`,'post',[.10,.48,.10],[x,.54+level*.48,z],[level?`beacon-post-${x}-${z}-${level-1}`:foot],'#e7a62f'));
  }
  const tops:string[]=[];
  for(let level=0;level<3;level++)for(const side of [-1,1]){
    const a=`beacon-tie-x-${side}-${level}`,b=`beacon-tie-z-${side}-${level}`;
    p.push(part(a,'beam',[.9,.08,.10],[0,.78+level*.48,side*.4],[-.45,.45].map(x=>`beacon-post-${x}-${side*.4}-${level}`),'#64748b'));
    p.push(part(b,'beam',[.10,.08,.8],[side*.45,.78+level*.48,0],[-.4,.4].map(z=>`beacon-post-${side*.45}-${z}-${level}`),'#64748b'));
    if(level===2)tops.push(a,b);
  }
  p.push(part('beacon-platform','floor',[1.1,.10,1.05],[0,1.83,0],tops,'#94a3b8'));
  p.push(part('beacon-battery-cradle','base',[.50,.24,.50],[-.8,.32,-.65],['beacon-foundation'],'#475569'));
  p.push(part('beacon-battery','battery',[.40,.20,.32],[-.8,.54,-.65],['beacon-battery-cradle'],'#e7a62f'));
  p.push(part('beacon-selector-base','base',[.48,.06,.50],[.75,.23,.7],['beacon-foundation'],'#475569'));
  p.push(part('beacon-selector','selector',[.42,.28,.44],[.75,.40,.7],['beacon-selector-base'],'#a78bfa'));
  for(const side of [-1,1]){
    p.push(part(`beacon-solar-mount-${side}`,'beam',[.55,.15,1.10],[side*.6,1.955,0],['beacon-platform'],'#64748b'));
    for(const lane of [-1,1])p.push(part(`beacon-solar-${side}-${lane}`,'solar',[.55,.05,.52],[side*.6,2.055,lane*.28],[`beacon-solar-mount-${side}`],'#1e40af',undefined,PartShapeKind.SOLAR_PANEL));
  }
  p.push(part('beacon-lamp','lamp',[.30,.40,.30],[0,2.02,0],['beacon-platform'],'#facc15',undefined,PartShapeKind.LED_COMPONENT));
  p.push(part('beacon-resistor-base','base',[.34,.10,.50],[.7,.25,.10],['beacon-foundation'],'#475569'));
  p.push(part('beacon-resistor','resistor',[.18,.16,.40],[.7,.37,.10],['beacon-resistor-base'],'#e7a62f',undefined,PartShapeKind.RESISTOR));
  p.push(part('beacon-collector','junction',[.35,.15,.30],[0,1.955,-.30],['beacon-platform'],'#2563eb'));
  const wire=(id:string,from:string,to:string,returnPath=false)=>{
    const a=p.find(piece=>piece.id===from)!,b=p.find(piece=>piece.id===to)!;
    const endpoint=(q:PartSpec,fromEnd:boolean):V=>q.id==='beacon-resistor'
      ?[q.targetPos[0],q.targetPos[1],q.targetPos[2]+(fromEnd?-1:1)*q.scale[2]/2]
      :[q.targetPos[0]+(returnPath?-.075:.075),q.id==='beacon-lamp'?q.targetPos[1]-.35*q.scale[1]:q.targetPos[1]+q.scale[1]/2,q.targetPos[2]+(returnPath?-.06:.06)];
    const start=endpoint(a,true),end=endpoint(b,false),dx=end[0]-start[0],dy=end[1]-start[1],dz=end[2]-start[2],length=Math.hypot(dx,dy,dz);
    const piece=part(id,'wire',[.025,.035,length],start.map((v,i)=>(v+end[i])/2) as V,[from,to],returnPath?'#334155':'#ef4444',[0,-Math.atan2(dz,dx),Math.atan2(dy,Math.hypot(dx,dz))],PartShapeKind.WIRE_JUMPER);
    piece.electrical=[from,to];p.push(piece);
  };
  for(const side of [-1,1])for(const lane of [-1,1])for(const back of [false,true])wire(`beacon-wire-panel-${side}-${lane}-${back}`,`beacon-solar-${side}-${lane}`,'beacon-collector',back);
  for(const source of ['beacon-collector','beacon-battery'])for(const back of [false,true])wire(`beacon-wire-source-${source}-${back}`,source,'beacon-selector',back);
  wire('beacon-wire-limit','beacon-selector','beacon-resistor');wire('beacon-wire-lamp','beacon-resistor','beacon-lamp');wire('beacon-wire-return','beacon-lamp','beacon-selector',true);
  return p;
}
function dome():PartSpec[]{
  const p=[part('dome-foundation','base',[3.3,.12,3.3],[0,.12,0],[],'#94a3b8')];
  const base=Array.from({length:8},(_,i):V=>[1.4*Math.cos(i*Math.PI/4),.25,1.4*Math.sin(i*Math.PI/4)]);
  const middle=Array.from({length:8},(_,i):V=>[.98*Math.cos((i+.5)*Math.PI/4),1.10,.98*Math.sin((i+.5)*Math.PI/4)]);
  const apex:V=[0,1.95,0];
  const strut=(id:string,a:V,b:V,joints:[string,string],deps:string[])=>{
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],length=Math.hypot(dx,dy,dz);
    const rod=part(id,'strut',[.055,length,.055],a.map((v,i)=>(v+b[i])/2) as V,deps,'#2563eb',[0,-Math.atan2(dz,dx),-Math.acos(dy/length)],PartShapeKind.LAB_CYLINDER);
    rod.structuralJoints=joints;p.push(rod);
  };
  for(let i=0;i<8;i++)p.push(part(`dome-base-${i}`,'footJoint',[.14,.14,.14],base[i],['dome-foundation'],'#d97706',undefined,PartShapeKind.PENDULUM_BOB));
  for(let i=0;i<8;i++)strut(`dome-base-bar-${i}`,base[i],base[(i+1)%8],[`dome-base-${i}`,`dome-base-${(i+1)%8}`],[`dome-base-${i}`,`dome-base-${(i+1)%8}`]);
  for(let i=0;i<8;i++){
    for(const lane of [0,1])strut(`dome-diagonal-${i}-${lane}`,base[(i+lane)%8],middle[i],[`dome-base-${(i+lane)%8}`,`dome-middle-${i}`],[`dome-base-bar-${i}`]);
    p.push(part(`dome-middle-${i}`,'middleJoint',[.14,.14,.14],middle[i],[`dome-diagonal-${i}-0`,`dome-diagonal-${i}-1`],'#d97706',undefined,PartShapeKind.PENDULUM_BOB));
  }
  const upperRing=Array.from({length:8},(_,i)=>`dome-ring-${i}`);
  for(let i=0;i<8;i++)strut(upperRing[i],middle[i],middle[(i+1)%8],[`dome-middle-${i}`,`dome-middle-${(i+1)%8}`],[`dome-middle-${i}`,`dome-middle-${(i+1)%8}`]);
  for(let i=0;i<8;i++)strut(`dome-upper-${i}`,middle[i],apex,[`dome-middle-${i}`,'dome-apex'],upperRing);
  p.push(part('dome-apex','apexJoint',[.16,.16,.16],apex,Array.from({length:8},(_,i)=>`dome-upper-${i}`),'#d97706',undefined,PartShapeKind.PENDULUM_BOB));
  return p;
}
function aqueduct():PartSpec[]{
  const p=[part('aqueduct-foundation','base',[4.95,.14,1.5],[0,.13,0],[],stone)];
  for(let i=0;i<4;i++){
    const x=-2.25+i*1.5;
    p.push(part(`aqueduct-foot-${i}`,'base',[.48,.10,.70],[x,.25,0],['aqueduct-foundation'],stone));
    for(let level=0;level<2;level++)p.push(part(`aqueduct-pier-${i}-${level}`,'tower',[.34,.25,.60],[x,.425+level*.25,0],[level?`aqueduct-pier-${i}-0`:`aqueduct-foot-${i}`],stone));
  }
  for(let span=0;span<3;span++){
    const x=-1.5+span*1.5;
    const posts=[-1,1].map(side=>`centering-post-${span}-${side}`);
    for(const side of [-1,1]){const support=part(`centering-post-${span}-${side}`,'post',[.10,.60,.24],[x+side*.35,.50,0],['aqueduct-foundation'],wood);support.temporarySupport=true;p.push(support);}
    const form=part(`centering-${span}`,'centering',[1.04,.52,.40],[x,1.06,0],posts,wood,undefined,PartShapeKind.ARCH_STONE);
    form.archStone={innerRadius:0,outerRadius:.52,startAngle:0,endAngle:Math.PI};form.temporarySupport=true;p.push(form);
    const stones=Array.from({length:7},(_,i)=>`arch-stone-${span}-${i}`);
    for(let i=0;i<7;i++){
      const start=i*Math.PI/7+.0015,end=(i+1)*Math.PI/7-.0015,mid=(start+end)/2;
      const deps=i===3?[stones[2],stones[4]]:i<3?[i===0?`aqueduct-pier-${span+1}-1`:stones[i-1]]:[i===6?`aqueduct-pier-${span}-1`:stones[i+1]];
      const stonePart=part(stones[i],i===3?'keystone':'voussoir',[.30,.30,.48],[x+.61*Math.cos(mid),.80+.61*Math.sin(mid),0],[`centering-${span}`,...deps],i===3?'#c7a36a':stone,undefined,PartShapeKind.ARCH_STONE);
      stonePart.archStone={innerRadius:.52,outerRadius:.70,startAngle:start,endAngle:end};p.push(stonePart);
    }
    const fills:string[]=[];
    for(const side of [-1,1]){
      const id=`aqueduct-fill-${span}-${side}`;fills.push(id);
      const fill=part(id,'spandrel',[.75,.70,.48],[x+side*.375,1.15,0],stones,stone,undefined,PartShapeKind.ARCH_SPANDREL);fill.archSpandrel={radius:.70,halfWidth:.75,side:side as -1|1};p.push(fill);
    }
    p.push(part(`aqueduct-deck-${span}`,'channel',[1.5,.16,.68],[x,1.58,0],fills,stone));
    for(const side of [-1,1])p.push(part(`aqueduct-wall-${span}-${side}`,'channel',[1.5,.22,.08],[x,1.77,side*.30],[`aqueduct-deck-${span}`],stone));
  }
  return p;
}
function blueprint(key: keyof typeof HERITAGE_BUILD_TEXT, category: VehicleCategory, parts: PartSpec[], difficulty = DifficultyTier.MASTER): VehicleBlueprint {
  const t = HERITAGE_BUILD_TEXT[key], tier = difficulty === DifficultyTier.DISCOVERY ? HERITAGE_JUNIOR_TEXT.tier : MASTER_BUILD_TEXT.tier;
  const age = difficulty === DifficultyTier.DISCOVERY ? HERITAGE_JUNIOR_TEXT.age : MASTER_BUILD_TEXT.tier;
  const discovery = (i: 0|1|2) => ({ howItWorks: t.why[i], realRecord: t.goal[i], didYouKnow: t.fact[i] });
  return { id: `expansion-${key}`, stageNumber: 0, category, tier: difficulty, masterExpansion: true, staticStructure: true,
    name:t.name[0],nameEn:t.name[1],nameAr:t.name[2],subtitle:t.goal[0],subtitleEn:t.goal[1],subtitleAr:t.goal[2],
    tierLabel:tier[0],tierLabelEn:tier[1],tierLabelAr:tier[2],ageNote:age[0],ageNoteEn:age[1],ageNoteAr:age[2],
    parts,interactiveTrial:key==='watermill'?'watermill':key==='beacon'?'beacon':key==='aqueduct'?'aqueduct':undefined,discovery:discovery(0),discoveryEn:discovery(1),discoveryAr:discovery(2),discoveryMode:'observation' };
}
export const HERITAGE_BLUEPRINTS = [blueprint('gantry',VehicleCategory.CONSTRUCTION,gantry()),blueprint('castle',VehicleCategory.HISTORY,castle()),blueprint('yurt',VehicleCategory.HISTORY,yurt()),blueprint('truss',VehicleCategory.CONSTRUCTION,truss()),blueprint('temple',VehicleCategory.HISTORY,temple()),blueprint('watermill',VehicleCategory.HISTORY,watermill()),blueprint('keep',VehicleCategory.HISTORY,keep(),DifficultyTier.DISCOVERY),blueprint('beacon',VehicleCategory.ELECTRONICS,beacon()),blueprint('dome',VehicleCategory.PHYSICS,dome()),blueprint('aqueduct',VehicleCategory.HISTORY,aqueduct())];
