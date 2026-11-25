import type { Locale } from '@/types/i18n';
import type { OrganicPageSlug } from './organic-pages';
import { MEMBERSHIP_TIERS } from './constants';
import { dayPassRows, formatPrice, membershipRows, packageRows, parsePrice, serviceRows, type PriceRow } from './catalog';
import ru from '@/dictionaries/ru.json';
import en from '@/dictionaries/en.json';
import uz from '@/dictionaries/uz.json';

const dictionaries = { ru, en, uz };

/** The visible price table, title and Service offers share these catalog rows. */
export function getOrganicPriceRows(slug: OrganicPageSlug, locale: Locale): PriceRow[] {
  const d = dictionaries[locale];
  switch (slug) {
    case 'balinese-massage-tashkent': return serviceRows(d).slice(0, 2);
    case 'lymphatic-drainage-massage-tashkent': return [serviceRows(d)[5]];
    case 'massage-tashkent': return serviceRows(d);
    case 'body-wrap-tashkent': return serviceRows(d, 1).slice(0, 4);
    case 'spa-packages-tashkent': return packageRows(d);
    case 'couples-spa-tashkent': return packageRows(d).filter(row => row.name === d.packages.items[3].title);
    // These are service-price examples, not unconfirmed certificate denominations.
    case 'gift-certificate-spa-tashkent': return [serviceRows(d)[9], packageRows(d)[0], ...packageRows(d).filter(row => row.name === d.packages.items[3].title)];
    case 'wellness-membership-tashkent': {
      const rows = membershipRows(d).slice(1);
      const kids = rows[rows.length - 1];
      const periods = { ru: 'мес.', en: 'months', uz: 'oy' };
      const otherKidsTerms = MEMBERSHIP_TIERS.find(tier => tier.id === 'kids')!.priceNote!.split('·').map(term => {
        const [duration, price] = term.split(':');
        return { name: kids.name, duration: `${parsePrice(duration)} ${periods[locale]}`, price: parsePrice(price) };
      });
      return [...rows, ...otherKidsTerms];
    }
    default: return dayPassRows(d, locale);
  }
}

const TITLES: Record<OrganicPageSlug, Record<Locale, string>> = {
  'massage-tashkent': { ru: 'Массаж в Ташкенте в Hilton', en: 'Massage in Tashkent at Hilton', uz: 'Hilton Toshkentda massaj' },
  'balinese-massage-tashkent': { ru: 'Балийский массаж в Ташкенте · Hilton', en: 'Balinese massage at Hilton Tashkent', uz: 'Hilton Toshkentda Bali massaji' },
  'lymphatic-drainage-massage-tashkent': { ru: 'Лимфодренажный массаж в Hilton', en: 'Lymphatic drainage at Hilton Tashkent', uz: 'Hilton Toshkentda limfodrenaj' },
  'couples-spa-tashkent': { ru: 'Спа для двоих в Ташкенте · Hilton', en: 'Couples spa at Hilton Tashkent', uz: 'Hilton Toshkentda ikki kishilik spa' },
  'gift-certificate-spa-tashkent': { ru: 'Спа-сертификат Hilton', en: 'Spa gift certificate at Hilton', uz: 'Hilton spa sovg‘a sertifikati' },
  'body-wrap-tashkent': { ru: 'Обёртывания в Ташкенте · Hilton', en: 'Body wraps at Hilton Tashkent', uz: 'Hilton Toshkentda tana o‘rash' },
  'pool-day-pass-tashkent': { ru: 'Бассейн на день в Ташкенте · Hilton', en: 'Pool day pass at Hilton Tashkent', uz: 'Hilton Toshkentda kunlik basseyn' },
  'spa-with-pool-tashkent': { ru: 'Спа с бассейном в Ташкенте · Hilton', en: 'Spa with pool at Hilton Tashkent', uz: 'Hilton Toshkentda basseynli spa' },
  'sauna-hammam-tashkent': { ru: 'Хаммам и сауна в Ташкенте · Hilton', en: 'Sauna and hammam at Hilton Tashkent', uz: 'Hilton Toshkentda sauna va hammom' },
  'spa-packages-tashkent': { ru: 'Спа-программы в Ташкенте · Hilton', en: 'Spa packages at Hilton Tashkent', uz: 'Hilton Toshkentda spa dasturlari' },
  'wellness-membership-tashkent': { ru: 'Абонементы в бассейн · Hilton', en: 'Pool memberships at Hilton Tashkent', uz: 'Hilton Toshkentda spa abonementlari' },
};

