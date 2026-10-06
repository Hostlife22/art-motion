# 04 · Pure code drawing: use Canvas to draw an artistic painting and make it alive

This page is based on pure code drawing: scenes, geometric characters and objects are implemented through programs and style renderers; the frame generation scheme for anthropomorphic characters is shown in No. 10. This page is a summary of the method after completing 16 styles for the first time; the specific parameters of each style are in `style-recipes/<id>.md`.

## 1. Project skeleton (`scripts/engine/`, copy one to open a new movie)

```
index.html loading sequence: lib/fonts → lib/util → lib/paint → lib/rig → eras → transitions → scenes/index → engine
eras.js paragraph table: id, number of eighth notes (eighths), transition {type,dur,delay,cx,cy}, year plate style
scenes/<id>.js One file per segment: SCENES['<id>'] = { draw(c, lt, t) } ← The main workload is here
transitions.js transition library: (c, A old, B new, p, o) → draw a frame
engine.js beat grid → each segment t0/t1; during transition, the old and new segments are drawn off-screen and then handed over to the transition; shot lens impact; year counter (value is only determined by global t)
lib/paint.js noise, textures, hand-drawn boiling lines, style renderer, regional swatches, shared choreo, heat, particles
lib/rig.js characters skeleton: RIG.girl / RIG.cat → each part Path2D + anchor point; drawGirl/drawCat (mode: fill/line); ik2, smooth, taper
render.py Headless Chromium adjusts frame by frame renderFrame(t) → PNG pipeline → ffmpeg 60fps, mixable track; --solo <id> single segment preview, --stills output still frame
compare.py Original film｜Reproduction Puzzle pieces side by side at the same time
```

Rendering speed: 15 seconds at 60fps, full clip in about 90 seconds (M series Mac). Each frame of a single segment is mostly 5–40ms, with the heaviest Van Gogh at 110ms.

## 2. How to draw a style (five layers, benchmark `scenes/09_postimp.js`)

> Five layers is the default order for oil painting/printmaking, which is not universal: **ink** is reversed (paper is the base, ink is only added upwards, leaving a large area blank, without covering it first);** pattern** (Kusama, Bauhaus) is "sprinkle patterns on a flat surface", and the pattern itself is the renderer;** shading** is "first draw a light version and then multiply the light image".

1. **Flat painting draft**: First use solid color/gradient painting to adjust the position and light and shade of a large area (wall, floor, sky, window). This layer determines the composition, but the style has not yet been revealed.
2. **Style Renderer Redraw**: Use the manuscript as the color source, and redraw the entire painting according to the brushwork of that style - Van Gogh's flow field long strokes, Impressionist short dots, mosaic stones, Ukiyo-e color misalignment + patterns, Cubism sectioning, Pop dots, 8-bit low resolution pixel by pixel, light chasing pixel reflection... The renderer determines "whose painting this is".
3. **Small objects in a separate layer**: If small objects such as tables, chairs, vases, and picture frames are mixed in a large area and pass through the renderer together, they will be broken into pieces. Draw alone, use finer parameters alone, `source-atop` is only drawn on itself.
4. **characters**: The same skeleton (RIG), the same set of choreography, changing the painting method - flat painting and then overlaying the fine texture of the style, and finally adding clear outlines and facial features. Characters are the focus of the audience's attention, and they must be able to read who they are.
5. **Moving Highlight**: A small cycle of the era motif (see No. 02). Use continuous time for continuous motion; use 8–12fps for hand-drawn lines to "boil" and give it a hand-made feel.

## 3. Quick check of style renderer (all written in `lib/paint.js` or each scene)

