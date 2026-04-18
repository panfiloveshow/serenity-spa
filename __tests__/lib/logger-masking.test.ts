import { describe, it, expect } from 'vitest';
import { maskName, maskPhone, maskIp, maskEmail } from '@/lib/logger';

describe('maskName', () => {
  it('masks common Russian name, keeping first + last letter', () => {
    expect(maskName('Иван')).toBe('И***н');
  });

  it('keeps single-char for 2-char names', () => {
    expect(maskName('Ян')).toBe('Я*');
  });

  it('handles empty / undefined safely', () => {
    expect(maskName('')).toBe('');
    expect(maskName(undefined)).toBe('');
    expect(maskName(null)).toBe('');
  });

  it('handles whitespace-only input', () => {
    // trimmed first char only — but spec is "keep first, hide middle, keep last"
    expect(maskName('   И   ').length).toBeGreaterThan(0);
  });
});

describe('maskPhone', () => {
  it('masks UZ phone keeping country code and last 2 digits', () => {
    expect(maskPhone('+998 90 535 74 87')).toBe('+998 ** *** ** 87');
  });

  it('works with digits-only input', () => {
    expect(maskPhone('998905357487')).toBe('+998 ** *** ** 87');
  });

  it('returns *** for too-short input', () => {
    expect(maskPhone('123')).toBe('***');
  });

  it('handles empty / undefined', () => {
    expect(maskPhone('')).toBe('');
    expect(maskPhone(undefined)).toBe('');
  });

  it('never contains the full number', () => {
    const phone = '+998 90 535 74 87';
    const masked = maskPhone(phone);
    expect(masked).not.toContain('90 535 74');
    expect(masked).not.toContain('905357487');
  });
});

describe('maskIp', () => {
  it('masks IPv4 keeping first two octets', () => {
    expect(maskIp('92.63.205.168')).toBe('92.63.*.*');
    expect(maskIp('188.113.253.82')).toBe('188.113.*.*');
  });

  it('masks IPv6 keeping first two groups', () => {
    expect(maskIp('2001:db8:abcd:1234::1')).toContain('2001:db8:');
    expect(maskIp('2001:db8:abcd:1234::1')).toContain('****');
  });

  it('handles localhost / unknown', () => {
    expect(maskIp('Unknown')).toBe('Unknown');
    expect(maskIp('')).toBe('Unknown');
  });

  it('never exposes the last two IPv4 octets', () => {
    const masked = maskIp('192.168.123.45');
    expect(masked).not.toContain('123');
    expect(masked).not.toContain('45');
  });
});

describe('maskEmail', () => {
  it('keeps first letter + domain', () => {
    expect(maskEmail('ivanov@example.com')).toBe('i***@example.com');
  });

  it('returns *** for invalid email-like strings', () => {
    expect(maskEmail('notanemail')).toBe('***');
  });

  it('handles empty', () => {
    expect(maskEmail('')).toBe('');
  });
});
