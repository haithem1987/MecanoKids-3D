import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { getPendulumPose } from './pendulumMotion';

describe('continuité du pendule', () => {
  it('garde le pivot immobile et la masse attachée pendant un cycle complet', () => {
    const bp = VEHICLE_BLUEPRINTS.find((entry) => entry.id === 'phys-pendulum')!;
    const rod = bp.parts.find((p) => p.id === 'rod')!;
    const bob = bp.parts.find((p) => p.id === 'bob')!;
    const pivot = new Vector3(...rod.motionPivot!);
    const restDistance = new Vector3(...rod.targetPos).distanceTo(new Vector3(...bob.targetPos));
    for (let time = 0; time <= 6; time += 0.1) {
      const a = getPendulumPose(rod, time), b = getPendulumPose(bob, time);
      const centre = new Vector3(...a.position);
      const axis = new Vector3(-Math.sin(a.angle), Math.cos(a.angle), 0);
      expect(centre.clone().addScaledVector(axis, rod.scale[1] / 2).distanceTo(pivot)).toBeLessThan(1e-8);
      expect(centre.distanceTo(new Vector3(...b.position))).toBeCloseTo(restDistance, 8);
      const end = centre.clone().addScaledVector(axis, -rod.scale[1] / 2);
      expect(end.distanceTo(new Vector3(...b.position))).toBeLessThan(bob.scale[0] / 2);
    }
  });
});
