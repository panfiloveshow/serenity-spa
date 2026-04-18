import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types/i18n';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/types/i18n';

const BASE_URL = 'https://serenityspa.uz';

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
    languages[locale] = `${BASE_URL}/${locale}/terms`;
  }
  languages['x-default'] = `${BASE_URL}/${DEFAULT_LOCALE}/terms`;

  return {
    title: dict.terms.metaTitle,
    description: dict.terms.metaDescription,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${lang}/terms`,
      languages,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-[#152E4A] text-[#E8DFD0] px-6 py-24">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-light mb-8">{dict.terms.title}</h1>
        <div className="space-y-6 text-[#E8DFD0]/75 leading-relaxed">
          {dict.terms.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl text-[#C8956C] mb-2">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
