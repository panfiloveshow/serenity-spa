export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
export const GOOGLE_ADS_FORM_CONVERSION_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_FORM_CONVERSION_ID || '';
/** Defaults to form conversion so phone matches Google’s «клик по номеру» snippet unless overridden. */
export const GOOGLE_ADS_PHONE_CONVERSION_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_ID || GOOGLE_ADS_FORM_CONVERSION_ID;
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
export const YM_ID = process.env.NEXT_PUBLIC_YM_ID || '';

type DataLayerEvent = Record<string, unknown> & {
  event: string;
};

type GtagArgs = [command: string, ...params: unknown[]];

type TrackingWindow = Window & {
  dataLayer?: Array<Record<string, unknown> | IArguments>;
  gtag?: (...args: GtagArgs) => void;
};

function getTrackingWindow(): TrackingWindow | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window as TrackingWindow;
}

export function pushToDataLayer(event: DataLayerEvent) {
  const trackingWindow = getTrackingWindow();
  if (!trackingWindow) {
    return;
  }

  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.dataLayer.push(event);
}

export function trackGtagEvent(eventName: string, params: Record<string, unknown> = {}) {
  const trackingWindow = getTrackingWindow();
  if (!trackingWindow?.gtag) {
    return;
  }

  trackingWindow.gtag('event', eventName, params);
}

export function trackGoogleAdsConversion(sendTo: string, params: Record<string, unknown> = {}) {
  if (!sendTo) {
    return;
  }

  trackGtagEvent('conversion', {
    send_to: sendTo,
    ...params,
  });
}

export function sanitizePhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits}`;
}

export function trackBookingFormSubmission(details: {
  result: { success?: boolean; accepted?: boolean; score?: number; level?: string };
  service?: string;
  date?: string;
  time?: string;
  hasComment?: boolean;
  source?: string;
}) {
  const { result } = details;
  // A 2xx response can be a silent bot rejection. Only delivered or durably queued
  // bookings count. Never send a separate gtag conversion alongside the GTM tag.
  if (result.success !== true || result.accepted !== true
    || typeof result.score !== 'number' || !Number.isFinite(result.score)
    || result.score < 0 || result.score >= 85
    || !['clean', 'warning', 'suspicious'].includes(result.level ?? '')) return;

  const payload = {
    event: 'booking_success',
    score: result.score,
    risk_level: result.level,
    lead_qualified: result.level === 'clean' && result.score < 25,
    event_category: 'lead',
    event_label: details.service || 'booking',
    form_name: 'booking_modal',
    service_name: details.service || 'Не выбрана',
    preferred_date: details.date || '',
    preferred_time: details.time || '',
    has_comment: Boolean(details.hasComment),
    source: details.source || 'website',
  };

  pushToDataLayer(payload);
}

export function trackPhoneClick(details: {
  phone: string;
  location?: string;
  text?: string;
  /** tel: URL — when set, navigation runs after conversion (gtag_report_conversion pattern). */
  navigateTo?: string;
}) {
  const payload = {
    event: 'phone_click',
    event_category: 'contact',
    event_label: details.phone,
    contact_method: 'phone',
    phone_number: details.phone,
    click_location: details.location || 'unknown',
    link_text: details.text || '',
  };

  pushToDataLayer(payload);
  trackGtagEvent('click_to_call', payload);

  const sendTo = GOOGLE_ADS_PHONE_CONVERSION_ID;
  const href = details.navigateTo;

  if (!sendTo) {
    if (href) {
      window.location.assign(href);
    }
    return;
  }

  const trackingWindow = getTrackingWindow();

  if (!href) {
    if (trackingWindow?.gtag) {
      trackGoogleAdsConversion(sendTo);
    }
    return;
  }

  if (!trackingWindow?.gtag) {
    window.location.assign(href);
    return;
  }

  let navigated = false;
  const go = () => {
    if (navigated) {
      return;
    }
    navigated = true;
    window.location.assign(href);
  };

  trackingWindow.gtag('event', 'conversion', {
    send_to: sendTo,
    event_callback: go,
  });

  window.setTimeout(go, 2000);
}
