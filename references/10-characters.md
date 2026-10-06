# 10 · Characters: generate human frames and animate them with code

## Three implementation approaches

The same character can be implemented in three ways. The rendered comparison in `assets/characters/milo-character-comparison.jpg` shows code geometry and generated sprites in Kurzgesagt, Vox and whiteboard scenes.

- **A: Draw with code.** Suitable for geometric characters, pose prototypes and motion references; complex faces are harder to reproduce.
- **B: Use a fixed frame library.** Keeps identity consistent, but the library must fit the scene's visual style.
- **C: Generate action frames for each style, then composite.** Use reference images to preserve identity; code controls timing, placement and materials.

Use B or C for human and anthropomorphic characters. Geometric characters can remain procedural. Style cards record the limitations of each approach.

## Milo's identity

Milo is a young traveler with short dark brown curls, expressive brown eyes, a yellow zip-front jacket, navy trousers, cream sneakers and a small teal backpack with brown straps. Keep these features and his proportions consistent across poses. The canonical reference and style atlases are in `assets/characters/milo/`; the saved generation prompts are in that directory's README.

## B: Use a fixed frame library

- Prepare transparent PNG frames, typically eight per action. The long-scroll demo includes walking and action libraries in three styles.
- Load frames at startup and select them with a rule such as `floor(t*9)%8`: limited animation, without interpolation between silhouettes.
- Anchor each sprite at the center of its feet; `face=-1` or the renderer's flip flag mirrors it horizontally.
- Apply the scene's materials: white paper borders and shadows for Vox, or source-atop brush strokes for painterly styles.

## C: Generate frames in the scene's visual language

1. **Generate from a character reference.** Specify the rendering grammar, rather than only an artist's name: flat shapes and two-tone shading for Kurzgesagt; grayscale clippings with paper borders for Vox; black marker lines for whiteboard; short reflected-light brush strokes for Monet. A reference-image workflow is also described in the original author's [image-generation project](https://github.com/alchaincyf/huashu-gpt-image).
2. **Match the pose to the staging.** For example, face right and point right. For motion, use a sprite atlas with equal cells, consistent body scale and enough space around each figure. Specify key poses and the order of walking phases. Keep Milo's curls, jacket and backpack visible.
3. **Use genuine transparency.** When a workflow requires chroma key, use green `#00B140` and protect light clothing from spill. Verify that generated files exist and that the alpha channel separates the subject cleanly.
4. **Extract and validate frames.** `scripts/install_milo_sprites.py` reads atlas alpha bounds, extracts cells with FFmpeg, and recalculates foot anchors and standing heights. For other inputs, `scripts/key_split.py` removes green spill and splits columns; `--white` preserves line-art backgrounds for multiply compositing. `scripts/key_green.py` retains original image coordinates.
5. **Composite with code.** Position, size, orientation, frame changes and materials belong to the renderer. Draw stones, ripples and other interactive props in code and align them to measured hands and feet.

## Procedural characters and motion references

Blocks, terminals, robots, birds, cats, silhouettes and minimal figures can be drawn with code. `lib/rig.js` supplies the girl/cat skeleton; `lib/rig_milo.js` supplies Milo's forward-kinematic poses and joint anchors. `HERO.geo` provides the geometric traveler and `TOON.bean` the storytime version.
