import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveServiceInfo, normalizeSourceBucket } from '@/lib/leads/catalog-price';
import {
  formatAdsConversionTime,
  formatRussianDateRange,
  formatSheetsTimestamp,
  fromTashkentParts,
  getPreviousFullWeekRangeTashkent,
  isWithinWorkingHours,
  parseFlexibleDateToYmd,
  parseWorkHours,
  workingMinutesBetween,
} from '@/lib/leads/time';
import { analyzeTrafficSource } from '@/lib/traffic-source';
import { bookingSchema } from '@/lib/validation';
import { collectVisitorData } from '@/lib/visitor-tracker';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Tashkent time and working hours calculations', () => {
  const workHours = parseWorkHours('09:00', '22:00');

  it('formats timestamps strictly in UTC+05:00 (+0500)', () => {
    const utc = new Date('2026-11-16T11:30:45Z'); // 16:30:45 Tashkent
    expect(formatSheetsTimestamp(utc)).toBe('2026-11-16 16:30:45');
    expect(formatAdsConversionTime(utc)).toBe('2026-11-16 16:30:45+0500');
  });

  it('treats night leads as arriving at 09:00 and counts only working minutes', () => {
    const night = fromTashkentParts(2026, 11, 17, 2, 30, 0);
    expect(isWithinWorkingHours(night, workHours)).toBe(false);

    const earlyReply = fromTashkentParts(2026, 11, 17, 8, 45, 0);
    expect(workingMinutesBetween(night, earlyReply, workHours)).toBe(0);

    const morningReply = fromTashkentParts(2026, 11, 17, 9, 15, 0);
    expect(workingMinutesBetween(night, morningReply, workHours)).toBe(15);

    const evening = fromTashkentParts(2026, 11, 16, 21, 50, 0);
    const nextMorning = fromTashkentParts(2026, 11, 17, 9, 5, 0);
    expect(workingMinutesBetween(evening, nextMorning, workHours)).toBe(15);
  });

  it('computes previous Mon-Sun Tashkent week on Monday 09:00', () => {
    const mondayMorning = fromTashkentParts(2026, 11, 16, 9, 0, 0);
    const week = getPreviousFullWeekRangeTashkent(mondayMorning);
    expect(week.mondayYmd).toBe('2026-11-09');
    expect(formatSheetsTimestamp(week.start)).toBe('2026-11-09 00:00:00');
    expect(formatSheetsTimestamp(week.end)).toBe('2026-11-15 23:59:59');
    expect(formatRussianDateRange(week.start, week.end)).toBe('9–15 ноября');
  });

  it('parses flexible booking dates', () => {
    const ref = fromTashkentParts(2026, 11, 17, 12, 0, 0);
    expect(parseFlexibleDateToYmd('18.11.2026', ref)).toBe('2026-11-18');
    expect(parseFlexibleDateToYmd('2026-11-19', ref)).toBe('2026-11-19');
    expect(parseFlexibleDateToYmd('20.11', ref)).toBe('2026-11-20');
    expect(parseFlexibleDateToYmd('31.02.2026', ref)).toBeNull();
  });
});

describe('Catalog service category and UZS price resolution', () => {
  it('resolves massage services with distinct durations across locales', () => {
    expect(resolveServiceInfo('Массажи — Традиционный балийский (60 мин)')).toEqual({
      category: 'Массажи',
      priceUzs: 1_000_000,
    });
    expect(resolveServiceInfo('Массажи — Традиционный балийский (90 мин)')).toEqual({
      category: 'Массажи',
      priceUzs: 1_300_000,
    });
    expect(resolveServiceInfo('Massages — Traditional Balinese (90 min)')).toEqual({
      category: 'Массажи',
      priceUzs: 1_300_000,
    });
  });

  it('resolves packages, weekday/weekend day pass, and variable kids membership', () => {
    expect(resolveServiceInfo('Программа: Пакет Serenity для двоих — 5 000 000 UZS')).toEqual({
      category: 'SPA-программы',
      priceUzs: 5_000_000,
    });
    // Wednesday -> 600 000, Saturday -> 700 000
    expect(resolveServiceInfo('Абонемент: Разовое посещение', '2026-11-18')).toEqual({
      category: 'Разовое посещение',
      priceUzs: 600_000,
    });
    expect(resolveServiceInfo('Abonement: Bir martalik tashrif', '2026-11-21')).toEqual({
      category: 'Разовое посещение',
      priceUzs: 700_000,
    });
    expect(resolveServiceInfo('Абонемент: Детский')).toEqual({
      category: 'Абонементы',
      priceUzs: null,
    });
    expect(resolveServiceInfo('Консультация')).toEqual({
      category: 'Консультация',
      priceUzs: null,
    });
  });

  it('normalizes traffic sources for weekly summary buckets', () => {
    expect(normalizeSourceBucket('Google Реклама · Google Поиск')).toBe('Google Поиск');
    expect(normalizeSourceBucket('ChatGPT (ИИ-ассистент)')).toBe('ChatGPT');
    expect(normalizeSourceBucket('TripAdvisor (бесплатно)')).toBe('TripAdvisor');
    expect(normalizeSourceBucket('Прямой переход')).toBe('Прямые');
  });
});

