import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.doubleclick.net https://www.googleadservices.com https://*.googleadservices.com https://mc.yandex.ru https://mc.yandex.uz https://mc.yandex.com`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data: blob: https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://www.googletagmanager.com https://*.google-analytics.com https://www.google.com https://*.google.com https://*.doubleclick.net https://www.googleadservices.com https://mc.yandex.ru https://mc.yandex.uz https://mc.yandex.com`,
      `frame-src https://www.openstreetmap.org`,
      `connect-src 'self' https://api.telegram.org https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://region1.google-analytics.com https://*.doubleclick.net https://www.google.com https://*.google.com https://www.googleadservices.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://mc.yandex.ru https://mc.yandex.uz https://mc.yandex.com wss://mc.yandex.ru wss://mc.yandex.com`,
      `media-src 'none'`,
      `object-src 'none'`,
      `worker-src 'self' blob:`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 76, 80, 85, 90],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    const immutableCache = {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    };
    const headers: { source: string; headers: { key: string; value: string }[] }[] = [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
    // Only apply long-lived caching in production — in dev, Turbopack hashes are not always
    // invalidated between file edits, and `immutable` makes the browser ignore new CSS/JS.
    if (isProd) {
      headers.push(
        {
          // Next.js fingerprinted assets — safe to cache forever
          source: '/_next/static/:path*',
          headers: [immutableCache],
        },
        {
          // Fonts / svgs / images shipped from /public — fingerprint-less but rarely change
          source: '/:path(.*\\.(?:svg|jpg|jpeg|png|webp|avif|woff2|woff|ttf|ico)$)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
        }
      );
    }
    // In dev, explicitly mark static chunks as no-store so Turbopack hash-reuse
    // never serves stale JS/CSS from the browser disk cache.
    if (!isProd) {
      headers.push({
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      });
    }
    headers.push({
      // API must never be cached — responses contain per-request state
      source: '/api/:path*',
      headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
    });
    return headers;
  },
};

export default withBundleAnalyzer(nextConfig);
