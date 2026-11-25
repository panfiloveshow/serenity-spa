import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const modules = new Map();

// Read the same TypeScript catalog as the site without a second pricing database.
function loadCatalog(relative) {
  const path = resolve(root, relative);
  if (modules.has(path)) return modules.get(path);
  const exports = {};
  modules.set(path, exports);
  const source = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(
    source,
    {
      exports,
      require: (specifier) => {
        if (specifier !== './business') throw new Error(`Unexpected catalog dependency: ${specifier}`);
        return loadCatalog(resolve(dirname(path), 'business.ts'));
      },
    },
    { filename: path },
  );
  return exports;
}

const { SERVICES, PACKAGES, MEMBERSHIP_TIERS } = loadCatalog('src/lib/constants.ts');
const { BUSINESS_CONTACT: b, CONTENT_UPDATED: updated, SITE_URL: base } = loadCatalog('src/lib/business.ts');
const d = JSON.parse(readFileSync(resolve(root, 'src/dictionaries/en.json'), 'utf8'));
const dRu = JSON.parse(readFileSync(resolve(root, 'src/dictionaries/ru.json'), 'utf8'));
const dUz = JSON.parse(readFileSync(resolve(root, 'src/dictionaries/uz.json'), 'utf8'));
const { getPackageOptions } = loadCatalog('src/lib/package-options.ts');

const packageOptions = PACKAGES.flatMap((pkg, index) =>
  getPackageOptions(pkg, d.packages.items[index].title, d.packages).map((option) => ({ ...option, index })),
);
const price = (raw) => Number(String(raw).replace(/\D/g, '')).toLocaleString('en-US');
const day = MEMBERSHIP_TIERS[0];
const location = `${b.streetAddressLatin}, ${b.postalCode}, Tashkent, Uzbekistan`;

const details = [
  `Last updated: ${updated}`,
  `Location: ${location}`,
  `Entrance: Main entrance of Hilton Tashkent City`,
  `Phone: ${b.phoneDisplay}`,
  `WhatsApp: ${b.whatsappDisplay} (${b.whatsappUrl})`,
  `Email: ${b.email}`,
  `Hours: Pool, gym and saunas daily ${b.opens}-${b.closes}`,
  `Currency: UZS`,
  `Accepted cards: ${b.acceptedCards.join(', ')}`,
  `Parking: ${price(b.parkingPrice)} UZS for ${b.parkingHours} hours`,
  `Provided: Towels, bathrobes and slippers`,
  `Booking: Advance booking required for all guests (confirmation by administrator before arrival)`,
  `Hotel guests: Pool, gym, jacuzzi, Finnish and steam saunas are complimentary for guests staying at Hilton Tashkent City`,
  `Individual treatments: Pool and saunas are not included; standard day access is charged separately (${price(day.price)} UZS weekdays / ${price(day.priceNote)} UZS weekends)`,
  `Gift certificates, foreign-card and online payments: Confirm current conditions directly with reception`,
].join('\n');

