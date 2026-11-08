import { VehicleCategory, VisualStyleMode } from '../types/game';
import { getAudioContext, getWorkshopAudioOutput, isWorkshopAudioMuted, setWorkshopAudioMuted, subscribeWorkshopAudioMute } from './audioContext';

class WorkshopSoundEngine {
  private output: GainNode | undefined;
  private muted = false;
  private sfxVolume = 1;
  private activeSources = new Map<AudioScheduledSourceNode,GainNode>();
  constructor(){subscribeWorkshopAudioMute(muted=>{if(muted)this.stopSources();});}
  private stopSources(){
    for(const[source,gain]of this.activeSources){try{source.stop();}catch{/* Already ended. */}source.disconnect();gain.disconnect();}
    this.activeSources.clear();
  }
  private schedule(source:AudioScheduledSourceNode,gain:GainNode,start:number,end:number){
    this.activeSources.set(source,gain);
    source.onended=()=>{source.disconnect();gain.disconnect();this.activeSources.delete(source);};
    source.start(start);source.stop(end);
  }


  public setMuted(muted: boolean): void {
    this.muted = muted;
    setWorkshopAudioMuted(muted);
    this.updateVolume();
  }

  public setVolumeSfx(v: number): void {
    this.sfxVolume = Math.min(1, Math.max(0, v));
    this.updateVolume();
  }

  private ensureContext(): AudioContext | null {
    if (this.muted || isWorkshopAudioMuted() || !this.sfxVolume) return null;
    const context = getAudioContext();
    if (!context) return null;
    if (this.output?.context !== context) {
      this.output = context.createGain();
      this.output.connect(getWorkshopAudioOutput(context));
      this.updateVolume();
    }
    return context;
  }

  private updateVolume(): void {
    if (this.output) this.output.gain.value = this.muted ? 0 : this.sfxVolume;
  }

  public playPickup(style: VisualStyleMode): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = style === VisualStyleMode.WOOD ? 'triangle' : 'sine';
    const baseFreq = style === VisualStyleMode.BLOCKS ? 520 : style === VisualStyleMode.REALISTIC ? 440 : style === VisualStyleMode.COMICS ? 600 : 380;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.32, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.output!);
    this.schedule(osc,gain,now,now+.11);
  }

  public playMagnetHover(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.045);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.output!);
    this.schedule(osc,gain,now,now+.055);
  }

  public playSnapSuccess(style: VisualStyleMode): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (style === VisualStyleMode.WOOD) {
      // Warm wooden knock + marimba confirmation
      this.triggerTone(ctx, 'triangle', 190, 115, now, 0.09, 0.2);
      this.triggerTone(ctx, 'sine', 523.25, 659.25, now + 0.045, 0.14, 0.14);
    } else if (style === VisualStyleMode.BLOCKS) {
      // Crisp modular brick double-click
      this.triggerTone(ctx, 'square', 920, 1240, now, 0.035, 0.08);
      this.triggerTone(ctx, 'triangle', 680, 880, now + 0.04, 0.09, 0.14);
    } else {
      // Realistic ratchet wrench metallic click-tighten
      this.triggerTone(ctx, 'sawtooth', 620, 410, now, 0.03, 0.07);
      this.triggerTone(ctx, 'sawtooth', 760, 520, now + 0.045, 0.035, 0.08);
      this.triggerTone(ctx, 'sine', 587.33, 880, now + 0.085, 0.13, 0.12);
    }
  }

  public playGentleBounce(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.14);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.output!);
    this.schedule(osc,gain,now,now+.16);
  }

  public playStageVictory(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.095;
      this.triggerTone(ctx, 'triangle', freq, freq * 1.01, start, 0.28, 0.13);
    });
  }

  public playBadgeUnlocked(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880, 1174.66, 1318.51];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.075;
      this.triggerTone(ctx, 'sine', freq, freq * 1.015, start, 0.24, 0.12);
    });
  }

  public playTestDriveEngage(category: VehicleCategory): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (category === VehicleCategory.CAR || category === VehicleCategory.CONSTRUCTION) {
      // Sporty engine rev sweep
      this.triggerTone(ctx, 'sawtooth', 95, 220, now, 0.26, 0.09);
      this.triggerTone(ctx, 'triangle', 190, 420, now + 0.08, 0.28, 0.1);
    } else if (category === VehicleCategory.BOAT) {
      // Deep maritime horn chord + gentle splash tone
      this.triggerTone(ctx, 'triangle', 146.83, 146.83, now, 0.34, 0.13);
      this.triggerTone(ctx, 'sine', 220, 222, now + 0.03, 0.32, 0.09);
    } else if (category === VehicleCategory.PLANE) {
      // Turbine / rotor spool-up
      this.triggerTone(ctx, 'sine', 260, 780, now, 0.36, 0.1);
      this.triggerTone(ctx, 'triangle', 390, 980, now + 0.05, 0.32, 0.07);
    } else {
      // Space thruster ignition sweep
      this.triggerTone(ctx, 'sawtooth', 110, 520, now, 0.38, 0.09);
      this.triggerTone(ctx, 'sine', 440, 1174.66, now + 0.06, 0.34, 0.1);
    }
  }

  public playDiagnosticExtract(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.triggerTone(ctx, 'sawtooth', 540, 340, now, 0.05, 0.08);
    this.triggerTone(ctx, 'triangle', 480, 720, now + 0.055, 0.11, 0.12);
  }

  public playCameraShutter(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.triggerTone(ctx, 'square', 1400, 520, now, 0.028, 0.09);
    this.triggerTone(ctx, 'triangle', 980, 1560, now + 0.04, 0.05, 0.08);
  }

  public playPatentEarned(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.08;
      this.triggerTone(ctx, 'triangle', freq, freq * 1.01, start, 0.26, 0.13);
    });
  }

  private triggerTone(
    ctx: AudioContext,
    type: OscillatorType,
    startFreq: number,
    endFreq: number,
    startTime: number,
    duration: number,
    peakGain: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.output!);
    this.schedule(osc,gain,startTime,startTime+duration+.01);
  }
}

export const soundEngine = new WorkshopSoundEngine();
