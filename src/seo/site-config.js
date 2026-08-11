export const SITE_ORIGIN = 'https://www.ateliernusa.id';
export const SITE_NAME = 'Atelier Nusa';
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/images/og-image.jpg`;

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalizedPath === '/' ? '/' : normalizedPath.replace(/\.html$/, '')}`;
}
