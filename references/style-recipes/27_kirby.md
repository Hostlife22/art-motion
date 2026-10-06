# 27_kirby · 1966 Marvel Galaxy Era (Jack Kirby + four-color offset printing)

> Source: Migration Test C (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/27_kirby.js`.

File name during experiment: `scenes/k1_kirby.js` (line 255). Each frame is about 20ms, and the frame difference is 7.5%.

**Pipeline: Draw the same geometry twice**
1. **Color plate layer**: paper `#f4ecd6` + flat coating + Bendai dots. The walls are covered with C dots (pitch 9, r 2.7, 15°) on a light blue background, the floor is covered with purple dots (pitch 9, r 3.2, 75°) on a dark blue background, and the skin is covered with red dots (pitch 7, r 1.5, 75°).** Whole layer `drawImage(color, 4, 3)`=Inaccurate color registration**.
2. **Ink Line Layer**: White background, "White Fill → Shadow → Black Stroke 6px" for each component. When synthesizing, `multiply` is superimposed on the color plate, white = transparent. Whitening part by part covers up the lines of previous parts, so only visible lines remain, no visibleLines are needed.
3. **Kirby’s spotted blacks+feathering**: Light comes from the window (LIGHT=(-0.86,-0.5)).
   - Black Crescent: `path ∩ ¬translate(path, LIGHT·d1)`, d1=14. The method is to first `clip(path)`, then use "full screen rectangle + path after translation" to make `clip(…,'evenodd')`, and finally fillRect black.
   - Feathering strip: Use the same method, use d2=30 to get a strip, and draw parallel lines along the light direction in the strip (spacing 9px, line width 2.6).
   - Parameters (d1/d2): skirt 16/34, torso 14/30, sleeves 10/22, hair 12/26, cat body 16/34, desktop 10/18.
   - One function to apply Kirby-style shading to any Path2D.

**motif animation**
- **Kirby krackle**: A cluster of 16–26 black circles. The distance is distributed according to `R·rnd^0.7`, the closer to the center, the larger (`R·(0.05+0.2·(1-d/R))`), the seed is changed at 12fps, and the radius pulses according to `sin(18t+i)`. 6 clusters move along the S-shaped energy flow outside the window (`(k/6+0.42t)%1`). The energy flow is orange edge, yellow core belt + zigzag ink edge. Also use krackle for heat (4 small clusters floating upwards).
- **Speed ​​line**: Cup holding speed `|sin(min(1,lt/0.9)π)|`, drag 9 black lines down from the bottom of the cup, 70–180·v in length, 12fps shaking; two movement arcs behind the elbow.
- **Onomatopoeic large characters SLURRP!**: lt 0.52 and up `outBack` pops up, use `Bangers-400` 132px (×0.82); black extrusion 7 layers (each layer offset (0.8d,d)) to make Kirby's three-dimensional wooden characters; 46px above the red characters are clipped into yellow (two-color characters); the bottom is 26 Sharp yellow explosion frame; 12fps ±3px jitter.
- **Divided frame**: Nominal frame 24..1534, the right frame is a close-up of the cat's face, the pupil moves up with `cup` (`lerp(14,-18,cup)`), and looks to the left. The background is magenta background + yellow dots + 44 focused black triangles (12fps conversion) + 6 clusters of krackle around the head. The bottom narration box reads "BUT THE CAT IS WATCHING!" and the upper left narration box reads "MEANWHILE, AT TEA TIME...". The counter is made into a black frame on a yellow background and a narration frame with black offset projection, and is placed in the upper right grid slit.

**characters**: 1960s red A-line skirt, white Peter Pan collar (two ovals), three black buttons on the front, black headband (an elliptical arc in the head rotation coordinate system, line width 11), everted hair tail (drawn in the `skirt` hook, located behind the torso). The chair is a Saarinen Tulip Chair.

**pit**
- The onomatopoeia is initially placed at full size (1000,300), covering the window and the girl's face. Move to (990,318) and shrink to 0.82.
- The large black oval on the right side of the close-up of the cat, which made the cat resemble a tortoiseshell cat, was changed to a narrow crescent with a welted edge.
- The planetary ring should be split into the back half arc (drawn first) and the front half arc (drawn later), otherwise the ring will pass through the planet.
- **Can still be improved**: The picture is more "clean pop comics", and it still lacks Kirby's square fingers, more exaggerated perspective and muscle tension.

---
