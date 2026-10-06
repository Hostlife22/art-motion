# 17_ink · Chinese freehand ink painting (Bada Shanren/Qi Baishi)

> Source: Migration Test A (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/17_ink.js`.

The file name during the experiment is `scenes/01_ink.js` (line 313). The frame difference 0.45↔0.9s is 3.3% (threshold 24), the median of adjacent frames is 0.62%, and there are no still frame pairs.

**Pipeline** (opposite to the 09 benchmark: paper is the base, ink is only added but not spread). At the opening `lt += 0.12`, the first few strokes have already been made on frame 0, and it is not a blank piece of paper (the film reviewer pointed out that the first frame of the white paper cannot be used as a cover).
Rice paper (cache) → Sfumato layer: light ink distant mountains, vermilion sun → Fog belt (paper color fuzzy elliptical shift) → passing bird → static brushstrokes: window, case, floor line, write cache → Bamboo branch (a single word leaf) → white stone shrimp in hanging scroll → cat: ocher smudge + burnt ink → girl: cyan smudge + white drawing + clothing pattern → hot air gossamer → Seal.

**rice paper**
`P.texture('#efe6d0', scale .0025, amt 9, grain 7)`. Stack 2600 short arcs of paper fibers on top: half brown α.05–.13, half bright α.12–.27. Add radial vignetting to the edge of α.22.

**Written brush `brush(c, pts, {w, tone, dry, reveal, bristles, head, tail})`**
- The point column is first Catmull-Rom encrypted, and then resampled according to 4px equal arc length (`KIT.resample`). Without resampling, the frequency of white noise will change with the length of the stroke.
- Pen pressure: `prof(q) = smoothstep(0,head,q) · (1−0.7·smoothstep(1−tail,1,q)) · (0.85+0.15·noise)`.
- Wet refill: The entire pen is filled with ribbon, the width is `w·prof·(1−0.85·dry·q^0.8)`, and α is tone×0.72. It gets thinner toward the back, indicating that the ink is running out.
- Bristles: Each one has a **continuous** fold line with a lateral offset of ±0.475w·prof. When the noise `noise(k·1.9, i·0.09)` is lower than `dry·q^1.2·0.95+0.05`, it is disconnected and the exposed paper is white.
- Pit: In the first version, press "Each small section separate stroke+round cap" to draw the brush hair, and the joints will be stacked with deep dots, which look like bamboo knots or hemp ropes. It must be changed to a continuous path and butt cap for each brush hair.
- Parameters: window frame w14–18, dry .45–.6; case surface w22; clothing pattern w4–6, dry .3–.4, tone .78; ground wire w5, dry .85, tone .35.

**Floating layer `washLayer`**
- Draw the shape on scratch first, then use multiply to put it on the paper, twice.
- External halo: `blur(halo·(0.4+grow))`, α is haloA·grow.
- Ontology: `blur(blur·(1.6−0.6grow))`.
- grow and press lt to go from 0 to 1: the opening starts from nothing and then the halo continues to slowly widen. This is "the ink spreads on the paper".
- Girl halo 12, α.6; Cat halo 9, α.78; Toyama halo 14.

**leave blank**
- Use `destination-out` to dig out the white parts of the cat (muzzle, chest, paws) from the ocher layer, revealing the paper color. This is more ink-like than painting white.
- The girl's cross-collar underwear is also dug out in this way.
- Fill the face with paper color and outline it with 1.8px Burnt Ink White.

**color**
- Ink `[16,14,12]`, use tone to separate five colors (focus .9/dark .8/heavy .6/light .35/clear .15).
- Ocher (cat) `#c47a3c`; Huaqing (clothes) `#6f8aa0`, Guangxiu `#7d97ab`; Garcinia (blond hair) `rgba(226,170,52,.75)` multiply.
- Only apply rouge in three places: belt, hairpin beads, and lips, use `[190,40,40]`. There are also Zhuri `#d8553f` and seal seal `#c4281e`.

**motif animation**
- **Write out at the beginning**: lt 0→0.45, each stroke `reveal = ss(d, d+l, lt/0.45)`, write out in the order of window, case, bamboo, cat and person.
- Bamboo: The main branch is segmented in light ink, arranged around (835,70) `sin(2.9t)·0.11`, and becomes larger toward the branch tip. 5 groups of 3 leaves each (L110, w15), flip `sin(7t+g)·0.2`.
- Fog belt: 4 paper-colored ovals, blur 14, α.72, moving laterally at 150–270px/s, with distant mountains appearing and disappearing.
- Bada-style bird: passing from the right side of the window in 420px/s, with two strokes of wings, about 8 times per second (`sin(52·lt)`).
- Qibai Shi Shrimp (two in the hanging scroll, 1.45 times): 6 light ink segments + a stroke of burnt ink in the middle of the head and breastplate, two long and two short whiskers making traveling waves, three long pincers, the body is bent `sin(7t)·0.12`, swimming along the curve.
-Eight White Eyes: The cat's pupil points reach the top of the eye socket, and the "white eyes point to the sky".
- Seal: lt 0.3–0.4, pressed from 1.5 times to 1 times, multiply and sealed; white text "QB".

**pit**
- Static brush strokes are drawn in real time during writing, and are cached as `ink_static` once after writing. Otherwise, thousands of brush strokes will be drawn per frame.
- The path of the first version of the bird passes through the bamboo leaves and cannot be seen. It can only be read after changing it to y≈470 above the fog belt.
- I used multiply for blending, which is transparent, so the ink lines on the window sill will show through the cat's ears, and the table legs will show through the skirt. The review read it as "the level is wrong." The method of repair is to first add a layer of paper color (clip and then drawImage paper) in the silhouette of the cat and dress, and then apply blending. This is equivalent to "leave this space first" on the paper.
