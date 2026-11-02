import React, { useState } from 'react';
import { Key, X } from 'lucide-react';
import { getBackendAdapter } from '../backend';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { LicenseState } from '../utils/entitlements';
import type { LanguageCode } from '../types/game';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onActivate: (licenseState: LicenseState) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export const LicenseActivationModal: React.FC<LicenseActivationModalProps> = ({
  isOpen,
  onClose,
  language,
  onActivate,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const isRTL = language === 'ar';

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (!key.trim()) return;
    setStatus('loading');
    try {
      const result = await getBackendAdapter().validateLicenseKey(key.trim());
      if (result.valid) {
        onActivate({ tier: result.tier, expiresAt: result.expiresAt });
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') void handleActivate();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="license-modal-title"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-600 shrink-0" />
            <h2 id="license-modal-title" className="font-display text-lg font-bold text-slate-900">
              {t.licenseModalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-slate-600">{t.licenseModalSubtitle}</p>

          <input
            type="text"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setStatus('idle');
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.licenseInputPlaceholder}
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            autoFocus
          />

          {status === 'error' && (
            <p className="text-sm font-medium text-red-600">{t.licenseInvalidMsg}</p>
          )}
          {status === 'success' && (
            <p className="text-sm font-medium text-emerald-600">{t.licenseSuccessMsg}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {status === 'success' ? 'OK' : 'Annuler'}
          </button>
          {status !== 'success' && (
            <button
              type="button"
              onClick={() => void handleActivate()}
              disabled={!key.trim() || status === 'loading'}
              className="px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            >
              {status === 'loading' ? t.licenseActivating : t.licenseActivateBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
