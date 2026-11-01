import React from 'react';
import { Globe, Lightbulb } from 'lucide-react';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, VisualStyleMode } from '../types/game';

interface TopBarProps {
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  visualStyle: VisualStyleMode;
  onSelectStyle: (style: VisualStyleMode) => void;
  onOpenCatalog: () => void;
  onOpenDiscovery: () => void;
  onOpenMechanicGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  language,
  onSelectLanguage,
  visualStyle,
  onSelectStyle,
  onOpenCatalog,
  onOpenDiscovery,
  onOpenMechanicGuide,
}) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
      {/* Zone 1: Brand Wordmark */}
      <button
        type="button"
        onClick={onOpenCatalog}
        className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
      >
        {t.appName}
      </button>

      {/* Zone 2: Navigation & 3D Visual Style Switcher */}
      <nav
        data-tour="topbar-styles"
        aria-label={t.navAriaLabel}
        className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
      >
        <button
          type="button"
          onClick={onOpenCatalog}
          className="py-1 text-slate-700 hover:text-slate-900 hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {t.stagesBtn}
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
          {t.styleWood}
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
          {t.styleBlocks}
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
          {t.styleRealistic}
        </button>

        <button
          type="button"
          onClick={onOpenDiscovery}
          className="py-1 text-slate-700 hover:text-slate-900 hover:underline underline-offset-8 decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {t.discoveryBtn}
        </button>
      </nav>

      {/* Zone 3: Language Switcher (FR / العربية) + Mechanical Hint Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div
          role="group"
          aria-label={t.langSwitchAria}
          className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200/80 rounded-lg"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500 mx-1 hidden sm:block shrink-0" />
          <button
            type="button"
            onClick={() => onSelectLanguage('fr')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              language === 'fr'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('ar')}
            style={{ fontFamily: "'Cairo', sans-serif" }}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              language === 'ar'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            العربية
          </button>
        </div>

        <button
          type="button"
          data-tour="mascot-cta"
          onClick={onOpenMechanicGuide}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          <Lightbulb className="w-3.5 h-3.5 shrink-0" />
          <span>{t.hintBtn}</span>
        </button>
      </div>
    </header>
  );
};
