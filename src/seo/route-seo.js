import { englishPages } from '../content/en/site-pages.js';
import { acquisitionPages } from '../content/id/acquisition-pages.js';

export const routeSeo = Object.freeze({
  ...Object.fromEntries(Object.entries(englishPages).map(([key, page]) => [page.slug, page])),
  ...Object.fromEntries(Object.entries(acquisitionPages).map(([key, page]) => [page.slug, page])),
});

export function seoForPath(pathname) {
  return routeSeo[pathname] || null;
}

