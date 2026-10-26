---
name: Hamlet Guitar
description: A warm, contemporary guitar studio with an authentic performance at its center.
colors:
  paper: '#f7f5ef'
  ink: '#242320'
  accent: '#b64b2c'
  accent-hover: '#933b23'
  muted: '#6b675e'
  line: '#d9d4c9'
  practice: '#eae5d9'
  form-panel: '#fffefa'
  contact-emphasis: '#e6b69c'
typography:
  display:
    fontFamily: 'Manrope Variable, Arial, sans-serif'
    fontSize: 'clamp(64px, 6.3vw, 92px)'
    fontWeight: 750
    lineHeight: 1.02
    letterSpacing: '-0.065em'
  tagline:
    fontFamily: 'Bodoni Moda Variable, Georgia, serif'
    fontSize: 'clamp(36px, 4.1vw, 60px)'
    fontWeight: 500
    fontStyle: italic
    lineHeight: 1.12
    letterSpacing: '-0.045em'
  headline:
    fontFamily: 'Manrope Variable, Arial, sans-serif'
    fontSize: 'clamp(36px, 3.7vw, 54px)'
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: '-0.045em'
  quote:
    fontFamily: 'Bodoni Moda Variable, Georgia, serif'
    fontSize: '24px'
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: '-0.02em'
  body:
    fontFamily: 'Manrope Variable, Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.7
  button:
    fontFamily: 'Manrope Variable, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 700
    lineHeight: 1.5
spacing:
  container-max: '1280px'
  desktop-side: '48px'
  compact-side: '32px'
  mobile-side: '20px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '#ffffff'
    minHeight: '55px'
    padding: '15px 22px'
    borderRadius: '5px'
  media-frame:
    backgroundColor: '#000000'
    borderRadius: '12px'
  form-panel:
    backgroundColor: '{colors.form-panel}'
    textColor: '{colors.ink}'
    padding: '36px'
    borderRadius: '12px'
  form-field:
    backgroundColor: '#ffffff'
    textColor: '{colors.ink}'
    borderColor: '#969084'
    minHeight: '50px'
    padding: '12px 13px'
    borderRadius: '6px'
  form-submit:
    backgroundColor: '{colors.accent}'
    textColor: '#ffffff'
    minHeight: '56px'
    borderRadius: '6px'
---

# Hamlet Guitar — current design

This record follows the source implementation of the independent redesign requested on 26 October 2026. No installed design skill was used. It describes design and behavior, not a completed test or deployment result.

## Identity and typography

Warm ivory `#f7f5ef` is the main page surface; ink `#242320` carries the text. Terracotta `#b64b2c` identifies invitations, the six-string H, small labels and links. The legacy CSS variable `--gold` aliases `--accent`; it no longer describes a gold color.

Manrope Variable is the primary face, including bold headings and the lowercase 800-weight wordmark. Main body text is 16px; section copy uses 14–15px with generous line height. Bodoni Moda Variable is reserved for the italic hero tagline and the regular-weight student quote. Both fonts are self-hosted.

## Layout

The desktop shell is at most 1280px wide with 48px side margins. Compact layouts use 32px margins; layouts at 800px and below use 20px. Main breakpoints are 1600, 1100, 800, 580 and 370px; the form also responds to its container width.

The hero pairs a strong lesson headline with a contained black performance frame. Keeping text beside the film gives the offer and Hamlet room of their own. The source video and poster use the same crop, with `object-position: 36% center`; responsive frame proportions adapt without changing the media.

The lesson section uses three full-width linked rows with thin dividers and circular arrows. The teacher panel pairs a guitar-and-notebook image with the introduction and attributed student quote. A compact beige practice panel pairs explanatory text with a different guitar-and-chair scene. FAQ uses native `details` rows. The final invitation is dark ink, with warm pale emphasis and an off-white form panel.

On mobile, split sections become one reading sequence. Contact content orders the offer, form and then route information. A floating terracotta lesson action hides when the primary hero action or contact section is visible. Privacy and thank-you pages share the ivory/ink palette, Manrope headings and terracotta links.

## Components and interaction

Primary buttons have white text, a terracotta fill, 5px corners and a minimum 55px height. Their arrows move 4px on hover. Text links remain visibly underlined or ruled. The form uses 16px inputs, 14px labels, warm gray borders, 6px corners and a full-width terracotta submit action. The phone fallback is separated beneath the form.

Media and content panels use restrained 8–12px corner radii. Fine warm-gray lines organize lesson rows, FAQ and supporting information. Transitions are generally 0.2 seconds; reduced-motion preferences disable motion and smooth scrolling. Keyboard focus remains visible, with contrasting focus treatment on dark and video surfaces.

## Performance behavior

The authentic 12-second hero excerpt attempts audible autoplay, then retries muted if the browser refuses. Automatic sound is browser-dependent. A 44px speaker controls sound. The transparent image-sized playback button pauses or resumes; its hint appears only when paused or keyboard-focused. Reduced-motion visitors begin with the poster and explicitly start playback. Offscreen and hidden-tab pauses preserve manual choices. Load errors disable controls and expose a retry link.

The video frame and cleaned footage background are black, with no grain overlay. The complete performance is retained in the archive but not linked or loaded by the interface.

## Truthful content and conversion

Preserve “Leer gitaar spelen. Op jouw tempo.” and the user-confirmed free kennismakingsles. Lesson invitations and “Maak kennis met Hamlet” target `#contact`; lesson rows also preselect interest. The introductory lesson's duration is unspecified. The 60-minute statement applies to regular lessons.

Real footage demonstrates Hamlet's playing. The two supporting still lifes are conceptual “Sfeerbeeld” images, not evidence of his studio or teaching sessions. Keep their provenance and the review attribution intact. Business references are in `docs/sources.md`.

The form collects required name/email and optional phone, interest and message through native POST to an activated opaque FormSubmit endpoint. The recipient is private and must not appear in public code, documentation or URLs. Preserve validation, loading/error states, the privacy link and telephone fallback. A submission is an inquiry to arrange a time, not a confirmed booking or proof of inbox receipt.
