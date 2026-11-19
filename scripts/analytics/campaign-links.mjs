import { pathToFileURL } from 'node:url';

export function campaignLinks(campaign = 'studio-portfolio') {
  if (!/^[a-z0-9-]{1,64}$/.test(campaign)) throw new Error('Use a lowercase campaign slug (letters, numbers, hyphens).');
  return ['instagram', 'threads', 'facebook'].flatMap(source => [
    ['bio', '/'],
    ['unram-phase-01', '/projects/unram-residence'],
    ['consultation', '/konsultasi-gratis'],
  ].map(([content, path]) => {
    const url = new URL(path, 'https://www.ateliernusa.id');
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', 'social');
    url.searchParams.set('utm_campaign', campaign);
    url.searchParams.set('utm_content', content);
    return { source, content, url: url.href };
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const link of campaignLinks(process.argv[2])) console.log(`${link.source}\t${link.content}\t${link.url}`);
}
