import type { BackendAdapter, LeaderboardEntry, SchoolInquiry } from './types';
import type { Tier } from '../utils/entitlements';

const TEST_KEYS: Record<string, { tier: Tier; expiresAt?: string }> = {
  'MK3D-DEMO-FAMI-LY01': { tier: 'family' },
  'MK3D-DEMO-SCHO-OL01': { tier: 'school' },
};

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

  async validateLicenseKey(key: string): Promise<{ valid: true; tier: 'family' | 'school'; org?: string; expiresAt?: string } | { valid: false }> {
    const match = TEST_KEYS[key.trim().toUpperCase()];
    if (!match) return { valid: false };
    return { valid: true, tier: match.tier as 'family' | 'school', expiresAt: match.expiresAt };
  }

  async postSchoolInquiry(data: SchoolInquiry): Promise<void> {
    console.log('[LocalAdapter] school inquiry (offline):', data);
  }

  async storeLicenseKey(data: { keyHash: string; tier: 'family' | 'school'; expiresAt: string | null }): Promise<void> {
    console.log('[LocalAdapter] storeLicenseKey (offline):', data);
  }

  private _processedEvents = new Set<string>();

  async markWebhookProcessed(eventId: string): Promise<boolean> {
    if (this._processedEvents.has(eventId)) return false;
    this._processedEvents.add(eventId);
    return true;
  }
}
