import type { GeoInfo } from './geoip';
import type { PhoneInfo } from './phone-info';
import type { TrafficAnalysis } from './traffic-source';
import type { PrivateRelayStatus } from './private-relay';
import { isHostingProvider, isLikelyPrivateRelay } from './network-classification';

export type RiskLevel = 'clean' | 'warning' | 'suspicious' | 'reject';

export interface RiskFlag {
  /** Short human-readable sentence for managers */
  reason: string;
  weight: number;
  /** Optional technical detail — logged but not shown to managers */
  detail?: string;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  flags: RiskFlag[];
  title: string;
}

export interface RiskInput {
  phone: PhoneInfo;
  traffic: TrafficAnalysis;
  geo: GeoInfo | null;
  privateRelay?: PrivateRelayStatus;
  clientUA: string;
  serverUA: string;
  formFillDurationMs: number | null;
  ipSubmissionsLast24h: number;
  phoneSubmissionsLast24h: number;
  deviceSubmissionsLast10m?: number;
  pagesViewed: number;
  sessionSeconds: number | null;
  name?: string;
  comment?: string;
  gclid?: string;
  /** Server submission time; browser clocks must not decide the night signal. */
  submittedAt?: Date;
}

const LEVEL_TITLE: Record<RiskLevel, string> = {
  clean: '✅ НОВАЯ ЗАЯВКА',
  warning: '⚠️ ПРОВЕРЬТЕ ЗАЯВКУ',
  suspicious: '🚨 ПОДОЗРИТЕЛЬНАЯ ЗАЯВКА',
  reject: '❌ СКРЫТО (вероятно фрод)',
};

function levelFromScore(score: number): RiskLevel {
  if (score >= 85) return 'reject';
  if (score >= 50) return 'suspicious';
  if (score >= 25) return 'warning';
  return 'clean';
}

