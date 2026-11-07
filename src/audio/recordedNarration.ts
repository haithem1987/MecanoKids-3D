import type { LanguageCode } from '../types/game';
import { narrationKey, narrationPhrases } from './narrationText';

type Clip = [track: number, startMs: number, durationMs: number];
type Index = Record<string, Clip>;
const indices = new Map<LanguageCode, Promise<Index>>();
const buffers = new Map<string, Promise<AudioBuffer>>();

function readIndex(language: LanguageCode): Promise<Index> {
  const cached = indices.get(language);
  if (cached) return cached;
  const pending = fetch(`/narration/${language}/index.json`).then(async response => {
    if (!response.ok) throw new Error('Narration index unavailable');
    return await response.json() as Index;
  }).catch(error => {
    indices.delete(language);
    throw error;
  });
  indices.set(language, pending);
  return pending;
}

function readBuffer(context: AudioContext, url: string): Promise<AudioBuffer> {
  const cached = buffers.get(url);
  if (cached) return cached;
  const pending = fetch(url).then(response => {
    if (!response.ok) throw new Error('Narration track unavailable');
    return response.arrayBuffer();
  }).then(data => context.decodeAudioData(data)).catch(error => {
    buffers.delete(url);
    throw error;
  });
  buffers.set(url, pending);
  if (buffers.size > 4) {
    const oldest = buffers.keys().next().value;
    if (oldest) buffers.delete(oldest);
  }
  return pending;
}

export function playRecordedNarration(context: AudioContext, text: string, language: LanguageCode, volume: number) {
  let stopped = false;
  let playing: AudioBufferSourceNode | undefined;
  const gain = context.createGain();
  gain.gain.value = volume;
  gain.connect(context.destination);
  const done = (async () => {
    try {
      const index = await readIndex(language);
      const clips = narrationPhrases(text).flatMap(phrase => {
        const key = narrationKey(phrase);
        if (Object.hasOwn(index, key)) return [index[key]];
        return [];
      });
      for (const [track, startMs, durationMs] of clips) {
        if (stopped) break;
        const buffer = await readBuffer(context, `/narration/${language}/${track}.mp3`);
        if (stopped) break;
        await new Promise<void>(resolve => {
          const source = context.createBufferSource();
          playing = source;
          source.buffer = buffer;
          source.connect(gain);
          source.onended = () => {
            source.disconnect();
            playing = undefined;
            resolve();
          };
          source.start(0, startMs / 1000, durationMs / 1000);
        });
      }
    } finally {
      gain.disconnect();
    }
  })();
  return {
    done,
    stop() {
      stopped = true;
      playing?.stop();
    },
  };
}
