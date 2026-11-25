import { SERVICES, PACKAGES } from '@/lib/constants';
import { getPackageOptions } from '@/lib/package-options';
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

function compactDescription(raw?: string) {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const sentences = trimmed.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
  if (!sentences.length) return undefined;
  let result = sentences[0];
  if (result.endsWith('?') && sentences[1]) {
    result = `${result} ${sentences[1]}`;
  }
  result = result.replace(/[.]+$/, '').trim();
  return result.length > 155 ? `${result.slice(0, 152).trim()}...` : result;
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
      const itemDesc = compactDescription(dictItem?.desc ?? item.desc);
      const price = parsePrice(item.price);
      return {
        '@type': 'Offer',
        ...(price && { price, priceCurrency: CURRENCY }),
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/${lang}#services`,
        itemOffered: {
          '@type': 'Service',
          provider: { '@id': BUSINESS_ID },
          name: `${catTitle} — ${itemName}${itemDuration ? ` (${itemDuration})` : ''}`,
          description: itemDesc ?? itemName,
          category: catTitle,
          serviceType: catTitle,
          areaServed,
        },
      };
    });
  });

  const packageOffers = PACKAGES.flatMap((pkg, pi) => {
    const dictPkg = dict.packages.items[pi];
    const description = compactDescription(dictPkg?.description ?? pkg.description);
    return getPackageOptions(pkg, dictPkg?.title ?? pkg.title, dict.packages).map(option => ({
      '@type': 'Offer',
      price: parsePrice(option.price), priceCurrency: CURRENCY,
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/${lang}#packages`,
      itemOffered: {
        '@type': 'Service',
        provider: { '@id': BUSINESS_ID },
        name: option.name,
        ...(description && { description }),
        category: 'Spa Package',
        serviceType: SPA_PACKAGE_LABEL[lang] ?? SPA_PACKAGE_LABEL.ru,
        areaServed,
      },
    }));
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