export function assessRisk(input: RiskInput): RiskAssessment {
  const flags: RiskFlag[] = [];

  // --- Traffic source ---
  if (input.traffic.suspicious) {
    const isFraudReferrer = input.traffic.referrerHost && input.traffic.suspicionReason?.includes('партнёрского сайта');
    flags.push({
      reason: input.traffic.suspicionReason ?? 'подозрительный источник трафика',
      weight: isFraudReferrer ? 50 : 30,
    });
  }

  // --- Phone pattern ---
  if (input.phone.suspiciousPattern) {
    flags.push({
      reason: `номер похож на тестовый (${input.phone.patternReason ?? 'паттерн'})`,
      weight: 60,
    });
  }

  if (input.phone.countryCode === 'UZ' && !input.phone.isMobile && input.phone.valid) {
    flags.push({
      reason: `префикс номера не принадлежит мобильным операторам UZ`,
      weight: 25,
    });
  }

  // Conservative text heuristics, independent of the selected site language.
  const comment = (input.comment ?? '').trim().toLowerCase();
  const letters = comment.replace(/[^\p{L}]/gu, '');
  const keyboardMash = /^(?:asdf[a-z]*|qwert[a-z]*|zxcv[a-z]*|фыва[а-яё]*|йцук[а-яё]*)$/i;
  const words = comment.match(/[a-zа-яё]+/gi) ?? [];
  const consonantMash = words.some(word => word.length >= 4 && !/[aeiouyаеёиоуыэюя]/i.test(word));
  const gamingSpam = /\b(?:robux|roblox|uynask)\b|робукс|роблокс/i.test(comment);
  const name = (input.name ?? '').trim().toLowerCase();
  const nameOnlyFromRiskySource = input.traffic.suspicious && name.length >= 4 && name.length <= 7 && comment === name;
  const gibberish = consonantMash || (letters.length >= 6 && (
    /^(.)\1{5,}$/u.test(letters)
    || /^(.{2,4})\1{2,}$/u.test(letters)
    || keyboardMash.test(letters)
    || (/^[a-zа-яё]{8,}$/i.test(letters) && !/[aeiouyаеёиоуыэюя]/i.test(letters))
  ));
  if (gamingSpam || nameOnlyFromRiskySource || gibberish) {
    flags.push({
      reason: gamingSpam ? 'комментарий содержит игровой термин'
        : nameOnlyFromRiskySource ? 'комментарий совпадает с именем при подозрительном источнике'
          : 'комментарий похож на бессмысленный набор символов',
      weight: 30,
    });
  }

  if (input.gclid?.trim() && input.sessionSeconds !== null
    && input.sessionSeconds >= 0 && input.sessionSeconds < 60) {
    flags.push({ reason: 'переход по Google Ads (gclid) и менее 60 секунд на сайте', weight: 25 });
  }

  // --- Form fill duration ---
  if (input.formFillDurationMs !== null) {
    if (input.formFillDurationMs < 3000) {
      flags.push({
        reason: `форма заполнена за ${(input.formFillDurationMs / 1000).toFixed(1)} сек (обычно 15-30)`,
        weight: 50,
      });
    } else if (input.formFillDurationMs < 7000) {
      flags.push({
        reason: `форма заполнена подозрительно быстро — ${(input.formFillDurationMs / 1000).toFixed(1)} сек`,
        weight: 20,
      });
    } else if (input.formFillDurationMs > 6 * 60 * 60 * 1000) {
      flags.push({
        reason: 'форма открыта несколько часов — возможно, заполнена автоматически',
        weight: 15,
      });
    }
  }

  // Follow-ups over 14 days are service requests, not a fraud signal.
  // A persistent browser identifier is required; an IP may belong to many guests.
  if ((input.deviceSubmissionsLast10m ?? 1) >= 2) {
    flags.push({ reason: 'повторная заявка с того же устройства в течение 10 минут', weight: 30 });
  }

  // --- Geo signals ---
  if (input.geo) {
    const privateRelay = isLikelyPrivateRelay(input.geo, input.serverUA, input.privateRelay);
    if (isHostingProvider(input.geo) && !privateRelay) {
      flags.push({
        reason: 'IP принадлежит хостинг-провайдеру (не живой абонент)',
        weight: 40,
        detail: input.geo.asName,
      });
    }
    if (input.geo.proxy && !privateRelay) {
      flags.push({
        reason: 'IP определён как прокси/VPN',
        weight: 35,
        detail: input.geo.asName,
      });
    }
    if (input.geo.countryCode && input.geo.countryCode !== 'UZ' && !privateRelay) {
      flags.push({
        reason: `заявка не из Узбекистана (${input.geo.country})`,
        weight: 25,
      });
    }
  }

  // --- UA check — only flag obviously missing/suspicious UAs ---
  if (!input.serverUA || !input.serverUA.trim() || input.serverUA.length < 20) {
    flags.push({
      reason: 'браузер клиента не отправил нормальный User-Agent (признак бота)',
      weight: 40,
      detail: input.serverUA || '(empty)',
    });
  } else if (/curl|wget|python|go-http|okhttp|java|scrapy|bot|spider/i.test(input.serverUA)) {
    flags.push({
      reason: `User-Agent похож на автоматизированный клиент`,
      weight: 50,
      detail: input.serverUA.slice(0, 100),
    });
  }

  // --- Engagement (positive signal — reduce score) ---
  // Handled implicitly: low engagement doesn't add flags, it just doesn't subtract.
  // But if viewed many pages and stayed long, deduct.
  let engagementBonus = 0;
  if (input.pagesViewed >= 3 && input.sessionSeconds !== null && input.sessionSeconds > 60) {
    engagementBonus = -10;
  }

  const rawScore = flags.reduce((s, f) => s + f.weight, 0) + engagementBonus;
  const score = Math.max(0, Math.min(100, rawScore));
  const level = levelFromScore(score);

  return {
    score,
    level,
    flags,
    title: LEVEL_TITLE[level],
  };
}
