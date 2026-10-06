# 08_impressionism · 1874 Impressionism (Monet)

65–76ms per frame (median 69ms). The main overhead is two full-screen P.strokes plus one characters stroke.

## Pipeline (according to 09_postimp benchmark)
1. Flat painting `impBase`, repaint each frame, because the poppies, clouds, bouquets, potted plants, and curtains are all moving:
   - Pink and purple wall (#d8bede→#f0c8cc→#f2c4d4), with a warm yellow sunlight radial gradient of r=900 stacked on the upper right.
   - Garden outside the window: sky, woods, red-roofed house, grassland, 70 poppies (the bottom of the stem does not move, the flower heads swing horizontally `sin(t·3.2+ph+x·.02)·(6+r·.6)`), a woman and child holding a parasol (a tribute to "Poppy Field"), and flowers.
   - White window frame, lavender curtains, "Sunrise·Impression" on the wall, white and purple tablecloth on the round table, vase, teapot, potted plant on the right (the whole group of leaves is arranged with `sin(t·1.9)·8`).
2. Redraw the strokes, **twice**:
   - Main screen: cell 11, len 20, width 7, outline 0, jitterCol 26, use mask to exclude window scenery and small paintings on the wall.
   - Window view and "Sunrise": cell 6, len 11, width 4.5, only draw within the mask range.
   - The first edition only had one rough stroke, and the house outside the window and the woman holding an umbrella were all blurred out, and "Sunrise" was also painted diagonally. After splitting it twice and changing "Sunrise" to a horizontal water wave pen, I can recognize it.
   - The canvas is laid out #f2e6ee first, and the light-colored base is exposed in the gaps between the strokes.
3. Orientation field: The wall slopes upward to the right (−0.95 radians in the sunlight area, −0.55 in the rest, plus ±0.55 noise); the ground is nearly horizontal; the curtains and tablecloths are vertical; the potted plants radiate outward from the mouth of the pot; the sky in the window is horizontal.
4. Regional color palette `P.swatch` (mixBase 0.3–0.45): 9 colors for the wall, pink, purple and yellow; 7 colors for the sun wall, cream yellow; 7 colors for the ground, rose orange and purple; one set each for the sky, grass green, curtains lavender, and tablecloth blue and purple. The white window frame is determined by `col > (240,236,225)` and mixed back to white. Otherwise, it will be painted into the wall color and the window frame will disappear. Poppy red returns null, retaining the original color of the script.
5. Characters: First use the fill mode of `RIG.drawCat` / `RIG.drawGirl` to paint flat, and then use `source-atop` to run P.strokes (cell 7, len 13) on the characters layer, and only draw strokes inside the characters. The white skirt is drawn in four colors: white, lavender and cream. After that, only the facial features are filled in, using lavender thin lines, and the impressionist style does not outline the outline.
   - Straw hats, blue ribbons, and belt streamers are all flying.
   - `pal.line` must set the hair color to gold: even if lw=0, the locks and lid of drawGirl will be traced with pal.line. The default dark blue will leave dark lines next to the face. The same goes for cats, set `line`/`whisker`.

## Motif animation
- **Sunspots Flashing**: 26 patches (6 on the table, 20 on the ground). The intensity of each block is `0.5+0.5·sin(t·sp+ph)·sin(t·sp·0.53+2ph)`, and then clamped, so the rhythm of light and dark is irregular. Plaques slowly drift sideways ±10px. Each block is 40 short strokes of bright yellow and white, shot at 8fps for seed boiling. The first version used screen overlay and α0.75, which was almost invisible on the foundation. It was changed to source-over and α0.95 ​​to be bright enough.
- There are 60 diagonal bright pens in the sunny area on the wall. Press 6fps to change the seeds and flash.
- Cat hair flash: 60 candidate points, use `isPointInPath` to limit the left half of the cat body and cat head (light-receiving side), press `sin(t·7+h·30)` to turn on and off.
- Full-frame 8fps boiling, steamy white.

## Performance
Two full-screen strokes plus one characters stroke, about 69ms. During the transition, the engine has to draw the two eras before and after it at the same time. The total time from 08→09 is about 69+110ms, which will exceed 150ms, but it only occurs in the dozen or so frames of the transition.

## v2 rework (review: the entire screen is rewashed every 7-8 frames, frame difference 18)
- The stroke positions are all fixed: `boil: 0`. **Fixing the seeds is not enough**: The random numbers of P.strokes are a sequential flow. When the palette returns null, the jitter will eat 3 more numbers; whether to return null or not depends on the color of the manuscript. When the poppy is shaken or the potted plant is placed, the pens in all subsequent grids will be rewashed as a whole. `stable(palette)` is packaged to only eat 1 number per grid and never returns null.
- Characters strokes do not use alphaMask (the skipped grid will change as soon as the cup is moved, and the entire layer is rewashed), and changed to a self-writing loop: use `U.hash(i,j)` for random numbers in each grid. Incidentally, each frame dropped from 115ms back to 72ms.
- "Live" is now performed by local movements: light spot drift ±44px, blinking frequency 5-11; poppy swing amplitude increased to 10+; clouds moving horizontally 45px/s; curtains and potted plants swinging; flowers and plants outside the window turning ±0.22rad according to the wind direction; cat flicking its tail (×2.2) and turning its head (look).
- Stationary segment frame difference (480×270, mask counter, remove transition frames at the end of the segment): v1 has an average value of 4.14 and a peak value of 20.5, indicating strobe; v2 has an average value of 0.57 and a peak value of 1.9. Original film 0.77.
