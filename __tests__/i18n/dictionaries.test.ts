/**
 * Feature: multi-language-support, Property 1: Структурная эквивалентность словарей
 *
 * Для любых двух локалей множество ключей на всех уровнях вложенности идентично.
 * Validates: Requirements 2.2, 2.3
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
 * Recursively collects all key paths from a nested object.
 * Arrays are traversed by index, objects by key.
 * Returns a sorted set of dot-separated paths.
 */
function collectKeyPaths(obj: unknown, prefix = ''): string[] {
  if (obj === null || obj === undefined) return [];

  if (Array.isArray(obj)) {
    const paths: string[] = [`${prefix}[]`];
    // Check structure of first element as representative (all elements should share shape)
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      for (const key of Object.keys(obj[0] as Record<string, unknown>)) {
        const childPaths = collectKeyPaths(
          (obj[0] as Record<string, unknown>)[key],
          `${prefix}[].${key}`,
        );
        paths.push(...childPaths);
      }
    }
    return paths;
  }

  if (typeof obj === 'object') {
    const paths: string[] = [];
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = (obj as Record<string, unknown>)[key];
      if (typeof value === 'object' && value !== null) {
        paths.push(fullKey, ...collectKeyPaths(value, fullKey));
      } else {
        paths.push(fullKey);
      }
    }
    return paths;
  }

  return [];
}

const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

describe('Property 1: Структурная эквивалентность словарей', () => {
  it('для любых двух локалей множество ключей идентично', () => {
    fc.assert(
      fc.property(localeArb, localeArb, (localeA, localeB) => {
        const keysA = collectKeyPaths(dictionaries[localeA]).sort();
        const keysB = collectKeyPaths(dictionaries[localeB]).sort();

        expect(keysA).toEqual(keysB);
      }),
      { numRuns: 100 },
    );
  });

  it('все локали имеют одинаковое количество ключей на верхнем уровне', () => {
    const topLevelKeys = SUPPORTED_LOCALES.map(
      (locale) => Object.keys(dictionaries[locale]).sort(),
    );
    for (let i = 1; i < topLevelKeys.length; i++) {
      expect(topLevelKeys[i]).toEqual(topLevelKeys[0]);
    }
  });
});
