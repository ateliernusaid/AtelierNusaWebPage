// ========================================
// NAVBAR COMPONENT
// ========================================

export function createNavbar(activePage = 'home') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'navbar';

  const pages = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About', href: '/about.html' },
    { key: 'projects', label: 'Projects', href: '/projects.html' },
    { key: 'services', label: 'Services', href: '/services.html' },
  ];

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
