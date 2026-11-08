let context: AudioContext | undefined;
let workshopMuted = false;
const outputs = new WeakMap<BaseAudioContext, GainNode>();
const liveOutputs = new Set<GainNode>();
const muteListeners = new Set<(muted:boolean)=>void>();
/** The single audible boundary for every WebAudio source, including already scheduled notes. */
export function getWorkshopAudioOutput(audio:BaseAudioContext):GainNode {
  const cached=outputs.get(audio);if(cached)return cached;
  const output=audio.createGain();output.gain.value=workshopMuted?0:1;output.connect(audio.destination);
  outputs.set(audio,output);liveOutputs.add(output);return output;
}
export function isWorkshopAudioMuted():boolean {return workshopMuted;}
export function subscribeWorkshopAudioMute(listener:(muted:boolean)=>void):()=>void {muteListeners.add(listener);return()=>{muteListeners.delete(listener);};}
export function setWorkshopAudioMuted(muted:boolean):void {
  workshopMuted=muted;
  for(const output of liveOutputs){
    if(output.context.state==='closed'){liveOutputs.delete(output);continue;}
    output.gain.cancelScheduledValues(output.context.currentTime);
    output.gain.setValueAtTime(muted?0:1,output.context.currentTime);
  }
  for(const listener of muteListeners)listener(muted);
}


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
