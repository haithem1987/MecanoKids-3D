import {MissionPanel,MissionOptions,missionButton,type MissionField} from './MissionPanel';
import {MISSION_PANEL_TEXT} from '../i18n/translations';
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
  const fields:MissionField[]=text.controls.flatMap(([label,...options],index)=>{
    if(id==='venturi'&&(settings[2]?index<2:index===3))return [];
    return [{id:String(index),label:label[locale],content:<fieldset data-lab-control={index}><legend className="sr-only">{label[locale]}</legend><MissionOptions label={label[locale]} value={settings[index]} options={options.map((option,value)=>({value,label:option[locale]+(id==='ph'&&index===0&&tested.includes(value)?' ✓':'')}))} onChange={value=>setSettings(previous=>previous.map((item,slot)=>slot===index?value:item))}/></fieldset>}];
  });
  return <MissionPanel language={language} attributes={{'data-virtual-lab':id}} title={assembled?VIRTUAL_LAB_UI.mission[locale]:VIRTUAL_LAB_UI.assemble[locale]} ready={assembled} fields={fields}
    status={solved?VIRTUAL_LAB_UI.goalReached[locale]:tryOther?VIRTUAL_LAB_UI.nextStep[locale]:outcomeText||undefined}
    info={<><p>{text.goal[locale]}</p>{outcomeText&&<p>{outcomeText}</p>}{tryOther&&<p>{VIRTUAL_LAB_UI.nextStep[locale]}</p>}{solved&&<p><strong>{VIRTUAL_LAB_UI.goalReached[locale]}</strong> {text.why[locale]}</p>}</>}
    onListen={isSupported?()=>toggle(narrationId,[assembled?text.goal[locale]:VIRTUAL_LAB_UI.assemble[locale],outcomeText,solved&&text.why[locale]].filter(Boolean).join(' '),language):undefined}
    speaking={isSpeaking&&activeId===narrationId}
    actions={<>
      <button type="button" data-mission-primary data-virtual-lab-run className={`${missionButton} bg-sky-100`} aria-label={VIRTUAL_LAB_UI.run[locale]} onClick={run}>{MISSION_PANEL_TEXT.run[locale]}</button>
      <button type="button" data-mission-reset className={missionButton} aria-label={VIRTUAL_LAB_UI.reset[locale]} disabled={!trial} onClick={reset}>{MISSION_PANEL_TEXT.replay[locale]}</button>
    </>}/>;
}
