import test from 'node:test';
import assert from 'node:assert/strict';
import { getAttribution } from '../src/analytics/attribution.js';

function visit(pathname, search = '', referrer = '', hostname = 'www.ateliernusa.id') {
  window.location = { pathname, search, hostname };
  document.referrer = referrer;
  return getAttribution();
}

function setup() {
  const storage = new Map();
  globalThis.window = {
    sessionStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
    crypto: { randomUUID: () => 'navigation-session' },
  };
  globalThis.document = { referrer: '' };
}

test('campaign and click IDs survive internal navigation across www and bare domain', () => {
  setup();
  const first = visit('/', '?utm_source=instagram&utm_medium=social&utm_campaign=villa&fbclid=fb-nav', 'https://instagram.com/');
  for (const referrer of ['https://www.ateliernusa.id/', 'https://ateliernusa.id/projects', '']) {
    const next = visit('/konsultasi-gratis', '', referrer);
    for (const key of ['lead_source', 'utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'landing_page', 'session_id', 'referrer_host']) {
      assert.equal(next[key], first[key], `${key} must survive ${referrer}`);
    }
  }
  const google = visit('/services', '?gclid=google-nav', 'https://www.ateliernusa.id/');
  assert.equal(google.lead_source, 'google/cpc');
  assert.equal(google.gclid, 'google-nav');
  assert.equal(google.first_fbclid, 'fb-nav');
  assert.equal(google.landing_page, '/');
  assert.equal(visit('/konsultasi-gratis', '', 'https://www.ateliernusa.id/services').gclid, 'google-nav');
});

test('direct/internal entry is not a self-referral, but external domains remain referrals', () => {
  setup();
  assert.equal(visit('/projects', '', 'https://ateliernusa.id/').lead_source, 'direct');
  const external = visit('/services', '', 'https://ateliernusa.id.example.org/');
  assert.equal(external.lead_source, 'referral');
  assert.equal(external.referrer_host, 'ateliernusa.id.example.org');
});

test('same-host preview navigation preserves campaign without treating unrelated hosts as internal', () => {
  setup();
  visit('/', '?utm_source=newsletter&utm_medium=email', '', 'preview.example.com');
  assert.equal(visit('/services', '', 'https://preview.example.com/', 'preview.example.com').lead_source, 'newsletter/email');
});
