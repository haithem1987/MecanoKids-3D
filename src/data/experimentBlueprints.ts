import { EXPERIMENT_PART_TEXT } from '../i18n/translations';
import { PartAnimationKind as A, PartShapeKind as S, PartSpec, VehicleBlueprint } from '../types/game';

type Vec = [number, number, number];
type Label = keyof typeof EXPERIMENT_PART_TEXT;
const palette = { base: '#475569', primary: '#f59e0b', metal: '#cbd5e1', red: '#ef4444', blue: '#38bdf8', white: '#f8fafc' };

function part(id: string, label: Label, shape: S, scale: Vec, targetPos: Vec, dependsOn: string[] = [], color = palette.primary): PartSpec {
  const text = EXPERIMENT_PART_TEXT[label];
  return { id, shape, scale, targetPos, dependsOn,
    name: text.name[0], nameEn: text.name[1], nameAr: text.name[2],
    roleHint: text.hint[0], roleHintEn: text.hint[1], roleHintAr: text.hint[2],
    primaryColor: color, secondaryColor: palette.metal, materialKind: 'body',
    explodeOffset: [targetPos[0] * 0.7, 0.65, targetPos[2] * 0.7], snapRadius: 1.2 };
}

function beam(id: string, label: Label, shape: S, from: Vec, to: Vec, dependsOn: string[], thickness = 0.07, color = palette.metal): PartSpec {
  const segment = segmentTransform(from, to, 'y');
  return { ...part(id, label, shape, [thickness, thickness, segment.length],
    segment.position, dependsOn, color), targetRot: segment.rotation };
}

// Data construction must not eagerly import the Three.js runtime.
function segmentTransform(from: Vec, to: Vec, axis: 'x' | 'y'): { length: number; position: Vec; rotation: Vec } {
  const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
  const length = Math.hypot(dx, dy, dz);
  const clamp = (value: number) => Math.max(-1, Math.min(1, value));
  return { length, position: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2],
    rotation: axis === 'y' ? [Math.atan2(dz, dy), 0, -Math.asin(clamp(dx / length))]
      : [0, Math.atan2(-dz, dx), Math.asin(clamp(dy / length))] };
}

const base = () => part('base', 'base', S.APPARATUS_BASE, [1.8, 0.14, 1.25], [0, 0.16, 0], [], palette.base);

function molecule(water: boolean): PartSpec[] {
  const centre: Vec = [0, 1.1, 0];
  const parts = [part('atom-central', water ? 'oxygen' : 'carbon', water ? S.ATOM_OXYGEN : S.ATOM_CARBON,
    [0.44, 0.44, 0.44], centre, [], water ? palette.red : palette.base)];
  for (const side of [-1, 1]) {
    // H–O–H has a 104.5° angle, CO₂ is linear. Keep the structural formula at every age.
    const angle = 52.25 * Math.PI / 180;
    const pos: Vec = water ? [side * Math.sin(angle) * 0.8, 1.1 - Math.cos(angle) * 0.8, 0] : [side * 0.85, 1.1, 0];
    const atomId = side < 0 ? 'atom-left' : 'atom-right';
    const bondId = side < 0 ? 'bond-left' : 'bond-right';
    const bond = beam(bondId, water ? 'single' : 'double', water ? S.BOND_SINGLE : S.BOND_DOUBLE,
      centre, pos, ['atom-central']);
    bond.bond = { atoms: ['atom-central', atomId], order: water ? 1 : 2 };
    parts.push(bond, part(atomId, water ? 'hydrogen' : 'oxygen', water ? S.ATOM_HYDROGEN : S.ATOM_OXYGEN,
      water ? [0.3, 0.3, 0.3] : [0.44, 0.44, 0.44], pos, [bondId], water ? palette.white : palette.red));
  }
  return parts;
}

function salt(): PartSpec[] {
  const parts: PartSpec[] = [];
  for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) {
    const sodium = (x + y + z) % 2 === 0;
    const index = parts.length;
    parts.push(part(`ion-${x}${y}${z}`, sodium ? 'sodium' : 'chloride', sodium ? S.ATOM_SODIUM : S.ATOM_CHLORINE,
      [0.5, 0.5, 0.5], [(x - 0.5) * 0.5, 0.6 + y * 0.5, (z - 0.5) * 0.5],
      index ? [parts[index - 1].id] : [], sodium ? '#a855f7' : '#22c55e'));
  }
  return parts;
}

function balance(): PartSpec[] {
  return [base(), part('pivot', 'fulcrum', S.FULCRUM, [0.45, 0.72, 0.4], [0, 0.59, 0], ['base'], palette.base),
    part('beam', 'lever', S.LEVER_ARM, [1.65, 0.1, 0.22], [0, 1.0, 0], ['pivot']),
    ...([-1, 1] as const).flatMap((side) => {
      const pan = side < 0 ? 'pan-left' : 'pan-right';
      return [part(pan, 'pan', S.BALANCE_PAN, [0.5, 0.14, 0.5], [side * 0.65, 1.12, 0], ['beam'], palette.metal),
        part(side < 0 ? 'load' : 'counterweight', side < 0 ? 'load' : 'counterweight', S.APPARATUS_BASE,
          [0.18, 0.18, 0.18], [side * 0.65, 1.14, 0], [pan], palette.blue)];
    })];
}

