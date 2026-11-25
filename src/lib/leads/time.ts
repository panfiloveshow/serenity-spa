export const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;

export interface TashkentParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  second: number; // 0-59
  weekday: number; // 0 (Sun) - 6 (Sat)
}

export interface WorkHours {
  startMin: number;
  endMin: number;
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

export function toTashkentParts(date: Date): TashkentParts {
  const shifted = new Date(date.getTime() + TASHKENT_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
    weekday: shifted.getUTCDay(),
  };
}

export function fromTashkentParts(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  ms = 0,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour - 5, minute, second, ms));
}

export function parseYmd(ymd: string): { year: number; month: number; day: number } | null {
  const match = ymd.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year
    || check.getUTCMonth() + 1 !== month
    || check.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function ymdToTashkentStart(ymd: string): Date {
  const p = parseYmd(ymd);
  if (!p) throw new Error(`Invalid YYYY-MM-DD date: ${ymd}`);
  return fromTashkentParts(p.year, p.month, p.day, 0, 0, 0, 0);
}

export function ymdToTashkentEnd(ymd: string): Date {
  const p = parseYmd(ymd);
  if (!p) throw new Error(`Invalid YYYY-MM-DD date: ${ymd}`);
  return fromTashkentParts(p.year, p.month, p.day, 23, 59, 59, 999);
}

export function getTodayYmdTashkent(now = new Date()): string {
  const p = toTashkentParts(now);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

export function addDaysYmd(ymd: string, days: number): string {
  const p = parseYmd(ymd);
  if (!p) throw new Error(`Invalid YYYY-MM-DD date: ${ymd}`);
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day + days));
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

export function formatDdMm(dateOrYmd: Date | string): string {
  if (dateOrYmd instanceof Date) {
    const p = toTashkentParts(dateOrYmd);
    return `${pad2(p.day)}.${pad2(p.month)}`;
  }
  const ymd = parseYmd(dateOrYmd);
  if (ymd) return `${pad2(ymd.day)}.${pad2(ymd.month)}`;
  const dmy = dateOrYmd.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dmy) return `${dmy[1]}.${dmy[2]}`;
  return dateOrYmd;
}

export function formatDdMmYyyy(dateOrYmd: Date | string): string {
  if (dateOrYmd instanceof Date) {
    const p = toTashkentParts(dateOrYmd);
    return `${pad2(p.day)}.${pad2(p.month)}.${p.year}`;
  }
  const ymd = parseYmd(dateOrYmd);
  if (ymd) return `${pad2(ymd.day)}.${pad2(ymd.month)}.${ymd.year}`;
  return dateOrYmd;
}

export function formatHistoryStamp(date: Date): string {
  const p = toTashkentParts(date);
  return `${pad2(p.day)}.${pad2(p.month)} ${pad2(p.hour)}:${pad2(p.minute)}`;
}

