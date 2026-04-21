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

// ========================================
// ARCHITECT CURSOR RETICLE
// Custom cursor with gold ring — desktop only
// ========================================
function initCursor() {
    // Only on devices with fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor__dot';
    ring.className = 'cursor__ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    // Smooth ring follow
    (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Expand on interactive elements
    const interactives = 'a, button, [role="button"], .btn, .btn-wa, .proj, .svc';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactives)) {
            dot.parentElement?.classList.add('cursor--hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactives)) {
            dot.parentElement?.classList.remove('cursor--hover');
        }
    });
}

// ========================================
// SCROLL PROGRESS BAR
// Thin gold line at the top of the page
// ========================================
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? scrolled / total : 0;
        bar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
}

// ========================================
// LAZY IMAGE FADE-IN
// Images fade in smoothly when loaded
// ========================================
function initLazyImageFade() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createNavbar(getActivePage());
    createFooter();
    createWhatsApp();
    initAnimations();
    initPageTransitions();
    initLightbox();

    // Design enhancements
    initCursor();
    initScrollProgress();
    initLazyImageFade();
});
