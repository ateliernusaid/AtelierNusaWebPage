import { SITE_BUILD_ID } from './build.js';
import { getAttribution } from './attribution.js';

// Posted to a same-origin route that relays to the agent, so the browser never
// needs a cross-origin CSP exception and never holds a webhook secret.
const AGENT_CONVERSION_ENDPOINT = '/api/conversion';
const AGENT_MIRRORED_EVENTS = new Set([
  'page_view',
  'cta_click',
  'whatsapp_click',
  'phone_click',
  'email_click',
  'consultation_start',
  'lead_form_start',
  'lead_submit_attempt',
  'lead_submit',
  'lead_delivery_success',
  'consultation_requested',
  'lead_delivery_failed',
  'client_error',
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
    build_id: SITE_BUILD_ID,
    source: parameters.source || 'website',
    session_id: attribution.session_id || '',
    cta_id: parameters.cta_id || '',
    form_id: parameters.form_id || '',
    form_name: parameters.form_name || '',
    page: window.location.pathname || '/',
    page_path: parameters.page_path || window.location.pathname || '/',
    page_language: parameters.page_language || (document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en'),
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
    error_type: parameters.error_type || '',
    error_source: parameters.error_source || '',
    error_line: parameters.error_line || 0,
    ...(name === 'client_error' ? { referrer: '', landing_page: '', utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '', gclid: '', fbclid: '' } : {}),
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
  'build_id',
  'error_type',
  'error_source',
  'error_line',
]);

export const ANALYTICS_EVENTS = Object.freeze({
  pageView: 'page_view',
  ctaClick: 'cta_click',
  whatsappClick: 'whatsapp_click',
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  consultationStart: 'consultation_start',
  leadFormStart: 'lead_form_start',
  leadSubmitAttempt: 'lead_submit_attempt',
  leadSubmit: 'lead_submit',
  leadDeliverySuccess: 'lead_delivery_success',
  leadDeliveryFailed: 'lead_delivery_failed',
  clientError: 'client_error',
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
    build_id: SITE_BUILD_ID,
    session_id: attribution.session_id || '',
    lead_source: attribution.lead_source || 'direct',
    landing_page: attribution.landing_page || window.location.pathname || '/',
    page_path: window.location.pathname || '/',
    page_language: document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en',
    ...parameters,
  };
  const safeParameters = Object.fromEntries(
    Object.entries(eventParameters).filter(([key]) => ANALYTICS_SAFE_KEYS.includes(key) && (name !== 'client_error' || ['source', 'build_id', 'page_path', 'page_language', 'error_type', 'error_source', 'error_line'].includes(key))),
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
      // Clarity tags are session filters, not an event-level funnel database.
      for (const key of ['build_id', 'page_path', 'page_language', 'cta_id', 'form_id', 'error_type', 'error_source', 'error_line']) {
        const value = safeParameters[key];
        if (value !== undefined && value !== '') window.clarity('set', `atn_${key}`, String(value));
      }
    }
  } catch {
    // Tagging failure must not suppress the event itself.
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

const reportedClientErrors = new Set();

function safeErrorSource(filename) {
  if (!filename) return 'unknown';
  try {
    const source = new URL(filename, window.location.href);
    if (source.origin !== window.location.origin) return 'external';
    return /^\/(?:assets|src)\/[a-zA-Z0-9_./-]+\.m?js$/.test(source.pathname) ? source.pathname : 'inline';
  } catch {
    return 'unknown';
  }
}

export function installClientErrorTelemetry() {
  if (typeof window === 'undefined' || window.__atnClientErrorTelemetry) return;
  window.__atnClientErrorTelemetry = true;

  const report = (type, filename = '', line = 0) => {
    const allowedTypes = ['Error', 'TypeError', 'ReferenceError', 'SyntaxError', 'RangeError', 'URIError', 'EvalError', 'script_error', 'unhandled_rejection'];
    const errorType = allowedTypes.includes(type) ? type : 'Error';
    const errorSource = safeErrorSource(filename);
    const errorLine = Number.isFinite(line) ? line : 0;
    const key = `${errorType}|${errorSource}|${errorLine}`;
    if (reportedClientErrors.has(key) || reportedClientErrors.size >= 10) return;
    reportedClientErrors.add(key);
    trackEvent(ANALYTICS_EVENTS.clientError, {
      error_type: errorType,
      error_source: errorSource,
      error_line: errorLine,
    });
  };

  window.addEventListener('error', (event) => {
    report(event.error?.name || 'script_error', event.filename, event.lineno);
  });
  window.addEventListener('unhandledrejection', (event) => {
    report(event.reason?.name || 'unhandled_rejection');
  });
}
