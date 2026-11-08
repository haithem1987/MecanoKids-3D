import { describe, expect, it, vi } from 'vitest';
import { addObservation, discoveredBlueprintIds, notebookKey, sanitizeNotebook, readNotebook, writeNotebook, removeNotebook } from './discoveryNotebook';

const result = ['L’eau passe.', 'Water flows.', 'يتدفق الماء.'] as const;
describe('carnet de découvertes local', () => {
  it('isole les profils et rejette un stockage corrompu ou inconnu', () => {
    expect(notebookKey('one')).not.toBe(notebookKey('two'));
    expect(sanitizeNotebook({ version: 2, observations: [] }).observations).toEqual([]);
    expect(sanitizeNotebook({ version: 1, observations: [{ blueprintId: 'aqueduct', result, observedAt: -1 }] }).observations).toEqual([]);
  });
  it('conserve des résultats distincts et regroupe les essais identiques', () => {
    const observation = { blueprintId: 'aqueduct', kind: 'flow', result, settings: [1] };
    let notebook = addObservation(sanitizeNotebook(null), observation, 100);
    notebook = addObservation(notebook, { ...observation, settings: [0] }, 200);
    notebook = addObservation(notebook, observation, 300);
    expect(notebook.observations).toHaveLength(2);
    expect(notebook.observations[0]).toMatchObject({ attempts: 2, observedAt: 300, settings: [1] });
    expect(notebook.observations[1].settings).toEqual([0]);
  });
  it('retrouve les anciens montages même sans enregistrement dans le nouveau carnet', () => {
    const notebook = addObservation(sanitizeNotebook(null), { blueprintId: 'lab-venturi', kind: 'air', result }, 1);
    expect(discoveredBlueprintIds({ completedStages: { castle: { completed: true, stars: 2, bestMistakes: 0 }, unfinished: { completed: false, stars: 0, bestMistakes: 0 } } }, notebook)).toEqual(['lab-venturi', 'castle']);
  });
  it('borne l’historique, conserve les entrées récentes et refuse les nombres non finis', () => {
    let notebook = sanitizeNotebook(null);
    for (let i = 0; i < 200; i++) notebook = addObservation(notebook, { blueprintId: `lab-${i}`, kind: 'flow', result }, i);
    expect(notebook.observations).toHaveLength(180);
    expect(notebook.observations[0].blueprintId).toBe('lab-199');
    expect(sanitizeNotebook({ version: 1, observations: [{ blueprintId: 'lab', kind: 'flow', result, observedAt: Infinity }] }).observations).toEqual([]);
  });
  it('supprime uniquement le carnet du profil demandé', () => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) });
    try {
      const notebook = addObservation(sanitizeNotebook(null), { blueprintId: 'lab', kind: 'water', result }, 42);
      expect(writeNotebook('one', notebook)).toBe(true);
      expect(writeNotebook('two', notebook)).toBe(true);
      expect(removeNotebook('one')).toBe(true);
      expect(readNotebook('one').observations).toHaveLength(0);
      expect(readNotebook('two').observations).toHaveLength(1);
    } finally { vi.unstubAllGlobals(); }
  });
  it('préserve une réussite validée sans attribuer de réussite aux anciennes observations', () => {
    const observation = { blueprintId: 'lab', kind: 'flow', result };
    let notebook = addObservation(sanitizeNotebook(null), observation, 1);
    expect(notebook.observations[0].success).toBeUndefined();
    notebook = addObservation(notebook, { ...observation, success: true }, 2);
    notebook = addObservation(notebook, { ...observation, success: false }, 3);
    expect(notebook.observations[0].success).toBe(true);
    expect(notebook.observations[0].attempts).toBe(3);
  });
});
