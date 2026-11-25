import { createHmac, randomUUID } from 'crypto';
import { mkdir, readFile, rename, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { normalizePhone, analyzePhone } from './phone-info';

const FOLLOW_UP_WINDOW = 14 * 24 * 60 * 60 * 1000;
const DEVICE_WINDOW = 10 * 60 * 1000;
interface HistoryEntry {
  id: string;
  at: number;
  accepted: boolean;
  identities: string[];
  device?: string;
}
export interface HistoryInput {
  phone: string;
  name: string;
  service?: string;
  date?: string;
  deviceId?: string;
  submittedAt?: Date;
}
export interface BookingHistoryResult {
  reservationId: string;
  firstSubmittedAt: string | null;
  deviceSubmissionsLast10m: number;
}

/** Single PM2 writer: serialize read/modify/atomic-rename, including concurrent requests.
 * Store only keyed hashes and timestamps; no clear-text names, numbers or device IDs.
 * Accepted history survives process restarts. Failed storage degrades to memory without
 * dropping an enquiry or overwriting an unreadable history file.
 */
export function createBookingHistoryStore(file: string, secret?: string) {
  let serial: Promise<unknown> = Promise.resolve();
  let memory: HistoryEntry[] = [];
  const hash = (value: string) => {
    const key = secret || process.env.TG_BOT_TOKEN;
    if (!key) throw new Error('Booking history hashing key unavailable');
    return createHmac('sha256', key).update(value).digest('hex');
  };
  const clean = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();

  function update<T>(operation: (rows: HistoryEntry[]) => T, now: number): Promise<T> {
    const task = serial.then(async () => {
      let rows = memory;
      let writable = true;
      try {
        const saved = JSON.parse(await readFile(file, 'utf8')) as { version: number; entries: HistoryEntry[] };
        if (saved.version !== 1 || !Array.isArray(saved.entries) || saved.entries.some(entry =>
          !entry || typeof entry.id !== 'string' || !Number.isFinite(entry.at)
          || typeof entry.accepted !== 'boolean' || !Array.isArray(entry.identities)
          || entry.identities.some(key => !/^[a-f0-9]{64}$/.test(key))
          || (entry.device !== undefined && !/^[a-f0-9]{64}$/.test(entry.device)))) {
          throw new Error('Invalid booking history format');
        }
        rows = saved.entries;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') rows = memory;
        else {
          writable = false;
          console.error('Booking history unavailable; using in-process history');
        }
      }
      rows = rows.filter(entry => entry.at <= now && now - entry.at <= (entry.accepted ? FOLLOW_UP_WINDOW : DEVICE_WINDOW));
      const result = operation(rows);
      memory = rows;
      if (writable) {
        try {
          await mkdir(dirname(file), { recursive: true });
          const temp = `${file}.${randomUUID()}.tmp`;
          await writeFile(temp, JSON.stringify({ version: 1, entries: rows }), { mode: 0o600 });
          await rename(temp, file);
        } catch {
          console.error('Booking history persistence unavailable; using in-process history');
        }
      }
      return result;
    });
    serial = task.catch(() => {});
    return task;
  }

  return {
    reserve(input: HistoryInput): Promise<BookingHistoryResult> {
      const now = (input.submittedAt ?? new Date()).getTime();
      return update(rows => {
        const identities: string[] = [];
        if (analyzePhone(input.phone).valid) identities.push(hash(`phone:${normalizePhone(input.phone)}`));
        if (input.name.trim() && input.service?.trim() && input.date?.trim()) {
          identities.push(hash(`appointment:${JSON.stringify([clean(input.name), clean(input.service), clean(input.date)])}`));
        }
        const device = input.deviceId ? hash(`device:${input.deviceId}`) : undefined;
        const previous = rows.filter(entry => entry.accepted && entry.identities.some(key => identities.includes(key)));
        const first = previous.length ? Math.min(...previous.map(entry => entry.at)) : null;
        const deviceCount = device ? rows.filter(entry => entry.device === device && now - entry.at < DEVICE_WINDOW).length + 1 : 1;
        const id = randomUUID();
        rows.push({ id, at: now, accepted: false, identities, device });
        return { reservationId: id, firstSubmittedAt: first === null ? null : new Date(first).toISOString(), deviceSubmissionsLast10m: deviceCount };
      }, now);
    },
    async confirm(id: string): Promise<void> {
      await update(rows => {
        const entry = rows.find(row => row.id === id);
        if (entry) entry.accepted = true;
      }, Date.now());
    },
  };
}

export const bookingHistory = createBookingHistoryStore(
  process.env.BOOKING_HISTORY_FILE || join(process.env.LOG_DIR || '/var/log/serenity-spa', 'booking-history.json'),
);
