import { Euler, Quaternion, Vector3 } from 'three';
import { PartAnimationKind, type PartSpec } from '../types/game';
/** Rotate a complete assembled sub-part about a shared mechanical pivot. */
export function getAxialRotationPose(spec: PartSpec, angle: number) {
  const axis = spec.animation === PartAnimationKind.SPIN_X ? new Vector3(1,0,0)
    : spec.animation === PartAnimationKind.SPIN_Y ? new Vector3(0,1,0) : new Vector3(0,0,1);
  const pivot = new Vector3(...(spec.motionPivot ?? spec.targetPos));
  const rotation = new Quaternion().setFromAxisAngle(axis, angle);
  const position = new Vector3(...spec.targetPos).sub(pivot).applyQuaternion(rotation).add(pivot);
  const quaternion = rotation.multiply(new Quaternion().setFromEuler(new Euler(...(spec.targetRot ?? [0,0,0]))));
  return { position, quaternion };
}
