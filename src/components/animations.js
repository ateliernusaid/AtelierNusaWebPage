// ========================================
// SCROLL ANIMATIONS & INTERACTIONS
// ========================================

export function initAnimations() {
    // Intersection Observer for .reveal animations
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
        revealObserver.observe(el);
    });

    // Intersection Observer for .arch-reveal animations
    const archRevealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    archRevealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px',
        }
    );

    document.querySelectorAll('.arch-reveal').forEach((el) => {
        archRevealObserver.observe(el);
    });

    // Stagger parent observer (triggers child stagger animations)
    const staggerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    staggerObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px',
        }
    );

    document.querySelectorAll('.stagger-parent').forEach((el) => {
        staggerObserver.observe(el);
    });

    // Mouse-tracking glow for arch-cards (throttled with rAF)
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
        document.querySelectorAll('.arch-card').forEach((card) => {
            let ticking = false;
            card.addEventListener('mousemove', (e) => {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        card.style.setProperty('--mouse-x', x + '%');
                        card.style.setProperty('--mouse-y', y + '%');
                        ticking = false;
                    });
                }
            }, { passive: true });
        });
    }

    // Parallax effect for hero particles (skip on mobile/touch)
    const particles = document.querySelectorAll('.hero__particle');
    const isDesktop = window.matchMedia('(min-width: 769px) and (hover: hover)').matches;
    if (particles.length > 0 && isDesktop) {
        let pTicking = false;
        window.addEventListener('mousemove', (e) => {
            if (!pTicking) {
                pTicking = true;
                requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 15;
                    const y = (e.clientY / window.innerHeight - 0.5) * 15;
                    particles.forEach((p, i) => {
                        const speed = (i + 1) * 0.25;
                        p.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                    });
                    pTicking = false;
                });
            }
        }, { passive: true });
    }

    // Counter animation for stats
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(eased * target);
        el.textContent = current + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// Smooth page transitions
export function initPageTransitions() {
    // Page fade-in on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // Fade-out on navigation
    document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');
        
        // Skip interception if the link is meant to open in a new tab
        if (target === '_blank') return;

        if (href && href.startsWith('/') && !href.startsWith('//')) {
            link.addEventListener('click', (e) => {
                // Don't intercept if same page
                if (href === window.location.pathname) {
                    e.preventDefault();
                    return;
                }

                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });
}
