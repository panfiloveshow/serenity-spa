import type { InlineKeyboardButton, InlineKeyboardMarkup } from './telegram-api';
import {
  addDaysYmd,
  formatDdMm,
  formatShortWeekdayDay,
  getTodayYmdTashkent,
  parseFlexibleDateToYmd,
} from '@/lib/leads/time';
import { REJECT_REASONS, type LeadRecord } from '@/lib/leads/types';

export type SchedulePickerMode = 'book' | 'reschedule';

const SLOTS_30M: readonly string[] = [
  '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30',
];

function compactYmd(ymd: string): string {
  return ymd.replace(/-/g, '');
}

function compactHm(hhmm: string): string {
  return hhmm.replace(':', '');
}

export function expandCompactYmd(compact: string): string | null {
  if (!/^\d{8}$/.test(compact)) return null;
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

export function expandCompactHm(compact: string): string | null {
  if (!/^\d{4}$/.test(compact)) return null;
  const hh = Number(compact.slice(0, 2));
  const mm = Number(compact.slice(2, 4));
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return `${compact.slice(0, 2)}:${compact.slice(2, 4)}`;
}

export function buildInitialKeyboard(leadId: string): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: '📞 Связался', callback_data: `l:${leadId}:work` },
        { text: '❌ Не дозвонился', callback_data: `l:${leadId}:na` },
      ],
      [
        { text: '✅ Записан', callback_data: `l:${leadId}:bk` },
        { text: '🚫 Отказ', callback_data: `l:${leadId}:rj` },
        { text: '🗑 Спам', callback_data: `l:${leadId}:sp` },
      ],
    ],
  };
}

export function buildFullEditKeyboard(leadId: string): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      ...buildInitialKeyboard(leadId).inline_keyboard,
      [
        { text: '🤔 Думает', callback_data: `l:${leadId}:th` },
        { text: '📵 Не вышел на связь', callback_data: `l:${leadId}:nc` },
      ],
      [{ text: '↩️ Отмена', callback_data: `l:${leadId}:back` }],
    ],
  };
}

export function buildKeyboardForLead(lead: LeadRecord): InlineKeyboardMarkup {
  const editRow: InlineKeyboardButton[] = [
    { text: '✏️ Изменить статус', callback_data: `l:${lead.id}:ed` },
  ];

  switch (lead.status) {
    case 'new':
      return buildInitialKeyboard(lead.id);

    case 'in_progress':
      return {
        inline_keyboard: [
          [
            { text: '✅ Записан', callback_data: `l:${lead.id}:bk` },
            { text: '🚫 Отказ', callback_data: `l:${lead.id}:rj` },
            { text: '🤔 Думает', callback_data: `l:${lead.id}:th` },
          ],
          editRow,
        ],
      };

    case 'no_answer':
      if (lead.callAttempts >= 3) {
        return {
          inline_keyboard: [
            [{ text: '📵 Не вышел на связь', callback_data: `l:${lead.id}:nc` }],
            [
              { text: '📞 Связался', callback_data: `l:${lead.id}:work` },
              { text: '✅ Записан', callback_data: `l:${lead.id}:bk` },
              { text: '🚫 Отказ', callback_data: `l:${lead.id}:rj` },
            ],
            editRow,
          ],
        };
      }
      return {
        inline_keyboard: [
          ...buildInitialKeyboard(lead.id).inline_keyboard,
          editRow,
        ],
      };

    case 'thinking':
      return {
        inline_keyboard: [
          [
            { text: '✅ Записан', callback_data: `l:${lead.id}:bk` },
            { text: '📞 Связался', callback_data: `l:${lead.id}:work` },
            { text: '🚫 Отказ', callback_data: `l:${lead.id}:rj` },
          ],
          editRow,
        ],
      };

    case 'booked':
      return {
        inline_keyboard: [
          [
            { text: '🚶 Пришёл', callback_data: `l:${lead.id}:cm` },
            { text: '🙅 Не пришёл', callback_data: `l:${lead.id}:ns` },
          ],
          [{ text: '📅 Перенёс', callback_data: `l:${lead.id}:rs` }],
          editRow,
        ],
      };

    case 'visited':
    case 'no_show':
    case 'wont_come':
    case 'no_contact':
    case 'rejected':
    case 'spam':
      return {
        inline_keyboard: [editRow],
      };
  }
}

