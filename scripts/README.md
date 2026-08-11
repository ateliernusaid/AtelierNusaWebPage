# Website Scripts

- `assets/` - image optimization and responsive variant generation
- `seo/` - sitemap, metadata, canonical, and structured-data checks
- `validation/` - route, link, accessibility, and build checks

Scripts must be read-only by default unless their command explicitly performs a controlled build or asset generation step.

Useful commands:

- `npm run validate:seo`
- `npm run validate:build`
- `npm run optimize:images`
- `npm run generate:sitemap`
