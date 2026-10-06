# 07 · Positive Experiences: What’s Proven to Work

Here are recorded practices, evidence and applicable conditions that can be reused in practice.

This page only records **things done right**: practices, evidence (what is measured/who has successfully reused it under what circumstances), why it works, and when to use it. Falling into the "trampled pits" of each reference. For the source of each tape, a latecomer will add a mark to the evidence if it is successfully reused, and a clear boundary will be written if the reuse fails.

---

## 1. Director and mechanism

**1. Transition = the signature language of the next style.**
- Evidence: All 15 transitions in the art history speed pass are designed in this way; two independent agents in the transfer test A and B both rated it as "the most valuable and transferable sentence in the entire skill", 9 new transitions (gold foil spiral spread, shouting ribbon pressed down, flying streamer peeling off old painting, polka dots growing out, melting droplets, hard-edged sunlight, wet paper blooming, VHS Tear...) is almost directly derived from this sentence without any detours.
- Why: Transitions accomplish two things at the same time—say goodbye to the old style and preview the new style. The audience knows "who's next" in 0.3 seconds.
- How to use: List the most recognizable formal elements of the new style (materials, brushwork, motifs, media glitches), choose one that can "come from scratch", and create a process of growing out of an object in the painting (cat, cup, head).

**2. A skeleton, a set of choreography, and N types of painting methods = "the same pair of characters traveling through time" are available for free.**
- Evidence: RIG.girl/RIG.cat Return to Path2D+ anchor point, all 36 styles are reused; A and B both said, "When changing styles, both humans and cats stand in the same position, and the position and movement are automatically consistent. This effect is obtained for free."
- How to use: First determine the character skeleton and action curve, and then write the style; the style only changes "how to draw", not "where and how to move".

**3. The actions of the protagonist should be continuous across sections and should be carried out according to the entire film time.**
- Evidence: In the first version of transfer test A, each segment was re-drunk at a partial time. The original reviewer said, "The audience saw her toasting five times, instead of changing five painting styles at the same moment." After changing to the full film time (`PAINT.cupCycle(t)`), the poses on both sides of the transition were consistent, and the "two heads" were also eliminated.
- How to use: In speed-passing/travel-travel movies, all character actions use the full film time t; only "a certain exclusive performance" uses partial lt.

**4. Beat grid + beat point impact works on both the old and new layers.**
- Evidence: v1 only processes new layers, and the film review measured the dragging time of the first 6 out of 15 transitions at 0.1–0.17s; after changing to two layers to process at the same time, the first picture changes of the 15 transitions all fall on the beat (±2 frames), and the frame difference between beats is 7–33.
- How to use: For any stuck editing, the frame where the point is shot must have changes visible on the entire screen.

**5. At the beginning, let the first painting be "drawn by yourself".**
- Evidence: 0.45 seconds before the ink section of migration test A, press reveal to write, the ink halo spreads, the film reviewer approves, and frame 0 is no longer a white paper.
- How to use: When there are no transitions in the first section of the film, use the "painting process" of this style to start (writing out the brushstrokes, coloring the prints one by one, and lighting up the pixels row by row).

## 2. Picture beauty

**6. Regional swatches are more important than color dithering.**
- Evidence: The first version of Van Gogh only did color dithering, which was "noise of the same blue"; each area was given a color group of 7-8 colors (`P.swatch`) before Van Gogh was released. A's Munch (one set each of sky/fjord/mountain/wall/ground) was directly copied successfully.
- How to use: For any brush stroke/color point style, first fix the color group according to the area, draw the color from the group for each stroke, and then mix 30–45% of the base color to keep the light and dark.

**7. Give the large area to the renderer, small objects and characters on a separate layer, and finally fill in the lines.**
- Evidence: Sunflowers and table legs were smashed into a ball by large brush strokes, which became clear after being dismantled; Hopper's "double version of light and shadow cutting" in B is a promotion of this.
- Border: The pipeline order of ink, printmaking, and pattern is different (paper is the base, ink is only added upward; the pattern itself is the renderer), see No. 04.

