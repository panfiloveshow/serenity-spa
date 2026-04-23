import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (typeof window !== 'undefined') return null; // Client-side guard
  
  if (!redis) {
    try {
      redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6380', 10),
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        lazyConnect: true,
      });

      redis.on('error', (err) => {
        console.error('Redis connection error:', err);
      });

      redis.on('connect', () => {
        console.log('Redis connected successfully');
      });
    } catch (error) {
      console.error('Failed to create Redis client:', error);
      return null;
    }
  }

  return redis;
}

/**
 * Strict behavior:
 *  - Redis up: precise counter, allows up to `limit` in window
 *  - Redis down: fail-CLOSED after 3 consecutive errors so attackers can't DoS Redis to bypass RL
 *  - The memory fallback below gives sane behavior during transient restarts
 */
const MEM_COUNTERS = new Map<string, { count: number; resetAt: number }>();
let redisFailCount = 0;

function checkMemoryLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = MEM_COUNTERS.get(key);
  if (!entry || entry.resetAt < now) {
    MEM_COUNTERS.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

// ioredis with lazyConnect auto-connects on first command. Calling .connect()
// a second time on a ready client throws "Redis is already connecting/connected",
// so only connect when the client is still in 'wait'/'end' state.
async function ensureConnected(client: Redis): Promise<void> {
  if (client.status === 'wait' || client.status === 'end') {
    await client.connect().catch((err) => {
      // Swallow "already connecting" race — the command will still queue and run
      if (!String(err?.message || '').includes('already connecting')) {
        throw err;
      }
    });
  }
}

export async function checkRateLimitRedis(key: string, limit: number, windowMs: number): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    // No Redis client at all — use in-memory fallback (single-instance only)
    return checkMemoryLimit(key, limit, windowMs);
  }

  try {
    await ensureConnected(client);
    const current = await client.incr(key);
    if (current === 1) {
      await client.pexpire(key, windowMs);
    }
    redisFailCount = 0; // reset on success
    return current <= limit;
  } catch (error) {
    redisFailCount += 1;
    console.error(`Redis rate limit check error (fail #${redisFailCount}):`, error);
    // After a few consecutive failures, fail-CLOSED to prevent bypass via Redis DoS
    if (redisFailCount > 3) return false;
    // Transient error — use memory fallback
    return checkMemoryLimit(key, limit, windowMs);
  }
}

/**
 * Increment a 24-hour rolling counter and return the new value.
 * Used to count submissions-per-IP and submissions-per-phone.
 * Returns 1 on Redis failure so logic degrades gracefully.
 */
export async function incrDailyCounter(key: string): Promise<number> {
  const client = getRedisClient();
  if (!client) return 1;

  try {
    await ensureConnected(client);
    const current = await client.incr(key);
    if (current === 1) {
      await client.pexpire(key, 24 * 60 * 60 * 1000);
    }
    return current;
  } catch (error) {
    console.error('Redis incrDailyCounter error:', error);
    return 1;
  }
}

export async function getRateLimitInfo(key: string): Promise<{ count: number; ttl: number } | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    await ensureConnected(client);

    const count = await client.get(key);
    const ttl = await client.pttl(key);

    return {
      count: count ? parseInt(count, 10) : 0,
      ttl: ttl > 0 ? ttl : 0,
    };
  } catch (error) {
    console.error('Redis get rate limit info error:', error);
    return null;
  }
}
