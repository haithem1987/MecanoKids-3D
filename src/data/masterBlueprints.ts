import { MASTER_BUILD_PART_TEXT, MASTER_BUILD_TEXT } from '../i18n/translations';
import { DifficultyTier, PartShapeKind, VehicleCategory, type PartSpec, type VehicleBlueprint } from '../types/game';

type Vector = [number, number, number];
type Component = keyof typeof MASTER_BUILD_PART_TEXT;
const steel = '#64748b';
const concrete = '#94a3b8';
const blue = '#1d4ed8';
const amber = '#d97706';
const box = PartShapeKind.APPARATUS_BASE;
const cylinder = PartShapeKind.LAB_CYLINDER;

function component(
  id: string, kind: Component, scale: Vector, targetPos: Vector, primaryColor: string, dependsOn: string[] = [],
  shape = box, targetRot?: Vector,
): PartSpec {
  const { name, hint } = MASTER_BUILD_PART_TEXT[kind];
  return {
    id, name: name[0], nameEn: name[1], nameAr: name[2], roleHint: hint[0], roleHintEn: hint[1], roleHintAr: hint[2],
    shape, scale, targetPos, primaryColor, targetRot, dependsOn, secondaryColor: concrete, materialKind: 'body',
    explodeOffset: [targetPos[0] * 0.36, 0.6, targetPos[2] * 0.36], snapRadius: 0.65,
  };
}

export function bridgeParts(): PartSpec[] {
  const parts: PartSpec[] = [];
  const supports = [-1.8, -0.6, 0.6, 1.8];
  for (const [index, x] of supports.entries()) {
    const footing = `footing-${index}`;
    const columns = [-1, 1].map(side => `column-${index}-${side}`);
    parts.push(component(footing, 'footing', [0.54, 0.16, 1.26], [x, 0.14, 0], concrete));
    for (const [lane, z] of [-0.39, 0.39].entries()) {
      parts.push(component(columns[lane], 'column', [0.22, 0.44, 0.24], [x, 0.42, z], concrete, [footing]));
    }
    parts.push(component(`cap-${index}`, 'cap', [0.42, 0.12, 1.25], [x, 0.69, 0], steel, columns));
  }
  for (const [index, x] of [-1.2, 0, 1.2].entries()) {
    const girders = [-1, 1].map(side => `girder-${index}-${side}`);
    const slabs = [-1, 1].map(side => `slab-${index}-${side}`);
    for (const [lane, z] of [-0.39, 0.39].entries()) {
      parts.push(component(girders[lane], 'girder', [1.2, 0.19, 0.19], [x, 0.84, z], blue, [`cap-${index}`, `cap-${index + 1}`]));
    }
    for (const [section, dx] of [-0.3, 0.3].entries()) {
      parts.push(component(slabs[section], 'slab', [0.60, 0.14, 1.20], [x + dx, 1, 0], '#334155', girders));
    }
    for (const side of [-1, 1]) {
      parts.push(component(`rail-${index}-${side}`, 'rail', [1.20, 0.22, 0.07], [x, 1.17, side * 0.55], amber, slabs));
    }
  }
  for (const side of [-1, 1]) {
    parts.push(component(`ramp-${side}`, 'approach', [0.73, 0.14, 1.20], [side * 2.14, 0.89, 0], '#334155',
      [side < 0 ? 'slab-0--1' : 'slab-2-1'], box, [0, 0, -side * 0.32]));
  }
  return parts;
}

