# Y6 · Explainer-style financial science popularization

A cartoon presenter connects information across paper, charts, and keywords. Suitable for business history, product mechanisms, and explanations with emotional reactions. Reference code: `scripts/engine/reference_films/spacex/spacex_lin/`. This is grammar card 9; it currently has no standalone parameterized clip or bundled character sprites.

## Must check when starting

- Assign layouts during storyboarding: side-on explanation, full-screen numbers, side-by-side comparison, characters inside a chart, and reaction close-ups. Vary the composition across the film.
- Generate at least full-body and bust framing. Sitting and leaning need actual matching pose frames.
- Explicitly set `x` and `s` on each segment's first `cast` keyframe to prevent unwanted cross-segment inheritance.
- Use `*=` for opacity in nested drawing to preserve the outer fade.
- Drive the header year, subtitles, and segment title from the same time source.
- Run `qa.py` text-framing checks on the first revision; also run `subzone_gate.py` for light-background films without subtitles.

## Frames and actions

Characters use AI-generated frames; code controls their foot anchor, position, scale, and frame changes. Hard-cut poses with a small pop to avoid double images from dissolving different silhouettes. Switch speaking/closed-mouth frames with narration, stop mouth movement during pauses, and use complete gait cycles for walking. Normalize pose height to the median; use bust assets for reaction close-ups instead of magnifying an entire frame screenshot.

Settle numbers when they are spoken. During counting, avoid premature assertions such as “over” or “+”; show emphasis circles after the value settles. Plan the pause after a highlight during scriptwriting and narration recording.

## Reference implementation

`common.js` supplies `presenterFrame`, `drawFigure`, `hud`, `yearAt`, `popK`, and `L.cast`. `prep_presenter.py` demonstrates frame cutting and foot anchoring. `transitions/lin_page.js` turns only the page, allowing the presenter and header to remain continuous across pages.

Known limits: manually review text occlusion and characters clipped by camera pushes. Enlarging full-frame bitmaps in the reference can crop content; prefer a scene camera for new films. Supply your own assets and narration; the card alone is not a complete film template.
