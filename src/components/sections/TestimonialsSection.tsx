'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/lang-context';
import type { Locale } from '@/types/i18n';

const DATE_LOCALES: Record<Locale, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  uz: 'uz-UZ',
};

export interface Testimonial {
  id: string;
  name: string;
  service?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** ISO date string */
  date: string;
  /** Optional avatar URL */
  avatar?: string;
}

// Placeholder reviews — text lives in the dictionaries (per locale); rating/date here.
// Replace with real reviews from Google My Business / 2GIS / internal feedback.
const REVIEW_META: Array<Pick<Testimonial, 'id' | 'rating' | 'date'>> = [
  { id: 'p1', rating: 5, date: '2026-03-20' },
  { id: 'p2', rating: 5, date: '2026-03-15' },
  { id: 'p3', rating: 5, date: '2026-03-02' },
];

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex gap-0.5" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-[#C8956C]' : 'text-[#7A8BA8]/20'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection({ testimonials }: {
  testimonials?: Testimonial[];
}) {
  const { dictionary, locale } = useLang();
  const tx = dictionary.testimonials;

  // Default to the localized placeholder reviews (rating/date from REVIEW_META).
  const data: Testimonial[] = testimonials ?? tx.reviews.map((r, i) => ({
    ...REVIEW_META[i],
    name: r.name,
    service: r.service,
    text: r.text,
  }));

  if (!data.length) return null;

  const avgRating = data.reduce((s, t) => s + t.rating, 0) / data.length;
  const starsAria = (n: number) => tx.starsAria.replace('{n}', String(n));

  return (
    <section id="testimonials" className="relative py-20 md:py-28 px-6 md:px-12 lg:px-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <span className="block text-[#C8956C] tracking-[0.35em] uppercase text-[11px] md:text-xs mb-4 font-medium">
            {tx.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-[#E8DFD0] mb-4">
            {tx.title}
          </h2>
          <div className="flex items-center justify-center gap-3 text-[#7A8BA8]/60 text-sm">
            <StarRating rating={Math.round(avgRating)} label={starsAria(Math.round(avgRating))} />
            <span>{tx.ratingSummary.replace('{avg}', avgRating.toFixed(1)).replace('{count}', String(data.length))}</span>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-3xl bg-gradient-to-b from-[#1F4268]/40 to-[#1B3A5C]/40 border border-[#7A8BA8]/10 p-6 md:p-7 flex flex-col"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex items-center justify-between mb-4">
                <StarRating rating={t.rating} label={starsAria(t.rating)} />
                <meta itemProp="reviewRating" content={String(t.rating)} />
                <time
                  className="text-[#7A8BA8]/40 text-xs"
                  dateTime={t.date}
                  itemProp="datePublished"
                >
                  {new Date(t.date).toLocaleDateString(DATE_LOCALES[locale], { month: 'long', year: 'numeric' })}
                </time>
              </div>

              <p
                className="text-[#E8DFD0]/85 text-sm md:text-base leading-relaxed mb-5 flex-1"
                itemProp="reviewBody"
              >
                «{t.text}»
              </p>

              <footer className="flex items-center gap-3 pt-4 border-t border-[#7A8BA8]/8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8956C]/20 to-[#C8956C]/5 border border-[#C8956C]/15 flex items-center justify-center text-[#C8956C] font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#E8DFD0]/80 text-sm font-medium" itemProp="author">
                    {t.name}
                  </p>
                  {t.service && (
                    <p className="text-[#7A8BA8]/50 text-xs">{t.service}</p>
                  )}
                </div>
              </footer>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