**8. The characters must also pass through the same renderer, otherwise they will look like pasted clipart.**
- Evidence: Among the 36 styles, the ones with characters also using the renderer (Van Gogh’s fine brushstrokes, mosaic stones, 8-bit pixels, three-dimensional sections, black painted silhouettes, shadow puppet hollows) are the most integrated; those that only use vector skeletons to paint flatly (ink characters 6/10, Ghibli characters “like flat vectors”, Dali “partial vector illustrations”) are the weakest points in each section.
- How to use: After flat painting the characters, do at least one "material processing of the style" - brush strokes, particles, paper grain multiply, ink bloom, dots, and color plate dislocation.

**9. The words in the style are drawn with paths, which is more stylish than using fonts.**
- Evidence: B’s Cyrillic block letters (5×7 modules), neon tube kana; Roman mosaic letters (equal-width thick strokes, each stroke ≥2 stones wide). If there are missing characters in the font subset, it will silently fall back to the system font, and it will change when you change the machine.
- How to use: For titles, signboards, and inscriptions, use paths to draw materials of that style first; if fonts must be used, first verify that the fonts are there.

**10. The physical process of materials is the renderer.**
- Evidence: Ukiyo-e "color filling relative to ink line misalignment (3,2)px + halo horizontal brush mark" = color woodblock; mosaic "layout is calculated once, color flows through the stones every frame" = real mosaic animation method; gold foil "horizontal brushing noise y frequency is 20 times that of x" gives a metallic feel in one go, and was directly reused by A's Klimt.
- How to use: Before writing a new renderer, ask "How is this kind of painting made in reality?" and write that process into code.

**11. Make small things bigger than intuition.**
- Evidence: Ukiyo-e Wave Claw cannot be read at 22–50px, but 44–74px is in The Great Wave off Kanagawa; A magnifies the Saibaishi Shrimp by 1.45 times and the Feiten by 1.35 times to read it.

## 3. Exercise

**12. Each act = main action + 2–4 small loops taken from the motif of the style.**
- Evidence: Simply cutting the picture cannot express the movement within the picture; the 16 segments made according to this method have a qa movement area of ​​1.6–14%, and there is no jump in all.
- How to use: The list of motif actions comes from the dismantled motion heat map; if there is no reference film, just list the 3 most recognizable formal elements of the style by yourself, each with an active method.

**13. Let the direction field change continuously over time instead of changing seeds and reshuffling at 8fps.**
- Evidence: The frame difference of reshuffling the entire screen at 8fps is 18-20 (larger than the transition), and the review read it as "painting is flashing"; after changing the stroke position to a fixed position and the direction field to continuously sway, the jump is 0 and the movement area is 9%. Boiling is left only to line drawings.

**14. The mold period of the rolling pattern is equal to the real period of the pattern.**
- Evidence: A's polka-dot skirt takes the modulo of the spacing, jumps around the whole frame (the frame difference is 2.7 times), and disappears after taking the modulo of the two-row period of the hexagonal grid.

## 4. Stability and efficiency

**15. Standard + benchmark implementation + grouped parallel agent, passed in one go.**
- Evidence: 16 epochs of 4 parallel sets, 30–35 minutes each, all delivered at once; followed by 4 sets of migration tests (20 new styles) also delivered at once. Standardize the interface, available libraries, hard requirements, self-test, and delivery notes; the benchmark implementation allows the "five-layer structure" to be copied.

**16. An independent film review agent must be sent before delivery, and only the finished film will be reviewed.**
- Evidence: Four types of problems were caught in the review of the reprinted v1: dragging, flickering of the whole screen, silence, and dancing cats; the review of the transfer A caught the "five toasts", "two heads" and "transparent arms"; the review of B caught "an incorrect letter in the TEA slogan" and "pink clothes look like no clothes" - the producer himself did not find it after watching it for 3 rounds.

