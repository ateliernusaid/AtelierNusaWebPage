# Atelier Nusa Web Architecture

## Goal

Build a maintainable bilingual marketing website for Atelier Nusa while preserving the existing public URLs during migration.

The website remains a static Vite site. The first phase does not introduce a framework rewrite or change the deployment model.

## Core Principles

- English is the primary brand and international-facing language.
- Indonesian pages are focused acquisition pages for local SEO and future Ads campaigns.
- Every route has one canonical URL, one dominant language, and one primary conversion action.
- Source media is separated from optimized production media.
- SEO metadata and structured data are treated as route data, not scattered page details.
- Existing URLs are preserved until redirects and Search Console coverage are verified.

## Target Structure

```text
AtelierNusaWeb/
|- *.html                    # Existing Vite route entrypoints during migration
|- src/
|  |- components/            # Shared navbar, footer, CTA, lightbox, motion
|  |- content/
|  |  |- en/                  # English brand and international copy
|  |  `- id/                  # Indonesian SEO and Ads copy
|  |- seo/                    # Route metadata, canonical, hreflang, schema
|  |- analytics/              # Event names and conversion tracking helpers
|  |- styles/                # Tokens, base, components, page styles
|  `- utils/                 # Small browser-safe helpers
|- public/
|  `- images/
|     |- brand/              # Logo, favicon, brand graphics
|     |- projects/            # Optimized project media by slug
|     |- articles/            # Article and guide media
|     |- landing/             # Future Ads landing page media
|     `- og/                  # Open Graph and social preview images
|- media/
|  `- source/                 # Local high-resolution originals; never deployed
|- scripts/
|  |- assets/                 # Sharp/WebP/AVIF optimization scripts
|  |- seo/                    # Sitemap and metadata validation
|  `- validation/             # Link, route, accessibility, and build checks
|- docs/
|  `- ARCHITECTURE.md         # This document and future decisions
`- tests/                     # Route and content contract tests
```

## Current Compatibility Layer

The current HTML files remain in the repository root because Vite uses them as multi-page entrypoints. They are not moved into language folders yet. The migration will first centralize shared data and validation, then update pages one group at a time.

This prevents accidental URL changes such as `/services` becoming `/en/services` and protects existing backlinks and Search Console history.

## Page Ownership

### English brand layer

- `/`
- `/about`
- `/services`
- `/projects`
- English project case studies
- `/privacy-policy`
- `/terms-of-service`

These pages establish the Atelier Nusa voice, design philosophy, process, and international positioning.

### Indonesian acquisition layer

- `/jasa-arsitek-lombok`
- `/arsitek-mataram`
- `/arsitek-kuta-mandalika`
- `/jasa-arsitek-senggigi`
- `/biaya-arsitek-lombok`
- `/renovasi-rumah-mataram-lombok`
- Future location, service, and Ads landing pages

These pages target local search intent and must use clear Indonesian copy, location proof, pricing context where appropriate, FAQ, and one dominant WhatsApp CTA.

### Shared conversion layer

Every commercial page should expose:

- A clear service and location statement above the fold.
- Proof of work or a concrete reason to trust the studio.
- Process and expected next step.
- A primary WhatsApp or consultation CTA.
- A secondary contact option only when it does not compete with the primary CTA.

## SEO Contract

Each indexable route must define:

- `lang`
- `title`
- `description`
- One canonical URL on `https://www.ateliernusa.id`
- Open Graph title, description, URL, and image
- Twitter card metadata
- One descriptive H1
- Breadcrumb or relevant service schema where useful
- FAQ schema only when the visible FAQ exists on the page
- `hreflang` only when a true language counterpart exists

Non-www canonicals and unnecessary `.html` canonicals are normalized before new pages are added.

## Content Data Contract

Future content modules should live under `src/content/en` or `src/content/id`. A route should be able to consume:

```js
{
  slug: 'jasa-arsitek-lombok',
  language: 'id',
  title: 'Jasa Arsitek Lombok',
  description: '...',
  service: 'architecture',
  locations: ['Lombok', 'Mataram'],
  primaryCta: 'Konsultasi via WhatsApp',
  heroImage: '/images/landing/jasa-arsitek-lombok/hero.webp'
}
```

The first implementation may use plain JavaScript modules to match the existing project. No CMS is required for this phase.

## Asset Rules

- Originals stay in `media/source` or an external archive.
- Production pages use WebP or AVIF with responsive variants.
- Project assets are grouped by project slug.
- Every production image has an intentional filename, width, height, and alt text.
- AI-generated images must be labeled as concept visualization when they do not represent a completed real project.
- Large PNG/JPEG files are not added to `public/images` without optimization.

## Migration Order

1. Add route and SEO contracts without changing visible page content.
2. Normalize canonical URLs and language declarations.
3. Extract shared navigation, footer, CTA, and analytics behavior.
4. Strengthen English core pages.
5. Strengthen Indonesian acquisition pages.
6. Convert selected projects into evidence-based case studies.
7. Optimize media and add validation scripts.
8. Build, inspect routes, verify metadata, then deploy.

## Safety Rules

- Do not touch `AtelierNusaAdsAgent` while changing the website.
- Do not delete existing pages until redirects and live verification exist.
- Do not expose credentials in content, JavaScript bundles, or build output.
- Keep the current live commit available as the rollback point.
