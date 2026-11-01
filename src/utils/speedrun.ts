import { LanguageCode, SpeedrunRecord } from '../types/game';

export const MAX_SPEEDRUN_HISTORY = 120;

export function formatStopwatchMs(ms: number): string {
  const safeMs = Math.max(0, Math.round(ms));
  const totalTenths = Math.floor(safeMs / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

export function formatSecondsPerPart(
  ms: number,
  partsCount: number,
  lang: LanguageCode,
): string {
  const count = Math.max(1, partsCount);
  const secPerPart = (Math.max(100, ms) / 1000 / count).toFixed(1);
  if (lang === 'ar') {
    return `${secPerPart} ث/قطعة`;
  }
  if (lang === 'en') {
    return `${secPerPart} s/part`;
  }
  return `${secPerPart.replace('.', ',')} s/pièce`;
}

export function formatDeltaMs(deltaMs: number): string {
  const sign = deltaMs <= 0 ? '-' : '+';
  const absSec = (Math.abs(deltaMs) / 1000).toFixed(1);
  return `${sign}${absSec}s`;
}

export function recordSpeedrunCompletion(
  existingRecords: SpeedrunRecord[],
  entry: SpeedrunRecord,
): {
  updatedRecords: SpeedrunRecord[];
  isNewPersonalBest: boolean;
  previousBestMs: number | null;
} {
  const sameBlueprintRuns = existingRecords.filter(
    (r) => r.blueprintId === entry.blueprintId,
  );
  const previousBestMs =
    sameBlueprintRuns.length > 0
      ? Math.min(...sameBlueprintRuns.map((r) => r.timeMs))
      : null;

  const isNewPersonalBest = previousBestMs === null || entry.timeMs < previousBestMs;

  const combined = [entry, ...existingRecords].sort((a, b) => a.timeMs - b.timeMs);

  // Guarantee that the #1 personal best for every completed blueprint is preserved,
  // while keeping up to MAX_SPEEDRUN_HISTORY fastest runs overall.
  const bestPerBlueprint = new Map<string, SpeedrunRecord>();
  for (const r of combined) {
    const prev = bestPerBlueprint.get(r.blueprintId);
    if (!prev || r.timeMs < prev.timeMs) {
      bestPerBlueprint.set(r.blueprintId, r);
    }
  }

  const keptIds = new Set<string>();
  const updatedRecords: SpeedrunRecord[] = [];

  for (const best of bestPerBlueprint.values()) {
    keptIds.add(best.id);
    updatedRecords.push(best);
  }

  for (const r of combined) {
    if (updatedRecords.length >= MAX_SPEEDRUN_HISTORY) break;
    if (!keptIds.has(r.id)) {
      keptIds.add(r.id);
      updatedRecords.push(r);
    }
  }

  updatedRecords.sort((a, b) => a.timeMs - b.timeMs);

  return {
    updatedRecords,
    isNewPersonalBest,
    previousBestMs,
  };
}

export function getBestRecordsByBlueprint(
  records: SpeedrunRecord[],
): SpeedrunRecord[] {
  const bestMap = new Map<string, SpeedrunRecord>();
  for (const r of records) {
    const existing = bestMap.get(r.blueprintId);
    if (!existing || r.timeMs < existing.timeMs) {
      bestMap.set(r.blueprintId, r);
    }
  }
  return Array.from(bestMap.values()).sort((a, b) => a.timeMs - b.timeMs);
}