| renderer | fit | key |
|---|---|---|
| `strokes` Flow Field Brushwork | Van Gogh, Expressionism, Oil Painting | The direction field is written by area (wall vertical, floor along perspective, starry sky along vortex); **regional color palette** is more important than color dithering; each stroke is thicker only if it has a dark color |
| `dabs` color point | Impressionism | Short oval pen with warm and cold offset; **not pointillism** (no solid color plate, dots are not large, the painting is Impressionism) |
| Visual mixed color pointillism (29_seurat) | Seurat, Neo-Impressionism | Proportional juxtaposition of pure color plates, equal-sized dots, complementary color dots, light penetration at the junction of light and dark |
| Mosaic (self-written by 04_roman) | Mosaic, stained glass | Layout is counted only once, color flows through the stones each frame; stones are arranged along the contour (distance field contours); stones are 8–28% larger than half-spacing to allow bisectors to cut seams |
| Color registration + pattern (07_ukiyoe) | Ukiyo-e, woodcut, silk screen | The color filling is offset (3,2)px relative to the ink line; the pattern is made of CanvasPattern; horizontal brush marks are blended |
| `facets` section | Cubism, low polygon | Translucent gradient surfaces overlap to create space; triangles are not clipped to make the outline straight |
| `halftone` dot | pop, old print | small tile `createPattern` 10 times faster than point-by-point painting; 45° grid |
| Low resolution pixel by pixel (14_8bit) | Pixel, retro games | 240×135 nearest neighbor enlargement after drawing; limited to 14 color plates; 1px black border for each part |
| Pixel-by-pixel shading (15_raytrace) | Early CGI, plastic, metal | Unified plastic shading (base color + radial dark edge + ambient reflection + hard highlight); ground reflection mirroring |
| Gold foil (05_gothic) | Illumination, icons, decorations | Pixel-by-pixel polishing + embossed dark lines with 1px bright lines; highlights only fall on the "goldenness" mask |
| Sfumato (06_renaissance) | Classical oil painting | Full layer of light blur + translucent clear layer; cracks + canvas texture + vignetting + yellow glaze |
| Variable line width path (10_nouveau) | New art, calligraphy lines, prints | Offset the width on both sides of the dot column into polygons; the silhouette is dyed dark and dislocated at the bottom = thick outside and thin inside |
| Particle pointillism (16_2026) | Contemporary flat illustration | Sprinkle dots within the shape, density is a function of position; static full-in cache |
| Brush whitening + ink halo (17_ink) | Ink, calligraphy, oriental freehand brushwork | The brush tip rises and falls, and samples are equidistant along the arc length to make whitening; `filter='blur()'` spreads (confirmed under Chromium); the paper is the bottom, and the ink is only added upwards |
| Long curved streamline pen + warp by row (19_munch) | Expressionism, sense of flow | Long pen that walks 20-30 steps along the flow field; sinusoidal displacement of the entire frame by row (margin ≥ maximum displacement to prevent leakage) |
| Watercolor wash and dye (25_ghibli) | Ghibli background, watercolor | Transparent color overlay + water mark edge; water mark stroke α fades out with expansion |
| Grayscale photo dots (22_constructivism) | Constructivism, old newspapers, photo collage | Fixed point path according to brightness, 45° grid, batch into a path and fill once |
| Dual versions of light and shadow cropping + long shadow cutting (24_hopper, 23_dali) | Hopper, surreal, strong light scenes | Draw the light version and dark version once each, press the light block clip; use shear affine for the shadow |
| VHS channel split post (26_vaporwave) | Vaporwave, retro video | RGB dislocation, scan lines, tracking noise bands as post overlays |
| Multiply the entire light map (32_rembrandt) | Chiaroscuro, night scene, candlelight | Draw the light version first, then multiply a light map (window light + candlelight radial) |
| Celluloid hard shadow band (35_shinkai) | Japanese animation, Makoto Shinkai | The component minus the translation = hard shadow band; bright edge by light |
| Step frame rate `stepTime(t,fps)` (33_rubberhose, 34_shadowpuppet) | Old animation, shadow puppets, stop motion | 12fps/10fps A meal is half of the style, not a lag |

## 4. Characters: The same skeleton, more than a dozen painting methods

- Don’t overwrite the skeleton coordinates: take an AI setting draft (or any reference picture) and stack it on a 20px grid, read the key points part by part, and smooth it with Catmull-Rom into Path2D (`RIG.smooth`). The girl with the handwritten coordinates on the first page looks like a boy. After measuring and reading, she can tell that she is a 17-year-old blond girl.
- It is most natural to hide your legs in a long skirt while sitting; use two-bone IK (upper arm 165 / forearm 122) for the end cup, and keep the elbow pointed downward.
- Anchor points `G.A` (top of head, forehead, neck, chest, waist, knees, hands...) add clothing to each style: Egyptian wide collar, Gothic halo, Ukiyo-e Shimada updo, Bauhaus knuckle disc, Pop big waves.
- Each style can perform stylized deformation of the skeleton (Egyptian side face with front eyes, black painted silhouette, cubism half blue face, pixelation), but the stance and movement rhythm must be consistent with the skeleton - this is the source of "the same pair of characters traveling through time".
- At the end of the performance, such large-scale movements (jumping, lying down, extending claws, exclaiming) do not need to be forced into a universal skeleton: 16_2026 self-built pose library (a set of local key points for each pose, interpolated value by value), squeeze and stretch with the sole of the foot as the axis, and press until the flattest frame turns over.

