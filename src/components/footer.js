// ========================================
// FOOTER COMPONENT
// ========================================

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  footer.innerHTML = `
    <div class="container footer__inner">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="/" class="footer__logo">
            <img src="/images/ATN Logo Transparan.png" alt="Atelier Nusa" class="footer__logo-icon">
          </a>
          <p class="footer__tagline">Tropical Architecture · Lombok</p>
          <div class="footer__social">
            <a href="https://facebook.com" target="_blank" rel="noopener" class="footer__social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://wa.me/6285190645078" target="_blank" rel="noopener" class="footer__social-link" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer__links">
          <div class="footer__col">
            <div class="footer__col-title">Navigation</div>
            <a href="/" class="footer__link">Home</a>
            <a href="/about.html" class="footer__link">About</a>
            <a href="/projects.html" class="footer__link">Projects</a>
            <a href="/services.html" class="footer__link">Services</a>
          </div>

          <div class="footer__col">
            <div class="footer__col-title">Contact</div>
            <a href="mailto:ateliernusaarchitects@gmail.com" class="footer__link">ateliernusaarchitects@gmail.com</a>
            <a href="tel:+6285190645078" class="footer__link">+62 851-9064-5078</a>
          </div>

          <div class="footer__col">
            <div class="footer__col-title">Studio</div>
            <p class="footer__address">
              Jl. Jend. Sudirman No.34, Rembiga,<br>
              Kec. Selaparang, Kota Mataram,<br>
              NTB 83124, Indonesia
            </p>
          </div>
        </div>
      </div>

      <div class="footer__divider"></div>

      <div class="footer__bottom">
        <div class="footer__copyright">© ${new Date().getFullYear()} Atelier Nusa. All rights reserved.</div>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
}
