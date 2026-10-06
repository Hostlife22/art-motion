# 19_munch · Munch’s “The Scream” Expressionism (1893)

> Source: Migration Test A (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/19_munch.js`.

The file name during the experiment is `scenes/03_munch.js` (about 160 lines). The median of adjacent frames in the final version is 2.27%, and the single frame JS side is about 90–140ms.

**Streamline renderer `flowLines` (new)**
- Seeds: 24px dither grid, ~3600. Each seed determines the area (sky, fjord, mountain, wall, floor).
- Integrate along the "direction field twisting over time", parameters per zone [steps, step, width, α]:
  - Final version: Sky [32,7,10,.78], Fjord [26,6,9,.78], Wall [42,7,13,.5], Earth [32,8,12,.55], plus 0–8 random steps for each root.
  - One pen goes 200–300px.
  - Process: The second version was [26, 6, 7, .85]. The independent review still concluded that "at first glance it looked like Van Gogh", so we had to lengthen it, widen it, and reduce the transparency.
- Stop beyond the zone, so zone boundaries are clean.
- **No strokes, translucent color stacking**: Munch is a thin and long brush. The first version copied Van Gogh's "dark strokes", and the wall became sections of short caterpillar brushes, which looked like Van Gogh at a glance. It will be correct after removing the stroke and increasing the number of steps from 10 to 26.
- First lay flat paint of the same color on the bottom (the wall gradually changes from `#a8401e` to `#5a1a14`). What is exposed in the cracks is the same color, not black.

**Direction Field**
- Day: `0.55·sin(x·.011 + y·.018 − 2.4t)`;
- Fjord: tangent around (620,470);
- Wall: vertical ±0.5 sinusoidal twist;
- Ground: points to the vanishing point (1000,640).

**Blood Sky**
- Press "Wavy y" on the seed to determine the color band: `yy = y + 22·sin(x·.014 − 2.2t)`, with a bandwidth of 28px.
- 7 color cycle: `#e2541c #f08a24 #f4c03a #c8301e #e8743a #f6a63a #b82a1e`.
- The ribbon itself is also twisting, this is "the sky is flowing".

**The whole world is moving**
Finally, shift the entire painting by rows by `9·sin(y·.012 + 4.2t) + 4·sin(y·.031 − 6t)`, then by columns by `6·sin(x·.009 − 3.6t)`, with a bandwidth of 4px, using `KIT.warpRows / warpCols`. People, cats, and tables all sway together, which is much cheaper than drawing swaying lines individually.

**motif**
- Inside the window: the diagonal stripes of the bridge deck, three railings (twisted with the world), and two distant men wearing hats.
- Screamer: Skeleton face, hands covering cheeks, mouth opening and closing `7+2sin(9t)`, body pose `sin(3.2t)·0.12`.
- The legs of tables and chairs are trembling wavy lines.
- Girl: 1890s Norwegian dark dress + white collar, yellow-green face shadow (blur 8 `rgba(120,150,70,.4)`), 9 locks of long blond hair with traveling waves `sin(9q − 7t)`.
- The cat's mouth opened slightly, as if it was infected by the scream offscreen.

**Corner Marker**: Draw text into the off-screen, then press the line to twist sine. Don’t use comic scripts like Kalam as the font (the reviewer will tell the story), use IMFellEnglish instead.

**pit**
- After the entire row is displaced, dark gaps will be exposed on the left and right edges. `KIT.warpRows/warpCols` adds a margin parameter: each line is stretched by 2×margin pixels, and the margin must be greater than or equal to the maximum displacement.
- The arm holding the cup in line drawing mode will be passed through the torso line and re-covered with `KIT.nearArm` (see ②-16).
