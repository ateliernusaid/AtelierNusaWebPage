#!/usr/bin/env node
/**
 * add-schema-faq.mjs
 * Adds FAQPage JSON-LD schemas + visible FAQ sections to 6 key pages.
 * Also enhances existing Service schema on jasa-arsitek-lombok.html
 * and adds LocalBusiness schema to konsultasi-gratis.html.
 *
 * Idempotent: checks for existing FAQPage before injecting; replaces if found.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const DIR = new URL('./', import.meta.url).pathname
  .replace(/^\/([A-Z]:)/, '$1')  // fix /C: → C: on Windows
  .replace(/\/$/, '');

// ── helpers ──────────────────────────────────────────────────────────────────

function readFile(name) {
  return readFileSync(`${DIR}/${name}`, 'utf-8');
}

function writeFile(name, content) {
  writeFileSync(`${DIR}/${name}`, content, 'utf-8');
}

/** Build a single FAQ item HTML (visible section). */
function faqItemHtml(q, a) {
  return `
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" style="border-bottom:1px solid var(--border-lt);padding:20px 0">
      <h3 itemprop="name" style="font-size:1.05rem;color:var(--text);margin:0 0 8px;font-weight:600">${q}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text" style="color:var(--text2);margin:0;line-height:1.7;font-size:0.95rem">${a}</p>
      </div>
    </div>`;
}

/** Build the full visible FAQ section HTML. */
function visibleFaqSection(qaPairs) {
  const items = qaPairs.map(([q, a]) => faqItemHtml(q, a)).join('\n');
  return `
<section style="padding:48px clamp(1.5rem,8vw,6rem);background:var(--bg);border-top:1px solid var(--border-lt)">
  <div style="max-width:720px;margin:0 auto">
    <h2 style="font-family:Georgia,serif;color:var(--text);font-size:1.4rem;margin:0 0 24px;text-align:center">Pertanyaan Umum</h2>
    <div itemscope itemtype="https://schema.org/FAQPage">
      ${items}
    </div>
  </div>
</section>`;
}

/** Build FAQPage JSON-LD script tag. */
function faqPageJsonLd(qaPairs) {
  const mainEntity = qaPairs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  }));
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
  return `\n<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>\n`;
}

/**
 * Remove existing FAQPage JSON-LD blocks from HTML head.
 * Returns [cleanedHtml, wasRemoved].
 */
