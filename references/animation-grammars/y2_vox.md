# Y2 · Vox-style collage narration: video animation-grammars cards

In a word: Put the argument on a table with real materials - newspaper clippings, photos, documents. The camera moves on the table like the eyes of an investigative reporter; lines and pens are drawn one by one, and the sense of evidence comes from "these things are really put here."

Demonstration film: `scripts/engine/demos/y2_vox/` (rendering `render.py --film demos/y2_vox`) (8s, 3 shots, 2 transitions), overview: `assets/animation-grammars/y2_vox_overview.jpg`
Basis: This style of research (the original research text and frame-by-frame data are left in the experiment archive and are not included in the skill, and the numbers used have been extracted into this card). 5 samples: Missing Chapter (2022), Psychedelic Poster (2019), Vox Borders (2018), Johnny Harris (2026), and Vox 2026 real-life footage for comparison. The 13-segment camera movement was fitted with easing and the color was selected.

---

## ① Applicable scenarios

**Use it:**
- Content with real files, news, history, maps, and people: "How did this happen?" "Who said what and when."
- Oral broadcasting is journalistic argumentation: quotes, evidence, cause and effect. In the narration, there are words such as "Look at this sentence" and "Pay attention to this number", and the screen will highlight that sentence.
- Quoting an original sentence, a set of numbers, and a year requires the audience to "see the source with their own eyes."
- The demonstration video uses real numbers from the 2012 Google "Cat Recognition" paper: 1,000 machines, 16,000 CPU cores, 10 million YouTube screenshots, no tags. The source is arXiv:1112.6209 and Google official blog.

**Don’t use it:**
- Pure mechanics, pure concepts, content without any real materials to post. If you do it hard, it will become a "fake file", use Y1.
- Derivation and Procedure: Use Y3.
- Contents that require a large number of characters to perform: Paper-cut characters can only move in one beat.

## ② Screen composition

- **Three-color system** (Missing Chapter actual measurement):
  - Near black bottom `#171716`
  - Paper white `#E0DCDA`–`#EEEDED`
  - One kind of red is divided into two levels: bright red `#B65255` for drawing lines, dark red `#93403C` for filling surfaces
  - Fluorescent yellow `#DACF08` (darker and more olive than the `#FFF200` of the Vox logo. The logo yellow is rarely used in large areas in the film)
  - Old map paper `#E4DCCF`, parchment `#CFB195`
  - There is no pure white, no pure black.
- **[This film]**:
  - Desktop `#e4ddcf`, flat paper texture, with fibers and low-frequency shading.
  - The clue red is `#b8433f`, which is slightly brighter than the actual measurement because it needs to be read clearly under 1080p.
  - Fluorescence `rgba(218,207,8,.9)`, the superposition method is multiply.
  - Shot 3 is a large piece of black cardboard `#1b1b1a` on the table, with the four sides exposed on the table.
- **Material**:
  - Photos must be grayscale (45°), with white edges, and two strips of translucent tape.
  - The clippings are torn, yellowed, and have Song-style titles.
  - The label is a Borders-style bold bar with white text on a black background ("2012 · Google").
  - Index cards are lined paper.
  - Paper textures are **static**. The measured frame difference of the dwell segment is 0.0–0.1, and there is no frame-by-frame grain. That is the film style of Johnny Harris 2026, not Vox.
- **Shadow is very weak**. The projection on the black background card is almost invisible at 360p [actual measurement]. [This film] Unified blur 10, offset (3,6), α 0.28.
- **Intentional imperfection**: The original words of Vox art director are "You don't want it to look perfect because that might make it look more like an ad than an editorial piece" [first hand].
- **characters**: Cut out real photos to make stickers, add white borders and shadows. [This film] Milo used `MILO.draw` to offset the silhouette by 12px in 16 directions, and put a layer of white paper as the border.

## ③ Motion paths

- **Two-layer frame rate (core)** [actual measurement]:
  - Camera layer is 24fps smooth motion.
  - The element layer (map color block growth, red line tracing, typing, hand-drawn circles, pop-in) is stepped at 12fps "one shot two". 52% of the motion frames in the psychedelic poster have an alternating "move-stop-move" fingerprint.
  - [This film] The camera calculates continuously at 60fps; all elements are quantized using `MO.step(t, 12)` and then the progress is calculated. QA measured that there were 16.9% still frame pairs in lens 1, which is a one-shot-two freeze frame, not a freeze.
