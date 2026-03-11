// ========================================
// LIGHTBOX COMPONENT
// ========================================

export function initLightbox() {
    const galleryImages = document.querySelectorAll('.project-gallery__item img');
    if (!galleryImages.length) return;

    // Create lightbox DOM
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous">
            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <img src="" alt="Lightbox image">
        <button class="lightbox-nav lightbox-next" aria-label="Next">
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('img');
    const counter = overlay.querySelector('.lightbox-counter');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    let currentIndex = 0;
    const images = Array.from(galleryImages);

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function navigate(direction) {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        updateLightboxImage();
    }

    // Click handlers
    images.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // Touch swipe support
    let touchStartX = 0;
    overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    overlay.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) {
            navigate(diff > 0 ? -1 : 1);
        }
    });
}
