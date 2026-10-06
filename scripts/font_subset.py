#!/usr/bin/env python3
# /// script
# dependencies = ["fonttools"]
# ///
"""Subset a font into WOFF using ASCII and text found in the animation sources.

    uv run scripts/font_subset.py --font path/to/font.ttf --out font-subset.woff
    uv run scripts/font_subset.py --scan animation-project --text "Additional labels"
    uv run scripts/font_subset.py --fix-widths font-subset.woff

The English edition defaults to the bundled Inter font and writes a separate
Inter-subset.woff. Register the resulting file in engine/lib/fonts.js to use it.
--gb2312 remains an optional compatibility flag for multilingual projects.
"""
import argparse, re, sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

HERE = Path(__file__).resolve().parent
ENGINE = HERE / 'engine'
# English base coverage and symbols used in animation labels.
BASE = ''.join(chr(cp) for cp in range(0x20, 0x7F))
PUNCT = '·—–…“”‘’×÷→←↑↓▲▼≈±°¥€✓'


def gb2312_l1():
    """All 6763 GB2312 ideographs: 3755 level-1 and 3008 level-2 characters."""
    out = set()
    for hi in range(0xB0, 0xF8):
        for lo in range(0xA1, 0xFF):
            try: out.add(bytes([hi, lo]).decode('gb2312'))
            except UnicodeDecodeError: pass
    return out


def text_chars(text):
    return set(text)


STR = re.compile(r"'(?:[^'\\\n]|\\.)*'|\"(?:[^\"\\\n]|\\.)*\"|`(?:[^`\\]|\\.)*`")


def scan(d):
    """Collect characters from JavaScript string literals; skip standalone comments."""
    out = set()
    for f in Path(d).rglob('*.js'):
        try: src = f.read_text(encoding='utf-8')
        except Exception: continue
        src = '\n'.join(re.sub(r'^\s*//.*$', '', l) for l in src.splitlines())
        for m in STR.finditer(src): out |= text_chars(m.group(0)[1:-1])
    return out


def fix_blank_widths(font):
    """Repair zero-width U+3000 spaces using the width of the U+4E00 glyph.

    Alibaba PuHui 3.0 Medium/Bold have this defect; Heavy/Black widths are
    984/990. Without repair, labels separated by full-width spaces run together.
    """
    cmap, hm, n = font.getBestCmap(), font['hmtx'], 0
    ref = cmap.get(0x4E00)
    for cp in (0x3000,):
        g = cmap.get(cp)
        if g and ref and hm[g][0] == 0:
            hm[g] = (hm[ref][0], 0); n += 1
    return n


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--font', default=str(ENGINE / 'lib/fonts/Inter-var.woff'))
    ap.add_argument('--out', default=str(ENGINE / 'lib/fonts/Inter-subset.woff'))
    ap.add_argument('--scan', action='append', default=[], help='Directories to be scanned additionally (can be multiple times)')
    ap.add_argument('--text', default='', help='extra words')
    ap.add_argument('--no-default-scan', action='store_true', help='Do not scan skill\'s own engine/')
    ap.add_argument('--gb2312', action='store_true', help='Include the full GB2312 character set (6763 characters)')
    ap.add_argument('--fix-widths', nargs='+', metavar='WOFF', help='No subsetting is used, only full-width spaces with a font width of 0 in the existing font file are repaired.')
    a = ap.parse_args()
    if a.fix_widths:
        for f in a.fix_widths:
            ft = TTFont(f); n = fix_blank_widths(ft); ft.flavor = 'woff'
            if n: ft.save(f)
            print(f'{f}: fixed {n} glyph widths')
        return
    if not Path(a.font).exists(): sys.exit(f'Font not found: {a.font}; supply an existing font with --font')
    chars = set(BASE) | set(a.text)
    if not a.no_default_scan: chars |= scan(ENGINE)
    for d in a.scan: chars |= scan(d)
    chars |= set(chr(c) for c in range(0x20, 0x7F))           # Full printable ASCII coverage (years and English subtitles)
    if a.gb2312: chars |= gb2312_l1() | set(PUNCT)
    font = TTFont(a.font)
    cmap = font.getBestCmap()
    miss = sorted(ch for ch in chars if ord(ch) not in cmap and not ch.isspace())
    opts = subset.Options(); opts.flavor = 'woff'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
    sub = subset.Subsetter(opts); sub.populate(text=''.join(sorted(chars))); sub.subset(font)
    if fix_blank_widths(font): print('Repaired zero-width full-width space using the U+4E00 glyph width')
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    font.flavor = 'woff'; font.save(a.out)
    print(f'{a.out}  {len(chars)} glyphs  {Path(a.out).stat().st_size // 1024} KB' + (f'\nAlso missing from the source font: {"".join(miss)}' if miss else ''))


if __name__ == '__main__':
    main()
