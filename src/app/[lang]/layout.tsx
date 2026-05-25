import type { Metadata } from 'next';
import Script from 'next/script';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import { PhoneClickTracker } from '@/components/ui/PhoneClickTracker';
import { GA4_ID, GOOGLE_ADS_ID, GTM_ID, YM_ID } from '@/lib/analytics';
import { getDictionary } from '@/lib/i18n';
import { LangProvider } from '@/lib/lang-context';
import { LanguagePreferenceModal } from '@/components/ui/LanguagePreferenceModal';
import { ServicesJsonLd } from '@/components/seo/ServicesJsonLd';
import type { Locale } from '@/types/i18n';
import { SUPPORTED_LOCALES, OG_LOCALES, DEFAULT_LOCALE } from '@/types/i18n';

const BASE_URL = 'https://serenityspa.uz';

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
});

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  weight: ['700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: false,
});

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = `${BASE_URL}/${locale}`;
  }
  languages['x-default'] = `${BASE_URL}/${DEFAULT_LOCALE}`;

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: [
      'спа Ташкент', 'массаж Ташкент', 'спа центр', 'Serenity Spa',
      'оздоровительный центр', 'сауна', 'хаммам', 'бассейн',
      'пилинг', 'обёртывание', 'spa Tashkent',
    ],
    authors: [{ name: 'Serenity Spa' }],
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALES[lang],
      url: `${BASE_URL}/${lang}`,
      siteName: 'Serenity Spa',
      title: dict.metadata.ogTitle,
      description: dict.metadata.ogDescription,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: dict.metadata.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.ogTitle,
      description: dict.metadata.ogDescription,
      images: ['/opengraph-image'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dictionary = await getDictionary(lang);

  const hasGtm = Boolean(GTM_ID);
  const hasGoogleAds = Boolean(GOOGLE_ADS_ID);
  const hasGa4 = Boolean(GA4_ID);
  const hasYm = Boolean(YM_ID);

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <head>
        {hasGtm && (
          <Script
            id="gtm-base"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
        {(hasGoogleAds || hasGa4) && (
          <Script
            id="gtag-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${hasGa4 ? GA4_ID : GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
        )}
        {(hasGoogleAds || hasGa4) && (
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                window.gtag = function(){window.dataLayer.push(arguments);};
                window.gtag('js', new Date());
                ${hasGa4 ? `window.gtag('config', '${GA4_ID}', { send_page_view: true });` : ''}
                ${hasGoogleAds ? `window.gtag('config', '${GOOGLE_ADS_ID}');` : ''}
              `,
            }}
          />
        )}
        {hasYm && (
          <Script
            id="ym-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}','ym');
                ym(${YM_ID},'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});
              `,
            }}
          />
        )}
        <link rel="dns-prefetch" href="https://api.telegram.org" />
        {(hasGtm || hasGoogleAds || hasGa4) && (
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        )}
        {hasYm && (
          <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HealthAndBeautyBusiness',
              '@id': `${BASE_URL}/${lang}#business`,
              name: 'Serenity Spa',
              description: dictionary.metadata.jsonLdDescription,
              url: `${BASE_URL}/${lang}`,
              image: `${BASE_URL}/opengraph-image`,
              telephone: '+998712108895',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Укчи 1',
                postalCode: '100027',
                addressLocality: 'Ташкент',
                addressCountry: 'UZ',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                  'Friday', 'Saturday', 'Sunday',
                ],
                opens: '07:00',
                closes: '23:00',
              },
              sameAs: [
                'https://www.instagram.com/serenityspa_tashkent',
                'https://t.me/Serenity_Spa',
              ],
              priceRange: '$$$',
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 41.311081,
                longitude: 69.279737,
              },
              currenciesAccepted: 'UZS',
              paymentAccepted: 'Cash, Credit Card',
            }),
          }}
        />
        <ServicesJsonLd lang={lang} />
      </head>
      <body className={`${manrope.variable} ${cormorant.variable} antialiased font-sans`}>
        {hasGtm && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {hasYm && (
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${YM_ID}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        )}
        <PhoneClickTracker />
        <LangProvider locale={lang} dictionary={dictionary}>
          <LanguagePreferenceModal />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