function stationParts(): PartSpec[] {
  const parts = [component('core', 'core', [0.94, 0.64, 1.56], [0, 1.06, 0], concrete)];
  const axis: Vector = [Math.PI / 2, 0, 0];
  for (const side of [-1, 1]) {
    parts.push(
      component(`ring-${side}`, 'collar', [0.44, 0.27, 0.44], [0, 1.06, side * 0.91], steel, ['core'], cylinder, axis),
      component(`module-${side}`, 'module', [0.65, 0.66, 0.65], [0, 1.06, side * 1.35], '#e2e8f0', [`ring-${side}`], cylinder, axis),
      component(`port-${side}`, 'port', [0.39, 0.24, 0.39], [0, 1.06, side * 1.79], amber, [`module-${side}`], cylinder, axis),
      component(`radiator-${side}`, 'radiator', [0.51, 0.08, 0.43], [0, 1.41, side * 1.34], '#f1f5f9', [`module-${side}`]),
    );
    for (const lane of [-1, 1]) {
      const wing = `${side}-${lane}`;
      const z = lane * 0.47;
      let anchor = `mount-${wing}`;
      parts.push(component(anchor, 'mount', [0.24, 0.21, 0.37], [side * 0.5, 1.06, z], steel, ['core']));
      for (let segment = 0; segment < 3; segment++) {
        const boom = `boom-${wing}-${segment}`;
        const x = side * (0.80 + segment * 0.46);
        parts.push(
          component(boom, 'boom', [0.46, 0.14, 0.15], [x, 1.06, z], steel, [anchor]),
          component(`panel-${wing}-${segment}`, 'panel', [0.42, 0.065, 0.64], [x, 1.15, z], segment % 2 ? '#2563eb' : blue, [boom]),
        );
        anchor = boom;
      }
    }
  }
  parts.push(
    component('mast', 'mast', [0.10, 0.32, 0.10], [0, 1.53, 0], steel, ['core'], cylinder),
    component('antenna', 'antenna', [0.44, 0.25, 0.44], [0, 1.72, 0], '#f8fafc', ['mast'], PartShapeKind.PARABOLIC_DISH),
  );
  return parts;
}

function roverParts(): PartSpec[] {
  const parts = [component('chassis', 'chassis', [1.36, 0.24, 2.32], [0, 0.54, 0], steel)];
  const across: Vector = [0, 0, Math.PI / 2];
  for (const [index, z] of [-0.88, 0, 0.88].entries()) {
    const axle = `axle-${index}`;
    parts.push(component(axle, 'axle', [0.15, 1.67, 0.15], [0, 0.35, z], concrete, ['chassis'], cylinder, across));
    for (const side of [-1, 1]) {
      const hub = `hub-${index}-${side}`;
      parts.push(
        component(hub, 'hub', [0.23, 0.21, 0.23], [side * 0.83, 0.35, z], amber, [axle], cylinder, across),
        component(`wheel-${index}-${side}`, 'wheel', [0.61, 0.25, 0.61], [side * 0.99, 0.35, z], '#1e293b', [hub], cylinder, across),
      );
    }
  }
  for (const side of [-1, 1]) {
    const x = side * 0.37;
    const cradle = `cradle-${side}`;
    const battery = `battery-${side}`;
    const brace = `solar-brace-${side}`;
    parts.push(
      component(cradle, 'cradle', [0.46, 0.09, 0.86], [x, 0.70, -0.44], steel, ['chassis']),
      component(battery, 'pack', [0.38, 0.23, 0.66], [x, 0.85, -0.44], amber, [cradle]),
      component(`latch-front-${side}`, 'latch', [0.21, 0.14, 0.10], [x, 0.80, -0.09], concrete, [battery]),
      component(`latch-rear-${side}`, 'latch', [0.21, 0.14, 0.10], [x, 0.80, -0.79], concrete, [battery]),
      component(brace, 'mount', [0.15, 0.21, 0.50], [side * 0.62, 0.76, 0.29], concrete, ['chassis']),
      component(`solar-panel-${side}`, 'panel', [0.52, 0.07, 0.76], [side * 0.56, 0.89, 0.29], blue, [brace, battery]),
      component(`light-${side}`, 'light', [0.22, 0.15, 0.16], [side * 0.48, 0.69, 1.11], '#fde68a', ['chassis']),
    );
  }
  parts.push(
    component('mast', 'mast', [0.14, 0.63, 0.14], [0, 0.97, 0.63], concrete, ['chassis'], cylinder),
    component('camera', 'camera', [0.35, 0.20, 0.26], [0, 1.36, 0.68], '#38bdf8', ['mast']),
    component('antenna', 'antenna', [0.42, 0.28, 0.42], [0, 0.75, -0.91], '#e2e8f0', ['chassis'], PartShapeKind.PARABOLIC_DISH),
    component('arm-mount', 'armMount', [0.31, 0.24, 0.28], [0, 0.73, 1.13], amber, ['chassis']),
    component('upper-arm', 'armLink', [0.14, 0.18, 0.49], [0, 0.89, 1.40], blue, ['arm-mount'], box, [-0.32, 0, 0]),
    component('elbow', 'hinge', [0.18, 0.21, 0.18], [0, 0.95, 1.64], amber, ['upper-arm'], cylinder, across),
    component('lower-arm', 'armLink', [0.13, 0.15, 0.42], [0, 0.84, 1.80], blue, ['elbow'], box, [0.55, 0, 0]),
    component('scoop', 'tool', [0.26, 0.16, 0.24], [0, 0.71, 2.03], amber, ['lower-arm']),
  );
  return parts;
}

