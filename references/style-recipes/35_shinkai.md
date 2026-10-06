# 35_shinkai · 2016 Shinkai Makoto Light and Shadow

> Source: Migration test D (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/35_shinkai.js`.

The file name during the experiment: `scenes/r4_shinkai.js`, each frame takes about 71ms.

**Pipeline**: Realistic interior (wall warm and cold gradient, wooden floor see-through seams, aluminum framed windows, wall calendar, desk, cache) → sky + cumulonimbus + telegraph poles and wires + distant roof + aircraft cables + birds → glass beads → white gauze curtains → window-shaped light spots on the floor and wall (there are shadows of curtains in the light spots on the wall) → potted plants → Cat, girl (celluloid) → hot air → Tyndall light beam + light dust → lens flare → floodlight → soft-light separation of warm and cold.

**Key Parameters**
- Celluloid function `cel(c, p, base, shade, rim, {sd, rw, lx, ly})`:
  - shadow = clip(p) ∩ ¬(p translation (lx·sd, ly·sd)). Use evenodd to implement: a large rectangle + p after translation, as clip.
  - bright edge = clip(p) ∩ ¬(p reverse translation rw).
  - The light comes from the window, lx=−1, ly=−0.55, so the shadow falls on the lower right side. sd: large parts 22–30, face 10, small parts 8; rw 3–9.
  - Thread color #6a4632, line width 2.2. According to the component sequence "Fill → Shadow → Bright Edge → Line Drawing", the occlusion is naturally correct and no visibleLines are needed.
- The cat is backlit under the window: lx=0.5, ly=1, the dark part is on the lower side, and a lighter warm-color bright edge rgba(255,220,160,.55) is added on the top and back.
- Color: skin #ffe8dc/#f2b6a8; blonde #f8d681/#d8a050; white uniform #fbfbfe/#b9c3dc; navy #2c3a66/#1b2446. Angel Ring: A 9px bright arc rgba(255,250,226,.85) on the back of the head.
- Animated eyes: white 8×12, iris vertical gradient #1f3f7a → #3f7fd0 → #9fd4ff, two highlights, upper eyelid 3.4px, add one corner eyelash.
- Cumulonimbus: 70+12 regiments. ①Draw a blue-gray silhouette for all the clumps (linear gradient #b7c6e6 → #8297c6) ②Draw a 0.82r white radial bright ball for each clump toward the sun (+0.22r, −0.3r) ③The entire layer is blur 3px, and then stack a 55% clear layer. Each group's radius breathes at 0.05·sin(1.3t), and the whole group drifts at 10px/s.
- Halo:
  - Solar core: r130.
  - 10 starbursts: long 90/170, rotating at 0.25rad/s.
  - Horizontal wire: 840×4.
  - 5 hexagonal spots: falling at 0.45/0.75/1.25/1.6/2.0 times on the line connecting the sun → center of the drawing, α 0.04–0.12.
- Tyndall: 3 wedges, blur 18px post-buffer, screen, alpha 0.75 + 0.25·sin(3.4t). 60 light dust particles, radial gradient, flashing.
- Floodlight: The whole frame is drawn into a small canvas of 480×270 → blur 6px, brightness 1.1 → screen α0.28, zoom in and overlap.

**Motif Animation**: Clouds billowing and drifting, airplanes pulling strings, birds flapping their wings, a drop of water sliding down the glass (with water marks), white gauze curtains and the shadows they cast on the wall are swaying, potted plant leaves are swaying, hair is blown by the wind, stars are spinning, light beams are flickering, and light dust. Movement area 3.0%.

**pit**
- When the sun is placed on the corner of the window frame, the halo will overflow onto the wall, like a lamp hanging on the wall. The sun must be placed inside the glass and the halo radius is ≤130.
- In the first version of the cloud, each group has a radial gradient, and then draws a "light receiving arc", and the result reads like a pile of soap bubbles. To "silhouette + offset bright ball + two layers of paste/clear".
- The first version of the full-frame horizontal gloss is 1800px long and looks like a bug line. Received near the sun 840px, α0.35.
- Water droplets are drawn as solid circles like bubbles floating in the sky. Only draw the lower edge arc, a transparent body with α0.22 and a highlight point.
- Variable name conflict (two `const cg`) caused the entire scene to fail to load and was silently replaced with a placeholder screen (see ② Item 1).
