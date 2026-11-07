import type { PlayerProgress } from '../types/game';

export type NotebookText = readonly [string, string, string];
export interface DiscoveryObservation {
  blueprintId: string;
  kind: string;
  result: NotebookText;
  settings?: readonly number[];
}
export interface SavedDiscoveryObservation extends DiscoveryObservation { observedAt: number; attempts: number }
export interface DiscoveryNotebook { version: 1; observations: SavedDiscoveryObservation[] }
export const NOTEBOOK_EVENT = 'octogears-notebook-changed';
const MAX_OBSERVATIONS = 180;
const empty = (): DiscoveryNotebook => ({ version: 1, observations: [] });
export const notebookKey = (profileId: string) => `octogears-discoveries-v1:${encodeURIComponent(profileId)}`;

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
export function sanitizeNotebook(value: unknown): DiscoveryNotebook {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.observations)) return empty();
  const observations: SavedDiscoveryObservation[] = [];
  for (const item of value.observations) {
    if (!isRecord(item) || typeof item.blueprintId !== 'string' || !item.blueprintId || item.blueprintId.length > 160 || typeof item.kind !== 'string' || !item.kind || item.kind.length > 100) continue;
    if (!Array.isArray(item.result) || item.result.length !== 3 || !item.result.every(text => typeof text === 'string' && text.length > 0 && text.length <= 2000)) continue;
    if (typeof item.observedAt !== 'number' || !Number.isFinite(item.observedAt) || item.observedAt < 0) continue;
    const settings = Array.isArray(item.settings) && item.settings.length <= 16 && item.settings.every(number => typeof number === 'number' && Number.isFinite(number)) ? item.settings as number[] : undefined;
    observations.push({ blueprintId: item.blueprintId, kind: item.kind, result: item.result as unknown as NotebookText, settings, observedAt: item.observedAt, attempts: typeof item.attempts === 'number' && Number.isFinite(item.attempts) ? Math.max(1, Math.min(9999, Math.floor(item.attempts))) : 1 });
  }
  return { version: 1, observations: observations.sort((a, b) => b.observedAt - a.observedAt).slice(0, MAX_OBSERVATIONS) };
}
export function addObservation(notebook: DiscoveryNotebook, observation: DiscoveryObservation, now = Date.now()): DiscoveryNotebook {
  const same = (entry: DiscoveryObservation) => entry.blueprintId === observation.blueprintId && entry.kind === observation.kind && JSON.stringify(entry.result) === JSON.stringify(observation.result) && JSON.stringify(entry.settings ?? []) === JSON.stringify(observation.settings ?? []);
  const previous = notebook.observations.find(same);
  return sanitizeNotebook({ version: 1, observations: [{ ...observation, observedAt: now, attempts: (previous?.attempts ?? 0) + 1 }, ...notebook.observations.filter(entry => !same(entry))] });
}
export function readNotebook(profileId: string): DiscoveryNotebook {
  if (!profileId || typeof localStorage === 'undefined') return empty();
  try { return sanitizeNotebook(JSON.parse(localStorage.getItem(notebookKey(profileId)) ?? 'null')); } catch { return empty(); }
}
export function writeNotebook(profileId: string, notebook: DiscoveryNotebook): boolean {
  if (!profileId || typeof localStorage === 'undefined') return false;
  try { localStorage.setItem(notebookKey(profileId), JSON.stringify(sanitizeNotebook(notebook))); return true; } catch { return false; }
}
export function removeNotebook(profileId: string): boolean {
  if (!profileId || typeof localStorage === 'undefined') return false;
  try {
    localStorage.removeItem(notebookKey(profileId));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(NOTEBOOK_EVENT));
    return true;
  } catch { return false; }
}
export function recordDiscoveryObservation(profileId: string, observation: DiscoveryObservation): boolean {
  const saved = writeNotebook(profileId, addObservation(readNotebook(profileId), observation));
  if (saved && typeof window !== 'undefined') window.dispatchEvent(new Event(NOTEBOOK_EVENT));
  return saved;
}
export function discoveredBlueprintIds(progress: Pick<PlayerProgress, 'completedStages'>, notebook: DiscoveryNotebook): string[] {
  const dates = new Map<string, number>();
  for (const [id, record] of Object.entries(progress.completedStages)) if (record.completed) dates.set(id, record.completedAt ?? 0);
  for (const observation of notebook.observations) dates.set(observation.blueprintId, Math.max(dates.get(observation.blueprintId) ?? 0, observation.observedAt));
  return [...dates.keys()].sort((a, b) => (dates.get(b) ?? 0) - (dates.get(a) ?? 0));
}