const SERVICE_PAGE_DESCRIPTORS = [
  {
    slug: 'massage-tashkent',
    enTitle: 'Massages in Tashkent at Hilton',
    ruTitle: 'Массаж в Ташкенте в Hilton',
    uzTitle: 'Hilton Toshkentda massaj',
    summary: `12 massage sessions (30–120 min) from 700,000 to 1,750,000 UZS`,
  },
  {
    slug: 'balinese-massage-tashkent',
    enTitle: 'Balinese Massage in Tashkent',
    ruTitle: 'Балийский массаж в Ташкенте',
    uzTitle: 'Toshkentda Bali massaji',
    summary: `Traditional full-body Balinese massage — 60 min (1,000,000 UZS) and 90 min (1,300,000 UZS)`,
  },
  {
    slug: 'lymphatic-drainage-massage-tashkent',
    enTitle: 'Lymphatic Drainage Massage in Tashkent',
    ruTitle: 'Лимфодренажный массаж в Ташкенте',
    uzTitle: 'Toshkentda limfodrenaj massaji',
    summary: `Gentle 90-minute rhythmic detox drainage massage — 1,350,000 UZS`,
  },
  {
    slug: 'couples-spa-tashkent',
    enTitle: 'Couples Spa in Tashkent',
    ruTitle: 'Спа для двоих в Ташкенте',
    uzTitle: 'Toshkentda ikki kishilik spa',
    summary: `4-hour Serenity Package for Two (5,000,000 UZS total for two guests) and 4.5-hour Signature for Two (5,500,000 UZS)`,
  },
  {
    slug: 'gift-certificate-spa-tashkent',
    enTitle: 'Spa Gift Certificate in Tashkent',
    ruTitle: 'Подарочный сертификат в спа в Ташкенте',
    uzTitle: 'Toshkentda spa sovg‘a sertifikati',
    summary: `Gift options across massages and multi-hour spa packages; terms and denominations confirmed with reception`,
  },
  {
    slug: 'body-wrap-tashkent',
    enTitle: 'Body Wraps & Scrubs in Tashkent',
    ruTitle: 'Обёртывания и пилинги тела в Ташкенте',
    uzTitle: 'Toshkentda tana o‘rash va piling',
    summary: `60-minute Lavender, Chocolate, Avocado & Silk and Detox body wraps (850,000 UZS) plus exfoliating peels`,
  },
  {
    slug: 'pool-day-pass-tashkent',
    enTitle: 'Pool & Wellness Day Pass in Tashkent',
    ruTitle: 'Дневной доступ в бассейн и спа в Ташкенте',
    uzTitle: 'Toshkentda kunlik basseyn chiptasi',
    summary: `Single-entry wellness ticket (${price(day.price)} UZS weekdays / ${price(day.priceNote)} UZS weekends) covering pool, gym, saunas and jacuzzi`,
  },
  {
    slug: 'spa-with-pool-tashkent',
    enTitle: 'Spa with 27 m Panoramic Indoor Pool',
    ruTitle: 'Спа с панорамным бассейном 27 м в Ташкенте',
    uzTitle: 'Toshkentda 27 m panoramali basseynli spa',
    summary: `Year-round 27 m indoor pool (28°C) and 38°C hydromassage jacuzzi on the 4th floor of Hilton Tashkent City`,
  },
  {
    slug: 'sauna-hammam-tashkent',
    enTitle: 'Finnish Sauna & Hammam-Style Steam Room',
    ruTitle: 'Финская сауна и хаммам в Ташкенте',
    uzTitle: 'Toshkentda fin saunasi va bug‘li hammom',
    summary: `95°C dry wood-lined Finnish sauna, humid hammam-style steam bath and 850,000 UZS post-steam body peels`,
  },
  {
    slug: 'spa-packages-tashkent',
    enTitle: 'All-in-One Spa Packages in Tashkent',
    ruTitle: 'Комплексные спа-программы в Ташкенте',
    uzTitle: 'Toshkentda kompleks spa dasturlari',
    summary: `3 to 4.5-hour Men’s (1,800,000 UZS), Women’s (2,200,000 UZS), Signature (3,000,000 / 5,500,000 UZS) and Couples (5,000,000 UZS) programs`,
  },
  {
    slug: 'wellness-membership-tashkent',
    enTitle: 'Pool, Gym & Spa Memberships in Tashkent',
    ruTitle: 'Клубные абонементы в бассейн и спа',
    uzTitle: 'Toshkentda basseyn va spa abonementlari',
    summary: `12-visit bundle (4,500,000 UZS), 1–12 month adult tiers (Standard, Bronze, Silver, Gold), annual Family plan and Kids cards`,
  },
];

const services =
  `# Serenity Spa Services\n\n> Complete machine-readable service, package and membership catalog for Serenity Spa on the 4th floor of Hilton Tashkent City (Ukchi 1, Tashkent, Uzbekistan).\n\n${details}\n\nCanonical website: ${base}/ru\n\n## Wellness Access\n\n- Weekday day pass: ${price(day.price)} UZS\n- Weekend day pass: ${price(day.priceNote)} UZS\n- Includes: ${d.membership.tiers[0].features.join(', ')}\n- Page: [Pool & Wellness Day Pass](${base}/en/services/pool-day-pass-tashkent)\n\n` +
  SERVICES.map(
    (category, ci) =>
      `## ${d.services.categories[ci].title}\n\n` +
      category.items
        .map((item, i) => {
          const di = d.services.categories[ci].items[i];
          return (
            `### ${di.name}\n` +
            (di.duration ? `- Duration: ${di.duration}\n` : '') +
            `- Price: ${price(item.price)} UZS\n` +
            (di.desc ? `- Summary: ${di.desc}\n` : '')
          );
        })
        .join('\n'),
  ).join('\n') +
  `\n## Spa Packages\n\n` +
  packageOptions
    .map(
      (option) =>
        `### ${option.name}\n- Duration: ${d.packages.items[option.index].duration}\n- Price: ${price(option.price)} UZS\n- Includes: ${d.packages.items[option.index].includes.join('; ')}\n`,
    )
    .join('\n') +
  `\n## Memberships\n\n` +
  MEMBERSHIP_TIERS.slice(1)
    .map(
      (item, i) =>
        `### ${d.membership.tiers[i + 1].name}\n- Term: ${d.membership.tiers[i + 1].period}\n- Price: ${item.id === 'kids' ? 'from ' : ''}${price(item.price)} UZS\n${d.membership.tiers[i + 1].priceNote ? `- Other terms: ${d.membership.tiers[i + 1].priceNote}\n` : ''}- Includes: ${d.membership.tiers[i + 1].features.join('; ')}\n`,
    )
    .join('\n');

