// ========================================
// NAVBAR COMPONENT
// ========================================

export function createNavbar(activePage = 'home') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'navbar';

  const isIndonesian = document.documentElement.lang.toLowerCase().startsWith('id');
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const pages = isIndonesian ? [
    { key: 'home', label: 'Beranda', href: '/' },
    { key: 'about', label: 'Studio', href: '/about.html' },
    { key: 'projects', label: 'Proyek', href: '/projects.html' },
    { key: 'services', label: 'Layanan', href: '/services.html' },
    { key: 'artikel', label: 'Artikel', href: '/artikel.html' },
    { key: 'lahan', label: 'Lahan', href: '/lahan.html' },
  ] : [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About', href: '/about.html' },
    { key: 'projects', label: 'Projects', href: '/projects.html' },
    { key: 'services', label: 'Services', href: '/services.html' },
    { key: 'artikel', label: 'Journal', href: '/artikel.html' },
    { key: 'lahan', label: 'Land', href: '/lahan.html' },
  ];

  // The Indonesian service page has no separate English duplicate; use the
  // English services section on the homepage as its language counterpart.
  const languageTargets = isIndonesian
    ? {
        '/jasa-arsitek-lombok': '/services',
        '/portofolio-villa-lombok': '/projects',
      }
    : {
        '/services': '/jasa-arsitek-lombok',
        '/projects': '/portofolio-villa-lombok',
      };
  const languageHref = languageTargets[currentPath] || (isIndonesian ? '/services' : '/jasa-arsitek-lombok');
  const languageLabel = isIndonesian ? 'EN' : 'ID';
  const languageTitle = isIndonesian ? 'Open English site' : 'Open Indonesian services';

  nav.innerHTML = `
    <div class="container navbar__inner">
      <a href="/" class="navbar__logo" aria-label="Atelier Nusa Home">
        <img src="/images/ATN Logo Transparan.png" alt="Atelier Nusa" class="navbar__logo-icon">
      </a>

      <div class="navbar__menu" id="navMenu">
        ${pages.map(p => `
          <a href="${p.href}" class="navbar__link ${activePage === p.key ? 'active' : ''}">${p.label}</a>
        `).join('')}
      </div>

      <a href="${languageHref}" class="navbar__language" aria-label="${languageTitle}" title="${languageTitle}">${languageLabel}</a>

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
