# 04_roman · 79 AD Pompeii Mosaics - Technique Notes

File: `scenes/04_roman.js` (~330 lines). Final self-test: warm max 17ms / mean 13ms (1920×1080), init 206ms (once during boot), 17,871 stones, of which 13,067 are re-colored in the dynamic area every frame. Certainty passed.

## Core idea: The layout is only counted once, and the color flows through the stones every frame

The animation of the mosaic should look like this: the stones themselves are fixed to the wall, and the movement is the color flowing from one piece to the other. So the renderer is split in half.

1. **init (`build()`, 206ms)**: First calculate where each stone is, how big it is, which direction it faces, which pixels belong to it, and the light and dark of the slope, and save them as `ID` (Int32, the stone number corresponding to each pixel, -1 means mortar) and `SH` (Uint8, light and dark of each pixel, 128=1.0).
2. **Each frame**: Redraw the flat painting sketch, `getImageData` once, then pick the color at the center point of the dynamic stone (plus the fixed color jitter of each stone), then fill in the dynamic rectangle with `color × light and dark>>7` pixel by pixel, and finally `putImageData` to its own off-screen canvas, and use `drawImage` to paste it on `c`.
   - Pitfall: **You cannot directly do `putImageData`** on `c`, because it will ignore the engine's punch zoom and transition cropping. It must be written into the off-screen canvas first and then `drawImage`.
   - Each frame only processes about 1 million pixels pixel by pixel (4 border strips, inside the frame, girl, cat), and the JS loop takes about 5ms. All off-screen contexts use `{willReadFrequently:true}`, `getImageData` is faster.

## Layout of stones (andamento: row along outline)

Simplified based on the ideas of Hausner 2001 "Simulating Decorative Mosaics".

- **Structure diagram**: Static manuscript plus the cat and girl at frame 0 (without drawing the moving near-side arm), downsampled to 960×540. If the sum of the RGB differences of adjacent pixels is greater than 34, it is recorded as an edge, and the boundary of the border zone in the category map is also counted as an edge.
- **Distance field**: Use Felzenszwalb–Huttenlocher exact Euclidean distance transform (two passes of 1D lower envelope), about 20ms at half resolution.
- **Place stones along the contour line**: Candidate pixels satisfy |d−(k+½)s|<1.5, k<the number of circles of this type, that is, the contour strip of the distance field. Starting from the unvisited candidate points, the candidate "most consistent with the direction of the previous step" is prioritized along the 8 neighborhoods (the direction is smoothed by 0.6/0.4), and a piece is placed when the distance from the previous block is ≥ s. The orientation of the stone is tangential to the distance field gradient. Spatial hashing ensures that the distance between any two blocks is ≥0.8×average size.
- **Regular filling of holes in rows**: Each category lays a grid with brick joints staggered by half (row jitter ±5%, column jitter ±9%). Use 0.86 for the minimum spacing check, just put it down if you can. This step also fills in the holes between the outline rows and along the central axis.
  - Pit: At first, only the grid was placed where the "distance ≥K×s" was placed. As a result, there was not a single stone in the narrow shape (cat tail, 26px wide), and the entire tail was exposed from the mortar. It was solved after changing it to rely only on the minimum spacing.
- **Border strips are arranged separately**: Each side is arranged in 11 rows in its own local coordinates, the stones are 7.6px, and the width along the edge is randomly between 0.86–1.14; the four corners are 11×11 squares.

| Category | Stone side length px | Number of circles along outline | Color dithering |
|---|---|---|---|
| Wall | 12 | 1, then regular rows | ±8%, 7% of stone blocks are additionally darkened by 12% |
| Halo (white edge outside person/cat/object) | 11 | 9 (the entire halo follows the outline) | ±5% |
| Girl's Body / Object | 10 | All along the outline | ±5% |
| Girly face, cat head | 6 | All | ±4% |
| Hair | 8 | All | ±5% |
| Volcano painting inside | 9 | 2 | ±6% |
| Outer frame tape | 7.6 | Rows along edge | ±5% |
| Text | 7 | All | ±5% |
| Ground Zone | 13 | 1 | ±6.5% |

In addition to surface and internal dither, each stone also adds an additive grayscale dither of ±7. 9% of the stones are warm (+12,+4,−8) and 7% are cold (−6,0,+9).

## Stone Shape and Mortar: Weighted L∞ Voronoi

- Each stone is a rotating block. The four half-side lengths are independently taken as `s/2×(1.08–1.28)`, and the rotation angle is jittered by ±0.06rad. The distance from a pixel to stone k is defined as `D=max(|u|/h±, |v|/h±)`, where (u,v) is the position of the pixel in the local coordinates of the stone.
- During rasterization, the smallest D1, the next smallest D2 and the corresponding stone number are recorded for each pixel. The cost is 1.5h for the bounding box of each stone.
- **Mortar**: Pixels that satisfy `D1>1`, or `(D2−D1)·h/2 < g` (g = clamp(0.1s, 0.75, 1.25)px) are considered mortar, that is, they fall near the bisector of the two stones. Therefore, the seam width is about 1.5–2.5px, and the stone is "cut" by the neighbor to create irregular edges, which looks like it has been really chiseled.
  - Pit: The half side length was initially taken as only `s/2×(0.9–1.1)`, the stones were smaller than the spacing, and as a result the mortar occupied about 40% of the area and looked very thin. Make the stones 8–28% larger than the half pitch and leave them to the bisector to cut them, and the stones will be dense. This is the key to texture.
