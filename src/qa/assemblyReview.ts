import { releaseWebGLRenderer } from '../three/rendererLifecycle';
/** Local Vite-only review page; not an application route or a production entry. */
import * as THREE from 'three';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { CATEGORIES, getCategoryLabel } from '../data/categories';
import { getLocalizedBlueprint, UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, VehicleCategory, VisualStyleMode } from '../types/game';
import { buildPartMeshGroup } from '../three/partGeometries';
import { isAssemblyComplete } from '../utils/assemblyValidation';

let language: LanguageCode = 'fr';
let category: VehicleCategory | 'all' = 'all';
let style = VisualStyleMode.REALISTIC;
const controls = document.querySelector<HTMLElement>('#controls')!;
const gallery = document.querySelector<HTMLElement>('#gallery')!;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(480, 360);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

function renderReview(): void {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  controls.replaceChildren(); gallery.replaceChildren();
  const t = UI_TRANSLATIONS[language];
  const languageSelect = document.createElement('select');
  languageSelect.setAttribute('aria-label', t.langSwitchAria);
  for (const lang of ['fr', 'en', 'ar'] as const) languageSelect.add(new Option(lang.toUpperCase(), lang, false, lang === language));
  languageSelect.onchange = () => { language = languageSelect.value as LanguageCode; renderReview(); };
  controls.append(languageSelect);
  const styleSelect = document.createElement('select');
  styleSelect.setAttribute('aria-label', t.styleRealistic);
  for (const [value, label] of [[VisualStyleMode.REALISTIC, t.styleRealistic], [VisualStyleMode.WOOD, t.styleWood],
    [VisualStyleMode.BLOCKS, t.styleBlocks], [VisualStyleMode.COMICS, t.styleComics]] as const) {
    styleSelect.add(new Option(label, value, false, value === style));
  }
  styleSelect.onchange = () => { style = styleSelect.value as VisualStyleMode; renderReview(); };
  controls.append(styleSelect);
  for (const value of ['all', ...CATEGORIES] as const) {
    const button = document.createElement('button');
    button.textContent = value === 'all' ? `${t.filterAll} (${VEHICLE_BLUEPRINTS.length})` : getCategoryLabel(value, language);
    button.setAttribute('aria-pressed', String(category === value));
    button.onclick = () => { category = value; renderReview(); };
    controls.append(button);
  }
  const blueprints = VEHICLE_BLUEPRINTS.filter((bp) => category === 'all' || bp.category === category);
  for (const raw of blueprints) {
    const bp = getLocalizedBlueprint(raw, language);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f1f5f9');
    scene.add(new THREE.HemisphereLight('#ffffff', '#64748b', 2.5));
    const light = new THREE.DirectionalLight('#ffffff', 3);
    light.position.set(3, 5, 4); scene.add(light);
    const group = new THREE.Group();
    for (const spec of bp.parts) {
      const mesh = buildPartMeshGroup(spec, style, false, 4);
      mesh.position.fromArray(spec.targetPos); group.add(mesh);
    }
    scene.add(group);
    const box = new THREE.Box3().setFromObject(group);
    const centre = box.getCenter(new THREE.Vector3());
    const radius = box.getBoundingSphere(new THREE.Sphere()).radius;
    const camera = new THREE.PerspectiveCamera(35, 4 / 3, 0.01, 200);
    const distance = radius / Math.sin(35 * Math.PI / 360) * 1.15;
    camera.position.copy(centre).add(new THREE.Vector3(0.6, 0.45, 1).normalize().multiplyScalar(distance));
    camera.lookAt(centre); renderer.render(scene, camera);
    const article = document.createElement('article'); article.dataset.blueprint = bp.id;
    const heading = document.createElement('h2'); heading.textContent = `${bp.stageNumber}. ${bp.name}`;
    const image = document.createElement('img'); image.alt = bp.name; image.src = renderer.domElement.toDataURL('image/png');
    const description = document.createElement('p'); description.textContent = `${getCategoryLabel(bp.category, language)} · ${bp.parts.length} · ${isAssemblyComplete(bp, bp.parts.map((p) => p.id)) ? t.statusCompleted : '⚠'}`;
    article.append(heading, image, description); gallery.append(article);
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => materials.add(m));
    });
    geometries.forEach((geometry) => geometry.dispose()); materials.forEach((material) => material.dispose());
    renderer.renderLists.dispose();
  }
}

renderReview();
window.addEventListener('pagehide', () => releaseWebGLRenderer(renderer), { once: true });
