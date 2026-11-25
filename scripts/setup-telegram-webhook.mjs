#!/usr/bin/env node

import { createHmac } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function loadEnvLocal() {
  const envPath = join(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function callTelegram(botToken, method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${JSON.stringify(data)}`);
  }
  return data.result;
}

async function main() {
  loadEnvLocal();

  const botToken = process.env.TG_BOT_TOKEN?.trim();
  if (!botToken) {
    console.error('Error: TG_BOT_TOKEN is not set in environment or .env.local');
    process.exit(1);
  }

  const domain = process.env.OWN_DOMAIN?.trim() || 'serenityspa.uz';
  const webhookUrl = process.env.TG_WEBHOOK_URL?.trim() || `https://${domain}/api/telegram/webhook`;
  const secretToken = process.env.TG_WEBHOOK_SECRET?.trim()
    || createHmac('sha256', botToken).update('serenity-tg-webhook-v1').digest('hex').slice(0, 48);

  if (process.argv.includes('--dry-run')) {
    console.log(JSON.stringify({ webhookUrl, secretTokenPreview: `${secretToken.slice(0, 8)}…` }, null, 2));
    return;
  }

  await callTelegram(botToken, 'setWebhook', {
    url: webhookUrl,
    secret_token: secretToken,
    allowed_updates: ['message', 'callback_query'],
  });

  await callTelegram(botToken, 'setMyCommands', {
    commands: [
      { command: 'open', description: 'Список заявок без финального статуса' },
      { command: 'svodka', description: 'Сводка за неделю, месяц или свой период' },
      { command: 'id', description: 'Показать ваш Telegram user_id и chat_id' },
    ],
  });

  const info = await callTelegram(botToken, 'getWebhookInfo');
  console.log('Telegram webhook configured successfully:');
  console.log(JSON.stringify(info, null, 2));
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
