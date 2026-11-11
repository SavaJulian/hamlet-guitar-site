---
name: Hamlet Guitar
description: Klankgat. A white page, one orange from Hamlet's guitar top, photos seen through the soundhole, six strings as the only ornament.
colors:
  paper: '#fbfbf9'
  ink: '#1b1b1f'
  orange: '#f28a1b'
  orange-deep: '#9a4e00'
  mist: '#f1f1ee'
  grey: '#5c5f66'
  text: '#33343a'
  line: '#c9cacd'
  field: '#6f727a'
  error: '#a3261a'
typography:
  display:
    fontFamily: 'Unbounded Variable, Arial Black, Arial, sans-serif'
    fontSize: 'clamp(32px, 4.3vw, 56px)'
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: '-0.02em'
  headline:
    fontFamily: 'Unbounded Variable, Arial Black, Arial, sans-serif'
    fontSize: 'clamp(27px, 3vw, 40px)'
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: '-0.02em'
  body:
    fontFamily: 'Onest Variable, Arial, sans-serif'
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Onest Variable, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 600
    letterSpacing: '0.1em'
  button:
    fontFamily: 'Onest Variable, Arial, sans-serif'
    fontSize: '18px'
    fontWeight: 700
spacing:
  container-max: '1296px'
  gutter: 'clamp(20px, 5vw, 72px)'
  section: 'clamp(56px, 7vw, 96px)'
components:
  button-primary:
    backgroundColor: '{colors.orange}'
    textColor: '{colors.ink}'
    minHeight: '60px'
    padding: '0 30px'
    borderRadius: '30px'
  form-card:
    backgroundColor: '#ffffff'
    padding: 'clamp(22px, 3vw, 36px)'
    borderRadius: '28px'
  form-field:
    backgroundColor: '#ffffff'
    borderColor: '{colors.field}'
    minHeight: '52px'
    borderRadius: '12px'
  video-tile:
    backgroundColor: '{colors.ink}'
    borderRadius: '24px'
---

# Hamlet Guitar — current design

This record follows the source: `src/styles/klankgat.css`, `src/layouts/SiteLayout.astro` and the components beside them. It describes design and behaviour, not a test or deployment result.

## Identity and typography

Off-white `#fbfbf9` is the page; ebony `#1b1b1f` carries text, strings and rings. One orange, `#f28a1b`, sampled from the top of Hamlet's guitar, marks every invitation. Orange is a background for ink text, never a text colour on white; `#9a4e00` is the deeper orange where coloured text is needed. Mist `#f1f1ee` alternates sections.

Unbounded Variable sets headings and the wordmark: wide and round, like the body of the instrument. Onest Variable sets everything else. Both are self-hosted and include Cyrillic for the planned Russian version. Unbounded is wide, so long words set the ceiling for heading sizes.

## Motifs

- **The soundhole.** Hamlet's photo is always round, inside an orange disc with two fine rings and a dotted ring, like a guitar rosette (`Rosette.astro`).
- **Six strings.** Six lines, 4px down to 1px from bass to treble, run across the full width under the hero (`Strings.astro`). Lesson rows repeat the 3, 2, 1px rhythm in their dividers.
- **Pills.** Buttons, chips and the hands photo are fully rounded.

## Layout

The shell is at most 1296px wide with a fluid gutter. Both heroes share one layout: copy on the left, the soundhole on the right, the strings in their own grid row beneath both so they can never run through the text, and the soundhole overlapping them. Below 820px the hero becomes one column and the navigation collapses behind a round menu button.

Home: hero, three video tiles, the booking section on mist (copy and hands photo beside a white form card), a dark band pointing to the lessons. Gitaarles: hero, three lesson rows, the teacher with an attributed quote on mist, a practice section with the hands photo, the lesson form with the location on mist.

## Motion

All motion lives in one `prefers-reduced-motion: no-preference` block and in `src/scripts/site.ts`.

- On arrival the hero copy rises in sequence, the soundhole turns into place and the six strings are strummed from bass to treble. Each string is an SVG path that rings out as a damped sine, lower and longer on the bass side.
- Moving the pointer across the strings plucks them; hovering the main action strums them softly.
- The dotted rosette ring turns very slowly.
- Sections rise into view the first time they are scrolled to.
- Buttons lift and their arrows slide; video thumbnails zoom slightly; lesson rows shift and their arrow turns orange.
- Navigating between the two pages cross-fades, in browsers that support cross-document view transitions.

With reduced motion the strings stay still, nothing is hidden awaiting a reveal, and transitions are effectively instant.

## Components and interaction

Primary buttons are orange pills with ink text and a 60px minimum height. The header carries a small dark pill for the page's own action. Forms use 16px inputs with a 1.5px border, 12px corners and an orange focus ring; errors are named under the field. Video tiles are links with a 16:9 thumbnail and an orange play disc; with scripting they open in a dialog sized to the video's own proportions, and closing returns focus to the tile. Keyboard focus is a 3px ink outline, paper-coloured on dark surfaces.

## Truthful content and conversion

See `PRODUCT.md`. In short: keep the approved lesson headline and button, treat the homepage copy as a proposal until approved, and never add prices, show dates, reviews or qualifications that have not been confirmed. A submitted form is a request, not a booking or proof of inbox delivery.