- **Bevel Shading**: Within 2.2px from the edge, it will be brightened or darkened by ±16% of the dot product of the outer normal line and the light direction (−0.6,−0.8) (upper left is brighter, lower right is darker). Add the dome term `−5%·D1²` and ±3% pixel grain.
- Mortar color: `rgb(112,103,92)` ±8 noise.

## Flat painting and color matching

- Wall `#e4ddcd`, halo `#f5f1e8` (a 44–50px halo outside everyone and objects, the stones will have a white border along it), stroke `#46322a`, stroke 8px (faces 8px so they line up).
- Picture frame: red `#a8322a`, from inside are dark red `#7c221d` lines, gold `#d0a23c` lines, and dark lines.
- Volcano: The three sides are bright `#7c84b8`, medium `#4e5796` and dark `#2f3672`; sky `#9ec0d8`→`#d3e3e4`; hillside `#6f9341`/`#92b254`; ground `#cba344`; cypress `#2b5a2f`; lava `#d64a22`/`#f2952c`.
- Girl: Stola `#efe7d5`, two red stripes at the hem `#a8322a`; red shawl divided into three pieces (one on the back, one on the knees, one hanging down the front), pleated line `#7c221d`, with a gold brooch; short cuffs are made by cutting a circle with the shoulder as the center and a radius of 62 in the upper arm, with a red edge; blonde hair `#dcaa42`, layered lines `#9c6c1c`, spiral bun on the back of the head; the red hair band uses three beziers and rotates with the tilt of the head. The eyes are painted as 10×6 white and dark with a radius of 5.5, so that two 6px stones, "one white and one dark", are completed.
- Cat: orange `#dc8530`, dark back `#c06a24`, stripes `#9c4818`, white `#f7f2e8`, big yellow eyes `#e9c22c` (radius is eyeR×1.65), red collar `#b02a22` with gold pendant. The body is smoothed into a pear shape using `RIG.smooth(K.bodyPts)`, replacing the original polygon. The ring pattern of the tail is drawn with a dotted line `setLineDash([9,13])`.
- `BEWARE CAT`: English inscription drawn with thick custom strokes. C uses elliptical arcs; B, E, W, A, R and T use polylines. Stroke 14px, character height 60px, gap 16px, horizontally scaled to 600px.
  - Pitfalls: Use Cinzel-700 to fillText directly. The thin horizontal pen will break under the 7-9px stone (E becomes F, A loses horizontal), and it will stick to a ball when the word spacing is tight. After three rounds of iteration, the conclusion is that "mosaic characters = thick strokes of equal width, each stroke is about 2 stones wide."

## Motif animation (this section lt 0–0.94s, drawn to 1.29s during T04 transition)

- **Four-sided wavy patterns flow clockwise**: Use `setTransform` to cut each edge to local coordinates (u in the clockwise direction, v from outside to inside), and draw the same Vitruvian scroll: start from the inner black belt, spiral r from 24 to 5, turn 2.25 times, line width 13, period 81px. The phase is `42·lt + 81·easeInOut((lt−0.485)/0.365)`, that is, it drifts at a constant speed throughout the entire process, and then moves through one more cycle at frames 226–248 of the original film. The stones are stationary, so the black and white flows between the stones, which is exactly what a mosaic looks like when it moves. The border with 20% of pixels changes between 0.4→0.9s.
- **Smoke from Vesuvius**: The crater is only 70px from the top of the frame. The smoke drifted upwards and was quickly cropped out of sight (this was a pitfall in the first version). Instead, let the entire gray cloud belt float to the right at 55px/s (period 380px), add 9 clouds of smoke (deep `#3f3c3a` → shallow `#a29c94`) and float low to the right against the sky, add 12 sparks (10px square, parabolic trajectory) and crater lava pulsation. 4.4% of the pixels in the frame are changing.
- **Holding the cup**: The rhythm is `choreo.cup/sip`, the cup is a golden amphorae cup kantharos, the rim of the cup has white stone hot air, and the transparency is 1−0.85·cup. The route is self-written `armPose` (see "Review and Repair" at the end of the article).
  - Pit: When the wall stone is 15px, the hand and cup are mushy in the large stone. At one time, the arm sweeping area was individually replaced with 8.5px stones. However, it turned into a whitish patch when stationary. Finally, it was changed to a uniform 12px for the entire wall.
- **Cat**: Use `choreo.tail×1.6` for the tail (the original width under the 9px stone is too small to see the swing), and the eyes turn into orange stones with a dark line when blinking.

## Performance and dynamic rectangles

