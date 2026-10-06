# 02_egypt · Egyptian tomb paintings from 1350 BC (pure code)

File: `scenes/02_egypt.js` (~460 lines). Performance: warm max 20.7ms / mean 10.5ms (1920×1080), `init()` preheats the cache during boot, and the first frame is no longer stuck for 170ms. Deterministic check passed.

## Pipeline
1. **Static layer `eg_static` (cached once)**: plaster wall → hieroglyphic column → window (cornice/color block frame/white background/Aton sun disk/holy snake) → clay pot × 3 → offering table and offerings → gold chair → blue bowl → ground line and bottom multi-layered ribbon → dark blue ribbon → top/left and right color block borders.
2. **Moving motifs (painted per frame, cheap)**: flowing water hieroglyphics, Aton ray + opening and closing of the small hands at the end, two long rays extending to the cat in front of the Anka, scarab pushing the sun sphere.
3. **characters**: Redraw the Egyptian program, do not go RIG.drawGirl/drawCat, only take the anchor point and choreography.
4. **Mural surface**: `eg_surface` mottled layer `multiply` full screen + `P.grain` particles + 6 random walking hairline cracks (the cracks are painted in the surface layer, so they will cross the characters, like real wall aging).

Egyptian murals have "no perspective, flat painting, and outlines". There is no need for any stroke renderer, and the lines are not boiling (clean 2.2–2.8px dark brown lines `#2a1810` are what they look like). The sense of the times depends entirely on the program (side face, front eyes, front shoulders) + color palette + pattern density.

