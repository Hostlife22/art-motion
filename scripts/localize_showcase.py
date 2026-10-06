#!/usr/bin/env python3
"""Composite English caption artwork into the original showcase animations.

    python scripts/localize_showcase.py --source-dir /path/to/original-gifs

Requires ffmpeg. Original foreign-language GIFs are not bundled in this edition.
Only caption regions change; frame timing, dimensions and loops are preserved.
"""
import argparse
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SHEET = ROOT / 'assets/localization/caption-sheet.png'
# A patch is: artwork crop (x,y,w,h), destination (x,y,w,h), inclusive source frames.
PATCHES = {
    'mario-claude.gif': [((300, 35, 900, 100), (240, 74, 320, 42), 12, 49)],
    'mario-pipe.gif': [
        ((420, 205, 700, 100), (0, 312, 640, 44), 21, 42),
        ((330, 375, 880, 100), (0, 312, 640, 44), 43, 73),
        ((80, 545, 1380, 100), (0, 312, 640, 44), 74, 141),
    ],
    'egypt.gif': [((465, 715, 615, 100), (550, 41, 86, 16), 0, 40)],
    'monet.gif': [((350, 885, 850, 100), (488, 41, 148, 17), 0, 42)],
}

def run(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], check=True)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, default=ROOT/'assets/showcase')
    parser.add_argument('--only', choices=[*PATCHES, 'pixel.gif'], help='Rebuild a single animation')
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='art-motion-captions-') as directory:
        temp = Path(directory)
        for name, patches in PATCHES.items():
            if args.only and name != args.only:
                continue
            source = args.source_dir / name
            if not source.is_file():
                raise SystemExit(f'Missing source GIF: {source}')
            inputs = ['-i', str(source)]
            filters = []
            for i, (crop, destination, start, end) in enumerate(patches):
                x, y, w, h = crop
                dx, dy, dw, dh = destination
                patch = temp / f'{i}.png'
                run(['-i', str(SHEET), '-vf', f'crop={w}:{h}:{x}:{y},scale={dw}:{dh}:flags=lanczos', '-frames:v', '1', str(patch)])
                inputs += ['-i', str(patch)]
                previous = '0:v' if i == 0 else f'v{i-1}'
                filters.append(f"[{previous}][{i+1}:v]overlay={dx}:{dy}:enable='between(n,{start},{end})':eof_action=repeat[v{i}]")
            filters.append(f'[v{len(patches)-1}]split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle[out]')
            run([*inputs, '-filter_complex', ';'.join(filters), '-map', '[out]', '-fps_mode', 'passthrough', '-loop', '0', str(args.output_dir/name)])
            print(name, flush=True)
        # The pixel clip uses a separate English caption generated to match its card.
        source = args.source_dir / 'pixel.gif'
        pixel = ROOT / 'assets/localization/pixel-caption.png'
        if (not args.only or args.only == 'pixel.gif') and source.is_file() and pixel.is_file():
            patch = temp/'pixel.png'
            run(['-i', str(pixel), '-vf', 'crop=1360:200:210:330,scale=80:17:flags=lanczos', '-frames:v', '1', str(patch)])
            run(['-i', str(source), '-i', str(patch), '-filter_complex', '[0:v][1:v]overlay=549:40:eof_action=repeat,split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle[out]', '-map', '[out]', '-fps_mode', 'passthrough', '-loop', '0', str(args.output_dir/'pixel.gif')])
            print('pixel.gif', flush=True)

if __name__ == '__main__':
    main()