## 5. Make the painting "alive": action list and measurement method

- Each paragraph must include at least one continuous action of the protagonist (choreo.cup) + 2–4 small loops of motifs. Short segments (<0.5s) should be fast-paced in 15–30fps steps.
- Self-check the amount of motion: render two frames (**avoid the lens impact of 0.35s after the transition**, otherwise the whole screen will be counted as moving) and make a frame difference. The numbers obtained for the first time (0.45↔0.9s after zooming): 2.8% of the cave, 3.4% of Egypt, 6.4% of Rome, 9.9% of Greece; 6.9%, 6.2%, 17.3%, 11.6% of the heat map of the same section of the original film. If it's quiet, add the motif action.
- Keep moving things in focus: people, cats, windows.

## 6. Trampled pits

- **Composite mode**: Patterns `source-in` will clear each other one by one (the whole piece of Klimt's gold robe disappears) - first fill a scratch with the pattern, and then press the silhouette source-in once; `destination-out` will dig out a transparent hole on the canvas, and the video will be black - dig it off the screen before pasting it; you cannot use `source-atop` to stack paper textures/particles on characters (the characters will turn white when covered with paper) - texture layer `destination-in` silhouette followed by `multiply`.
- Self-drawn glyphs: Two reversely detoured strokes in the same path will offset the holes according to nonzero rules, and each component will be filled separately.
- "Melt" type transition: Let the new picture have round-headed droplets flowing from top to bottom (section `(1-u²)^0.3`). What comes out of the old picture is spikes, not like droplets.
- Press and hold the "visible part" during the transition: there is almost no change at both ends of the inOut easing. A complex signature transition of 0.34s will only read 0.2s, and will be read as a normal erase, giving 0.48–0.5s.
- For translucent laminations such as shadow puppets/paper-cuts, the overlapping areas will become black when multiplied together. The order and transparency of the laminations should be adjusted according to the material.

- Writing `putImageData` directly to the target canvas will bypass the engine's lens impact scaling and transition cropping - write off-screen first and then `drawImage`.
- Use `{willReadFrequently:true}` to read the off-screen context of pixels; use `g.reset()` for each frame, otherwise the lineJoin/state of the previous frame will remain, and the first frame will be inconsistent with the subsequent ones.
- `drawGirl(mode:'line')` stacked on top will draw through the outline of the covered parts (the far sleeve passes through the torso, and the back half of the hat brim passes through the hair). Use `RIG.visibleLines(key, (g, lineColor) => draw it completely once, true line color, box)`: draw it twice with the same drawing method, change the line color to white as a sentinel, and the different pixels in the two times are the unobstructed lines (including the facial features line). Click "Color→Style Texture→visibleLines Fill Lines".
- **Lens impact should be applied to both the old and new layers**: When only editing the new layer, the new layer has not yet been exposed at the beginning of the transition. The frame does not move when shooting. In terms of hearing, "the sound comes first and then the screen" (v1 review volume to drag 0.1–0.17s).
- **Press the whole screen to change the seed at 8fps = flash, not live**: The frame difference between the review volume and the whole screen jump is 18–20, which is larger than the transition. The position of the brushstrokes is fixed, allowing the direction field to continuously change over time (swaying like a flame), and boiling is left only to line drawings.
- Do not change the parameters (stone size, stroke density) separately in the dynamic area - it is just a patch when it is still.
- In coarse-grained styles such as mosaic/pixel, words should be drawn with thick strokes of equal width (each stroke is ≥2 grains wide), and thin fonts will be broken.
- Make small things bigger than you think: Ukiyo-e Wave Claw 22–50px is unreadable, 44–74px is “The Great Wave off Kanagawa”.
- Deterministic: All random seeds are used; the same t must be rendered twice pixel by pixel, otherwise it will flicker during rendering.

## 7. Division of labor (multi-agent parallel painting)

First write `style-authoring-guide.md` (interface, available libraries, benchmarks, hard requirements, reference files, self-test commands, delivery notes), and then dispatch agents according to four eras. The specification clearly states "do not change lib/ and other people's files". Each group is returned in 30–35 minutes, and the notes are directly precipitated into `style-recipes/`. For the first time, all 16 paragraphs were passed in one go, mainly relying on specifications and benchmarks.