function pendulum(): PartSpec[] {
  const pivot: Vec = [0, 1.9, 0];
  return [base(), part('frame', 'frame', S.SUPPORT_FRAME, [1.25, 1.67, 0.1], [0, 1.065, 0], ['base'], palette.base),
    { ...part('rod', 'rod', S.PENDULUM_ROD, [0.045, 1.1, 0.045], [0, 1.35, 0], ['frame'], palette.metal), animation: A.PENDULUM, motionPivot: pivot },
    { ...part('bob', 'bob', S.PENDULUM_BOB, [0.34, 0.34, 0.34], [0, 0.7, 0], ['rod'], palette.blue), animation: A.PENDULUM, motionPivot: pivot }];
}

function physics(id: string): PartSpec[] {
  switch (id) {
    case 'phys-pendulum': return pendulum();
    case 'phys-lever-class1': return [base(),
      part('pivot', 'fulcrum', S.FULCRUM, [0.45, 0.5, 0.4], [0, 0.48, 0], ['base'], palette.base),
      part('lever', 'lever', S.LEVER_ARM, [1.6, 0.1, 0.24], [0, 0.78, 0], ['pivot']),
      part('load', 'load', S.APPARATUS_BASE, [0.24, 0.24, 0.24], [-0.6, 0.95, 0], ['lever'], palette.blue),
      part('counterweight', 'counterweight', S.APPARATUS_BASE, [0.24, 0.24, 0.24], [0.6, 0.95, 0], ['lever'], palette.blue)];
    case 'phys-inclined-plane': {
      const theta = Math.atan(0.6 / 1.5);
      return [base(), part('ramp', 'ramp', S.RAMP_SURFACE, [1.5, 0.6, 0.6], [0, 0.53, 0], ['base']),
        { ...part('load', 'load', S.APPARATUS_BASE, [0.22, 0.22, 0.22], [-Math.sin(theta) * 0.11, 0.53 + Math.cos(theta) * 0.11, 0], ['ramp'], palette.blue), targetRot: [0, 0, theta] }];
    }
    case 'phys-magnet-compass': return [base(),
      { ...part('magnet', 'magnet', S.MAGNET_BAR, [0.22, 0.5, 0.22], [-0.55, 0.34, 0], ['base'], palette.red), targetRot: [0, 0, -Math.PI / 2] },
      part('pivot', 'fulcrum', S.PENDULUM_ROD, [0.04, 0.22, 0.04], [0.3, 0.34, 0], ['base'], palette.metal),
      { ...part('needle', 'compass', S.COMPASS_NEEDLE, [0.16, 0.06, 0.62], [0.3, 0.45, 0], ['pivot']), targetRot: [0, Math.PI / 2, 0] }];
    case 'phys-prism-light': {
      const parts = [base(), part('lamp', 'lamp', S.LIGHT_SOURCE, [0.3, 0.25, 0.3], [-0.72, 0.38, 0], ['base'], palette.base),
        part('prism', 'prism', S.OPTICAL_PRISM, [0.42, 0.4, 0.38], [0, 0.43, 0], ['base'], palette.blue),
        part('incoming-ray', 'beam', S.LIGHT_BEAM, [0.45, 0.025, 0.025], [-0.35, 0.42, 0], ['lamp', 'prism'], palette.white)];
      ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#a855f7'].forEach((color, i) => {
        const angle = (i - 2.5) * 0.11;
        parts.push({ ...part(`spectrum-${i}`, 'beam', S.LIGHT_BEAM, [0.65, 0.025, 0.025],
          [0.2 + Math.cos(angle) * 0.325, 0.42, Math.sin(angle) * 0.325], ['prism', 'incoming-ray'], color), targetRot: [0, -angle, 0] });
      });
      return parts;
    }
    default: throw new Error(`Unknown physics experiment: ${id}`);
  }
}