**17. Use numerical acceptance: qa.py.**
- Evidence: motion area, still frame pairs, jumps, real time consumption (forced GPU flush), certainty, 16 segments were verified in 40 seconds at a time. Only looking at the head and tail difference will miss the lag (A: Klimt 33% change but the 14/48 frame pair is still); only measuring the JS time will report a false 1ms (B).

**18. Everything is randomly seeded and rendered twice at the same time, pixel by pixel consistent.**
- Evidence: All 36 styles passed the cold/hot rendering comparison; the rendering does not flicker and can be re-rendered in sections and then put together again.

**19. The static part is fully cached, and only the moving parts are drawn in each frame.**
- Evidence: Bauhaus 2.5ms, Pop 5ms, 8-bit 3ms; B 5-segment 4-segment master buffer. The heaviest Van Gogh (three brushstrokes across the entire frame) took 117ms, and the entire film was rendered within 2 minutes at 60fps.

## 5. Disassembly and reference

**20. The reference frame is used as the raw drawing to lock the composition; AI sets the draft grid to read the key points.**
- Evidence: gpt-image uses the original film frame as a reference, and the 50% superposition of the original film almost overlaps pixel by pixel; the first version of the handwritten coordinates of the girl's skeleton looks like a boy, and after overlapping the 20px grid reading points, it can be read in one round to identify a 17-year-old blond girl.

**21. The motion heat map tells you that "the painting is alive" before starting work.**
- Evidence: Before looking at the heat map, I thought each segment was a painting; the heat map shows that 2.5–34% of the area of ​​each segment is moving, which directly determines the entire route.

**22. Grid fitting uses "maximum step size at 80% of interior points".**
- Evidence: The minimum residual method will pick a very small step size to harden all points; after modification, 14.1 frames (128 BPM eight points) are drawn from 16 detection points, and 3 false detection points are marked as outliers.

## 6. Scale (2026-10-04 night, 36 styles integrated)

**23. Let the independent agents build their own wheels first, and then collect them in a unified way.**
- Evidence: 4 groups of migration tests each wrote brushes/renderers/post-processing, and merged them into brush.js (7), render.js (14), and post.js (6) during integration; after 20 segments were transplanted to the unified library, 16 segments were consistent with the original project pixel by pixel outside the characters box - the API of the library is enough to carry real usage.
- Why: Unifying the library first will create abstractions that no one will use; let the real style grow first, and only add it to the library if it is repeated more than twice (the opposite of "three lines of repetition is better than premature abstraction" is also true: if it is repeated three times, it should be discarded).

**24. Migration testing itself is the best requirements document.**
- Evidence: The task book of "Only reading the skill, making a style that is not available in the skill, and writing feedback" required 4 agents to submit a total of more than 60 specific issues (silent degradation, hard-coded film length, non-flushing of timing, skeleton bugs, DABs label errors), each with a repeated scenario; none of these were exposed when the author used it himself.
- How to use: Every time a skill adds a large ability, it will send 2 read-only skill agents to do unseen questions and ask for "what helped/where it got stuck."

**25. Acceptance tools must also be accepted.**
- Evidence: qa.py was once fully green, but during integration it was discovered that it did not execute the transition code at all. A transition referenced a non-existent function, and the entire frame crash was not reported; I only caught it after adding "smoke in transition". The glyph check uses measureText to compare the false negatives on Mac and read the character table of the font file instead.
- How to use: Deliberately create a failure for each check item (deleting a scene, writing a wrong transition, using a missing word) to confirm that it will really be red.

## 7. Video animation-grammars (2026-10-04 night, 5 types of YouTube + 3 types of technology and finance)

**26. Test the sample first and then determine the grammar.**
- Evidence: The first version of G1 Vox used a tear-off paper transition, and when I went back and counted the five Vox samples frame by frame, they did not appear once; the first version of the whiteboard promoted thought bubbles, which were not included in the RSA samples. G2 actual measurement of TheOdd1sOut: the average shot is 2.4 seconds, and 70% of adjacent frames are completely motionless - contrary to the intuition that "animation should always move".
- How to use: Before making a grammar, run `breakdown.py` on 2-5 masterpieces to measure the shot duration, still ratio, and transition types, and then write cards. The "style characteristics" in the impression are often those of others.

