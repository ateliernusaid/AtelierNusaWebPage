import fs from 'node:fs/promises';
import path from 'node:path';
import { routeManifest, routeCanonical } from '../../src/seo/route-manifest.js';

const root = process.cwd();
const output = path.join(root, 'public', 'sitemap.xml');
const date = process.env.SITEMAP_DATE || new Date().toISOString().slice(0, 10);

function changeFrequency(group, pathname) {
  if (pathname === '/') return 'weekly';
  if (group === 'legal') return 'yearly';
  return 'monthly';
}

function priority(group, pathname) {
  if (pathname === '/') return '1.0';
  if (group === 'acquisition' || group === 'conversion') return '0.9';
  if (group === 'legal') return '0.3';
  return '0.8';
}

const urls = routeManifest.map((route) => `  <url>\n    <loc>${routeCanonical(route)}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>${changeFrequency(route.group, route.path)}</changefreq>\n    <priority>${priority(route.group, route.path)}</priority>\n  </url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await fs.writeFile(output, sitemap, 'utf8');
console.log(`Generated sitemap with ${routeManifest.length} routes: ${path.relative(root, output)}`);

