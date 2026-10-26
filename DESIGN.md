---
name: Hamlet Guitar
description: An intimate recital stage for personal guitar lessons.
colors:
  ink: '#252025'
  gold: '#ddc185'
  lavender: '#d7cfdf'
  paper: '#f0eeea'
  muted: '#bdb7bd'
  line: '#4b414a'
  gold-hover: '#ecdaa9'
  ink-hover: '#483949'
  paper-rule: '#bfb9bf'
  brass-text: '#77603a'
typography:
  display:
    fontFamily: 'Bodoni Moda Variable, Georgia, serif'
    fontSize: 'clamp(48px, 4.7vw, 68px)'
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: '-0.035em'
  headline:
    fontFamily: 'Bodoni Moda Variable, Georgia, serif'
    fontSize: 'clamp(42px, 4.5vw, 66px)'
    fontWeight: 450
    lineHeight: 1.06
    letterSpacing: '-0.035em'
  title:
    fontFamily: 'Bodoni Moda Variable, Georgia, serif'
    fontSize: '40px'
    fontWeight: 450
    lineHeight: 1.12
    letterSpacing: '-0.025em'
  body:
    fontFamily: 'Manrope Variable, Arial, sans-serif'
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.7
  reading:
    fontFamily: 'Manrope Variable, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.85
  button:
    fontFamily: 'Manrope Variable, Arial, sans-serif'
    fontSize: '12px'
    fontWeight: 750
    lineHeight: 1.4
spacing:
  control-gap: '32px'
  link-gap: '24px'
  paragraph-gap: '20px'
components:
  button-primary:
    backgroundColor: '{colors.gold}'
    textColor: '{colors.ink}'
    typography: '{typography.button}'
    padding: '16px 22px'
  button-primary-hover:
    backgroundColor: '{colors.gold-hover}'
  button-dark:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.button}'
    padding: '16px 22px'
  button-dark-hover:
    backgroundColor: '{colors.ink-hover}'
  media-control:
    backgroundColor: '#0008'
    textColor: '{colors.gold}'
    borderColor: '#ddc18566'
    width: '44px'
    height: '44px'
    borderRadius: '50%'
    padding: '0'
  form-field:
    backgroundColor: '#ead6a9'
    textColor: '{colors.ink}'
    borderColor: '#8e7544'
    minHeight: '50px'
    padding: '12px 13px'
  form-submit:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    minHeight: '55px'
    padding: '16px 22px'
  lesson-option:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    padding: '34px 34px 10px 0'
---

# Design System: Hamlet Guitar

Playback controls reconciled with source on 26 October 2026. Inquiry-form notes below describe the implemented form and confirmed provider activation; production delivery is verified separately.

## Overview

**Creative North Star: "The Intimate Recital Stage"**

An intimate recital stage: smoked plum grounds the interface, brass marks invitations, and paper and lavender give the performance room to breathe. Hamlet's authentic footage and extracted poster, with a cleaned plain black backdrop, carry the identity alongside an original six-string H monogram. Two generated guitar still lifes provide distinct lesson and home-practice atmosphere below the hero, without claiming to show his actual studio.

High-contrast Bodoni Moda gives headings a musical cadence; Manrope keeps practical information direct. Broad tonal sections, asymmetrical grids and fine rules create a composed, personal atmosphere without card shadows.

**Key Characteristics:**

- Real performance footage, conceptual lesson imagery and an original six-string H.
- Bodoni Moda display with restrained italic emphasis.
- Rectangular lesson actions, one circular speaker control, fine rules and broad tonal sections.

## Colors

Smoked plum and muted brass anchor the palette; lavender and warm paper soften its contrast.

### Primary

- **Muted brass (gold):** wordmark, main invitation, contact section and key links. Its lighter hover variant belongs to filled actions; dark brass text belongs on paper.

### Secondary

- **Lavender:** teacher heading and testimonial background.

### Neutral

- **Smoked plum (ink):** page ground, dark action and text on light sections.
- **Warm paper:** main text on dark backgrounds and explanatory section surfaces.
- **Muted:** supporting text on ink.
- **Line / paper rule:** dark-surface and light-surface dividers respectively.

**The Stage and Light Rule.** Use ink for the stage, paper for explanatory sections, lavender for a quiet testimonial pause and gold for invitations.

## Typography

**Display Font:** Bodoni Moda Variable, with Georgia and serif fallbacks. **Body Font:** Manrope Variable, with Arial and sans-serif fallbacks. Both are self-hosted; the home page also loads the Bodoni italic face.

The display is expressive and tightly tracked, while body text and controls stay steady. The frontmatter records the implemented hierarchy, not a mathematical scale: the display belongs to the performance heading, headline to section headings, title to lesson choices, reading to explanatory copy, and button to primary actions. The approved hero reads “Leer gitaar spelen. Op jouw tempo.” with the second sentence in italic. Italic emphasis retains the serif family.

