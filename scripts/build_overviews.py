#!/usr/bin/env python3
# /// script
# dependencies = ["playwright"]
# ///
"""Rebuild English gallery sheets and example charts from the Canvas sources.

    uv run scripts/build_overviews.py

The illustrated banner and character-comparison artwork are localized separately.
"""
import argparse
import base64
import functools
import html
import http.server
import json
from pathlib import Path
import socketserver
import threading
import tempfile
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / 'scripts/engine'
GRAMMARS = ['y1_kurzgesagt', 'y2_vox', 'y3_whiteboard', 'y4_storytime',
            'y5_kinetic_type', 't1_3b1b', 't2_keynote_ui', 't3_finance_chart']

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--skip-gallery', action='store_true', help='Rebuild demos and charts only')
    ap.add_argument('--gallery-only', action='store_true', help='Rebuild the art-style gallery only')
    ap.add_argument('--characters-only', action='store_true', help='Rebuild the Milo comparison only')
    args = ap.parse_args()
    if args.skip_gallery and args.gallery_only:
        ap.error('--skip-gallery and --gallery-only cannot be combined')
    if args.characters_only and args.gallery_only:
        ap.error('--characters-only and --gallery-only cannot be combined')
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(ENGINE)))
    temporary = tempfile.TemporaryDirectory(prefix='art-motion-overviews-')
    contact_root = Path(temporary.name)
    contact_server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=temporary.name))
    threading.Thread(target=contact_server.serve_forever, daemon=True).start()
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        base = f'http://127.0.0.1:{server.server_address[1]}'
        def load(film):
            print('Rendering', film, flush=True)
            page.goto(base + '/index.html?render=1&film=' + film)
            page.wait_for_function('window.__ready === true || !!window.__bootFailed', timeout=120000)
            failed = page.evaluate('window.__bootFailed || null')
            if failed:
                raise RuntimeError(failed)
        def capture(time, scene=None):
            print('Frame', scene or round(time, 2), flush=True)
            return page.evaluate('''async ({time, scene}) => {
                await window.prepare(time);
                if (scene) window.renderSolo(scene, time); else window.renderFrame(time);
                return window.__canvas.toDataURL('image/png');
            }''', {'time': time, 'scene': scene})
        def sheet(title, cells, destination, columns=3, width=1920):
            # A fresh HTML contact sheet contains only newly rendered frames and English captions.
            document = '<!doctype html><html lang="en"><meta charset="utf-8"><style>'
            document += 'body{margin:0;padding:16px;background:#f3f1e9;color:#24241f;font:16px Arial,sans-serif}h1{font-size:24px;font-weight:500;margin:0 0 14px}.grid{display:grid;gap:12px;grid-template-columns:repeat('+str(columns)+',1fr)}figure{margin:0;min-width:0}img{width:100%;display:block}figcaption{line-height:1.4;padding:6px 0;overflow-wrap:anywhere}</style><h1>'
            document += html.escape(title) + '</h1><div class="grid">'
            for index, (image, caption) in enumerate(cells):
                frame = contact_root / f'frame-{index}.png'
                frame.write_bytes(base64.b64decode(image.split(',', 1)[1]))
                image = f'http://127.0.0.1:{contact_server.server_address[1]}/{frame.name}'
                document += '<figure><img src="'+image+'" alt="'+html.escape(caption,quote=True)+'"><figcaption>'+html.escape(caption)+'</figcaption></figure>'
            document += '</div></html>'
            outpage = browser.new_page(viewport={'width': width, 'height': 100})
            (contact_root / 'index.html').write_text(document)
            outpage.goto(f'http://127.0.0.1:{contact_server.server_address[1]}/index.html')
            outpage.wait_for_function('Array.from(document.images).every(i => i.complete)')
            destination.parent.mkdir(parents=True, exist_ok=True)
            outpage.screenshot(path=str(destination), type='jpeg', quality=92, full_page=True)
            outpage.close()
            print(destination.relative_to(ROOT), flush=True)
        if not args.skip_gallery and not args.characters_only:
            load('gallery')
            eras = page.evaluate('ERAS.map(e => ({id:e.id,name:e.name,year:e.counter.year}))')
            cells = []
            for era in eras:
                year = f"{abs(era['year']):,} BC" if era['year'] < 0 else str(era['year'])
                cells.append((capture(0.7, era['id']), f"{era['id']} · {year} · {era['name']}"))
            sheet('art-motion · 35 art styles, in chronological order', cells, ROOT/'assets/all-styles-overview.jpg', columns=6, width=2880)
        if args.gallery_only:
            browser.close()
            server.shutdown()
            contact_server.shutdown()
            temporary.cleanup()
            if errors:
                raise SystemExit('\n'.join(errors))
            return
        character_cells = []
        for mode, method in [('A', 'Code geometry'), ('C', 'Generated sprites')]:
            for grammar, name in [('y1_kurzgesagt', 'Kurzgesagt'), ('y2_vox', 'Vox collage'), ('y3_whiteboard', 'Whiteboard')]:
                load('demos/' + grammar)
                page.evaluate('(mode) => window.HERO_MODE = mode', mode)
                duration = page.evaluate('window.__total')
                character_cells.append((capture(duration - 0.1), f'{method} · {name} · Milo'))
        sheet('Milo · dark curls, yellow jacket and a small teal backpack', character_cells,
              ROOT/'assets/characters/milo-character-comparison.jpg')
        if args.characters_only:
            browser.close()
            server.shutdown()
            contact_server.shutdown()
            temporary.cleanup()
            if errors:
                raise SystemExit('\n'.join(errors))
            return
        for grammar in GRAMMARS:
            load('demos/' + grammar)
            eras = page.evaluate('ERAS.map(e => ({id:e.id,t0:e.t0,t1:Math.min(e.t1,window.__total)}))')
            cells = [(capture(e['t0']+(e['t1']-e['t0'])*0.82), f"Shot {i+1} · {e['id']}") for i,e in enumerate(eras)]
            sheet(grammar+' · one frame per shot', cells, ROOT/f'assets/animation-grammars/{grammar}_overview.jpg', columns=min(3,len(cells)))
        load('demos/long_scroll')
        segments = page.evaluate('WORLD.segs.map(s => ({id:s.id,t0:s.tIn,t1:s.tOut}))')
        # World segments expose their global timing through layout fields.
        if not segments or any(s.get('t0') is None or s.get('t1') is None for s in segments):
            segments = page.evaluate('WORLD.segs.map(s => ({id:s.id,t0:s.start,t1:s.end}))')
        if any(s.get('t0') is None or s.get('t1') is None for s in segments):
            raise RuntimeError('Long-scroll segment timing unavailable')
        cells=[(capture(s['t0']+(s['t1']-s['t0'])*0.55), name) for s,name in zip(segments,['Egyptian mural · scarab','Monet · Japanese bridge','8-bit · coin block'])]
        sheet('Long-scroll demo · three worlds',cells,ROOT/'assets/long-scroll-overview.jpg')
        # The clip examples embed charts created by the finance grammar itself.
        spec=json.loads((ENGINE/'examples/t3_finance_chart.json').read_text())
        samples=[('finance-chart-landscape.png',1920,1080,'bar'),('revenue-portrait.png',1080,1920,'bar'),('candlestick-landscape.png',1920,1080,'candle')]
        for filename,width,height,chart in samples:
            data=json.loads(json.dumps(spec));data['width']=width;data['height']=height
            if chart=='candle':
                data['cues']=[{'at':0,'kind':'title'},{'at':1.2,'kind':'candle'}]
                data['data']={'title':'Daily share price · illustrative data','unit':'USD','source':'Illustrative data, not a real security','chart':'candle','series':[{'label':f'Day {i+1}','o':100+i*2,'h':108+i*2,'l':96+i*2,'c':104+i*2} for i in range(20)]}
            page.close();page=browser.new_page(viewport={'width':width,'height':height});page.on('pageerror', lambda e: errors.append(str(e)));page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.add_init_script('window.CLIP_SPEC = '+json.dumps(data)+';')
            page.set_viewport_size({'width':width,'height':height})
            page.goto(base+'/clip.html?render=1');page.wait_for_function('window.__ready === true',timeout=120000)
            image=capture(data['duration']-0.1)
            dest=ENGINE/'examples/assets'/filename
            dest.write_bytes(base64.b64decode(image.split(',',1)[1]));print(dest.relative_to(ROOT),flush=True)
        browser.close()
    server.shutdown()
    contact_server.shutdown()
    temporary.cleanup()
    if errors:
        raise SystemExit('\n'.join(errors))

if __name__ == '__main__':
    main()
