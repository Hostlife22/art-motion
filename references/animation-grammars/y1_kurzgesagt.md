# Y1 · Kurzgesagt Flat Science: Video animation-grammars card

In a word: Put an abstract concept into a luminous world that can be infinitely scaled. The camera travels between scales and things in the frame are always moving gently.

Demonstration film: `scripts/engine/demos/y1_kurzgesagt/` (rendering `render.py --film demos/y1_kurzgesagt`) (8s, 3 shots, 2 transitions), overview: `assets/animation-grammars/y1_kurzgesagt_overview.jpg`
Basis: This style of research (the original research text and frame-by-frame data are kept in the experimental archive and are not included in the skill, and the numbers used have been extracted into this card) (2025 two feature films + 2014 "Immune System" actual measurement, official Skillshare course verbatim draft). Where do the numbers labeled [actual measurement] and [first-hand] come from, and the numbers labeled [this film] are the parameters actually used in the demonstration film.

---

## ① Applicable scenarios

**Use it:**
- Talk about scale and "what's inside": from cells to galaxies, from a pixel to a model, or "zoom in and you'll find...". Scale transitions are standard in this style.
- Talk about mechanism and system: neural network, immune system, energy flow. Best suited for drawing invisible processes into glowing particles and connected lines.
- Oral broadcasting is a smooth and eloquent science popularization style. Kurzgesagt is about 168 words/minute, and one hard cut shot is worth about 2 sentences [actual measurement].
- If you need a "serious but cute" tone, you can use a mascot or a flock of birds to make jokes.

**Don’t use it:**
- Tell about real people, real events, archival evidence: flat cartoons dilute credibility, this kind of content is collaged with Y2.
- Talk about steps and reasoning chain: write it step by step for better understanding, use Y3 whiteboard.
- When the production budget is small. The quality of this style depends entirely on "something moving in every frame". The official single film requires more than 1,200 hours [first hand]. Cutting corners, Kurzgesagt looks like cheap PPT.

## ② Screen composition

- **Select the year first**. 2025 is dark: 61–68% dark pixels, median saturation 0.84–0.89. 2014 is light gray with low saturation. The two cannot be mixed [actual test]. The first two shots of the demo film used 2025 dark colors, and the third shot used bright colors during the day, imitating their practice of "changing a complete set of color temperatures when changing segments."
- **Color Plate** (2025 dark color, actual measured color):
  - Bottom: `#05020F` / `#0E0631` / `#25155E`
  - Second bottom: `#191670`, `#3826A3`, `#5F58DB`
  - Emphasis on green: `#32BAEE`, `#7DD3DC`
  - Emphasis on orange (luminous body): `#F48301`, `#E07919`, `#FACC12`, glow core `#F9EF93`
  - Magenta: `#BE3A95`, `#C83C7F`
  - Highlights and white text: `#E7DFE1`, `#F9FCFB`
  - Rule: A dark base with 2-3 highly saturated accent colors, with the accent colors contrasting with each other (orange vs. indigo, cyan vs. magenta) [actual measurement + generalization]
- **Shape Language**:
  - No stroke. The shadow is a color block of the same hue and one level darker, and the highlight is a white ellipse or an arc [summary].
  - Rounded corners are everywhere. The creature is a mass-like organic shape, with a round head and round-headed tubes for its limbs.
  - The luminous body must have radial glow. The meaning of the existence of darkness is to allow the glow to be established.
- **[This film] Two-color facet**: `flat(c, path, true color, shadow color, highlight color, v, w)`. Make two translations inside the shape: leaving a shadow strip on the lower right and a thin highlight strip on the upper left. v≈(10,12)px, w≈(4,5)px. Every part of Milo also follows this method, so he and the scene are drawn in the same way, unlike pasted ones.
- **Composition**: The subject is placed on the lower third line in the middle of the picture, leaving the sky above for the title and stars. The scene is divided into 5–6 layers of parallax: starry sky d=0.05, moon 0.12, distant mountains 0.3, near slope 0.65, main body 1.0, foreground leaves 1.5 (near scene is virtual and dark). The official number of layers has not been disclosed, but the actual measurement is 2-5 layers [in summary].
- **characters**:
  - Kurzgesagt bird: egg-shaped body, large white eyes, small black pupils facing forward, orange triangular beak. The wings are leaf-shaped one step deeper than the body, and each bird changes color [one hand + generalization].
  - [This film] The cat has a water-drop body with a round head, triangular ears with magenta inner ears, and big white eyes; the robot has a rounded shell with a dark screen face and a light-emitting lens eye; Milo uses a `MILO.build` point pose, and every part has been split into two colors.

