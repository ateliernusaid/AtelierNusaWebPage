// One-off: add honeypot input + phone pattern to all [data-lead-form] pages.
import { readFileSync, writeFileSync } from 'fs';

const PAGES = [
  'index.html',
  'artikel.html',
  'jasa-arsitek-lombok.html',
  'biaya-bangun-rumah-lombok.html',
  'desain-cafe-restoran-lombok.html',
  'arsitek-mataram.html',
  'biaya-arsitek-lombok.html',
  'portofolio-villa-lombok.html',
  'renovasi-rumah-mataram-lombok.html',
];

const HONEYPOT = '<div aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;height:1px;width:1px;overflow:hidden;"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>';
const PHONE_PATTERN = 'pattern="[0-9+()\\- ]{8,20}"';

for (const page of PAGES) {
  let html = readFileSync(page, 'utf8');
  const eol = html.includes('\r\n') ? '\r\n' : '\n';
  let changed = false;

  if (!html.includes('name="website"')) {
    html = html.replace(/(<form[^>]*data-lead-form[^>]*>)/i, `$1${eol}        ${HONEYPOT}`);
    changed = true;
  }

  html = html.replace(/<input[^>]*>/g, (tag) => {
    if (!/pattern=/.test(tag) && (/name="telepon"/.test(tag) || /id="hp-phone"/.test(tag))) {
      changed = true;
      return tag.replace(/^<input /, `<input ${PHONE_PATTERN} `);
    }
    return tag;
  });

  if (changed) {
    writeFileSync(page, html, 'utf8');
    console.log(`~ ${page}`);
  } else {
    console.log(`= ${page}`);
  }
}
