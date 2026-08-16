/**
 * Sync Microsoft Clarity tag across all built pages.
 *
 * - Injects the canonical snippet (with localhost/private-network guard) into
 *   every page that is missing it.
 * - Replaces legacy unguarded variants with the canonical snippet.
 * - Idempotent: pages already carrying the canonical snippet are left untouched.
 *
 * Usage: npm run sync:clarity
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CLARITY_PROJECT_ID = 'wotquq4rp4';
const CANONICAL_MARKER = 'atn-clarity-v2';

// Matches the minified stock snippet: (function(c,l,a,r,i,t,y){...})(window,document,"clarity","script","ID");
const STOCK_SNIPPET_RE = new RegExp(
    String.raw`[ \t]*<!--\s*Clarity\s*-->[ \t]*\r?\n?|` +
    String.raw`[ \t]*<script type="text/javascript">\(function\(c,l,a,r,i,t,y\)\{[\s\S]*?\}\)\(window,document,"clarity","script","${CLARITY_PROJECT_ID}"\);<\/script>[ \t]*\r?\n?`,
    'g',
);

// Matches the older deferred variant in index.html (comment through first closing script tag).
const DEFERRED_VARIANT_RE = /[ \t]*<!--\s*Microsoft Clarity\s*-->[\s\S]*?loadClarity[\s\S]*?<\/script>[ \t]*\r?\n?/;

// Matches the v1 canonical block injected by a previous run of this script.
const V1_CANONICAL_RE = /[ \t]*<!--\s*Microsoft Clarity\s*-->[\s\S]*?atn-clarity-guard[\s\S]*?<\/script>[ \t]*\r?\n?/;

function buildSnippet(eol) {
    const snippet = `
  <!-- Microsoft Clarity -->
  <script type="text/javascript">
    /* ${CANONICAL_MARKER} */
    (function () {
      window.clarity = window.clarity || function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
      document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (/wa\\.me|whatsapp/i.test(href)) window.clarity('event', 'whatsapp_click');
        else if (href.indexOf('tel:') === 0) window.clarity('event', 'phone_click');
        else if (href.indexOf('mailto:') === 0) window.clarity('event', 'email_click');
      });
      var host = window.location.hostname;
      if (!host || host === 'localhost' || /^(127\\.|10\\.|192\\.168\\.|169\\.254\\.|172\\.(1[6-9]|2\\d|3[01])\\.)/.test(host)) return;
      (window.requestIdleCallback || function (callback) { setTimeout(callback, 2200); })(function loadClarity() {
        if (document.querySelector('script[data-atn-clarity]')) return;
        var script = document.createElement('script');
        script.async = true;
        script.dataset.atnClarity = 'true';
        script.src = 'https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}';
        document.head.appendChild(script);
      });
    })();
  </script>
`;
    return eol === '\r\n' ? snippet.replace(/\n/g, '\r\n') : snippet;
}

function collectPages() {
    const pages = [];
    for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith('.html')) {
            pages.push(resolve(ROOT, entry.name));
        }
    }
    const blogDir = resolve(ROOT, 'blog');
    for (const entry of readdirSync(blogDir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith('.html')) {
            pages.push(resolve(blogDir, entry.name));
        }
    }
    return pages;
}

let injected = 0;
let replaced = 0;
let skipped = 0;
const failed = [];

for (const page of collectPages()) {
    const html = readFileSync(page, 'utf8');
    const eol = html.includes('\r\n') ? '\r\n' : '\n';

    if (html.includes(CANONICAL_MARKER) && html.includes(`clarity.ms/tag/${CLARITY_PROJECT_ID}`)) {
        skipped++;
        console.log(`  = ${page.replace(ROOT, '.')}`);
        continue;
    }

    let next = html
        .replace(STOCK_SNIPPET_RE, '')
        .replace(DEFERRED_VARIANT_RE, '')
        .replace(V1_CANONICAL_RE, '')
        // Collapse the stray blank line a removed block may leave before </head>.
        .replace(/\r?\n[ \t]*(<\/head>)/i, '$1');

    if (!/<\/head>/i.test(next)) {
        failed.push(page);
        console.error(`  ! ${page.replace(ROOT, '.')} has no </head>; skipped`);
        continue;
    }

    const hadLegacy = next !== html;
    next = next.replace(/<\/head>/i, `${buildSnippet(eol)}</head>`);
    writeFileSync(page, next, 'utf8');
    hadLegacy ? replaced++ : injected++;
    console.log(`  ${hadLegacy ? '~' : '+'} ${page.replace(ROOT, '.')}`);
}

console.log(`\nClarity sync complete: ${injected} injected, ${replaced} replaced, ${skipped} already canonical.`);
if (failed.length) {
    console.error(`Failed on ${failed.length} page(s): ${failed.join(', ')}`);
    process.exit(1);
}