## ③ Motion paths

- **Official Easing** [One Hand, Skillshare]:
  - 50 frames in regular action (0.83s at 60fps). If you want to use 30/20/10 frames neatly, use 5–10 frames for popup.
  - The circulation effect is Easy Ease 33.3%, which is approximately equal to `cubic-bezier(.333,0,.667,1)`.
  - Other actions use 75% influence, which is approximately equal to `cubic-bezier(.75,0,.25,1)`: very soft at the beginning, fast in the middle, and very soft at the end.
- **Pop-up** [Actual Measurement]: The card grows to 90% in 0.25s, overshoots to 108% on the 20th frame (the detector card is 114%), and returns to 100% in about 0.5s.
  - [This film] The identification tag uses `backOut(q, 1.1)`, and the duration is 0.5s.
- **Stagger**: Similar elements are staggered by 10–20 frames, limbs are staggered by 3–4 frames, and actions are stopped by 20 frames [one hand].
  - [This film] The title is staggered by 45ms word by word and 0.5s cubicOut for each word. Pixel Cat 144 blocks are staggered by 35ms/block from the center, and each block flies in from all sides with 0.5s backOut(1.4). The neural network lights up layer by layer with an interval of 0.32s, and the node bounces for 0.35s.
- **Continuous micro-movement (the most important)**: The period of complete motion within 0.5s in the 2025 film only accounts for 0.3% [actual measurement].
  - Standby loop: 50 frames of ping-pong floating, star flash, glow breathing, particle drift.
  - Blinking 5 frames closed, 10 frames open, irregular intervals, **eyes do not shrink to 0** [one hand].
  - [This film] There are 170 stars, each flashing in phase 1–3.5 rad/s. The foreground leaves `blur(7px)` are out of focus, creating depth of field. The robot floats up and down ±12px, and the jet light uses 23/37Hz double sine dither. Cat tail with two sections of Bezier pendulum. Blades of Grass 2.1 rad/s Pendulum. Firefly particles drift at layer 0.8–1.3. The signal pulses continue to circulate along the wire.
- **Camera** [actual measurement]:
  - The time of 1/3 in the 2025 film is zooming, panning about 10%, rotating about 5%, pulling away more than pushing forward.
  - Standby slow push median 3–4.5%/s.
  - [This film] Shot 1 is pushed from 1.00 to 1.10 (sineInOut) in 2.6s, about 3.8%/s, which falls within the measured range.

## ④ Transition (6 commonly used types)

1. **Advance travel → the color of the object is covered → new scene** (standard way of writing a scale transition).
   - Actual measurement: Immunity 1:48, about 1.4s, first accelerating and then decelerating, with the peak value in the middle.
   - [This film] Transition B:
     - Camera logarithmic interpolation advances the lit output node (0.45s, cubicIn) until the screen is full of yellow.
     - Dissolve to the robot's yellow glowing eyes ±3 frames from the midpoint. The highlight points on both sides are on the upper left and cannot be seen with the cut point.
     - Then use cubicInOut 1.45s to zoom out (42→1) and fall into the new color palette of daytime.
     - Don't use expoOut: its starting slope is too large, and it will jump by more than half of the scale in the first frame.
2. **Drill into the object, and inside the object is the next world** (a variation of time travel).
   - [This film] Transition A, 1.0s: The camera advances the robot lens logarithmically according to `bezier(.75,0,.25,1)` (1.1→60). The next shot is only exposed in the "lens circle". As it advances, the circle grows to cover the screen, with a cyan halo around the edge. The next shot simultaneously emerges from 0.42x expoOut.
3. **Fast zoom reveal**: 0.2–2s, fast start and long tail (actual measurement is 1.074→1.040→…→1.0006 every 0.2s). Used to connect micro and macro.
4. **Light or flash fills the screen**: Use the light source in the screen to create a white point, about 0.5 seconds.
5. **Sweep Erase**: The object or light strip sweeps across the screen obliquely, with a speed line, about 0.4s.
6. **Copy and multiply until full**: used for "the number is so large that...", 3–6s.

Two other points [actual measurement]:
- The ratio of hard cuts is very low, about 5 per minute, following the beginning of the narration sentence, 0–0.2s earlier than the beginning of the sentence.
- Most of the remaining screen changes are designed transitions of 0.3–0.6s, one every 4.6–6.7s.

## ⑤ Rhythm and text

