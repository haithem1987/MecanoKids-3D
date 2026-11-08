import type { PlayerProgress } from '../types/game';
import type { DiscoveryNotebook } from '../utils/discoveryNotebook';

export type AdventureGroup = 'first' | 'science' | 'history' | 'transport' | 'expert' | 'maths';
export const WORKSHOP_ADVENTURES = [
  { id: 'first', group: 'first', icon: '🐙', steps: ['car-solar-city', 'boat-explorer-sail', 'plane-aeroclub', 'const-mini-excavator'] },
  { id: 'harbour', group: 'expert', icon: '⚓', steps: ['expansion-gantry', 'master-drawbridge', 'boat-port-tug', 'expansion-beacon'] },
  { id: 'village', group: 'history', icon: '🏰', steps: ['expansion-keep', 'expansion-watermill', 'expansion-aqueduct', 'expansion-castle'] },
  { id: 'research', group: 'science', icon: '🔬', steps: ['lab-conductivity', 'lab-venturi', 'lab-erosion'] },
  { id: 'chemistry', group: 'science', icon: '🧪', steps: ['lab-dna', 'lab-slime', 'lab-ph', 'chem-salt-crystal', 'chem-beaker-setup'] },
  { id: 'energy', group: 'science', icon: '☀️', steps: ['lab-resistance', 'lab-conductivity', 'elec-solar-toy', 'elec-motor-fan', 'elec-alarm-buzzer'] },
  { id: 'forces', group: 'science', icon: '⚖️', steps: ['lab-newton', 'lab-balance', 'phys-pendulum', 'phys-inclined-plane', 'phys-lever-class1'] },
  { id: 'water', group: 'science', icon: '💧', steps: ['lab-phase', 'lab-capillary', 'chem-water-molecule', 'chem-co2-molecule'] },
  { id: 'sky', group: 'transport', icon: '✈️', steps: ['plane-bush-cub', 'plane-park-quadcopter', 'lab-rocket', 'aero-sounding-rocket', 'space-weather-cubesat'] },
  { id: 'travel', group: 'transport', icon: '🚆', steps: ['car-taxi-metro', 'boat-harbor-pilot', 'train-steam-loco', 'plane-twin-commuter', 'const-warehouse-forklift'] },
  { id: 'heritage', group: 'history', icon: '🏛️', steps: ['expansion-yurt', 'expansion-temple', 'expansion-dome', 'expansion-truss'] },
  { id: 'expert', group: 'expert', icon: '🚀', steps: ['master-bridge', 'master-station', 'master-rover', 'space-heavy-booster-rocket', 'space-gps-constellation-sat'] },
  { id: 'signals', group: 'science', icon: '💡', steps: ['lab-logic', 'elec-led-circuit', 'elec-alarm-buzzer', 'elec-radio-receiver'] },
  { id: 'directions', group: 'transport', icon: '🧭', steps: ['phys-magnet-compass', 'boat-ocean-research', 'space-mars-explorer-rover', 'space-interplanetary-probe'] },
  { id: 'measurements', group: 'science', icon: '🌈', steps: ['chem-balance-scale', 'phys-prism-light', 'lab-ph'] },
  { id: 'math-numbers', group: 'maths', icon: '🔢', steps: ['math-addition', 'math-groups', 'math-fractions'] },
  { id: 'math-builders', group: 'maths', icon: '📐', steps: ['math-area', 'math-symmetry', 'math-ratio'] },
] as const satisfies readonly { id: string; group: AdventureGroup; icon: string; steps: readonly string[] }[];
export type AdventureId = typeof WORKSHOP_ADVENTURES[number]['id'];

/** Navigation never grants access: construction and a validated experiment are separate milestones. */
export function adventureProgress(steps: readonly string[], progress: Pick<PlayerProgress, 'completedStages'>, notebook?: DiscoveryNotebook, requiresPlay: (id: string) => boolean = () => false) {
  const states = steps.map(id => {
    const built = Boolean(progress.completedStages[id]?.completed), requiresObservation = requiresPlay(id);
    const observed = Boolean(notebook?.observations.some(entry => entry.blueprintId === id && entry.success === true));
    return { id, built, requiresObservation, observed, completed: built && (!requiresObservation || observed) };
  });
  const next = states.find(step => !step.completed);
  return {
    completed: states.filter(step => step.completed).length, built: states.filter(step => step.built).length,
    observed: states.filter(step => step.requiresObservation && step.observed).length,
    requiredObservations: states.filter(step => step.requiresObservation).length,
    total: steps.length, nextId: next?.id, nextAction: next ? next.built ? 'try' as const : 'build' as const : undefined,
    finished: states.every(step => step.completed), steps: states,
  };
}
