# Added transitions (A–D) for migration testing

<!-- from migration test A -->
## Transition (new block at the end of `transitions.js`)

| Transition | Enter | Techniques and parameters |
|---|---|---|
| `goldLeaf` 0.5s | Klimt | 72px square. Sequence key = distance from the girl’s head (1300,380) × 0.78 + azimuth angle × 0.12 + random × 0.08, so the gold foil is spread out in a spiral. Each piece q=(1.32p-key)/0.32: When q<0.5, a piece of gold foil rotates from the 1.3 times belt, and the golden gradient highlight moves with q, pressing spiral, eye-shaped or concentric dark patterns; when 0.5<q<1, B is exposed, and the gold foil fades out. |
| `screamWarp` 0.5s | Munch | The old painting is distorted sinusoidally by row, with an amplitude of 70e. The wave front `y = lerp(−180, H+220, e) + 80sin(x·.0055 + 7p)` is pushed from top to bottom, and above the front is a new painting (the distortion amplitude 60(1−e) gradually flattens out). Front edge pressed 4 lanes of 26px ribbon: `#b82a1e #e2541c #f08a24 #f4c03a`. |
| `apsara` 0.5s | Dunhuang | Frontier `x = lerp(W+260, −300, e) + 110sin(y·.006 + 5p)` Swipe from right to left, there is a new painting on the right. There are 3 streamers on the front edge (stone green, earth red, stone blue, width 44/38/32, traveling waves, white dotted lines depicting flowers). On the left side of the front edge, the fragments of the old painting (take the pixel block directly from A) flip and fall in a parabola, which is the "peeling off of the old painting". |
| `dotBloom` 0.48s | Kusama | 58px hexagonal grid, dots grow from the cat (540,760) in order of distance (outBack, up to 0.74 times the spacing, just full), and clip in the points to create new paintings. Undergrown spots have a white stroke that fades out. |

---

<!-- From migration test B -->
## Transition `transitions_b.js`

| Enter | Name | Method | Parameters | Each Frame |
|---|---|---|---|---|
| Dali | `melt` | The old picture droops vertically by 4px (`sag = 0.22·edge·e`, and is elongated by 0.3); the new picture is above the liquid level edge(x), edge = overall falling line (−160 → H+40, easeInOut) + 26 round-head droplets (width 10–32, length 60–280, cross section `(1−u²)^0.3`, each starting phase) + sin wave; liquid surface draws dark edge (blur 3) + highlight | 0.36s | 86ms |
| Hopper | `sunShaft` | Old picture `multiply` cool green `rgba(70,120,110, 0.7·min(1,2p))` sinks into the shadow; the right edge of the beveled light block (slope 260px) sweeps across the full screen, inside is the new picture + `screen` warm light (0.45 → 0 retreating in p 0.6–1) + a following window lattice oblique shadow; a bright edge at the front edge | 0.34s | 76ms |
| Ghibli | `bleed` | 5 group color haloes bloom one after another according to t0 (window opens first), radius `q·1400·k`, q=easeInOut(seg(p,t0,t0+0.66)), boundary `R·(1 + 0.28·fbm(angle) + 0.05·sin 9a)`; outside 70px blur 18 The bright halo (water comes first), the inside is a new picture, and the edge is 5px `multiply` brown water marks. Both bright halo and water mark α are multiplied by (1−q) | 0.38s | 127ms |
| Vaporwave | `vhs` | The front is half old, the back is half new; p 0.38-0.62 segment "field synchronization loss" is rolled up + 40px black bar; the tear band with a random height of 6-54px is taken from A/B (the probability of taking B = p), the lateral misalignment is ±130·sin(πp); two single-channel copies of magenta/cyan are taken from A/B `screen` misalignment ±14; 160 snowflake lines | 0.30s | 88ms |

What they have in common: Each transition is a "new style of physics," not a generic erasure—melt is liquid, Hopper is light, watercolor is water, VHS is tape. When designing, first ask: "In what physical way will this style of picture appear?"

---

<!-- From migration test C -->
## Transition (`transitions_c.js`)

