import { mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';

let tempDir: string | null = null;

afterEach(() => {
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
  delete process.env.FAILED_BOOKINGS_DIR;
  delete process.env.TG_BOT_TOKEN;
  delete process.env.FAILED_BOOKINGS_ENCRYPTION_KEY;
  vi.resetModules();
});

describe('saveFailedBooking', () => {
  it('stores encrypted retry message and masked metadata without raw PII', async () => {
    tempDir = mkdtempSync(join(tmpdir(), 'serenity-failed-'));
    process.env.FAILED_BOOKINGS_DIR = tempDir;
    process.env.TG_BOT_TOKEN = 'test-token-for-encryption';
    vi.resetModules();
    const { saveFailedBooking } = await import('@/lib/logger');

    const filepath = await saveFailedBooking({
      name: 'Иван Петров',
      phone: '+998 90 123 45 67',
      service: 'Массаж',
      ip: '92.63.205.168',
      message: '👤 Иван Петров\n📞 +998 90 123 45 67',
      requestId: 'abc123',
      score: 20,
    });

    const raw = readFileSync(filepath, 'utf8');
    const saved = JSON.parse(raw);

    expect(saved.schemaVersion).toBe(2);
    expect(saved.retryMessage.alg).toBe('aes-256-gcm');
    expect(saved.message).toBeUndefined();
    expect(saved.customer.name).toBe('И***в');
    expect(saved.customer.phone).toBe('+998 ** *** ** 67');
    expect(saved.ip).toBe('92.63.*.*');
    expect(raw).not.toContain('Иван Петров');
    expect(raw).not.toContain('+998 90 123 45 67');
    expect(raw).not.toContain('901234567');
    expect(raw).not.toContain('92.63.205.168');
  });
});
