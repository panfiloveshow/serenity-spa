import { escapeHtml } from './telegram-api';
import { formatDdMm } from '@/lib/leads/time';
import type { LeadRecord } from '@/lib/leads/types';

const MAX_CARD_LENGTH = 3950;
const HISTORY_MARKER = '\n━━━━━━━━━━━━━━━━━━━━\n📝 <b>История:</b>\n';

export function buildTelegramMessageUrl(
  chatId: string | null | undefined,
  messageId: number | null | undefined,
): string | null {
  if (!chatId || !messageId) return null;
  if (chatId.startsWith('-100') && chatId.length > 4) {
    return `https://t.me/c/${chatId.slice(4)}/${messageId}`;
  }
  if (chatId.startsWith('@') && chatId.length > 1) {
    return `https://t.me/${chatId.slice(1)}/${messageId}`;
  }
  return null;
}

export function formatCardHeader(lead: LeadRecord): string {
  switch (lead.status) {
    case 'new':
      return lead.initialTitle || '✅ НОВАЯ ЗАЯВКА';
    case 'in_progress':
      return '📞 В РАБОТЕ';
    case 'no_answer':
      return `❌ Не дозвонился (попытка ${lead.callAttempts} из 3)`;
    case 'no_contact':
      return '📵 НЕ ВЫШЕЛ НА СВЯЗЬ';
    case 'thinking':
      return '🤔 ДУМАЕТ';
    case 'booked': {
      const datePart = lead.appointmentDate ? formatDdMm(lead.appointmentDate) : 'дата не указана';
      const timePart = lead.appointmentTime ? ` в ${lead.appointmentTime}` : '';
      return `✅ ЗАПИСАН — ${datePart}${timePart}`;
    }
    case 'visited': {
      if (lead.appointmentDate && lead.appointmentTime) {
        return `🚶 ПРИШЁЛ — ${formatDdMm(lead.appointmentDate)} в ${lead.appointmentTime}`;
      }
      return '🚶 ПРИШЁЛ';
    }
    case 'no_show':
      return '🙅 НЕ ПРИШЁЛ';
    case 'wont_come':
      return '🙅 НЕ ПРИДЁТ';
    case 'rejected':
      return lead.rejectReason ? `🚫 ОТКАЗ — ${lead.rejectReason}` : '🚫 ОТКАЗ';
    case 'spam':
      return '🗑 СПАМ';
  }
}

export function renderLeadCardHtml(lead: LeadRecord, promptLine?: string): string {
  const header = `<b>${escapeHtml(formatCardHeader(lead))}</b>`;
  const body = lead.cardBodyHtml ? `\n${lead.cardBodyHtml}` : '';
  const promptBlock = promptLine ? `\n\n<b>${escapeHtml(promptLine)}</b>` : '';

  if (lead.history.length === 0) {
    return `${header}${body}${promptBlock}`.slice(0, MAX_CARD_LENGTH);
  }

  const historyLines = lead.history.map(entry => escapeHtml(entry.text));
  let full = `${header}${body}${HISTORY_MARKER}${historyLines.join('\n')}${promptBlock}`;
  if (full.length <= MAX_CARD_LENGTH) {
    return full;
  }

  // Keep the first and most recent history entries if a very long history exceeds Telegram limits
  let keptTail = historyLines.length - 1;
  while (keptTail > 1) {
    const omittedCount = historyLines.length - 1 - keptTail;
    const compactHistory = [
      historyLines[0],
      `<i>… ещё ${omittedCount} записей …</i>`,
      ...historyLines.slice(historyLines.length - keptTail),
    ];
    full = `${header}${body}${HISTORY_MARKER}${compactHistory.join('\n')}${promptBlock}`;
    if (full.length <= MAX_CARD_LENGTH) {
      return full;
    }
    keptTail -= 1;
  }

  return full.slice(0, MAX_CARD_LENGTH);
}
