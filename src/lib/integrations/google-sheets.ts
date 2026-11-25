import { createSign } from 'crypto';
import { readFile } from 'fs/promises';
import { getBotConfig } from '@/lib/bot/config';
import { escapeHtml, notifyOwnersDm } from '@/lib/bot/telegram-api';
import { getLeadsStore } from '@/lib/leads/store';
import { formatDdMmYyyy, formatSheetsTimestamp } from '@/lib/leads/time';
import { STATUS_LABELS, type LeadRecord } from '@/lib/leads/types';
import { logToFile } from '@/lib/logger';

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

export const LEADS_SHEET_HEADERS = [
  'ID',
  'Дата заявки',
  'Имя',
  'Телефон / Контакт',
  'Услуга',
  'Цена (UZS)',
  'Источник',
  'Кампания',
  'Сеть',
  'gclid',
  'gbraid',
  'wbraid',
  'Риск',
  'Статус',
  'Дата визита',
  'Время визита',
  'Причина отказа',
  'Попыток дозвона',
  'Менеджер',
  'Первый ответ (мин)',
  'История статусов',
] as const;

const SHEETS_TIMEOUT_MS = 12_000;
const ERROR_DM_THROTTLE_MS = 15 * 60 * 1000;

let tokenCache: { email: string; token: string; expiresAt: number } | null = null;
const ensuredTabs = new Set<string>();
const lastErrorDmAt = new Map<string, number>();
let sheetsSerial: Promise<unknown> = Promise.resolve();

function enqueueSheets<T>(fn: () => Promise<T>): Promise<T> {
  const run = sheetsSerial.then(fn, fn);
  sheetsSerial = run.catch(() => {});
  return run;
}

function escapeSheetTitle(title: string): string {
  return `'${title.replace(/'/g, "''")}'`;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = SHEETS_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function loadServiceAccountCredentials(): Promise<ServiceAccountCredentials | null> {
  const cfg = getBotConfig();
  if (!cfg.spreadsheetId) return null;

  let rawJson = '';
  if (cfg.serviceAccountJson) {
    rawJson = cfg.serviceAccountJson.startsWith('{')
      ? cfg.serviceAccountJson
      : Buffer.from(cfg.serviceAccountJson, 'base64').toString('utf8');
  } else if (cfg.serviceAccountKeyFile) {
    rawJson = await readFile(cfg.serviceAccountKeyFile, 'utf8');
  } else {
    return null;
  }

  const parsed = JSON.parse(rawJson) as Partial<ServiceAccountCredentials>;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Invalid Google service account credentials (missing client_email or private_key)');
  }
  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, '\n'),
  };
}

export function isGoogleSheetsConfiguredSync(): boolean {
  const cfg = getBotConfig();
  return Boolean(cfg.spreadsheetId && (cfg.serviceAccountJson || cfg.serviceAccountKeyFile));
}

async function getGoogleAccessToken(creds: ServiceAccountCredentials): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.email === creds.client_email && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.token;
  }

  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;
  const headerB64 = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claimB64 = Buffer.from(
    JSON.stringify({
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp,
      iat,
    }),
  ).toString('base64url');

  const signingInput = `${headerB64}.${claimB64}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(creds.private_key, 'base64url');
  const assertion = `${signingInput}.${signature}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  }).toString();

  const res = await fetchWithTimeout('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Google OAuth token error (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new Error('Google OAuth response missing access_token');
  }

  const ttlMs = Math.min((data.expires_in ?? 3600) - 60, 3300) * 1000;
  tokenCache = {
    email: creds.client_email,
    token: data.access_token,
    expiresAt: now + Math.max(60_000, ttlMs),
  };
  return data.access_token;
}

export async function sheetsApiRequest<T = Record<string, unknown>>(
  accessToken: string,
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetchWithTimeout(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Google Sheets API error (${res.status}): ${errText.slice(0, 400)}`);
  }
  return (await res.json()) as T;
}

export async function ensureSheetTabAndHeaders(
  spreadsheetId: string,
  tabName: string,
  headers: readonly string[],
  accessToken: string,
): Promise<void> {
  const cacheKey = `${spreadsheetId}::${tabName}`;
  if (ensuredTabs.has(cacheKey)) return;

  const meta = await sheetsApiRequest<{
    sheets?: Array<{ properties?: { title?: string } }>;
  }>(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties.title`,
    { method: 'GET' },
  );

  const exists = (meta.sheets ?? []).some(s => s.properties?.title === tabName);
  if (!exists) {
    await sheetsApiRequest(
      accessToken,
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [{ addSheet: { properties: { title: tabName } } }],
        }),
      },
    );
  }

  const headerRange = encodeURIComponent(`${escapeSheetTitle(tabName)}!A1:Z1`);
  const existingHeaders = await sheetsApiRequest<{ values?: string[][] }>(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${headerRange}`,
    { method: 'GET' },
  );

  const firstCell = existingHeaders.values?.[0]?.[0];
  if (firstCell !== headers[0]) {
    const putRange = encodeURIComponent(`${escapeSheetTitle(tabName)}!A1`);
    await sheetsApiRequest(
      accessToken,
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${putRange}?valueInputOption=RAW`,
      {
        method: 'PUT',
        body: JSON.stringify({ values: [[...headers]] }),
      },
    );
  }

  ensuredTabs.add(cacheKey);
}

