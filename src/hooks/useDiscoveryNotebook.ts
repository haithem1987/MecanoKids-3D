import { useCallback, useEffect, useState } from 'react';
import { NOTEBOOK_EVENT, readNotebook, recordDiscoveryObservation, type DiscoveryObservation } from '../utils/discoveryNotebook';

export function useDiscoveryNotebook(profileId: string) {
  const [snapshot, setSnapshot] = useState(() => ({ profileId, notebook: readNotebook(profileId) }));
  useEffect(() => {
    const refresh = () => setSnapshot({ profileId, notebook: readNotebook(profileId) });
    refresh();
    window.addEventListener(NOTEBOOK_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener(NOTEBOOK_EVENT, refresh); window.removeEventListener('storage', refresh); };
  }, [profileId]);
  const recordObservation = useCallback((observation: DiscoveryObservation) => recordDiscoveryObservation(profileId, observation), [profileId]);
  return { notebook: snapshot.profileId === profileId ? snapshot.notebook : readNotebook(profileId), recordObservation };
}
