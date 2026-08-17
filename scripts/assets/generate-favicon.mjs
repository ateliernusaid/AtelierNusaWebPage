// Generate brand favicons from the REAL ATN logo webp (thin light strokes on
// transparent). The strokes are thickened (diamond dilate) and their alpha
// boosted so the original artwork survives 64px; the background stays fully
// transparent. apple-touch-icon.png keeps the dark rounded square for iOS.
import sharp from 'sharp';

const LOGO = 'public/images/ATN Logo Transparan.webp';
const BG = '#0a0f14';

async function resizedLogo(logoW) {
  const logoH = Math.round(logoW * (1024 / 1536)); // keep 3:2 aspect
  return {
    buf: await sharp(LOGO).resize({ width: logoW, height: logoH, fit: 'inside' }).png().toBuffer(),
    w: logoW,
    h: logoH,
  };
}

// Diamond-shaped dilation offsets thicken strokes ~2px in every direction
// without bloating the mark as a full 5x5 square would.
function dilateLayers(size, logo) {
  const left = Math.round((size - logo.w) / 2);
  const top = Math.round((size - logo.h) / 2);
  const layers = [];
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (Math.abs(dx) + Math.abs(dy) > 2) continue;
      layers.push({ input: logo.buf, blend: 'over', left: left + dx, top: top + dy });
    }
  }
  return layers;
}

async function makeTransparent(size, out, logoRatio) {
  const logo = await resizedLogo(Math.round(size * logoRatio));
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(dilateLayers(size, logo))
    .linear(2.0, -30) // deepen alpha so faint antialiased edges become solid
    .png()
    .toFile(out);
  console.log(`created ${out} (${size}x${size}, transparent, real logo)`);
}

async function makeDarkSquare(size, out, radiusRatio, logoRatio) {
  const radius = Math.round(size * radiusRatio);
  const logo = await resizedLogo(Math.round(size * logoRatio));
  const bgSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${BG}"/></svg>`
  );
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: bgSvg, blend: 'over' }, ...dilateLayers(size, logo)])
    .linear(2.0, -30)
    .png()
    .toFile(out);
  console.log(`created ${out} (${size}x${size}, dark square, real logo)`);
}

await makeTransparent(64, 'public/images/favicon.png', 0.94);
await makeDarkSquare(180, 'public/images/apple-touch-icon.png', 0.24, 0.68);
