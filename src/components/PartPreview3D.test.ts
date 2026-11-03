import { describe, expect, it } from 'vitest';
import { isLowEndDevice } from './PartPreview3D';

describe('isLowEndDevice', () => {
  it('returns false on a normal device (4 cores, dpr 2)', () => {
    expect(isLowEndDevice(4, 2)).toBe(false);
  });

  it('returns true when hardwareConcurrency <= 2', () => {
    expect(isLowEndDevice(2, 2)).toBe(true);
    expect(isLowEndDevice(1, 2)).toBe(true);
  });

  it('returns true when devicePixelRatio <= 1', () => {
    expect(isLowEndDevice(4, 1)).toBe(true);
    expect(isLowEndDevice(4, 0.5)).toBe(true);
  });
});
