import type { LanguageCode } from '../types/game';
import { narrationKey, narrationPhrases } from './narrationText';
import {getWorkshopAudioOutput,isWorkshopAudioMuted,subscribeWorkshopAudioMute} from './audioContext';

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
  gain.connect(getWorkshopAudioOutput(context));
  const stop=()=>{
    if(stopped)return;
    stopped=true;gain.gain.cancelScheduledValues(context.currentTime);gain.gain.setValueAtTime(0,context.currentTime);
    try{playing?.stop();}catch{/* A source may have ended while mute was being applied. */}
  };
  const unsubscribe=subscribeWorkshopAudioMute(muted=>{if(muted)stop();});
  if(isWorkshopAudioMuted()||volume<=0)stop();
  const done = (async () => {
    try {
      if(stopped)return;
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
      unsubscribe();
      gain.disconnect();
    }
  })();
  return {
    done,
    stop,
    setVolume(volume:number){
      if(stopped)return;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(Math.max(0,Math.min(1,volume)),context.currentTime);
      if(volume<=0)stop();
    },
  };
}
