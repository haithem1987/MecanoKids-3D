import { VIRTUAL_LAB_PARTS, VIRTUAL_LAB_TEXT, VIRTUAL_LAB_UI } from '../i18n/translations';
import { DifficultyTier, PartShapeKind as Shape, VehicleCategory, type PartSpec, type VehicleBlueprint } from '../types/game';
import { VIRTUAL_LAB_GROUPS, VIRTUAL_LAB_MODELS, type VirtualLabId } from './virtualLabs';

type Vec = [number, number, number];
type Label = keyof typeof VIRTUAL_LAB_PARTS;
type Component = [id: string, label: Label, shape: Shape, size: Vec, position: Vec, color: string, rotation?: Vec];
const steel = '#64748b', blue = '#38bdf8', green = '#22c55e', pink = '#f472b6', yellow = '#facc15';
const block = Shape.APPARATUS_BASE;
const sphere = Shape.PENDULUM_BOB;
const vessel = Shape.LAB_BEAKER;
const rod = Shape.PENDULUM_ROD;
const lamp: Component = ['lamp', 'led', Shape.LED_COMPONENT, [0.33, 0.46, 0.33], [1.04, 0.44, 0], yellow];
const battery: Component = ['battery', 'battery', Shape.BATTERY_CELL, [0.58, 0.38, 0.43], [-1.02, 0.37, 0], steel];

const setups: Record<VirtualLabId, Component[]> = {
  newton: [
    ['frame', 'support', Shape.SUPPORT_FRAME, [2.5, 1.95, 0.35], [0, 1.16, 0], steel],
    ...Array.from({ length: 5 }, (_, index): Component => [
      `bob-${index}`, 'bob', Shape.LAB_HANGING_BALL, [0.3, 1.35, 0.3], [(index - 2) * 0.38, 1.4, 0], '#94a3b8',
    ]),
    ['target', 'target', block, [0.16, 0.5, 0.38], [1.64, 1.05, 0], yellow],
  ],
  venturi: [
    ['support', 'support', Shape.SUPPORT_FRAME, [1.3, 1.48, 0.4], [0, 0.92, 0], steel],
    ['duct', 'duct', block, [2.8, 0.24, 0.6], [0, 1.76, 0], blue],
    ['tube', 'tube', vessel, [0.43, 1.15, 0.43], [0, 1, 0.1], blue],
    ['fan', 'fan', Shape.FAN_BLADES, [0.68, 0.15, 0.68], [-1.43, 1.7, 0], yellow, [0, 0, Math.PI / 2]],
  ],
  rocket: [
    ['body', 'body', Shape.LAB_CYLINDER, [0.63, 1.5, 0.63], [0, 1.04, 0], blue],
    ['nose', 'nose', Shape.LAB_CONE, [0.63, 0.53, 0.63], [0, 2.055, 0], yellow],
    ...Array.from({ length: 3 }, (_, index): Component => {
      const angle = index * 2 * Math.PI / 3;
      return [`fin-${index}`, 'fin', block, [0.33, 0.48, 0.09], [Math.cos(angle) * 0.41, 0.62, -Math.sin(angle) * 0.41], green, [0, angle, 0]];
    }),
  ],
  balance: [
    ...Array.from({ length: 4 }, (_, index): Component => [`block-${index}`, 'block', block, [0.8, 0.44, 0.8], [0, 0.4 + index * 0.44, 0], blue]),
    ['weight', 'weight', block, [0.58, 0.32, 0.58], [0, 2.1, 0], yellow],
  ],
  phase: [
    ['beaker', 'beaker', vessel, [1.4, 1.05, 1.4], [0, 0.7, 0], steel],
    ['ice-a', 'ice', block, [0.36, 0.36, 0.36], [-0.24, 0.4, 0], blue],
    ['ice-b', 'ice', block, [0.36, 0.36, 0.36], [0.24, 0.4, 0], '#7dd3fc'],
  ],
  dna: [
    ['beaker', 'beaker', vessel, [1.12, 0.82, 1.12], [0, 0.6, 0], steel],
    ['fruit', 'fruit', sphere, [0.55, 0.55, 0.55], [0, 0.5, 0], pink],
    ['filter', 'filter', Shape.LAB_CONE, [0.69, 0.46, 0.69], [0, 1.2, 0], '#f8fafc', [0, 0, Math.PI]],
    ['pipette', 'pipette', rod, [0.09, 0.1, 0.78], [0.72, 0.47, 0.21], blue, [0, 0, 0.6]],
  ],
  slime: [
    ['beaker', 'beaker', vessel, [1.42, 0.66, 1.42], [0, 0.52, 0], steel],
    ['polymer-a', 'polymer', sphere, [0.44, 0.44, 0.44], [-0.26, 0.44, 0], green],
    ['polymer-b', 'polymer', sphere, [0.44, 0.44, 0.44], [0.26, 0.44, 0], '#86efac'],
    ['pipette', 'pipette', Shape.LAB_CYLINDER, [0.1, 0.8, 0.1], [0.8, 0.52, 0.28], blue, [0, 0, 0.75]],
  ],
  ph: [
    ...Array.from({ length: 3 }, (_, index): Component => [`sample-${index}`, 'sample', vessel, [0.65, 0.9, 0.65], [(index - 1) * 0.91, 0.63, 0], steel]),
    ['pipette', 'pipette', Shape.LAB_CYLINDER, [0.11, 0.85, 0.11], [0.4, 1.39, 0], '#a855f7', [0, 0, 0.9]],
  ],
  conductivity: [battery, lamp, ['bridge', 'bridge', block, [1.35, 0.2, 0.38], [0, 0.32, 0], blue]],
  resistance: [battery, lamp, ['track', 'track', block, [1.34, 0.1, 0.28], [0, 0.29, 0], '#334155']],
  logic: [
    ['switch-a', 'switch', block, [0.46, 0.3, 0.48], [-0.98, 0.36, -0.38], blue],
    ['switch-b', 'switch', block, [0.46, 0.3, 0.48], [-0.98, 0.36, 0.38], pink],
    ['gate', 'gate', block, [0.92, 0.37, 0.65], [0, 0.37, 0], green],
    lamp,
  ],
  capillary: [
    ['beaker', 'beaker', vessel, [1.05, 0.78, 1.05], [0, 0.57, 0], blue],
    ['stem', 'stem', Shape.LAB_CYLINDER, [0.1, 1.48, 0.1], [0, 1.27, 0], green],
    ['flower', 'flower', Shape.LAB_FLOWER, [0.89, 0.33, 0.89], [0, 2.1, 0], '#f8fafc'],
  ],
  erosion: [
    ['hill', 'hill', block, [1.55, 0.52, 1.1], [-0.71, 0.53, 0], '#a16207', [0, 0, -0.24]],
    ['barrier', 'barrier', block, [0.14, 0.38, 0.93], [0.29, 0.38, 0], steel],
    ['house', 'house', Shape.LAB_HOUSE, [0.74, 0.8, 0.72], [0.98, 0.57, 0], pink],
  ],
};