- **Camera easing** (13 measured sequences):
  - Median duration 1.29s, range 0.71–1.96s; **none are linear**.
  - 7 use symmetric easeInOutSine, equivalent to AE's default Easy Ease, for long moves to the next card.
  - 6 start quickly and settle with a long tail, close to `cubic-bezier(.33,0,.2,1)`, for pullback reveals and following a trail.
- **Camera in this film**:
  - Shot 1: after highlighting, push toward that line over 1.5s with sineInOut (1.14→1.28). Measured BD sequences often follow a highlight with a push.
  - Transition A: 1.1s long-tail bezier.
  - Transition B: 0.6s sineInOut push.
  - Shot 1 opening: 0.9s slow push from 1.14→1.165.
  - Shot 3: 0.85s long-tail bezier pullback, followed by a 1%/s slow push.
- **Entrances** (measured):
  - Archival photos and clippings **appear directly at the cut**, without bouncing or falling.
  - Only while following a timeline does the next card slide in from off-screen, tilted 5–15°, then settle flat over about 0.8s.
  - Here, small photos and the Milo sticker use `slideIn`: 0.55s quartOut, leveling from 12°, stepped at 12fps.
- **Lines and pen strokes** (measured):
  - Draw a red underline over 0.5–1s.
  - Draw a red ellipse in about 1s with one stroke; leave the ends slightly open and crossing.
  - Sweep a highlight across one line over 1.5–3s, following the narrated words.
  - Typing about 13 words/second, one beat two.
  - [This film] Red circle 0.65s, fluorescence 0.9s (demo compression), typing 13 words/second, red lines each 0.5s, staggered 0.15s, counter 1.4s cubicOut rolled to 10,000,000.
- **Slow drift while staying**: Optional. The camera does not move when there is animation inside the card; a slow drift of 0.5–1%/s is added when the purely static image stops for more than 3 seconds [actual measurement + generalization].

## ④ Transition (6 commonly used types)

1. **Hard cut**: accounting for the vast majority, the cutting point is stuck in the reading of the narration sentence [actual test].
2. **Pan along the red line (timeline tracking)**: The camera moves horizontally along a red line, 1.3–1.8s, with long tail easing; the next card slides in diagonally from the right and lies flat.
   - [This film] Transition A: The red line connects from the highlighted line of the newspaper clipping to the counting label on the investigation wall. The camera chases it for 1.1s, with short motion blur along the speed direction (7 superpositions, coefficient 0.6).
3. **Advance paper or photo → directly cut into high-definition scan of the same picture**: 1.0–1.4s, S-type easing.
   - [This film] Transition B: push the small photo on the wall (logarithmic interpolation to z≈9.6); cut it into a large scan of the same picture (the dots change from thin to thick, which is read as "changed to a clearer one"); continue to 3.
4. **Pull out from a single photo → reveal the entire collage**: about 1.0s, fast start and long tail (measured MC 2:30).
5. **Map color block growth and route drawing**: 2.5–3.5s, one shot for two, with a solid red dot at the end of the line.
6. **Really turning pages and pulling out paper** (the symbol of Missing Chapter): The code can be approximated as "the paper slides in along the arc, with shadow changes".

**Note**: The "paper tearing transition" did not appear once in the 5 samples. It's a common practice for template sites, not Vox syntax. The first version of this film used tear-off paper, but it was replaced after research.

## ⑤ Rhythm and text

- **Length of shot** [Actual measurement, collage segment]:
  - Divided into two gears: Slow gear (Missing Chapter) with a mid-range of 3.3 seconds, about 12 cuts/minute, and a card pause of 3-7 seconds, relying on the lines and highlights in the card to support the scene.
  - Fast speed (psychedelic poster 1.8s, Johnny Harris 1.4s) about 25–33 cuts/min, the picture barely moves, relying on switching to create the rhythm.
- **Aligned with narration**:
  - The speed of fluorescent strips, typing, and tracing are locked to the word reading speed and not to the music beat.
  - Johnny Harris's statement is "Each word must correspond to a movement or action within the animation", and his script is written in two columns [one hand].
  - Joss Fong Change a piece of music about every 20 seconds [one hand].
