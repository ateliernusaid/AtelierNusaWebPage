// Same-origin relay for browser conversion mirrors.
// The site CSP only allows 'self' plus analytics vendors, so proxying here keeps
// the tracker host out of the browser and removes any CORS requirement.

const TARGET = process.env.AGENT_CONVERSION_URL
  || 'https://bonus.ateliernusa.web.id/webhook/conversion';
const TIMEOUT_MS = 5_000;
const MAX_BODY = 8 * 1024;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) hits.clear();
  return recent.length > RATE_LIMIT_MAX;
}

function readBody(req) {
  const body = req.body;
  if (body && typeof body === 'object') return JSON.stringify(body);
  if (typeof body === 'string') return body;
  return '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const payload = readBody(req);
  if (!payload || payload.length > MAX_BODY) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // Telemetry must never break the page, so failures are accepted quietly.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    await fetch(TARGET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      signal: controller.signal,
    });
  } catch {
    // Mirroring is best-effort.
  } finally {
    clearTimeout(timer);
  }
  return res.status(204).end();
}
