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

For browser tests, install Chromium once with `bunx playwright install chromium`. The tests exercise navigation, responsive layouts, FAQ, contact destinations and hero playback behavior without sending messages or making calls.

The static output is `dist/`. GitHub Actions checks and builds every pull request. Successful builds on `main` publish automatically to [the public website](https://savajulian.github.io/hamlet-guitar-site/) through GitHub Pages.

## Deployment configuration

The GitHub Pages workflow sets `SITE_URL=https://savajulian.github.io` and `BASE_PATH=/hamlet-guitar-site`. To reproduce the hosted build locally:

```sh
SITE_URL=https://savajulian.github.io BASE_PATH=/hamlet-guitar-site bun run build
```

For a future custom domain, update these build variables and the hosting configuration together. Without `SITE_URL`, the build emits no canonical URL or sitemap. Internal links and public assets can use `withBase()` from `src/lib/site.ts`; `absoluteUrl(path, Astro.site)` produces a URL only when the production origin is configured. Fonts are self-hosted through Fontsource packages.

## Content and contact

The supplied performance video and its poster are real evidence of Hamlet's playing. As requested on 26 October 2026, the 12-second, 720p hero excerpt first attempts playback with sound. Browsers that reject audible autoplay trigger a muted fallback; automatic sound is not guaranteed. A single 44px circular speaker button controls sound, with an accessible name and tooltip but no visible text label. Click or tap the performance image, or focus its transparent playback button and use the keyboard, to pause or resume. A play/pause hint appears when paused or keyboard-focused. Reduced-motion visitors see the poster until they explicitly start playback, initially with sound. Playback pauses off screen and in a hidden tab while retaining manual pause and mute choices. A loading error disables the media controls and exposes a retry link.

The teacher and practice sections use two generated conceptual mood images: `lesson-craft.webp` (1122 × 1402) and `practice-corner.webp` (1536 × 1024). Their alt text identifies them as atmosphere; they do not depict Hamlet teaching or his actual studio. Exact prompts are preserved in adjacent `.webp.json` sidecars. `docs/media-manifest.json` distinguishes these images from the authentic footage, and `docs/hero-video.json` records the excerpt's source and encoding.

Business details and source references are documented in `docs/sources.md`. Current prices and availability must be confirmed directly with Hamlet; the site does not invent them. The approved opening is “Leer gitaar spelen. Op jouw tempo.”

The site has no analytics, tracking pixels, account system or server-side lead database. Form submissions use FormSubmit, and the verified telephone number remains available as a fallback. The receiving address is confirmed privately and remains absent from public source, HTML, documentation and URLs. The privacy page describes the provider flow, and `/bedankt` distinguishes a submitted request from a confirmed lesson.

## Lesson inquiry form

Every “Plan je gratis les” action and “Maak kennis met Hamlet” leads to `#contact`. `src/components/LessonForm.astro` sits in the gold contact section; lesson choices preselect `#lesson-interest`. The form requests name and email, with optional phone, experience/interest and a message. It is an inquiry to agree a lesson time, not a confirmed booking.

The form uses native browser `POST` to an opaque FormSubmit endpoint. Recipient activation was confirmed on 26 October 2026. GitHub's repository variable `LESSON_FORM_ENDPOINT` supplies `PUBLIC_LESSON_FORM_ENDPOINT` during builds; local development uses the latter in ignored `.env`. `src/lib/lessonForm.ts` accepts only an anonymous HTTPS FormSubmit identifier and rejects addresses exposed in endpoint URLs without echoing the rejected value into logs. No receiving email belongs in this repository.

The POST includes a subject, table template and a base-aware `_next` URL for `/bedankt/`. A loading message or thank-you page is not proof that the recipient's inbox received the request. [FormSubmit's documentation](https://formsubmit.co/documentation) describes the opaque identifier and a 30-day submission archive; the privacy page reflects that provider behavior.

Twenty-two local browser tests passed, including endpoint validation and intercepted POSTs. Activation is confirmed; final configured checks, deployment and real production delivery are verified separately and are not claimed complete here.

### Change the receiving inbox

1. Confirm the new inbox privately with FormSubmit and obtain its activated opaque endpoint. Never commit the receiving email or use an email-address URL.
2. Update the GitHub repository variable `LESSON_FORM_ENDPOINT`; update `PUBLIC_LESSON_FORM_ENDPOINT` in ignored local `.env` when needed.
3. Rebuild and deploy so the static form receives the new endpoint. The existing `main` workflow publishes successful builds automatically.
4. Verify a controlled submission, the `/bedankt/` return and receipt in the new inbox. Preserve the telephone fallback and review privacy information if the provider changes.

## Design and maintenance

`PRODUCT.md` captures product facts. `DESIGN.md` and `.impeccable/design.json` capture the final identity and implementation tokens. Keep the real performance footage, truthful claims, keyboard support and mobile layout intact when making changes.

## Attribution

Based on the MIT-licensed [AstroWind](https://github.com/arthelokyo/astrowind) starter. Original license is retained in `LICENSE.md`. The starter's reusable components remain available in source, but demo pages, sample posts and the unused CMS are removed from the published route set.

## Brand assets

Portable outlined SVG logos are in `public/brand/`: a brass logo, a dark-ink variant and a compact six-string H favicon. The full 2:36 performance remains a separate 720p MP4 with audio in the media archive, but the current interface does not link to or load it. The previous full-video dialog and visible control bar were removed on 26 October 2026. The original source is not modified.
