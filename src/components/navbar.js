// ========================================
// NAVBAR COMPONENT
// ========================================

export function createNavbar(activePage = 'home') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'navbar';

  const isIndonesian = document.documentElement.lang.toLowerCase().startsWith('id');
  const pages = isIndonesian ? [
    { key: 'home', label: 'Beranda', href: '/' },
    { key: 'about', label: 'Studio', href: '/about' },
    { key: 'projects', label: 'Proyek', href: '/projects' },
    { key: 'services', label: 'Layanan', href: '/services' },
    { key: 'artikel', label: 'Artikel', href: '/artikel' },
    { key: 'lahan', label: 'Lahan', href: '/lahan' },
    { key: 'consult', label: 'Konsultasi', href: '/konsultasi-gratis' },
  ] : [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'projects', label: 'Projects', href: '/projects' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'artikel', label: 'Journal', href: '/artikel' },
    { key: 'lahan', label: 'Land', href: '/lahan' },
    { key: 'consult', label: 'Consultation', href: '/konsultasi-gratis' },
  ];

  const localizeCoreHref = (href) => {
    if (!isIndonesian || !['/', '/services', '/projects'].includes(href)) return href;
    return `${href}?lang=id`;
  };
  pages.forEach(page => { page.href = localizeCoreHref(page.href); });

  // The language toggle only works on translated pages; elsewhere it would
  // eject the visitor to the homepage, so it is not rendered at all.
  const translatedPaths = ['/', '/services', '/projects', '/artikel', '/lahan'];
  const normalizedPath = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
  const isTranslatable = translatedPaths.includes(normalizedPath);

  let languageHref = '';
  if (isTranslatable) {
    const languageUrl = new URL(window.location.href);
    languageUrl.pathname = normalizedPath;
    languageUrl.search = '';
    languageUrl.hash = '';
    languageUrl.searchParams.set('lang', isIndonesian ? 'en' : 'id');
    languageHref = `${languageUrl.pathname}${languageUrl.search}${languageUrl.hash}`;
  }
  const languageLabel = isIndonesian ? 'EN' : 'ID';
  const languageTitle = isIndonesian ? 'Switch to English' : 'Switch to Indonesian';

  nav.innerHTML = `
    <div class="container navbar__inner">
      <a href="/" class="navbar__logo" aria-label="Atelier Nusa Home">
        <img src="/images/responsive/atelier-nusa-logo-200.webp" srcset="/images/responsive/atelier-nusa-logo-200.webp 200w, /images/responsive/atelier-nusa-logo-400.webp 400w, /images/ATN Logo Transparan.webp 1536w" sizes="180px" alt="Atelier Nusa" class="navbar__logo-icon" width="180" height="120" fetchpriority="high" decoding="async">
      </a>

      <div class="navbar__menu" id="navMenu">
        ${pages.map(p => `
          <a href="${p.href}" class="navbar__link ${activePage === p.key ? 'active' : ''}">${p.label}</a>
        `).join('')}
      </div>

      ${isTranslatable ? `<a href="${languageHref}" class="navbar__language" aria-label="${languageLabel} - ${languageTitle}" title="${languageTitle}">${languageLabel}</a>` : ''}

      <button class="navbar__hamburger" id="navHamburger" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  document.body.prepend(nav);

  // Hamburger toggle
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  menu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Magnetic hover effect on nav links
  const navLinks = menu.querySelectorAll('.navbar__link');
  navLinks.forEach(link => {
    link.addEventListener('mousemove', (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      link.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });

    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}
