# 13_pop · 1962 Pop (Lichtenstein comic grid + Warhol four-square grid)

File: `scenes/13_pop.js` (~230 lines). Performance: warm average 6ms, maximum 9ms, first frame ≈ 45ms; deterministic pass; lt 0.34→0.46 motion difference 11.6% pixels. The duration of the film is 0.47s (T12 yellow lightning transition transition is 0.16s).

## Pipeline
1. **Bendai point = `createPattern`, zero cost**: A small tile of pitch×pitch draws 4 corners + 5 circles in the center = 45° grid (diagonal spacing pitch/√2). Wall: pitch 24, r5.6, blue `#2f5cc8` background white (diagonal 17px, consistent with the 17px period of the original film FFT); skin: pitch 13, r3.3, red `#e2483c` background color `#fae0cc`; yellow ground: pitch 14 r2.2 α0.18 faint printed dots. The skin uses `fillStyle = pattern; fill(path)`, which is two orders of magnitude faster than `PAINT.halftone` (getImageData point by point), and the pattern is aligned with the screen coordinates and will not "swim" with the movement of characters.
2. **Full cache of base plate `pop_bg`**: comic extra frame 6px black; white skirting line 754–792 (6px black line up and down); yellow ground 796→990/1003 (horizon is slightly slanted); red band; MEANWHILE... (`Bangers-400` 46px, black frame on yellow background) 5px); Warhol white picture frame + window sill blue line; blue chair; paper particles.
3. **All characters are "thick black stroke 5px + flat painting"**, `ink(c, path, fill, lw)` is a function to the end; use white thick short lines for highlights; use `hatch()` for shadows: draw a 10px spacing and 3.5px wide black diagonal line inside the elliptical clip.

## Motif animation
- **Warhol four-frame color change**: 4 sets of colors (bottom/face/lower face/eye shadow/lipstick), `step = floor(lt·11)` (≈change every 5.5 frames, original film 601, 605/606, 612 frames), grid i uses the `(i+step)%4` set. Cat face = RIG.smooth’s 9-nod shape + lower face oval + black block on the right side (black shadow on the wrong screen) + eye shadow/lipstick/nose/whiskers; two white glass reflections on the upper right grid.
- **Three points of the thought bubble flash in sequence**: Original film "Point 1 612-615, Point 2 614-617, Point 3 616-618 frames" → cycle every 12 frames, point k lights up when `((f-2k) mod 12) < 4` (r20, jumps up 6px), otherwise r12. Bubbles = 10 circles, first draw 11px black and then fill them all white (the most economical way to combine outlines).
- **WIGGLE WIGGLE explosion frame jitter**: 30fps stuck hash jitter ±8px/±6px/±0.03rad; outer white explosion (14 points, radius 128/178 with random) + inner yellow explosion + two lines of `Bangers-400` 82px red text (12px black stroke + 4px black shadow); peripheral 10 The length of the black triangle action line is `0.85+0.25·sin(40lt+2i)`.
- **The cat twists its butt and prepares to pounce**: Use RIG.cat's anchor points to make modern deformations - lie down: use 10-point custom contours for the body (with `K.box` as the origin), lower the head `K.headC + (22,104)` to the body, and extend the white ellipse of the front paws forward; twist: `wig = sin(lt·2π·6)·16` (6Hz, ~3 times in 0.47s), point weight `clamp((560-x)/140)` → The displacement becomes larger as it gets closer to the buttocks, and it tilts up at the same time `|wig|·0.6`; the stripes and tail follow the same deformation; the three arc-shaped action lines next to the buttocks move with the wig.
- **Girl holding cup**: RIG IK holding cup; cup = white cup + blue diagonal stripes + coffee; hot air with two 14Hz trembling black wavy lines.

## Girl (Lichtenstein)
- Big golden waves: hair ball (19 points smooth, bulge at the back edge `sin(2.1i+4t)·14`) + 7 round curls (r30–48, arranged along the trailing edge), **first draw all 10px black, then fill them all yellow = merged outline**; a 4.5px black C-shaped arc + a dark gold `#d9a514` arc = Lichtenstein's sculptural curls; 5 One black S strand, 2 white highlights.
- The skin (face, neck, hands, legs) is all red with dots; a red skirt (cut to the knees, the skirt clip uses a curve instead of a rectangle) + white highlight strip; two dotted legs + red heels (7-point polygon); big eyes (white eyes 12×8.5, blue iris r7, highlight points) + 3 thick eyelashes + eyebrows moved up 5px; red lips are enlarged.

## Swatches
Black `#141414`; paper `#f3eedb`; blue `#2f5cc8`; yellow `#f7d52c`; red `#d8232a`/`#a8161c`; white `#fbf8ee`; leather `#fae0cc` + dots `#e2483c`; blonde `#f8d62c`/`#d9a514`; cat `#f39a2c`/`#c4561a`; Warhol background `#9ccf3a/#e0359a/#2fc0b0/#f08a2a`.

## Step on the pit
- When you press RIG, the original position of the cat's head will be hanging above the lying body (an empty section). When lying down, the head should be moved down ~100px and pressed into the body.
- The first version of his hair is just a piece of yellow with slight waves, which looks like a piece of cloth from a distance; Lichtenstein's blonde hair is recognizable from "curls + black C arc".

## Still can be improved
- The girl in the original film had teardrops and a white collar (the classic Lichtenstein crying girl). The design draft was removed and I didn’t add it. If you want to make it more “comic”, you can add a dialogue box.
