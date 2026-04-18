import { SERVICES, PACKAGES } from '@/lib/constants';

const BASE_URL = 'https://serenityspa.uz';
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
    name: 'Serenity Spa',
    '@id': `${BASE_URL}/${lang}#business`,
  };

  const services = SERVICES.flatMap(category =>
    category.items.map(item => {
      const price = parsePrice(item.price);
      const duration = parseDurationMinutes(item.duration);
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${category.title} — ${item.name} (${item.duration})`,
        description: item.desc || `${item.name}, ${item.duration}`,
        category: category.title,
        provider: providerRef,
        areaServed: { '@type': 'City', name: 'Ташкент' },
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
      '@type': 'Product',
      name: pkg.title,
      description: pkg.description,
      provider: providerRef,
      category: 'Spa Package',
      hasMerchantReturnPolicy: undefined,
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
