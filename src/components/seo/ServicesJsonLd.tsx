import { SERVICES, PACKAGES } from '@/lib/constants';
import { BUSINESS_ID, BUSINESS_NAME, SITE_URL } from '@/lib/seo';

const BASE_URL = SITE_URL;
const CURRENCY = 'UZS';

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
 * Inline Service/OfferCatalog JSON-LD for each service category and premium package.
 * Rendered server-side; boosts rich results and local SEO for Tashkent.
 */
export function ServicesJsonLd({ lang }: { lang: string }) {
  const providerRef = {
    '@type': 'HealthAndBeautyBusiness',
    name: BUSINESS_NAME,
    '@id': BUSINESS_ID,
  };

  const services = SERVICES.flatMap(category =>
    category.items.map((item, i) => {
      const price = parsePrice(item.price);
      const duration = parseDurationMinutes(item.duration);
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${BASE_URL}/${lang}#service-${category.id}-${i}`,
        name: `${category.title} — ${item.name} (${item.duration})`,
        description: item.desc || `${item.name}, ${item.duration}`,
        category: category.title,
        serviceType: category.title,
        provider: providerRef,
        areaServed: { '@type': 'City', name: 'Ташкент' },
        url: `${BASE_URL}/${lang}#services`,
        ...(duration && { duration }),
        ...(price && {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: CURRENCY,
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/${lang}#services`,
          },
        }),
      };
    }),
  );

  const packages = PACKAGES.map(pkg => {
    const price = parsePrice(pkg.price);
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${BASE_URL}/${lang}#package-${pkg.id}`,
      name: pkg.title,
      description: pkg.description,
      provider: providerRef,
      category: 'Spa Package',
      serviceType: 'SPA программа',
      areaServed: { '@type': 'City', name: 'Ташкент' },
      url: `${BASE_URL}/${lang}#packages`,
      ...(price && {
        offers: {
          '@type': 'Offer',
          price,
          priceCurrency: CURRENCY,
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/${lang}#packages`,
        },
      }),
    };
  });

  return (
    <>
      {services.map((s, i) => (
        <script
          key={`svc-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      {packages.map((p, i) => (
        <script
          key={`pkg-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(p) }}
        />
      ))}
    </>
  );
}
