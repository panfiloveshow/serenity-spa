import { describe, it, expect } from 'vitest';
import { assessRisk, type RiskInput } from '@/lib/risk-score';
import { analyzePhone } from '@/lib/phone-info';
import { analyzeTrafficSource } from '@/lib/traffic-source';

/**
 * Base input represents a minimally-engaged user (no -10 bonus) so that
 * tests can reason about absolute weights without subtracting engagement.
 */
function baseInput(overrides: Partial<RiskInput> = {}): RiskInput {
  return {
    phone: analyzePhone('+998 90 535 74 87'),
    traffic: analyzeTrafficSource({}),
    geo: null,
    clientUA: 'Chrome / Android',
    serverUA: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/146.0 Mobile',
    formFillDurationMs: 15000,
    ipSubmissionsLast24h: 1,
    phoneSubmissionsLast24h: 1,
    pagesViewed: 1,
    sessionSeconds: 20,
    ...overrides,
  };
}

describe('assessRisk — clean baseline', () => {
  it('returns clean level for a normal booking', () => {
    const r = assessRisk(baseInput());
    expect(r.level).toBe('clean');
    expect(r.score).toBeLessThanOrEqual(25);
    expect(r.flags).toEqual([]);
  });

  it('title matches level label', () => {
    expect(assessRisk(baseInput()).title).toContain('НОВАЯ ЗАЯВКА');
  });

  it('engagement bonus reduces score by 10', () => {
    const low = assessRisk(baseInput({
      formFillDurationMs: 2000, pagesViewed: 1, sessionSeconds: 10,
    }));
    const high = assessRisk(baseInput({
      formFillDurationMs: 2000, pagesViewed: 5, sessionSeconds: 300,
    }));
    expect(high.score).toBe(low.score - 10);
  });
});

describe('assessRisk — form fill speed', () => {
  it('fast form (<3s) adds heavy weight', () => {
    const r = assessRisk(baseInput({ formFillDurationMs: 2000 }));
    expect(r.flags.some(f => /сек/.test(f.reason))).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(50);
  });

  it('moderately fast (3-7s) adds mild weight', () => {
    const r = assessRisk(baseInput({ formFillDurationMs: 5000 }));
    expect(r.flags.some(f => /быстро|сек/.test(f.reason))).toBe(true);
    expect(r.score).toBeLessThan(50);
  });

  it('abandoned-then-submitted (>6h) flagged', () => {
    const r = assessRisk(baseInput({ formFillDurationMs: 7 * 60 * 60 * 1000 }));
    expect(r.flags.some(f => /автомати|час/.test(f.reason))).toBe(true);
  });

  it('normal duration produces no speed flag', () => {
    const r = assessRisk(baseInput({ formFillDurationMs: 20000 }));
    expect(r.flags.filter(f => /сек/.test(f.reason))).toHaveLength(0);
  });
});

describe('assessRisk — phone signals', () => {
  it('suspicious phone pattern adds heavy weight', () => {
    const r = assessRisk(baseInput({
      phone: analyzePhone('+998 99 999 99 99'),
    }));
    expect(r.flags.some(f => /тестов/.test(f.reason))).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(55);
  });

  it('non-mobile prefix adds medium weight', () => {
    const r = assessRisk(baseInput({
      phone: analyzePhone('+998 71 123 45 67'), // landline
    }));
    expect(r.flags.some(f => /моб/.test(f.reason))).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(20);
  });
});

describe('assessRisk — traffic source', () => {
  it('fraud-indicator referrer adds >=50', () => {
    const r = assessRisk(baseInput({
      traffic: analyzeTrafficSource({ referrer: 'https://apps.2kings.ru/' }),
    }));
    expect(r.score).toBeGreaterThanOrEqual(50);
    expect(r.level).not.toBe('clean');
  });

  it('gad_source=5 adds >=30', () => {
    const r = assessRisk(baseInput({
      traffic: analyzeTrafficSource({ gad_source: '5' }),
    }));
    expect(r.score).toBeGreaterThanOrEqual(30);
  });

  it('trusted google.com referrer produces no suspicion', () => {
    const r = assessRisk(baseInput({
      traffic: analyzeTrafficSource({ referrer: 'https://www.google.com/' }),
    }));
    expect(r.flags).toEqual([]);
    expect(r.level).toBe('clean');
  });
});

