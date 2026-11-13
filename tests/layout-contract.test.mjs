import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

test('standalone pages ship their recovered layout CSS without replacing content', () => {
  for (const slug of ['arsitek-mataram', 'arsitek-kuta-mandalika', 'portofolio-villa-lombok']) {
    const cssPath = `src/styles/legacy/${slug}.css`;
    assert.ok(existsSync(fileURLToPath(new URL(cssPath, root))));
    assert.ok(read(`${slug}.html`).includes(`href="/${cssPath}"`));
    assert.match(read(cssPath), /display:\s*grid/);
  }
});

test('consultation remains visible when animations are unavailable or reduced', () => {
  const html = read('konsultasi-gratis.html');
  for (const selector of ['val-prop', 'form-card']) {
    const rule = html.match(new RegExp(`\\.${selector}\\s*\\{([^}]+)\\}`))[1];
    assert.match(rule, /opacity:\s*1/);
    assert.match(rule, /animation:\s*consultationEnter/);
    assert.doesNotMatch(rule, /var\(--transition-spring/);
  }
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  const reveal = read('jasa-arsitek-senggigi.html').match(/\.reveal\s*\{([^}]+)\}/)[1];
  assert.match(reveal, /opacity:\s*1/);
});

test('service grid has real tablet and mobile grid rules instead of inert flex widths', () => {
  const css = read('interior-v2.css');
  assert.match(css, /\.svc-scroll\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.svc-scroll\{grid-template-columns:minmax\(0,1fr\)/);
  assert.doesNotMatch(css, /\.svc-card\{flex:/);
  assert.match(css, /\.svc-card\{min-width:0/);
});

test('core and legacy cards can shrink within narrow viewports', () => {
  assert.match(read('src/styles/home.css'), /padding:\s*var\(--space-lg\) clamp\(24px, 5vw, 80px\)/);
  assert.match(read('src/styles/projects.css'), /@media \(max-width: 480px\)/);
  for (const slug of ['architect-lombok', 'lombok-villa-architect', 'architect-mataram', 'villa-designer-lombok', 'architect-kuta-mandalika', 'arsitek-villa-senggigi', 'arsitek-selong-belanak', 'arsitek-gili-trawangan', 'arsitek-rumah-2-lantai-mataram', 'arsitek-hotel-lombok', 'arsitek-bangun-rumah-lombok']) {
    const html = read(`${slug}.html`);
    assert.doesNotMatch(html, /minmax\(300px, 1fr\)/);
    assert.match(html, /minmax\(min\(300px, 100%\), 1fr\)/);
  }
  assert.match(read('src/styles/contact-cards.css'), /overflow-wrap:\s*anywhere/);
  for (const slug of ['services', 'arsitek-kuta-mandalika', 'jasa-arsitek-senggigi']) {
    assert.ok(read(`${slug}.html`).includes('class="contact-cards"'));
  }
});

test('wide article tables stay inside the mobile document and remain scrollable', () => {
  const html = read('blog/biaya-bangun-rumah-lombok-2026.html');
  assert.match(html, /class="article-table-wrap"[^>]*overflow|class="article-table-wrap"/);
  assert.match(html, /\.article-table-wrap\s*\{[^}]*overflow-x:\s*auto/);
  assert.match(html, /\.article-table\s*\{[^}]*min-width:\s*620px/);
});

test('project pages expose truthful status and decision snapshots', () => {
  const expected = {
    'luxury-residential-mataram': ['Design completed', 'Mataram, Lombok', 'Warm timber, privacy, natural light'],
    'private-residence-lombok-barat': ['Under construction', 'Lombok Barat', 'Retain the existing structure where possible'],
    'industrial-residence-mataram': ['Concept study', 'Mataram, Lombok', 'Raw materiality with tropical shading'],
    'tropical-villa-senggigi': ['Concept study', 'Senggigi, Lombok', 'Deep eaves, terraces, indoor-outdoor living'],
  };
  for (const [slug, phrases] of Object.entries(expected)) {
    const html = read(`${slug}.html`);
    assert.match(html, /class="project-proof"/);
    assert.match(html, /class="project-proof__links"/);
    for (const phrase of phrases) assert.ok(html.includes(phrase), `${slug} should include ${phrase}`);
  }
  assert.match(read('src/styles/projects.css'), /\.project-proof__facts\s*\{[\s\S]*grid-template-columns/);
});

test('legacy contact handlers mirror without duplicating analytics events', () => {
  const tracker = read('src/analytics/leadTracker.js');
  assert.match(tracker, /hasInlineContactTracker/);
  assert.match(tracker, /mirrorOnly:\s*hasInlineContactTracker\(link\)/);
});

test('conversion mirror host is allowed by the deployed CSP', () => {
  const vercel = read('vercel.json');
  assert.match(vercel, /connect-src[^\"]*https:\/\/tracker\.ateliernusa\.id/);
});
test('shared mobile hamburger keeps a touch-sized hit target', () => {
  const css = read('src/styles/components.css');
  const hamburger = css.match(/\.navbar__hamburger\s*\{([^}]+)\}/)[1];
  assert.match(hamburger, /width:\s*44px/);
  assert.match(hamburger, /min-width:\s*44px/);
  assert.match(hamburger, /flex-shrink:\s*0/);
  assert.match(hamburger, /min-height:\s*44px/);
});
