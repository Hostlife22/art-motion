# 09 · Video animation-grammars: 8 ways to draw YouTube commentary / technology / AI / financial films

Read this when doing the "animation segment" of the spoken commentary. It is a general catalog of 8 grammar cards (`references/animation-grammars/`), selection tables, cross-grammar rules, library quick checks, and fragment contracts for the narration pipeline.

Each of the 8 syntaxes has a demonstration film that can be directly rendered (`scripts/engine/demos/<grammar>/`, which is consistent with the experimental original film pixel by pixel when included; after fixing the transparency of `TY.charsIn` on 2026-10-05, the y1 demonstration film title fades out at 0.55s as intended, and the 0.55s frame is different from the original film) and parameterized clips (`scripts/engine/clips/<grammar>.js`, feeding a JSON will produce a video with an accurate duration).

---

## 1. Overview

| Grammar | Applicable scenarios | One sentence core grammar | Typical shot duration | Main easing | Main transition | Card | Demonstration |
|---|---|---|---|---|---|---|---|
| **y1 Kurzgesagt Flat Science** | Talk about scale, talk about "what's inside", and talk about mechanism systems; a eloquent science popularization style | Put abstract concepts into a luminous world that can be infinitely zoomed, the camera travels between scales, and the picture is always moving gently | Hard cut shot 7-9s, visual unit changes every 4.6-6.7s | `MO.k75`＝bezier(.75,0,.25,1); loop `MO.easyEase` | Drill into the lens `lensReveal`, fill it and pull it out `matchCut` (camera logarithmic push and pull) | `animation-grammars/y1_kurzgesagt.md` | `--film demos/y1_kurzgesagt` |
| **y2 Vox collage** | Arguments with real files, news, screenshots, and people; "look at this sentence" and "pay attention to this number" | The argument is placed on a table with real materials, the camera moves on the table like the eyes of an investigative reporter, and the lines and pens draw it one by one | Medium slow speed 3.3s (one card 3–7s); fast speed 1.4–1.8s | Camera `MO.sineInOut` / Long Tail `MO.longTail`; element 12fps stepping | hard cut, pan along the red line `same`, push full photo → hard cut `cut` | `animation-grammars/y2_vox.md` | `--film demos/y2_vox` |
| **y3 whiteboard hand-drawing (RSA)** | Reasoning chain, steps, "why"; derivation while talking | Say and write one sentence, the camera moves along with the argument on a large whiteboard, and finally zooms out to see the whole picture | Each block stays at the median 6.6s | Panning on the board `MO.sineInOut` 1.2–2.4s; Long jump 0.8s Lens shake + motion blur | The same board `same` (camera movement is the transition), the ending is zoomed out | `animation-grammars/y3_whiteboard.md` | `--film demos/y3_whiteboard` |
| **y4 story-type simple characters** | The first person tells about experiences, overturns, and laughter; what the audience wants is "this person" | The narrator is the protagonist, and the picture is the emoticon package for the narrator: pose 0.1s, fast cut and then freeze, the laugh point is to cut to the close-up of the reaction and shut up at that moment | ASL 2.43s (median 1.87s) | Change posture `MO.expoOut` 0.1s+`MO.settle` squeeze rebound; characters 24fps | hard cut `cut`, smash cut `smash`, whip-pan `whip`, close jump | `animation-grammars/y4_storytime.md` | `--film demos/y4_storytime` |
| **y5 dynamic text** | List, "X stages", golden sentences, digital opening, chapter cards | Words are actors: keywords are punctuated with accents, the main words are so big that they can be read at a glance, and the picture always has only one focus | One shot per section (120BPM about 2s) | `MO.expoOut` entry, `MO.springHz` entry, exit `MO.expoIn` faster | rush into the color block `fillZoom`, ribbon `bands`, push page `push` | `animation-grammars/y5_kinetic_type.md` | `--film demos/y5_kinetic_type` |
| **t1 3Blue1Brown** | Talk about how one mechanism turns into another thing step by step: network, matrix, gradient, probability | Put only the thing you are talking about on the black background, use Transform to directly change the previous concept into the next one, color = concept name, almost no cuts | Single animation 1–3s + pause 1s; one concept 8–20s | `MO.smooth` (6t⁵−15t⁴+10t³), almost all use it | Transform continuation (without cutting), camera travel `zoomThrough`, `fadeShift` | `animation-grammars/t1_3b1b.md` | `--film demos/t1_3b1b` |
| **t2 press conference interface** | Product/feature release, version update, tutorial steps, parameter announcement | One screen with dark light spots, one thing, the words emerge from the blur, the interface is loaded into the glass card and placed in place with a light rebound spring, and the transition unfolds on the same piece of glass | One screen for a speech 5–8s; product quick cutting 1.5–3s | `MO.spring` bounce 0–0.15, `MO.appleOut` | Blur advancement `blurPush`, card expansion `expandRect` | `animation-grammars/t2_keynote_ui.md` | `--film demos/t2_keynote_ui` |
| **t3 Financial Chart** | Revenue, stock price, share, turning point; viewers will take screenshots to see the truer numbers | Set up a coordinate system first, then let the data grow out, and finally mark only one thing; the values are always honest, the animation only determines how to appear | One picture 2.5–6s | `MO.quintOut`, broken line `MO.smooth` | Panel cross push `slidePush`, advance part `zoomThrough` (live + bScale0), hard cutting layout does not move | `animation-grammars/t3_finance_chart.md` | `--film demos/t3_finance_chart` |

Overview: `assets/animation-grammars/<grammar>_overview.jpg` (one frame per shot).

Demonstration command (under `scripts/`):

```sh
uv run --with playwright python engine/render.py --film demos/y1_kurzgesagt --out y1.mp4 # Render sample film
uv run scripts/qa.py --project scripts/engine --film demos/y1_kurzgesagt --out <directory> # Acceptance (run in skill root directory)
# Preview: Start a local service, open scripts/engine/index.html?film=demos/y1_kurzgesagt and drag the timeline
```

The duration of the demonstration films is reduced to about 8 seconds, which is 2.5-3 times the density of the real film, just to see the full grammar in the demonstration. When actually using it, slow down according to the shot duration in the table above.

---

## 2. How to select grammar for a section of broadcasting

First look at what the narration is doing, and then choose the painting method. A film can be divided into sections and the grammar can be changed, but the same section cannot be mixed.

