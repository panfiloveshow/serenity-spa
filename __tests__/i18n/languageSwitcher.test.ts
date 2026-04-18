/**
 * Feature: multi-language-support, Property 5: Генерация URL переключателя языка
 *
 * Замена только сегмента локали, остальной путь и хэш сохраняются.
 * Validates: Requirements 3.4
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SUPPORTED_LOCALES, type Locale } from '@/types/i18n';
import { buildLangSwitchHref } from '@/components/ui/LanguageSwitcher';

// --- Arbitraries ---

/** Any supported locale */
const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

/** A random path segment (no slashes) */
const segmentArb = fc.stringMatching(/^[a-z0-9_-]{1,20}$/);

/** A sub-path with 0–4 segments, e.g. "" or "/privacy" or "/foo/bar" */
const subpathArb = fc
  .array(segmentArb, { minLength: 0, maxLength: 4 })
  .map((segs) => (segs.length > 0 ? '/' + segs.join('/') : ''));

/** A full pathname starting with a locale prefix, e.g. "/ru/privacy" */
const pathnameArb = fc
  .tuple(localeArb, subpathArb)
  .map(([locale, sub]) => `/${locale}${sub}`);

describe('Property 5: Генерация URL переключателя языка', () => {
  it('заменяет только сегмент локали, сохраняя остальной путь', () => {
    fc.assert(
      fc.property(pathnameArb, localeArb, (pathname, targetLocale) => {
        const result = buildLangSwitchHref(pathname, targetLocale);

        // The result must start with the target locale prefix
        expect(result.startsWith(`/${targetLocale}`)).toBe(true);

        // Everything after the locale segment must be preserved
        const originalSuffix = pathname.replace(/^\/[^/]+/, '');
        const resultSuffix = result.replace(/^\/[^/]+/, '');
        expect(resultSuffix).toBe(originalSuffix);
      }),
      { numRuns: 200 },
    );
  });

  it('для любой пары (текущая, целевая) локалей результат содержит целевую локаль', () => {
    fc.assert(
      fc.property(localeArb, localeArb, subpathArb, (currentLocale, targetLocale, subpath) => {
        const pathname = `/${currentLocale}${subpath}`;
        const result = buildLangSwitchHref(pathname, targetLocale);

        const segments = result.split('/');
        expect(segments[1]).toBe(targetLocale);
      }),
      { numRuns: 200 },
    );
  });

  it('при одинаковой текущей и целевой локали URL не меняется', () => {
    fc.assert(
      fc.property(localeArb, subpathArb, (locale, subpath) => {
        const pathname = `/${locale}${subpath}`;
        const result = buildLangSwitchHref(pathname, locale);

        expect(result).toBe(pathname);
      }),
      { numRuns: 150 },
    );
  });

  // --- Unit tests for edge cases ---

  it('корневой путь /ru → /en', () => {
    expect(buildLangSwitchHref('/ru', 'en')).toBe('/en');
  });

  it('путь с подстраницей /ru/privacy → /uz/privacy', () => {
    expect(buildLangSwitchHref('/ru/privacy', 'uz')).toBe('/uz/privacy');
  });

  it('глубокий путь /en/foo/bar → /ru/foo/bar', () => {
    expect(buildLangSwitchHref('/en/foo/bar', 'ru')).toBe('/ru/foo/bar');
  });
});
