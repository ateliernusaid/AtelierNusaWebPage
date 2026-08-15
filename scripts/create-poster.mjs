import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const imagePath = path.join(root, 'public', 'images', 'Rumah Anastasia.png');
const logoPath = path.join(root, 'public', 'images', 'ATN Logo Transparan.png');
const outputDir = path.join(root, 'public', 'posters');
const svgPath = path.join(outputDir, 'atelier-nusa-instagram-feed.svg');
const pngPath = path.join(outputDir, 'atelier-nusa-instagram-feed.png');
const width = 1080;
const height = 1080;

const hero = await sharp(imagePath)
  .resize(width, height, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 90 })
  .toBuffer();
const heroData = hero.toString('base64');
// Crop the transparent logo's unused canvas so it stays legible at poster scale.
const logo = await sharp(logoPath)
  .extract({ left: 500, top: 80, width: 570, height: 720 })
  .png()
  .toBuffer();
const logoData = logo.toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#111318" stop-opacity="0.94"/>
      <stop offset="0.52" stop-color="#111318" stop-opacity="0.68"/>
      <stop offset="1" stop-color="#111318" stop-opacity="0.04"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#111318" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#111318" stop-opacity="0.94"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <image href="data:image/jpeg;base64,${heroData}" x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1080" height="1080" fill="url(#shade)"/>
  <rect width="1080" height="1080" fill="url(#bottom)"/>

  <circle cx="968" cy="122" r="78" fill="none" stroke="#d4a15c" stroke-width="2" opacity="0.8"/>
  <circle cx="968" cy="122" r="58" fill="none" stroke="#f3d5a0" stroke-width="1" opacity="0.5"/>
  <path d="M915 122h106M968 69v106" stroke="#d4a15c" stroke-width="1" opacity="0.45"/>

  <rect x="62" y="32" width="190" height="188" rx="16" fill="#f4eee5" fill-opacity="0.96" filter="url(#softShadow)"/>
  <image href="data:image/png;base64,${logoData}" x="78" y="40" width="158" height="172" preserveAspectRatio="xMidYMid meet"/>
  <text x="280" y="74" fill="#f3d5a0" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="3.5" opacity="0.82">ARCHITECTURE &amp; CONSTRUCTION STUDIO</text>
  <rect x="280" y="98" width="80" height="3" rx="1.5" fill="#d4a15c"/>

  <text x="76" y="252" fill="#f4eee5" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" letter-spacing="4">DESAIN &amp;</text>
  <text x="72" y="342" fill="#f4eee5" font-family="Georgia, Times New Roman, serif" font-size="90" font-weight="700" letter-spacing="-3">BANGUN</text>
  <text x="78" y="392" fill="#f3d5a0" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="3">HUNIAN TROPIS DI LOMBOK</text>

  <text x="78" y="472" fill="#f4eee5" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">
    <tspan x="78" dy="0">Ruang yang berakar pada tempat, iklim,</tspan>
    <tspan x="78" dy="34">dan kehidupan Anda.</tspan>
  </text>

  <g transform="translate(78 585)">
    <rect width="246" height="44" rx="22" fill="#d4a15c"/>
    <text x="123" y="29" text-anchor="middle" fill="#17191c" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="1.8">KONSULTASI AWAL GRATIS</text>
  </g>

  <g transform="translate(78 684)" fill="#f4eee5" font-family="Arial, Helvetica, sans-serif">
    <text x="0" y="0" font-size="16" font-weight="700" letter-spacing="1.5">ARSITEKTUR  •  INTERIOR</text>
    <text x="0" y="35" font-size="16" font-weight="700" letter-spacing="1.5">DESIGN &amp; BUILD  •  RENOVASI</text>
    <text x="0" y="83" font-size="15" opacity="0.82">Berbasis Mataram, melayani seluruh Lombok.</text>
  </g>

  <g transform="translate(76 915)" filter="url(#softShadow)">
    <rect width="928" height="104" rx="14" fill="#17191c" fill-opacity="0.88" stroke="#d4a15c" stroke-opacity="0.65"/>
    <text x="28" y="39" fill="#f3d5a0" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="2">MULAI WUJUDKAN RUANG IMPIANMU</text>
    <text x="28" y="75" fill="#f4eee5" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">+62 851 9064 5078</text>
    <text x="584" y="42" fill="#f4eee5" font-family="Arial, Helvetica, sans-serif" font-size="17" text-anchor="middle">ateliernusa.id</text>
    <text x="584" y="73" fill="#d4a15c" font-family="Arial, Helvetica, sans-serif" font-size="13" text-anchor="middle">Mataram • Lombok • NTB</text>
  </g>
</svg>`;

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(svgPath, svg, 'utf8');
await sharp(Buffer.from(svg)).png().toFile(pngPath);
console.log(`Created ${svgPath}`);
console.log(`Created ${pngPath}`);
