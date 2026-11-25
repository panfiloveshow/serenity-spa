import { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/types/i18n';
import { CONTENT_UPDATED, SITE_URL } from '@/lib/seo';
import { ORGANIC_SLUGS } from '@/lib/organic-pages';

const BASE_URL = SITE_URL;

const ROUTE_PATHS = ['', ...ORGANIC_SLUGS.map((slug) => `/services/${slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, `${BASE_URL}/${locale}`]),
  );
  languages['x-default'] = `${BASE_URL}/ru`;

  for (const locale of SUPPORTED_LOCALES) {
    for (const routePath of ROUTE_PATHS) {
      entries.push({
        url: `${BASE_URL}/${locale}${routePath}`,
        lastModified: CONTENT_UPDATED,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages).map(([key, url]) => [key, `${url}${routePath}`]),
          ),
        },
      });
    }
  }

  return entries;
}
