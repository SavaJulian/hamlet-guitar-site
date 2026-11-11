---
version: 1
slug: 'src-pages-index-astro'
primary_target: 'src/pages/index.astro'
related_targets:
  - 'src/pages/gitaarles.astro'
  - 'src/styles/klankgat.css'
  - 'src/scripts/site.ts'
  - 'src/components/BookingForm.astro'
  - 'src/components/LessonForm.astro'
---

# Home and lesson page — current implementation

This retained record describes the Klankgat direction chosen by Julian on 11 November 2026.

Both pages use off-white `#fbfbf9`, ebony `#1b1b1f` and one orange, `#f28a1b`, from the top of Hamlet's guitar. Unbounded carries headings and the wordmark; Onest carries the rest. The six-string H remains.

The homepage is about live music: “Live flamencogitaar in cafés en restaurants.” beside Hamlet's photo in a soundhole, six strings beneath, three performance videos, a short booking form and a band that points to the lessons. `/gitaarles/` keeps “Leer gitaar spelen. Op jouw tempo.” with the free lesson invitation, three lesson rows, the teacher with an attributed quote, a practice section and the lesson form with the location. There is no show agenda and no FAQ.

Every primary action targets the form on its own page; lesson rows preselect interest. A floating action appears on small screens while neither the hero action nor the form is visible.

The strings are strummed on arrival and can be plucked with the pointer; sections rise into view; the two pages cross-fade. All of it is disabled under reduced motion. Videos open in a dialog, and YouTube is contacted only after a click.

Both forms require name and email and use a native POST to an activated opaque FormSubmit endpoint. Recipient details remain private. A request is not a confirmed booking, lesson or proof of inbox receipt.

`DESIGN.md` holds source-based tokens. `PRODUCT.md` holds factual constraints. Verification and deployment are not certified by this record.
