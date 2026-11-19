import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');

test('home service cards use the supplied proposal and chosen illustrations in order', () => {
  const section = html.match(/<section[^>]*id="services"[\s\S]*?<\/section>/)[0];
  const images = section.match(/<img\b[^>]+>/g);
  assert.equal(images.length, 3);
  const subjects = ['site-contour-proposal', 'design-development', 'modern-home-dusk'];
  images.forEach((image, index) => {
    assert.ok(image.includes(subjects[index]));
    assert.doesNotMatch(image, /projects\/concepts/);
    assert.match(image, /alt="[^"]+"/);
    assert.match(image, /loading="lazy"/);
    assert.match(image, /width="\d+" height="\d+"/);
    const src = image.match(/src="([^"]+)"/)[1];
    assert.ok(existsSync(new URL(`public${src}`, root)));
    for (const variant of image.match(/srcset="([^"]+)"/)[1].split(', ')) {
      assert.ok(existsSync(new URL(`public${variant.split(' ')[0]}`, root)));
    }
  });
  for (const heading of ['Read the plot first', 'Turn ideas into drawings', 'Stay close to the work']) assert.ok(section.includes(heading));
});

test('homepage text statistics keep names on one line', () => {
  const css = readFileSync(new URL('../src/styles/home.css', import.meta.url), 'utf8');
  const rule = css.match(/\.stats__number--text\s*\{([^}]+)\}/)[1];
  assert.match(rule, /white-space:\s*nowrap/);
  const stats = html.match(/<section[^>]*id="stats"[\s\S]*?<\/section>/)[0];
  assert.deepEqual([...stats.matchAll(/class="stats__number stats__number--text">([^<]+)/g)].map(match => match[1]), ['Mataram', 'Homes', 'Design', 'Lombok']);
});
