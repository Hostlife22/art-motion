# 01 · Breakdown: turn an animation into an implementable specification in one hour

The goal is an **implementable specification**: start/end frames for each segment, transition mechanisms and parameters, in-shot actions, numerical curves for counters/subtitles, composition coordinates, and the soundtrack's beat grid and instrumentation. Prose is the index; measurements and contact sheets are the substance.

First production example: on 2026-10-04, the 15-second *Art History Speedrun* on X was broken down into 16 art eras and 15 transitions. The process took about 1.5 hours: 79 minutes for the storyboard agent and 22 minutes for the soundtrack agent, working in parallel.

## 1. Measure the source parameters first (5 minutes)

```sh
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,sample_rate -of default=nw=1 src.mp4
```
For X videos, the original workflow retrieved the highest-bitrate entry in `video_info.variants` from the syndication interface. Work from the source video rather than a screen recording. Analyze a 60fps source at 60fps: frame numbers are the shared basis of every later specification (seconds = frame/60).

## 2. Make three overview images (10 minutes)

1. **Contact sheets**: 4fps, 480px-wide thumbnails, 30 frames per sheet, timestamped. These show the segment count and subject of each segment.
2. **Keyframe overview**: assemble the cleanest full frame from each segment into a 4×5 sheet to guide subsequent work.
3. **Spectrogram**: `ffmpeg -lavfi showspectrumpic=s=1600x400:legend=1`. Inspect changes of instrumentation, falling glides, fragmented transients, and beats. Clean harmonics with a sharp 16kHz cutoff suggested code synthesis plus AAC in this example; treat that as a clue, not proof.

## 3. Measure transitions and rhythm (15 minutes)

**Frame-by-frame grayscale difference**: downscale to 192×108 grayscale and calculate the mean absolute difference between adjacent frames. In the example, static intervals scored <2 and transitions 10–37. A threshold of 5 and debounce of 12 frames detected transition starts. Save `diff.npy` so all contributors share the same measurements.

**Fit the grid** after detecting starts. If their intervals are integer multiples of a constant, they follow a BPM grid. In this film: start = 84 + 14.06·n frames, residual <0.45 frames, equivalent to eighth notes at 128 BPM. Once confirmed, express picture and music timings as eighth-note positions.

**One transition contact sheet sampled from the 60fps source**: start 2 frames before each transition, take every second frame, and assemble 15 cells over about 0.5s. This reveals mechanisms such as eight vertical strips falling and bouncing in sequence, or 20px blocks flipping around their vertical axes and spreading outward from the cat. A 4fps overview would show only a generic block transition.

**Use the last clean frame before the transition as the reference**, rather than simply choosing an attractive frame. Sampling too early can mistake remnants of the previous transition for scene content; that happened with gravel in the first Egyptian reconstruction. The script uses a frame 3 frames before the next detected transition.

## 4. Measure in-shot motion (15 minutes)

For each stable interval, take the maximum adjacent-frame difference at each pixel and overlay it in red on a grayscale base. Label the moving-area percentage.

The first impression was that each segment was a still painting. Measurements showed 2.5%–34% of each segment moving: rock-art animals alternate running poses, a scarab pushes a sun ball, fringed bands scroll, Vesuvius smokes, foil highlights sweep, an ornithopter flies, and a four-square grid changes color. **Skipping this step produces transitions between still pictures and loses the continuous motion within each scene.**

The heatmap shows where motion occurs. Frame-by-frame inspection of the 60fps source shows how: period, amplitude, two-pose alternation, or continuous movement.

## 5. Define work clearly when dividing it among agents

- Let storyboard and soundtrack agents work in parallel. Give each a complete brief: asset paths, known facts (frame rate, duration, rough segment list), expected outputs (storyboard/spec/contact-sheet directory or soundtrack breakdown/synthesis script), measurement requirements, and response format (summary plus the three least certain findings).
- Ask them to **correct the initial segment list first**. In this film, an iris transition between 1993 and 2026 was initially mistaken for a Memphis-era scene; the storyboard agent corrected it immediately.
- Treat a multimodal model's audio interpretation as a candidate. Instrument identification was useful here, but reported BPM (120 instead of 128), motif note counts, and “one whoosh per segment” were incorrect. Calibrate with attack detection.

## 6. Expected outputs

| Output | Purpose |
|---|---|
| `storyboard.md` + `spec.json` | Segment start/end frames, transition parameters, in-shot actions, counter curves, and composition coordinates; write these from the measured evidence |
| `sheet_*.jpg` | Timestamped 4fps overview contact sheets |
| `diff.npy` + `cuts.json` | Frame differences, detected starts, and fitted beat-grid candidates |
| `transitions/T*.jpg` | Transition contact sheets for frame-by-frame implementation |
| `motion/heatmap.jpg` | Location and extent of motion in each segment |
| `ending-action/` (when characters perform an ending) | Additional manual measurements of center of mass, trajectory, and physical parameters such as gravity in px/frame² |
| `soundtrack-breakdown.md` + `synth.py` | BPM grid, segment eighth-note counts, motif, instrumentation, and sound-effect sequence; template: `scripts/audio/synth_art_history_speedrun.py` |
| `keyframes.jpg` + `ref/seg*.png` | Composition overview and original-resolution reference frames |

Run `scripts/analyze/breakdown.py` for contact sheets, differences, transition sheets, heatmaps, and reference frames. Its docstring documents the command and generated outputs; storyboard, soundtrack, and ending-action specifications are authored from that evidence.
