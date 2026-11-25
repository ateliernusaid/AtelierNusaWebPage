const MAX_FIELD_LENGTH = 500;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AGENT_WEBHOOK_TIMEOUT_MS = 8_000;

// The relay is served on the same origin that hosts the agent, and nginx injects
// the webhook key server-side. Using it as the default keeps lead delivery
// working even when a stale AGENT_WEBHOOK_URL is still set by the host.
const DEFAULT_RELAY_URL = 'https://bonus.ateliernusa.web.id/relay/lead';

// Best-effort rate limit: serverless instances are ephemeral so this slows
// floods from a single warm instance rather than hard-capping globally.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) hits.clear();
  return recent.length > RATE_LIMIT_MAX;
}

function trimField(value) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_FIELD_LENGTH) : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const agentUrl = process.env.AGENT_WEBHOOK_URL || 'https://bonus.ateliernusa.web.id';
  const agentKey = process.env.AGENT_WEBHOOK_KEY || '';
  if (!agentUrl) {
    return res.status(503).json({ error: 'Lead service is not configured' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const ctaId = trimField(body.cta_id || body.ctaId);
  const payload = {
    source: 'website',
    build_id: trimField(body.build_id),
    name: trimField(body.name),
    email: trimField(body.email),
    phone: trimField(body.phone),
    message: trimField(body.message),
    budget: trimField(body.budget),
    location: trimField(body.location),
    stage: trimField(body.stage),
    projectType: trimField(body.projectType),
    page: trimField(body.page),
    landing_page: trimField(body.landing_page),
    referrer: trimField(body.referrer),
    lead_source: trimField(body.lead_source),
    ...(ctaId ? { cta_id: ctaId } : {}),
    form_id: trimField(body.form_id),
    form_name: trimField(body.form_name),
    session_id: trimField(body.session_id || body.sessionId),
    utm_source: trimField(body.utm_source),
    utm_medium: trimField(body.utm_medium),
    utm_campaign: trimField(body.utm_campaign),
    utm_term: trimField(body.utm_term),
    utm_content: trimField(body.utm_content),
    gclid: trimField(body.gclid),
    fbclid: trimField(body.fbclid),
    website: trimField(body.website),
  };
  if (payload.website) {
    return res.status(202).json({ success: true, accepted: false });
  }

  if (!payload.name && !payload.phone && !payload.email && !payload.message) {
    return res.status(400).json({ error: 'At least one contact field is required' });
  }

  if (payload.phone && !PHONE_RE.test(payload.phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  if (payload.email && !EMAIL_RE.test(payload.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const headers = { 'Content-Type': 'application/json' };
  if (agentKey) headers['X-Webhook-Key'] = agentKey;
  // Try the configured host first (when present), then the first-party relay
  // whose nginx injects the webhook key. A stale configured host or a rejected
  // key must not take lead delivery down.
  const candidates = [];
  if (process.env.AGENT_WEBHOOK_URL) {
    candidates.push(new URL('/webhook/lead', process.env.AGENT_WEBHOOK_URL).href);
  }
  candidates.push(DEFAULT_RELAY_URL);
  // Each attempt gets a fresh budget so a black-holed host cannot starve the fallback.
  const attemptTimeoutMs = Math.max(1_500, Math.floor(AGENT_WEBHOOK_TIMEOUT_MS / candidates.length));
  const send = async (target) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), attemptTimeoutMs);
    try {
      return await fetch(target, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    let response = null;
    let result = null;
    for (const target of candidates) {
      try {
        const attempt = await send(target);
        if (!attempt.ok) {
          console.error('[Atelier Nusa] Agent webhook rejected lead:', attempt.status);
          continue;
        }
        let parsed = null;
        try {
          parsed = await attempt.json();
        } catch {
          // A successful lead handoff must include a valid JSON acknowledgment.
        }
        if (parsed?.success !== true || parsed.accepted === false) {
          console.error('[Atelier Nusa] Agent webhook acknowledgement invalid:', attempt.status);
          continue;
        }
        response = attempt;
        result = parsed;
        break;
      } catch (error) {
        console.error('[Atelier Nusa] Agent webhook unavailable:', error.message);
      }
    }
    if (!response || !result) {
      return res.status(502).json({ error: 'Lead service unavailable' });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Atelier Nusa] Agent webhook unavailable:', error.message);
    return res.status(502).json({ error: 'Lead service unavailable' });
  }
}