export function formatSheetsTimestamp(date: Date): string {
  const p = toTashkentParts(date);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)} ${pad2(p.hour)}:${pad2(p.minute)}:${pad2(p.second)}`;
}

export function formatAdsConversionTime(date: Date): string {
  return `${formatSheetsTimestamp(date)}+0500`;
}

export function parseFlexibleDateToYmd(raw: string | undefined | null, refNow = new Date()): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;

  const iso = parseYmd(s);
  if (iso) return `${iso.year}-${pad2(iso.month)}-${pad2(iso.day)}`;

  const dmy = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dmy) {
    const candidate = `${dmy[3]}-${pad2(Number(dmy[2]))}-${pad2(Number(dmy[1]))}`;
    return parseYmd(candidate) ? candidate : null;
  }

  const dm = s.match(/^(\d{1,2})\.(\d{1,2})$/);
  if (dm) {
    const refParts = toTashkentParts(refNow);
    const day = Number(dm[1]);
    const month = Number(dm[2]);
    const currentYearYmd = `${refParts.year}-${pad2(month)}-${pad2(day)}`;
    if (!parseYmd(currentYearYmd)) return null;
    const todayStart = fromTashkentParts(refParts.year, refParts.month, refParts.day).getTime();
    const candidateStart = ymdToTashkentStart(currentYearYmd).getTime();
    const diffDays = (candidateStart - todayStart) / 86_400_000;
    const year = diffDays < -30 ? refParts.year + 1 : refParts.year;
    const finalYmd = `${year}-${pad2(month)}-${pad2(day)}`;
    return parseYmd(finalYmd) ? finalYmd : null;
  }

  return null;
}

export function parseYmdAndTimeToDate(ymd: string, hhmm: string): Date | null {
  const p = parseYmd(ymd);
  if (!p) return null;
  const tm = hhmm.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!tm) return null;
  return fromTashkentParts(p.year, p.month, p.day, Number(tm[1]), Number(tm[2]), 0, 0);
}

export function isWeekendYmd(ymd: string): boolean {
  const p = parseYmd(ymd);
  if (!p) return false;
  const weekday = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
  return weekday === 0 || weekday === 6;
}

const WEEKDAY_SHORT_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;

export function formatShortWeekdayDay(ymd: string): string {
  const p = parseYmd(ymd);
  if (!p) return ymd;
  const weekday = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
  return `${WEEKDAY_SHORT_RU[weekday]} ${pad2(p.day)}.${pad2(p.month)}`;
}

const MONTHS_GENITIVE_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
] as const;

export function formatRussianDateRange(start: Date, end: Date): string {
  const s = toTashkentParts(start);
  const e = toTashkentParts(end);
  if (s.year === e.year && s.month === e.month) {
    return `${s.day}–${e.day} ${MONTHS_GENITIVE_RU[s.month - 1]}`;
  }
  return `${s.day} ${MONTHS_GENITIVE_RU[s.month - 1]} – ${e.day} ${MONTHS_GENITIVE_RU[e.month - 1]}`;
}

export function parseWorkHours(startStr = '09:00', endStr = '22:00'): WorkHours {
  const parseHm = (val: string, fallback: number): number => {
    const m = val.trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    if (!m) return fallback;
    return Number(m[1]) * 60 + Number(m[2]);
  };
  const startMin = parseHm(startStr, 9 * 60);
  const endMin = parseHm(endStr, 22 * 60);
  if (startMin >= endMin) {
    return { startMin: 9 * 60, endMin: 22 * 60 };
  }
  return { startMin, endMin };
}

export function isWithinWorkingHours(date: Date, wh: WorkHours): boolean {
  const p = toTashkentParts(date);
  const minOfDay = p.hour * 60 + p.minute;
  return minOfDay >= wh.startMin && minOfDay < wh.endMin;
}

export function clampToWorkingHours(date: Date, wh: WorkHours): Date {
  const p = toTashkentParts(date);
  const minOfDay = p.hour * 60 + p.minute;
  const startHour = Math.floor(wh.startMin / 60);
  const startMinute = wh.startMin % 60;

  if (minOfDay < wh.startMin) {
    return fromTashkentParts(p.year, p.month, p.day, startHour, startMinute, 0, 0);
  }
  if (minOfDay >= wh.endMin) {
    const nextYmd = addDaysYmd(`${p.year}-${pad2(p.month)}-${pad2(p.day)}`, 1);
    const next = parseYmd(nextYmd)!;
    return fromTashkentParts(next.year, next.month, next.day, startHour, startMinute, 0, 0);
  }
  return date;
}

export function workingMinutesBetween(createdAt: Date, eventAt: Date, wh: WorkHours): number {
  if (eventAt.getTime() <= createdAt.getTime()) return 0;

  const effectiveStart = clampToWorkingHours(createdAt, wh);
  if (eventAt.getTime() <= effectiveStart.getTime()) {
    return 0;
  }

  let cursorYmd = getTodayYmdTashkent(effectiveStart);
  const endYmd = getTodayYmdTashkent(eventAt);
  const startHour = Math.floor(wh.startMin / 60);
  const startMinute = wh.startMin % 60;
  const endHour = Math.floor(wh.endMin / 60);
  const endMinute = wh.endMin % 60;

  let totalMs = 0;
  let safety = 0;
  while (cursorYmd <= endYmd && safety < 4000) {
    safety += 1;
    const p = parseYmd(cursorYmd)!;
    const winStart = fromTashkentParts(p.year, p.month, p.day, startHour, startMinute, 0, 0).getTime();
    const winEnd = fromTashkentParts(p.year, p.month, p.day, endHour, endMinute, 0, 0).getTime();
    const overlapStart = Math.max(effectiveStart.getTime(), winStart);
    const overlapEnd = Math.min(eventAt.getTime(), winEnd);
    if (overlapEnd > overlapStart) {
      totalMs += overlapEnd - overlapStart;
    }
    cursorYmd = addDaysYmd(cursorYmd, 1);
  }

  return Math.floor(totalMs / 60_000);
}

export function getPreviousFullWeekRangeTashkent(now = new Date()): {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  mondayYmd: string;
} {
  const p = toTashkentParts(now);
  const todayYmd = `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
  const daysSinceMonday = (p.weekday + 6) % 7;
  const currentMondayYmd = addDaysYmd(todayYmd, -daysSinceMonday);
  const mondayYmd = addDaysYmd(currentMondayYmd, -7);
  const prevMondayYmd = addDaysYmd(mondayYmd, -7);

  const start = ymdToTashkentStart(mondayYmd);
  const end = new Date(ymdToTashkentStart(currentMondayYmd).getTime() - 1);
  const prevStart = ymdToTashkentStart(prevMondayYmd);
  const prevEnd = new Date(start.getTime() - 1);

  return { start, end, prevStart, prevEnd, mondayYmd };
}
