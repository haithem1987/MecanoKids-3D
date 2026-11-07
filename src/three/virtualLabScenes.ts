import * as T from 'three';
import type { VirtualLabId } from '../data/virtualLabs';

const blue = 0x38bdf8, steel = 0x64748b, green = 0x4ade80, pink = 0xf472b6, amber = 0xfacc15;

export function drawVirtualLab(root: T.Group, id: VirtualLabId, settings: readonly number[], outcome?: number) {
  let animate: ((progress: number) => void) | undefined;
  const mesh = (geometry: T.BufferGeometry, color: number, x: number, y: number, z = 0) => {
    const item = new T.Mesh(geometry, new T.MeshStandardMaterial({ color }));
    item.position.set(x, y, z);
    root.add(item);
    return item;
  };
  const box = (x: number, y: number, w: number, h: number, d: number, color: number, z = 0) =>
    mesh(new T.BoxGeometry(w, h, d), color, x, y, z);
  const ball = (x: number, y: number, r: number, color: number, z = 0) =>
    mesh(new T.SphereGeometry(r, 16, 12), color, x, y, z);
  const tube = (x: number, y: number, r: number, h: number, color: number, z = 0) =>
    mesh(new T.CylinderGeometry(r, r, h, 24), color, x, y, z);
  const link = (ax: number, ay: number, bx: number, by: number, color: number) => {
    const rod = tube((ax + bx) / 2, (ay + by) / 2, 0.035, Math.hypot(bx - ax, by - ay), color);
    rod.rotation.z = Math.atan2(ay - by, ax - bx) - Math.PI / 2;
    return rod;
  };
  const a = settings[0] ?? 0, b = settings[1] ?? 0, c = settings[2] ?? 0;
  const n = outcome ?? 0;
  box(0, -0.11, 7.6, 0.22, 3.2, 0xcbd5e1);
  switch (id) {
    case 'newton': {
      box(0, 2.9, 5, 0.12, 0.65, steel);
      [-2.35, 2.35].forEach(x => box(x, 1.45, 0.11, 2.9, 0.2, steel, -0.25));
      const pendulums: { x: number; line: T.Mesh; ball: T.Mesh }[] = [];
      for (let i = 0; i < 5; i++) {
        const x = (i - 2) * 0.6;
        const angle = outcome === undefined && i === 0 ? -a * 0.36 : i === 4 ? n * 0.36 : 0;
        const end = x + Math.sin(angle) * 1.6, y = 2.85 - Math.cos(angle) * 1.6;
        pendulums.push({ x, line: link(x, 2.85, end, y, steel), ball: ball(end, y, 0.3, 0x94a3b8) });
      }
      box(2.65, 1.65, 0.12, 0.72, 0.5, n === 2 ? green : amber);
      if (n) {
        const swing = (index: number, angle: number) => {
          const { x, line, ball: sphere } = pendulums[index];
          sphere.position.set(x + Math.sin(angle) * 1.6, 2.85 - Math.cos(angle) * 1.6, 0);
          line.position.set((sphere.position.x + x) / 2, (sphere.position.y + 2.85) / 2, 0);
          line.rotation.z = angle;
        };
        animate = progress => {
          const transfer = 0.48;
          swing(0, -n * 0.36 * Math.cos(Math.min(1, progress / transfer) * Math.PI / 2));
          swing(4, n * 0.36 * Math.sin(Math.max(0, (progress - transfer) / (1 - transfer)) * Math.PI / 2));
        };
      }
      break;
    }
    case 'venturi':
      if (c) {
        box(0, 2.57, 1.75, 0.1, 1.22, steel);
        for (const x of [-0.87, 0.87]) box(x, 1.68, 0.1, 1.85, 1.22, steel);
        if (n === 4 || outcome === undefined) box(0, 1.69, 1.62, 1.72, 0.88, blue);
        if (settings[3]) box(0, 0.76, 2.03, 0.1, 1.4, amber);
        if (n === 3) for (let i = 0; i < 10; i++) ball(Math.sin(i * 2.8) * 0.65, 0.21 + i * 0.13, 0.08, blue);
        break;
      }
      box(0, 2.55, 5.6, 0.12, 0.75, steel);
      box(-1.67, 1.65, 2.25, 0.12, 0.75, steel);
      box(1.67, 1.65, 2.25, 0.12, 0.75, steel);
      if (b) box(0, 2.38, 1.3, 0.25, 0.75, steel);
      [-0.53, 0.53].forEach(x => box(x, 0.84, 0.08, 1.68, 0.68, steel));
      for (let i = 0; i < a * 5; i++) ball(-2.5 + i * 0.51, 2.08, 0.07, blue);
      ball(0, 0.36 + n * 0.62, 0.23, amber);
      break;
    case 'rocket': {
      const startIndex = root.children.length;
      const y = 0.8 + n * 0.45, x = n === 1 ? 1.6 : 0;
      tube(x, y, 0.38, 1.15, steel);
      if (a) tube(x, y - 0.36 + a * 0.13, 0.395, a * 0.25, blue);
      mesh(new T.ConeGeometry(0.38, 0.55, 24), amber, x, y + 0.84);
      if (b) box(x - 0.44, y - 0.34, 0.38, 0.42, 0.1, green);
      if (b === 1) {
        box(x + 0.44, y - 0.34, 0.38, 0.42, 0.1, green);
        box(x, y - 0.34, 0.1, 0.42, 0.39, green, 0.42);
      }
      if (n) for (let i = 0; i < 5; i++) ball(x + Math.sin(i) * 0.19, y - 0.65 - i * 0.12, 0.07, blue);
      const flight = root.children.slice(startIndex).map(item => ({ item, x: item.position.x, y: item.position.y }));
      if (n) animate = progress => {
        const climb = Math.sin(progress * Math.PI / 2);
        for (const part of flight) {
          part.item.position.x = part.x - x * (1 - climb);
          part.item.position.y = part.y - n * 0.45 * (1 - climb);
        }
      };
      box(-1.9, 3.1, 0.9, 0.09, 0.6, n === 3 ? green : amber);
      break;
    }
    case 'balance': {
      box(0, 0.17, b ? 1.1 : 2.45, 0.34, 1.35, steel);
      const tilt = outcome === undefined || n === 2 ? 0 : n === 0 ? -0.63 : 0.48;
      for (let i = 0; i < 4; i++) {
        const y = 0.32 + (i + 0.5) * 0.54;
        box(-Math.sin(tilt) * y, Math.cos(tilt) * y, 0.91, 0.5, 0.9, i === (a === 0 ? 0 : 3) ? amber : blue).rotation.z = tilt;
      }
      if (a === 2) box(0.8, 1.0, 0.5, 0.45, 0.5, amber);
      break;
    }
    case 'phase':
      box(0, 0.1, 3.6, 0.2, 1.6, steel);
      [-1.75, 1.75].forEach(x => box(x, 0.57, 0.1, 1.0, 1.6, steel));
      if (n === 0) for (const x of [-0.8, 0, 0.8]) box(x, 0.58, 0.68, 0.68, 0.68, 0x7dd3fc);
      if (n === 1) box(0, 0.4, 3.36, 0.42, 1.48, blue);
      if (n === 2) for (let i = 0; i < 24; i++) ball(Math.sin(i * 2.7) * 1.5, 0.4 + i * 0.1, 0.09, blue, Math.cos(i) * 0.5);
      break;
    case 'dna':
      tube(0, 0.14, 1.0, 0.25, steel);
      if (n === 0) ball(0, 0.85, 0.6, pink).scale.y = 1.2;
      else tube(0, 0.49, 0.94, 0.46, n >= 3 ? 0xfda4af : pink);
      if (n === 2) tube(0, 0.85, 0.94, 0.23, blue);
      if (n === 3) mesh(new T.ConeGeometry(0.65, 0.68, 24), 0xf8fafc, 0, 1.4).rotation.z = Math.PI;
      if (n === 4) for (let i = 0; i < 16; i++) ball(Math.sin(i * 0.67) * 0.54, 0.76 + i * 0.085, 0.1, 0xffffff, Math.cos(i * 0.67) * 0.49);
      break;
    case 'slime':
      ball(0, n === 0 ? 0.34 : 0.68, 0.9, green).scale.set(n === 0 ? 2.5 : n === 1 ? 1.95 : 1.15, n === 0 ? 0.37 : 0.75, 0.85);
      for (let i = 0; i < 7 + n * 4; i++) ball(Math.sin(i * 2.4) * (n === 0 ? 1.7 : 0.9), 0.35 + Math.cos(i) * 0.12, 0.095, 0x15803d, 0.68);
      break;
    case 'ph':
      for (let i = 0; i < 3; i++) {
        const x = (i - 1) * 2.0;
        tube(x, 0.14, 0.65, 0.22, steel);
        tube(x, 0.73, 0.57, 1.0, i === a && outcome !== undefined ? [pink, 0xa855f7, green][i] : 0xe2e8f0);
        if (i === a) box(x, 0.15, 1.42, 0.12, 1.45, amber);
      }
      break;
    case 'conductivity':
    case 'resistance':
    case 'logic': {
      box(0, 0.09, 5.9, 0.14, 2.1, 0x164e63);
      box(-2, 0.55, 0.82, 0.8, 0.72, steel);
      box(-1.43, 0.23, 0.65, 0.1, 0.18, amber);
      box(1.28, 0.23, 0.65, 0.1, 0.18, amber);
      if (id === 'conductivity') box(0, 0.33, 2.1, 0.23, 0.6, [0xa16207, blue, 0x94a3b8, 0x1e293b][a]);
      if (id === 'resistance') {
        for (let i = 0; i <= a; i++) box(0, 0.22, 2.16, 0.1, 0.13, 0x0f172a, (i - a / 2) * 0.45);
      }
      if (id === 'logic') {
        box(0, 0.35, 1.43, 0.46, 0.88, [blue, pink, green][a]);
        ball(-1.05, 0.45, 0.16, b ? green : steel, 0.53);
        ball(-1.05, 0.45, 0.16, c ? green : steel, -0.53);
      }
      ball(2, 0.67, 0.42, outcome === undefined ? steel : id === 'resistance' ? [0xfb7185, amber, 0x92400e][n] : n ? amber : steel);
      break;
    }
    case 'capillary':
      tube(0, 0.33, 0.78, 0.6, blue);
      tube(0, a ? 1.49 : 1.65, 0.09, a ? 2.5 : 2.2, n === 1 ? blue : green);
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        ball(Math.cos(angle) * 0.43, 2.77, 0.25, n === 2 ? blue : 0xffffff, Math.sin(angle) * 0.43);
      }
      ball(0, 2.87, 0.25, amber);
      break;
    case 'erosion':
      box(-1.65, 0.51, 3.7, 0.9, 2.7, a === 2 ? 0x4d7c0f : 0xa16207).rotation.z = a === 1 ? -0.36 : -0.19;
      if (b) box(0.55, 0.26, 0.18, 0.5, 1.55, steel, 0.3);
      for (const x of [1.55, 2.55]) {
        box(x, 0.35, 0.57, 0.63, 0.63, 0xfef3c7, 0.48);
        mesh(new T.ConeGeometry(0.49, 0.35, 4), pink, x, 0.81, 0.48).rotation.y = Math.PI / 4;
      }
      if (outcome !== undefined) {
        for (let i = 0; i < 20; i++) ball(-2.8 + (i % 8) * 0.64, 1.25 + (i % 4) * 0.37, 0.055, blue, Math.sin(i) * 0.85);
        box(1.6, 0.08, 3.3, 0.1, n === 2 ? 0.45 : 1.26, n === 2 ? blue : 0xb45309, n === 2 ? -1.06 : 0.28);
      }
      break;
  }
  return animate;
}

export function clearVirtualLab(group: T.Group) {
  group.traverse(object => {
    if (object instanceof T.Mesh) {
      object.geometry.dispose();
      if (object.material instanceof T.Material) object.material.dispose();
    }
  });
  group.clear();
}
