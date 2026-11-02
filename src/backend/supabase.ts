import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { BackendAdapter, LeaderboardEntry, SchoolInquiry } from './types';

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export class SupabaseAdapter implements BackendAdapter {
  private client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey);
  }

  async getLeaderboard(blueprintId: string, limit = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.client
      .from('leaderboard')
      .select('profile_name, time_ms, created_at')
      .eq('blueprint_id', blueprintId)
      .order('time_ms', { ascending: true })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => ({
      blueprintId,
      profileName: row.profile_name as string,
      timeMs: row.time_ms as number,
      date: (row.created_at as string).slice(0, 10),
    }));
  }

  async postScore(
    blueprintId: string,
    entry: Omit<LeaderboardEntry, 'blueprintId'>,
  ): Promise<void> {
    await this.client.from('leaderboard').insert({
      blueprint_id: blueprintId,
      profile_name: entry.profileName,
      time_ms: entry.timeMs,
    });
  }

  async validateLicenseKey(
    key: string,
  ): Promise<{ valid: true; tier: 'school'; org?: string; expiresAt?: string } | { valid: false }> {
    const hash = await sha256hex(key);
    const { data } = await this.client
      .from('license_keys')
      .select('tier, org, expires_at')
      .eq('key_hash', hash)
      .maybeSingle();

    if (!data) return { valid: false };
    const expired =
      data.expires_at && new Date(data.expires_at as string) < new Date();
    if (expired) return { valid: false };
    return {
      valid: true,
      tier: 'school',
      org: data.org as string | undefined,
      expiresAt: data.expires_at as string | undefined,
    };
  }

  async postSchoolInquiry(data: SchoolInquiry): Promise<void> {
    await this.client.from('school_inquiries').insert({
      first_name: data.firstName,
      school: data.school,
      email: data.email,
      message: data.message ?? null,
    });
  }
}
