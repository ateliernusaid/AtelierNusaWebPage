// ========================================
// WHATSAPP FLOATING BUTTON
// ========================================

export function createWhatsApp() {
    const waLink = document.createElement('a');
    waLink.className = 'whatsapp-float';
    waLink.id = 'whatsapp-float';
    waLink.target = '_blank';
    waLink.rel = 'noopener';
    waLink.setAttribute('aria-label', 'Chat on WhatsApp');

    const message = `Hi Atelier Nusa!

I've been exploring your portfolio and I'm truly impressed by your tropical design approach.

I have a project in mind and would love to schedule a free consultation to discuss the vision, scope, and next steps.

Looking forward to connecting!`;

    waLink.href = `https://wa.me/6285190645078?text=${encodeURIComponent(message)}`;

    waLink.innerHTML = `
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.904 15.904 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.338 22.594c-.39 1.098-1.922 2.01-3.156 2.276-.846.18-1.95.322-5.67-1.218-4.762-1.97-7.826-6.814-8.064-7.13-.23-.316-1.906-2.536-1.906-4.838s1.206-3.43 1.634-3.9c.39-.43.916-.63 1.22-.63.152 0 .288.008.41.014.428.018.642.042.924.716.352.84 1.21 2.942 1.316 3.158.108.216.216.504.072.786-.136.288-.252.468-.468.72-.216.252-.426.444-.642.714-.198.234-.42.486-.174.916.246.424 1.092 1.8 2.346 2.916 1.614 1.434 2.91 1.9 3.396 2.098.35.144.766.108 1.02-.162.324-.342.724-.91 1.13-1.47.288-.398.652-.45 1.038-.306.39.136 2.484 1.172 2.912 1.386.428.216.714.324.82.504.1.18.1 1.044-.29 2.148z"/>
        </svg>
    `;

    document.body.appendChild(waLink);
}