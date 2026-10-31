import React from 'react';
import { ArrowRight, BookOpen, ExternalLink, Eye, Star, X } from 'lucide-react';
import { DiscoverySheet, VehicleBlueprint } from '../types/game';

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: VehicleBlueprint;
  isCompleted: boolean;
  starsEarned: number;
  discovery: DiscoverySheet | null;
  loading: boolean;
  error: string | null;
  onRetryDiscovery: () => void;
  hasNextStage: boolean;
  onNextStage: () => void;
}

function renderFormattedText(raw: string): React.ReactNode {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const cleaned = line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '');
        const segments = cleaned.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={idx} className="text-sm text-slate-700 leading-relaxed">
            {segments.map((seg, sIdx) => {
              if (seg.startsWith('**') && seg.endsWith('**')) {
                return (
                  <strong key={sIdx} className="font-semibold text-slate-900">
                    {seg.slice(2, -2)}
                  </strong>
                );
              }
              return <React.Fragment key={sIdx}>{seg}</React.Fragment>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  isOpen,
  onClose,
  blueprint,
  isCompleted,
  starsEarned,
  discovery,
  loading,
  error,
  onRetryDiscovery,
  hasNextStage,
  onNextStage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discovery-modal-title"
    >
      <div className="w-full max-w-2xl max-h-[88vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Top Banner */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Stage {blueprint.stageNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{blueprint.tierLabel}</span>
              {isCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: starsEarned }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </span>
                </>
              )}
            </div>
            <h2
              id="discovery-modal-title"
              className="mt-1 font-display text-2xl font-bold text-slate-900"
            >
              {isCompleted
                ? `Bravo ! ${blueprint.name} est prêt à partir !`
                : `Fiche Découverte : ${blueprint.name}`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fiche découverte"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {!isCompleted ? (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Termine l&apos;assemblage pour débloquer les secrets du monde réel !</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dès que tu auras fixé les{' '}
                <span className="font-mono tabular-nums font-semibold">{blueprint.parts.length}</span>{' '}
                pièces de <strong>{blueprint.name}</strong>, cette fiche recherchera sur Google des
                records et anecdotes réelles sur le véritable engin.
              </p>
            </div>
          ) : loading ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                Recherche d&apos;informations réelles vérifiées sur {blueprint.name}...
              </p>
              <p className="text-xs text-slate-500">
                Exploration encyclopédique Google Search en cours pour préparer ta fiche découverte.
              </p>
            </div>
          ) : error ? (
            <div className="p-5 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <p className="text-sm text-red-800">{error}</p>
              <button
                type="button"
                onClick={onRetryDiscovery}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                Réessayer le chargement
              </button>
            </div>
          ) : discovery ? (
            <>
              <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>Dans le monde réel — Faits vérifiés via Google Search</span>
                </div>
                {renderFormattedText(discovery.content)}
              </div>

              {discovery.sources.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 mb-2">
                    Sources web pour approfondir avec un adulte :
                  </h3>
                  <ul className="space-y-1.5">
                    {discovery.sources.map((src) => (
                      <li key={src.uri}>
                        <a
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-900 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-md">{src.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors min-h-[40px] cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Admirer le modèle en 3D</span>
          </button>

          {isCompleted && hasNextStage && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNextStage();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors min-h-[40px] cursor-pointer"
            >
              <span>Passer au stage suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
