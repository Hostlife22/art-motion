# Milo character assets

Milo is an original young traveler: dark brown curls, expressive brown eyes, a golden yellow zip-front jacket, navy trousers, cream sneakers, and a small teal backpack with brown straps. These identity features remain consistent across styles. His default design has uncovered hair and eyes.

The sprites and banner were created with the built-in `image_gen` tool. No fallback CLI was used. The canonical reference is `flat-atlas.png`; the other atlases use that image as their identity reference.

## Saved prompt set

Common sprite requirements: full-body Milo, consistent proportions and clothing, genuine transparency, isolated figures within equal grid cells, ample gutters, no labels, text, borders or ground shadows.

- **`flat-atlas.png`**: a 2×2 grid. Top left: three-quarter view facing right, pointing right, smiling. Top right: waving. Bottom left: both arms raised in celebration. Bottom right: the pointing pose in black marker line art. Clean 2D illustration with restrained two-tone shading; curls, yellow jacket and small teal backpack in every pose.
- **`monet-atlas.png`**: a 4×4 grid facing right. First eight cells: a full walking cycle, alternating legs with contact/down/passing/up phases. Final eight: neutral, throw windup, release, follow-through, recovering balance, relaxed arms, delighted looking up, neutral. Impressionist oil-paint strokes with light blue and cream reflections; preserve the identity colors. The scene code draws the stone.
- **`egypt-atlas.png`**: the same walking-cycle layout. Final eight: neutral, surprised looking up, beginning to bend knees, crouching, crouched with hands protecting the head, standing back up, looking back, relieved. Warm ochre pigment and dark brown lines for a mural setting; retain Milo's modern clothing and curls.
- **`pixel-atlas.png`**: the same walking-cycle layout. Final eight: neutral, jump preparation, launch with a raised fist, apex punch, falling, landing, looking up, cheering. Crisp 8-bit pixel art, limited palette and hard square edges.
- **`../../showcase/hero.png`**: edit only the upper-left brand line to the exact text `MILO / ART & MOTION`; preserve `art-motion`, all other English captions, the girl-and-cat illustrations, colors and layout.

## Installation and rendering

```sh
uv run scripts/install_milo_sprites.py
uv run scripts/build_overviews.py --skip-gallery
uv run scripts/build_overviews.py --characters-only
uv run scripts/build_milo_showcase.py
```

FFmpeg extracts the sprites from the generated atlases. The installer reads their alpha bounds and recalculates foot anchors and standing heights. It supplies four shared explainer sprites and six eight-frame walking/action libraries. The geometric alternatives are drawn by `HERO.geo`, `MILO` and `TOON.bean`.

Showcase GIFs are rendered from the current Canvas sources. The pixel adventure is a complete runnable demo in `scripts/engine/demos/milo_pixel_adventure/`; the Egyptian, Monet and pixel-world excerpts use `demos/long_scroll/`. The comparison image is also rendered from the working demos.
