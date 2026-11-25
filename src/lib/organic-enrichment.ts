import type { Dictionary, Locale } from '@/types/i18n';
import type { OrganicPageContent, OrganicPageSlug } from './organic-pages';
import { getBusinessStreet } from './business';
import { formatPrice } from './catalog';
import { getOrganicPriceRows as getPagePrices, getOrganicMetaTitle, getOrganicImageAlt, getOrganicIntro } from './organic-metadata';
import ru from '@/dictionaries/ru.json';
import en from '@/dictionaries/en.json';
import uz from '@/dictionaries/uz.json';

const dictionaries: Record<Locale, Dictionary> = { ru, en, uz };

export { getOrganicPriceRows as getPagePrices } from './organic-metadata';

const COPY = {
  ru: {
    locationTitle: 'Как пройти в спа и подтвердить запись',
    location:
      'Serenity Spa находится на 4-м этаже отеля Hilton Tashkent City по адресу ул. Укчи, 1. Вход — через центральное лобби отеля, парковка платная: 100 000 сум за 2 часа. Предварительная запись обязательна для всех гостей через форму сайта, WhatsApp, Telegram или по телефону; дождитесь подтверждения времени от администратора.',
    treatmentFaq: {
      question: 'Входят ли бассейн и сауны в стоимость отдельной процедуры?',
      answer:
        'Нет, при записи на отдельный массаж или уход доступ к бассейну и саунам оплачивается отдельно по дневному тарифу (600 000 сум в будни, 700 000 сум в выходные). Для проживающих в Hilton Tashkent City аквазона бесплатна.',
    },
    facilityFaq: {
      question: 'Что выдают на месте и какие карты принимаются к оплате?',
      answer:
        'Гостям предоставляются халат, полотенца и тапочки; для плавания возьмите купальник. Расчёт ведётся в сумах, принимаются карты Visa, Mastercard, Uzcard и Humo. Перед визитом дождитесь подтверждения бронирования.',
    },
  },
  en: {
    locationTitle: 'How to arrive and confirm your booking',
    location:
      'Serenity Spa is on the 4th floor of Hilton Tashkent City at Ukchi 1. Enter through the main hotel lobby; hotel parking costs 100,000 UZS for 2 hours. Advance booking is required for all visitors via the website form, WhatsApp, Telegram or phone, and appointments are valid once confirmed by reception.',
    treatmentFaq: {
      question: 'Are the pool and saunas included with an individual treatment?',
      answer:
        'No. Pool and sauna entry is separate from standalone massages or wraps and follows the standard day rate (600,000 UZS weekdays, 700,000 UZS weekends). In-house Hilton Tashkent City hotel guests receive complimentary wet-area access.',
    },
    facilityFaq: {
      question: 'What is provided on site and which payment cards are accepted?',
      answer:
        'Bathrobes, towels and slippers are provided at reception; bring swimwear for the pool and jacuzzi. Prices are settled in UZS with Visa, Mastercard, Uzcard or Humo cards after your time slot is confirmed.',
    },
  },
  uz: {
    locationTitle: 'Spaga kirish tartibi va yozilishni tasdiqlash',
    location:
      'Serenity Spa Hilton Tashkent City mehmonxonasining 4-qavatida (Ukchi 1) joylashgan. Mehmonxonaning asosiy kirishidan kiring; avtoturargoh 2 soat uchun 100 000 so‘m. Barcha mehmonlar sayt formasi, WhatsApp, Telegram yoki telefon orqali oldindan yozilishi va administrator tasdig‘ini kutishi zarur.',
    treatmentFaq: {
      question: 'Alohida muolaja narxiga basseyn va saunalar kiradimi?',
      answer:
        'Yo‘q, alohida massaj yoki o‘rash tanlanganda basseyn va saunalar standart kunlik tarif bo‘yicha qo‘shimcha to‘lanadi (ish kunlari 600 000 so‘m, dam olish kunlari 700 000 so‘m). Hilton mehmonlari uchun akvazona bepul.',
    },
    facilityFaq: {
      question: 'Joyida nimalar beriladi va qaysi bank kartalari qabul qilinadi?',
      answer:
        'Qabulxonada xalat, sochiq va shippak taqdim etiladi; suzish uchun cho‘milish kiyimini olib keling. To‘lov so‘mda Visa, Mastercard, Uzcard va Humo kartalari orqali qabul qilinadi.',
    },
  },
};

