/**
 * Feature: multi-language-support, Property 7: Корректность метаданных по локали
 *
 * Для любой поддерживаемой локали, сгенерированные метаданные страницы должны содержать:
 * (a) title и description из словаря этой локали,
 * (b) alternates.languages с записями для всех трёх локалей,
 * (c) openGraph.locale равный корректному маппингу (ru_RU, en_US, uz_UZ),
 * (d) JSON-LD description из словаря этой локали.
 *
 * Validates: Requirements 7.1–7.5, 9.2
 */
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { SUPPORTED_LOCALES, OG_LOCALES } from '@/types/i18n';
import type { Locale } from '@/types/i18n';
import { getDictionary } from '@/lib/i18n';

// Mock next/font/google — layout.tsx calls Manrope() and Cormorant_Garamond() at module level
vi.mock('next/font/google', () => ({
  Manrope: () => ({ variable: '--font-sans' }),
  Cormorant_Garamond: () => ({ variable: '--font-serif' }),
}));

// Mock next/script to avoid JSX issues in test
vi.mock('next/script', () => ({ default: () => null }));

const { generateMetadata } = await import('@/app/[lang]/layout');

const BASE_URL = 'https://serenityspa.uz';

const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

describe('Property 7: Корректность метаданных по локали', () => {
  it('для любой локали metadata.title и metadata.description берутся из словаря этой локали', async () => {
    await fc.assert(
      fc.asyncProperty(localeArb, async (locale) => {
        const dict = await getDictionary(locale);
        const metadata = await generateMetadata({
          params: Promise.resolve({ lang: locale }),
        });

        expect(metadata.title).toBe(dict.metadata.title);
        expect(metadata.description).toBe(dict.metadata.description);
      }),
      { numRuns: 100 },
    );
  });

  it('для любой локали alternates.languages содержит записи для всех поддерживаемых локалей', async () => {
    await fc.assert(
      fc.asyncProperty(localeArb, async (locale) => {
        const metadata = await generateMetadata({
          params: Promise.resolve({ lang: locale }),
        });

        const languages = metadata.alternates?.languages as Record<string, string> | undefined;
        expect(languages).toBeDefined();

        for (const supportedLocale of SUPPORTED_LOCALES) {
          expect(languages![supportedLocale]).toBe(`${BASE_URL}/${supportedLocale}`);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('для любой локали openGraph.locale равен корректному OG-маппингу', async () => {
    await fc.assert(
      fc.asyncProperty(localeArb, async (locale) => {
        const metadata = await generateMetadata({
          params: Promise.resolve({ lang: locale }),
        });

        const ogLocale = (metadata.openGraph as { locale?: string })?.locale;
        expect(ogLocale).toBe(OG_LOCALES[locale]);
      }),
      { numRuns: 100 },
    );
  });

  it('для любой локали openGraph title и description берутся из словаря', async () => {
    await fc.assert(
      fc.asyncProperty(localeArb, async (locale) => {
        const dict = await getDictionary(locale);
        const metadata = await generateMetadata({
          params: Promise.resolve({ lang: locale }),
        });

        const og = metadata.openGraph as { title?: string; description?: string } | undefined;
        expect(og?.title).toBe(dict.metadata.ogTitle);
        expect(og?.description).toBe(dict.metadata.ogDescription);
      }),
      { numRuns: 100 },
    );
  });

  it('для любой локали alternates.canonical содержит текущую локаль', async () => {
    await fc.assert(
      fc.asyncProperty(localeArb, async (locale) => {
        const metadata = await generateMetadata({
          params: Promise.resolve({ lang: locale }),
        });

        expect(metadata.alternates?.canonical).toBe(`https://serenityspa.uz/${locale}`);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: multi-language-support, Property 8: OG-локаль маппинг
 *
 * Для любой поддерживаемой локали, маппинг OG_LOCALES[locale] должен возвращать
 * строку формата xx_XX, где xx — код языка, совпадающий с локалью.
 *
 * Validates: Requirements 9.2
 */
describe('Property 8: OG-локаль маппинг', () => {
  it('для любой локали OG_LOCALES[locale] возвращает строку формата xx_XX с корректным кодом языка', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const ogLocale = OG_LOCALES[locale];

        // Формат xx_XX
        expect(ogLocale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);

        // Код языка (до _) совпадает с локалью
        const langCode = ogLocale.split('_')[0];
        expect(langCode).toBe(locale);
      }),
      { numRuns: 100 },
    );
  });
});