- **Word**:
  - Use small serif fonts for names and places, and place white fonts below the photo.
  - The black background timeline title is typed word by word, 13 words/second, with a red line across the screen.
  - The quotation appears in handwritten "ink spread" style for about 2 seconds, and then the red bar is read line by line [actual test].
  - [This film] Use Songti SC for clippings and cards, PuHui-Heavy for large labels, and Anton for numbers.

## ⑥ Key points of code implementation

> Since integration into the skill (2026-10-04 v0.4), reusable functions listed here have moved into `scripts/engine/lib/`, using the shared MO / CAM / DG / TY / CH / UI / CL / TOON namespaces. Film-specific code lives in `scripts/engine/demos/y2_vox/`. See `references/09-video-animation-grammars.md` for the library guide and narration-to-grammar selection.

- Reuse skills:
  - `PAINT.cached`, `PAINT.scratch`: All pieces of paper, photos, and newspaper clippings are drawn into sprites at once
  - `PAINT.grain`: static particles
  - `PAINT.noise/fbm`
  - `KIT.densify/resample`: hand drawn circle
  - `MILO.build/pose/draw`
  - Engine transition interface
- Newly written and now unified in the database (`lib/collage.js` / `camera.js` / `diagram.js` / `motion.js`):
  - `MO.step(t,12)`: Two for one.
  - `CL.paperTile`: The paper pattern can be laid flat, and the sample is taken on the ring surface so it is seamless and has fibers.
  - `CL.halftone`: Convert grayscale to 45° dots, batch into a path and fill it once.
  - `CL.tornEdge`: Tear edge.
  - `DG.hand / DG.drawPartial / DG.cum`: Hand drawn line, traced according to length.
  - `CAM.motionBlur`: Stack frames along the speed direction.
  - `MO.bezier`: Long tail easing `(.33,0,.2,1)`.
- My own demo film (`demos/y2_vox/vox.js`; `slideIn / highlight / stringPts` has been added to the library as `CL.slideIn / CL.highlight / CL.stringPts`):
  - `slideIn`: tilt and slide in flat.
  - `highlight`: Fluorescent raw edge tape, multiply.
  - `stringPts`: Red line with droop.
  - `deskCam`: Desktop camera key frame, plus final advancement.
- **Key Architecture**:
  - Shot 1 and Shot 2 are the same desktop world and the same camera. Transition A uses `same` (A and B are originally the same picture), and the translation is completely completed by the camera.
  - Shot 3 is the big black card on the table. Transition B uses `cut` and cuts at the full frame.
- **Performance**: Shot 3 73/89ms per frame (average/peak), Milo stickers need to be offset and padded 16 times per frame. You can cache the sticker edge and only recalculate it when changing poses at 12fps.

## ⑦ Representative works and first-hand references

- Samples:
  - Missing Chapter“The case to rename this famous Christmas plant”https://www.youtube.com/watch?v=lLSUjl4WatY
  - “Where the 1960s "psychedelic" look came from”https://www.youtube.com/watch?v=9vuqI2v2IRs
  - Vox Borders“China is erasing its border with Hong Kong”https://www.youtube.com/watch?v=MQyxG4vTyZ8
  - Johnny Harris“The Internet Didn't Fail. It Was Taken.”https://www.youtube.com/watch?v=0rKDo3hKbVk
- First hand:
  - Interview with Vox Art Director Joey Sendaydiego https://www.storybench.org/how-vox-uses-animation-to-make-complicated-topics-digestible-for-everyone/
  - Interview with Joss Fong https://www.theopennotebook.com/2020/01/07/videogram-how-a-vox-video-explains-the-science-behind-the-first-photo-of-a-black-hole/
  - Johnny Harris“How I Make My Maps”https://www.youtube.com/watch?v=GsojLuJpe_0
- Second-hand: PremiumBeat "Replicating Vox motion graphic" https://www.premiumbeat.com/blog/replicating-vox-motion-graphic/
- Demonstration film facts:
  - Le et al., ICML 2012, arXiv:1112.6209 https://arxiv.org/abs/1112.6209
  - Google Official Blog 2012-06-26 https://blog.google/innovation-and-ai/products/using-large-scale-brain-simulations-for/

## ⑧ The 3 most common things to do wrong

