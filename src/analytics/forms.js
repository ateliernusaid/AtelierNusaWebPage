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

function showDeliveryError(form) {
  let error = form.closest('[data-lead-shell]')?.querySelector('[data-lead-error]');
  if (!error) {
    error = document.createElement('p');
    error.dataset.leadError = 'true';
    error.setAttribute('role', 'alert');
    error.style.cssText = 'margin-top:12px;color:#f0a6a6;font-size:14px;line-height:1.5;';
    form.appendChild(error);
  }
  error.textContent = form.dataset.errorLabel || (
    document.documentElement.lang.toLowerCase().startsWith('id')
      ? 'WhatsApp tidak dapat dibuka. Silakan coba lagi atau hubungi kami melalui email.'
      : 'We could not open WhatsApp. Please try again or contact us by email.'
  );
  error.hidden = false;
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

  const whatsappWindow = window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,
    '_blank'
  );
  if (!whatsappWindow) {
    setBusy(form, false);
    showDeliveryError(form);
    trackEvent('lead_delivery_failed', {
      form_id: form.id || source,
      form_name: source,
      page_path: window.location.pathname,
    });
    return;
  }
  try {
    whatsappWindow.opener = null;
  } catch {
    // Some browsers expose a read-only opener on a newly opened tab.
  }

  trackEvent(ANALYTICS_EVENTS.leadSubmit, {
    form_id: form.id || source,
    form_name: source,
    page_path: window.location.pathname,
    project_type: type || 'unspecified',
  });

  // Count the Ads conversion only after the browser accepts the lead handoff.
  trackEvent('ads_conversion_Contact_1', {
    value: 1.0,
    currency: 'IDR',
    form_id: form.id || source,
    page_path: window.location.pathname,
  });

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
