// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize once; SPA navigation sends the page views.
let initialized = false;
function canTrack() {
  return typeof window !== 'undefined' && import.meta.env.PROD
    && !['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname)
    && !window.location.pathname.startsWith('/admin');
}
export const initGA = () => {
  if (initialized || !canTrack()) return;
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ZQ6FF9R1BQ';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.async = true;
  document.head.appendChild(script);
  initialized = true;
};

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
