import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/conversion.js';

let calls = [];
let response = { ok: true, status: 200 };

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    ended: false,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { this.ended = true; return this; },
    setHeader(k, v) { this.headers[k] = v; },
  };
}

function setup({ method = 'POST', body = {}, forwardedFor = '203.0.113.70' } = {}) {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return response;
  };
  return { req: { method, headers: { 'x-forwarded-for': forwardedFor }, body }, res: mockRes() };
}

test('rejects non-POST with 405', async () => {
  const { req, res } = setup({ method: 'GET' });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 405);
  assert.equal(calls.length, 0);
});

test('forwards the payload to the first-party relay', async () => {
  const body = { event: 'page_view', event_id: 'abc' };
  const { req, res } = setup({ body });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 204);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://bonus.ateliernusa.web.id/webhook/conversion');
  assert.deepEqual(JSON.parse(calls[0].init.body), body);
});

test('rejects an empty payload', async () => {
  const { req, res } = setup({ body: {} });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 204);
  assert.equal(calls.length, 1);
});

test('rejects an oversized payload without calling upstream', async () => {
  const { req, res } = setup({ body: { event: 'x'.repeat(9 * 1024) } });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 400);
  assert.equal(calls.length, 0);
});

test('upstream failures stay invisible to the page', async () => {
  response = { ok: false, status: 500 };
  try {
    const { req, res } = setup({ body: { event: 'cta_click' } });
    const result = await handler(req, res);
    assert.equal(result.statusCode, 204);
  } finally {
    response = { ok: true, status: 200 };
  }
});

test('network errors stay invisible to the page', async () => {
  globalThis.fetch = async () => { throw new Error('offline'); };
  const { req, res } = setup({ body: { event: 'page_view' } });
  const result = await handler(req, res);
  assert.equal(result.statusCode, 204);
});

test('rate-limits a single IP after the burst allowance', async () => {
  const ip = '192.0.2.44';
  let last;
  for (let i = 0; i < 62; i++) {
    const { req, res } = setup({ body: { event: 'page_view', i }, forwardedFor: ip });
    last = await handler(req, res);
  }
  assert.equal(last.statusCode, 429);
});
