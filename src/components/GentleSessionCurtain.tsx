import React from 'react';
import { Clock, ShieldCheck, Wrench } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode } from '../types/game';

interface GentleSessionCurtainProps {
  isOpen: boolean;
  language: LanguageCode;
  profileName: string;
  completedVehiclesCount: number;
  onRequestParentAccess: () => void;
}

export const GentleSessionCurtain: React.FC<GentleSessionCurtainProps> = ({
  isOpen,
  language,
  profileName,
  completedVehiclesCount,
  onRequestParentAccess,
}) => {
  if (!isOpen) return null;
  const t = UI_TRANSLATIONS[language];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/80 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-curtain-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-7 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto">
          <Wrench className="w-7 h-7 text-sky-600" />
        </div>

        <div className="space-y-2">
          <h2
            id="session-curtain-title"
            className="font-display text-2xl font-bold text-slate-900"
          >
            {t.sessionCurtainTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.sessionCurtainSubtitle(profileName, completedVehiclesCount)}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={onRequestParentAccess}
            data-testid="curtain-parent-access-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors min-h-[42px] cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.sessionCurtainParentExtendBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
