# Changelog

## 1.0.0 · 2026-10-06

The first release of art-motion: an animation skill for coding agents and a portable Canvas toolkit for art films, explainers and character adventures.

### Animation engine

- Built an HTML Canvas engine with scene timelines, beat-based timing, camera movement, layered drawing and transitions.
- Implemented 35 art styles, each with a working scene and a recipe describing palettes, materials, motion and limitations.
- Added shared libraries for brushes, textures, painting effects, character rigs, motion, cameras, diagrams, typography, charts, interface elements and collage.
- Implemented seeded randomness, cached static layers, character anchors and pluggable year/style labels.
- Added a gallery film and a long-scroll engine connecting Egyptian, Monet and 8-bit worlds.

### Characters and demos

- Designed Milo, a young traveler with dark curls, a yellow jacket, navy trousers, cream sneakers and a small teal backpack.
- Implemented procedural Milo geometry, an articulated rig and a storytime character with gestures, expressions and a reverse view.
- Created four transparent sprite atlases and 52 character frames for explainer, painterly and pixel scenes, with foot-anchor metadata and an installation script.
- Built an 18.5-second pixel adventure with a subscription-choice scene, a stomp-and-kick sequence and a pipe journey to a coin room.
- Added six showcase GIFs, rendered character comparisons, gallery sheets and reproducible asset builders. Documented character identity and generation prompts.

### Explainers and narration

- Added nine visual grammars: Kurzgesagt, Vox, whiteboard, storytime, kinetic typography, 3Blue1Brown, keynote UI, finance charts and presenter-led explainers.
- Implemented eight configurable clip renderers with JSON specifications for duration, frame rate, dimensions, content and timed cues.
- Supported landscape, portrait and transparent ProRes 4444 clip output, with exact frame counts.
- Added working explainer demos, example specifications, narration-planning guides and full-film code references with documented audio and character-asset requirements.

### Rendering and quality checks

- Implemented PNG still export, frame-by-frame MP4 rendering and soundtrack mixing with Chromium and FFmpeg.
- Added reference-video breakdown tools for cuts, keyframes, beat grids, motion maps and frame comparisons.
- Added an original synthesized soundtrack template and guides for scoring and synchronization.
- Implemented QA for deterministic frames, render cost, motion, smoothness, transitions and text framing, plus a subtitle-area check for light backgrounds.
- Added source-syntax, JSON and local-document-link checks, release-packaging tests and smoke renders for CI.

### Documentation and releases

- Published English skill instructions, twelve method guides, style recipes, grammar cards, examples and image captions.
- Added a quick-start README, contribution guide, MIT license, security policy and accessibility guidance with current limitations and improvement goals.
- Configured GitHub Actions for pull requests, pushes to main and automatic releases on pushed tags.
- Added reproducible ZIP and tar.gz packages from committed source, SHA-256 checksums, generated release notes and prerelease-tag handling.
