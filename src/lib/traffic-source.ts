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

function humanizeUtm(source: string, medium: string): string {
  const src = source.toLowerCase();
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
  // 4. Google Ads click without utm (has gclid)
  else if (input.gclid && gadInfo) {
    label = `Google Реклама · ${gadInfo.label}`;
  }
  else if (input.gclid) {
    label = 'Google Реклама';
  }
  // 5. Referrer-based
  else if (referrerHost) {
    if (isTrustedHost(referrerHost, ownDomain)) {
      if (isOwn) {
        label = 'Переход внутри сайта';
      } else if (referrerHost.includes('google')) {
        label = 'Google (поиск)';
      } else if (referrerHost.includes('yandex')) {
        label = 'Яндекс (поиск)';
      } else if (referrerHost.includes('instagram')) {
        label = 'Instagram';
      } else if (referrerHost.includes('facebook') || referrerHost.includes('fb.com')) {
        label = 'Facebook';
      } else if (referrerHost.includes('youtube')) {
        label = 'YouTube';
      } else if (referrerHost.includes('t.me') || referrerHost.includes('telegram')) {
        label = 'Telegram';
      } else if (referrerHost.includes('tiktok')) {
        label = 'TikTok';
      } else if (referrerHost.includes('2gis')) {
        label = '2GIS';
      } else {
        label = referrerHost;
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
