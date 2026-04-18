import type { BookingData } from './validation';
import type { GeoInfo } from './geoip';
import { countryFlag } from './geoip';
import type { PhoneInfo } from './phone-info';
import type { TrafficAnalysis } from './traffic-source';
import type { RiskAssessment } from './risk-score';

export interface MessageContext {
  ip: string;
  serverUA: string;
  phone: PhoneInfo;
  traffic: TrafficAnalysis;
  geo: GeoInfo | null;
  risk: RiskAssessment;
  formFillDurationMs: number | null;
  ipSubmissionsLast24h: number;
  phoneSubmissionsLast24h: number;
  requestId: string;
}

const SEP = '━━━━━━━━━━━━━━━━━━━━';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatLocale(locale: string | undefined): string {
  switch (locale) {
    case 'uz': return '🇺🇿 Oʻzbek';
    case 'ru': return '🇷🇺 Русский';
    case 'en': return '🇬🇧 English';
    default: return '—';
  }
}

function formatDateTime(): string {
  return new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatLocation(geo: GeoInfo | null): string {
  if (!geo) return 'Неизвестно';
  const flag = countryFlag(geo.countryCode);
  const parts: string[] = [];
  if (geo.city) parts.push(geo.city);
  if (geo.country && geo.countryCode !== 'UZ') parts.push(geo.country);
  else if (geo.region && geo.region !== geo.city) parts.push(geo.region);
  const loc = parts.join(', ') || geo.country || 'Неизвестно';
  return flag ? `${flag} ${loc}` : loc;
}

function formatOperator(phone: PhoneInfo, geo: GeoInfo | null): string {
  const parts: string[] = [];
  if (phone.operatorHint) parts.push(phone.operatorHint);
  if (phone.isMobile) parts.push('мобильный');
  if (geo?.mobile && phone.operatorHint) {
    // mobile IP matches mobile phone — positive signal
  }
  return parts.length ? parts.join(' · ') : '—';
}

function formatSessionDuration(seconds: number | null | undefined, fallback: string): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return fallback;
  if (seconds < 60) return `${Math.round(seconds)} сек`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s ? `${m} мин ${s} сек` : `${m} мин`;
}

function formatFillDuration(ms: number | null): string {
  if (ms === null) return '—';
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} сек`;
  return `${Math.round(s / 60)} мин`;
}

export function buildBookingMessage(data: BookingData, ctx: MessageContext): string {
  const { phone, traffic, geo, risk, formFillDurationMs } = ctx;
  const v = data.visitor;

  const lines: string[] = [];

  // ── Header: status banner ──────────────────────
  lines.push(`<b>${risk.title}</b>`);
  lines.push(SEP);

  // ── Client block (the essentials for calling) ─
  lines.push(`👤 <b>${escapeHtml(data.name)}</b>`);
  lines.push(`📞 <code>${escapeHtml(phone.formatted || data.phone)}</code>`);
  const operatorLine = formatOperator(phone, geo);
  if (operatorLine !== '—') {
    lines.push(`   <i>${escapeHtml(operatorLine)}</i>`);
  }
  lines.push('');
  lines.push(`💆 <b>Услуга:</b> ${escapeHtml(data.service || 'не выбрана')}`);

  if (data.date) {
    lines.push(`📅 <b>Желаемая дата:</b> ${escapeHtml(data.date)}`);
  }

  lines.push(`🕐 ${formatDateTime()} · ${formatLocation(geo)}`);
  lines.push(`🌐 Язык сайта: ${formatLocale(data.pageLocale)}`);

  // ── Client comment (highlighted) ───────────────
  if (data.comment && data.comment.trim()) {
    lines.push('');
    lines.push(SEP);
    lines.push(`💬 <b>Комментарий клиента:</b>`);
    lines.push(`<blockquote>${escapeHtml(data.comment.trim())}</blockquote>`);
  }

  // ── Risk flags (only if any) ───────────────────
  if (risk.flags.length > 0) {
    lines.push('');
    lines.push(SEP);
    const emoji = risk.level === 'suspicious' ? '🚨' : '⚠️';
    lines.push(`${emoji} <b>На что обратить внимание:</b>`);
    for (const flag of risk.flags) {
      lines.push(`• ${escapeHtml(flag.reason)}`);
    }
  }

  // ── Context for the call ───────────────────────
  lines.push('');
  lines.push(SEP);
  lines.push(`📊 <b>Контекст для звонка</b>`);

  lines.push(`├ Откуда пришёл: ${escapeHtml(traffic.label)}`);

  const deviceParts: string[] = [];
  if (v.device) deviceParts.push(v.device);
  if (v.os) deviceParts.push(v.os);
  if (v.browser) deviceParts.push(v.browser);
  if (deviceParts.length) {
    lines.push(`├ Устройство: ${escapeHtml(deviceParts.join(', '))}`);
  }

  const sessionStr = formatSessionDuration(v.sessionSeconds, v.sessionDuration);
  lines.push(`├ На сайте: ${escapeHtml(sessionStr)} · ${v.pagesViewed} стр.`);

  if (formFillDurationMs !== null) {
    lines.push(`├ Форму заполнял: ${formatFillDuration(formFillDurationMs)}`);
  }

  if (ctx.phoneSubmissionsLast24h > 1) {
    lines.push(`├ С этого номера за сутки: ${ctx.phoneSubmissionsLast24h} заявок`);
  }
  if (ctx.ipSubmissionsLast24h > 1) {
    lines.push(`├ С этого устройства за сутки: ${ctx.ipSubmissionsLast24h} заявок`);
  }

  lines.push(`└ IP: <code>${escapeHtml(ctx.ip)}</code>${geo?.isp ? ` (${escapeHtml(geo.isp)})` : ''}`);

  // ── Debug footer (hidden by default, spoiler) ─
  const debugParts: string[] = [`id: ${ctx.requestId}`, `score: ${risk.score}/100`];
  if (v.gclid) debugParts.push(`gclid: ${v.gclid.slice(0, 16)}…`);
  if (v.gad_source) debugParts.push(`gad_source: ${v.gad_source}`);
  if (v.utm_campaign) debugParts.push(`campaign: ${v.utm_campaign}`);
  lines.push('');
  lines.push(`<tg-spoiler>${escapeHtml(debugParts.join(' · '))}</tg-spoiler>`);

  return lines.join('\n');
}
