# Hamlet — gitaarles in Merksem

A Dutch-language website for Hamlet's guitar lessons in Merksem, Antwerpen. Built from Julian's local AstroWind website kit using Astro, Tailwind and Bun.

The current visual direction is a user-requested independent redesign. No installed design skill was used. Warm ivory, bold Manrope type and terracotta actions surround Hamlet's authentic performance in a contained black video frame.

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

For browser tests, install Chromium once with `bunx playwright install chromium`. Tests cover navigation, responsive layouts, FAQ, contact destinations, form validation and hero playback without sending messages or making calls. These commands describe the verification workflow; this document does not certify the current build or production delivery.

The static output is `dist/`. GitHub Actions checks and builds pull requests. Successful builds on `main` publish automatically to [the public website](https://savajulian.github.io/hamlet-guitar-site/) through GitHub Pages.

## Deployment configuration

The GitHub Pages workflow sets `SITE_URL=https://savajulian.github.io` and `BASE_PATH=/hamlet-guitar-site`. To reproduce the hosted build locally:

```sh
SITE_URL=https://savajulian.github.io BASE_PATH=/hamlet-guitar-site bun run build
```

For a custom domain, update these variables and the hosting configuration together. Without `SITE_URL`, the build emits no canonical URL or sitemap. `withBase()` in `src/lib/site.ts` handles internal links and assets; `absoluteUrl(path, Astro.site)` returns a URL only when the production origin is configured. Routes use trailing slashes. Fonts are self-hosted through Fontsource packages.

## Content and playback

The approved opening is “Leer gitaar spelen. Op jouw tempo.” The free kennismakingsles is user-confirmed. Subsequent prices and availability must be confirmed with Hamlet. Business details and references are in `docs/sources.md`.

The authentic 12-second, 720p hero excerpt first attempts playback with sound. When the browser rejects audible autoplay, it retries muted. A single 44px speaker button controls sound; the performance image is a keyboard-accessible pause/resume button. Its hint appears when paused or focused. Reduced-motion visitors see the poster until they explicitly play. Offscreen and hidden-tab pauses retain manual choices. Loading failures disable controls and provide a retry link.

The excerpt and matching poster have a plain black background. `docs/hero-video.json` records their source and encoding. The complete 2:36 performance is retained in the media archive but is not loaded or linked by the interface; the original recording is unchanged.

The teacher and practice sections use different generated conceptual images: `lesson-craft.webp` (1122 × 1402) and `practice-corner.webp` (1536 × 1024). Their alt text identifies them as “Sfeerbeeld”; neither depicts Hamlet teaching or his actual studio. Prompts remain in adjacent `.webp.json` sidecars, with provenance in `docs/media-manifest.json`.

## Lesson inquiries and privacy

Every “Plan je gratis les” action and “Maak kennis met Hamlet” leads to `#contact`. Lesson rows preselect `#lesson-interest`. The light form panel sits inside the dark contact section. On mobile, the form comes before the route information; the floating lesson action hides while the hero's primary action or contact section is visible.

`src/components/LessonForm.astro` requests name and email, with optional phone, experience/interest and message. Submission requests a lesson time, not a confirmed booking. The verified telephone number remains a fallback. The site has no analytics, tracking pixels, account system or own lead database.

Native `POST` uses an activated opaque FormSubmit endpoint. GitHub repository variable `LESSON_FORM_ENDPOINT` supplies `PUBLIC_LESSON_FORM_ENDPOINT` during builds; local development uses the latter in ignored `.env`. `src/lib/lessonForm.ts` accepts only an anonymous HTTPS FormSubmit identifier and rejects exposed-email URLs without logging the rejected value. The receiving address remains private and absent from public source, HTML, documentation and URLs.

The POST includes a subject, table template and base-aware `_next` URL for `/bedankt/`. Provider reCAPTCHA remains enabled. The privacy page describes provider processing and [FormSubmit's documented 30-day submission archive](https://formsubmit.co/documentation). Neither a loading message nor the thank-you page proves inbox receipt; production delivery requires a separate controlled check.

To change the receiving inbox:

1. Activate the new inbox privately with FormSubmit and obtain its opaque endpoint. Never commit an email-address endpoint.
2. Update repository variable `LESSON_FORM_ENDPOINT` and, when needed, `PUBLIC_LESSON_FORM_ENDPOINT` in ignored local `.env`.
3. Rebuild and deploy so the static form receives the new endpoint.
4. Verify a controlled submission, return to `/bedankt/` and actual receipt in the new inbox.

## Design and maintenance

`PRODUCT.md` records product facts. `DESIGN.md` records current tokens, layouts and interactions. `docs/direction.md` summarizes the independent design direction. Files retained under `.impeccable/` are descriptive metadata, not an active workflow or design authority.

Portable outlined SVG logos are in `public/brand/`: a light wordmark for dark surfaces, an ink wordmark for light surfaces, and the six-string H favicon. Terracotta and bold Manrope align the assets with the interface. Preserve genuine footage, traceable claims, keyboard support and recipient privacy when editing.

## Attribution

Based on the MIT-licensed [AstroWind](https://github.com/arthelokyo/astrowind) starter. The original license remains in `LICENSE.md`. Reusable starter components remain in source; demo pages, sample posts and the unused CMS are removed from the published route set.
