import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomUUID } from 'crypto';
import { isIP } from 'net';
import { logBookingSuccess, logBookingError, saveFailedBooking } from '@/lib/logger';
import { checkRateLimitRedis, incrDailyCounter } from '@/lib/redis';
import { bookingSchema, detectBot, type BookingData } from '@/lib/validation';
import { bookingHistory } from '@/lib/booking-history';
import { analyzePhone } from '@/lib/phone-info';
import { contactPhone } from '@/lib/contact-info';
import { analyzeTrafficSource } from '@/lib/traffic-source';
import { getGeoInfo } from '@/lib/geoip';
import { getPrivateRelayStatus } from '@/lib/private-relay';
import { assessRisk } from '@/lib/risk-score';
import { buildBookingMessage, extractCardBody, type MessageContext } from '@/lib/booking-message';
import { buildTelegramMessageUrl } from '@/lib/bot/card';
import { buildInitialKeyboard } from '@/lib/bot/keyboards';
import type { InlineKeyboardMarkup } from '@/lib/bot/telegram-api';
import { isGoogleSheetsConfiguredSync, syncLeadToSheets } from '@/lib/integrations/google-sheets';
import { resolveServiceInfo } from '@/lib/leads/catalog-price';
import { getLeadsStore } from '@/lib/leads/store';
import { parseFlexibleDateToYmd } from '@/lib/leads/time';
import { STATUS_LABELS, type LeadRecord } from '@/lib/leads/types';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

// Rate limiting constants
const IP_RATE_LIMIT = 5;
const IP_RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const PHONE_RATE_LIMIT = 3;
const PHONE_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const MAX_BODY_SIZE = 10 * 1024; // 10KB
const TELEGRAM_TIMEOUT_MS = 10_000;
const TELEGRAM_MAX_RETRIES = 3;

const OWN_DOMAIN = process.env.OWN_DOMAIN || 'serenityspa.uz';

// Extra allowed hosts for staging/preview (comma-separated, exact or leading-dot for subdomains).
// Example: ALLOWED_DOMAINS="preview.example.com,.vercel.app,.pages.dev"
const EXTRA_ALLOWED = (process.env.ALLOWED_DOMAINS ?? '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

function hostMatches(host: string, domain: string): boolean {
  if (domain.startsWith('.')) {
    // Leading-dot means "any subdomain of" (e.g. ".vercel.app")
    return host === domain.slice(1) || host.endsWith(domain);
  }
  return host === domain || host.endsWith(`.${domain}`);
}

function isAllowedOrigin(origin: string | null, referer: string | null): boolean {
  // Origin header is sent for cross-origin requests; absence is OK for same-origin POST
  const candidates = [origin, referer].filter(Boolean) as string[];
  if (candidates.length === 0) return true; // same-origin without Origin — allow

  return candidates.every(url => {
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host === 'localhost' || host === '127.0.0.1') return true;
      if (hostMatches(host, OWN_DOMAIN)) return true;
      return EXTRA_ALLOWED.some(d => hostMatches(host, d));
    } catch {
      return false;
    }
  });
}

function normalizeIpCandidate(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 64) return null;

  if (isIP(trimmed)) return trimmed;

  const bracketedIpv6 = trimmed.match(/^\[([^\]]+)\](?::\d{1,5})?$/);
  if (bracketedIpv6 && isIP(bracketedIpv6[1])) {
    return bracketedIpv6[1];
  }

  const ipv4WithPort = trimmed.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d{1,5})?$/);
  if (ipv4WithPort && isIP(ipv4WithPort[1])) {
    return ipv4WithPort[1];
  }

  return null;
}

export function getClientIpFromHeaders(headers: Pick<Headers, 'get'>): string {
  const realIp = normalizeIpCandidate(headers.get('x-real-ip'));
  if (realIp) return realIp;

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const candidates = forwardedFor
      .split(',')
      .map((part) => normalizeIpCandidate(part))
      .filter((part): part is string => Boolean(part));

    // The right-most entry is the hop most recently written by our trusted proxy when
    // nginx appends to XFF; the left-most entry may be attacker supplied.
    if (candidates.length > 0) return candidates[candidates.length - 1];
  }

  return 'Unknown';
}

