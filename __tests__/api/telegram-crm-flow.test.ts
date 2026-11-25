import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fromTashkentParts } from '@/lib/leads/time';

vi.mock('@/lib/logger', () => ({
  logToFile: vi.fn(),
  logBookingSuccess: vi.fn(),
  logBookingError: vi.fn(),
  saveFailedBooking: vi.fn(),
}));
vi.mock('@/lib/redis', () => ({
  checkRateLimitRedis: vi.fn(async () => true),
  incrDailyCounter: vi.fn(async () => 1),
}));
vi.mock('@/lib/geoip', async original => ({
  ...await original<typeof import('@/lib/geoip')>(),
  getGeoInfo: vi.fn(async () => ({
    country: 'Узбекистан',
    countryCode: 'UZ',
    city: 'Ташкент',
    region: '',
    isp: 'Uzbektelekom',
    org: '',
    asName: 'AS8193',
    mobile: false,
    proxy: false,
    hosting: false,
    lat: 0,
    lon: 0,
  })),
}));
vi.mock('@/lib/private-relay', async original => ({
  ...await original<typeof import('@/lib/private-relay')>(),
  getPrivateRelayStatus: vi.fn(async () => 'none' as const),
}));

interface TelegramRecordedCall {
  method: string;
  body: Record<string, unknown>;
  assignedMessageId?: number;
}

const CHAT_ID = '-1001234567890';
const OWNER_ID = 1001;
const MANAGER_AZIZ = { id: 2001, first_name: 'Азиз' };
const MANAGER_MALIKA = { id: 2002, first_name: 'Малика' };
const STRANGER = { id: 9999, first_name: 'Посторонний' };
const WEBHOOK_SECRET = 'test-webhook-secret-xyz';

const baseVisitor = {
  referrer: 'https://www.google.com/',
  utm_source: '',
  utm_medium: '',
  utm_campaign: 'SerenitySpa Search',
  utm_content: '',
  utm_term: '',
  gclid: 'CjwK_TEST_CLICK',
  gad_source: '1',
  device: 'Мобильный',
  browser: 'Safari',
  os: 'iOS',
  screenResolution: '390×844',
  language: 'ru',
  currentPage: 'https://serenityspa.uz/ru',
  landingPage: 'https://serenityspa.uz/ru?gclid=CjwK_TEST_CLICK',
  pageTitle: 'Serenity Spa',
  visitTimestamp: '',
  sessionDuration: '2 мин',
  sessionSeconds: 120,
  pagesViewed: 3,
  trafficSource: 'Google',
};

let dir: string | undefined;
let tgCalls: TelegramRecordedCall[] = [];
let nextMessageId = 100;

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.useFakeTimers();
  tgCalls = [];
  nextMessageId = 100;

  dir = await mkdtemp(path.join(tmpdir(), 'serenity-crm-e2e-'));
  vi.stubEnv('LEADS_DB_FILE', path.join(dir, 'leads-db.json'));
  vi.stubEnv('BOOKING_HISTORY_FILE', path.join(dir, 'booking-history.json'));
  vi.stubEnv('TG_BOT_TOKEN', '123456:TEST_TOKEN');
  vi.stubEnv('TG_CHAT_ID', CHAT_ID);
  vi.stubEnv('TG_OWNER_USER_ID', String(OWNER_ID));
  vi.stubEnv('TG_MANAGER_USER_IDS', `${MANAGER_AZIZ.id},${MANAGER_MALIKA.id}`);
  vi.stubEnv('TG_OPERATOR_USER_IDS', '');
  vi.stubEnv('TG_WEBHOOK_SECRET', WEBHOOK_SECRET);
  vi.stubEnv('SPA_WORK_HOURS_START', '09:00');
  vi.stubEnv('SPA_WORK_HOURS_END', '22:00');

  vi.stubGlobal('fetch', vi.fn(async (input: string | URL, init?: RequestInit) => {
    const url = String(input);
    const match = url.match(/https:\/\/api\.telegram\.org\/bot[^/]+\/(.+)$/);
    if (!match) {
      throw new Error(`Unexpected fetch URL in test: ${url}`);
    }
    const method = match[1];
    const body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;

    if (method === 'sendMessage') {
      const msgId = nextMessageId++;
      tgCalls.push({ method, body, assignedMessageId: msgId });
      return new Response(JSON.stringify({ ok: true, result: { message_id: msgId } }));
    }
    tgCalls.push({ method, body });
    return new Response(JSON.stringify({ ok: true, result: true }));
  }));
});

afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  if (dir) {
    await rm(dir, { recursive: true, force: true });
    dir = undefined;
  }
});

function lastCall(method: string): TelegramRecordedCall | undefined {
  for (let i = tgCalls.length - 1; i >= 0; i -= 1) {
    if (tgCalls[i].method === method) return tgCalls[i];
  }
  return undefined;
}

function flattenKeyboardData(replyMarkup: unknown): Array<{ text: string; callback_data?: string }> {
  const kb = (replyMarkup as { inline_keyboard?: Array<Array<{ text: string; callback_data?: string }>> })?.inline_keyboard ?? [];
  return kb.flat();
}

describe('Serenity Spa Telegram CRM end-to-end flow', () => {
  it('handles full lead lifecycle: buttons, ACL, repeat links, scheduling, visit check, reminders, commands & summary', async () => {
    const bookingRoute = await import('@/app/api/booking/route');
    const webhookRoute = await import('@/app/api/telegram/webhook/route');
    const { handleTelegramUpdate } = await import('@/lib/bot/handler');
    const { runSchedulerTick } = await import('@/lib/bot/scheduler');
    const { getLeadsStore } = await import('@/lib/leads/store');
    const store = getLeadsStore();

    const submitBooking = async (at: Date, payload: Record<string, unknown>) => {
      vi.setSystemTime(at);
      const req = new NextRequest('http://localhost/api/booking', {
        method: 'POST',
        headers: {
          origin: 'http://localhost',
          'content-type': 'application/json',
          'x-real-ip': '203.0.113.50',
          'user-agent': 'Mozilla/5.0 (iPhone) Safari/604.1',
        },
        body: JSON.stringify({
          name: 'Тестовая заявка',
          phone: '+998 90 000 00 01',
          service: 'Массажи — Традиционный балийский (60 мин)',
          date: '16.11.2026',
          time: '16:00',
          pageLocale: 'ru',
          formOpenedAt: at.getTime() - 25_000,
          visitor: baseVisitor,
          ...payload,
        }),
      });
      const res = await bookingRoute.POST(req);
      expect(res.status).toBe(200);
      return res.json();
    };

    const click = async (
      at: Date,
      user: { id: number; first_name: string },
      callbackData: string,
      messageId: number,
    ) => {
      vi.setSystemTime(at);
      await handleTelegramUpdate(
        {
          update_id: Math.floor(at.getTime() / 1000),
          callback_query: {
            id: `cq-${at.getTime()}`,
            from: user,
            data: callbackData,
            message: { message_id: messageId, chat: { id: Number(CHAT_ID), type: 'supergroup' } },
          },
        },
        at,
      );
    };

    const sendCmd = async (at: Date, user: { id: number; first_name: string }, text: string) => {
      vi.setSystemTime(at);
      await handleTelegramUpdate(
        {
          update_id: Math.floor(at.getTime() / 1000),
          message: {
            message_id: nextMessageId++,
            chat: { id: Number(CHAT_ID), type: 'supergroup' },
            from: user,
            text,
          },
        },
        at,
      );
    };

    // 1. Webhook secret enforcement
    const badWebhook = await webhookRoute.POST(
      new NextRequest('http://localhost/api/telegram/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': 'wrong' },
        body: JSON.stringify({ update_id: 1 }),
      }),
    );
    expect(badWebhook.status).toBe(401);

    const goodWebhook = await webhookRoute.POST(
      new NextRequest('http://localhost/api/telegram/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': WEBHOOK_SECRET },
        body: JSON.stringify({ update_id: 2 }),
      }),
    );
    expect(goodWebhook.status).toBe(200);

    // 2. Submit Lead #1 on Mon 16.11.2026 14:00 Tashkent
    await submitBooking(fromTashkentParts(2026, 11, 16, 14, 0, 0), {});
    const send1 = lastCall('sendMessage')!;
    const msgId1 = send1.assignedMessageId!;
    const initialButtons = flattenKeyboardData(send1.body.reply_markup);
    expect(initialButtons.map(b => b.text)).toEqual([
      '📞 Связался',
      '❌ Не дозвонился',
      '✅ Записан',
      '🚫 Отказ',
      '🗑 Спам',
    ]);
    const lead1Id = initialButtons[0].callback_data!.split(':')[1];

    // 3. Unauthorized user cannot click buttons
    await click(fromTashkentParts(2026, 11, 16, 14, 2, 0), STRANGER, `l:${lead1Id}:work`, msgId1);
    const deniedAns = lastCall('answerCallbackQuery')!;
    expect(deniedAns.body).toMatchObject({ text: 'Нет доступа', show_alert: true });
    expect((await store.getLead(lead1Id))?.status).toBe('new');

    // 4. Manager Азиз clicks "📞 Связался" at 14:05 -> status В работе & 3 action buttons + edit
    await click(fromTashkentParts(2026, 11, 16, 14, 5, 0), MANAGER_AZIZ, `l:${lead1Id}:work`, msgId1);
    const editWork = lastCall('editMessageText')!;
    expect(String(editWork.body.text)).toContain('<b>📞 В РАБОТЕ</b>');
    expect(String(editWork.body.text)).toContain('📞 Связался — Азиз, 16.11 14:05');
    expect(flattenKeyboardData(editWork.body.reply_markup).map(b => b.text)).toEqual([
      '✅ Записан',
      '🚫 Отказ',
      '🤔 Думает',
      '✏️ Изменить статус',
    ]);

    // 5. Repeat booking (Lead #2) includes clickable link to first card and status "В работе"
    await submitBooking(fromTashkentParts(2026, 11, 16, 14, 6, 0), {
      service: 'Массажи — Детокс (лимфодренажный) (90 мин)',
    });
    const send2 = lastCall('sendMessage')!;
    const msgId2 = send2.assignedMessageId!;
    expect(String(send2.body.text)).toContain(`https://t.me/c/1234567890/${msgId1}`);
    expect(String(send2.body.text)).toContain('В работе');
    const lead2Id = flattenKeyboardData(send2.body.reply_markup)[0].callback_data!.split(':')[1];

    // 6. On Lead #1, Азиз clicks "✅ Записан" -> picks "Сегодня" -> picks "16:00"
    await click(fromTashkentParts(2026, 11, 16, 14, 7, 0), MANAGER_AZIZ, `l:${lead1Id}:bk`, msgId1);
    const dateButtons = flattenKeyboardData(lastCall('editMessageText')!.body.reply_markup);
    expect(dateButtons.some(b => b.text === 'Сегодня')).toBe(true);
    expect(dateButtons.some(b => b.text === 'Завтра')).toBe(true);
    expect(dateButtons.some(b => b.text.startsWith('Как в заявке'))).toBe(true);
    expect(dateButtons.some(b => b.text === 'Другая дата')).toBe(true);

    await click(fromTashkentParts(2026, 11, 16, 14, 7, 10), MANAGER_AZIZ, `l:${lead1Id}:bd:td`, msgId1);
    const timeButtons = flattenKeyboardData(lastCall('editMessageText')!.body.reply_markup);
    expect(timeButtons.some(b => b.text === '16:00')).toBe(true);
    expect(timeButtons.some(b => b.text === '16:30')).toBe(true);

    await click(fromTashkentParts(2026, 11, 16, 14, 7, 20), MANAGER_AZIZ, `l:${lead1Id}:bt:20261116:1600`, msgId1);
    const bookedCard = String(lastCall('editMessageText')!.body.text);
    expect(bookedCard).toContain('<b>✅ ЗАПИСАН — 16.11 в 16:00</b>');
    expect(bookedCard).toContain('📞 Связался — Азиз, 16.11 14:05');
    expect(bookedCard).toContain('✅ Записан на 16.11 16:00 — Азиз, 16.11 14:07');

    // 7. Lead #2: Малика clicks "❌ Не дозвонился" at 14:15, then +2h reminder fires at 16:20
    await click(fromTashkentParts(2026, 11, 16, 14, 15, 0), MANAGER_MALIKA, `l:${lead2Id}:na`, msgId2);
    expect(String(lastCall('editMessageText')!.body.text)).toContain('❌ Не дозвонился (попытка 1 из 3)');

    await runSchedulerTick(fromTashkentParts(2026, 11, 16, 16, 20, 0));
    const retry1Msg = tgCalls.find(c => c.method === 'sendMessage' && String(c.body.text).includes('попытка 2 из 3'));
    expect(retry1Msg).toBeDefined();

    // 8. 1 hour after Lead #1's 16:00 visit (at 17:05), scheduler asks "Клиент Тестовая заявка пришёл?"
    const idxBefore1705 = tgCalls.length;
    await runSchedulerTick(fromTashkentParts(2026, 11, 16, 17, 5, 0));
    const tick1705Messages = tgCalls.slice(idxBefore1705).filter(c => c.method === 'sendMessage');
    const visitCheckCall = tick1705Messages.find(c => String(c.body.text).includes('Клиент <b>Тестовая заявка</b> пришёл?'));
    expect(visitCheckCall).toBeDefined();
    const visitCheckMsgId = visitCheckCall!.assignedMessageId!;
    expect(flattenKeyboardData(visitCheckCall!.body.reply_markup).map(b => b.text)).toEqual([
      '🚶 Пришёл',
      '🙅 Не пришёл',
    ]);

    // Click "🙅 Не пришёл" -> offers [Перенёс] and [Не придёт] -> reschedule to 17.11 11:30
    await click(fromTashkentParts(2026, 11, 16, 17, 6, 0), MANAGER_AZIZ, `l:${lead1Id}:ns`, visitCheckMsgId);
    expect(flattenKeyboardData(lastCall('editMessageText')!.body.reply_markup).map(b => b.text)).toEqual([
      '📅 Перенёс',
      '🙅 Не придёт',
    ]);
    await click(fromTashkentParts(2026, 11, 16, 17, 7, 0), MANAGER_AZIZ, `l:${lead1Id}:rs`, visitCheckMsgId);
    await click(fromTashkentParts(2026, 11, 16, 17, 7, 10), MANAGER_AZIZ, `l:${lead1Id}:rd:tm`, visitCheckMsgId);
    await click(fromTashkentParts(2026, 11, 16, 17, 7, 20), MANAGER_AZIZ, `l:${lead1Id}:rt:20261117:1130`, visitCheckMsgId);
    expect((await store.getLead(lead1Id))?.status).toBe('booked');
    expect((await store.getLead(lead1Id))?.appointmentDate).toBe('2026-11-17');

    // Lead #2: 2nd and 3rd "Не дозвонился" attempts + "Не вышел на связь" + "✏️ Изменить статус" -> Отказ (Дорого)
    await click(fromTashkentParts(2026, 11, 16, 17, 10, 0), MANAGER_MALIKA, `l:${lead2Id}:na`, msgId2);
    await runSchedulerTick(fromTashkentParts(2026, 11, 16, 19, 15, 0));
    expect(String(lastCall('sendMessage')!.body.text)).toContain('попытка 3 из 3');

    await click(fromTashkentParts(2026, 11, 16, 19, 20, 0), MANAGER_MALIKA, `l:${lead2Id}:na`, msgId2);
    const thirdNaBtns = flattenKeyboardData(lastCall('editMessageText')!.body.reply_markup);
    expect(thirdNaBtns.some(b => b.text === '📵 Не вышел на связь')).toBe(true);
    await click(fromTashkentParts(2026, 11, 16, 19, 21, 0), MANAGER_MALIKA, `l:${lead2Id}:nc`, msgId2);
    expect((await store.getLead(lead2Id))?.status).toBe('no_contact');

    await click(fromTashkentParts(2026, 11, 16, 19, 25, 0), MANAGER_MALIKA, `l:${lead2Id}:ed`, msgId2);
    expect(flattenKeyboardData(lastCall('editMessageText')!.body.reply_markup).length).toBeGreaterThanOrEqual(7);
    await click(fromTashkentParts(2026, 11, 16, 19, 26, 0), MANAGER_MALIKA, `l:${lead2Id}:rj`, msgId2);
    await click(fromTashkentParts(2026, 11, 16, 19, 27, 0), MANAGER_MALIKA, `l:${lead2Id}:rr:0`, msgId2);
    const rejectedLead2 = await store.getLead(lead2Id);
    expect(rejectedLead2?.status).toBe('rejected');
    expect(rejectedLead2?.rejectReason).toBe('Дорого');
    expect(String(lastCall('editMessageText')!.body.text)).toContain('🚫 ОТКАЗ — Дорого');

    // 9. On Tue 17.11 at 10:00 AM daily digest lists Lead #1; at 12:35 visit check runs -> "🚶 Пришёл"
    await runSchedulerTick(fromTashkentParts(2026, 11, 17, 10, 0, 0));
    const digestCall = lastCall('sendMessage')!;
    expect(String(digestCall.body.text)).toContain('Записи на сегодня (17.11)');
    expect(String(digestCall.body.text)).toContain('11:30');
    expect(String(digestCall.body.text)).toContain('Тестовая заявка');

    await runSchedulerTick(fromTashkentParts(2026, 11, 17, 12, 35, 0));
    const visitCheck2MsgId = lastCall('sendMessage')!.assignedMessageId!;
    await click(fromTashkentParts(2026, 11, 17, 12, 40, 0), MANAGER_AZIZ, `l:${lead1Id}:cm`, visitCheck2MsgId);
    expect((await store.getLead(lead1Id))?.status).toBe('visited');

    // 10. Night lead #3 on 18.11 at 02:30 -> silent until 09:15 (15m alert) and 10:01 (60m owner DM)
    await submitBooking(fromTashkentParts(2026, 11, 18, 2, 30, 0), {
      name: 'Night Booking',
      phone: '+998 90 000 00 02',
      service: 'Абонемент: Разовое посещение',
    });
    const send3 = lastCall('sendMessage')!;
    const lead3Id = flattenKeyboardData(send3.body.reply_markup)[0].callback_data!.split(':')[1];
    const callsBeforeMorning = tgCalls.length;
    await runSchedulerTick(fromTashkentParts(2026, 11, 18, 9, 10, 0));
    expect(tgCalls.length).toBe(callsBeforeMorning); // only 10m of working hours elapsed

    await runSchedulerTick(fromTashkentParts(2026, 11, 18, 9, 15, 0));
    expect(lastCall('sendMessage')?.body).toMatchObject({
      chat_id: CHAT_ID,
      parse_mode: 'HTML',
      reply_parameters: { message_id: send3.assignedMessageId },
      text: '⏰ Заявка <b>Night Booking</b> 15 минут без ответа\n'
        + `<a href="tg://user?id=${MANAGER_AZIZ.id}">Оператор</a>, <a href="tg://user?id=${MANAGER_MALIKA.id}">Оператор</a>`,
    });

    const callsAfterReminder = tgCalls.length;
    await runSchedulerTick(fromTashkentParts(2026, 11, 18, 9, 16, 0));
    expect(tgCalls.length).toBe(callsAfterReminder);

    await runSchedulerTick(fromTashkentParts(2026, 11, 18, 10, 1, 0));
    const ownerAlert = lastCall('sendMessage')!;
    expect(ownerAlert.body.chat_id).toBe(OWNER_ID);
    expect(String(ownerAlert.body.text)).toContain('Night Booking');
    expect(String(ownerAlert.body.text)).toContain('60 минут без ответа');
    expect(String(ownerAlert.body.text)).not.toContain('tg://user?id=');

    // 11. Commands /open and /svodka (week + custom period)
    await sendCmd(fromTashkentParts(2026, 11, 18, 10, 5, 0), STRANGER, '/open');
    expect(String(lastCall('sendMessage')!.body.text)).toBe('Нет доступа');

    await sendCmd(fromTashkentParts(2026, 11, 18, 10, 6, 0), MANAGER_AZIZ, '/open');
    const openMsg = String(lastCall('sendMessage')!.body.text);
    expect(openMsg).toContain('Night Booking');
    expect(openMsg).not.toContain('Тестовая заявка');

    await sendCmd(fromTashkentParts(2026, 11, 18, 10, 7, 0), MANAGER_AZIZ, '/svodka');
    const svodkaMenuMsgId = lastCall('sendMessage')!.assignedMessageId!;
    expect(flattenKeyboardData(lastCall('sendMessage')!.body.reply_markup).map(b => b.text)).toEqual([
      'Неделя',
      'Месяц',
      'Свой период',
    ]);

    await click(fromTashkentParts(2026, 11, 18, 10, 8, 0), MANAGER_AZIZ, 'sv:week', svodkaMenuMsgId);
    const weekReport = String(lastCall('sendMessage')!.body.text);
    expect(weekReport).toContain('Заявки');
    expect(weekReport).toContain('🚶 Пришли: 1');
    expect(weekReport).toContain('🚫 Отказ: 1 (дорого — 1)');
    expect(weekReport).toContain('⚠️ Без статуса: 1');
    expect(weekReport).toContain('SerenitySpa Search 3/1');
    expect(weekReport).toContain('Азиз — 1 заявка');
    expect(weekReport).toContain('Малика — 1 заявка');

    await click(fromTashkentParts(2026, 11, 18, 10, 9, 0), MANAGER_AZIZ, 'sv:custom', svodkaMenuMsgId);
    await sendCmd(fromTashkentParts(2026, 11, 18, 10, 10, 0), MANAGER_AZIZ, '16.11.2026 - 18.11.2026');
    expect(String(lastCall('sendMessage')!.body.text)).toContain('Заявки 16–18 ноября: 3');

    // 12. Monday 23.11.2026 at 09:00 automatic weekly summary for 16–22 Nov
    await runSchedulerTick(fromTashkentParts(2026, 11, 23, 9, 0, 0));
    const mondaySummary = String(lastCall('sendMessage')!.body.text);
    expect(mondaySummary).toContain('Заявки 16–22 ноября: 3');

    // 13. Lead #3 "🤔 Думает" -> 24h reminder
    const lead3 = await store.getLead(lead3Id);
    expect(lead3?.status).toBe('new');
    await click(fromTashkentParts(2026, 11, 23, 11, 0, 0), MANAGER_AZIZ, `l:${lead3Id}:th`, lead3!.telegramMessageId!);
    await runSchedulerTick(fromTashkentParts(2026, 11, 24, 11, 5, 0));
    expect(String(lastCall('sendMessage')!.body.text)).toContain('Напоминание перезвонить: <b>Night Booking</b>');
  });

  it.each([
    { label: 'with an operator', operatorIds: '555001,555001,invalid', mention: '\n<a href="tg://user?id=555001">Оператор</a>' },
    { label: 'without an operator', operatorIds: '', mention: '' },
  ])('handles group access, working hours and reminders $label', async ({ operatorIds, mention }) => {
    vi.stubEnv('TG_MANAGER_USER_IDS', '');
    vi.stubEnv('TG_OPERATOR_USER_IDS', operatorIds);
    vi.stubEnv('SPA_WORK_HOURS_START', '');
    vi.stubEnv('SPA_WORK_HOURS_END', '');

    const { getBotConfig } = await import('@/lib/bot/config');
    const { buildTimePickerKeyboard } = await import('@/lib/bot/keyboards');
    const { handleTelegramUpdate } = await import('@/lib/bot/handler');
    const { runSchedulerTick } = await import('@/lib/bot/scheduler');
    const { getLeadsStore } = await import('@/lib/leads/store');

    const cfg = getBotConfig();
    expect(cfg.workHours).toEqual({ startMin: 7 * 60, endMin: 23 * 60 });
    expect(cfg.strictAllowlistOnly).toBe(false);

    const store = getLeadsStore();
    const createdAt = fromTashkentParts(2026, 11, 18, 8, 0, 0);
    await store.createLead({
      id: 'auto1',
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      name: 'Group Booking',
      phone: '+998500000003',
      contact: '',
      service: 'Массажи — Спина, шея и плечи (30 мин)',
      serviceCategory: 'Массажи',
      servicePriceUzs: 800_000,
      requestedDate: '18.11.2026',
      requestedTime: '09:00',
      source: 'Google Реклама · Google Поиск',
      campaign: '',
      network: 'Google Поиск',
      gclid: 'GCLID_AUTO',
      gbraid: null,
      wbraid: null,
      adClickAt: null,
      riskScore: 0,
      riskLevel: 'clean',
      initialTitle: '✅ НОВАЯ ЗАЯВКА',
      repeatOfLeadId: null,
      status: 'new',
      appointmentDate: null,
      appointmentTime: null,
      bookedAt: null,
      visitedAt: null,
      rejectReason: null,
      callAttempts: 0,
      handledByUserId: null,
      handledByName: null,
      firstRespondedAt: null,
      firstResponseMinutes: null,
      history: [],
      telegramChatId: CHAT_ID,
      telegramMessageId: 500,
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
    });

    const lead = (await store.getLead('auto1'))!;
    const slots = flattenKeyboardData(buildTimePickerKeyboard(lead, 'book', '2026-11-18')).map(b => b.text);
    expect(slots).toContain('07:00');
    expect(slots).toContain('08:30');
    expect(slots).toContain('22:30');

    // Override fetch to simulate getChatMember and owner DM PEER_ID_INVALID
    const GROUP_MEMBER_ID = 555001;
    const OUTSIDER_ID = 555002;
    vi.stubGlobal('fetch', vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      const method = url.match(/\/bot[^/]+\/(.+)$/)?.[1] ?? '';
      const body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;
      tgCalls.push({ method, body });

      if (method === 'getChatMember') {
        const uid = Number(body.user_id);
        return new Response(JSON.stringify({
          ok: true,
          result: { status: uid === GROUP_MEMBER_ID ? 'member' : 'left' },
        }));
      }
      if (method === 'sendMessage') {
        if (Number(body.chat_id) === OWNER_ID) {
          return new Response(JSON.stringify({ ok: false, error_code: 400, description: 'Bad Request: PEER_ID_INVALID' }));
        }
        return new Response(JSON.stringify({ ok: true, result: { message_id: nextMessageId++ } }));
      }
      return new Response(JSON.stringify({ ok: true, result: true }));
    }));

    // At 09:05 Tashkent (65 mins after 08:00 within 07:00-23:00), both 15m and 60m fallback fire in group chat
    await runSchedulerTick(fromTashkentParts(2026, 11, 18, 9, 5, 0));
    expect(tgCalls.find(c => c.method === 'sendMessage' && String(c.body.text).includes('15 минут без ответа'))?.body.text)
      .toBe(`⏰ Заявка <b>Group Booking</b> 15 минут без ответа${mention}`);
    expect(tgCalls.some(c => c.method === 'sendMessage' && String(c.body.chat_id) === CHAT_ID && String(c.body.text).includes('60 минут без статуса'))).toBe(true);

    // Outsider gets denied via getChatMember
    await handleTelegramUpdate(
      {
        update_id: 901,
        callback_query: {
          id: 'cq-out',
          from: { id: OUTSIDER_ID, first_name: 'Чужой' },
          data: 'l:auto1:work',
          message: { message_id: 500, chat: { id: Number(CHAT_ID), type: 'supergroup' } },
        },
      },
      fromTashkentParts(2026, 11, 18, 9, 6, 0),
    );
    expect(lastCall('answerCallbackQuery')?.body).toMatchObject({ text: 'Нет доступа', show_alert: true });
    expect((await store.getLead('auto1'))?.status).toBe('new');

    // Closed-group member succeeds automatically without TG_MANAGER_USER_IDS
    await handleTelegramUpdate(
      {
        update_id: 902,
        callback_query: {
          id: 'cq-mem',
          from: { id: GROUP_MEMBER_ID, first_name: 'Дильшод' },
          data: 'l:auto1:work',
          message: { message_id: 500, chat: { id: Number(CHAT_ID), type: 'supergroup' } },
        },
      },
      fromTashkentParts(2026, 11, 18, 9, 7, 0),
    );
    expect((await store.getLead('auto1'))?.status).toBe('in_progress');
    expect((await store.getLead('auto1'))?.handledByName).toBe('Дильшод');
  });
});
