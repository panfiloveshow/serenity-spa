import { generateKeyPairSync } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LeadRecord } from '@/lib/leads/types';

vi.mock('@/lib/logger', () => ({
  logToFile: vi.fn(),
  logBookingSuccess: vi.fn(),
  logBookingError: vi.fn(),
  saveFailedBooking: vi.fn(),
}));

let dir: string | undefined;

function makeLead(overrides: Partial<LeadRecord> = {}): LeadRecord {
  const now = '2026-11-16T07:00:00.000Z';
  return {
    id: 'lead1234',
    createdAt: now,
    updatedAt: now,
    name: 'Test Booking',
    phone: '+998900000001',
    contact: '',
    service: 'Массажи — Традиционный балийский (60 мин)',
    serviceCategory: 'Массажи',
    servicePriceUzs: 1_000_000,
    requestedDate: '18.11.2026',
    requestedTime: '16:00',
    source: 'Google Реклама · Google Поиск',
    campaign: 'SerenitySpa Search',
    network: 'Google Поиск',
    gclid: 'GCLID_TEST_001',
    gbraid: null,
    wbraid: null,
    adClickAt: '2026-11-16T06:55:00.000Z',
    riskScore: 0,
    riskLevel: 'clean',
    initialTitle: '✅ НОВАЯ ЗАЯВКА',
    repeatOfLeadId: null,
    status: 'new',
    appointmentDate: null,
    appointmentTime: null,
    rejectReason: null,
    callAttempts: 0,
    handledByUserId: null,
    handledByName: null,
    firstRespondedAt: null,
    firstResponseMinutes: null,
    history: [],
    telegramChatId: '-100999888777',
    telegramMessageId: 42,
    cardBodyHtml: 'Body',
    reminded15mAt: null,
    reminded60mAt: null,
    nextCallRetryRemindAt: null,
    nextThinkingRemindAt: null,
    visitCheckSentForSlot: null,
    visitCheckMessageId: null,
    sheetsRowNumber: null,
    sheetsSyncedUpdatedAt: null,
    adsConversionsSent: {},
    ...overrides,
  };
}

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  dir = await mkdtemp(path.join(tmpdir(), 'serenity-sheets-test-'));
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const saJson = JSON.stringify({
    client_email: 'bot@serenity-test.iam.gserviceaccount.com',
    private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  });
  vi.stubEnv('LEADS_DB_FILE', path.join(dir, 'leads.json'));
  vi.stubEnv('TG_BOT_TOKEN', 'test-bot-token');
  vi.stubEnv('TG_CHAT_ID', '-100999888777');
  vi.stubEnv('TG_OWNER_USER_ID', '777001');
  vi.stubEnv('GOOGLE_SHEETS_SPREADSHEET_ID', 'sheet_12345');
  vi.stubEnv('GOOGLE_SERVICE_ACCOUNT_JSON', saJson);
  vi.stubEnv('UZS_PER_USD', '12500');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  if (dir) {
    await rm(dir, { recursive: true, force: true });
    dir = undefined;
  }
});

