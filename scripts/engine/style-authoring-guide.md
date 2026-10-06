# style-authoring-guide (Pure code drawing)

Each epoch you are responsible for = one file `scenes/<id>.js`, registered:

```js
SCENES['<id>'] = { draw(c, lt, t) { /* Draw full 1920x1080 */ } };
```

- `c`: Target 2D context; `lt`: Partial time of this segment (seconds, calculated from the transition of this era, which can be slightly longer than the duration of this segment); `t`: Full film time.
- **Don’t draw the year plate** (1500–1890 × 40–210 in the upper right corner is drawn by the engine). Leave this area as background and don’t put important elements.
- **Do not change `lib/`, `engine.js`, `eras.js`, `transitions.js`, or other people’s scene files**. The required tool functions are written in their own files.

## Available libraries (read source code first)
- `lib/paint.js` → `PAINT`: noise noise/fbm, texture texture/grain/craquelure, hand-drawn line roughPath/boilSeed,
  Style renderer strokes (flow field strokes, supports palette area swatches)/dabs/mosaic/halftone/pixelate/facets, `swatch` color group, `choreo` shared choreography, steam, particles, `scratch(key)` off-screen canvas.
- `lib/rig.js` → `RIG`: `RIG.girl(opt)` girl skeleton (sitting sideways to the left, returning to each part Path2D + anchor point `G.A`), `RIG.drawGirl(c,G,pal)` (pal.mode can be fill/line),
  `RIG.cat(opt)` orange and white cat skeleton (sitting on the right), `RIG.drawCat(c,K,pal)`, `RIG.drawCup`, `RIG.smooth(points)` smooth curve, `RIG.taper` tapered limbs, `RIG.ik2`.
- **Benchmark implementation: `scenes/09_postimp.js` (Van Gogh)** - Look at its structure: flat painting → style renderer repainting (regional color plate) → characters flat painting + fine brushstrokes → line drawing → moving highlights.

## Hard requirement
1. **Same scene skeleton**: Standard composition - window (350,120)-(810,560), cat sitting on the ground (390,610)-(690,905), table (810,620)-(1200,905), person (1120,200)-(1500,910). The original film aligns with this set of positions in every era, and the transitions also rely on it.
2. **characters**: The character is a 17-year-old European blonde girl, wearing** girl clothing of that era** (demure clothing); the cat is an** orange and white cat** (orange tabby on the head/back/tail, white muzzle/chest/belly/paws).
   It must be based on the skeleton and choreography of `RIG.girl` / `RIG.cat` (the same skeleton, the same set of movements), but the drawing method must be changed to the drawing method of that era: you can just use Path2D to fill/draw/silhouette yourself, you can add clothes to the anchor points, or you can make era-specific deformations on the skeleton points (such as the Egyptian front eyes, black painted silhouettes).
3. **Things in the painting must be alive**: The protagonist’s actions are `PAINT.choreo(lt,t)` (cup, tail, blink, breathe),
   Add 2–4 **small loops** taken from the visual motifs of that era** - see the list in `../breakdown/storyboard.md` for the "in-shot actions" of each era (for example: two postures of petroglyph animals running alternately, scarabs pushing the sun ball, tapering rolling, Vesuvian smoke, gold foil highlights sweeping, ornithopters flying by, cherry blossoms falling, light spots flashing...).
   This era only lasts 0.25–1.4 seconds in the film, and the action must be **visible** within this window.
4. **The style is made by code**: use renderers/textures/lines to draw it as a work of art of that era, rather than clip art. Lines can be "boilSeed" at 8–12fps to increase the hand-drawn feel.
5. **Performance**: Each frame ≤ 150ms (1920×1080). The static part is cached with `PAINT.cached`. All randomization uses seeds, and the same t must draw the same frame.

## refer to
- Frames of the era of the reference film: `../raw picture/ref/<id>.png` (everything except composition, motif, color matching, and counter; you draw frames from the reference film yourself, not distributed with the skill)
- AI settings draft (isomorphic picture, changed to blond girl + orange and white cat): `../raw pictures/plates/<id>.png` - used as an art setting reference, **you are not allowed to paste pictures into the screen**, you can only use code to draw.
- In-shot action and transition origin: `../breakdown/storyboard.md`
- Reference film 60fps: `../original film/<reference film>.mp4` (bring your own)

## Self-check (at least 3 rounds per epoch)
```sh
cd <your project directory> # contains animation-project/ (copied from scripts/engine)
uv run --with playwright python animation-project/render.py --solo <id> --stills 0,0.3,0.6,0.9 --out renders/<id>
uv run --with playwright python animation-project/render.py --solo <id> --from 0 --to 1.2 --out renders/<id>/clip.mp4
```
Assemble your frame beside the original-film frame and design reference using PIL. Ask: ① Is the era/artist recognizable at a glance? ② Does the girl look like a 17-year-old blonde and the cat like an orange-and-white cat? ③ Is movement visible within 1 second? ④ Are there rendering errors such as misalignment, broken lines, incorrect occlusion, or blank areas?
Just change one thing until you are satisfied.

## Delivery
- `scenes/<id>.js`
- `notes/<id>.md`: What techniques were used (renderer parameters, color palette, how to create the theme animation, pitfalls encountered), **This is the experience that needs to be accumulated into the skill**, write down the specifics and numbers.
