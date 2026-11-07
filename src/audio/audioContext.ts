let context: AudioContext | undefined;

export function getAudioContext(): AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  const AudioConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioConstructor) return undefined;
  try {
    if (!context || context.state === 'closed') context = new AudioConstructor();
    if (context.state !== 'running') void context.resume().catch(() => {});
    return context;
  } catch {
    return undefined;
  }
}

export function unlockWorkshopAudio() {
  if (typeof window === 'undefined') return;
  const unlock = () => {
    getAudioContext();
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
}
