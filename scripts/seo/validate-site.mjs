import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routeManifest, routeCanonical } from '../../src/seo/route-manifest.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');

function requiredMatch(file, pattern, label) {
  const match = file.match(pattern);
  if (!match) return null;
  return match[1] ?? match[0];
}

for (const route of routeManifest) {
  const filePath = path.join(projectRoot, route.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`${route.file}: missing route file`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const lang = requiredMatch(html, /<html[^>]*\blang=["']([^"']+)["']/i, 'lang');
  const canonical = requiredMatch(html, /<link[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i, 'canonical');
  const title = requiredMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i, 'title');
  const description = requiredMatch(html, /<meta[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']+)["']/i, 'description');
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const imageTags = html.match(/<img\b[^>]*>/gi) || [];

  if (lang !== route.language) errors.push(`${route.file}: expected lang=${route.language}, got ${lang || 'missing'}`);
  if (canonical !== routeCanonical(route)) errors.push(`${route.file}: canonical must be ${routeCanonical(route)}, got ${canonical || 'missing'}`);
  if (!title?.trim()) errors.push(`${route.file}: missing title`);
  if (!description?.trim()) errors.push(`${route.file}: missing meta description`);
  if (h1Count !== 1) errors.push(`${route.file}: expected exactly one h1, got ${h1Count}`);
  if (imageTags.some((tag) => !/\balt=["'][^"']*["']/i.test(tag))) errors.push(`${route.file}: image without alt text`);
  for (const imageTag of imageTags) {
    const imageSrc = imageTag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!imageSrc || /^(https?:|data:|\/src\/)/i.test(imageSrc)) continue;
    const imagePath = path.join(projectRoot, 'public', decodeURIComponent(imageSrc.replace(/^\//, '')));
    if (!fs.existsSync(imagePath)) errors.push(`${route.file}: missing image ${imageSrc}`);
    else if (fs.statSync(imagePath).size > 1.5 * 1024 * 1024) errors.push(`${route.file}: image exceeds 1.5MB ${imageSrc}`);
  }
  if (/https:\/\/ateliernusa\.id/i.test(html)) errors.push(`${route.file}: non-www domain remains in page source`);
}

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  for (const route of routeManifest) {
    const html = fs.readFileSync(path.join(projectRoot, route.file), 'utf8');
    // noindex pages must stay OUT of the sitemap; skip them in the parity check.
    if (/name=["']robots["'][^>]*noindex/i.test(html)) {
      if (sitemapUrls.has(routeCanonical(route))) errors.push(`sitemap.xml: noindex page listed ${routeCanonical(route)}`);
      continue;
    }
    if (!sitemapUrls.has(routeCanonical(route))) errors.push(`sitemap.xml: missing ${routeCanonical(route)}`);
  }
} else {
  errors.push('public/sitemap.xml: missing sitemap');
}

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`SEO validation passed for ${routeManifest.length} routes.`);
}
