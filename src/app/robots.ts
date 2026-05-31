import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const AI_SEARCH_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Google-Extended',
  'Bingbot',
] as const;

const crawlablePublicSite = {
  allow: '/',
  disallow: ['/api/'],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        ...crawlablePublicSite,
      },
      ...AI_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        ...crawlablePublicSite,
      })),
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
