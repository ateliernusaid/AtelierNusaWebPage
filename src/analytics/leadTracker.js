import { getAttribution } from './attribution.js';
import { ANALYTICS_EVENTS, trackEvent } from './events.js';
// UNIVERSAL CONTACT AND CTA TRACKER
// Loaded by bundled and static pages. A click is a micro-conversion;
// a qualified form submission is the lead conversion.
// ========================================


function reportContact(label, type, ctaId = '') {
    if (typeof window.gtag !== 'function') return;
    const attribution = getAttribution();
    window.gtag('event', type, {
        ...attribution,
        event_category: 'lead',
        event_label: label,
        page_path: window.location.pathname,
        page_language: document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en',
        ...(ctaId ? { cta_id: ctaId } : {}),
    });
    if (typeof window.clarity === 'function') window.clarity('event', type);
}
function reportCtaClick(element) {
    const ctaId = element.dataset.ctaId;
    if (!ctaId) return;
    trackEvent(ANALYTICS_EVENTS.ctaClick, { cta_id: ctaId });
}

if (!window.__atnLeadTracker) {
    window.__atnLeadTracker = true;

    document.addEventListener('click', (e) => {
        const cta = e.target?.closest?.('[data-cta-id]');
        if (cta) reportCtaClick(cta);

        const link = e.target?.closest?.('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="tel:"]');
        if (!link) return;

        // One report per click, even if main.js also has a listener bound.
        if (link.__atnReported) return;
        link.__atnReported = true;
        setTimeout(() => { link.__atnReported = false; }, 1000);

        // Facebook/Instagram in-app browsers block window.open once the gesture ends,
        // so open synchronously inside the gesture before reporting.
        if ((link.target || '_self') === '_blank') {
            e.preventDefault();
            window.open(link.href, '_blank', 'noopener');
        }

        const isPhone = link.getAttribute('href')?.startsWith('tel:');
        reportContact(link.dataset.waLabel || window.location.pathname, isPhone ? 'phone_click' : 'whatsapp_click', link.dataset.ctaId || '');
    }, true);
}
