# y5 · Dynamic typography/infographic animation (kinetic typography)

> One-sentence grammar: The first word is the actor - each keyword is punctuated by an accent, the main word is big enough to be read at a glance, and the remaining words rise from the "slot" for ear alignment; there is always only one focus in the picture, the camera and the background are always moving, and the words do not move after they are settled. **

Lineage: The title sequence of Saul Bass' "North by Northwest" (1959) is generally recognized as the first large-scale use of kinetic text in a feature film; after 2008, the lyrics/line kinetic type on YouTube (the After Effects generation) turned it into a standard syntax for the opening of narration videos, lists, quotations, and data.

---

## ① Applicable scenarios

**Use it:**
- Explanation/List/Opening and Chapter Cards of "X Stages" and "3 Reasons" categories: The information is the **structure** (how many, which one, from what to what), not the picture.
- Quotations, golden sentences, and one-sentence conclusions: It is easier for the audience to "watch and read" than "listen and memorize".
- Digital explanation: one number, one shot, and the number itself plays the protagonist.
- There are clear accent words in the narration ("It's not about writing code, it's about talking about needs").

**Don’t use:**
- Telling stories and emotional ups and downs → Without human faces, it is difficult for the audience to empathize (use y4 characters).
- Long explanatory speech with full screen words → the audience can only read but not listen, and cannot keep up with the reading. It would be tiring to use dynamic words for the whole film for more than 30-60 seconds. Just use it as the opening, chapter card, and conclusion card.
- Lists with many words (>5 items) → Change to static infographics and talk slowly.

## ② Screen composition

**Composition**: one main word per screen. Left-align it in the left 1/3–1/2 of the frame, or mirror to the right; place the supporting sentence directly below. Put an evidence object (code card, chat bubble, checklist) on the other side. Add a small stage label such as “STAGE 01” and a progress track at the top. Keep margins of at least 130px.

**Type scale (demo)**: main word 340px (original PuHui 115 Black; English alias uses Inter Black), supporting sentence 96px (105 Heavy), label 40px (85 Bold, tracking 6px), approximately **3.4 : 1 : 0.4**. The original used two-character keywords readable in 0.3s; use short English words and fit their measured width.

**Color**: one full-screen background color per chapter; changing the background identifies the chapter.

| Shot | Background | Main word | Accent |
|---|---|---|---|
| Title | Yellow `#FFD23F` | Ink `#111111` | White “3” inside a coral circle `#FF5A36` |
| 01 Completion | Coral `#FF5A36` | White | Yellow highlighter `#FFD23F` |
| 02 Chat | Navy `#14213D` | Yellow | Yellow highlighter, blue bubbles `#3A86FF` |
| 03 Agent | Off-white `#F4EFE6` | Ink | Coral underline, green check `#2BB673` |

The film uses four background colors plus ink and white; keep one active accent color at a time.

**Shape language**: typography is the largest shape. Supporting shapes are rounded rectangles (cards r=26, bubbles r=30, keycaps r=22), circles behind numbers, and slanted highlighter blocks (slope 0.18). The background is a 64px dot grid at 6–10% opacity. Avoid outlined or shadowed text; the only shadows are offset card shadows at 8–18% opacity.

## ③ Motion paths

**Entrances: choose by importance**

| Element | Method | Curve and duration |
|---|---|---|
| Main word | **Slam**: scale 1.7→1, opacity 0→1 during the first 0.06s | Underdamped spring `1−e^(−10t)·cos(2π·2.2t)`, about 8% overshoot, settles in ≈0.35s |
| First title word | Slam plus rotation −8°→0 | Same as above |
| Supporting sentence, labels | **Rise from a slot**: masked below the baseline, translate from +1.2× glyph height to 0 | `expoOut`, 0.30–0.35s |
| Numbers/icons/bubbles/keycaps | **Pop in**: scale 0→1 | `backOut`, s=2.6–3.0 (17–20% overshoot), 0.30–0.42s |
| Cards | **Slide in**: from +700px horizontally or +260px below, leveling from 3.4° | `expoOut`, 0.40s |
| Typing | Reveal by character count | 13 characters in 0.5s (26 characters/s), cursor blinking at 2Hz |
| Code completion | Gray suggestion appears **instantly** → pressing Tab makes it solid | Keycap compresses 14%, rebounds with e^(−18t) |
| Highlighter / underline | Sweep left to right | `expoOut`, 0.30s, 1–3 eighth notes after the word appears |
| Keyword zoom | Zoom in to 1.35 times for the emphasis beat and pin it, the highlighter will zoom in accordingly | Spring freq 2.5 / decay 9, and the same beat as the matching action (press Tab, tick) |
| Giant stage number | 900px, transparency 5–13%, pressed on the lower right of the painting, falling from 1.35 times to 1 and slowly drifting diagonally 14/10 px/s | Spring freq 2 / decay 8 |
| Tick | The strokes of the tick are drawn according to the arc length, and the frame is 1→1.25→1 | 0.22s; the strikethrough is delayed by 0.08s and then drawn |

