import { LicenseState, LiveryPresetId } from '../types/game';

const DISCOVERY_STAGE_LIMIT = 20;
const DISCOVERY_PROFILE_LIMIT = 1;
const FAMILY_PROFILE_LIMIT = 5;

export function canPlayStage(license: LicenseState, stageNumber: number): boolean {
  if (license.tier !== 'discovery') return true;
  return stageNumber <= DISCOVERY_STAGE_LIMIT;
}

export function canCreateProfile(license: LicenseState, currentProfileCount: number): boolean {
  if (license.tier === 'school') return true;
  if (license.tier === 'family') return currentProfileCount < FAMILY_PROFILE_LIMIT;
  return currentProfileCount < DISCOVERY_PROFILE_LIMIT;
}

export function canUseLivery(
  license: LicenseState,
  liveryId: LiveryPresetId,
  freeLiveryIds: LiveryPresetId[],
): boolean {
  if (license.tier !== 'discovery') return true;
  return freeLiveryIds.includes(liveryId);
}
