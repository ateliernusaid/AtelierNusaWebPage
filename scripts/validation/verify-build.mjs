import fs from 'node:fs';
import path from 'node:path';
import { routeManifest } from '../../src/seo/route-manifest.js';

const root = process.cwd();
const dist = path.join(root, 'dist');
const missing = routeManifest
  .map((route) => route.file)
  .filter((file) => !fs.existsSync(path.join(dist, file)));

if (!fs.existsSync(path.join(dist, 'sitemap.xml'))) missing.push('sitemap.xml');
if (!fs.existsSync(path.join(dist, 'robots.txt'))) missing.push('robots.txt');

if (missing.length) {
  console.error(`Build verification failed. Missing: ${missing.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`Build verification passed for ${routeManifest.length} routes.`);
}

