import { getAttribution } from './attribution.js';

export const ANALYTICS_EVENTS = Object.freeze({
  whatsappClick: 'whatsapp_click',
  phoneClick: 'phone_click',
  consultationStart: 'consultation_start',
  leadSubmit: 'lead_submit',
  portfolioView: 'portfolio_view',
});

export function trackEvent(name, parameters = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, { ...getAttribution(), ...parameters });
}
