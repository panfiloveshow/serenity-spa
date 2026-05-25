import { describe, it, expect } from 'vitest';
import { bookingSchema, detectBot, validateName } from '@/lib/validation';

const validVisitor = {
  referrer: '',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
  utm_term: '',
  device: 'Mobile',
  browser: 'Chrome',
  os: 'Android',
  screenResolution: '412x869',
  language: 'ru-RU',
  currentPage: 'https://serenityspa.uz/',
  landingPage: 'https://serenityspa.uz/',
  pageTitle: 'Home',
  visitTimestamp: '2026-04-13',
  sessionDuration: '1m',
  pagesViewed: 1,
  trafficSource: 'Direct',
};

describe('bookingSchema — happy path', () => {
  it('accepts minimal valid payload', () => {
    const result = bookingSchema.safeParse({
      name: 'Иван',
      phone: '+998 90 123 45 67',
      visitor: validVisitor,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Иван');
    }
  });

  it('accepts full payload with optional fields', () => {
    const result = bookingSchema.safeParse({
      name: 'Анна Петрова',
      phone: '+998 90 123 45 67',
      service: 'Massage',
      date: '2026-05-01',
      time: '14:00',
      comment: 'Прошу позвонить утром',
      website: '',
      formOpenedAt: Date.now() - 20000,
      pageLocale: 'ru',
      visitor: { ...validVisitor, gclid: 'abc123', gad_source: '1' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid preferred time', () => {
    const result = bookingSchema.safeParse({
      name: 'Анна Петрова',
      phone: '+998 90 123 45 67',
      time: '25:99',
      visitor: validVisitor,
    });
    expect(result.success).toBe(false);
  });

  it('normalizes whitespace in name', () => {
    const result = bookingSchema.safeParse({
      name: '  Иван    Петров  ',
      phone: '+998 90 123 45 67',
      visitor: validVisitor,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('Иван Петров');
  });
});

describe('bookingSchema — name validation', () => {
  it('rejects names shorter than 2 chars', () => {
    const result = bookingSchema.safeParse({
      name: 'И',
      phone: '+998 90 123 45 67',
      visitor: validVisitor,
    });
    expect(result.success).toBe(false);
  });

  it('rejects names with digits', () => {
    const result = bookingSchema.safeParse({
      name: 'Test123',
      phone: '+998 90 123 45 67',
      visitor: validVisitor,
    });
    expect(result.success).toBe(false);
  });

  it('accepts Uzbek Latin with apostrophes (Oʻzbek)', () => {
    const result = bookingSchema.safeParse({
      name: "Xojiakbar Oʻrinov",
      phone: '+998 90 123 45 67',
      visitor: validVisitor,
    });
    expect(result.success).toBe(true);
  });

  it('accepts hyphenated names', () => {
    const result = bookingSchema.safeParse({
      name: 'Анна-Мария',
      phone: '+998 90 123 45 67',
      visitor: validVisitor,
    });
    expect(result.success).toBe(true);
  });

  it('rejects names longer than 100 chars', () => {
    const result = bookingSchema.safeParse({
      name: 'А'.repeat(101),
      phone: '+998 90 123 45 67',
      visitor: validVisitor,
    });
    expect(result.success).toBe(false);
  });
});

describe('bookingSchema — pageLocale', () => {
  it('accepts supported locales only', () => {
    for (const locale of ['ru', 'uz', 'en']) {
      const r = bookingSchema.safeParse({
        name: 'Иван', phone: '+998 90 123 45 67',
        pageLocale: locale, visitor: validVisitor,
      });
      expect(r.success, `locale=${locale}`).toBe(true);
    }
  });

  it('rejects unsupported locales', () => {
    const r = bookingSchema.safeParse({
      name: 'Иван', phone: '+998 90 123 45 67',
      pageLocale: 'de', visitor: validVisitor,
    });
    expect(r.success).toBe(false);
  });
});

describe('bookingSchema — comment length', () => {
  it('rejects comments longer than 500 chars', () => {
    const r = bookingSchema.safeParse({
      name: 'Иван', phone: '+998 90 123 45 67',
      comment: 'А'.repeat(501),
      visitor: validVisitor,
    });
    expect(r.success).toBe(false);
  });
});

describe('detectBot', () => {
  it('flags honeypot fill', () => {
    const r = detectBot({
      website: 'http://spam.com',
      formOpenedAt: Date.now() - 10000,
      submittedAt: Date.now(),
    });
    expect(r.isBot).toBe(true);
    expect(r.reason).toBe('honeypot_filled');
  });

  it('flags sub-second submissions as bot', () => {
    const now = Date.now();
    const r = detectBot({
      website: '',
      formOpenedAt: now - 500,
      submittedAt: now,
    });
    expect(r.isBot).toBe(true);
    expect(r.reason).toBe('submitted_too_fast');
    expect(r.formFillDurationMs).toBe(500);
  });

  it('allows 2-second submissions (risk-score handles them)', () => {
    const now = Date.now();
    const r = detectBot({
      website: '', formOpenedAt: now - 2000, submittedAt: now,
    });
    expect(r.isBot).toBe(false);
    expect(r.formFillDurationMs).toBe(2000);
  });

  it('does not flag when formOpenedAt missing', () => {
    const r = detectBot({
      website: '', submittedAt: Date.now(),
    });
    expect(r.isBot).toBe(false);
    expect(r.formFillDurationMs).toBeNull();
  });
});

describe('validateName (legacy helper)', () => {
  it('returns valid for normal names', () => {
    expect(validateName('Иван Петров').valid).toBe(true);
  });

  it('returns invalid for short names', () => {
    const r = validateName('И');
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('trims whitespace before validating', () => {
    expect(validateName('  Иван  ').valid).toBe(true);
  });
});
