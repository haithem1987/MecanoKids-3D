export interface LeaderboardEntry {
  profileName: string;
  timeMs: number;
  date: string;
  blueprintId: string;
}

export interface SchoolInquiry {
  firstName: string;
  school: string;
  email: string;
  message?: string;
}

export interface BackendAdapter {
  getLeaderboard(blueprintId: string, limit?: number): Promise<LeaderboardEntry[]>;
  postScore(blueprintId: string, entry: Omit<LeaderboardEntry, 'blueprintId'>): Promise<void>;
  validateLicenseKey(
    key: string,
  ): Promise<{ valid: true; tier: 'family' | 'school'; org?: string; expiresAt?: string } | { valid: false }>;
  postSchoolInquiry(data: SchoolInquiry): Promise<void>;
  syncProgress?(userId: string, progress: unknown): Promise<void>;
  storeLicenseKey?(data: { keyHash: string; tier: 'family' | 'school'; expiresAt: string | null }): Promise<void>;
}
