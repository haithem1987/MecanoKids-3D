import React from 'react';
import { Check, GraduationCap, Key, Lock, Sparkles, X } from 'lucide-react';
import { CheckoutButton } from './CheckoutButton';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'stages' | 'profiles' | 'liveries';
  onUpgradeClick: () => void;
  onHaveKey?: () => void;
}

const REASON_MESSAGES: Record<NonNullable<UpgradeModalProps['reason']>, string> = {
  stages: '🔒 Les stages 21 à 100 sont réservés au Pass Famille.',
  profiles: '🔒 La création de profils supplémentaires nécessite le Pass Famille.',
  liveries: '🔒 Cette livrée est réservée au Pass Famille.',
};

interface PlanFeature {
  label: string;
  discovery: string | boolean;
  family: string | boolean;
  school: string | boolean;
}

const FEATURES: PlanFeature[] = [
  { label: 'Stages disponibles', discovery: '20', family: '100', school: '100' },
  { label: 'Profils', discovery: '1', family: '5', school: 'Illimités' },
  { label: 'Livrées', discovery: '3', family: 'Toutes (9)', school: 'Toutes (9)' },
  { label: 'Outils enseignant', discovery: false, family: false, school: true },
  { label: '100 % hors-ligne', discovery: true, family: true, school: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-4 h-4 text-emerald-500 mx-auto" aria-label="Inclus" />
    ) : (
      <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" aria-label="Non inclus" />
    );
  }
  return <span>{value}</span>;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  reason,
  onUpgradeClick: _onUpgradeClick,
  onHaveKey,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div className="w-full max-w-2xl max-h-[92vh] bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-indigo-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Passe au Pass Famille</span>
            </div>
            <h2 id="upgrade-modal-title" className="font-display text-xl font-bold text-slate-900">
              Débloque les 100 stages
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Contextual reason */}
          {reason && (
            <p className="text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              {REASON_MESSAGES[reason]}
            </p>
          )}

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase">
                  <th className="text-start py-2 pr-4 font-semibold text-slate-700 w-1/3">
                    Fonctionnalité
                  </th>
                  <th className="text-center px-3 py-2 bg-slate-50 rounded-tl-lg">Découverte</th>
                  <th className="text-center px-3 py-2 bg-sky-50 text-sky-800 ring-2 ring-sky-300 ring-inset rounded-t-lg">
                    Pass Famille ✨
                  </th>
                  <th className="text-center px-3 py-2 bg-indigo-50 text-indigo-800 rounded-tr-lg">
                    École
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f) => (
                  <tr key={f.label} className="border-t border-slate-100">
                    <td className="py-2.5 pr-4 text-slate-700 font-medium">{f.label}</td>
                    <td className="text-center px-3 py-2.5 text-slate-500 bg-slate-50/50">
                      <Cell value={f.discovery} />
                    </td>
                    <td className="text-center px-3 py-2.5 text-sky-800 font-semibold bg-sky-50/60 ring-2 ring-sky-300 ring-inset">
                      <Cell value={f.family} />
                    </td>
                    <td className="text-center px-3 py-2.5 text-indigo-700 bg-indigo-50/50">
                      <Cell value={f.school} />
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-slate-100">
                  <td className="py-2.5 pr-4 text-slate-700 font-medium">Tarif</td>
                  <td className="text-center px-3 py-2.5 text-slate-500 bg-slate-50/50">Gratuit</td>
                  <td className="text-center px-3 py-2.5 bg-sky-50/60 ring-2 ring-sky-300 ring-inset">
                    <span className="text-sky-900 font-bold">12,99 €/an</span>
                  </td>
                  <td className="text-center px-3 py-2.5 text-indigo-700 bg-indigo-50/50">Sur devis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-3">
          <CheckoutButton
            plan="family"
            label="Acheter 12,99 €/an"
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-60"
          />
          <a
            href="mailto:contact@mecanokids.fr"
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            Contacter pour une école
          </a>
          {onHaveKey && (
            <button
              type="button"
              onClick={onHaveKey}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4 shrink-0" />
              J&apos;ai déjà une clé
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