describe('assessRisk — repeat submissions', () => {
  it('3+ submissions from same phone flagged', () => {
    const r = assessRisk(baseInput({ phoneSubmissionsLast24h: 3 }));
    expect(r.flags.some(f => /3 заявок/.test(f.reason))).toBe(true);
  });

  it('2nd submission from same phone has mild flag', () => {
    const r = assessRisk(baseInput({ phoneSubmissionsLast24h: 2 }));
    expect(r.flags.some(f => /2-я/.test(f.reason))).toBe(true);
  });

  it('5+ submissions from same IP heavily flagged', () => {
    const r = assessRisk(baseInput({ ipSubmissionsLast24h: 6 }));
    expect(r.flags.some(f => /6 заявок/.test(f.reason))).toBe(true);
  });
});

describe('assessRisk — geo signals', () => {
  const geoBase = {
    country: '', countryCode: '', city: '', region: '',
    isp: '', org: '', asName: '',
    mobile: false, proxy: false, hosting: false, lat: 0, lon: 0,
  };

  it('hosting IP flagged (weight 40)', () => {
    const r = assessRisk(baseInput({
      geo: { ...geoBase, countryCode: 'DE', country: 'Germany', hosting: true, asName: 'AS24940 Hetzner' },
    }));
    expect(r.flags.some(f => /хостинг/.test(f.reason))).toBe(true);
  });

  it('proxy/VPN flagged', () => {
    const r = assessRisk(baseInput({
      geo: { ...geoBase, countryCode: 'US', proxy: true },
    }));
    expect(r.flags.some(f => /прокси|VPN/i.test(f.reason))).toBe(true);
  });

  it('foreign country (non-UZ) flagged', () => {
    const r = assessRisk(baseInput({
      geo: { ...geoBase, countryCode: 'RU', country: 'Россия', mobile: true },
    }));
    expect(r.flags.some(f => /Узбек/i.test(f.reason))).toBe(true);
  });

  it('UZ mobile IP produces no geo flags', () => {
    const r = assessRisk(baseInput({
      geo: { ...geoBase, countryCode: 'UZ', country: 'Узбекистан', city: 'Ташкент', mobile: true, isp: 'Beeline UZ' },
    }));
    expect(r.flags.filter(f => /хост|прокси|Узбек/i.test(f.reason))).toHaveLength(0);
  });
});

describe('assessRisk — User-Agent', () => {
  it('empty UA flagged as bot-like', () => {
    const r = assessRisk(baseInput({ serverUA: '' }));
    expect(r.flags.some(f => /User-Agent|нормальный/i.test(f.reason))).toBe(true);
  });

  it('very short UA flagged as bot-like', () => {
    const r = assessRisk(baseInput({ serverUA: 'short' }));
    expect(r.flags.some(f => /User-Agent|нормальный/i.test(f.reason))).toBe(true);
  });

  it('long UA with curl keyword flagged as automated', () => {
    const r = assessRisk(baseInput({
      serverUA: 'curl/8.0.1 (x86_64-pc-linux-gnu) libcurl/8.0.1 OpenSSL/3.0.2',
    }));
    expect(r.flags.some(f => /автоматиз/i.test(f.reason))).toBe(true);
  });

  it('long python-requests UA flagged as automated', () => {
    const r = assessRisk(baseInput({
      serverUA: 'python-requests/2.28.2 (Python/3.11 on linux)',
    }));
    expect(r.flags.some(f => /автоматиз/i.test(f.reason))).toBe(true);
  });

  it('normal mobile Chrome UA passes clean', () => {
    const r = assessRisk(baseInput({
      serverUA: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/146.0 Mobile Safari',
    }));
    expect(r.flags.filter(f => /User-Agent|автомат|бот/i.test(f.reason))).toHaveLength(0);
  });
});

describe('assessRisk — level thresholds', () => {
  it('score >=85 → reject level', () => {
    const r = assessRisk(baseInput({
      traffic: analyzeTrafficSource({ referrer: 'https://apps.2kings.ru/' }),
      geo: {
        country: '', countryCode: 'DE', city: '', region: '',
        isp: '', org: '', asName: '',
        mobile: false, proxy: false, hosting: true, lat: 0, lon: 0,
      },
      serverUA: '',
      formFillDurationMs: 1500,
    }));
    expect(r.score).toBeGreaterThanOrEqual(85);
    expect(r.level).toBe('reject');
  });

  it('score is clamped to [0, 100]', () => {
    const r = assessRisk(baseInput({
      traffic: analyzeTrafficSource({ referrer: 'https://apps.2kings.ru/' }),
      phone: analyzePhone('+998 99 999 99 99'),
      geo: {
        country: '', countryCode: 'DE', city: '', region: '',
        isp: '', org: '', asName: '',
        mobile: false, proxy: true, hosting: true, lat: 0, lon: 0,
      },
      serverUA: '',
      formFillDurationMs: 500,
      phoneSubmissionsLast24h: 10,
      ipSubmissionsLast24h: 10,
    }));
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });
});
