// Standalone landing pages use inline FAQ buttons without the main site bundle.
window.toggleFaq = function toggleFaq(button) {
  const answer = button.nextElementSibling;
  if (!answer) return;
  const open = button.classList.toggle('open');
  button.setAttribute('aria-expanded', String(open));
  answer.style.maxHeight = open ? `${answer.scrollHeight}px` : '0px';
};
