# 02 · Mechanism: Why “Art History Speed ​​Pass” is so good

This page organizes reusable scenes and movement mechanisms. Any subject (history of science and technology, urban changes, a person's age from eighteen to eighty) can be constructed according to these five layers.

## Five-layer mechanism

**1. A fixed scene skeleton.**  16 eras, the positions of windows, tables, cats, people, and year cards are almost motionless (±40px). Only when the audience's eyes have an anchor point can they see clearly that "the style has changed." Also because the position is fixed, the transition can use the object in the painting as the origin (the mosaic spreads from the cat's position, and the aperture spreads from the cup).
→ Method: First determine the standard composition coordinates, and align all eras to them. There is a set of constants in the code, not separate ones for each section.

**2. Each era is a living painting.**  Stays for 0.25–1.4 seconds, but the picture is always moving: one continuous action of the protagonist (taking a cup and drinking tea) + 2–4 This is a small cycle **taken from the own visual motifs of that era** - rock paintings of animals running in "two postures alternating" (this is the animation of the multi-legged representation of running in rock paintings), Egyptian scarabs pushing the sun, Greek key strips rolling, Roman volcanoes smoking, Gothic gold foil highlights, Renaissance ornithopters, Ukiyo-e giant waves, Van Gogh's starry sky rotating, Bauhaus pointers, and Pop four-square color changing.
→ Method: List "the three most recognizable formal elements of this era" in each paragraph and let them move. The action should be visible within the dwell window (short segments should be fast-paced).

**3. Transition = the signature language of the next era.**  Entering Egypt is the falling of stones/tapestry, entering Greece is the turning of pottery vase rollers, entering Rome is the turning of mosaic bricks, entering Gothic is the turning of parchment pages, entering the Renaissance is the divine light, entering Ukiyo-e is the sweeping waves of Kanagawa, entering seals Elephantism is filled with colorful dots of brushstrokes, Van Gogh is the vortex of the starry sky, Art Nouveau is the organic growth of gold edges, Cubism is the geometric fragments, Bauhaus is the red, yellow and blue geometric rotation and magnification, Pop is lightning + dots, 8-bit is pixelation, light tracing is green wireframe→line-by-line rendering, and 2026 is three-color concentric ring aperture.
→ How to do it: Don’t choose common transitions from the transition library, but grow them from “the most recognizable formal elements of the new style”. Lens shock is added to the first frame of each transition (the scene layer is zoomed in to 1.03, returned to 1.0 in about 20 frames, and the year card is not zoomed) - the feeling of frustration at the beat comes from it.

**4. Beat grid acceleration.**  128 BPM remains unchanged, and the number of eighth notes occupied by each section decreases: 6 → 4×5 → 3×4 → 2×3 → 1×3 → the ending is lengthened to 9+. The speed has not changed, but the listening and viewing experience is getting more and more urgent; the last section is lengthened to make room for the punchline. The transition duration is shortened (0.4s → 0.13s), and the year rolling is also shortened (0.55s → 0.07s).
→ Method: First list the desired duration of each section, round to eighth notes, and then fine-tune the overall length into a regular decrease. All cut points, music attacks, and sound effects fall on the grid.

**5. A continuous narrative anchor + ending characters.**  The year counter is the only continuous thing in the entire film: the value is determined only by the global time. During the transition, the old and new layers display the numbers in the same scroll, each using its own font (petroglyph handwriting of 40,000 BC → reed pen of 1350 BC → … → geometric sans serif of 2026). At the end, the characters are given a meme (the cat claps the cup three times and pushes the cup off the table, the girl exclaims, and the signature is written), and it is fully acted out with preparation, squeezing and stretching, following, and secondary actions - the first 11 seconds are "looking", and the last 4 seconds are "laughing". The funny point makes people repost it.

## Supplement (2026-10-04 migration test A–D)

- **The protagonist's actions are continuous across segments**: The narrative anchor is not just a counter, the protagonist's actions must also be carried out according to the entire film time; the actions are repeated for each segment, and the audience sees "five toasts" instead of "five different painting styles at the same moment."
- **When the counter uses years, the paragraphs must be sorted by year**; if they cannot be rearranged, replace the subtitles with serial numbers or style names (the engine subscripts are pluggable). The old and new corner markers are hard-cut at the midpoint of the transition to avoid overlapping words.
- **When there is no transition in the first paragraph, let the painting "draw it by yourself"** (write out the strokes, apply colors one by one, and light up the pixels one by one).
- **The more complex the signature transition, the longer the duration**: The shape of the original film is simple, so 0.4s is enough; gold foil, ribbons, streamers and the like need 0.48–0.5s.

## How to use it when changing the theme

| Layer | This film | If replaced by "100 Years of a City" it could be |
|---|---|---|
| Skeleton | Window/Table/Cat/Person | The same street corner: street lights, shop signs, pedestrians, skyline |
| Living paintings | Small cycle of era motifs | Vehicles passing by in each era, signboards flashing, things in the sky (kites → planes → drones) |
| Transition | The signature language of the next era | The media of the next era: film edge burn, TV snowflakes, pixels, scan lines |
| Beat | 128 BPM Decremental | Same |
| Anchor + Stalk | Year Counter + Cat Cup | Year Counter + The same pigeon steals food in every era |

## Don’t learn from the wrong things

- Don’t think of “16 epochs” as a quota. The mechanism is "the style changes, the skeleton remains unchanged", and the three eras are also established.
- Do not copy the original film pixel by pixel. Reproduction is a way to learn the mechanism, and the deliverable is the version you understand (Milo chose the blonde girl + orange and white cat, which is to replace the characters on the original film skeleton).