Mobile display is 52px, then 46px below 370px; section headlines are 43px. Lesson titles become 29px. Final mobile overrides keep main explanatory paragraphs at 14px and FAQ questions at 13px. Other section-specific heading sizes are adaptations rather than new universal roles. Reading measures are generally 320–470px; privacy copy has its own wider reading container.

**The Two Voices Rule.** Use Bodoni Moda for expressive headings and Manrope for practical reading and controls.

## Layout

Broad sections alternate ink, paper, lavender and gold. Desktop section gutters use `max(5.1%, calc((100vw - 1294px) / 2))`; the header caps at 1440px and performance stage at 1920px. Split layouts use unequal tracks, while lesson options form three equal columns with rules. Main section padding is approximately 75–110px vertically; it is deliberately not a fabricated uniform spacing scale.

At 1100px navigation and split-layout spacing tighten. At 760px navigation collapses to an expandable list, content stacks, section gutters become 7%, and a fixed call action uses the device safe-area inset. Lesson choices become horizontal title/copy rows within a vertical list. The stage video or poster occupies the upper mobile area, with one circular speaker control above the copy and a transparent tap/keyboard playback area covering the image. A 761–900px correction reduces display size, and 1600px adds a larger stage. The final mobile line-break overrides are authoritative.

Privacy uses a centered 740px reading column with 24px minimum side space; the 404 page uses a 700px container. These are supporting-page adaptations.

## Elevation & Depth

No box-shadow vocabulary is used. Depth comes from photographic cropping, dark image gradients, solid tonal bands and thin borders. The current performance has no dialog or modal backdrop.

**The Ruled Surface Rule.** Separate lesson choices and questions with fine rules; use tonal contrast and imagery for depth.

## Shapes

Lesson actions and images use straight edges. The speaker is the deliberate circular exception: a 44px control with a 50% radius. Thin outlined SVGs use current color and rounded stroke ends; rating stars use fills. The six-string H is six vertical strokes crossed by a horizontal bar.

## Components

### Buttons

Ticket-like filled actions use the primary and dark variants recorded above, a 55px minimum height and a transparent 1px border. The arrow moves 5px on hover; color transitions last 250ms. Primary “Plan je gratis les” actions and “Maak kennis met Hamlet” lead to `#contact`. The form has a distinct dark submit action described below. Focus uses a 2px outline with 6px offset, gold on dark surfaces and dark ink in the contact section.

### Links

Underlined action links use a fine current-color bottom rule and 7px bottom padding. Their gap grows from 24px to 32px on hover. Navigation links change to gold over 200ms. Preserve contextual dark focus colors on light surfaces.

### Lesson choices

These are linked columns within a ruled section, not elevated cards. Headings change to dark brass and arrows move 8px on hover. Focus uses ink with a 4px offset. Mobile converts vertical dividers into horizontal separators.

### Navigation

The desktop navigation uses Manrope at 12px/500 with 32px gaps. The mobile menu button is 44px square; its two thin strokes rotate into a close mark as `aria-expanded` changes. The list exposes normal text links with generous vertical padding.

### Questions

Native details/summary rows use top and bottom rules. Questions use 13px/650 text with 24px vertical padding. The inline plus rotates 45 degrees when open. Answers remain in document flow; the final mobile answer size is 13px.

### Inquiry form

The form is implemented in `src/components/LessonForm.astro` inside the gold contact surface. It uses the privately confirmed recipient's activated opaque FormSubmit endpoint; no receiving email appears in public source or URLs. The privacy and `/bedankt` pages are implemented. Twenty-two local browser tests passed, including endpoint validation and intercepted POSTs; actual production delivery is verified separately.

The desktop contact section uses `1fr 1.1fr` columns with a 44px row gap and 8% column gap. Offer and location occupy the left; the form occupies the right, spanning both rows. The section becomes one reading sequence below 760px. The form is at most 650px wide and uses its containing inline size to switch fields from one column to two at 460px; the message remains full width. Field gaps are 22px vertically and 20px horizontally.

Labels are 13px/700 Manrope, with 11px secondary required/optional annotations. Inputs, select and textarea use 16px text, ink carets, pale gold `#ead6a9`, a 1px `#8e7544` border, square corners and 12px × 13px padding. Inputs and select are at least 50px tall; textarea is at least 102px and resizes vertically. Focus uses ink borders and a 2px outline at 2px offset, with `#f0e0bd` fill. Invalid required fields use `#722c31` borders and adjacent 12px error text connected by `aria-describedby`.

The submit action reads “Vraag je gratis les aan”, with 13px/750 text, a 55px minimum height, ink fill and paper text. Disabled state uses `#635543` with a not-allowed cursor. A pending POST disables it, marks it busy and changes its label to “Je aanvraag wordt verstuurd…”. That state is not delivery confirmation; the `/bedankt` page follows the provider response. Below 600px the submit action spans the form width. Reduced motion removes field/button transitions.