**27. The camera is only determined by the total film time, and the transition function is only responsible for compositing two shots.**
- Evidence: Kurzgesagt scales 60 times and travels through the entire vector redrawing without blurring; the "transition" between the Vox desktop and the whiteboard is the camera movement itself, with a qa jump of 0. G3: Push camera transition allows the old lens to continue pushing the camera by itself instead of enlarging the screenshot - when passing through a circular object, the magnification factor ≥ 1100/radius, otherwise the last frame will jump.
- How to use: World canvas + viewport; do not make zoom transitions on the rendered bitmap.

**28. The "unveiling" frame is the accent.**
- Evidence: G2 dynamic text sets the starting point of the segment to "bar line − reveal point × transition duration", and all visual events are in the same frame as the kick drum. and Article 4 (beat impact two layers) are two cases of the same principle.

**29. Stillness does not equal card: Grammar determines the density of movement.**
-Evidence: storytime's 70% motionless frame is style (the joke lies in the "cut to a close-up of the reaction and shut up"); kinetic's word stops moving after it settles, and the motion is left to the camera and background; qa's "still frame to >40% reading stuck" does not apply to these two types.
- How to use: qa numbers are read according to the grammar: the art style speedrun should be "always alive", and the story/text type should be "moving at the node and still at the laugh point".

**30. When reviewing a film, you need to check the logic and numerical standards, not just the pictures.**
- Evidence: The G3 film review found that "the output neurons are connected to the hidden layer and not the pixels", ""increased by 9 times" should be "increased to 9 times of the original value"" and "the end point of the monthly line ¥268 and the end point of the daily K ¥286.40 do not match" - all three are perfect pictures and wrong content. Hard rules for financial charts: Do not truncate the coordinate axis to mislead (truncation should clearly indicate "the vertical axis does not start from 0"), unit, source, and schematic data subscripts.

**31. One screen has one focus; structure first, then data, and then mark only one thing.**
- Evidence: kinetic "The main word comes in, and the rest rises from the mask"; finance "The coordinate axis comes out first, then the data, and finally only one thing is marked"; 3b1b "One color represents a concept, and the deformation makes the previous concept directly become the next one, with almost no cutting of the camera" - the three grammars independently reach the same conclusion.

## 8. characters

**32. People are handed over to the graph model, and the code is only synthesized - the division of labor is based on "who is good at it", not "the route is pure or impure".**
- Evidence: Comparing the same frame in three directions, the Q version drawn by code was judged to be "terrible", while both the G2 frame library and the AI ​​frames redrawn according to the style "worked very well"; the most common shortcoming among the 36 styles is also characters. What the code is good at is regularity (stroke field, geometry, camera movement, time, physics, certainty), and what the model is good at is the "pairing" of human faces and human shapes.
- How to use: See No. 10. Ask each layer "who painted it best" before deciding which painting to use.

## 9. Connect to the import broadcast pipeline (2026-10-04 night, end-to-end actual test)

**33. Clips are rendered according to the finished film frame number, and the window is taken from the finished film timeline - regardless of whether it is across cuts or multiple speeds.**
- Evidence: Between the two beats to be replaced is a 3.65-second pause that was cut out by the rough cut. The rough cut also sped up the overall speed; render them as a continuous filming time (119 frames) and swap them in. After compilation, the lens `rate` = 1.0, 119 frames rendered = 119 frames of the shot, only 1 chapter (30–57 seconds) is re-rendered, and the remaining 7 chapters remain unchanged. Chapters are frame-by-frame for fragments, and the moving frames 28/29 and 127/137 cast an offset of 0 (the rest is coding noise, positive and negative symmetry).
- Why: The director layer of the pipeline uses original film seconds and the finished film uses finished film seconds. Animation only lives in the finished film. Taking the window from the finished film timeline bypasses the three conversions of speed, notch, and "beat end point = next starting point".
- How to use: Write a small script in the narration pipeline to cover the three steps of "draft (get the window from the production timeline and produce the spec draft) → render → verify (frame-by-frame core synchronization)", see No. 09 "Fragment Contract".

