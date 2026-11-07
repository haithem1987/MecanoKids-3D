import * as THREE from 'three';
import { PartShapeKind, PartSpec } from '../types/game';
import type { PartMaterialSet } from './materials';

/** Additional teaching apparatus; all dimensions are local to the part. */
export function addStemGeometry(root: THREE.Group, spec: PartSpec, mats: PartMaterialSet): boolean {
  const [x, y, z] = spec.scale;
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, px = 0, py = 0, pz = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  };
  switch (spec.shape) {
    case PartShapeKind.ARCH_STONE: {
      const a = spec.archStone;
      if (!a) return false;
      const mid = (a.startAngle + a.endAngle) / 2, radius = (a.innerRadius + a.outerRadius) / 2;
      const shape = new THREE.Shape();
      shape.absarc(0, 0, a.outerRadius, a.startAngle, a.endAngle, false);
      if (a.innerRadius > 0) {
        shape.lineTo(a.innerRadius * Math.cos(a.endAngle), a.innerRadius * Math.sin(a.endAngle));
        shape.absarc(0, 0, a.innerRadius, a.endAngle, a.startAngle, true);
      } else shape.lineTo(0, 0);
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: z, bevelEnabled: false, curveSegments: 24 });
      geometry.translate(-radius * Math.cos(mid), -radius * Math.sin(mid), -z / 2);
      add(geometry, mats.primary);
      return true;
    }
    case PartShapeKind.ARCH_SPANDREL: {
      const a = spec.archSpandrel;
      if (!a) return false;
      const shape = new THREE.Shape();
      shape.moveTo(0, a.radius);
      for (let i = 1; i <= 24; i++) {
        const angle = Math.PI / 2 * (1 - i / 24);
        shape.lineTo(a.side * a.radius * Math.cos(angle), a.radius * Math.sin(angle));
      }
      shape.lineTo(a.side * a.halfWidth, 0);
      shape.lineTo(a.side * a.halfWidth, a.radius);
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: z, bevelEnabled: false });
      geometry.translate(-a.side * a.halfWidth / 2, -a.radius / 2, -z / 2);
      add(geometry, mats.primary);
      return true;
    }
    case PartShapeKind.LAB_CYLINDER:
      add(new THREE.CylinderGeometry(x / 2, x / 2, y, 24), mats.primary);
      return true;
    case PartShapeKind.LAB_CONE:
      add(new THREE.ConeGeometry(x / 2, y, 24), mats.primary);
      return true;
    case PartShapeKind.LAB_HANGING_BALL:
      add(new THREE.CylinderGeometry(0.018, 0.018, y, 10), mats.secondary);
      add(new THREE.SphereGeometry(x / 2, 20, 16), mats.primary, 0, -y / 2);
      return true;
    case PartShapeKind.LAB_FLOWER:
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        add(new THREE.SphereGeometry(y * 0.49, 16, 12), mats.primary, Math.cos(angle) * x * 0.32, 0, Math.sin(angle) * z * 0.32);
      }
      add(new THREE.SphereGeometry(y * 0.5, 16, 12), mats.secondary, 0, y * 0.19);
      return true;
    case PartShapeKind.LAB_HOUSE:
      add(new THREE.BoxGeometry(x * 0.85, y * 0.62, z * 0.85), mats.secondary, 0, -y * 0.17);
      add(new THREE.ConeGeometry(x * 0.68, y * 0.42, 4), mats.primary, 0, y * 0.35).rotation.y = Math.PI / 4;
      return true;
    case PartShapeKind.APPARATUS_BASE:
      add(new THREE.BoxGeometry(x, y, z), mats.primary);
      return true;
    case PartShapeKind.ATOM_SODIUM:
      add(new THREE.SphereGeometry(x / 2, 20, 16), mats.primary);
      // Raised plus sign distinguishes the ion without relying on its colour.
      add(new THREE.BoxGeometry(x * 0.45, x * 0.08, x * 0.08), mats.secondary, 0, 0, x * 0.48);
      add(new THREE.BoxGeometry(x * 0.08, x * 0.45, x * 0.08), mats.secondary, 0, 0, x * 0.48);
      return true;
    case PartShapeKind.SUPPORT_FRAME: {
      const thickness = 0.055;
      for (const side of [-1, 1]) {
        add(new THREE.CylinderGeometry(thickness, thickness, y, 12), mats.primary, side * x / 2);
      }
      add(new THREE.BoxGeometry(x + thickness * 2, thickness * 2, z), mats.secondary, 0, y / 2);
      return true;
    }
    case PartShapeKind.LAB_BEAKER: {
      const glass = new THREE.MeshStandardMaterial({ color: '#bae6fd', transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
      add(new THREE.CylinderGeometry(x / 2, x / 2, y, 24, 1, true), glass);
      const floor = add(new THREE.CircleGeometry(x / 2, 24), glass, 0, -y / 2);
      floor.rotation.x = -Math.PI / 2;
      const rim = add(new THREE.TorusGeometry(x / 2, 0.018, 8, 24), mats.secondary, 0, y / 2);
      rim.rotation.x = Math.PI / 2;
      for (let i = 1; i <= 3; i++) add(new THREE.BoxGeometry(x * 0.2, 0.018, 0.02), mats.primary, x * 0.2, (i / 4 - 0.5) * y, x * 0.46);
      return true;
    }
    case PartShapeKind.BALANCE_PAN: {
      add(new THREE.CylinderGeometry(x / 2, x * 0.4, y, 24, 1, true), mats.primary);
      const floor = add(new THREE.CircleGeometry(x * 0.4, 24), mats.secondary, 0, -y / 2);
      floor.rotation.x = -Math.PI / 2;
      return true;
    }
    case PartShapeKind.FAN_BLADES:
      add(new THREE.CylinderGeometry(x * 0.13, x * 0.13, y, 16), mats.secondary);
      for (let i = 0; i < 4; i++) {
        const blade = add(new THREE.BoxGeometry(x * 0.42, y * 0.65, z * 0.16), mats.primary);
        const angle = i * Math.PI / 2;
        blade.position.set(Math.cos(angle) * x * 0.26, 0, Math.sin(angle) * x * 0.26);
        blade.rotation.y = -angle;
      }
      return true;
    case PartShapeKind.LIGHT_SENSOR:
      add(new THREE.CylinderGeometry(x / 2, x / 2, y, 20), mats.primary);
      for (let i = -2; i <= 2; i++) add(new THREE.BoxGeometry(x * 0.65, 0.012, 0.018), mats.secondary, 0, y / 2, i * x * 0.13);
      return true;
    case PartShapeKind.BUZZER:
    case PartShapeKind.SPEAKER:
      add(new THREE.CylinderGeometry(x / 2, x / 2, y, 24), mats.primary);
      add(new THREE.CylinderGeometry(x * 0.33, x * 0.3, 0.025, 24), mats.darkRubber, 0, y / 2);
      add(new THREE.CylinderGeometry(x * 0.1, x * 0.1, 0.04, 16), mats.secondary, 0, y / 2 + 0.01);
      return true;
    case PartShapeKind.ANTENNA:
      add(new THREE.CylinderGeometry(x / 2, x / 2, y, 12), mats.metalAccent);
      add(new THREE.SphereGeometry(x, 12, 10), mats.primary, 0, y / 2);
      return true;
    case PartShapeKind.DEMODULATOR:
      add(new THREE.BoxGeometry(x, y, z), mats.darkRubber);
      for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
        add(new THREE.BoxGeometry(x * 0.17, y * 0.5, z * 0.1), mats.metalAccent, side * x * 0.55, 0, (i - 1) * z * 0.3);
      }
      return true;
    case PartShapeKind.LIGHT_SOURCE: {
      add(new THREE.BoxGeometry(x, y, z), mats.primary);
      const lens = add(new THREE.CylinderGeometry(y * 0.35, y * 0.35, 0.035, 20), mats.secondary, x / 2);
      lens.rotation.z = Math.PI / 2;
      return true;
    }
    case PartShapeKind.LIGHT_BEAM:
      add(new THREE.BoxGeometry(x, y, z), mats.primary);
      return true;
    default:
      return false;
  }
}