export function getOrganicMetaTitle(slug: OrganicPageSlug, locale: Locale, rows = getOrganicPriceRows(slug, locale)): string {
  const amount = formatPrice(Math.min(...rows.map(row => row.price)), locale);
  const cost = locale === 'ru' ? `${rows.length > 1 ? 'от ' : ''}${amount} сум`
    : locale === 'en' ? `${rows.length > 1 ? 'from ' : ''}${amount} UZS`
      : `${amount} so‘m${rows.length > 1 ? 'dan' : ''}`;
  const price = slug === 'gift-certificate-spa-tashkent'
    ? `${locale === 'ru' ? 'услуги ' : locale === 'en' ? 'services ' : 'xizmatlar '}${cost}` : cost;
  const title = `${TITLES[slug][locale]} — ${price}`;
  return title.length + ' · Serenity Spa'.length <= 60 ? `${title} · Serenity Spa` : title;
}

/** Keep the visible heading/intro and 120..160 char search description aligned across locales. */
export function getOrganicIntro(slug: OrganicPageSlug, locale: Locale, title: string, rows = getOrganicPriceRows(slug, locale)) {
  const unit = locale === 'ru' ? 'сум' : locale === 'en' ? 'UZS' : 'so‘m';
  const min = Math.min(...rows.map(row => row.price));
  const cost = `${formatPrice(min, locale)} ${unit}`;
  const fmt = (row: PriceRow) => `${formatPrice(row.price, locale)} ${unit}`;

  let lead: string;
  switch (slug) {
    case 'massage-tashkent':
      lead = locale === 'ru'
        ? `Авторские массажи в Serenity Spa на 4-м этаже Hilton Tashkent City — от ${cost}: балийский, лимфодренаж, стоун-терапия. Запись 07:00–23:00.`
        : locale === 'en'
          ? `Signature massages at Serenity Spa on the 4th floor of Hilton Tashkent City — from ${cost}: Balinese, lymphatic drainage and hot stone daily.`
          : `Hilton Tashkent City 4-qavatidagi Serenity Spa’da mualliflik massajlari — ${cost}dan: Bali, limfodrenaj va issiq toshlar. Yozilish 07:00–23:00.`;
      break;
    case 'balinese-massage-tashkent': {
      const pairs = rows.map(r => `${r.duration} — ${fmt(r)}`).join(', ');
      lead = locale === 'ru'
        ? `Традиционный балийский массаж в Serenity Spa (Hilton Tashkent City): ${pairs}. Глубокое расслабление мышц по записи.`
        : locale === 'en'
          ? `Traditional Balinese massage at Serenity Spa (Hilton Tashkent City): ${pairs}. Full-body relaxation by appointment.`
          : `Hilton Tashkent City Serenity Spa’da an’anaviy Bali massaji: ${pairs}. Butun tana bo‘shashishi uchun oldindan yoziling.`;
      break;
    }
    case 'lymphatic-drainage-massage-tashkent':
      lead = locale === 'ru'
        ? `Лимфодренажный детокс-массаж в Serenity Spa (Hilton Tashkent City): ${rows[0].duration} — ${cost}. Мягкая техника для лёгкости тела и снятия отёков.`
        : locale === 'en'
          ? `Lymphatic drainage detox massage at Serenity Spa (Hilton Tashkent City): ${rows[0].duration} — ${cost}. Gentle rhythmic care for lightness and recovery.`
          : `Hilton Tashkent City Serenity Spa’da limfodrenaj detoks massaji: ${rows[0].duration} — ${cost}. Yengillik va tiklanish uchun yumshoq ritmik muolaja.`;
      break;
    case 'couples-spa-tashkent':
      lead = locale === 'ru'
        ? `SPA-программа Serenity для двоих в Hilton Tashkent City: ${rows[0].duration}, ${cost} за двух гостей. Бассейн, сауны, пилинг, парный массаж и чай.`
        : locale === 'en'
          ? `Serenity couples spa package at Hilton Tashkent City: ${rows[0].duration}, ${cost} for two guests. Pool, saunas, peel, massage, wrap and tea.`
          : `Hilton Tashkent City’da ikki kishilik Serenity spa dasturi: ${rows[0].duration}, ikki mehmon uchun ${cost}. Basseyn, saunalar, piling va massaj.`;
      break;
    case 'gift-certificate-spa-tashkent':
      lead = locale === 'ru'
        ? 'Подарочный сертификат в Serenity Spa (Hilton Tashkent City): массажи и SPA-пакеты для одного или двоих. Условия и номиналы уточните у администратора.'
        : locale === 'en'
          ? 'Spa gift certificate at Serenity Spa (Hilton Tashkent City): massages and spa packages for one or two guests. Confirm terms with the administrator.'
          : 'Hilton Tashkent City Serenity Spa sovg‘a sertifikati: bir yoki ikki kishi uchun massaj va spa dasturlar. Shartlarni administratordan aniqlang.';
      break;
    case 'body-wrap-tashkent':
      lead = locale === 'ru'
        ? `Обёртывания тела в Serenity Spa (Hilton Tashkent City): ${rows[0].duration} — ${cost}. Лавандовое, шоколадное, «Авокадо и шёлк» и детокс по записи.`
        : locale === 'en'
          ? `Body wraps at Serenity Spa (Hilton Tashkent City): ${rows[0].duration} — ${cost}. Lavender, chocolate, Avocado & Silk and detox rituals by booking.`
          : `Hilton Tashkent City Serenity Spa’da tana o‘rash muolajalari: ${rows[0].duration} — ${cost}. Lavanda, shokolad, avokado-ipak va detoks turlari.`;
      break;
    case 'pool-day-pass-tashkent':
      lead = locale === 'ru'
        ? `Разовый дневной визит в Serenity Spa (Hilton Tashkent City): будни ${fmt(rows[0])}, выходные ${fmt(rows[1])}. Бассейн, зал, сауны и джакузи 07:00–23:00.`
        : locale === 'en'
          ? `Pool and wellness day pass at Serenity Spa (Hilton Tashkent City): weekdays ${fmt(rows[0])}, weekends ${fmt(rows[1])}. Pool, gym, saunas and jacuzzi.`
          : `Hilton Tashkent City Serenity Spa kunlik tashrif: ish kunlari ${fmt(rows[0])}, dam olish kunlari ${fmt(rows[1])}. Basseyn, zal, saunalar va jakuzi.`;
      break;
    case 'spa-with-pool-tashkent':
      lead = locale === 'ru'
        ? `Крытый 27-метровый панорамный бассейн 28°C и джакузи 38°C в Serenity Spa (Hilton Tashkent City): визит от ${cost}, ежедневно с 07:00 до 23:00.`
        : locale === 'en'
          ? `27 m panoramic indoor pool (28°C) and 38°C jacuzzi at Serenity Spa (Hilton Tashkent City): day visits from ${cost}, open daily 07:00–23:00.`
          : `Hilton Tashkent City Serenity Spa’da 27 metrli yopiq basseyn (28°C) va jakuzi (38°C): tashrif ${cost}dan, har kuni soat 07:00–23:00.`;
      break;
    case 'sauna-hammam-tashkent':
      lead = locale === 'ru'
        ? `Финская сухая сауна 95°C и паровая парная в формате хаммама в Serenity Spa (Hilton Tashkent City): визит от ${cost}, пилинги и уходы по записи.`
        : locale === 'en'
          ? `Finnish dry sauna (95°C) and hammam-style steam room at Serenity Spa (Hilton Tashkent City): access from ${cost}, peels and massages by booking.`
          : `Hilton Tashkent City Serenity Spa’da fin quruq saunasi (95°C) va bug‘li hammom: kirish ${cost}dan, piling hamda massajlar yozilish orqali.`;
      break;
    case 'spa-packages-tashkent':
      lead = locale === 'ru'
        ? `Комплексные SPA-программы в Serenity Spa (Hilton Tashkent City) от ${cost}: мужской, женский, авторский и парный пакеты на 3–4,5 часа отдыха.`
        : locale === 'en'
          ? `Complete spa packages at Serenity Spa (Hilton Tashkent City) from ${cost}: men’s, women’s, Signature and couples programs for 3–4.5 hours.`
          : `Hilton Tashkent City Serenity Spa’da kompleks spa dasturlar ${cost}dan: erkaklar, ayollar, mualliflik va juftlik paketlari (3–4,5 soat).`;
      break;
    case 'wellness-membership-tashkent':
      lead = locale === 'ru'
        ? 'Клубные абонементы в бассейн, зал и сауны Serenity Spa (Hilton Tashkent City): 12 визитов, 1–12 месяцев, семейные и детские карты — тарифы ниже.'
        : locale === 'en'
          ? 'Club memberships for pool, gym and saunas at Serenity Spa (Hilton Tashkent City): 12 visits, 1–12 months, family and kids tiers in the table.'
          : 'Hilton Tashkent City Serenity Spa klub abonementlari: basseyn, sport zali va saunalar uchun 12 tashrif, 1–12 oylik hamda oilaviy tariflar.';
      break;
  }

  return {
    h1: `${title} ${locale === 'ru' ? 'в' : locale === 'en' ? 'at' : '—'} Hilton Tashkent City`,
    description: lead,
    lead,
  };
}

