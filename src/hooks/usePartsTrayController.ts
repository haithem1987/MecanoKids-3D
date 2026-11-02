import { useCallback, useRef, useState } from 'react';

interface UsePartsTrayControllerResult {
  trayVisible: boolean;
  onPartPicked: () => void;
  onPartSnapped: () => void;
  onPartRejected: () => void;
  onManualToggle: () => void;
}

/**
 * Manages parts-tray visibility with a distinction between auto-collapse (reversible)
 * and manual collapse (never auto-reopened).
 */
export function usePartsTrayController(autoHide: boolean): UsePartsTrayControllerResult {
  const [trayVisible, setTrayVisible] = useState(true);
  const manuallyCollapsed = useRef(false);

  const onPartPicked = useCallback(() => {
    if (!autoHide || manuallyCollapsed.current) return;
    setTrayVisible(false);
  }, [autoHide]);

  const onPartSnapped = useCallback(() => {
    if (manuallyCollapsed.current) return;
    setTrayVisible(true);
  }, []);

  const onPartRejected = useCallback(() => {
    if (manuallyCollapsed.current) return;
    setTrayVisible(true);
  }, []);

  const onManualToggle = useCallback(() => {
    setTrayVisible((prev) => {
      const next = !prev;
      manuallyCollapsed.current = !next;
      return next;
    });
  }, []);

  return { trayVisible, onPartPicked, onPartSnapped, onPartRejected, onManualToggle };
}
