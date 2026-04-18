import { describe, it, expect } from 'vitest';
import { analyzeTrafficSource } from '@/lib/traffic-source';

describe('analyzeTrafficSource — direct / own domain', () => {
  it('labels empty referrer + no UTM as direct', () => {
    const r = analyzeTrafficSource({});
    expect(r.label).toBe('Прямой переход');
    expect(r.suspicious).toBe(false);
  });

  it('marks own-domain referrer as internal navigation', () => {
    const r = analyzeTrafficSource({ referrer: 'https://serenityspa.uz/some-page' });
    expect(r.isOwnDomain).toBe(true);
    expect(r.label).toMatch(/внутри сайта/i);
    expect(r.suspicious).toBe(false);
  });

  it('treats subdomain of own domain as own', () => {
    const r = analyzeTrafficSource({ referrer: 'https://blog.serenityspa.uz/' });
    expect(r.isOwnDomain).toBe(true);
    expect(r.suspicious).toBe(false);
  });
});

describe('analyzeTrafficSource — Google Ads / gad_source', () => {
  it('gad_source=1 (Search) is not suspicious', () => {
    const r = analyzeTrafficSource({
      gad_source: '1',
      gclid: 'CjwKCAjw...',
    });
    expect(r.suspicious).toBe(false);
    expect(r.gadSourceLabel).toBe('Google Поиск');
  });

  it('gad_source=5 (Search Partners) flags as suspicious', () => {
    const r = analyzeTrafficSource({ gad_source: '5' });
    expect(r.suspicious).toBe(true);
    expect(r.suspicionReason).toMatch(/партнёр/i);
    expect(r.gadSourceLabel).toMatch(/партнёр/i);
  });

  it('gad_source=7 (Display Network) flags as suspicious', () => {
    const r = analyzeTrafficSource({ gad_source: '7' });
    expect(r.suspicious).toBe(true);
  });

  it('unknown gad_source does not crash', () => {
    const r = analyzeTrafficSource({ gad_source: '999' });
    expect(r.gadSourceCode).toBe('999');
    expect(r.gadSourceLabel).toBeUndefined();
  });
});

describe('analyzeTrafficSource — fraud-indicator referrers', () => {
  it('flags apps.2kings.ru as fraud', () => {
    const r = analyzeTrafficSource({
      referrer: 'https://apps.2kings.ru/some-path',
    });
    expect(r.suspicious).toBe(true);
    expect(r.suspicionReason).toMatch(/партнёрск/i);
    expect(r.referrerHost).toBe('apps.2kings.ru');
  });

  it('flags mgid.com as fraud', () => {
    const r = analyzeTrafficSource({ referrer: 'https://mgid.com/ad' });
    expect(r.suspicious).toBe(true);
  });

  it('flags outbrain / taboola as fraud', () => {
    expect(analyzeTrafficSource({ referrer: 'https://outbrain.com/' }).suspicious).toBe(true);
    expect(analyzeTrafficSource({ referrer: 'https://taboola.com/' }).suspicious).toBe(true);
  });
});

describe('analyzeTrafficSource — trusted hosts', () => {
  it.each([
    ['https://www.google.com/search?q=spa', /Google/i],
    ['https://yandex.ru/', /Яндекс/i],
    ['https://instagram.com/reel/', /Instagram/i],
    ['https://www.facebook.com/page', /Facebook/i],
    ['https://t.me/channel', /Telegram/i],
    ['https://www.youtube.com/watch', /YouTube/i],
    ['https://www.tiktok.com/@user', /TikTok/i],
    ['https://2gis.uz/place', /2GIS/i],
  ])('classifies %s as not suspicious', (url, expectedLabel) => {
    const r = analyzeTrafficSource({ referrer: url });
    expect(r.suspicious).toBe(false);
    expect(r.label).toMatch(expectedLabel);
  });
});

describe('analyzeTrafficSource — unknown external host', () => {
  it('flags unknown external host as suspicious', () => {
    const r = analyzeTrafficSource({ referrer: 'https://some-random-site.xyz/' });
    expect(r.suspicious).toBe(true);
    expect(r.suspicionReason).toMatch(/неизвестн/i);
  });
});

describe('analyzeTrafficSource — UTM priority', () => {
  it('UTM source produces human-readable label', () => {
    const r = analyzeTrafficSource({ utm_source: 'instagram', utm_medium: 'story' });
    expect(r.label).toBe('Instagram');
  });

  it('UTM with custom source keeps raw with medium', () => {
    const r = analyzeTrafficSource({ utm_source: 'partner-xyz', utm_medium: 'cpc' });
    expect(r.label).toContain('partner-xyz');
  });
});

describe('analyzeTrafficSource — ownDomain override', () => {
  it('respects custom ownDomain parameter', () => {
    const r = analyzeTrafficSource({
      referrer: 'https://example.com/',
      ownDomain: 'example.com',
    });
    expect(r.isOwnDomain).toBe(true);
  });
});
