# Milo pixel adventure · GIF clips

These excerpts are rendered from the complete Canvas demo in `scripts/engine/demos/milo_pixel_adventure/`. Milo has dark curls, a yellow jacket and a small teal backpack in every scene.

| GIF | Duration | Dimensions | Action |
|---|---|---|---|
| `mario-claude.gif` | 5.5s | 800×450 | Subscription choice → Claude spark → growth |
| `mario-combo.gif` | 5.3s | 640×360 | Stomp → kick → break the blocks |
| `mario-pipe.gif` | 7.7s | 640×360 | Pipe → green tunnel → coin room → return outside |

The full demo lasts 18.5 seconds. GIFs are silent, rendered at 20fps, and loop indefinitely. Their loops restart at the beginning of each scene.

```sh
uv run scripts/build_milo_showcase.py
uv run scripts/build_milo_showcase.py --only mario-claude
uv run --with playwright python scripts/engine/render.py --film demos/milo_pixel_adventure --out milo-pixel-adventure.mp4
```

The Egyptian, Monet and night-time pixel GIFs are rebuilt from the separate long-scroll demo using the same command. The GIF filenames are retained so existing README links continue to work.
