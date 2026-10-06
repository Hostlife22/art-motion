# 01_cave · 40,000 BC Cave Petroglyphs (Pure Code)

File: `scenes/01_cave.js` (~330 lines). Final performance: warm max 22ms / mean 21.1ms, cold (cache creation) is completed when the engine boots; deterministic pass; 0.2↔0.7s motion difference 3.9% pixels.

## Pipeline
1. **Rock wall (all cached, `cave_relief`/`cave_bg`)**
   - Half-resolution 960×540 calculated height field: `fbm(x·0.0022,4oct)·1.0 + fbm(x·0.011,3oct)·0.16 + noise(x·0.05)·0.03` (coordinates use full-resolution pixels).
   - Finite difference × 52 is used to obtain the normal, light source L=(-0.55,-0.62,0.56) (upper left), `shade = clamp(0.5+(dot-0.56)·0.9)`; the background color is mixed between `#ce925a` (bright ocher)/`#6e4426` (dark)/`#b6643a` (erythema) with two layers of low-frequency fbm, and then ×(0.72+shade·0.55). Zoom to full screen with smooth interpolation → smooth undulations.
   - Stack two layers of `P.grain` (dark 0.22 density α0.32, light 0.10 α0.28) to produce particles; 10 random walking cracks (each step turning angle ±0.45rad, step length 14–40px, 12% bifurcation probability), and a bright line with a +1.6px offset under the deep line → scratch feeling.
   - Vignetting: radial gradient r 260→1180, outer ring α0.8; central static warm light uses lighter (α0.36) to illuminate only the rock wall.
   - **Trouble: If the mid-frequency term coefficient of relief is large (0.35, ×60 normal), the entire wall will become a camouflage/sand dune, and the characters will look like camouflage clothing after being overlaid with textures**. The intermediate frequency is reduced to 0.16 and the normal ×52 before it looks like a rock surface.
