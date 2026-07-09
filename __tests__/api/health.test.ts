import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

describe('/api/health', () => {
  afterEach(() => {
    delete process.env.HEALTHCHECK_TOKEN;
    vi.resetModules();
  });

  it('returns only public minimal health without a token', async () => {
    vi.resetModules();
    delete process.env.HEALTHCHECK_TOKEN;
    const { GET } = await import('@/app/api/health/route');

    const response = await GET(new NextRequest('https://serenityspa.uz/api/health'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: 'ok' });
    expect(body).not.toHaveProperty('checks');
    expect(body).not.toHaveProperty('uptime');
  });

  it('does not reveal detailed health for a wrong bearer token', async () => {
    vi.resetModules();
    process.env.HEALTHCHECK_TOKEN = 'correct-token';
    const { GET } = await import('@/app/api/health/route');

    const response = await GET(new NextRequest('https://serenityspa.uz/api/health', {
      headers: { authorization: 'Bearer wrong' },
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: 'ok' });
    expect(body).not.toHaveProperty('checks');
  });

  it('does not accept detailed health tokens in the URL', async () => {
    vi.resetModules();
    process.env.HEALTHCHECK_TOKEN = 'correct-token';
    const { GET } = await import('@/app/api/health/route');

    const response = await GET(new NextRequest('https://serenityspa.uz/api/health?token=correct-token'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: 'ok' });
  });
});
