import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ShieldCheck, X } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode } from '../types/game';
import {
  generateParentalGateChallenge,
  MAX_PARENTAL_GATE_ATTEMPTS,
  PARENTAL_GATE_COOLDOWN_SECONDS,
  ParentalGateChallenge,
  parseAdultNumericAnswer,
} from '../utils/parentalGate';

interface ParentalGateModalProps {
  isOpen: boolean;
  language: LanguageCode;
  onClose: () => void;
  onVerified: () => void;
}

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  isOpen,
  language,
  onClose,
  onVerified,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [challenge, setChallenge] = useState<ParentalGateChallenge>(() =>
    generateParentalGateChallenge(language),
  );
  const [answerInput, setAnswerInput] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setChallenge(generateParentalGateChallenge(language));
    setAnswerInput('');
    setFailedAttempts(0);
    setCooldownLeft(0);
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(id);
  }, [isOpen, language]);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          setChallenge(generateParentalGateChallenge(language));
          setAnswerInput('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownLeft, language]);

  if (!isOpen) return null;

  const handleRefreshChallenge = () => {
    if (cooldownLeft > 0) return;
    setChallenge(generateParentalGateChallenge(language));
    setAnswerInput('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownLeft > 0) return;

    const numeric = parseAdultNumericAnswer(answerInput);
    if (numeric !== null && numeric === challenge.expectedAnswer) {
      setAnswerInput('');
      setFailedAttempts(0);
      onVerified();
      return;
    }

    const nextFailures = failedAttempts + 1;
    setFailedAttempts(nextFailures);
    setAnswerInput('');
    if (nextFailures >= MAX_PARENTAL_GATE_ATTEMPTS) {
      setCooldownLeft(PARENTAL_GATE_COOLDOWN_SECONDS);
    } else {
      setChallenge(generateParentalGateChallenge(language));
      inputRef.current?.focus();
    }
  };

  const attemptsRemaining = Math.max(0, MAX_PARENTAL_GATE_ATTEMPTS - failedAttempts);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parental-gate-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
            </div>
            <h2
              id="parental-gate-title"
              className="font-display text-lg font-bold text-slate-900"
            >
              {t.parentalGateTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.parentalGateCancelBtn}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{t.parentalGateSubtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 flex items-center justify-between gap-3">
            <p
              data-testid="parental-gate-question"
              className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug"
            >
              {challenge.questionText}
            </p>
            <button
              type="button"
              onClick={handleRefreshChallenge}
              disabled={cooldownLeft > 0}
              title={t.parentalGateNewChallengeBtn}
              aria-label={t.parentalGateNewChallengeBtn}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-colors disabled:opacity-40 min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              disabled={cooldownLeft > 0}
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder={t.parentalGateInputPlaceholder}
              data-testid="parental-gate-input"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 font-mono tabular-nums text-base font-semibold text-slate-900 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:border-sky-600 focus:outline-none disabled:bg-slate-100 min-h-[44px]"
            />
          </div>

          {cooldownLeft > 0 ? (
            <p className="text-xs font-medium text-rose-700 font-mono tabular-nums">
              {t.parentalGateCooldownMsg(cooldownLeft)}
            </p>
          ) : failedAttempts > 0 ? (
            <p className="text-xs font-medium text-amber-800">
              {t.parentalGateIncorrectMsg(attemptsRemaining)}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[40px] cursor-pointer"
            >
              {t.parentalGateCancelBtn}
            </button>
            <button
              type="submit"
              disabled={cooldownLeft > 0 || answerInput.trim().length === 0}
              data-testid="parental-gate-submit"
              className="px-4 py-2 rounded-lg bg-sky-600 text-xs font-semibold text-white hover:bg-sky-700 transition-colors disabled:opacity-45 min-h-[40px] cursor-pointer"
            >
              {t.parentalGateVerifyBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
