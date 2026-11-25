import { resolveServiceInfo, normalizeSourceBucket } from '@/lib/leads/catalog-price';
import { formatDdMm, formatRussianDateRange } from '@/lib/leads/time';
import { STATUS_LABELS, type LeadRecord } from '@/lib/leads/types';
import { buildTelegramMessageUrl } from './card';
import { escapeHtml } from './telegram-api';

const MAX_TELEGRAM_MSG_LEN = 3950;

function shortRejectLabel(reason: string): string {
  switch (reason) {
    case 'Дорого':
      return 'дорого';
    case 'Не подошло время':
      return 'время';
    case 'Передумал':
      return 'передумал';
    case 'Выбрал другое место':
      return 'другое место';
    case 'Другое':
      return 'другое';
    default:
      return reason.toLowerCase();
  }
}

function pluralLeads(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'заявок';
  if (mod10 === 1) return 'заявка';
  if (mod10 >= 2 && mod10 <= 4) return 'заявки';
  return 'заявок';
}

function isLeadInRange(lead: LeadRecord, start: Date, end: Date): boolean {
  const ts = Date.parse(lead.createdAt);
  return Number.isFinite(ts) && ts >= start.getTime() && ts <= end.getTime();
}

function leadWasBooked(lead: LeadRecord): boolean {
  return ['booked', 'visited', 'no_show', 'wont_come'].includes(lead.status);
}

function formatLeadLink(lead: LeadRecord, fallbackChatId: string): string {
  const url = buildTelegramMessageUrl(lead.telegramChatId || fallbackChatId, lead.telegramMessageId);
  const safeName = escapeHtml(lead.name);
  return url ? `<a href="${escapeHtml(url)}">${safeName}</a>` : `<b>${safeName}</b>`;
}

