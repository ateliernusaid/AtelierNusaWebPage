import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { routeManifest } from '../src/seo/route-manifest.js';

const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const html = read('projects/unram-residence.html');

test('UNRAM preserves supplied project scope, status and client design attribution', () => {
  assert.match(html, /<title>UNRAM Residence \| Residential Construction in Lombok — Atelier Nusa<\/title>/);
  assert.match(html, /<h1[^>]*>UNRAM Residence \| Phase 01 Handover<\/h1>/);
  assert.match(html, /Architectural drawings were provided by the client/);
  assert.match(html, /not the original architectural design/);
  assert.match(html, /Ground Floor Completed; Upper Floor Planned/);
  assert.match(html, /Cost Planning, BOQ Recalculation, Demolition &amp; Construction/);
  for (const title of ['Project Overview', 'The Challenge', 'Construction &amp; Project Delivery', 'Phase 01 — Completed']) assert.ok(html.includes(`<h2>${title}</h2>`));
  assert.doesNotMatch(html, /Architecture &amp; Construction by Atelier Nusa/);
});

test('approved UNRAM page is indexable and has no draft notices', () => {
  assert.match(html, /name="robots" content="index, follow"/);
  assert.doesNotMatch(html, /noindex|Draft — not for publication|provisional|pending approval/i);
  assert.match(html, /property="og:image"/);
  assert.ok(routeManifest.some(r => r.file === 'projects/unram-residence.html' && r.path === '/projects/unram-residence'));
  assert.ok(read('vite.config.js').includes('projects/unram-residence.html'));
  assert.ok(read('public/sitemap.xml').includes('/projects/unram-residence'));
  assert.ok(!read('projects.html').includes('/projects/unram-residence'));
});

test('UNRAM gallery has 14 photographs with responsive local assets', () => {
  assert.equal((html.match(/class="unram-photo"/g) || []).length, 15);
  const images = html.match(/<img\b[^>]+>/g);
  assert.equal(images.length, 15);
  for (const image of images) {
    assert.match(image, /width="\d+" height="\d+"/);
    assert.match(image, /alt="UNRAM Residence project documentation \d+"/);
    assert.match(image, /srcset=/);
    const src = image.match(/src="([^"]+)"/)[1];
    const file = new URL(`public${src}`, root);
    assert.ok(existsSync(file));
    assert.ok(statSync(file).size < 1.5 * 1024 * 1024);
    for (const variant of image.match(/srcset="([^"]+)"/)[1].split(', ')) assert.ok(existsSync(new URL(`public${variant.split(' ')[0]}`, root)));
  }
  assert.equal((html.match(/loading="eager"/g) || []).length, 1);
  assert.equal((html.match(/loading="lazy"/g) || []).length, 14);
});

test('UNRAM photographs use inline zoom controls without filenames in captions', () => {
  assert.equal((html.match(/<button type="button" class="unram-photo"/g) || []).length, 15);
  assert.doesNotMatch(html, /target="_blank"/);
  for (const caption of html.match(/<figcaption>.*?<\/figcaption>/g)) assert.doesNotMatch(caption, /\.jpg|\.webp|Atelier_Nusa|ATELIER_NUSA/);
  assert.ok(html.includes('/src/components/unram-gallery.js'));
  const script = read('src/components/unram-gallery.js');
  assert.match(script, /dialog\.showModal\(\)/);
  assert.match(script, /preventScroll: true/);
});

test('homepage Selected Works replaces only the tropical villa card with UNRAM', () => {
  const showcase = read('index.html').match(/<section[^>]*id="showcase"[\s\S]*?<\/section>/)[0];
  assert.match(showcase, /href="\/projects\/unram-residence"/);
  assert.match(showcase, /Phase 01 Completed/);
  assert.doesNotMatch(showcase, /tropical-villa-senggigi|Tropical villa/);
  assert.equal((showcase.match(/class="project-card project-card--labeled"/g) || []).length, 4);
  assert.match(read('src/components/language.js'), /'Tahap 01 selesai'/);
});
