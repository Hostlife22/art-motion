# Bruce Lee — The Little Dragon

Twenty animated moments from the life of Bruce Lee. A new React / TypeScript / Canvas 2D project based on the local reference video, with the playback architecture adapted from `moonwalk-art-gallery`.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. The existing development session uses [localhost:5174](http://localhost:5174/).

The first implementation contains all twenty scenes, opening card flips, a moving poster strip, a closing grid, multiple articulated actors, scene effects and the reference soundtrack. The browser draws the scenes procedurally. It does not play the source video or load extracted video frames. Fonts and sound are local.

**This is a working reconstruction, not yet a frame-exact replica.** Composition and scene order are reconstructed; actor anatomy, pose timing, some typography and environment details still differ. See the [reference analysis](docs/REFERENCE_ANALYSIS.md) and [visual review](docs/VISUAL_REVIEW.md) for the evidence and remaining differences.

![Current overview](docs/review/overview.png)

## Controls

- Play / Pause, Replay, Overview, Sound and timeline.
- Click a poster or select a work in the keyboard-accessible scene catalogue.
- Space toggles playback. Left / right arrows seek five seconds outside controls.
- H hides or restores the interface. Escape restores it.
- Reduced motion opens a paused overview. Hidden tabs suspend the shared clock and soundtrack.
- If a browser blocks autoplay, Start sound resumes the soundtrack after a user gesture.

Direct comparison URLs: `?time=6&controls=0`, `?time=71&controls=0`, `?time=84&controls=0`. Explicit time pauses playback. `seed=1940` controls static grain. Mobile uses a two-column overview and an enlarged active scene.

## Development

```sh
npm run check
npm run test:e2e
```

Node ≥22.12. `check` verifies formatting, lint, types, unit tests and production build. The browser checks cover all twenty scenes, deterministic seeking, controls, mobile layout and reduced motion. Install Chromium with `npx playwright install chromium` if needed.

- `src/data/scenes.ts` — observed scene order, captions and action descriptions.
- `src/animation/timeline.ts` — camera, transitions and review timestamps.
- `src/animation/poses.ts` — actor poses and twenty keyframe sequences.
- `src/renderers/backgrounds.ts` — cached, code-drawn backgrounds.
- `src/renderers/figure.ts` — articulated figures and material costumes.
- `src/renderers/scenes.ts` — independent supporting actors, reactions and effects.
- `src/renderers/gallery.ts` — composition, opening, strip, overview and hit testing.
- `src/playback/PlaybackController.ts` — clock, media preference and shared commands.

The source video and half-second frames are excluded from Git. To regenerate reference sheets and metadata:

```sh
./scripts/analyze-reference.sh
```

This does not alter the renderer. The soundtrack was extracted with `ffmpeg -i ssstwitter.com_1791105709702.mp4 -vn -c:a copy public/audio/reference-soundtrack.m4a`.

Code adapted from the sibling gallery keeps its MIT attribution in [LICENSE](LICENSE). Fonts use SIL Open Font License; notices are in `public/licenses`. The reference recording and audio are separate materials provided for this local reconstruction.
