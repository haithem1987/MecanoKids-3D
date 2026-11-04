import { describe, it, expect, beforeEach, vi } from 'vitest';

class MockUtterance {
  lang = '';
  voice: SpeechSynthesisVoice | null = null;
  rate = 1;
  pitch = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public text: string) {}
}

function makeSynthMock() {
  return {
    speak: vi.fn((u: MockUtterance) => { u.onend?.(); }),
    cancel: vi.fn(),
    getVoices: vi.fn(() => [] as SpeechSynthesisVoice[]),
    addEventListener: vi.fn(),
  };
}

function setupSpeech() {
  const synth = makeSynthMock();
  // In Node env, window is undefined — set it to globalThis so the module's `'speechSynthesis' in window` check works
  Object.defineProperty(globalThis, 'window', { value: globalThis, writable: true, configurable: true });
  Object.defineProperty(globalThis, 'speechSynthesis', { value: synth, writable: true, configurable: true });
  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', { value: MockUtterance, writable: true, configurable: true });
  return synth;
}

beforeEach(() => {
  vi.resetModules();
});

describe('SpeechNarrator', () => {
  it('speak() calls window.speechSynthesis.speak', async () => {
    const synth = setupSpeech();
    const { speechEngine } = await import('./speech');
    speechEngine.speak('t1', 'Bonjour', 'fr');
    expect(synth.speak).toHaveBeenCalled();
  });

  it('stop() cancels synthesis and resets state', async () => {
    const synth = setupSpeech();
    const { speechEngine } = await import('./speech');
    speechEngine.speak('t2', 'Hello', 'en');
    speechEngine.stop();
    expect(synth.cancel).toHaveBeenCalledTimes(2); // once in speak, once in stop
    expect(speechEngine.getSnapshot().isSpeaking).toBe(false);
    expect(speechEngine.getSnapshot().activeId).toBeNull();
  });

  it('replay() re-speaks the last utterance', async () => {
    const synth = setupSpeech();
    const { speechEngine } = await import('./speech');
    speechEngine.speak('t3', 'Test', 'ar');
    const before = synth.speak.mock.calls.length;
    speechEngine.replay();
    expect(synth.speak.mock.calls.length).toBe(before + 1);
    expect(speechEngine.lastSpoken?.lang).toBe('ar');
  });

  it('replay() does nothing when nothing has been spoken', async () => {
    const synth = setupSpeech();
    const { speechEngine } = await import('./speech');
    speechEngine.replay();
    expect(synth.speak).not.toHaveBeenCalled();
  });

  it('speak() strips emoji/special chars before speaking', async () => {
    const synth = setupSpeech();
    const { speechEngine } = await import('./speech');
    speechEngine.speak('t4', '✓ Well done ★', 'en');
    const uttered = (synth.speak.mock.calls[0][0] as MockUtterance).text;
    expect(uttered).not.toContain('✓');
    expect(uttered).not.toContain('★');
  });

  it('isSupported() returns true when API present', async () => {
    setupSpeech();
    const { speechEngine } = await import('./speech');
    expect(speechEngine.isSupported()).toBe(true);
  });
});
