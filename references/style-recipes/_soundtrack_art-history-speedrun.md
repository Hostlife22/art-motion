# Audio track method·Speed-through code synthesis soundtrack (disassembly method + original example)

This page is the method that precipitated from a teardown: the reference film is 15 seconds of "Art History Speedrun" by X user Tak (@cherry_mx_reds), whose soundtrack itself is synthesized in code. Here we only retain how to break down, write, and mix the music, but not the note-for-note transcription of the original song.

Supporting script: `scripts/audio/synth_art_history_speedrun.py`. The score is an **original example** (D minor, harmony Dm–B♭–F–C). The paragraph structure is consistent with the `scripts/engine/eras.js` of the picture. The instrument library and mixing chain can be directly reused and replaced with your own score.

---

## 0. One sentence conclusion

The soundtrack for a speedrunning short film can be a programmed arrangement on a strict BPM grid: 17 periods arranged according to the "number of eighth notes" (6, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 9). Each period becomes shorter as it goes forward. The "shorter paragraphs" create a sense of acceleration, while the speed itself remains unchanged. Each section uses a set of representative instruments of that era, and a three-note motif is used throughout the film along with the chord changes. After the music stops on the grid, a series of cartoon sound effects (ding, falling whistle, shattering, cat meowing, and final plucking) complete the ending punchline.

---

## 1. How to disassemble a reference soundtrack

| What to measure | Method | Accuracy/confidence |
|---|---|---|
| Beat speed and grid | Perform superflux spectrum flux (hop 2.5ms) on STFT, take the peak as the attack, and then use least squares to fit `t = t0 + n·E` (28 attacks in total) | E = 0.23431s (eighth note) → **128.04 BPM**, grid zero point t0 = 0.028s. The residuals are all within ±4ms, which is impossible to perform by hand. It can be concluded that it is code scheduling |
| Era boundary | Three-way mutual verification: ① grid position; ② peak value of MFCC novelty curve (distance between 0.2s average before and after); ③ peak value of video frame-by-frame difference | deviation between audio boundary (grid) and MFCC peak value ≤20ms. The picture transition is 0–0.2s later than the audio (the picture uses a 0.1–0.2s wipe/warp transition) |
| Pitch | ①Spotify basic-pitch polyphonic transcription (ONNX, Python 3.11 temporary environment); ②Take the 85ms FFT peak on the 16th-note grid, and gain >6dB before and after the attack is judged as a new sound; ③Self-written CQT semitone energy diagram manual reading | The credibility of the melody main tone is high (the two methods are consistent). The details of the inner harmonies, Ukiyoe and Van Gogh passages have medium credibility |
| Timbre | For each melody tone, take the harmonic amplitude 20–220ms after the attack (H1–H8, ±1.5% narrow band), and then measure the attack time and decay of the narrow-band envelope (+50/100/200ms relative peak value) | Polyphony will be mixed into other parts, and the harmonic ratio can only be viewed as a trend |
| Percussion | Measures energy jumps >6kHz (noise) and <150Hz (drums) on a 16th note basis | High |
| Sound | Frequency trace using 20ms step FFT peak tracking for 13–15s, aligned events with a 2.1s screen contact table (one frame every 0.1s) | High |
| Loudness | ffmpeg ebur128; segmented with BS.1770 K weighted, unthresholded mean square | Overall **-14.3 LUFS, LRA 0.9 LU, true peak -2.4 dBTP** (the often heard "average -16.6dB" is the RMS mean, with different calibers) |
| Full-modal model "listening" | Listen to the entire film with a full-modal model, and customize questions from the composer's perspective | Only be considered as a candidate, go back to school one by one, see Section 4 |

---


Two other pieces of experience: To judge the timbre, look at "harmonic amplitude 20-220ms after attack + narrowband envelope attenuation" which is the most stable; to judge "whether it is code synthesis", look at three things - whether the time residual is within ±5ms, whether the timbre is all textbook components such as sine/square wave/sawtooth/exponential decay, and whether there is a recording noise floor in a quiet place.

---

## 2. Original sample score (`era()` block in script)

The time unit is eighth note, starting point = `t0 + n·E`. Motivation ♪♪♩ Marked as "motivation".