1. **Everything moves together at 60fps silky smooth**. Half of the hand-made feel of collage comes from the two-layer frame rate of "camera slide and element pause". All silky smooth will look like a corporate video, all 12fps will make the camera woozy.
2. **Use template syntax to impersonate Vox**: tear the paper, each picture bounces and falls, and the paper texture shakes frame by frame. In the actual measurement, none of these appeared. Vox's photos were cut directly at the cut point, the paper texture was dead, and the transitions were mostly hard cuts and advancements. The more bells and whistles you add, the less it looks like an "editorial work."
3. **Use Vox logo yellow when the background color is large and there are too many colors**. The yellow in the film is a `#DACF08` highlighter, which is only used to highlight key points. The main body is "black, paper white, and a red" three colors, plus an accent color is enough.

---

## Review and revision (independent agent only reviews the finished film, 8/10)

Review comments and this round’s processing:
- "Shot 3 becomes pure black, and a large tabletop is broken": Change it to a large black cardboard spread on the same table, with the paper texture of the tabletop exposed on all four sides. Still the black card syntax of Missing Chapter, but with a constant desktop.
- "0–0.9s completely still": Added opening slow push (1.14→1.165).
- "The half-tone image fills the entire screen for too long": the zoom time is reduced from 0.7s to 0.6s, and the pull-out time is reduced from 1.0s to 0.85s. Pull out the starting point z=3.68, make the screen width of the photo on both sides of the hard cut the same, and add tape at the same position to the large picture. The hard cut reads "switch to high-definition scan".
- "Blank note appears first": The note is changed to slide in at an angle, and typing is advanced to 0.4s.
- "The protagonist's half body is cut in one frame from the right": the starting point is moved to 1100px off-screen, and the first step of 12fps is still off-screen.
- "The highlighter will end before the highlighter has finished tracing the film": typing, red circle, and fluorescence are all moved forward. The fluorescence is finished in 1.8 seconds and then stops for 0.3 seconds.
- "The word 'cat' in its head is too small": mentioned 40px.
- "The camera is smooth throughout, one shot and two shots are not enough": No change. The actual measurement of Vox in the research is "camera 24fps smooth, element 12fps step"; changing the camera to step will deviate from the actual measurement.

## QA (skill `scripts/qa.py`, revised final version)

| Shot | Measurement window (seconds within shot) | Moving area %, mean/peak | Static frame pairs % | Jump frames | Frame time, mean/peak ms | Determinism |
|---|---|---|---|---|---|---|
| y2_s1 | 0.35–2.58 | 11.02 / 16.71 | 3.1 | 0 | 17.4 / 20.3 | ✓ Pixel-by-pixel consistency |
| y2_s2 | 1.1–3.28 | 16.09 / 76.76 | 3.1 | 16 (2.77–3.28s consecutive) | 23.4 / 52.2 | ✓ Pixel-by-pixel consistency |
| y2_s3 | 0.35–2.08 | 7.77 / 37.41 | 0.0 | 14 (0.39–0.83s continuous) | 73.3 / 88.5 | ✓ Pixel-by-pixel consistency |

Transition smoke (render each transition once, the slowest frame): y2_s2 (same) 55.2ms; y2_s3 (hardcut) 43.8ms

How to read:
- The jump of **Shot 2** is continuous at 2.77–3.28s, which is the 0.6s camera push of "Advance the small photo on the wall", pushing it to 9.6 times.
- The jump of **Shot 3** is continuous from 0.39 to 0.83s, which is the 0.85s "pull out and reveal" lens after hard cutting.
- Both sections are full-screen zooms, which are camera movements within the design. The hard cut itself falls on frame 0 of shot 3, which is not within the measurement window.
- **Freeze Frame Pair 3.1%**: One-two from elemental layer (12fps freeze frame). In the first version, the camera did not move at the beginning, and this number was 16.9%; after the reviewer pointed out that "0-0.9s is completely still," a slow-motion opening was added, and it dropped to 3.1%.
- **Shot 3 per frame 73/89ms** is the heaviest of the three: Milo stickers are offset 16 times per frame to pad the white edges, and a black cardboard pattern is also painted. To speed up, you can only recalculate stickers when changing poses at 12fps and reuse the rest of the frames.

Rerun: `uv run scripts/qa.py --project scripts/engine --film demos/y2_vox --out <directory>` (The above table is the number during the experiment; for the rerun after incorporating the skill, see the regression table No. 09).
