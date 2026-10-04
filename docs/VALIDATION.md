# Validation — 4 October 2026

`npm run check` passes formatting, ESLint, strict TypeScript, 19 unit tests and the Vite production build. `npm run test:e2e` passes five Chromium tests.

An offline comparison confirmed that all twenty decoded lossless previews are pixel-identical to their original video crops. A live Retina playback check advanced from 36.5 to 38.65 seconds in roughly two seconds, without browser errors.

Atlas integrity checks verify all twenty previews, native 830px dimensions, lossless WebP encoding, frame counts and the measured forward camera track. Binary chunk tests reject corrupted headers, truncated frames and unexpected trailing data.

The browser tests render all twenty scene review times, check nonempty pixels and time-dependent motion, then seek away and back to confirm an identical canvas pixel signature. They also exercise play/pause, replay, overview, scene catalogue selection, hidden controls, keyboard restoration, mobile overflow and reduced motion. The browser never requests the source MP4.

Sound unit tests cover default activation, seek alignment, pause, mute, tab suspension, drift correction, rejected playback and retry after autoplay blocking. Shared-clock tests cover end-of-sequence stopping, reduced-motion initialization and suspending visual/audio time while artwork chunks load.

A Retina browser regression verifies that both background and animated caches cover the physical display size, including after resizing and in the detailed mosaic. Resolution unit tests cover desktop, Retina and mobile sizes.

Live renderer screenshots were inspected at 1920 × 1080 with DPR 1 and DPR 2, and at 390 × 844 on mobile. Temporary screenshots and test reports were removed after validation.

The production preview was also checked at DPR 2 in the detailed mosaic, and with Worker disabled to exercise the browser decoder fallback. Both checks completed without JavaScript errors or error overlays. Production assets contain no source MP4 or obsolete contour atlas.

This verifies the working implementation. It does not establish frame-exact visual parity; [the visual review](VISUAL_REVIEW.md) records remaining differences.
