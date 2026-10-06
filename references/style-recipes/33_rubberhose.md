# 33_rubberhose · 1930 rubber hose cartoon

> Source: Migration test D (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/33_rubberhose.js`.

The file name during the experiment: `scenes/r2_rubberhose.js`, each frame is about 20ms.

**Pipeline**: Paper color monochrome base (wallpaper vertical strips + rhombus dots, floor tile seams, corner watercolor darkening, cache) → sky outside the window (sun face, clouds, trees) → window frame and polka dot curtains → chair → table (bent legs + dancing flowers) → girl → cat → `saturation` gray removal + multiply #f2e8d2 for fading → film layer.

**Key Parameters**
- Beat bounce: `bnc(tq, ph) = |sin(π(tq/BEAT + ph))|`, BEAT = 60/128. Each object bounces amp pixels around its landing point: squashed by sx=1+0.09k, sy=1−0.09k when it lands, and stretched by about 5% when airborne. The phases of each object are staggered by 0.25: table 0.5, girl 0.25, cat 0.75, sun 0; bow tie 0.05, a little later than the body, is counted as following.
- Stepping: `tq = floor(t·12)/12` (one shot, two) is used for all characters and motifs; the cup is also stepped according to 12fps; the film layer is floored (t·24).
- How to draw characters: only the anchor points are taken from the skeleton.
  - Head: Draw a large round face with a radius of 82 around headC.
  - Picut eye: white orbit + black pupil, use arc(−1.45..−0.85) to cut off a wedge shape on the black pupil; 3 eyelashes on the top.
  - Arm: Rubber tube = a quadratic Bezier from shoulder to hand, constant thickness, black border +10px.
  - White gloves: 4 fingers, everted cuffs, 3 lines on the back of the hand.
  - Polka-dot skirt reaches ankle length (modest style).
- Cat: `RIG.smooth(K.bodyPts)` for the body, medium gray #a39a84 (=orange), tabby spots #5e574b, white chest and white paws #fbf7ec; tail is a wavy rubber hose `sin(7q − 9tq)·26q`.
- Film layer:
  - Shake plate ±1.5/±2px.
  - Flashing: Stack α0.02–0.09 white per square, then 0–0.06 black.
  - Scratches: 3 vertical lines, press floor(t·6) to change positions, so one scratch can survive several grids.
  - 14 dust points + an occasional hair per square.
  - The granular layer is randomly translated by ±20px per grid.
  - Rounded corner door: roundRect r60, add vignetting.

**Motif Animation**: All objects bounce with the beat, the sun's face rotates with the rays 1.6rad/s and the face nods with the beat, dancing flowers (stem left and right ±0.35rad, leaves are waving as hands, petals rotate), smoke rings pop up one by one, curtain hems flick with the beat, film flickers and scratches. The moving area is 40%, but most of it is film noise (see ② No. 5).

**pit**
- The cat body of the skeleton is a broken line. In the cartoon, you can see straight edges at first glance, so it must be smooth.
- The entire piece needs to be pressed into a single color, and saturation must be done after the characters are drawn, otherwise warm colors will remain on the gloves and cups.