| This narration is in... | Select | Don't select | Why |
|---|---|---|---|
| Talk about a concept and a mechanism ("How does a neural network...") | **t1 3b1b** (requires derivation and formula) or** y1 Kurzgesagt** (requires scale and cuteness) | y2 (no real material to paste, it will become a fake file) | The mechanism can be explained clearly by deformation and scale |
| Talking about news, events, history, with screenshots and original words | **y2 Vox** | y1 (flat cartoons dilute credibility) | The audience must see the source with their own eyes |
| Talk about your own experiences, overturns, and laughter | **y4 storytime** | t2 (the emotion of good news) | The laughter is in the pause of the reaction shot |
| Tell a list, a few key points, several stages, and a golden sentence | **y5 dynamic text** | t1 (no deformable objects) | Information is a structure, not a picture |
| Talk about products, tutorial steps, functions, parameters | **t2 press conference interface** (screenshots are put into glass cards) | t1 (glass and light spots do not carry logic, and vice versa) | One thing per screen, nouns and numbers are the protagonists |
| Talk about numbers, growth, trends, comparisons | **t3 financial charts** | The large number of t2 (use it when there is only one number) | The coordinate system and units must be able to be compared |
| Derivation while speaking, step-by-step demonstration | **y3 whiteboard** | Switch the whole screen at once | Say one sentence and write one sentence, and the final zoom is the landing point |

Two pockets:
- Have real screenshots to put → t2 (tutorial, clean) or y2 (argument, sense of evidence). Screenshots are always proportional and no key UI is cropped.
- There is only one number in a paragraph → Do not draw a chart, count with large numbers t2/y5, and settle the moment when the value is spoken.

---

## 3. General rules across grammars

The rules are extracted from 8 cards and are valid even in different grammars. Behind each item is the source.