const pricing =
  `# Serenity Spa Pricing\n\n> Current UZS tariff summary for day passes, massages, body treatments, spa packages and memberships at Serenity Spa (Hilton Tashkent City).\n\n${details}\n\nCanonical website: ${base}/ru\nFull service descriptions: ${base}/services.md\n\n## Day Access\n- Weekdays: ${price(day.price)} UZS\n- Weekends: ${price(day.priceNote)} UZS\n\n` +
  SERVICES.map(
    (category, ci) =>
      `## ${d.services.categories[ci].title}\n` +
      category.items
        .map(
          (item, i) =>
            `- ${d.services.categories[ci].items[i].name}${d.services.categories[ci].items[i].duration ? `, ${d.services.categories[ci].items[i].duration}` : ''}: ${price(item.price)} UZS`,
        )
        .join('\n'),
  ).join('\n\n') +
  `\n\n## Spa Packages\n` +
  packageOptions.map((option) => `- ${option.name}, ${d.packages.items[option.index].duration}: ${price(option.price)} UZS`).join('\n') +
  `\n\n## Memberships\n` +
  MEMBERSHIP_TIERS.slice(1)
    .map(
      (item, i) =>
        `- ${d.membership.tiers[i + 1].name}, ${d.membership.tiers[i + 1].period}: ${item.id === 'kids' ? 'from ' : ''}${price(item.price)} UZS${d.membership.tiers[i + 1].priceNote ? ` (${d.membership.tiers[i + 1].priceNote})` : ''}`,
    )
    .join('\n') +
  '\n';

const llms = [
  `# Serenity Spa`,
  ``,
  `> Serenity Spa is the day-spa and wellness club on the 4th floor of Hilton Tashkent City (Ukchi 1, 100027, Tashkent, Uzbekistan), open daily 07:00–23:00 to hotel guests and external city visitors by advance reservation.`,
  ``,
  `Serenity Spa (also known as Serenity Spa Tashkent, Serenity Spa Hilton, спа Хилтон Ташкент) spans 1,200 m² and features a 27 m panoramic indoor pool (28°C), 38°C hydromassage jacuzzi, 95°C dry Finnish sauna, hammam-style steam bath, fitness studio, private massage suites and couples ritual rooms. All prices are settled in Uzbekistani som (UZS) via Visa, Mastercard, Uzcard or Humo.`,
  ``,
  details,
  ``,
  `## Machine-Readable Catalog & Sitemap`,
  ``,
  `- [Services Catalog](${base}/services.md): Complete Markdown service menu with durations, UZS prices, descriptions, packages and membership tiers`,
  `- [Pricing Summary](${base}/pricing.md): Compact UZS price list across day access, massages, body care, packages and club memberships`,
  `- [XML Sitemap](${base}/sitemap.xml): Canonical 36-URL index covering Russian, English and Uzbek pages`,
  ``,
  `## Homepages`,
  ``,
  `- [Serenity Spa — Russian Homepage](${base}/ru): ${dRu.metadata.description}`,
  `- [Serenity Spa — English Homepage](${base}/en): ${d.metadata.description}`,
  `- [Serenity Spa — Uzbek Homepage](${base}/uz): ${dUz.metadata.description}`,
  ``,
  `## Service Pages (English)`,
  ``,
  ...SERVICE_PAGE_DESCRIPTORS.map((p) => `- [${p.enTitle}](${base}/en/services/${p.slug}): ${p.summary}`),
  ``,
  `## Official Profiles`,
  ``,
  `- [Hilton Tashkent City Hotel](${b.hotelUrl}): Host five-star hotel on Ukchi 1 (Serenity Spa is on the 4th floor)`,
  `- [2GIS Listing](${b.twoGisUrl}): Local Tashkent directory profile and verified guest ratings`,
  `- [Google Maps](${b.mapUrl}): Verified coordinates (${b.latitude}, ${b.longitude}) and directions`,
  `- [Yandex Maps](${b.yandexUrl}): Regional navigation and entrance pin in Tashkent City`,
  `- [Tripadvisor](${b.tripadvisorUrl}): International traveller listing for Serenity Spa in Tashkent`,
  `- [Instagram](${b.instagramUrl}): Official @serenityspa_tashkent social channel`,
  `- [Telegram](${b.telegramUrl}): Direct reception messaging (@Serenity_Spa)`,
  `- [Facebook](${b.facebookUrl}): Official Serenity Spa Hilton Tashkent page`,
  ``,
  `## Optional`,
  ``,
  ...SERVICE_PAGE_DESCRIPTORS.map((p) => `- [${p.ruTitle} (RU)](${base}/ru/services/${p.slug}): ${p.summary}`),
  ...SERVICE_PAGE_DESCRIPTORS.map((p) => `- [${p.uzTitle} (UZ)](${base}/uz/services/${p.slug}): ${p.summary}`),
  ``,
].join('\n');

let changed = false;
for (const [name, text] of Object.entries({ 'services.md': services, 'pricing.md': pricing, 'llms.txt': llms })) {
  const targetPath = resolve(root, 'public', name);
  let current = '';
  try {
    current = readFileSync(targetPath, 'utf8');
  } catch {
    current = '';
  }
  if (current === text) continue;
  changed = true;
  if (process.argv.includes('--check')) console.error(`Out of date: public/${name}`);
  else writeFileSync(targetPath, text);
}
if (changed && process.argv.includes('--check')) process.exitCode = 1;
