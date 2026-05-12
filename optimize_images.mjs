import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMG_DIR = 'D:/SCRIPT/YapAutoBot-NTE-main/AtelierNusaWeb/public/images';
const files = fs.readdirSync(IMG_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
const BIG = files.filter(f => fs.statSync(path.join(IMG_DIR, f)).size > 500 * 1024); // >500KB

console.log(`Found ${BIG.length} images > 500KB to optimize\n`);

for (const f of BIG) {
    const src = path.join(IMG_DIR, f);
    const out = path.join(IMG_DIR, f.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    if (fs.existsSync(out)) { console.log(`  SKIP ${f} (webp exists)`); continue; }
    const sizeMB = (fs.statSync(src).size / 1024 / 1024).toFixed(1);
    try {
        await sharp(src).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
        const newSizeKB = (fs.statSync(out).size / 1024).toFixed(0);
        console.log(`  ✅ ${f} (${sizeMB}MB) → ${path.basename(out)} (${newSizeKB}KB)`);
    } catch (e) { console.log(`  ❌ ${f}: ${e.message}`); }
}
console.log('\nDone!');
