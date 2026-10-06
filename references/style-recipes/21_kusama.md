# 21_kusama · Yayoi Kusama infinite polka dots

> Source: Migration Test A (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/21_kusama.js`.

The file name during the experiment is `scenes/05_kusama.js` (line 124). 0.45↔0.9s is 17.3%, adjacent frame median 2.98%, JS side 4–28ms.

**Wriggling Dots**
- The radius of all points is multiplied by the same "traveling wave starting from the cat": `wave = 0.82 + 0.28·sin(dist·0.012 − 6t)`.
- The points in the entire room expand and contract in circles from the cat's position, as if breathing. This function makes the whole screen come alive.

**Placement of points**
- Wall: two sets of hexagonal grids with large points (30px, spacing 104) + small points (10px, offset), each with ±25–50% jitter. Each point is a slight ellipse with random corners, like hand drawing.
- Floor: 9 rows, the closer they are, the larger (6→28px) and sparse, pressed into an ellipse of 0.42 for perspective.
- The white point of the red skirt is 13px, the spacing is 52, press 46px/s **Climb down the skirt** (clip to the silhouette of the skirt, y offset to take the mold).
- Cat: There are white dots in the orange area and red dots in the white area, crawling down respectively.
- There is also a red dot painted on the cheek (Kusama's body painting), and a red bow with white dots on her head.

**Infinity Mirror Room (Window)**
- 3D grid light: 13×7×3, 6 colors. z Fly to the lens with 0.3/s loop, perspective projection F150.
- Each light is a solid small core plus 3.2 times the halo, and the lighter is superimposed.
- Pitfalls: In the first version, the lights are scattered randomly, the halo is very large, and it becomes bokeh. The regular grid + small solid core gives the feeling of infinite repetition of the mirror surface.

**Yellow Pumpkin**
- 5-petal ellipse, drawn in the order outer → inner.
- Each petal is arranged with black dots in rows: the middle column is the largest (9.5px), and shrinks to both sides, top and bottom, and the size of the dots also changes with the traveling wave.
- Overall Breathing: Scale `1 ± 0.025·sin(5t)`, with the bottom as the axis.

**Ending "self-dissolution"**
- lt 1.0–1.26: The red overlay gradually appears, and the full-screen 120px hexagonal lattice expands from the cat's position to 0.47 times the spacing. After about 0.15 seconds, only the dot matrix is ​​breathing gently, giving the ending a landing point (the reviewer pointed out that the first version did not have a stop frame).
- The last frame stops at the dot matrix of white dots on a red background.
- Pitfall: In the first version, the handicap point expands infinitely, resulting in a white screen. The radius must be capped and finally stop at a dot matrix, not a solid color.
- Pitfall: The skirt and wall are all red with white dots, and the girl will dissolve in the picture. In the final version, the girl's outline is increased to 4.5px, and the red dots in the cat's white area are removed, keeping the orange-white boundary.