1. **The camera is only determined by time, and the scene is redrawn according to the camera vector.**  Pushing, pulling, panning, and traveling are all the same world canvas redrawn under different cameras, so it is not blurry even when magnified 60 times. In the transition, the previous shot continues to push the camera according to time (`zoomThrough`'s `live:true`). (y1 ⑥ "Key Structure"; y3 ⑥; t1 ④-2)
2. **The scaling uses logarithmic interpolation, and the multiple must be sufficient to pass through the circular opening.**  `CAM.zlerp` makes each frame amplify by the same factor, and the linear interpolation will be slow and sharp; when passing through an opening with a radius r, the multiple is ≥ the distance from the center of the opening to the farthest corner of the screen / r (approximately 1100/r, `CAM.coverZoom` when centered). (y1 ⑧-2; t1 ④-2)
3. **Reveal the frame to align with the beat or spoken words.**  The transition is calculated from the starting point of the new segment, and the frame where the new picture is exposed must fall on the bar line: starting point of segment = bar line − reveal point × transition duration (`MO.onBeat`). The number should be settled when the value is spoken: starting point of counting = moment of saying the number − counting duration. The whiteboard starts writing about 0.5s later than the corresponding phrase. (y5 ④ "counterpoint skills"; t2 ⑤; t3 ⑤; y3 ⑤)
4. **Structure first, then data, and lastly annotation.**  The coordinate system comes out first, the data comes last, and the label lasts. Only one thing is marked in one shot; 3b1b is to write the question first and then demonstrate; the press conference is title → product name → subtitle. (t3 ③; t1 ⑤; t2 ③)
5. **One screen, one focus.**  Only one thing is allowed to enter the scene at the same time, and the rest are stationary; the ratio of main words and auxiliary sentences is at least 3:1; the saturation, contrast, and line width of the background are all one notch lower than that of the protagonist. (y5 ⑧-1; t2 ⑤; y4 ⑧-2)
6. **Enter slowly, exit quickly, and stop after settling down.**  It takes 0.3–0.4s to enter, and about 0.18s to exit; wait for at least 0.5s after the number is settled, and freeze for ≥0.9s after baggage. 3b1b waits for about 1s after each animation. (y5 ⑤; t3 ⑧-3; y4 ⑤; t1 ⑤)
7. **Choose continuous motion or quick cuts followed by holds according to the grammar.** In Kurzgesagt, completely still 0.5s intervals account for only 0.3%; in storytime, 70% of adjacent frames are identical and the energy comes from cuts and holds. (y1 ⑧-1; y4 ⑧-1)
8. **Two layers of frame rate: camera smoothing, element stepping.**  Vox camera smoothing, paper/highlighter/typing at 12fps, storytime characters at 24fps, lens at 60fps. The whole thing is as smooth as a corporate video, and the whole step will be swaying. (y2 ③, ⑧-1; y4 ③)
9. **Color = concept, less emphasis on color.**  Each color tells a concept (the W in the formula and the connecting line are both blue), and you cannot remember more than 3-4 semantic colors; Vox is black, paper white, and a kind of red, and the whiteboard is black plus an orange. (t1 ⑧-3; t3 ⑧-2; y2 ⑧-3; y3 ⑧-3)
10. **Transitions should be placed when breathing and changing topics, not in the middle of the sentence.**  The camera is cut between two sentences, and the reaction shot is placed in silence; the whiteboard is panned to add new arguments; Vox cuts to stop reading the sentence. (y4 ⑤; y3 ⑤; y2 ④)
11. **When reviewing a film, you need to check the logic and numerical standards, not just whether it looks good or not.**  What has been captured in actual measurements: "Increased by 8.7 times" should be "increased by 8.7 times of the original"; after expanding to full screen, it counts from 0; the hidden layer is connected to the pixels; the multiple must be calculated from the numbers on the picture. (t3 revision table; t2 revision table; t1 ⑥)
12. **Real material remains as is.**  The screenshots are scaled and the key UI is not cropped; the data only changes "how it appears" and not "how much" it is; columns always start from 0, and if the axis does not start from 0, it must be clearly stated; each frame of fictitious data is labeled "indicative data", and this corner label is not allowed to appear in real data. (t3 ②, ⑧-1; fragment contract)

---

## 4. Library quick check (`scripts/engine/lib/`, index.html and clip.html have been loaded)

| File | Namespace | What's there |
|---|---|---|
| `motion.js` | `MO` | `seg/at/anim/step` (12fps stepping), manim `smooth/thereAndBack/rushInto/rushFrom/doubleSmooth/wiggle/lagged`, `sineInOut/cubic*/quart/quint/expo*/backOut/elasticOut`, `bezier` and `appleOut/emphasized/k75/easyEase/longTail`, SwiftUI `spring/smoothSpring/snappy/bouncy`, `springHz/settle`, `float`, `invert` (slow motion reverse check), `beat/onBeat` (time signature alignment); `U.setStage/onStage` (canvas size) |
| `camera.js` | `CAM` | `apply/with`, `toScreen/toWorld`, `zlerp` (logarithmic scaling), `coverZoom`, `anchor`, `pushTo` (advance a point and move the point smoothly to the center or zoom in place), `at` (key frame, pan along the path), `layer` (parallax), `velocity/motionBlur` (motion blur), `drift` (handheld micro drift) |
| `diagram.js` | `DG` | Dot list `cum/len/pointAt/drawPartial` (stroke by stroke)/`xform/arcPts/ellipsePts/hand` (hand-painted dithering)/`revealMask/zigzag` (Reveal revealed), Transform `rectPts/circlePts/morph/shape`, color `mix/mixA/rgba`, 3b1b color plate `MANIM` (×1.5 Saturation)/`saturate`, `math/write` (manim Write, stroke first and then fill in color), `neuron/edgeEnds/edge/flash`, `indicate/circumscribe/brace`, whiteboard `board` (stroke timeline + slippage between pens), `pen` (marker pen) |
| `typo.js` | `TY` | `text/width/font`, `wrap/fit` (line breaks; `fit` reduces the font size to fit: the number of lines ≤ maxLines and exceeds the width of each line, and a single long English word does not go out of the frame; `soft:true` cannot fit and returns `ok:false` Let you change the plan, `balance:true` Fold multiple lines into equal lengths), `charsIn` (float verbatim), `rise` (mask rise), `pop`, `blurIn` (float from blur), `typed/typedCount` (typing), `marker/underline`, `slam` (subject word smashing), `keyword/keywordMarker` (keyword emphasis), `fmt/count/tabular` (number scrolling and constant-width numbers) |
| `chart.js` | `CH` | `lin/ticks`, `grid/xLabels` (coordinate system comes out first), `bars` (grow out from 0 + synchronous counting + highlight turns gray), `line/yAt`, `candles`, `callout` (point → lead → text), `tag/demoBadge/frame` (Economist layout) |
| `ui.js` | `UI` | `mesh` (spot bottom), `grainTex`, `backdrop`, `shadow`, `glass` (frosted glass card), `sheen` (light sweep), `persp` (pseudo 3D), `icon`, `rr/rrPath/scratch` |
| `collage.js` | `CL` | `paperTile/fillPaper` (paper texture), `tornEdge/tornRect` (torn edge), `halftone/photo` (dot photo), `placed/shadowed/slideIn` (tilt and slide in flat), `tape/pin`, `stringPts/string` (red line), `highlight` (raw edge highlighter), `stickerEdge` (paper cut white edge) |
| `toon.js` | `TOON` | `flat` (two-color facet), `glow/vgrad/circle/ellipse`, `bean` (bean Milo) and `POSES`, `poseAt` (pose-to-pose + rebound), `blinkAt`, `alive`, `env/mouth` (mouth shape reading envelope), `sweat/mark` |

The transitions are in the section "Transitions of YouTube explanation syntax" at the end of `transitions.js`: `same / lensReveal / matchCut / whip / smash / fillZoom / bands / push / zoomThrough / blurPush / expandRect / slidePush / fadeShift`, each has a description and parameters. Use the original `cut` for hard cutting.

Small changes related to the engine: segments can be written as `dur` (seconds) instead of `eighths`; `window.BPM` changes the beat; commentary can be written as `window.PUNCH = 0` to turn off beat impact (or a single transition can be written as `punch`); `window.SCENE_LIBS / SCENE_DIR` allows a film to put the code in its own directory (this is how demos are organized).

**Old name during experiment → Current name** (check when reading the experiment archive code): `YT.camAt→CAM.at`, `YT.camForAnchor→CAM.anchor`, `YT.apply/camera→CAM.apply/with` (camera field `zoom/rot` changed to `z/r`), `YT.ease.*→MO.*`, `YT.spring(t,f,d)→MO.springHz`, `YT.textIn→TY.charsIn`, `YT.type→TY.typed`, `YT.partial→DG.drawPartial`, `YT.at→DG.pointAt`, `YT.circlePts→DG.ellipsePts`, `YT.paperTile/halftone/tornEdge→CL.*`, `YT.bean/POSES/mouth→TOON.*`, `MN.*→DG.*` (`lerpPts→morph`, `C→MANIM`, `FONT_RM→FONT.rm`), `GL.*→UI.*`, `MO.textIn→TY.blurIn`, `MO.count/fmt/tabular→TY.*`, `easeOutQuint/easeOutExpo→quintOut/expoOut`, transition `k_lens→lensReveal`, `k_fill→matchCut`, `hardcut→cut`, y5’s `zoomThrough→fillZoom` (colliding name with 3b1b’s lens travel).

Fonts in the English edition: `PuHui-Medium/Bold/Heavy/Black` are compatibility aliases for bundled Inter at weights 500/700/800/900; `LXGWWenKai-500` uses Caveat for whiteboard lettering. `NotoSansSC` maps to Inter, `NotoSerifSC` to Libre Baskerville, and `NotoSerifJP-600` to EB Garamond. Use `CMU-rm/it` for formulas, `Inter` for keynote UI, and `RobotoCondensed` for finance figures. The aliases keep existing scene code compatible; see `lib/fonts.js`.

---

## 5. Segment contract (for the "animation segment" of the narration pipeline)

The spoken video pipeline (no matter which set you use) calls these 8 syntaxes in the appropriate paragraphs to create animation segments. The pipeline director selects the grammar and calculates the cue from the spoken word-level timestamp. This section is an agreement between both parties.

### Entrance

**It is recommended to include a layer of scripts in the narration pipeline, do not type the following by hand**: draft determines the duration from the film timeline, produces word lists and spec drafts → render parses the word, adjusts render.py of this section, counts frames, switches to the editing project, freezes → verify and synchronizes the chapters frame by frame. This is how the author's own pipeline is connected (that part is not open sourced with this repository). Below is the interface to the engine itself.

```sh
cd <skill>/scripts
uv run --with playwright python engine/render.py --spec clip.json --out clip.mp4 # Silent H.264 yuv420p
uv run --with playwright python engine/render.py --spec clip.json --alpha --out clip.mov # ProRes 4444 with transparency (no background, overlay for pipeline)
uv run --with playwright python engine/render.py --spec clip.json --stills 0.5,2,4 --out still frame/ # Frame check
# Preview: Open local service scripts/engine/clip.html?spec=examples/t3_finance_chart.json Drag the timeline
```

- The duration is strictly equal to `duration`: number of frames = round(duration × fps), and the time of the i-th frame is i / fps. H.264 One keyframe per second (GOP = fps), the pipeline's renderer seeks per second without freezing frames.
- Width, height and fps are read from spec, the default is 1920×1080@30; vertical screen is written as `width: 1080, height: 1920`, each syntax has vertical screen typesetting.
- The image path in spec is relative to the spec file (you can also write an absolute path); render.py only serves the files named in spec.
- Measure this section: `uv run qa.py --spec <clip.json>` (under `scripts/`; the entire section is used as a section to measure certainty, motion, still frame pairs, isolated jumps, time consumption, vertical screen is reduced according to the frame size).
- A page error, such as a syntax failure or missing image, makes rendering exit with a nonzero status. Unsupported glyphs trigger warnings and may fall back to a system font. Use the bundled Latin fonts for English captions and check the rendered frames for clipping.

### spec

```jsonc
{
  "grammar": "t3_finance_chart", // Choose 1 from 8: t1_3b1b | t2_keynote_ui | t3_finance_chart | y1_kurzgesagt | y2_vox | y3_whiteboard | y4_storytime | y5_kinetic_type
  "duration": 7, "fps": 30, "width": 1920, "height": 1080,
  "safe": { "top": 0, "bottom": 520 }, // Optional: side to get out of the way (px), see below
  "alpha": false, // Optional: true = do not draw the background (render.py --alpha will be set automatically)
  "data": { ... }, // Syntax-level parameters. The fields recognized by each syntax are shown in the "data" line of each section below; fields that are not recognized are ignored directly.
  "cues": [ { "at": 1.2, "kind": "bar", "text": "...", "sub": "...", "data": { ... }, "image": "screenshot.png", "dur": 1.0 } ]
}
```

**Public fields for cue** (see the sections below for what each syntax recognizes):

| Field | Meaning |
|---|---|
| `at` | Seconds, required. "Uncover that frame": The element is first visible at the frame t = at (the animation starts from the frame before at). Exception: at in `number` is the moment when the number **settled**. Cues do not need to be sorted by time, clip.js will sort them; cues whose at exceeds the duration will be discarded after warning (cannot be seen, and do not occupy the layout). |
| `kind` | Required. **Writing this kind without recognizing the grammar, no error will be reported, and nothing will be drawn** - Write to the table below. |
| `text` | Main text: title, bullet points, labels, bubble text, and large characters inserted into the lens. |
| `sub` | Auxiliary text: t2 card description, y5 auxiliary sentence, y4 the short sentence actually displayed in the bubble, y4 inserting the line he typed in the camera. |
| `image` | Picture path, relative to spec file (absolute path, `data:`, `http(s):` can also be written). File does not exist → refuse to render. |
| `data` | This cue's own parameters (`index`, `rect`, `icon`...), see each section. |
| `dur` | There are only a few kind reads: title/point/equation/line for t1, bar/line/candle for t3, enter for y1, react/insert for y4. Other kinds cannot be read even if they are written. |

**`safe`**: `{top, bottom, left, right, fill?}` (px, default 0). clip.js passes it and the moved content box `ctx.box = {x, y, w, h}` to the syntax; `fill` is an optional color, and the moved side is painted with it after rendering (in the vertical screen, the chart becomes a "card" in the same position and with the same background as the adjacent contain screenshot; `--alpha` is not painted).** 8 syntaxes have been connected to `top` / `bottom`** (`safe: true` is written in the syntax object, and the content is only arranged between top..H-bottom: the coordinate system and source line of t3, the camera zoom and screen center of y2, the layout of t1/t2/y1/y3/y5, the bubble and inserted lens font of y4);** `left` / `right` Currently, there is no grammar that can be typed according to it**. If you write it, it will only be colored by `fill`, and the content will still be pushed to the side. Vertical screen 1080×1920 oral film subtitles are approximately 1400–1520, `bottom` takes 490–570; horizontal screen generally `bottom` 160–220. The new syntax must be connected to safe, as per t3: add `safe.top` to the vertical reference of the layout, and subtract `safe.bottom` for the bottom element, or arrange directly according to `ctx.box`, and then write `safe: true` in the syntax object (clip.js will console.warn when the spec is set to safe without writing it).

**`number` (large number) caliber**——Only t2, t3, and y5 are recognized, and the other 5 types will not be displayed if written:

| Item | Regulations |
|---|---|
| Numeric value | `data.value` (number, can be negative; if not written, it is regarded as 0). Roll from 0 to value (expoOut, first fast and then slow), use the true minus sign "−" for negative numbers, and the integer part will automatically add the thousandth place. |
| Format | `data.prefix` (such as `"¥"`), `data.suffix` (such as `"%"`, `" times"`, you need to write the spaces yourself), `data.decimals` (default **0**; `spec.data.decimals` of t3 only controls the column label,** number does not inherit**, if you want a decimal, write it again in the cue). |
| Description | You can write any one of `text`, `sub`, and `data.text`. clip.js unifies the three. |
| Small label | `data.label`: t2 is drawn above the number, y5 is drawn on the upper left side of the page; t3 is not drawn. |
| Time | `at` = The moment when the numbers settle. t2 and t3 start rolling at at-0.9s; y5 changes pages and starts rolling at at-0.7s. Therefore, the at of number must be at least 0.9 (y5 0.7), otherwise the 0th frame will have rolled more than half way. |
| Position | t2: A separate screen, the previous screen begins to exit at −0.9s, and is not stacked on the card; t3: A special strip above the picture area, right-aligned, with instructions to the left of the numbers; y5: A separate page. |

### Cues recognized by each language

The first line of each section below is spec level `data`, and the inside and outside are cue. "Minimum spec" is the minimum writing method that can render a decent picture. You can copy it and change the wording.

#### t1_3b1b (3b1b / manim explanation: formulas, curves, key points)

spec-level data: None.

| kind | field | description | example |
|---|---|---|---|
| `title` | `text`, `data.color`, `dur` | at Write; when there is another title, the old title will move up and fade out; if it is too long, reduce the font size and fold it into two lines | `{"at":0,"kind":"title","text":"Attention is the weighted average"}` |
| `equation` | `data.tokens` or `text`, `dur` (the first 1.2s, then 1.5s) | token: `{s, it?, col?, gap?, sub?, sup?, size?}`, `col` write manim color name (`BLUE_C` `YELLOW` `GREEN_C` `TEAL_C` `RED_C`…) or #hex. When only text is given, it will be automatically separated into: single letter italics, continuous letters (softmax) regular font. The second one comes from the previous Transform | `{"at":1,"kind":"equation","text":"softmax(QK)V"}` |
| `point` | `text`, `dur` | Write sentence by line, the old one will be grayed out when the new one comes out. When it cannot be placed, first let the curve give way (vertical screen 50% → 30%), and then reduce the font size (≥0.6 times). If it is not enough, when the new point comes out, the whole block will be scrolled up, and the earliest one will fade out (an alarm will occur) | `{"at":3,"kind":"point","text":"Calculate the similarity first"}` |
| `line` | `data.values` (equal distance y) or `data.points` (`[[x,y],…]`), `text` = curve label, `data.color`, `dur` | Coordinate system Create first and then draw the curve; the second one is transformed from the previous one. When there is a line, the left text and right picture will appear on the horizontal screen, and the top and bottom pictures on the vertical screen | `{"at":2,"kind":"line","text":"loss","data":{"values":[9,5,3,2,1.5]}}` |
| `highlight` | `data.index` (point number, starting from 0, default is latest) or `data.target:"equation"` | Indicate+yellow box to keep | `{"at":5,"kind":"highlight","data":{"index":0}}` |

Minimum spec:
```json
{"grammar":"t1_3b1b","duration":6,"cues":[
  {"at":0,"kind":"title","text":"Attention is a weighted average"},
  {"at":1.2,"kind":"equation","text":"softmax(QK)V"},
  {"at":3,"kind":"point","text":"First calculate how similar each word is to me"},
  {"at":4.2,"kind":"point","text":"Add the information according to the degree of the image"}]}
```

#### t2_keynote_ui (press conference interface: function card, screenshot card, large numbers)

spec-level data: `eyebrow` (small text above the title), `title`, `subtitle`, `accent` (accent color, default `#3d6bff`).

| kind | field | description | example |
|---|---|---|---|
| `title` | `text`/`sub` overwrites data.title/subtitle | emerging from the blur at | `{"at":0,"kind":"title"}` |
| `card` / `step` / `image` (synonymous) | `text` card title, `sub` description, `image` screenshot; `data.step` specified number; if there is no picture card, you can add `data.icon` (`wave memory agent clock phone layers chart code check play bolt lock`), `data.value/prefix/suffix/decimals/label` (count on the card) | If there is a picture: one for each screen, screenshots are proportional contain; no picture: up to 3 consecutive pictures side by side on one screen | `{"at":2,"kind":"card","text":"Picture in one sentence","sub":"No need to write prompt words","data":{"icon":"bolt"}}` |
| `highlight` | `data.rect=[x,y,w,h]` (relative screenshot 0..1), `text` optional label | Frame a piece of the current screenshot card and darken the rest | `{"at":5,"kind":"highlight","data":{"rect":[0.6,0.2,0.2,0.1]}}` |
| `number` | See above number caliber | Single screen | `{"at":4,"kind":"number","text":"Monthly active users","data":{"value":1.2,"decimals":1,"suffix":"billion"}}` |

Minimum spec:
```json
{"grammar":"t2_keynote_ui","duration":6,"data":{"title":"Three new functions"},"cues":[
  {"at":0,"kind":"title"},
  {"at":1.8,"kind":"card","text":"Voice input","sub":"Convert to text after speaking","data":{"icon":"wave"}},
  {"at":2.6,"kind":"card","text":"Long-term memory","sub":"Remember what you said last time","data":{"icon":"memory"}},
  {"at":3.4,"kind":"card","text":"Automatically execute","sub":"Click the remaining buttons for you","data":{"icon":"agent"}}]}
```

#### t3_finance_chart (Economist-style data chart)

spec-level data: `title`, `unit` (subtitle: Indicators and units; shrink and then fold two lines if it cannot fit), `source` (source in the lower left; same as above, and let go of the lower right subscript), `badge?` (only draw the lower right subscript if written, such as "indicated data"; do not write real data), `chart: "bar"|"line"|"candle"`, `series: [{label, value, color?}]` or K-line `[{label, o, h, l, c}]`, `decimals` (bar/point label, default 1), `prefix`, `suffix`, `highlight: {index, text, sub}`, `colors: {main, accent, dim}`, `upDown: "cn"` (red rises and green falls, default) `|"us"`, `xAxis: "category"|"time"` (bars are named by category by default, polylines/K lines are thinned by time by default).

| kind | field | description | example |
|---|---|---|---|
| `title` | — | Format first (title, subtitle, source) | `{"at":0,"kind":"title"}` |
| `bar` / `line` / `candle` | `dur` (default is based on the number of bars); the histogram can write multiple bars, each with `data.index` (number or array) = these bars only grow at this moment | Coordinate system → data grows. The columns always start from 0; when the vertical axis of the polyline/K line does not start from 0, the subtitle automatically adds "The vertical axis does not start from 0"; the value of the negative column is written below the bottom of the column, and the label goes downwards; if the category name cannot be placed, it is abbreviated and then misaligned into two lines, and the labeled column always has a name; the scale uses decimal places according to the step size | `{"at":1.2,"kind":"bar"}` |
| `highlight` | `text`/`sub` covers data.highlight, which number is `data.index` | at This frame mark dot pops up, lead + text; when placing it diagonally will press other columns or values, place it directly above this one. If the top is not enough, a scale will be automatically added | `{"at":4,"kind":"highlight","data":{"index":2},"text":"highest"}` |
| `number` | See the number caliber above | Leave a special line at the top of the chart area, do not press the polyline line | `{"at":5,"kind":"number","text":"Latest closing","data":{"value":259.97,"prefix":"¥","decimals":2}}` |

Minimum spec:
```json
{"grammar":"t3_finance_chart","duration":6,"data":{"title":"R&D investment of three companies","unit":"2024, 100 million yuan","source":"Source: Indicative data","badge":"Indicative data","chart":"bar",
  "series":[{"label":"A","value":120},{"label":"B","value":86},{"label":"C","value":43}]},"cues":[
  {"at":0,"kind":"title"},{"at":1,"kind":"bar"},{"at":3.5,"kind":"highlight","data":{"index":0},"text":"most"}]}
```

#### y1_kurzgesagt (Flat science popularization: planet + satellite node + scale travel)

spec-level data: `center` (the name of the first-level central planet), `flow: true` (nodes are strung into a chain, signals flow through in sequence, with serial numbers, used when talking about "sequence").

| kind | field | description | example |
|---|---|---|---|
| `title` | `text` | The top title floats up word by word; the first highlight or enter fades out in 0.5s starting from at | `{"at":0,"kind":"title","text":"What happened in a search"}` |
| `point` | `text`, `data.color` | A satellite node + label capsule of the current layer. ≤3 rows in half a circle, ≥4 rows in a full circle. The label is clamped into the picture according to the current lens, and long labels are abbreviated first | `{"at":1.4,"kind":"point","text":"participle"}` |
| `highlight` | `data.index` (only the points of the current layer are counted, starting from 0, the default is the latest) | The camera pushes closer to that node, and the rest becomes darker, and the push is completed in 1.2s | `{"at":5,"kind":"highlight","data":{"index":1}}` |
| `enter` | `data.index` (Which node to drill into, the default is the latest), `text` (the name of the new center, the node name is used by default), `dur` (default 1.6) | Scale travel: at This frame starts to advance, about at+0.55×dur The screen is full of the same color, cut to a new layer, at+dur The new center planet is pulled out; subsequent points They all belong to a new layer (the at of the first new point is written after at+dur) | `{"at":4,"kind":"enter","data":{"index":0},"text":"Word Breaker"}` |

Minimum spec:
```json
{"grammar":"y1_kurzgesagt","duration":6,"data":{"center":"search engine","flow":true},"cues":[
  {"at":0,"kind":"title","text":"What happened during a search"},
  {"at":1.2,"kind":"point","text":"crawl"},{"at":2,"kind":"point","text":"index"},{"at":2.8,"kind":"point","text":"sort"},
  {"at":4.2,"kind":"highlight","data":{"index":2}}]}
```

#### y2_vox (collage desktop: screenshots, newspaper clippings, red lines, highlighters)

spec-level data: None.

| kind | field | description | example |
|---|---|---|---|
| `image` / `clip` (synonymous) | `image`, `text` = black background label below, `data.halftone: true` converted to grayscale dots | at and slide into the desktop; put in equal proportions, not cut, add white edges of paper and tape. Horizontal screen left → right row, vertical screen top → bottom row, connected by red lines | `{"at":1,"kind":"image","image":"screenshot.png","text":"official website homepage"}` |
| `title` | `text` (empty or pure spaces will alert and skip) | White label strip with black background, typing 13 words/second | `{"at":0,"kind":"title","text":"There are three clues to this matter"}` |
| `point` | `text` | Horizontal index card, typing (shorter interval will speed up to up to 40 words/second) | `{"at":4,"kind":"point","text":"The release time is one day earlier than the announcement"}` |
| `highlight` | `data.rect=[x,y,w,h]` (relative to **current picture** 0..1) | Sweep the highlighter → red circle → push the camera closer. rect is usually 20–30% off by visual inspection, first check `--stills` | `{"at":2.5,"kind":"highlight","data":{"rect":[0.1,0.2,0.3,0.1]}}` |

Minimum spec (can be used without screenshots: title + index card):
```json
{"grammar":"y2_vox","duration":6,"cues":[
  {"at":0,"kind":"title","text":"Three clues to this price increase"},
  {"at":1.6,"kind":"point","text":"The supplier sent a notice first"},
  {"at":3.4,"kind":"point","text":"The official website changed the price two weeks later"}]}
```

#### y3_whiteboard (whiteboard hand-drawing: say and write a sentence, draw icons, circle key points)

spec-level data: None.

| kind | field | description | example |
|---|---|---|---|
| `title` | `text` | Starting from 7.5 words/second, it can’t catch up with the next cue and automatically speed up | `{"at":0,"kind":"title","text":"Why write a test"}` |
| `point` | `text` | First draw small circles as bullet points and then write, starting from 16 words/second | `{"at":1.5,"kind":"point","text":"Someone will keep an eye on you when you change the code"}` |
| `draw` | `data.icon` (`person cat network doc chat bulb check cross screen stack gear target clock chart`; if you write it wrong, you will get an alarm, just write the description), `text` = the description under the icon (reducing the font size if it cannot fit), `data.arrow: false` does not draw an arrow | Side by side with the word just written; continuous draws are connected with orange arrows | `{"at":2.5,"kind":"draw","text":"automatic check","data":{"icon":"check"}}` |
| `image` | `image` | Zigzag uncovered + hand-painted frame, not cut to equal proportions | `{"at":4,"kind":"image","image":"sketch.png"}` |
| `highlight` | `data.index` (number, starting from 0), `data.target`: `"title"` / `"draw"` / `"image"` (default point), `data.style: "underline"` | Orange circle or underline; do not write index = the latest one written | `{"at":5,"kind":"highlight","data":{"index":0,"style":"underline"}}` |

Minimum spec:
```json
{"grammar":"y3_whiteboard","duration":6,"cues":[
  {"at":0,"kind":"title","text":"Why write tests"},
  {"at":1.5,"kind":"point","text":"Someone will keep an eye on you when you change the code"},
  {"at":2.7,"kind":"draw","text":"automatic check","data":{"icon":"check"}},
  {"at":4.4,"kind":"highlight","data":{"index":0}}]}
```

#### y4_storytime (Douzi Milo tells stories: bubbles, reaction close-ups, inserted shots)

Spec-level data: None (if `window.VO_ENV` is present, the lip sync will be broadcast based on the envelope envelope; if not, it will be synthesized based on the number of words). safe only allows words (bubbles, large letters inserted into the lens); characters, tables, and reaction close-up faces are graphics, which will extend into the subtitle strips in vertical screen mode - the subtitles can be read clearly when pressed against the body, but don't expect them to get out of the way.

| kind | field | description | example |
|---|---|---|---|
| `point` / `title` (synonymous) | `text` = original spoken text (fixed mouth opening time, ≈6.5 words/second), `sub` = short sentence actually displayed in the bubble (≤12 words is best; text will be displayed without writing), `data.pose`: `talk` / `point` / `shrug` / `type` | at In this frame, the bubble pops up and the mouth begins to open | `{"at":0.1,"kind":"point","text":"I asked him to help me correct a typo,","sub":"Just change one word"}` |
| `highlight` | `data.mark` (default "?") | "?" "!" pops up + worry about it | `{"at":4,"kind":"highlight","data":{"mark":"!"}}` |
| `react` | `dur` (counting from at, default to next cue) | Jump to reaction close-up: dead fish eyes + sweat drops, without saying a word | `{"at":3,"kind":"react"}` |
| `insert` | `sub`=The line he typed on the computer (long line breaks, up to 3 lines), `text`=The big characters smashed out, `data.hit` (**absolute seconds**, default at+1.3, when there is no sub at+0.4), `data.count`+`data.unit` (the counter on the upper right stops at this number when smashing out), `data.app` (window title, defaults to "AI Assistant"), `dur` (counting from at, defaults to the next cue) | Cut to a close-up of the desktop computer screen: typing → reply like a code wall rolling faster and faster → big characters are smashed out | `{"at":2,"kind":"insert","sub":"Changed a typo","text":"Changed 40 files","data":{"hit":3.4}}` |

Minimum spec:
```json
{"grammar":"y4_storytime","duration":6,"cues":[
  {"at":0.1,"kind":"point","text":"I asked him to help me correct a typo,","sub":"Just change one word"},
  {"at":2,"kind":"insert","sub":"Changed one word","text":"Changed 40 files","data":{"hit":3.4}},
  {"at":4.4,"kind":"react"}]}
```

#### y5_kinetic_type (dynamic text: one cue per page)

spec-level data: `palette: [[background color, text color], …]` (rotate by page).

| kind | field | description | example |
|---|---|---|---|
| `title` / `point` | `text` main word (too long, automatic abbreviation, up to two lines), `sub` auxiliary sentence, `data.label` (small label on the upper left), `data.key` (the word to be colored in the auxiliary sentence), `data.num` (background giant serial number) | The main word comes in at the frame, and the page change is the ribbon erasure (at Starting from the first 0.3s). Two or more point = list: drawing progress track + background giant serial number | `{"at":1.8,"kind":"point","text":"slow","sub":"only change one point at a time","data":{"label":"01","key":"one point"}}` |
| `number` | See above number caliber | One page of large numbers | `{"at":4,"kind":"number","sub":"proportion of one run through","data":{"value":87.5,"decimals":1,"suffix":"%"}}` |
| `highlight` | `data.word` (words in the subject; if not given, brush the entire subject) | Highlighter + zoom in; when the highlighter and the words are of the same color (dark blue with yellow characters on the page), the words under the pen will turn white into the background color. If word is not in the main word, it will alert and do nothing (use `data.key` for the word in the auxiliary sentence) | `{"at":3,"kind":"highlight","data":{"word":"slow"}}` |

Minimum spec:
```json
{"grammar":"y5_kinetic_type","duration":5,"cues":[
  {"at":0,"kind":"title","text":"Slow is fast"},
  {"at":1.8,"kind":"point","text":"Slow","sub":"Only change one point at a time","data":{"key":"One point"}},
  {"at":3.3,"kind":"point","text":"Quick","sub":"Run it in one go","data":{"key":"Run it"}}]}
```

### Sample (`scripts/engine/examples/`)

```sh
cd <skill>/scripts
uv run --with playwright python engine/render.py --spec engine/examples/t3_finance_chart.json --out t3.mp4 # Nvidia's five fiscal year revenue (10-K real data, no schematics)
uv run --with playwright python engine/render.py --spec engine/examples/t2_keynote_ui.json --out t2.mp4 # Tutorial: Put two screenshots into the glass card + frame out the timeline
uv run --with playwright python engine/render.py --spec engine/examples/t1_3b1b.json --out t1.mp4 # Gradient descent: formula + loss curve + three key points
uv run --with playwright python engine/render.py --spec engine/examples/y2_vox.json --out y2.mp4 # Horizontal image + vertical image posted on the desktop, highlighter + red circle + push closer to the final closing price
uv run --with playwright python engine/render.py --spec engine/examples/y3_whiteboard.json --out y3.mp4 # Whiteboard: title + three key points + circle key points + reveal screenshot
# There is also y1_kurzgesagt / y4_storytime / y5_kinetic_type.json; the sample materials are in examples/assets/, which are the final frames rendered by t3 itself (numbers have been settled, no playback bar, no path)
```

### Reminder to pipeline directors

- Don’t put too many cues into an animation: According to the length of the first section, it is most comfortable to put 2-5 cues in a clip of 3-8 seconds; if the cues are too dense, the writing will be forced to speed up and the camera will not be able to get in time.
- The syntax (t1/t3/y3/y5) with words in the screen will compete with the burning subtitles in the pipeline. When overlaying, move the subtitles away or this section will not be burned.
- Transparent mode (`--alpha`) only removes the background layer, and the shadow of the element itself is still there; the paper piece of y2 and the glass card of t2 are read as "cards floating on the screen" on the transparent bottom. T3 has black text on white paper, with a white halo on the transparent bottom, and can be read clearly even on a dark screen; t1 has white text with a dark halo.
- **Post a screenshot in a vertical screen, and frame the part of the sentence you are thinking about.**  A screenshot on a portrait desktop is about 900px wide, and the 16px text on the webpage needs to be zoomed in 2–2.5 times to see it clearly; when the entire wide text is framed (the frame width is close to the picture width), the red circle cannot fit, and the camera cannot be pushed in. A sentence spanning two lines is split into two highlights, each corresponding to a keyword (actual measurement on 2026-10-04: after splitting, it is pushed closer to 2.4 times, and the character height is about 50px). The visual inspection of rect often deviates by 20–30%, so first render a kernel of `--stills`.
- **The step animation in the grammar file should start from at.**  If steps such as "one beat two" are rounded according to the absolute time grid (`MO.step(t, 12)`), the element will be exposed at most one frame earlier than at (2 frames earlier at 30fps). Written as `MO.step(t − at, 12)`, at this frame is the first frame. The characters frame of y4 is still taken at absolute 24fps, and the cue placement point may be 1 frame different, so check it before use.

---

## 6. Return (2026-10-04 when included in skill)

| Object | Result |
|---|---|
| 16 original clips (`eras.js`), 36 full-style sample clips (`--film gallery`) | 61 frames at the same time before and after the change are consistent pixel by pixel; qa is all error-free, deterministic ✓, the motion/jump numbers remain unchanged, and the time consumption is 21.5 → 22.3 ms/frame (within noise) |
| 8 demo films vs. experimental original films | The 16 moments of each film (including transition windows) are consistent pixel by pixel; all 25 qa segments are error-free and deterministic ✓; the movement, jump, and time consumption are consistent with the original project (the starting point of the first segment of each segment changes from 8/16s to 0, and the qa sampling window is different, so the first segment numbers are slightly different) |
| 2026-10-05 After the final review and repair | 8 samples + 16 original paragraphs + 36 samples + 8 demonstration films, a total of 87 paragraphs qa All certainty ✓, no page error; the sample still frame only has the expected changes (t2 difference of 1 color level = modified certainty, y5 dark blue page keywords changed to orange, y1 title really faded out); independent final review 36 Spec (horizontal sample, vertical screen, pressure, border, alpha) None 🔴 |
| Known jump transitions | y1_s3 (42x → 1x pull out the middle), y2_s2/s3 (quick pan and push full photo), t1_s3 (penetrating neurons), y5 beat accent - all are designed camera push-pull or beat flash, which are included in the original film |

---

## 7. Traps that have been stepped on

- ** (2026-10-04 Actual measurement of access to the narration pipeline) After y2 is pushed closer, the next frame is outside the picture, and the highlighter is scanned outside the picture.**  Audiences saw this 7 frames later. Changed: When the starting point of the frame is not in the current lens, the lens first moves over, at the previous frame, and then opens; the zoom-in ratio is also constrained by "the red circle stays in the painting" (the red circle is 1.24 times wider and 1.5 times higher than the frame).
- ** (2026-10-04 Parametric Clip Review) The t3 scale lies, the categories have no names, and the big numbers are cluttered.**  `fmtTick` only leaves decimals when the step size is <1. When the step size is 2.5, −2.5/2.5/7.5 is printed as −3/3/8; the 10 category columns are thinned out by `ceil(n/6)` in the vertical screen, and the marked "first" happens to have no name; the number is fixed in the upper right corner of the chart area, and the rising polyline head is right there. All three places have been changed (see line t3 in Section 5).
- ** (Same as above) y2 The text card left before the camera was finished.**  at−0.95 with the camera looking away only at the next item. Now press "End Typing + Stop 0.5s" before starting (at −0.4 at the latest). The short interval will increase the typing speed from 13 words/second to a maximum of 40 words/second.
- ** (Same as above) The full-width space font width of Inclusive body Medium/Bold is 0.**  The source font (65/85 two font weights of Alibaba PuHui 3.0) itself is 0, and "USD vertical axis does not start from 0" is stuck together. `font_subset.py` is automatically set to the same width as "one" when extracting subsets; existing files have been modified with `--fix-widths`.
- ** (Same as above) The mark of t3 vertical screen falls exactly on the burned subtitle tape.**  The bottom of the vertical chart is at y≈1660, the annotation is at y≈1460, and overlaps with the subtitles (1400–1520) of the 1080×1920 film. Added `safe`.

- ** (2026-10-05 Parametric Fragment Final Review) Everything is written correctly as shown in the example, but the painting works when it is changed to vertical screen and real length.**  Independent final review of 33 specs (horizontal screen samples, self-written vertical screen, pressure, border, alpha) found 12 items 🔴: y2 empty text makes the renderer stuck in an infinite loop; y5 dark blue page highlighter and yellow text of the same color obliterate the main words, and vertical screen long numbers are drawn; t1 vertical screen 7 key points are pressed into the subtitle strip; t3 The vertical screen subtitle and source line are drawn, the label is pressed against the adjacent column, and the transparent bottom layer is dark and invisible; y1 vertical screen label is cut; y3 vertical screen description is drawn; y4 vertical screen typing overflows the bubble; t2 renders successively by 1 color level at the same time (one frame remains on the multiplexed buffer). In addition, self-measurement shows that `TY.charsIn` does not multiply the outer transparency (the title of y1 says that the fade-out is to disappear in one frame), the value of the lowest negative column of t3 is pressed against the category name, and `TY.fit` only counts the number of lines but not the line width. Rule: **Any place that "can't fit" must have an escape route - first shrink, then fold, then give way, and finally give an alarm**; the layout is only adjusted to the length of the sample, but it will break when it comes to real narration.

- **Each two groups of experiments wrote one `window.YT`, and the APIs are completely different.**  When merging, split it into 8 namespaces according to function, and rename things with the same name and different synonyms: `zoomThrough` of G2 (rushing into the color block) → `fillZoom`, `spring(t, freq, decay)` of G2 → `MO.springHz`, `circlePts` of G1 (open ellipse) → `DG.ellipsePts`.
- **woff2 font fails the glyph check.**  The `U.loadCmaps` engine can only solve WOFF1/TTF, and the G3's woff2 will console.error as soon as it is loaded, and the qa judgment fails. When collected, it will be converted to woff.
- **The background read out during the entire film time will change phase due to the different positions of the film on the timeline.**  The light spot of the press conference demonstration was originally arranged at 8-16s. After being filmed separately, the composition completely changed. `T2.PHASE = 8` was used to preserve the final image. The light spot in the parameterized clip only reads the clip time and is not affected by this.
- **Scale should cover the entire data.**  `CH.ticks` only gives the whole scale within the interval. When the maximum value is 130, the highest scale may be 100. The column is pushed out of the coordinate system; the upper and lower scales are filled in the fragment.
- **System fonts are not in the skill.**  The Songti SC in the Vox demonstration and the code font (Menlo) in the dynamic text demonstration use macOS system fonts, which will change when changing machines; all parameterized fragments have been replaced with the fonts that come with the skill.


## Orally broadcast the entire film and the 9th grammar

Parameterized fragments are provided for the above 8 types. There is also [Explainer-style financial science popularization] (animation-grammars/y6_presenter_explainer.md), which provides syntax and reference code for the whole piece, but there is no parameterized fragment yet. For complete oral production, frame inspection and experience feedback, see [Oral Broadcast Entire Films and Experience Feedback] (12-narrated-films-and-feedback.md).
