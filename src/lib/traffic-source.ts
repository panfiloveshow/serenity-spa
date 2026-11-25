export interface TrafficAnalysis {
  label: string;
  suspicious: boolean;
  suspicionReason?: string;
  gadSourceCode?: string;
  gadSourceLabel?: string;
  referrerHost?: string;
  isOwnDomain: boolean;
}

// gad_source codes (Google Ads network origin)
const GAD_SOURCE_MAP: Record<string, { label: string; risky: boolean }> = {
  '1': { label: 'Google Поиск', risky: false },
  '2': { label: 'Google Shopping', risky: false },
  '3': { label: 'Google Display', risky: true },
  '4': { label: 'Google Video (YouTube)', risky: false },
  '5': { label: 'Партнёры Google Поиска', risky: true },
  '6': { label: 'Google Discover', risky: false },
  '7': { label: 'Google Display Network', risky: true },
  '8': { label: 'Google Maps', risky: false },
  '9': { label: 'Google Smart Campaigns', risky: true },
  '10': { label: 'Cross-Network', risky: true },
};

// Known trusted sources — full registrable domains only, matched at a label
// boundary (see isTrustedHost). No bare prefixes: substring matching let hosts
// like "google.phishing.ru" pass as trusted.
const TRUSTED_HOSTS = [
  'serenityspa.uz',
  'google.com', 'google.ru', 'google.uz',
  'yandex.ru', 'yandex.uz', 'yandex.com',
  'instagram.com',
  'facebook.com', 'fb.com',
  'youtube.com', 'youtu.be',
  't.me', 'telegram.org', 'telegram.me',
  'tiktok.com',
  '2gis.ru', '2gis.uz',
  'bing.com',
];

// Known click-fraud / arbitrage / incentivized traffic hosts
const FRAUD_INDICATOR_HOSTS = [
  '2kings.ru', 'apps.2kings.ru',
  'mgid.com', 'adskeeper.com',
  'propellerads.com',
  'rollerads.com',
  'outbrain.com', 'taboola.com',
  'yandex.direct',
];

