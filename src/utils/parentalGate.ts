import { LanguageCode } from '../types/game';

export const MAX_PARENTAL_GATE_ATTEMPTS = 3;
export const PARENTAL_GATE_COOLDOWN_SECONDS = 30;
export const ADULT_SESSION_TTL_MS = 5 * 60 * 1000;

export interface ParentalGateChallenge {
  id: string;
  questionText: string;
  expectedAnswer: number;
}

const NUMBER_WORDS: Record<LanguageCode, Record<number, string>> = {
  fr: {
    2: 'deux',
    3: 'trois',
    4: 'quatre',
    5: 'cinq',
    6: 'six',
    7: 'sept',
    8: 'huit',
    9: 'neuf',
  },
  en: {
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
  },
  ar: {
    2: 'اثنين',
    3: 'ثلاثة',
    4: 'أربعة',
    5: 'خمسة',
    6: 'ستة',
    7: 'سبعة',
    8: 'ثمانية',
    9: 'تسعة',
  },
};

function randomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an adult-only arithmetic challenge written in full words
 * (a * b + c or a * b - c) so young children (5-7) cannot solve it by pattern matching digits.
 */
export function generateParentalGateChallenge(
  lang: LanguageCode,
  deterministicFactors?: { a: number; b: number; c: number; op: 'add' | 'sub' },
): ParentalGateChallenge {
  const a = deterministicFactors?.a ?? randomIntInclusive(4, 9);
  const b = deterministicFactors?.b ?? randomIntInclusive(4, 9);
  const c = deterministicFactors?.c ?? randomIntInclusive(2, 9);
  const op = deterministicFactors?.op ?? (Math.random() < 0.5 ? 'add' : 'sub');

  const expectedAnswer = op === 'add' ? a * b + c : a * b - c;
  const words = NUMBER_WORDS[lang];
  const wa = words[a] ?? String(a);
  const wb = words[b] ?? String(b);
  const wc = words[c] ?? String(c);

  let questionText: string;
  if (lang === 'ar') {
    questionText =
      op === 'add'
        ? `كم يساوي ${wa} ضرب ${wb} زائد ${wc}؟`
        : `كم يساوي ${wa} ضرب ${wb} ناقص ${wc}؟`;
  } else if (lang === 'en') {
    questionText =
      op === 'add'
        ? `What is ${wa} times ${wb} plus ${wc}?`
        : `What is ${wa} times ${wb} minus ${wc}?`;
  } else {
    questionText =
      op === 'add'
        ? `Combien font ${wa} fois ${wb} plus ${wc} ?`
        : `Combien font ${wa} fois ${wb} moins ${wc} ?`;
  }

  return {
    id: `gate-${a}-${b}-${c}-${op}-${Date.now()}`,
    questionText,
    expectedAnswer,
  };
}

/**
 * Parses both standard Western digits (0-9) and Eastern Arabic-Indic / Persian digits
 * so parents typing on an Arabic tablet keyboard pass seamlessly.
 */
export function parseAdultNumericAnswer(raw: string): number | null {
  const normalized = raw
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));

  if (!/^-?\d+$/.test(normalized)) {
    return null;
  }
  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : null;
}
