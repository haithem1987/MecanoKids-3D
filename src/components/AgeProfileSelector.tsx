import React, { useState } from 'react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { AgeProfile, LanguageCode } from '../types/game';

interface AgeProfileSelectorProps {
  language: LanguageCode;
  onConfirm: (profile: AgeProfile) => void;
}

const PROFILES: { id: AgeProfile; emoji: string; labelKey: 'ageProfile57Label' | 'ageProfile810Label' | 'ageProfile1112Label'; descKey: 'ageProfile57Desc' | 'ageProfile810Desc' | 'ageProfile1112Desc' }[] = [
  { id: '5-7', emoji: '🧡', labelKey: 'ageProfile57Label', descKey: 'ageProfile57Desc' },
  { id: '8-10', emoji: '⚙️', labelKey: 'ageProfile810Label', descKey: 'ageProfile810Desc' },
  { id: '11-12', emoji: '🏆', labelKey: 'ageProfile1112Label', descKey: 'ageProfile1112Desc' },
];

export const AgeProfileSelector: React.FC<AgeProfileSelectorProps> = ({ language, onConfirm }) => {
  const [selected, setSelected] = useState<AgeProfile>('8-10');
  const t = UI_TRANSLATIONS[language];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-selector-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 space-y-5">
        <div className="text-center space-y-1">
          <p className="text-3xl" aria-hidden="true">🔧</p>
          <h2 id="age-selector-title" className="font-display text-xl font-bold text-slate-900">
            {t.ageProfileSelectorTitle}
          </h2>
          <p className="text-sm text-slate-600">{t.ageProfileSelectorSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {PROFILES.map(({ id, emoji, labelKey, descKey }) => {
            const isSelected = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-start transition-colors cursor-pointer min-h-[64px] ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{emoji}</span>
                <div>
                  <p className={`font-semibold text-sm ${isSelected ? 'text-sky-700' : 'text-slate-900'}`}>
                    {t[labelKey]}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{t[descKey]}</p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onConfirm(selected)}
          className="w-full py-3 rounded-xl bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition-colors min-h-[48px] cursor-pointer"
        >
          {t.ageProfileConfirmBtn}
        </button>
      </div>
    </div>
  );
};
