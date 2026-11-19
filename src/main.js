// ========================================
// MAIN JS ENTRY POINT
// ========================================

import './styles/index.css';
import { createNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { createWhatsApp } from './components/whatsapp.js';
import { initAnimations } from './components/animations.js';
import { initLightbox } from './components/lightbox.js';
import { initLeadForms } from './analytics/forms.js';
import { trackEvent } from './analytics/events.js';
import { applyLanguage } from './components/language.js';
import './analytics/leadTracker.js';

// Determine active page
function getActivePage() {
    const path = window.location.pathname;
    if (path.includes('about')) return 'about';
    if (path.includes('projects')) return 'projects';
    if (path.includes('services')) return 'services';
    if (path.includes('jasa-arsitek-lombok')) return 'services';
    if (path.includes('artikel')) return 'artikel';
    if (path.includes('lahan') || path.includes('tanah-')) return 'lahan';
    return 'home';
}

function ensureMainLandmark() {
    if (document.querySelector('main')) return;

    const main = document.createElement('main');
    main.id = 'main-content';
    [...document.body.children].forEach((child) => main.appendChild(child));
    document.body.appendChild(main);
}

// New funnel links use document language after the existing page translation.
function initLocalizedCtas() {
    const isIndonesian = document.documentElement.lang.toLowerCase().startsWith('id');
    document.querySelectorAll('[data-cta-copy-en][data-cta-copy-id]').forEach((link) => {
        link.textContent = isIndonesian ? link.dataset.ctaCopyId : link.dataset.ctaCopyEn;
    });
}

// ========================================
// CONTACT ENGAGEMENT TRACKER
// Lives in analytics/leadTracker.js so static pages that never bundle main.js
// still report WhatsApp/phone micro-conversions. Qualified form submissions
// are tracked separately as lead_submit/consultation_requested.
// ========================================

// ========================================
// ARCHITECT CURSOR — SINGLE RING
// Satu element saja, tidak ada "double"
// Hanya muncul di desktop (mouse/trackpad)
// ========================================
function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Satu element ring saja — tidak ada dot terpisah
    const ring = document.createElement('div');
    ring.className = 'cursor__ring';
    document.body.appendChild(ring);

    // Coalesce pointer writes into one frame, using the latest position.
    let cursorFrame = 0;
    let cursorX = 0;
    let cursorY = 0;
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (cursorFrame) return;
        cursorFrame = requestAnimationFrame(() => {
            ring.style.left = cursorX + 'px';
            ring.style.top = cursorY + 'px';
            cursorFrame = 0;
        });
    }, { passive: true });

    // Besar saat hover element interaktif
    const interactives = 'a, button, [role="button"], .btn, .btn-wa';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactives)) ring.classList.add('cursor--hover');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactives)) ring.classList.remove('cursor--hover');
    });

    // Sembunyikan saat mouse keluar dari window
    document.addEventListener('mouseleave', () => ring.style.opacity = '0');
    document.addEventListener('mouseenter', () => ring.style.opacity = '');
}

// ========================================
// SCROLL PROGRESS BAR
// Thin gold line at the top of the page
// ========================================
function initScrollProgress() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    let progressFrame = 0;
    const updateProgress = () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
        bar.style.transform = `scaleX(${progress})`;
        progressFrame = 0;
    };
    const scheduleProgress = () => {
        if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    };
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
    updateProgress();
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
    applyLanguage();
    initLocalizedCtas();
    ensureMainLandmark();
    createNavbar(getActivePage());
    createFooter();
    createWhatsApp();
    initAnimations();
    initLightbox();

    // Design enhancements
    initCursor();
    initScrollProgress();
    initLazyImageFade();
    initLeadForms();
});

// Measure social-profile clicks without sending the destination URL to analytics.
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    let host;
    try {
        host = new URL(link.href).hostname;
    } catch {
        return;
    }

    const network = host.includes('threads.com')
        ? 'threads'
        : host.includes('instagram.com')
            ? 'instagram'
            : host.includes('facebook.com')
                ? 'facebook'
                : null;
    if (!network) return;

    trackEvent('social_profile_click', {
        social_network: network,
    });
});
