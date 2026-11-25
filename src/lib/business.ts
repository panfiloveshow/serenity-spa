import type { Locale } from '@/types/i18n';

export const SITE_URL = 'https://serenityspa.uz';
export const BUSINESS_NAME = 'Serenity Spa';
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const CONTENT_UPDATED = '2026-11-14';

// Contact details and visitor conditions confirmed by the spa on 2026-11-04.
export const BUSINESS_CONTACT = {
  phone: '+998712108895',
  phoneDisplay: '+998 71 210 88 95',
  whatsapp: '+998949401035',
  whatsappDisplay: '+998 94 940 10 35',
  whatsappUrl: 'https://wa.me/998949401035',
  email: 'spa@hilton-tashkent.com',
  streetAddress: 'Укчи 1, Hilton Tashkent City, 4-й этаж',
  streetAddressLatin: 'Ukchi 1, Hilton Tashkent City, 4th floor',
  streetAddressUz: 'Ukchi 1, Hilton Tashkent City, 4-qavat',
  acceptedCards: ['Visa', 'Mastercard', 'Uzcard', 'Humo'],
  parkingPrice: 100000,
  parkingHours: 2,
  postalCode: '100027',
  localityRu: 'Ташкент', localityEn: 'Tashkent', localityUz: 'Toshkent', country: 'UZ',
  latitude: 41.313838, longitude: 69.2491139,
  opens: '07:00', closes: '23:00',
  hotelName: 'Hilton Tashkent City',
  hotelUrl: 'https://www.hilton.com/en/hotels/tastchi-hilton-tashkent-city/',
  mapUrl: 'https://maps.app.goo.gl/pmC2QsJ5B4s7aLcx7',
  twoGisUrl: 'https://2gis.uz/tashkent/firm/70000001046378221',
  yandexUrl: 'https://yandex.uz/maps/-/CXraaJZ1',
  instagramUrl: 'https://www.instagram.com/serenityspa_tashkent',
  telegramUrl: 'https://t.me/Serenity_Spa',
  facebookUrl: 'https://www.facebook.com/serenityspahiltontashkent',
  tripadvisorUrl: 'https://www.tripadvisor.com/Attraction_Review-g293968-d21200709-Reviews-Serenity_Spa-Tashkent_Tashkent_Province.html',
} as const;

export function getBusinessStreet(locale: Locale) {
  return locale === 'ru' ? BUSINESS_CONTACT.streetAddress
    : locale === 'uz' ? BUSINESS_CONTACT.streetAddressUz : BUSINESS_CONTACT.streetAddressLatin;
}

export function getBusinessLocality(locale: Locale) {
  return locale === 'en' ? BUSINESS_CONTACT.localityEn
    : locale === 'uz' ? BUSINESS_CONTACT.localityUz : BUSINESS_CONTACT.localityRu;
}
