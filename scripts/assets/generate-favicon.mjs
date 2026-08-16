// Generate brand favicons from the ATN logo (light mark on transparent).
// The dark rounded background keeps the mark visible on light and dark tab bars.
import sharp from 'sharp';

const LOGO = 'public/images/ATN Logo Transparan.webp';
const BG = '#0a0f14';

async function makeIcon(size, out, radiusRatio, logoRatio, squareBg) {
  const radius = Math.round(size * radiusRatio);
  const inner = Math.round(size * logoRatio);
  const logoW = inner;
  const logoH = Math.round(inner * (1024 / 1536)); // keep 3:2 aspect

  const bgSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${BG}"/></svg>`
  );
  const logo = await sharp(LOGO).resize({ width: logoW, height: logoH, fit: 'inside' }).png().toBuffer();

  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: bgSvg, blend: 'over' },
      { input: logo, blend: 'over', left: Math.round((size - logoW) / 2), top: Math.round((size - logoH) / 2) },
    ])
    .png()
    .toFile(out);
  console.log(`created ${out} (${size}x${size})`);
}

await makeIcon(64, 'public/images/favicon.png', 0.22, 0.74);
await makeIcon(180, 'public/images/apple-touch-icon.png', 0.24, 0.68);
