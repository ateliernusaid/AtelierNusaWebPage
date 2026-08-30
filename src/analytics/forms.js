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

const WHATSAPP_NUMBER = '6285190645078';

function buildWhatsAppHandoff(fields) {
  const isId = document.documentElement.lang.toLowerCase().startsWith('id');
  const lines = isId
    ? ['Halo Atelier Nusa, saya ingin konsultasi proyek.']
    : ['Hi Atelier Nusa, I would like to discuss a project.'];
  const label = isId
    ? { name: 'Nama', phone: 'WhatsApp', type: 'Jenis proyek', budget: 'Anggaran', message: 'Detail' }
    : { name: 'Name', phone: 'WhatsApp', type: 'Project type', budget: 'Budget', message: 'Details' };
  for (const key of ['name', 'phone', 'type', 'budget', 'message']) {
    if (fields[key]) lines.push(`${label[key]}: ${fields[key]}`);
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

// The API POST is the only delivery path, so a failure used to lose the lead outright.
// Offer the WhatsApp handoff instead of a dead-end error.
function showDeliveryError(form, fields) {
  const shell = form.closest('[data-lead-shell]');
  let error = shell?.querySelector('[data-lead-error]');
  if (!error) {
    error = document.createElement('p');
    error.dataset.leadError = 'true';
    error.setAttribute('role', 'alert');
    error.style.cssText = 'margin-top:12px;color:#f0a6a6;font-size:14px;line-height:1.5;';
    form.appendChild(error);
  }
  const isId = document.documentElement.lang.toLowerCase().startsWith('id');
  error.textContent = form.dataset.errorLabel || (isId
    ? 'Form gagal terkirim. Lanjutkan lewat WhatsApp agar brief Anda tidak hilang.'
    : 'The form could not be submitted. Continue on WhatsApp so your brief is not lost.');
  error.hidden = false;

  let fallback = shell?.querySelector('[data-lead-fallback]');
  if (!fallback) {
    fallback = document.createElement('a');
    fallback.dataset.leadFallback = 'true';
    fallback.dataset.waLabel = 'lead-form-fallback';
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.className = 'btn btn--primary';
    fallback.style.cssText = 'margin-top:12px;width:100%;justify-content:center;';
    error.insertAdjacentElement('afterend', fallback);
  }
  fallback.href = buildWhatsAppHandoff(fields);
  fallback.textContent = isId ? 'Lanjut via WhatsApp' : 'Continue on WhatsApp';
  fallback.hidden = false;
}

function readLeadFields(form) {
  return {
    name: readField(form, 'nama', 'hp-name'),
    phone: readField(form, 'telepon', 'hp-phone'),
    email: readField(form, 'email'),
    type: readField(form, 'jenis_proyek', 'hp-type'),
    message: readField(form, 'pesan', 'hp-message'),
    budget: readField(form, 'anggaran', 'hp-budget'),
  };
}

async function submitToAgent(form, fields) {
  const { name, phone, email, type, message, budget } = fields;
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
    website: form.querySelector('input[name="website"]')?.value?.trim() || '',
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
  // Google Ads conversion — WhatsApp/Contact lead (AW-17872287905)
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-17872287905/HE4GCImO_uYcEKHxlcpC'
    });
  }

  showSuccess(form);
}

export function initLeadForms(root = document) {
  root.querySelectorAll('[data-lead-form]').forEach((form) => {
    if (form.dataset.leadReady === 'true') return;
    form.dataset.leadReady = 'true';

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      // Honeypot filled: pretend success and drop the submission silently.
      if (form.querySelector('input[name="website"]')?.value?.trim()) {
        showSuccess(form);
        return;
      }

      const fields = readLeadFields(form);
      setBusy(form, true);
      submitToAgent(form, fields).catch((error) => {
        console.error('[Atelier Nusa] Lead submission failed:', error);
        setBusy(form, false);
        showDeliveryError(form, fields);
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
