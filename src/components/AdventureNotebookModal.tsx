import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { BookOpen, CheckCircle2, Compass, Lock, Volume2, X } from 'lucide-react';
import { ADVENTURE_NOTEBOOK_TEXT as TEXT } from '../i18n/adventureNotebookText';
import { getLocalizedBlueprint } from '../i18n/translations';
import { WORKSHOP_ADVENTURES, adventureProgress, type AdventureGroup } from '../data/adventures';
import { useDiscoveryNotebook } from '../hooks/useDiscoveryNotebook';
import { discoveredBlueprintIds } from '../utils/discoveryNotebook';
import { useSpeech } from '../utils/speech';
import type { LanguageCode, PlayerProgress, VehicleBlueprint } from '../types/game';

export interface AdventureNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  language: LanguageCode;
  progress: PlayerProgress;
  blueprints: readonly VehicleBlueprint[];
  canOpenBlueprint: (blueprint: VehicleBlueprint) => boolean;
  onOpenBlueprint: (id: string) => void;
  supportsPlay?: (blueprint: VehicleBlueprint) => boolean;
}
const button = 'min-h-16 min-w-16 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-sky-950 hover:bg-sky-50 disabled:opacity-50';
export function AdventureNotebookModal({ isOpen, onClose, profileId, language, progress, blueprints, canOpenBlueprint, onOpenBlueprint, supportsPlay = () => false }: AdventureNotebookModalProps) {
  const [tab, setTab] = useState<'adventures' | 'notebook'>('adventures');
  const [routeId, setRouteId] = useState<string>('first');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<AdventureGroup | 'all'>('all');
  const { notebook } = useDiscoveryNotebook(profileId);
  const { toggle, stop, isSupported } = useSpeech();
  const dialog = useRef<HTMLDivElement>(null), close = useRef<HTMLButtonElement>(null), titleId = useId();
  const locale = language === 'fr' ? 0 : language === 'en' ? 1 : 2;
  const localized = useMemo(() => new Map(blueprints.map(bp => [bp.id, getLocalizedBlueprint(bp, language)])), [blueprints, language]);
  const ids = discoveredBlueprintIds(progress, notebook).filter(id => localized.has(id));
  const requiresPlay = (id: string) => { const bp = blueprints.find(item => item.id === id); return Boolean(bp && supportsPlay(bp)); };
  const normalize = (text: string) => text.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  const search = normalize(query.trim());
  const filtered = WORKSHOP_ADVENTURES.filter(item => (group === 'all' || item.group === group) && (!search || normalize([TEXT.routes[item.id].title[locale], TEXT.routes[item.id].goal[locale], ...item.steps.map(id => localized.get(id)?.name ?? '')].join(' ')).includes(search)));
  const route = filtered.find(item => item.id === routeId) ?? filtered[0] ?? WORKSHOP_ADVENTURES[0];
  const routeText = TEXT.routes[route.id], journey = adventureProgress(route.steps, progress, notebook, requiresPlay);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    close.current?.focus();
    return () => { stop(); previous?.focus(); };
  }, [isOpen, stop]);
  if (!isOpen) return null;
  const open = (id: string) => {
    const bp = blueprints.find(item => item.id === id);
    if (!bp || !canOpenBlueprint(bp)) return;
    if(tab==='adventures')window.dispatchEvent(new CustomEvent('octogears:adventure-selected',{detail:{profileId,routeId:route.id}}));
    stop(); onClose(); onOpenBlueprint(id);
  };
  const next = journey.nextId && blueprints.find(bp => bp.id === journey.nextId);
  return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-3" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} data-adventure-notebook className="flex max-h-[90svh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
      if (event.key === 'Tab') {
        const focusable = [...(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),[href],select,input,[tabindex="0"]') ?? [])].filter(node => node.getClientRects().length > 0);
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
      <div className="flex items-center gap-3 border-b border-sky-100 p-3">
        <BookOpen className="h-6 w-6 shrink-0 text-sky-600" aria-hidden/><h2 id={titleId} className="flex-1 text-lg font-bold text-sky-950">{TEXT.title[locale]}</h2>
        <button ref={close} type="button" className={button} aria-label={TEXT.close[locale]} onClick={onClose}><X className="mx-auto h-6 w-6" aria-hidden/></button>
      </div>
      <div className="flex gap-2 px-3 pt-3" role="group" aria-label={TEXT.title[locale]}>
        {(['adventures', 'notebook'] as const).map(value => <button type="button" key={value} data-notebook-tab={value} className={`${button} flex-1 aria-pressed:bg-sky-100`} aria-pressed={tab === value} onClick={() => { stop(); setTab(value); }}>{TEXT[value][locale]}</button>)}
      </div>
      <div className="min-h-0 overflow-y-auto p-3">
        {tab === 'adventures' ? <>
          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            <input type="search" data-adventure-search aria-label={TEXT.search[locale]} placeholder={TEXT.search[locale]} value={query} onChange={event => setQuery(event.target.value)} className="min-h-16 min-w-0 rounded-xl border border-sky-200 px-3 text-sm text-sky-950"/>
            <select data-adventure-filter aria-label={TEXT.filter[locale]} value={group} onChange={event => setGroup(event.target.value as AdventureGroup | 'all')} className="min-h-16 rounded-xl border border-sky-200 bg-white px-3 text-sm text-sky-950">
              {(['all', 'first', 'science', 'history', 'transport', 'expert', 'maths'] as const).map(value => <option key={value} value={value}>{TEXT.groups[value][locale]}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? <p className="rounded-2xl bg-sky-50 p-4" role="status">{TEXT.noResults[locale]}</p> : <div className="grid items-start gap-3 md:grid-cols-[minmax(15rem,1fr)_minmax(0,2fr)]">
          <nav aria-label={TEXT.adventures[locale]} className="grid max-h-[28rem] gap-2 overflow-y-auto pe-1">{filtered.map(item => {
            const done = adventureProgress(item.steps, progress, notebook, requiresPlay);
            return <button type="button" key={item.id} data-adventure-route={item.id} className={`${button} text-start aria-pressed:bg-sky-100`} aria-pressed={route.id === item.id} onClick={() => { stop(); setRouteId(item.id); }}><span aria-hidden>{item.icon} </span><strong>{TEXT.routes[item.id].title[locale]}</strong><span className="mt-1 block text-xs">{done.built} / {done.total} {TEXT.builtCount[locale]}</span>{done.requiredObservations > 0 && <span className="block text-xs">{done.observed} / {done.requiredObservations} {TEXT.observedCount[locale]}</span>}</button>;
          })}</nav>
          <section data-adventure-details={route.id} data-adventure-finished={journey.finished} className="rounded-2xl border border-sky-100 bg-sky-50 p-4" aria-label={routeText.title[locale]}>
            <div className="flex items-center gap-2"><Compass className="h-5 w-5" aria-hidden/><h3 className="flex-1 font-bold text-sky-950">{routeText.title[locale]}</h3>{isSupported && <button type="button" className={button} aria-label={TEXT.listen[locale]} onClick={() => toggle('adventure-goal', routeText.goal[locale], language)}><Volume2 className="mx-auto h-5 w-5" aria-hidden/></button>}</div>
            <p className="my-3 text-sm text-sky-950">{routeText.goal[locale]}</p>
            <ol className="space-y-2">{route.steps.map((id, index) => {
              const bp = localized.get(id), raw = blueprints.find(item => item.id === id);
              if (!bp || !raw) return null;
              const state = journey.steps.find(step => step.id === id)!, allowed = canOpenBlueprint(raw);
              return <li key={id}><button type="button" data-adventure-stage={id} data-adventure-built={state.built} data-adventure-observed={state.observed} data-adventure-complete={state.completed} disabled={!allowed} onClick={() => open(id)} className={`${button} flex w-full items-center gap-3 text-start`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold">{index + 1}</span><span className="min-w-0 flex-1"><strong className="block">{bp.name}</strong><span className="block text-xs font-normal">{bp.subtitle}</span><span className="mt-1 block text-xs">{!allowed ? TEXT.locked[locale] : state.built ? TEXT.completed[locale] : TEXT.build[locale]}{state.requiresObservation && <span className="block">{state.observed ? TEXT.observed[locale] : TEXT.toObserve[locale]}</span>}</span></span>{!allowed ? <Lock className="h-5 w-5 shrink-0" aria-hidden/> : state.completed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden/> : null}
              </button></li>;
            })}</ol>
            {journey.finished ? <p className="mt-3 font-semibold text-emerald-800" role="status">{TEXT.finished[locale]}</p> : next && <button type="button" data-adventure-resume data-adventure-next-action={journey.nextAction} className={`${button} mt-3 w-full bg-sky-100`} disabled={!canOpenBlueprint(next)} onClick={() => open(next.id)}>{journey.nextAction === 'try' ? TEXT.tryAgain[locale] : TEXT.resume[locale]}</button>}
          </section>
          </div>}
        </> : <div className="space-y-3">
          {ids.length === 0 && <p className="rounded-2xl bg-sky-50 p-5 text-sky-950">{TEXT.empty[locale]}</p>}
          {ids.map(id => {
            const bp = localized.get(id)!, raw = blueprints.find(item => item.id === id)!;
            const observations = notebook.observations.filter(entry => entry.blueprintId === id);
            return <article key={id} data-notebook-entry={id} className="rounded-2xl border border-sky-100 p-4">
              <h3 className="font-bold text-sky-950">{bp.name}</h3>
              {progress.completedStages[id]?.completed && <p className="my-2 text-sm text-emerald-800"><CheckCircle2 className="me-1 inline h-4 w-4" aria-hidden/>{TEXT.completed[locale]}</p>}
              <p className="mt-2 text-xs font-bold text-sky-900">{TEXT.discovery[locale]}</p><p className="text-sm text-slate-700">{bp.discovery.howItWorks}</p>
              {observations.length > 0 && <><h4 className="mt-3 text-xs font-bold text-sky-900">{TEXT.observations[locale]}</h4><ul className="list-inside list-disc space-y-1 text-sm text-slate-700">{observations.map(entry => <li key={`${entry.kind}-${entry.observedAt}`}>{entry.result[locale]}{entry.success === true && <span className="ms-1 text-xs font-semibold text-emerald-800">· {TEXT.observed[locale]}</span>}</li>)}</ul></>}
              <div className="mt-3 flex gap-2">{isSupported && <button type="button" className={button} aria-label={TEXT.listen[locale]} onClick={() => toggle(`notebook-${id}`, [bp.name, bp.discovery.howItWorks, ...observations.map(entry => entry.result[locale])].join('. '), language)}><Volume2 className="mx-auto h-5 w-5" aria-hidden/></button>}<button type="button" data-notebook-reopen={id} disabled={!canOpenBlueprint(raw)} className={`${button} flex-1`} onClick={() => open(id)}>{canOpenBlueprint(raw) ? TEXT.replay[locale] : TEXT.locked[locale]}</button></div>
            </article>;
          })}
        </div>}
        <p className="mt-4 text-xs text-slate-500">{TEXT.local[locale]}</p>
      </div>
    </div>
  </div>;
}
