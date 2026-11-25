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
  it('does not penalize ordinary contact or IP follow-ups', () => {
    expect(assessRisk(baseInput({ phoneSubmissionsLast24h: 8, ipSubmissionsLast24h: 10 })).score).toBe(0);
  });
  it('adds exactly 30 risk points from the second device submission in 10 minutes', () => {
    expect(assessRisk(baseInput({ deviceSubmissionsLast10m: 2 })).score).toBe(30);
    expect(assessRisk(baseInput({ deviceSubmissionsLast10m: 5 })).score).toBe(30);
    expect(assessRisk(baseInput({ deviceSubmissionsLast10m: 1 })).score).toBe(0);
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

  it('does not penalize a confirmed Private Relay address for proxy or hosting', () => {
    const r = assessRisk(baseInput({
      privateRelay: 'listed',
      geo: { ...geoBase, countryCode: 'UZ', proxy: true, hosting: true },
      traffic: analyzeTrafficSource({ referrer: 'https://www.google.com/' }),
      comment: 'На два человека',
    }));
    expect(r.score).toBeLessThan(25);
    expect(r.title).toContain('✅');
    expect(r.flags.some(f => /прокси|VPN|хостинг/i.test(f.reason))).toBe(false);
  });

  it('keeps independent spam signals for a confirmed Private Relay address', () => {
    const r = assessRisk(baseInput({
      privateRelay: 'listed',
      geo: { ...geoBase, countryCode: 'UZ', proxy: true },
      comment: 'asdfghjkl',
    }));
    expect(r.score).toBe(30);
    expect(r.flags.some(f => /комментарий/i.test(f.reason))).toBe(true);
  });

  it('does not penalize hosting or proxy in the Private Relay fallback case', () => {
    const r = assessRisk(baseInput({
      privateRelay: 'fallback',
      geo: { ...geoBase, countryCode: 'UZ', proxy: true, hosting: true },
    }));
    expect(r.score).toBe(0);
    expect(r.flags.some(f => /прокси|VPN/i.test(f.reason))).toBe(false);
    expect(r.flags.some(f => /хостинг/i.test(f.reason))).toBe(false);
  });

  it.each([
    'Uzbektelekom Joint Stock Company', 'UNITEL LLC', 'Beeline Uzbekistan',
    'Coscom LLC', 'Ucell', 'UzMobile', 'Perfectum', 'Turon Telecom',
    'Sarkor Telecom', 'TPS', 'EVO', 'Comnet',
  ])('does not treat a domestic operator as hosting: %s', isp => {
    const r = assessRisk(baseInput({ geo: { ...geoBase, countryCode: 'UZ', isp, hosting: true } }));
    expect(r.score).toBe(0);
    expect(r.flags.some(f => /хостинг/i.test(f.reason))).toBe(false);
  });

  it('identifies Uzbektelekom by ASN even if the organization name is absent', () => {
    expect(assessRisk(baseInput({ geo: { ...geoBase, countryCode: 'UZ', asName: 'AS8193', hosting: true } })).score).toBe(0);
  });

  it('does not treat an unidentified hosting flag alone as proof of a data centre', () => {
    expect(assessRisk(baseInput({ geo: { ...geoBase, countryCode: 'UZ', isp: 'Some local ISP', hosting: true } })).score).toBe(0);
  });

  it.each(['Amazon Web Services', 'Google Cloud', 'Microsoft Azure', 'DigitalOcean', 'Hetzner', 'OVH', 'Contabo'])('identifies a cloud or data centre: %s', isp => {
    const r = assessRisk(baseInput({ geo: { ...geoBase, countryCode: 'UZ', isp, hosting: true } }));
    expect(r.flags.some(f => /хостинг/i.test(f.reason))).toBe(true);
  });

  it.each(['Cloudflare', 'Akamai'])('does not penalize %s with Apple Safari', isp => {
    const r = assessRisk(baseInput({
      serverUA: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
      geo: { ...geoBase, countryCode: 'UZ', isp, proxy: true, hosting: true },
    }));
    expect(r.score).toBe(0);
  });

  it('does not treat a foreign Private Relay exit as the visitor’s location', () => {
    const r = assessRisk(baseInput({
      privateRelay: 'listed',
      geo: { ...geoBase, countryCode: 'DE', country: 'Germany', isp: 'Akamai', proxy: true, hosting: true },
    }));
    expect(r.score).toBe(0);
  });

  it('recognizes a hosted Google network even when the provider uses its legal name', () => {
    const r = assessRisk(baseInput({ geo: { ...geoBase, countryCode: 'UZ', isp: 'Google LLC', hosting: true } }));
    expect(r.flags.some(f => /хостинг/i.test(f.reason))).toBe(true);
  });

  it('still flags a Cloudflare proxy on Android', () => {
    const r = assessRisk(baseInput({ geo: { ...geoBase, countryCode: 'UZ', isp: 'Cloudflare', proxy: true, hosting: true } }));
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
  it('marks 50-point suspicious submissions with the red warning', () => {
    const r = assessRisk(baseInput({ formFillDurationMs: 2000 }));
    expect(r).toMatchObject({ score: 50, level: 'suspicious' });
    expect(r.title).toContain('🚨');
  });

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


describe('assessRisk — booking quality signals', () => {
  it('does not penalize a foreign phone on its own', () => {
    const r = assessRisk(baseInput({ phone: analyzePhone('+44 7700 900123') }));
    expect(r.score).toBe(0);
    expect(r.flags).toEqual([]);
  });

  it.each(['asdfghjkl', 'qwertyuiop', 'фывапролдж', 'aaaaaaaaaaaa', 'asdasdasdasd', 'bskdfjghrt'])('raises risk for gibberish: %s', comment => {
    expect(assessRisk(baseInput({ comment })).score).toBeGreaterThan(0);
  });

  it.each([
    ['Jurtek', 'Gxhd'],
    ['Jurtek', 'Jurtek'],
    ['Abdullah', 'Gshkjf\nName Surname'],
    ['Shoxruz', 'Robux\nYutib olish'],
    ['ARTUR', 'Uyin.uynask'],
  ])('keeps the historical %s spam pattern at least 50 points', (name, comment) => {
    const r = assessRisk(baseInput({ name, comment, traffic: analyzeTrafficSource({ gad_source: '5' }), sessionSeconds: 120 }));
    expect(r.score).toBeGreaterThanOrEqual(50);
    expect(r.title).toContain('🚨');
  });

  it('does not penalize a name-only comment without another suspicious traffic signal', () => {
    expect(assessRisk(baseInput({ name: 'Aziza', comment: 'Aziza' })).score).toBe(0);
  });

  it.each(['', 'Hi', 'OK', 'Please contact me on WhatsApp', 'Массаж для двоих', "Ertaga massajga yozilmoqchiman", '我们想预约按摩'])('does not flag a meaningful or empty comment: %s', comment => {
    expect(assessRisk(baseInput({ comment })).flags).toEqual([]);
  });

  it('raises risk for gclid together with a session under 60 seconds', () => {
    expect(assessRisk(baseInput({ gclid: 'ad-click', sessionSeconds: 59 })).score).toBeGreaterThan(0);
    expect(assessRisk(baseInput({ gclid: 'ad-click', sessionSeconds: 60 })).score).toBe(0);
    expect(assessRisk(baseInput({ gclid: 'ad-click', sessionSeconds: null })).score).toBe(0);
    expect(assessRisk(baseInput({ sessionSeconds: 59 })).score).toBe(0);
  });

  it.each([19, 20, 23, 0])('does not add risk at UTC hour %i (00–06 Tashkent)', hour => {
    expect(assessRisk(baseInput({ submittedAt: new Date(Date.UTC(2026, 9, 26, hour)) })).score).toBe(0);
  });

  it.each([18, 1, 7])('does not add night risk at UTC hour %i', hour => {
    expect(assessRisk(baseInput({ submittedAt: new Date(Date.UTC(2026, 9, 26, hour)) })).score).toBe(0);
  });

  it('raises risk for gad_source=5', () => {
    const r = assessRisk(baseInput({ traffic: analyzeTrafficSource({ gad_source: '5' }) }));
    expect(r.score).toBeGreaterThan(0);
  });
});
