import { describe, expect, it } from 'vitest';
import {
  canCreateProfile,
  canPlayStage,
  canUseLivery,
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
