import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const imagePath = path.join(root, 'public', 'images', 'Rumah Anastasia.png');
const logoPath = path.join(root, 'public', 'images', 'ATN Logo Transparan.png');
const outputDir = path.join(root, 'public', 'posters');
const svgPath = path.join(outputDir, 'atelier-nusa-unique-feed.svg');
const pngPath = path.join(outputDir, 'atelier-nusa-unique-feed.png');
const width = 1080;
const height = 1080;

const photo = await sharp(imagePath)
  .resize(500, 620, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 90 })
  .toBuffer();
const logo = await sharp(logoPath)
  .extract({ left: 500, top: 80, width: 570, height: 720 })
  .png()
  .toBuffer();

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="photoClip"><rect x="548" y="108" width="462" height="600" rx="2"/></clipPath>
    <clipPath id="photoClipSmall"><rect x="72" y="778" width="260" height="176" rx="2"/></clipPath>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="13" flood-color="#1f2927" flood-opacity="0.18"/>
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="#eee7db"/>
  <path d="M0 706H1080M0 738H1080M420 0V1080M452 0V1080" stroke="#1e2b29" stroke-opacity="0.09" stroke-width="1"/>

  <g opacity="0.18" fill="none" stroke="#a76642" stroke-width="2">
    <path d="M-40 866 C130 742 224 798 350 872 C493 956 605 903 738 810 C844 736 984 755 1120 835"/>
    <path d="M-40 891 C130 767 224 823 350 897 C493 981 605 928 738 835 C844 761 984 780 1120 860"/>
    <path d="M-40 916 C130 792 224 848 350 922 C493 1006 605 953 738 860 C844 786 984 805 1120 885"/>
  </g>

  <rect x="548" y="108" width="462" height="600" fill="#1e2b29" filter="url(#shadow)"/>
  <image href="data:image/jpeg;base64,${photo.toString('base64')}" x="548" y="108" width="462" height="600" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>
  <rect x="548" y="108" width="462" height="600" fill="#1e2b29" fill-opacity="0.11"/>
  <path d="M548 650H1010" stroke="#f4eadb" stroke-width="1" opacity="0.65"/>
  <text x="572" y="680" fill="#f4eadb" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="2.5">PROJECT STUDY / MATARAM</text>

  <rect x="70" y="54" width="194" height="194" fill="#f7f1e8" stroke="#a76642" stroke-width="1.5"/>
  <image href="data:image/png;base64,${logo.toString('base64')}" x="88" y="61" width="158" height="180" preserveAspectRatio="xMidYMid meet"/>

  <text x="310" y="77" fill="#a76642" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="3">FIELD NOTE  /  01</text>
  <text x="310" y="114" fill="#1e2b29" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="2">ARCHITECTURE FROM LOMBOK</text>
  <path d="M310 134H478" stroke="#a76642" stroke-width="3"/>

  <text x="68" y="392" fill="#1e2b29" font-family="Georgia, Times New Roman, serif" font-size="82" font-weight="700" letter-spacing="-4">RUANG</text>
  <text x="68" y="471" fill="#a76642" font-family="Georgia, Times New Roman, serif" font-size="72" font-weight="700" letter-spacing="-3">YANG</text>
  <text x="68" y="548" fill="#1e2b29" font-family="Georgia, Times New Roman, serif" font-size="72" font-weight="700" letter-spacing="-3">BERAKAR.</text>
  <text x="72" y="594" fill="#1e2b29" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="1.2">Desain tropis yang merespons tempat, iklim,</text>
  <text x="72" y="624" fill="#1e2b29" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="1.2">dan cara hidup Anda.</text>

  <g transform="translate(72 684)" font-family="Arial, Helvetica, sans-serif">
    <text x="0" y="0" fill="#a76642" font-size="12" font-weight="700" letter-spacing="2">01  DESIGN</text>
    <text x="0" y="25" fill="#1e2b29" font-size="15">Arsitektur • Interior</text>
    <text x="180" y="0" fill="#a76642" font-size="12" font-weight="700" letter-spacing="2">02  BUILD</text>
    <text x="180" y="25" fill="#1e2b29" font-size="15">Design &amp; Build</text>
    <text x="340" y="0" fill="#a76642" font-size="12" font-weight="700" letter-spacing="2">03  RENEW</text>
    <text x="340" y="25" fill="#1e2b29" font-size="15">Renovasi</text>
  </g>

  <rect x="72" y="778" width="260" height="176" fill="#1e2b29" filter="url(#shadow)"/>
  <image href="data:image/jpeg;base64,${photo.toString('base64')}" x="72" y="778" width="260" height="176" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClipSmall)"/>
  <text x="350" y="810" fill="#a76642" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="2">THE NUSA APPROACH</text>
  <text x="350" y="849" fill="#1e2b29" font-family="Georgia, Times New Roman, serif" font-size="29" font-weight="700">Site before style.</text>
  <text x="350" y="884" fill="#1e2b29" font-family="Arial, Helvetica, sans-serif" font-size="16">Berbasis Mataram.</text>
  <text x="350" y="910" fill="#1e2b29" font-family="Arial, Helvetica, sans-serif" font-size="16">Bekerja di seluruh Lombok.</text>
  <text x="350" y="944" fill="#a76642" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">KONSULTASI AWAL GRATIS  →</text>

  <rect x="72" y="1000" width="938" height="1" fill="#a76642"/>
  <text x="72" y="1035" fill="#1e2b29" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="1.2">+62 851 9064 5078</text>
  <text x="535" y="1035" fill="#1e2b29" font-family="Arial, Helvetica, sans-serif" font-size="15">ateliernusa.id</text>
  <text x="1010" y="1035" text-anchor="end" fill="#a76642" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="1">MATARAM / NTB</text>
</svg>`;

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(svgPath, svg, 'utf8');
await sharp(Buffer.from(svg)).png().toFile(pngPath);
console.log(`Created ${svgPath}`);
console.log(`Created ${pngPath}`);
