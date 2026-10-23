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
  const shell = form.closest('[data-lead-shell]');
  const success = shell?.querySelector('[data-lead-success]');
  if (success) {
    const content = shell.querySelector('[data-lead-content]');
    if (content) {
      content.hidden = true;
      content.style.display = 'none';
    } else {
      form.hidden = true;
    }
    success.hidden = false;
    success.style.display = 'block';
  }
}

const WHATSAPP_NUMBER = '6285190645078';

function buildWhatsAppHandoff(fields) {
  const isId = document.documentElement.lang.toLowerCase().startsWith('id');
  const lines = isId
    ? ['Halo Atelier Nusa, saya ingin konsultasi proyek.']
    : ['Hi Atelier Nusa, I would like to discuss a project.'];
  const label = isId
    ? { name: 'Nama', phone: 'WhatsApp', type: 'Jenis proyek', location: 'Lokasi', stage: 'Tahap proyek', budget: 'Anggaran', message: 'Detail' }
    : { name: 'Name', phone: 'WhatsApp', type: 'Project type', location: 'Location', stage: 'Project stage', budget: 'Budget', message: 'Details' };
  for (const key of ['name', 'phone', 'type', 'location', 'stage', 'budget', 'message']) {
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
    location: readField(form, 'lokasi', 'hp-location'),
    stage: readField(form, 'tahap', 'hp-stage'),
    message: readField(form, 'pesan', 'hp-message'),
    budget: readField(form, 'anggaran', 'hp-budget'),
  };
}

async function submitToAgent(form, fields, waWindow) {
  const { name, phone, email, type, location, stage, message, budget } = fields;
  const source = form.dataset.formName || window.location.pathname;
  const attribution = getAttribution();
  const payload = {
    source: 'website',
    name,
    phone,
    email,
    projectType: type,
    location,
    stage,
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
    project_location: location || 'unspecified',
  });
  trackEvent(ANALYTICS_EVENTS.consultationRequested, {
    form_id: form.id || source,
    form_name: source,
    page_path: window.location.pathname,
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

  if (waWindow) {
    waWindow.location.href = buildWhatsAppHandoff(fields);
  } else {
    window.location.href = buildWhatsAppHandoff(fields);
  }
  showSuccess(form);
}

function adaptLegacyForm(form) {
  const shell = form.closest('[data-lead-shell], .lead-form, .form-box, .form-card') || form.parentElement;
  const content = form.closest('[data-lead-content], #form-content, #input-view') || form.parentElement;
  const success = shell?.querySelector('#success-msg');
  if (!shell || !success) return false;

  shell.dataset.leadShell = 'true';
  content.dataset.leadContent = 'true';
  success.dataset.leadSuccess = 'true';
  form.dataset.leadForm = 'true';
  form.dataset.formName = form.dataset.formName || window.location.pathname.replace(/^\/+|\/+$/g, '') || 'legacy-landing';
  form.dataset.loadingLabel = form.dataset.loadingLabel || (document.documentElement.lang.toLowerCase().startsWith('id') ? 'Mengirim...' : 'Sending...');

  const fields = {
    nama: 'f-name',
    telepon: 'f-phone',
    jenis_proyek: 'f-type',
    lokasi: 'f-location',
    tahap: 'f-stage',
    anggaran: 'f-budget',
    pesan: 'f-message',
  };
  for (const [name, id] of Object.entries(fields)) {
    const field = form.querySelector(`#${id}`);
    if (field && !field.name) field.name = name;
  }
  const landStatus = form.querySelector('#f-lahan');
  if (landStatus && !form.elements.namedItem('tahap')) landStatus.name = 'tahap';
  return true;
}

export function initLegacyLeadForms(root = document) {
  root.querySelectorAll('form#lead-form-el:not([data-lead-form])').forEach(adaptLegacyForm);
  initLeadForms(root);
}

export function initLeadForms(root = document) {
  root.querySelectorAll('[data-lead-form]').forEach((form) => {
    if (form.dataset.leadReady === 'true') return;
    form.dataset.leadReady = 'true';

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      // Honeypot filled: pretend success and drop the submission silently.
      if (form.querySelector('input[name="website"]')?.value?.trim()) {
        showSuccess(form);
        return;
      }

      const fields = readLeadFields(form);
      const waWindow = window.open('', '_blank', 'noopener,noreferrer');
      setBusy(form, true);
      submitToAgent(form, fields, waWindow).catch((error) => {
        console.error('[Atelier Nusa] Lead submission failed:', error);
        if (waWindow && !waWindow.closed) waWindow.close();
        setBusy(form, false);
        showDeliveryError(form, fields);
        trackEvent('lead_delivery_failed', {
          form_id: form.id || form.dataset.formName || window.location.pathname,
          form_name: form.dataset.formName || window.location.pathname,
          page_path: window.location.pathname,
        });
      });
    }, true);

    form.addEventListener('focusin', () => {
      const context = {
        form_id: form.id || form.dataset.formName || window.location.pathname,
        page_path: window.location.pathname,
      };
      trackEvent(ANALYTICS_EVENTS.consultationStart, context);
      trackEvent(ANALYTICS_EVENTS.leadFormStart, context);
    }, { once: true });
  });
}
