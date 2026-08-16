import { absoluteUrl } from './site-config.js';

// This manifest is the single source of truth for language and acquisition intent.
export const routeManifest = [
  { file: 'index.html', path: '/', language: 'en', group: 'brand', adsEligible: false },
  { file: 'about.html', path: '/about', language: 'en', group: 'brand', adsEligible: false },
  { file: 'services.html', path: '/services', language: 'en', group: 'brand', adsEligible: false },
  { file: 'projects.html', path: '/projects', language: 'en', group: 'portfolio', adsEligible: false },
  { file: 'luxury-residential-mataram.html', path: '/luxury-residential-mataram', language: 'en', group: 'portfolio', adsEligible: false },
  { file: 'private-residence-lombok-barat.html', path: '/private-residence-lombok-barat', language: 'en', group: 'portfolio', adsEligible: false },
  { file: 'industrial-residence-mataram.html', path: '/industrial-residence-mataram', language: 'en', group: 'portfolio', adsEligible: false },
  { file: 'tropical-villa-senggigi.html', path: '/tropical-villa-senggigi', language: 'id', group: 'portfolio', adsEligible: false },
  { file: 'privacy-policy.html', path: '/privacy-policy', language: 'en', group: 'legal', adsEligible: false },
  { file: 'terms-of-service.html', path: '/terms-of-service', language: 'en', group: 'legal', adsEligible: false },
  { file: 'jasa-arsitek-lombok.html', path: '/jasa-arsitek-lombok', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'arsitek-mataram.html', path: '/arsitek-mataram', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'arsitek-kuta-mandalika.html', path: '/arsitek-kuta-mandalika', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'jasa-arsitek-senggigi.html', path: '/jasa-arsitek-senggigi', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'desain-interior-lombok.html', path: '/desain-interior-lombok', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'arsitek-villa-mewah-lombok.html', path: '/arsitek-villa-mewah-lombok', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'biaya-arsitek-lombok.html', path: '/biaya-arsitek-lombok', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'renovasi-rumah-mataram-lombok.html', path: '/renovasi-rumah-mataram-lombok', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'konsultasi-gratis.html', path: '/konsultasi-gratis', language: 'id', group: 'conversion', adsEligible: true },
  { file: 'artikel.html', path: '/artikel', language: 'en', group: 'content', adsEligible: false },
  { file: 'tren-desain-interior-lombok.html', path: '/tren-desain-interior-lombok', language: 'id', group: 'content', adsEligible: false },
  { file: 'panduan-memilih-arsitek-lombok.html', path: '/panduan-memilih-arsitek-lombok', language: 'id', group: 'content', adsEligible: false },
  { file: 'blog/biaya-bangun-rumah-lombok-2026.html', path: '/blog/biaya-bangun-rumah-lombok-2026', language: 'id', group: 'content', adsEligible: false },
  { file: 'tips-memilih-arsitek-mataram.html', path: '/tips-memilih-arsitek-mataram', language: 'id', group: 'content', adsEligible: false },
  { file: 'desain-rumah-tropis-ntb.html', path: '/desain-rumah-tropis-ntb', language: 'id', group: 'content', adsEligible: false },
  { file: 'desain-cafe-restoran-lombok.html', path: '/desain-cafe-restoran-lombok', language: 'id', group: 'acquisition', adsEligible: true },
  { file: 'biaya-bangun-rumah-lombok.html', path: '/biaya-bangun-rumah-lombok', language: 'id', group: 'content', adsEligible: true },
  { file: 'estimasi-biaya-bangun-rumah-2-lantai-lombok.html', path: '/estimasi-biaya-bangun-rumah-2-lantai-lombok', language: 'id', group: 'content', adsEligible: true },
  { file: 'portofolio-villa-lombok.html', path: '/portofolio-villa-lombok', language: 'id', group: 'portfolio', adsEligible: false },
  { file: 'lahan.html', path: '/lahan', language: 'en', group: 'property', adsEligible: false },
  { file: 'tanah-labuhan-lombok.html', path: '/tanah-labuhan-lombok', language: 'id', group: 'property', adsEligible: false },
  { file: 'tanah-batu-layar.html', path: '/tanah-batu-layar', language: 'id', group: 'property', adsEligible: false },
];

export const routeByFile = new Map(routeManifest.map((route) => [route.file, route]));

export function routeCanonical(route) {
  return absoluteUrl(route.path);
}
