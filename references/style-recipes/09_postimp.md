# 09_postimp · 1889 Van Gogh (benchmark implementation)

File: `scripts/engine/scenes/09_postimp.js`, about 110ms per frame (three strokes across the entire frame). Other eras are written according to its structure.

## Pipeline
Flat painting draft (large area of wall/floor/window/bed) → flow field brush stroke repainting (regional color palette) → prop layer (table, chair, vase, picture frame, chandelier, individual small strokes source-atop) → environment line draft (dark blue 4.5px, 8fps boiling) → characters (flat painting → fine brush strokes source-atop → supplementary lines and facial features) → Moving highlights (halo dotted line expansion, stars flashing, hot air).

## Key parameters
- Orientation field: the wall is vertical −π/2 ± 0.22·noise; the floor points along the perspective line to the vanishing point (960,330); the starry sky rotates along the nearest vortex tangent +0.3t; the light halo is along the circumference; the head of the bed is vertical and the sheets are nearly horizontal.
- Three strokes: neither wall nor ground cell10 len22 w6.5; wall cell14 len64 w8; ground cell12 len46 w8. Stroke outline 0.8–0.9, blend 40–45% dark blue. 8fps change seed.
- Zone swatches (P.swatch, mixBase 0.3–0.45): Walls `#7f9be6 #5f7fd8 #a7bbf2 #6c6fd2 #8ad0e6 #c3cbf6 #4f6cc8 #9a8fe0`; Stars `#22339a #2f4fb8 #5c86dc #8fb6ee #1b2a78 #3c6bd0`; Floors `#c0573c #a8453a #d7774a #8e3b30 #5f8f6a #c96a52 #e08a5c`.
- 7 circles of orange/light orange spiral patterns on the cat's body (clip to body, 0.6rad/s turn) - the "whirlpool cat" of the original film.

## Pit
- Running the entire map with the same parameters will turn it into a carpet: walls, floors, and the rest must be divided into three passes.
- Small objects are broken by large strokes: all are broken into prop layers.
- What comes out only by color dithering is "noise of the same blue". The feeling of Van Gogh comes from the dozens of hues in the regional color palette.
