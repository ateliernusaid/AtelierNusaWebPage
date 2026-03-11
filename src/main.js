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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createNavbar(getActivePage());
    createFooter();
    createWhatsApp();
    initAnimations();
    initPageTransitions();
    initLightbox();
});