| # | Era | Length | Orchestration | Sample writing |
|---|---|---|---|---|
| 1 | Cave | 6 | Bone flute + tambourine + weak beat | Downward enlarged version A4–G4–D4 |
| 2 | Egypt | 4 | Harp + fork bell | Dm→B♭ decomposition; motivation F5–G5–D5 |
| 3 | Greek black painting | 4 | Lyre+double aulos | B♭ chord; D5 → F5 |
| 4 | Rome | 4 | Horn + Drum | Motive C5–D5–A4, F→C→Dm |
| 5 | Gothic | 4 | Organ | Dm → Gm/D, D2 Pedal |
| 6 | Renaissance | 4 | Harpsichord + Bass Viol | Motive B♭5–C6–G5, Gm→F |
| 7 | Ukiyo-e | 3 | Koto+Taiko+Batamu | D Sixteenth pizzicato of the Tosuke scale (D–E♭–G–A–B♭) |
| 8 | Impressionism | 3 | Soft Piano | Motivation Variations A5–C6–G5, Fmaj7 → B♭ → Dm9 |
| 9 | Van Gogh | 3 | Bright plucked strings + wind sound | D2 bass rhythm, scattered high A5/F5/D6/E5 |
| 10 | Art Nouveau | 3 | Celesta | Motive D5–E5–A4, B♭→C→Dm |
| 11 | Cubism | 2 | Piano attack | Deliberately dissonant: D–G♯–C♯ → E♭–A–B♭–E |
| 12 | Bauhaus | 2 | Marimba-style short notes + mechanical ticking | D five octaves superimposed → F/A → D |
| 13 | Pop | 2 | Drum machine + cartoon short sound | Bass drum, backbeat clap, D/F short sound |
| 14 | Pixels | 1 | Square Wave | F Major 332 Arpeggio |
| 15 | Ray-traced | 1 | Super Sawtooth | B♭ Chord |
| 16 | Memphis | 1 | Super sawtooth sustained chord + kick drum + upward slide (cat jumps on the table) | C major 3 passes the end of the section |
| 17 | 2026 | 9 | 128BPM House: four-beat kick, backbeat open cymbal, saw bass, square wave pizzicato, pad | Go to D major add9: F♯5 A5 D6 E6 F♯6 E6 D6 B5 A5 |

When writing your own score: first determine the harmony cycle and a three-tone motive, and then fill in the "representative instrument + motive transposition" of each section according to the paragraph table; for "out-of-frame" sections (exotic, avant-garde), only change the mode or add a tritone, and the rhythm and grid remain unchanged.

---

## 3. Ending sound effect (press "pause-hover-smash-react-collect")

| Events | Synthetic methods (functions in scripts) |
|---|---|
| Music stops | Bass decays quickly in about 150ms without hard cutting |
| Paw clinking glass "ding" | Several non-harmonic ringings of 5–7kHz + a bit of 1.5kHz (`tink`), and a high-frequency whoosh (`swipe`) |
| Cup falls | Pure sine index falls about 1550→325Hz, 0.35s (`slide_whistle`) |
| Falling to pieces | 80Hz left and right smothering + broadband noise (center of mass 5–7kHz, about 0.45s attenuation) + ceramic inharmonic overtones + small collisions of several fragments (`crash`) |
| Cat meow | Harmonic synthesis of linear polyline pitch (upward and then downward) + two formants, the loudest in the entire section (`meow`) |
| Signature appears | Two clicks of ~90Hz to add a little highlight (`end_thump`) |
| Ending | Bass picking on the main note |

Time points are all aligned to screen events from the screen contact table (one frame every 0.1s).

---

## 4. Mixing method (the second half of the script can be used as is)

1. 0.5s small space reverb, 12ms pre-delay, wet sound 9%
2. Add a warm low-frequency bed per segment: use the chord root (`BED_ROOT`) with a triangle wave plus a sine wave one octave below, low-pass filtered at 250Hz. Calculate its level relative to the segment loudness; skip segments that already have enough low end.
3. Band-by-band 2–6kHz dynamic EQ (`MID_ORIG`)
4. Compensate air noise >6kHz step by step (`HF_ORIG`)
5. Segment-by-segment K-weighted loudness alignment `target`, 4 iterations, 10ms smooth gain to prevent zipper sound
6. Optional: 15.8kHz steep lowpass, analog streaming AAC
7. Align LUFS as a whole, and then perform forward-looking peak limiting

When a reference film is available, populate `target / MID_ORIG / HF_ORIG / LOW_FLOOR_ORIG` with measurements for each segment using the method in section 1. Without a reference, the example's uniform relative settings are sufficient.

Attack-softening tip: a plucked-string model with a hard 2ms attack sounds too percussive. Use a 10ms linear attack, delay higher harmonics progressively (multiply attack time by 1.6 per harmonic, capped at 35ms), halve the attack noise, and add a 7kHz low-pass filter for a more connected sound.

Sample output: 48k stereo, 15.06s, -14.0 LUFS, -1.5 dBTP true peak.

```
uv run --with numpy --with scipy --with soundfile python scripts/audio/synth_art_history_speedrun.py
```

---

## 5. Reusable rules: code and synthesize music for any animation

The following can be copied directly.