export function buildDatePickerKeyboard(
  lead: LeadRecord,
  mode: SchedulePickerMode,
  now = new Date(),
): InlineKeyboardMarkup {
  const op = mode === 'reschedule' ? 'rd' : 'bd';
  const selectOp = mode === 'reschedule' ? 'rsd' : 'bs';
  const confirmOp = mode === 'reschedule' ? 'rt' : 'bt';
  const rows: InlineKeyboardButton[][] = [];

  const reqYmd = parseFlexibleDateToYmd(lead.requestedDate, now);
  const reqTime = lead.requestedTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(lead.requestedTime)
    ? lead.requestedTime
    : null;

  if (mode === 'book' && reqYmd && reqTime) {
    rows.push([
      {
        text: `⭐ Как в заявке: ${formatDdMm(reqYmd)} в ${reqTime}`,
        callback_data: `l:${lead.id}:${confirmOp}:${compactYmd(reqYmd)}:${compactHm(reqTime)}`,
      },
    ]);
  }

  rows.push([
    { text: 'Сегодня', callback_data: `l:${lead.id}:${op}:td` },
    { text: 'Завтра', callback_data: `l:${lead.id}:${op}:tm` },
  ]);

  const secondRow: InlineKeyboardButton[] = [];
  if (reqYmd) {
    secondRow.push({
      text: `Как в заявке (${formatDdMm(reqYmd)})`,
      callback_data: `l:${lead.id}:${selectOp}:${compactYmd(reqYmd)}`,
    });
  }
  secondRow.push({ text: 'Другая дата', callback_data: `l:${lead.id}:${op}:ot:0` });
  rows.push(secondRow);

  rows.push([{ text: '↩️ Отмена', callback_data: `l:${lead.id}:back` }]);
  return { inline_keyboard: rows };
}

export function buildCustomDateGridKeyboard(
  leadId: string,
  mode: SchedulePickerMode,
  pageOffset = 0,
  now = new Date(),
): InlineKeyboardMarkup {
  const selectOp = mode === 'reschedule' ? 'rsd' : 'bs';
  const pageOp = mode === 'reschedule' ? 'rd' : 'bd';
  const todayYmd = getTodayYmdTashkent(now);
  const safeOffset = Math.max(0, Math.min(30, pageOffset));
  const startDay = safeOffset * 12;

  const buttons: InlineKeyboardButton[] = [];
  for (let i = 0; i < 12; i += 1) {
    const ymd = addDaysYmd(todayYmd, startDay + i);
    buttons.push({
      text: formatShortWeekdayDay(ymd),
      callback_data: `l:${leadId}:${selectOp}:${compactYmd(ymd)}`,
    });
  }

  const rows: InlineKeyboardButton[][] = [];
  for (let i = 0; i < buttons.length; i += 3) {
    rows.push(buttons.slice(i, i + 3));
  }

  const navRow: InlineKeyboardButton[] = [];
  if (safeOffset > 0) {
    navRow.push({ text: '⬅️ Назад', callback_data: `l:${leadId}:${pageOp}:ot:${safeOffset - 1}` });
  }
  if (safeOffset < 3) {
    navRow.push({ text: 'Дальше ➡️', callback_data: `l:${leadId}:${pageOp}:ot:${safeOffset + 1}` });
  }
  if (navRow.length > 0) rows.push(navRow);

  rows.push([{ text: '↩️ Отмена', callback_data: `l:${leadId}:back` }]);
  return { inline_keyboard: rows };
}

export function buildTimePickerKeyboard(
  lead: LeadRecord,
  mode: SchedulePickerMode,
  dateYmd: string,
): InlineKeyboardMarkup {
  const confirmOp = mode === 'reschedule' ? 'rt' : 'bt';
  const compactDate = compactYmd(dateYmd);
  const rows: InlineKeyboardButton[][] = [];

  if (lead.requestedTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(lead.requestedTime)) {
    rows.push([
      {
        text: `⭐ Как в заявке: ${lead.requestedTime}`,
        callback_data: `l:${lead.id}:${confirmOp}:${compactDate}:${compactHm(lead.requestedTime)}`,
      },
    ]);
  }

  const timeButtons: InlineKeyboardButton[] = SLOTS_30M.map(slot => ({
    text: slot,
    callback_data: `l:${lead.id}:${confirmOp}:${compactDate}:${compactHm(slot)}`,
  }));

  for (let i = 0; i < timeButtons.length; i += 4) {
    rows.push(timeButtons.slice(i, i + 4));
  }

  rows.push([
    {
      text: '⬅️ Другая дата',
      callback_data: `l:${lead.id}:${mode === 'reschedule' ? 'rs' : 'bk'}`,
    },
    { text: '↩️ Отмена', callback_data: `l:${lead.id}:back` },
  ]);

  return { inline_keyboard: rows };
}

export function buildRejectReasonKeyboard(leadId: string): InlineKeyboardMarkup {
  const buttons: InlineKeyboardButton[] = REJECT_REASONS.map((reason, idx) => ({
    text: reason,
    callback_data: `l:${leadId}:rr:${idx}`,
  }));

  return {
    inline_keyboard: [
      buttons.slice(0, 2),
      buttons.slice(2, 4),
      [buttons[4], { text: '↩️ Отмена', callback_data: `l:${leadId}:back` }],
    ],
  };
}

export function buildVisitCheckKeyboard(leadId: string): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: '🚶 Пришёл', callback_data: `l:${leadId}:cm` },
        { text: '🙅 Не пришёл', callback_data: `l:${leadId}:ns` },
      ],
    ],
  };
}

export function buildNoShowFollowupKeyboard(leadId: string): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: '📅 Перенёс', callback_data: `l:${leadId}:rs` },
        { text: '🙅 Не придёт', callback_data: `l:${leadId}:wc` },
      ],
    ],
  };
}

export function buildSummaryPeriodKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: 'Неделя', callback_data: 'sv:week' },
        { text: 'Месяц', callback_data: 'sv:month' },
        { text: 'Свой период', callback_data: 'sv:custom' },
      ],
    ],
  };
}
