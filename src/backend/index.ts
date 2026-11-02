import type { BackendAdapter } from './types';
import { LocalAdapter } from './local';
import { SupabaseAdapter } from './supabase';

let instance: BackendAdapter | null = null;

export function getBackendAdapter(): BackendAdapter {
  if (instance) return instance;

  // Works in both Vite (import.meta.env) and Node (process.env via dotenv)
  const supabaseUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) ||
    '';

  if (supabaseUrl) {
    const anonKey =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
      (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) ||
      '';
    instance = new SupabaseAdapter(supabaseUrl, anonKey);
  } else {
    instance = new LocalAdapter();
  }

  return instance;
}

export type { BackendAdapter, LeaderboardEntry, SchoolInquiry } from './types';