1. **First define a BPM grid and align everything to it**. 128 BPM (eighth note 0.234s) is suitable for rhythms such as "speed running and montage"; the editing point, music attack point, and sound effect placement point are all set to `t0 + n·E`. The advantage is that no matter how the picture is edited, the music will not look messy. The time residual of the reference film is only ±4ms. This "machine-like accuracy" itself is part of the style.
2. **Use "decreasing number of eighth notes in each section" to speed up, do not increase the speed**. The sequence of this film is 6 → 4×5 → 3×4 → 2×3 → 1×3, and the last section is extended (9) to allow the audience to take a breath and leave room for laughter. The speed remains unchanged, but the listening experience becomes more and more urgent; and each section falls on the grid, naturally synchronizing with the cut-off point of the picture. Method: First list the duration of each segment of the picture, round it to an eighth note, and then fine-tune it overall to make the decrease regular.
3. **A three-note motive, change the instrument and repeat with the chord transposition**. Choose a short, rhythmically distinct motif (the example uses ♪♪♩: step upward, then leap downward). Play it once in each scene on an instrument associated with that era or style, transposed to the current chord. A four-chord loop such as Dm–B♭–F–C provides the harmonic structure. For an exotic or avant-garde section, change the mode or add a tritone while preserving the rhythm and grid. You can start with a reflection or an enlarged version of the motive (the example cave section is a descending four-pointed point).
4. **No cross-fade between segments**. Start the next segment directly on the grid, retaining the previous notes’ natural decay (30–300ms for plucked notes; about 150ms release for sustained notes). A held bass note can bridge two segments. In this way, there is a clear "click" every time the scene changes, and it will not break. There is no need to add transition whoosh sounds to every segment (the reference film doesn’t have any).
5. **The ending sound effect is designed according to "stop-hover-smash-react-close"**:
   - Stop: The music stops on the grid, using a fast decay of about 150ms, do not cut hard
   - Suspension: A small "ding" is used as an introduction, followed by a whistle (pure sine exponential sweep, about 0.35s, more than 2 octaves)
   - Smashing: smothering + broadband noise + inharmonic overtones + small collisions of a few fragments, decaying in about 0.45s
   - Reaction: characters sound, such as "meow" with a linear polyline pitch, about 0.5s after the smash, the whole section is the loudest
   - Close: One or two light "pop"s with signature, the last bass pizzicato falling on the tonic or dominant note
   All aligned by event time point from the screen contact table (one frame every 0.1s).
6. **Loudness Alignment Method**:
   1. First measure the overall value of the reference film (ffmpeg ebur128: integral LUFS, LRA, true peak)
   2. Then weight the loudness by the segment amount K, and the difference in loudness between the floor and the segment at 2–6kHz, >6kHz, and 40–220Hz.
   3. After synthesis, do it in sequence: low-frequency warm bottom section by section → mid- and high-frequency dynamic EQ section by section → air noise section by section → loudness iterative alignment section by section (3–4 times, 10ms smooth gain to prevent zipper sound)
   4. If the reference is AAC, add 16kHz low pass
   5. Finally, align the LUFS as a whole and perform forward-looking peak limiting.
   The difference of "relative segment loudness" is used throughout the whole process, not the absolute value, so that there is no need to rescale when changing the material or the overall loudness.
7. Change **synth.py to a universal template** (the structure remains unchanged, only four pieces of data are changed):
   - `T0, E`: grid zero point and eighth note duration (BPM → `E = 60 / BPM / 2`)
   - `edges / target / MID_ORIG / HF_ORIG / LOW_FLOOR_ORIG / BED_ROOT`: Paragraph boundary and paragraph-by-paragraph reference values; when there is no reference slice, `target` can fill in a uniform value (for example -14), and fill in the remaining three items with "Don't fill in"
   - Score block of `era(n0, items)`: one line list for each section, the elements are `(relative eighth position, instrument function, gain, panning)`. The instrument function library (`pluck` plucked string family, `additive` sustained tone family, `kick / clap / hat / taiko` drum family, `chip / supersaw` synthesizer family) can be directly reused. Generally, new styles only need to adjust the harmonic table and attenuation parameters of `pluck`
   - Sound effect block: call `tink / slide_whistle / crash / meow / end_thump` according to the event time, and the parameters (frequency, duration) are measured from the reference film, or customized according to the template in Article 5
   The second half of the mix chain (Warm → EQ → Air → Loudness Iteration → Low Pass → Limiter) is left as is.
8. **Sequence of analysis process**:
   1. Fit the onset flux to the grid, first get BPM and t0
   2. Perform FFT new note detection on the 16th note grid one by one, and then use basic-pitch polyphonic transcription cross-validation
   3. Use narrowband harmonic ratio and envelope to determine timbre
   4. Use high-frequency and low-frequency energy jumps to judge percussion music
   5. The full-modal model is only a candidate and will be returned to calibration one by one. According to the actual test, it is reliable in judging musical instruments, but it is wrong in terms of tempo (said 120, actual test 128), number of motive sounds, "transition whoosh", and sound effect time.
