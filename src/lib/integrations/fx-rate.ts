export const DEFAULT_UZS_PER_USD = 11980.36;

const CBU_USD_RATE_URL = 'https://cbu.uz/ru/arkhiv-kursov-valyut/json/USD/';
const DAY_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 3000;

let cachedRate: { rate: number; fetchedAt: number } | null = null;

export async function getUsdRateUzs(): Promise<number> {
  const envRaw = process.env.UZS_PER_USD?.trim();
  if (envRaw) {
    const parsedEnv = Number(envRaw);
    if (Number.isFinite(parsedEnv) && parsedEnv > 0) {
      return parsedEnv;
    }
  }

  if (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test') {
    return DEFAULT_UZS_PER_USD;
  }

  const now = Date.now();
  if (cachedRate && now - cachedRate.fetchedAt < DAY_MS) {
    return cachedRate.rate;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(CBU_USD_RATE_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return cachedRate?.rate ?? DEFAULT_UZS_PER_USD;
    }
    const data = (await res.json()) as Array<{ Rate?: string }>;
    const rate = Number(data?.[0]?.Rate);
    if (Number.isFinite(rate) && rate > 1000) {
      cachedRate = { rate, fetchedAt: now };
      return rate;
    }
    return cachedRate?.rate ?? DEFAULT_UZS_PER_USD;
  } catch {
    return cachedRate?.rate ?? DEFAULT_UZS_PER_USD;
  } finally {
    clearTimeout(timeout);
  }
}

export function uzsToUsdAmount(
  uzs: number | null | undefined,
  uzsPerUsd: number,
): number | null {
  if (
    typeof uzs !== 'number'
    || !Number.isFinite(uzs)
    || uzs <= 0
    || !Number.isFinite(uzsPerUsd)
    || uzsPerUsd <= 0
  ) {
    return null;
  }
  return Math.round((uzs / uzsPerUsd) * 100) / 100;
}

export function formatUsdValue(usd: number | null | undefined): string {
  return typeof usd === 'number' && Number.isFinite(usd) && usd > 0
    ? usd.toFixed(2)
    : '';
}
