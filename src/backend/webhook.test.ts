import { describe, it, expect, beforeEach } from 'vitest';
import { LocalAdapter } from './local';

describe('LocalAdapter.markWebhookProcessed', () => {
  let adapter: LocalAdapter;

  beforeEach(() => {
    adapter = new LocalAdapter();
  });

  it('returns true on first call', async () => {
    expect(await adapter.markWebhookProcessed('evt_test_001')).toBe(true);
  });

  it('returns false on duplicate call', async () => {
    await adapter.markWebhookProcessed('evt_test_001');
    expect(await adapter.markWebhookProcessed('evt_test_001')).toBe(false);
  });

  it('different event IDs are independent', async () => {
    expect(await adapter.markWebhookProcessed('evt_a')).toBe(true);
    expect(await adapter.markWebhookProcessed('evt_b')).toBe(true);
    expect(await adapter.markWebhookProcessed('evt_a')).toBe(false);
  });
});
