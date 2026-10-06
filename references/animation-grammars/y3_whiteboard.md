# Y3 · Whiteboard hand-drawn narration (RSA Animate type): video animation-grammars card

In one sentence: as the presenter speaks, a hand writes each sentence and draws each diagram on one large whiteboard; the camera follows the argument, then pulls back to reveal the entire explanation as one diagram.

Demonstration film: `scripts/engine/demos/y3_whiteboard/` (rendering `render.py --film demos/y3_whiteboard`) (8s, 3 shots, 2 types of transitions + ending zoom), overview: `assets/animation-grammars/y3_whiteboard_overview.jpg`
Basis: This style of research (the original research text and frame-by-frame data are left in the experiment archive and are not included in the skill, and the numbers used have been extracted into this card).Measurements cover RSA Animate’s Changing Education Paradigms and Minute Physics’s Why Is It Dark at Night?, supported by official VideoScribe and Doodly documentation and first-hand accounts from Andrew Park and Henry Reich.

**Choose a syntax first, don’t mix**:
- Type RSA: A large white board with the camera moving across it 5.3 times per minute.
- Minute Physics type: one page per page, hard switching of paper, 8.1 times per minute, camera does not move.
- This card and demo card are of RSA type. The key points of the Minute Physics type are written in ④ and ⑧.

---

## ① Applicable scenarios

**Use it:**
- Argument-type content: speeches, opinions, causal chains, and historical context. Content that has a relationship between concepts and can be drawn into a map is most suitable. Andrew Park's original words are "Put information in space and let people see the relationship between things" [Yishui].
- A short science popularization of reasoning chain, using Minute Physics type.
- Spoken speech is at a steady pace and the key words are clear. The writing speed of RSA is approximately equal to the speaking speed, like "subtitles are written by hand" [actual test].

**Don’t use it:**
- For content that requires accurate data charts, hand-drawn errors are large.
- For content with complex motion and spatial relationships, the whiteboard has no depth of field.
- For content that requires emotional intensity, monochrome line drawings are weak in expression.
- Want to rely on it to "improve understanding": Türkay's 2016 experiment did not find that whiteboard animation is better than other forms of learning. Its value lies in attracting attention and a sense of companionship [second-hand].

## ② Screen composition

- **Color Color** (RSA actual test):
  - Bottom: pure white `#FBFBFB`
  - Thread: Black `#0A0503`
  - The only accent color: orange, text `#EB701F`, fill color `#F3742D`; the light orange surface arranged by diagonal lines is about `#E9A67C`
  - Orange accounts for about 22% of all handwriting pixels and is only used for keywords and slash fills.
  - Minute Physics is a pinkish-white paper `#E7DBE1`, with colored pencils light yellow `#EDE6A2` and light blue `#B5CBE8`.
- **[This film]**: Bottom `#FBFBFB`, line `#0A0503`, emphasis `#EF7226`. Layer the cat's body with orange with 22% transparency.
- **Line width**: RSA stroke is about 0.6–0.7% of the painting height, about 6–7px at 1080p; shadow slash is about 0.3%; title text height is about 5.5% of the painting height. Minute Physics' line is thicker, about 0.8% [actual measurement]. [This film]The line width is 6.5px.
- **Composition**:
  - RSA is "plan the final whole picture first, and then draw it backwards" [one hand].
  - There are 3-6 picture and text blocks in each screen, and they will be removed when they are full.
  - Smooth movement only moves 0.23 picture widths at a time, so the old and new pieces overlap in a large area, and the audience can always see the edge of the previous piece [actual measurement].
  - The whole picture exposed at the end is a very long horizontal scroll.
- **Words**: RSA is hand-printed in all caps (comic script). [This film] English handwriting uses Caveat through the `LXGWWenKai-500` compatibility alias.
- **hand**:
  - The real person holds a black marker in his right hand, enters the frame from the **lower right**, and the forearm is tilted to the lower right, covering 15–25% of the frame.
  - When not drawing, use your whole hand to draw. The time the hands are in the screen: RSA 49%, Minute Physics 40% [actual measurement].
  - [This film] Code-drawn hand: bare forearm with dark surface and hair, index finger presses black marker, zoom 0.82, press 7 rad/s and shake gently.

## ③ Motion paths

- **Writing speed** [actual measurement, 9 examples]:
  - Approximately 16 characters/second for the main text.
  - The opening title is half as slow, about 7.5 characters/second, and is used to "establish the title".
  - Spoken broadcast is about 13 characters/second, so the writing speed is roughly equal to the speaking speed.
  - [This film] The main text is 16 words/second; the title of "Cat?" is 7.5 words/second.
