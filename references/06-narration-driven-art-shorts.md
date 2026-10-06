# 06 · Art short film driven by narration (draft method, to be verified by the first real film)

Goal: Based on spoken expressions and using the selected era or artist's style, create an animation that is coherent between shots and images. For the latest whole-chip method, see `12-narrated-films-and-feedback.md`.

> ⚠️ This page is a solution launched from the engine of Art History Express. **It has not been run on real narration**. After finishing the first one, delete this line and write back the actual measurement.

## The difference between ## and speed pass film

| | Speed ​​pass film | Oral broadcast short film |
|---|---|---|
| Timeline | BPM Grid | Spoken word-level timestamps (word-level timestamps from your transcription tool like Whisper) |
| Style | Change style in each paragraph | **One style throughout** (one artist/one era) |
| Lens | Fixed camera position | There must be lens language: push and pull, pan, cut scene, follow |
| Narrative | The skeleton remains the same, but the style changes | The style remains the same, but the content changes casually |

## process

1. **Oral Broadcast → Shot List**: Cut by sentence, each sentence determines "what is on the screen in this sentence" (concrete object/metaphor/character action/text), and marks the shot type (panorama/close-up/close-up/push/pan) and duration (from word-level timestamps). Show the user the first 5–10 shots before starting.
2. **Defined style = Defined renderer + color plate + line**: Select the closest card from `style-recipes/` as the starting point; if there is no style, write a new renderer according to Section 04, Section 3. One frame comes out first (three-way hard door: the same frame with the same sentence spoken, three styles of interpretation for the user to choose from).
3. **The world instead of the screen**: A spoken-word film needs to cut the lens, so the scene is built into a "world canvas" that is larger than the screen (such as 5760×3240). Each element has world coordinates; lens = viewport (center, zoom, rotation). The renderer acts on the frame drawn in the viewport, and the stroke size is determined by the screen pixels. The strokes will not become thicker when the camera is pushed - this is the key to "the drawing is moving" rather than "the picture is zooming in".
4. **Flow between shots**:
   - Within the same scene: viewport interpolation (push-pull-pan), with ease-in and ease-out.
   - Change the scene: Use the style's own language to make transitions (Van Gogh means the brush strokes are swirling away, Ukiyo-e is the waves, and ink is the blur) - No. 02 layer 3 mechanism.
   - Matching clips: the shape of the previous shot versus the shape of the next shot (cup rim → moon).
5. **Words and spoken word**: Keywords can be written into the picture using the font/writing style of the style (mosaic, calligraphy, neon), and no general subtitle strips will be used; the subtitles will be left to the editing project for another track.
6. **Music**: The grid method of No. 05 is still used, except that the grid gives way to the spoken rhythm (the transitions and musical accents are placed in the blank spaces between sentences).
7. **Acceptance**: Look side by side with the spoken word broadcast to see if each sentence is telling the same thing; whether each shot is moving; whether the style is identifiable at a glance.

## Division of labor with video pipeline

The transcription, timeline, mixing, and delivery of the spoken word go through your video pipeline; this skill is only responsible for the "art animation picture" track, producing a silent MP4 or ProRes, which can be used as a picture track in the editing project.
