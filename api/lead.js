const MAX_FIELD_LENGTH = 500;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  const agentUrl = process.env.AGENT_WEBHOOK_URL;
  const agentKey = process.env.AGENT_WEBHOOK_KEY;
  if (!agentUrl || !agentKey) {
    return res.status(503).json({ error: 'Lead service is not configured' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const payload = {
    source: 'website',
    name: trimField(body.name),
    email: trimField(body.email),
    phone: trimField(body.phone),
    message: trimField(body.message),
    budget: trimField(body.budget),
    location: trimField(body.location),
    projectType: trimField(body.projectType),
    page: trimField(body.page),
    referrer: trimField(body.referrer),
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

  try {
    const target = new URL('/webhook/lead', agentUrl).href;
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Key': agentKey,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error('[Atelier Nusa] Agent webhook rejected lead:', response.status);
      return res.status(502).json({ error: 'Lead service unavailable' });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Atelier Nusa] Agent webhook unavailable:', error.message);
    return res.status(502).json({ error: 'Lead service unavailable' });
  }
}