const RELATED: Record<OrganicPageSlug, OrganicPageSlug[]> = {
  'massage-tashkent': ['balinese-massage-tashkent', 'lymphatic-drainage-massage-tashkent', 'spa-packages-tashkent'],
  'balinese-massage-tashkent': ['massage-tashkent', 'lymphatic-drainage-massage-tashkent', 'couples-spa-tashkent'],
  'lymphatic-drainage-massage-tashkent': ['massage-tashkent', 'body-wrap-tashkent', 'pool-day-pass-tashkent'],
  'body-wrap-tashkent': ['massage-tashkent', 'spa-packages-tashkent', 'sauna-hammam-tashkent'],
  'couples-spa-tashkent': ['spa-packages-tashkent', 'gift-certificate-spa-tashkent', 'balinese-massage-tashkent'],
  'gift-certificate-spa-tashkent': ['couples-spa-tashkent', 'spa-packages-tashkent', 'balinese-massage-tashkent'],
  'spa-packages-tashkent': ['couples-spa-tashkent', 'body-wrap-tashkent', 'gift-certificate-spa-tashkent'],
  'pool-day-pass-tashkent': ['wellness-membership-tashkent', 'spa-with-pool-tashkent', 'sauna-hammam-tashkent'],
  'spa-with-pool-tashkent': ['pool-day-pass-tashkent', 'sauna-hammam-tashkent', 'wellness-membership-tashkent'],
  'sauna-hammam-tashkent': ['spa-with-pool-tashkent', 'body-wrap-tashkent', 'massage-tashkent'],
  'wellness-membership-tashkent': ['pool-day-pass-tashkent', 'spa-with-pool-tashkent', 'sauna-hammam-tashkent'],
};

const STANDALONE_TREATMENTS: OrganicPageSlug[] = [
  'massage-tashkent',
  'balinese-massage-tashkent',
  'lymphatic-drainage-massage-tashkent',
  'body-wrap-tashkent',
];

export function enrichOrganicPage(
  page: Omit<OrganicPageContent, 'priceRows' | 'relatedSlugs' | 'imageAlt'>,
  locale: Locale,
): OrganicPageContent {
  const c = COPY[locale];
  const priceRows = getPagePrices(page.slug, locale);
  const min = Math.min(...priceRows.map(row => row.price));
  const cost = `${formatPrice(min, locale)} ${locale === 'ru' ? 'сум' : locale === 'uz' ? 'so‘m' : 'UZS'}`;
  const isTreatment = STANDALONE_TREATMENTS.includes(page.slug);

  const sections = [
    ...page.sections.map((section, sectionIndex) => {
      if (page.slug === 'couples-spa-tashkent' && sectionIndex === 0) {
        return { ...section, bullets: dictionaries[locale].packages.items[3].includes };
      }
      return section;
    }),
    { title: c.locationTitle, body: c.location, bullets: [] },
  ];

  const fourthFaq = isTreatment ? c.treatmentFaq : c.facilityFaq;
  const faq = [...page.faq.slice(0, 3), fourthFaq];

  return {
    ...page,
    metaTitle: getOrganicMetaTitle(page.slug, locale, priceRows),
    ...getOrganicIntro(page.slug, locale, page.title, priceRows),
    priceRows,
    sections,
    imageAlt: getOrganicImageAlt(page.image, locale),
    facts: page.facts.map(f =>
      /Адрес|Address|Manzil|Локация|Location/.test(f.label)
        ? { ...f, value: getBusinessStreet(locale) }
        : /^(Цена|Price|Narx|Старт|Start|Boshlanish)$/.test(f.label)
          ? { ...f, value: locale === 'ru' ? `От ${cost}` : locale === 'en' ? `From ${cost}` : `${cost}dan` }
          : f,
    ),
    faq,
    relatedSlugs: RELATED[page.slug],
  };
}
