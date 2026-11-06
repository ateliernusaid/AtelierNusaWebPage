import { getAttribution } from './attribution.js';
export const ANALYTICS_SAFE_KEYS = Object.freeze([
  'cta_id',
  'form_id',
  'form_name',
  'page_language',
  'page_path',
  'lead_source',
  'landing_page',
  'social_network',
  'event_category',
  'value',
  'currency',
]);

export const ANALYTICS_EVENTS = Object.freeze({
  whatsappClick: 'whatsapp_click',
  phoneClick: 'phone_click',
  consultationStart: 'consultation_start',
  leadFormStart: 'lead_form_start',
  leadSubmit: 'lead_submit',
  consultationRequested: 'consultation_requested',
  consultationBooked: 'consultation_booked',
  portfolioView: 'portfolio_view',
  ctaClick: 'cta_click',
});

export function trackEvent(name, parameters = {}) {
  if (typeof window === 'undefined') return;
  const attribution = getAttribution();
  const eventParameters = {
    lead_source: attribution.lead_source || 'direct',
    landing_page: attribution.landing_page || window.location.pathname || '/',
    page_path: window.location.pathname || '/',
    page_language: document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en',
    ...parameters,
  };
  const safeParameters = Object.fromEntries(
    Object.entries(eventParameters).filter(([key]) => ANALYTICS_SAFE_KEYS.includes(key)),
  );
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, safeParameters);
  }
  // Mirror funnel events into Microsoft Clarity so session recordings
  // can be filtered by conversion stage (smart events dashboard).
  if (typeof window.clarity === 'function') {
    window.clarity('event', name);
  }
}
