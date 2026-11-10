import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
const gtagCalls = [];
const beaconCalls = [];

const windowStub = {
  location: {
    pathname: '/konsultasi-gratis',
    search: '?utm_source=instagram&utm_medium=social&utm_campaign=organic-distribution&utm_content=consultation',
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
});

test('trackEvent sends a safe analytics payload and an attributed agent mirror', async () => {
  const gtagBefore = gtagCalls.length;
  const beaconBefore = beaconCalls.length;

  events.trackEvent('lead_submit', {
    cta_id: 'consultation_form_submit',
    form_id: 'consultation-form',
    form_name: 'konsultasi-gratis',
    project_type: 'must-not-leak-to-analytics',
  });

  assert.equal(gtagCalls.length, gtagBefore + 1);
  assert.equal(gtagCalls.at(-1)[0], 'event');
  assert.equal(gtagCalls.at(-1)[1], 'lead_submit');
  assert.equal(gtagCalls.at(-1)[2].cta_id, 'consultation_form_submit');
  assert.equal(gtagCalls.at(-1)[2].form_id, 'consultation-form');
  assert.equal(gtagCalls.at(-1)[2].project_type, undefined);
  assert.equal(beaconCalls.length, beaconBefore + 1);

  const mirrored = await readBeacon();
  assert.equal(mirrored.event, 'lead_submit');
  assert.equal(mirrored.session_id, 'session-contract-test');
  assert.equal(mirrored.cta_id, 'consultation_form_submit');
  assert.equal(mirrored.form_name, 'konsultasi-gratis');
  assert.equal(mirrored.utm_source, 'instagram');
  assert.equal(mirrored.utm_content, 'consultation');
  assert.equal(mirrored.page, '/konsultasi-gratis');
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
