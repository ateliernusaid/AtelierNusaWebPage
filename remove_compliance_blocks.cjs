/**
 * Removes the hardcoded #compliance-contact-info div from all HTML pages
 * that also use main.js (createFooter). Since the component footer already
 * includes Privacy Policy and Terms of Service links, this block is redundant
 * and causes a double/triple footer appearance.
 */
const fs   = require('fs');
const path = require('path');

const WEB_DIR = path.resolve(__dirname, '.');

// Pages that use main.js — only these need the compliance block removed
// (jasa-arsitek-lombok.html does NOT use main.js so skip it)
const TARGET_FILES = [
    'about.html',
    'projects.html',
    'luxury-residential-mataram.html',
    'industrial-residence-mataram.html',
    'private-residence-lombok-barat.html',
    'tropical-villa-senggigi.html',
    'privacy-policy.html',
    'terms-of-service.html',
];

// Regex: match the entire compliance-contact-info div (single line in these files)
const COMPLIANCE_REGEX = /<div id="compliance-contact-info"[\s\S]*?<\/div>\s*<\/div>/g;

let patched = 0;

for (const file of TARGET_FILES) {
    const fullPath = path.join(WEB_DIR, file);
    if (!fs.existsSync(fullPath)) {
        console.log(`⏭️  Not found: ${file}`);
        continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const original = content;

    // Remove the compliance block
    content = content.replace(COMPLIANCE_REGEX, '');

    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Cleaned: ${file}`);
        patched++;
    } else {
        console.log(`⏭️  No match: ${file}`);
    }
}

console.log(`\n🎉 Done! Removed compliance block from ${patched} files.`);
