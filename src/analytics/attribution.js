const STORAGE_KEY = 'atelier_nusa_attribution';
const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

function readStored() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveStored(value) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Tracking should never block a lead form when storage is unavailable.
  }
}

function readTouch() {
  const params = new URLSearchParams(window.location.search);
  const touch = {};

  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key);
    if (value) touch[key] = value.slice(0, 200);
  }

  if (!touch.utm_source && touch.gclid) touch.utm_source = 'google';
  if (!touch.utm_medium && touch.gclid) touch.utm_medium = 'cpc';
  if (!touch.utm_source && touch.fbclid) touch.utm_source = 'facebook';
  if (!touch.utm_medium && touch.fbclid) touch.utm_medium = 'social';

  try {
    touch.referrer_host = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    touch.referrer_host = '';
  }
  touch.has_campaign = CAMPAIGN_KEYS.some((key) => touch[key]);
  return touch;
}

export function getAttribution() {
  if (typeof window === 'undefined') return {};

  const stored = readStored();
  const current = readTouch();
  const landingPage = stored.landing_page || window.location.pathname;

  if (!stored.first_touch) {
    stored.first_touch = current;
  }

  if (current.has_campaign || current.referrer_host) {
    stored.last_touch = current;
  } else if (!stored.last_touch) {
    stored.last_touch = { lead_source: 'direct' };
  }

  stored.landing_page = landingPage;
  saveStored(stored);

  const first = stored.first_touch || {};
  const last = stored.last_touch || {};
  const leadSource = last.utm_source
    ? `${last.utm_source}/${last.utm_medium || 'unknown'}`
    : last.gclid
      ? 'google/cpc'
      : last.referrer_host
        ? 'referral'
        : 'direct';

  return {
    lead_source: leadSource,
    landing_page: landingPage,
    referrer_host: last.referrer_host || '',
    utm_source: last.utm_source || '',
    utm_medium: last.utm_medium || '',
    utm_campaign: last.utm_campaign || '',
    utm_term: last.utm_term || '',
    utm_content: last.utm_content || '',
    gclid: last.gclid || '',
    first_utm_source: first.utm_source || '',
    first_utm_medium: first.utm_medium || '',
    first_utm_campaign: first.utm_campaign || '',
  };
}

if (typeof window !== 'undefined') {
  window.atelierNusaAttribution = getAttribution;
}
