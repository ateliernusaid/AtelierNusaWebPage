// Patch round 5: privacy-policy + terms-of-service have NO AW config yet (GA4 only).
// Add Ads config + load AW-17872287905 tag for these two.
import fs from 'fs';

const d = 'D:/SCRIPT/YapAutoBot-NTE-main/AtelierNusaWeb';
const anchor = "      gtag('config', 'G-69F6MHRBK5');\r\n";
const newBlock = "      gtag('config', 'G-69F6MHRBK5');\r\n      gtag('config', 'AW-17872287905');\r\n";
// also add the AW loader script tag after the G- one:
const loaderAnchor = "    <script async src=\"https://www.googletagmanager.com/gtag/js?id=G-69F6MHRBK5\"></script>\r\n";
const loaderNew = "    <script async src=\"https://www.googletagmanager.com/gtag/js?id=G-69F6MHRBK5\"></script>\r\n    <script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-17872287905\"></script>\r\n";

for (const f of ['privacy-policy.html','terms-of-service.html']) {
  const p = d + '/' + f;
  let t = fs.readFileSync(p, 'utf8');
  if (t.includes('AW-17872287905')) { console.log('already:', f); continue; }
  let c = 0;
  if (t.includes(loaderAnchor)) { t = t.replace(loaderAnchor, loaderNew); c++; }
  if (t.includes(anchor)) { t = t.replace(anchor, newBlock); c++; }
  if (c) { fs.writeFileSync(p, t); console.log('patched:', f, c, 'changes'); }
  else console.log('NO anchor:', f);
}
console.log('done');