describe('gbraid and wbraid capture, validation and source attribution', () => {
  it('captures gbraid/wbraid from URL and persists across sessions within 90 days', () => {
    vi.useFakeTimers();
    const t0 = new Date('2026-11-17T10:00:00Z');
    vi.setSystemTime(t0);

    const makeStorage = () => {
      const map = new Map<string, string>();
      return {
        getItem: (k: string) => map.get(k) ?? null,
        setItem: (k: string, v: string) => { map.set(k, v); },
        removeItem: (k: string) => { map.delete(k); },
      };
    };

    const localStorageMock = makeStorage();
    let sessionStorageMock = makeStorage();
    let search = '?gbraid=GBRAID_SAFARI_123&utm_campaign=SerenitySpa%20Search';

    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('sessionStorage', sessionStorageMock);
    vi.stubGlobal('document', { referrer: '', title: 'Serenity Spa' });
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (iPhone)', language: 'ru-RU' });
    vi.stubGlobal('screen', { width: 390, height: 844 });
    vi.stubGlobal('window', {
      get location() {
        return {
          href: `https://serenityspa.uz/ru${search}`,
          pathname: '/ru',
          search,
        };
      },
      crypto: { randomUUID: () => '11111111-1111-4111-8111-111111111111' },
    });

    const first = collectVisitorData();
    expect(first.gbraid).toBe('GBRAID_SAFARI_123');
    expect(first.utm_campaign).toBe('SerenitySpa Search');
    expect(first.adClickAt).toBe(t0.toISOString());

    // Simulate closing tab and returning 5 days later without query params
    vi.setSystemTime(new Date(t0.getTime() + 5 * 86_400_000));
    search = '';
    sessionStorageMock = makeStorage();
    vi.stubGlobal('sessionStorage', sessionStorageMock);

    const returning = collectVisitorData();
    expect(returning.gbraid).toBe('GBRAID_SAFARI_123');
    expect(returning.utm_campaign).toBe('SerenitySpa Search');
    expect(returning.adClickAt).toBe(t0.toISOString());

    // After 91 days attribution expires
    vi.setSystemTime(new Date(t0.getTime() + 91 * 86_400_000));
    sessionStorageMock = makeStorage();
    vi.stubGlobal('sessionStorage', sessionStorageMock);
    const expired = collectVisitorData();
    expect(expired.gbraid).toBeUndefined();
  });

  it('validates gbraid/wbraid in bookingSchema and classifies wbraid as Google Ads', () => {
    const parsed = bookingSchema.safeParse({
      name: 'Test Booking',
      phone: '+998 90 000 00 01',
      visitor: {
        referrer: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: 'SerenitySpa Search',
        utm_content: '',
        utm_term: '',
        wbraid: 'WBRAID_WEB_789',
        gad_source: '1',
        adClickAt: '2026-11-16T10:00:00.000Z',
        device: 'Мобильный',
        browser: 'Safari',
        os: 'iOS',
        screenResolution: '390×844',
        language: 'ru',
        currentPage: 'https://serenityspa.uz/ru',
        landingPage: 'https://serenityspa.uz/ru?wbraid=WBRAID_WEB_789',
        pageTitle: 'Serenity Spa',
        visitTimestamp: '17.11.2026',
        sessionDuration: '45 сек',
        pagesViewed: 2,
        trafficSource: 'Google Ads',
      },
    });
    expect(parsed.success).toBe(true);

    const traffic = analyzeTrafficSource({ wbraid: 'WBRAID_WEB_789', gad_source: '1' });
    expect(traffic.label).toBe('Google Реклама · Google Поиск');
    expect(traffic.suspicious).toBe(false);
  });
});
