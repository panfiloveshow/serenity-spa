export type LeadStatus =
  | 'new'
  | 'in_progress'
  | 'no_answer'
  | 'thinking'
  | 'booked'
  | 'visited'
  | 'no_show'
  | 'wont_come'
  | 'no_contact'
  | 'rejected'
  | 'spam';

export const FINAL_LEAD_STATUSES: readonly LeadStatus[] = [
  'visited',
  'no_show',
  'wont_come',
  'rejected',
  'spam',
  'no_contact',
] as const;

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Без статуса',
  in_progress: 'В работе',
  no_answer: 'Не дозвонился',
  thinking: 'Думает',
  booked: 'Записан',
  visited: 'Пришёл',
  no_show: 'Не пришёл',
  wont_come: 'Не придёт',
  no_contact: 'Не вышел на связь',
  rejected: 'Отказ',
  spam: 'Спам',
};

export const REJECT_REASONS = [
  'Дорого',
  'Не подошло время',
  'Передумал',
  'Выбрал другое место',
  'Другое',
] as const;

export type RejectReason = (typeof REJECT_REASONS)[number];

export interface LeadHistoryEntry {
  at: string; // ISO UTC
  status: LeadStatus | 'edit';
  text: string;
  userId: number;
  userName: string;
}

export interface AdsConversionRecord {
  sentAt: string; // ISO UTC
  clickIdType: 'gclid' | 'gbraid' | 'wbraid';
  clickId: string;
  value: number | null;
}

export interface LeadRecord {
  id: string;
  createdAt: string; // ISO UTC
  updatedAt: string; // ISO UTC

  // Client & request details
  name: string;
  phone: string;
  contact: string;
  service: string;
  serviceCategory: string;
  servicePriceUzs: number | null;
  requestedDate: string | null;
  requestedTime: string | null;

  // Attribution & Risk
  source: string;
  campaign: string;
  network: string;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  adClickAt: string | null;
  riskScore: number;
  riskLevel: string;
  initialTitle: string;
  repeatOfLeadId: string | null;

  // Workflow status
  status: LeadStatus;
  appointmentDate: string | null; // YYYY-MM-DD
  appointmentTime: string | null; // HH:MM
  bookedAt?: string | null; // ISO UTC when marked Записан / Перенёс
  visitedAt?: string | null; // ISO UTC when marked Пришёл
  bookedValueUsd?: number | null;
  visitedValueUsd?: number | null;
  rejectReason: string | null;
  callAttempts: number;
  handledByUserId: number | null;
  handledByName: string | null;
  firstRespondedAt: string | null;
  firstResponseMinutes: number | null;
  history: LeadHistoryEntry[];

  // Telegram message references
  telegramChatId: string | null;
  telegramMessageId: number | null;
  cardBodyHtml: string;

  // Reminder & notification flags
  reminded15mAt: string | null;
  reminded60mAt: string | null;
  nextCallRetryRemindAt: string | null;
  nextThinkingRemindAt: string | null;
  visitCheckSentForSlot: string | null; // e.g. "2026-11-18T16:00"
  visitCheckMessageId: number | null;

  // Google Sheets & Ads sync state
  sheetsRowNumber: number | null;
  sheetsSyncedUpdatedAt: string | null;
  adsConversionsSent: {
    booked?: AdsConversionRecord;
    visited?: AdsConversionRecord;
  };
}

export interface SchedulerState {
  lastDailyDigestDate: string | null; // YYYY-MM-DD in Asia/Tashkent
  lastWeeklyReportMonday: string | null; // YYYY-MM-DD of Monday in Asia/Tashkent
}

export interface LeadsDatabaseSnapshot {
  version: 1;
  scheduler: SchedulerState;
  leads: LeadRecord[];
}

export function isFinalLeadStatus(status: LeadStatus): boolean {
  return (FINAL_LEAD_STATUSES as readonly string[]).includes(status);
}
