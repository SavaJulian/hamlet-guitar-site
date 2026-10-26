# Verification — 26 October 2026

## Inquiry form draft — activation pending

- All primary lesson actions and the teacher introduction link lead to the inline contact form. Lesson choices preselect interest without clearing entered details.
- Twenty-two browser tests pass, including required-field errors and focus, no submission when unconfigured, anonymous endpoint validation, locally intercepted native POST payloads, privacy and thank-you routes, and existing video behavior. These tests send no external lead.
- Reviewed form layouts at 320, 390, 768 and 1440 pixels and the thank-you page at 390 and 1440 pixels, with no horizontal overflow. The tablet layout stacks; form fields respond to their container width.
- Astro check reports zero errors, warnings or hints; lint, formatting and the production subpath build pass. Four routes are generated. The route policy now consistently uses trailing slashes, fixing local privacy and thank-you navigation.
- FormSubmit is selected with default reCAPTCHA, a subject, table email format and a base-aware return URL. The build rejects email-address action URLs and permits only an anonymous FormSubmit endpoint. The receiver is absent from source, generated pages and public documentation.
- FormSubmit displayed its activation-email-sent confirmation. The mailbox holder must activate and supply the opaque endpoint. Real delivery is not yet verified; this branch is a draft and has not replaced the live site.

## Video quality comparison

A 1080p diagnostic re-encode from the original source produced slightly cleaner guitar and shirt edges but retained the soft facial detail already visible in the original. It increased the hero from 2.29 MB to 8.16 MB and exposed more dark-background speckles. That diagnostic file is not shipped. A sharper source recording offers a larger potential improvement than this resolution/bitrate change alone.

## Current playback refinement

- Source now attempts audible autoplay and retries muted only after browser `NotAllowedError`. Automatic sound remains subject to browser policy.
- The three-button media bar and full-performance modal/link are removed. One 44px round speaker remains; the image is a tap- and keyboard-accessible pause/resume control with a paused/focus hint.
- Fifteen browser tests passed for the revised implementation, including allowed audible autoplay, blocked-audio muted fallback, keyboard playback and preservation of manual choices. Desktop and mobile playback captures were visually reviewed.
- Reduced motion leaves the poster until explicit play. Offscreen/hidden-tab pauses preserve manual choices. Load errors disable controls and expose a base-aware retry link. The original full-video file remains retained but unused by the interface.
- Type checking completed with zero errors, warnings or hints; ESLint, Prettier and the production GitHub Pages build passed. The design detector reported no primary findings in the changed UI files.

## Historical verification — 25 October 2026

The following results describe the earlier control bar and modal implementation. They are retained as history, not as the current playback contract.

- Production Astro build emits only homepage, privacy and 404 routes.
- Type checking: zero errors, warnings or hints.
- ESLint and Prettier checks required before committing.
- Fourteen Playwright browser tests passed: mobile menu, keyboard FAQ, phone/location destinations, selected lesson SMS intent, full-video lazy loading/playback/close/focus, page/image checks at 390, 768 and 1440 pixels, plus the hero playback behaviors below.
- The 12-second, 2.4 MB hero excerpt starts muted on desktop and mobile. Verified advancing playback, sound toggles, pause/resume, scroll pause/resume and persistence of a manual pause. Reduced-motion preference keeps the poster without downloading the clip until explicit play.
- The full performance is fetched only after selecting “Volledige video”; native controls, audio and captions are available. Hero and full film never play simultaneously, and closing the dialog respects the visitor's previous pause choice.
- Screenshot review at 390, 768 and 1440 pixels, plus menu, expanded FAQ and playing video states. No horizontal overflow or broken images.
- Separate design reviewer requested two fixes: centered performance dialog and removal of lesson eyebrows. Both scored resolved in a follow-up verdict, disposition `ship` at that fix-list scope. No external quality-bar board was available after the design service failed; the implementation was evaluated against its written direction contract.
- The hero poster has source provenance. Two generated atmosphere images replace repeated performance stills in the teacher and practice sections, with exact prompts in their matching sidecars; they are not presented as photographs of Hamlet's actual studio. The media manifest and hero-video record distinguish these assets from the authentic footage.
- Original source video remains untouched. Optimized MP4 passed full decode and faststart validation.
- Current autoplay hero and both replacement sections visually inspected at desktop and mobile sizes. Design detector reported no primary findings in the three changed UI source files.
- The refinement reviewer found an overlapping hero error message on mobile. The message now sits above the controls; a separate visual recheck and a browser regression test verified that an intercepted 404 keeps the heading readable and the full-video recovery path usable.
- An isolated subdirectory build verified every local asset/link starts with the configured base; canonical URLs use SITE_URL only when supplied.

These checks do not measure commercial conversion or place live calls/send messages. The repository's workflow checks and builds pull requests, then publishes successful `main` builds to GitHub Pages using the configured `/hamlet-guitar-site` base path. A custom domain has not been configured.

## Free introduction offer and black hero backdrop

The user-confirmed free kennismakingsles is shown beside the hero CTA, in the gold contact section and FAQ, and in default/selected-interest SMS drafts. Regular lesson duration is distinguished from the unspecified introductory duration. Desktop/tablet/mobile layouts checked at 320, 390, 768 and 1440 pixels; 14 browser tests passed after the copy update. The hero backdrop and poster were cleaned and the surrounding hero background changed to pure black; versioned media URLs avoid reusing the old cached assets.
