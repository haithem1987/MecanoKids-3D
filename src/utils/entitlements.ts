export type Tier = 'discovery' | 'family' | 'school';

export interface LicenseState {
  tier: Tier;
  schoolOrg?: string;
  expiresAt?: string; // ISO date
}

export interface EntitlementSet {
  maxProfiles: number;
  maxStages: number;
  allLiveries: boolean;
  diagnosticMode: boolean;
  teacherTools: boolean;
  canAccessStage: (stageIndex: number) => boolean; // 1-indexed
}

const TIER_RULES: Record<Tier, Omit<EntitlementSet, 'canAccessStage'>> = {
  discovery: {
    maxProfiles: 1,
    maxStages: 20,
    allLiveries: false,
    diagnosticMode: true,
    teacherTools: false,
  },
  family: {
    maxProfiles: 5,
    maxStages: 100,
    allLiveries: true,
    diagnosticMode: true,
    teacherTools: false,
  },
  school: {
    maxProfiles: Number.MAX_SAFE_INTEGER,
    maxStages: 100,
    allLiveries: true,
    diagnosticMode: true,
    teacherTools: true,
  },
};

export function resolveEntitlements(license: LicenseState): EntitlementSet {
  const rules = TIER_RULES[license.tier] ?? TIER_RULES.discovery;
  return {
    ...rules,
    canAccessStage: (stageIndex: number) => stageIndex >= 1 && stageIndex <= rules.maxStages,
  };
}

export function canPlayStage(license: LicenseState, stageIndex: number): boolean {
  return resolveEntitlements(license).canAccessStage(stageIndex);
}

export function canCreateProfile(license: LicenseState, currentProfileCount: number): boolean {
  return currentProfileCount < resolveEntitlements(license).maxProfiles;
}

export function canUseLivery(
  license: LicenseState,
  liveryId: string,
  freeLiveryIds: string[],
): boolean {
  if (resolveEntitlements(license).allLiveries) return true;
  return freeLiveryIds.includes(liveryId);
}
