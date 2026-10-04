# Validation — 4 October 2026

`npm run check` passes formatting, ESLint, strict TypeScript, 12 unit tests and the Vite production build. `npm run test:e2e` passes four Chromium tests.

The browser tests render all twenty scene review times, check nonempty pixels and time-dependent motion, then seek away and back to confirm an identical canvas pixel signature. They also exercise play/pause, replay, overview, scene catalogue selection, hidden controls, keyboard restoration, mobile overflow and reduced motion. The browser never requests the source MP4.

Sound unit tests cover default activation, seek alignment, pause, mute, tab suspension, drift correction, rejected playback and retry after autoplay blocking. Shared-clock tests cover end-of-sequence stopping and reduced-motion initialization.

Live renderer screenshots were inspected at 1920 × 1080. Mobile screenshots were also inspected at 390 × 844:

- [Mobile active scene](review/mobile-scene.png)
- [Mobile overview](review/mobile-overview.png)

This verifies the working implementation. It does not establish frame-exact visual parity; [the visual review](VISUAL_REVIEW.md) records remaining differences.
