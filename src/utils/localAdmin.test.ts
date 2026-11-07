import { describe, expect, it } from 'vitest';
import { allowsLocalAdmin } from './localAdmin';

describe('local workshop admin', () => {
  it('requires a development build, explicit server opt-in and the admin link', () => {
    const admin = new URL('http://127.0.0.1:7302/?admin=1');
    expect(allowsLocalAdmin(true, true, admin)).toBe(true);
    expect(allowsLocalAdmin(false, true, admin)).toBe(false);
    expect(allowsLocalAdmin(true, false, admin)).toBe(false);
    expect(allowsLocalAdmin(true, true, new URL('http://127.0.0.1:7302/'))).toBe(false);
  });

  it('rejects remote origins and loopback lookalikes', () => {
    for (const host of ['192.168.1.10', 'octogears.example', '127.0.0.1.example']) {
      expect(allowsLocalAdmin(true, true, new URL(`http://${host}/?admin=1`))).toBe(false);
    }
  });
});
