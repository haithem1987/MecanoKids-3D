import type { BackendAdapter, LeaderboardEntry, SchoolInquiry } from './types';

const MAX_LEADERBOARD = 100;

function lbKey(blueprintId: string) {
  return `mk3d_leaderboard_${blueprintId}`;
}

function readEntries(blueprintId: string): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(lbKey(blueprintId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

export class LocalAdapter implements BackendAdapter {
  async getLeaderboard(blueprintId: string, limit = 10): Promise<LeaderboardEntry[]> {
    return readEntries(blueprintId).slice(0, limit);
  }

  async postScore(
    blueprintId: string,
    entry: Omit<LeaderboardEntry, 'blueprintId'>,
  ): Promise<void> {
    const entries = readEntries(blueprintId);
    entries.push({ ...entry, blueprintId });
    entries.sort((a, b) => a.timeMs - b.timeMs);
    const trimmed = entries.slice(0, MAX_LEADERBOARD);
    try {
      localStorage.setItem(lbKey(blueprintId), JSON.stringify(trimmed));
    } catch {
      // storage full — no-op
    }
  }

  async validateLicenseKey(_key: string): Promise<{ valid: false }> {
    return { valid: false };
  }

  async postSchoolInquiry(data: SchoolInquiry): Promise<void> {
    console.log('[LocalAdapter] school inquiry (offline):', data);
  }
}
