# Hamlet Guitar

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Tailwind, copied from Julian's local astro-business-site kit; Bun dependencies. User explicitly delegated creative decisions and requested this GitHub repository.

## Users

People in Merksem and Antwerpen interested in guitar lessons, from first-time players to existing guitarists. Dutch-language local audience is an implementation assumption.

## Product Purpose

Introduce Hamlet as a guitar teacher and let prospective students hear him play, understand the lessons and contact him to arrange a first lesson.

## Positioning

A real local teacher demonstrated through the user's supplied flamenco performance. Personal instruction, no invented result guarantees.

## Capabilities and Constraints

Responsive, accessible static website with an authentic hero performance excerpt and a verified telephone fallback. The current local draft routes primary lesson actions to an in-page inquiry form; submission is not activated and must not be represented as working delivery. Playback attempts sound first and falls back to muted playback when the browser rejects audible autoplay; audible autoplay cannot be guaranteed. One circular speaker button controls sound, and the performance image is a keyboard- and touch-accessible pause/resume control. Reduced-motion preference leaves the hero poster visible until explicit playback. Offscreen and hidden-tab pauses preserve manual pause and mute choices. The former full-performance dialog and visible control bar are removed; the complete video file remains retained but unused by the interface. Real business details must be sourced. Do not invent availability, prices, street address, review counts or credentials. Full creative freedom including new logo explicitly authorized. Save to SavaJulian/hamlet-guitar-site.

## Brand Commitments

Name Hamlet. User-supplied performance footage remains the primary visual proof. Generated conceptual guitar still lifes support the lesson and private-practice sections without implying that they show Hamlet's actual teaching space. Preserve the original six-string H identity; the copied starter is scaffolding, not brand authority.

## Evidence on Hand

User states Hamlet gives guitar lessons in Merksem, Antwerpen. Supplied video filename flamenco_final_v3_1080p.mp4; exact matching file recovered from Downloads because original scratch path is unavailable. Verified business research is recorded in docs/sources.md, including phone and address. Julian explicitly confirmed on 25 October 2026 that the first kennismakingsles is free and requested promoting it on the website. Rates for subsequent lessons and availability remain for Hamlet to confirm. The free introductory lesson duration has not been specified; the sourced 60-minute duration applies to regular lessons. The 12-second hero excerpt and the complete performance derive from this same authentic source; generated section imagery is documented separately in docs/media-manifest.json.

## Product Principles

Show his real playing. Make the first step easy. Explain beginner suitability without diluting flamenco expertise. Keep factual claims traceable.

## Approved homepage copy

Julian approved “Leer gitaar spelen. Op jouw tempo.” on 25 October 2026, replacing the metaphorical opening with a clear lesson offer.

The teacher-section image caption is “Techniek. Ritme. Expressie.” The accompanying conceptual image shows a guitar, practice notebook and pencil. The private-practice section uses a different, wider guitar-and-chair scene beneath “Een uur voor jezelf. Een geluid dat blijft.”

The user-confirmed introductory offer is “Je eerste kennismakingsles is gratis.” It appears beside the hero action, in the contact heading and FAQ. Primary invitations read “Plan je gratis les”. In the 26 October local form draft they point to `#contact`, as does “Maak kennis met Hamlet”; lesson choices preselect the form interest field. This replaces the previous primary phone/SMS flow while retaining a telephone fallback. No deadline, limited availability or follow-up obligation is claimed.

Julian requested removing the distracting grain behind Hamlet in the hero. The real performance excerpt and its poster now use a cleaned near-black background composited onto pure black; the source recording and full performance remain unchanged.

On 26 October 2026 Julian requested sound by default and removal of the prominent sound/pause/full-video bar. The current implementation uses the browser-permitted audible-first behavior and a single discreet speaker button, with playback controlled directly on the image.

## Local inquiry form draft — 26 October 2026

`LessonForm.astro` collects required name and email plus optional telephone, interest and message. Submitting asks to agree a lesson time; it is not a completed booking. A configured `PUBLIC_LESSON_FORM_ENDPOINT` supplies the native POST destination. The value is currently absent, so submission is disabled and explicitly labeled as not enabled.

The recipient is now confirmed privately and must never be written into this public repository, rendered HTML or public URLs. FormSubmit is selected; configure only its opaque endpoint after recipient confirmation. Activation and connected delivery remain pending. Keep the draft on `codex/free-lesson-form` until activation, provider-flow verification and privacy review are complete. The privacy page and `/bedankt` confirmation page are implemented. Twenty-two local browser tests passed, including anonymous endpoint validation and locally intercepted POSTs; this does not establish real delivery or publication.
