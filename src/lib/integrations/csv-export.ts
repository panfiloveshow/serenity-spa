import { timingSafeEqual } from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { getBotConfig } from '@/lib/bot/config';
import { resolveServiceInfo } from '@/lib/leads/catalog-price';
import { getLeadsStore } from '@/lib/leads/store';
import { formatAdsConversionTime, parseFlexibleDateToYmd } from '@/lib/leads/time';
import type { LeadRecord } from '@/lib/leads/types';
import { logToFile } from '@/lib/logger';
import { GOOGLE_ADS_SHEET_HEADERS } from './google-ads-export';
import { DEFAULT_UZS_PER_USD, formatUsdValue, getUsdRateUzs, uzsToUsdAmount } from './fx-rate';
import { LEADS_SHEET_HEADERS, leadToSheetRow } from './google-sheets';

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export type AdsNameFilter = 'all' | 'zapis' | 'vizit';

export function parseAdsNameFilter(raw: string | null | undefined): AdsNameFilter | null {
  const normalized = (raw ?? '').trim().toLowerCase();
  if (!normalized || normalized === 'all') return 'all';
  if (normalized === 'zapis' || normalized === 'booked') return 'zapis';
  if (normalized === 'vizit' || normalized === 'visited') return 'vizit';
  return null;
}

function safeEqualUtf8(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyExportRequestToken(
  request: NextRequest,
  options?: { allowBasicAuth?: boolean },
): { ok: true } | { ok: false; status: 401 | 503; error: string } {
  const cfg = getBotConfig();
  const allowBasicAuth = Boolean(options?.allowBasicAuth);
  const authHeader = request.headers.get('authorization') || '';

  if (allowBasicAuth) {
    const basicMatch = authHeader.match(/^Basic\s+(.+)$/i);
    if (basicMatch) {
      if (!cfg.adsBasicUser || !cfg.adsBasicPass) {
        return { ok: false, status: 503, error: 'Basic auth not configured' };
      }
      const decoded = Buffer.from(basicMatch[1].trim(), 'base64').toString('utf8');
      const colonIdx = decoded.indexOf(':');
      if (colonIdx === -1) {
        return { ok: false, status: 401, error: 'Unauthorized' };
      }
      const user = decoded.slice(0, colonIdx);
      const pass = decoded.slice(colonIdx + 1);
      const userOk = safeEqualUtf8(user, cfg.adsBasicUser);
      const passOk = safeEqualUtf8(pass, cfg.adsBasicPass);
      if (userOk && passOk) {
        return { ok: true };
      }
      return { ok: false, status: 401, error: 'Unauthorized' };
    }
  }

  if (!cfg.exportToken && (!allowBasicAuth || !cfg.adsBasicPass)) {
    return { ok: false, status: 503, error: 'Export token not configured' };
  }

  const queryToken = request.nextUrl.searchParams.get('token')?.trim() || '';
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const bearerToken = bearerMatch?.[1]?.trim() || '';
  const provided = queryToken || bearerToken;

  if (!provided || !cfg.exportToken || !safeEqualUtf8(provided, cfg.exportToken)) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }
  return { ok: true };
}

