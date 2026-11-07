import { BookOpen, Wrench, Compass, Volume2 } from 'lucide-react';
import { PLAY_MODES_TEXT, UI_TRANSLATIONS } from '../i18n/translations';
import type { LanguageCode } from '../types/game';
import { useSpeech } from '../utils/speech';
import { currentWorkshopPlayMode, workshopPlayActions, type WorkshopPlayMode } from '../utils/workshopPlayMode';

export function WorkshopPlayModes({language,noSilhouette,autoRead,repairing,onToggleSilhouette,onToggleAutoRead,onStartRepair,onQuitRepair}: {
  language: LanguageCode;
  noSilhouette: boolean;
  autoRead: boolean;
  repairing: boolean;
  onToggleSilhouette: () => void;
  onToggleAutoRead: () => void;
  onStartRepair: () => void;
  onQuitRepair: () => void;
}) {
  const locale = language === 'fr' ? 0 : language === 'en' ? 1 : 2;
  const text = PLAY_MODES_TEXT;
  const settings = {noSilhouette, autoRead, repairing};
  const selected = currentWorkshopPlayMode(settings);
  const {toggle,isSupported,isSpeaking,activeId} = useSpeech();
  const choose = (mode: WorkshopPlayMode) => {
    const callbacks = {toggleSilhouette:onToggleSilhouette,toggleAutoRead:onToggleAutoRead,startRepair:onStartRepair,quitRepair:onQuitRepair};
    for (const action of workshopPlayActions(mode,settings)) callbacks[action]();
  };
  const icons = {guided:BookOpen,repair:Wrench,expert:Compass};
  return <section data-workshop-play-modes className="mb-3 rounded-xl border border-sky-100 bg-sky-50 p-2 text-sky-950" aria-label={text.title[locale]}>
    <div className="mb-2 flex items-center gap-2"><h3 className="flex-1 font-bold">{text.title[locale]}</h3>
      {isSupported&&<button type="button" className="flex min-h-16 min-w-16 items-center justify-center rounded-xl border border-sky-200 bg-white" aria-label={isSpeaking&&activeId==='play-modes'?UI_TRANSLATIONS[language].voiceStopBtn:UI_TRANSLATIONS[language].replayInstructionAria} onClick={()=>toggle('play-modes',[text.title,...(['guided','repair','expert'] as const).flatMap(mode=>[text[mode],text[`${mode}Description`]])].map(row=>row[locale]).join('. '),language)}><Volume2 aria-hidden className="h-5 w-5"/></button>}
    </div>
    <div className="grid gap-2">{(['guided','repair','expert'] as const).map(mode=>{
      const Icon = icons[mode];
      return <button type="button" key={mode} data-play-mode={mode} aria-pressed={selected===mode} onClick={()=>choose(mode)} className="flex min-h-16 items-center gap-3 rounded-xl border border-sky-200 bg-white p-3 text-start aria-pressed:border-sky-600 aria-pressed:bg-sky-100">
        <Icon className="h-6 w-6 shrink-0" aria-hidden/><span><strong className="block text-sm">{text[mode][locale]}</strong><span className="block text-xs">{text[`${mode}Description`][locale]}</span></span>
      </button>;
    })}</div>
    {!selected&&<p className="mt-2 text-xs">{text.custom[locale]}</p>}
  </section>;
}