- **Drawing speed** [actual measurement + induction]:
  - Small icons take 0.5–1s, character avatars take about 2s.
  - RSA adds a median area of ​​0.25% of the frame per second.
  - Do not draw complex illustrations in front of the camera: either draw them in advance and reveal them when the camera moves over; or cut the entire picture in and just fill in the colors with your hands.
- **[This film]**:
  - The line pen speed is 2600 world pixels/second, which is about 2 times that of RSA real shot. The 8-second demo film must be compressed, and the real film please slow down.
  - The stroke length is calculated by dividing the length by the pen speed. Each stroke should be at least 0.04s, and the stroke interval should be 0.02s.
  - Each stroke uses sineInOut internally, which makes it slow to start and close the pen.
  - Milo used 0.7s "Reveal" to reveal: the pen tip walked 8 lines of zigzag in his joint bounding box, `DG.revealMask`, turning the place he walked into a clip, and the line drawing was only exposed in the clip.
  - In the first version, parts `setLineDash` were traced at the same time, and the pen tip ran along the joints. The review judged that "the pen does not lead the line", so it was changed.
  - There is no stroke order data for Chinese characters. Each character is revealed in 3 lines of zigzag, and the pen tip follows it back and forth, making it look like it is being written.
- **Acceleration rate**: Henry Reich takes 1 photo per second and stops 2 frames per photo when drawing, which is equivalent to about 12 times the speed. RSA inference 5–8 times [first hand + inference].
- **"Hands-free" pop-up**: RSA Some of the orange keywords are pop-ups of whole words later without hand-painting (ANAESTHETIC, CREATIVITY) [actual test]. [This film] "×10 million photos" "It's a cat!" pops up with 0.3s backOut(2.2), and I can't get past it.
- **Nib Path**:
  - When the interval between two strokes is <0.25s, the pen tip slides along an arc from the end point of the previous stroke to the starting point of the next stroke (sineInOut, raised 30px).
  - When the interval is longer, raise your hand to draw: 0.35s cubicIn retreats to the lower right screen.
  - 0.3s before the next stroke starts, cubicOut comes in from the lower right.
- **Continuous Movement**: The "liveness" of the whiteboard comes from the continuous drawing by hand. There is almost no correlation between the amount of line drawing activity of RSA and the density of spoken words (|r|<0.07): when speaking pauses, the hands also stop [actual measurement].

## ④ Transition (5 commonly used types)

1. **Smooth movement or push and pull on the board** (RSA Workhorse, 41 times).
   - 1.2–2.4s, **easeInOutSine**: measured speed peak/average 1.49, theoretical sine is 1.57.
   - Pan about 0.23 drawing widths at a time, overlapping about 75% of the previous piece.
   - [This film] Transition B: 0.9s sineInOut (4.7→5.6s), tilted by about 0.5 picture width, and pushed to 1.12 times at the same time. When the movement begins, the hand is drawing an orange connecting line to lead to a new area, and the hand is leading the camera.
2. **Scope**: Shake quickly to add motion blur, about 0.8s, move 0.5–1.2 picture width at a time, used to jump to far away areas on the board (RSA 15 times).
   - [This film] Transition A: 0.8s cubicInOut traverses about a full screen. Only in this 0.8s, stack 9 times along the speed direction to make blur; smooth movement and zooming out remain clear.
3. **Zoom out to reveal the entire picture** (Ending).
   - RSA Ending: gray all over → quickly zoom out in 0.6s → pan across the long scroll in about 9s → zoom out again to see the whole picture.
   - VideoScribe has "Zoom at end?" checked by default.
   - [This film] 6.85→7.5s sineInOut is pulled to 0.45 times, paused for 0.5s, and the entire board is covered with a very light layer of gray `#EEEEEC` in 0.5s.
4. **Cloud or Explosion Erase**: Cartoon smoke clouds spread out and then disperse, about 1s (RSA 1 time).
5. **Hard Cut**: Hard cut to the pre-drawn picture (a small amount of RSA); Minute Physics type paper change hard cut (main force, 8.1 times per minute); Minute Physics talks about the whole frame inverting the night.

**Note**: "Push into frame or bubble" and "Turn page" do not appear in the sample. The first version of this film was based on "advancing thought bubbles", but after looking at the research, it was replaced with a flicking lens and smooth movement.

