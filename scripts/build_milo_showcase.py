#!/usr/bin/env python3
# /// script
# dependencies = ["playwright"]
# ///
"""Render the six Milo showcase GIFs from the repository's Canvas sources.

    uv run scripts/build_milo_showcase.py
"""
import argparse, base64, functools, http.server, json, subprocess, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / 'scripts/engine'
DEST = ROOT / 'assets/showcase'

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--only', choices=['mario-claude', 'mario-combo', 'mario-pipe', 'egypt', 'monet', 'pixel'])
    args = ap.parse_args()
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(ENGINE)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    with tempfile.TemporaryDirectory(prefix='milo-showcase-') as folder, sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        def load(film, extra=''):
            page.goto(f'http://127.0.0.1:{server.server_address[1]}/index.html?render=1&film={film}{extra}')
            page.wait_for_function('window.__ready === true || !!window.__bootFailed', timeout=120000)
            failed = page.evaluate('window.__bootFailed || null')
            if failed:
                raise RuntimeError(failed)
        def render(name, duration, width, start=0, solo=None):
            if args.only and args.only != name:
                return
            path = Path(folder) / name
            path.mkdir()
            frames = round(duration * 20)
            for i in range(frames):
                image = page.evaluate('''async ({time,solo,width}) => {
                    await window.prepare(time);
                    if (solo) window.renderSolo(solo,time,{counter:false}); else window.renderFrame(time);
                    const cv=document.createElement('canvas');cv.width=width;cv.height=width*9/16;
                    const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=!solo;
                    ctx.drawImage(window.__canvas,0,0,cv.width,cv.height);
                    return cv.toDataURL('image/png').split(',')[1];
                }''', {'time': start + i / 20, 'solo': solo, 'width': width})
                (path / f'{i:05d}.png').write_bytes(base64.b64decode(image))
            if errors:
                raise RuntimeError('\n'.join(errors))
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '20', '-i', str(path / '%05d.png'),
                            '-filter_complex', '[0:v]split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3',
                            '-loop', '0', str(DEST / f'{name}.gif')], check=True)
            print(name, f'{frames} frames, {duration:.2f}s, {width}x{width*9//16}', flush=True)
        load('demos/milo_pixel_adventure')
        for name, solo, duration, width in [('mario-claude','milo_choice',5.5,800),
                                            ('mario-combo','milo_combo',5.3,640),
                                            ('mario-pipe','milo_pipe',7.7,640)]:
            render(name,duration,width,solo=solo)
        for name, segment in [('egypt','02_egypt'),('monet','28_monet'),('pixel','14_8bit')]:
            load('demos/long_scroll', '&only=' + segment)
            act = page.evaluate('WORLD.plan.find(p=>p.kind==="act") && ({start:WORLD.plan.find(p=>p.kind==="act").t0,end:WORLD.plan.find(p=>p.kind==="act").t1})')
            duration = page.evaluate('window.__total')
            start = max(0, act['start'] - 0.45)
            length = min(duration - start - 0.1, act['end'] - start + 0.65)
            render(name,length,640,start=start)
        browser.close()
    server.shutdown()
    if errors:
        raise SystemExit('\n'.join(errors))

if __name__ == '__main__':
    main()
