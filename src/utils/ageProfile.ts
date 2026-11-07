import type { AgeProfile, PartSpec } from '../types/game';

export function getSnapMultiplier(profile: AgeProfile | undefined): number {
  if (profile === '5-7') return 1.5;
  if (profile === '11-12') return 0.8;
  return 1;
}

export function getMasterPartSnapMultiplier(profile: AgeProfile | undefined, part: PartSpec): number {
  return profile === '11-12' && Math.max(...part.scale) <= 0.45 ? 0.72 : 1;
}
