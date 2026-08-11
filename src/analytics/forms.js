import { ANALYTICS_EVENTS, trackEvent } from './events.js';

const WHATSAPP_NUMBER = '6285190645078';

function readField(form, name, fallbackId) {
  return form.elements.namedItem(name)?.value?.trim() ||
    (fallbackId ? form.querySelector(`#${fallbackId}`)?.value?.trim() : '') ||
    '';
}

function setBusy(form, busy) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  if (busy) {
    button.dataset.originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = form.dataset.loadingLabel || 'Sending...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalLabel || 'Send';
  }
}

function showSuccess(form) {
  const success = form.closest('[data-lead-shell]')?.querySelector('[data-lead-success]');
  if (success) {
    form.hidden = true;
    success.hidden = false;
  }
}

function submitToWhatsApp(form) {
  const name = readField(form, 'nama', 'hp-name');
  const phone = readField(form, 'telepon', 'hp-phone');
  const email = readField(form, 'email');
  const type = readField(form, 'jenis_proyek', 'hp-type');
  const message = readField(form, 'pesan', 'hp-message');
  const source = form.dataset.formName || window.location.pathname;

  const lines = [
    'Halo Atelier Nusa, saya ingin berkonsultasi tentang proyek saya.',
    `Nama: ${name}`,
    `WhatsApp: ${phone}`,
    email ? `Email: ${email}` : '',
    type ? `Jenis proyek: ${type}` : '',
    message ? `Detail: ${message}` : '',
    `Sumber: ${source}`,
  ].filter(Boolean);

  trackEvent(ANALYTICS_EVENTS.leadSubmit, {
    form_id: form.id || source,
    form_name: source,
    page_path: window.location.pathname,
    project_type: type || 'unspecified',
  });

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  showSuccess(form);
}

export function initLeadForms(root = document) {
  root.querySelectorAll('[data-lead-form]').forEach((form) => {
    if (form.dataset.leadReady === 'true') return;
    form.dataset.leadReady = 'true';

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      setBusy(form, true);
      submitToWhatsApp(form);
    });

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('focus', () => trackEvent(ANALYTICS_EVENTS.consultationStart, {
        form_id: form.id || form.dataset.formName || window.location.pathname,
        page_path: window.location.pathname,
      }), { once: true });
    });
  });
}

