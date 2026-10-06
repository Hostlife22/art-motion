# t2_keynote_ui · Conference-style interface and gradient effects

> One-sentence grammar: **Slowly drifting colored light spots on a dark background, one thing per screen; words are tightened and emerge from the blur; the interface is made of glass cards that are placed in 3D with non-rebound/light-rebound springs, numbers are counted, light is swept, and transitions are unfolded on the "same piece of glass".**
>
> Demonstration film: `scripts/engine/demos/t2_keynote_ui/` (rendering `render.py --film demos/t2_keynote_ui`) (8s, 3 shots) · Overview `assets/animation-grammars/t2_keynote_ui_overview.jpg` · Code `scripts/engine/demos/t2_keynote_ui/`

## ① Applicable scenarios

- **Usage**: Product/feature release, version update, "three new features", price and parameter announcement, opening brand video, "What is this product" paragraph in the video. It is most suitable when the spoken broadcast is** noun + number** ("Plover 2", "delay 320 milliseconds", "1 million tokens"): one sentence per screen, the words appear when the noun appears, and the number settles when it is spoken.
- **Usage**: You need to talk about "interface screenshots" in an advanced way - put the UI into a glass card and put it into 3D to normalize it.
- **Don't use**: Talk about mechanism principles (glass and light spots do not carry logic, use t1); talk about data trends (use t3); serious accidents/bad financial news (this language has the emotion of "good news"); when the content itself does not have a "protagonist" that can be enlarged (only the empty mirror light spot is left).

## ② Screen composition

| item | value | basis |
|---|---|---|
| Background color | Near black: This film `#050508`; Apple `#000/#161617/#1d1d1f`; Linear `#08090a` (previous level `#0f1011/#141516`, text `#f7f8f8`, stroke `#ffffff14`) | Actual CSS measurement of the two official websites |
| Spot | 4 groups of radial gradient screen overlay → 1/4 blurred 90px in size → enlarge and spread → overlay 3.5% static particle anti-color band. The hue is in the Stripe series: purple `(150,90,238)`, blue `(56,104,255)`, cyan `(120,214,255)`, a little warm red `(255,96,84)`; a layer of 38% black radial gradient is pressed in the center to give white text contrast | Stripe 2021 gradient `#a960ee #ff333d #90e0ff #ffcb57` |
| Spot movement | Each group drift amplitude 90–260px, period 9.5–13s, **avoid 5s period** (HIG: avoid ~0.2Hz continuous swing) | Apple HIG Motion |
| Glass card | Background sampling blur 40px (Apple Navigation `saturate(180%) blur(20px)`, NN/g says bigger is better) + white 7.5% fill + top 14% white gradient light strip + 1.5px gradient stroke (bright upper left, dark lower right) + large shadow (blur 70–80, y+30–40, α0.5) | apple.com globalheader.css; NN/g Glassmorphism |
| Rounded corners | Card 36px; **Concentric rounded corners**: Internal icon bottom rounded corner = 36 − Padding 14 = 22 | WWDC25 "Child rounded corner = parent rounded corner − padding" |
| Fonts | Inter (a close open-source alternative to SF Pro, used by Linear); the original CJK companion is replaced by Latin fonts. Titles weight 600; **tighten large-text tracking to −0.02 ~ −0.03em** (`T2.track`) | Apple: 96px, −0.015em; Linear: 64px, −0.022em; OpenAI: 64px, −0.03em |
| Text hierarchy | White `#f5f5f7` primary, `rgba(235,235,245,.6)` secondary, `#a7a7b4` eyebrow title (character spacing +6px); product name uses white → lavender → light blue horizontal gradient | Apple official website hierarchy convention |
| Composition | One focus on one screen, symmetrical in the center; three cards of equal width 480, spacing 52; large numbers occupy more than 55% of the screen width | — |
| Shape language | Rounded rectangles, capsules, thin line icons with round caps and uniform width, reminiscent of SF Symbols (`UI.icon`) | — |

## ③ Motion paths