- The dynamic rectangle is calculated from the bounding box of the sampling posture during init (cup is in 0.05 steps from 0 to 1, sip is 0/0.15; cat tail is within the range of ±0.75), and is expanded by 58px to cover the halo and heat. Outside the rectangle is the static mosaic of frame 0.
  - Pit: The rectangle must be large enough, otherwise the stones across the border will appear half in new color and half in old color.
- The frames of the Roman segment in the entire film timeline (including the two transitions before and after, and the old and new layers with the same picture), except for the cold cache of other eras when the transition is first entered, are all under 40ms.

## What you need to know during self-examination

- `selfcheck`'s "motion differential 0.2↔0.7" will be contaminated by the engine's camera impact. When lt<0.37, the entire picture is scaling, and the result is reported as 68%, which means the painting is not moving. Switch to 0.4↔0.9 (the impact is over) and measure: 6.2% of the whole screen, including 20.4% of the border, 8.4% of the girl, 4.4% of the picture frame, and 0.8% of the cat.

## Could be a better place

- When the girl raises the cup to her mouth, her hands, cup, and face are squeezed together, slightly blurry at the stone scale of 6–8.5px.

## Review and repair (second round)

- **Cat**: Use the sole of the foot (540,905) as the anchor, use canvas transformation to shrink to 0.85 (category map, dynamic rectangle synchronous scaling), the tip of the ear drops from y≈540 to about 590, and the halo no longer touches the frame. The head was changed to a Pompeii cat with a full face: two R17 large yellow round eyes, black vertical pupils, 7px dark eye sockets, an 11px dark stroke on the head, and 6px small stones in the category image, so the outlines can be lined up.
- **Toast to make faces**: Instead of following the original toast route of the skeleton, use the self-written `armPose` instead. The cup moves along the quadratic Bezier movement of "table top → front and upper (1150,470) → lip front". The end point is that the right end of the cup rim is attached to `G.lips[0]`, with an inclination angle of 0.15rad (8.6°). Hand cupped at foot of cup (offset interpolated from (28,34) to (3,44)), IK with same jib length 165/122 and elbow direction. The forearms are raised in front of the chin, and the nose, lips, chin and eyes are exposed. Make the face stroke bold to 10px.
- **Wall patching**: Removed the category "Arm Sweep Area 8.5px". The wall stones are uniformly changed to 12px (which is also closer to the scale of the original wall stones). The walls in the dynamic area share the same layout as the surrounding ones, but the color is re-selected every frame, and the boundaries cannot be seen.
  - Lesson: Never change the size of the stone for details in the dynamic area. When it is still, it is just a patch.
- After repair: warm max 17.1ms, mean 13.0ms, passed with certainty.

## Review and revision (third round, v1 review report items 3 and 4)

- **The border cannot be seen to be scrolling**: The entire timeline (renderFrame) is actually moving, but under the method of "the stone does not move and only changes color", the scroll only moves 1-3px per frame. After being quantized by the 7.6px stone, it is almost not bright in the motion heat map.
  - Modification: Change the border to "conveyor belt". Prebake a 2106px (26 cycles) stone strip in init. The pattern period is 81px, and the stone block layout also cycles at 81px: 11 blocks per row, with random widths, but normalized to exactly 81px, and dithering is also reused periodically. Therefore, any phase shift of the entire band can be seamlessly connected.
  - Perform `c.transform (local coordinates of the edge)` on each of the four edges in each frame, then crop and `drawImage(strip, BW−2·81+phase, 0)`, and the stones will follow the pattern and move clockwise. The four corner squares remain static.
  - The phase is changed to `15·lt + 81·easeInOut((lt−0.485)/0.365)`, the uniform drift is reduced from 42 to 15px/s, and the main motion is left to the period of frames 226–248 of the original film.
  - Motion in static segments (motion.py, 480×270 average frame difference, frames 222–253): Replica increased from 1.98 to 4.62, original film 2.90. The drift is 5.5 when it is 42px/s.
  - Rule: When the displacement of the slow pattern is smaller than the size of the stone, "color change only" will be quantitatively eaten, either the stone will be allowed to follow, or the displacement must be much larger than the stone.
- **Cup cannot be read**: The cup was removed from the manuscript and changed to a 4.4px patch of small stones `cupSprite`. The content is a double-eared cup magnified 1.3 times: dark stone outline, golden cup body (dark right side), bright cup rim and dark cup interior, two ears, and cup base. Each frame is stacked on the mosaic as a whole according to the position and inclination of `armPose`. The heat was also changed to two rows of white ashlar (`steamTiles`) ascending sinusoidally with mortar edges. Only the white halo of the cup remains in the manuscript.
  - Rule: Props less than 3 stones wide cannot be read in a fixed layout and should be made into "emblems" that can be moved around (emblema-style pieces).
- **Unreadable facial features**: Face stones changed from 6px to 5px. The eyes are white 13×7, dark 8×7, about 3 dark stones and white; the lips are changed to red `#a8282a`, an 8.5×6 oval, about 2 blocks; the eyebrows are 6px dark brown. 1080p Zoom in half and you can read the eyes and mouth.
- After repair: warm max 20.9ms, p90 17.4ms, mean 13.9ms, passed with certainty.
