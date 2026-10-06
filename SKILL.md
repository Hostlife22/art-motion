---
name: art-motion
description: "Art and video animation: break down and recreate animations; draw and animate 35 art styles with code; use 9 explainer grammars, including 8 parameterized clip formats; reference code for narrated films, framing checks, and AI-generated character frames."
---

# Art & Motion

## Your role

You are the director, storyboard artist, illustrator, animator and editor. You draw with code. The finished film must immediately evoke its artist or era, and each painting must come alive.

This skill grew from a code recreation of Tak's (@cherry_mx_reds) 15-second Art History Speedrun on 2026-10-04, covering 16 eras. Its reusable methods cover animation breakdown, new art styles, designing one frame before animating, and coherent visuals driven by narration.

## Route the task

All numbered guides below are in `references/`.

| Request | Workflow | Read |
|---|---|---|
| Recreate or break down this animation | Breakdown → mechanics → code recreation | 01 → 02 → 04 |
| Make an animation in a particular artist's style | First frame → renderer → living painting | 03 → 04 → closest card in `references/style-recipes/` |
| Animate my narration | Shot list → style → world canvas and camera → visual track | 06 (draft) + 04; use your video pipeline for transcription and timing |
| Add music or synchronize beats | BPM grid, a motif played by different instruments, ending effects | 05 |
| Include Milo, a real person or an anthropomorphic character | AI-generated frames and code compositing (approaches B/C) | 10 |
| Assign or implement a new style | Interface, starting points, requirements and self-check | 08 + `references/style-recipes/INDEX.md` |
| Make someone walk through paintings or worlds | Long-scroll skeleton: one file per world, left-to-right travel, style changes at boundaries | 11 + `scripts/engine/demos/long_scroll/` |
| Make a technology, finance or explainer animation | Choose a grammar for the narration, use its card and libraries, render a timed clip with `render.py --spec` | 09 + `references/animation-grammars/<grammar>.md` |

For a full narrated film, first read `references/12-narrated-films-and-feedback.md`. For presenter-led explainers, also read `references/animation-grammars/y6_presenter_explainer.md`.

## Five-layer mechanism

A fixed scene structure × a living painting in every scene (main action and motif loops) × transitions in the next style's signature language × an accelerating beat grid × a continuous narrative anchor and character joke at the end. These mechanics transfer to new subjects.

## Production requirements

- **Every scene moves.** Include at least one main action and two motif loops. Measure frame differences, excluding the first 0.35 seconds of transition-related camera movement.
- **Draw scenes and styles with code; generate human character frames with AI and composite with code.** Canvas draws scenery, objects, camera movement and transitions. Existing or generated sprite frames provide real people and anthropomorphic characters; code controls placement, size, timing and materials. Geometric characters may be drawn with code. See `references/10-characters.md`.
- **Recreation teaches mechanics.** Extract scene, motion and transition rules, then apply them to new subjects.
- **Explore three directions.** For a new character interpretation or style direction, show three versions of the same frame for selection, even when a style has been specified.
- **Use deterministic randomness.** Seed every random operation; two renders at the same timestamp must match pixel for pixel.
- **Review films independently.** Before delivering a finished film, have an agent who did not produce it watch it and identify problems.
- For characters who are minors, use modest, age-appropriate clothing. The original workflow used long garments and avoided prompts that caused image-generation review failures.

## Recipe cards are starting points

`references/style-recipes/` contains 35 tested cards: 15 historical styles plus ink painting, Klimt, Munch, Dunhuang, Kusama, Constructivism, Dali, Hopper, Ghibli, vaporwave, Kirby comics, Monet, Seurat, Matisse, Haring, Rembrandt, rubber hose cartoons, shadow puppets, Shinkai and Picasso's Blue Period.

The index records each style's current quality and limitations. Improve those limitations when using a style again. Build a better renderer when appropriate and compare it alongside the reference. Add a recipe card after completing a new style.

## Project structure

`scripts/engine/` is a portable animation project: engine, transitions, drawing libraries, character rigs, 35 scenes and renderer. It also includes eight explainer demos in `demos/`, parameterized clips through `clip.html` and `clips/`, a three-world long-scroll demo in `demos/long_scroll/`, and a runnable Milo pixel adventure in `demos/milo_pixel_adventure/`. Narrated-film snapshots in `reference_films/spacex/` require your own character assets and audio; read that directory's README.

Start a new film by copying the engine into `<project>/animation-project/`, editing `eras.js`, and writing `scenes/<id>.js`.

```sh
E=animation-project
uv run --with playwright python "$E/render.py" --solo 09_postimp --stills 0,0.3,0.6 --out renders/09_postimp
uv run --with playwright python "$E/render.py" --out film.mp4 --audio music.wav
uv run --with pillow python "$E/compare.py" --a reference.mp4 --b film.mp4 --times 1.5,2.0 --out comparison.jpg
uv run scripts/analyze/breakdown.py --video reference.mp4 --out breakdown/
```

Fonts are bundled in `scripts/engine/lib/fonts/`; their licenses are listed in `LICENSES.md`. English rendering uses Latin fonts, with legacy family aliases kept for compatibility. Dependencies are [uv](https://docs.astral.sh/uv/), ffmpeg and Playwright Chromium. Install the browser once with `uv run --with playwright playwright install chromium`.

## Acceptance

Before delivering a film, run `uv run scripts/qa.py --project <project>` for determinism, frame cost, motion, smoothness and text-framing clues, and obtain an independent viewing review. For a film with a light, untextured background and no burned-in subtitles, also run `uv run --with numpy python scripts/subzone_gate.py film.mp4` to check whether graphics enter the subtitle area. Read `references/07-proven-practices.md` for prior evidence.

## Feed findings back

After each film, add new styles to `references/style-recipes/` and update its index. Record successful practices in `references/07-proven-practices.md` with the method, evidence, reason and conditions for reuse. Add pitfalls to the relevant reference and an entry to `CHANGELOG.md`. When implementation and documentation disagree, verify the implementation and correct the documentation.
