// Scoped to this project: other project galleries keep their existing behavior.
const triggers = [...document.querySelectorAll('.unram-photo')];
const photos = [...document.querySelectorAll('.unram-gallery img')];

if (triggers.length && photos.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'unram-lightbox';
  dialog.setAttribute('aria-label', 'UNRAM Residence photo viewer');
  dialog.innerHTML = `
    <div class="unram-lightbox__toolbar">
      <span class="unram-lightbox__counter" aria-live="polite"></span>
      <div class="unram-lightbox__controls">
        <button type="button" data-prev aria-label="Previous photograph">&#8592;</button>
        <button type="button" data-next aria-label="Next photograph">&#8594;</button>
        <button type="button" data-close aria-label="Close photo viewer" autofocus>Close</button>
      </div>
    </div>
    <img class="unram-lightbox__image" alt="">
  `;
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const counter = dialog.querySelector('.unram-lightbox__counter');
  let index = 0;
  let opener;
  let previousOverflow = '';

  function show(next) {
    index = (next + photos.length) % photos.length;
    image.src = photos[index].src;
    image.alt = photos[index].alt;
    counter.textContent = `${index + 1} / ${photos.length}`;
  }

  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    opener = trigger;
    show(Number(trigger.dataset.photoIndex));
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
}
