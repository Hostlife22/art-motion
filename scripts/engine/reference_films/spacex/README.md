# SpaceX narrated-animation reference code

Scene-code snapshots for four approaches: mixed styles, whiteboard, Vox collage, and a cartoon presenter. Use them to learn and adapt shots, narration-keyword timing anchors, and layouts. This is not a complete standalone renderable demo or the complete project behind the latest public film.

- `spacex/tm.js`: `TM.cue(segment, 'source substring')` attaches an action to a narration keyword. `timing.js` contains timing data for this example; replace it for a new topic.
- `spacex_wb/common.js`: content framing with `fit/declip/shot`, stroke scheduling with `build`, and stroke-order reveal with `so/soAt`. English letters use the existing zigzag reveal fallback; digits have local stroke paths.
- `spacex_vox/common.js`: accumulated desktop with `item/drawWorld/camEnd`, inserted shots, and occlusion registration.
- `spacex_lin/common.js`: presenter frame changes, foot anchors, cross-segment poses, and header. `tools/prep_presenter.py` demonstrates cutting frames from a green screen.
- `eras_*.js`: four segment tables; `transitions/`: their accompanying transitions.

## Usage boundaries

1. Copy the parent `scripts/engine/` into your project first, then place the selected film directories, segment tables, and transitions from this snapshot in the corresponding locations at your project root. The whiteboard table remains named `eras_wbx.js`; its asset paths consistently use `spacex_wb/`.
2. Presenter sprites, mixed-version character frames, source image-generation prompts, and narration audio are not distributed in this snapshot. `presenter_meta.js` provides the frame-table structure only. Regenerate assets and metadata for your own characters; a frame table does not imply that the assets are present.
3. Use the parent engine's `lib/fonts.js` and bundled fonts. The original assigned LXGW WenKai to Vox body text and CMU to typewriter digits; in this English edition, legacy CJK font aliases point to bundled Latin fonts. Preprocessing scripts require `numpy` and `Pillow`. Before running `make_hand.py`, provide your own `hand_raw_1.png` through `hand_raw_3.png` in its directory.
4. Example text and numbers are historical creative material, not current SpaceX facts ready for citation. Verify a new script independently and rebuild the narration timeline.
5. To run a complete demo first, start with the parent `demos/` or `clips/`.

## Third-party stroke data

The original `spacex_wb/assets/strokes.js` contained a subset of stroke-centerline `medians` from hanzi-writer-data 2.0.1 / Make Me a Hanzi, wrapped as a browser variable, without original glyph outlines. Its ideographic entries were removed for the English edition; `window.WB_STROKES` is now empty. The whiteboard retains its local digit paths and zigzag letter-reveal fallback. The original derived data is covered by the Arphic Public License, whose text remains in `assets/ARPHICPL.TXT`; it is outside this repository's MIT license.

Upstream: https://github.com/chanind/hanzi-writer-data/tree/v2.0.1
Original data item: https://github.com/skishore/makemeahanzi
Original license text: https://github.com/chanind/hanzi-writer-data/blob/master/ARPHICPL.TXT