const PHOTO_ALTS: Record<string, Record<Locale, string>> = {
  'couples-treatment': { ru: 'Два гостя на массаже в кабинете для двоих Serenity Spa в Hilton Tashkent City', en: 'Two guests having massages in the couples treatment room at Serenity Spa, Hilton Tashkent City', uz: 'Hilton Tashkent City Serenity Spa’da ikki mehmon uchun massaj xonasi' },
  'treatment-suite': { ru: 'Массажный кабинет Serenity Spa с кушеткой и приглушённым светом', en: 'Serenity Spa massage room with a treatment bed and soft lighting', uz: 'Serenity Spa massaj xonasi, kushetka va yumshoq yoritish' },
  'treatment-room-tub': { ru: 'Кабинет Serenity Spa с круглой ванной и двумя массажными кушетками', en: 'Serenity Spa treatment room with a round bath and two massage beds', uz: 'Serenity Spa muolaja xonasi, dumaloq vanna va ikkita massaj kushetkasi' },
  'lounge-floral-table': { ru: 'Лаунж Serenity Spa с цветами на столике и стойкой ресепшена', en: 'Serenity Spa lounge with flowers on a table and a reception desk', uz: 'Serenity Spa dam olish hududi, stoldagi gullar va qabulxona' },
  'pool-day-wide': { ru: '27-метровый крытый бассейн Serenity Spa в Hilton Tashkent City', en: '27-metre indoor Serenity Spa pool at Hilton Tashkent City', uz: 'Hilton Tashkent City Serenity Spa’dagi 27 metrlik yopiq basseyn' },
  'hero-pool': { ru: '27-метровый бассейн Serenity Spa с панорамными окнами в Hilton Tashkent City', en: '27-metre Serenity Spa pool with panoramic windows at Hilton Tashkent City', uz: 'Hilton Tashkent City Serenity Spa’dagi panoramali oynali 27 metrlik basseyn' },
  'infra-sauna': { ru: 'Финская сауна Serenity Spa с деревянными скамьями', en: 'Serenity Spa Finnish sauna with wooden benches', uz: 'Serenity Spa fin saunasi va yog‘och o‘rindiqlar' },
};

export function getOrganicImageAlt(image: string, locale: Locale): string {
  const key = image.split('/').pop()!.replace(/\.webp$/, '');
  return PHOTO_ALTS[key][locale];
}

export function buildOrganicOffers(rows: PriceRow[], url: string) {
  const offers = rows.map(row => ({
    '@type': 'Offer',
    name: row.duration ? `${row.name} (${row.duration})` : row.name,
    price: String(row.price),
    priceCurrency: 'UZS',
    availability: 'https://schema.org/InStock',
    url,
    seller: { '@id': 'https://serenityspa.uz/#business' },
  }));
  return offers.length === 1 ? offers[0] : offers;
}
