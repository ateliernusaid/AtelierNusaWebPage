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
import { applyLanguage } from './components/language.js';

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

// ========================================
// WHATSAPP ENGAGEMENT TRACKER
// Keep WhatsApp clicks measurable even while paid campaigns are paused.
// ========================================
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href || !link.href.includes('wa.me')) return;

    e.preventDefault();

    // Track the intent separately from a qualified form submission.
    if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
            event_category: 'lead',
            event_label: window.location.pathname
        });
        // Google Ads conversion — WhatsApp Lead (AW-17872287905/HE4GCImO_uYcEKHxlcpC)
        gtag('event', 'conversion', {
            send_to: 'AW-17872287905/HE4GCImO_uYcEKHxlcpC'
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
// ARCHITECT CURSOR — SINGLE RING
// Satu element saja, tidak ada "double"
// Hanya muncul di desktop (mouse/trackpad)
// ========================================
function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Satu element ring saja — tidak ada dot terpisah
    const ring = document.createElement('div');
    ring.className = 'cursor__ring';
    document.body.appendChild(ring);

    // Ring langsung ikut cursor (no lag = tidak terlihat "double")
    document.addEventListener('mousemove', (e) => {
        ring.style.left = e.clientX + 'px';
        ring.style.top  = e.clientY + 'px';
    }, { passive: true });

    // Besar saat hover element interaktif
    const interactives = 'a, button, [role="button"], .btn, .btn-wa, .proj, .svc, .step';
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

// ========================================
// COUNT-UP ANIMATION
// Numbers animate from 0 when scrolled into view
// ========================================
function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.counted) return;
            el.dataset.counted = 'true';

            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.round(ease * target);
                el.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
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
    initCountUp();
    initLeadForms();
});

// Measure social-profile clicks so organic distribution can be compared with leads.
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || typeof gtag !== 'function') return;

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

    gtag('event', 'social_profile_click', {
        social_network: network,
        link_url: link.href,
        page_path: window.location.pathname,
    });
});
