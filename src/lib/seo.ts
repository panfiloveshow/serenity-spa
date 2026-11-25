import type { Locale } from '@/types/i18n';

import { getBusinessStreet, getBusinessLocality } from './business';
export { SITE_URL, BUSINESS_NAME, BUSINESS_ID, BUSINESS_CONTACT, CONTENT_UPDATED } from './business';

export const SEO_KEYWORDS = [
  'спа Ташкент',
  'spa Tashkent',
  'спа центр Ташкент',
  'оздоровительный центр Ташкент',
  'массаж Ташкент',
  'балийский массаж Ташкент',
  'сауна Ташкент',
  'хаммам Ташкент',
  'бассейн Ташкент',
  'спа с бассейном Ташкент',
  'джакузи Ташкент',
  'абонемент бассейн Ташкент',
  'spa packages Tashkent',
  'massage center Tashkent',
  'wellness center Tashkent',
  'Toshkent spa',
  'Toshkent massaj',
  'Toshkent basseyn',
] as const;

export const SEO_CONTENT: Record<Locale, {
  languageTag: string;
  title: string;
  eyebrow: string;
  heading: string;
  intro: string;
  facts: Array<{ label: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
}> = {
  ru: {
    languageTag: 'ru-UZ',
    title: "Serenity Spa в Hilton Tashkent City — спа с бассейном",
    eyebrow: 'Коротко для выбора',
    heading: "Коротко о визите в Serenity Spa в Hilton Tashkent City",
    intro:
      "Serenity Spa находится на 4-м этаже Hilton Tashkent City (ул. Укчи, 1). Вход через главный вход отеля. Для всех гостей требуется предварительная запись.",
    facts: [
      { label: 'Адрес', value: "Укчи 1, Hilton Tashkent City, 4-й этаж, 100027, Ташкент" },
      { label: 'График', value: 'Ежедневно 07:00–23:00' },
      { label: 'Инфраструктура', value: 'Бассейн, сауны, джакузи, тренажёрный зал' },
      { label: 'Запись', value: '+998 71 210 88 95' },
    ],
    faqs: [
      {
        question: 'Где находится Serenity Spa в Ташкенте?',
        answer:
          "Serenity Spa находится на 4-м этаже Hilton Tashkent City (ул. Укчи, 1). Вход через главный вход отеля. Для всех гостей требуется предварительная запись.",
      },
      {
        question: 'Какие услуги доступны в Serenity Spa?',
        answer:
          'В Serenity Spa доступны массажи, уходы за телом, пилинги, обёртывания, SPA программы, бассейн, тренажёрный зал, финская и паровая сауны, джакузи и клубные абонементы.',
      },
      {
        question: 'Есть ли в Serenity Spa бассейн и сауны?',
        answer:
          'Да. Бассейн, джакузи, финская и паровая сауны, тренажёрный зал работают с 07:00 до 23:00. Для проживающих в Hilton Tashkent City они бесплатны. Для всех гостей требуется предварительная запись. Бассейн и сауны не входят в стоимость отдельных массажей и процедур и оплачиваются по стандартному тарифу.',
      },
      {
        question: 'Сколько стоит посещение Serenity Spa?',
        answer:
          'Разовое посещение стоит 600 000 сум в будни и 700 000 сум в выходные. Балийский массаж — 1 000 000 сум за 60 минут или 1 300 000 сум за 90 минут. Лимфодренаж 90 минут — 1 350 000 сум. Обёртывание 60 минут — 850 000 сум. Принимаются Visa, Mastercard, Uzcard и Humo.',
      },
      {
        question: 'Как записаться в Serenity Spa?',
        answer:
          'Запись — через форму сайта, WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa, spa@hilton-tashkent.com или по телефону +998 71 210 88 95. Для всех гостей требуется предварительная запись; администратор подтверждает дату, время и услугу.',
      },
      { question: "Есть ли парковка для гостей SPA?", answer: "Парковка платная: 100 000 сум за 2 часа. Вход в Serenity Spa — через главный вход Hilton Tashkent City, SPA находится на 4-м этаже." },
      { question: "Предоставляются ли полотенца и халаты?", answer: "Для посещения предоставляются полотенца, халаты и тапочки. Правила для детей, санитарные часы и индивидуальные ограничения уточняйте у сотрудников SPA." },
    ],
  },
  en: {
    languageTag: 'en',
    title: "Serenity Spa at Hilton Tashkent City — Spa & Pool",
    eyebrow: 'Quick answers',
    heading: "Visiting Serenity Spa at Hilton Tashkent City: Key Facts",
    intro:
      "Serenity Spa is on the 4th floor of Hilton Tashkent City (Ukchi 1). Enter through the main hotel entrance. Advance booking is required for all guests.",
    facts: [
      { label: 'Address', value: "Ukchi 1, Hilton Tashkent City, 4th floor, 100027, Tashkent" },
      { label: 'Hours', value: 'Daily 07:00–23:00' },
      { label: 'Facilities', value: 'Pool, saunas, jacuzzi, fitness center' },
      { label: 'Booking', value: '+998 71 210 88 95' },
    ],
    faqs: [
      {
        question: 'Where is Serenity Spa located in Tashkent?',
        answer:
          "Serenity Spa is on the 4th floor of Hilton Tashkent City (Ukchi 1). Enter through the main hotel entrance. Advance booking is required for all guests.",
      },
      {
        question: 'What services does Serenity Spa offer?',
        answer:
          'Serenity Spa offers massages, body treatments, peels, wraps, spa programs, a swimming pool, fitness center, Finnish and steam saunas, jacuzzi and memberships.',
      },
      {
        question: 'Does Serenity Spa have a pool and saunas?',
        answer:
          'Yes. The pool, jacuzzi, Finnish and steam saunas and fitness center are open 07:00–23:00 and are complimentary for guests staying at Hilton Tashkent City. Advance booking is required for all guests. Pool and sauna access is not included in individual massages or treatments and is charged at the standard day-pass rate.',
      },
      {
        question: 'How much does a Serenity Spa visit cost?',
        answer:
          'A day pass costs 600,000 UZS on weekdays or 700,000 UZS on weekends. Balinese massage costs 1,000,000 UZS for 60 minutes or 1,300,000 UZS for 90 minutes. Lymphatic drainage massage is 1,350,000 UZS for 90 minutes; a 60-minute body wrap is 850,000 UZS. Visa, Mastercard, Uzcard and Humo are accepted.',
      },
      {
        question: 'How can I book Serenity Spa?',
        answer:
          'Book through the website form, WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa, spa@hilton-tashkent.com or by calling +998 71 210 88 95. All guests must book in advance; the administrator confirms the date, time and service.',
      },
      { question: "Is parking available for spa visitors?", answer: "Parking is paid: 100,000 UZS for 2 hours. Enter through the main entrance of Hilton Tashkent City; the spa is on the 4th floor." },
      { question: "Are towels and bathrobes provided?", answer: "Towels, bathrobes and slippers are provided. Ask the spa team about children’s rules, maintenance periods and individual restrictions." },
    ],
  },
  uz: {
    languageTag: 'uz-UZ',
    title: "Serenity Spa — Hilton Tashkent City spa markazi",
    eyebrow: 'Qisqa javoblar',
    heading: "Hilton Tashkent City’dagi Serenity Spa: tashrif haqida qisqacha",
    intro:
      "Serenity Spa Hilton Tashkent City mehmonxonasining 4-qavatida (Ukchi 1) joylashgan. Asosiy kirishdan kiring. Barcha mehmonlar oldindan yozilishi kerak.",
    facts: [
      { label: 'Manzil', value: "Ukchi 1, Hilton Tashkent City, 4-qavat, 100027, Toshkent" },
      { label: 'Ish vaqti', value: 'Har kuni 07:00–23:00' },
      { label: 'Infratuzilma', value: 'Basseyn, saunalar, jakuzi, sport zali' },
      { label: 'Yozilish', value: '+998 71 210 88 95' },
    ],
    faqs: [
      {
        question: 'Serenity Spa Toshkentda qayerda joylashgan?',
        answer:
          "Serenity Spa Hilton Tashkent City mehmonxonasining 4-qavatida (Ukchi 1) joylashgan. Asosiy kirishdan kiring. Barcha mehmonlar oldindan yozilishi kerak.",
      },
      {
        question: 'Serenity Spa qanday xizmatlarni taklif qiladi?',
        answer:
          'Serenity Spa massajlar, tana parvarishi, pilinglar, o‘rashlar, spa dasturlar, basseyn, sport zali, fin va bug‘ saunalari, jakuzi va abonementlarni taklif qiladi.',
      },
      {
        question: 'Serenity Spa’da basseyn va saunalar bormi?',
        answer:
          'Ha. Basseyn, jakuzi, fin va bug‘ saunalari hamda sport zali 07:00–23:00 ishlaydi; Hilton Tashkent City mehmonlari uchun ular bepul. Barcha mehmonlar oldindan yozilishi kerak. Basseyn va sauna alohida massaj va muolajalar narxiga kirmaydi va standart tashrif tarifi bo‘yicha alohida to‘lanadi.',
      },
      {
        question: 'Serenity Spa tashrifi qancha turadi?',
        answer:
          'Bir martalik tashrif ish kunlari 600 000 so‘m, dam olish kunlari 700 000 so‘m. Bali massaji 60 daqiqa uchun 1 000 000 so‘m, 90 daqiqa uchun 1 300 000 so‘m. Limfodrenaj massaji 90 daqiqa uchun 1 350 000 so‘m; 60 daqiqalik o‘rash 850 000 so‘m. Visa, Mastercard, Uzcard va Humo qabul qilinadi.',
      },
      {
        question: 'Serenity Spa’ga qanday yozilish mumkin?',
        answer:
          'Saytdagi forma, WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa, spa@hilton-tashkent.com yoki +998 71 210 88 95 orqali yoziling. Barcha mehmonlar oldindan yozilishi kerak; administrator sana, vaqt va xizmatni tasdiqlaydi.',
      },
      { question: "Spa mehmonlari uchun turargoh bormi?", answer: "Turargoh pullik: 2 soat uchun 100 000 so‘m. Hilton Tashkent City asosiy kirishidan kiring; spa 4-qavatda joylashgan." },
      { question: "Sochiq va xalat beriladimi?", answer: "Sochiq, xalat va shippak beriladi. Bolalar qoidalari, sanitariya vaqti va individual cheklovlarni spa xodimlaridan aniqlang." },
    ],
  },
};

export function getSeoContent(locale: Locale) {
  return SEO_CONTENT[locale] ?? SEO_CONTENT.ru;
}

/** Street name — Cyrillic for RU, Latin transliteration for EN/UZ. */
export function getStreet(locale: Locale) {
  return getBusinessStreet(locale);
}

/** City name in the reader's language. */
export function getLocality(locale: Locale) {
  return getBusinessLocality(locale);
}
