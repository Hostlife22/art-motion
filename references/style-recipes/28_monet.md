# 28_monet · 1899 Monet's "Water Lilies" + "Japanese Bridge"

> Source: Migration Test C (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/28_monet.js`.

The file name during the experiment: `scenes/k2_monet.js` (line 176). Each frame is about 105ms, and the frame difference is 30% (mainly water boiling).

**Composition**: Wall = orangery-style water lily mural (entire water surface), window = green Japanese bridge (arch bridge + wisteria + pool water), the window is flanked by green shutters in Giverny, and the girl is sitting in front of the mural.

**Pipeline (09 Benchmark Structure)**
1. The manuscript is `moBase`. Each frame is redrawn because the water lilies are floating and the willow shadows are shaking.
   - Water surface: vertical gradient `#b9c7e6→#8fa6d6→#6c84bf→#5a72a8`, plus 4 pieces of light pink and yellow skylight reflection.
   - Willow Shadow: 5 vertical bands, edge `sin(0.03y−3.2t+k)·14` horizontal fluctuations.
   - Water lily: 10 clumps, ca. 100 notched ovals (rx 38–78, ry 12–21), 40% pink/white flowers.
2. 4 strokes:
   - Water surface: cell 9, len 34, w 6.5, **lateral** angle≈0±0.06, boil 6.
   - Window view: cell 6, len 13, w 4.5, upper half oblique stroke, lower half horizontal stroke, boil 6.
   - Floor: cell 12, len 34, w 8, **boil 0**.
   - Window frame/louver: cell 6, one vertical and horizontal, boil 0.
   - Outline 0 for all passes (no outline for Impressionism).
3. **The bridge is layered separately**: In the manuscript, first lay a dark shade substrate `#24452a` behind the bridge; the bridge itself is outlined with `#3f8a62` thick line (20px) substrate and `#8fdcae` bright line. Use cell 5, light blue green 5 color palette for strokes. If you don't do this, the bridge will be swallowed up by the foliage swatches and completely invisible.
4. Regional color palette:
   - Water `#5b6fb5 #7d8fd0 #9db5e0 #6aa0a8 #b7a6d8 #d9c8e8 #8fb8a8 #a6c4e8 #c8b0d8` (mix .45)
   -Ye `#5f8f4a #7fae5a #3f6f4a #9cc070 #6f9a7a #b4cc78`
   - Pink `#f0a0b8 #f7d0dc #fff2f4 #e88aa0`
   - Floor `#c69a6a #b07a5a #d8b08a #9a6a7a #8a7aa8 #e0bc90`
5. Characters: fill mode flat painting → source-atop thin strokes (cell 6, len 12, the white skirt draws color from `#fbf8f2 #e4e0f6 #cfd2ee #f8ecd0 #d8e8f2`) → **Color shadow**: Warm yellow α.22 on the light side, purple α.32 on the backlight side linear gradient (source-atop) → Only fill in the facial features, use `#5a4f8a` thin lines.

**motif animation**
- **Fluttering light spots on the water surface**: 160 bright-colored horizontal short pens (`#fffbe8 #fdf0d0 #f8e0ec #e8f4ff`). Brightness `clamp(sin(t·(5..11)+φ)·sin(2.3t+i))`, 10fps horizontal jump ±5px.
- Water lilies float `x+sin(1.3t+φ)·7+6t`, willow shadows fluctuate, 3 ripples (dashed ellipse ry=rx·0.22, expands outward and fades out).
- Wisteria: 12 strings of hanging flowers, each string has 9 lilac dots from large to small, arranged according to `sin(2.4t+0.9i)·8`. Straw hat with blue ribbon floating.

**characters**: 1899 White summer dress, high collar, puff sleeves (shoulder ovals), light blue belt, RIG straw hat painted `#ecd28a`.
**pit**
- Full screen 6fps boils with 47% frame difference and full screen noise.
- The first version of Wisteria uses thick lines to make it look like a smooth pill, and changes it to a row of dots.
- The counter cannot be seen clearly when placed at the bottom of the stroke, so a milky white halo of blur 18 is required.

---
