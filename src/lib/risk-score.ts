import type { GeoInfo } from './geoip';
import type { PhoneInfo } from './phone-info';
import type { TrafficAnalysis } from './traffic-source';

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
  clientUA: string;
  serverUA: string;
  formFillDurationMs: number | null;
  ipSubmissionsLast24h: number;
  phoneSubmissionsLast24h: number;
  pagesViewed: number;
  sessionSeconds: number | null;
}

const LEVEL_TITLE: Record<RiskLevel, string> = {
  clean: '✅ НОВАЯ ЗАЯВКА',
  warning: '⚠️ ПРОВЕРЬТЕ ЗАЯВКУ',
  suspicious: '🚨 ПОДОЗРИТЕЛЬНАЯ ЗАЯВКА',
  reject: '❌ СКРЫТО (вероятно фрод)',
};

function levelFromScore(score: number): RiskLevel {
  if (score >= 85) return 'reject';
  if (score >= 55) return 'suspicious';
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

  if (!input.phone.isMobile && input.phone.valid) {
    flags.push({
      reason: `префикс номера не принадлежит мобильным операторам UZ`,
      weight: 25,
    });
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

  // --- Repeat submissions ---
  if (input.phoneSubmissionsLast24h >= 3) {
    flags.push({
      reason: `с этого номера уже ${input.phoneSubmissionsLast24h} заявок за сутки`,
      weight: 30,
    });
  } else if (input.phoneSubmissionsLast24h === 2) {
    flags.push({
      reason: 'с этого номера это 2-я заявка за сутки',
      weight: 10,
    });
  }

  if (input.ipSubmissionsLast24h >= 5) {
    flags.push({
      reason: `с одного устройства ${input.ipSubmissionsLast24h} заявок за сутки`,
      weight: 30,
    });
  } else if (input.ipSubmissionsLast24h >= 3) {
    flags.push({
      reason: `с одного устройства ${input.ipSubmissionsLast24h} заявок за сутки`,
      weight: 15,
    });
  }

  // --- Geo signals ---
  if (input.geo) {
    if (input.geo.hosting) {
      flags.push({
        reason: 'IP принадлежит хостинг-провайдеру (не живой абонент)',
        weight: 40,
        detail: input.geo.asName,
      });
    }
    if (input.geo.proxy) {
      flags.push({
        reason: 'IP определён как прокси/VPN',
        weight: 35,
        detail: input.geo.asName,
      });
    }
    if (input.geo.countryCode && input.geo.countryCode !== 'UZ') {
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