function removeExistingFaqPage(html) {
  // Match <script type="application/ld+json"> ... {"@type":"FAQPage" ... } ... </script>
  const re = /<script\s+type="application\/ld\+json">\s*[\[{].*?"@type"\s*:\s*"FAQPage".*?<\/script>/gs;
  if (!re.test(html)) return [html, false];
  return [html.replace(re, ''), true];
}

/**
 * Inject JSON-LD before </head>.
 * Handles variations: </head>, </head>\n, </head>\n<body>, </head><body>
 */
function injectBeforeHead(html, jsonLd) {
  // Insert right before </head> (case-insensitive, any trailing whitespace/newlines)
  return html.replace(/<\/head>/i, `${jsonLd}\n</head>`);
}

/**
 * Inject visible section before the "Jelajahi Juga" block.
 * The Jelajahi Juga section always starts with <section ...>\n    <div ...>\n      <h2 ...>Jelajahi Juga</h2>
 * We insert before the <section> that contains "Jelajahi Juga".
 */
function injectBeforeJelajahi(html, sectionHtml) {
  // Find the <section> tag immediately before "Jelajahi Juga"
  const marker = '<section style="padding:48px clamp(1.5rem,8vw,6rem);background:var(--bg2);border-top:1px solid var(--border-lt)">';
  const idx = html.indexOf(marker);
  if (idx === -1) {
    // Fallback: try finding via the h2 text
    const altMarker = 'Jelajahi Juga</h2>';
    const altIdx = html.indexOf(altMarker);
    if (altIdx === -1) {
      console.error('  ⚠ Could not find "Jelajahi Juga" section — skipping visible FAQ.');
      return html;
    }
    // Find the nearest <section before this
    const sectionStart = html.lastIndexOf('<section', altIdx);
    if (sectionStart === -1) {
      console.error('  ⚠ Could not find enclosing <section> for "Jelajahi Juga" — skipping visible FAQ.');
      return html;
    }
    return html.slice(0, sectionStart) + sectionHtml + '\n\n' + html.slice(sectionStart);
  }
  return html.slice(0, idx) + sectionHtml + '\n\n' + html.slice(idx);
}

// ── page configurations ──────────────────────────────────────────────────────

const pages = [
  // 1. arsitek-mataram.html — replace existing FAQPage with new 4 Q&As
  {
    file: 'arsitek-mataram.html',
    label: 'Arsitek Mataram',
    schemaJsonLd: null, // computed below after removing existing
    extraSchemas: [],
    faqPairs: [
      ['Berapa biaya arsitek di Mataram?', 'Biaya arsitek di Mataram berkisar Rp 150.000–350.000/m2 tergantung kompleksitas. Hubungi Atelier Nusa untuk estimasi gratis.'],
      ['Apakah Atelier Nusa melayani desain villa?', 'Ya, kami spesialis desain villa tropis di Mataram, Senggigi, dan seluruh Lombok dengan paket design-build lengkap.'],
      ['Bagaimana cara konsultasi dengan arsitek di Mataram?', 'Hubungi kami via WhatsApp di 0851-9064-5078 atau kunjungi halaman konsultasi gratis di ateliernusa.id.'],
      ['Di mana lokasi studio Atelier Nusa?', 'Studio kami di Jl. Jend. Sudirman No.34, Rembiga, Mataram, NTB 83124.'],
    ],
    enhanceService: false,
    addLocalBusiness: false,
  },
  // 2. konsultasi-gratis.html — add LocalBusiness + FAQPage
  {
    file: 'konsultasi-gratis.html',
    label: 'Konsultasi Gratis',
    faqPairs: [
      ['Apakah konsultasi benar-benar gratis?', 'Ya, konsultasi awal dengan tim Atelier Nusa tidak dikenakan biaya. Kami membantu memahami kebutuhan proyek Anda sebelum memutuskan langkah selanjutnya.'],
      ['Bagaimana cara memulai konsultasi?', 'Kirim pesan WhatsApp ke 0851-9064-5078 dengan deskripsi singkat proyek Anda. Tim kami akan merespons dalam jam kerja.'],
      ['Apakah konsultasi bisa dilakukan online?', 'Ya, konsultasi bisa dilakukan via WhatsApp atau video call. Kunjungan ke lokasi tersedia untuk proyek di area Mataram dan sekitarnya.'],
    ],
    addLocalBusiness: true,
    localBusinessJson: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Atelier Nusa',
      description: 'Free architectural consultation in Lombok',
      url: 'https://www.ateliernusa.id/konsultasi-gratis',
      telephone: '+6285190645078',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mataram',
        addressRegion: 'NTB',
        addressCountry: 'ID',
      },
      areaServed: ['Lombok', 'Mataram', 'Senggigi'],
      priceRange: 'Free',
    },
  },
  // 3. arsitek-kuta-mandalika.html — add FAQPage
  {
    file: 'arsitek-kuta-mandalika.html',
    label: 'Arsitek Kuta Mandalika',
    faqPairs: [
      ['Mengapa memilih arsitek untuk proyek di Kuta Mandalika?', 'Kuta Mandalika memiliki kondisi iklim dan regulasi khusus. Arsitek profesional memastikan desain sesuai konteks lokal, hemat energi, dan memenuhi standar konstruksi.'],
      ['Apakah Atelier Nusa melayani proyek di Kuta Mandalika?', 'Ya, kami melayani desain arsitektur dan konstruksi di seluruh area Lombok termasuk Kuta Mandalika dan kawasan pariwisata.'],
      ['Berapa perkiraan biaya desain rumah di Kuta Mandalika?', 'Biaya bervariasi tergantung skala proyek. Hubungi kami untuk estimasi gratis yang disesuaikan dengan kebutuhan Anda.'],
    ],
  },
  // 4. portofolio-villa-lombok.html — add FAQPage
  {
    file: 'portofolio-villa-lombok.html',
    label: 'Portofolio Villa Lombok',
    faqPairs: [
      ['Apa saja jenis villa yang pernah didesain Atelier Nusa?', 'Kami merancang villa tropis modern, luxury residential, private residence, dan konsep coastal living di berbagai lokasi di Lombok.'],
      ['Di mana lokasi proyek villa Atelier Nusa?', 'Proyek kami tersebar di Mataram, Senggigi, Lombok Barat, dan area lainnya di NTB.'],
    ],
  },
  // 5. desain-interior-lombok.html — add FAQPage
  {
    file: 'desain-interior-lombok.html',
    label: 'Desain Interior Lombok',
    faqPairs: [
      ['Apakah Atelier Nusa melayani desain interior?', 'Ya, kami menawarkan layanan desain interior yang terintegrasi dengan desain arsitektur untuk rumah, villa, dan ruang komersial di Lombok.'],
      ['Bagaimana proses desain interior dengan Atelier Nusa?', 'Proses dimulai dari konsultasi kebutuhan, konsep desain, pemilihan material, hingga pengawasan pelaksanaan.'],
    ],
  },
  // 6. jasa-arsitek-lombok.html — enhance Service schema + add FAQPage
  {
    file: 'jasa-arsitek-lombok.html',
    label: 'Jasa Arsitek Lombok',
    enhanceService: true,
    faqPairs: [
      ['Berapa biaya jasa arsitek di Lombok?', 'Biaya berkisar Rp 150.000–350.000/m2 tergantung jenis proyek dan kompleksitas desain. Konsultasi awal gratis.'],
      ['Apakah Atelier Nusa melayani design-build?', 'Ya, kami menawarkan layanan design-build lengkap dari desain konsep hingga konstruksi.'],
      ['Berapa lama proses desain?', 'Untuk rumah tinggal 4–8 minggu. Villa atau proyek komersial 8–16 minggu tergantung skala.'],
      ['Di mana lokasi Atelier Nusa?', 'Studio kami di Jl. Jend. Sudirman No.34, Rembiga, Mataram, NTB 83124.'],
    ],
  },
];