export function buildSummaryReport(params: {
  allLeads: LeadRecord[];
  openLeads: LeadRecord[];
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  chatId: string;
  comparisonLabel?: string;
}): string {
  const {
    allLeads,
    openLeads,
    start,
    end,
    prevStart,
    prevEnd,
    chatId,
    comparisonLabel = 'прошлая неделя',
  } = params;

  const periodLeads = allLeads.filter(l => isLeadInRange(l, start, end));
  const prevLeads = allLeads.filter(l => isLeadInRange(l, prevStart, prevEnd));

  const total = periodLeads.length;
  const prevTotal = prevLeads.length;
  let deltaText = '';
  if (prevTotal > 0) {
    const pct = Math.round(((total - prevTotal) / prevTotal) * 100);
    deltaText = `, ${pct > 0 ? `+${pct}` : String(pct)}%`;
  }

  const bookedCount = periodLeads.filter(leadWasBooked).length;
  const bookedPct = total > 0 ? Math.round((bookedCount / total) * 100) : 0;
  const visitedCount = periodLeads.filter(l => l.status === 'visited').length;
  const noShowCount = periodLeads.filter(l => l.status === 'no_show' || l.status === 'wont_come').length;
  const thinkingCount = periodLeads.filter(l => l.status === 'thinking').length;
  const noContactCount = periodLeads.filter(l => l.status === 'no_contact').length;
  const rejectedLeads = periodLeads.filter(l => l.status === 'rejected');
  const spamCount = periodLeads.filter(l => l.status === 'spam').length;
  const unprocessedCount = periodLeads.filter(l => l.status === 'new').length;

  const rejectCounts = new Map<string, number>();
  for (const lead of rejectedLeads) {
    const key = shortRejectLabel(lead.rejectReason || 'Другое');
    rejectCounts.set(key, (rejectCounts.get(key) ?? 0) + 1);
  }
  const rejectBreakdown = rejectCounts.size > 0
    ? ` (${Array.from(rejectCounts.entries()).map(([k, v]) => `${k} — ${v}`).join(', ')})`
    : '';

  const responseSamples = periodLeads
    .map(l => l.firstResponseMinutes)
    .filter((m): m is number => typeof m === 'number' && Number.isFinite(m));
  const avgRespStr = responseSamples.length > 0
    ? `${Math.round(responseSamples.reduce((a, b) => a + b, 0) / responseSamples.length)} мин`
    : '—';

  // Sources (total / visited)
  const sourceStats = new Map<string, { total: number; visited: number }>();
  for (const lead of periodLeads) {
    const bucket = normalizeSourceBucket(lead.source);
    const cur = sourceStats.get(bucket) ?? { total: 0, visited: 0 };
    cur.total += 1;
    if (lead.status === 'visited') cur.visited += 1;
    sourceStats.set(bucket, cur);
  }
  const sourcesStr = sourceStats.size > 0
    ? Array.from(sourceStats.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, st]) => `${escapeHtml(name)} ${st.total}/${st.visited}`)
      .join(' · ')
    : '—';

  // Google Ads campaigns
  const campaignStats = new Map<string, { total: number; visited: number }>();
  for (const lead of periodLeads) {
    const campaign = lead.campaign?.trim();
    const isGoogleClick = Boolean(lead.gclid || lead.gbraid || lead.wbraid);
    if (!campaign && !isGoogleClick) continue;
    const key = campaign || '(без campaign)';
    const cur = campaignStats.get(key) ?? { total: 0, visited: 0 };
    cur.total += 1;
    if (lead.status === 'visited') cur.visited += 1;
    campaignStats.set(key, cur);
  }
  const campaignsStr = campaignStats.size > 0
    ? Array.from(campaignStats.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, st]) => `${escapeHtml(name)} ${st.total}/${st.visited}`)
      .join(' · ')
    : 'нет за период';

  // Services
  const serviceStats = new Map<string, number>();
  for (const lead of periodLeads) {
    const cat = lead.serviceCategory?.trim() || resolveServiceInfo(lead.service).category;
    serviceStats.set(cat, (serviceStats.get(cat) ?? 0) + 1);
  }
  const servicesStr = serviceStats.size > 0
    ? Array.from(serviceStats.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, cnt]) => `${escapeHtml(name)} ${cnt}`)
      .join(' · ')
    : '—';

  // Managers
  const managerStats = new Map<string, { total: number; respSamples: number[] }>();
  for (const lead of periodLeads) {
    const mgr = lead.handledByName?.trim();
    if (!mgr) continue;
    const cur = managerStats.get(mgr) ?? { total: 0, respSamples: [] };
    cur.total += 1;
    if (typeof lead.firstResponseMinutes === 'number' && Number.isFinite(lead.firstResponseMinutes)) {
      cur.respSamples.push(lead.firstResponseMinutes);
    }
    managerStats.set(mgr, cur);
  }
  const managersStr = managerStats.size > 0
    ? Array.from(managerStats.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, st]) => {
        const avg = st.respSamples.length > 0
          ? `, ответ ${Math.round(st.respSamples.reduce((a, b) => a + b, 0) / st.respSamples.length)} мин`
          : '';
        return `${escapeHtml(name)} — ${st.total} ${pluralLeads(st.total)}${avg}`;
      })
      .join(';\n   ')
    : '—';

  const rangeLabel = formatRussianDateRange(start, end);
  const lines: string[] = [
    `📊 <b>Заявки ${escapeHtml(rangeLabel)}: ${total}</b> (${escapeHtml(comparisonLabel)}: ${prevTotal}${deltaText})`,
    `✅ Записаны: ${bookedCount} (${bookedPct}%)   🚶 Пришли: ${visitedCount}   🙅 Не пришли: ${noShowCount}`,
    `🤔 Думают: ${thinkingCount}   📵 Не вышли на связь: ${noContactCount}`,
    `🚫 Отказ: ${rejectedLeads.length}${escapeHtml(rejectBreakdown)}   🗑 Спам: ${spamCount}`,
    `⏱ Среднее время первого ответа: ${avgRespStr}`,
    `⚠️ Без статуса: ${unprocessedCount}`,
    '',
    `📍 <b>Источники (заявок / пришли):</b>\n   ${sourcesStr}`,
    `📣 <b>Кампании Google Ads (по campaign из ссылки):</b>\n   ${campaignsStr}`,
    `💆 <b>Услуги:</b> ${servicesStr}`,
    `👤 <b>Менеджеры:</b> ${managersStr}`,
  ];

  if (openLeads.length > 0) {
    lines.push('');
    lines.push(`📋 <b>Заявки без финального статуса (${openLeads.length}):</b>`);
    const sortedOpen = [...openLeads].sort(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );
    const maxItems = 20;
    for (const lead of sortedOpen.slice(0, maxItems)) {
      const link = formatLeadLink(lead, chatId);
      const statusLabel = STATUS_LABELS[lead.status] ?? lead.status;
      const dateStr = formatDdMm(new Date(lead.createdAt));
      const candidate = `• ${link} — ${escapeHtml(statusLabel)} · ${escapeHtml(lead.service)} (${dateStr})`;
      if ([...lines, candidate].join('\n').length > MAX_TELEGRAM_MSG_LEN - 60) {
        break;
      }
      lines.push(candidate);
    }
    if (sortedOpen.length > maxItems) {
      lines.push(`<i>… и ещё ${sortedOpen.length - maxItems} (/open)</i>`);
    }
  }

  return lines.join('\n').slice(0, MAX_TELEGRAM_MSG_LEN);
}