function extractHost(referrer: string): string | undefined {
  if (!referrer || referrer === 'Прямой переход') return undefined;
  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function isTrustedHost(host: string, ownDomain: string): boolean {
  if (host === ownDomain || host.endsWith('.' + ownDomain)) return true;
  return TRUSTED_HOSTS.some(t => host === t || host.endsWith('.' + t));
}

function isFraudIndicator(host: string): boolean {
  return FRAUD_INDICATOR_HOSTS.some(t => host === t || host.endsWith('.' + t));
}

function matchesHost(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

// Country domains may have one or two suffix labels; the brand must be the
// registrable label immediately before the suffix, never part of another host.
function matchesCountryDomain(host: string, brand: string): boolean {
  return new RegExp(`(?:^|\\.)${brand}\\.(?:com|[a-z]{2}|co\\.[a-z]{2}|com\\.[a-z]{2})$`).test(host);
}

function knownReferrerLabel(host: string, referrer: string): string | undefined {
  const hasMapsPath = (() => {
    try { return /^\/maps(?:\/|$)/i.test(new URL(referrer).pathname); } catch { return false; }
  })();

  if (matchesHost(host, 'chatgpt.com') || matchesHost(host, 'chat.openai.com')) return 'ChatGPT (ИИ-ассистент)';
  if (matchesHost(host, 'perplexity.ai')) return 'ИИ-ассистент (Perplexity)';
  if (matchesHost(host, 'gemini.google.com')) return 'ИИ-ассистент (Gemini)';
  if (matchesHost(host, 'copilot.microsoft.com')) return 'ИИ-ассистент (Copilot)';
  if (matchesHost(host, 'claude.ai')) return 'ИИ-ассистент (Claude)';
  if (matchesCountryDomain(host, 'tripadvisor')) return 'TripAdvisor (бесплатно)';
  if (matchesHost(host, 'maps.app.goo.gl') ||
      (matchesCountryDomain(host, 'google') && (/(?:^|\.)maps\.google\./.test(host) || hasMapsPath))) return 'Google Карты';
  if (matchesCountryDomain(host, 'yandex') && hasMapsPath) return 'Яндекс Карты';
  if (matchesCountryDomain(host, '2gis')) return '2ГИС';
  if (matchesCountryDomain(host, 'google')) return 'Google (поиск)';
  if (matchesCountryDomain(host, 'yandex')) return 'Яндекс (поиск)';
  if (matchesHost(host, 'instagram.com')) return 'Instagram';
  if (matchesHost(host, 'facebook.com') || matchesHost(host, 'fb.com')) return 'Facebook';
  if (matchesHost(host, 't.me') || matchesHost(host, 'telegram.org') || matchesHost(host, 'telegram.me')) return 'Telegram';
  if (matchesHost(host, 'booking.com')) return 'Booking.com';
  if (matchesHost(host, 'hilton.com')) return 'Hilton';
  if (matchesHost(host, 'youtube.com') || matchesHost(host, 'youtu.be')) return 'YouTube';
  if (matchesHost(host, 'tiktok.com')) return 'TikTok';
  return undefined;
}

function humanizeUtm(source: string, medium: string): string {
  const src = source.toLowerCase();
  const knownSources: Record<string, string> = {
    tripadvisor: 'TripAdvisor (бесплатно)', chatgpt: 'ChatGPT (ИИ-ассистент)',
    perplexity: 'ИИ-ассистент (Perplexity)', gemini: 'ИИ-ассистент (Gemini)',
    copilot: 'ИИ-ассистент (Copilot)', claude: 'ИИ-ассистент (Claude)',
    'google maps': 'Google Карты', 'google_maps': 'Google Карты',
    'yandex maps': 'Яндекс Карты', 'yandex_maps': 'Яндекс Карты', '2gis': '2ГИС',
    booking: 'Booking.com', hilton: 'Hilton',
  };
  if (knownSources[src]) return knownSources[src];
  const domainLabel = knownReferrerLabel(src, `https://${src}/`);
  if (domainLabel && domainLabel !== 'Google (поиск)' && domainLabel !== 'Яндекс (поиск)') return domainLabel;
  if (src.includes('google')) return medium ? `Google (${medium})` : 'Google';
  if (src.includes('yandex')) return medium ? `Яндекс (${medium})` : 'Яндекс';
  if (src.includes('instagram') || src === 'ig') return 'Instagram';
  if (src.includes('facebook') || src === 'fb') return 'Facebook';
  if (src.includes('telegram') || src === 'tg') return 'Telegram';
  if (src.includes('tiktok')) return 'TikTok';
  if (src.includes('youtube')) return 'YouTube';
  return medium ? `${source} / ${medium}` : source;
}

export function analyzeTrafficSource(input: {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gad_source?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landingPage?: string;
  ownDomain?: string;
}): TrafficAnalysis {
  const ownDomain = (input.ownDomain ?? 'serenityspa.uz').toLowerCase();
  const referrerHost = extractHost(input.referrer ?? '');
  const isOwn = referrerHost ? (referrerHost === ownDomain || referrerHost.endsWith('.' + ownDomain)) : false;

  const gadCode = input.gad_source;
  const gadInfo = gadCode ? GAD_SOURCE_MAP[gadCode] : undefined;

  let label = 'Прямой переход';
  let suspicious = false;
  const reasons: string[] = [];

  // 1. Explicit fraud-indicator referrer
  if (referrerHost && isFraudIndicator(referrerHost)) {
    label = `Рекламная партнёрка (${referrerHost})`;
    suspicious = true;
    reasons.push(`заявка пришла с партнёрского сайта ${referrerHost}`);
  }
  // 2. gad_source high-risk
  else if (gadInfo?.risky) {
    label = gadInfo.label;
    suspicious = true;
    reasons.push(`реклама показана на партнёрах Google (${gadInfo.label})`);
  }
  // 3. UTM-based
  else if (input.utm_source) {
    label = humanizeUtm(input.utm_source, input.utm_medium ?? '');
  }
  // 4. Google Ads click without utm (has gclid / gbraid / wbraid)
  else if ((input.gclid || input.gbraid || input.wbraid) && gadInfo) {
    label = `Google Реклама · ${gadInfo.label}`;
  }
  else if (input.gclid || input.gbraid || input.wbraid) {
    label = 'Google Реклама';
  }
  // 5. Referrer-based
  else if (referrerHost) {
    const knownLabel = knownReferrerLabel(referrerHost, input.referrer ?? '');
    if (knownLabel || isTrustedHost(referrerHost, ownDomain)) {
      if (isOwn) {
        label = 'Переход внутри сайта';
      } else {
        label = knownLabel ?? referrerHost;
      }
    } else {
      // Unknown external domain — suspicious
      label = `Неизвестный сайт (${referrerHost})`;
      suspicious = true;
      reasons.push(`переход с неизвестного сайта ${referrerHost}`);
    }
  }

  return {
    label,
    suspicious,
    suspicionReason: reasons.length ? reasons.join('; ') : undefined,
    gadSourceCode: gadCode,
    gadSourceLabel: gadInfo?.label,
    referrerHost,
    isOwnDomain: isOwn,
  };
}
