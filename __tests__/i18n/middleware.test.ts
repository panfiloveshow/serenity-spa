/**
 * Feature: multi-language-support, Property 3: Редирект middleware для отсутствующего/невалидного префикса
 *
 * URL без валидного языкового префикса → redirect на `/ru` + путь.
 * URL с валидным языковым префиксом → пропускается без редиректа.
 * Validates: Requirements 1.2, 10.1
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/types/i18n';

// --- Mocks for next/server ---

let lastRedirectUrl: string | null = null;
let lastResponseType: 'next' | 'redirect' | null = null;

vi.mock('next/server', () => ({
  NextResponse: {
    next: () => {
      lastResponseType = 'next';
      return { type: 'next' };
    },
    redirect: (url: { pathname: string }) => {
      lastResponseType = 'redirect';
      lastRedirectUrl = url.pathname;
      return { type: 'redirect', url };
    },
  },
}));

function createMockRequest(pathname: string) {
  return {
    nextUrl: {
      pathname,
      clone() {
        return { pathname: this.pathname };
      },
    },
  } as unknown as import('next/server').NextRequest;
}

// Import middleware after mocks are set up
const { middleware } = await import('@/middleware');

// --- Arbitraries ---

/** Generates a random path segment (no slashes, no dots, not a supported locale) */
const pathSegmentArb = fc
  .stringMatching(/^[a-z0-9_-]{1,20}$/)
  .filter((s) => !(SUPPORTED_LOCALES as readonly string[]).includes(s));

/** Generates a random multi-segment path like /foo/bar/baz */
const subpathArb = fc
  .array(fc.stringMatching(/^[a-z0-9_-]{1,12}$/), { minLength: 0, maxLength: 4 })
  .map((segments) => segments.length > 0 ? '/' + segments.join('/') : '');

/** Generates a path that does NOT start with a valid locale prefix */
const invalidPrefixPathArb = fc
  .tuple(pathSegmentArb, fc.array(fc.stringMatching(/^[a-z0-9_-]{1,12}$/), { minLength: 0, maxLength: 3 }))
  .map(([first, rest]) => '/' + [first, ...rest].join('/'));

/** Generates a valid locale */
const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

describe('Property 3: Редирект middleware для отсутствующего/невалидного префикса', () => {
  beforeEach(() => {
    lastRedirectUrl = null;
    lastResponseType = null;
  });

  it('URL без валидного языкового префикса → redirect на /ru + путь', () => {
    fc.assert(
      fc.property(invalidPrefixPathArb, (pathname) => {
        lastRedirectUrl = null;
        lastResponseType = null;

        const req = createMockRequest(pathname);
        middleware(req);

        expect(lastResponseType).toBe('redirect');
        expect(lastRedirectUrl).toBe(`/${DEFAULT_LOCALE}${pathname}`);
      }),
      { numRuns: 150 },
    );
  });

  it('URL с валидным языковым префиксом → пропускается без редиректа', () => {
    fc.assert(
      fc.property(localeArb, subpathArb, (locale, subpath) => {
        lastRedirectUrl = null;
        lastResponseType = null;

        const pathname = `/${locale}${subpath}`;
        const req = createMockRequest(pathname);
        middleware(req);

        expect(lastResponseType).toBe('next');
        expect(lastRedirectUrl).toBeNull();
      }),
      { numRuns: 150 },
    );
  });

  it('корневой URL "/" → redirect на /ru', () => {
    const req = createMockRequest('/');
    middleware(req);

    expect(lastResponseType).toBe('redirect');
    expect(lastRedirectUrl).toBe(`/${DEFAULT_LOCALE}/`);
  });

  it('URL со статическим файлом (содержит точку) → пропускается', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/logo.svg', '/image.png', '/favicon.ico', '/styles.css'),
        (pathname) => {
          lastRedirectUrl = null;
          lastResponseType = null;

          const req = createMockRequest(pathname);
          middleware(req);

          expect(lastResponseType).toBe('next');
        },
      ),
      { numRuns: 10 },
    );
  });

  it('URL с /_next или /api → пропускается', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/_next/static/chunk.js', '/_next/data/page.json', '/api/booking', '/api/health'),
        (pathname) => {
          lastRedirectUrl = null;
          lastResponseType = null;

          const req = createMockRequest(pathname);
          middleware(req);

          expect(lastResponseType).toBe('next');
        },
      ),
      { numRuns: 10 },
    );
  });
});
