import { PartSpec } from '../types/game';

/** A shared pivot and phase keep the rod and bob physically connected. */
export function getPendulumPose(spec: PartSpec, time: number): { position: [number, number, number]; angle: number } {
  const angle = Math.sin(time * 2.2) * 0.3;
  if (!spec.motionPivot) return { position: spec.targetPos, angle: 0 };
  const [px, py] = spec.motionPivot;
  const [x, y, z] = spec.targetPos;
  return { position: [px + (x - px) * Math.cos(angle) - (y - py) * Math.sin(angle),
    py + (x - px) * Math.sin(angle) + (y - py) * Math.cos(angle), z], angle };
}
