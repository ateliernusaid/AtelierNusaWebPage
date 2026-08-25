// Patch round 3: remaining 12 HTML pages use one-line inline gtag format.
// Add AW-17872287905 config + WA conversion function inside same script.
import fs from 'fs';

const d = 'D:/SCRIPT/YapAutoBot-NTE-main/AtelierNusaWeb';
const target = ['arsitek-kuta-mandalika.html','arsitek-villa-mewah-lombok.html','biaya-arsitek-lombok.html','biaya-bangun-rumah-lombok.html','desain-interior-lombok.html','jasa-arsitek-senggigi.html','privacy-policy.html','renovasi-rumah-mataram-lombok.html','terms-of-service.html','tmp-page.html','tren-desain-interior-lombok.html'];

const oldOneline = "gtag('config', 'G-69F6MHRBK5'); gtag('config', 'AW-8060600341');";
const newOneline = "gtag('config', 'G-69F6MHRBK5'); gtag('config', 'AW-8060600341'); gtag('config', 'AW-17872287905');";

for (const f of target) {
  const p = d + '/' + f;
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes('AW-17872287905')) { console.log('already:', f); continue; }
  if (t.includes(oldOneline)) {
    t = t.replace(oldOneline, newOneline);
    fs.writeFileSync(p, t);
    console.log('patched (oneline):', f);
  } else {
    console.log('NO oneline anchor in:', f);
  }
}
console.log('done');