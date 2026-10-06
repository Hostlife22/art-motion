# 32_rembrandt · 1642 Rembrandt Shading

> Source: Migration test D (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/32_rembrandt.js`.

The file name during the experiment: `scenes/r1_rembrandt.js`, each frame is about 47ms.

**Pipeline**: Light state draft (according to the color of "full light" to draw the room, the lead rhombus window, and the Turkish table rug) → Redraw the background with large brown strokes, and then paste 2.2px and overlap 75% (kneaded base) → The table rug is a single layer, fine brush strokes → Characters flat painting + volume gradient + fine brush strokes → Characters "lost edge" processing →** Lightmap multiply** → Window glass screen Brightening + cloud shadow passing → thick mane coating → candle flame, light column dust, heat → cracks, particles, vignetting cache layer + soft-light golden brown glaze.

**Key Parameters**
- Light map: background color rgb(30,21,13), equivalent to ambient light 0.13. Stack with lighter:
  - Light Pillar: Wedge Polygon, Blur 40px, Cache, α 0.8–0.95.
  - Window itself: r330.
  - Face pool: r250 α0.95. Chest: r230 α0.55. Cat: r240 α0.8. Desktop: r280 α0.6.
  - Candela: r190+40·fc, α 0.6+0.4·fc.
  - "Separated light" on the wall behind the girl: r300 α0.35. Rembrandt often lit up the wall behind the dark side of the figures to separate them from the background.
  - Stack the whole multiply.
- Swaying: `flick(t) = 0.5·noise(2.2t) + 0.25·noise(6.5t)`; the center of the light pool drifts ±14px with noise (0.9t); the cloud shadow `cloud = 0.5 + 0.5·sin(2.2t − 0.6)` lets the window light ×(1 − 0.35·cloud), while a dark radial spot crosses the glass at 260px/s.
- Background strokes: cell18, len54, w16, jitter 6, angle −0.9 + 1.6·noise(0.003); color palette mixBase 0.7.
- Lost edges: First draw the characters layer with blur(2.4px) full opacity, and then stack a clear layer with α0.62. The dark side will blend into the background, and the facial features will still be recognizable.
- Thick paint (bristle pen): one stroke = round(w/1.3) parallel thin bristles, each brightness ±17, random shrinkage 0–25% at both ends, line width 1.4–2.6; a projection of α0.28 on the lower side; 2+w/3 highlights on the upper side. Only used on light-receiving areas: blonde hair, neckline, porcelain cup, pearls, cat white chest, cat head.
- Cover: crack α0.28×0.28; grain density 0.05 α0.12; vignetting 0.75; soft-light rgba(200,140,60,.35).

**Motif Animation**: Candle flame (noise drives left and right tilt, height jump), window light is obscured by cloud shadows and then restored, 70 floating dust in the light column (only displayed in the light column, 24 frames of flashing), cup holding, hot air. Movement area 8.0% (0.45↔1.0s).

**pit**
- The thick coat of the first plate is drawn into three neat lines of "Shadow Offset + Main Pen + Light Ridge", which reads like a white sticker/Band-Aid. Change it to a bristle pen to look like paint.
- Copying back a partial area of ​​the original image (`drawImage(b, x,y,w,h…)`) will bring back the untouched background to form a rectangular patch. Props should be painted in a separate layer after the strokes, without overcopying the area.
- Particle density 0.12 / α0.22 will make the face full of dirty spots, 0.05 / 0.12 is just right.
- The hand should be drawn in front of the cup, otherwise the oval of the hand will cover the porcelain cup. The order in drawGirl is "Hand→Cup→Thumb". You should follow this order when redrawing yourself.
