import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { logBookingSuccess, logBookingError, saveFailedBooking } from '@/lib/logger';
import { checkRateLimitRedis, incrDailyCounter } from '@/lib/redis';
import { bookingSchema, detectBot, type BookingData } from '@/lib/validation';
import { analyzePhone } from '@/lib/phone-info';
import { analyzeTrafficSource } from '@/lib/traffic-source';
import { getGeoInfo } from '@/lib/geoip';
import { assessRisk } from '@/lib/risk-score';
import { buildBookingMessage, type MessageContext } from '@/lib/booking-message';

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

function isAllowedOrigin(origin: string | null, referer: string | null): boolean {
  // Origin header is sent for cross-origin requests; absence is OK for same-origin POST
  const candidates = [origin, referer].filter(Boolean) as string[];
  if (candidates.length === 0) return true; // same-origin without Origin — allow

  return candidates.every(url => {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host === OWN_DOMAIN
        || host === `www.${OWN_DOMAIN}`
        || host.endsWith(`.${OWN_DOMAIN}`)
        || host === 'localhost'
        || host === '127.0.0.1';
    } catch {
      return false;
    }
  });
}

async function sendToTelegramWithRetry(message: string): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < TELEGRAM_MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

    try {
      const tgResponse = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN as string}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID as string,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
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

      return; // Success
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

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'Unknown';
    const serverUA = request.headers.get('user-agent') || '';

    // Check IP rate limit
    const ipAllowed = await checkRateLimitRedis(`ratelimit:ip:${ip}`, IP_RATE_LIMIT, IP_RATE_WINDOW_MS);
    if (!ipAllowed) {
      return NextResponse.json({ error: 'Слишком много запросов с вашего IP. Попробуйте через 10 минут.' }, { status: 429 });
    }

    const rawBody: unknown = await request.json();

    // Validate with Zod schema (single source of truth)
    const parsed = bookingSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || 'Некорректные данные';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = parsed.data;

    // --- Phone format hard check (Uzbekistan) ---
    const phoneInfo = analyzePhone(data.phone);
    if (!phoneInfo.valid) {
      return NextResponse.json({ error: 'Некорректный номер телефона. Введите полный номер в формате +998 XX XXX XX XX' }, { status: 400 });
    }

    // --- Hard bot detection (honeypot + <1s) — silent reject ---
    const botCheck = detectBot({
      website: data.website,
      formOpenedAt: data.formOpenedAt,
      submittedAt: Date.now(),
    });

    if (botCheck.isBot) {
      await logBookingError(
        new Error(`Bot detected: ${botCheck.reason}`),
        data,
        ip,
        { requestId, serverUA, level: 'reject', score: 100, flags: [botCheck.reason ?? 'bot'] },
      );
      // Silent reject — don't let bot know it was detected
      return NextResponse.json({ success: true });
    }

    // --- Check phone rate limit (prevent one number spamming) ---
    const phoneAllowed = await checkRateLimitRedis(
      `ratelimit:phone:${phoneInfo.digits}`,
      PHONE_RATE_LIMIT,
      PHONE_RATE_WINDOW_MS,
    );
    if (!phoneAllowed) {
      return NextResponse.json(
        { error: 'С этого номера уже отправлено несколько заявок. Попробуйте через час или позвоните нам.' },
        { status: 429 },
      );
    }

    // --- Gather enrichment data in parallel ---
    const [geo, ipSubmissionsLast24h, phoneSubmissionsLast24h] = await Promise.all([
      getGeoInfo(ip),
      incrDailyCounter(`daily:ip:${ip}`),
      incrDailyCounter(`daily:phone:${phoneInfo.digits}`),
    ]);

    const traffic = analyzeTrafficSource({
      referrer: data.visitor.referrer,
      utm_source: data.visitor.utm_source,
      utm_medium: data.visitor.utm_medium,
      utm_campaign: data.visitor.utm_campaign,
      gad_source: data.visitor.gad_source,
      gclid: data.visitor.gclid,
      landingPage: data.visitor.landingPage,
      ownDomain: OWN_DOMAIN,
    });

    const risk = assessRisk({
      phone: phoneInfo,
      traffic,
      geo,
      clientUA: `${data.visitor.browser} / ${data.visitor.os}`,
      serverUA,
      formFillDurationMs: botCheck.formFillDurationMs,
      ipSubmissionsLast24h,
      phoneSubmissionsLast24h,
      pagesViewed: data.visitor.pagesViewed,
      sessionSeconds: data.visitor.sessionSeconds ?? null,
    });

    const messageContext: MessageContext = {
      ip,
      serverUA,
      phone: phoneInfo,
      traffic,
      geo,
      risk,
      formFillDurationMs: botCheck.formFillDurationMs,
      ipSubmissionsLast24h,
      phoneSubmissionsLast24h,
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
      // Return success so fraud actor doesn't tune their approach
      return NextResponse.json({ success: true });
    }

    const message = buildBookingMessage(data as BookingData, messageContext);

    // Send to Telegram with retry
    try {
      await sendToTelegramWithRetry(message);
      await logBookingSuccess(data, ip, logMeta);
      return NextResponse.json({ success: true });
    } catch (telegramError: unknown) {
      const err = telegramError instanceof Error ? telegramError : new Error(String(telegramError));
      console.error('Telegram API failed after retries, saving to fallback:', err.message);
      await logBookingError(err, data, ip, logMeta);
      await saveFailedBooking({ ...data, ip, message, requestId, score: risk.score });
      return NextResponse.json({ success: true, fallback: true });
    }
  } catch (error) {
    console.error(`Booking API error [${requestId}]:`, error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
