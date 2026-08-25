import type { Locale } from '@/types/i18n';
import {
  BUSINESS_CONTACT,
  BUSINESS_ID,
  BUSINESS_NAME,
  SEO_KEYWORDS,
  SITE_URL,
  getSeoContent,
  getStreet,
  getLocality,
} from '@/lib/seo';

export function LocalSeoJsonLd({ lang }: { lang: Locale }) {
  const content = getSeoContent(lang);
  const pageUrl = `${SITE_URL}/${lang}`;
  const businessRef = { '@id': BUSINESS_ID };

  const graph = [
    {
      '@type': ['HealthAndBeautyBusiness', 'DaySpa', 'SportsActivityLocation'],
      '@id': BUSINESS_ID,
      name: BUSINESS_NAME,
      alternateName: ['Serenity Spa Tashkent', 'Serenity Spa Ташкент'],
      description: content.intro,
      url: pageUrl,
      image: `${SITE_URL}/og-image.jpg`,
      logo: `${SITE_URL}/logo.svg`,
      telephone: BUSINESS_CONTACT.phone,
      email: BUSINESS_CONTACT.email,
      priceRange: '600 000-5 500 000 UZS',
      currenciesAccepted: 'UZS',
      paymentAccepted: 'Cash, Credit Card',
      address: {
        '@type': 'PostalAddress',
        streetAddress: getStreet(lang),
        postalCode: BUSINESS_CONTACT.postalCode,
        addressLocality: getLocality(lang),
        addressCountry: BUSINESS_CONTACT.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS_CONTACT.latitude,
        longitude: BUSINESS_CONTACT.longitude,
      },
      hasMap: BUSINESS_CONTACT.mapUrl,
      areaServed: [
        { '@type': 'City', name: 'Ташкент' },
        { '@type': 'City', name: 'Tashkent' },
        { '@type': 'Country', name: 'Uzbekistan' },
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: BUSINESS_CONTACT.opens,
        closes: BUSINESS_CONTACT.closes,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BUSINESS_CONTACT.phone,
        contactType: 'reservations',
        areaServed: 'UZ',
        availableLanguage: ['Russian', 'English', 'Uzbek'],
      },
      amenityFeature: [
        'Swimming pool',
        'Fitness center',
        'Finnish sauna',
        'Steam sauna',
        'Jacuzzi',
        'Massage rooms',
      ].map((name) => ({
        '@type': 'LocationFeatureSpecification',
        name,
        value: true,
      })),
      knowsAbout: SEO_KEYWORDS,
      sameAs: [BUSINESS_CONTACT.instagramUrl, BUSINESS_CONTACT.telegramUrl],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BUSINESS_NAME,
      url: SITE_URL,
      inLanguage: content.languageTag,
      publisher: businessRef,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}

export function HomeSeoJsonLd({ lang }: { lang: Locale }) {
  const content = getSeoContent(lang);
  const pageUrl = `${SITE_URL}/${lang}`;
  const businessRef = { '@id': BUSINESS_ID };

  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: content.title,
      description: content.intro,
      inLanguage: content.languageTag,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: businessRef,
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-image.jpg`,
      },
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      mainEntity: { '@id': `${pageUrl}#faq` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: BUSINESS_NAME,
          item: pageUrl,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      inLanguage: content.languageTag,
      mainEntity: content.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}