function drawbridgeParts(): PartSpec[] {
  const fixed = bridgeParts().filter(part => !part.id.startsWith('rail-1-') && !part.id.startsWith('girder-1-'));
  for (const side of [-1, 1]) {
    const pivot = side < 0 ? 'cap-1' : 'cap-2';
    const approach = side < 0 ? 'slab-0-1' : 'slab-2--1';
    const hinge = `lift-pin-${side}`;
    const leaf = `slab-1-${side}`;
    const plate = fixed.find(part => part.id === leaf);
    const girders = [-1, 1].map(lane => `lift-girder-${side}-${lane}`);
    if (plate) plate.dependsOn = [hinge, ...girders];
    fixed.push(
      component(hinge, 'hinge', [0.13, 1.26, 0.13], [side * 0.6, 1.04, 0], amber, [pivot], cylinder, [Math.PI / 2, 0, 0]),
      component(`lift-weight-${side}`, 'counterweight', [0.20, 0.22, 0.56], [side * 0.72, 0.82, 0], concrete, [hinge]),
      component(`lift-barrier-${side}`, 'barrier', [0.07, 0.09, 1.18], [side * 0.78, 1.19, 0], amber, [approach]),
      component(`lift-signal-${side}`, 'signal', [0.13, 0.34, 0.13], [side * 0.78, 1.23, 0.59], steel, [approach]),
    );
    for (const lane of [-1, 1]) {
      fixed.push(component(`lift-girder-${side}-${lane}`, 'girder', [0.60, 0.19, 0.19],
        [side * 0.30, 0.84, lane * 0.39], blue, [pivot, hinge]));
      fixed.push(component(`lift-rail-${side}-${lane}`, 'rail', [0.57, 0.22, 0.07], [side * 0.30, 1.17, lane * 0.55], amber, [leaf]));
    }
  }
  return fixed;
}

function masterBlueprint(key: 'bridge' | 'station' | 'rover' | 'drawbridge', category: VehicleCategory, parts: PartSpec[]): VehicleBlueprint {
  const { name, subtitle, why, fact } = MASTER_BUILD_TEXT[key];
  const tier = MASTER_BUILD_TEXT.tier;
  const facts = (locale: 0 | 1 | 2) => ({ howItWorks: why[locale], realRecord: subtitle[locale], didYouKnow: fact[locale] });
  return {
    id: `master-${key}`, stageNumber: 0, category, tier: DifficultyTier.MASTER, masterExpansion: true, parts,
    name: name[0], nameEn: name[1], nameAr: name[2], subtitle: subtitle[0], subtitleEn: subtitle[1], subtitleAr: subtitle[2],
    tierLabel: tier[0], tierLabelEn: tier[1], tierLabelAr: tier[2], ageNote: tier[0], ageNoteEn: tier[1], ageNoteAr: tier[2],
    discovery: facts(0), discoveryEn: facts(1), discoveryAr: facts(2), discoveryMode: 'observation',
  };
}

export const MASTER_BLUEPRINTS = [
  masterBlueprint('bridge', VehicleCategory.CONSTRUCTION, bridgeParts()),
  masterBlueprint('station', VehicleCategory.SPACE, stationParts()),
  masterBlueprint('rover', VehicleCategory.SPACE, roverParts()),
  masterBlueprint('drawbridge', VehicleCategory.CONSTRUCTION, drawbridgeParts()),
];
