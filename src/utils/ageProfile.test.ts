import { describe, expect, it } from 'vitest';
import { getSnapMultiplier } from './ageProfile';

describe('getSnapMultiplier', () => {
  it('returns 1.5 for 5-7', () => expect(getSnapMultiplier('5-7')).toBe(1.5));
  it('returns 1 for 8-10', () => expect(getSnapMultiplier('8-10')).toBe(1));
  it('returns 0.8 for 11-12', () => expect(getSnapMultiplier('11-12')).toBe(0.8));
  it('returns 1 for undefined', () => expect(getSnapMultiplier(undefined)).toBe(1));
});
