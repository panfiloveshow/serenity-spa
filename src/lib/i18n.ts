import type { Dictionary, Locale } from '@/types/i18n';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/types/i18n';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import('@/dictionaries/ru.json').then((m) => m.default),
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  uz: () => import('@/dictionaries/uz.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    return await dictionaries[locale]();
  } catch {
    return await dictionaries[DEFAULT_LOCALE]();
  }
}

/**
 * Get a translation value by dot-path with fallback to default locale dictionary.
 */
export function getTranslation(dict: Dictionary, fallback: Dictionary, path: string): string {
  const keys = path.split('.');
  let current: unknown = dict;
  let fallbackCurrent: unknown = fallback;

  for (const key of keys) {
    if (current != null && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      current = undefined;
    }
    if (fallbackCurrent != null && typeof fallbackCurrent === 'object') {
      fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[key];
    } else {
      fallbackCurrent = undefined;
    }
  }

  if (typeof current === 'string' && current.length > 0) return current;
  if (typeof fallbackCurrent === 'string') return fallbackCurrent;
  return path;
}

export { SUPPORTED_LOCALES, DEFAULT_LOCALE };
export type { Locale, Dictionary };
