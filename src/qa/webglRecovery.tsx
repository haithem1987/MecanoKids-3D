/** Local regression fixture for real context loss and preview churn; no game save access. */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WorkshopCanvas } from '../components/WorkshopCanvas';
import { PartPreview3D } from '../components/PartPreview3D';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { WEBGL_QA_TEXT } from '../i18n/translations';
import { CameraPreset, VisualStyleMode } from '../types/game';
import { advanceEnduranceClock, createEnduranceClock, EnduranceClock } from './enduranceClock';
import '../index.css';

const blueprint = VEHICLE_BLUEPRINTS[0];
const noop = () => {};
const faultyPartIds: string[] = [];
const ENDURANCE_MS = 20 * 60 * 1000;
const STYLES = Object.values(VisualStyleMode);

function WebGLRecoveryFixture() {
  const frame = useRef<HTMLDivElement>(null);
  const [losses, setLosses] = useState(0);
  const [restores, setRestores] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [clock, setClock] = useState<EnduranceClock>(() => createEnduranceClock(0, false));
  const [transitions, setTransitions] = useState(0);
  const [runtimeErrors, setRuntimeErrors] = useState<string[]>([]);
  const captures = useRef({ successful: 0, failed: 0 });
  const draws = useRef(0);
  const capture = useRef<(() => string | null) | null>(null);
  const visited = useRef(new Set<string>());
  const testedStyles = useRef(new Set<string>());
  const registerCapture = useCallback((fn: (() => string | null) | null) => { capture.current = fn; }, []);
  const activeBlueprint = started ? VEHICLE_BLUEPRINTS[transitions % VEHICLE_BLUEPRINTS.length] : blueprint;
  const activeStyle = started ? STYLES[Math.floor(transitions / VEHICLE_BLUEPRINTS.length) % STYLES.length] : VisualStyleMode.WOOD;
  const placedPartIds = useMemo(() => started ? activeBlueprint.parts.map((part) => part.id) : [], [started, activeBlueprint]);
  useEffect(() => {
    const canvas = frame.current?.querySelector('canvas');
    if (!canvas) return;
    const lost = () => setLosses((n) => n + 1), restored = () => setRestores((n) => n + 1);
    canvas.addEventListener('webglcontextlost', lost); canvas.addEventListener('webglcontextrestored', restored);
    const gl = canvas.getContext('webgl2');
    const restoreDraws = gl ? (() => {
      const originals = { drawElements: gl.drawElements, drawArrays: gl.drawArrays,
        drawElementsInstanced: gl.drawElementsInstanced, drawArraysInstanced: gl.drawArraysInstanced };
      gl.drawElements = (...args) => { draws.current++; originals.drawElements.apply(gl, args); };
      gl.drawArrays = (...args) => { draws.current++; originals.drawArrays.apply(gl, args); };
      gl.drawElementsInstanced = (...args) => { draws.current++; originals.drawElementsInstanced.apply(gl, args); };
      gl.drawArraysInstanced = (...args) => { draws.current++; originals.drawArraysInstanced.apply(gl, args); };
      return () => Object.assign(gl, originals);
    })() : noop;
    const onError = (event: ErrorEvent) => setRuntimeErrors((errors) => [...errors, event.message]);
    const onRejection = (event: PromiseRejectionEvent) => setRuntimeErrors((errors) => [...errors, String(event.reason)]);
    window.addEventListener('error', onError); window.addEventListener('unhandledrejection', onRejection);
    return () => {
      restoreDraws(); canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', restored);
      window.removeEventListener('error', onError); window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);
  useEffect(() => {
    if (step < 1 || step > 40) return;
    const timer = setTimeout(() => setStep((n) => n + 1), 100);
    return () => clearTimeout(timer);
  }, [step]);
  useEffect(() => {
    if (!running) return;
    let current = createEnduranceClock(performance.now(), document.visibilityState === 'visible');
    let lastTransitionAt = 0;
    const update = () => {
      current = advanceEnduranceClock(current, performance.now(), document.visibilityState === 'visible');
      setClock(current);
      if (current.visibleMs >= ENDURANCE_MS) { setRunning(false); return; }
      if (current.wasVisible && current.visibleMs - lastTransitionAt >= 2000) {
        lastTransitionAt = current.visibleMs;
        setTransitions((value) => value + 1);
      }
    };
    const timer = setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, [running]);
  useEffect(() => {
    if (!started) return;
    visited.current.add(activeBlueprint.id); testedStyles.current.add(activeStyle);
    const timer = setTimeout(() => {
      const canvas = frame.current?.querySelector('canvas');
      const gl = canvas?.getContext('webgl2');
      if (gl && !gl.isContextLost() && capture.current?.()?.startsWith('data:image/png')) captures.current.successful++;
      else captures.current.failed++;
    }, 250);
    return () => clearTimeout(timer);
  }, [started, activeBlueprint, activeStyle]);
  return <main className="p-4 space-y-3">
    <h1 className="text-xl font-bold">Octo Gears — WebGL QA</h1>
    <div className="flex gap-4 items-center">
      <button className="min-h-[64px] px-4 bg-white border rounded" onClick={() => {
        frame.current?.querySelector('canvas')?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
      }}>{WEBGL_QA_TEXT.lose[0]}</button>
      <button className="min-h-[64px] px-4 bg-white border rounded" disabled={step > 0 && step <= 40} onClick={() => setStep(1)}>{WEBGL_QA_TEXT.previews[0]}</button>
      <output data-testid="counts">{WEBGL_QA_TEXT.counts[0]} : {losses} / {restores}</output>
      <output data-testid="previews">{Math.max(0, Math.min(40, step - 1))}/40</output>
    </div>
    <div className="flex flex-wrap gap-4 items-center">
      <button className="min-h-[64px] px-4 bg-white border rounded" disabled={running} onClick={() => {
        captures.current = { successful: 0, failed: 0 }; draws.current = 0;
        visited.current.clear(); testedStyles.current.clear(); setRuntimeErrors([]);
        setTransitions(0); setStarted(true); setRunning(true);
      }}>{WEBGL_QA_TEXT.endurance[0]}</button>
      <button className="min-h-[64px] px-4 bg-white border rounded" disabled={!running} onClick={() => setRunning(false)}>{WEBGL_QA_TEXT.stop[0]}</button>
      <output data-testid="endurance-clock">{Math.floor(clock.visibleMs / 1000)} / 1200 s · {WEBGL_QA_TEXT.models[0]} : {visited.current.size} / {testedStyles.current.size}</output>
    </div>
    <pre data-testid="endurance-report" className="text-xs whitespace-pre-wrap">{JSON.stringify({
      running, completed: clock.visibleMs >= ENDURANCE_MS, wallSeconds: Math.round(clock.wallMs / 1000),
      visibleSeconds: Math.round(clock.visibleMs / 1000), visibility: document.visibilityState,
      transitions, models: visited.current.size, styles: [...testedStyles.current],
      captures: captures.current, drawCallsObserved: draws.current, losses, restores, runtimeErrors,
    }, null, 2)}</pre>
    <div className="flex gap-4">
      <div ref={frame} className="h-[580px] w-[800px] border rounded overflow-hidden">
        <WorkshopCanvas language="fr" blueprint={activeBlueprint} placedPartIds={placedPartIds}
          visualStyle={activeStyle} liveryPreset="original" environmentMode="studio"
          xRayMode={false} testDriveActive={false} noSilhouetteMode={false} faultyPartIds={faultyPartIds}
          explodedFactor={0} cameraPreset={CameraPreset.ISO} cameraPresetNonce={transitions}
          activeDragPartId={null} stagedPartId={null} hintPartId={null}
          onRegisterSnapshotCapture={registerCapture}
          onPartSnapped={noop} onPartDropRejected={noop} onDragEndSignal={noop} onStartCanvasDrag={noop}/>
      </div>
      {step > 0 && step <= 40 && <PartPreview3D key={step} part={blueprint.parts[step % blueprint.parts.length]} />}
    </div>
  </main>;
}

createRoot(document.getElementById('root')!).render(<WebGLRecoveryFixture />);
