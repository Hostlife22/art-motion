#!/usr/bin/env python3
# /// script
# dependencies = ["pillow"]
# ///
"""Extract imagegen's Milo atlases with FFmpeg and rebuild sprite foot anchors.

    uv run scripts/install_milo_sprites.py

Pillow reads alpha bounds; FFmpeg extracts the generated sprites without repainting.
"""
import json, statistics, subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / 'assets/characters/milo'
FRAMES = ROOT / 'scripts/engine/demos/long_scroll/frames'


def extract(source, columns, rows, destinations):
    im = Image.open(source).convert('RGBA')
    cell_w, cell_h = im.width // columns, im.height // rows
    result = []
    for index, destination in enumerate(destinations):
        x, y = (index % columns) * cell_w, (index // columns) * cell_h
        alpha = im.getchannel('A').crop((x, y, x + cell_w, y + cell_h))
        bounds = alpha.point(lambda v: 255 if v > 100 else 0).getbbox()
        if bounds is None:
            raise ValueError(f'Empty sprite cell {index}: {source}')
        left, top, right, bottom = bounds
        # Keep a transparent margin around the actual generated silhouette.
        left, top = max(0, left - 6), max(0, top - 6)
        right, bottom = min(cell_w, right + 6), min(cell_h, bottom + 6)
        width, height = right - left, bottom - top
        destination.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(source), '-vf',
                        f'crop={width}:{height}:{x + left}:{y + top}',
                        '-frames:v', '1', str(destination)], check=True)
        feet = []
        foot_y = bounds[3] - 1
        for yy in range(max(bounds[1], foot_y - 5), foot_y + 1):
            for xx in range(bounds[0], bounds[2]):
                if alpha.getpixel((xx, yy)) > 100:
                    feet.append(xx)
        ax = ((min(feet) + max(feet)) / 2 if feet else (left + right) / 2) - left
        result.append({'file': destination.name, 'ax': ax, 'ay': foot_y - top,
                       'w': width, 'h': height, 'air': 0})
    return result


def main():
    hero = ROOT / 'scripts/engine/demos/_shared/hero'
    extract(ATLAS / 'flat-atlas.png', 2, 2,
            [hero / f'{name}.png' for name in ['c1_0', 'c1_1', 'c1_2', 'c3_line']])
    for style, walk, action in [('monet', 'monet_walk', 'monet_throw'),
                                 ('egypt', 'egypt_walk8', 'egypt_dodge'),
                                 ('pixel', '8bit_walk', '8bit_act')]:
        targets = [FRAMES / key / f'{i:02d}.png'
                   for key in [walk, action] for i in range(1, 9)]
        frames = extract(ATLAS / f'{style}-atlas.png', 4, 4, targets)
        for key, group in [(walk, frames[:8]), (action, frames[8:])]:
            standing = statistics.median(f['ay'] for f in group) if key == walk else group[0]['ay']
            meta = {'character': 'Milo', 'frames': group, 'ref_h': standing}
            (FRAMES / key / 'meta.json').write_text(json.dumps(meta, indent=2) + '\n')
            print(key, '8 frames, standing height', standing)


if __name__ == '__main__':
    main()
