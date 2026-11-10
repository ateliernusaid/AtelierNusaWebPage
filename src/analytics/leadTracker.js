import { ANALYTICS_EVENTS, trackEvent } from './events.js';

function getCtaId(element, fallback = '') {
    const explicit = element?.dataset?.ctaId || element?.dataset?.waLabel;
    if (explicit) return explicit;
    const onclick = element?.getAttribute?.('onclick') || '';
    const inline = onclick.match(/trackCTA\(['"]([^'"]+)['"]\)/)?.[1];
    if (inline) return inline;
    if (element?.id) return element.id;
    return fallback;
}

function reportContact(label, type, ctaId = '', options = {}) {
    const pageKey = window.location.pathname.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'home';
    trackEvent(type === 'phone_click' ? ANALYTICS_EVENTS.phoneClick : ANALYTICS_EVENTS.whatsappClick, {
        event_category: 'lead',
        ...(ctaId ? { cta_id: ctaId } : { cta_id: `${pageKey}_${type}` }),
    }, options);
}

function hasInlineContactTracker(element) {
    return /(?:fireConversion|fireGoogleAdsConversion)\s*\(/.test(element?.getAttribute?.('onclick') || '');
}
function reportCtaClick(element) {
    const ctaId = getCtaId(element);
    if (!ctaId) return;
    const hasLegacyInlineTracker = /trackCTA\(['"][^'"]+['"]\)/.test(element.getAttribute?.('onclick') || '');
    trackEvent(ANALYTICS_EVENTS.ctaClick, { cta_id: ctaId }, { mirrorOnly: hasLegacyInlineTracker });
}

if (!window.__atnLeadTracker) {
    window.__atnLeadTracker = true;
    trackEvent('page_view');

    document.addEventListener('click', (e) => {
        const cta = e.target?.closest?.('[data-cta-id], [onclick*="trackCTA"]');
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
        reportContact(link.dataset.waLabel || window.location.pathname, isPhone ? 'phone_click' : 'whatsapp_click', getCtaId(link), { mirrorOnly: hasInlineContactTracker(link) });
    }, true);
}
