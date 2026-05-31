import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/types/i18n';
import { SUPPORTED_LOCALES } from '@/types/i18n';
import {
  ORGANIC_SLUGS,
  buildOrganicPageJsonLd,
  getOrganicPage,
  getOrganicPageAlternates,
  getOrganicPageUrl,
} from '@/lib/organic-pages';
import { BUSINESS_CONTACT, BUSINESS_NAME, SITE_URL } from '@/lib/seo';

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
      siteName: BUSINESS_NAME,
      title: page.metaTitle,
      description: page.description,
      url: getOrganicPageUrl(lang, page.slug),
      images: [
        {
          url: page.image,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
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

  const related = ORGANIC_SLUGS.filter((item) => item !== page.slug)
    .slice(0, 4)
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
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href={`/${lang}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#7A8BA8]/16 bg-[#1F4268]/52 px-4 text-sm text-[#A0B0C8] transition hover:border-[#C8956C]/32 hover:text-[#E8DFD0]"
            >
              <span aria-hidden>←</span>
              {lang === 'en' ? 'Home' : lang === 'uz' ? 'Bosh sahifa' : 'На главную'}
            </Link>
            <a
              href={`tel:${BUSINESS_CONTACT.phone}`}
              className="hidden min-h-11 items-center gap-2 rounded-full bg-[#C8956C] px-5 text-sm font-semibold text-[#152E4A] transition hover:bg-[#D4A574] sm:inline-flex"
            >
              {BUSINESS_CONTACT.phoneDisplay}
            </a>
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
                <a
                  href={`/${lang}#contacts`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C8956C] px-7 text-sm font-bold text-[#152E4A] shadow-[0_18px_42px_rgba(200,149,108,0.18)] transition hover:-translate-y-0.5 hover:bg-[#D4A574]"
                >
                  {page.primaryCta}
                </a>
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
                alt={page.title}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1929]/74 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-[#07111C]/48 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm text-[#E8DFD0]">
                  <span className="text-[#C8956C]" aria-hidden>•</span>
                  {BUSINESS_CONTACT.streetAddress}, {lang === 'en' ? BUSINESS_CONTACT.localityEn : BUSINESS_CONTACT.localityRu}
                </div>
              </div>
            </div>
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
    </main>
  );
}