- **Length of shot** [actual measurement]:
  - Hard cuts take a median of 7–9 seconds, with an average of about 11.5 seconds.
  - But the "visual unit" changes every 4.6-6.7 seconds, depending on the design transition.
  - There is at least one state change in each narration: playing tags, changing tags, deforming or transitioning.
- **Alignment with spoken broadcast**: Use the timestamp of the narration sentence as the skeleton, and place it 0–0.2s before the beginning of the new sentence [actual measurement]. The soundtrack was composed [by Epic Mountain] after the film was completed.
- **Word**:
  - Annotation is done by first drawing a thin white line, and then typing the text word by word, about 40 characters/second; a narration for each annotation, stopping for about 3 seconds and then erasing it word by word [actual measurement].
  - Chapter title cards appear every 2–3 minutes, full screen, word by word, with blurred background.
  - Label capsules are large rounded corners, filled with a saturated solid color, and have bold sans serif text inside.
- **[This film]**:
  - Put 3 lenses in 8s, which is about 3 times the density of the normal rhythm, just to see the full grammar in the demonstration. Please press 7-9s for a real movie.
  - Use PuHui-Heavy 76px for the title and float it word by word.
  - Layer labels are PuHui-Medium 40px with underline.

## ⑥ Key points of code implementation

> Since integration into the skill (2026-10-04 v0.4), reusable functions listed here have moved into `scripts/engine/lib/`, using the shared MO / CAM / DG / TY / CH / UI / CL / TOON namespaces. Film-specific code lives in `scripts/engine/demos/y1_kurzgesagt/`. See `references/09-video-animation-grammars.md` for the library guide and narration-to-grammar selection.

- Reuse skills:
  - `PAINT.cached`, `U.rng`: deterministic
  - `RIG.smooth`: Smooth the point sequence into Path2D, draw cats, mountains, and leaves
  - `MILO.build/pose/details`:Milo
  - `PAINT.noise`
  - Engine paragraph table, transition interface, off-screen A/B buffer
- Newly written and now unified in the database (`lib/camera.js` / `motion.js` / `typo.js`):
  - `CAM.at(keys, t)`: Keyframe camera, scaling uses logarithmic interpolation. `CAM.zlerp` allows each frame to be enlarged by the same factor, and the standard transition is a constant speed.
  - `CAM.anchor`: Move the target point smoothly to the center of the screen when zooming.
  - `MO.bezier(x1,y1,x2,y2)`: Move the Bezier easing of AE/CSS into the code and solve it by Newton's method.
  - `MO.*`: sine, quint, expo, back, elastic, etc.
  - `TY.charsIn`: Admission verbatim.
- The demo film is your own (`demos/y1_kurzgesagt/kurzgesagt.js`; `flat` has been added to the library as `TOON.flat`, `layer` is `CAM.layer`):
  - `flat()`: two-color facets.
  - `layer(c, cam, d, fn)`: Parallax layer. The displacement is linear by d, the zoom is `z^d`, and the distant view barely moves when pushing deeply.
  - `Y1.cat`, `Y1.bot`, `Y1.bird`: three characters.
  - `Y1.lensAt(t)`: Lens circle screen coordinates for transition A.
- **Key Architecture**:
  - The camera is only determined by the total film time. In the transition window, the engine continues to draw the last shot into the A buffer as usual, and the last shot is considered the camera that "drilled in".
  - So the zoom transition is always a vector redraw and will not blur the 1920 bitmap when it is enlarged 60 times.
  - The transition function (`lensReveal`, `matchCut` of `transitions.js`) is only responsible for "how A and B fit together".
- Engine changes (only the copy of this experiment is changed):
  - Any segment of `eras.js` can write `dur` (seconds).
  - Take some shots and change the lens shock to the default off, and only enable it for `transition.punch:true`. There should be no interruptions in the commentary film.

## ⑦ Representative works and first-hand references

- Samples:
  - How Are Memories Stored Inside Your Brain?(2025)https://www.youtube.com/watch?v=PqtggjVAi8M
  - Why Humanity Will Never Leave The Solar System(2025)https://www.youtube.com/watch?v=Cyl3X88KEgg
  - The Immune System Explained I(2014)https://www.youtube.com/watch?v=zQGOcOUBi6s
-Official lessons (verbatim draft of easing, looping, bird, and characters movements):
  - Skillshare“Motion Graphics with Kurzgesagt”Part 1 https://www.skillshare.com/en/classes/motion-graphics-with-kurzgesagt-part-1/631970755
  - Part 3 https://www.skillshare.com/en/classes/motion-graphics-with-kurzgesagt-part-3/140140401
