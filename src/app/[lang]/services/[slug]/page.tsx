import { ServiceBookingCta } from '@/components/booking/ServiceBookingCta';
import { Footer } from '@/components/layout/Footer';
import { formatPrice } from '@/lib/catalog';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/types/i18n';
import { LOCALE_LABELS, OG_LOCALES, SUPPORTED_LOCALES } from '@/types/i18n';
import {
  ORGANIC_SLUGS,
  buildOrganicPageJsonLd,
  getOrganicPage,
  getOrganicPageAlternates,
  getOrganicPageUrl,
} from '@/lib/organic-pages';
import { BUSINESS_CONTACT, BUSINESS_NAME, SITE_URL, getStreet, getLocality } from '@/lib/seo';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((lang) =>
    ORGANIC_SLUGS.map((slug) => ({
      lang,
      slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang as Locale;
  const page = getOrganicPage(slug, lang);

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: getOrganicPageUrl(lang, page.slug),
      languages: getOrganicPageAlternates(page.slug),
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALES[lang],
      siteName: BUSINESS_NAME,
      title: page.metaTitle,
      description: page.description,
      url: getOrganicPageUrl(lang, page.slug),
      images: [
        {
          url: page.image,
          width: 1200,
          height: 630,
          alt: page.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.description,
      images: [page.image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function OrganicServicePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang as Locale;
  const page = getOrganicPage(slug, lang);

  if (!page) notFound();

  const related = page.relatedSlugs
    .map((item) => getOrganicPage(item, lang))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#152E4A] text-[#E8DFD0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildOrganicPageJsonLd(page, lang)),
        }}
      />

      <section className="relative overflow-hidden px-4 pb-16 pt-8 md:px-6 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(200,149,108,0.14),transparent_32%),linear-gradient(135deg,rgba(16,40,68,0.96),rgba(21,46,74,0.88))]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/${lang}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#7A8BA8]/16 bg-[#1F4268]/52 px-4 text-sm text-[#A0B0C8] transition hover:border-[#C8956C]/32 hover:text-[#E8DFD0]"
            >
              <span aria-hidden>←</span>
              {lang === 'en' ? 'Home' : lang === 'uz' ? 'Bosh sahifa' : 'На главную'}
            </Link>
            <div className="flex items-center gap-3">
              <nav
                aria-label={lang === 'en' ? 'Language' : lang === 'uz' ? 'Til' : 'Язык'}
                className="inline-flex items-center rounded-full border border-[#7A8BA8]/16 bg-[#102844]/64 p-1"
              >
                {SUPPORTED_LOCALES.map((loc) => (
                  <Link
                    key={loc}
                    href={`/${loc}/services/${page.slug}`}
                    hrefLang={loc}
                    lang={loc}
                    aria-current={loc === lang ? 'page' : undefined}
                    className={`rounded-full px-3 py-1.5 text-xs transition ${
                      loc === lang
                        ? 'bg-[#C8956C]/22 font-semibold text-[#E8DFD0]'
                        : 'text-[#A0B0C8] hover:text-[#E8DFD0]'
                    }`}
                  >
                    {LOCALE_LABELS[loc]}
                  </Link>
                ))}
              </nav>
              <a
                href={`tel:${BUSINESS_CONTACT.phone}`}
                className="hidden min-h-11 items-center gap-2 rounded-full bg-[#C8956C] px-5 text-sm font-semibold text-[#152E4A] transition hover:bg-[#D4A574] sm:inline-flex"
              >
                {BUSINESS_CONTACT.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.72fr)] lg:items-center">
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C8956C]">
                {page.eyebrow}
              </p>
              <h1 className="max-w-4xl text-4xl font-light leading-tight md:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#A0B0C8] md:text-lg">
                {page.lead}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ServiceBookingCta label={page.primaryCta} service={page.title} />
                <Link
                  href={`/${lang}#services`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#7A8BA8]/18 px-7 text-sm font-semibold text-[#E8DFD0] transition hover:border-[#C8956C]/36 hover:bg-[#1F4268]/56"
                >
                  {page.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#7A8BA8]/14 bg-[#0E2135] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
              <Image
                src={page.image}
                alt={page.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1929]/74 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-[#07111C]/48 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm text-[#E8DFD0]">
                  <span className="text-[#C8956C]" aria-hidden>•</span>
                  {getStreet(lang)}, {getLocality(lang)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 md:px-6" aria-labelledby="service-prices">
        <div className="mx-auto max-w-7xl rounded-[24px] border border-[#7A8BA8]/12 bg-[#102844]/62 p-5 md:p-8">
          <h2 id="service-prices" className="mb-5 text-2xl font-light">
            {lang === 'ru' ? 'Цены и продолжительность' : lang === 'en' ? 'Prices and duration' : 'Narxlar va davomiylik'}
          </h2>
          {page.slug === 'gift-certificate-spa-tashkent' && (
            <p className="mb-5 max-w-3xl text-sm leading-7 text-[#A0B0C8]">
              {lang === 'ru' ? 'Ниже приведены цены услуг для подарка. Доступные номиналы, оформление и условия подарочного сертификата уточните у администратора.' : lang === 'en' ? 'These are service-price examples for a gift. Ask the administrator to confirm certificate denominations, purchase and terms.' : 'Quyida sovg‘a uchun xizmat narxlari keltirilgan. Sertifikat summalari, rasmiylashtirish va shartlarni administratordan aniqlang.'}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{page.title} — UZS</caption>
              <thead><tr className="border-b border-[#7A8BA8]/20 text-[#C8956C]">
                <th scope="col" className="py-3 pr-5">{lang === 'ru' ? 'Вариант' : lang === 'en' ? 'Option' : 'Xizmat'}</th>
                <th scope="col" className="py-3 pr-5">{lang === 'ru' ? 'Длительность / доступ' : lang === 'en' ? 'Duration / access' : 'Davomiylik / kirish'}</th>
                <th scope="col" className="py-3">{lang === 'ru' ? 'Цена, сум' : lang === 'en' ? 'Price, UZS' : 'Narx, so‘m'}</th>
              </tr></thead>
              <tbody>{page.priceRows.map(row => <tr key={`${row.name}-${row.duration}`} className="border-b border-[#7A8BA8]/10 last:border-0">
                <th scope="row" className="py-4 pr-5 font-medium">{row.name}</th>
                <td className="py-4 pr-5 text-[#A0B0C8]">{row.duration}</td>
                <td className="whitespace-nowrap py-4 text-[#E8DFD0]">{formatPrice(row.price, lang)}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {page.facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-[#7A8BA8]/12 bg-[#1F4268]/36 p-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8956C]/82">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-[#E8DFD0]">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-4">
            {page.sections.map((section) => (
              <article key={section.title} className="rounded-[24px] border border-[#7A8BA8]/12 bg-[#102844]/62 p-6 md:p-7">
                <h2 className="text-2xl font-light text-[#F7F2E8]">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#A0B0C8] md:text-base">{section.body}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm leading-6 text-[#E8DFD0]/88">
                      <span className="mt-0.5 shrink-0 text-[#C8956C]" aria-hidden>✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#7A8BA8]/12 bg-[#102844]/56 p-6 md:p-8">
            <h2 className="text-2xl font-light text-[#F7F2E8]">
              {lang === 'en' ? 'Questions before booking' : lang === 'uz' ? 'Yozilishdan oldin savollar' : 'Вопросы перед записью'}
            </h2>
            <div className="mt-6 grid gap-4">
              {page.faq.map((item) => (
                <article key={item.question} className="border-t border-[#7A8BA8]/12 pt-4 first:border-t-0 first:pt-0">
                  <h3 className="text-base font-semibold text-[#E8DFD0]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#A0B0C8]">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[24px] border border-[#7A8BA8]/12 bg-[#1F4268]/34 p-6 md:p-8">
            <h2 className="text-xl font-light text-[#F7F2E8]">{page.relatedLabel}</h2>
            <div className="mt-5 grid gap-3">
              {related.map((item) => item && (
                <Link
                  key={item.slug}
                  href={`/${lang}/services/${item.slug}`}
                  className="rounded-2xl border border-[#7A8BA8]/12 bg-[#102844]/58 p-4 text-sm text-[#E8DFD0] transition hover:border-[#C8956C]/30 hover:bg-[#1F4268]/70"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
      <Footer isSubpage langSwitchBasePath={`/services/${page.slug}`} />
    </main>
  );
}