## Swatches
Wall `#eadcb8` → mottled dark part `#d8c597`; four-color border red `#b8322a` blue `#2a58a8` yellow `#e2b13a` green `#2e8a55`, off-white between blocks `#f2ead6`, black seams `#231a14`; gold `#e0ab38`/dark gold `#a8741c`/bright gold `#f3d27a`; dark blue band `#1c2236`; column red line `#9a2b22`; Atonian disk `#c8372b`, rays `#c23a2a`, small hands `#b4452c`; skin color `#e6b282` (Egyptian women's light yellow ocher); cat orange `#e08a3c` stripes `#b45a1c` white `#f6efe0`; scarab lapis lazuli `#2c56b0` + turquoise `#3fa6a0`.

## Hieroglyphs (the most contemporary part)
- Wrote **24 glyph functions** (ankh, sun disk, bread, reed, owl, falcon, heron, horned viper, eye of Horus, king's circle, scarab, sitting man, legs, arms, basket, room, three vertical, feather, Jed column, Shen ring, pot, lotus, nfr, mouth, water pattern), each drawn with 10–20 strokes in a ~50px frame, with candidate colors. Line width 3.1 (about 3px after scaling), `round` endpoints.
- The original photo quantity of the field photo: left 3 columns x=78..306/y=66..566, middle and upper 4 columns x=852..1172/y=66..452, right 4 columns x=1560..1866/y=252..882, cat left 1 column x=298..366/y=614..886.
- Arrangement: `U.rng(1350)` seeds, stuff down column by column, font scaling = column width/78×(1.0–1.14), spacing 6–11px; **No adjacent repetitions in the same column, the same font in the same column ≤3 times, scarab/water pattern reduction of 60%** (the first version has no limit, the screen is full of scarabs, like stickers).
- The arrangement is calculated and stored during module initialization - in this way, the watermark characters can be drawn separately in each frame without entering the cache. At least 6 watermark characters are guaranteed.

## Motif animation (all rely on lt/t, certainty)
| Motif | Practice | Numbers |
|---|---|---|
| Scarab pushes the sun ball | x(lt)=800+642·(lt−0.394), measured at 10.7px/frame in the original; loop modulo 2160; ball rotation = center x / radius; alternate two leg poses with `floor(lt*15)%2` (every 4 frames at 60fps) | Overall scale ×1.22, ball r=23×1.22 |
| Aton's little hand opens and closes | open=0.5+0.5·sin(2π·lt/0.4+k·0.9), finger opening angle (0.1+0.24·open) | Period 0.4s, 13 windows + 2 windows |
| The light trembles slightly | End x+=3·sin(7t+1.3k), y+=2·cos(6t+k) | ±3px |
| Water pattern flow | zigzag phase = floor(lt·12)·0.5, 12fps step, 4 steps per cycle | 0.33s/cycle, like hand-drawing one by one |
| Hold the cup | `cup = lerp(0.8,1,choreo.cup)`: The original film "keeps it on the tip of your mouth and drinks it", only the last 20% of the toast + choreo.sip is raised | — |
| Cat | choreo.tail tail flick (RIG.cat.tailPts), blink (t≈2.18–2.30, falling exactly in this section lt≈0.77–0.89), breathe upper body | — |

Amount of movement: lt 0.45↔0.9 (avoiding the impact of the beat and zooming) 3.5% of moving pixels, concentrated on the light hand, cat tail, girl's head and arm, and scarab - the amount is not large but they are all the focus of the line of sight.

## characters: Egyptian program
**Girl** (`RIG.girl({dy:-25})`, dy puts her feet on the y=900 ground line):
- Take `G.face` for the side face; **front eye** draw by yourself: almond-shaped white eyes + black pupils r4.2, stick on the eyelids, upper eyeliner 3.2px, drag back 18px (kohl tail), long eyebrows.
- **Front shoulders**: Don’t use G.torso for the torso, draw a wide trapezoid x 1270–1452 by yourself (both shoulders are visible, wide at the top and narrow at the bottom).
- White linen: fill in the skin color first, then `alpha .9` to whiten it → reveal a little skin color = linen translucency; the skirt has 27 Bezier pleats fanning out from the waist to the hem (clip in the skirt, `rgba(120,96,70,.5)` 1.3px), and the vertical pleat spacing on the chest is 9px.
- Wide collar collar: 5 concentric semi-ovals (blue/red/green/gold/blue, rx 50→88, ry 24→55), 18 alternating red and blue droplets on the outer ring.
- **Blonde braids**: Draw 15 bundles of vertical braids after the wig outline clip, each bundle = 11.5px dark gold bottom line + 8.5px golden thread + every 8px left and right alternating diagonal sections (herringbone pattern), with staggered ends. The first version is covered with small round beads, like "golden caviar". It is read as braided hair after changing to long strips + diagonal sections.
- Blonde hoop (Bezier 15px black background/11px gold/3px bright gold) + back strap, large gold earrings, gold armbands (gold 8px + blue 2.5px horizontal bar).
- **Arm holding cup**: RIG's default position is to have the hand on the side of the cup, the shoulder in the middle of the torso, and the elbow will be thrown far away. Change it to "put your hands under the cup body (cup base)", move your shoulders to your front shoulders (1282,476), `RIG.ik2(sh, hand, 140, 160, -1)` and let your elbows drop to your chest.
- Blue lotus cup: petal-shaped cup body + three light blue petal lines + cup base, follow the position/inclination of G.cup.

**Cat = Buster sitting posture** (`RIG.cat({dy:-5})` takes headC, tailPts, blink, breathe, and draw the body by yourself):
- Silhouette: straight chest + round buttocks, **front legs wrapped in silhouette**, chest to front paws are completely white, and then use two lines to separate the two front legs + toe line. The first version drew the front legs as two separate white pillars, like bowling pins.
- Side head + high pointed ears + frontal almond eyes (yellow `#e8cf4a`, vertical pupils, black eyeliner trailing), white mouth and nose, beard, gold earrings.
- Collar clip in "Body ∪ Head" (`Path2D.addPath` merge), otherwise the round head stroke will poke out the neck; Eye of Horus gold pendant.
- Orange tiger spots: 9 stripes on the back, 4 stripes on the thighs, 5 deep orange arcs on the top of the head, a horizontal stripe every 3 sampling points on the tail, and a white tail tip.

## Trampled on
- The 0.2↔0.7 difference of selfcheck will cause "the whole screen is moving" in this section - that is the engine's beat impact scaling (lt<0.36s), not the scene moving. Seeing real motion is better than two frames with lt≥0.4.
- The first generation of `P.texture` takes about 170ms; preheat it in `init()` (called when the engine boots), otherwise it will be stuck in the first frame of T01 transition.
- The gravel in the original film ref is leftover from the transition, not the content of the scene, so don’t copy it (it’s not in the design draft either).
- The year plate area 1500–1890×40–210 only leaves the wall; the pictogram column on the right side starts from y=252 and is just avoided.
- Review and repair: When the cat is in its original size, the tip of the ear is y≈530, and is pressed against the colored block (y 530–560) at the bottom of the window frame, like a cat’s head inserted into the window frame. The sole of the foot (540,898) is used as the anchor, the overall canvas transformation is reduced to 0.85 (RIG.cat is still s=1), and the tip of the ear falls to y≈585; the ends of the two long rays are converted using the same transformation `catPt()`, and the small hand still falls on the cat's head/muzzle; the topline and hips are moved forward by 12–20px, making Buster's sitting posture more slender. **Lesson: It is not enough for the cat/man and the window frame to align themselves with the standard composition frame. The two frames are very close to each other at y≈540–600. Components such as heightened ears that exceed the frame frame must be individually checked for gaps with adjacent objects.**

## Rework v2: Quiet Egypt (Review Report No. 3)
Caliber: whole slice renderFrame, still segment frames 112–140, 480×270 frame-by-frame average absolute difference (masking counter). **0.32 before modification → 0.84 after modification (original film 0.90)**, performance warm max 21.7ms.
- **Cup holding cycle**: lt<0.35, lift to the mouth according to choreo; then cycle `cup = 1 − 0.46·(1−cos 2πu)/2` every 0.6s (the cup is lowered to 0.54 from the mouth and then lifted back); when the cup is at the mouth, add `sip += 0.3·clamp((cup−0.78)/0.22)·(0.65+0.35·sin 13lt)`, and the head tilt angle is ~0.2rad. This one contributes the most.
- **The inscription is written**: every 0.12s, take 6 words from the scrambled word list (seed 77, across all columns): first erase it with the wall texture `drawImage` sub-rectangle, and then use `setLineDash([p·95, 999])` to trace by stroke (the dash of each sub-path will start from the beginning, just like writing one by one), the filled part will appear only after p>0.55; the handwriting color starts from bright gold `#f6c846` Fall back to original color, with 10px golden shadowBlur afterglow, written in 0.36s. About 18 words were being written at the same time.
- **Aton Pulsation**: period 0.45s; light length along the sector ±9% (phase −0.55k, sweeping like a wave), line width 2.2→3.8, overall small hand scaling 0.9–1.2, finger opening angle 0.03–0.45; golden halo + bright ring outside the sun disk pulsating, the sun disk is redrawn above the halo to remain red. The coordinates of the little hand are clamped in the window (x 428–752, y≤512), otherwise half of it will be cut off by the window frame when it is extended.
- **Cat**: tail amplitude `tail·2.1 + 0.25·sin 9.5t`; rapid out-of-phase twitching of both ears (0.1s every ~0.38s, 0.32–0.38rad around the midpoint of the ear base).
- Lesson learned: Thin line motifs such as Aten's light and water pattern characters are almost not scored in the 480×270 frame difference. The test of "visibly moving" depends on local movements that are large enough** (arm + head, erasing of whole characters), and the swing of thin lines can only be used as embellishment. The first version of the sun disk pulsation uses translucent orange to cover the sun disk. At the peak, the red sun disk is washed into orange and changed into a halo + bright ring outside the disk.
