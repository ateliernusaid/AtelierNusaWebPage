/**
 * patch_fonts.cjs
 * Replaces render-blocking Google Fonts <link rel="stylesheet"> with
 * non-blocking pattern across all HTML files in AtelierNusaWeb.
 * BEFORE: <link href="...fonts.googleapis.com..." rel="stylesheet">
 * AFTER:  <link href="..." rel="preload" as="style" onload="this.rel='stylesheet'">
 *         <noscript><link href="..." rel="stylesheet"></noscript>
 */

const fs   = require('fs');
const path = require('path');
const glob = require('fs');

const WEB_DIR = path.resolve(__dirname, '.');
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap';

// Non-blocking font pattern
const NON_BLOCKING = `<link rel="preload" as="style" href="${FONT_URL}" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${FONT_URL}"></noscript>`;

// Patterns to match (existing blocking link tags, various formats found in the HTML files)
const BLOCKING_PATTERNS = [
  // Multi-line format with separate rel="stylesheet" on next line (most pages)
  /<link\s+rel="preconnect"[^>]*>\s*<link\s+rel="preconnect"[^>]*crossorigin[^>]*>\s*<link\s+\n?\s*href="https:\/\/fonts\.googleapis\.com\/css2[^"]*"\s*\n?\s*rel="stylesheet"\s*\/?>/g,
  // Single-line format (terms, privacy)
  /<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]*" rel="stylesheet">/g,
];

// All HTML files in the web directory (non-recursive)
const htmlFiles = fs.readdirSync(WEB_DIR)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(WEB_DIR, f));

let patchedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace the preconnect + font link block with non-blocking version
  // Pattern: the two preconnect links followed by the font stylesheet link
  content = content.replace(
    /(<link\s+rel="preconnect"\s+href="https:\/\/fonts\.googleapis\.com"\s*\/?>\s*\n?\s*<link\s+rel="preconnect"\s+href="https:\/\/fonts\.gstatic\.com"\s+crossorigin\s*\/?>\s*\n?\s*)<link\s+\n?\s*href="https:\/\/fonts\.googleapis\.com\/css2[^"]*"\s*\n?\s*rel="stylesheet"\s*\/?>(\s*\/?>)?/g,
    `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${NON_BLOCKING}`
  );

  // Also catch single-line format (terms/privacy pages)
  content = content.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]*" rel="stylesheet">/g,
    NON_BLOCKING
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Patched: ${path.basename(file)}`);
    patchedCount++;
  } else {
    console.log(`⏭️  Skipped (no match): ${path.basename(file)}`);
  }
}

console.log(`\n🎉 Done! Patched ${patchedCount} files.`);
