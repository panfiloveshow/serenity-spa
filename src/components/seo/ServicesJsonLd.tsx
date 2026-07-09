import { SERVICES, PACKAGES } from '@/lib/constants';
import { BUSINESS_ID, BUSINESS_NAME, SITE_URL, getLocality } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types/i18n';

const BASE_URL = SITE_URL;
const CURRENCY = 'UZS';

const SPA_PACKAGE_LABEL: Record<Locale, string> = {
  ru: 'SPA программа',
  en: 'Spa package',
  uz: 'Spa dasturi',
};

const CATALOG_LABEL: Record<Locale, string> = {
  ru: 'Услуги и SPA программы',
  en: 'Services and spa packages',
  uz: 'Xizmatlar va spa dasturlari',
};

function parsePrice(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, '');
  return digits || undefined;
}

function parseDurationMinutes(raw: string): string | undefined {
  const m = raw.match(/(\d+(?:[.,]\d+)?)\s*(час|h|мин|min)/i);
  if (!m) return undefined;
  const value = parseFloat(m[1].replace(',', '.'));
  const unit = m[2].toLowerCase();
  const minutes = /час|h/i.test(unit) ? Math.round(value * 60) : Math.round(value);
  return `PT${minutes}M`;
}

/**
 * Single OfferCatalog JSON-LD merged into the business node via @id.
 * One script tag instead of one per service; Google shows no rich results
 * for Service, so the catalog just enriches the LocalBusiness entity.
 */
export async function ServicesJsonLd({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const city = getLocality(lang);
  const areaServed = { '@type': 'City', name: city };

  const serviceOffers = SERVICES.flatMap((category, ci) => {
    const dictCat = dict.services.categories[ci];
    const catTitle = dictCat?.title ?? category.title;
    return category.items.map((item, i) => {
      const dictItem = dictCat?.items[i];
      const itemName = dictItem?.name ?? item.name;
      const itemDuration = dictItem?.duration ?? item.duration;
      const itemDesc = dictItem?.desc ?? item.desc;
      const price = parsePrice(item.price);
      // Parse ISO duration from the RU constant (мин/час are always parseable).
      const duration = parseDurationMinutes(item.duration);
      return {
        '@type': 'Offer',
        ...(price && { price, priceCurrency: CURRENCY }),
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/${lang}#services`,
        itemOffered: {
          '@type': 'Service',
          name: `${catTitle} — ${itemName} (${itemDuration})`,
          description: itemDesc || `${itemName}, ${itemDuration}`,
          category: catTitle,
          serviceType: catTitle,
          areaServed,
          ...(duration && { duration }),
        },
      };
    });
  });

  const packageOffers = PACKAGES.map((pkg, pi) => {
    const dictPkg = dict.packages.items[pi];
    const price = parsePrice(pkg.price);
    return {
      '@type': 'Offer',
      ...(price && { price, priceCurrency: CURRENCY }),
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/${lang}#packages`,
      itemOffered: {
        '@type': 'Service',
        name: dictPkg?.title ?? pkg.title,
        description: dictPkg?.description ?? pkg.description,
        category: 'Spa Package',
        serviceType: SPA_PACKAGE_LABEL[lang] ?? SPA_PACKAGE_LABEL.ru,
        areaServed,
      },
    };
  });

  const catalog = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': BUSINESS_ID,
    name: BUSINESS_NAME,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${BUSINESS_NAME} — ${CATALOG_LABEL[lang] ?? CATALOG_LABEL.ru}`,
      itemListElement: [...serviceOffers, ...packageOffers],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(catalog) }}
    />
  );
}
