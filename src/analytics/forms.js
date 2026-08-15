import { getAttribution } from './attribution.js';
import { ANALYTICS_EVENTS, trackEvent } from './events.js';

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
      ? 'Form tidak dapat dikirim. Silakan coba lagi beberapa saat lagi.'
      : 'We could not submit the form. Please try again in a moment.'
  );
  error.hidden = false;
}

async function submitToAgent(form) {
  const name = readField(form, 'nama', 'hp-name');
  const phone = readField(form, 'telepon', 'hp-phone');
  const email = readField(form, 'email');
  const type = readField(form, 'jenis_proyek', 'hp-type');
  const message = readField(form, 'pesan', 'hp-message');
  const budget = readField(form, 'anggaran', 'hp-budget');
  const source = form.dataset.formName || window.location.pathname;
  const attribution = getAttribution();
  const payload = {
    source: 'website',
    name,
    phone,
    email,
    projectType: type,
    message,
    budget,
    page: window.location.pathname,
    referrer: document.referrer,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
    gclid: attribution.gclid,
    fbclid: attribution.fbclid,
    website: '',
  };

  const response = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Lead submission failed (${response.status})`);

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
      submitToAgent(form).catch((error) => {
        console.error('[Atelier Nusa] Lead submission failed:', error);
        setBusy(form, false);
        showDeliveryError(form);
        trackEvent('lead_delivery_failed', {
          form_id: form.id || form.dataset.formName || window.location.pathname,
          form_name: form.dataset.formName || window.location.pathname,
          page_path: window.location.pathname,
        });
      });
    });

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('focus', () => trackEvent(ANALYTICS_EVENTS.consultationStart, {
        form_id: form.id || form.dataset.formName || window.location.pathname,
        page_path: window.location.pathname,
      }), { once: true });
    });
  });
}
