/**
 * Feature: multi-language-support, Property 6: Компоненты используют строки словаря текущей локали
 *
 * Все строковые значения словаря непусты для каждой локали.
 * Validates: Requirements 4.1–4.6, 5.1, 5.2, 6.1–6.3, 8.1, 8.2, 9.1
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SUPPORTED_LOCALES } from '@/types/i18n';
import type { Locale } from '@/types/i18n';

import ruDict from '@/dictionaries/ru.json';
import enDict from '@/dictionaries/en.json';
import uzDict from '@/dictionaries/uz.json';

const dictionaries: Record<Locale, Record<string, unknown>> = {
  ru: ruDict,
  en: enDict,
  uz: uzDict,
};

/**
 * Recursively collects all string values from a nested object,
 * returning them as [dotPath, value] pairs.
 */
function collectStringEntries(obj: unknown, prefix = ''): [string, string][] {
  const entries: [string, string][] = [];

  if (obj === null || obj === undefined) return entries;

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const itemPrefix = `${prefix}[${index}]`;
      if (typeof item === 'string') {
        entries.push([itemPrefix, item]);
      } else if (typeof item === 'object' && item !== null) {
        entries.push(...collectStringEntries(item, itemPrefix));
      }
    });
    return entries;
  }

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = (obj as Record<string, unknown>)[key];
      if (typeof value === 'string') {
        entries.push([fullKey, value]);
      } else if (typeof value === 'object' && value !== null) {
        entries.push(...collectStringEntries(value, fullKey));
      }
    }
  }

  return entries;
}

const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

describe('Property 6: Компоненты используют строки словаря текущей локали', () => {
  /**
   * Service items may have an intentionally empty `desc` when a duration
   * variant shares the description with another variant (e.g. 90-min
   * version of the same massage). These paths are excluded from the
   * non-empty check.
   */
  const ALLOWED_EMPTY_PATTERN = /^services\.categories\[\d+\]\.items\[\d+\]\.desc$/;

  it('все строковые значения словаря непусты для любой локали', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const entries = collectStringEntries(dictionaries[locale]);

        for (const [path, value] of entries) {
          if (ALLOWED_EMPTY_PATTERN.test(path)) continue;
          expect(value.trim(), `Empty string at "${path}" in ${locale} dictionary`).not.toBe('');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('каждая локаль содержит хотя бы одну строку в каждой секции верхнего уровня', () => {
    const topLevelSections = Object.keys(ruDict);

    for (const locale of SUPPORTED_LOCALES) {
      const dict = dictionaries[locale] as Record<string, unknown>;
      for (const section of topLevelSections) {
        const entries = collectStringEntries(dict[section], section);
        expect(
          entries.length,
          `Section "${section}" in ${locale} has no string entries`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('массивы months и days в booking содержат непустые строки для любой локали', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const dict = dictionaries[locale] as Record<string, unknown>;
        const booking = dict.booking as Record<string, unknown>;
        const months = booking.months as string[];
        const days = booking.days as string[];

        expect(months.length).toBe(12);
        expect(days.length).toBe(7);

        for (const m of months) {
          expect(m.trim()).not.toBe('');
        }
        for (const d of days) {
          expect(d.trim()).not.toBe('');
        }
      }),
      { numRuns: 100 },
    );
  });
});
