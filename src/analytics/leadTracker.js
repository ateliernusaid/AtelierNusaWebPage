import { ANALYTICS_EVENTS, trackEvent } from './events.js';
// UNIVERSAL CONTACT AND CTA TRACKER
// Loaded by bundled and static pages. A click is a micro-conversion;
// a qualified form submission is the lead conversion.
// ========================================


function reportContact(label, type, ctaId = '') {
    if (typeof window.gtag !== 'function') return;
    trackEvent(type === 'phone_click' ? ANALYTICS_EVENTS.phoneClick : ANALYTICS_EVENTS.whatsappClick, {
        event_category: 'lead',
        ...(ctaId ? { cta_id: ctaId } : {}),
    });
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
