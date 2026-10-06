# 05_gothic · 1290 Gothic Illuminated Codex

11–22ms per frame (median 12ms). The static layer + gold foil mask is built at one time in `init()`.

## Pipeline
1. Static layer `goth_static` (cache): parchment → gold leaf → diamond embossing → gables, pinnacles, jambs → pointed arch windows and stained glass → tables, thrones → Latin columns → page knights.
2. Gold foil mask `goth_mask`: Calculate the "gold degree" `clamp((r-b-70)/50)·clamp((g-b-30)/40)·clamp((r-140)/40)` pixel by pixel for the static layer, and the result is alpha. Parchment (236,223,194) has an r−b of only 42 and is excluded; the pink band has a high b value and is also excluded. **No need to draw the golden shape again to mask**, all golden places will be automatically swept by the highlight: background, initials, gold balls, pediment finials.
3. Draw each frame in sequence: stained glass flashing → oblique highlight → four-pointed star appearing where the highlight passes → vine decoration → snail → mouse running by → cat → girl → particles.

## Gold foil texture ("fine texture + high gloss" required by the specification)
- Pixel-by-pixel shading: `f = 0.52 + fbm(x·.0035)·0.42 + horizontal grinding noise(x·.004, y·.09)·0.5 + upper left light + grain ±0.05`, and then interpolate between the three colors of goldLo #9c6a1a / gold #d9a63a / goldHi #f8de86. The y frequency of the polished pattern is more than 20 times that of x, so it looks like horizontal metal wire drawing.
- Diamond grid: spacing 46px, two families of diagonal lines (x+y, x−y are each constant). Draw each line twice: once as a dark line, and once as a light line offset by 1.2px, so that it looks like it is carved into gold. There are 4 points on the rhombus center pressure, the upper left is bright and the lower right is dark.
- Draw a very light square seam every 118×125px to imitate the gold foil that is applied one by one.
- Oblique highlight: First draw a linear gradient strip on a 920px wide scratch with a slope of K=0.45 ("/" direction). Use `destination-in` to multiply the mask, and then use `lighter` and α0.62 to overlap the screen. **Move at a constant speed** `x = lerp(150,1650,(lt-0.08)/1.15)`. Initially, I used the inOut slow motion, but in 0.9 seconds, the highlight had swept out of the gold area and could not be seen on the girl. After changing to a constant speed, it swept to the window in 0.3 seconds, and just passed the girl in 0.9 seconds. Halo, 11 fixed points are judged by `|u − sweepX| < 70`, and a four-pointed star flashes when the highlight passes.

## Motif animation (can be seen in the 0.25–1.4s window)
- Vine: About 120 points on each of the two stems, plus a `sin(t·2.1+i·.09)·2.5` swing to each point. At every 3–5 points hang a three-petal ivy leaf (blue/red/gold rotation) or a gold ball with 3 whiskers. The blade winding point is `sin(t·3.1+k·1.7)·0.28`. The first version of blade scaling used 0.85, which was too small and too thin. After changing it to 1.05–1.45, the density was close to the original film.
- Stained glass: 26 random points, when `sin(t·5+h·40) > 0.6`, a white radial light will light up.
- The cat raised one front paw and held the mouse by its tail. The mouse swung `0.32·sin(t·5.5)` like a pendulum, kicking its calves wildly. The snail crawls to the left with 62px/s, its antennae swaying; the mouse under the text column runs through 360px in 0.12–1.17s, and its legs swing at 40 radians per second.
- The girl holds up the golden cup according to the shared choreography. There is a four-pointed star shining on the rim of the cup, and a thin ink line is used for the hot air on the cup.

## characters
- The girl directly takes the Path2D of `RIG.girl` and draws it in order without adjusting `RIG.drawGirl`. There are two reasons: drawGirl will definitely draw a mug with a handle; the cloak and halo must be inserted between certain layers in the middle. The order of painting: halo (centered on headC (16,−22), r=114, red circle plus 36 stamping points) → wavy long blond hair → red robe (gold thin vertical strips every 20px, a gold edge on the hem of the robe) → blue cloak (anchored on nape/back, with gold edge) → head → golden chalice.
- The "Cat with a Human Face" in the Cat Made Manuscript: The face is a cream-colored oval, with almond-shaped pupils squeezed on the right side and squinting at the girl. The upper eyelids are thickened, the eyebrows are raised, the corners of the mouth are turned down, and the cheeks are flushed. Just use `legs[0]`, and use `RIG.limb` for the other front leg to draw itself into a raised position.
- UnifrakturMaguntia 44px for the English text column, beginning with an illuminated H. Short lines fit beside the illustration. Cat, No and mouse receive red rubrication, preserving the medieval manuscript treatment.

## Pit
- The scratchpad is shared with other era authors, and `check.py` has been overwritten once by others. The self-test script should be placed in its own subdirectory.
- If lt=0 is used as the baseline for the motion difference map, it will be contaminated by the lens impact (1.03 zoom) of the first 20 frames of the engine. The benchmark should be lt≥0.35.

## v2 fine-tuning
Vine swing ×2, leaf swing 0.42; color window flash points 40; gold foil highlight α0.85, highlight band widening. The frame difference of the still segment is 1.10 → 1.32 (original film 1.64).
