// Generate brand favicons from the vector ATN monogram (see monogram.mjs).
// The raster logo's hairline strokes vanish at 64px, so the mark is redrawn
// as vector paths. favicon.png sits on a fully transparent background with a
// warm-white mark (no dark square). apple-touch-icon.png keeps the dark
// rounded square because iOS home screens crop to opaque corners.
import sharp from 'sharp';
import { monogramSvg } from './monogram.mjs';

const MARK = '#f5f2ec'; // warm white matching the site's ivory text
const BG = '#0a0f14';

async function makeTransparent(size, out, inset) {
  const svg = Buffer.from(monogramSvg(size - inset * 2, MARK));
  const w = size - inset * 2;
  const h = Math.round((w * 64) / 104);
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: svg, blend: 'over', left: inset, top: Math.round((size - h) / 2) }])
    .png()
    .toFile(out);
  console.log(`created ${out} (${size}x${size}, transparent)`);
}

async function makeDarkSquare(size, out, inset) {
  const radius = Math.round(size * 0.24);
  const bgSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${BG}"/></svg>`
  );
  const w = size - inset * 2;
  const mono = Buffer.from(monogramSvg(w, MARK));
  const h = Math.round((w * 64) / 104);
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: bgSvg, blend: 'over' }, { input: mono, blend: 'over', left: inset, top: Math.round((size - h) / 2) }])
    .png()
    .toFile(out);
  console.log(`created ${out} (${size}x${size}, dark square)`);
}

await makeTransparent(64, 'public/images/favicon.png', 2);
await makeDarkSquare(180, 'public/images/apple-touch-icon.png', 22);
