import { describe, expect, it } from 'vitest';
import { getClientIpFromHeaders } from '@/app/api/booking/route';

function headers(values: Record<string, string>) {
  return new Headers(values);
}

describe('getClientIpFromHeaders', () => {
  it('prefers trusted x-real-ip when present', () => {
    const ip = getClientIpFromHeaders(headers({
      'x-real-ip': '203.0.113.10',
      'x-forwarded-for': '198.51.100.1, 203.0.113.10',
    }));

    expect(ip).toBe('203.0.113.10');
  });

  it('uses the right-most valid x-forwarded-for hop instead of spoofed first value', () => {
    const ip = getClientIpFromHeaders(headers({
      'x-forwarded-for': '1.2.3.4, 203.0.113.10',
    }));

    expect(ip).toBe('203.0.113.10');
  });

  it('ignores malformed forwarded values', () => {
    const ip = getClientIpFromHeaders(headers({
      'x-forwarded-for': 'not-an-ip, also-bad',
    }));

    expect(ip).toBe('Unknown');
  });

  it('normalizes IPv4 values with ports from proxy headers', () => {
    const ip = getClientIpFromHeaders(headers({
      'x-real-ip': '203.0.113.10:443',
    }));

    expect(ip).toBe('203.0.113.10');
  });
});
