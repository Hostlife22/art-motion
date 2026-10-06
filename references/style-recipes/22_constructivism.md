# 22_constructivism · 1924 Russian constructivist poster (Rodchenko/Lisitsky)

> Source: Migration test B (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/22_constructivism.js`.

The file name during the experiment: `scenes/c1_constructivism.js` (about 175 lines). Median 5ms per frame; frame difference 3.6%.

**Pipeline**
1. Full cache of the base plate `cs_bg`: off-white old paper (`P.texture` `#e9dfc4`, dark `#d9c9a4`) → diagonal black bars on the left (rotate −0.5), red squares (rotate 0.26), 5 lines of "text" black bars → thin diagonal lines on the right, red dots, vertical geometric characters "TEA" in black vertical bars → A large black circle behind the character's head (center (1330,395), r 215) → oblique red ground (0,905) → (1920,856), with a 12px black line along the upper edge → window → black table (red edge, diagonal support) → black block stool.
2. **Window = photo collage**: First draw a grayscale "photo" off-screen (sky gradient `#5e5e5e→#e8e8e8`, radial white clouds, dark factory silhouette, chimney), then use `halftone()` dots (cell 7, gain 0.8); the Shukhov Tower is drawn on the dots with clear black lines (five sections of hyperboloid, two groups of 18 straight busbars in each section, phase difference ±1.1rad, omit the back sin<-0.2), this is exactly the "photo + hand-painted" collage.
3. **Skin = dot photo**: The face, neck, and hands are first drawn with a grayscale gradient (light at first and dark at the end, `#fafafa→#9c9c9c`) to off-screen, and then dotted (cell 4.6, gain 0.74, 45°). Underlay the dots with off-white, and draw 7px `#fbf7ea` on the outer circle first. This circle is the white edge cut from the photo. The facial features were filled in with a clear black pen, and the lips were painted red by hand. The clothes are all flat painted with paper cut + 3px black line; use `shadeDots()` for shadow, and use function to drop screen points within the path.

**Key functions**
- `halftone(c, src, bx,by,bw,bh, cell, col, gain, ang=π/4)`: Sampling src grayscale on a rotating grid, point diameter = cell·gain·√(1−L), only falling at alpha>128. **All points are merged into one path and only filled once**. The face has about 3000 points and takes <2ms.
- Geometric English lettering: 5×7 modules, each letter is a number of rectangles or polygons (the diagonal stroke of N is a quadrilateral, the brevet is a small rectangle above). **Fill each part individually**.

**motif animation**
- Lissitzky red wedge pierces the black circle: the vertex travels back and forth along the 0.34rad axis, `70·(0.5−0.5cos(2π·1.6·lt))`.
- The red dashed ring outside the black circle: dash [46,22], `lineDashOffset = −260·lt`.
- Radio waves at the top of the tower: 4 red arcs, `r = 18 + ((1.4lt + k/4) mod 1)·230`, α and line width attenuate with phase.
- The ground slogan "DRINK TEA!": stamped word by word (the k-th word starts at 0.045k seconds and retracts from 1.5 times to 1 in 0.12s), and then the whole row of waves jumps `−10·max(0, sin(11lt − 0.8k))`; every 4th word is black.
- The two tails of the headscarf `sin(9lt)·6` are swinging lightly; the hot air on the cup is three black folded lines rising up.

**Characters**: Communist Youth League girl - red scarf (part of the head is 13 points, the front edge is moved back to reveal the golden bangs, and two triangle tails are knotted at the back of the neck), white shirt + red scarf triangle + red cuffs, dark gray long skirt (dot shadow). The cat uses paper-cut orange `#e2741c` + off-white, 10px black stripes, the tail is drawn with dotted lines to make tiger spots, and the eyes are square pupils with vertical stripes.

**Color palette**: paper `#e9dfc4`; red `#c8231c`/`#8f1711`; black `#151311`; off-white `#f4ecd6`; blonde `#e3b03e`/`#a87a1c`; cat orange `#e2741c`.

**pit**
- The first version of the short note of "N" is drawn above the character grid (y=-1.7u): it is covered by the previous letter when arranged vertically, and covered by the skirt in the ground slogan. The film review reads "misread lettering". The entire calligraphy and painting was changed to be within 7 squares (the N part was moved down 1.7 squares), and the slogan was also changed to be drawn above the characters (the characters are placed on the poster).
- The first version of "A" uses two reverse slanted legs + horizontal bars put together in a path. The overlap is offset by nonzero. When arranged vertically, it is pronounced as "B". Change to part-by-part fill.
- The base line of the first version of the ground slogan is pressed at y=1060, and the lower half of the words comes out of the painting. Press `translate(x, 990)` to center the character.
- The shadow under the cheekbones is too heavy in the first version and looks like a beard after dotization. The shadow alpha in the grayscale source is half lower than when painted flat.

**Can still be improved**: Rodchenko is more typical of "photos of people + trumpet-shaped text cones". You can replace the hot air with a red and black wedge-shaped cone radiating from the mouth of the cup.

---
