// GA4 + Google Ads conversion tag install — Atelier Nusa web
// User approved: 'pasang saja langsung'
// 1) All 30 HTML pages: add AW-17872287905 conversion tag next to existing gtag config
// 2) src/main.js: universal tracking include for all wa.me links via GA4 friction event + Ads conversion
// 3) src/components/whatsapp.js: floating button Ads conversion too
// 4) src/analytics/events.js: trackEvent adds counter missing? no — add conversion helper
// 5) src/analytics/forms.js: proper Ads conversion event on lead submission (was GA4-only)
import fs from 'fs';

const d = 'D:/SCRIPT/YapAutoBot-NTE-main/AtelierNusaWeb';
let changedHtml = 0, skippedHtml = 0;

// ============ PART 1: HTML — add conversion config right after AW-8060600341 config line
const htmlAnchor = "    gtag('config', 'AW-8060600341');\r\n";
const htmlReplacement = "    gtag('config', 'AW-8060600341');\r\n" +
  "    // Google Ads conversion tag — WhatsApp lead (installed 2026-08-26)\r\n" +
  "    gtag('config', 'AW-17872287905');\r\n";

const htmlFiles = fs.readdirSync(d).filter(f => f.endsWith('.html'));
for (const f of htmlFiles) {
  const p = d + '/' + f;
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes('AW-17872287905')) { skippedHtml++; continue; }
  if (!t.includes(htmlAnchor)) { console.log('SKIP anchor missing:', f); skippedHtml++; continue; }
  t = t.replace(htmlAnchor, htmlReplacement);
  fs.writeFileSync(p, t);
  changedHtml++;
}
console.log('HTML: changed', changedHtml, 'skipped', skippedHtml, 'of', htmlFiles.length);

// ============ PART 2: src/main.js — universal WA tracking converts+GA4
let main = fs.readFileSync(d + '/src/main.js', 'utf8');
const mainOld = "    // Track the intent separately from a qualified form submission.\n" +
  "    if (typeof gtag === 'function') {\n" +
  "        gtag('event', 'whatsapp_click', {\n" +
  "            event_category: 'lead',\n" +
  "            event_label: window.location.pathname\n" +
  "        });\n" +
  "    }\n";
const mainNew = "    // Track the intent separately from a qualified form submission.\n" +
  "    if (typeof gtag === 'function') {\n" +
  "        gtag('event', 'whatsapp_click', {\n" +
  "            event_category: 'lead',\n" +
  "            event_label: window.location.pathname\n" +
  "        });\n" +
  "        // Google Ads conversion — WhatsApp Lead (AW-17872287905/HE4GCImO_uYcEKHxlcpC)\n" +
  "        gtag('event', 'conversion', {\n" +
  "            send_to: 'AW-17872287905/HE4GCImO_uYcEKHxlcpC'\n" +
  "        });\n" +
  "    }\n";
if (!main.includes(mainOld)) { console.log('SKIP main.js anchor missing'); }
else { main = main.replace(mainOld, mainNew); fs.writeFileSync(d + '/src/main.js', main); console.log('main.js WA conversion added'); }

// ============ PART 3: src/components/whatsapp.js — floating button conversion
let wa = fs.readFileSync(d + '/src/components/whatsapp.js', 'utf8');
const waOld = "    waLink.addEventListener('click', () => {\n" +
  "        if (typeof window.gtag === 'function') {\n" +
  "            window.gtag('event', 'whatsapp_click', { event_category: 'lead', event_label: 'floating-button' });\n" +
  "        }\n";
const waNew = "    waLink.addEventListener('click', () => {\n" +
  "        if (typeof window.gtag === 'function') {\n" +
  "            window.gtag('event', 'whatsapp_click', { event_category: 'lead', event_label: 'floating-button' });\n" +
  "            // Google Ads conversion — WhatsApp Lead\n" +
  "            window.gtag('event', 'conversion', {\n" +
  "                send_to: 'AW-17872287905/HE4GCImO_uYcEKHxlcpC'\n" +
  "            });\n" +
  "        }\n";
if (!wa.includes(waOld)) { console.log('SKIP whatsapp.js anchor missing'); }
else { wa = wa.replace(waOld, waNew); fs.writeFileSync(d + '/src/components/whatsapp.js', wa); console.log('whatsapp.js conversion added'); }

// ============ PART 4: analytics/forms.js — real Ads conversion on lead submit
let forms = fs.readFileSync(d + '/src/analytics/forms.js', 'utf8');
const formsOld = "  // Count the Ads conversion only after the browser accepts the lead handoff.\n" +
  "  trackEvent('ads_conversion_Contact_1', {\n" +
  "    value: 1.0,\n" +
  "    currency: 'IDR',\n" +
  "    form_id: form.id || source,\n" +
  "    page_path: window.location.pathname,\n" +
  "  });\n";
const formsNew = "  // Count the Ads conversion only after the browser accepts the lead handoff.\n" +
  "  trackEvent('ads_conversion_Contact_1', {\n" +
  "    value: 1.0,\n" +
  "    currency: 'IDR',\n" +
  "    form_id: form.id || source,\n" +
  "    page_path: window.location.pathname,\n" +
  "  });\n" +
  "  // Google Ads conversion — WhatsApp/Contact lead (AW-17872287905)\n" +
  "  if (typeof window.gtag === 'function') {\n" +
  "    window.gtag('event', 'conversion', {\n" +
  "      send_to: 'AW-17872287905/HE4GCImO_uYcEKHxlcpC'\n" +
  "    });\n" +
  "  }\n";
if (!forms.includes(formsOld)) { console.log('SKIP forms.js anchor missing'); }
else { forms = forms.replace(formsOld, formsNew); fs.writeFileSync(d + '/src/analytics/forms.js', forms); console.log('forms.js conversion added'); }

// ============ PART 5: analytics/events.js — no change needed (trackEvent generic)
console.log('DONE');