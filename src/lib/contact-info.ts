import { analyzePhone, normalizePhone } from './phone-info';

/** A reachable email, Telegram username/link, or international WhatsApp number/link. */
export function isValidContact(raw: string): boolean {
  const value = raw.trim();
  if (!value || value.length > 254) return false;
  if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>.]+$/.test(value)) return true;
  if (/^@[a-z][a-z0-9_]{4,31}$/i.test(value)) return true;
  if (analyzePhone(value).valid) return true;
  return contactPhone(value) !== '' || /^(?:https:\/\/)?(?:t\.me|telegram\.me)\/[a-z][a-z0-9_]{4,31}\/?$/i.test(value);
}

/** Extract a WhatsApp number for country hints and per-contact throttling. */
export function contactPhone(raw: string): string {
  const value = raw.trim();
  if (analyzePhone(value).valid) return normalizePhone(value);
  const match = value.match(/^(?:https:\/\/)?wa\.me\/(\d{7,15})\/?$/i);
  return match && analyzePhone(`+${match[1]}`).valid ? normalizePhone(`+${match[1]}`) : '';
}
