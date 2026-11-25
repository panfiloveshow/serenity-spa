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
  // Invalidate older incomplete entries, which otherwise suppress the fallback.
  const cacheKey = `geoip:v2:${ip}`;

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

  const primaryData = await fetchGeoJson(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${FIELDS}&lang=ru`);
  let info = primaryData?.status === 'success' ? fromPrimary(primaryData) : null;

  if (!info || (!info.country && !info.countryCode) || !info.city || !(info.isp || info.org || info.asName)) {
    const fallbackData = await fetchGeoJson(`https://ipwho.is/${encodeURIComponent(ip)}`);
    const fallback = fallbackData?.success === true ? fromFallback(fallbackData) : null;
    if (fallback) info = info ? mergeGeoInfo(info, fallback) : fallback;
  }

  // Do not cache an incomplete result: a later booking can retry both providers.
  if (redis && info && (info.country || info.countryCode) && (info.isp || info.org || info.asName)) {
    try {
      await redis.set(cacheKey, JSON.stringify(info), 'EX', CACHE_TTL_SECONDS);
    } catch {
      // Cache write failed — not critical.
    }
  }
  return info;
}

async function fetchGeoJson(url: string): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function fromPrimary(data: Record<string, unknown>): GeoInfo {
  return {
    country: String(data.country ?? ''), countryCode: String(data.countryCode ?? ''),
    city: String(data.city ?? ''), region: String(data.regionName ?? ''),
    isp: String(data.isp ?? ''), org: String(data.org ?? ''), asName: String(data.as ?? ''),
    mobile: data.mobile === true, proxy: data.proxy === true, hosting: data.hosting === true,
    lat: Number(data.lat ?? 0), lon: Number(data.lon ?? 0),
  };
}

function fromFallback(data: Record<string, unknown>): GeoInfo {
  const connection = data.connection && typeof data.connection === 'object'
    ? data.connection as Record<string, unknown> : {};
  const org = String(connection.org ?? '');
  const asn = String(connection.asn ?? '');
  return {
    country: String(data.country ?? ''), countryCode: String(data.country_code ?? ''),
    city: String(data.city ?? ''), region: String(data.region ?? ''),
    isp: String(connection.isp ?? ''), org, asName: [asn ? `AS${asn}` : '', org].filter(Boolean).join(' '),
    // The free fallback has no security data; absence must not fabricate flags.
    mobile: false, proxy: false, hosting: false,
    lat: Number(data.latitude ?? 0), lon: Number(data.longitude ?? 0),
  };
}

function mergeGeoInfo(primary: GeoInfo, fallback: GeoInfo): GeoInfo {
  // Do not attach a fallback city to a different country from the primary.
  const sameCountry = !primary.countryCode || !fallback.countryCode
    || primary.countryCode.toUpperCase() === fallback.countryCode.toUpperCase();
  return {
    country: primary.country || fallback.country,
    countryCode: primary.countryCode || fallback.countryCode,
    city: primary.city || (sameCountry ? fallback.city : ''),
    region: primary.region || (sameCountry ? fallback.region : ''),
    isp: primary.isp || fallback.isp,
    org: primary.org || fallback.org,
    asName: primary.asName || fallback.asName,
    mobile: primary.mobile, proxy: primary.proxy, hosting: primary.hosting,
    lat: primary.lat || (sameCountry ? fallback.lat : 0),
    lon: primary.lon || (sameCountry ? fallback.lon : 0),
  };
}

export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return '';
  const base = 0x1F1E6 - 'A'.charCodeAt(0);
  return String.fromCodePoint(
    base + code.charCodeAt(0),
    base + code.charCodeAt(1),
  );
}
