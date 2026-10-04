# Native renderer validation — 4 October 2026

The native implementation is checked with formatting, ESLint, strict TypeScript, nineteen unit tests and the Vite production build. Five Chromium browser tests cover all twenty scenes, changing animation, deterministic seeking, playback controls, catalogue navigation, mobile layout and reduced motion.

The request check rejects source MP4, WebP frame images, binary animation chunks and requests to the old artwork directory. Retina checks verify physical-size background caches after loading and resizing. All animated actors are rendered directly with Canvas drawing commands.

Unit tests cover twenty distinct finite performances at arbitrary timestamps, continuous interpolation, explicit elbow/knee coordinates, planted school stances, late jumps, statue timing and push-up contact targets, measured camera alignment, shared playback, audio state and cache resolution. The camera continuity check allows the unequal pan speeds observed in the recording.

A contact sheet of all twenty native scenes was visually inspected against the video. Eight stabilized source samples per scene (160 samples in total) were reviewed to refine the action order. Large matching-time captures were inspected for the school, dance, push-ups and arcade fight. Temporary captures are outside the repository; the retained native overview is in `docs/review/overview.png`.

These checks establish functional behavior and the native rendering architecture. They do not establish 1:1 visual parity; remaining differences are recorded in [visual review](VISUAL_REVIEW.md).
