# 20_dunhuang · Dunhuang Murals (Mogao Grottoes·Prosperous Tang Dynasty)

> Source: Migration Test A (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/20_dunhuang.js`.

The file name during the experiment is `scenes/04_dunhuang.js` (line 215). 0.45↔0.9s is 6.6%, and the median of adjacent frames is 1.98%.

**Pipeline**
Earth red ground battle (cache): `P.texture #a5452f`, dark `#7a3020`, add sparse faded flowers, rolled grass edge on the top + triangular hanging curtain (alternating green, white and red + gold beads) → Window = Shi Qingtian: auspicious clouds, flying sky → Curly grass pattern window frame → Lotus brick floor (cache) → Low door case, oil lamp → Cat → Girl (donor of Tang Dynasty) → Hot air cirrus → Ceiling → Covering.

**Line and Color**
- Iron line drawing: constant width 2.6px, color `#5a2414`. Use the redder `#8a3a24` for the face.
- Mineral colors: earth red `#a5452f`, stone green `#3f8f6e / #6ab08e`, stone blue `#2f5f8f / #5a86b0`, white `#ecdfc4`, gold `#d8b05a`.

**Tang suit**
- Secondary color skirt: red bottom, oblique trapezoidal green strips, one every 44px, diverging downward with x.
- Azurite short jacket, white collar, high waist red belt.
- High bun: Stack two ovals above the headTop, add a gold hairpin and three hairpin flowers.
- Facial makeup: flower bud (four-petaled red flower on the forehead), oblique red (a red arc on the temple), dotted lips, and furrowed eyebrows.
- The tea cup is Yue kiln celadon.

**Philanthrope `shawl(pts,w)`**
- Traveling wave dots → ribbon, add white dotted lines to draw flowers and red dots.
- The back section: `x = back + 230q + 64q·sin(4.2q − 5.5t)`, with the end 30% rising upwards.
- The front section hangs down around the arms.
- Pitfalls: The horizontal swing of the first version is only 18–34px, and it is almost vertical. It looks like the vertical pole of a chair. The lateral displacement needs to be more than 200px, and the end is raised, so that it can be read as floating silk.

**Feitian**
- Lying sideways to the left, 1.35x, 300px/s through the window.
- Three streamers make traveling waves. One of them arcs from the shoulders, over the head, and then to the back. This large arc is the most recognizable shape of Feitian.
- Bald head, bun, flower tray.
- Auspicious clouds are round + tapering cloud tails, drifting at 40–76px/s.

**Overlay (distressed)**
- Overall `saturation` mixed with α.3 fade, then multiply a layer of light earthy texture with α.5.
- Pixel-by-pixel peeling: `fbm(x·.0032)+0.12·noise(x·.03) > 0.3` exposes white gray ground `#d8c6a2`, 0.28–0.3 is the dark line at the edge of peeling.
- Set a protected area near the two faces to prevent peeling.
- 500 cracks running randomly, 380px smoky gradient on top.
- Pit:
  - When the peeling noise frequency is .006, the screen is full of sesame spots, like stains. After dropping to .0032 and raising the threshold, there are patches of flaking.
  - The final version makes the cat (380–720, 530–920) and the girl (1070–1530, 240–950) protected areas, with only the background stripped away.
  - Slant red alpha down to .32, otherwise scar-like.
  - The first version of Feitian's headlight was a solid green circle, pronounced "swimming circle", which was changed to α.28 translucent with thin lines.
  - When the cat uses `#c8843a`, overlay it and it will fade to brownish yellow, and change it to `#e08a3a`; add `look: sin(2.6t)` to turn the head and increase the breathing by 2.5 times, otherwise only the tail will move in the whole section.

**motif animation**
- Ceiling: 30 four-petaled flowers that rotate and fall upside down.
- Oil lamp: flame `1+0.12sin(17t)+0.08sin(29t)` jumps, adds halo.
- Pigment flakes: 10 flakes detached from the flaking edge, turned over, fell parabolically.
- The little bell on the cat's collar swings.
