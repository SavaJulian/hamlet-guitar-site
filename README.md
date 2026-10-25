# Hamlet — gitaarles in Merksem

A Dutch-language, performance-led website for Hamlet's guitar lessons in Merksem, Antwerpen. Built from Julian's local AstroWind website kit using Astro, Tailwind and Bun.

## Develop

Requires Node.js 22.22.3 or newer and Bun 1.3.14 or newer.

```sh
bun install
bun run dev
```

## Verify and build

```sh
bun run check
bun run build
bun run test
bun run preview
```

For browser tests, install Chromium once with `bunx playwright install chromium`. The tests exercise navigation, responsive layouts, FAQ, contact destinations and on-demand video playback without sending messages or making calls.

The static output is `dist/`. GitHub Actions checks and builds the repository; it does not publish a website automatically.

## Deployment configuration

Set `SITE_URL` to the confirmed production origin when deploying. Without it, the build intentionally emits no fabricated canonical URL or sitemap. If publishing under a subdirectory, set `BASE_PATH` as well and rebuild.

```sh
SITE_URL=https://your-confirmed-domain.be BASE_PATH=/ bun run build
```

Internal links and public assets can use `withBase()` from `src/lib/site.ts`; `absoluteUrl(path, Astro.site)` produces a URL only when the production origin is configured. Fonts are self-hosted through Fontsource packages.

## Content and contact

The supplied performance video and extracted stills are used as real evidence of Hamlet's playing. Business details and source references are documented in `docs/sources.md`. Current prices and availability must be confirmed directly with Hamlet; the site does not invent them.

The site has no analytics, tracking pixels, account system or server-side lead database. Its contact links open the chosen communication channel. Review the privacy page whenever adding an external form, analytics or a booking provider.

## Design and maintenance

`PRODUCT.md` captures product facts. `DESIGN.md` and `.impeccable/design.json` capture the final identity and implementation tokens. Keep the real performance footage, truthful claims, keyboard support and mobile layout intact when making changes.

## Attribution

Based on the MIT-licensed [AstroWind](https://github.com/arthelokyo/astrowind) starter. Original license is retained in `LICENSE.md`. The starter's reusable components remain available in source, but demo pages, sample posts and the unused CMS are removed from the published route set.

## Brand assets

Portable outlined SVG logos are in `public/brand/`: a brass logo, a dark-ink variant and a compact six-string H favicon. The full performance is delivered on demand as a 720p MP4 with audio; the original source is not modified.
