# 26_vaporwave · 2011 vaporwave / cyberneon

> Source: Migration test B (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/26_vaporwave.js`.

The file name during the experiment: `scenes/c5_vaporwave.js` (about 210 lines). Review red light: The first version of the shirt is pink, which blends in with the pink-toned skin tone, making it look like she is not wearing any clothes. Changed to lavender purple trench coat `#8f7cf6` + white triangle collar + cyan zipper cord. Each frame has a median of 49ms; frame difference is 25% (VHS post-production makes the whole screen move).

**Pipeline**: The entire picture is drawn into the off-screen S first, and then the VHS is output to c (the counter is drawn on the top layer by the engine and is not affected by chromatic aberration).
1. Wall: deep purple vertical gradient `#0d0322 → #4a0f6a` + magenta radial light at the window and cyan radial light at the sign. There is a cyan light strip at the foot of the wall.
2. **`glowLine(c, col, w, blur)`**: On the same path, first use shadowBlur to draw a thick glow, and then draw 2–3px near white core line, which is the neon tube.
3. Sunset in the window: The sun is a vertical gradient from yellow → orange → magenta. Use `destination-out` to cut 7 horizontal slits. The width of the slits becomes larger with depth (2 + q²·16), and the whole moves upward with 0.9/s. The horizon is a wireframe mountain (with a magenta glow), and below it is a cyan perspective grid rolling toward the viewer, with palm silhouettes panning left and right.
4. Ground: magenta perspective grid, vanishing point (960,600), horizontal line `y = 600 + 520/d`, d = k + 1 − phase (phase = 1.3t mod 1), line width becomes thicker near.
5. **Neon sign "TEA" uses polyline to draw the light tube yourself** (does not rely on fonts): 1-3 strokes for each English letter, (u, v) unit coordinates. Word-by-frame hash flashing: `hash(floor(30t), k) < 0.07` turns off; "E" has an additional 22% probability of turning off at `f mod 17 < 5`, and when it turns off, it draws a dark purple tube.
6. Win95 dialog box TEA.EXE: gray body, navy blue gradient title bar, progress block `3 + 14lt` grid, percentage `18 + 70lt`. Marble bust on the table (side profile 22 points, purple-gray gradient + vein line + pink outline light + sunglasses stem).
7. Characters: pink sweater, cyan pleated skirt, blond hair + pink hair tie. Glow outline "pink on the side facing the window, green on the back": Draw the same set of paths twice, clip them on the left and right half of the screen respectively.

**VHS Post `vhs(c, S, t, lt)`**
- RGB separation: For each channel, draw S into the temporary canvas, `multiply` solid color `#ff0000/#00ff00/#0000ff`, take out the single channel, and then use `lighter` dislocation to synthesize it into a black background. Dislocation amount 3 + 1.5sin(7t), occasional (hash<0.12) +6.
- Tracking noise band: 70px high, `(520lt + 200) mod (H+160)` scroll down. Every 6px in the band is horizontally offset `±30·sin(πy/bh)`, and 90 white and gray noise lines are stacked.
- Scan lines: 4×4 tile pattern (line 0 α 0.28, line 2 α 0.12). OSD: PressStart2P "PLAY" + hand-drawn ▶ (there is no such glyph in the font), 16 frames flash; press lt for the date and time code on the lower left.

**Swatches**: Magenta `#ff4fd8`, Hot Pink `#ff2f8f`, Cyan `#3ff6ff`, Dark Purple `#12052a / #2a0b4a`, Sun Yellow `#ffd84a`, Orange `#ff8a3a`.

**pit**
- Full-width "VAPORWAVE", ▶, and Japanese are not available in `lib/fonts`, and the system font will be silently rolled back. The label is changed to half-width + kerning 7, and ▶ and kana are drawn by myself.
- The character strokes use component paths, and the junctions of the waistline, arms and torso will also glow. Neon line drawing is acceptable, but if you want a pure outline, you have to draw the silhouette off-screen first, and then trace the edge off-screen.

---
