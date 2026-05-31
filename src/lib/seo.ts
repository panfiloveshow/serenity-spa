import type { Locale } from '@/types/i18n';

export const SITE_URL = 'https://serenityspa.uz';
export const BUSINESS_NAME = 'Serenity Spa';
export const BUSINESS_ID = `${SITE_URL}/#business`;

export const BUSINESS_CONTACT = {
  phone: '+998712108895',
  phoneDisplay: '+998 71 210 88 95',
  email: 'info@serenity-spa.uz',
  streetAddress: 'Укчи 1',
  postalCode: '100027',
  localityRu: 'Ташкент',
  localityEn: 'Tashkent',
  country: 'UZ',
  latitude: 41.311081,
  longitude: 69.279737,
  opens: '07:00',
  closes: '23:00',
  mapUrl: 'https://www.openstreetmap.org/?mlat=41.311081&mlon=69.279737#map=17/41.311081/69.279737',
  instagramUrl: 'https://www.instagram.com/serenityspa_tashkent',
  telegramUrl: 'https://t.me/Serenity_Spa',
} as const;

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
    title: 'Serenity Spa в Ташкенте: бассейн, сауны, массажи и SPA программы',
    eyebrow: 'Коротко для выбора',
    heading: 'Serenity Spa — спа и оздоровительный центр в Ташкенте',
    intro:
      'Serenity Spa находится в Ташкенте по адресу Укчи 1 и работает ежедневно с 07:00 до 23:00. В центре доступны бассейн, тренажёрный зал, финская и паровая сауны, джакузи, массажи, уходы за телом, SPA программы и клубные абонементы.',
    facts: [
      { label: 'Адрес', value: 'Укчи 1, 100027, Ташкент' },
      { label: 'График', value: 'Ежедневно 07:00–23:00' },
      { label: 'Инфраструктура', value: 'Бассейн, сауны, джакузи, тренажёрный зал' },
      { label: 'Запись', value: '+998 71 210 88 95' },
    ],
    faqs: [
      {
        question: 'Где находится Serenity Spa в Ташкенте?',
        answer:
          'Serenity Spa расположен по адресу Укчи 1, 100027, Ташкент. Центр находится в городской зоне с удобным доступом к бассейну, саунам, массажным кабинетам и SPA программам.',
      },
      {
        question: 'Какие услуги доступны в Serenity Spa?',
        answer:
          'В Serenity Spa доступны массажи, уходы за телом, пилинги, обёртывания, SPA программы, бассейн, тренажёрный зал, финская и паровая сауны, джакузи и клубные абонементы.',
      },
      {
        question: 'Есть ли в Serenity Spa бассейн и сауны?',
        answer:
          'Да. В инфраструктуру Serenity Spa входят бассейн, финская сауна, паровая сауна, джакузи и тренажёрный зал. Разовое посещение и абонементы включают доступ к основной wellness-зоне.',
      },
      {
        question: 'Сколько стоит посещение Serenity Spa?',
        answer:
          'Разовое посещение в будние дни стоит 600 000 UZS, в выходные — 700 000 UZS. Также доступны абонементы, SPA пакеты и авторские массажи с разной продолжительностью и стоимостью.',
      },
      {
        question: 'Как записаться в Serenity Spa?',
        answer:
          'Записаться можно через форму на сайте или по телефону +998 71 210 88 95. Администратор свяжется с вами для подтверждения даты, времени и выбранной услуги.',
      },
    ],
  },
  en: {
    languageTag: 'en',
    title: 'Serenity Spa in Tashkent: pool, saunas, massages and spa programs',
    eyebrow: 'Quick answers',
    heading: 'Serenity Spa is a wellness and spa center in Tashkent',
    intro:
      'Serenity Spa is located at Ukchi 1 in Tashkent and is open daily from 07:00 to 23:00. The center offers a pool, fitness center, Finnish and steam saunas, jacuzzi, massages, body treatments, spa programs and memberships.',
    facts: [
      { label: 'Address', value: 'Ukchi 1, 100027, Tashkent' },
      { label: 'Hours', value: 'Daily 07:00–23:00' },
      { label: 'Facilities', value: 'Pool, saunas, jacuzzi, fitness center' },
      { label: 'Booking', value: '+998 71 210 88 95' },
    ],
    faqs: [
      {
        question: 'Where is Serenity Spa located in Tashkent?',
        answer:
          'Serenity Spa is located at Ukchi 1, 100027, Tashkent. The wellness center provides access to a pool, saunas, massage rooms and spa programs.',
      },
      {
        question: 'What services does Serenity Spa offer?',
        answer:
          'Serenity Spa offers massages, body treatments, peels, wraps, spa programs, a swimming pool, fitness center, Finnish and steam saunas, jacuzzi and memberships.',
      },
      {
        question: 'Does Serenity Spa have a pool and saunas?',
        answer:
          'Yes. Serenity Spa includes a swimming pool, Finnish sauna, steam sauna, jacuzzi and fitness center. Day visits and memberships include access to the main wellness zone.',
      },
      {
        question: 'How much does a Serenity Spa visit cost?',
        answer:
          'A weekday day visit costs 600,000 UZS, while weekend access costs 700,000 UZS. Memberships, spa packages and signature massages are also available.',
      },
      {
        question: 'How can I book Serenity Spa?',
        answer:
          'You can book through the website form or by calling +998 71 210 88 95. The administrator will confirm the date, time and selected service.',
      },
    ],
  },
  uz: {
    languageTag: 'uz-UZ',
    title: 'Toshkentdagi Serenity Spa: basseyn, saunalar, massaj va spa dasturlar',
    eyebrow: 'Qisqa javoblar',
    heading: 'Serenity Spa — Toshkentdagi spa va sog‘lomlashtirish markazi',
    intro:
      'Serenity Spa Toshkent shahrida, Ukchi 1 manzilida joylashgan va har kuni 07:00 dan 23:00 gacha ishlaydi. Markazda basseyn, sport zali, fin va bug‘ saunalari, jakuzi, massajlar, tana parvarishi, spa dasturlar va abonementlar mavjud.',
    facts: [
      { label: 'Manzil', value: 'Ukchi 1, 100027, Toshkent' },
      { label: 'Ish vaqti', value: 'Har kuni 07:00–23:00' },
      { label: 'Infratuzilma', value: 'Basseyn, saunalar, jakuzi, sport zali' },
      { label: 'Yozilish', value: '+998 71 210 88 95' },
    ],
    faqs: [
      {
        question: 'Serenity Spa Toshkentda qayerda joylashgan?',
        answer:
          'Serenity Spa Toshkent shahrida, Ukchi 1, 100027 manzilida joylashgan. Markazda basseyn, saunalar, massaj xonalari va spa dasturlar mavjud.',
      },
      {
        question: 'Serenity Spa qanday xizmatlarni taklif qiladi?',
        answer:
          'Serenity Spa massajlar, tana parvarishi, pilinglar, o‘rashlar, spa dasturlar, basseyn, sport zali, fin va bug‘ saunalari, jakuzi va abonementlarni taklif qiladi.',
      },
      {
        question: 'Serenity Spa’da basseyn va saunalar bormi?',
        answer:
          'Ha. Serenity Spa infratuzilmasiga basseyn, fin saunasi, bug‘ saunasi, jakuzi va sport zali kiradi. Bir martalik tashrif va abonementlar asosiy wellness hududiga kirishni o‘z ichiga oladi.',
      },
      {
        question: 'Serenity Spa tashrifi qancha turadi?',
        answer:
          'Ish kunlari bir martalik tashrif 600 000 UZS, dam olish kunlari 700 000 UZS. Shuningdek abonementlar, spa paketlar va mualliflik massajlari mavjud.',
      },
      {
        question: 'Serenity Spa’ga qanday yozilish mumkin?',
        answer:
          'Saytdagi forma orqali yoki +998 71 210 88 95 telefon raqamiga qo‘ng‘iroq qilib yozilish mumkin. Administrator sana, vaqt va xizmatni tasdiqlaydi.',
      },
    ],
  },
};

export function getSeoContent(locale: Locale) {
  return SEO_CONTENT[locale] ?? SEO_CONTENT.ru;
}
