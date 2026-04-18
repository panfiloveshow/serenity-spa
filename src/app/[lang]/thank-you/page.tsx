import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types/i18n';
import { SUPPORTED_LOCALES } from '@/types/i18n';

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

  return {
    title: `${dict.booking.thankYouTitle} | Serenity Spa`,
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);
  const b = dict.booking;

  return (
    <main className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#C8956C]/20 to-[#C8956C]/5 border border-[#C8956C]/20 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_40px_rgba(200,149,108,0.15)]">
          <svg
            className="w-11 h-11 text-[#C8956C]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-semibold text-[#E8DFD0] mb-3 tracking-tight">
          {b.thankYouTitle}
        </h1>
        <p className="text-[#A0B0C8] text-base leading-relaxed mb-10">
          {b.thankYouSubtitle}
        </p>

        {/* Back button */}
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C8956C] to-[#A07550] text-[#1B3A5C] font-semibold text-sm tracking-wide shadow-[0_8px_30px_rgba(200,149,108,0.25)] hover:shadow-[0_12px_40px_rgba(200,149,108,0.35)] transition-all duration-300"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {b.thankYouBack}
        </Link>
      </div>
    </main>
  );
}
