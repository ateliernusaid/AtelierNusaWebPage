import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
const gtagCalls = [];
const beaconCalls = [];

const windowStub = {
  location: {
    pathname: '/konsultasi-gratis',
    search: '?utm_source=instagram&utm_medium=social&utm_campaign=organic-distribution&utm_content=consultation&fbclid=fbclid-contract',
  },
  sessionStorage: {
    getItem(key) {
      return storage.get(key) || null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
  },
  crypto: {
    randomUUID: () => 'session-contract-test',
  },
  gtag(...args) {
    gtagCalls.push(args);
  },
};

const documentStub = {
  referrer: 'https://www.google.com/search?q=architect+lombok',
  documentElement: { lang: 'id' },
};

Object.assign(globalThis, { window: windowStub, document: documentStub });
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    sendBeacon(url, body) {
      beaconCalls.push({ url, body });
      return true;
    },
  },
});

const attribution = await import('../src/analytics/attribution.js?analytics-contract');
const events = await import('../src/analytics/events.js?analytics-contract');

const forms = await import('../src/analytics/forms.js?analytics-form-contract');

function createFormHarness() {
  const handlers = {};
  const fields = {
    nama: { value: 'Test Visitor' },
    telepon: { value: '+62 851 0000 0000' },
    email: { value: 'visitor@example.com' },
    jenis_proyek: { value: 'Residential' },
    lokasi: { value: 'Mataram' },
    tahap: { value: 'Planning' },
    anggaran: { value: 'Rp1 miliar' },
    pesan: { value: 'Local contract test only' },
  };
  const submitButton = { textContent: 'Send', disabled: false, dataset: {} };
  const content = { hidden: false, style: {} };
  const success = { hidden: true, style: {} };
  const error = { hidden: true, style: {}, textContent: '' };
  const fallback = { hidden: true, style: {}, href: '' };
  const shell = {
    querySelector(selector) {
      if (selector.includes('[data-lead-content]')) return content;
      if (selector.includes('[data-lead-success]')) return success;
      if (selector.includes('[data-lead-error]')) return error;
      if (selector.includes('[data-lead-fallback]')) return fallback;
      return null;
    },
  };
  const form = {
    id: 'consultation-form',
    dataset: { leadForm: 'true', formName: 'konsultasi-gratis', loadingLabel: 'Sending...' },
    elements: { namedItem: (name) => fields[name] || null },
    querySelector(selector) {
      if (selector === 'button[type="submit"]') return submitButton;
      if (selector === 'input[name="website"]') return null;
      if (selector.includes('[type="submit"][data-cta-id]')) return null;
      return null;
    },
    closest() { return shell; },
    reportValidity() { return true; },
    addEventListener(type, handler) { handlers[type] = handler; },
  };
  return { form, handlers, fields, submitButton, content, success, error, fallback };
}

async function readBeacon(index = beaconCalls.length - 1) {
  return JSON.parse(await beaconCalls[index].body.text());
}

test('attribution keeps campaign context and a stable session id', () => {
  const first = attribution.getAttribution();
  const second = attribution.getAttribution();

  assert.equal(first.session_id, 'session-contract-test');
  assert.equal(second.session_id, first.session_id);
  assert.equal(first.lead_source, 'instagram/social');
  assert.equal(first.landing_page, '/konsultasi-gratis');
  assert.equal(first.utm_campaign, 'organic-distribution');
  assert.equal(first.referrer_host, 'www.google.com');
  assert.equal(first.fbclid, 'fbclid-contract');
  assert.equal(first.first_fbclid, 'fbclid-contract');
});

