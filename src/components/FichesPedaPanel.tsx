import { Printer } from 'lucide-react';
import { PEDA_FICHES } from '../data/pedaFiches';
import type { LanguageCode } from '../types/game';

interface Props {
  language: LanguageCode;
  fichePrintBtn: string;
}

export function FichesPedaPanel({ language, fichePrintBtn }: Props) {
  return (
    <div className="space-y-4 p-2">
      {PEDA_FICHES.map((fiche) => (
        <div key={fiche.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0"
              dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 120 90" width="96" height="72" xmlns="http://www.w3.org/2000/svg">${fiche.svg}</svg>` }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-display mb-1 font-bold text-slate-800">
                {fiche.titre[language]}
              </h3>
              <p className="mb-2 text-sm leading-relaxed text-slate-600">
                {fiche.explication[language]}
              </p>
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {fiche.activite[language]}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95"
          >
            <Printer className="h-4 w-4" />
            {fichePrintBtn}
          </button>
        </div>
      ))}
    </div>
  );
}
