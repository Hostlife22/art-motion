#!/usr/bin/env python3
"""Subtitle tape access control: scan the \"unsubtitled version\" to complete the film, and the time code will be reported when the picture content (words, strokes, rockets, flames) appears in the subtitle tape.

    python3 subzone_gate.py <Unsubtitled version.mp4> [--band 920] [--fps 10] [--thresh 150]

qa.py checks the text box; this script additionally checks whether the graphic enters the subtitle band.
The numbers are dark pixels with a grayscale <95, which are only suitable for light and clean styles (white boards, off-white paper, light-colored versions of press conferences).
Textured background (Vox kraft paper desktop) is easy to produce a large number of false positives based on the main color difference of the subtitles: this type of style relies on the frame scene of qa.py,
Or like the Vox version, let the text API register the object and then check for occlusion.
The threshold is the actual measured value of that film (subtitles are reduced to 960×80 and >150 pixels). When changing the style, first calibrate it with two known good/bad frames.
"""
import argparse, subprocess, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--band', type=int, default=920, help='Subtitles with edge y (1080 high)')
ap.add_argument('--fps', type=float, default=10); ap.add_argument('--thresh', type=int, default=150)
a = ap.parse_args()
h = 1080 - a.band; W, H = 960, h // 2
cmd = ['ffmpeg', '-v', 'error', '-i', a.video, '-vf', f'fps={a.fps},scale=1920:1080,crop=1920:{h}:0:{a.band},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
raw = subprocess.run(cmd, capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W)
bad = []
for i, f in enumerate(fr):
    n = int((f < 95).sum())
    if n > a.thresh: bad.append((i / a.fps, n))
runs = []
for t, n in bad:
    if runs and t - runs[-1][1] <= 1.5 / a.fps: runs[-1][1] = t; runs[-1][2] = max(runs[-1][2], n)
    else: runs.append([t, t, n])
print(f'{len(fr)} frames, matched {len(bad)} frames')
for t0, t1, n in runs: print(f'  {t0:7.2f}–{t1:7.2f}s  at most {n} pixels')
