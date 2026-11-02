import React, { useState } from 'react';
import type { LanguageCode, ProfileAvatarColor, ProfileAvatarIcon } from '../types/game';

const ICONS: Record<ProfileAvatarIcon, string> = {
  wrench: '🔧',
  car: '🚗',
  rocket: '🚀',
  anchor: '⚓',
  plane: '✈️',
};

const COLOR_BG: Record<ProfileAvatarColor, string> = {
  sky: 'bg-sky-400',
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-400',
  indigo: 'bg-indigo-400',
  rose: 'bg-rose-400',
};

const COLORS: ProfileAvatarColor[] = ['sky', 'amber', 'emerald', 'indigo', 'rose'];
const AVATAR_ICONS: ProfileAvatarIcon[] = ['wrench', 'car', 'rocket', 'anchor', 'plane'];

const LANG_META = {
  fr: { flag: '🇫🇷', label: 'Français', question: 'Quelle est ta langue ?' },
  en: { flag: '🇬🇧', label: 'English', question: "What's your language?" },
  ar: { flag: '🇸🇦', label: 'العربية', question: 'ما هي لغتك؟' },
} satisfies Record<LanguageCode, { flag: string; label: string; question: string }>;

const T = {
  nameQuestion: { fr: 'Comment tu t\'appelles ?', en: "What's your name?", ar: 'ما اسمك؟' },
  namePlaceholder: { fr: 'Ex: Lucas', en: 'Ex: Lucas', ar: 'مثال: سامي' },
  avatarLabel: { fr: 'Choisis ton avatar', en: 'Pick your avatar', ar: 'اختر صورتك' },
  next: { fr: 'Suivant →', en: 'Next →', ar: '→ التالي' },
  allSet: { fr: 'Tout est prêt 🎉', en: 'All set 🎉', ar: 'كل شيء جاهز 🎉' },
  start: { fr: 'Commencer à construire 🔧', en: 'Start building 🔧', ar: 'ابدأ البناء 🔧' },
} satisfies Record<string, Record<LanguageCode, string>>;

function readyText(lang: LanguageCode, name: string): string {
  if (lang === 'fr') return `C'est parti, ${name} !`;
  if (lang === 'en') return `Let's go, ${name}!`;
  return `هيا بنا، ${name}!`;
}

interface Props {
  onComplete: (
    lang: LanguageCode,
    name: string,
    avatarColor: ProfileAvatarColor,
    avatarIcon: ProfileAvatarIcon,
  ) => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<LanguageCode>('fr');
  const [name, setName] = useState('');
  const [color, setColor] = useState<ProfileAvatarColor>('sky');
  const [icon, setIcon] = useState<ProfileAvatarIcon>('rocket');

  const isRTL = lang === 'ar';
  const t = (key: keyof typeof T) => T[key][lang];

  const handleLangSelect = (l: LanguageCode) => {
    setLang(l);
    setStep(1);
  };

  const handleNext = () => {
    if (name.trim()) setStep(2);
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center z-50 p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{`
        @keyframes mk-confetti-fall {
          0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(130px) rotate(360deg); opacity: 0; }
        }
        @keyframes mk-avatar-pop {
          0%   { transform: scale(0);   opacity: 0; }
          60%  { transform: scale(1.2);            }
          100% { transform: scale(1);   opacity: 1; }
        }
        .mk-confetti { position: absolute; width: 10px; height: 10px; animation: mk-confetti-fall 1.3s ease-in forwards; }
        .mk-avatar-pop { animation: mk-avatar-pop 0.55s cubic-bezier(.34,1.56,.64,1) forwards; }
      `}</style>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/20">
        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-white' : i < step ? 'w-4 bg-white/60' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Language */}
        {step === 0 && (
          <>
            <p className="text-4xl mb-3">🌍</p>
            <h2 className="text-white text-2xl font-bold mb-8">{LANG_META[lang].question}</h2>
            <div className="flex flex-col gap-4">
              {(['fr', 'en', 'ar'] as LanguageCode[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangSelect(l)}
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/20 text-white text-xl font-semibold py-4 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-3xl">{LANG_META[l].flag}</span>
                  <span>{LANG_META[l].label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2 — Profile */}
        {step === 1 && (
          <>
            <h2 className="text-white text-2xl font-bold mb-6">{t('nameQuestion')}</h2>
            <input
              className="w-full bg-white/10 border border-white/30 rounded-2xl px-5 py-3 text-white text-xl placeholder-white/40 focus:outline-none focus:border-white/60 mb-6 text-center"
              placeholder={t('namePlaceholder')}
              maxLength={20}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
            <p className="text-white text-lg font-semibold mb-4">{t('avatarLabel')}</p>
            <div className="flex flex-col gap-2 mb-8">
              {COLORS.map((c) => (
                <div key={c} className="flex gap-2 justify-center">
                  {AVATAR_ICONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => { setColor(c); setIcon(ic); }}
                      className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all hover:scale-110 ${COLOR_BG[c]} ${
                        color === c && icon === ic
                          ? 'ring-4 ring-white scale-110'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {ICONS[ic]}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full bg-white text-slate-900 font-bold text-xl py-4 rounded-2xl transition-all hover:bg-white/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('next')}
            </button>
          </>
        )}

        {/* Step 3 — Ready */}
        {step === 2 && (
          <>
            <div className="relative flex justify-center mb-6 overflow-visible h-28 items-center">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="mk-confetti"
                  style={{
                    left: `${8 + i * 7}%`,
                    top: 0,
                    backgroundColor: ['#60a5fa', '#f59e0b', '#34d399', '#818cf8', '#fb7185'][i % 5],
                    borderRadius: i % 2 === 0 ? '50%' : '2px',
                    animationDelay: `${i * 0.07}s`,
                  }}
                />
              ))}
              <div
                className={`mk-avatar-pop w-24 h-24 rounded-3xl ${COLOR_BG[color]} flex items-center justify-center text-5xl shadow-lg`}
              >
                {ICONS[icon]}
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">
              {readyText(lang, name.trim())}
            </h2>
            <p className="text-white/60 mb-8">{t('allSet')}</p>
            <button
              onClick={() => onComplete(lang, name.trim(), color, icon)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xl py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              {t('start')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
