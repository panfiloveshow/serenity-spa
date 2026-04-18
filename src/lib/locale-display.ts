import type { Locale } from '@/types/i18n';

/** Native names + flags for language UI (modal + switcher). */
export const LOCALE_DISPLAY: Record<Locale, { native: string; flag: string }> = {
  ru: { native: 'Русский', flag: '🇷🇺' },
  en: { native: 'English', flag: '🇬🇧' },
  uz: { native: 'Oʻzbekcha', flag: '🇺🇿' },
};