**34. For cue, write "which word", do not write "number of seconds", and change it to frame before rendering.**
- Evidence: 5 cues (pillar growth, annotation pop-up, newspaper clipping exposure, two highlighters) reveal an error of −0.48 to +0.09 frames between the frame and the starting point of the word, all from frame-by-frame rounding; the spoken broadcast is changed, the window frame number is changed, and the render directly rejects the message instead of quietly misaligning it.
- Why: The number of seconds is a second-hand number copied from the word list, and the word is the director's true intention (a mark pops up when a certain number is read), and the conversion is left to the script.
- How to use: `{"word": "7.8", "kind": "highlight"}`; if you add `nth` to the same word multiple times, write `offset` in advance.

**35. Post real screenshots on a vertical screen: split the half sentence you read orally into two highlighters, each time matching a keyword.**
- Evidence: The red circle cannot be placed in the entire frame (width 0.93), and the camera cannot be pushed in. The height of the main text is about 20px and cannot be read on the mobile phone. According to the narration, it is divided into two half-sentence frames, each corresponding to a keyword, and is zoomed in 2.4 times. The height of the text is about 50px; when the second frame is outside the frame, the camera moves it first and then reveals it.
- Why: The bottleneck of the vertical screen is the picture width, and one focus can only be half a sentence; Vox originally has a grammar of "look at this sentence", and it is just right to follow the spoken sentence.
- How to use: Use the original frame to crop the screenshot (save a copy of `_source frame`). Rect first renders a kernel of `--stills`. Visual inspection often deviates by 20–30%.

**36. Grammar with words should give way to subtitles, instead of subtitles giving way to animations.**
- Evidence: The annotation of the original vertical layout of t3 falls exactly at y≈1460, which overlaps with the burned subtitles (1400–1520); after adding `safe`, the chart ranks at 300–1430, which is in the same safe area as other contain materials in the film, and the frame is extracted with zero occlusion. In the first round of independent review, he said, "The screen is full of pure white sandwiched between dark screenshots, and the brightness jumps most obviously." Adding `safe.fill` = background color of the film, the upper and lower two lines become the same dark background as the adjacent screenshots, and the chart becomes a card in the same position.
- Why: Subtitles are burned together when exporting, and moving subtitles by segment requires moving the export chain; animation is parameterized, and it is cheapest to move it yourself.
- How to use: Spec writes `safe` (the draft of the pipeline will be calculated from ASS and contain_box).

## 9. From demonstration films to reusable clips

**33. The demonstration film is well done ≠ it is fine after parameterization; parameterization needs to be reviewed separately.**
- Evidence: The 8 grammar demonstration films have all passed independent review, and were extracted into spec-driven clips and re-reviewed. Only 3 of them can be used directly: when the real data is changed, the scale rounding error is exposed, the category target label is removed, and the large number is pressed; the subtitle yield parameter 6/8 is ignored; the text card is not finished and the camera leaves; the last frame pen of the whiteboard covers the word "no" and reads the opposite meaning. The input for the demo film is chosen by the author, and the input for the clip is given by the pipeline.
- How to use: When reviewing parametric clips, you need to change the input - negative numbers, decimals, long titles, vertical screens, no screenshots, transparent backgrounds, long text - at least one "unfriendly" spec for each type; the sample materials used for acceptance must also be clean (cannot use screenshots of the catalog page as examples).

## 10. Import oral videos

