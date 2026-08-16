// One-off: verify every images/posters reference in source files exists in public/.
import { readFileSync, readdirSync } from 'fs';
import { resolve, join, relative } from 'path';

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    e.isDirectory() ? walk(f, out) : out.push(f);
  }
  return out;
}

const ROOT = process.cwd();
const sources = [
  ...readdirSync(ROOT).filter(f => f.endsWith('.html')).map(f => resolve(f)),
  ...walk(join(ROOT, 'blog')).filter(f => f.endsWith('.html')),
  ...walk(join(ROOT, 'src')).filter(f => /\.(js|css|html)$/.test(f)),
];
const corpus = sources.map(f => readFileSync(f, 'utf8')).join('\n');

const refs = new Set();
for (const m of corpus.matchAll(/(?:images|posters)\/[A-Za-z0-9._~:\/?#@!$&'()*+,;=%-]+/g)) {
  for (const part of m[0].split(/[\s,]+/)) {
    let p = part.split('?')[0].replace(/^.*ateliernusa\.id\//, '').replace(/^\//, '');
    if (p.includes('images/') || p.includes('posters/')) {
      try { p = decodeURIComponent(p); } catch { /* keep raw */ }
      refs.add(p);
    }
  }
}

const publicFiles = new Set(
  [...walk(join(ROOT, 'public', 'images')), ...walk(join(ROOT, 'public', 'posters'))]
    .map(f => relative(join(ROOT, 'public'), f).replace(/\\/g, '/')),
);

let missing = 0;
for (const r of refs) {
  if (!publicFiles.has(r)) { console.log('MISSING:', r); missing++; }
}
console.log(missing === 0
  ? `REVERSE CHECK OK: all ${refs.size} referenced paths exist`
  : `MISSING: ${missing} of ${refs.size}`);
process.exit(missing ? 1 : 0);