export function buildOpenLeadsReport(openLeads: LeadRecord[], chatId: string): string {
  if (openLeads.length === 0) {
    return '✅ Открытых заявок без финального статуса нет.';
  }

  const sorted = [...openLeads].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  );
  const lines: string[] = [`📋 <b>Заявки без финального статуса (${sorted.length}):</b>`, ''];

  for (const lead of sorted) {
    const link = formatLeadLink(lead, chatId);
    const statusLabel = STATUS_LABELS[lead.status] ?? lead.status;
    const contact = lead.phone || lead.contact || 'без контакта';
    const visitPart = lead.appointmentDate && lead.appointmentTime
      ? ` · визит ${formatDdMm(lead.appointmentDate)} ${lead.appointmentTime}`
      : '';
    const mgrPart = lead.handledByName ? ` · 👤 ${escapeHtml(lead.handledByName)}` : '';
    const line = `• ${link} — <b>${escapeHtml(statusLabel)}</b>${visitPart}\n  ${escapeHtml(lead.service)} · <code>${escapeHtml(contact)}</code>${mgrPart} (${formatDdMm(new Date(lead.createdAt))})`;

    if ([...lines, line].join('\n').length > MAX_TELEGRAM_MSG_LEN - 40) {
      lines.push(`<i>… показаны не все заявки (всего ${sorted.length})</i>`);
      break;
    }
    lines.push(line);
  }

  return lines.join('\n');
}

export function buildDailyVisitsDigest(
  bookedLeadsForDay: LeadRecord[],
  dateYmd: string,
  chatId: string,
): string {
  const sorted = [...bookedLeadsForDay].sort((a, b) =>
    (a.appointmentTime || '99:99').localeCompare(b.appointmentTime || '99:99'),
  );
  const lines: string[] = [
    `📅 <b>Записи на сегодня (${formatDdMm(dateYmd)}): ${sorted.length}</b>`,
    '',
  ];
  for (const lead of sorted) {
    const time = lead.appointmentTime || 'время не указано';
    const link = formatLeadLink(lead, chatId);
    lines.push(`• <b>${escapeHtml(time)}</b> — ${link} · ${escapeHtml(lead.service)}`);
  }
  return lines.join('\n').slice(0, MAX_TELEGRAM_MSG_LEN);
}
