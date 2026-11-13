import { getAttribution } from './attribution.js';

const AGENT_CONVERSION_ENDPOINT = 'https://tracker.ateliernusa.id/webhook/conversion';
const AGENT_MIRRORED_EVENTS = new Set([
  'page_view',
  'cta_click',
  'whatsapp_click',
  'phone_click',
  'email_click',
  'consultation_start',
  'lead_form_start',
  'lead_submit',
  'lead_delivery_success',
  'consultation_requested',
  'lead_delivery_failed',
]);

function createEventId() {
  if (typeof window === 'undefined') return '';
  if (typeof window.crypto?.randomUUID === 'function') return window.crypto.randomUUID();
  return `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function mirrorToAgent(name, parameters, attribution) {
  if (typeof window === 'undefined' || !AGENT_MIRRORED_EVENTS.has(name)) return;
  const payload = {
    event: name,
    event_id: createEventId(),
    source: parameters.source || 'website',
    session_id: attribution.session_id || '',
    cta_id: parameters.cta_id || '',
    form_id: parameters.form_id || '',
    form_name: parameters.form_name || '',
    page: window.location.pathname || '/',
    page_path: parameters.page_path || window.location.pathname || '/',
    referrer: document.referrer || '',
    lead_source: attribution.lead_source || 'direct',
    landing_page: attribution.landing_page || window.location.pathname || '/',
    utm_source: attribution.utm_source || '',
    utm_medium: attribution.utm_medium || '',
    utm_campaign: attribution.utm_campaign || '',
    utm_term: attribution.utm_term || '',
    utm_content: attribution.utm_content || '',
    gclid: attribution.gclid || '',
    fbclid: attribution.fbclid || '',
  };
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function' && typeof Blob === 'function') {
      const accepted = navigator.sendBeacon(
        AGENT_CONVERSION_ENDPOINT,
        new Blob([body], { type: 'application/json' }),
      );
      if (accepted) return;
    }
    if (typeof fetch === 'function') {
      void fetch(AGENT_CONVERSION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics must never block navigation or lead submission.
  }
}

export const ANALYTICS_SAFE_KEYS = Object.freeze([
  'source',
  'session_id',
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
  pageView: 'page_view',
  ctaClick: 'cta_click',
  whatsappClick: 'whatsapp_click',
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  consultationStart: 'consultation_start',
  leadFormStart: 'lead_form_start',
  leadSubmit: 'lead_submit',
  leadDeliverySuccess: 'lead_delivery_success',
  leadDeliveryFailed: 'lead_delivery_failed',
  consultationRequested: 'consultation_requested',
  consultationBooked: 'consultation_booked',
  portfolioView: 'portfolio_view',
});

export function trackEvent(name, parameters = {}, options = {}) {
  if (typeof window === 'undefined') return;
  let attribution = {};
  try {
    attribution = getAttribution();
  } catch {
    // Missing attribution must not block delivery or the other analytics sinks.
  }
  const eventParameters = {
    source: parameters.source || 'website',
    session_id: attribution.session_id || '',
    lead_source: attribution.lead_source || 'direct',
    landing_page: attribution.landing_page || window.location.pathname || '/',
    page_path: window.location.pathname || '/',
    page_language: document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en',
    ...parameters,
  };
  const safeParameters = Object.fromEntries(
    Object.entries(eventParameters).filter(([key]) => ANALYTICS_SAFE_KEYS.includes(key)),
  );
  try {
    if (!options.mirrorOnly && typeof window.gtag === 'function') {
      window.gtag('event', name, safeParameters);
    }
  } catch {
    // GA failures must not affect Clarity, the mirror, or lead delivery.
  }
  try {
    if (!options.mirrorOnly && typeof window.clarity === 'function') {
      window.clarity('event', name);
    }
  } catch {
    // Clarity is best-effort and receives only the event name.
  }
  try {
    mirrorToAgent(name, parameters, attribution);
  } catch {
    // Also contain payload/event-ID construction failures before transport.
  }
}
