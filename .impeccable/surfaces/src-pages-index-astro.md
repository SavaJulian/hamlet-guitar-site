---
version: 1
slug: 'src-pages-index-astro'
primary_target: 'src/pages/index.astro'
related_targets: []
---

# Home — Persuade

Julian delegated all creative choices, including identity and placement of the film. We proceed directly in code under that explicit authorization; no standing build-path preference is inferred for future sessions. The roll ran degraded because its service was unavailable; no challenger or quality-bar board was supplied.

Candidates considered: record sleeve, Antwerp arts programme, contemporary dance score, music-school exercise folio, intimate recital stage, independent radio session, luthier workshop. The assigned fifth direction is the recital stage.

## Direction contract

THESIS: A private performance becomes an invitation to play. Hamlet's actual skill earns the booking; no inflated marketing proof.
OWN-WORLD: Smoked plum stage, muted brass and lavender spotlights, white-shirt brightness, high-contrast Bodoni Moda display and precise Manrope text. Full-bleed real footage, restrained rules and rectangular actions. Original six-string H monogram. Distinct conceptual guitar still lifes introduce lesson craft and private practice below the hero.
STORY: Hear the teacher, imagine yourself learning, choose a starting point, ask Hamlet for a lesson. Beginners feel welcome while flamenco remains the expertise.
FIRST VIEWPORT: Slim wordmark/navigation above a widescreen performance stage. A 12-second excerpt of Hamlet playing sits behind the approved headline “Leer gitaar spelen. Op jouw tempo.” and the user-confirmed free introductory lesson offer. Primary actions read “Plan je gratis les” and lead to `#contact`; the gold contact section contains the inquiry form and the FAQ reinforces the same offer. As refined on 26 October 2026, the performance attempts sound first and falls back to muted playback if browser autoplay policy rejects it. A single 44px circular speaker control sits at the lower left; tapping the image or using its keyboard-accessible button pauses/resumes playback. Reduced-motion visitors initially see the authentic poster. Below, a full-width local lesson information strip anchors place, personal format and level.
FORM: Intimate recital stage, fifth grounded candidate. seed:1e315c713eb4819f. Signature interaction: the hero performance attempts audible autoplay, with a muted fallback on NotAllowedError. A transparent image-sized playback button shows its hint only when paused or keyboard-focused. A discreet speaker button carries its action through an accessible name, tooltip and icon. Playback pauses off screen and in a hidden tab while preserving manual choices. Reduced motion requires explicit play. No full-video modal or link remains; a load failure offers a retry link and disables the controls. The complete logo skews gently on hover, respecting reduced motion.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Section imagery

The teacher section uses `lesson-craft.webp` (1122 × 1402), a generated guitar-and-notebook still life, with the caption “Techniek. Ritme. Expressie.” The private-practice section uses `practice-corner.webp` (1536 × 1024), a different generated guitar-and-chair scene. Their alt descriptions identify them as “Sfeerbeeld”. Neither image depicts Hamlet teaching or claims to show his actual studio. The genuine footage and performance poster remain the proof of his playing. Exact prompts are preserved in matching `.webp.json` sidecars; `docs/media-manifest.json` records the distinction.

## Inquiry form — 26 October 2026

The invitation now leads to one form within the established gold contact section. Every “Plan je gratis les” link and “Maak kennis met Hamlet” targets `#contact`; lesson-choice links preselect the experience/interest option. The former primary phone/SMS flow is replaced, with telephone retained as a secondary fallback.

Required name/email and optional phone, interest and message support an inquiry to arrange a time, not a booking confirmation. Native POST uses an activated opaque FormSubmit endpoint through `PUBLIC_LESSON_FORM_ENDPOINT`, supplied in deployment by repository variable `LESSON_FORM_ENDPOINT`. The privately confirmed receiving address remains absent from public source and URLs, and the endpoint validator rejects exposed-email URLs. Privacy and `/bedankt` pages are implemented. Twenty-two local browser tests passed, including endpoint validation and intercepted POSTs. Activation is confirmed; deployment and actual production inbox delivery are verified separately.

Visually the form belongs directly to the gold surface: straight-edged pale-gold inputs, ink text/focus and a dark submit action. Desktop places it beside the offer and location; mobile stacks the content. Field labels and errors remain in the reading order, and no added card or modal interrupts the invitation.
