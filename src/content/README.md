# Content Architecture

Place reusable page copy and structured content in the language-specific folders:

- `en/` for English brand and international content.
- `id/` for Indonesian SEO and Ads content.

Keep route-specific metadata separate from visual components. Use plain JavaScript modules for now so the content layer remains compatible with the current Vite setup.

Commercial route modules currently cover the English brand core and the first Indonesian acquisition cluster. Root HTML files remain the rendering boundary until the static pages are migrated one cluster at a time.
