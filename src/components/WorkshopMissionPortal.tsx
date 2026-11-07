import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
/** Scene-owned trials place their controls beside the canvas, in the reserved mission column. */
export function WorkshopMissionPortal({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.getElementById('workbench-trial-controls')); }, []);
  return host ? createPortal(children, host) : null;
}
