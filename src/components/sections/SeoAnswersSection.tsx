import type { Locale } from '@/types/i18n';
import { getSeoContent } from '@/lib/seo';
import { ORGANIC_SLUGS, getOrganicPage } from '@/lib/organic-pages';

export function SeoAnswersSection({ lang }: { lang: Locale }) {
  const content = getSeoContent(lang);
  const visibleFaqs = content.faqs.slice(0, 4);
  const organicLinks = ORGANIC_SLUGS.map((slug) => getOrganicPage(slug, lang)).filter(Boolean);

  return (
    <section
      id="answers"
      className="relative overflow-hidden bg-[#152E4A] px-4 py-16 text-[#E8DFD0] md:px-6 md:py-20"
      aria-labelledby="answers-heading"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(200,149,108,0.08),transparent_42%),radial-gradient(circle_at_84%_18%,rgba(122,139,168,0.12),transparent_34%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[#C8956C]">
            {content.eyebrow}
          </p>
          <h2 id="answers-heading" className="max-w-2xl text-3xl font-light leading-tight md:text-5xl">
            {content.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#A0B0C8] md:text-lg">
            {content.intro}
          </p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {content.facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-[#7A8BA8]/12 bg-[#1F4268]/36 p-4 backdrop-blur-sm"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C8956C]/80">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-[#E8DFD0]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-3">
          {visibleFaqs.map((item, index) => (
            <article
              key={item.question}
              className="group rounded-2xl border border-[#7A8BA8]/12 bg-[#102844]/62 p-5 shadow-[0_18px_52px_rgba(0,0,0,0.16)] backdrop-blur-sm transition duration-300 hover:border-[#C8956C]/26 hover:bg-[#1F4268]/58 md:p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C8956C] text-xs font-bold text-[#152E4A]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-light leading-snug text-[#F7F2E8] md:text-xl">
                  {item.question}
                </h3>
              </div>
              <p className="text-sm leading-7 text-[#A0B0C8] md:text-base">{item.answer}</p>
            </article>
          ))}

          <nav
            aria-label={lang === 'en' ? 'Popular spa searches' : lang === 'uz' ? 'Mashhur spa so‘rovlari' : 'Популярные spa-запросы'}
            className="rounded-2xl border border-[#7A8BA8]/12 bg-[#1F4268]/30 p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8956C]/80">
              {lang === 'en' ? 'Popular searches' : lang === 'uz' ? 'Mashhur so‘rovlar' : 'Популярные запросы'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {organicLinks.map((item) => item && (
                <a
                  key={item.slug}
                  href={`/${lang}/services/${item.slug}`}
                  className="rounded-full border border-[#7A8BA8]/14 bg-[#102844]/62 px-3 py-2 text-xs font-medium text-[#E8DFD0]/86 transition hover:border-[#C8956C]/32 hover:text-[#F7F2E8]"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