## ⑤ Rhythm and text

- **Dwell per Block**: RSA median 6.6s between two camera moves (quartile range 4.0–13.8s); Minute Physics median 7.1s per shot [measured]. The demo film 8s has 3 pieces placed, which is about 2.5 times the density of the real film.
- **Aligned with narration (core)** [Actual test]:
  - Writing begins 0.2–0.8s later than speaking of the corresponding phrase, with a median of +0.5s.
  - Complete the phrase within 1 second after speaking: write as you speak, slightly behind, **not ahead**.
  - The exception is that visual foreshadowing (pill bottles, arrows) will be drawn a few seconds in advance, waiting for the lines to be spoken.
  - Minute Physics is a noun that drops as soon as it is spoken, with a median of +0.3 seconds.
- **Transition card topic, no pauses**: A new board corresponds to a new argument [actual measurement + induction].
- **MUSIC**: RSA** NO MUSIC** below the speech. Minute Physics has music at the bottom of the whole process, which is about 9dB lower than the human voice [actual measurement].
- **Tool Defaults**:
  - VideoScribe’s default pause time after drawing is 0.5s [first-hand], and the default camera movement time is 1s [second-hand].
  - Doodly draws each material for 3s by default [one hand].

## ⑥ Key points of code implementation

> Since integration into the skill (2026-10-04 v0.4), reusable functions listed here have moved into `scripts/engine/lib/`, using the shared MO / CAM / DG / TY / CH / UI / CL / TOON namespaces. Film-specific code lives in `scripts/engine/demos/y3_whiteboard/`. See `references/09-video-animation-grammars.md` for the library guide and narration-to-grammar selection.

- Reuse skills:
  - `KIT.densify / KIT.resample`: Catmull-Rom encrypts and resamples equidistantly according to the arc length, `DG.hand` adds low-frequency noise on top of this
  - `PAINT.noise`,`PAINT.cached`
  - `MILO.build/pose/details`: Milo line drawing
  - Engine transition interface
- New helpers, now unified in the library (`lib/diagram.js` / `camera.js`):
  - `DG.cum / DG.pointAt / DG.drawPartial`: Trace the polyline according to the length and return to the pen tip position.
  - `CAM.at`: Keyframe camera.
  - `CAM.motionBlur`: Motion blur.
  - `DG.revealMask / DG.zigzag`: zigzag reveal mask, added after review.
- The demo film is your own (`demos/y3_whiteboard/whiteboard.js`; the stroke timeline, slippage between pens, and markers have been stored in the library as `DG.board` / `B.penAt` / `DG.pen`):
  - **Stroke Timeline**: `addLine / addText / addPop / addFill` are arranged in order, the duration is automatically calculated by length and speed, and `Y3.timeline` is printed when delivered to check the end time of each block. The second block of the first version was queued at 7.9s, which was 2.5s later than the camera movement. It was discovered based on this number.
  - `drawStroke`: five types: line, word, pop-up, coloring, and characters. The words and characters are all uncovered using a zigzag mask, and the pen tip coordinates are taken directly from the leading edge of the mask.
  - `penAt`: The path between the pen tip and the hand, including slipping between the pens, raising the hand to draw, and entering the picture.
  - `drawHand`: hand and marker.
  - Keep wipe textures in screen space: follow camera translation, but avoid scaling them with the camera, which would turn them into large gray blotches at 5× zoom.
- **Key structure**: The three shots are drawn on the same whiteboard and the same camera, and the transitions are all `same`. The "transition" itself is a camera movement, so the things on the whiteboard will never jump during the transition.

## ⑦ Representative works and first-hand references

- Samples:
  - RSA ANIMATE: Changing Education Paradigms https://www.youtube.com/watch?v=zDZFcDGpL4U
  - MinutePhysics: Why is it Dark at Night? https://www.youtube.com/watch?v=gxJ4M7tyLRE
- Interview with Andrew Park (Sketchnote Army 2025) https://sketchnotearmy.com/blog/2025/11/18/andrew-park
- Cognitive Media“hairy hand”https://www.hairyhand.co/about
- VideoScribe official documentation:
  - Camera with Zoom at end https://help.videoscribe.co/knowledge/use-zoom-and-set-the-camera
  - Draw entry https://help.videoscribe.co/knowledge/draw
  - Entrance animation https://help.videoscribe.co/knowledge/entrance-animations
