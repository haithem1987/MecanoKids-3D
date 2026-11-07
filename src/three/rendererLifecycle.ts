/** dispose() releases Three.js resources, but does not release the browser's WebGL context. */
export function releaseWebGLRenderer(renderer: { dispose(): void; forceContextLoss(): void }): void {
  try {
    renderer.dispose();
  } finally {
    renderer.forceContextLoss();
  }
}

/** Restored contexts must restart an idle render loop, not just hide the overlay. */
export function observeWebGLContext(
  canvas: EventTarget,
  callbacks: { lost: () => void; restored: () => void; wake: () => void },
): () => void {
  const lost = (event: Event) => { event.preventDefault(); callbacks.lost(); };
  const restored = () => { callbacks.restored(); callbacks.wake(); };
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', restored);
  return () => {
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.removeEventListener('webglcontextrestored', restored);
  };
}
