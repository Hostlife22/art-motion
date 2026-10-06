# 18_klimt · Klimt’s Golden Period (1907)

> Source: Migration Test A (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/18_klimt.js`.

The file name during the experiment is `scenes/02_klimt.js` (line 223). 0.45↔0.9s is 32.9% (mainly from the streamer), and the median of adjacent frames is 0.40%, but 14 pairs out of 48 pairs are almost stationary (see ②-2).

**Pipeline**
Gold foil wall (cache) → Gold powder four-pointed star twinkling (lighter) → Window "Birch Forest" stippling → Black and white checkered gold frame → Tapestry floor → Hoffmann black and white checkered table → Oblique streamer (painted before characters, characters are naturally blocked) → Cat → Girl's gold robe (pattern layer according to silhouette source-in) → Realistic face and hands → Corolla → Gold sleeves, gold cup → Golden heat.

**gold foil**
- Pixel by pixel: `f = 0.5 + fbm(x·.004)·0.55 + noise(x·.003, y·.08)·0.5 ± 0.05`, interpolated between `[120,78,18]→[196,148,52]→[246,216,128]`.
- Draw a very light square seam every 96px to represent the gold foil that will be applied one by one.
- Wall: Gold foil × 480×270. After enlarging the small fbm picture, multiply (brown gold mottled, like the bottom of "The Kiss"), and then sprinkle 9000 gold powder and dark powder.

**Pattern (gold robe)**
- 150 random points divided into four categories:
  - Three colors in concentric circles (30%): red, white and blue, blue, gold and red, purple and white gold;
  - Dark brown background gold spiral (32%), each turn by ±3rad/s;
  - Horus eye pattern (22%), blinking alternately: `sin(2.2t+φ)>0.86`, closing when blinking;
  - White dot cluster + red heart (16%).
- There are 60 black and white vertical squares on the hem, with gold strokes, which is the language of the men's robes in "The Kiss".
- **Flat decoration for realistic face**: Face and hands use radial gradient to express volume (highlight `#fbe8da` → `#f0cfb8` → `#d8a88c` → edge `#b88068`), blurred blush and eye socket shadow, only 1.2px light outline. The gold robe has a 3px dark stroke. This comparison is Klimt.

**other**
- Window "Birch Forest": 2600 oval spots of autumn leaf color, 6 white birch trunks with black spots; 14 fallen leaves turned upside down.
- Flower carpet: 260 concentric flowers, the closer they are, the bigger they are (6→20px), nod `sin(4.2t+φ)·0.18r`.
- Streamer: 520px wide, α.24 bright band, `transform(1,0,−0.45,1)` bevel, lighter, sweeping from −200 to 2300 at a **even speed** in 1.15 seconds.
- Gold powder: 420 pieces, four-pointed stars appear when `sin(t·sp+φ)>0.55`. The first version of the star was too big, like a Christmas decoration, and later the radius was changed from `s·(1+2.2a)` to `s·(0.6+1.1a)`.

**pit**
- Patterns `source-in` one by one will clear each other, see ②-7.
- Streamer alpha to .38 like lens flare, pressed to .24.
- The first version has static segments between adjacent frames: blinks are intermittent, and streamers are soft gradients. After adding three items, the still frame pair dropped from 20/36 to 0/36:
  - 34 gold foil fragments turned upside down and falling (150px/s, square pieces and round pieces, golden gradient);
  - Gold powder floats to 26px/s;
  - Flower nod width increased from 0.18 to 0.35.
- The first version of the cat also had golden spirals on its face. The reviewer said it looked like a rash, so it was changed to only on the body and the number was reduced to 46.
