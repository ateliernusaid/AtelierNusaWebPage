import { getAttribution } from './attribution.js';

export const ANALYTICS_EVENTS = Object.freeze({
  whatsappClick: 'whatsapp_click',
  phoneClick: 'phone_click',
  consultationStart: 'consultation_start',
  leadSubmit: 'lead_submit',
  portfolioView: 'portfolio_view',
});

export function trackEvent(name, parameters = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, { ...getAttribution(), ...parameters });
  }
  // Mirror funnel events into Microsoft Clarity so session recordings
  // can be filtered by conversion stage (smart events dashboard).
  if (typeof window.clarity === 'function') {
    window.clarity('event', name);
  }
}
