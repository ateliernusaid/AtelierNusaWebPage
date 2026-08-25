// Patch round 4: remaining variants of gtag config line (no-space / paged variants)
import fs from 'fs';

const d = 'D:/SCRIPT/YapAutoBot-NTE-main/AtelierNusaWeb';
const jobs = [
  // no-space inline variant
  ['arsitek-villa-mewah-lombok.html', "gtag('config','AW-8060600341');</script>", "gtag('config','AW-8060600341');gtag('config','AW-17872287905');</script>"],
  ['desain-interior-lombok.html', "gtag('config','AW-8060600341');</script>", "gtag('config','AW-8060600341');gtag('config','AW-17872287905');</script>"],
  ['privacy-policy.html', "gtag('config','AW-8060600341');</script>", "gtag('config','AW-8060600341');gtag('config','AW-17872287905');</script>"],
  ['renovasi-rumah-mataram-lombok.html', "gtag('config','AW-8060600341');</script>", "gtag('config','AW-8060600341');gtag('config','AW-17872287905');</script>"],
  ['terms-of-service.html', "gtag('config','AW-8060600341');</script>", "gtag('config','AW-8060600341');gtag('config','AW-17872287905');</script>"],
  ['tren-desain-interior-lombok.html', "gtag('config','AW-8060600341');</script>", "gtag('config','AW-8060600341');gtag('config','AW-17872287905');</script>"],
  // 4-space block variant (biaya-* etc.)
  ['biaya-arsitek-lombok.html', "    gtag('config', 'AW-8060600341');\n", "    gtag('config', 'AW-8060600341');\n    gtag('config', 'AW-17872287905');\n"],
  ['biaya-bangun-rumah-lombok.html', "    gtag('config', 'AW-8060600341');\n", "    gtag('config', 'AW-8060600341');\n    gtag('config', 'AW-17872287905');\n"],
  ['tmp-page.html', "    gtag('config', 'AW-8060600341');\n", "    gtag('config', 'AW-8060600341');\n    gtag('config', 'AW-17872287905');\n"],
];

for (const [f, old, neu] of jobs) {
  const p = d + '/' + f;
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes('AW-17872287905')) { console.log('already:', f); continue; }
  if (t.includes(old)) {
    t = t.replace(old, neu);
    fs.writeFileSync(p, t);
    console.log('patched:', f);
  } else {
    console.log('NO anchor:', f);
  }
}
console.log('done');