function electronics(id: string): { parts: PartSpec[]; circuit: string[] } {
  const board = part('board', 'board', S.BREADBOARD, [2.1, 0.12, 1.45], [0, 0.35, 0], [], '#22c55e');
  const solar = id === 'elec-solar-toy';
  const parts = [board, part(solar ? 'solar' : 'battery', solar ? 'solar' : 'battery', solar ? S.SOLAR_PANEL : S.BATTERY_CELL,
    solar ? [0.55, 0.08, 0.4] : [0.24, 0.4, 0.24], [-0.6, solar ? 0.46 : 0.62, 0], ['board'], palette.base)];
  let circuit: string[];
  const source = solar ? 'solar' : 'battery';
  const component = (key: Label, shape: S, pos: Vec, scale: Vec = [0.25, 0.2, 0.25]) =>
    part(key, key, shape, scale, pos, ['board'], palette.blue);
  switch (id) {
    case 'elec-led-circuit':
      parts.push(component('resistor', S.RESISTOR, [0, 0.5, -0.4], [0.12, 0.12, 0.3]), component('led', S.LED_COMPONENT, [0.6, 0.55, 0.2], [0.22, 0.22, 0.22]));
      circuit = [source, 'resistor', 'led']; break;
    case 'elec-motor-fan':
    case 'elec-solar-toy':
      parts.push(component('motor', S.MICRO_MOTOR, [0.4, 0.55, 0], [0.3, 0.26, 0.3]),
        { ...part('fan', 'fan', S.FAN_BLADES, [0.6, 0.06, 0.6], [0.4, 0.82, 0], ['motor'], palette.red), animation: A.SPIN_Y });
      if (solar) parts.push(component('capacitor', S.CAPACITOR, [0, 0.57, 0.48], [0.2, 0.3, 0.2]));
      circuit = [source, 'motor']; break;
    case 'elec-alarm-buzzer':
      parts.push(component('sensor', S.LIGHT_SENSOR, [0, 0.5, -0.42]), component('buzzer', S.BUZZER, [0.6, 0.53, 0.2], [0.3, 0.22, 0.3]));
      circuit = [source, 'sensor', 'buzzer']; break;
    case 'elec-radio-receiver':
      parts.push(component('detector', S.DEMODULATOR, [0, 0.5, 0], [0.28, 0.16, 0.3]),
        component('speaker', S.SPEAKER, [0.65, 0.54, 0.2], [0.34, 0.24, 0.34]),
        component('antenna', S.ANTENNA, [-0.2, 1.05, -0.48], [0.05, 1.2, 0.05]),
        component('capacitor', S.CAPACITOR, [0.4, 0.56, -0.48], [0.18, 0.28, 0.18]));
      circuit = [source, 'detector', 'speaker']; break;
    default: throw new Error(`Unknown electronic experiment: ${id}`);
  }
  const edges: [string, string][] = circuit.map((node, i) => [node, circuit[(i + 1) % circuit.length]]);
  if (solar) edges.push(['solar', 'capacitor'], ['capacitor', 'solar']);
  if (id === 'elec-radio-receiver') edges.push(['antenna', 'capacitor'], ['capacitor', 'detector']);
  edges.forEach(([from, to], index) => {
    const a = parts.find((p) => p.id === from)!;
    const b = parts.find((p) => p.id === to)!;
    // Separate the two terminals so outgoing and return wires remain distinct.
    const start: Vec = [a.targetPos[0], a.targetPos[1] + a.scale[1] / 2, a.targetPos[2] + (a.id === 'battery' ? 0 : a.scale[2] * 0.24)];
    const end: Vec = [b.targetPos[0], b.targetPos[1] + (b.id === 'battery' ? -1 : 1) * b.scale[1] / 2, b.targetPos[2] - (b.id === 'battery' ? 0 : b.scale[2] * 0.24)];
    const segment = segmentTransform(start, end, 'x');
    parts.push({ ...part(`wire-${index}`, 'wire', S.WIRE_JUMPER, [0.035, 0.07, segment.length],
      segment.position, [from, to], index % 2 ? palette.red : palette.base),
      targetRot: segment.rotation, electrical: [from, to] });
  });
  return { parts, circuit };
}

/** Each experiment has its own inventory; difficulty never removes essential parts. */
export function buildExperiment(id: string): { parts: PartSpec[]; experiment: NonNullable<VehicleBlueprint['experiment']> } | null {
  let parts: PartSpec[];
  let kind: NonNullable<VehicleBlueprint['experiment']>['kind'] = 'apparatus';
  let circuit: string[] | undefined;
  if (id.startsWith('elec-')) {
    ({ parts, circuit } = electronics(id)); kind = 'circuit';
  } else if (id === 'chem-water-molecule' || id === 'chem-co2-molecule') {
    parts = molecule(id === 'chem-water-molecule'); kind = 'molecule';
  } else if (id === 'chem-salt-crystal') { parts = salt(); kind = 'ionic';
  } else if (id === 'chem-balance-scale') { parts = balance();
  } else if (id === 'chem-beaker-setup') {
    parts = [base(), part('stand', 'stand', S.LAB_STAND, [0.85, 1.2, 0.85], [-0.357, 0.74, 0], ['base'], palette.base),
      part('beaker', 'beaker', S.LAB_BEAKER, [0.56, 0.6, 0.56], [0, 1.16, 0], ['stand'], palette.blue)];
  } else if (id.startsWith('phys-')) { parts = physics(id);
  } else return null;
  const requiredShapes: Partial<Record<S, number>> = {};
  parts.forEach((p) => { requiredShapes[p.shape] = (requiredShapes[p.shape] ?? 0) + 1; });
  return { parts, experiment: { kind, requiredShapes, circuit } };
}
