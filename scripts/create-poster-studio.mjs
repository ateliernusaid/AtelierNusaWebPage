import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const imagePath = path.join(root, 'public', 'images', 'Rumah Anastasia.png');
const logoPath = path.join(root, 'public', 'images', 'ATN Logo Transparan.png');
const outputDir = path.join(root, 'public', 'posters');
const svgPath = path.join(outputDir, 'atelier-nusa-studio-feed.svg');
const pngPath = path.join(outputDir, 'atelier-nusa-studio-feed.png');
const width = 1080;
const height = 1080;

const photo = await sharp(imagePath)
  .resize(510, 625, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 92 })
  .toBuffer();
const logo = await sharp(logoPath)
  .extract({ left: 500, top: 80, width: 570, height: 720 })
  .png()
  .toBuffer();

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="heroClip"><rect x="502" y="178" width="508" height="625"/></clipPath>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#172320" flood-opacity="0.16"/>
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="#f3f0e9"/>
  <path d="M72 48H1008M72 852H1008" stroke="#172320" stroke-opacity="0.18"/>
  <path d="M430 48V852" stroke="#172320" stroke-opacity="0.12"/>

  <!-- Header -->
  <rect x="72" y="68" width="164" height="132" fill="#f8f5ef" stroke="#9e6546" stroke-width="1.5"/>
  <image href="data:image/png;base64,${logo.toString('base64')}" x="82" y="73" width="144" height="122" preserveAspectRatio="xMidYMid meet"/>
  <text x="276" y="95" fill="#172320" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="2.6">ARCHITECTURE / CONSTRUCTION</text>
  <text x="276" y="124" fill="#68746e" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="2.6">TROPICAL STUDIO IN LOMBOK</text>
  <text x="1008" y="97" text-anchor="end" fill="#9e6546" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="2">STUDIO 01</text>
  <text x="1008" y="124" text-anchor="end" fill="#68746e" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="1.8">MATARAM / NTB</text>

  <!-- Main copy -->
  <text x="72" y="286" fill="#9e6546" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="2.8">DESIGN + BUILD SERVICES</text>
  <text x="72" y="382" fill="#172320" font-family="Georgia, Times New Roman, serif" font-size="76" font-weight="700" letter-spacing="-3">Designing</text>
  <text x="72" y="454" fill="#172320" font-family="Georgia, Times New Roman, serif" font-size="76" font-weight="700" letter-spacing="-3">tropical</text>
  <text x="72" y="526" fill="#9e6546" font-family="Georgia, Times New Roman, serif" font-size="76" font-weight="700" letter-spacing="-3">spaces.</text>
  <rect x="74" y="558" width="74" height="4" fill="#9e6546"/>
  <text x="72" y="608" fill="#172320" font-family="Arial, Helvetica, sans-serif" font-size="18">Homes, villas, interiors, and hospitality</text>
  <text x="72" y="638" fill="#172320" font-family="Arial, Helvetica, sans-serif" font-size="18">spaces shaped by place, climate, and craft.</text>

  <!-- Services -->
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="72" y="700" fill="#9e6546" font-size="12" font-weight="700" letter-spacing="2">SERVICES</text>
    <text x="72" y="731" fill="#172320" font-size="16">01  Architectural Design</text>
    <text x="72" y="761" fill="#172320" font-size="16">02  Interior Design</text>
    <text x="260" y="731" fill="#172320" font-size="16">03  Design &amp; Build</text>
    <text x="260" y="761" fill="#172320" font-size="16">04  Renovation</text>
  </g>

  <!-- Portfolio image -->
  <rect x="502" y="178" width="508" height="625" fill="#172320" filter="url(#shadow)"/>
  <image href="data:image/jpeg;base64,${photo.toString('base64')}" x="502" y="178" width="508" height="625" preserveAspectRatio="xMidYMid slice" clip-path="url(#heroClip)"/>
  <rect x="502" y="178" width="508" height="625" fill="none" stroke="#f8f5ef" stroke-opacity="0.72" stroke-width="1"/>
  <text x="528" y="770" fill="#f8f5ef" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="2.2">SELECTED RESIDENTIAL WORK</text>
  <text x="1008" y="770" text-anchor="end" fill="#f8f5ef" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="1.6">MATARAM</text>

  <!-- Footer CTA -->
  <rect x="72" y="900" width="936" height="108" fill="#172320"/>
  <text x="104" y="938" fill="#d7b18f" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="2.2">START WITH A CONVERSATION</text>
  <text x="104" y="977" fill="#f8f5ef" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700">Konsultasi awal gratis</text>
  <text x="554" y="946" fill="#f8f5ef" font-family="Arial, Helvetica, sans-serif" font-size="16">+62 851 9064 5078</text>
  <text x="554" y="977" fill="#d7b18f" font-family="Arial, Helvetica, sans-serif" font-size="15">ateliernusa.id  /  Mataram, Lombok</text>
  <text x="978" y="960" text-anchor="end" fill="#d7b18f" font-family="Georgia, Times New Roman, serif" font-size="38">→</text>
</svg>`;

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(svgPath, svg, 'utf8');
await sharp(Buffer.from(svg)).png().toFile(pngPath);
console.log(`Created ${svgPath}`);
console.log(`Created ${pngPath}`);
