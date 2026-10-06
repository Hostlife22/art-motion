# 24_hopper · 1942 Hopper American Realism (hard light block surface)

> Source: Migration test B (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/24_hopper.js`.

File name during experiment: `scenes/c3_hopper.js` (about 150 lines). Median 13ms per frame (first frame 54ms); frame difference 6.0%.

**Core technique "dual version cutting"**: The same `room(g, K)` function draws two buffers according to two sets of colors - the backlit version `SH` (cold green wall `#5d8679`, dark floor `#5b3d2b`) and the light-receiving version `LT` (warm yellow wall `#efcf8f`, bright floor `#c98b52`). For each frame, the backlight version is drawn first, and then the moving light spot polygon clip is used to enter the light-receiving version. The edges of light and shadow are naturally hard, and can also be translated as a whole. The same goes for characters and furniture: `girl(c, K, G)` is painted once with the backlight color, and then clipped into the oblique light band and painted again with the light-receiving color.

**Spot geometry** (dx = 30 − 95·easeInOut(lt/1.25), shifted left about 95px in 1.2s)
- Wall spot WP: (1420+dx, 250) → (1920, 470) → (1920, 730) → (1420+dx, 730)
- Ground light spot FP: Connect under the wall light spot and expand to the lower right
- Character light strip OP: left edge from (1345+dx, 0) to (1185+dx, 1080). The light edge swept across the girl's face in this section, from half the face being backlit to the whole face being illuminated.
- Window lattice shadow: vertical strip 24px + an oblique strip parallel to the upper edge of the light spot
- **Projection of a person on the wall** = The silhouette of the person is translated (+150, +18) and then drawn off-screen, `source-in` is filled in the backlight plate, and then drawn back to the spot area. The effect is that the light spot reveals the backlight wall, which is synchronized with the character's posture.

**Motif Animation**: The light spot moves slowly (core); the rotating column of the barber shop in the red brick building across the street (a tribute to "Sunday Morning") outside the window, with red and blue diagonal stripes going up 60px/s; the roller blind pull rope `sin(4.2lt)·0.07rad` swings lightly; 26 floating dust particles in the light belt (only shown on the right side of the light edge); hot air.

**Texture**: The oil painting drag brush uses vertically elongated fbm (x·0.06, y·0.006) as the main part and diagonally as the supplement. 1/4 resolution is generated and then enlarged, `soft-light` α 0.2. A 10px hard shadow is drawn on the right side of each window opening outside the window, and the roller blinds are pulled to different heights (0.25–0.7). These are Hopper’s details.

**Color palette**: backlit wall `#5d8679`, parapet `#4b6d63`, floor `#5b3d2b`; light-receiving wall `#efcf8f`, parapet `#d8ad68`, floor `#c98b52`; skirt backlight `#7a2c2a` / light-receiving `#cc4a3c`; blonde backlight `#a8893f` / light-receiving `#f3d67e`; brick `#b4553a`.

**pit**
- For the first version of brush marks, use transverse fbm, α 0.35, and the wall will look like water marble. Hopper's wall is flat, and the brush marks are only vaguely visible.
- When changing the code, insert the comment in the middle of a line and comment out the second half of the same line (pay attention when doing batch replacement in Python).

**Characters**: The first version had updo hair and a long red dress. The reviewer said she "looks like an adult woman and can't read as 17 years old." Change it to shawl long hair (`hair:'long'`) + a blue hairband, and you will look younger. The cat's white breast is a smooth oval, backlit white `#dcd6c8` (in the first edition `#c4bdac` was pronounced gray-white cat).

**Can still be improved**: The cat is in the shadows the whole time, which is darker (this is a trade-off for loneliness). You can also give your cat a small patch of light coming in through the back window.

---
