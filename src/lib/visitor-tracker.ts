'use client';

export interface VisitorData {
  // Source tracking
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  // Google Ads click parameters (captured from landing URL)
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  gad_source?: string;
  gad_campaignid?: string;
  adClickAt?: string;
  // Device & browser
  device: string;
  deviceId?: string;
  browser: string;
  os: string;
  screenResolution: string;
  language: string;
  // Session
  currentPage: string;
  landingPage: string;
  pageTitle: string;
  visitTimestamp: string;
  sessionDuration: string;
  sessionSeconds: number;
  pagesViewed: number;
  // Derived
  trafficSource: string;
}

const SESSION_KEY = 'serenity_visitor';
const DEVICE_KEY = 'serenity_booking_device';
const ATTR_KEY = 'serenity_ad_attribution';
const ATTR_TTL_MS = 90 * 24 * 60 * 60 * 1000;
let memoryDeviceId: string | undefined;

/** A first-party browser identifier; shared IP addresses never identify a device. */
function getBookingDeviceId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  memoryDeviceId ??= window.crypto?.randomUUID?.();
  try {
    const saved = localStorage.getItem(DEVICE_KEY);
    if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved)) return saved;
    if (memoryDeviceId) localStorage.setItem(DEVICE_KEY, memoryDeviceId);
  } catch { /* Storage can be unavailable; retain the identifier for this page session. */ }
  return memoryDeviceId;
}

interface SessionStore {
  landingPage: string;
  startTime: number;
  pagesViewed: string[];
  referrer: string;
  utms: Record<string, string>;
  ads: Record<string, string>;
  adClickAt?: string;
}

interface PersistedAttribution {
  ads: Record<string, string>;
  utms: Record<string, string>;
  adClickAt: string;
  savedAt: number;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const AD_KEYS = ['gclid', 'gbraid', 'wbraid', 'gad_source', 'gad_campaignid', 'fbclid', 'yclid'];
const GOOGLE_CLICK_KEYS = ['gclid', 'gbraid', 'wbraid'] as const;

function hasGoogleClickId(ads: Record<string, string>): boolean {
  return GOOGLE_CLICK_KEYS.some(key => Boolean(ads[key]));
}

function loadPersistedAttribution(): PersistedAttribution | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedAttribution>;
    if (
      !parsed
      || typeof parsed.savedAt !== 'number'
      || !Number.isFinite(parsed.savedAt)
      || Date.now() - parsed.savedAt > ATTR_TTL_MS
      || !parsed.ads
      || typeof parsed.ads !== 'object'
    ) {
      localStorage.removeItem(ATTR_KEY);
      return null;
    }
    return {
      ads: parsed.ads,
      utms: parsed.utms && typeof parsed.utms === 'object' ? parsed.utms : {},
      adClickAt: typeof parsed.adClickAt === 'string' && parsed.adClickAt
        ? parsed.adClickAt
        : new Date(parsed.savedAt).toISOString(),
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

function savePersistedAttribution(
  ads: Record<string, string>,
  utms: Record<string, string>,
  adClickAt: string,
): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const payload: PersistedAttribution = {
      ads,
      utms,
      adClickAt,
      savedAt: Date.now(),
    };
    localStorage.setItem(ATTR_KEY, JSON.stringify(payload));
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
}

function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
}

function getAdParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const ads: Record<string, string> = {};
  for (const key of AD_KEYS) {
    const val = params.get(key);
    if (val) ads[key] = val;
  }
  return ads;
}

function detectDevice(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return 'Планшет';
  if (/Mobile|Android|iPhone/i.test(ua)) return 'Мобильный';
  return 'Десктоп';
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('YaBrowser')) return 'Yandex Browser';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

function detectOS(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'Other';
}

function detectTrafficSource(referrer: string, utms: Record<string, string>): string {
  if (utms.utm_source) {
    const src = utms.utm_source.toLowerCase();
    if (src.includes('instagram')) return '📸 Instagram';
    if (src.includes('telegram')) return '✈️ Telegram';
    if (src.includes('facebook') || src.includes('fb')) return '📘 Facebook';
    if (src.includes('google')) return '🔍 Google Ads';
    if (src.includes('yandex')) return '🔍 Yandex Ads';
    if (src.includes('tiktok')) return '🎵 TikTok';
    return `🏷 UTM: ${utms.utm_source}`;
  }

  if (!referrer || referrer === '') return '🔗 Прямой переход';

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes('google')) return '🔍 Google (органика)';
    if (host.includes('yandex')) return '🔍 Yandex (органика)';
    if (host.includes('instagram')) return '📸 Instagram';
    if (host.includes('t.me') || host.includes('telegram')) return '✈️ Telegram';
    if (host.includes('facebook') || host.includes('fb.com')) return '📘 Facebook';
    if (host.includes('tiktok')) return '🎵 TikTok';
    if (host.includes('youtube')) return '📺 YouTube';
    if (host.includes('2gis')) return '🗺 2GIS';
    return `🌐 ${host}`;
  } catch {
    return `🌐 ${referrer}`;
  }
}

