import { randomUUID } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { mkdir, rename, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { analyzePhone, normalizePhone } from '@/lib/phone-info';
import { contactPhone } from '@/lib/contact-info';
import {
  isFinalLeadStatus,
  type LeadRecord,
  type LeadsDatabaseSnapshot,
  type SchedulerState,
} from './types';

export interface FindFirstLeadInput {
  phone?: string;
  contact?: string;
  name?: string;
  service?: string;
  date?: string;
  excludeId?: string;
}

const DEFAULT_SNAPSHOT = (): LeadsDatabaseSnapshot => ({
  version: 1,
  scheduler: {
    lastDailyDigestDate: null,
    lastWeeklyReportMonday: null,
  },
  leads: [],
});

function cleanText(value: string | undefined | null): string {
  return (value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeHandleOrEmail(value: string | undefined | null): string {
  const s = (value ?? '').trim().toLowerCase();
  if (!s) return '';
  if (contactPhone(s)) return '';
  return s
    .replace(/^(?:https:\/\/)?(?:t\.me|telegram\.me)\//, '@')
    .replace(/\/$/, '');
}

function extractPhones(phone?: string, contact?: string): string[] {
  const phones = new Set<string>();
  if (phone && analyzePhone(phone).valid) {
    phones.add(normalizePhone(phone));
  }
  if (contact) {
    const alt = contactPhone(contact);
    if (alt && analyzePhone(alt).valid) {
      phones.add(normalizePhone(alt));
    }
  }
  return Array.from(phones);
}

function isValidSnapshot(raw: unknown): raw is LeadsDatabaseSnapshot {
  if (!raw || typeof raw !== 'object') return false;
  const obj = raw as Partial<LeadsDatabaseSnapshot>;
  if (obj.version !== 1 || !Array.isArray(obj.leads)) return false;
  if (!obj.scheduler || typeof obj.scheduler !== 'object') return false;
  return true;
}

export function createLeadsStore(file: string) {
  let serial: Promise<unknown> = Promise.resolve();
  let memory: LeadsDatabaseSnapshot = DEFAULT_SNAPSHOT();
  let initialized = false;
  let writable = true;

  function cloneSnapshot(snap: LeadsDatabaseSnapshot): LeadsDatabaseSnapshot {
    return JSON.parse(JSON.stringify(snap)) as LeadsDatabaseSnapshot;
  }

  function ensureLoadedSync(): void {
    if (initialized) return;
    initialized = true;
    if (!existsSync(file)) return;
    try {
      const raw = readFileSync(file, 'utf8');
      const parsed = JSON.parse(raw) as unknown;
      if (!isValidSnapshot(parsed)) {
        writable = false;
        console.error('Invalid leads database format; using in-process fallback');
        return;
      }
      memory = parsed;
    } catch (error) {
      writable = false;
      console.error('Leads DB unavailable; using in-process fallback:', error);
    }
  }

  function withDb<T>(operation: (db: LeadsDatabaseSnapshot) => T, mutate: boolean): Promise<T> {
    const task = serial.then(async () => {
      ensureLoadedSync();
      const db = cloneSnapshot(memory);
      const result = operation(db);

      if (mutate) {
        memory = cloneSnapshot(db);
        if (writable) {
          try {
            await mkdir(dirname(file), { recursive: true });
            const temp = `${file}.${randomUUID()}.tmp`;
            await writeFile(temp, JSON.stringify(db, null, 2), { mode: 0o600 });
            await rename(temp, file);
          } catch (error) {
            writable = false;
            console.error('Leads DB persistence unavailable; using in-process store:', error);
          }
        }
      }

      return result;
    });

    serial = task.catch(() => {});
    return task;
  }

  return {
    createLead(lead: LeadRecord): Promise<LeadRecord> {
      return withDb(db => {
        const idx = db.leads.findIndex(item => item.id === lead.id);
        const copy = JSON.parse(JSON.stringify(lead)) as LeadRecord;
        if (idx >= 0) {
          db.leads[idx] = copy;
        } else {
          db.leads.push(copy);
        }
        return JSON.parse(JSON.stringify(copy)) as LeadRecord;
      }, true);
    },

    getLead(id: string): Promise<LeadRecord | null> {
      return withDb(db => {
        const found = db.leads.find(item => item.id === id);
        return found ? (JSON.parse(JSON.stringify(found)) as LeadRecord) : null;
      }, false);
    },

    updateLead(
      id: string,
      mutator: (lead: LeadRecord) => LeadRecord | void,
      options?: { preserveUpdatedAt?: boolean },
    ): Promise<LeadRecord | null> {
      return withDb(db => {
        const idx = db.leads.findIndex(item => item.id === id);
        if (idx < 0) return null;
        const draft = JSON.parse(JSON.stringify(db.leads[idx])) as LeadRecord;
        const returned = mutator(draft);
        const updated = returned ?? draft;
        if (!options?.preserveUpdatedAt) {
          updated.updatedAt = new Date().toISOString();
        }
        db.leads[idx] = updated;
        return JSON.parse(JSON.stringify(updated)) as LeadRecord;
      }, true);
    },

    listLeads(): Promise<LeadRecord[]> {
      return withDb(db => {
        return JSON.parse(JSON.stringify(db.leads)) as LeadRecord[];
      }, false);
    },

    listOpenLeads(): Promise<LeadRecord[]> {
      return withDb(db => {
        const open = db.leads.filter(item => !isFinalLeadStatus(item.status));
        return JSON.parse(JSON.stringify(open)) as LeadRecord[];
      }, false);
    },

    findFirstLeadForClient(input: FindFirstLeadInput): Promise<LeadRecord | null> {
      const targetPhones = extractPhones(input.phone, input.contact);
      const targetHandle = normalizeHandleOrEmail(input.contact);
      const targetName = cleanText(input.name);
      const targetService = cleanText(input.service);
      const targetDate = cleanText(input.date);

      return withDb(db => {
        const matches = db.leads
          .filter(lead => {
            if (input.excludeId && lead.id === input.excludeId) return false;
            if (lead.status === 'spam') return false;

            const leadPhones = extractPhones(lead.phone, lead.contact);
            if (targetPhones.some(p => leadPhones.includes(p))) return true;

            const leadHandle = normalizeHandleOrEmail(lead.contact);
            if (targetHandle && leadHandle && targetHandle === leadHandle) return true;

            if (
              targetName && targetService && targetDate
              && cleanText(lead.name) === targetName
              && cleanText(lead.service) === targetService
              && cleanText(lead.requestedDate) === targetDate
            ) {
              return true;
            }
            return false;
          })
          .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

        return matches[0] ? (JSON.parse(JSON.stringify(matches[0])) as LeadRecord) : null;
      }, false);
    },

    getSchedulerState(): Promise<SchedulerState> {
      return withDb(db => ({ ...db.scheduler }), false);
    },

    updateSchedulerState(patch: Partial<SchedulerState>): Promise<SchedulerState> {
      return withDb(db => {
        db.scheduler = { ...db.scheduler, ...patch };
        return { ...db.scheduler };
      }, true);
    },
  };
}

export type LeadsStore = ReturnType<typeof createLeadsStore>;

const GLOBAL_STORE_KEY = Symbol.for('serenity-spa.leads-store');
let moduleStore: LeadsStore | null = null;

function resolveDbPath(): string {
  return process.env.LEADS_DB_FILE
    || join(process.env.LOG_DIR || '/var/log/serenity-spa', 'leads-db.json');
}

export function getLeadsStore(): LeadsStore {
  const isTest = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';
  if (isTest) {
    moduleStore ??= createLeadsStore(resolveDbPath());
    return moduleStore;
  }

  const g = globalThis as unknown as Record<symbol, LeadsStore | undefined>;
  g[GLOBAL_STORE_KEY] ??= createLeadsStore(resolveDbPath());
  return g[GLOBAL_STORE_KEY]!;
}
