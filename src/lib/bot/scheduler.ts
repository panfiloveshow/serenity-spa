import { maybeExportGoogleAdsConversion } from '@/lib/integrations/google-ads-export';
import { isGoogleSheetsConfiguredSync, syncLeadToSheets } from '@/lib/integrations/google-sheets';
import { getLeadsStore } from '@/lib/leads/store';
import {
  getPreviousFullWeekRangeTashkent,
  getTodayYmdTashkent,
  isWithinWorkingHours,
  parseYmdAndTimeToDate,
  toTashkentParts,
  workingMinutesBetween,
} from '@/lib/leads/time';
import { isFinalLeadStatus } from '@/lib/leads/types';
import { buildTelegramMessageUrl } from './card';
import { getBotConfig } from './config';
import { buildVisitCheckKeyboard } from './keyboards';
import { buildDailyVisitsDigest, buildSummaryReport } from './reports';
import { escapeHtml, notifyOwnersDm, tgSendMessage } from './telegram-api';

const TICK_INTERVAL_MS = 30_000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

let tickInFlight: Promise<void> | null = null;

async function runSchedulerTickInternal(now: Date): Promise<void> {
  const cfg = getBotConfig();
  if (!cfg.botToken) return;

  const store = getLeadsStore();
  const leads = await store.listLeads();
  const inWorkHours = isWithinWorkingHours(now, cfg.workHours);

  // 1-4 & 6. Per-lead reminders and post-appointment visit checks
  for (const lead of leads) {
    const targetChatId = lead.telegramChatId || cfg.chatId;

    // 1. 15 min without status
    if (
      inWorkHours
      && targetChatId
      && lead.status === 'new'
      && !lead.reminded15mAt
      && workingMinutesBetween(new Date(lead.createdAt), now, cfg.workHours) >= 15
    ) {
      try {
        const operatorMentions = cfg.operatorUserIds
          .map(userId => `<a href="tg://user?id=${userId}">Оператор</a>`)
          .join(', ');
        const mentionLine = operatorMentions ? `\n${operatorMentions}` : '';
        await tgSendMessage(cfg.botToken, {
          chatId: targetChatId,
          replyToMessageId: lead.telegramMessageId,
          text: `⏰ Заявка <b>${escapeHtml(lead.name)}</b> 15 минут без ответа${mentionLine}`,
        });
        await store.updateLead(
          lead.id,
          draft => {
            draft.reminded15mAt = now.toISOString();
          },
          { preserveUpdatedAt: true },
        );
      } catch (err) {
        console.error(`Failed 15m reminder for lead ${lead.id}:`, err);
      }
    }

    // 2. 60 min without status -> DM owner (with group fallback if DM not activated yet)
    if (
      inWorkHours
      && (cfg.ownerUserIds.length > 0 || targetChatId)
      && lead.status === 'new'
      && !lead.reminded60mAt
      && workingMinutesBetween(new Date(lead.createdAt), now, cfg.workHours) >= 60
    ) {
      try {
        const cardUrl = buildTelegramMessageUrl(targetChatId, lead.telegramMessageId);
        const contact = lead.phone || lead.contact || 'не указан';
        const linkLine = cardUrl ? `\n🔗 <a href="${escapeHtml(cardUrl)}">Открыть карточку</a>` : '';
        const delivered = await notifyOwnersDm(
          cfg.botToken,
          cfg.ownerUserIds,
          `🚨 Заявка <b>${escapeHtml(lead.name)}</b> 60 минут без ответа!\nУслуга: ${escapeHtml(lead.service)}\nКонтакт: <code>${escapeHtml(contact)}</code>${linkLine}`,
        );
        if (delivered === 0 && targetChatId) {
          await tgSendMessage(cfg.botToken, {
            chatId: targetChatId,
            replyToMessageId: lead.telegramMessageId,
            text: `🚨 Заявка <b>${escapeHtml(lead.name)}</b> уже 60 минут без статуса! (Для получения таких уведомлений в личку руководителю нужно один раз нажать Start в @spaserenity_bot)`,
          });
        }
        await store.updateLead(
          lead.id,
          draft => {
            draft.reminded60mAt = now.toISOString();
          },
          { preserveUpdatedAt: true },
        );
      } catch (err) {
        console.error(`Failed 60m owner alert for lead ${lead.id}:`, err);
      }
    }

    // 3. "Не дозвонился" 2h callback reminder
    if (
      inWorkHours
      && targetChatId
      && lead.status === 'no_answer'
      && lead.callAttempts < 3
      && lead.nextCallRetryRemindAt
      && now.getTime() >= Date.parse(lead.nextCallRetryRemindAt)
    ) {
      try {
        const nextAttempt = Math.min(3, lead.callAttempts + 1);
        await tgSendMessage(cfg.botToken, {
          chatId: targetChatId,
          replyToMessageId: lead.telegramMessageId,
          text: `📞 Перезвоните: <b>${escapeHtml(lead.name)}</b>, попытка ${nextAttempt} из 3`,
        });
        await store.updateLead(
          lead.id,
          draft => {
            draft.nextCallRetryRemindAt = null;
          },
          { preserveUpdatedAt: true },
        );
      } catch (err) {
        console.error(`Failed 2h retry reminder for lead ${lead.id}:`, err);
      }
    }

    // 4. "Думает" 24h reminder
    if (
      inWorkHours
      && targetChatId
      && lead.status === 'thinking'
      && lead.nextThinkingRemindAt
      && now.getTime() >= Date.parse(lead.nextThinkingRemindAt)
    ) {
      try {
        await tgSendMessage(cfg.botToken, {
          chatId: targetChatId,
          replyToMessageId: lead.telegramMessageId,
          text: `🤔 Напоминание перезвонить: <b>${escapeHtml(lead.name)}</b> (статус «Думает»)`,
        });
        await store.updateLead(
          lead.id,
          draft => {
            draft.nextThinkingRemindAt = null;
          },
          { preserveUpdatedAt: true },
        );
      } catch (err) {
        console.error(`Failed 24h thinking reminder for lead ${lead.id}:`, err);
      }
    }

    // 6. Visit check 1h after scheduled appointment
    if (
      targetChatId
      && lead.status === 'booked'
      && lead.appointmentDate
      && lead.appointmentTime
    ) {
      const slotKey = `${lead.appointmentDate}T${lead.appointmentTime}`;
      if (lead.visitCheckSentForSlot !== slotKey) {
        const slotDate = parseYmdAndTimeToDate(lead.appointmentDate, lead.appointmentTime);
        if (slotDate) {
          const checkAtMs = slotDate.getTime() + 60 * 60 * 1000;
          if (now.getTime() >= checkAtMs && now.getTime() - checkAtMs <= SEVEN_DAYS_MS) {
            try {
              const sent = await tgSendMessage(cfg.botToken, {
                chatId: targetChatId,
                replyToMessageId: lead.telegramMessageId,
                text: `Клиент <b>${escapeHtml(lead.name)}</b> пришёл?`,
                replyMarkup: buildVisitCheckKeyboard(lead.id),
              });
              await store.updateLead(
                lead.id,
                draft => {
                  draft.visitCheckSentForSlot = slotKey;
                  draft.visitCheckMessageId = sent.messageId;
                },
                { preserveUpdatedAt: true },
              );
            } catch (err) {
              console.error(`Failed visit check prompt for lead ${lead.id}:`, err);
            }
          }
        }
      }
    }
  }

  // 5 & 7. Daily 10:00 digest & Monday 09:00 weekly summary
  const t = toTashkentParts(now);
  const todayYmd = getTodayYmdTashkent(now);
  const schedState = await store.getSchedulerState();

  if (cfg.chatId && t.hour >= 10 && t.hour < 23 && schedState.lastDailyDigestDate !== todayYmd) {
    const bookedToday = leads.filter(l => l.status === 'booked' && l.appointmentDate === todayYmd);
    try {
      if (bookedToday.length > 0) {
        const digestText = buildDailyVisitsDigest(bookedToday, todayYmd, cfg.chatId);
        await tgSendMessage(cfg.botToken, { chatId: cfg.chatId, text: digestText });
      }
      await store.updateSchedulerState({ lastDailyDigestDate: todayYmd });
    } catch (err) {
      console.error('Failed daily visits digest:', err);
    }
  }

  if (cfg.chatId && t.weekday === 1 && t.hour >= 9 && schedState.lastWeeklyReportMonday !== todayYmd) {
    try {
      const week = getPreviousFullWeekRangeTashkent(now);
      const openLeads = leads.filter(l => !isFinalLeadStatus(l.status));
      const reportText = buildSummaryReport({
        allLeads: leads,
        openLeads,
        start: week.start,
        end: week.end,
        prevStart: week.prevStart,
        prevEnd: week.prevEnd,
        chatId: cfg.chatId,
        comparisonLabel: 'прошлая неделя',
      });
      await tgSendMessage(cfg.botToken, { chatId: cfg.chatId, text: reportText });
      await store.updateSchedulerState({ lastWeeklyReportMonday: todayYmd });
    } catch (err) {
      console.error('Failed Monday weekly summary:', err);
    }
  }

  // 8. Retry pending Google Sheets / Google Ads exports
  if (isGoogleSheetsConfiguredSync()) {
    const refreshedLeads = await store.listLeads();
    for (const lead of refreshedLeads) {
      if (lead.sheetsSyncedUpdatedAt !== lead.updatedAt) {
        await syncLeadToSheets(lead.id);
      }
      if (lead.status === 'booked' && !lead.adsConversionsSent?.booked) {
        await maybeExportGoogleAdsConversion(lead.id, 'booked', new Date(lead.updatedAt));
      }
      if (lead.status === 'visited' && !lead.adsConversionsSent?.visited) {
        await maybeExportGoogleAdsConversion(lead.id, 'visited', new Date(lead.updatedAt));
      }
    }
  }
}

export async function runSchedulerTick(now = new Date()): Promise<void> {
  if (tickInFlight) {
    return tickInFlight;
  }
  tickInFlight = runSchedulerTickInternal(now).finally(() => {
    tickInFlight = null;
  });
  return tickInFlight;
}

const GLOBAL_SCHEDULER_KEY = Symbol.for('serenity-spa.bot-scheduler');

export function startBotScheduler(): void {
  if (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test') return;
  const g = globalThis as unknown as Record<symbol, NodeJS.Timeout | undefined>;
  if (g[GLOBAL_SCHEDULER_KEY]) return;

  const timer = setInterval(() => {
    void runSchedulerTick().catch(err => {
      console.error('Bot scheduler tick error:', err);
    });
  }, TICK_INTERVAL_MS);
  timer.unref?.();
  g[GLOBAL_SCHEDULER_KEY] = timer;
}
