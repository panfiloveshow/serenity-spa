import { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/types/i18n';
import { SITE_URL } from '@/lib/seo';
import { ORGANIC_SLUGS } from '@/lib/organic-pages';

const BASE_URL = SITE_URL;

const pages = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
];

const organicPages = ORGANIC_SLUGS.map((slug) => ({
  path: `/services/${slug}`,
  changeFrequency: 'monthly' as const,
  priority: 0.82,
}));

const machineReadablePages = [
  { path: '/llms.txt', changeFrequency: 'monthly' as const, priority: 0.2 },
  { path: '/services.md', changeFrequency: 'monthly' as const, priority: 0.2 },
  { path: '/pricing.md', changeFrequency: 'monthly' as const, priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, `${BASE_URL}/${locale}`]),
  );
  languages['x-default'] = `${BASE_URL}/ru`;

  for (const locale of SUPPORTED_LOCALES) {
    for (const page of [...pages, ...organicPages]) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages).map(([key, url]) => [key, `${url}${page.path}`]),
          ),
        },
      });
    }
  }

  for (const page of machineReadablePages) {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  return entries;
}
