// One-off: apply curated secondary SEO fixes from the 2026-08 audit.
import { readFileSync, writeFileSync } from 'fs';

const TITLE_FIXES = {
  'blog/biaya-bangun-rumah-lombok-2026.html': ['Cara Membaca RAB dan Estimasi Biaya Bangun Rumah di Lombok 2026 | Atelier Nusa', 'Cara Membaca RAB &amp; Estimasi Biaya Bangun Rumah Lombok 2026'],
  'desain-interior-lombok.html': ['Jasa Desain Interior Lombok untuk Villa, Rumah, dan Komersial | Atelier Nusa', 'Jasa Desain Interior Lombok untuk Villa, Rumah &amp; Komersial'],
  'desain-rumah-tropis-ntb.html': ['Desain Rumah Tropis Modern: Panduan Lengkap untuk Iklim NTB | Atelier Nusa', 'Desain Rumah Tropis Modern: Panduan Lengkap Iklim NTB'],
  'services.html': ['Architecture, Interior &amp; Design-Build Services in Lombok | Atelier Nusa', 'Architecture, Interior &amp; Design-Build in Lombok | Atelier Nusa'],
  'jasa-arsitek-lombok.html': ['Jasa Arsitek Lombok | Atelier Nusa - Desain Rumah, Villa & Design-Build', 'Jasa Arsitek Lombok | Atelier Nusa — Rumah, Villa &amp; Design-Build'],
  'index.html': ['Atelier Nusa | Tropical Architecture &amp; Construction Studio in Lombok', 'Atelier Nusa | Tropical Architecture Studio in Lombok'],
  'arsitek-kuta-mandalika.html': ['Arsitek Kuta Mandalika | Spesialis Resort & Komersial | Atelier Nusa', 'Arsitek Kuta Mandalika | Resort &amp; Komersial | Atelier Nusa'],
  'konsultasi-gratis.html': ['Konsultasi Gratis Arsitektur & Konstruksi Villa | Atelier Nusa Lombok', 'Konsultasi Gratis Arsitektur &amp; Villa | Atelier Nusa Lombok'],
  'estimasi-biaya-bangun-rumah-2-lantai-lombok.html': ['Estimasi Biaya Bangun Rumah 2 Lantai di Lombok 2026 | Atelier Nusa', 'Estimasi Biaya Bangun Rumah 2 Lantai Lombok 2026 | Atelier Nusa'],
  'portofolio-villa-lombok.html': ['Portofolio Villa Lombok | Atelier Nusa — Desain & Konstruksi Villa', 'Portofolio Villa Lombok | Atelier Nusa — Desain Villa'],
};

const OG_SPACE_FILES = ['biaya-arsitek-lombok.html', 'panduan-memilih-arsitek-lombok.html', 'luxury-residential-mataram.html', 'private-residence-lombok-barat.html'];

const ARTICLE_SCHEMA_PAGES = ['desain-rumah-tropis-ntb.html', 'tips-memilih-arsitek-mataram.html', 'estimasi-biaya-bangun-rumah-2-lantai-lombok.html', 'biaya-bangun-rumah-lombok.html', 'desain-interior-lombok.html'];

function apply(page, label, transform) {
  let html = readFileSync(page, 'utf8');
  const next = transform(html);
  if (next === html) { console.log(`= ${page} (${label}: nothing changed)`); return; }
  writeFileSync(page, next, 'utf8');
  console.log(`~ ${page} (${label})`);
}

for (const [page, [from, to]] of Object.entries(TITLE_FIXES)) {
  apply(page, 'title', (html) => html.replace(`<title>${from}</title>`, `<title>${to}</title>`));
}

apply('tropical-villa-senggigi.html', 'lang id', (html) => html.replace(/<html lang="en">/i, '<html lang="id">'));

apply('konsultasi-gratis.html', 'description', (html) => html.replace(
  'Mulai wujudkan proyek villa mewah atau rumah impian Anda di Lombok. Dapatkan sesi konsultasi konsep desain pertama gratis langsung dengan Principal Architect Atelier Nusa.',
  'Wujudkan proyek villa atau rumah impian Anda di Lombok. Dapatkan sesi konsultasi konsep desain pertama gratis bersama Principal Architect Atelier Nusa.'
));

for (const page of OG_SPACE_FILES) {
  apply(page, 'og:image encode', (html) => html.split('\n').map((line) => {
    if (!/og:image|twitter:image/i.test(line)) return line;
    return line.replace(/(images\/[A-Za-z0-9_%-]+) ([A-Za-z0-9_ .-]+\.(?:webp|jpe?g|png))/gi, '$1%20$2');
  }).join('\n'));
}

for (const page of ['arsitek-kuta-mandalika.html', 'jasa-arsitek-senggigi.html']) {
  apply(page, '@id unify', (html) => html.replace(
    /"@id":\s*"https:\/\/www\.ateliernusa\.id"(?=[,}])/g,
    '"@id": "https://www.ateliernusa.id/#business"'
  ));
}

for (const page of ARTICLE_SCHEMA_PAGES) {
  apply(page, 'article schema', (html) => {
    if (html.includes('application/ld+json')) return html;
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || page;
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || '';
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] || `https://www.ateliernusa.id/${page.replace('.html', '')}`;
    const image = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] || 'https://www.ateliernusa.id/images/og-image.jpg';
    const schema = `  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${title.replace(/"/g, '\\"')}","description":"${description.replace(/"/g, '\\"')}","image":"${image}","mainEntityOfPage":"${canonical}","author":{"@type":"Organization","name":"Atelier Nusa","url":"https://www.ateliernusa.id"},"publisher":{"@type":"Organization","name":"Atelier Nusa","logo":{"@type":"ImageObject","url":"https://www.ateliernusa.id/images/ATN Logo Transparan.webp"}}}
  </script>
`;
    return html.replace(/<\/head>/i, `${schema}</head>`);
  });
}
console.log('done');
