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
            <a href="https://www.facebook.com/profile.php?id=61586267966385" target="_blank" rel="noopener" class="footer__social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/ateliernusa.id/" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">
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
            <div class="footer__col-title">Navigasi</div>
            <a href="/" class="footer__link">Home</a>
            <a href="/about.html" class="footer__link">About</a>
            <a href="/projects.html" class="footer__link">Projects</a>
            <a href="/services.html" class="footer__link">Services</a>
            <a href="/artikel.html" class="footer__link">Artikel</a>
          </div>

          <div class="footer__col">
            <div class="footer__col-title">Layanan</div>
            <a href="/konsultasi-gratis.html" class="footer__link" style="color: var(--color-accent); font-weight: var(--fw-medium);">Konsultasi Gratis</a>
            <a href="/jasa-arsitek-lombok.html" class="footer__link">Jasa Arsitek Lombok</a>
            <a href="/arsitek-mataram.html" class="footer__link">Arsitek Mataram</a>
            <a href="/desain-interior-lombok.html" class="footer__link">Desain Interior Lombok</a>
            <a href="/arsitek-villa-mewah-lombok.html" class="footer__link">Arsitek Villa Mewah</a>
            <a href="/biaya-arsitek-lombok.html" class="footer__link">Biaya Arsitek Lombok</a>
            <a href="/renovasi-rumah-mataram-lombok.html" class="footer__link">Renovasi Rumah Mataram</a>
            <a href="/tren-desain-interior-lombok.html" class="footer__link">Tren Interior Tropis</a>
          </div>

          <div class="footer__col">
            <div class="footer__col-title">Contact</div>
            <a href="mailto:marketing@ateliernusa.id" class="footer__link">marketing@ateliernusa.id</a>
            <a href="https://wa.me/6285190645078" target="_blank" rel="noopener" class="footer__link">+62 851-9064-5078</a>
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
        <div class="footer__legal">
          <a href="/privacy-policy.html" class="footer__link" style="font-size: var(--fs-xs);">Privacy Policy</a>
          <span class="footer__legal-sep">|</span>
          <a href="/terms-of-service.html" class="footer__link" style="font-size: var(--fs-xs);">Terms of Service</a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
}