export async function getAuthorizedSheetsClient(): Promise<{
  spreadsheetId: string;
  accessToken: string;
} | null> {
  const cfg = getBotConfig();
  if (!cfg.spreadsheetId) return null;
  const creds = await loadServiceAccountCredentials();
  if (!creds) return null;
  const accessToken = await getGoogleAccessToken(creds);
  return { spreadsheetId: cfg.spreadsheetId, accessToken };
}

export function leadToSheetRow(lead: LeadRecord): string[] {
  const contactParts = [lead.phone, lead.contact].filter(Boolean);
  const contactCell = contactParts.length === 2 && contactParts[0] === contactParts[1]
    ? contactParts[0]
    : contactParts.join(' / ');

  return [
    lead.id,
    formatSheetsTimestamp(new Date(lead.createdAt)),
    lead.name,
    contactCell,
    lead.service,
    lead.servicePriceUzs !== null ? String(lead.servicePriceUzs) : '',
    lead.source,
    lead.campaign,
    lead.network,
    lead.gclid ?? '',
    lead.gbraid ?? '',
    lead.wbraid ?? '',
    `${lead.riskScore}/100 (${lead.riskLevel})`,
    STATUS_LABELS[lead.status] ?? lead.status,
    lead.appointmentDate ? formatDdMmYyyy(lead.appointmentDate) : (lead.requestedDate ?? ''),
    lead.appointmentTime ?? lead.requestedTime ?? '',
    lead.rejectReason ?? '',
    String(lead.callAttempts),
    lead.handledByName ?? '',
    lead.firstResponseMinutes !== null ? String(lead.firstResponseMinutes) : '',
    lead.history.map(h => h.text).join(' | '),
  ];
}

function extractRowNumberFromRange(updatedRange?: string): number | null {
  if (!updatedRange) return null;
  const match = updatedRange.match(/![A-Z]+(\d+)(?::[A-Z]+\d+)?$/);
  if (!match) return null;
  const row = Number(match[1]);
  return Number.isInteger(row) && row > 0 ? row : null;
}

export async function notifyOwnerIntegrationError(
  key: string,
  title: string,
  errMessage: string,
): Promise<void> {
  const cfg = getBotConfig();
  const now = Date.now();
  const last = lastErrorDmAt.get(key) ?? 0;
  if (now - last < ERROR_DM_THROTTLE_MS) return;
  lastErrorDmAt.set(key, now);

  await notifyOwnersDm(
    cfg.botToken,
    cfg.ownerUserIds,
    `⚠️ <b>${escapeHtml(title)}</b>\n<code>${escapeHtml(errMessage.slice(0, 350))}</code>`,
  );
}

export async function syncLeadToSheets(leadId: string): Promise<boolean> {
  if (!isGoogleSheetsConfiguredSync()) return false;

  return enqueueSheets(async () => {
    const store = getLeadsStore();
    const cfg = getBotConfig();
    const lead = await store.getLead(leadId);
    if (!lead) return false;

    try {
      const client = await getAuthorizedSheetsClient();
      if (!client) return false;

      await ensureSheetTabAndHeaders(
        client.spreadsheetId,
        cfg.leadsTab,
        LEADS_SHEET_HEADERS,
        client.accessToken,
      );

      const rowValues = leadToSheetRow(lead);
      let rowNumber = lead.sheetsRowNumber;

      if (!rowNumber) {
        const idColRange = encodeURIComponent(`${escapeSheetTitle(cfg.leadsTab)}!A:A`);
        const colA = await sheetsApiRequest<{ values?: string[][] }>(
          client.accessToken,
          `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(client.spreadsheetId)}/values/${idColRange}`,
          { method: 'GET' },
        );
        const idx = (colA.values ?? []).findIndex(row => row?.[0] === lead.id);
        if (idx >= 0) {
          rowNumber = idx + 1;
        }
      }

      if (rowNumber) {
        const range = encodeURIComponent(`${escapeSheetTitle(cfg.leadsTab)}!A${rowNumber}:U${rowNumber}`);
        await sheetsApiRequest(
          client.accessToken,
          `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(client.spreadsheetId)}/values/${range}?valueInputOption=RAW`,
          {
            method: 'PUT',
            body: JSON.stringify({ values: [rowValues] }),
          },
        );
      } else {
        const range = encodeURIComponent(`${escapeSheetTitle(cfg.leadsTab)}!A:U`);
        const appendRes = await sheetsApiRequest<{
          updates?: { updatedRange?: string };
        }>(
          client.accessToken,
          `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(client.spreadsheetId)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
          {
            method: 'POST',
            body: JSON.stringify({ values: [rowValues] }),
          },
        );
        rowNumber = extractRowNumberFromRange(appendRes.updates?.updatedRange);
      }

      const syncedSnapshotVersion = lead.updatedAt;
      await store.updateLead(
        lead.id,
        current => {
          if (rowNumber) current.sheetsRowNumber = rowNumber;
          if (current.updatedAt === syncedSnapshotVersion) {
            current.sheetsSyncedUpdatedAt = syncedSnapshotVersion;
          }
        },
        { preserveUpdatedAt: true },
      );
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      await logToFile({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Google Sheets lead sync failed',
        data: { leadId, error: msg },
      });
      await notifyOwnerIntegrationError('sheets_sync', 'Ошибка синхронизации с Google Таблицей', msg);
      return false;
    }
  });
}
