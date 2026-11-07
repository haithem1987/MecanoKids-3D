export const SCIENCE_CHALLENGES = {
  'elec-led-circuit': [
    { kind: 'circuit', id: 'close', start: 0, target: 'on', switches: 1 },
    { kind: 'circuit', id: 'open', start: 1, target: 'off', switches: 1 },
    { kind: 'circuit', id: 'series', start: 1, target: 'on', switches: 2 },
  ],
  'phys-lever-class1': [
    { kind: 'lever', id: 'equal', start: 1, fixedMass: 1, fixedDistance: 2, movingMass: 1 },
    { kind: 'lever', id: 'heavy', start: 3, fixedMass: 2, fixedDistance: 2, movingMass: 1 },
    { kind: 'lever', id: 'near', start: 3, fixedMass: 1, fixedDistance: 2, movingMass: 2 },
  ],
  'chem-water-molecule': [
    { kind: 'molecule', id: 'water', start: 0, target: 1, centre: 'O', fixed: 'H' },
    { kind: 'molecule', id: 'repairWater', start: 2, target: 1, centre: 'O', fixed: 'H' },
  ],
  'chem-co2-molecule': [
    { kind: 'molecule', id: 'carbon', start: 0, target: 2, centre: 'C', fixed: 'O' },
  ],
} as const;

export type ScienceChallenge = (typeof SCIENCE_CHALLENGES)[keyof typeof SCIENCE_CHALLENGES][number];
export type ScienceTrial = { blueprintId: string; challenge: ScienceChallenge; setting: number };

export function getScienceChallenges(blueprintId: string): readonly ScienceChallenge[] | undefined {
  if (!Object.hasOwn(SCIENCE_CHALLENGES, blueprintId)) return undefined;
  return SCIENCE_CHALLENGES[blueprintId as keyof typeof SCIENCE_CHALLENGES];
}

export function applyScienceAction(trial: ScienceTrial, value: number): ScienceTrial {
  const { challenge, setting } = trial;
  if (challenge.kind === 'circuit') return { ...trial, setting: setting ^ (1 << value) };
  return { ...trial, setting: value };
}

export function observeChallenge(challenge: ScienceChallenge, setting: number) {
  switch (challenge.kind) {
    case 'circuit': return setting === (1 << challenge.switches) - 1 ? 'on' : 'off';
    case 'molecule': return setting === challenge.target ? 'complete' : 'incomplete';
    case 'lever': {
      const difference = challenge.movingMass * setting - challenge.fixedMass * challenge.fixedDistance;
      return difference === 0 ? 'balanced' : difference > 0 ? 'movingDown' : 'fixedDown';
    }
  }
}

export function meetsChallenge(challenge: ScienceChallenge, setting: number) {
  const target = challenge.kind === 'lever' ? 'balanced' : challenge.kind === 'molecule' ? 'complete' : challenge.target;
  return observeChallenge(challenge, setting) === target;
}
