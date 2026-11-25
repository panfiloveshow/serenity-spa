import { MEMBERSHIP_TIERS, PACKAGES, SERVICES } from './constants';
import { getPackageOptions } from './package-options';
import type { Dictionary, Locale } from '@/types/i18n';

export interface PriceRow { name: string; duration: string; price: number; note?: string }
export const WEEKEND_DAY_PRICE = parsePrice(MEMBERSHIP_TIERS[0].priceNote ?? '700000');
export const PRICE_UPDATED = '2026-11-02';
export function parsePrice(value: string): number { return Number(value.replace(/\D/g, '')); }
export function formatPrice(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU').format(value).replace(/\u00a0/g, ' ');
}
export function serviceRows(dictionary: Dictionary, category = 0): PriceRow[] {
  return SERVICES[category].items.map((item, index) => ({
    name: dictionary.services.categories[category].items[index].name,
    duration: dictionary.services.categories[category].items[index].duration,
    price: parsePrice(item.price),
  }));
}
export function packageRows(dictionary: Dictionary): PriceRow[] {
  return PACKAGES.flatMap((item, index) => getPackageOptions(item, dictionary.packages.items[index].title, dictionary.packages).map(option => ({
    name: option.name,
    duration: dictionary.packages.items[index].duration,
    price: parsePrice(option.price),
  })));
}
export function membershipRows(dictionary: Dictionary): PriceRow[] {
  return MEMBERSHIP_TIERS.map((item, index) => ({
    name: dictionary.membership.tiers[index].name,
    duration: dictionary.membership.tiers[index].period,
    price: parsePrice(item.price),
    note: dictionary.membership.tiers[index].priceNote,
  }));
}
export function dayPassRows(dictionary: Dictionary, locale: Locale): PriceRow[] {
  const names = { ru: ['Будни', 'Выходные'], en: ['Weekdays', 'Weekends'], uz: ['Ish kunlari', 'Dam olish kunlari'] };
  return [
    { name: names[locale][0], duration: '07:00–23:00', price: parsePrice(MEMBERSHIP_TIERS[0].price) },
    { name: names[locale][1], duration: '07:00–23:00', price: WEEKEND_DAY_PRICE },
  ];
}

// A dated comparison only. Prices and settlement remain in UZS.
export const USD_REFERENCE = {
  uzsPerUsd: 11903.15,
  date: '2026-10-23',
  source: 'https://www.cbu.uz/ru/arkhiv-kursov-valyut/?INVERT=Y',
} as const;
export function approximateUsd(uzs: number): number { return Math.round(uzs / USD_REFERENCE.uzsPerUsd); }
