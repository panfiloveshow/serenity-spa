import type { Locale } from '@/types/i18n';

/**
 * Replaces only the [lang] segment in the current pathname.
 * E.g. "/ru/privacy" + "en" → "/en/privacy"
 */
export function buildLangSwitchHref(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/');
  if (segments.length >= 2) {
    segments[1] = targetLocale;
  }
  return segments.join('/');
}