async function sendToTelegramWithRetry(
  message: string,
  replyMarkup?: InlineKeyboardMarkup,
): Promise<{ messageId: number | null }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < TELEGRAM_MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

    try {
      const payload: Record<string, unknown> = {
        chat_id: TG_CHAT_ID as string,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      };
      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }

      const tgResponse = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN as string}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      let tgResult: Record<string, unknown>;
      try {
        tgResult = await tgResponse.json();
      } catch {
        throw new Error(`Failed to parse Telegram response (status ${tgResponse.status})`);
      }

      if (!tgResult.ok) {
        throw new Error(`Telegram API error: ${JSON.stringify(tgResult)}`);
      }

      const resultObj = tgResult.result as { message_id?: unknown } | undefined;
      const messageId = typeof resultObj?.message_id === 'number' ? resultObj.message_id : null;
      return { messageId }; // Success
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < TELEGRAM_MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError ?? new Error('Telegram send failed after retries');
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8);

  try {
    if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
      return NextResponse.json({ error: 'Сервис временно недоступен' }, { status: 503 });
    }

    // Origin/Referer must match our domain — blocks cross-site scripts
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    if (!isAllowedOrigin(origin, referer)) {
      return NextResponse.json({ error: 'Недопустимый источник запроса' }, { status: 403 });
    }

    // Body size check
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Слишком большой запрос' }, { status: 413 });
    }

    const ip = getClientIpFromHeaders(request.headers);
    const serverUA = request.headers.get('user-agent') || '';

    // Check IP rate limit — skip when we have no real client IP. Otherwise every
    // header-less request shares one "ratelimit:ip:Unknown" bucket and 5 requests
    // total would 429 all bookings. Phone rate limit + risk scoring still apply.
    if (ip !== 'Unknown') {
      const ipAllowed = await checkRateLimitRedis(`ratelimit:ip:${ip}`, IP_RATE_LIMIT, IP_RATE_WINDOW_MS);
      if (!ipAllowed) {
        return NextResponse.json({ error: 'Слишком много запросов с вашего IP. Попробуйте через 10 минут.' }, { status: 429 });
      }
    }

    const rawBody: unknown = await request.json();

    // Validate with Zod schema (single source of truth)
    const parsed = bookingSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || 'Некорректные данные';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = parsed.data;

    // The shared schema validates both fields. WhatsApp-only guests still get
    // country hints; email/Telegram guests must not share an empty phone bucket.
    const phoneInfo = analyzePhone(data.phone || contactPhone(data.contact));
    const contactKey = phoneInfo.valid ? `phone:${phoneInfo.digits}`
      : `contact:${createHash('sha256').update(data.contact.toLowerCase()
        .replace(/^(?:https:\/\/)?(?:t\.me|telegram\.me)\//, '@').replace(/\/$/, '')).digest('hex')}`;
    const submittedAt = new Date();

    // --- Hard bot detection (honeypot + <1s) — silent reject ---
    const botCheck = detectBot({
      website: data.website,
      formOpenedAt: data.formOpenedAt,
      submittedAt: submittedAt.getTime(),
    });

    if (botCheck.isBot) {
      await logBookingError(
        new Error(`Bot detected: ${botCheck.reason}`),
        data,
        ip,
        { requestId, serverUA, level: 'reject', score: 100, flags: [botCheck.reason ?? 'bot'] },
      );
      // Keep the generic success UI while excluding the rejected request from analytics.
      return NextResponse.json({ success: true, accepted: false, score: 100, level: 'reject' });
    }

    // --- Check phone rate limit (prevent one number spamming) ---
    const phoneAllowed = await checkRateLimitRedis(
      `ratelimit:${contactKey}`,
      PHONE_RATE_LIMIT,
      PHONE_RATE_WINDOW_MS,
    );
    if (!phoneAllowed) {
      return NextResponse.json(
        { error: 'С этого контакта уже отправлено несколько заявок. Попробуйте через час или позвоните нам.' },
        { status: 429 },
      );
    }

    const leadsStore = getLeadsStore();
    const [history, previousLead] = await Promise.all([
      bookingHistory.reserve({
        phone: data.phone || contactPhone(data.contact), name: data.name,
        service: data.service, date: data.date, deviceId: data.visitor.deviceId, submittedAt,
      }),
      leadsStore.findFirstLeadForClient({
        phone: data.phone || contactPhone(data.contact),
        contact: data.contact,
        name: data.name,
        service: data.service,
        date: data.date,
      }),
    ]);

    // --- Gather enrichment data in parallel ---
    const [geo, privateRelay, ipSubmissionsLast24h, phoneSubmissionsLast24h] = await Promise.all([
      getGeoInfo(ip),
      getPrivateRelayStatus(ip, serverUA),
      incrDailyCounter(`daily:ip:${ip}`),
      incrDailyCounter(`daily:${contactKey}`),
    ]);

    const traffic = analyzeTrafficSource({
      referrer: data.visitor.referrer,
      utm_source: data.visitor.utm_source,
      utm_medium: data.visitor.utm_medium,
      utm_campaign: data.visitor.utm_campaign,
      gad_source: data.visitor.gad_source,
      gclid: data.visitor.gclid,
      gbraid: data.visitor.gbraid,
      wbraid: data.visitor.wbraid,
      landingPage: data.visitor.landingPage,
      ownDomain: OWN_DOMAIN,
    });

    const risk = assessRisk({
      phone: phoneInfo,
      traffic,
      geo,
      privateRelay,
      clientUA: `${data.visitor.browser} / ${data.visitor.os}`,
      serverUA,
      formFillDurationMs: botCheck.formFillDurationMs,
      ipSubmissionsLast24h,
      phoneSubmissionsLast24h,
      deviceSubmissionsLast10m: history.deviceSubmissionsLast10m,
      pagesViewed: data.visitor.pagesViewed,
      sessionSeconds: data.visitor.sessionSeconds ?? null,
      name: data.name,
      comment: data.comment,
      gclid: data.visitor.gclid,
      submittedAt,
    });

    const repeatFirstSubmittedAt = history.firstSubmittedAt ?? previousLead?.createdAt ?? null;
    const repeatLead = previousLead
      ? {
          id: previousLead.id,
          statusLabel: STATUS_LABELS[previousLead.status] ?? previousLead.status,
          messageUrl: buildTelegramMessageUrl(
            previousLead.telegramChatId || TG_CHAT_ID,
            previousLead.telegramMessageId,
          ),
        }
      : null;

    const messageContext: MessageContext = {
      ip,
      serverUA,
      phone: phoneInfo,
      traffic,
      geo,
      privateRelay,
      risk,
      formFillDurationMs: botCheck.formFillDurationMs,
      ipSubmissionsLast24h,
      phoneSubmissionsLast24h,
      repeatFirstSubmittedAt,
      repeatLead,
      submittedAt,
      requestId,
    };

    const logMeta = {
      requestId,
      score: risk.score,
      level: risk.level,
      serverUA,
      referrer: data.visitor.referrer,
      gclid: data.visitor.gclid,
      gad_source: data.visitor.gad_source,
      flags: risk.flags.map(f => f.reason),
    };

    // --- Silent reject for very high risk ---
    if (risk.level === 'reject') {
      await logBookingError(
        new Error(`Auto-rejected (score ${risk.score})`),
        data,
        ip,
        logMeta,
      );
      // Keep the generic success UI while excluding the rejected request from analytics.
      return NextResponse.json({ success: true, accepted: false, score: risk.score, level: risk.level });
    }

    const message = buildBookingMessage(data as BookingData, messageContext);
    const serviceRaw = data.service?.trim() || 'не выбрана';
    const requestedDate = data.date?.trim() || null;
    const requestedTime = data.time?.trim() || null;
    const visitDateYmd = parseFlexibleDateToYmd(requestedDate, submittedAt);
    const serviceInfo = resolveServiceInfo(serviceRaw, visitDateYmd);

    const buildLeadRecord = (telegramMessageId: number | null): LeadRecord => ({
      id: requestId,
      createdAt: submittedAt.toISOString(),
      updatedAt: submittedAt.toISOString(),
      name: data.name,
      phone: data.phone || '',
      contact: data.contact || '',
      service: serviceRaw,
      serviceCategory: serviceInfo.category,
      servicePriceUzs: serviceInfo.priceUzs,
      requestedDate,
      requestedTime,
      source: traffic.label,
      campaign: data.visitor.utm_campaign || '',
      network: traffic.gadSourceLabel || data.visitor.gad_source || '',
      gclid: data.visitor.gclid?.trim() || null,
      gbraid: data.visitor.gbraid?.trim() || null,
      wbraid: data.visitor.wbraid?.trim() || null,
      adClickAt: data.visitor.adClickAt?.trim() || null,
      riskScore: risk.score,
      riskLevel: risk.level,
      initialTitle: risk.title,
      repeatOfLeadId: previousLead?.id ?? null,
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
      telegramChatId: telegramMessageId ? (TG_CHAT_ID as string) : null,
      telegramMessageId,
      cardBodyHtml: extractCardBody(message),
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

    // Send to Telegram with retry
    try {
      const sent = await sendToTelegramWithRetry(message, buildInitialKeyboard(requestId));
      await bookingHistory.confirm(history.reservationId);
      await leadsStore.createLead(buildLeadRecord(sent.messageId));
      if (isGoogleSheetsConfiguredSync()) {
        await syncLeadToSheets(requestId);
      }
      await logBookingSuccess(data, ip, logMeta);
      return NextResponse.json({ success: true, accepted: true, score: risk.score, level: risk.level });
    } catch (telegramError: unknown) {
      const err = telegramError instanceof Error ? telegramError : new Error(String(telegramError));
      console.error('Telegram API failed after retries, saving to fallback:', err.message);
      await logBookingError(err, data, ip, logMeta);
      const savedPath = await saveFailedBooking({
        name: data.name,
        phone: data.phone,
        service: data.service,
        ip,
        message,
        requestId,
        score: risk.score,
      });
      if (!savedPath) {
        return NextResponse.json({ error: 'Не удалось сохранить заявку. Попробуйте ещё раз.' }, { status: 503 });
      }
      await bookingHistory.confirm(history.reservationId);
      await leadsStore.createLead(buildLeadRecord(null));
      if (isGoogleSheetsConfiguredSync()) {
        await syncLeadToSheets(requestId);
      }
      return NextResponse.json({ success: true, accepted: true, fallback: true, score: risk.score, level: risk.level });
    }
  } catch (error) {
    console.error(`Booking API error [${requestId}]:`, error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
