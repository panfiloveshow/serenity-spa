import { NextRequest, NextResponse } from 'next/server';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '8544259604:AAHvc_sHk_VwO2cQFmEUwKA6-hHpWgw7wCQ';
const TG_CHAT_ID = process.env.TG_CHAT_ID || '-1003821474394';

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
    const data: BookingRequest = await request.json();

    if (!data.name || !data.phone) {
      return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 });
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'Unknown';

    const message = buildMessage(data, ip);

    // Send to Telegram
    const tgResponse = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
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