**Exit**: Faster than entry, using acceleration curve (`expoIn`), duration 0.18s, staggering 0.03s between elements, shrinking to 0.6 at the same time, falling 60px, and becoming transparent.** Exit faster than entry** – The audience’s attention is gone before the exit begins. The last beat of the title sequence of the demonstration film: All except "3" exit, leaving only one figure to rush in.

**Stagger**: The words in the same line are staggered by one eighth note (0.25s at 120 BPM); the same group of small elements (three ticks) are also one eighth note.

**Continuous movement (the word does not move after it is settled, what moves is something else)**
- Subtle camera drift: two sine waves, amplitude 5px, periods about 7s / 2.7s; very slow rotation ±0.5°.
- Beat punch: scale the full screen up 1.2% on each quarter note, decaying with `e^(−25t)` (≈0.12s), so the picture breathes with the drums.
- Move the background dot grid diagonally at 36px/s.
- Final beat: pull the camera back 6% (`expoOut`, 0.5s); shrinking everything slightly signals closure.

**Original-film comparison (two sampled YouTube kinetic-lyrics reposts, 30fps)**: fully static adjacent pairs account for only 10.3% (DISCORD) / 21.2% (Charlie Puth); the image moves 70–80% of the time, contrasting with storytime's 71% static pairs. Major visual events (peaks with >1.5% full-frame change) average one every 0.66s / 0.83s, close to **one per beat** (about 105 / 99 BPM; 0.57 / 0.60s per beat). The demo has one major event per eighth note (0.25s), twice as dense; suitable for an explainer opening, but use one per beat in longer films.

## ④ Transitions (3 in the demo + 2 common types)