2. **"Pigment eats into rocks"**
   - All graphics are drawn in the same way `shape()`: first trace it with **fuzz pattern** (sparse charcoal dots, width 2lw+7) → then trace it with** ink pattern** (carbon black, 7% random holes + noise >0.58 large holes, width 2lw) → and finally fill it flatly to cover the inner half circle. Effect = solid charcoal line + sprayed burrs, and painter order naturally handles occlusion (the line where the arm covers the coat).
   - Charcoal "boiling": two 256 patterns are randomly translated once every 1/9 s using `pattern.setTransform`. The geometry does not move and the particles are jumping. It is less expensive than the dithering path and does not deform.
   - After the entire paint layer is painted, `source-atop` is stacked with one `cave_figtex`: rock surface shadow → black α(0.5-v)·150, light → warm white α(v-0.5)·50, dark/bright particles, low-frequency dry and wet spots α≤70. **The paint layer is only composited once full screen**, so 19ms.
   - The coloring is all opaque and flat, and the color is "dirty" by the texture; do not use multiply to stack the paint - the chalk (cat's white) will disappear.
3. **Negative handprint/paw print**: 320² temporary canvas Gaussian spray points (σ46·s 3200 points α0.15–0.6 + σ28 1400 points), then `destination-out` a solid hand-shaped mask, and finally fill the mask α0.3 with `#f6e2bc`.** The hand shape must be filled into the mask piece by piece**: addPath the palm ellipse and finger capsule into a Path2D and fill it once, and the sub-path will go around to the opposite direction and offset by nonzero, resulting in a gap (stepped on r4).
4. **Fire**: One layer of radial gradient for each frame, center (1000+40·noise(t·3.1), 540+26·noise(t·2.3)), intensity `0.13+0.09·noise(t·8.5)+0.04·sin(21t)`,** synthesized with overlay** (α=intensity×2.6). The outer ring is laminated with a layer of dark corners that breathe in the opposite direction with the firelight. Trap: When I started using lighter, the girl’s blonde hair and animal skin were washed to pinkish white and lost ocher saturation. After changing to overlay, the color came back.
5. **Embers**: `P.particles` three groups (left 0–360 ×11, right 1540–1920 ×12, middle ×5), y drift from 1110 to 120, life 5.5s; bright core r 2.2–4.6 + 3.2x halo, `|sin(6t+1.9i)|` flash, `sin(q·π)` Fade in and out, lighter synthesis.

## Motif animation
- **Two postures of bison/horse**: `ph = floor(t·60/7)%2` (changed every 7 frames), two sets of coordinates of the end points of the legs (stretch/tighten), head around neck point ±0.07rad, overall y alternation -3/+1px; horse and bison are inverted. The legs are only made of charcoal thread (as in the original film), and the body is a filled silhouette + a 22px dark blend on the back (Lascaux-style shading).
- **Holding Cup**: The trajectory of the cup without using RIG (tabletop → mouth, the tabletop point is on the girl's chest, unlike the original film "holding it in the air with outstretched arms"). Customized: `hold=(1084,506)` → `mouth=HP(1224,380)`, progress `k = choreo(max(0,lt-0.95)).cup` (the choreo curve is shifted as a whole by 0.95s, and the toast starts from frame 58 of the original film), `RIG.ik2(G.A.shoulder, cup+(34,10), 170,128,-1)` is used for the arms; `RIG.girl({cup:k})` is still responsible for the head tilt back and the slight tilt of the drink. k goes to 1 at lt≈1.85 (end of T01 transition).
- **Hot**: Three charcoal lines `x0 + sin(13q − 11t + 1.3j)·6`, height 58px, follow the cup.
- **Cat**: RIG.cat's head/eyes/nose/earInner/stripes/tailPts anchor point + self-drawn pear-shaped body, white chest, white front legs, thigh arc; tail = fuzz/ink/ orange three-layer stroke + one horizontal stripe every 4 sampling points; blink from choreo.blink.
- **Cat size (review and repair)**: RIG.cat The original size of the ear tip is at y≈535, pushing into the bottom edge of the mural frame (550). The whole cat uses canvas transformation to shrink the cat by 0.86 with the sole of the foot (540,905) as the anchor (translate→scale→translate, RIG.cat itself is still s=1), the tip of the ear falls to y≈582, leaving about 30px with the bottom of the frame, and the sole of the foot does not move. The line width then becomes ×0.86, no difference is visible.
- **Title**: `Kalam-700` 78px letterSpacing 7, horizontally scaled to 930px wide, `#9b2a18`, drawn into the paint layer (also eating the rock surface texture). α = t<0.933 ? 1 : 1-(t-0.933)/0.2.

## Motion rework (review caliber: static segment frames 21–84, 480×270 frame-by-frame average frame difference)
The reproduction is 0.62 vs the original film is 0.86, which is quieter. Only add local actions, do not rely on full-screen flashing:
- Fire: intensity `0.14+0.11·noise(9.5t)+0.04·sin23t+0.03·sin37t`, center shift ±60/±36px (original ±40/±26). If I tried larger values ​​(±0.16, ±90px), it would rush to 1.22, causing the screen to shake and call back.
- Embers 28→49 (left 20, right 20, center 9), bright core r 2.6–5.4, halo α0.32, 3.6 times, flash `0.3+0.7|sin|`.
- The handprints flicker on and off: Each handprint is stacked with a warm radial gradient (lighter) of r=105, α=0.2·clamp(0.5+0.9·noise(7t+3.7k)), and each has an independent phase.
- Bison/horse bump ±3 → up and down 9px, left and right ±3px, head swing ±0.12rad.
- Small movement of the cat head (frames 65–81 of the original film): lt 1.08–1.35 with `sin(πq)` envelope, head rotation around the neck point (596,680) −0.16rad, RIG.cat look push 1.5, ears 60Hz slight jitter ±0.06rad.
- Result: **0.62 → 1.06** (original 0.86); max 22ms per frame.

## The modernization of girls
Red ocher `#9c3520` silhouette (face/neck/arms/calf), leaving only one almond eye on the profile (off-white eye white + black pupil + one eyelash, blinking into an arc) - this stroke is the key to the "girly look"; use yellow ocher `#cf8f2c` to fill the blonde hair + 6 `#6e3c0e` wavy hair (amplitude increases with length), the outline is also wavy; the lower part of the hair gradually does not rotate with the head (HB function) to prevent the entire hair from shaking when you raise your head while drinking water. Knee-length animal skin coat = G.torso + self-drawn hem (one ±16px jagged edge every 15px), `#b06a2c` + 26 "round spots + 7 small dots" leopard spots + 18 short yarns, the seams are covered by "tracing the edges of two pieces first and then filling them together".

## Swatches
Wall `#ce925a/#6e4426/#b6643a`; charcoal `#21150d`; red ocher `#9c3520`/dark `#74261a`; yellow ocher (cat) `#c9772f`; blonde `#cf8f2c`/`#6e3c0e`; hide `#b06a2c`/spotted `#4e2610`; chalk `#f0dfbf`; bison `#8c3d22`/head `#76301a`; Horse `#cf8236`; Stone `#c98c50`/`#c08048`; Desktop `#d49a5a`; Handprint `#8e2a1a`; Ember `#ffe082`.

## Still can be improved
- The girl's body is a realistic curve from RIG, which is "too smooth" than the real rock painting human figure; the more original method is to downsample the outline points to 12-16 and then increase the hand-painted dithering.
- The rock wall relief is static, and the firelight only changes the brightness but not the shadow direction; if you really want "the rock surface is undulating under the beating of firelight", you need two shade images with different light directions to be interpolated by firelight (+1 full-screen synthesis).
