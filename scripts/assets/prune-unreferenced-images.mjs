/**
 * Move public/ images that no source file references into media/unreferenced/
 * so they stop shipping in every deploy while staying recoverable in git.
 *
 * Reference sources scanned: root .html files, blog .html files, src JS/CSS/HTML,
 * public/sitemap.xml, vercel.json, vite.config.js.
 * A file counts as referenced when its basename (with extension) appears in
 * any scanned source text.
 *
 * Usage: node scripts/assets/prune-unreferenced-images.mjs [--dry-run]
 */
import { readFileSync, readdirSync, statSync, mkdirSync, renameSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DRY_RUN = process.argv.includes('--dry-run');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const sourceFiles = [
  ...readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.html'))
    .map(e => join(ROOT, e.name)),
  ...walk(join(ROOT, 'blog')).filter(f => f.endsWith('.html')),
  ...walk(join(ROOT, 'src')).filter(f => /\.(js|css|html)$/.test(f)),
  join(ROOT, 'public', 'sitemap.xml'),
  join(ROOT, 'vercel.json'),
  join(ROOT, 'vite.config.js'),
].filter(existsSync);

const corpus = sourceFiles.map(f => readFileSync(f, 'utf8')).join('\n');

const targets = [
  ...walk(join(ROOT, 'public', 'images')),
  ...walk(join(ROOT, 'public', 'posters')),
].filter(f => !f.endsWith('.gitkeep'));

const unreferenced = [];
let kept = 0;
let freed = 0;
for (const file of targets) {
  const base = file.split(/[\\/]/).pop();
  // og:image and JSON-LD references sometimes percent-encode spaces.
  if (corpus.includes(base) || corpus.includes(encodeURI(base))) {
    kept++;
    continue;
  }
  const size = statSync(file).size;
  freed += size;
  unreferenced.push({ file, size });
}

unreferenced.sort((a, b) => b.size - a.size);
console.log(`Scanned ${sourceFiles.length} source files against ${targets.length} public images.`);
console.log(`Referenced (kept): ${kept}. Unreferenced: ${unreferenced.length} (${(freed / 1048576).toFixed(1)} MB).`);

if (DRY_RUN) {
  for (const { file, size } of unreferenced) console.log(`  would move: ${relative(ROOT, file)} (${(size / 1048576).toFixed(1)} MB)`);
  process.exit(0);
}

const destRoot = join(ROOT, 'media', 'unreferenced');
for (const { file } of unreferenced) {
  const rel = relative(join(ROOT, 'public'), file);
  const dest = join(destRoot, rel);
  mkdirSync(dirname(dest), { recursive: true });
  renameSync(file, dest);
}
writeFileSync(join(destRoot, 'PRUNED.txt'), `${new Date().toISOString()}\nMoved ${unreferenced.length} unreferenced files out of public/ (run scripts/assets/prune-unreferenced-images.mjs to re-scan).\n`);
console.log(`Moved to media/unreferenced/ — deploy shrinks by ~${(freed / 1048576).toFixed(1)} MB.`);
