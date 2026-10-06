# 15_raytrace · 1993 Early ray tracing CGI

Instead of using a 3D engine, we rely on the "shading convention" of 2D Canvas to pretend that it is a renderer.

## Plastic coloring (go through each part)
`plastic(c, path, base, hx, hy, R)`:
1. Background color filling;
2. Radial gradient with the highlight point (hx, hy) as the center and radius R: 0→white .55, 0.28→white .06, 0.62→transparent, 1→dark purple `rgba(10,0,30,.42)` (edge ​​darkening = volume);
3. Environmental reflection: `lighter` stacks a circle of `rgba(70,150,150,.28)` strokes, width 0.18R, 0.04R to the left - the wall is turquoise, and the reflection is turquoise;
4. A hard-edged white oval specular highlight (0.16R × 0.09R, transparency .85). This stroke is most like 90s Phong.

Use `cyl()` for the limb: a gradient across the normal direction of the limb (dark .25 → white .5 narrow band at 22% → dark .45), then draw a thin white highlight along 20%–75%.
The girl uses RIG.girl's Path2D (long hair), her skirt is replaced with blue plastic cylindrical legs + knee ball joints, and ball joints are added to the shoulders - it has the joint feel of a "toy doll".
The cat body of RIG is a folded line, and the plastic feel will reveal the edges: `RIG.smooth(K.bodyPts)` first and then coloring. The tiger spots were painted with `filter: blur(2px)` as soft stripes "printed under the plastic".

## Scene
- Wall: radial gradient `#7dbcb9 → #64a6a6 → #3f8285`, the light source is at the position of the window; the window's projection `blur(10px)` is to the lower right.
- Outside the window: a pink-purple gradient sky (`#a24cc4 → #df62ae → #f5a08a → #f8c070`), a two-story mountain, a 28×26 pink wireframe grid superimposed on the mountain (the wireframe terrain of early CG), and the top of the snow is a zigzag triangle.
- **Ground**: Pixel-by-pixel perspective chessboard, vanishing point (960,480), `X=(x-960)/dy, Z=1/dy`, grid TX=0.27, TZ=0.00029, 2×2 supersampled anti-aliasing, 35% fog within 140px near the wall. Cache, cold start full game 53ms.
- **Reflection**: The object layer (chair/table/girl/cat) is drawn on the off-screen layer, `translate(0, 2*906); scale(1,-1)` mirror and `globalAlpha .34` are drawn into the ground clipping area; the props are mirrored according to their own ground lines (cone 780, purple ring 846, chrome ball 800), and **first drawn to an independent layer and then overall translucent** - otherwise the 140 small balls of the purple ring are each .34 The overlay will become opaque.
- Glass table: translucent green oval + thick edge + white stroke, a diagonal reflection slides 260px per second.

## Small loop (visible within 0.23s)
- Purple ring: 140 balls are arranged along the ring, rotating at 7 rad/s around the vertical axis, tilting 0.35, and drawn in order of depth (first layer of dark purple base to connect the balls into a tube, and then radial highlights one by one). 0.23s to 1.6 rad, front to side, very noticeable.
- Chrome ball: pixel-by-pixel environment mapping for each frame (reflection vector downward → checkerboard, upward → pink-purple sky + a window light), the u-coordinate of the checkerboard translates with `t*4.5` = rotating; the Fresnel edge is brightened. 104px diameter, <2ms per frame.
- Lens flare (`lighter`): Sun core glow 170px pulsating ±8% at 23 rad/s; 12 starbursts rotating at 1.6 rad/s; horizontal strip light 960px; 5 ghosts (circle + hexagon) arranged along the straight line "Sun → Screen Center", sliding with `sin(t*5)*0.03`.
- Cat's Eye Green: `lighter` radial gradient radius 46px, pulsating at 18 rad/s ±25%.
- Choreo.cup, flick, wink, and heat as usual.

## Pit
- Transition wireframe uses the frame when the new picture first appears to calculate the edge and cache it (`once('edges')`), so the frame with lt≈0 must be complete - don't leave a blank or fade in at lt=0.
- Performance: Hot frame 23ms, cold start 53ms.
