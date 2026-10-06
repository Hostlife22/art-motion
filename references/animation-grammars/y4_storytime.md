# y4 · Story-based simple characters animation (YouTube storytime animation)

> One-sentence grammar: **The narrator is the protagonist, and the picture is an "emoticon pack" for the narrator - the characters are quickly cut between several postures (0.1 seconds) and then frozen. The laugh point is to cut to a close-up of the reaction and shut up at that moment.**

Represented by: TheOdd1sOut (James Rallison), Jaiden Animations, Domics. Tools: According to Jaiden's FAQ and second-hand information, the three of them all used Flash / Adobe Animate in the early days (the original text of this article was not obtained, it was only used as a background).

---

## ① Applicable scenarios

**Use it:**
- The first person talks about experiences, overturns, and "my first time...": The narration has a starting point, a transition, and a laugh point that can be paused.
- What the audience wants is "this person": the cartoon avatar of the creator appears in every issue, and they recognize the character rather than the artist (Pappis's type research: "Avatars can often be distinguished only by their hairstyle").
- The budget is limited and weekly updates must be stable: one character, five or six poses, and three mouths can fill an issue.

**Don’t use:**
- Tutorials and data explanations with high information density → use y5 dynamic text or information graphics. The audience will focus on the characters and other punchlines and not remember the numbers.
- There is no "me" content (industry news, product comparison) → characters have no stance to perform, only a sticker that can open its mouth.
- The narration itself is not funny and there is no pause → This style magnifies the narration and does not save the situation for the narration.

## ② Screen composition

**Composition**
- The mid-shot (above the waist, the head accounts for 25-35% of the painting height) is the default camera position. The characters are centered on one side, and the other side is reserved for "what he is talking about" (computer, opponent, object).
- The background only tells "where": a wall, a table, a window, 3-5 large color blocks. A white background or a solid color background is also completely valid (Pappis: "A white background or a rough sketch of the scene").
- The reaction shot removes the environment: the face fills the screen (head radius ≈ painting height 1/3), and the background is replaced with a solid color + vignetting.
- The punchline shots are often reversed: cut to a **large panorama**, where people become very small ("small and helpless" itself is the punchline).

**Color matching (actual color value of demonstration film)**

| Part | Color Value | Description |
|---|---|---|
| Skin | `#FFE2CC` | Light, nearly white - TheOdd1sOut's "Marshmallow Man" is pure white, Jaiden is warmer white |
| Curls | `#38271F` | Rounded dark shapes frame the uncovered face |
| Jacket | `#F5C542` | Milo's golden yellow jacket |
| Trousers / sneakers | `#24354C` / `#FFF8E8` | Long navy trousers and cream sneakers |
| Backpack / straps | `#287B7C` / `#795438` | Small teal backpack with brown straps |
| characters line | `#1B1B1F` | the darkest in the whole movie |
| Wall / Table / Floor | `#DCE9EC` / `#E2C29B` / `#E8DCC8` | Low saturation, high brightness: the background is always "lighter" than the characters |
| Background line | `#5B6470` 3px | Lighter and more than half thinner than characters line |
| Reaction shot void | `#3D405B` + radial vignetting | Cold, dark, focus on the face |
| Mouth / Tongue / Blush | `#6E2430` / `#F07B7B` / `rgba(255,140,120,.35)` | The only saturated color in the mouth, the mouth shape is very conspicuous |

**Line width**: characters line = head radius × 0.05 (minimum 4px) - medium shot R=165 → 8px, close-up R=360 → 12px, panorama R=95 → 6px. The line becomes thicker and thinner as the camera zooms (Flash default behavior), and the background line is fixed at 3px.** characters line ≥ background line × 2** is the root of this style of "people always jump out".

**Shape Language**: Full circle, full blunt. The head is a slightly flattened round (width 1.0R × height 0.93R), the body is a bean (width 1.0R × height 1.2R), and the whole body is 3.2R -** The head accounts for about 58% of the height**. The arm is a tube with rounded ends at both ends. There are no elbows or fingers. The hand is a circle. There are no right angles, except for props.

**Characters drawing method (Milo storytime version)**
- Keep Milo's recognizable features: **dark brown curls**, **yellow jacket** and **small teal backpack**. Use navy trousers and cream sneakers; the backpack silhouette and shoulder straps should remain visible at smaller scales.
- Draw uncovered eyes with dark pupils and white highlights. For a blank expression, shrink the pupils to 0.035R and remove the highlights.
- Expressions mainly depend on eyebrows: raised for surprise, raised inner ends for worry, flat for a blank look. Mouth shapes remain a smile, straight line, worried wave, half-open and fully open.
- Construct the curls from overlapping rounded shapes. Keep the same hair silhouette in front, close-up and reverse shots.

## ③ Motion paths

**Actual measurement of the original film (this capture, 480p reprinted version, removing 10 seconds each of the opening and ending credits; method: 160×90 grayscale frame-by-frame difference)**

| | TheOdd1sOut "Mom's Punishment" (30fps, 475s) | Jaiden Animations "Being Not Straight" (24fps, 902s) |
|---|---|---|
| Average shot length ASL | **2.43s** (median 1.87s, quartiles 1.03–3.07s) |** 5.73s** (median 3.21s, quartiles 1.67–6.67s) |
| Completely still adjacent frames | **70.7%** | 51.2% |
| Duration of static segment | Median **0.40s**, p75 0.70s | Median 0.08s (= one-beat-two pause) |
| Motion segment duration | Median **100ms** (3 frames) | Median 42ms (1 frame) |

How to read: TheOdd1sOut is **fast cut (0.1s) → freeze (0.4–0.7s) → fast cut**, 70% of the time the picture is completely motionless; Jaiden is** one shot and two continuous movements** (12 frames/second), and the lens is longer. Hallis Blaney, the animation supervisor of Netflix's "Oddballs", said it most accurately in the Toon Boom interview: "The Odd1sOut is pose-to-pose, with very little animation...basically switching between pictures." The hardest thing when changing it to a series is to keep that snappiness and avoid being "too soft and too slow." The demonstration film is in the middle: the pose snapshot TheOdd1sOut, and the breathing and mouth-syncing shot Jaiden.

**Demonstration film parameters**

| Exercise | How to do it | Numbers |
|---|---|---|
| characters frame rate | characters all move in steps of 24fps (`MO.step(t,24)`), lenses are smoothed in 60fps | Flash default 24 |
| Posture switching | Arm target point `expoOut` interpolation | **0.10s** (2–3 frames at 24fps) |
| Change posture and rebound | At the moment of switching, the vertical pressure of the body is 7%, Ebberts spring rebound (volume conservation, lateral reverse) | `settle(dt, -0.07, freq 3.5, decay 9)`, ≈0.35s stop |
| Mouth shape | Read narration RMS envelope, **A change of shape is only allowed every 1/12 seconds** (one shot and two); three mouths | Envelope <0.06 closed, <0.22 half open, the rest full |
| Nodding when speaking | The head sinks when the mouth is opened | 0.015R × Mouth shape progression |
| Breathing | Vertical body scaling | ±1.2%, period 1.6s |
| Blink | Fixed timetable, interval 2.4–3.6s | Close eyes 2 frames @24fps (83ms); "Speechless" slow blink 3 frames |
| Eyes | When you point at something, the black dot moves that way | 0.09R |
| Lens | Medium shot slow push, reaction shot slow push, panorama slow pull, close shot slow push | Medium shot +3.5%/2.0s; Close-up +6%/1.2s; Panorama 0.53→0.50 (quintOut); Close shot 1.90→1.98 |
| Opening | Shot 1.04→1.01 settles (0.5s expoOut), instead of "the first frame is still" | |
| Sweat drops | Temples sliding down the side of the face | 0.9s, expoOut mixed linearity |
| Lens reflection | White diagonal strip sweeps across two lenses | 0.3s |
| "?" | The top of the head pops up, backOut overshoots by 30%, and then shakes by ±3° | 0.26s |

Entry/Exit: storytime There is almost no "entry animation" - the characters are already in place and talking in the first frame when the camera cuts in. Props and symbols (?!, sweatdrops, numbers) are only used when popping in (`backOut`, overshoot 15–30%).

## ④ Transition (5 commonly used types)

1. **Hard cutting (cut)** - the vast majority. One sentence of spoken word is played in one scene, and the spoken word is broadcasted in another sentence. The demonstration film S3→S4 (close-up → large panorama of the same room) is a hard cut, relying on the contrast between scenes to create laughter.
2. **Smash cut to reaction close-up** - The first frame of the new picture appears, retracting from 1.22 times to 1 with a spring (freq 3, decay 11), and a layer of 55% white flash is applied to the first 2 frames, with a bass "bang". Used in "After saying something outrageous → look at his face". `TRANSITIONS.smash`.
3. **Whip pan**——The lens is whipped in the direction of "what he is looking at", `expoInOut` 0.26s, 16 offset frames in the middle are superimposed to create horizontal motion blur, and are equipped with whoosh. Used for the line of sight shift "I turn on the computer → (screen)". `TRANSITIONS.whip`.
4. **Jump-in**——The same camera position is directly cut to a closer view about 2 times without changing the background. Used in "He repeated it", "He realized it" and "The burdensome sentence". Demonstration film S4 → S5: "These..." are said in the panorama, and the ventilation area in front of "Where to post" is cut to a 1.9x close-up, and the smiling face can be seen clearly. The premise is that the panorama and the close-up are the same world canvas, only the lens is changed (`world.js`), otherwise it will be ruined by one jump.
5. **Over the shoulder / subjective shot** - Cut to what he is seeing (screen, phone, other person), with a piece of the back of his head in the foreground. Demonstration film S2: Milo's back — dark curls, ears, the yellow jacket, a teal backpack and brown shoulder straps (the first version was drawn as a pure black silhouette, and the review read it as "another shadow person"); the foreground does not follow the camera, but only rises and falls with the breath, and there is parallax between it and the screen. The picture immediately "has space".

## ⑤ Rhythm and text

- **The camera follows the spoken sentence, not the music beat**: one sentence ≈ one shot. The average of the 5 shots of the demo film is 1.75s (2.0 / 2.4 / 1.2 / 1.65 / 1.5), which falls within the quartile of 1.03–3.07s measured by TheOdd1sOut.
- **The transition is placed in the breath exchange between the two sentences, and the subtitles and cut points are changed in the same frame**: The first version of the shot was cut on the first two words of "It takes a breath", and the reviewer pointed out that "the cut point falls in the middle of the sentence"; it was changed to L1 end (1.87s) → 2.0s flick → 2.26s settled → 2.30s before speaking.
- **The reaction shot is placed in the silence between two sentences**: Demonstration film S3 lasts for 1.3 seconds without a word, only the chirping of crickets - this pause is the punchline. Editing: After saying the outrageous sentence ("Three Thousand Lines")** don't immediately follow the next sentence**, leave 0.8–1.5s for your face.
- **Freezing after baggage ≥0.9s**: "?" pops up at 7.80s, the film ends in 8.75s, and the tail of the sound effects is naturally wrapped up (only 0.4s was left in the first version, and the reviewer said: "The scene where you laugh was cut out").
- **Words**: YouTube's native storytime does not burn subtitles (relying on CC), and only writes words that "need to be seen" in the picture - words on the screen, key figures (the demonstration film "3000 Lines" was shot out with PuHui Black 230px, `#FFCB6B`, and overshoot 23%). The Chinese platform needs to burn subtitles: white text 50px, black stroke 10px, whole sentences cut in and out, no animation (subtitles will compete with the characters if they move).
- The numbers in the picture and the spoken words are aligned with the same word: "Three Thousand" syllable (3.70s) = 3000 hit out = low-frequency thump = screen shake (9Hz, attenuated in 0.3s).

## ⑥ Key points of code implementation

> Since integration into the skill (2026-10-04 v0.4), reusable functions listed here have moved into `scripts/engine/lib/`, using the shared MO / CAM / DG / TY / CH / UI / CL / TOON namespaces. Film-specific code lives in `scripts/engine/demos/y4_storytime/`. See `references/09-video-animation-grammars.md` for the library guide and narration-to-grammar selection.

- **Reuse Skill**: Engine (segment table, off-screen synthesis of old and new segments during transition, `GLOBAL_OVERLAY`), `render.py`, `PAINT.cached` (whole room background cache), `U.rng` random seed (color block layout of code waterfall).
- **Two changes to the engine (already merged into the skill engine)**: Any segment in the paragraph table can be written directly as `dur` (seconds) without adding eighth notes - storytime cuts by mouth, not by beat; transitions can be written by writing `punch: 0` (or film level `window.PUNCH = 0`) to turn off the engine's default beat impact (storytime has no beat points).
- **Newly written, now unified into the database** (`lib/toon.js` / `typo.js` / `camera.js` / `motion.js`, transition into `transitions.js`):
  - `TOON.bean(c, {x, y, s, pose, expr, mouth, blink, look, squash, bob, tilt, lw})`: The front bean Milo, all Path2D programmed, returns the coordinates of the hands and head (positioning props and symbols).
  - `TOON.POSES`: rest / talk / point / type / shrug / stiff, each posture is just the target point of the two hands relative to the shoulders (unit: head radius).
  - `TOON.mouth(t)`: Read `window.VO_ENV` (the 60fps RMS envelope exported by the audio script), and quantize it into 0/1/2.
  - `MO.springHz / settle / backOut / expoOut / step`,`CAM.with`,`CAM.drift`,`TOON.sweat`,`TOON.mark`.
  - Transitions `whip`, `smash` (the color block transition used by y5 was renamed `fillZoom` after being stored in the library, and there is also `bands / push`).
- **This film `y4_storytime/story.js`**: `STORY.poseAt(keys, t)` (posture timeline + rebound when changing postures), `blinkAt`, `alive` (nodding + breathing), subtitles overlay.
- **Audio (`build_y4.py` in the experimental archive, not included in the skill)**: mouth-broadcasting, synthetic sound effects (whoosh, keyboard, bloop, thump, "beep", cricket, pip, boing), and export `vo_env.js` at the same time. The spoken word is the Eddy placeholder of macOS `say` -** The official film is replaced with a real person's spoken word and the envelope is re-exported, and the mouth shape automatically follows**.
- **Three scenes in the same room**: `y4_storytime/world.js` paints the room into a world canvas (x −1000..2900, y −700..1700, the entire static part is cached), S1 (zoom 1.01–1.045), S4 (0.53→0.50), S5 (1.90→1.98) only replace `CAM.with`. The bookshelves, green plants, and chandeliers that can only be seen from the panoramic view are already in the world. The world should be one circle larger than the farthest lens, otherwise the lens drift will reveal black edges (this is the reason for all three black edges in the first version).
- Key parameters: characters 24fps, mouth shape 12 times/second, posture change 0.1s+7% rebound, characters line 0.05R.

## ⑦ Representative works and first-hand references

- TheOdd1sOut channel: https://www.youtube.com/@theodd1sout; the reprint of this actual test "Mom's Punishment": https://www.bilibili.com/video/BV14s411M7x4
- Jaiden Animations channel: https://www.youtube.com/@JaidenAnimations; this actual test "Being Not Straight" reprint: https://www.bilibili.com/video/BV1xu411r734
- Domics Channel: https://www.youtube.com/@Domics
- Toon Boom × Atomic Cartoons, "Oddballs" from YouTube to the series ("pose-to-pose, very little animation" "He has never done lip-syncing on YouTube" "Too soft, too slow"): https://www.toonboom.com/atomic-cartoons-on-bringing-oddballs-from-youtube-to-series
- Konstantinos Pappis, *The Odd Ones Out: The Rise of YouTube Storytime Animation* (Animation Studies, genre history and visual grammar: round face avatar, white background, no frame by frame, more like dynamic storyboards): https://journal.animationstudies.org/article/id/135/
- TheOdd1sOut Wiki (speak for "Marshmallow Man"): https://en.wikipedia.org/wiki/TheOdd1sOut
- Dan Ebberts Inertial rebound expression (source of freq 3, decay 5): http://www.motionscript.com/articles/bounce-and-overshoot.html
- Producer's experience post "Add a little bounce when changing postures": https://forum.wickeditor.com/t/whoever-wants-to-make-a-storytime-animation/5940

## ⑧ The 3 most common things to do wrong

1. **Treat it as a "full animation", everything is moving.**  The life of this style lies in "quick cut + freeze": TheOdd1sOut is completely still at 70% of the frame. Everything is floating slowly, soft and rhythmless (the Oddballs team is most afraid of "too soft, too slow"). The posture switching should be as fast as 0.1s, and then **really stop**; the continuous micro-movement is only for breathing, blinking, and small background objects, with an amplitude ≤ 1–2%.
2. **The background is as wonderful as the characters.**  The background saturation, contrast, and line width are all one level lower than those of characters (the background line of this film is 3px gray vs. characters 8px black). Once the background is blurred, the audience's eyes will leave their faces, and the humor of the spoken word will be lost.
3. **Reaction shots do not allow silence.**  Saying an outrageous sentence and then immediately following it up is tantamount to missing the point of the joke. The reaction shot should be placed in the blank space of the spoken broadcast, at least 0.8 seconds, and the shot should only be zoomed in very slowly and one or two small details (sweat drops, slow blinking, eyebrow drop).

---

## Demonstration film

- Finished film: `scripts/engine/demos/y4_storytime/` (rendered `render.py --film demos/y4_storytime`) (8.75s, 60fps, including temporary narration + sound effects); Overview of one frame per shot: `assets/animation-grammars/y4_storytime_overview.jpg`
- Project: `scripts/engine/demos/y4_storytime/` (`eras.js` paragraph table, `story.js`, `world.js` world canvas, `s1_desk.js / s2_screen.js / s3_react.js / s4_wide.js / s5_close.js`), the general part is in `scripts/engine/lib/`
- Shot list: S1 Medium shot talking to the camera (0–2.0s) → Shake the camera → S2 Looking at the screen over the shoulder, code waterfall + “3000 lines” (2.0–4.4s) → Smashing the camera → S3 Reaction close-up, silence (4.4–5.6s) → Hard cut → S4 Large panoramic view of the same room "I asked it: these...", glance at the computer, point at the computer (5.6–7.25s) → jump close → S5 close-up hand spread "Where to stick it?" + "?", freeze (7.25–8.75s)

## Film review and rework (independent agents only review finished films)

There are 5 items that "must be changed" in the first version of the film review, all of which will be dealt with:
1. There are three black edges (S1 left/top, the lens bounces back below 1, and the S4 lens drifts downward) → the world canvas is expanded + `smash` zoom clamped at ≥1. After rework, scan the four edges frame by frame: frame 0 is exposed black.
2. There is no air vent in the bag → Take out the S5 jump lens, "?" and freeze for 0.95s.
3. S1 and S4 are not in the same room → change to the same world canvas and change lenses.
4. The over-the-shoulder silhouette looks like another person → draw the back identification point + outline light.
5. The scene cuts in the middle of the sentence, and the subtitles of the second sentence are late → the scene moves in for a breather, and the subtitles are in the same frame as the cut point.
"Could be better" has dealt with 2 items: the eyebrows dropped 0.15s after the second cricket sound in S3 (the original sound effect was at 5.23s, and the expression at 5.38s did not match); the two pauses in S4 were added with "looking at the computer → looking back at the camera" and referring to the computer when saying "these". Remove the spaces between Chinese and English subtitles ("Let AI help me" "3000 lines").
What hasn’t changed: The lines are uniform and equal-thick vector lines, and there are no hand-drawn dithering lines—this is the original look of TheOdd1sOut/Jaiden’s Flash vector lines, which should be retained.

## qa.py Number (after repair, `uv run scripts/qa.py --project scripts/engine --film demos/y4_storytime`)

| Segments | Motion % | Still Frame Pairs % | Jumps | Avg/Peak ms | Deterministic |
|---|---|---|---|---|---|
| s1_desk | 1.47 | 8.6 | 0 | 9.9/10.4 | ✓ |
| s2_screen | 6.0 | 0.0 | 0 | 1.7/3.8 | ✓ |
| s3_react | 1.73 | 0.0 | 0 | 5.6/6.1 | ✓ |
| s4_wide | 0.77 | 16.2 | 0 | 9.6/9.9 | ✓ |
| s5_close | 3.27 | 3.1 | 0 | 10.9/11.4 | ✓ |

Transition smoke (full frame peak): whip 47.9ms, smash 10.1ms, cut 15.7 / 20.5ms. The first version of s1, s2, and s4 each reported 1 jump (settling at the beginning, smashing out 3000, and quickly zooming out at the beginning of the panorama), and after repair, it was 0.
Please note when reading this table: qa's experience threshold "still frame pair >40% is read as stuck" **not applicable to storytime** - 70.7% of adjacent frames in TheOdd1sOut's original film are completely still. That is style, not lag. The still frame ratio of this film is 0–16%, which is much more "live" than the original film. It is deliberately based on Jaiden's continuous breathing. If you want to be more like TheOdd1sOut, you turn off the breathing, nodding, and background small loops, leaving only the mouth shape and posture quick cuts (the still frame ratio will increase significantly, but this time there is no actual measurement).
