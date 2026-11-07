import { CATALOG_BROWSE_TEXT, SCIENCE_CHALLENGE_TEXT, VIRTUAL_LAB_UI } from '../i18n/translations';
import { meetsChallenge, observeChallenge, type ScienceChallenge, type ScienceTrial } from '../data/scienceChallenges';
import type { LanguageCode } from '../types/game';
import { useSpeech } from '../utils/speech';

const control = 'min-h-16 rounded-xl border border-sky-300 bg-white px-3 py-2 text-start font-semibold hover:bg-sky-100 aria-pressed:bg-sky-200 focus-visible:outline-2 focus-visible:outline-sky-700';

export function ScienceChallengeMission({ blueprintId, challenges, trial, language, assembled, onTrial, onAction }: {
  blueprintId: string;
  challenges: readonly ScienceChallenge[];
  trial?: ScienceTrial;
  language: LanguageCode;
  assembled: boolean;
  onTrial: (trial: ScienceTrial | undefined) => void;
  onAction: (value: number) => void;
}) {
  const locale = language === 'fr' ? 0 : language === 'en' ? 1 : 2;
  const t = SCIENCE_CHALLENGE_TEXT;
  const { isSupported, toggle } = useSpeech();
  const start = (challenge: ScienceChallenge) => onTrial({ blueprintId, challenge, setting: challenge.start });
  const challenge = trial?.challenge;
  const result = trial && observeChallenge(trial.challenge, trial.setting);
  const solved = Boolean(trial && meetsChallenge(trial.challenge, trial.setting));
  const goal = challenge?.kind === 'circuit' ? t[challenge.target === 'on' ? 'circuitGoalOn' : 'circuitGoalOff']
    : challenge?.kind === 'lever' ? t.leverGoal : t.moleculeGoal;
  const explanation = challenge?.kind === 'circuit' ? t.circuitWhy : challenge?.kind === 'lever' ? t.leverWhy
    : challenge?.centre === 'C' ? t.carbonWhy : t.waterWhy;
  const options = challenge?.kind === 'circuit' ? Array.from({ length: challenge.switches }, (_, index) => {
    const closed = Boolean((trial?.setting ?? 0) & (1 << index));
    return { value: index, label: `${t.switch[locale]} ${index + 1} · ${t[closed ? 'closed' : 'opened'][locale]}`, active: closed };
  }) : challenge?.kind === 'lever' ? [1, 2, 3, 4].map(value => ({
    value, label: `${t.distance[locale]} ${value}`, active: trial?.setting === value,
  })) : ([t.empty, t.hydrogen, t.oxygen] as const).map((label, value) => ({
    value, label: label[locale], active: trial?.setting === value,
  }));
  const guidance = trial ? goal[locale] : VIRTUAL_LAB_UI.assemble[locale];

  return (
    <details data-science-mission={blueprintId} className="pointer-events-auto max-h-[min(65%,calc(50svh-4rem))] max-w-[22rem] overflow-auto rounded-xl border border-sky-200 bg-white text-sky-950 shadow sm:max-h-[70%]">
      <summary className="min-h-16 cursor-pointer p-4 font-bold">
        {challenge ? t[challenge.id][locale] : VIRTUAL_LAB_UI.mission[locale]}
        {result && <span className="block ps-4 text-sm font-medium" aria-live="polite">{solved ? t.solved[locale] : t[result][locale]}</span>}
      </summary>
      <div className="space-y-3 px-3 pb-3">
        {!assembled && <p>{guidance}</p>}
        {assembled && <div className="flex flex-wrap gap-2">
          {challenges.map(item => <button type="button" key={item.id} data-science-start={item.id}
            className={control} aria-pressed={item.id === challenge?.id} onClick={event => {
              start(item);
              if (event.detail > 0 && window.matchMedia('(max-width: 639px)').matches) {
                const panel = event.currentTarget.closest('details');
                if (panel) {
                  panel.open = false;
                  panel.querySelector('summary')?.focus({ preventScroll: true });
                }
              }
            }}>{t[item.id][locale]}</button>)}
        </div>}
        {trial && <div className="space-y-3">
          <p className="font-semibold">{guidance}</p>
          <p>{CATALOG_BROWSE_TEXT.scienceTouch[locale]}</p>
          <div data-science-result role="status" className="rounded-lg bg-sky-50 p-3">
            {result && <p>{t[result][locale]}</p>}
            {solved && <p><strong>{t.solved[locale]}</strong> {explanation[locale]}</p>}
          </div>
          <details>
            <summary className="cursor-pointer py-3 font-semibold">{CATALOG_BROWSE_TEXT.scienceControls[locale]}</summary>
            <div className="flex flex-wrap gap-2">
              {options.map(option => <button type="button" key={option.value} className={control}
                aria-pressed={option.active} data-science-action={option.value} onClick={() => onAction(option.value)}>{option.label}</button>)}
            </div>
          </details>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={control} onClick={() => start(trial.challenge)}>{t.restart[locale]}</button>
            <button type="button" className={control} onClick={() => onTrial(undefined)}>{CATALOG_BROWSE_TEXT.resetScience[locale]}</button>
          </div>
        </div>}
        {isSupported && (!assembled || trial) && <button type="button" className={control}
          onClick={() => toggle(`science-${blueprintId}`, [guidance, result && t[result][locale], solved && explanation[locale]].filter(Boolean).join('. '), language)}>
          {t.listen[locale]}
        </button>}
      </div>
    </details>
  );
}
