import React, { useState } from 'react';
import { Key, Mail, X } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import type { LicenseState } from '../utils/entitlements';
import type { LanguageCode } from '../types/game';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onActivate: (
    licenseState: LicenseState,
    extra: {
      licenseKey: string;
      licenseType: 'classe' | 'ecole' | 'reseau';
      licenseExpiry?: string;
      licenseSeats?: number;
      licenseActive: boolean;
    },
  ) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface LicensePayload {
  type: 'classe' | 'ecole' | 'reseau';
  expiry?: string;
  seats?: number;
}

// shortcut: dev key only, replace with env var in prod
const VERIFY_KEY = 'octo-gears-dev-2026';

async function verifyHmacToken(token: string): Promise<LicensePayload | null> {
  // expected format: base64url(json).hmac_hex
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payloadB64 = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);
  try {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(VERIFY_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'],
    );
    const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
    const payloadBytes = enc.encode(payloadB64);
    const valid = await crypto.subtle.verify('HMAC', keyMaterial, sigBytes, payloadBytes);
    if (!valid) return null;
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(json) as Record<string, unknown>;
    if (!['classe', 'ecole', 'reseau'].includes(data.type as string)) return null;
    return {
      type: data.type as 'classe' | 'ecole' | 'reseau',
      expiry: typeof data.expiry === 'string' ? data.expiry : undefined,
      seats: typeof data.seats === 'number' ? data.seats : undefined,
    };
  } catch {
    return null;
  }
}

export const LicenseActivationModal: React.FC<LicenseActivationModalProps> = ({
  isOpen,
  onClose,
  language,
  onActivate,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [payload, setPayload] = useState<LicensePayload | null>(null);
  const isRTL = language === 'ar';

  if (!isOpen) return null;

  const handleActivate = async () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    setStatus('loading');

    // Try offline HMAC token first
    const offlinePayload = await verifyHmacToken(trimmed);
    if (offlinePayload) {
      const isActive = !offlinePayload.expiry || new Date(offlinePayload.expiry) > new Date();
      setPayload(offlinePayload);
      setStatus('success');
      onActivate(
        { tier: 'school' },
        {
          licenseKey: trimmed,
          licenseType: offlinePayload.type,
          licenseExpiry: offlinePayload.expiry,
          licenseSeats: offlinePayload.seats,
          licenseActive: isActive,
        },
      );
      return;
    }

    // Fallback: backend test keys (dev only)
    try {
      const { getBackendAdapter } = await import('../backend');
      const result = await getBackendAdapter().validateLicenseKey(trimmed);
      if (result.valid) {
        const p: LicensePayload = { type: result.tier === 'family' ? 'ecole' : 'ecole' };
        setPayload(p);
        setStatus('success');
        onActivate(
          { tier: result.tier, expiresAt: result.expiresAt },
          {
            licenseKey: trimmed,
            licenseType: 'ecole',
            licenseExpiry: result.expiresAt,
            licenseActive: !result.expiresAt || new Date(result.expiresAt) > new Date(),
          },
        );
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const licenseTypeLabel = payload
    ? payload.type === 'classe'
      ? t.licenseTypeClasse
      : payload.type === 'reseau'
        ? t.licenseTypeReseau
        : t.licenseTypeEcole
    : '';

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
            onChange={(e) => { setKey(e.target.value); setStatus('idle'); }}
            onKeyDown={(e) => { if (e.key === 'Enter') void handleActivate(); }}
            placeholder={t.licenseInputPlaceholder}
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            autoFocus
          />

          {status === 'error' && (
            <p className="text-sm font-medium text-red-600">{t.licenseInvalidMsg}</p>
          )}
          {status === 'success' && payload && (
            <div className="text-sm space-y-1 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <p className="font-medium text-emerald-700">{t.licenseSuccessMsg}</p>
              <p className="text-slate-600">{t.licenseTypeLabel} : <span className="font-semibold">{licenseTypeLabel}</span></p>
              {payload.expiry && (
                <p className="text-slate-600">{t.licenseExpiryLabel} : <span className="font-semibold">{new Date(payload.expiry).toLocaleDateString(language === 'ar' ? 'ar-SA' : language)}</span></p>
              )}
              {payload.seats != null && (
                <p className="text-slate-600">{t.licenseSeatsLabel} : <span className="font-semibold">{payload.seats}</span></p>
              )}
            </div>
          )}

          <a
            href="mailto:ecoles@octogears.com"
            className="flex items-center gap-2 text-sm text-sky-600 hover:underline"
          >
            <Mail className="w-4 h-4 shrink-0" />
            {t.licenseContactBtn}
          </a>
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
