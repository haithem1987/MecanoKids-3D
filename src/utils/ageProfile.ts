import type { AgeProfile } from '../types/game';

export function getSnapMultiplier(profile: AgeProfile | undefined): number {
  if (profile === '5-7') return 1.5;
  if (profile === '11-12') return 0.8;
  return 1;
}