const categories = {
  physics: VehicleCategory.PHYSICS, chemistry: VehicleCategory.CHEMISTRY,
  electronics: VehicleCategory.ELECTRONICS, nature: VehicleCategory.NATURE,
};

function buildLab(id: VirtualLabId, category: VehicleCategory): VehicleBlueprint {
  const text = VIRTUAL_LAB_TEXT[id];
  const discovery = ([0, 1, 2] as const).map(locale => ({
    howItWorks: text.why[locale],
    realRecord: text.goal[locale],
    didYouKnow: text.outcomes[VIRTUAL_LAB_MODELS[id].success]?.[locale] ?? text.why[locale],
  }));
  const base: Component = ['base', 'base', block, [3.2, 0.18, 1.62], [0, 0.09, 0], '#334155'];
  const parts = [base, ...setups[id]].map(([partId, label, shape, scale, targetPos, primaryColor, targetRot], index, ordered): PartSpec => {
    const names = VIRTUAL_LAB_PARTS[label];
    const hints = VIRTUAL_LAB_UI.place;
    return {
      id: partId, name: names[0], nameEn: names[1], nameAr: names[2], roleHint: hints[0], roleHintEn: hints[1], roleHintAr: hints[2],
      shape, scale, targetPos, targetRot, primaryColor, secondaryColor: steel, materialKind: 'body',
      dependsOn: index > 0 ? [ordered[index - 1][0]] : [],
      explodeOffset: [targetPos[0] * 0.5, 0.42 * index, 0], snapRadius: 0.76,
    };
  });
  return {
    id: `lab-${id}`, virtualLab: id, category, stageNumber: 0, tier: DifficultyTier.DISCOVERY,
    name: text.name[0], nameEn: text.name[1], nameAr: text.name[2],
    subtitle: text.goal[0], subtitleEn: text.goal[1], subtitleAr: text.goal[2],
    tierLabel: VIRTUAL_LAB_UI.mission[0], tierLabelEn: VIRTUAL_LAB_UI.mission[1], tierLabelAr: VIRTUAL_LAB_UI.mission[2],
    ageNote: `${text.age} ${VIRTUAL_LAB_UI.years[0]}`, ageNoteEn: `${text.age} ${VIRTUAL_LAB_UI.years[1]}`, ageNoteAr: `${text.age} ${VIRTUAL_LAB_UI.years[2]}`,
    discovery: discovery[0], discoveryEn: discovery[1], discoveryAr: discovery[2], discoveryMode: 'observation',
    parts,
  };
}

export const VIRTUAL_LAB_BLUEPRINTS = (Object.keys(VIRTUAL_LAB_GROUPS) as Array<keyof typeof VIRTUAL_LAB_GROUPS>)
  .flatMap(group => VIRTUAL_LAB_GROUPS[group].map(id => buildLab(id, categories[group])));
