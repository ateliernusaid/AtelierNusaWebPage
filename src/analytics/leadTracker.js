// ========================================
// UNIVERSAL LEAD TRACKER
// Standalone, no imports. Loaded by EVERY page (including static landing pages that
// do not bundle main.js) so a WhatsApp click always reports the Ads conversion.
//
// Why this file exists: /arsitek-villa-mewah-lombok and /biaya-arsitek-lombok ship their
// own bundles and never loaded main.js, so clicks there fired ZERO conversions. Ads then
// had no signal to optimise on, which is fatal for Performance Max Smart Bidding.
//
// Idempotent: main.js also tracks wa.me clicks. A shared flag keeps exactly one report
// per click even when both are present.
// ========================================

const ADS_CONVERSION = 'AW-17872287905/HE4GCImO_uYcEKHxlcpC';

function reportLead(label) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'whatsapp_click', {
        event_category: 'lead',
        event_label: label
    });
    window.gtag('event', 'conversion', {
        send_to: ADS_CONVERSION
    });
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

        reportLead(link.dataset.waLabel || window.location.pathname);
    }, true);
}
