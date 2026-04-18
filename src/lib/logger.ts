import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const LOG_DIR = process.env.LOG_DIR || '/var/log/serenity-spa';
const FAILED_BOOKINGS_DIR = process.env.FAILED_BOOKINGS_DIR || '/var/www/serenity-spa/failed-bookings';

type LogLevel = 'info' | 'error' | 'warn';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
}

// --- PII masking helpers ---------------------------------------------------

function maskName(name: string | undefined | null): string {
  if (!name) return '';
  const trimmed = String(name).trim();
  if (trimmed.length <= 2) return trimmed.charAt(0) + '*';
  return trimmed.charAt(0) + '***' + trimmed.charAt(trimmed.length - 1);
}

function maskPhone(phone: string | undefined | null): string {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length < 5) return '***';
  // Keep country code + last 2 digits (e.g. +998 ** *** ** 67)
  return '+' + digits.slice(0, 3) + ' ** *** ** ' + digits.slice(-2);
}

function maskIp(ip: string | undefined | null): string {
  if (!ip || ip === 'Unknown') return 'Unknown';
  const s = String(ip);
  // IPv4 — keep first 2 octets, mask last 2
  const v4 = s.match(/^(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (v4) return `${v4[1]}.*.*`;
  // IPv6 — keep first 2 groups
  if (s.includes(':')) {
    const parts = s.split(':').filter(Boolean);
    return parts.slice(0, 2).join(':') + ':****';
  }
  return '***';
}

function maskEmail(email: string | undefined | null): string {
  if (!email) return '';
  const s = String(email);
  const at = s.indexOf('@');
  if (at < 1) return '***';
  return s.charAt(0) + '***' + s.slice(at);
}

// --- Core logger -----------------------------------------------------------

export async function logToFile(entry: LogEntry): Promise<void> {
  if (typeof window !== 'undefined') return;

  try {
    const logFile = join(LOG_DIR, 'bookings.log');
    const logLine = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${entry.data ? ` ${JSON.stringify(entry.data)}` : ''}\n`;
    await appendFile(logFile, logLine, 'utf-8');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

interface BookingPayload {
  name?: string;
  phone?: string;
  service?: string;
  email?: string;
}

interface BookingLogMeta {
  requestId?: string;
  score?: number;
  level?: string;
  serverUA?: string;
  referrer?: string;
  gclid?: string;
  gad_source?: string;
  flags?: string[];
}

export async function logBookingSuccess(
  data: BookingPayload,
  ip: string,
  meta: BookingLogMeta = {},
): Promise<void> {
  await logToFile({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Booking sent successfully',
    data: {
      requestId: meta.requestId,
      name: maskName(data.name),
      phone: maskPhone(data.phone),
      service: data.service,
      ip: maskIp(ip),
      score: meta.score,
      level: meta.level,
      flags: meta.flags,
      serverUA: meta.serverUA?.slice(0, 120),
      referrer: meta.referrer,
      gclid: meta.gclid ? meta.gclid.slice(0, 12) + '…' : undefined,
      gad_source: meta.gad_source,
    },
  });
}

export async function logBookingError(
  error: unknown,
  data: BookingPayload,
  ip: string,
  meta: BookingLogMeta = {},
): Promise<void> {
  const errMessage = error instanceof Error ? error.message : String(error);
  await logToFile({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: 'Booking failed',
    data: {
      requestId: meta.requestId,
      error: errMessage,
      name: maskName(data.name),
      phone: maskPhone(data.phone),
      service: data.service,
      ip: maskIp(ip),
      score: meta.score,
      level: meta.level,
      flags: meta.flags,
      serverUA: meta.serverUA?.slice(0, 120),
      referrer: meta.referrer,
      gclid: meta.gclid ? meta.gclid.slice(0, 12) + '…' : undefined,
      gad_source: meta.gad_source,
    },
  });
}

export async function saveFailedBooking(data: Record<string, unknown>): Promise<string> {
  if (typeof window !== 'undefined') return '';

  try {
    if (!existsSync(FAILED_BOOKINGS_DIR)) {
      await mkdir(FAILED_BOOKINGS_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}.json`;
    const filepath = join(FAILED_BOOKINGS_DIR, filename);

    const failedBooking = {
      ...data,
      failedAt: new Date().toISOString(),
      retryCount: 0,
    };

    await writeFile(filepath, JSON.stringify(failedBooking, null, 2), 'utf-8');

    await logToFile({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message: 'Booking saved to failed queue',
      data: { filename },
    });

    return filepath;
  } catch (error) {
    console.error('Failed to save failed booking:', error);
    return '';
  }
}

// Exported so scripts/retry can produce consistent masked output
export { maskName, maskPhone, maskIp, maskEmail };
