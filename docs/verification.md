# Verification — 25 October 2026

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
