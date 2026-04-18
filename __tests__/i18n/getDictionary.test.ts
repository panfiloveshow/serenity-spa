/**
 * Feature: multi-language-support, Property 4: getDictionary возвращает данные корректной локали
 *
 * Для любой локали `getDictionary(locale)` возвращает данные именно этой локали.
 * Validates: Requirements 1.3
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SUPPORTED_LOCALES } from '@/types/i18n';
import type { Locale } from '@/types/i18n';
import { getDictionary } from '@/lib/i18n';

import ruDict from '@/dictionaries/ru.json';
import enDict from '@/dictionaries/en.json';
import uzDict from '@/dictionaries/uz.json';

const expectedDictionaries: Record<Locale, Record<string, unknown>> = {
  ru: ruDict,
  en: enDict,
  uz: uzDict,
};

const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

describe('Property 4: getDictionary возвращает данные корректной локали', () => {
  it('для любой локали getDictionary возвращает metadata.title и metadata.description этой локали', async () => {
    await fc.assert(
      fc.asyncProperty(localeArb, async (locale) => {
        const dict = await getDictionary(locale);
        const expected = expectedDictionaries[locale] as { metadata: { title: string; description: string } };

        expect(dict.metadata.title).toBe(expected.metadata.title);
        expect(dict.metadata.description).toBe(expected.metadata.description);
      }),
      { numRuns: 100 },
    );
  });

  it('для любой локали getDictionary возвращает данные, отличные от других локалей', async () => {
    await fc.assert(
      fc.asyncProperty(localeArb, async (locale) => {
        const dict = await getDictionary(locale);
        const otherLocales = SUPPORTED_LOCALES.filter((l) => l !== locale);

        for (const other of otherLocales) {
          const otherExpected = expectedDictionaries[other] as { metadata: { title: string } };
          expect(dict.metadata.title).not.toBe(otherExpected.metadata.title);
        }
      }),
      { numRuns: 100 },
    );
  });
});
