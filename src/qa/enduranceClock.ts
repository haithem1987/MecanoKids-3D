export interface EnduranceClock {
  lastAt: number;
  wallMs: number;
  visibleMs: number;
  wasVisible: boolean;
}

export function createEnduranceClock(now: number, visible: boolean): EnduranceClock {
  return { lastAt: now, wallMs: 0, visibleMs: 0, wasVisible: visible };
}

/** Call on visibility changes as well as timer ticks; hidden time cannot certify endurance. */
export function advanceEnduranceClock(clock: EnduranceClock, now: number, visible: boolean): EnduranceClock {
  const delta = Math.max(0, now - clock.lastAt);
  return { lastAt: Math.max(clock.lastAt, now), wallMs: clock.wallMs + delta,
    visibleMs: clock.visibleMs + (clock.wasVisible ? delta : 0), wasVisible: visible };
}