**34. The animation segment is rendered according to "film duration + word-level time", and the key frames fall on the keywords.**
-Evidence: In a copy of a vertical screen video, two paragraphs in one chapter were replaced with animations (t3 financial chart talks about a set of numerical comparisons, y2 Vox pushed official screenshots of the original text), the frame number and the lens are exactly the same, and the error of 7 keywords is −0.48~+0.09 frames.
- Why: The animation only appears in places where the screen recording cannot explain clearly (a digital comparison, an official original sentence), and there are still real people and screen recordings before and after; the scene events are only revealed when he says the word, as if he is pointing and speaking.
- How to use: Give beat → Get the film duration and word-level time → Generate spec → Render → Freeze backfill (for the interface, see No. 09 "Fragment Contract"). Numbers only come from the provenance table, the source is written on the figure.

**35. Don’t add unnecessary narrative points for him.**
- Experience: Continuous accumulation of decorations on characters will steal the attention of the scene. The narrative plot should be confirmed in the sample first.
- How to use: The "what's missing" pointed out by the reviewer is information for his judgment, not my authorization to add things directly. If you want to add structural elements, show them to him in the sample or direction statement first, and wait for his nod.

## 2026-10-05 00:34:23 +0800 · The same broadcast syntax is assigned according to explanation tasks

Method: use the Vox data desktop to trace and highlight the real original post/sample, use 3b1b continuous object transformation for rules/control variables/sound-image relationship; fix the sound, subtitles and timeline before replacing the screen. Evidence: The 467.8 seconds of narration and 270 subtitles of a live broadcast film were reused after the entire set of style reconstruction. The final AAC original package hash of the two MP4 versions is consistent with the locked mix; there is no data retained after release. Why: The picture bears the explanation action of the corresponding paragraph, and the material serves the readability; the grammar allows for stillness after reading the picture or derivation, without the need for background decoration to increase the amount of movement. Suitable for: oral films that alternate between real materials and mechanical explanations.

## 11. A long time-travel film (Milo’s famous time-travel painting, 2026-10-05)

**36. A skeleton file + segment-by-segment parallelization, 24 worlds and 4 groups of agents can be put together at one time.**
- Evidence (the skeleton and 3 of the segments are included in `scripts/engine/demos/long_scroll/`, see No. 11 for the method): `lib/world.js` only defines the segment interface (width, ground line, walking frame, interaction at/dur/frame, back/front/seam), protagonist's march, protagonist cut according to the boundary, corner subscript; each of the four groups writes 6 segments, sorted by age and then assembled into 123.7 seconds at a time, qa certainty ✓, jump 0; The film reviewer checked all 23 boundaries for ground height and protagonist continuity. The key is that the unified constants for the entire film (ground line 760, height 300, pace) are written into the skeleton.
- How to use: For a feature film, write the skeleton and interface first, and then assign the group; in the interface, all events are scheduled relative to the "interaction start" (`WORLD.actT`, `item.atAct`), and do not write "the number of seconds after entering the segment" - the pace of the entire film was later increased from 330 to 560, and there was no need to change the time for any segment.

**37. Fine-tune the speed of each section so that the musical boundary falls on the first beat of the measure.**
- Evidence: 24 boundaries are fixed at all times, and the best single BPM difference is 112ms; after placing an integer number of beats in each section and fine-tuning the speed section by section between 86–104 BPM, all 24 boundaries fall on the first beat of the bar, with a maximum error of 11.7ms and an average of 3ms.
- How to use: The picture is determined first, and the music is matched later. The BPM is not forced to be unified; the human ear cannot hear the ±8% step-by-step speed difference, but it can be heard that the instrument is changed and the beat is not stepped on.

**38. The camera only advances but never retreats.**
- Evidence: During v1 interaction, the camera moves forward to make space and retracts at the end. A "rewind" of 68–256px appears in the 17/24 segment. It is not detectable by qa and can be seen at a glance when reviewing the film. After changing to "the target position takes the historical maximum value + Gaussian smoothing", the entire film regresses 0 times, and there is no pause when stopping or starting.
- How to use: Follow the horizontal roll of the protagonist, and monotonicize the camera position function; qa is better to add a "number of camera retreats".
