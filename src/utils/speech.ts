import { useCallback, useEffect, useState } from 'react';
import { LanguageCode } from '../types/game';

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
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.addEventListener?.('voiceschanged', () => {
          this.voicesLoaded = true;
        });
      } catch {
        // Ignore restricted iframe speech synthesis errors
      }
    }
  }

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
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
    if (!this.isSupported()) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    this.voicesLoaded = true;

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
    if (!this.isSupported()) return;
    const cleanText = rawText
      .replace(/[✓★·]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleanText) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new window.SpeechSynthesisUtterance(cleanText);
      utterance.lang = LANG_BCP47_MAP[lang][0];
      if (!this.voicesLoaded) {
        window.speechSynthesis.getVoices();
      }
      const matchedVoice = this.pickBestVoice(lang);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      }

      // Slightly gentler pace for children aged 6–10
      utterance.rate = lang === 'ar' ? 0.94 : 0.96;
      utterance.pitch = 1.02;

      this.activeId = id;
      this.speaking = true;
      this.emit();

      utterance.onend = () => {
        if (this.activeId === id) {
          this.activeId = null;
          this.speaking = false;
          this.emit();
        }
      };

      utterance.onerror = () => {
        if (this.activeId === id) {
          this.activeId = null;
          this.speaking = false;
          this.emit();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.activeId = null;
      this.speaking = false;
      this.emit();
    }
  }

  public toggle(id: string, text: string, lang: LanguageCode): void {
    if (this.speaking && this.activeId === id) {
      this.stop();
    } else {
      this.speak(id, text, lang);
    }
  }

  public stop(): void {
    if (!this.isSupported()) return;
    try {
      window.speechSynthesis.cancel();
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

  return {
    isSupported: snapshot.isSupported,
    isSpeaking: snapshot.isSpeaking,
    activeId: snapshot.activeId,
    speak,
    toggle,
    stop,
  };
}
