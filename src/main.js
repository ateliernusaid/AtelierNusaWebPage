// ========================================
// MAIN JS ENTRY POINT
// ========================================

import './styles/index.css';
import { createNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { createWhatsApp } from './components/whatsapp.js';
import { initAnimations, initPageTransitions } from './components/animations.js';
import { initLightbox } from './components/lightbox.js';

// Determine active page
function getActivePage() {
    const path = window.location.pathname;
    if (path.includes('about')) return 'about';
    if (path.includes('projects')) return 'projects';
    if (path.includes('services')) return 'services';
    return 'home';
}

// ========================================
// GOOGLE ADS CONVERSION INTERCEPTOR
// Intercepts ALL wa.me clicks across the site
// and fires a conversion event to Google Ads
// before navigating the user to WhatsApp.
// ========================================
const AW_CONVERSION_ID = 'AW-17992260618/RYIECJGXwo8cEIq4sIND';

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href || !link.href.includes('wa.me')) return;

    e.preventDefault();

    // Fire Google Ads conversion event
    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            'send_to': AW_CONVERSION_ID,
            'value': 1.0,
            'currency': 'IDR'
        });
    }

    // Also fire a GA4 event for Analytics reporting
    if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
            event_category: 'lead',
            event_label: window.location.pathname
        });
    }

    // Navigate after brief delay so gtag has time to fire
    const destination = link.href;
    const target = link.target || '_self';
    setTimeout(() => {
        if (target === '_blank') {
            window.open(destination, '_blank');
        } else {
            window.location.href = destination;
        }
    }, 350);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createNavbar(getActivePage());
    createFooter();
    createWhatsApp();
    initAnimations();
    initPageTransitions();
    initLightbox();
});
