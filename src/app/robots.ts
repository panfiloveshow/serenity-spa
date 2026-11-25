import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Search-grounding and user-initiated retrieval agents (ChatGPT Search, Perplexity,
 * Claude Search, Apple Intelligence / Siri, Bing Copilot, DuckAssist).
 */
export const AI_SEARCH_AND_USER_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'Applebot',
  'Bingbot',
  'DuckAssistBot',
] as const;

/**
 * Model-training and knowledge-index crawlers. Explicitly permitted for a local
 * hospitality brand so foundation models retain accurate Tashkent entity facts,
 * while kept structurally separate from search-retrieval bots for independent governance.
 */
export const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
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
      ...AI_SEARCH_AND_USER_BOTS.map((userAgent) => ({
        userAgent,
        ...crawlablePublicSite,
      })),
      ...AI_TRAINING_BOTS.map((userAgent) => ({
        userAgent,
        ...crawlablePublicSite,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