The request contains required name/email and optional phone, interest and message. Lesson links preselect the interest. The form explicitly says the lesson is not yet booked. A polite live status communicates validation and sending states; a privacy link and 44px-minimum telephone fallback follow. In-page validation focuses the first invalid required field. A valid activated form uses native POST rather than inventing an in-page success message. Build-time `PUBLIC_LESSON_FORM_ENDPOINT` must use the opaque FormSubmit identifier, keeping the confirmed private recipient out of public source and URLs. GitHub repository variable `LESSON_FORM_ENDPOINT` supplies the endpoint at build time; invalid exposed-email endpoints fail validation. If the endpoint is absent, the disabled fallback state remains available. Activation is confirmed; live delivery and deployment are checked separately.

### Performance controls

The 12-second authentic hero excerpt attempts audible autoplay. If the browser rejects that play request with `NotAllowedError`, it retries muted; the design does not promise sound before a visitor interacts. Reduced-motion visitors receive the poster without a video request until explicit playback, which initially requests sound.

The only persistent media control is a 44px circular speaker button. It uses `#0008`, gold icon strokes and a 1px `#ddc18566` border; hover changes the background to ink and border to gold over 200ms. The action is conveyed by its icon, accessible name and tooltip, with no visible label. It sits 32px from the stage bottom and 5.1% from the left on desktop. On mobile it sits 272px from the stage top and 7% from the left, moving to 246px below 370px. Disabled opacity is 0.4.

A transparent button covers the performance area: the left 62% on desktop, and the full-width top 340px on mobile (310px below 370px). Tapping or keyboard-activating it toggles playback. Its centered hint uses 12px gold text, a fine gold border and `#000c`; it is visible only when paused or keyboard-focused. Focus on the image uses an inward outline offset of -6px.

Playback pauses outside the viewport or in a hidden tab and preserves manual pause and mute choices. A load failure disables both controls and reveals “De video kon niet laden. Opnieuw proberen”, linked to the current base path. The status sits above the speaker and clear of the heading. Reduced motion removes transitions and animations and disables smooth scrolling.

The visible sound/pause/full-video bar and full-performance dialog were removed on 26 October 2026 at the user's request. The full 2:36 performance file is retained but is neither linked nor loaded by the current interface.

### Section imagery

`lesson-craft.webp` is a 1122 × 1402 conceptual close-up of a classical guitar, practice notebook and pencil. It accompanies “Een gitarist. Een leraar. Jouw gids.” and the caption “Techniek. Ritme. Expressie.” The teacher panel crops it with `object-fit: cover`, centered on desktop and at `center 32%` on mobile.

`practice-corner.webp` is a separate 1536 × 1024 conceptual home-practice scene with a guitar and empty wooden chair. The practice panel crops it to a 1.3 aspect ratio on desktop and 1.45 on mobile, with `object-position: 38% center`. Both alt descriptions begin with “Sfeerbeeld”; neither image is evidence of Hamlet's actual studio or teaching activity. Exact generation prompts accompany each asset in a `.webp.json` sidecar.

### Brand

The brass wordmark pairs Bodoni lettering with the six-string H. Hover skews the complete mark by -8 degrees over 600ms; the shipped interaction does not animate individual strings. Preserve the mark geometry and accessible homepage label.

## Do's and Don'ts

### Do:

- **Do** use real Hamlet footage as performance proof and preserve the six-string H identity.
- **Do** distinguish conceptual section imagery from authentic footage in alt descriptions and provenance.
- **Do** preserve the serif/sans division and the established light-on-dark or dark-on-light pairings.
- **Do** keep visible keyboard focus, accessible image and sound controls, and reduced-motion support.
- **Do** adapt split layouts into a single reading sequence on small screens.

### Don't:

- **Don't** replace Hamlet's performance proof with a conceptual image or describe generated rooms as his actual studio.
- **Don't** turn lesson rows into floating, shadowed cards.
- **Don't** inherit the smallest utility-text sizes as a body-text scale.

Not canonized or repaired: utility labels as small as 8–10px (and smaller logo microtype) are not reusable reading defaults; the supporting 404 action's 2px radius and alternate hover differ from the home action. These are existing source exceptions outside this documentation-only pass. The 404 identity line and decorative vertical slogan are not endorsed as a reusable eyebrow pattern.

Source evidence: `src/styles/hamlet.css`, `src/pages/index.astro`, `src/components/Brand.astro`, `src/components/Icon.astro`, `src/components/LessonForm.astro`, `src/pages/privacy.astro`, and `src/pages/404.astro`; reconciled with `PRODUCT.md` and the home surface contract.

## Introductory offer

The user-confirmed line “Je eerste kennismakingsles is gratis.” appears after the hero description and before its action, in gold Manrope at 14px/700/1.6 (13px on mobile). The main action reads “Plan je gratis les”. The established gold contact section reinforces the offer with “Jouw eerste les. Helemaal gratis.” and an inquiry form. Telephone is retained as a fallback; the old primary SMS path is replaced. The approved hero headline remains unchanged.
