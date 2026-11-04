/**
 * Unified blueprint view: each entry exposes the same VehicleBlueprint data under
 * per-language keys so mission code and future features can access FR/EN/AR
 * without calling getLocalizedBlueprint repeatedly.
 *
 * Existing callers of VEHICLE_BLUEPRINTS are unchanged — this file is additive.
 */
import { VehicleBlueprint } from '../types/game';
import { VEHICLE_BLUEPRINTS } from './blueprints';
import { localizeBlueprintToEnglish } from './englishBlueprints';
import { getLocalizedBlueprint } from '../i18n/translations';

export interface UnifiedBlueprint {
  id: string;
  fr: VehicleBlueprint;
  en: VehicleBlueprint;
  ar: VehicleBlueprint;
}

function buildUnified(): UnifiedBlueprint[] {
  return VEHICLE_BLUEPRINTS.map((bp) => ({
    id: bp.id,
    fr: bp,
    en: localizeBlueprintToEnglish(bp),
    ar: getLocalizedBlueprint(bp, 'ar'),
  }));
}

export const UNIFIED_BLUEPRINTS: UnifiedBlueprint[] = buildUnified();

export const UNIFIED_BLUEPRINTS_BY_ID: ReadonlyMap<string, UnifiedBlueprint> = new Map(
  UNIFIED_BLUEPRINTS.map((u) => [u.id, u]),
);
