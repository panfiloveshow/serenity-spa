import { createHmac } from 'crypto';
import { BUSINESS_CONTACT } from '@/lib/business';
import { parseWorkHours, type WorkHours } from '@/lib/leads/time';

export interface BotConfig {
  botToken: string;
  chatId: string;
  ownerUserIds: number[];
  managerUserIds: number[];
  operatorUserIds: number[];
  allowedUserIds: Set<number>;
  strictAllowlistOnly: boolean;
  workHours: WorkHours;
  webhookSecret: string;
  exportToken: string;
  adsBasicUser: string;
  adsBasicPass: string;
  spreadsheetId: string;
  serviceAccountJson: string;
  serviceAccountKeyFile: string;
  leadsTab: string;
  adsTab: string;
  adsConversionBooked: string;
  adsConversionVisited: string;
}

function parseUserIds(raw: string | undefined): number[] {
  if (!raw) return [];
  const ids = new Set<number>();
  for (const part of raw.split(/[\s,;]+/)) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const num = Number(trimmed);
    if (Number.isSafeInteger(num) && num > 0) {
      ids.add(num);
    }
  }
  return Array.from(ids);
}

export function getBotConfig(): BotConfig {
  const botToken = process.env.TG_BOT_TOKEN?.trim() || '';
  const chatId = process.env.TG_CHAT_ID?.trim() || '';

  const ownerIds = new Set<number>([
    ...parseUserIds(process.env.TG_OWNER_USER_ID),
    ...parseUserIds(process.env.TG_OWNER_USER_IDS),
  ]);
  const managerIds = parseUserIds(process.env.TG_MANAGER_USER_IDS);
  const operatorIds = parseUserIds(process.env.TG_OPERATOR_USER_IDS);
  const strictAllowlistOnly = Boolean(process.env.TG_MANAGER_USER_IDS?.trim());
  const allowedUserIds = new Set<number>([...ownerIds, ...managerIds]);

  const webhookSecret = process.env.TG_WEBHOOK_SECRET?.trim()
    || (botToken
      ? createHmac('sha256', botToken).update('serenity-tg-webhook-v1').digest('hex').slice(0, 48)
      : '');
  const exportToken = process.env.EXPORT_SECRET_TOKEN?.trim()
    || (botToken
      ? createHmac('sha256', botToken).update('serenity-csv-export-v1').digest('hex').slice(0, 32)
      : '');
  const adsBasicUser = process.env.ADS_EXPORT_BASIC_USER?.trim() || 'serenity_ads';
  const adsBasicPass = process.env.ADS_EXPORT_BASIC_PASS?.trim()
    || (botToken
      ? createHmac('sha256', botToken).update('serenity-ads-basic-pass-v1').digest('hex').slice(0, 24)
      : '');

  return {
    botToken,
    chatId,
    ownerUserIds: Array.from(ownerIds),
    managerUserIds: managerIds,
    operatorUserIds: operatorIds.length > 0 ? operatorIds : managerIds,
    allowedUserIds,
    strictAllowlistOnly,
    workHours: parseWorkHours(
      process.env.SPA_WORK_HOURS_START || BUSINESS_CONTACT.opens,
      process.env.SPA_WORK_HOURS_END || BUSINESS_CONTACT.closes,
    ),
    webhookSecret,
    exportToken,
    adsBasicUser,
    adsBasicPass,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() || '',
    serviceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() || '',
    serviceAccountKeyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE?.trim() || '',
    leadsTab: process.env.GOOGLE_SHEETS_LEADS_TAB?.trim() || 'Заявки',
    adsTab: process.env.GOOGLE_SHEETS_ADS_TAB?.trim() || 'Google Ads',
    adsConversionBooked: process.env.GOOGLE_ADS_CONVERSION_BOOKED?.trim() || 'Спа — запись',
    adsConversionVisited: process.env.GOOGLE_ADS_CONVERSION_VISITED?.trim() || 'Спа — визит',
  };
}