test('trackEvent sends a safe analytics payload and an attributed agent mirror', async () => {
  const gtagBefore = gtagCalls.length;
  const beaconBefore = beaconCalls.length;

  events.trackEvent('lead_submit', {
    source: 'website',
    cta_id: 'consultation_form_submit',
    form_id: 'consultation-form',
    form_name: 'konsultasi-gratis',
    page_path: '/funnel/consultation',
    project_type: 'must-not-leak-to-analytics',
  });

  assert.equal(gtagCalls.length, gtagBefore + 1);
  assert.equal(gtagCalls.at(-1)[0], 'event');
  assert.equal(gtagCalls.at(-1)[1], 'lead_submit');
  assert.equal(gtagCalls.at(-1)[2].cta_id, 'consultation_form_submit');
  assert.equal(gtagCalls.at(-1)[2].form_id, 'consultation-form');
  assert.equal(gtagCalls.at(-1)[2].project_type, undefined);
  assert.equal(gtagCalls.at(-1)[2].source, 'website');
  assert.equal(gtagCalls.at(-1)[2].session_id, 'session-contract-test');
  assert.equal(beaconCalls.length, beaconBefore + 1);

  const mirrored = await readBeacon();
  assert.equal(mirrored.event, 'lead_submit');
  assert.equal(mirrored.session_id, 'session-contract-test');
  assert.equal(mirrored.cta_id, 'consultation_form_submit');
  assert.equal(mirrored.form_name, 'konsultasi-gratis');
  assert.equal(mirrored.utm_source, 'instagram');
  assert.equal(mirrored.utm_content, 'consultation');
  assert.equal(mirrored.page, '/konsultasi-gratis');
  assert.equal(mirrored.source, 'website');
  assert.equal(mirrored.page_path, '/funnel/consultation');
  assert.equal(mirrored.lead_source, 'instagram/social');
  assert.equal(mirrored.fbclid, 'fbclid-contract');
});

test('mirror-only legacy events do not duplicate GA or Clarity events', async () => {
  const gtagBefore = gtagCalls.length;
  const beaconBefore = beaconCalls.length;
  const clarityCalls = [];
  windowStub.clarity = (...args) => clarityCalls.push(args);

  events.trackEvent('whatsapp_click', { cta_id: 'legacy_whatsapp' }, { mirrorOnly: true });

  assert.equal(gtagCalls.length, gtagBefore);
  assert.equal(clarityCalls.length, 0);
  assert.equal(beaconCalls.length, beaconBefore + 1);
  assert.equal((await readBeacon()).cta_id, 'legacy_whatsapp');
});

test('delivery success and failure remain distinct mirrored funnel events', async () => {
  const beaconBefore = beaconCalls.length;

  events.trackEvent('lead_delivery_success', {
    source: 'website',
    form_id: 'consultation-form',
    form_name: 'konsultasi-gratis',
    cta_id: 'consultation_form_submit',
  });
  events.trackEvent('lead_delivery_failed', {
    source: 'website',
    form_id: 'consultation-form',
    form_name: 'konsultasi-gratis',
    cta_id: 'consultation_form_submit',
  });

  assert.equal(beaconCalls.length, beaconBefore + 2);
  assert.equal((await readBeacon(beaconBefore)).event, 'lead_delivery_success');
  assert.equal((await readBeacon(beaconBefore + 1)).event, 'lead_delivery_failed');
});

