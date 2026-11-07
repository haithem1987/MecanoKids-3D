import { describe, expect, it } from 'vitest';
import {
  canCreateProfile,
  canPlayStage,
  canUseLivery,
  freeTrialExhausted,
  isUnlocked,
  resolveEntitlements,
} from './entitlements';

const FREE_LIVERIES = ['original', 'fire_red', 'racing_blue'];

describe('discovery tier', () => {
  const license = { tier: 'discovery' as const };

  it('canPlayStage(1) = true', () => expect(canPlayStage(license, 1)).toBe(true));
  it('canPlayStage(20) = true', () => expect(canPlayStage(license, 20)).toBe(true));
  it('canPlayStage(21) = false', () => expect(canPlayStage(license, 21)).toBe(false));
  it('canCreateProfile with 0 existing = true', () => expect(canCreateProfile(license, 0)).toBe(true));
  it('canCreateProfile with 1 existing = false', () => expect(canCreateProfile(license, 1)).toBe(false));
  it('canUseLivery with free livery = true', () =>
    expect(canUseLivery(license, 'fire_red', FREE_LIVERIES)).toBe(true));
  it('canUseLivery with premium livery = false', () =>
    expect(canUseLivery(license, 'flame_gold', FREE_LIVERIES)).toBe(false));
  it('diagnosticMode = true', () => expect(resolveEntitlements(license).diagnosticMode).toBe(true));
  it('teacherTools = false', () => expect(resolveEntitlements(license).teacherTools).toBe(false));
});

describe('family tier', () => {
  const license = { tier: 'family' as const };

  it('canPlayStage(100) = true', () => expect(canPlayStage(license, 100)).toBe(true));
  it('canPlayStage(101) = false', () => expect(canPlayStage(license, 101)).toBe(false));
  it('includes the additional Master builds beyond the base catalogue', () => {
    expect(canPlayStage(license, 138, true)).toBe(true);
    expect(canPlayStage({ tier: 'school' }, 139, true)).toBe(true);
    expect(canPlayStage({ tier: 'discovery' }, 138, true)).toBe(false);
  });
  it('canCreateProfile with 4 existing = true', () => expect(canCreateProfile(license, 4)).toBe(true));
  it('canUseLivery with premium livery = true', () =>
    expect(canUseLivery(license, 'flame_gold', FREE_LIVERIES)).toBe(true));
});

describe('school tier', () => {
  const license = { tier: 'school' as const };

  it('canCreateProfile with 50 profiles = true', () =>
    expect(canCreateProfile(license, 50)).toBe(true));
  it('teacherTools = true', () => expect(resolveEntitlements(license).teacherTools).toBe(true));
});

describe('freeTrialExhausted', () => {
  it('false at 4 completed', () => expect(freeTrialExhausted(4)).toBe(false));
  it('true at 5 completed', () => expect(freeTrialExhausted(5)).toBe(true));
  it('true at 10 completed', () => expect(freeTrialExhausted(10)).toBe(true));
});

describe('isUnlocked', () => {
  it('false for discovery', () => expect(isUnlocked({ tier: 'discovery' })).toBe(false));
  it('true for family', () => expect(isUnlocked({ tier: 'family' })).toBe(true));
  it('true for school', () => expect(isUnlocked({ tier: 'school' })).toBe(true));
});
