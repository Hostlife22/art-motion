# Orally broadcast the entire film and experience reflux

This page contains common methods used in the production of oral full-length films; it does not contain the author's private feedback files. See No. 09 for the fragment interface, No. 10 for characters, and No. 11 for the long roll demonstration.

## From mouth to screen

First confirm the script, spoken word and verbatim time, and then make a style sheet and highlight list. Action-related keywords (such as `TM.cue` in the reference code), do not write down every time. The camera moves along with the content frame; the subtitle area is a constraint of the camera space and must be moved out of the way when zooming in.

The whiteboards are accumulated on the same large canvas, and the first stroke at the beginning of the block is synchronized with the camera; then the words are sketched inside the block. After creating the artboard with `const B = DG.board(...)`, call `B.line(points, {smooth:false})` for the rectangle to prevent the smooth spline from swelling into an ellipse. The reading time of the complete list is calculated from the completion of the presentation of the last item, and the drawing time cannot be counted as a readable stop.

Vox collage first establishes objects, relationships and cameras, then adds paper textures and decorations. The narrator's film is first arranged in different layouts and scenes. In the later stage, just moving the characters' positions will not make up for the monotonous storyboard.

## Acceptance and freezing

`qa.py` provides certainty, efficiency, dynamics, smoothness and text frame clues. The frame scene can detect text cropping, overlapping words, subtitle areas and near-blank spaces; large decorative characters, etc. may be falsely reported, depending on the corresponding frame. For light-bottomed films, use `subzone_gate.py` to check graphics into the subtitle band; textured bottoms do not apply to this dark pixel threshold.

Before delivery, the film will be independently reviewed by agents not involved in the production, at least two for feature films. Issues are logged with timecode, root cause, changes, and retests; regression of old issues is separated from discovery of new issues. Acceptance is based on specific questions and does not chase the total score. If the same problem persists for three consecutive rounds and both modification methods are invalid, return to the material or engine capabilities; return the upstream script problem to the script for processing.

Freezes code, timeline, mix and subtitles simultaneously when selected by the user. Candidate films and frozen versions are saved in the project and will not be overwritten without confirmation.

## How to return experience to skill

Each round records the phenomenon → root cause → method modification → verification → destination. Write corresponding grammar cards for style-specific questions, number 09 for cross-style methods, number 10 for characters methods, and QA for machine-quantifiable questions. Recurring pitfalls were refined into start-up inspections, and the text rules were reduced after being made into engine capabilities. After modification, let the independent agent verify it and write it into CHANGELOG.

The project's private feedback, personal image prompts, and unpublished materials remain within the project; public skills only accept reusable methods and necessary evidence.
