/**
 * Optimize heavy referenced images in public/.
 *
 * Rules:
 * - Referenced anywhere in og:image/twitter:image/JSON-LD context: social
 *   scrapers (WhatsApp, Facebook, X) render jpg/png most reliably, so the
 *   format stays raster — jpg is recompressed (1200px cap), png is re-encoded
 *   as jpg with references rewritten.
 * - IMG/CSS-only references: convert to a .webp twin and rewrite references,
 *   but only when the webp is actually smaller; otherwise leave as-is.
 *
 * Usage: node scripts/assets/optimize-heavy-images.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, statSync, existsSync, readdirSync, rmSync } from 'fs';
import sharp from 'sharp';
import { resolve, dirname, basename, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DRY_RUN = process.argv.includes('--dry-run');
const THRESHOLD_KB = 150;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    entry.isDirectory() ? walk(full, out) : out.push(full);
  }
  return out;
}

const sourceFiles = [
  ...readdirSync(ROOT, { withFileTypes: true }).filter(e => e.isFile() && e.name.endsWith('.html')).map(e => join(ROOT, e.name)),
  ...walk(join(ROOT, 'blog')).filter(f => f.endsWith('.html')),
  ...walk(join(ROOT, 'src')).filter(f => /\.(js|css|html)$/.test(f)),
];

function readSources() {
  return sourceFiles.map(f => ({ path: f, text: readFileSync(f, 'utf8') }));
}

function rewriteReferences(from, to) {
  let touched = 0;
  for (const src of readSources()) {
    if (!src.text.includes(from) && !src.text.includes(encodeURI(from))) continue;
    const text = src.text.split(encodeURI(from)).join(encodeURI(to)).split(from).join(to);
    writeFileSync(src.path, text, 'utf8');
    touched++;
  }
  return touched;
}

// Windows AV/indexing can briefly lock freshly read files — retry writes.
function writeWithRetry(file, data, attempts = 3) {
  for (let i = 0; ; i++) {
    try { writeFileSync(file, data); return; }
    catch (error) {
      if (i >= attempts - 1) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 400);
    }
  }
}

const sources = readSources();
const corpus = sources.map(s => s.text).join('\n');

const allImages = [...walk(join(ROOT, 'public', 'images')), ...walk(join(ROOT, 'public', 'posters'))]
  .filter(f => /\.(png|jpe?g)$/i.test(f));

for (const file of allImages) {
  const base = basename(file);
  const kb = Math.round(statSync(file).size / 1024);
  if (kb < THRESHOLD_KB) continue;
  if (!corpus.includes(base) && !corpus.includes(encodeURI(base))) continue;

  const lines = corpus.split('\n').filter(l => l.includes(base) || l.includes(encodeURI(base)));
  const usedInSocial = lines.some(l => /og:image|twitter:image|ld\+json/i.test(l));
  const isPng = /\.png$/i.test(file);

  if (usedInSocial) {
    const jpgBuf = await sharp(readFileSync(file)).resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    if (jpgBuf.length >= statSync(file).size) {
      console.log(`skip (already optimal): ${base} ${kb}KB`);
      continue;
    }
    if (isPng) {
      const jpgBase = base.replace(/\.png$/i, '.jpg');
      if (!DRY_RUN) {
        writeWithRetry(join(dirname(file), jpgBase), jpgBuf);
        const touched = rewriteReferences(base, jpgBase);
        rmSync(file);
        console.log(`og png -> jpg: ${base} ${kb}KB -> ${jpgBase} ${Math.round(jpgBuf.length / 1024)}KB (${touched} files)`);
      } else {
        console.log(`og png -> jpg: ${base} ${kb}KB -> ${jpgBase} ${Math.round(jpgBuf.length / 1024)}KB (dry)`);
      }
    } else {
      if (!DRY_RUN) writeWithRetry(file, jpgBuf);
      console.log(`og recompress: ${base} ${kb}KB -> ${Math.round(jpgBuf.length / 1024)}KB`);
    }
    continue;
  }

  const webpBase = base.replace(/\.(png|jpe?g)$/i, '.webp');
  const webpBuf = await sharp(readFileSync(file)).webp({ quality: 82 }).toBuffer();
  if (webpBuf.length >= statSync(file).size) {
    console.log(`skip (webp larger): ${base} ${kb}KB -> ${Math.round(webpBuf.length / 1024)}KB`);
    continue;
  }
  console.log(`convert: ${base} ${kb}KB -> ${webpBase} ${Math.round(webpBuf.length / 1024)}KB`);
  if (DRY_RUN) continue;
  writeWithRetry(join(dirname(file), webpBase), webpBuf);
  const touched = rewriteReferences(base, webpBase);
  rmSync(file);
  console.log(`  rewrote references in ${touched} source files`);
}
console.log(DRY_RUN ? '(dry run — nothing written)' : 'done');