describe('Google Sheets live sync and Google Ads offline conversion export', () => {
  it('syncs a new lead with RAW option and updates the same row on status changes', async () => {
    const sheetsCalls: Array<{ url: string; method: string; body?: Record<string, unknown> }> = [];
    let existingSheetRows: string[][] = [];

    const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === 'https://oauth2.googleapis.com/token') {
        expect(String(init?.body)).toContain('grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer');
        return new Response(JSON.stringify({ access_token: 'goog-access-token', expires_in: 3600 }));
      }

      const method = init?.method ?? 'GET';
      const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : undefined;
      sheetsCalls.push({ url, method, body });

      if (url.includes('?fields=sheets.properties.title')) {
        return new Response(JSON.stringify({ sheets: [{ properties: { title: 'Заявки' } }] }));
      }
      if (url.includes('!A1%3AZ1') || url.includes('!A1:Z1')) {
        return new Response(JSON.stringify({ values: [] }));
      }
      if (url.includes('!A%3AA') || url.includes('!A:A')) {
        return new Response(JSON.stringify({ values: existingSheetRows }));
      }
      if (url.includes(':append')) {
        const values = (body?.values as string[][]) ?? [];
        existingSheetRows = [['ID'], ...values.map(r => [r[0]])];
        return new Response(JSON.stringify({ updates: { updatedRange: `'Заявки'!A2:U2` } }));
      }
      return new Response(JSON.stringify({ updatedRange: `'Заявки'!A2:U2` }));
    });
    vi.stubGlobal('fetch', fetchMock);

    const { getLeadsStore } = await import('@/lib/leads/store');
    const { syncLeadToSheets } = await import('@/lib/integrations/google-sheets');

    const store = getLeadsStore();
    await store.createLead(makeLead());
    expect(await syncLeadToSheets('lead1234')).toBe(true);

    const appendCall = sheetsCalls.find(c => c.url.includes(':append'));
    expect(appendCall?.url).toContain('valueInputOption=RAW');
    const row = (appendCall?.body?.values as string[][])[0];
    expect(row[0]).toBe('lead1234');
    expect(row[3]).toBe('+998900000001');
    expect(row[5]).toBe('1000000');
    expect(row[9]).toBe('GCLID_TEST_001');
    expect(row[13]).toBe('Без статуса');

    const afterCreate = await store.getLead('lead1234');
    expect(afterCreate?.sheetsRowNumber).toBe(2);
    expect(afterCreate?.sheetsSyncedUpdatedAt).toBe(afterCreate?.updatedAt);

    // Update status and verify PUT updates exact row A2:U2
    await store.updateLead('lead1234', draft => {
      draft.status = 'booked';
      draft.appointmentDate = '2026-11-18';
      draft.appointmentTime = '16:00';
      draft.handledByName = 'Азиз';
    });

    expect(await syncLeadToSheets('lead1234')).toBe(true);
    const putRowCall = sheetsCalls.find(c => c.method === 'PUT' && c.url.includes('A2%3AU2'));
    expect(putRowCall).toBeDefined();
    expect(putRowCall?.url).toContain('valueInputOption=RAW');
    const updatedRow = (putRowCall?.body?.values as string[][])[0];
    expect(updatedRow[13]).toBe('Записан');
    expect(updatedRow[14]).toBe('18.11.2026');
    expect(updatedRow[15]).toBe('16:00');
    expect(updatedRow[18]).toBe('Азиз');
  });

  it('exports Google Ads conversions for gclid/gbraid/wbraid, enforces 90d/spam/idempotency, and notifies owner on failure', async () => {
    const appendedRows: string[][] = [];
    const ownerMessages: string[] = [];
    let failNextAppend = false;

    vi.stubGlobal('fetch', vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === 'https://oauth2.googleapis.com/token') {
        return new Response(JSON.stringify({ access_token: 'tok', expires_in: 3600 }));
      }
      if (url.startsWith('https://api.telegram.org/')) {
        const body = JSON.parse(String(init?.body)) as { text: string; chat_id: string | number };
        ownerMessages.push(`${body.chat_id}:${body.text}`);
        return new Response(JSON.stringify({ ok: true, result: { message_id: 99 } }));
      }
      if (url.includes('?fields=sheets.properties.title')) {
        return new Response(JSON.stringify({ sheets: [] }));
      }
      if (url.includes('!A1%3AZ1')) {
        return new Response(JSON.stringify({ values: [] }));
      }
      if (url.includes(':append')) {
        if (failNextAppend) {
          return new Response('Forbidden', { status: 403 });
        }
        const body = JSON.parse(String(init?.body)) as { values: string[][] };
        appendedRows.push(...body.values);
        return new Response(JSON.stringify({ updates: { updatedRange: `'Google Ads'!A2:G2` } }));
      }
      return new Response(JSON.stringify({}));
    }));

    const { getLeadsStore } = await import('@/lib/leads/store');
    const { maybeExportGoogleAdsConversion } = await import('@/lib/integrations/google-ads-export');
    const store = getLeadsStore();

    // 1. gbraid (iPhone Safari) booked + visited
    await store.createLead(makeLead({
      id: 'ios1',
      gclid: null,
      gbraid: 'GBRAID_IOS_111',
      status: 'booked',
      appointmentDate: '2026-11-18',
      appointmentTime: '15:00',
    }));
    const convAt = new Date('2026-11-17T08:00:00.000Z'); // 13:00:00+0500
    expect(await maybeExportGoogleAdsConversion('ios1', 'booked', convAt)).toBe('exported');
    // Idempotent duplicate check
    expect(await maybeExportGoogleAdsConversion('ios1', 'booked', convAt)).toBe('skipped_already_sent');

    await store.updateLead('ios1', d => { d.status = 'visited'; });
    expect(await maybeExportGoogleAdsConversion('ios1', 'visited', convAt)).toBe('exported');

    // 2. wbraid with Consultation (unknown price -> empty value & currency)
    await store.createLead(makeLead({
      id: 'ios2',
      gclid: null,
      wbraid: 'WBRAID_WEB_222',
      service: 'Консультация',
      serviceCategory: 'Консультация',
      servicePriceUzs: null,
      status: 'booked',
    }));
    expect(await maybeExportGoogleAdsConversion('ios2', 'booked', convAt)).toBe('exported');

    // 3. Spam lead -> never exported
    await store.createLead(makeLead({ id: 'spam1', status: 'spam' }));
    expect(await maybeExportGoogleAdsConversion('spam1', 'booked', convAt)).toBe('skipped_spam');

    // 4. Older than 90 days -> skipped
    await store.createLead(makeLead({
      id: 'old1',
      adClickAt: '2026-07-01T00:00:00.000Z',
      status: 'booked',
    }));
    expect(await maybeExportGoogleAdsConversion('old1', 'booked', convAt)).toBe('skipped_older_than_90_days');

    // 5. No click ID -> skipped
    await store.createLead(makeLead({
      id: 'noclick',
      gclid: null,
      gbraid: null,
      wbraid: null,
      status: 'booked',
    }));
    expect(await maybeExportGoogleAdsConversion('noclick', 'booked', convAt)).toBe('skipped_no_click_id');

    expect(appendedRows).toEqual([
      ['', 'GBRAID_IOS_111', '', 'Спа — запись', '2026-11-17 13:00:00+0500', '80.00', 'USD'],
      ['', 'GBRAID_IOS_111', '', 'Спа — визит', '2026-11-17 13:00:00+0500', '80.00', 'USD'],
      ['', '', 'WBRAID_WEB_222', 'Спа — запись', '2026-11-17 13:00:00+0500', '', ''],
    ]);

    // 6. Failure alerts owner DM
    failNextAppend = true;
    await store.createLead(makeLead({ id: 'err1', status: 'booked' }));
    expect(await maybeExportGoogleAdsConversion('err1', 'booked', convAt)).toBe('error');
    expect(ownerMessages.some(m => m.startsWith('777001:') && m.includes('Google Ads'))).toBe(true);
  });

  it('serves Basic-Auth and token-protected CSV endpoints with USD conversion and zapis/vizit filters', async () => {
    const { getLeadsStore } = await import('@/lib/leads/store');
    const { getBotConfig } = await import('@/lib/bot/config');
    const leadsCsvRoute = await import('@/app/api/exports/leads.csv/route');
    const adsCsvRoute = await import('@/app/api/exports/google-ads.csv/route');
    const adsZapisRoute = await import('@/app/api/exports/google-ads-zapis.csv/route');
    const adsVizitRoute = await import('@/app/api/exports/google-ads-vizit.csv/route');

    const store = getLeadsStore();
    await store.createLead(makeLead({
      id: 'csv1',
      status: 'visited',
      appointmentDate: '2026-11-18',
      appointmentTime: '14:00',
      bookedAt: '2026-11-17T06:00:00.000Z', // 11:00+0500
      visitedAt: '2026-11-18T10:00:00.000Z', // 15:00+0500
      gclid: null,
      gbraid: 'GBRAID_CSV_1',
    }));
    await store.createLead(makeLead({
      id: 'csv_spam',
      status: 'spam',
      bookedAt: '2026-11-17T06:00:00.000Z',
    }));
    await store.createLead(makeLead({
      id: 'csv_old',
      adClickAt: '2026-06-01T00:00:00.000Z',
      status: 'booked',
      bookedAt: '2026-11-17T06:00:00.000Z',
    }));

    const unauthLeads = await leadsCsvRoute.GET(new NextRequest('http://localhost/api/exports/leads.csv'));
    expect(unauthLeads.status).toBe(401);

    const unauthAds = await adsCsvRoute.GET(new NextRequest('http://localhost/api/exports/google-ads.csv'));
    expect(unauthAds.status).toBe(401);
    expect(unauthAds.headers.get('www-authenticate')).toContain('Basic');

    const badBasic = await adsCsvRoute.GET(
      new NextRequest('http://localhost/api/exports/google-ads.csv?name=zapis', {
        headers: {
          authorization: `Basic ${Buffer.from('serenity_ads:wrong-pass').toString('base64')}`,
        },
      }),
    );
    expect(badBasic.status).toBe(401);
    expect(badBasic.headers.get('www-authenticate')).toContain('Basic');

    const badAds = await adsCsvRoute.GET(new NextRequest('http://localhost/api/exports/google-ads.csv?token=bad'));
    expect(badAds.status).toBe(401);

    const cfg = getBotConfig();
    const token = cfg.exportToken;
    const basicHeader = `Basic ${Buffer.from(`${cfg.adsBasicUser}:${cfg.adsBasicPass}`).toString('base64')}`;

    const leadsRes = await leadsCsvRoute.GET(
      new NextRequest(`http://localhost/api/exports/leads.csv?token=${token}`),
    );
    expect(leadsRes.status).toBe(200);
    expect(leadsRes.headers.get('content-type')).toContain('text/csv');
    expect(leadsRes.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    const leadsCsvText = await leadsRes.text();
    expect(leadsCsvText).toContain('ID,Дата заявки,Имя');
    expect(leadsCsvText).toContain('csv1');
    expect(leadsCsvText).toContain('"+998900000001"');

    // Legacy ?token=... still returns both events in USD
    const adsRes = await adsCsvRoute.GET(
      new NextRequest(`http://localhost/api/exports/google-ads.csv?token=${token}`),
    );
    expect(adsRes.status).toBe(200);
    const adsCsvText = await adsRes.text();
    expect(adsCsvText).toContain('Google Click ID,GBRAID,WBRAID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency');
    expect(adsCsvText).toContain(',GBRAID_CSV_1,,Спа — запись,2026-11-17 11:00:00+0500,80.00,USD');
    expect(adsCsvText).toContain(',GBRAID_CSV_1,,Спа — визит,2026-11-18 15:00:00+0500,80.00,USD');
    expect(adsCsvText).not.toContain('csv_spam');
    expect(adsCsvText).not.toContain('2026-06-01');

    // Basic Auth + ?name=zapis
    const zapisRes = await adsCsvRoute.GET(
      new NextRequest('http://localhost/api/exports/google-ads.csv?name=zapis', {
        headers: { authorization: basicHeader },
      }),
    );
    expect(zapisRes.status).toBe(200);
    const zapisCsv = await zapisRes.text();
    expect(zapisCsv).toContain(',GBRAID_CSV_1,,Спа — запись,2026-11-17 11:00:00+0500,80.00,USD');
    expect(zapisCsv).not.toContain('Спа — визит');

    // Basic Auth + ?name=vizit
    const vizitRes = await adsCsvRoute.GET(
      new NextRequest('http://localhost/api/exports/google-ads.csv?name=vizit', {
        headers: { authorization: basicHeader },
      }),
    );
    expect(vizitRes.status).toBe(200);
    const vizitCsv = await vizitRes.text();
    expect(vizitCsv).toContain(',GBRAID_CSV_1,,Спа — визит,2026-11-18 15:00:00+0500,80.00,USD');
    expect(vizitCsv).not.toContain('Спа — запись');

    // Invalid ?name= filter -> 400
    const badFilterRes = await adsCsvRoute.GET(
      new NextRequest('http://localhost/api/exports/google-ads.csv?name=invalid', {
        headers: { authorization: basicHeader },
      }),
    );
    expect(badFilterRes.status).toBe(400);

    // Path aliases google-ads-zapis.csv & google-ads-vizit.csv with Basic Auth
    const aliasZapisRes = await adsZapisRoute.GET(
      new NextRequest('http://localhost/api/exports/google-ads-zapis.csv', {
        headers: { authorization: basicHeader },
      }),
    );
    expect(aliasZapisRes.status).toBe(200);
    const aliasZapisCsv = await aliasZapisRes.text();
    expect(aliasZapisCsv).toContain('Спа — запись');
    expect(aliasZapisCsv).not.toContain('Спа — визит');

    const aliasVizitRes = await adsVizitRoute.GET(
      new NextRequest('http://localhost/api/exports/google-ads-vizit.csv', {
        headers: { authorization: basicHeader },
      }),
    );
    expect(aliasVizitRes.status).toBe(200);
    const aliasVizitCsv = await aliasVizitRes.text();
    expect(aliasVizitCsv).toContain('Спа — визит');
    expect(aliasVizitCsv).not.toContain('Спа — запись');
  });
});
