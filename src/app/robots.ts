import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    host: 'https://serenityspa.uz',
    sitemap: 'https://serenityspa.uz/sitemap.xml',
  };
}
