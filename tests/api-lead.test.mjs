import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/lead.js';

const ENV = { AGENT_WEBHOOK_URL: 'https://agent.example.com', AGENT_WEBHOOK_KEY: 'test-key' };

let fetchCalls = [];
let fetchResponse = { ok: true, status: 200, json: async () => ({}) };

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    setStatusCalled: false,
    status(code) { this.statusCode = code; this.setStatusCalled = true; return this; },
    setHeader() {},
    json(payload) { this.body = payload; return this; },
  };
}

function setup({ env = ENV, forwardedFor = '203.0.113.10', body = {} } = {}) {
  for (const key of ['AGENT_WEBHOOK_URL', 'AGENT_WEBHOOK_KEY']) {
    if (env[key]) process.env[key] = env[key];
    else delete process.env[key];
  }
  fetchCalls = [];
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url: String(url), init });
    return fetchResponse;
  };
  const req = { method: 'POST', headers: { 'x-forwarded-for': forwardedFor }, body };
  return { req, res: mockRes() };
}

test('rejects non-POST methods with 405', async () => {
  const { res } = setup();
  const result = await handler({ method: 'GET', headers: {} }, res);
  assert.equal(result.statusCode, 405);
});

test('returns 503 when webhook env is not configured', async () => {
  const { req, res } = setup({ env: {} });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 503);
  assert.equal(fetchCalls.length, 0);
});

test('rejects payloads with no contact field (400)', async () => {
  const { req, res } = setup({ body: { page: '/x' } });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 400);
});

test('honeypot filled: accepts silently without calling the webhook', async () => {
  const { req, res } = setup({ body: { name: 'Bot', website: 'http://spam.example' }, forwardedFor: '198.51.100.1' });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 202);
  assert.deepEqual(result.body, { success: true, accepted: false });
  assert.equal(fetchCalls.length, 0);
});

test('rejects invalid phone formats (400)', async () => {
  for (const phone of ['abc', 'call me maybe at home', '<script>alert(1)</script>1234567890123456789012345']) {
    const { req, res } = setup({ body: { name: 'A', phone }, forwardedFor: '198.51.100.2' });
    const result = await handler(req, res);
    assert.equal(result.statusCode, 400, `phone="${phone}" should be rejected`);
  }
});

test('rejects invalid email formats (400)', async () => {
  const { req, res } = setup({ body: { email: 'not-an-email' }, forwardedFor: '198.51.100.3' });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 400);
});

test('accepts a valid lead and forwards it with the webhook key', async () => {
  const { req, res } = setup({ body: { name: 'Andi', phone: '+62 851-9064-5078', message: 'Villa di Senggigi', utm_source: 'google' }, forwardedFor: '198.51.100.4' });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, { success: true });
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].url, 'https://agent.example.com/webhook/lead');
  assert.equal(fetchCalls[0].init.headers['X-Webhook-Key'], 'test-key');
  const sent = JSON.parse(fetchCalls[0].init.body);
  assert.equal(sent.name, 'Andi');
  assert.equal(sent.utm_source, 'google');
  assert.equal(sent.source, 'website');
});

test('upstream failure is masked as 502 without leaking the upstream body', async () => {
  fetchResponse = { ok: false, status: 500, json: async () => ({ internal: 'secret' }) };
  try {
    const { req, res } = setup({ body: { name: 'Budi' }, forwardedFor: '198.51.100.5' });
    const result = await handler(req, res);
    assert.equal(result.statusCode, 502);
    assert.ok(!JSON.stringify(result.body).includes('secret'));
  } finally {
    fetchResponse = { ok: true, status: 200, json: async () => ({}) };
  }
});

test('rate-limits a single IP after 5 requests per minute', async () => {
  const ip = '192.0.2.99';
  let last;
  for (let i = 0; i < 6; i++) {
    const { req, res } = setup({ body: { name: 'Spam' + i }, forwardedFor: ip });
    last = await handler(req, res);
  }
  assert.equal(last.statusCode, 429);
});