- **Springs (primary)**: SwiftUI duration + bounce parameterization, `MO.spring(t,{duration,bounce})`: mass=1, stiffness=(2π/d)², damping=4π(1−bounce)/d → damping ratio ζ=1−bounce. **Default bounce 0** is the most general. At 0.15 it is crisp with almost no bounce (demo card entrance d=0.75, bubbles d=0.5); 0.3 visibly bounces; >0.4 is exaggerated for UI. `.smooth/.snappy/.bouncy` all use d=0.5.
- **Non-spring curves**: apple.com navigation `.32s cubic-bezier(.4,0,.6,1)`; text reveal here uses CSS `ease`=`(.25,.1,.25,1)` (`MO.appleOut`). Linear commonly uses ease-out-quad `(.25,.46,.45,.94)` over .16s; Stripe recommends <500ms and `(.2,1,.2,1)`. `MO.bezier(x1,y1,x2,y2)` covers these.
- **Word entry**: Blur 18–26px → 0, Move up 16–40px → 0, Transparent → 1, 0.7–1.0s (`TY.blurIn`). The title → product name → subtitle are staggered by 0.2–0.4s.
- **Card entrances**: rise from 170px below, rotate around Y by ±0.55rad (≈31°, side cards face outward), scale 0.9, then spring into place; stagger three cards by 0.1s. 3D uses `UI.persp` (vertical-strip perspective, 1800px here; Stripe uses 600, Linear 1000).
- **Continuous subtle motion**: cards float 7px with periods 3.4/3.85/4.3s (two-frequency superposition, `MO.float`) plus ry sway ±0.06rad; light spots drift; the camera slowly pushes 1→1.045 at **constant speed**, as easing to a stop makes the picture feel lifeless.
- **Counting**: start 0.25s after cards settle, count for 0.9s. Count each value only once; after expanding to full screen retain “1 million” instead of restarting from zero. Use `easeOutExpo` (CountUp.js default); the final digit settles slowly. **Use tabular digits** (`TY.tabular`); Canvas cannot enable tnum, and proportional digits jitter.
- **Light sweep**: a bright band tilted −20°, width 110–140px, sweeps over 0.8–0.9s. Use `source-atop` on an off-screen text canvas to light only the glyphs, and `lighter` on cards. Calculate each card's progress from its screen position to make one continuous light sweep.

## ④ Transition (5 commonly used types)

1. **Blur push (blurPush)**: old scene shrinks to 0.92 with 24px blur and fades out; new scene settles from 1.06 blurred to 1.0 sharp, over 0.55s with `ease`. **Underlay a heavily blurred old scene enlarged to 1.08** to prevent black edges around the shrinking scene. Here: shot 1→2.
2. **Shared-element expansion (expandRect)**: place the new scene **fully opaque inside the card from its first frame**; dissolving over a translucent card would overlay old and new text. First enlarge the selected card to 1.06 and move/dim the side cards to 45%; expand its screen rectangle to full screen, corner radius 38→0, spring d=0.55 bounce 0. Scale the new scene to the card from the start. **Stop the selected card floating before expansion**, so the transition begins from a stable rectangle. Here: shot 2→3.
3. **Match cut**: keep an object at the same position across shots, such as a product name becoming a card title.
4. **Mask wipe / light-sweep cut**: replace the scene behind a passing light band.
5. **Refraction instead of opacity fades (Liquid Glass)**: change refraction/blur strength during exits rather than simply lowering opacity. This demo's blurred text reveal follows that idea.

## ⑤ Rhythm and text

