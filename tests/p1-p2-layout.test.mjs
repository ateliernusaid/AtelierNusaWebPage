import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { campaignLinks } from '../scripts/analytics/campaign-links.mjs';

const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const main = source('src/main.js');
const navbar = source('src/components/navbar.js');
const animations = source('src/components/animations.js');
const projects = source('projects.html');
const styles = source('src/styles/projects.css');
const pages = ['index.html', 'projects.html', 'lahan.html', 'jasa-arsitek-lombok.html', 'biaya-bangun-rumah-lombok.html'];
const anchorById = (html, id) => {
    const anchor = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)]
        .map(([value]) => value).find((value) => value.includes(`data-cta-id="${id}"`));
    assert.ok(anchor, `Missing CTA: ${id}`);
    return anchor;
};

test('non-linked project cards remain static with visible captions and no invented routes', () => {
    assert.equal((projects.match(/<div class="project-card /g) || []).length, 4);
    assert.equal((projects.match(/<a href="\/[^"]+" class="project-card /g) || []).length, 4);
    assert.match(styles, /\.projects-grid > div\.project-card\s*\{\s*cursor: default;/);
    assert.match(styles, /\.projects-grid > div\.project-card:hover\s*\{\s*transform: none;\s*box-shadow: none;/);
    assert.match(styles, /div\.project-card:hover \.project-card__image\s*\{\s*transform: none;\s*filter: none;/);
    assert.match(styles, /div\.project-card:hover \.project-card__overlay\s*\{\s*opacity: 1;\s*backdrop-filter: none;/);
    assert.match(styles, /div\.project-card \.project-card__subtitle\s*\{\s*opacity: 1;\s*transform: none;/);
});

test('navbar disclosure exposes state and Escape restores trigger focus', () => {
    assert.match(navbar, /<button type="button"[^>]*aria-expanded="false" aria-controls="navMenu"/);
    assert.match(navbar, /id="navMenu"/);
    assert.match(navbar, /hamburger\.setAttribute\('aria-expanded', String\(open\)\)/);
    assert.match(navbar, /event\.key === 'Escape'[\s\S]*?setMenuOpen\(false, true\)/);
    assert.match(navbar, /if \(restoreFocus\) hamburger\.focus\(\)/);
    assert.match(navbar, /document\.body\.style\.overflow = open \? 'hidden' : previousOverflow/);
});

test('reduced-motion skips decorative JS, reveals content, and retains final counters', () => {
    const reducedBranch = animations.slice(0, animations.indexOf('// Intersection Observer'));
    assert.match(reducedBranch, /prefers-reduced-motion: reduce/);
    assert.match(reducedBranch, /classList\.add\('visible'\)/);
    assert.match(reducedBranch, /classList\.add\('revealed'\)/);
    assert.match(reducedBranch, /el\.textContent = parseInt[\s\S]*?el\.dataset\.suffix/);
    assert.match(reducedBranch, /return;/);
    assert.match(main, /function initCursor\(\) \{[\s\S]*?prefers-reduced-motion: reduce[\s\S]*?return;[\s\S]*?createElement\('div'\)/);
    assert.match(main, /function initScrollProgress\(\) \{[\s\S]*?prefers-reduced-motion: reduce[\s\S]*?return;/);
    assert.match(navbar, /if \(reducedMotion\.matches\) return;/);
    assert.match(projects, /if \(reducedMotion\.matches\) \{[\s\S]*?card\.style\.transition = 'none';[\s\S]*?return;/);
    assert.doesNotMatch(main, /initCountUp|animateCounter/);
    assert.equal((main.match(/initAnimations\(\);/g) || []).length, 1);
});

test('scroll and cursor writes are coalesced without duplicating telemetry installation', () => {
    assert.match(main, /if \(cursorFrame\) return;\s*cursorFrame = requestAnimationFrame/);
    assert.match(main, /if \(!progressFrame\) progressFrame = requestAnimationFrame\(updateProgress\)/);
    assert.match(main, /addEventListener\('scroll', scheduleProgress, \{ passive: true \}\)/);
    assert.match(main, /addEventListener\('resize', scheduleProgress, \{ passive: true \}\)/);
    assert.doesNotMatch(main, /installClientErrorTelemetry/);
    assert.match(main, /import '\.\/analytics\/leadTracker\.js'/);
});

test('early planning routes have stable attribution, bilingual labels, and compact shared layout', () => {
    for (const [file, prefix] of [['index.html', 'homepage'], ['projects.html', 'projects'], ['lahan.html', 'land']]) {
        const html = source(file);
        const early = html.slice(html.indexOf('<body'), html.indexOf('</section>', html.indexOf('<body')));
        for (const [kind, href] of [['cost_guide', '/biaya-bangun-rumah-lombok'], ['consultation', '/konsultasi-gratis']]) {
            const anchor = anchorById(early, `${prefix}_early_${kind}`);
            assert.ok(anchor.includes(`href="${href}"`));
            assert.match(anchor, /data-cta-copy-en="[^"]+" data-cta-copy-id="[^"]+"/);
            assert.doesNotMatch(anchor, /style=|utm_/);
        }
        assert.match(early, /<p class="section-desc">/);
    }
    assert.match(main, /applyLanguage\(\);\s*initLocalizedCtas\(\);/);
    assert.match(main, /document\.documentElement\.lang\.toLowerCase\(\)\.startsWith\('id'\)/);
    assert.match(main, /isIndonesian \? link\.dataset\.ctaCopyId : link\.dataset\.ctaCopyEn/);
    assert.match(styles, /\.section-desc > a\[data-cta-copy-en\][\s\S]*?text-decoration: underline;/);
});

test('hero actions and land phone are preserved; adequate service and cost CTAs are reused', () => {
    const home = source('index.html');
    assert.match(anchorById(home, 'homepage_hero_whatsapp'), /href="https:\/\/wa\.me\/6285190645078\?text=/);
    assert.match(anchorById(home, 'homepage_hero_projects'), /href="\/projects"/);
    assert.match(anchorById(source('lahan.html'), 'land_custom_whatsapp'), /href="https:\/\/wa\.me\/628175797511\?text=/);
    assert.match(anchorById(projects, 'projects_consultation'), /href="\/#konsultasi"/);
    const services = source('jasa-arsitek-lombok.html');
    assert.match(anchorById(services, 'service_early_cost_guide'), /href="\/biaya-bangun-rumah-lombok"/);
    assert.match(anchorById(services, 'service_hero_brief'), /href="#konsultasi"[^>]*data-funnel-event="consultation_start"/);
    const costs = source('biaya-bangun-rumah-lombok.html');
    for (const id of ['cost_guide_hero_review', 'cost_guide_mid_review', 'cost_guide_consultation_link']) {
        assert.match(anchorById(costs, id), /data-funnel-event="consultation_start"/);
    }
});

test('consultation intent is not assigned to service browsing or submit controls; no acquisition UTM is added', () => {
    assert.doesNotMatch(anchorById(source('index.html'), 'homepage_services_link'), /data-funnel-event/);
    for (const file of pages) {
        const html = source(file);
        const ids = [...html.matchAll(/data-cta-id="([^"]+)"/g)].map(([, id]) => id);
        assert.equal(new Set(ids).size, ids.length, `${file}: duplicate CTA ids`);
        assert.doesNotMatch(html, /<button\b[^>]*data-funnel-event="consultation_start"/);
        for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
            if (href.startsWith('/') || /instagram\.com|facebook\.com|threads\.com/.test(href)) {
                assert.doesNotMatch(href, /[?&]utm_/i, `${file}: acquisition UTM on navigation`);
            }
        }
    }
});

test('campaign helper creates inbound social URLs without changing site navigation', () => {
    const links = campaignLinks('november-release');
    assert.equal(links.length, 9);
    for (const { source: network, content, url: href } of links) {
        const url = new URL(href);
        assert.equal(url.origin, 'https://www.ateliernusa.id');
        assert.equal(url.searchParams.get('utm_source'), network);
        assert.equal(url.searchParams.get('utm_medium'), 'social');
        assert.equal(url.searchParams.get('utm_campaign'), 'november-release');
        assert.equal(url.searchParams.get('utm_content'), content);
    }
    assert.throws(() => campaignLinks('Bad Campaign'));
});