test('form flow separates accepted delivery from failed delivery without production I/O', async () => {
  const originalFetch = globalThis.fetch;
  const originalOpen = windowStub.open;
  const originalLocation = windowStub.location;
  const originalBeaconCount = beaconCalls.length;

  try {
    const successHarness = createFormHarness();
    windowStub.open = () => ({ closed: false, close() { this.closed = true; }, location: { href: '' } });
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    forms.initLeadForms({ querySelectorAll: () => [successHarness.form] });
    successHarness.handlers.submit({
      preventDefault() {},
      stopImmediatePropagation() {},
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    const successEvents = [];
    for (let index = originalBeaconCount; index < beaconCalls.length; index += 1) {
      successEvents.push(await readBeacon(index));
    }
    assert.deepEqual(successEvents.map((entry) => entry.event), [
      'lead_submit',
      'lead_delivery_success',
      'consultation_requested',
    ]);
    assert.equal(successHarness.success.hidden, false);
    assert.equal(successHarness.fallback.hidden, true);

    const failureStart = beaconCalls.length;
    const failureHarness = createFormHarness();
    globalThis.fetch = async () => ({
      ok: false,
      status: 502,
      json: async () => ({ error: 'Lead service unavailable' }),
    });
    forms.initLeadForms({ querySelectorAll: () => [failureHarness.form] });
    failureHarness.handlers.submit({
      preventDefault() {},
      stopImmediatePropagation() {},
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    const failureEvents = [];
    for (let index = failureStart; index < beaconCalls.length; index += 1) {
      failureEvents.push(await readBeacon(index));
    }
    assert.deepEqual(failureEvents.map((entry) => entry.event), [
      'lead_delivery_failed',
    ]);
    assert.equal(failureHarness.error.hidden, false);
    assert.equal(failureHarness.fallback.hidden, false);
  } finally {
    globalThis.fetch = originalFetch;
    windowStub.open = originalOpen;
    windowStub.location = originalLocation;
  }
});

test('analytics vendor exceptions are isolated and remaining destinations still receive events', () => {
  const originalGtag = windowStub.gtag;
  const originalClarity = windowStub.clarity;
  const originalUuid = windowStub.crypto.randomUUID;
  try {
    const clarityCalls = [];
    const before = beaconCalls.length;
    windowStub.gtag = () => { throw new Error('GA unavailable'); };
    windowStub.clarity = (...args) => clarityCalls.push(args);
    assert.doesNotThrow(() => events.trackEvent('lead_delivery_success'));
    assert.equal(clarityCalls.length, 1);
    assert.equal(beaconCalls.length, before + 1);

    windowStub.gtag = originalGtag;
    windowStub.clarity = () => { throw new Error('Clarity unavailable'); };
    const gaBefore = gtagCalls.length;
    assert.doesNotThrow(() => events.trackEvent('lead_delivery_success'));
    assert.equal(gtagCalls.length, gaBefore + 1);
    assert.equal(beaconCalls.length, before + 2);

    windowStub.crypto.randomUUID = () => { throw new Error('Event ID unavailable'); };
    assert.doesNotThrow(() => events.trackEvent('lead_delivery_success'));
  } finally {
    windowStub.gtag = originalGtag;
    windowStub.clarity = originalClarity;
    windowStub.crypto.randomUUID = originalUuid;
  }
});

test('accepted form keeps success UI and WhatsApp handoff even when GA, Ads and Clarity throw', async () => {
  const originalFetch = globalThis.fetch;
  const originalOpen = windowStub.open;
  const originalGtag = windowStub.gtag;
  const originalClarity = windowStub.clarity;
  const harness = createFormHarness();
  const popup = { closed: false, close() { this.closed = true; }, location: { href: '' } };
  const before = beaconCalls.length;
  let posts = 0;
  try {
    windowStub.open = () => popup;
    windowStub.gtag = () => { throw new Error('GA/Ads unavailable'); };
    windowStub.clarity = () => { throw new Error('Clarity unavailable'); };
    globalThis.fetch = async (url) => {
      assert.equal(url, '/api/lead');
      posts++;
      return { ok: true, status: 200, json: async () => ({ success: true }) };
    };
    forms.initLeadForms({ querySelectorAll: () => [harness.form] });
    harness.handlers.submit({ preventDefault() {}, stopImmediatePropagation() {} });
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(posts, 1);
    assert.equal(harness.success.hidden, false);
    assert.equal(harness.error.hidden, true);
    assert.equal(harness.fallback.hidden, true);
    assert.equal(popup.closed, false);
    assert.match(popup.location.href, /^https:\/\/wa\.me\//);
    const names = await Promise.all(beaconCalls.slice(before).map(async entry => JSON.parse(await entry.body.text()).event));
    assert.deepEqual(names, ['lead_submit', 'lead_delivery_success', 'consultation_requested']);
  } finally {
    globalThis.fetch = originalFetch;
    windowStub.open = originalOpen;
    windowStub.gtag = originalGtag;
    windowStub.clarity = originalClarity;
  }
});
