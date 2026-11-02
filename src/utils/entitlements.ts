import { LicenseState } from '../types/game';

export interface Entitlements {
  teacherTools: boolean;
}

export function resolveEntitlements(license: LicenseState | undefined): Entitlements {
  return {
    teacherTools: license?.tier === 'school',
  };
}
