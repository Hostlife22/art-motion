# Bruce Lee — The Little Dragon

Twenty animated moments from the life of Bruce Lee. A new React / TypeScript / Canvas 2D project based on the local reference video, with the playback architecture adapted from `moonwalk-art-gallery`.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. The existing development session uses [localhost:5174](http://localhost:5174/).

Scene artwork uses native 830 × 830 lossless WebP samples prepared from the supplied recording. This preserves the original character details, lettering and backgrounds instead of approximating them with reduced-colour contours. Canvas presents each scene at an absolute timestamp; the browser does not download or play the source MP4. Fonts and sound are local.

Render caches match the displayed physical pixel size, including Retina density, using one high-quality resize from the original sample. Nearby chunks are prefetched; decoded animation bitmaps use a 96 MiB budget.

**The complete site is not yet a frame-exact replica.** Artwork preserves the reference pixels, but motion samples at 30fps and the opening, captions and mobile layout have independent implementations. See the [visual review](docs/VISUAL_REVIEW.md).

![Current overview](docs/review/overview.png)

## Controls

- Play / Pause, Replay, Overview, Sound and timeline.
- Click a poster or select a work in the keyboard-accessible scene catalogue.
- Space toggles playback. Left / right arrows seek five seconds outside controls.
- H hides or restores the interface. Escape restores it.
- Reduced motion opens a paused overview. Hidden tabs suspend the shared clock and soundtrack.
- If a browser blocks autoplay, Start sound resumes the soundtrack after a user gesture.

Direct comparison URLs: `?time=6&controls=0`, `?time=71&controls=0`, `?time=84&controls=0`. Explicit time pauses playback. Mobile uses a two-column overview and an enlarged active scene.

## Development

```sh
npm run check
npm run test:e2e
```

Node ≥22.12. `check` verifies formatting, lint, types, unit tests and production build. The browser checks cover all twenty scenes, deterministic seeking, controls, mobile layout and reduced motion. Install Chromium with `npx playwright install chromium` if needed.

- `src/data/scenes.ts` — observed scene order, captions and action descriptions.
- `src/animation/timeline.ts` — camera, transitions and review timestamps.
- `src/renderers/ReferenceAtlas.ts` — chunk loading, asynchronous image decoding and bounded caches.
- `src/renderers/ArtworkPool.ts` — bounded background decoding and resizing in three workers.
- `src/renderers/artFrames.ts` — validated lossless artwork chunk format.
- `src/renderers/rasterQuality.ts` — physical cache resolution and memory budget.
- `public/art/` — native-size lossless previews and one-second animation chunks.
- `scripts/build-reference-art.py` — reproducible offline artwork preparation.
- `scripts/reference-camera.json` — measured pans and stationary holds.
- `src/renderers/gallery.ts` — composition, opening, strip, overview and hit testing.
- `src/playback/PlaybackController.ts` — clock, media preference and shared commands.

The source video and generated analysis files are excluded from Git. To regenerate reference sheets and metadata:

```sh
./scripts/analyze-reference.sh
```

To rebuild the lossless artwork (Python with `numpy` and `opencv-python`):

```sh
python3 scripts/build-reference-art.py --workers 3
```

`--resume` continues an interrupted build when the source and frame rate are unchanged. The video is a build input only; it is not copied into the production site. The lossless artwork is approximately 1.25 GB (1.17 GiB) in total; one-second chunks bound the cost of loading a particular scene, not of watching the entire sequence. The soundtrack was extracted with `ffmpeg -i ssstwitter.com_1791105709702.mp4 -vn -c:a copy public/audio/reference-soundtrack.m4a`.

Code adapted from the sibling gallery keeps its MIT attribution in [LICENSE](LICENSE). Fonts use SIL Open Font License; notices are in `public/licenses`. The reference recording and audio are separate materials provided for this local reconstruction.
