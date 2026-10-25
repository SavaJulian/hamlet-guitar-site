# Verification — 25 October 2026

- Production Astro build emits only homepage, privacy and 404 routes.
- Type checking: zero errors, warnings or hints.
- ESLint and Prettier checks required before committing.
- Eight Playwright browser tests passed: mobile menu, keyboard FAQ, phone/location destinations, selected lesson SMS intent, lazy video loading/playback/close/focus, and page/image checks at 390, 768 and 1440 pixels.
- No video request before explicit visitor activation. Native controls, audio and captions available after activation.
- Screenshot review at 390, 768 and 1440 pixels, plus menu, expanded FAQ and playing video states. No horizontal overflow or broken images.
- Separate design reviewer requested two fixes: centered performance dialog and removal of lesson eyebrows. Both scored resolved in a follow-up verdict, disposition `ship` at that fix-list scope. No external quality-bar board was available after the design service failed; the implementation was evaluated against its written direction contract.
- All three shipping still images have source provenance sidecars; the video media manifest records source hash and compression.
- Original source video remains untouched. Optimized MP4 passed full decode and faststart validation.
- An isolated subdirectory build verified every local asset/link starts with the configured base; canonical URLs use SITE_URL only when supplied.

These checks do not measure commercial conversion or place live calls/send messages. The repository includes a build/check workflow; public hosting and a production domain are not configured by this change.
