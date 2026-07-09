import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  checks: {
    redis: 'up' | 'down' | 'unknown';
    telegram_configured: boolean;
  };
}

async function pingRedis(timeoutMs = 1000): Promise<'up' | 'down'> {
  const client = getRedisClient();
  if (!client) return 'down';
  try {
    // ioredis auto-connects on first command with lazyConnect.
    // Calling connect() when status === 'ready' throws — guard it.
    if (client.status === 'wait' || client.status === 'end') {
      await client.connect().catch(() => {});
    }
    const result = await Promise.race([
      client.ping(),
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
    ]);
    return result === 'PONG' ? 'up' : 'down';
  } catch {
    return 'down';
  }
}

function hasDetailedHealthAccess(request: NextRequest): boolean {
  const healthToken = process.env.HEALTHCHECK_TOKEN;
  if (!healthToken) return false;

  const bearer = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];

  return bearer === healthToken;
}

export async function GET(request: NextRequest) {
  if (hasDetailedHealthAccess(request)) {
    const { body, httpStatus } = await getDetailedHealth();
    return NextResponse.json(body, {
      status: httpStatus,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }

  return NextResponse.json(
    { status: 'ok' },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

async function getDetailedHealth() {
  const redisStatus = await pingRedis();
  const telegramConfigured = Boolean(process.env.TG_BOT_TOKEN && process.env.TG_CHAT_ID);

  const status: HealthStatus['status'] =
    redisStatus === 'up' && telegramConfigured ? 'ok'
    : redisStatus === 'down' ? 'degraded'
    : 'error';

  const body: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    checks: {
      redis: redisStatus,
      telegram_configured: telegramConfigured,
    },
  };

  const httpStatus = status === 'ok' ? 200 : status === 'degraded' ? 200 : 503;
  return { body, httpStatus };
}