| Enter | Name | Techniques and Parameters |
|---|---|---|
| Monet | `ripple` | (The distance denominator is 1700, p>.7 starts to fade in, and the four corners are cleared when p≈.85) The old picture is horizontally sinusoidally misaligned by 6px lines, `dx=sin(0.045y−26p)·46·sin(π·min(1,1.2p))·(0.4+|y−cy|/H)`, like the reflection is disrupted. The new picture consists of a clip consisting of 3600 **horizontal short-stroke ellipses** (length 40–110, height 9–17). Press the ellipse distance (y×1.9) from the cup (1000,600) to swing out in circles. There are 3 circles of light-colored dotted ellipses at the front, dashOffset follows p; 140 water-colored horizontal lines flash in the middle. p>.85 adds a layer of fade in. |
| Seurat | `pointill` | Grid pitch 14: The points grow from 0 to r=6.4 (the first 30%), and the old picture under the points fades into paper color. The color changing time of each point is `0.5·(0.6x/W+0.4y/H)+0.25·hash+0.15`, upper left first, with random; the point will enlarge 1.35 times and "jump" at the moment of color changing. p>.6 A new picture is developed below the point, p>.7 the point is retracted. Each frame needs to do getImageData once for A and B. |
| Matisse | `cutouts` | A piece of cobalt blue paper with a width of 1100px (the left and right edges are sin irregular trimmings) is swept from right to left, and the projection (14,10) blur 12. There are 260 gouache marks on the paper, nailed with white/yellow seaweed (stem + 7 fingers), yellow/pink 6-pointed star (turn with p), and red disc, each with a shadow. The right edge of the paper has been replaced with a new picture. |
| Haring | `radiant` | V-shaped dancing figure, proportion `s=0.15·320^easeInOut(p)`, magnified with the cup as the origin. First "draw 30px black + fill black" to draw the outer outline, then fill in the limbs with white in the off-screen, `source-in` new picture, to get a new picture in the body; 16 radial rays in the outer circle jump at 8fps; p>.82 starts to fill in and fade in. The index of the first version was too slow (`0.08·40^…`, the first 80% of the time was only 300px high, and it was hard cut at the end); the second version, `0.15·120^…`, still had a gap at the end, and could only be ended with a fade-in of about 1 frame, which was judged as a flash frame by the reviewer; the final version was `s=0.15·320^easeInOut(p)`. |

**General experience for transitions**:
- For transitions that require pixels (pointillism, water waves), getImageData is performed on A/B every frame, and it takes about 10ms at a time, which is acceptable.
- For transitions such as "the new picture is hidden in a shape", once the shape is a union of multiple segments, do not use `clip(Union Path2D)`: inconsistent sub-path directions will cancel out and form holes. Use off-screen fill instead, then `source-in`.

<!-- From migration test D -->
## Transition (D section at the end of `transitions.js`)

| Transition | New style signature | Techniques and parameters |
|---|---|---|
| `irisFilm` Rembrandt → Rubber tube | Aperture expansion and expansion of cartoons in the 1930s + old film | ①p<0.5: Old paintings gradually increase `sepia(q) grayscale(0.7q) contrast(1+0.3q)`, the black aperture reaches the cup rim (1236,420), R = R0·(1 − easeIn(q)), R0 takes the distance to the farthest corner ②p≥0.5: New paintings press R0·outBack(q) bounce ③ 48 segments in circumference, 12fps plus ±1.5% hand shake ④ Full film stacking, flickering, scratches, dust |
| `lampGlow` Rubber tube → Shadow puppet | Behind the scenes lighting | ①The old painting multiply rgba(70,34,12, min(1, 2.2p)), darken it like the lights go out ②The new painting is exposed with destination-in radial mask (inner 0.55R solid, outer edge transparent), R = 1500·inOut(seg(p, .12, 1)), with flame jitter ±7% ③lighter warm halo sin(πp) add a small flame |
| `flareSweep` Shadow Puppet→Makoto Shinkai | Light leakage, sweeping | Oblique (k=0.35) dividing line sweeps from −500 to W+700 (inOut). The left is the new painting, the right is the old painting. 3 layers of lighter light bands are stacked on the boundary: wide 520 α0.55 warm, 160 α0.85 white, and 60 α0.6 cyan. There are also horizontal wires, 40 light particles, and 3 hexagonal light spots |
| `blueBrush` Shinkai Makoto → Blue Period | The color is taken away + wide dry brush | ① Old painting `color` mixed and stacked rgba(45,90,148, min(1, 2.2p)), leaving only blue; then multiply to darken ② 6 wide brushes (each high H/6+90) staggered and tilted ±18, brush from left to right in sequence, and the start time is staggered by 0.07. The pen tip is a quadratic curve with 6–7px sinusoidal jitter on the upper and lower edges. ③ There are 26 dark/light gradient bristle lines in 80–280px behind the pen tip (the paint has not been evenly applied yet)|

General steps for transition design (recommended to be written in the 3rd layer of No. 02): Find the physical process that will "appear, light up, and sweep" in the new style → use it to "contaminate" the old painting first → the new painting will emerge from the shape of this process → superimpose a brief highlight or overshoot on the beat.
