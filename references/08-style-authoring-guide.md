# 08 · Style author specifications (general version, for people who write scenes and agents sent out)

> Replace `style-authoring-guide.md`, which was tied to the reprint project in the early days. When sending an agent to draw a style, give it the path to this page, plus the specific information from the "This Project" section.

## Interface

A style segment = `scenes/<id>.js`:

```js
SCENES['<id>'] = { draw(c, lt, t) { /* Draw full 1920×1080 */ }, init(IMG) { /* Optional: one-time precalculation */ } };
```

- `c` target 2D context; `lt` local time of this segment (seconds, counting from the transition of this segment); `t` full film time.
- Paragraph table `eras.js`: `{ id, eighths or dur, transition: { type, dur }, counter: {...} }`. The length of the film is automatically calculated from the paragraph table.
- Transition `transitions.js`: `TRANSITIONS.<name> = (c, A old, B new, p, o) => {}`.
- The scene is missing files, has incorrect syntax, and is not registered → The engine refuses to start and an error of render/qa is reported directly. Don’t judge success by “it looks rendered.”

## Read first (in order)

1. `references/02-mechanisms.md` (five-layer mechanism), `04-code-drawing.md` (pipeline, renderer quick check, pitfalls), `07-proven-practices.md`.
2. `references/style-recipes/INDEX.md`: Find the closest style as a starting point and read that card.
3. Benchmark implementation `scripts/engine/scenes/09_postimp.js`; the scene source code closest to the style.
4. `lib/`: `paint.js` (noise/texture/renderer/swatches/choreography), `rig.js` (characters skeleton, visibleLines), `kit.js` and other tool libraries. **First check to see if it is available in the library, and then write it yourself.**

## Two starting points

**There is a reference film**: Run `scripts/analyze/breakdown.py` first to get the reference frame (`ref/segNN.png`), motion heat map, transition contact table, and open it according to No. 01. The reference frame determines the composition, theme, and color matching, and the heat map determines "what is moving in the painting."

**No reference film** (more common):
1. Write down the 3–5 most recognizable formal elements of the style (materials, brushwork, color palette, motifs, traces of media). Check primary sources (original images, art history descriptions) instead of relying on impressions.
2. Give each element an "active mode" - how it would originally move in the world of the painting (water will tremble, paper will float, gold will shine, the plate will be misaligned, and the film will shake).
3. Think clearly about how this kind of painting is made in reality (brushing, engraving, printing, pasting, inlaying, spraying, rendering), and write that physical process into a renderer.
4. Start one frame first: Compare the still frame puzzle to the original, and then move it if you recognize it at first sight.

## Hard requirement

1. **Scene Skeleton**: According to the composition coordinates given by this project (all segments are consistent, transitions and "the same characters are traveling through" all rely on it).
2. **characters**: Use `RIG` skeleton and shared choreography, changing the drawing method without changing the position and movement.** Characters must also pass the material processing of the style** (brush strokes, grains, paper texture multiply, ink bloom, dots, color plate misalignment...), otherwise it will look like pasted clip art - this is the most common shortcoming among the 36 styles. When line drawing is needed, use `drawGirl/drawCat` and `mode:'line'` (visibleLines have been applied inside and will not be drawn through).
3. **Drawing must be alive**: Main action + 2-4 small loops of motifs, which can be seen in the stay window. Character actions in speed-passing/travel movies use the entire movie time (such as `PAINT.cupCycle(t)`) and are not reset when changing segments.
4. **Smooth**: Do not change the seed at a low frame rate and re-wash the entire screen (it will be read as flashing); boiling is only for line drawing or theme areas. The intentional "stepped frame rate" (rubber hose 12fps, shadow puppet 10fps) uses `stepTime`, which is style rather than lag. The mold period of the rolling pattern is equal to the true period of the pattern.
5. **Deterministic**: All seeds are randomly used; two renderings of the same t are consistent pixel by pixel.
6. **Performance**: `PAINT.cached` for the static part; `willReadFrequently` for off-screen reading of pixels, and `g.reset()` for each frame; the target is ≤150ms per frame (qa measures the real time with GPU flush).
7. **Words**: The characters in the style are given priority by using paths to draw materials of that style; when using fonts, first verify the existence of the glyph with `U.assertGlyphs` (missing characters will silently fall back to the system font).
8. **Distressed upper body**: Peeling, stains, and scratches are only on the background; a protected area is set up in the characters area (Dunhuang peeling spots on the back are read as "holes in clothes").

## Self-inspection and delivery

```sh
uv run --with playwright python <project>/render.py --solo <id> --stills 0.4,0.6,0.8,1.0 --out <render>/<id> # Still frame
uv run <skill>/scripts/qa.py --project <project> --ids <id> # Number
```

At least 3 rounds for each segment: compare still frames to the original work/reference puzzle → qa to see motion/still frame pairs/jumps/time consuming/deterministic → change. Four questions: ①Which style can you recognize at a glance? ②Do the characters match and blend with the background? ③Can you see that the painting is moving in the dwell window and does not flicker or freeze? ④Is there any overlap (blocking, disconnection, misalignment, blank space, overlapping words)?

Delivery: `scenes/<id>.js`+recipe card (according to `style-recipes/` format: pipeline, key parameters and color values, how to make motif animation, signature transition, performance, pitfalls, still can be improved), write details and numbers. **Before delivery of the multiple-part film, an agent who was not involved in the production was assigned to review the finished film only.**

## Three-way hard door when unattended

For a new character interpretation or style direction, show the user three alternatives using the same frame. Keep Milo's curls, yellow jacket and small teal backpack consistent.
No one can ask (automated testing, nightly batching): Carry out the direction specified in the task book, and at the same time list "two other directions that could have been given" in the delivery instructions, and wait for him to come back to pick.
