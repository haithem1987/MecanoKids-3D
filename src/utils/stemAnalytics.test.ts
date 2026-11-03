import { afterEach, describe, expect, it } from 'vitest';
import { _clearQueue, _getQueue, track } from './stemAnalytics';

afterEach(() => _clearQueue());

describe('stemAnalytics', () => {
  it('enregistre un événement dans la queue', () => {
    track('game_started');
    expect(_getQueue()).toHaveLength(1);
    expect(_getQueue()[0].event).toBe('game_started');
  });

  it('stocke les props associées', () => {
    track('part_snapped', { partId: 'wheel-1', blueprintId: 'car-01' });
    expect(_getQueue()[0].props).toEqual({ partId: 'wheel-1', blueprintId: 'car-01' });
  });

  it('accumule plusieurs événements', () => {
    track('mission_started');
    track('part_selected');
    track('part_snapped');
    expect(_getQueue()).toHaveLength(3);
  });

  it('clearQueue vide la file', () => {
    track('undo_used');
    _clearQueue();
    expect(_getQueue()).toHaveLength(0);
  });

  it("n'expose aucune donnée personnelle persistante", () => {
    track('mission_completed', { stars: 3, blueprintId: 'car-02' });
    const entry = _getQueue()[0];
    // Pas de nom, photo ni identifiant enfant
    expect(entry.props).not.toHaveProperty('childName');
    expect(entry.props).not.toHaveProperty('userId');
    expect(entry.props).not.toHaveProperty('profileName');
  });
});
