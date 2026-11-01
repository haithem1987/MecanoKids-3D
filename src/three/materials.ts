import * as THREE from 'three';
import { PartSpec, VisualStyleMode } from '../types/game';

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
