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
rounded:
  play: '50%'
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
  play-disc:
    textColor: '{colors.gold}'
    rounded: '{rounded.play}'
    width: '52px'
    height: '52px'
  lesson-option:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    padding: '34px 34px 10px 0'
---

# Design System: Hamlet Guitar

## Overview

**Creative North Star: "The Intimate Recital Stage"**

An intimate recital stage: smoked plum grounds the interface, brass marks invitations, and paper and lavender give the performance room to breathe. Real photographs and footage of Hamlet carry the identity alongside an original six-string H monogram.

High-contrast Bodoni Moda gives headings a musical cadence; Manrope keeps practical information direct. Broad tonal sections, asymmetrical grids and fine rules create a composed, personal atmosphere without card shadows.

**Key Characteristics:**

- Real performance imagery and an original six-string H.
- Bodoni Moda display with restrained italic emphasis.
- Rectangular actions, fine rules and broad tonal sections.

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

The display is expressive and tightly tracked, while body text and controls stay steady. The frontmatter records the implemented hierarchy, not a mathematical scale: the display belongs to the performance heading, headline to section headings, title to lesson choices, reading to explanatory copy, and button to primary actions. Italic emphasis retains the serif family.

Mobile display is 52px, then 46px below 370px; section headlines are 43px. Lesson titles become 29px. Final mobile overrides keep main explanatory paragraphs at 14px and FAQ questions at 13px. Other section-specific heading sizes are adaptations rather than new universal roles. Reading measures are generally 320–470px; privacy copy has its own wider reading container.

**The Two Voices Rule.** Use Bodoni Moda for expressive headings and Manrope for practical reading and controls.

## Layout

Broad sections alternate ink, paper, lavender and gold. Desktop section gutters use `max(5.1%, calc((100vw - 1294px) / 2))`; the header caps at 1440px and performance stage at 1920px. Split layouts use unequal tracks, while lesson options form three equal columns with rules. Main section padding is approximately 75–110px vertically; it is deliberately not a fabricated uniform spacing scale.

At 1100px navigation and split-layout spacing tighten. At 760px navigation collapses to an expandable list, content stacks, section gutters become 7%, and a fixed call action uses the device safe-area inset. Lesson choices become horizontal title/copy rows within a vertical list. The stage image occupies the upper mobile area and copy follows it. A 761–900px correction reduces display size, and 1600px adds a larger stage. The final mobile line-break overrides are authoritative.

Privacy uses a centered 740px reading column with 24px minimum side space; the 404 page uses a 700px container. These are supporting-page adaptations.

## Elevation & Depth

No box-shadow vocabulary is used. Depth comes from photographic cropping, dark image gradients, solid tonal bands and thin borders. The performance dialog uses a near-black translucent backdrop with 7px blur; it is centered by fixed positioning, zero inset and automatic margins.

**The Ruled Surface Rule.** Separate lesson choices and questions with fine rules; use tonal contrast and imagery for depth.

## Shapes

Main actions, images and the dialog use straight edges. The circular play disc is an intentional media affordance, not a general container radius. Thin outlined SVGs use current color and rounded stroke ends; play and rating stars use fills. The six-string H is six vertical strokes crossed by a horizontal bar.

## Components

### Buttons

Ticket-like filled actions use the primary and dark variants recorded above, a 55px minimum height and a transparent 1px border. The arrow moves 5px on hover; color transitions last 250ms. Dark contact actions wrap their contents when necessary. Focus uses a 2px outline with 6px offset, gold on dark surfaces and dark ink in the contact section.

### Links

Underlined action links use a fine current-color bottom rule and 7px bottom padding. Their gap grows from 24px to 32px on hover. Navigation links change to gold over 200ms. Preserve contextual dark focus colors on light surfaces.

### Lesson choices

These are linked columns within a ruled section, not elevated cards. Headings change to dark brass and arrows move 8px on hover. Focus uses ink with a 4px offset. Mobile converts vertical dividers into horizontal separators.

### Navigation

The desktop navigation uses Manrope at 12px/500 with 32px gaps. The mobile menu button is 44px square; its two thin strokes rotate into a close mark as `aria-expanded` changes. The list exposes normal text links with generous vertical padding.

### Questions

Native details/summary rows use top and bottom rules. Questions use 13px/650 text with 24px vertical padding. The inline plus rotates 45 degrees when open. Answers remain in document flow; the final mobile answer size is 13px.

### Performance control and dialog

A dark translucent rectangular trigger contains a circular brass play control. Hover fills the disc with gold. The centered native dialog is at most 1100px or 94vw, becomes 96vw on mobile, and provides native video controls plus a labeled close button. Its entrance is a 10px rise with opacity over 350ms using `cubic-bezier(0.16, 1, 0.3, 1)`. Reduced motion removes transitions and animations and disables smooth scrolling.

### Brand

The brass wordmark pairs Bodoni lettering with the six-string H. Hover skews the complete mark by -8 degrees over 600ms; the shipped interaction does not animate individual strings. Preserve the mark geometry and accessible homepage label.

## Do's and Don'ts

### Do:

- **Do** use real Hamlet performance imagery and preserve the six-string H identity.
- **Do** preserve the serif/sans division and the established light-on-dark or dark-on-light pairings.
- **Do** keep visible keyboard focus, native video controls and reduced-motion support.
- **Do** adapt split layouts into a single reading sequence on small screens.

### Don't:

- **Don't** substitute generic guitar stock photography for the teacher's performance.
- **Don't** turn lesson rows into floating, shadowed cards.
- **Don't** inherit the smallest utility-text sizes as a body-text scale.

Not canonized or repaired: utility labels as small as 8–10px (and smaller logo microtype) are not reusable reading defaults; the supporting 404 action's 2px radius and alternate hover differ from the home action. These are existing source exceptions outside this documentation-only pass. The 404 identity line and decorative vertical slogan are not endorsed as a reusable eyebrow pattern.

Source evidence: `src/styles/hamlet.css`, `src/pages/index.astro`, `src/components/Brand.astro`, `src/components/Icon.astro`, `src/pages/privacy.astro`, and `src/pages/404.astro`; reconciled with `PRODUCT.md` and the home surface contract.
