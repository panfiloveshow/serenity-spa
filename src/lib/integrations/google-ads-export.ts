import { getBotConfig } from '@/lib/bot/config';
import { resolveServiceInfo } from '@/lib/leads/catalog-price';
import { getLeadsStore } from '@/lib/leads/store';
import { formatAdsConversionTime, parseFlexibleDateToYmd } from '@/lib/leads/time';
import { logToFile } from '@/lib/logger';
import { formatUsdValue, getUsdRateUzs, uzsToUsdAmount } from './fx-rate';
import {
  ensureSheetTabAndHeaders,
  getAuthorizedSheetsClient,
  isGoogleSheetsConfiguredSync,
  notifyOwnerIntegrationError,
  sheetsApiRequest,
} from './google-sheets';

export type AdsConversionEventType = 'booked' | 'visited';

export const GOOGLE_ADS_SHEET_HEADERS = [
  'Google Click ID',
  'GBRAID',
  'WBRAID',
  'Conversion Name',
  'Conversion Time',
  'Conversion Value',
  'Conversion Currency',
] as const;

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export type AdsExportOutcome =
  | 'exported'
  | 'skipped_not_found'
  | 'skipped_spam'
  | 'skipped_already_sent'
  | 'skipped_no_click_id'
  | 'skipped_older_than_90_days'
  | 'pending_sheets_config'
  | 'error';

function escapeSheetTitle(title: string): string {
  return `'${title.replace(/'/g, "''")}'`;
}

function selectPrimaryClickId(lead: {
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
}): { type: 'gclid' | 'gbraid' | 'wbraid'; value: string } | null {
  if (lead.gclid && lead.gclid.trim()) return { type: 'gclid', value: lead.gclid.trim() };
  if (lead.gbraid && lead.gbraid.trim()) return { type: 'gbraid', value: lead.gbraid.trim() };
  if (lead.wbraid && lead.wbraid.trim()) return { type: 'wbraid', value: lead.wbraid.trim() };
  return null;
}

export async function maybeExportGoogleAdsConversion(
  leadId: string,
  eventType: AdsConversionEventType,
  conversionTime = new Date(),
): Promise<AdsExportOutcome> {
  const store = getLeadsStore();
  const cfg = getBotConfig();
  const lead = await store.getLead(leadId);
  if (!lead) return 'skipped_not_found';

  if (lead.status === 'spam') {
    await logToFile({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Google Ads conversion skipped (spam status)',
      data: { leadId, eventType },
    });
    return 'skipped_spam';
  }

  if (lead.adsConversionsSent[eventType]) {
    return 'skipped_already_sent';
  }

  const click = selectPrimaryClickId(lead);
  if (!click) {
    await logToFile({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Google Ads conversion skipped (no click ID)',
      data: { leadId, eventType },
    });
    return 'skipped_no_click_id';
  }

  const clickMs = Date.parse(lead.adClickAt || lead.createdAt);
  if (Number.isFinite(clickMs) && conversionTime.getTime() - clickMs > NINETY_DAYS_MS) {
    await logToFile({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Google Ads conversion skipped (click older than 90 days)',
      data: { leadId, eventType, clickIdType: click.type },
    });
    return 'skipped_older_than_90_days';
  }

  const conversionName = eventType === 'booked'
    ? cfg.adsConversionBooked
    : cfg.adsConversionVisited;

  const visitDateYmd = lead.appointmentDate || parseFlexibleDateToYmd(lead.requestedDate, conversionTime);
  const resolved = resolveServiceInfo(lead.service, visitDateYmd);
  const valueUzs = resolved.priceUzs ?? lead.servicePriceUzs;
  const frozenUsd = eventType === 'booked' ? lead.bookedValueUsd : lead.visitedValueUsd;
  const usdRate = await getUsdRateUzs();
  const valueUsd = typeof frozenUsd === 'number' && Number.isFinite(frozenUsd) && frozenUsd > 0
    ? frozenUsd
    : uzsToUsdAmount(valueUzs, usdRate);
  const formattedUsd = formatUsdValue(valueUsd);

  if (!isGoogleSheetsConfiguredSync()) {
    await logToFile({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Google Ads conversion queued (Google Sheets not configured)',
      data: {
        leadId,
        eventType,
        conversionName,
        clickIdType: click.type,
        valueUzs,
        valueUsd,
      },
    });
    return 'pending_sheets_config';
  }

  try {
    const client = await getAuthorizedSheetsClient();
    if (!client) {
      return 'pending_sheets_config';
    }

    await ensureSheetTabAndHeaders(
      client.spreadsheetId,
      cfg.adsTab,
      GOOGLE_ADS_SHEET_HEADERS,
      client.accessToken,
    );

    const row: string[] = [
      click.type === 'gclid' ? click.value : '',
      click.type === 'gbraid' ? click.value : '',
      click.type === 'wbraid' ? click.value : '',
      conversionName,
      formatAdsConversionTime(conversionTime),
      formattedUsd,
      formattedUsd ? 'USD' : '',
    ];

    const range = encodeURIComponent(`${escapeSheetTitle(cfg.adsTab)}!A:G`);
    await sheetsApiRequest(
      client.accessToken,
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(client.spreadsheetId)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        body: JSON.stringify({ values: [row] }),
      },
    );

    await store.updateLead(
      lead.id,
      current => {
        current.adsConversionsSent = {
          ...current.adsConversionsSent,
          [eventType]: {
            sentAt: conversionTime.toISOString(),
            clickIdType: click.type,
            clickId: click.value,
            value: valueUsd,
          },
        };
      },
      { preserveUpdatedAt: true },
    );

    await logToFile({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Google Ads conversion exported',
      data: {
        leadId: lead.id,
        eventType,
        conversionName,
        clickIdType: click.type,
        clickIdPreview: `${click.value.slice(0, 12)}…`,
        valueUzs,
        valueUsd,
      },
    });
    return 'exported';
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await logToFile({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Google Ads conversion export failed',
      data: { leadId: lead.id, eventType, conversionName, error: msg },
    });
    await notifyOwnerIntegrationError(
      `ads_export_${lead.id}_${eventType}`,
      `Ошибка передачи конверсии Google Ads (${conversionName})`,
      msg,
    );
    return 'error';
  }
}