function escapeCsvCell(raw: string, protectFormulas = true): string {
  let value = raw;
  if (protectFormulas && /^[=@\t\r]/.test(value)) {
    value = `'${value}`;
  }
  if (/[",\n\r]/.test(value) || value.startsWith('+')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function encodeCsvRow(cells: readonly string[], protectFormulas = true): string {
  return cells.map(c => escapeCsvCell(String(c ?? ''), protectFormulas)).join(',');
}

export function buildLeadsCsv(leads: LeadRecord[]): string {
  const sorted = [...leads].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  const lines = [
    encodeCsvRow(LEADS_SHEET_HEADERS, false),
    ...sorted.map(lead => encodeCsvRow(leadToSheetRow(lead), true)),
  ];
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

function selectPrimaryClickId(lead: LeadRecord): {
  type: 'gclid' | 'gbraid' | 'wbraid';
  value: string;
} | null {
  if (lead.gclid && lead.gclid.trim()) return { type: 'gclid', value: lead.gclid.trim() };
  if (lead.gbraid && lead.gbraid.trim()) return { type: 'gbraid', value: lead.gbraid.trim() };
  if (lead.wbraid && lead.wbraid.trim()) return { type: 'wbraid', value: lead.wbraid.trim() };
  return null;
}

export function buildGoogleAdsCsv(
  leads: LeadRecord[],
  options?: { filter?: AdsNameFilter; uzsPerUsd?: number },
): { csv: string; rowCount: number } {
  const cfg = getBotConfig();
  const filter: AdsNameFilter = options?.filter ?? 'all';
  const uzsPerUsd = options?.uzsPerUsd ?? DEFAULT_UZS_PER_USD;
  const rows: string[][] = [];

  const sorted = [...leads].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  );

  for (const lead of sorted) {
    if (lead.status === 'spam') continue;
    const click = selectPrimaryClickId(lead);
    if (!click) continue;

    const clickMs = Date.parse(lead.adClickAt || lead.createdAt);
    const pushEvent = (
      conversionName: string,
      eventIso: string,
      frozenUsd: number | null | undefined,
    ) => {
      const eventDate = new Date(eventIso);
      if (Number.isNaN(eventDate.getTime())) return;
      if (Number.isFinite(clickMs) && eventDate.getTime() - clickMs > NINETY_DAYS_MS) {
        return;
      }

      let valueUsd: number | null =
        typeof frozenUsd === 'number' && Number.isFinite(frozenUsd) && frozenUsd > 0
          ? frozenUsd
          : null;
      if (valueUsd === null) {
        const visitDateYmd = lead.appointmentDate || parseFlexibleDateToYmd(lead.requestedDate, eventDate);
        const resolved = resolveServiceInfo(lead.service, visitDateYmd);
        const valueUzs = resolved.priceUzs ?? lead.servicePriceUzs;
        valueUsd = uzsToUsdAmount(valueUzs, uzsPerUsd);
      }

      const formattedValue = formatUsdValue(valueUsd);

      rows.push([
        click.type === 'gclid' ? click.value : '',
        click.type === 'gbraid' ? click.value : '',
        click.type === 'wbraid' ? click.value : '',
        conversionName,
        formatAdsConversionTime(eventDate),
        formattedValue,
        formattedValue ? 'USD' : '',
      ]);
    };

    const isBookedOrPostBooked = Boolean(lead.bookedAt)
      || ['booked', 'visited', 'no_show', 'wont_come'].includes(lead.status);
    if (isBookedOrPostBooked && (filter === 'all' || filter === 'zapis')) {
      pushEvent(cfg.adsConversionBooked, lead.bookedAt || lead.updatedAt, lead.bookedValueUsd);
    }

    if (lead.status === 'visited' && (filter === 'all' || filter === 'vizit')) {
      pushEvent(cfg.adsConversionVisited, lead.visitedAt || lead.updatedAt, lead.visitedValueUsd);
    }
  }

  const lines = [
    encodeCsvRow(GOOGLE_ADS_SHEET_HEADERS, false),
    ...rows.map(r => encodeCsvRow(r, true)),
  ];
  return { csv: `${lines.join('\r\n')}\r\n`, rowCount: rows.length };
}

export async function handleGoogleAdsCsvRequest(
  request: NextRequest,
  forcedFilter?: AdsNameFilter,
): Promise<NextResponse> {
  const auth = verifyExportRequestToken(request, { allowBasicAuth: true });
  if (!auth.ok) {
    const headers: Record<string, string> = {
      'Cache-Control': 'no-store, max-age=0',
    };
    if (auth.status === 401) {
      headers['WWW-Authenticate'] = 'Basic realm="Serenity Spa Google Ads Export", charset="UTF-8"';
    }
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers });
  }

  const filter = forcedFilter ?? parseAdsNameFilter(request.nextUrl.searchParams.get('name'));
  if (!filter) {
    return NextResponse.json(
      { error: 'Invalid name filter. Expected zapis or vizit.' },
      { status: 400 },
    );
  }

  const [leads, uzsPerUsd] = await Promise.all([
    getLeadsStore().listLeads(),
    getUsdRateUzs(),
  ]);
  const { csv, rowCount } = buildGoogleAdsCsv(leads, { filter, uzsPerUsd });

  await logToFile({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Google Ads CSV feed pulled',
    data: { rows: rowCount, filter, uzsPerUsd },
  });

  const filename = `google-ads${filter === 'all' ? '' : `-${filter}`}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
