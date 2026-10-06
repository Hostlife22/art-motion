# 23_dali · 1931 Dali Surrealism ("The Persistence of Memory")

> Source: Migration test B (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/23_dali.js`.

The file name during the experiment: `scenes/c2_dali.js` (about 235 lines). Median 47ms per frame (first frame 84ms); frame difference 4.6%.

**Pipeline**
1. The original plate is divided into three buffers, because the shadow must be sandwiched in the middle: `dali_bg` (sky, sea, rock, earth) → draw shadows in each frame → `dali_wall` (broken wall fragments with windows + dead branches) → `dali_block` (stone table + stool) → soft clock → characters.
2. **Volume filling `vol(c, path, x0,y0,x1,y1, a, b, occl, blur)`**: linear gradient filling, and then use shadowBlur to draw a dark edge in the clip to make the inner shadow. There are no hooks in the entire film, and this is all responsible for the academic roundness.
3. **Long Shadow**: Use shear affine to project the silhouette of each object to the ground. `setTransform(1, 0, −kx, ky, kx·yg, yg·(1−ky))`, yg is the landing line of the object (wall 700, table/cat 905, person 930). All silhouettes are first drawn into an off-screen (pure black) image, and then the entire silhouette is stacked with α 0.55 and blur 1.5px to avoid deepening the overlapping shadows. Use clip to leave only the ground part (y > 594). `kx = 0.85 + 0.6·easeInOut(lt/1.2)`, the shadow becomes obviously longer in 1.2s.
4. **Soft clock `softMap(o, sag)`**: Disk local coordinates (u,v) → screen. The part with v ≤ fold lies on the table (y is compressed to 0.28–0.32); the part with v > fold hangs down: `X = cx + u·(1 − flare·q)`, `Y = … + d·(0.62 + 0.3·sag) + central sagging Gaussian + sin ripple`. The outer frame, dial, 12 scales, two hands (sampled into soft lines along the mapping), and polyline highlights all follow the same mapping.

**Key parameters**: `flare = −0.12`, negative values ​​will make the hanging part spread out like a soft cloth, with the lower edge rounded; positive values ​​will result in an ice cream cone. drip 0.18–0.4. sag went from 0.1 → 1.4 in 1.2s: the first version 0.35 → 1.0, the reviewer said "the clock is not obviously flowing". Three clocks: window sill R72, table edge R88, dead branches R64 (fold −34, most hanging down). Pointer speed 4.5–6.5 rad/s.

**Motif Animation**: Three soft clocks continue to droop, and the hands rotate at different speeds; the stilt-like image on the horizon (four thin legs walking alternately with a phase difference of π/2, slightly bent at the knee joint at 0.52 height, the body slightly bumping at 14Hz, carrying an obelisk on its back) moves 70px to the left every second; 9 ants crawl around the orange pocket watch making an ellipse; the long shadow becomes longer; the cat's tail softens and droops (tail tip y + q²·34).

**Characters**: Spanish girl, light blue dress + white lapel, blond hair bun, no hook line, volume relies on gradient + inner shadow, facial features are dark brown thin lines. Use gradient orange for the cat, blur 2px translucent pen (soft) for the stripes, and radial gradient for the eyes; use smooth ellipse (606,768) 40×92 for the white chest instead of `K.white`.

**Color palette**: sky `#22407c → #5f88bd → #e9dcae`; sea `#8aa6b8 → #4f6f86`; rock `#e8c27a / #9a6a34`; earth `#d2ad70 → #7a5129`; wall `#f4ead2 → #cdbf9f`; gold `#f0d27c / #9a7426`, dial `#f6efd6`.

**pit**
- The first version of the shadow is thrown in the direction of the audience (ky>0 downward), and is completely eaten by the bottom edge of the frame. The sun should be placed low in the sky in front of and to the left, and its shadow should lie behind and to the right (y′ = yg − ky·(yg − y)).
- The shadow is cast on the ground and must be painted on the wall and under the table, so the base plate must be split into layers and cannot be cached to the end.
- Soft bell flare>0 increases the drip, which is the ice cream cone.
- The background color of this counter is a dark blue sky. The original dark brown characters are invisible, so they are changed to off-white characters + dark shadow.

**Can still be improved**: The characters are still vector illustrations, and finer highlights and dark reflections can be added; the soft "self-portrait" creature lying on its side in "The Eternity of Memory" can be used as the fourth motif.

---
