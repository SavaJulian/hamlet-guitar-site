# Hamlet Guitar

<!-- impeccable:product-schema 1 -->

## Purpose and audience

A Dutch-language local website for Hamlet, a flamenco guitarist and guitar teacher in Merksem, Antwerpen. It is one site with two pages and two jobs:

- **Home (`/`), live music.** For café and restaurant owners and people organising a party or event. Its one job is a request to book an evening of live flamenco guitar.
- **Gitaarles (`/gitaarles/`).** For beginners and existing players nearby, and the landing page for advertising traffic. Its one job is a request for the free first lesson.

A Russian version is expected later; every font must cover Cyrillic.

## Platform

Static Astro site built with Bun. Repository: `SavaJulian/hamlet-guitar-site`. Hosting: GitHub Pages. The visual direction is “Klankgat”, chosen by Julian on 11 November 2026 from six moodboards.

## Confirmed offer and business facts

- Gitaarlessen Hamlet, Bredabaan 479, 2170 Merksem / Antwerpen.
- Public telephone: +32 483 50 22 20.
- Hamlet performs live flamenco guitar; Julian asked on 11 November 2026 for café and restaurant evenings, shows and events to be the centre of the homepage.
- Lessons for beginners and advanced players, including Spanish guitar and flamenco.
- Hamlet has 24 years of experience, confirmed by Julian on 26 October 2026. This does not establish 24 years of teaching, a career start year or qualifications; do not increment the figure automatically.
- The first kennismakingsles is free, confirmed by Julian. Its duration is unspecified; the sourced 60-minute duration applies to regular lessons.
- Lesson rates, performance fees, the length of a performance, technical needs and the region Hamlet travels to are not confirmed. Do not state them.
- Source references, including the attributed student review, are in `docs/sources.md`.

Do not invent credentials, lesson outcomes, prices, show dates, scarcity or availability.

## Content and identity

- Approved lesson headline and action: “Leer gitaar spelen. Op jouw tempo.” and “Plan je gratis les”. “Maak kennis met Hamlet” also leads to the lesson form.
- The homepage headline “Live flamencogitaar in cafés en restaurants.”, its supporting copy, “Boek een avond” and the video captions “Live op het podium” and “Van dichtbij” are proposals awaiting Julian's approval.
- Julian decided on 11 November 2026: no show agenda on the site, and no FAQ on either page for now (possibly later).
- The identity keeps the six-string H with a lowercase “hamlet.” wordmark in Unbounded. A separate logo selection is still running at `/logo-keuze/`.

## Media

- The photo of Hamlet comes from his show poster, supplied by Julian. The poster's lettering is not site copy. `hamlet-portret.webp` is a crop in which the poster text beside and above his head was painted out of the red backdrop; Hamlet himself is untouched. `hamlet-handen.webp` is a plain crop.
- Three performance videos supplied by Julian: one YouTube video (“Rumba Philip John Lee Played By Hamlet”) and two recordings from his Drive folder, re-encoded for the web. See `docs/media-manifest.json`.
- Earlier assets (`hamlet-hero.mp4`, `hamlet-flamenco.mp4`, `hamlet-performance.webp`, the two conceptual “Sfeerbeeld” images) remain in `public/media/` but are not used by any page.

## Interaction requirements

- Every primary action on a page leads to that page's form: `#boeken` on the homepage, `#contact` on the lesson page. Lesson rows preselect the interest field.
- Video tiles are ordinary links that open in a dialog when scripting is available. The YouTube video is requested from `youtube-nocookie.com` only after the visitor clicks.
- On small screens a floating action appears while neither the hero action nor the form is in view.
- Motion is decoration only and is switched off for visitors who prefer reduced motion.

## Inquiry and privacy

Both forms collect required name and email. The booking form adds optional telephone, kind of evening, preferred date and message; the lesson form adds optional telephone, interest and message. Each is a request, not a confirmed booking or lesson. The telephone remains a fallback.

Both use a native POST to the same activated opaque FormSubmit endpoint, through repository variable `LESSON_FORM_ENDPOINT` and build variable `PUBLIC_LESSON_FORM_ENDPOINT`, with different subjects and thank-you pages (`/bedankt-boeking/`, `/bedankt/`). Local configuration stays in ignored `.env`. The endpoint validator rejects addresses exposed in URLs. The receiving address must remain absent from public source, HTML, documentation and URLs.

The privacy page explains provider processing and the YouTube video. No analytics, tracking pixels, account system or own lead database is present. Actual inbox receipt is verified separately from form activation, browser tests or the thank-you pages.
