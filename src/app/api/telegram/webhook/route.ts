import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getBotConfig } from '@/lib/bot/config';
import { handleTelegramUpdate } from '@/lib/bot/handler';
import type { TelegramUpdate } from '@/lib/bot/telegram-api';

function verifySecretToken(provided: string | null, expected: string): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const cfg = getBotConfig();
  if (!cfg.botToken) {
    return NextResponse.json({ error: 'Bot not configured' }, { status: 503 });
  }

  const providedSecret = request.headers.get('x-telegram-bot-api-secret-token');
  if (!verifySecretToken(providedSecret, cfg.webhookSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    await handleTelegramUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook handler error:', error);
    return NextResponse.json({ ok: true });
  }
}