- Official behind the scenes:
  - One tablet for 1200 hours: https://www.youtube.com/watch?v=uFk0mgljtns
  - Official readme: https://kurzgesagt.org/what-we-do?visit=videos
- Soundtrack: Epic Mountain https://www.epic-mountain.com

## ⑧ The 3 most common things to do wrong

1. **Screen freezes**. After finishing the entry, stop and it will immediately turn into a PPT. After each element enters the scene, there is a standby cycle: floating, flashing, breathing, and drifting. According to actual measurements, the non-moving period in the 2025 film only accounts for 0.3%.
2. **Use linear interpolation for scaling, or enlarge the bitmap**.
   - If the z of linear interpolation is slow in front and sharp in back, the sense of travel will be broken. Use logarithmic interpolation.
   - Enlarging the last screenshot 20 times will cause it to become a mosaic. The scene must be allowed to redraw itself at a larger z.
3. **Make bright and mixed colors, or add strokes to things**.
   - The Kurzgesagt of 2025 is "deep base + 2-3 luminous accent colors", relying on glow to support the screen.
   - Add black strokes or use a medium light base, and it will slide towards children's picture books or corporate flat illustrations.
   - Use shadows one stop darker of the same hue, not gray.

---

## Review and revision (independent agent only reviews the finished film, 7/10)

Review comments and this round’s processing:
- "Cats, grass, and hills have strokes, like children's illustrations": the grass blades are changed from lines to filled-in thin triangles; the bright edges on the top of the hills are pressed down to only one level different from the original color.
- "The black block in the lower left corner looks like dirt": Add `blur(7px)` to the foreground leaves to create depth of field, and the color increases from near black to `#0E0631`.
- "Title disappears in one frame": changed to 0.55s sineInOut to fade out.
- "Shot 3, the cat changed from orange to black without explanation": The orange cat stayed at Milo's feet as "the one I know"; above the black cat, a lead line and small words "unseen cat" appeared first, and then the identification tag was played.
- "7.8s Bird Penetration Robot": The height of the bird has been moved to 175/225px.
- "End 7.1–8.0 Almost Still": Add 4%/s slow push after settling.
- "3.03–3.10s Pixel Cat was cropped in half by the lens circle": No change. This is the normal state of the "in-the-lens" uncovering process.

## QA (skill `scripts/qa.py`, 2026-10-04, revised final version)

| Shot | Measurement window (seconds within shot) | Moving area %, mean/peak | Static frame pairs % | Jump frames | Frame time, mean/peak ms | Determinism |
|---|---|---|---|---|---|---|
| y1_s1 | 0.0–2.58 | 1.57 / 2.58 | 0.0 | 0 | 32.9 / 34.6 | ✓ Pixel-by-pixel consistency |
| y1_s2 | 1–2.68 | 3.36 / 4.42 | 0.0 | 0 | 6.1 / 7.2 | ✓ Pixel-by-pixel consistency |
| y1_s3 | 0.9–2.68 | 17.94 / 91.88 | 0.0 | 8 (consecutive at 1.04–1.28s) | 11.2 / 16.0 | ✓ Pixel-identical |

Transition smoke (render each transition once, the slowest frame): y1_s2 (k_lens) 48.3ms; y1_s3 (k_fill) 36ms

How to read:
- The 8 jump frames of **Shot 3** fall at 1.04–1.28s, which is a continuous period, exactly in the middle of the 42x → 1x "pulled from the robot's eyes". The entire screen is zooming, so the peak motion area is 92%. This is a standard transition within the design, not a single frame transition.
  - In the first version, expoOut was used, but the starting slope was too high, jumping from 42x to 15x in the first frame, and both the film review and QA were reported.
  - Changed to cubicInOut, the peak value falls in the middle, which is consistent with the shape of the measured Kurzgesagt "traversal propulsion".
- **Shot 1 33ms per frame**: `filter: blur(7px)` is added to the foreground leaves for depth of field, which is slower than 9ms before blurring, but still far below the upper limit of 150ms.
- Movement area 1.6–3.4% seems low, because Kurzgesagt’s micro-movement is “a lot of small things that work on their own”: stars, particles, tails, floats, pulses. According to the actual measurement, the period of complete motionlessness in the 2025 film only accounts for 0.3%. The still frame pairs of the three lenses here are all 0%, which is correct.

Rerun: `uv run scripts/qa.py --project scripts/engine --film demos/y1_kurzgesagt --out <directory>` (The above table is the number during the experiment; for the rerun after adding the skill, see the regression table No. 09).
