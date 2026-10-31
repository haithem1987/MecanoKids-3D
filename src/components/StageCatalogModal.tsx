import React, { useState } from 'react';
import { CheckCircle2, Lock, Star, Unlock, X } from 'lucide-react';
import {
  DifficultyTier,
  PlayerProgress,
  VehicleBlueprint,
  VehicleCategory,
  VisualStyleMode,
} from '../types/game';

interface StageCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprints: VehicleBlueprint[];
  currentBlueprintId: string;
  progress: PlayerProgress;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
  onSelectBlueprint: (id: string) => void;
  onToggleFreeWorkshop: () => void;
}

export const StageCatalogModal: React.FC<StageCatalogModalProps> = ({
  isOpen,
  onClose,
  blueprints,
  currentBlueprintId,
  progress,
  visualStyle,
  onSelectStyle,
  onSelectBlueprint,
  onToggleFreeWorkshop,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | VehicleCategory>('all');

  if (!isOpen) return null;

  const completedCount = Object.values(progress.completedStages).filter((r) => r.completed).length;

  const isStageUnlocked = (bp: VehicleBlueprint): boolean => {
    if (progress.freeWorkshopUnlocked) return true;
    // All Tier 1 Discovery vehicles (1 car, 1 boat, 1 plane) are unlocked from start!
    if (bp.tier === DifficultyTier.DISCOVERY) return true;
    // Tier 2 unlocks after completing at least 2 stages (or previous stage)
    if (bp.tier === DifficultyTier.WORKSHOP) {
      return completedCount >= 2 || Boolean(progress.completedStages[blueprints[bp.stageNumber - 2]?.id]?.completed);
    }
    // Tier 3 unlocks after completing at least 5 stages (or previous stage)
    return completedCount >= 5 || Boolean(progress.completedStages[blueprints[bp.stageNumber - 2]?.id]?.completed);
  };

  const tiers: Array<{ tier: DifficultyTier; title: string; subtitle: string }> = [
    {
      tier: DifficultyTier.DISCOVERY,
      title: '01. Palier Découverte — Premiers Assemblages',
      subtitle: '4 à 5 pièces larges · Aimantation généreuse pour apprivoiser la 3D',
    },
    {
      tier: DifficultyTier.WORKSHOP,
      title: '02. Palier Atelier — Mécanismes par Couches',
      subtitle: '7 à 8 pièces · Montage logique du moteur et de la coque avant la cabine',
    },
    {
      tier: DifficultyTier.ENGINEER,
      title: '03. Palier Ingénieur — Grandes Constructions',
      subtitle: '10 à 11 pièces · Sous-ensembles techniques précis et silhouettes progressives',
    },
  ];

  const categoryLabel = (cat: VehicleCategory): string => {
    if (cat === VehicleCategory.CAR) return 'Voiture & Terre';
    if (cat === VehicleCategory.BOAT) return 'Bateau & Mer';
    return 'Avion & Air';
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-title"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200">
          <div>
            <h2 id="catalog-title" className="font-display text-2xl font-bold text-slate-900">
              Carnet des Stages Mécaniques
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Construis chaque véhicule pièce par pièce pour débloquer des machines de plus en plus sophistiquées.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le catalogue"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Visual Mode Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200">
          {/* Category Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
            {(
              [
                ['all', 'Tous'],
                [VehicleCategory.CAR, 'Voitures'],
                [VehicleCategory.BOAT, 'Bateaux'],
                [VehicleCategory.PLANE, 'Avions & Hélicos'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setCategoryFilter(val)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === val
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 3 Visual Modes Selector + Free Workshop Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
              {(
                [
                  [VisualStyleMode.WOOD, 'Bois & Métal'],
                  [VisualStyleMode.BLOCKS, 'Blocs Modulaires'],
                  [VisualStyleMode.REALISTIC, 'Maquette Réaliste'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onSelectStyle(mode)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    visualStyle === mode
                      ? 'bg-white text-sky-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggleFreeWorkshop}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                progress.freeWorkshopUnlocked
                  ? 'bg-sky-50 border-sky-300 text-sky-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Permet d'essayer immédiatement tous les niveaux (accès parents / enseignants)"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{progress.freeWorkshopUnlocked ? 'Accès libre activé' : 'Débloquer tout'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tiers List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {tiers.map(({ tier, title, subtitle }) => {
            const items = blueprints.filter(
              (bp) =>
                bp.tier === tier &&
                (categoryFilter === 'all' || bp.category === categoryFilter),
            );
            if (items.length === 0) return null;

            return (
              <div key={tier}>
                <div className="mb-3">
                  <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-500">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((bp) => {
                    const unlocked = isStageUnlocked(bp);
                    const record = progress.completedStages[bp.id];
                    const isCurrent = bp.id === currentBlueprintId;

                    return (
                      <button
                        key={bp.id}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          if (unlocked) {
                            onSelectBlueprint(bp.id);
                            onClose();
                          }
                        }}
                        className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between min-h-[152px] ${
                          !unlocked
                            ? 'bg-slate-50 border-slate-200 opacity-65 cursor-not-allowed'
                            : isCurrent
                              ? 'bg-sky-50/60 border-sky-600 cursor-pointer'
                              : 'bg-white border-slate-200 hover:border-sky-500 cursor-pointer'
                        }`}
                      >
                        <div>
                          {/* Quiet unboxed metadata line */}
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                            <span>
                              Stage <span className="font-mono tabular-nums font-semibold text-slate-700">{bp.stageNumber}</span>
                              {' · '}
                              {categoryLabel(bp.category)}
                            </span>
                            {record?.completed ? (
                              <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={`${record.stars} étoiles`}>
                                {Array.from({ length: record.stars }).map((_, idx) => (
                                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                ))}
                              </span>
                            ) : !unlocked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            ) : null}
                          </div>

                          <h4 className="mt-1.5 font-display text-base font-bold text-slate-900">
                            {bp.name}
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {bp.subtitle}
                          </p>
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-mono tabular-nums text-slate-600">
                            {bp.parts.length} pièces
                          </span>

                          {record?.completed ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Terminé</span>
                            </span>
                          ) : unlocked ? (
                            <span className="font-semibold text-sky-700">
                              {isCurrent ? 'En cours' : 'Construire'}
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Gagne {bp.tier === DifficultyTier.WORKSHOP ? '2 stages' : '5 stages'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
