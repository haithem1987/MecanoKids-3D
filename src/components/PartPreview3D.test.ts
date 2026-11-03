import { describe, expect, it } from 'vitest';
import { isLowEndDevice } from './PartPreview3D';

describe('isLowEndDevice', () => {
  it('returns false on a normal device (4 cores, dpr 2)', () => {
    expect(isLowEndDevice(4, 2)).toBe(false);
  });

  it('returns true when both conditions met (low concurrency AND low dpr)', () => {
    expect(isLowEndDevice(2, 1)).toBe(true);
    expect(isLowEndDevice(1, 0.5)).toBe(true);
  });

  it('returns false when only one condition is met', () => {
    expect(isLowEndDevice(2, 2)).toBe(false); // low concurrency, normal dpr
    expect(isLowEndDevice(4, 1)).toBe(false); // normal concurrency, low dpr
  });
});
