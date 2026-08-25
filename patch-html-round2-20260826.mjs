// Patch round 2: 15 HTML files that use a different gtag layout, plus same-conversion anchors.
// Anchor per each skipped html: contains the line 'gtag('config', 'AW-8060600341');' — but the 
// exact block differs (some pages inline the whatsapp tracking inside the SAME script).
// Strategy: for each skipped HTML, insert conversion config right after the AW-8060600341 config line,
// and — where a trackWAConversion() function exists — add the Ads conversion fire inside it.
import fs from 'fs';

const d = 'D:/SCRIPT/YapAutoBot-NTE-main/AtelierNusaWeb';
const skipped = ['arsitek-kuta-mandalika.html','arsitek-villa-mewah-lombok.html','biaya-arsitek-lombok.html','biaya-bangun-rumah-lombok.html','desain-interior-lombok.html','index.html','jasa-arsitek-senggigi.html','portofolio-villa-lombok.html','privacy-policy.html','renovasi-rumah-mataram-lombok.html','services.html','terms-of-service.html','tmp-page.html','tren-desain-interior-lombok.html','tropical-villa-senggigi.html'];

const configLine = "      gtag('config', 'AW-8060600341');";
const configNew = configLine + "\n      // Google Ads conversion tag — WhatsApp lead (installed 2026-08-26)\n      gtag('config', 'AW-17872287905');";

// trackWAConversion blocks: add conversion inside the if
const trackOld = "function trackWAConversion() {\n        if (typeof gtag === 'function') {\n          gtag('event', 'whatsapp_click', {\n            event_category: 'lead',\n            event_label: window.location.pathname\n          });\n        }\n      }";
const trackNew = "function trackWAConversion() {\n        if (typeof gtag === 'function') {\n          gtag('event', 'whatsapp_click', {\n            event_category: 'lead',\n            event_label: window.location.pathname\n          });\n          // Google Ads conversion — WhatsApp Lead\n          gtag('event', 'conversion', {\n            send_to: 'AW-17872287905/HE4GCImO_uYcEKHxlcpC'\n          });\n        }\n      }";

for (const f of skipped) {
  const p = d + '/' + f;
  let t = fs.readFileSync(p, 'utf8');
  let changed = 0;
  if (t.includes('AW-17872287905')) { console.log('already:', f); continue; }

  if (t.includes(configLine) && !t.includes('AW-17872287905')) {
    t = t.replace(configLine, configNew);
    changed++;
  } else {
    console.log('config line missing in:', f);
  }

  if (t.includes(trackOld)) {
    t = t.replace(trackOld, trackNew);
    changed++;
  }

  if (changed) { fs.writeFileSync(p, t); console.log('patched:', f, '(changes:', changed + ')'); }
  else console.log('NO CHANGE:', f);
}
console.log('done');