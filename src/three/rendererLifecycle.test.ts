import { describe, expect, it, vi } from 'vitest';
import { observeWebGLContext, releaseWebGLRenderer } from './rendererLifecycle';

describe('cycle de vie des contextes WebGL', () => {
  it('libère explicitement chaque contexte de miniature, même après plus de seize aperçus', () => {
    let active = 1; // Main scene stays active throughout preview mount/unmount cycles.
    let maximum = active;
    for (let i = 0; i < 40; i++) {
      active++; maximum = Math.max(maximum, active);
      const order: string[] = [];
      releaseWebGLRenderer({ dispose: () => { order.push('dispose'); }, forceContextLoss: () => { active--; order.push('release'); } });
      expect(order).toEqual(['dispose', 'release']);
    }
    expect(active).toBe(1); expect(maximum).toBe(2);
  });
  it('libère aussi le contexte si la destruction des ressources échoue', () => {
    const forceContextLoss = vi.fn();
    expect(() => releaseWebGLRenderer({ dispose: () => { throw new Error('dispose'); }, forceContextLoss })).toThrow('dispose');
    expect(forceContextLoss).toHaveBeenCalledOnce();
  });
  it('autorise la restauration, puis réveille le rendu et retire ses écouteurs au démontage', () => {
    const canvas = new EventTarget();
    const events: string[] = [];
    const stop = observeWebGLContext(canvas, { lost: () => events.push('lost'), restored: () => events.push('restored'), wake: () => events.push('frame') });
    const lost = new Event('webglcontextlost', { cancelable: true });
    canvas.dispatchEvent(lost);
    expect(lost.defaultPrevented).toBe(true);
    canvas.dispatchEvent(new Event('webglcontextrestored'));
    expect(events).toEqual(['lost', 'restored', 'frame']);
    stop(); canvas.dispatchEvent(new Event('webglcontextlost')); canvas.dispatchEvent(new Event('webglcontextrestored'));
    expect(events).toEqual(['lost', 'restored', 'frame']);
  });
});
