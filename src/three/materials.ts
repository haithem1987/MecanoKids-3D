import * as THREE from 'three';
import { PartSpec, VehicleCategory, VisualStyleMode, WorkshopGroundPreset } from '../types/game';

const textureCache = new Map<string, THREE.CanvasTexture>();

export function createWoodGrainTexture(
  baseHex: string,
  grainHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const key = `wood_${baseHex}_${grainHex}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = grainHex;
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 46; i++) {
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    const yBase = (i / 46) * 256;
    ctx.moveTo(0, yBase);
    for (let x = 0; x <= 256; x += 32) {
      const wave = Math.sin((x + i * 17) * 0.045) * 4.5;
      ctx.lineTo(x, yBase + wave);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  textureCache.set(key, tex);
  return tex;
}

export function createBrushedMetalTexture(
  baseHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const key = `brushed_${baseHex}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 2) {
    const shade = (y * 19) % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
    ctx.fillStyle = shade;
    ctx.fillRect(0, y, 256, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  textureCache.set(key, tex);
  return tex;
}

export function createTurntableTexture(
  style: VisualStyleMode,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const key = `turntable_${style}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (style === VisualStyleMode.WOOD) {
    ctx.fillStyle = '#e7cfa8';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#caa675';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(120, 82, 40, 0.28)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 256, 210, 0, Math.PI * 2);
    ctx.stroke();
  } else if (style === VisualStyleMode.BLOCKS) {
    ctx.fillStyle = '#dbeafe';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2;
    const step = 32;
    for (let x = step / 2; x < 512; x += step) {
      for (let y = step / 2; y < 512; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#bfdbfe';
        ctx.fill();
        ctx.stroke();
      }
    }
  } else if (style === VisualStyleMode.COMICS) {
    // halftone dots on yellow
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#1e293b';
    const dotStep = 24;
    for (let x = 0; x < 512; x += dotStep) {
      for (let y = 0; y < 512; y += dotStep) {
        const offset = ((x / dotStep) % 2) * (dotStep / 2);
        ctx.beginPath();
        ctx.arc(x + 4, y + 4 + offset, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    ctx.fillStyle = '#dde4ee';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 256, 212, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  textureCache.set(key, tex);
  return tex;
}

export function createGroundTexture(
  preset: WorkshopGroundPreset,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const key = `ground_${preset}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (preset === 'asphalt') {
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 8) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 4, 512); ctx.stroke();
    }
    // dashed center line
    ctx.setLineDash([40, 20]);
    ctx.strokeStyle = '#f0c040';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 512); ctx.stroke();
    ctx.setLineDash([]);
  } else if (preset === 'grass') {
    ctx.fillStyle = '#4a7c3f';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#3d6834';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(128, y - 4, 384, y + 4, 512, y); ctx.stroke();
    }
    ctx.strokeStyle = '#5c9e50';
    ctx.lineWidth = 1;
    for (let x = 8; x < 512; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 4, 512); ctx.stroke();
    }
  } else if (preset === 'sand') {
    ctx.fillStyle = '#e2c97e';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#d4b96a';
    for (let i = 0; i < 300; i++) {
      const x = Math.sin(i * 137.5) * 256 + 256;
      const y = Math.cos(i * 97.3) * 256 + 256;
      ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(200, 165, 80, 0.4)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 48) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(170, y + 12, 340, y - 12, 512, y); ctx.stroke();
    }
  } else if (preset === 'snow') {
    ctx.fillStyle = '#eef4fb';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#dde8f5';
    for (let i = 0; i < 200; i++) {
      const x = (i * 73) % 512;
      const y = (i * 97) % 512;
      const r = 3 + (i % 5);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(180,210,240,0.5)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }
  } else if (preset === 'circuit') {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 6;
    const grid = 64;
    for (let x = 0; x <= 512; x += grid) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
    }
    for (let y = 0; y <= 512; y += grid) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00e5ff';
    for (let x = 0; x <= 512; x += grid) {
      for (let y = 0; y <= 512; y += grid) {
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (preset === 'light_wood') {
    ctx.fillStyle = '#d4aa70';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#b8926a';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(90, 55, 20, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 26, 0);
      ctx.bezierCurveTo(i * 26 + 10, 170, i * 26 - 8, 340, i * 26 + 4, 512);
      ctx.stroke();
    }
  } else if (preset === 'moon') {
    ctx.fillStyle = '#2d2d35';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#3a3a44';
    for (let i = 0; i < 40; i++) {
      const x = (i * 103) % 512;
      const y = (i * 157) % 512;
      const r = 6 + (i % 12);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(200, 200, 220, 0.12)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(220, 220, 240, 0.6)';
    for (let i = 0; i < 80; i++) {
      const x = (i * 71 + 13) % 512;
      const y = (i * 113 + 37) % 512;
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }
  } else { // water
    ctx.fillStyle = '#1e6b8e';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 24) {
      const grad = ctx.createLinearGradient(0, y, 0, y + 24);
      grad.addColorStop(0, 'rgba(30, 120, 170, 0.6)');
      grad.addColorStop(0.5, 'rgba(10, 80, 130, 0.4)');
      grad.addColorStop(1, 'rgba(30, 120, 170, 0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, 512, 24);
    }
    ctx.strokeStyle = 'rgba(150, 220, 255, 0.4)';
    ctx.lineWidth = 2;
    for (let y = 12; y < 512; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(128, y - 8, 384, y + 8, 512, y);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  textureCache.set(key, tex);
  return tex;
}

export function createThematicTurntableTexture(
  category: VehicleCategory,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const key = `thematic_turntable_${category}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;

  if (category === VehicleCategory.CAR) {
    // Asphalt test circuit with racing kerbs & centerline dashes
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle asphalt grain speckles
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i < 420; i++) {
      const x = (i * 73) % 512;
      const y = (i * 137) % 512;
      ctx.fillRect(x, y, 2, 2);
    }

    // Red & white FIA racing kerb ring
    const segments = 36;
    for (let s = 0; s < segments; s++) {
      const a0 = (s / segments) * Math.PI * 2;
      const a1 = ((s + 1) / segments) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 228, a0, a1);
      ctx.lineWidth = 16;
      ctx.strokeStyle = s % 2 === 0 ? '#ef4444' : '#f8fafc';
      ctx.stroke();
    }

    // Center dashed test-lane markings
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.72)';
    ctx.lineWidth = 5;
    ctx.setLineDash([22, 18]);
    ctx.beginPath();
    ctx.moveTo(cx - 56, 36);
    ctx.lineTo(cx - 56, 476);
    ctx.moveTo(cx + 56, 36);
    ctx.lineTo(cx + 56, 476);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (category === VehicleCategory.BOAT) {
    // Harbor water basin with concentric aqua ripples & quay ring
    const grad = ctx.createRadialGradient(cx, cy, 24, cx, cy, 248);
    grad.addColorStop(0, '#0ea5e9');
    grad.addColorStop(0.65, '#0284c7');
    grad.addColorStop(1, '#0369a1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(224, 242, 254, 0.32)';
    ctx.lineWidth = 2.5;
    for (const r of [72, 118, 164, 204]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Wooden/stone harbor quay outer border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, 232, 0, Math.PI * 2);
    ctx.stroke();
  } else if (category === VehicleCategory.PLANE) {
    // Airfield tarmac runway with piano-key threshold & yellow taxi centerline
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, 512, 512);

    // Darker central runway strip
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 96, 0, 192, 512);

    // White runway side lines
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - 90, 20);
    ctx.lineTo(cx - 90, 492);
    ctx.moveTo(cx + 90, 20);
    ctx.lineTo(cx + 90, 492);
    ctx.stroke();

    // Yellow taxi/centerline dashes
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.setLineDash([26, 18]);
    ctx.beginPath();
    ctx.moveTo(cx, 32);
    ctx.lineTo(cx, 480);
    ctx.stroke();
    ctx.setLineDash([]);

    // Threshold piano keys
    ctx.fillStyle = 'rgba(248,250,252,0.86)';
    for (const dx of [-66, -42, 42, 66]) {
      ctx.fillRect(cx + dx - 7, 62, 14, 42);
      ctx.fillRect(cx + dx - 7, 408, 14, 42);
    }
  } else if (category === VehicleCategory.CONSTRUCTION) {
    // Reinforced concrete engineering pad with safety chevron border
    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(41, 37, 36, 0.14)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 48) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    const segments = 40;
    for (let s = 0; s < segments; s++) {
      const a0 = (s / segments) * Math.PI * 2;
      const a1 = ((s + 1) / segments) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 226, a0, a1);
      ctx.lineWidth = 18;
      ctx.strokeStyle = s % 2 === 0 ? '#f59e0b' : '#1e293b';
      ctx.stroke();
    }
  } else {
    // SPACE: Orbital launchpad deck with azimuth rings & flame-deflector grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 512);

    // Central flame-trench grate
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 72, cy - 72, 144, 144);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    for (let g = -60; g <= 60; g += 20) {
      ctx.beginPath();
      ctx.moveTo(cx + g, cy - 70);
      ctx.lineTo(cx + g, cy + 70);
      ctx.stroke();
    }

    for (const r of [112, 168, 224]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = r === 224 ? '#38bdf8' : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = r === 224 ? 5 : 2;
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  textureCache.set(key, tex);
  return tex;
}

export function createRadialShadowTexture(): THREE.CanvasTexture {
  const key = 'radial_contact_shadow';
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.42)');
  grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.16)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, tex);
  return tex;
}

export interface PartMaterialSet {
  primary: THREE.Material;
  secondary: THREE.Material;
  darkRubber: THREE.Material;
  metalAccent: THREE.Material;
  glass: THREE.Material;
}

function createToonGradientMap(): THREE.DataTexture {
  // 3-step toon ramp: shadow / mid / highlight
  const data = new Uint8Array([80, 160, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  tex.needsUpdate = true;
  return tex;
}

export function createPartMaterialSet(
  spec: PartSpec,
  style: VisualStyleMode,
  isSoftwareGl: boolean,
  maxAnisotropy: number,
): PartMaterialSet {
  if (spec.isRarePart) {
    const brushedGold = createBrushedMetalTexture('#f59e0b', maxAnisotropy);
    const brushedTitanium = createBrushedMetalTexture('#e2e8f0', maxAnisotropy);
    return {
      primary: new THREE.MeshPhysicalMaterial({
        map: brushedGold,
        color: '#fbbf24',
        emissive: '#b45309',
        emissiveIntensity: 0.16,
        roughness: 0.18,
        metalness: 0.92,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
      }),
      secondary: new THREE.MeshPhysicalMaterial({
        map: brushedTitanium,
        color: '#f8fafc',
        roughness: 0.22,
        metalness: 0.88,
        clearcoat: 0.9,
      }),
      darkRubber: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.65,
        metalness: 0.25,
      }),
      metalAccent: new THREE.MeshPhysicalMaterial({
        color: '#fef08a',
        emissive: '#d97706',
        emissiveIntensity: 0.22,
        roughness: 0.14,
        metalness: 0.96,
        clearcoat: 1.0,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#fde68a',
        roughness: 0.08,
        metalness: 0.1,
        transmission: isSoftwareGl ? 0 : 0.82,
        transparent: true,
        opacity: isSoftwareGl ? 0.48 : 1,
        depthWrite: false,
        ior: 1.52,
        clearcoat: 1.0,
      }),
    };
  }

  if (style === VisualStyleMode.COMICS) {
    const gradMap = createToonGradientMap();
    const toon = (color: string) =>
      new THREE.MeshToonMaterial({ color, gradientMap: gradMap });
    return {
      primary: toon(spec.primaryColor),
      secondary: toon(spec.secondaryColor),
      darkRubber: toon('#1e293b'),
      metalAccent: toon('#f59e0b'),
      glass: new THREE.MeshToonMaterial({
        color: '#7dd3fc',
        gradientMap: gradMap,
        transparent: true,
        opacity: 0.72,
      }),
    };
  }

  if (style === VisualStyleMode.WOOD) {
    const naturalWood = createWoodGrainTexture('#dfbe91', '#9c6b3b', maxAnisotropy);
    const paintedPrimary = createWoodGrainTexture(spec.primaryColor, '#4a2e14', maxAnisotropy);
    const paintedSecondary = createWoodGrainTexture(spec.secondaryColor, '#4a2e14', maxAnisotropy);

    return {
      primary:
        spec.materialKind === 'wood_structural'
          ? new THREE.MeshStandardMaterial({
              map: naturalWood,
              roughness: 0.68,
              metalness: 0.04,
            })
          : new THREE.MeshStandardMaterial({
              map: paintedPrimary,
              roughness: 0.36,
              metalness: 0.22,
            }),
      secondary: new THREE.MeshStandardMaterial({
        map: paintedSecondary,
        roughness: 0.62,
        metalness: 0.08,
      }),
      darkRubber: new THREE.MeshStandardMaterial({
        map: createWoodGrainTexture('#5c4033', '#2e1d14', maxAnisotropy),
        roughness: 0.78,
        metalness: 0.05,
      }),
      metalAccent: new THREE.MeshStandardMaterial({
        color: '#d99b38',
        roughness: 0.32,
        metalness: 0.72,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#bae6fd',
        roughness: 0.14,
        metalness: 0.05,
        transmission: isSoftwareGl ? 0 : 0.78,
        transparent: true,
        opacity: isSoftwareGl ? 0.45 : 1,
        depthWrite: false,
        ior: 1.48,
      }),
    };
  }

  if (style === VisualStyleMode.BLOCKS) {
    return {
      primary: new THREE.MeshPhysicalMaterial({
        color: spec.primaryColor,
        roughness: 0.18,
        metalness: 0.04,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),
      secondary: new THREE.MeshPhysicalMaterial({
        color: spec.secondaryColor,
        roughness: 0.22,
        metalness: 0.04,
        clearcoat: 0.9,
        clearcoatRoughness: 0.14,
      }),
      darkRubber: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.75,
        metalness: 0.05,
      }),
      metalAccent: new THREE.MeshPhysicalMaterial({
        color: '#facc15',
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#7dd3fc',
        roughness: 0.08,
        metalness: 0,
        transmission: isSoftwareGl ? 0 : 0.85,
        transparent: true,
        opacity: isSoftwareGl ? 0.42 : 1,
        depthWrite: false,
        clearcoat: 1.0,
      }),
    };
  }

  // VisualStyleMode.REALISTIC
  const brushed = createBrushedMetalTexture('#cbd5e1', maxAnisotropy);
  return {
    primary: new THREE.MeshPhysicalMaterial({
      color: spec.primaryColor,
      roughness: 0.24,
      metalness: 0.55,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
    }),
    secondary: new THREE.MeshPhysicalMaterial({
      color: spec.secondaryColor,
      roughness: 0.38,
      metalness: 0.65,
      anisotropy: 0.65,
    }),
    darkRubber: new THREE.MeshStandardMaterial({
      color: '#18181b',
      roughness: 0.88,
      metalness: 0.06,
    }),
    metalAccent: new THREE.MeshPhysicalMaterial({
      map: brushed,
      color: '#e2e8f0',
      roughness: 0.18,
      metalness: 0.92,
      anisotropy: 0.8,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#e0f2fe',
      roughness: 0.06,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.36 : 1,
      depthWrite: false,
      ior: 1.52,
      thickness: 0.8,
      clearcoat: 1.0,
    }),
  };
}

export function createGuideGhostMaterial(state: 'ready' | 'locked' | 'magnet' | 'hint'): THREE.MeshStandardMaterial {
  if (state === 'magnet') {
    return new THREE.MeshStandardMaterial({
      color: '#10b981',
      emissive: '#059669',
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.48,
      roughness: 0.3,
      depthWrite: false,
    });
  }
  if (state === 'hint') {
    return new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      emissive: '#d97706',
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.46,
      roughness: 0.35,
      depthWrite: false,
    });
  }
  if (state === 'locked') {
    return new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      transparent: true,
      opacity: 0.14,
      roughness: 0.6,
      depthWrite: false,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.28,
    roughness: 0.4,
    depthWrite: false,
  });
}

export function createXRayCutawayMaterial(baseColor = '#38bdf8'): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: baseColor,
    emissive: '#0284c7',
    emissiveIntensity: 0.14,
    transparent: true,
    opacity: 0.22,
    roughness: 0.14,
    metalness: 0.08,
    clearcoat: 0.85,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

export function createDiagnosticFaultMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: '#fb923c',
    emissive: '#ea580c',
    emissiveIntensity: 0.42,
    roughness: 0.32,
    metalness: 0.25,
  });
}

