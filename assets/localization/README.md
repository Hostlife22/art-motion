# English asset localization

All repository captions, sample text and filenames use English. The gallery and demo sheets are snapshots of the localized Canvas sources. Character identity and attribution are documented in the root README.

## Saved assets

| Asset | Method |
| --- | --- |
| `../showcase/hero.png` | English captions and Milo branding created with the built-in `image_gen` tool |
| `../characters/milo-character-comparison.jpg` | Rendered from the working Milo demos, saved as JPEG |
| `../characters/milo/*-atlas.png` | Four transparent Milo sprite atlases generated with the built-in `image_gen` tool |
| `caption-sheet.png` | English pixel-caption artwork generated with the built-in `image_gen` tool |
| `pixel-caption.png` | English pixel-caption artwork generated with the built-in `image_gen` tool |
| `../showcase/{mario-claude,mario-combo,mario-pipe,egypt,monet,pixel}.gif` | Canvas rendering with Milo sprites, then FFmpeg GIF encoding |
| `../all-styles-overview.jpg` | Rebuilt from all 35 Canvas art scenes |
| `../animation-grammars/*_overview.jpg` | Rebuilt from all eight demo films |
| `../long-scroll-overview.jpg` | Rebuilt from the three Canvas worlds |
| `../../scripts/engine/examples/assets/*.png` | Rebuilt with the finance-chart clip grammar |

The English-only localization initially preserved source GIF timing. The Milo edition subsequently rebuilt all six showcase GIFs from current Canvas sources, keeping their display dimensions and infinite loops. Their current durations are documented with the showcase and sprite assets. Historical decorative motifs remain part of the artwork.

## Prompt set

The following specifications record the earlier English-localization workflow. Milo's current character, banner and sprite prompt set is documented in `../characters/milo/README.md`. No fallback CLI was used.

### Showcase banner

Use case: text-localization. Replace all Chinese text with English while preserving the dark editorial layout, illustration panels, characters, colors and typography hierarchy. Preserve the title `art-motion`. Use these captions verbatim:

- `MILO / ART & MOTION`
- `ART ANIMATION · OPEN SOURCE SKILL`
- `Let your coding agent turn art styles into living paintings.`
- `Ghibli watercolor / afternoon light and a cat`
- `Egyptian mural`
- `Van Gogh oil painting`
- `Dunhuang mural`
- `Pop art comic`
- `8-bit pixel art`
- `35 art styles · 9 explainer grammars`
- `Every frame from a working demo`

Final correction: change only the first bottom thumbnail caption to `Egyptian mural` and the third to `Dunhuang mural`; preserve the remaining artwork and text.

Project-name edit (built-in `image_gen`, saved to `../showcase/hero.png`):

> Use case: text-localization. Edit target: the supplied art-and-motion showcase banner. Change ONLY the large main project title in the upper-left heading area to the exact text "art-motion" (all lowercase, with one hyphen). Remove the existing name from that main title completely. Match the existing elegant large serif typography, light cream / pale gold color, left alignment and baseline; the shorter title should leave natural empty space to its right. Preserve all remaining text verbatim, including the top-left brand line "MILO / ART & MOTION", tagline, thumbnail captions and footer. Keep all illustration panels, characters, background, framing, spacing and overall layout unchanged. English text only, no new text or symbols.

### Character comparison

The current comparison is rendered directly from the three working explainer demos, with code geometry in the top row and Milo sprites in the bottom row. The earlier image-editing pass used these layout labels:

- `Milo character · two directions (same frame: Kurzgesagt / Vox / Whiteboard)`
- `A · Minimal geometry (drawn with code)`
- `Dark curls, yellow jacket and a small teal backpack. One character, adapted to each style; animated frame by frame.`
- `B · Generated Milo sprite frames`
- `One traveler, with style-specific sprites and a shared identity.`
- `CAT 98%`
- `It developed a CAT NEURON`
- `The cat in its mind`
- `A cat!`

### Caption sheet

Generate a clean six-band English caption sheet for compositing into showcase GIFs. Use crisp, readable pixel-style lettering. Bands 1–4 have white lettering on solid black; bands 5–6 have dark lettering on warm cream. Keep each caption centered, with margins around it. No other text, non-Latin writing or decorative symbols. Text, in order:

1. `Choose a subscription?`
2. `This whole level...`
3. `Bricks, pipes, music...`
4. `...is drawn with code, frame by frame.`
5. `Egyptian mural`
6. `Monet · Japanese bridge`

### Pixel caption

Generate the exact text `8-bit pixel game` in crisp dark green pixel-style lettering on a solid warm cream background (#eee9d7), matching a small retro-game date badge. One line, centered, with no extra text or symbols.

## Rebuilding

Rebuild the code-native gallery sheets and chart assets from the repository root:

```sh
uv run scripts/build_overviews.py
uv run scripts/build_overviews.py --gallery-only
```

To rebuild the current Milo showcase, render its working demos:

```sh
uv run scripts/build_milo_showcase.py
uv run scripts/build_milo_showcase.py --only pixel
```

Generated artwork may have small illustration differences from the source reference. The comparison sheet and banner are promotional visuals; the Canvas overviews show actual rendered output.

## Validation

- A source comparison found that the first translation pass had left 231 fragments empty in 16 files. These have been restored from the original archive, together with three partially truncated technical descriptions. The SpaceX reference README now includes its code map, usage boundaries, asset requirements and third-party data notice.
- All 396 original files have corresponding files in the English edition, including the restored `.gitignore`. Source hashes, destination paths and restoration counts are recorded in [source-audit.json](source-audit.json). The root README also preserves the original development story, acknowledgments and author links.
- `breakdown.py` uses consistent `transitions/`, `motion/heatmap.jpg`, `keyframes.jpg` and `ref/` paths. It was executed on a moving test video and a video with a hard cut; both produced their expected outputs. The comparison utility also produced a contact sheet.
- No CJK or Cyrillic text remains in text files or filenames; escaped Unicode text was checked as well.
- The final Milo audit ran Apple Vision text recognition over all 82 current image files and 617 image/GIF frames, including every GIF frame. It found no CJK text candidates; false recognitions of Latin labels and decorative patterns were reviewed.
- JavaScript syntax, Python syntax and JSON parsing pass. Local Markdown links and heading anchors resolve.
- All 35 art scenes, eight demo films and eight example clip specs render without page errors. Localized caption regions and GIF transition boundaries were inspected.
- The six Milo showcase GIFs are regenerated from the current demos at 20fps, preserving display dimensions and infinite-loop playback.
- All 52 Milo sprites have transparent alpha and valid foot anchors. Character scenes in Kurzgesagt, Vox, whiteboard, storytime and the pixel adventure pass deterministic-frame and text-framing checks; the storytime example clip passes as well.
- Focused QA passes for the localized Vox, kinetic, whiteboard, 3b1b, keynote and finance scenes. Remaining subtitle-zone notices refer to formulas, credits or chart sources deliberately placed in the lower area of standalone demos.
