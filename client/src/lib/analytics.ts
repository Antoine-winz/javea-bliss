// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize once; SPA navigation sends the page views.
let initialized = false;
export const ANALYTICS_CONSENT_KEY = 'jb_analytics_consent';
const CHOICE_TTL_MS = 180 * 24 * 60 * 60 * 1000;
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ZQ6FF9R1BQ';
export function getAnalyticsConsent(): 'accepted' | 'declined' | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(ANALYTICS_CONSENT_KEY) || 'null');
    return value && value.expiresAt > Date.now() && ['accepted', 'declined'].includes(value.choice) ? value.choice : null;
  } catch { return null; }
}

function canTrack() {
  return typeof window !== 'undefined' && import.meta.env.PROD
    && getAnalyticsConsent() === 'accepted'
    && !['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname)
    && !window.location.pathname.startsWith('/admin');
}
export const initGA = () => {
  if (!canTrack()) return;
  (window as any)[`ga-disable-${measurementId}`] = false;
  if (initialized) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: CHOICE_TTL_MS / 1000, cookie_update: false });
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.async = true;
  document.head.appendChild(script);
  initialized = true;
};

export function syncAnalyticsConsent() {
  if (getAnalyticsConsent() === 'accepted') { initGA(); return; }
  (window as any)[`ga-disable-${measurementId}`] = true;
  // Also clear cookies left by an earlier consent, without touching access or language cookies.
  for (const item of (document.cookie || '').split(';')) {
    const name = item.trim().split('=')[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    const host = window.location.hostname;
    const domains = new Set(['', host, `.${host}`, 'javeabliss.com', '.javeabliss.com']);
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ''}`;
  }
}

export function setAnalyticsConsent(choice: 'accepted' | 'declined') {
  try { window.localStorage.setItem(ANALYTICS_CONSENT_KEY, JSON.stringify({ choice, expiresAt: Date.now() + CHOICE_TTL_MS })); } catch { /* Without storage, analytics stays disabled. */ }
  syncAnalyticsConsent();
  if (choice === 'accepted') trackPageView(window.location.pathname);
}

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (!canTrack() || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ZQ6FF9R1BQ';
  if (!measurementId) return;
  

  window.gtag('event', 'page_view', {
    send_to: measurementId,
    page_location: new URL(url, window.location.origin).href,
    page_title: document.title,
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (!canTrack() || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track promotional offer interactions
export const trackPromoInteraction = (
  action: 'view' | 'click' | 'submit',
  offerTitle: string,
  offerDiscount: string
) => {
  trackEvent(action, 'promotional_offer', `${offerTitle} - ${offerDiscount}`);
};

// Track booking form interactions
export const trackBookingInteraction = (
  action: 'start' | 'complete' | 'abandon',
  checkInDate?: string,
  nights?: number
) => {
  const label = checkInDate ? `${checkInDate} - ${nights} nights` : undefined;
  trackEvent(action, 'booking_form', label, nights);
};

// Track restaurant SEO conversions
export const trackRestaurantConversion = (
  restaurantName: string,
  conversionType: 'view_apartment' | 'start_booking'
) => {
  trackEvent(conversionType, 'restaurant_seo', restaurantName);
};

// Track language switches
export const trackLanguageSwitch = (
  fromLanguage: string,
  toLanguage: string
) => {
  trackEvent('language_change', 'internationalization', `${fromLanguage} to ${toLanguage}`);
};
