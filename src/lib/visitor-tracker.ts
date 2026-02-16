'use client';

export interface VisitorData {
  // Source tracking
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  // Device & browser
  device: string;
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
  pagesViewed: number;
  // Derived
  trafficSource: string;
}

const SESSION_KEY = 'serenity_visitor';

interface SessionStore {
  landingPage: string;
  startTime: number;
  pagesViewed: string[];
  referrer: string;
  utms: Record<string, string>;
}

function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
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

function getSession(): SessionStore {
  if (typeof sessionStorage === 'undefined') {
    return {
      landingPage: '',
      startTime: Date.now(),
      pagesViewed: [],
      referrer: '',
      utms: {},
    };
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  const session: SessionStore = {
    landingPage: window.location.href,
    startTime: Date.now(),
    pagesViewed: [window.location.pathname],
    referrer: document.referrer || '',
    utms: getUTMParams(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function updateSession(): SessionStore {
  const session = getSession();
  const currentPath = window.location.pathname;
  if (!session.pagesViewed.includes(currentPath)) {
    session.pagesViewed.push(currentPath);
  }
  // Update UTMs if new ones present
  const newUtms = getUTMParams();
  if (Object.keys(newUtms).length > 0) {
    session.utms = { ...session.utms, ...newUtms };
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
  const referrer = session.referrer;

  return {
    referrer: referrer || 'Прямой переход',
    utm_source: utms.utm_source || '',
    utm_medium: utms.utm_medium || '',
    utm_campaign: utms.utm_campaign || '',
    utm_content: utms.utm_content || '',
    utm_term: utms.utm_term || '',
    device: detectDevice(),
    browser: detectBrowser(),
    os: detectOS(),
    screenResolution: typeof screen !== 'undefined' ? `${screen.width}×${screen.height}` : 'N/A',
    language: typeof navigator !== 'undefined' ? navigator.language : 'N/A',
    currentPage: typeof window !== 'undefined' ? window.location.href : '',
    landingPage: session.landingPage,
    pageTitle: typeof document !== 'undefined' ? document.title : '',
    visitTimestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' }),
    sessionDuration: formatDuration(Date.now() - session.startTime),
    pagesViewed: session.pagesViewed.length,
    trafficSource: detectTrafficSource(referrer, utms),
  };
}

// Initialize session tracking on page load
export function initVisitorTracking() {
  if (typeof window === 'undefined') return;
  getSession();
}
