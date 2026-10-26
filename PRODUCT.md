# Hamlet Guitar

<!-- impeccable:product-schema 1 -->

## Purpose and audience

A Dutch-language local website introducing Hamlet's guitar lessons to beginners and existing players in Merksem and Antwerpen. His real flamenco performance demonstrates his playing; clear lesson choices and one inquiry form make the next step easy.

## Platform

Static Astro + Tailwind site, built from Julian's local business-site kit with Bun. Repository: `SavaJulian/hamlet-guitar-site`. Hosting: GitHub Pages. The current design was independently implemented at Julian's request without installed design skills.

## Confirmed offer and business facts

- Gitaarlessen Hamlet, Bredabaan 479, 2170 Merksem / Antwerpen.
- Public telephone: +32 483 50 22 20.
- Lessons for beginners and advanced players, including Spanish guitar and flamenco.
- The first kennismakingsles is free, confirmed by Julian. Its duration is unspecified; the sourced 60-minute duration applies to regular lessons.
- Rates after the introduction and current availability require confirmation from Hamlet.
- Source references, including the Google profile and attributed student review, are in `docs/sources.md`. Published rating information is previously verified evidence, not a live feed.

Do not invent credentials, lesson outcomes, prices, scarcity or availability.

## Content and identity

Preserve the approved opening: “Leer gitaar spelen. Op jouw tempo.” Primary actions read “Plan je gratis les”; “Maak kennis met Hamlet” also leads to the inquiry form.

The identity pairs the original six-string H with a bold Manrope wordmark. Warm ivory, ink and terracotta support a friendly, clear guitar-studio presentation. The authentic performance sits in a contained black hero frame. Linked lesson rows lead into a teacher panel with an attributed student quote, a compact practice panel, FAQ and a dark contact section with a light form.

The user-supplied recording is the evidence of Hamlet's playing. The cleaned hero excerpt and poster use a plain black backdrop; the original recording remains unchanged. The complete performance is retained but unused by the interface. `lesson-craft.webp` and `practice-corner.webp` are distinct conceptual mood images, identified as “Sfeerbeeld”; neither claims to show Hamlet teaching or his actual studio. See `docs/media-manifest.json` and `docs/hero-video.json`.

## Interaction requirements

The hero attempts playback with sound and retries muted if the browser refuses audible autoplay. A small speaker controls sound, while the image-sized playback button supports pause/resume by touch and keyboard. Reduced motion starts with the poster. Offscreen and hidden-tab pauses preserve manual choices; load errors expose a retry. Do not promise automatic sound in every browser.

Primary lesson actions lead to `#contact`; lesson rows preselect the interest field. On mobile, the contact form precedes the route information. The floating lesson action hides while the hero's primary action or the contact section is visible.

## Inquiry and privacy

The form collects required name/email and optional telephone, interest and message. It requests a time for a free introductory lesson; it does not confirm a booking. The telephone remains a fallback.

Native POST uses an activated opaque FormSubmit endpoint through repository variable `LESSON_FORM_ENDPOINT` and build variable `PUBLIC_LESSON_FORM_ENDPOINT`. Local configuration stays in ignored `.env`. The endpoint validator rejects addresses exposed in URLs. The receiving address must remain absent from public source, HTML, documentation and URLs.

The privacy page explains provider processing, and `/bedankt/` describes the submitted inquiry. No analytics, tracking pixels, account system or own lead database is present. Actual inbox receipt is verified separately from form activation, browser tests or the thank-you page.
