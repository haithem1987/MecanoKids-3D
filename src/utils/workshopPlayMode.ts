export type WorkshopPlayMode = 'guided' | 'repair' | 'expert';
export interface WorkshopPlaySettings {
  noSilhouette: boolean;
  autoRead: boolean;
  repairing: boolean;
}
export type WorkshopPlayAction = 'toggleSilhouette' | 'toggleAutoRead' | 'startRepair' | 'quitRepair';

/** Reflect manual settings too: the chooser never claims an expert run when guides are enabled. */
export function currentWorkshopPlayMode(settings: WorkshopPlaySettings): WorkshopPlayMode | undefined {
  if (settings.repairing) return 'repair';
  if (settings.noSilhouette && !settings.autoRead) return 'expert';
  if (!settings.noSilhouette && settings.autoRead) return 'guided';
  return undefined;
}

/** A mode is an explicit, reversible change; choosing it again must not restart the repair. */
export function workshopPlayActions(mode: WorkshopPlayMode, settings: WorkshopPlaySettings): WorkshopPlayAction[] {
  const actions: WorkshopPlayAction[] = [];
  const noSilhouette = mode === 'expert';
  const autoRead = mode !== 'expert';
  if (settings.repairing && mode !== 'repair') actions.push('quitRepair');
  if (settings.noSilhouette !== noSilhouette) actions.push('toggleSilhouette');
  if (settings.autoRead !== autoRead) actions.push('toggleAutoRead');
  if (mode === 'repair' && !settings.repairing) actions.push('startRepair');
  return actions;
}
