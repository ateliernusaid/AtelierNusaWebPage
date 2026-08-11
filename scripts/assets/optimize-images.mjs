import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const imageRoot = path.join(projectRoot, 'public', 'images');
const maxWidth = 1920;
const maxInputBytes = 500 * 1024;
const sourceExtensions = new Set(['.png', '.jpg', '.jpeg']);
const force = process.argv.includes('--force');

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const files = (await listFiles(imageRoot)).filter((file) => sourceExtensions.has(path.extname(file).toLowerCase()));
let generated = 0;
let skipped = 0;

for (const source of files) {
  const stats = await fs.stat(source);
  if (!force && stats.size <= maxInputBytes) {
    skipped += 1;
    continue;
  }

  const target = source.replace(/\.(png|jpe?g)$/i, '.webp');
  if (!force) {
    try {
      await fs.access(target);
      skipped += 1;
      continue;
    } catch {
      // Generate only missing production variants by default.
    }
  }

  await sharp(source)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(target);
  generated += 1;
  console.log(`${path.relative(projectRoot, source)} -> ${path.relative(projectRoot, target)}`);
}

console.log(`Image optimization complete: ${generated} generated, ${skipped} skipped.`);

