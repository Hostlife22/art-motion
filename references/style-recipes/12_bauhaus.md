# 12_bauhaus · 1923 Bauhaus poster

File: `scenes/12_bauhaus.js` (~210 lines). Performance: warm average 5ms, maximum 9.5ms, first frame ≈ 85ms; deterministic pass; lt 0.34→0.46 motion difference 4.9% pixels (black rods, grid windows, concentric arcs, cats, balls, and puppets are all moving). Stay in the film for 0.47s (T11 blue square/red circle/yellow triangle/round hole transition 0.20s, origin (1330,590) ≈ red circle center).

## Pipeline
1. **Full cache of the original version `bh_bg`**: off-white old paper `#ebe3cf` + 320×180 fbm thumbnail enlargement α0.5 (old and mottled) + thin diagonal lines (40,170)→(1900,840) (pressed behind the window) + upper left black horizontal bar (60,61,256,13), red vertical bar (292,105,24,468) + vertical bauhaus (`Poppins-800` 210px, `rotate(-π/2)` scaled horizontally to exactly 820px long, origin (262,1000) read from bottom to top) + small gray square + ground wire (345,898)-(1860,915) + yellow right triangle + cat (Poppins-800 150px, red `#d3262b`) + lower right two rows Poppins-600 31px + black table/chrome tube legs (three-color linear gradient) + Breuer cantilever chair (same path tracing 15px dark gray / 10px chrome / 3px highlight offset 2px) + two layers of particles (dark spots 0.02 Density α0.35, old printing black spots).
2. Red circle separate cache 520²: background color + `source-atop` overlay fbm light color spot α0.55, imitating the uneven ink of screen/litho.
3. The characters and compositions are all geometric: there are no curved strokes, only circles, squares, triangles, and thick rods.

## Motif animation
- **Oblique long black rod like pointer rotation**: According to the angle measured frame by frame in the original film (frames 575–579 is 28°, frame 581 is 33°, frame 583 is 37°, frame 585 is 42°, frame 587 is 46°, and frame 591 is 49.5°), it is written as `deg = 28 + 21.5·easeOut(clamp((lt-0.26)/0.22))`. Rotation axis = hub center (1125,195) (original film compared to 576/590 frame confirmation: the hub does not move, the lower end is swept down), the rod 27px is from -432 to +150, the thin parallel line is offset by 30px, the red short rod is offset by -30px, and the inner arc of the hub rotates accordingly.
- **Mondrian grid window rotation**: 4×4 grids (inner frame 366..794 × 126..561, grid 100×101, seam 9.5), 6 grids participate in rotation, 13fps stuck point `step=floor(lt·13)`, each grid phase is different, only change `(step+2·sw)%9 < 6` (not every beat, the rhythm is not mechanical); the rotation colors only use red, yellow, blue, rice, light blue and gray. The pattern grid (9px square paper) and the quarter circle grid are retained.
- **Concentric arcs**: 6 arcs on the right side of the red circle, starting phase `sin(9lt-0.7i)·0.05` fluctuation, radius `±3` breathing, arc length sweeping from 55% to 100% in 0.4s - like a sound wave pushing outward.
- **Hot air on cup**: A thin 2.2px sinusoidal line (26 cycles/170px, `-18t` traveling wave) with a linear gradient fade.
- **The cat rolls the ball**: Extend the right front paw `tap = sin(clamp((lt-0.05)/0.16)·π)` forward 36px and then retract it; the blue ball r31 rolls from x712 to 816 at `lt 0.13→0.47` with easeOut,** Rotation angle = displacement/radius** (white diameter line + white dot can be seen rolling), and there are two speed lines behind it during rolling. Tail = 26px thick orange arc + same width dotted dark orange stripe, angle `choreo.tail·0.5`.

## Geometry of characters (the anchor points are all from RIG)
- **Schlemmer Doll**: Head = round r70 (`G.A.headC + (14,-18)`), golden geometric hair piece = fan shape of the back half of the head (-1.95→1.15rad) + triangle in front of the forehead + round bun r34 + semicircular hair piece on the back (`G.A.back`); face = black vertical striped eyes (blinking into horizontal stripes), red square cheeks, short black mouth. The whole set of head is rotated `G.A.neck` according to `G.tilt` (tilt the head when drinking). Torso = blue trapezoid + rear half black trapezoid (undulates with breathe); skirt = black fan r178 + blue trapezoid; limbs = thick black round-head rod, joints = off-white disc + 5px black circle + black center point. The proximal arm directly uses `G.A.shoulder/elbow/hand` (RIG's IK cup), and the distal arm is placed flat on the table (to reproduce the hand reaching for the table in the original film).
- **Cat**: body circle r100 (calculated by `K.box` (536,805), scaled with breathe) + 4 dark orange horizontal bars on the left (clip in the circle) + off-white fan surface on the lower right (orange and white block surface); head = 104 squares (`K.headC + (14,48)`, slightly rotated with the tail phase ±0.08rad) + yellow triangular ears + off-white lower face + Dark orange forehead band; eyes = white circles + black vertical striped pupils.

## Swatches
Paper `#ebe3cf`; black `#161514`; red `#d3262b`; blue `#2a58b4`; yellow `#efc12f`; light blue `#b9cee0`/`#a6c0da`; gray `#c6c3bb`; rice `#f2ecdf`; orange `#ee8a2a`/`#c25a14`; chrome `#c9c9c6`.

## Step on the pit
- The first version of the grid is calculated as 107px, and the right side overflows the black frame by 16px - the size of the grid window should be reversed from the "inner frame width - 3 seams".
- Black was added to the color rotation. When switching to black grid, the whole window suddenly became heavy and looked like a bad grid. Delete it.
- The doll's mouth was originally drawn as a long black bar sticking out of the head as shown in the original photo, and it was placed on the girl's face like she was holding a cigarette. It was changed to a short horizontal bar on the inside of the head.

## Still can be improved
- The position of the cat's head/body has been moved downward relative to the RIG skeleton (so that the square head is pressed against the round body), and the position of the cat's head during transition is about 50px different from the position of the cat's head in the previous and later eras.
