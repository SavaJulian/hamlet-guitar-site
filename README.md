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

The static output is `dist/`. GitHub Actions checks and builds every pull request. Successful builds on `main` publish automatically to [the public website](https://savajulian.github.io/hamlet-guitar-site/) through GitHub Pages.

## Deployment configuration

The GitHub Pages workflow sets `SITE_URL=https://savajulian.github.io` and `BASE_PATH=/hamlet-guitar-site`. To reproduce the hosted build locally:

```sh
SITE_URL=https://savajulian.github.io BASE_PATH=/hamlet-guitar-site bun run build
```

For a future custom domain, update these build variables and the hosting configuration together. Without `SITE_URL`, the build emits no canonical URL or sitemap. Internal links and public assets can use `withBase()` from `src/lib/site.ts`; `absoluteUrl(path, Astro.site)` produces a URL only when the production origin is configured. Fonts are self-hosted through Fontsource packages.

## Content and contact

The supplied performance video and its poster are real evidence of Hamlet's playing. The hero uses a 12-second, 720p excerpt that loops muted by default, with visible sound, pause/resume and full-video controls. Reduced-motion visitors initially see the poster and can start playback manually. Playback pauses while the hero is off screen, the browser tab is hidden or the full-video dialog is open.

The teacher and practice sections use two generated conceptual mood images: `lesson-craft.webp` (1122 × 1402) and `practice-corner.webp` (1536 × 1024). Their alt text identifies them as atmosphere; they do not depict Hamlet teaching or his actual studio. Exact prompts are preserved in adjacent `.webp.json` sidecars. `docs/media-manifest.json` distinguishes these images from the authentic footage, and `docs/hero-video.json` records the excerpt's source and encoding.

Business details and source references are documented in `docs/sources.md`. Current prices and availability must be confirmed directly with Hamlet; the site does not invent them. The approved opening is “Leer gitaar spelen. Op jouw tempo.”

The site has no analytics, tracking pixels, account system or server-side lead database. Its contact links open the chosen communication channel. Review the privacy page whenever adding an external form, analytics or a booking provider.

## Design and maintenance

`PRODUCT.md` captures product facts. `DESIGN.md` and `.impeccable/design.json` capture the final identity and implementation tokens. Keep the real performance footage, truthful claims, keyboard support and mobile layout intact when making changes.

## Attribution

Based on the MIT-licensed [AstroWind](https://github.com/arthelokyo/astrowind) starter. Original license is retained in `LICENSE.md`. The starter's reusable components remain available in source, but demo pages, sample posts and the unused CMS are removed from the published route set.

## Brand assets

Portable outlined SVG logos are in `public/brand/`: a brass logo, a dark-ink variant and a compact six-string H favicon. The full 2:36 performance remains a separate 720p MP4 with audio, loaded only when its dialog is opened. The original source is not modified.
