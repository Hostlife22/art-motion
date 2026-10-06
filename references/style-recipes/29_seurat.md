# 29_seurat · 1884 Seurat "Sunday Afternoon on the Island of La Grande Jatte" (Pointillism: Visual Mixing Renderer)

> Source: Migration Test C (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/29_seurat.js`.

The file name during the experiment: `scenes/k3_seurat.js` (line 136). Each frame takes about 100ms, and the frame difference is 7.4% (quiet, the average difference between adjacent frames is 0.45).

**Renderer (emphasis, can be extracted into paint.js)**
1. The entire flat painting, including characters (~3ms per frame). Spread the `blur(4px) saturate(.85) brightness(1.06)` pattern on the bottom layer. When applying the base color, the seams between the dots will reveal it.
2. **Fixed hexagonal grid, points of equal size**: pitch 10, line spacing 8.66, r 4.5, each point has a static jitter of ±1.2px. About 24,000 points. Accumulate points into 21 Path2Ds by color, and fill each color only once.
3. **Visual color mixing and color selection**: 21-color solid color plate.
   - 14 saturated colors: `#1a2058 #2a3a9a #3f6fd0 #6aaee6 #1f6a52 #2f9a5a #a8c83a #f2cf3a #f08a2a #e0432a #c0306a #7a4aa8 #f8f4e8 #e8b48a`
   - 7 light colors (Seurat's "colors mixed with white"): `#f6e49a #f6c48a #cfe08a #b0cff0 #f2b8c8 #c99a4a #9a7ac8`
   - For each pair (i,j), project the target color onto the line segment Pj→Pi to obtain the continuous proportion w, clamp to [.2,.8]. The distance plus `0.004·|Pi−Pj|²` penalizes pairs that are too far apart to avoid mixing gray with black and white points. Take the pair with the smallest distance; click `hash(i,j) < w` at each point to decide whether to use Pi or Pj.
   - The results are stored in the Map according to the 15-bit quantized color buffer.
4. **Add ±20 hash jitter to the target color before picking the color** (R+dj, G+0.8dj, B−0.6dj). The switching boundaries of paired colors therefore become staggered points, and no vertical color bands appear.
5. **Complementary color points**: 8% of the points are replaced with contrasting colors (blue↔orange, green↔red-purple, yellow↔purple...a total of 21 mappings).** Light penetration**: Compared with 14px on the lower right, when the brightness difference is >45, there is a 45% probability of placing a white dot on the bright side and a dark blue dot on the dark side.
6. **Border drawn by Seurat himself**: 28px dark blue band around, also rendered with pointillism, so there will be orange complementary color dots in the band.

**motif animation**:
- Seine River in the window: sailboat floating (40px/s), steamboat smoking, silhouette of lady holding umbrella + little monkey.
- Point on the river 6fps reroll hash = ripple.
- An orange-red butterfly flies around the top of the table indoors (`sin(2.6t)·120`), flapping its wings `|sin(20t)|`.
- 6fps changes 7% of the dots to matching colors to show light trembling between dots. The first version used 4fps/3%, and independent reviewers judged the film as "basically frozen" (the average difference between adjacent frames is 0.1–0.2); after changing it to 6fps/7%, it rose to 0.45.

**characters**: 1880s dark blue and purple long skirt + waist and back bustle (a curved piece in the `back` hook) + white high collar + orange buttons + small round hat with red feathers. A folded red parasol rested on the back of the chair.
**pit** (both are at the renderer level)
- Preferring a single solid color (with a penalty) will cut the gradient wall into several vertical strips of color.
- After the ratio is changed to a continuous value, the matching color will still appear when switching in the entire border column. It depends on the target color dithering in step 4.
- There are no light colors in the first version of the color palette. The bright wall is broken down into white + skin color + scattered blue dots, which looks like snowflake noise.

---
