# 06_renaissance · 1503 High Renaissance (Leonardo da Vinci)

16–37ms per frame (median 16ms).

## Pipeline
1. Static layer `ren_static`: First draw the room on the original canvas, and then use `filter: blur(1.3px)` to draw the entire layer into the cache, which is equivalent to doing sfumato on the entire screen. Room contents are as follows:
   - Wall: P.texture #43321f→#22180e, add a radial gradient of the window halo, and darken the top.
   - Window: Semi-circular arch window, the left side of the stone frame receives light, and the window hole is a distant view.
   - Floor tiles: see through chessboard. Calculated according to the true projection: `y = 420 + f·h/Z`, `x = 960 + f·X/Z`, f=1029, h=5.75, Z is 1.4 per brick from 16 forward. The first line falls at y=790, followed by 825/868/922/989, which matches the line spacing of the original film. The floor tile colors are #a88c64 and #5c2418, layered with a soft-light light pool and a darkened radial gradient (centered at 760,960).
   - Square table with white cloth and ladder-back chairs.
2. Distant view (air perspective): Draw a three-story mountain, the farther away the bluer and lighter it becomes (#9fb4b8 → #7d9294), the outline is generated with fbm. Then there are lakes, river valleys (transitioning from gray-green to warm ocher), meandering silver-white rivers (width increases from 3 to 16px with distance), cypress and round trees, and stone bridges.
3. Draw each frame in sequence: broken light on the river surface (24 light points moving and flashing along the river) → flying birds → ornithopter (all three are cut in the window opening) → characters layer → light beams and floating dust → cover layer.
4. Overlay `ren_over` (drawImage once after caching):
   - Vignetting: α0.3 at 0.55, α0.8 at edges.
   - Yellow glaze: α0.07.
   - Canvas latitude and longitude: one line every 3px.
   - Oil paint stroke texture: 9000 strokes, α0.022/0.028, line width 5–10, random direction.
   - Craquelure: P.craquelure takes α0.32; then use `brightness(0) invert(1)` to turn it into a white line, stagger 1px, α0.16, `lighter` and overlap it again to simulate the bright edge of the patent leather.

## Sfumato
Characters are first drawn into the off-screen layer `renChars`, and only the area (320,180,1200,780) is processed. Draw back to the main screen in two passes: first make `blur(2.6px)` fully opaque, and then stack a clear layer of α0.38. This way the edges are soft and the facial features are still recognizable. characters do not draw lines, all rely on gradients to create volume:
- Skirt pleats: bright pleat rgba(200,70,60,.3), dark pleat rgba(40,0,0,.45).
- Velvet Sleeve: Draw a light band of rgba(170,200,140,.45) along the direction of the bone.
- Face: Gradient light on the left side, add eye socket shadows.

## Motif animation
- Ornithopter: 0–1.35s from x=470 to 740 while floating up and down with slight pitch. The two bat wings flap according to `up = 0.5+0.5·sin(t·12+phase)`, and the wing tips are between −118 and +24px. The far wing is shrunk to 0.78 times, the color is darkened, and the phase is shifted by 0.5. The drawing method of the wing: leading edge beam + 6 radial ribs + scalloped trailing edge membrane, and the tail rudder is also swinging. The first version was a two-dimensional "paper airplane" that was unrecognizable as Leonardo da Vinci's ornithopter. It was only after it was redrawn into the current ribbed fan-shaped wing that it became recognizable.
- Light pillar: The wedge is drawn into the cache at once and made `blur(28px)`, superimposed on the screen every frame. In the first version, each frame is directly filled with polygons, and the two hard edges are very fake. Dust is 46 particles that slowly rise and flicker along the light beam.
- The girl sips from a silver cup according to the choreography, and closes her eyes when cup>0.7. The cat kept squinting and smiling, and its tail was wagging.

## Pit
- The first version of oil paint texture uses 26000 strokes, α0.05, and the direction follows noise. As a result, the whole wall looks like Van Gogh's vortex (post-impressionism). After reducing it to 9000 strokes, α0.025, and random directions, it returned to the feeling of classical oil painting.
- The inner outline of the cat's body is darkened using 26px and α0.45. The milky white body looks like a glass cover. Change it to 14px, α0.22, and use a radial gradient on the white chest to "bloom" the orange fur in, leaving no hard border.
- The first version of the floor tiles is too bright and contrasting, like a vector illustration. The surroundings must be darkened, leaving only the pool of light illuminated by the window light.

## v2 rework (review: quiet 0.20 vs 0.46; the protagonist is blurred, the window is clear, and the depth of field is inverted)
- Sfumato changed to: blur layer 1.6px (original 2.6), clear layer α0.82 (original 0.38). The soft edges are retained, and the facial features and contours are clear.
- The ornithopter magnification is 1.6 times, the range is 440→790, and the pitch amplitude is ±0.07; the number of birds is increased to 14, and the magnification is 1–1.8 times.
- Cat: head tilted around the neck ±0.16rad, squinting alternately, tail ×2.2, breathing ×3, look and turn head left and right. Girls: hair swing ±11px, sip ×1.6.
- Cloud shadows outside the window pass over the river valley; the brightness of the light beam changes with 0.75±0.35 as the "clouds pass through the sun"; there are 70 floating dust particles.
- Still segment frame difference: 0.20 (review criteria) / 0.30 (our measurement) → 0.37. Original film 0.43.
