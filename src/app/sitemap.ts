import { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/types/i18n';

const BASE_URL = 'https://serenityspa.uz';

const pages = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}
