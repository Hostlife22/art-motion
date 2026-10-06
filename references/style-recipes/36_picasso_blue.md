# 36_picasso_blue · 1903 Picasso Blue Period

> Source: Migration test D (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/36_picasso_blue.js`.

The file name during the experiment: `scenes/r5_bluepicasso.js`, each frame is about 24ms.

**Pipeline**: Blue monochrome flat painting sketch (wall, floor, night sea and moon outside the window) → Repaint with wide and dry strokes, then paste 7px and stack 80% → Very light dry brush filaments → Copy the window frame as it is and add small strokes → The table is a single layer → Rough outline of the environment (not shaking) → Waves, moonlight broken shadows, clouds → Characters (overall elongated) → Characters small brush strokes + cold light gradient → visibleLines Thick outline → shawl pleat → slow heat → canvas pattern + cold vignetting.

**Key Parameters**
- Swatches: #132240 / #1d3866 / #2d5a94 / #6b8fb6 / #b6c8d8 / Pewter Gray #3b6878, strictly monochromatic.
- Orange and white cats are distinguished by brightness: orange = medium blue #4f719a, tabby #273f66, white = light blue #b6c8d8. Blonde hair = the brightest blue-grey #cbd8e0, skin color #90a9be, the hair color must be one level lighter than the skin color to read "gold".
- Wall strokes: cell34, len110, w34, jitter 4, vertical ±0.5·noise(0.003); color palette mixBase 0.8; then blur 7px stacked α0.8. The ground strokes are the same as the reference, horizontal.
- Dry brushing filaments: 900, α0.07, length 30–90.
- Elongation: girl `DOMMatrix().translate(1240,932).scale(0.84,1.12)`, with the sole of the foot as the axis; cat scale(0.82,1.14), with (540,905) as the axis. The same matrix is ​​used in three places: Path2D.addPath, off-screen setTransform, and setTransform in the visibleLines callback.
- Shawl: from under forehead/headTop hood, through nape, back, to waist+70, color #6b8fb6, pleat rgba(20,40,80,.6) 4px. Long Finger: 3 elongated ovals 22×4.5 around the cup.
- Outline: Prussian Blue #0c1830, 5px, no boil. The outline of the blue period is firm and should not be shaken.
- Slow: breathing sin(1.8t)·0.026 (amplitude is about 2 times of shared choreography, frequency is about 0.45 times); it takes 1.25s to lift the cup (shared choreography is 0.9s); heat rises in 0.5 times of time.

**Motif Animation**: Waves moving sideways outside the window (the closer, the faster, speed 20 + 0.25·(y − 400)), 14 flickering moonlight fragments, a long pale cloud crossing the moon, slow breathing (human and cat), cup holding, hot air. Movement area 3.2%.

**pit**
- The first version left a bit of ocher color for the cat and hair (referring to "The Old Guitarist"), which was judged by an independent reviewer to have ruined the monochrome. During the blue period, it should be all blue, distinguished by brightness.
- Cell16, len40, w14 The vertical brushwork on the wall reads "rain/blanket", which is impressionism, not the blue period. Be wide, long, low contrast, and then paste a layer.
- The round heads of the broad pen are closely arranged to form a "head array" (see ② Article 11). Use 7px paste to suppress it. The only solution is to add the cap parameter to strokes.
- If the table area is excluded from large strokes with a rectangular mask, a flat painted rectangular patch will be left on the ground. The table should be painted in a separate layer after the brush strokes, without digging holes in the brush strokes.