// ── process each page ────────────────────────────────────────────────────────

let totalModified = 0;

for (const cfg of pages) {
  console.log(`\n📄 Processing ${cfg.label} (${cfg.file})...`);
  let html = readFile(cfg.file);

  // Step 1: Remove existing FAQPage JSON-LD if present
  const [cleaned, removed] = removeExistingFaqPage(html);
  if (removed) {
    console.log('  ↻ Removed existing FAQPage schema');
    html = cleaned;
  }

  // Step 2: Enhance Service schema (jasa-arsitek-lombok only)
  if (cfg.enhanceService) {
    const serviceRe = /(<script\s+type="application\/ld\+json">\s*\{[\s\S]*?"@type"\s*:\s*"Service"[\s\S]*?)(<\/script>)/;
    const m = html.match(serviceRe);
    if (m) {
      const serviceObj = JSON.parse(m[1].replace(/<script[^>]*>/, ''));
      if (!serviceObj.offers) {
        serviceObj.offers = {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR',
          description: 'Free initial consultation',
        };
        const newScript = `\n<script type="application/ld+json">\n${JSON.stringify(serviceObj, null, 2)}\n</script>\n`;
        html = html.replace(serviceRe, newScript);
        console.log('  ✓ Enhanced Service schema with offers field');
      } else {
        console.log('  ⊘ Service schema already has offers — skipping');
      }
    } else {
      console.error('  ⚠ Could not find Service schema — skipping enhancement');
    }
  }

  // Step 3: Add LocalBusiness schema (konsultasi-gratis only)
  if (cfg.addLocalBusiness && cfg.localBusinessJson) {
    // Check if LocalBusiness already exists
    if (/"@type"\s*:\s*"LocalBusiness"/.test(html)) {
      console.log('  ⊘ LocalBusiness schema already exists — skipping');
    } else {
      const lbJson = `\n<script type="application/ld+json">\n${JSON.stringify(cfg.localBusinessJson, null, 2)}\n</script>\n`;
      html = injectBeforeHead(html, lbJson);
      console.log('  ✓ Added LocalBusiness JSON-LD schema');
    }
  }

  // Step 4: Add FAQPage JSON-LD before </head>
  const faqJsonLd = faqPageJsonLd(cfg.faqPairs);
  html = injectBeforeHead(html, faqJsonLd);
  console.log(`  ✓ Added FAQPage JSON-LD (${cfg.faqPairs.length} Q&As)`);

  // Step 5: Add visible FAQ section before "Jelajahi Juga"
  const visibleSection = visibleFaqSection(cfg.faqPairs);
  html = injectBeforeJelajahi(html, visibleSection);
  console.log('  ✓ Added visible FAQ section');

  // Step 6: Verify structure
  const hasHeadClose = /<\/head>/i.test(html);
  const hasBodyClose = /<\/body>/i.test(html);
  const hasFaqSchema = /"@type"\s*:\s*"FAQPage"/.test(html);
  const hasJelajahi = /Jelajahi Juga/.test(html);

  if (!hasHeadClose) {
    console.error('  ❌ ERROR: Missing </head> tag!');
    process.exit(1);
  }
  if (!hasBodyClose) {
    console.error('  ❌ ERROR: Missing </body> tag!');
    process.exit(1);
  }
  if (!hasFaqSchema) {
    console.error('  ❌ ERROR: FAQPage schema not found in output!');
    process.exit(1);
  }
  if (!hasJelajahi) {
    console.error('  ❌ ERROR: "Jelajahi Juga" section missing!');
    process.exit(1);
  }

  // Check FAQ section appears before Jelajahi Juga
  const faqVisibleIdx = html.indexOf('Pertanyaan Umum');
  const jelajahiIdx = html.indexOf('Jelajahi Juga');
  if (faqVisibleIdx > jelajahiIdx) {
    console.error('  ❌ ERROR: Visible FAQ section is AFTER Jelajahi Juga!');
    process.exit(1);
  }

  // Write
  writeFile(cfg.file, html);
  totalModified++;
  console.log(`  ✅ Done — ${cfg.file} modified`);
}

console.log(`\n🎉 All done. ${totalModified} pages modified.`);
