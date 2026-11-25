import { resolveServiceInfo } from '@/lib/leads/catalog-price';
import { getLeadsStore } from '@/lib/leads/store';
import {
  addDaysYmd,
  formatDdMm,
  formatHistoryStamp,
  getTodayYmdTashkent,
  parseFlexibleDateToYmd,
  workingMinutesBetween,
  ymdToTashkentEnd,
  ymdToTashkentStart,
} from '@/lib/leads/time';
import { REJECT_REASONS, type LeadRecord } from '@/lib/leads/types';
import { logToFile } from '@/lib/logger';
import { getUsdRateUzs, uzsToUsdAmount } from '@/lib/integrations/fx-rate';
import { maybeExportGoogleAdsConversion } from '@/lib/integrations/google-ads-export';
import { syncLeadToSheets } from '@/lib/integrations/google-sheets';
import { renderLeadCardHtml } from './card';
import { getBotConfig } from './config';
import {
  buildCustomDateGridKeyboard,
  buildDatePickerKeyboard,
  buildFullEditKeyboard,
  buildKeyboardForLead,
  buildNoShowFollowupKeyboard,
  buildRejectReasonKeyboard,
  buildSummaryPeriodKeyboard,
  buildTimePickerKeyboard,
  buildVisitCheckKeyboard,
  expandCompactHm,
  expandCompactYmd,
  type SchedulePickerMode,
} from './keyboards';
import { buildOpenLeadsReport, buildSummaryReport } from './reports';
import {
  escapeHtml,
  formatTelegramUserName,
  tgAnswerCallbackQuery,
  tgEditMessageText,
  tgGetChatMember,
  tgSendMessage,
  type TelegramCallbackQuery,
  type TelegramMessage,
  type TelegramUpdate,
} from './telegram-api';

const CUSTOM_PERIOD_TTL_MS = 10 * 60 * 1000;
const pendingCustomPeriods = new Map<string, number>();

async function isAuthorizedUser(
  cfg: ReturnType<typeof getBotConfig>,
  userId: number,
): Promise<boolean> {
  if (cfg.allowedUserIds.has(userId)) return true;
  if (cfg.strictAllowlistOnly) return false;
  if (!cfg.chatId) return false;
  return tgGetChatMember(cfg.botToken, cfg.chatId, userId);
}

function periodKey(chatId: string | number, userId: number): string {
  return `${chatId}:${userId}`;
}

export function parseCustomDateRange(
  raw: string,
  now = new Date(),
): { start: Date; end: Date; prevStart: Date; prevEnd: Date } | null {
  const match = raw.trim().match(/^(\d{1,2}\.\d{1,2}(?:\.\d{4})?)\s*[-–—]\s*(\d{1,2}\.\d{1,2}(?:\.\d{4})?)$/);
  if (!match) return null;

  const ymdA = parseFlexibleDateToYmd(match[1], now);
  const ymdB = parseFlexibleDateToYmd(match[2], now);
  if (!ymdA || !ymdB) return null;

  const [startYmd, endYmd] = ymdA <= ymdB ? [ymdA, ymdB] : [ymdB, ymdA];
  const start = ymdToTashkentStart(startYmd);
  const end = ymdToTashkentEnd(endYmd);
  const spanMs = end.getTime() - start.getTime() + 1;
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - spanMs + 1);
  return { start, end, prevStart, prevEnd };
}

function recordFirstResponseIfUnset(lead: LeadRecord, now: Date, workHours: ReturnType<typeof getBotConfig>['workHours']): void {
  if (!lead.firstRespondedAt) {
    lead.firstRespondedAt = now.toISOString();
    lead.firstResponseMinutes = workingMinutesBetween(new Date(lead.createdAt), now, workHours);
  }
}

async function sendPeriodSummary(
  botToken: string,
  targetChatId: string | number,
  range: { start: Date; end: Date; prevStart: Date; prevEnd: Date },
  comparisonLabel: string,
): Promise<void> {
  const store = getLeadsStore();
  const [allLeads, openLeads] = await Promise.all([store.listLeads(), store.listOpenLeads()]);
  const text = buildSummaryReport({
    allLeads,
    openLeads,
    start: range.start,
    end: range.end,
    prevStart: range.prevStart,
    prevEnd: range.prevEnd,
    chatId: String(targetChatId),
    comparisonLabel,
  });
  await tgSendMessage(botToken, { chatId: targetChatId, text });
}

