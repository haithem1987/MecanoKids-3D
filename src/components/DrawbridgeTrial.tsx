import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DRAWBRIDGE_TEXT, SCIENCE_CHALLENGE_TEXT } from '../i18n/translations';
import type { LanguageCode, PartSpec } from '../types/game';
import { useSpeech } from '../utils/speech';
import { WorkshopMissionPortal } from './WorkshopMissionPortal';

export const DRAWBRIDGE_ID = 'master-drawbridge';

type Phase = 'closed' | 'opening' | 'open' | 'crossing' | 'passed' | 'closing';
interface DrawbridgeScene {
  turntableGroup: THREE.Group;
  placedPartEntries: Map<string, { group: THREE.Group; spec: PartSpec }>;
  reducedMotion: boolean;
  wakeRender: () => void;
  applyMechanismPose?: () => void;
}

const control = 'min-h-16 rounded-xl border border-sky-300 bg-white px-3 py-2 font-semibold text-sky-950 hover:bg-sky-100 disabled:opacity-50';
const raisedAngle = Math.PI * 0.37;
const zAxis = new THREE.Vector3(0, 0, 1);
const xAxis = new THREE.Vector3(1, 0, 0);
const sides = [-1, 1] as const;

function createTraffic() {
  const root = new THREE.Group();
  const boat = new THREE.Group();
  const mesh = (width: number, height: number, depth: number, color: number) =>
    new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshStandardMaterial({ color }));
  const water = mesh(1.1, 0.035, 4.6, 0x38bdf8);
  water.position.y = 0.13;
  const hull = mesh(0.34, 0.15, 0.69, 0xf97316);
  hull.position.y = 0.24;
  const cabin = mesh(0.24, 0.24, 0.34, 0xf8fafc);
  cabin.position.y = 0.42;
  const mast = mesh(0.04, 0.55, 0.04, 0x334155);
  mast.position.y = 0.81;
  boat.add(hull, cabin, mast);
  const lights = sides.map(side => {
    const light = mesh(0.11, 0.08, 0.13, 0x22c55e);
    light.position.set(side * 0.78, 1.42, 0.59);
    return light;
  });
  root.add(water, boat, ...lights);
  return { root, boat, lights };
}

function setPose(scene: DrawbridgeScene, angle: number) {
  const pivot = new THREE.Vector3();
  for (const side of sides) {
    pivot.set(side * 0.6, 1.04, 0);
    const rotation = -side * angle;
    const leaves = [`slab-1-${side}`, `lift-weight-${side}`,
      ...sides.flatMap(lane => [`lift-girder-${side}-${lane}`, `lift-rail-${side}-${lane}`])];
    for (const id of leaves) {
      const part = scene.placedPartEntries.get(id);
      if (!part) continue;
      part.group.position.fromArray(part.spec.targetPos).sub(pivot).applyAxisAngle(zAxis, rotation).add(pivot);
      part.group.rotation.z = rotation;
    }
    const barrier = scene.placedPartEntries.get(`lift-barrier-${side}`);
    if (barrier) {
      pivot.set(side * 0.78, 1.19, 0.59);
      const tilt = Math.PI / 2 * (1 - Math.min(1, angle / (raisedAngle * 0.18)));
      barrier.group.position.fromArray(barrier.spec.targetPos).sub(pivot).applyAxisAngle(xAxis, tilt).add(pivot);
      barrier.group.rotation.x = tilt;
    }
  }
}

export function DrawbridgeTrial({ engine, language, sceneRevision }: {
  engine: { current: DrawbridgeScene | null };
  language: LanguageCode;
  sceneRevision: string;
}) {
  const [phase, setPhase] = useState<Phase>('closed');
  const angleRef = useRef(0);
  const trafficRef = useRef<ReturnType<typeof createTraffic> | null>(null);
  const locale = language === 'fr' ? 0 : language === 'en' ? 1 : 2;
  const t = DRAWBRIDGE_TEXT;
  const { isSupported, toggle } = useSpeech();

  useEffect(() => {
    const scene = engine.current;
    if (!scene) return;
    scene.applyMechanismPose = () => setPose(scene, angleRef.current);
    const traffic = createTraffic();
    trafficRef.current = traffic;
    scene.turntableGroup.add(traffic.root);
    return () => {
      scene.applyMechanismPose = undefined;
      setPose(scene, 0);
      traffic.root.removeFromParent();
      traffic.root.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) object.material.dispose();
        }
      });
      trafficRef.current = null;
      scene.wakeRender();
    };
  }, [engine, sceneRevision]);

  useEffect(() => {
    const scene = engine.current;
    const traffic = trafficRef.current;
    if (!scene || !traffic) return;
    let frame = 0;
    const start = performance.now();
    const duration = phase === 'crossing' ? 1500 : 800;
    const next = phase === 'opening' ? 'open' : phase === 'closing' ? 'closed' : phase === 'crossing' ? 'passed' : undefined;
    const draw = (now: number) => {
      const p = scene.reducedMotion ? 1 : Math.min(1, (now - start) / duration);
      const eased = p * p * (3 - 2 * p);
      const angle = phase === 'opening' ? raisedAngle * eased : phase === 'closing' ? raisedAngle * (1 - eased)
        : phase === 'closed' ? 0 : raisedAngle;
      angleRef.current = angle;
      setPose(scene, angle);
      traffic.boat.position.z = phase === 'crossing' ? -1.75 + 3.5 * eased : phase === 'passed' ? 1.75 : -1.75;
      for (const light of traffic.lights) light.material.color.setHex(phase === 'closed' ? 0x22c55e : 0xef4444);
      scene.wakeRender();
      if (next && p < 1) frame = requestAnimationFrame(draw);
      else if (next) setPhase(next);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [engine, phase, sceneRevision]);

  const raised = phase === 'open' || phase === 'passed';
  return (
    <WorkshopMissionPortal><section data-drawbridge-phase={phase} dir={language === 'ar' ? 'rtl' : 'ltr'} aria-label={t.trial[locale]}
      className="pointer-events-auto space-y-2 rounded-xl border border-sky-200 bg-white p-3 shadow">
      <h2 className="font-bold text-sky-950">{t.trial[locale]}</h2>
      <p role="status" className="font-semibold text-sky-950">{t[phase][locale]}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={control} disabled={phase !== 'closed' && !raised}
          onClick={() => setPhase(raised ? 'closing' : 'opening')}>{t[raised || phase === 'crossing' || phase === 'closing' ? 'lower' : 'raise'][locale]}</button>
        <button type="button" className={control} disabled={!raised}
          onClick={() => setPhase('crossing')}>{t.sail[locale]}</button>
        {isSupported && <button type="button" className={control} onClick={() => toggle('drawbridge', t[phase][locale], language)}>
          {SCIENCE_CHALLENGE_TEXT.listen[locale]}
        </button>}
      </div>
    </section></WorkshopMissionPortal>
  );
}