- **Shot duration**: keynote slides commonly last 5–8s (Jobs' 2007 iPhone presentation: 9 screens over 70s ≈7.8s/screen); fast product-film cuts last 1.5–3s. Here: 2.6/3.0/2.4s.
- **One thing per screen**: one noun, one number, one card. Follow a dense passage with an empty screen to let viewers breathe (Presentation Zen's counterweight principle).
- **Narration alignment**: start revealing a noun 0.2–0.3s before it is spoken; the 0.7s reveal should be readable on the spoken word. Numbers **settle when their value is spoken**: count start = spoken-value time − count duration. Three card entrances align with “first, second, third”.
- **Text**: use a short title or product name, a one-sentence subtitle, and cards with a short heading, one description line, one large value, and a smaller, lighter unit. The original limits were ≤6 CJK characters for titles, ≤16 for subtitles, and 4 for card headings; fit English to measured width rather than copying those character counts.

## ⑥ Key points of code implementation

> Since integration into the skill (2026-10-04 v0.4), reusable functions listed here have moved into `scripts/engine/lib/`, using the shared MO / CAM / DG / TY / CH / UI / CL / TOON namespaces. Film-specific code lives in `scripts/engine/demos/t2_keynote_ui/`. See `references/09-video-animation-grammars.md` for the library guide and narration-to-grammar selection.

- Reuse from the skill: `engine.js`, `render.py`, `PAINT.cached/hex`, and `U.rng`.
- Newly written and now unified in the library `lib/ui.js` (`window.UI`): `mesh` (spot bottom), `grainTex`, `backdrop` (blurred copy, frosted glass sampling), `shadow` (only shadow), `glass` (frosted glass card), `sheen` (light scanned, `comp` Optional), `persp` (pseudo 3D around Y/X axis), `icon`, `rr/rrPath`, `scratch`.
- `lib/motion.js`: `spring/smoothSpring/snappy/bouncy`, `bezier/appleOut/emphasized`, `float`; numbers and text are in `lib/typo.js`: `TY.count/tabular`, `TY.blurIn` (called MO.textIn during the experiment).
- Transition (in `transitions_info.js` during the experiment, now in `transitions.js`): `blurPush`, `expandRect`.
- Performance: draw a light spot (1/4 size) + a background blur copy per frame, both 40–60ms/frame (qa with GPU flush); 8 seconds, 60fps rendering, about 1 minute.
- Pitfalls (improved in the library): ①**blur will pull in transparent pixels from outside the canvas**, and the off-screen drawings that are not cleared will be accumulated frame by frame, qa reports certainty ✗——First put a layer of non-blurred original image; ②Perspective slices overlap adjacently by 0.75px and create a stripe on the translucent texture—the slice boundaries round up the pixels end to end, and draw them into the off-screen first and then press alpha to paste them back as a whole; ③`UI.sheen` The synthesis mode set internally will overwrite the `source-atop` set externally, so it is made a parameter.

## ⑦ Representative works and first-hand references

- Representative works: Apple iPhone/Apple Intelligence release video and apple.com product page; OpenAI GPT-4o/o series release video; Linear official website and Linear Release video; Stripe 2020–21 official website gradient.
- https://developer.apple.com/videos/play/wwdc2023/10158/ (Animate with springs:duration/bounce)
- https://developer.apple.com/videos/play/wwdc2018/803/ (Designing Fluid Interfaces: starts with 100% damping)
- https://developer.apple.com/videos/play/wwdc2025/219/ (Meet Liquid Glass)
- https://developer.apple.com/design/human-interface-guidelines/materials ,/motion ,/typography
- https://www.nngroup.com/articles/glassmorphism/
- https://web.archive.org/web/20211015000000/https://stripe.com/ (gradient color value)
- https://stripe.com/blog/connect-front-end-experience (<500ms, curve)
- https://linear.app/now/how-we-redesigned-the-linear-ui (LCH Color, Inter)

## ⑧ The 3 most common things to do wrong

1. **There is nothing behind the glass.**  The frosted glass only blurs the content behind it; the "glass" on the dark solid background is just a gray rectangle. First draw a colorful and undulating light spot, and then blur it according to the position of the card screen.
2. **The spring is too elastic and moves too much.** Bounce defaults to 0, the maximum entry is 0.15–0.3; >0.4 is immediately cheap. Move only one group of things at a time.
3. **The spacing of large characters is not tight, and the light spot color is dirty.**  Above 64px −0.015~−0.03em; each color of the light spot occupies one piece (screen superposition + large blur), do not linearly average multiple colors into gray and purple mud.

## qa number (skill `scripts/qa.py`, 2026-10-04, before review)

| Shots | Motion % | Still Frame Pairs % | Jumps | Avg/Peak ms | Deterministic |
|---|---|---|---|---|---|
| t2_s1 | 0.58 | 35.4 | 0 | 39.8/51.4 | ✓ |
| t2_s2 | 2.62 | 8.5 | 0 | 60.2/65.0 | ✓ |
| t2_s3 | 1.84 | 9.6 | 0 | 44.3/51.0 | ✓ |

Note: The "still frame to 35%" of t2_s1 is not stuck - the spot drift and the 4.5% slow push change per frame are lower than the pixel threshold of qa (>12 levels). Take two frames every 1 second (filming 1.6s vs 2.6s), 26.8% of the pixel changes exceed 12 levels, and 78% exceed 4 levels; this kind of "slow breathing" picture needs to be judged by the interval frame difference.

## Revision (independent review → revised round, 2026-10-04)

| Review Opinions | Law Reform |
|---|---|
| 🔴 2.55–2.75s, 5.6–5.85s, black borders around the transition | blurPush / expandRect, place a layer underneath to enlarge 1.08, blur 30px old picture |
| 🔴 When the card is expanded, the "long-term memory" and "1 million" are two-layered images; after expansion, it is multiplied from 0 | The first frame of the new screen is opaque and loaded into the card; the full-screen page follows the same caliber of "1 million tokens" without multiplication |
| 🔴 6.95s The count jumps from 999,023 to 1,000,000 in one frame, and "tokens" are squeezed out | Delete the repeated count along with the previous article; the unit is typeset according to the measured width of three sections, no more words are posted |
| 🟡 Closing only appears for 0.4s, y≈1020 leaves the safe area | Closing takes 1.2–1.8s, appears and stops for 0.6s, y=972; the entire dialogue panel moves up 65px |
| ⚪ The caliber of the card "1 million" and the full screen "1,000,000" are different | unified as "1 million" |

Revised qa:

| Shots | Motion % | Still Frame Pairs % | Jumps | Avg/Peak ms | Deterministic |
|---|---|---|---|---|---|
| t2_s1 | 0.58 | 35.4 | 0 | 39.5/51.6 | ✓ |
| t2_s2 | 2.62 | 8.5 | 0 | 57.2/59.9 | ✓ |
| t2_s3 | 0.97 | 15.4 | 0 | 43.0/48.7 | ✓ |

(Smoke transition: blurPush is as slow as about 137ms/frame, including two full-screen blurs.)
