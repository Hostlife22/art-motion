#05 · Rhythm & Soundtrack

Disassembly method and reusable rules: `style-recipes/_soundtrack_art-history-speedrun.md` (Section 5 "Reusable Rules" can be copied directly); synthesis script template (original sample score): `scripts/audio/synth_art_history_speedrun.py`.

## Key Points

1. **Determine the BPM grid first, and the pictures and music will fall on the grid.**  128 BPM, eighth note 0.234s suitable for speedrunning/montages. `eighths` of `eras.js` means how many eight points each segment occupies.
2. **Acceleration relies on shortening each section, not speeding up.**  6 → 4×5 → 3×4 → 2×3 → 1×3 → Longer ending.
3. **A three-note motive, with each section changing the representative instrument of the style and transposing it according to the chords.**  A four-chord cycle is enough for harmony.
4. ** Hard attack between segments, no cross-fade, no whoosh sound.**
5. **Ending sound effects: stop - hang - smash - reaction - close** (ding → sliding whistle falling → shattering → cat meowing → bass picking), the time points are aligned with the screen event frame.
6. **Loudness**: Align the integrated LUFS of the reference slice with the true peak; compare the relative difference segment by segment.
7. Only listen to the full-modal model as a candidate: the instrument is credible, and BPM, number of motive notes, and sound effect time must be calibrated using attack detection.

## Alignment with the screen

- Transition starting point = grid point; the lens impact (scene layer 1.03 → 1.0, 20 frames) falls at the same point, and the auditory "click" and visual frustration are the same.
- The action frames of the ending performance (cup 3, cup landing) are aligned with the audio onset, with an error within 3 frames.
- There is no reference time: first write the paragraph table (how many eight points each paragraph), and then generate the picture timeline and soundtrack at the same time; then only change the rhythm `eighths`.
