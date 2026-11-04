import { Volume2, Search, Wrench } from 'lucide-react';
import { useState } from 'react';
import type { UIStrings } from '../i18n/translations';

interface Props {
  isOpen: boolean;
  t: UIStrings;
  onFinish: () => void;
}

const STEPS = [
  { icon: Volume2, keyTitle: 'diagnosticTutorialStep1' as const },
  { icon: Search, keyTitle: 'diagnosticTutorialStep2' as const },
  { icon: Wrench, keyTitle: 'diagnosticTutorialStep3' as const },
];

export function DiagnosticTutorialOverlay({ isOpen, t, onFinish }: Props) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const isLast = step === STEPS.length - 1;
  const { icon: Icon, keyTitle } = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Step dots */}
        <div className="mb-4 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2 w-2 rounded-full transition-colors ${i === step ? 'bg-amber-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <h2 className="font-display mb-6 text-center text-xl font-bold text-slate-800">
          {t.diagnosticTutorialTitle}
        </h2>

        {/* Step content */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Icon className="h-10 w-10 text-amber-600" strokeWidth={1.5} />
          </div>
          <p className="text-base leading-relaxed text-slate-700">
            {t[keyTitle]}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
            >
              ←
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) {
                setStep(0);
                onFinish();
              } else {
                setStep((s) => s + 1);
              }
            }}
            className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
          >
            {isLast ? t.diagnosticTutorialReadyBtn : '→'}
          </button>
        </div>
      </div>
    </div>
  );
}
