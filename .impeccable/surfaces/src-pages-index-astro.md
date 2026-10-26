---
version: 1
slug: 'src-pages-index-astro'
primary_target: 'src/pages/index.astro'
related_targets:
  - 'src/styles/hamlet.css'
  - 'src/components/Brand.astro'
  - 'src/components/LessonForm.astro'
---

# Home — current implementation

This retained record describes the independent redesign requested by Julian. No installed design skill or generated direction was used to create it.

The homepage uses warm ivory `#f7f5ef`, ink `#242320` and terracotta `#b64b2c`. Bold Manrope carries headings and the wordmark; Bodoni appears in the italic hero tagline and the student quote. The original six-string H remains.

A two-column hero pairs “Leer gitaar spelen. Op jouw tempo.” and the free lesson invitation with a contained black frame of Hamlet playing. Below it: local facts, linked lesson rows, a teacher panel with its attributed quote, a compact practice panel, native FAQ and a dark contact section with a light form. The two conceptual supporting images are identified as atmosphere, not photographs of Hamlet's studio.

All primary lesson invitations target `#contact`; lesson rows preselect interest. Mobile presents the form before route information. The floating lesson action hides when the main hero action or contact section is visible.

The hero attempts sound first and retries muted when the browser refuses. A single speaker button controls sound and the image-sized button pauses/resumes. Reduced motion requires explicit playback; offscreen and hidden-tab pauses preserve manual choices. No prominent control bar or full-video link is used.

The form retains required name/email, optional telephone/interest/message and native POST to an activated opaque FormSubmit endpoint. Recipient details remain private. A request is not a confirmed lesson or proof of inbox receipt.

`DESIGN.md` holds source-based tokens. `PRODUCT.md` holds factual constraints. Verification and deployment are not certified by this record.
