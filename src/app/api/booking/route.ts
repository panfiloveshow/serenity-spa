import { NextRequest, NextResponse } from 'next/server';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

// Rate limiting: не более 5 запросов с одного IP за 10 минут
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Очистка устаревших записей раз в час
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 60 * 60 * 1000);

interface BookingRequest {
  // Form data
  name: string;
  phone: string;
  service: string;
  date?: string;
  comment?: string;
  // Visitor data
  visitor: {
    referrer: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
    device: string;
    browser: string;
    os: string;
    screenResolution: string;
    language: string;
    currentPage: string;
    landingPage: string;
    pageTitle: string;
    visitTimestamp: string;
    sessionDuration: string;
    pagesViewed: number;
    trafficSource: string;
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildMessage(data: BookingRequest, ip: string): string {
  const v = data.visitor;

  const lines: string[] = [
    `🌿 <b>Новая заявка — Serenity Spa</b>`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>Клиент</b>`,
    `├ Имя: <b>${escapeHtml(data.name)}</b>`,
    `├ Телефон: <b>${escapeHtml(data.phone)}</b>`,
    `├ Услуга: ${escapeHtml(data.service || 'Не выбрана')}`,
  ];

  if (data.date) lines.push(`├ Дата: ${escapeHtml(data.date)}`);
  if (data.comment) lines.push(`├ Комментарий: ${escapeHtml(data.comment)}`);

  lines.push(
    `└ Время заявки: ${v.visitTimestamp}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📊 <b>Источник перехода</b>`,
    `├ Откуда: <b>${escapeHtml(v.trafficSource)}</b>`,
  );

  if (v.referrer && v.referrer !== 'Прямой переход') {
    lines.push(`├ Referrer: ${escapeHtml(v.referrer)}`);
  }

  if (v.utm_source) {
    lines.push(`├ UTM Source: ${escapeHtml(v.utm_source)}`);
    if (v.utm_medium) lines.push(`├ UTM Medium: ${escapeHtml(v.utm_medium)}`);
    if (v.utm_campaign) lines.push(`├ UTM Campaign: ${escapeHtml(v.utm_campaign)}`);
    if (v.utm_content) lines.push(`├ UTM Content: ${escapeHtml(v.utm_content)}`);
    if (v.utm_term) lines.push(`├ UTM Term: ${escapeHtml(v.utm_term)}`);
  }

  lines.push(
    `└ Страница входа: ${escapeHtml(v.landingPage)}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📱 <b>Устройство</b>`,
    `├ Тип: ${escapeHtml(v.device)}`,
    `├ ОС: ${escapeHtml(v.os)}`,
    `├ Браузер: ${escapeHtml(v.browser)}`,
    `├ Экран: ${escapeHtml(v.screenResolution)}`,
    `├ Язык: ${escapeHtml(v.language)}`,
    `└ IP: ${ip}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `⏱ <b>Сессия</b>`,
    `├ На сайте: ${escapeHtml(v.sessionDuration)}`,
    `├ Просмотрено страниц: ${v.pagesViewed}`,
    `└ Текущая страница: ${escapeHtml(v.currentPage)}`,
  );

  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
      return NextResponse.json({ error: 'Сервис временно недоступен' }, { status: 503 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'Unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Слишком много запросов. Попробуйте позже.' }, { status: 429 });
    }

    const data: BookingRequest = await request.json();

    if (!data.name || !data.phone) {
      return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 });
    }

    // Валидация длины полей
    if (data.name.length > 100) {
      return NextResponse.json({ error: 'Имя слишком длинное' }, { status: 400 });
    }
    if (data.phone.length > 30) {
      return NextResponse.json({ error: 'Телефон слишком длинный' }, { status: 400 });
    }
    if (data.service && data.service.length > 200) {
      return NextResponse.json({ error: 'Некорректная услуга' }, { status: 400 });
    }
    if (data.comment && data.comment.length > 500) {
      return NextResponse.json({ error: 'Комментарий слишком длинный (макс. 500 символов)' }, { status: 400 });
    }
    // Базовая проверка телефона
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return NextResponse.json({ error: 'Некорректный телефон' }, { status: 400 });
    }

    const message = buildMessage(data, ip);

    // Send to Telegram
    const tgResponse = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN as string}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID as string,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const tgResult = await tgResponse.json();

    if (!tgResult.ok) {
      console.error('Telegram API error:', tgResult);
      return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