async function handleSummaryCallback(
  cq: TelegramCallbackQuery,
  op: string,
  now: Date,
): Promise<void> {
  const cfg = getBotConfig();
  const msg = cq.message;
  if (!msg) {
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  const todayYmd = getTodayYmdTashkent(now);
  if (op === 'week') {
    const start = ymdToTashkentStart(addDaysYmd(todayYmd, -6));
    const end = ymdToTashkentEnd(todayYmd);
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = ymdToTashkentStart(addDaysYmd(todayYmd, -13));
    await sendPeriodSummary(cfg.botToken, msg.chat.id, { start, end, prevStart, prevEnd }, 'прошлые 7 дн.');
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Сводка за неделю' });
    return;
  }

  if (op === 'month') {
    const start = ymdToTashkentStart(addDaysYmd(todayYmd, -29));
    const end = ymdToTashkentEnd(todayYmd);
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = ymdToTashkentStart(addDaysYmd(todayYmd, -59));
    await sendPeriodSummary(cfg.botToken, msg.chat.id, { start, end, prevStart, prevEnd }, 'прошлые 30 дн.');
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Сводка за месяц' });
    return;
  }

  if (op === 'custom') {
    pendingCustomPeriods.set(periodKey(msg.chat.id, cq.from.id), now.getTime() + CUSTOM_PERIOD_TTL_MS);
    await tgSendMessage(cfg.botToken, {
      chatId: msg.chat.id,
      replyToMessageId: msg.message_id,
      text: 'Введите период в формате <code>ДД.ММ.ГГГГ - ДД.ММ.ГГГГ</code> (например, <code>01.11.2026 - 16.11.2026</code>):',
    });
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
}

async function handleLeadCallback(
  cq: TelegramCallbackQuery,
  parts: string[],
  now: Date,
): Promise<void> {
  const cfg = getBotConfig();
  const store = getLeadsStore();
  const [, leadId, op, arg1, arg2] = parts;
  const lead = await store.getLead(leadId);

  if (!lead) {
    await tgAnswerCallbackQuery(cfg.botToken, {
      callbackQueryId: cq.id,
      text: 'Заявка не найдена в базе',
      showAlert: true,
    });
    return;
  }

  const msg = cq.message;
  const msgChatId = msg ? String(msg.chat.id) : (lead.telegramChatId || cfg.chatId);
  const cardChatId = lead.telegramChatId || msgChatId;
  const cardMsgId = lead.telegramMessageId;
  const isVisitCheckMessage = Boolean(
    msg && lead.visitCheckMessageId && msg.message_id === lead.visitCheckMessageId,
  );
  const userName = formatTelegramUserName(cq.from);
  const stamp = formatHistoryStamp(now);

  const editMainCard = async (
    targetLead: LeadRecord,
    promptLine?: string,
    markup = buildKeyboardForLead(targetLead),
  ) => {
    if (!cardChatId || !cardMsgId) return;
    await tgEditMessageText(cfg.botToken, {
      chatId: cardChatId,
      messageId: cardMsgId,
      text: renderLeadCardHtml(targetLead, promptLine),
      replyMarkup: markup,
    });
  };

  const syncAfterMutation = async (
    updated: LeadRecord,
    adsEvent?: 'booked' | 'visited',
  ) => {
    await syncLeadToSheets(updated.id);
    if (adsEvent) {
      await maybeExportGoogleAdsConversion(updated.id, adsEvent, now);
    }
  };

  // Non-mutating pickers / navigation
  if (op === 'ed') {
    await editMainCard(lead, 'Выберите новый статус:', buildFullEditKeyboard(lead.id));
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  if (op === 'back') {
    if (isVisitCheckMessage && msg) {
      const keyboard = lead.status === 'no_show'
        ? buildNoShowFollowupKeyboard(lead.id)
        : buildVisitCheckKeyboard(lead.id);
      const label = lead.status === 'no_show'
        ? `🙅 Клиент <b>${escapeHtml(lead.name)}</b> не пришёл — выберите действие:`
        : `Клиент <b>${escapeHtml(lead.name)}</b> пришёл?`;
      await tgEditMessageText(cfg.botToken, {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: label,
        replyMarkup: keyboard,
      });
    } else {
      await editMainCard(lead);
    }
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  if (op === 'rj') {
    await editMainCard(lead, 'Выберите причину отказа:', buildRejectReasonKeyboard(lead.id));
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  if (op === 'bk' || op === 'rs') {
    const mode: SchedulePickerMode = op === 'rs' ? 'reschedule' : 'book';
    const prompt = mode === 'reschedule' ? 'Выберите новую дату визита:' : 'Выберите дату визита:';
    const markup = buildDatePickerKeyboard(lead, mode, now);
    if (isVisitCheckMessage && msg) {
      await tgEditMessageText(cfg.botToken, {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: `📅 <b>${escapeHtml(lead.name)}</b> — ${escapeHtml(prompt)}`,
        replyMarkup: markup,
      });
    } else {
      await editMainCard(lead, prompt, markup);
    }
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  if (op === 'bd' || op === 'rd') {
    const mode: SchedulePickerMode = op === 'rd' ? 'reschedule' : 'book';
    const showTimeForYmd = async (ymd: string) => {
      const prompt = `Дата визита: ${formatDdMm(ymd)}. Выберите время:`;
      const markup = buildTimePickerKeyboard(lead, mode, ymd);
      if (isVisitCheckMessage && msg) {
        await tgEditMessageText(cfg.botToken, {
          chatId: msg.chat.id,
          messageId: msg.message_id,
          text: `📅 <b>${escapeHtml(lead.name)}</b> — ${escapeHtml(prompt)}`,
          replyMarkup: markup,
        });
      } else {
        await editMainCard(lead, prompt, markup);
      }
    };

    if (arg1 === 'td') {
      await showTimeForYmd(getTodayYmdTashkent(now));
      await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
      return;
    }
    if (arg1 === 'tm') {
      await showTimeForYmd(addDaysYmd(getTodayYmdTashkent(now), 1));
      await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
      return;
    }
    if (arg1 === 'ot') {
      const page = Number(arg2) || 0;
      const markup = buildCustomDateGridKeyboard(lead.id, mode, page, now);
      if (isVisitCheckMessage && msg) {
        await tgEditMessageText(cfg.botToken, {
          chatId: msg.chat.id,
          messageId: msg.message_id,
          text: `📅 <b>${escapeHtml(lead.name)}</b> — Выберите дату визита:`,
          replyMarkup: markup,
        });
      } else {
        await editMainCard(lead, 'Выберите дату визита:', markup);
      }
      await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
      return;
    }
  }

  if (op === 'bs' || op === 'rsd') {
    const mode: SchedulePickerMode = op === 'rsd' ? 'reschedule' : 'book';
    const ymd = arg1 ? expandCompactYmd(arg1) : null;
    if (!ymd) {
      await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Некорректная дата' });
      return;
    }
    const prompt = `Дата визита: ${formatDdMm(ymd)}. Выберите время:`;
    const markup = buildTimePickerKeyboard(lead, mode, ymd);
    if (isVisitCheckMessage && msg) {
      await tgEditMessageText(cfg.botToken, {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: `📅 <b>${escapeHtml(lead.name)}</b> — ${escapeHtml(prompt)}`,
        replyMarkup: markup,
      });
    } else {
      await editMainCard(lead, prompt, markup);
    }
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  // Mutating status actions
  if (op === 'bt' || op === 'rt') {
    const ymd = arg1 ? expandCompactYmd(arg1) : null;
    const hhmm = arg2 ? expandCompactHm(arg2) : null;
    if (!ymd || !hhmm) {
      await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Некорректные дата или время' });
      return;
    }

    const usdRate = await getUsdRateUzs();
    const isReschedule = op === 'rt';
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'booked';
      draft.appointmentDate = ymd;
      draft.appointmentTime = hhmm;
      draft.bookedAt = now.toISOString();
      draft.rejectReason = null;
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      draft.visitCheckSentForSlot = null;
      draft.visitCheckMessageId = null;
      const resolved = resolveServiceInfo(draft.service, ymd);
      if (resolved.priceUzs !== null) {
        draft.servicePriceUzs = resolved.priceUzs;
      }
      draft.bookedValueUsd = uzsToUsdAmount(draft.servicePriceUzs, usdRate);
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      const verb = isReschedule ? '📅 Перенёс на' : '✅ Записан на';
      draft.history.push({
        at: now.toISOString(),
        status: 'booked',
        text: `${verb} ${formatDdMm(ymd)} ${hhmm} — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });

    if (!updated) return;
    await editMainCard(updated);
    if (isVisitCheckMessage && msg) {
      await tgEditMessageText(cfg.botToken, {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: `📅 Визит перенесён на <b>${formatDdMm(ymd)} ${hhmm}</b> — ${escapeHtml(userName)}, ${stamp}`,
      });
    }
    await tgAnswerCallbackQuery(cfg.botToken, {
      callbackQueryId: cq.id,
      text: `Записан: ${formatDdMm(ymd)} в ${hhmm}`,
    });
    await syncAfterMutation(updated, 'booked');
    return;
  }

  if (op === 'work') {
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'in_progress';
      draft.appointmentDate = null;
      draft.appointmentTime = null;
      draft.bookedAt = null;
      draft.visitedAt = null;
      draft.bookedValueUsd = null;
      draft.visitedValueUsd = null;
      draft.rejectReason = null;
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'in_progress',
        text: `📞 Связался — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    await editMainCard(updated);
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Статус: В работе' });
    await syncAfterMutation(updated);
    return;
  }

  if (op === 'na') {
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'no_answer';
      draft.callAttempts += 1;
      draft.appointmentDate = null;
      draft.appointmentTime = null;
      draft.bookedAt = null;
      draft.visitedAt = null;
      draft.bookedValueUsd = null;
      draft.visitedValueUsd = null;
      draft.rejectReason = null;
      draft.nextThinkingRemindAt = null;
      draft.nextCallRetryRemindAt = draft.callAttempts < 3
        ? new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()
        : null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'no_answer',
        text: `❌ Не дозвонился (попытка ${draft.callAttempts} из 3) — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    const promptLine = updated.callAttempts >= 3
      ? '3 попытки без ответа — перевести в «📵 Не вышел на связь»?'
      : undefined;
    await editMainCard(updated, promptLine);
    await tgAnswerCallbackQuery(cfg.botToken, {
      callbackQueryId: cq.id,
      text: `Попытка ${updated.callAttempts} из 3`,
    });
    await syncAfterMutation(updated);
    return;
  }

  if (op === 'nc') {
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'no_contact';
      draft.appointmentDate = null;
      draft.appointmentTime = null;
      draft.bookedAt = null;
      draft.visitedAt = null;
      draft.bookedValueUsd = null;
      draft.visitedValueUsd = null;
      draft.rejectReason = null;
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'no_contact',
        text: `📵 Не вышел на связь — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    await editMainCard(updated);
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Статус: Не вышел на связь' });
    await syncAfterMutation(updated);
    return;
  }

  if (op === 'th') {
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'thinking';
      draft.appointmentDate = null;
      draft.appointmentTime = null;
      draft.bookedAt = null;
      draft.visitedAt = null;
      draft.bookedValueUsd = null;
      draft.visitedValueUsd = null;
      draft.rejectReason = null;
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'thinking',
        text: `🤔 Думает — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    await editMainCard(updated);
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Напоминание через 24 ч' });
    await syncAfterMutation(updated);
    return;
  }

  if (op === 'sp') {
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'spam';
      draft.appointmentDate = null;
      draft.appointmentTime = null;
      draft.bookedAt = null;
      draft.visitedAt = null;
      draft.bookedValueUsd = null;
      draft.visitedValueUsd = null;
      draft.rejectReason = null;
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'spam',
        text: `🗑 Спам — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    await editMainCard(updated);
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Помечено как спам' });
    await syncAfterMutation(updated);
    return;
  }

  if (op === 'rr') {
    const reason = REJECT_REASONS[Number(arg1)] ?? 'Другое';
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'rejected';
      draft.rejectReason = reason;
      draft.appointmentDate = null;
      draft.appointmentTime = null;
      draft.bookedAt = null;
      draft.visitedAt = null;
      draft.bookedValueUsd = null;
      draft.visitedValueUsd = null;
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'rejected',
        text: `🚫 Отказ (${reason}) — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    await editMainCard(updated);
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: `Отказ: ${reason}` });
    await syncAfterMutation(updated);
    return;
  }

  if (op === 'cm') {
    const usdRate = await getUsdRateUzs();
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'visited';
      draft.visitedAt = now.toISOString();
      draft.bookedAt ??= now.toISOString();
      if (draft.servicePriceUzs === null) {
        const visitDateYmd = draft.appointmentDate || parseFlexibleDateToYmd(draft.requestedDate, now);
        const resolved = resolveServiceInfo(draft.service, visitDateYmd);
        if (resolved.priceUzs !== null) {
          draft.servicePriceUzs = resolved.priceUzs;
        }
      }
      draft.visitedValueUsd = uzsToUsdAmount(draft.servicePriceUzs, usdRate);
      draft.bookedValueUsd ??= draft.visitedValueUsd;
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'visited',
        text: `🚶 Пришёл — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    await editMainCard(updated);
    if (isVisitCheckMessage && msg) {
      await tgEditMessageText(cfg.botToken, {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: `🚶 Клиент <b>${escapeHtml(updated.name)}</b> пришёл — ${escapeHtml(userName)}, ${stamp}`,
      });
    }
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Отмечен визит' });
    await syncAfterMutation(updated, 'visited');
    return;
  }

  if (op === 'ns') {
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'no_show';
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'no_show',
        text: `🙅 Не пришёл — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    if (isVisitCheckMessage && msg) {
      await editMainCard(updated);
      await tgEditMessageText(cfg.botToken, {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: `🙅 Клиент <b>${escapeHtml(updated.name)}</b> не пришёл — выберите действие:`,
        replyMarkup: buildNoShowFollowupKeyboard(updated.id),
      });
    } else {
      await editMainCard(
        updated,
        'Клиент перенёс визит или не придёт?',
        buildNoShowFollowupKeyboard(updated.id),
      );
    }
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Уточните перенос/отмену' });
    await syncAfterMutation(updated);
    return;
  }

  if (op === 'wc') {
    const updated = await store.updateLead(lead.id, draft => {
      draft.status = 'wont_come';
      draft.nextCallRetryRemindAt = null;
      draft.nextThinkingRemindAt = null;
      recordFirstResponseIfUnset(draft, now, cfg.workHours);
      draft.handledByUserId = cq.from.id;
      draft.handledByName = userName;
      draft.history.push({
        at: now.toISOString(),
        status: 'wont_come',
        text: `🙅 Не придёт — ${userName}, ${stamp}`,
        userId: cq.from.id,
        userName,
      });
    });
    if (!updated) return;
    await editMainCard(updated);
    if (isVisitCheckMessage && msg) {
      await tgEditMessageText(cfg.botToken, {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: `🙅 Клиент <b>${escapeHtml(updated.name)}</b> не придёт — ${escapeHtml(userName)}, ${stamp}`,
      });
    }
    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id, text: 'Статус: Не придёт' });
    await syncAfterMutation(updated);
    return;
  }

  await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
}

async function handleTextMessage(msg: TelegramMessage, now: Date): Promise<void> {
  const cfg = getBotConfig();
  const text = (msg.text ?? '').trim();
  if (!text || !msg.from) return;

  const userId = msg.from.id;
  const cmdMatch = text.match(/^\/(start|id|whoami|open|svodka)(?:@[a-z0-9_]+)?(?:\s+([\s\S]+))?$/i);

  if (cmdMatch) {
    const cmd = cmdMatch[1].toLowerCase();
    const arg = (cmdMatch[2] ?? '').trim();

    if (cmd === 'start') {
      await tgSendMessage(cfg.botToken, {
        chatId: msg.chat.id,
        replyToMessageId: msg.message_id,
        text: `✅ Личные уведомления Serenity Spa подключены (ваш <code>user_id</code>: <code>${userId}</code>).`,
      });
      return;
    }

    if (cmd === 'id' || cmd === 'whoami') {
      await tgSendMessage(cfg.botToken, {
        chatId: msg.chat.id,
        replyToMessageId: msg.message_id,
        text: `Ваш <code>user_id</code>: <code>${userId}</code>\n<code>chat_id</code>: <code>${msg.chat.id}</code>`,
      });
      return;
    }

    if (!(await isAuthorizedUser(cfg, userId))) {
      await tgSendMessage(cfg.botToken, {
        chatId: msg.chat.id,
        replyToMessageId: msg.message_id,
        text: 'Нет доступа',
      });
      return;
    }

    if (cmd === 'open') {
      const store = getLeadsStore();
      const openLeads = await store.listOpenLeads();
      const report = buildOpenLeadsReport(openLeads, String(msg.chat.id));
      await tgSendMessage(cfg.botToken, {
        chatId: msg.chat.id,
        replyToMessageId: msg.message_id,
        text: report,
      });
      return;
    }

    if (cmd === 'svodka') {
      if (arg) {
        const parsed = parseCustomDateRange(arg, now);
        if (!parsed) {
          await tgSendMessage(cfg.botToken, {
            chatId: msg.chat.id,
            replyToMessageId: msg.message_id,
            text: 'Неверный формат периода. Пример: <code>/svodka 01.11.2026 - 16.11.2026</code>',
          });
          return;
        }
        await sendPeriodSummary(cfg.botToken, msg.chat.id, parsed, 'прошлый период');
        return;
      }

      await tgSendMessage(cfg.botToken, {
        chatId: msg.chat.id,
        replyToMessageId: msg.message_id,
        text: '📊 Выберите период для сводки:',
        replyMarkup: buildSummaryPeriodKeyboard(),
      });
      return;
    }
  }

  // Pending custom period reply
  const key = periodKey(msg.chat.id, userId);
  const expiresAt = pendingCustomPeriods.get(key);
  if (expiresAt && expiresAt >= now.getTime() && (await isAuthorizedUser(cfg, userId))) {
    const parsed = parseCustomDateRange(text, now);
    if (parsed) {
      pendingCustomPeriods.delete(key);
      await sendPeriodSummary(cfg.botToken, msg.chat.id, parsed, 'прошлый период');
      return;
    }
    if (/\d/.test(text)) {
      await tgSendMessage(cfg.botToken, {
        chatId: msg.chat.id,
        replyToMessageId: msg.message_id,
        text: 'Не удалось распознать даты. Используйте формат <code>ДД.ММ.ГГГГ - ДД.ММ.ГГГГ</code>.',
      });
    }
  }
}

export async function handleTelegramUpdate(
  update: TelegramUpdate,
  now = new Date(),
): Promise<void> {
  const cfg = getBotConfig();
  if (!cfg.botToken) return;

  if (update.callback_query) {
    const cq = update.callback_query;
    const userId = cq.from?.id;

    if (!userId || !(await isAuthorizedUser(cfg, userId))) {
      await tgAnswerCallbackQuery(cfg.botToken, {
        callbackQueryId: cq.id,
        text: 'Нет доступа',
        showAlert: true,
      });
      await logToFile({
        timestamp: now.toISOString(),
        level: 'warn',
        message: 'Telegram callback denied (unauthorized user)',
        data: { userId, data: cq.data },
      });
      return;
    }

    const data = cq.data ?? '';
    const parts = data.split(':');
    if (parts[0] === 'sv' && parts.length >= 2) {
      await handleSummaryCallback(cq, parts[1], now);
      return;
    }
    if (parts[0] === 'l' && parts.length >= 3) {
      await handleLeadCallback(cq, parts, now);
      return;
    }

    await tgAnswerCallbackQuery(cfg.botToken, { callbackQueryId: cq.id });
    return;
  }

  if (update.message) {
    await handleTextMessage(update.message, now);
  }
}
