import React from 'react';
import { VisualStyleMode } from '../types/game';

interface TopBarProps {
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
  onOpenCatalog: () => void;
  onOpenDiscovery: () => void;
  onOpenMascot: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  visualStyle,
  onSelectStyle,
  onOpenCatalog,
  onOpenDiscovery,
  onOpenMascot,
}) => {
  return (
    <header className="relative z-20 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element Brand Wordmark */}
      <button
        type="button"
        onClick={onOpenCatalog}
        className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
      >
        MécanoKids 3D
      </button>

      {/* Zone 2: 5 concise single-line text navigation links */}
      <nav aria-label="Navigation principale et styles 3D" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          type="button"
          onClick={onOpenCatalog}
          className="py-1 text-slate-700 hover:text-slate-900 hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Stages
        </button>

        <button
          type="button"
          onClick={() => onSelectStyle(VisualStyleMode.WOOD)}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            visualStyle === VisualStyleMode.WOOD
              ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
              : 'hover:text-slate-900 hover:underline underline-offset-8'
          }`}
        >
          Bois &amp; Métal
        </button>

        <button
          type="button"
          onClick={() => onSelectStyle(VisualStyleMode.BLOCKS)}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            visualStyle === VisualStyleMode.BLOCKS
              ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
              : 'hover:text-slate-900 hover:underline underline-offset-8'
          }`}
        >
          Blocs Modulaires
        </button>

        <button
          type="button"
          onClick={() => onSelectStyle(VisualStyleMode.REALISTIC)}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            visualStyle === VisualStyleMode.REALISTIC
              ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-sky-600'
              : 'hover:text-slate-900 hover:underline underline-offset-8'
          }`}
        >
          Maquette Réaliste
        </button>

        <button
          type="button"
          onClick={onOpenDiscovery}
          className="py-1 text-slate-700 hover:text-slate-900 hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Fiche Découverte
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenMascot}
          className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          Demander un indice
        </button>
      </div>
    </header>
  );
};