function applyPersistedAttribution(session: SessionStore): void {
  const persisted = loadPersistedAttribution();
  if (!persisted) return;

  if (!hasGoogleClickId(session.ads)) {
    session.ads = { ...persisted.ads, ...session.ads };
    if (!session.adClickAt) {
      session.adClickAt = persisted.adClickAt;
    }
  }
  for (const [key, value] of Object.entries(persisted.utms)) {
    if (!session.utms[key] && value) {
      session.utms[key] = value;
    }
  }
}

function getSession(): SessionStore {
  if (typeof sessionStorage === 'undefined') {
    return {
      landingPage: '',
      startTime: Date.now(),
      pagesViewed: [],
      referrer: '',
      utms: {},
      ads: {},
    };
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SessionStore;
      // Backfill fields for sessions created before they existed
      if (!parsed.ads) parsed.ads = {};
      if (!parsed.utms) parsed.utms = {};
      if (!hasGoogleClickId(parsed.ads)) {
        applyPersistedAttribution(parsed);
      }
      return parsed;
    }
  } catch { /* ignore */ }

  const initialUtms = getUTMParams();
  const initialAds = getAdParams();
  const session: SessionStore = {
    landingPage: window.location.href,
    startTime: Date.now(),
    pagesViewed: [window.location.pathname],
    referrer: document.referrer || '',
    utms: initialUtms,
    ads: initialAds,
  };

  const hasNewAttribution = hasGoogleClickId(initialAds)
    || Boolean(initialAds.gad_source || initialAds.gad_campaignid)
    || Object.keys(initialUtms).length > 0;
  if (hasNewAttribution) {
    session.adClickAt = new Date().toISOString();
    savePersistedAttribution(session.ads, session.utms, session.adClickAt);
  } else {
    applyPersistedAttribution(session);
  }

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { /* ignore */ }
  return session;
}

function updateSession(): SessionStore {
  const session = getSession();
  const currentPath = window.location.pathname;
  if (!session.pagesViewed.includes(currentPath)) {
    session.pagesViewed.push(currentPath);
  }
  // Update UTMs/ads if new ones present on this navigation
  const newUtms = getUTMParams();
  const hasNewUtms = Object.keys(newUtms).length > 0;
  if (hasNewUtms) {
    session.utms = { ...session.utms, ...newUtms };
  }
  const newAds = getAdParams();
  const hasNewAds = Object.keys(newAds).length > 0;
  if (hasNewAds) {
    if (hasGoogleClickId(newAds)) {
      delete session.ads.gclid;
      delete session.ads.gbraid;
      delete session.ads.wbraid;
      session.adClickAt = new Date().toISOString();
    }
    session.ads = { ...session.ads, ...newAds };
  }

  if (hasNewUtms || hasNewAds) {
    session.adClickAt ??= new Date().toISOString();
    savePersistedAttribution(session.ads, session.utms, session.adClickAt);
  } else if (!hasGoogleClickId(session.ads)) {
    applyPersistedAttribution(session);
  }

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { /* ignore */ }
  return session;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} сек`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes < 60) return `${minutes} мин ${secs} сек`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ч ${minutes % 60} мин`;
}

export function collectVisitorData(): VisitorData {
  const session = updateSession();
  const utms = session.utms;
  const ads = session.ads;
  const referrer = session.referrer;
  const sessionMs = Date.now() - session.startTime;

  return {
    referrer: referrer || 'Прямой переход',
    utm_source: utms.utm_source || '',
    utm_medium: utms.utm_medium || '',
    utm_campaign: utms.utm_campaign || '',
    utm_content: utms.utm_content || '',
    utm_term: utms.utm_term || '',
    gclid: ads.gclid,
    gbraid: ads.gbraid,
    wbraid: ads.wbraid,
    gad_source: ads.gad_source,
    gad_campaignid: ads.gad_campaignid,
    adClickAt: session.adClickAt,
    device: detectDevice(),
    deviceId: getBookingDeviceId(),
    browser: detectBrowser(),
    os: detectOS(),
    screenResolution: typeof screen !== 'undefined' ? `${screen.width}×${screen.height}` : 'N/A',
    language: typeof navigator !== 'undefined' ? navigator.language : 'N/A',
    currentPage: typeof window !== 'undefined' ? window.location.href : '',
    landingPage: session.landingPage,
    pageTitle: typeof document !== 'undefined' ? document.title : '',
    visitTimestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' }),
    sessionDuration: formatDuration(sessionMs),
    sessionSeconds: Math.floor(sessionMs / 1000),
    pagesViewed: session.pagesViewed.length,
    trafficSource: detectTrafficSource(referrer, utms),
  };
}

// Initialize session tracking on page load
export function initVisitorTracking() {
  if (typeof window === 'undefined') return;
  getSession();
}
