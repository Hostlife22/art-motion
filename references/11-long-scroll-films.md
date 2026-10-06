# 11 · A long time-travel film: a person walks from left to right, passing through famous paintings

The method used in "Milo Travels Through Famous Paintings" (2026-10-05, 123.7 seconds, 24 worlds). Different from the art history speed pass (changing painting styles in the same room), this is a long horizontal scroll: each world is a horizontally extending painting, connected end to end; the protagonist keeps walking to the right, and the moment he crosses the border, his painting style changes with the world.

Demonstration: `scripts/engine/demos/long_scroll/`, including 3 segments (Egyptian mural → Monet's "Japanese Bridge" → 8-bit pixels), about 15.6 seconds.

```sh
uv run --with playwright python scripts/engine/render.py --film demos/long_scroll --stills 1,5,9 --out preview # Three still frames
uv run --with playwright python scripts/engine/render.py --film demos/long_scroll --out long_scroll.mp4 # Entire section
```

Browser preview: Start a static service in `scripts/engine/`, open `index.html?film=demos/long_scroll`; `&only=28_monet,14_8bit` only arranges these paragraphs, `&v=330` tries other paces.

## document

| File | What to care |
|---|---|
| `eras.js` | Movie entrance: load library, `FILM_ORDER` (segment sequence), register frame library, generate a `dur = WORLD.total` segment |
| `lib/world.js` | Skeleton `WORLD`: Timeline (walk→stop interaction→walk), protagonist’s movement, camera, protagonist cut according to the boundary, border, corner mark. **Read its header comment first** |
| `lib/crossing.js` | `XING`: Reading frame library, drawing characters frame (`XING.actor`), brush stroke material, Monet world |
| `lib/acts.js` | `ACT`: Small script tool (trajectory of drifting stones, etc.) |
| `lib/xing2_*.js` | A small tool shared by several segments, loaded on demand from the beginning of the segment file |
| `segments/<id>.js` | One world and one file, call `WORLD.add({...})` |
| `frames/<key>/` | Characters frame library: 8 transparent PNGs + `meta.json` (foot sole anchor point of each frame `ax/ay`, size, whether off the ground `air`; `ref_h` is the number of pixels of standing height) |

## Add a paragraph

1. Create `<id>.js` in `segments/` and call `WORLD.add({ id, year, name, w, hero, acts, back, front, seam })`. For the interface, see the `lib/world.js` header comment. The world itself is drawn with code, and priority is given to transforming the ready-made style scenes in `scenes/<id>.js` into a horizontally extended version (segment width 2000–2800).
2. Generate character frames: One "walking 8 frame" for each world, and one "interactive 8 frame" if there is interaction. According to this style, let the generated character model redraw, green screen, cut the frame (`scripts/key_split.py`, see No. 10 for the method), put in `frames/<key>/`, and write `meta.json`.
3. Add `<id>` to `FILM_ORDER` of `eras.js`.
4. Render both sides of the still frame core boundary, and then run `qa.py --project scripts/engine --film demos/long_scroll`. The certainty must be ✓.

## Key agreement (the whole film is unified and written into the skeleton)

- **Ground line `WORLD.GROUND = 760`, the protagonist’s standing height is 300, and the protagonist is at 720px on the screen.**  The ground at both ends of the segment (±150px near x=0 and x=w) must return to 760, and the horizon should fall at 480–560 as much as possible. Only when crossing the border can the two sides be connected. There can be bridges and steps in the middle (`ground: lx => y`).
- **All events are timed relative to "Interaction Start".**  Use `WORLD.actT(segment)` to get the full movie time when the interaction starts, `r = S.t - WORLD.actT(ME)`; do not write "the number of seconds after entering the segment". The pace of the entire film was later increased from 330 to 560, and there was no need to change any of the paragraphs written accordingly.
- **The camera only moves forward but not backward.**  Camera target = Protagonist x − 720 + `lead` that is given forward during interaction. The historical maximum value is taken and then Gaussian smoothed, so the whole process is monotonous, without stopping or starting. If you want the camera to stop moving, just write `lead: 0`.
- **The border of each paragraph is drawn with the signature language of that paragraph** (`seam`: paper edge, pixel checkerboard, colorful column lines...). This is the version of the speed pass film "Transition = Signature Language of the Next Style" in the long scroll.
- **The protagonist's walking frame rate is proportional to the walking speed** (`hero.fps`), with a gait cycle of 8 frames; when you need another layer of materials with this style of painting, write `hero.draw(c, key, i, o, S)` in the paragraph and synthesize it yourself without changing the shared library.
- **Soundtrack**: The picture is decided first, and the music is matched later. Put an integer number of beats in each segment, and fine-tune the speed between 86-104 BPM segment by segment, so that each boundary falls on the first beat of the measure (the measured maximum error of 24 boundaries is 11.7ms); the human ear cannot hear the ±8% segment-by-segment speed difference.
- **Don’t add unnecessary jokes for the protagonist.**  There is a "pile souvenirs on hat" function in the skeleton (`FILM_HAT_ITEMS`), which easily competes with the scene for visual attention and is turned off by default.

For more evidence and figures see Articles 36–38 of `07-proven-practices.md`.
