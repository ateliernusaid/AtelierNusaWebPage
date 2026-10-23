import { getAttribution } from './attribution.js';
// ========================================
// UNIVERSAL CONTACT TRACKER
// Standalone, no imports. Loaded by static pages that do not bundle main.js.
// A click is a micro-conversion; a qualified form submission is the lead conversion.
// ========================================


function reportContact(label, type) {
    if (typeof window.gtag !== 'function') return;
    const attribution = getAttribution();
    window.gtag('event', type, {
        ...attribution,
        event_category: 'lead',
        event_label: label,
        page_path: window.location.pathname,
    });
    if (typeof window.clarity === 'function') window.clarity('event', type);
}

if (!window.__atnLeadTracker) {
    window.__atnLeadTracker = true;

    document.addEventListener('click', (e) => {
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
        reportContact(link.dataset.waLabel || window.location.pathname, isPhone ? 'phone_click' : 'whatsapp_click');
    }, true);
}
