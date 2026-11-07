import type { PlayerProgress } from '../types/game';

export const WORKSHOP_ADVENTURES = [
  { id: 'harbour', icon: '⚓', steps: ['expansion-gantry', 'master-drawbridge', 'expansion-beacon'] },
  { id: 'village', icon: '🏰', steps: ['expansion-keep', 'expansion-watermill', 'expansion-aqueduct'] },
  { id: 'research', icon: '🔬', steps: ['lab-conductivity', 'lab-venturi', 'lab-erosion'] },
] as const;
export type AdventureId = typeof WORKSHOP_ADVENTURES[number]['id'];

/** A route guides navigation only: it never grants access to a locked workshop. */
export function adventureProgress(steps: readonly string[], progress: Pick<PlayerProgress, 'completedStages'>) {
  const completed = steps.filter(id => progress.completedStages[id]?.completed).length;
  return { completed, total: steps.length, nextId: steps.find(id => !progress.completedStages[id]?.completed), finished: completed === steps.length };
}
