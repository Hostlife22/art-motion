# 25_ghibli · 1988 Ghibli style hand painted watercolor background art

> Source: Migration test B (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/25_ghibli.js`.

The file name during the experiment: `scenes/c4_ghibli.js` (about 270 lines). The median of each frame is 17ms, and the first frame is 619ms (watercolor master cache); the frame difference is 5.1%.

**Watercolor Renderer**
- `deform(pts, depth, amp, r)`: Midpoint displacement. Each round pushes an approximate Gaussian quantity (the sum of 3 uniform numbers) along the normal direction at the midpoint of each side, the amplitude is proportional to the side length (min(1, len/80)), and each round amp×0.6.
- `wash(g, pts, color, {layers, alpha, amp, seed, edge, blend, fill})`: First deform 3 rounds to get the base shape; then deform 2 rounds for each layer, fill it with `multiply` low α (transparent pigment overlay color), and draw a 1.6px edge of the same color with α=edge. The strokes are superimposed layer by layer, which is the **water mark edge** where the paint is deposited on the edge. fill can pass gradients (sky, wall).
- Commonly used parameters: large area wall layers 5, α 0.4, amp 12; color halo layers 3, α 0.045, amp 40 (large deformation); wooden board layers 3, α 0.5, amp 3, edge 0.14; opaque white (window frames, tablecloths, clouds) use `blend:'source-over'`, α 0.9–0.95.
- Wall = radial gradient wash (window edge bright `#fbf3e0` → corner `#dcc49a`) + 28 large-scale deformed transparent halos (warm yellow, pink, blue-gray, light green alternating) + dark halos at both corners. The wainscoting and floors were changed in color and dyed piece by piece. Finally, `multiply` α 0.3 is layered with a layer of high-frequency paper grain particles.
- Cloud: white opaque round ball (16 puffs, use wash to draw the edges) + `source-atop` stack bottom blue-gray gradient, cached into sprites. The large camphor tree is also an elf, rotating ±0.025rad around its roots.

**Celluloid characters `cel(c, p, base, shade, dx, dy)`**: First fill the whole block with the shadow color, then translate it (−dx, −dy) toward the light in clip(p) and then fill in the base color, leaving only a crescent shadow on the backlight side. Finally, draw a 2.4px warm brown line `#4a3428`. One function is Ghibli-esque two-color celluloid.

**motif animation**
- White gauze curtains: two pieces, hem bulge `q²·(90 + 70·gust)`, gust = 0.55 + 0.45·sin (3.2lt + phase), then stack `sin(7lt + 6q)` small ripples; 3 layers of translucent wash, fix the seeds, so the edges do not boil.
- 360 blades of grass outside the window: The wind comes in bursts, `wind = 0.5 + 0.5·sin(3.1t − 0.018x)`, the phase advances along x, and a wind wave can be seen sweeping across the grass slope.
- Cloud drifting 22–30px/s; the tree crown is swaying slightly; 34 komorebi light spots on the wall (`screen` warm yellow radial gradient, the position is drifted with noise, the brightness is `sin(5t + 1.7i)` flash); the daisy on the table nods; the girl's long hair is blown to the right back by the wind (7 o'clock smooth, wind push); the red bow ribbon shakes; the hanging edge of the tablecloth swings.

**characters**: long blond hair + red bow (a tribute to Kiki's Delivery Service, not copying the characters), cyan skirt + white apron + white cuffs; the cat is warm orange + off-white celluloid. The broom against the wall in the background is an Easter egg.
**Watercolor coloring of characters**: The reviewer said "the background looks like it, but the characters don't look like (flat vector)". Draw the characters into off-screen L first, create a new texture layer M (paper grain α 0.8 + 40 transparent color halo `charBloom`, α 0.1, amp 16), use `destination-in` to crop M according to the silhouette of L, and then use `multiply` to stack it back to the screen. The thread color is softened from `#4a3428` to `#6a4a38`.
**Curtain**: Reviewers say it’s not too good. gust frequency 3.2 → 5.4, drum `q²·(60 + 150·gust)`.

**pit**
- When the color halo α is 0.07×4 layers and the particle multiply is 0.5, the wall looks like moldy old parchment. Ghibli's room is bright: the color halo alpha is reduced to 0.045×3 layers, and the gradient is overall brightened by one level.
- The first version uses two rectangular washes to join the wall (the right side is darker), with a hard seam at x≈1100. For dark parts, use heavily deformed polygons (amp 60), not rectangles.

**Can still be improved**: The character is still flat, so Ghibli-style hair highlights can be added; the flow of curtain shadows can be added to the light spots on the ground.

---