- Doodly default value https://support.voomly.com/en/articles/12735753-doodly-how-do-i-customize-video-settings
- Research on learning effects (reference) https://en.wikipedia.org/wiki/Whiteboard_animation

## ⑧ The 3 most common things to do wrong

1. **Do not speak until a piece of painting is full, or do not paint until you have finished talking**. The magic of whiteboard videos is "say one sentence and write one sentence": the writing speed is equal to the speaking speed, which is about 0.5 seconds later than narration. Painting first and talking later will make the audience wait, and talking first and painting later will make the painting a redundant retelling. Don’t draw complex illustrations on the spot. Draw them in advance and move the camera over to reveal them.
2. **Cut the entire screen to the next blank area every time**. RSA's smooth movement only moves 0.23 picture widths, and the old and new areas overlap extensively, so the viewer always knows where they are in a larger picture. Only use 0.8s to add blur when jumping far away. At the end, you must zoom out to see the whole picture. This is the landing point of this type.
3. **Too many colors, excessively thin or uniform lines, or a hand that stays on screen**. Use black plus one accent, with line width around 0.65% of frame height. Show the hand only while drawing, then exit toward the lower right; emphasis words may pop in without a hand. Choose either RSA's large board with camera movement or Minute Physics' separate pages with hard cuts.

---

## Review and revision (the independent agent only reviews the finished film, 6/10, the lowest among the three films)

Review comments and this round’s processing:
- "The pen tip does not follow the line, Milo has several strokes coming out at the same time; the words are erased by masking":
  - Milo changed it to VideoScribe's Reveal painting method: the complete line drawing is hidden underneath, the pen tip moves in 8 lines of zigzag, the place where the pen passes is uncovered, and the pen tip is always on the leading edge.
  - The words are changed to writing word by word: for a period of time for each word, the pen tip moves back and forth in 3 lines of zigzag in the word frame, and the mask is subsequently lifted.
  - Newly written `DG.revealMask` (the union of square strips revolving in the same direction, overlapping under nonzero does not cancel out) and `DG.zigzag`.
- "0.4s dead zone after flicking the lens": The second block starts painting at 3.12s in advance, and the hand enters the frame at the end of the lens flicking.
- "Screenshot frame line passes through the cat's head": Each frame is first filled with a layer of whiteboard color and then stroked. The front frame covers the line of the back frame.
- The phrase “Find the pattern yourself” was clipped by the upper edge: move the entire third panel down 60px.
- "After zooming out, the gray background and scratches look like a dirty wall": The gray background is reduced to `#EEEEEC`, and the transparency of the scratches is halved.
- "The panorama only stops for 0.15s, and the three groups of paintings are not connected":
  - Add an orange arrow pointing right at the end of panel 1 to motivate the whip-pan.
  - Draw an orange connector toward panel 3 at the end of panel 2, letting the hand lead the camera.
  - Move the pullback earlier, to 6.85–7.5s, then hold the overview for 0.5s.
- The cartoon hand with a blue sleeve was replaced by a bare forearm with shading and fine hair, closer to RSA’s live-action hand. Still drawn by code.

## QA (skill `scripts/qa.py`, revised final version)

| Shot | Measurement window (seconds within shot) | Moving area %, mean/peak | Static frame pairs % | Jump frames | Frame time, mean/peak ms | Determinism |
|---|---|---|---|---|---|---|
| y3_s1 | 0.35–2.48 | 3.1 / 5.31 | 0.0 | 0 | 6.5 / 6.9 | ✓ Pixel-identical |
| y3_s2 | 0.8–2.23 | 4.65 / 9.57 | 0.0 | 0 | 6.5 / 7.3 | ✓ Pixel-by-pixel consistency |
| y3_s3 | 0.85–3.23 | 4.45 / 10.94 | 0.0 | 0 | 8.3 / 9.0 | ✓ Pixel-by-pixel consistency |

Transition smoke checks (each transition rendered once; slowest frame): y3_s2 (same) 46.9ms; y3_s3 (same) 14ms.

How to read:
- No jumps in any of the three whiteboard shots: all transitions are camera movements over the same board, whose contents stay in place.
- Movement area 3–4.7% mainly from the hand and the line being drawn, higher when the camera is moving.
- Less than 10ms per frame because it’s all vector lines, no pixel-level processing.

Rerun: `uv run scripts/qa.py --project scripts/engine --film demos/y3_whiteboard --out <directory>` (The above table is the number during the experiment; for the rerun after incorporating the skill, see the regression table No. 09).
