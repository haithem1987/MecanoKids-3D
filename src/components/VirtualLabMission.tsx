import { useState } from 'react';
import { VIRTUAL_LAB_MODELS, runVirtualLab, type VirtualLabId, type VirtualLabTrial } from '../data/virtualLabs';
import { SCIENCE_CHALLENGE_TEXT, UI_TRANSLATIONS, VIRTUAL_LAB_TEXT, VIRTUAL_LAB_UI } from '../i18n/translations';
import type { LanguageCode } from '../types/game';
import { useSpeech } from '../utils/speech';

const control = 'min-h-16 min-w-16 rounded-xl border border-sky-300 bg-white px-3 py-2 text-start font-semibold text-sky-950 hover:bg-sky-100 aria-pressed:bg-sky-200 focus-visible:outline-2 focus-visible:outline-sky-700';

export function VirtualLabMission({ id, language, assembled, trial, onTrial }: {
  id: VirtualLabId;
  language: LanguageCode;
  assembled: boolean;
  trial?: VirtualLabTrial;
  onTrial: (trial: VirtualLabTrial | undefined) => void;
}) {
  const locale = language === 'fr' ? 0 : language === 'en' ? 1 : 2;
  const model = VIRTUAL_LAB_MODELS[id];
  const text = VIRTUAL_LAB_TEXT[id];
  const [settings, setSettings] = useState<readonly number[]>(model.start);
  const [tryOther, setTryOther] = useState(false);
  const [tested, setTested] = useState<number[]>([]);
  const { toggle, stop, isSupported, activeId, isSpeaking } = useSpeech();
  const narrationId = `virtual-${id}`;
  const solved = trial?.outcome === model.success && (id !== 'ph' || tested.length === 3);
  const outcomeText = trial && text.outcomes[trial.outcome][locale];
  function run() {
    const previous = trial?.outcome ?? 0;
    const outcome = runVirtualLab(id, settings, previous);
    if (id === 'ph' && !tested.includes(settings[0])) setTested([...tested, settings[0]]);
    setTryOther(id === 'dna' && outcome === previous && outcome !== model.success);
    onTrial({ id, settings, outcome });
  }
  function reset() {
    stop();
    setSettings(model.start);
    setTested([]);
    setTryOther(false);
    onTrial(undefined);
  }
  return (
    <details data-virtual-lab={id} className="pointer-events-auto max-h-[min(65%,calc(50svh-4rem))] overflow-auto rounded-xl border border-sky-200 bg-white text-sky-950 shadow sm:max-h-[70%]">
      <summary className="min-h-16 cursor-pointer p-4 font-bold">{assembled ? VIRTUAL_LAB_UI.mission[locale] : VIRTUAL_LAB_UI.assemble[locale]}</summary>
      <div className="space-y-3 px-3 pb-3">
        <p>{text.goal[locale]}</p>
        {isSupported && <button type="button" className={control} onClick={() => toggle(
          narrationId, [assembled ? text.goal[locale] : VIRTUAL_LAB_UI.assemble[locale], outcomeText, solved && text.why[locale]].filter(Boolean).join(' '), language,
        )}>{isSpeaking && activeId === narrationId ? UI_TRANSLATIONS[language].voiceStopBtn : SCIENCE_CHALLENGE_TEXT.listen[locale]}</button>}
        {assembled && <>
          {text.controls.map(([label, ...options], index) => (
            <fieldset key={index} data-lab-control={index} className="min-w-0"
              hidden={id === 'venturi' && (settings[2] ? index < 2 : index === 3)}>
              <legend className="mb-1 font-semibold">{label[locale]}</legend>
              <div className="flex flex-wrap gap-2">
                {options.map((option, value) => <button key={value} type="button" className={control} aria-pressed={settings[index] === value}
                  onClick={() => setSettings(previous => previous.map((item, slot) => slot === index ? value : item))}>
                  {option[locale]}{id === 'ph' && index === 0 && tested.includes(value) && ' ✓'}
                </button>)}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-wrap gap-2">
            <button type="button" data-virtual-lab-run className={`${control} bg-sky-100`} onClick={run}>{VIRTUAL_LAB_UI.run[locale]}</button>
            {trial && <button type="button" className={control} onClick={reset}>{VIRTUAL_LAB_UI.reset[locale]}</button>}
          </div>
          <div role="status" className="space-y-1">
            {outcomeText && <p>{outcomeText}</p>}
            {tryOther && <p>{VIRTUAL_LAB_UI.nextStep[locale]}</p>}
            {solved && <p><strong>{VIRTUAL_LAB_UI.goalReached[locale]}</strong> {text.why[locale]}</p>}
          </div>
        </>}
      </div>
    </details>
  );
}