1. **Zoom through a shape**: push into a shape on the previous screen (the coral circle behind “3”); its color matches the next background. After it fills the screen, settle the next screen from 1.25× to 1×. First 55%: `expoIn` to 30×; final 45%: `expoOut` settling. `TRANSITIONS.fillZoom` (called zoomThrough during experiments, renamed on library integration to distinguish it from 3b1b's transition); parameters `cx, cy, k, maxZoom, fill`.
2. **Color-band wipe (bands)**: three slanted bands (yellow → white → navy) sweep left to right, staggered by 12%; the final band matches the next background and reveals the next scene behind it. 0.5s `expoInOut`; `TRANSITIONS.bands`.
3. **Push**: translate both screens together as if moving across one long canvas. 0.35s `expoInOut`; `TRANSITIONS.push`.
4. **Mask wipe**: grow a shape (circle, rectangle, or letter) to reveal the next scene. The skill's existing `iris` can be used.
5. **Letter morph / letter transition**: enlarge a letter into a full-screen color block, or throw it off-screen to carry away the old scene.

**Alignment tip**: transitions begin at the new segment's `t0`. To reveal the new scene exactly on the bar line, set segment start = **bar line − reveal fraction × transition duration**. Demo: fillZoom reveals at p=0.55, duration 0.45 → start 1.75, reveal 2.00; bands reveal at ≈0.6 over 0.5s → start 3.70; push with expoInOut looks settled at 90% displacement (p≈0.58), rather than p=1 → start 5.80. The first version used p=1 and start 5.65; review found it finished 8 frames before the downbeat. Write in-shot events as beat positions `KT.b(n)`, rather than seconds.

## ⑤ Rhythm and text

- **120 BPM, 4 bars + 1 closing beat (8.5s), one shot per bar** (title / stage 1 / stage 2 / stage 3). Each shot: beat 1 main-word slam plus oversized background stage number; beat 1.5 evidence object; beat 2 supporting sentence; beat 3 evidence action; beat 3.5 enlarged/highlighted keyword; beat 4 breathing room or exit. Beat 16 (8.0s) is the closing accent, followed by a 0.5s hold. Reuse beat positions, varying sides and content, so viewers anticipate the rhythm from shot 2 onward.
- **Main words land on downbeats**, with a low-frequency hit; small elements land on eighth notes with a pop. A 0.3s noise riser before each transition carries the listener into the next bar.
- Every visual landing has a sound and every accent has a visual. The demo's sound-effect table is in the experimental archive's `build_y5.py` (not included in the skill), corresponding directly to beat positions in `scenes/*.js`.
- **Allow enough reading time**: the referenced SSW English-video guidance uses 13 characters/s as a lower rate. The original card also mentioned an unverified subtitle-industry rule of thumb of 7–9 CJK characters/s: hold its two-character main words at least 0.5s and 7–8-character supporting phrases at least 1.0s. For English, size timing to actual character count instead of reusing those CJK limits.
- When counterpointing with spoken broadcast: subject = accented word in spoken broadcast, **The picture should be earlier than later, at most 1 frame earlier** - People are much more sensitive to "sound earlier than picture" than "sound later than picture" (the broadcast sound and picture synchronization tolerance EBU R37 is that the sound leads ≤40ms and lags ≤60ms).

## ⑥ Key points of code implementation

> Since integration into the skill (2026-10-04 v0.4), reusable functions listed here have moved into `scripts/engine/lib/`, using the shared MO / CAM / DG / TY / CH / UI / CL / TOON namespaces. Film-specific code lives in `scripts/engine/demos/y5_kinetic_type/`. See `references/09-video-animation-grammars.md` for the library guide and narration-to-grammar selection.

- **Reuse skill**: Engine (paragraph table, old and new layers of transition, `renderFrame`), `render.py`, `U.clamp / lerp / rng`, `PAINT` are not required (this style does not require textures).
- **Engine changes (incorporated into the skill engine)**: `window.BPM` can be configured (default 128, this film is 120); any segment can be written `dur` seconds; transition `punch:0` can be turned off (this film uses its own beat to slightly rush, rush on the shot, not on the starting point of the transition).
- **Newly written, now unified into the database** (`lib/motion.js` / `typo.js` / `camera.js`, transition into `transitions.js`):
  - Easing: `expoOut / expoIn / expoInOut / quintOut / backOut(p, s) / spring(t, freq, decay) / settle(t, amp, freq, decay)`.
  - Words: `TY.text` (zoom and rotation with any point as axis, stroke, kerning), `TY.width`, `TY.rise` (mask raised), `TY.pop` (pop-in), `TY.typed` (typing), `TY.marker` (highlighter diagonal block), `TY.underline`.
  - Lens: `CAM.with(c, {x, y, z, r}, fn)`, `CAM.drift`.
  - Transitions: `fillZoom`, `bands`, `push`.
- **This film `y5_kinetic_type/kinetic.js`**: `KT.b(n)` time signature, `KT.SZ` font size ladder, `KT.bump` shot point micro-shooting, `KT.slam` main word smashing, `KT.dots` dot matrix, progress track (drawn on the `GLOBAL_OVERLAY` fixed layer, the value is only determined by the full film time - skill 02 The usage of "continuous narrative anchor"; the first print is in each paragraph, and it jumps with the page when pushing the page), `KT.key / keyMarker` (the keyword rises first, then zooms in and pins when it is emphasized), `KT.bigNum` (the background giant stage number), `KT.cam`.
- **English fonts**: `PuHui-Black/Heavy/Bold/Medium` remain stable family aliases and now load bundled Inter at weights 900/800/700/500. English headlines need different line breaks and sizes from the original demonstration. The localized demo uses shorter phrases and smaller type where needed.
- **Music (`build_y5.py` in the experimental archive, not included in the skill)**: numpy synthetic drum (kick every beat, clap 2/4 beat, hat backbeat) + bass (eighth note of the root note per measure) + event sound effects (subject = boom, small element = pop, typing = click, tick = rising pop, before transition = riser).

## ⑦ Representative works and first-hand references

- Saul Bass Art of the Title: https://www.artofthetitle.com/designer/saul-bass/
- Wiki "Kinetic typography" (motion typography / fluid typography, Bass is a pioneer of feature films): https://en.wikipedia.org/wiki/Kinetic_typography
- School of Motion "Kinetic Typography in After Effects" Part 2 (number of frames: small word slides into 4 frames, main word is thrown into 6 frames + 2 frames to overshoot and return to normal, camera pushes to 6 frames + 2 frames to pull back; "The camera will move later, as if it is pushed by the sound"): https://www.schoolofmotion.com/blog/kinetic-typography-after-effects-part-2
- School of Motion Part 3 (accelerate when falling, do not slow down, and when impacting, the entire synthesis will be enlarged and then returned to 100%): https://schoolofmotion.com/blog/kinetic-typography-after-effects-part-3
- Dan Ebberts Inertial rebound expression (`amp·sin(2πft)/e^(decay·t)`, default freq 3 / decay 5): http://www.motionscript.com/articles/bounce-and-overshoot.html
- Lee, Forlizzi, Hudson, "The Kinetic Typography Engine" (UIST 2002, dynamic words express emotion and tone): https://dl.acm.org/doi/10.1145/571985.571997
- Video text dwell time: https://www.ssw.com.au/rules/post-production-do-you-give-enough-time-to-read-texts-in-your-videos
- Two reprints of this actual measurement: DISCORD [Kinetic Typography] https://www.bilibili.com/video/BV1ts411S7Xa; Charlie Puth – We Don't Talk Anymore (Kinetic Typography) https://www.bilibili.com/video/BV1by4y1r74Y

## ⑧ The 3 most common things to do wrong

1. **All characters are the same size and move together.**  Without hierarchy, there is no focus, and the audience won’t know which one to read first. The ratio of subject to auxiliary clause is at least 3:1. Only one thing is "entering" at the same time, and the rest are all stationary.
2. The word ** keeps drifting.**  The words cannot be moved while reading (it will make it difficult to read). Continuous movement is left to the camera's micro-floating, beats, and background dot matrix; the characters are nailed after 0.35 seconds.
3. **The animation does not step on the beat, or steps on the starting point of the transition.**  The first frame of the transition is not the accent, the frame "when the new picture is revealed" is. Move the starting point of the segment forward by "unveiling point × duration", and then write each landing point in the shot as a time signature; for every additional landing point outside the beat grid, the whole film will be scattered by one point.

---

## Demonstration film

- Finished film: `scripts/engine/demos/y5_kinetic_type/` (rendered `render.py --film demos/y5_kinetic_type`) (8.5s, 60fps, composite score 120 BPM); one frame per shot overview: `assets/animation-grammars/y5_kinetic_type_overview.jpg`
- Project: `scripts/engine/demos/y5_kinetic_type/` (`eras.js`, `kinetic.js`, `k1_title.js / k2_complete.js / k3_chat.js / k4_agent.js`), the general part is in `scripts/engine/lib/`
- Shot list: K1 title "③ stages of AI writing code" → Zoom through → K2 "Complete" (code card + gray text completion + Tab) → Ribbon erasure → K3 "Dialogue" (you say one sentence, it is a whole paragraph) → Push → K4 "Agent" (Tick the three TODO items by yourself) + progress track is full

## Film review and rework (independent agents only review finished films)

Review conclusion: "The first 0-2s are standard kinetic type, and the circle of "3" rushing into the camera and turning into the background color of the next section is the best design in the entire film." "The sound-picture alignment is almost perfect, and all visual events fall on the 120BPM grid and in the same frame as the kick drum." There are 5 items that "must be changed", and the processing is as follows:
1. **The auxiliary sentence stays too short** (0.6–0.9s) → The auxiliary sentence is shot ahead of time and reduced to 6–7 words (“It completes the next line”, “One sentence changes to a whole paragraph”, “You just say what you want”), and the readable time is 1.0–1.5s (stage 2 is still tight, and the official voiceover is enough); 0.5s is added to the entire film.
2. **Stage 2 The auxiliary sentence is about to hit the AI ​​panel** (14px) → The auxiliary sentence is shortened, right-aligned, and the spacing is >180px.
3. **The page is pushed 8 frames early, and the progress track jumps accordingly** → The starting point of the segment is recalculated according to 90% displacement (5.80); the progress track is moved to the `GLOBAL_OVERLAY` fixed layer, and the color is changed at the frame that is revealed.
4. **The stage paragraph is not kinetic enough** (the number is too small, the keywords are only highlighted but not amplified) → Add the giant stage number 1/2/3 in the background; when the keywords are highlighted, the amplification is 1.35 times.
5. **There is no finishing blow at the end, and all the check marks turn gray** → Add the 16th shot to finish and reshoot (zoom out 6% + 3.5% impact + low frequency + high tone), the checked words turn green but not gray, and the overall content moves down 70px to fill in the bottom blank.
Also: the code cards are changed to a fixed-width font (Menlo).
What was not adopted: "Extend each segment to 2.5-3 seconds, and the entire film to 10-11 seconds" - the demo film requires about 8 seconds, and use the number of words instead of the delay length.

## qa.py Number (after repair, `uv run scripts/qa.py --project scripts/engine --film demos/y5_kinetic_type`)

| Segments | Motion % | Still Frame Pairs % | Jumps | Avg/Peak ms | Deterministic |
|---|---|---|---|---|---|
| k1_title | 2.37 | 0.0 | 1 (t=1.63, title exits) | 1.0/1.6 | ✓ |
| k2_complete | 2.39 | 0.0 | 0 | 1.5/3.2 | ✓ |
| k3_chat | 2.59 | 0.0 | 1 (t=4.54, AI bubble grows) | 1.6/2.2 | ✓ |
| k4_agent | 2.88 | 0.0 | 3 (t=6.29 Agent + task card; t=8.00/8.04 final remake) | 1.6/2.0 | ✓ |

Transition smoke (full frame peak): fillZoom 6.8ms, bands 4.8ms, push 3.8ms. 5 jumps viewed frame by frame, all with intentional beat accents (qa documentation: "Intentional beat flashes are not a mistake"). Kinetic's jump should fall on the beat - you can use the jump time to match the beat grid, and anything that doesn't match is a bug.
After rework, scan the four edges frame by frame: frame 0 is exposed black.
