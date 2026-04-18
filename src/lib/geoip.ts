import { getRedisClient } from './redis';

export interface GeoInfo {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  isp: string;
  org: string;
  asName: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
  lat: number;
  lon: number;
}

const CACHE_TTL_SECONDS = 24 * 60 * 60;
const API_TIMEOUT_MS = 3000;

const FIELDS = [
  'status', 'country', 'countryCode', 'city', 'regionName',
  'isp', 'org', 'as', 'mobile', 'proxy', 'hosting', 'lat', 'lon',
].join(',');

function isPrivateOrLocal(ip: string): boolean {
  if (!ip || ip === 'Unknown') return true;
  if (ip.startsWith('10.') || ip.startsWith('127.') || ip === '::1') return true;
  if (ip.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  return false;
}

export async function getGeoInfo(ip: string): Promise<GeoInfo | null> {
  if (isPrivateOrLocal(ip)) return null;

  const redis = getRedisClient();
  const cacheKey = `geoip:${ip}`;

  if (redis) {
    try {
      await redis.connect().catch(() => {});
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as GeoInfo;
      }
    } catch {
      // Cache miss — fall through
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${FIELDS}&lang=ru`;
    const res = await fetch(url, { signal: controller.signal });

    if (!res.ok) return null;

    const data = await res.json() as Record<string, unknown>;
    if (data.status !== 'success') return null;

    const info: GeoInfo = {
      country: String(data.country ?? ''),
      countryCode: String(data.countryCode ?? ''),
      city: String(data.city ?? ''),
      region: String(data.regionName ?? ''),
      isp: String(data.isp ?? ''),
      org: String(data.org ?? ''),
      asName: String(data.as ?? ''),
      mobile: Boolean(data.mobile),
      proxy: Boolean(data.proxy),
      hosting: Boolean(data.hosting),
      lat: Number(data.lat ?? 0),
      lon: Number(data.lon ?? 0),
    };

    if (redis) {
      try {
        await redis.set(cacheKey, JSON.stringify(info), 'EX', CACHE_TTL_SECONDS);
      } catch {
        // Cache write failed — not critical
      }
    }

    return info;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return '';
  const base = 0x1F1E6 - 'A'.charCodeAt(0);
  return String.fromCodePoint(
    base + code.charCodeAt(0),
    base + code.charCodeAt(1),
  );
}
