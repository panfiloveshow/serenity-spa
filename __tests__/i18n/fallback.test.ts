/**
 * Feature: multi-language-support, Property 2: Fallback на язык по умолчанию
 *
 * При отсутствии значения в словаре текущей локали getTranslation возвращает
 * значение из ru.json (язык по умолчанию).
 * Validates: Requirements 2.4
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getTranslation } from '@/lib/i18n';
import { SUPPORTED_LOCALES } from '@/types/i18n';
import type { Dictionary, Locale } from '@/types/i18n';

import ruDict from '@/dictionaries/ru.json';
import enDict from '@/dictionaries/en.json';
import uzDict from '@/dictionaries/uz.json';

const dictionaries: Record<Locale, Dictionary> = {
  ru: ruDict as unknown as Dictionary,
  en: enDict as unknown as Dictionary,
  uz: uzDict as unknown as Dictionary,
};

/**
 * Recursively collects all dot-paths that resolve to a string value.
 */
function collectStringPaths(obj: unknown, prefix = ''): string[] {
  if (obj === null || obj === undefined) return [];
  if (typeof obj === 'string') return [prefix];
  if (Array.isArray(obj)) return [];
  if (typeof obj === 'object') {
    const paths: string[] = [];
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      paths.push(...collectStringPaths((obj as Record<string, unknown>)[key], fullKey));
    }
    return paths;
  }
  return [];
}

/** All valid string dot-paths from the ru dictionary */
const allStringPaths = collectStringPaths(ruDict);
const stringPathArb = fc.constantFrom(...allStringPaths);
const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

/**
 * Deep-clone an object and set a value at a dot-path.
 */
function setAtPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
  const keys = path.split('.');
  let current: Record<string, unknown> = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

/**
 * Deep-clone an object and delete a key at a dot-path.
 */
function deleteAtPath(obj: Record<string, unknown>, path: string): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
  const keys = path.split('.');
  let current: Record<string, unknown> = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  delete current[keys[keys.length - 1]];
  return clone;
}

describe('Property 2: Fallback на язык по умолчанию', () => {
  it('при пустом значении в словаре текущей локали getTranslation возвращает значение из ru.json', () => {
    fc.assert(
      fc.property(localeArb, stringPathArb, (locale, path) => {
        const fallback = dictionaries.ru;
        // Create a modified dictionary where the target path has an empty string
        const modified = setAtPath(
          dictionaries[locale] as unknown as Record<string, unknown>,
          path,
          '',
        ) as unknown as Dictionary;

        const result = getTranslation(modified, fallback, path);
        const expected = getTranslation(fallback, fallback, path);

        expect(result).toBe(expected);
      }),
      { numRuns: 200 },
    );
  });

  it('при отсутствующем ключе в словаре текущей локали getTranslation возвращает значение из ru.json', () => {
    fc.assert(
      fc.property(localeArb, stringPathArb, (locale, path) => {
        const fallback = dictionaries.ru;
        // Create a modified dictionary where the target key is deleted
        const modified = deleteAtPath(
          dictionaries[locale] as unknown as Record<string, unknown>,
          path,
        ) as unknown as Dictionary;

        const result = getTranslation(modified, fallback, path);
        const expected = getTranslation(fallback, fallback, path);

        expect(result).toBe(expected);
      }),
      { numRuns: 200 },
    );
  });

  it('при наличии значения в словаре текущей локали getTranslation возвращает его, а не fallback', () => {
    fc.assert(
      fc.property(localeArb, stringPathArb, (locale, path) => {
        const dict = dictionaries[locale];
        const fallback = dictionaries.ru;

        const result = getTranslation(dict, fallback, path);
        // The value should be a non-empty string from the current locale's dictionary
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);

        // Verify it matches the actual value in the current locale's dict
        const keys = path.split('.');
        let current: unknown = dict;
        for (const key of keys) {
          current = (current as Record<string, unknown>)[key];
        }
        expect(result).toBe(current);
      }),
      { numRuns: 200 },
    );
  });

  it('для несуществующего пути getTranslation возвращает сам путь как последний fallback', () => {
    const fakePath = 'nonexistent.deeply.nested.key';
    for (const locale of SUPPORTED_LOCALES) {
      const result = getTranslation(dictionaries[locale], dictionaries.ru, fakePath);
      expect(result).toBe(fakePath);
    }
  });
});
