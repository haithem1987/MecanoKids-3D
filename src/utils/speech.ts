import { useCallback, useEffect, useState } from 'react';
import { LanguageCode } from '../types/game';
import { getAudioContext, isWorkshopAudioMuted, subscribeWorkshopAudioMute } from '../audio/audioContext';
import { playRecordedNarration } from '../audio/recordedNarration';

interface SpeechSnapshot {
  isSupported: boolean;
  isSpeaking: boolean;
  activeId: string | null;
}

const LANG_BCP47_MAP: Record<LanguageCode, string[]> = {
  fr: ['fr-FR', 'fr-CA', 'fr-BE', 'fr-CH', 'fr'],
  en: ['en-US', 'en-GB', 'en-CA', 'en-AU', 'en'],
  ar: ['ar-SA', 'ar-EG', 'ar-AE', 'ar-MA', 'ar'],
};

class SpeechNarrator {
  private listeners = new Set<() => void>();
  private activeId: string | null = null;
  private speaking = false;
  private utterance: SpeechSynthesisUtterance | undefined;
  private playback: ReturnType<typeof playRecordedNarration> | undefined;
  private request = 0;
  private startTimeout: ReturnType<typeof setTimeout> | undefined;
  private voiceVolume = 1;
  public lastSpoken: { id: string; text: string; lang: LanguageCode } | null = null;

  constructor(){subscribeWorkshopAudioMute(muted=>{if(muted)this.stop();});}

  public setVoiceVolume(v: number): void {
    this.voiceVolume = Math.min(1, Math.max(0, v));
    this.playback?.setVolume(this.voiceVolume);
    if(this.utterance)this.utterance.volume=this.voiceVolume;
    if (!this.voiceVolume) this.stop();
  }

  private hasNativeSpeech(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  }

  public isSupported(): boolean {
    return this.hasNativeSpeech() || (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window));
  }

  public getSnapshot(): SpeechSnapshot {
    return {
      isSupported: this.isSupported(),
      isSpeaking: this.speaking,
      activeId: this.activeId,
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private pickBestVoice(lang: LanguageCode): SpeechSynthesisVoice | null {
    if (!this.hasNativeSpeech()) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const candidates = LANG_BCP47_MAP[lang];
    for (const prefix of candidates) {
      const exactLocal = voices.find(
        (v) => v.lang.toLowerCase() === prefix.toLowerCase() && v.localService,
      );
      if (exactLocal) return exactLocal;

      const exactAny = voices.find((v) => v.lang.toLowerCase() === prefix.toLowerCase());
      if (exactAny) return exactAny;
    }

    const shortPrefix = lang.toLowerCase();
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith(shortPrefix) && v.localService) ??
      voices.find((v) => v.lang.toLowerCase().startsWith(shortPrefix)) ??
      null
    );
  }

  public speak(id: string, rawText: string, lang: LanguageCode): void {
    if (!this.isSupported() || !this.voiceVolume || isWorkshopAudioMuted()) return;
    const cleanText = rawText
      .replace(/[✓★·]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleanText) return;

    this.stop();
    const request = this.request;
    const context = getAudioContext();
    this.lastSpoken = { id, text: cleanText, lang };
    this.activeId = id;
    this.speaking = true;
    this.emit();

    const finish = () => {
      if (request !== this.request) return;
      clearTimeout(this.startTimeout);
      this.utterance = undefined;
      this.playback = undefined;
      this.activeId = null;
      this.speaking = false;
      this.emit();
    };
    const fallback = () => {
      if (request !== this.request || isWorkshopAudioMuted() || !this.voiceVolume) return;
      clearTimeout(this.startTimeout);
      this.utterance = undefined;
      if (!context) { finish(); return; }
      try {
        const playback = playRecordedNarration(context, cleanText, lang, this.voiceVolume);
        this.playback = playback;
        void playback.done.then(finish, finish);
      } catch {
        finish();
      }
    };
    try {
      const matchedVoice = this.pickBestVoice(lang);
      if (!this.hasNativeSpeech() || (!matchedVoice && context)) { fallback(); return; }
      const synth = window.speechSynthesis;
      const utterance = new window.SpeechSynthesisUtterance(cleanText);
      this.utterance = utterance;
      utterance.lang = LANG_BCP47_MAP[lang][0];
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      }

      // Slightly gentler pace for children aged 6–10
      utterance.rate = lang === 'ar' ? 0.94 : 0.96;
      utterance.pitch = 1.02;
      utterance.volume = this.voiceVolume;

      utterance.onstart = () => clearTimeout(this.startTimeout);
      utterance.onend = finish;
      utterance.onerror = fallback;
      this.startTimeout = setTimeout(() => {
        if (request !== this.request || this.utterance !== utterance) return;
        utterance.onend = null;
        utterance.onerror = null;
        utterance.onstart = null;
        synth.cancel();
        fallback();
      }, 1800);
      if (synth.paused) synth.resume();
      synth.speak(utterance);
    } catch {
      fallback();
    }
  }

  public toggle(id: string, text: string, lang: LanguageCode): void {
    if (this.speaking && this.activeId === id) {
      this.stop();
    } else {
      this.speak(id, text, lang);
    }
  }

  public replay(): void {
    if (this.lastSpoken) {
      this.speak(this.lastSpoken.id, this.lastSpoken.text, this.lastSpoken.lang);
    }
  }

  public stop(): void {
    this.request++;
    clearTimeout(this.startTimeout);
    if (this.utterance) {
      this.utterance.onend = null;
      this.utterance.onerror = null;
      this.utterance.onstart = null;
      this.utterance = undefined;
    }
    this.playback?.stop();
    this.playback = undefined;
    try {
      if (this.hasNativeSpeech()) window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
    if (this.speaking || this.activeId !== null) {
      this.activeId = null;
      this.speaking = false;
      this.emit();
    }
  }
}

export const speechEngine = new SpeechNarrator();

export function useSpeech() {
  const [snapshot, setSnapshot] = useState<SpeechSnapshot>(() => speechEngine.getSnapshot());

  useEffect(() => {
    setSnapshot(speechEngine.getSnapshot());
    return speechEngine.subscribe(() => {
      setSnapshot(speechEngine.getSnapshot());
    });
  }, []);

  const speak = useCallback((id: string, text: string, lang: LanguageCode) => {
    speechEngine.speak(id, text, lang);
  }, []);

  const toggle = useCallback((id: string, text: string, lang: LanguageCode) => {
    speechEngine.toggle(id, text, lang);
  }, []);

  const stop = useCallback(() => {
    speechEngine.stop();
  }, []);

  const replay = useCallback(() => {
    speechEngine.replay();
  }, []);

  return {
    isSupported: snapshot.isSupported,
    isSpeaking: snapshot.isSpeaking,
    activeId: snapshot.activeId,
    speak,
    toggle,
    stop,
    replay,
  };
}
