import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { analyzePhone } from '@/lib/phone-info';

describe('analyzePhone — format validation', () => {
  it('accepts valid Uzbekistan number in full format', () => {
    const r = analyzePhone('+998 90 123 45 67');
    expect(r.valid).toBe(true);
    expect(r.digits).toBe('998901234567');
    expect(r.formatted).toBe('+998 90 123 45 67');
    expect(r.countryCode).toBe('UZ');
  });

  it('normalizes mixed whitespace and separators', () => {
    const r = analyzePhone('+998-90-123-45-67');
    expect(r.valid).toBe(true);
    expect(r.digits).toBe('998901234567');
  });

  it('rejects numbers with wrong country code', () => {
    expect(analyzePhone('+7 912 345 67 89').valid).toBe(false);
    expect(analyzePhone('+1 555 123 4567').valid).toBe(false);
  });

  it('rejects numbers that are too short', () => {
    expect(analyzePhone('+998 90 123').valid).toBe(false);
    expect(analyzePhone('998').valid).toBe(false);
    expect(analyzePhone('').valid).toBe(false);
  });

  it('rejects numbers that are too long', () => {
    expect(analyzePhone('+998 90 123 45 67 89').valid).toBe(false);
  });
});

describe('analyzePhone — operator detection', () => {
  it.each([
    ['+998 90 123 45 67', 'Beeline UZ'],
    ['+998 91 123 45 67', 'Beeline UZ'],
    ['+998 93 123 45 67', 'Ucell'],
    ['+998 94 123 45 67', 'Ucell'],
    ['+998 95 123 45 67', 'Ucell'],
    ['+998 97 123 45 67', 'Mobiuz'],
    ['+998 98 123 45 67', 'Mobiuz'],
    ['+998 99 123 45 67', 'Beeline UZ'],
    ['+998 33 123 45 67', 'Humans'],
    ['+998 88 123 45 67', 'UzMobile'],
  ])('detects operator for %s', (phone, expectedOperator) => {
    const r = analyzePhone(phone);
    expect(r.operatorHint).toBe(expectedOperator);
    expect(r.isMobile).toBe(true);
  });

  it('returns empty operator for unknown prefixes (landlines etc.)', () => {
    const r = analyzePhone('+998 71 123 45 67'); // Tashkent landline
    expect(r.valid).toBe(true);
    expect(r.operatorHint).toBe('');
    expect(r.isMobile).toBe(false);
  });
});

describe('analyzePhone — suspicious patterns', () => {
  it('flags all-same-digits as suspicious', () => {
    const r = analyzePhone('+998 99 999 99 99');
    expect(r.suspiciousPattern).toBe(true);
    expect(r.patternReason).toMatch(/одинаков/i);
  });

  it('flags operator-code + repeating tail (33 333 33 33)', () => {
    const r = analyzePhone('+998 33 333 33 33');
    expect(r.suspiciousPattern).toBe(true);
  });

  it('flags sequential ascending 123456789', () => {
    const r = analyzePhone('+998 12 345 67 89');
    expect(r.suspiciousPattern).toBe(true);
  });

  it('does NOT flag genuinely random numbers', () => {
    const cases = [
      '+998 90 535 74 87',
      '+998 99 441 27 42',
      '+998 93 267 39 95',
      '+998 94 057 47 76',
    ];
    for (const c of cases) {
      const r = analyzePhone(c);
      expect(r.suspiciousPattern, `should not flag ${c}`).toBe(false);
    }
  });
});

describe('analyzePhone — property-based', () => {
  it('any 9-digit body with valid mobile prefix is valid', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('90', '91', '93', '94', '95', '97', '98', '99'),
        fc.integer({ min: 1000000, max: 9999999 }),
        (prefix, body) => {
          const raw = `+998${prefix}${body.toString()}`;
          const r = analyzePhone(raw);
          expect(r.valid).toBe(true);
          expect(r.isMobile).toBe(true);
        },
      ),
      { numRuns: 50 },
    );
  });

  it('stripping non-digits gives the same result', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('90', '91', '93', '94', '95', '97', '98', '99'),
        fc.integer({ min: 1000000, max: 9999999 }),
        (prefix, body) => {
          const core = `998${prefix}${body.toString()}`;
          const withSpaces = `+${core.slice(0, 3)} ${core.slice(3, 5)} ${core.slice(5, 8)} ${core.slice(8, 10)} ${core.slice(10, 12)}`;
          expect(analyzePhone(withSpaces).digits).toBe(analyzePhone(`+${core}`).digits);
        },
      ),
      { numRuns: 30 },
    );
  });
});
