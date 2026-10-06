#!/usr/bin/env python3
"""Frame-by-frame rendering: start local http service → open index.html in headless Chromium → call window.renderFrame(t) for each frame
→ Read canvas pixels → Pipeline ffmpeg to output 60fps mp4, and finally mix it into the audio track.

uv run --with playwright python render.py --out ../films/recreation_v1.mp4 [--audio ../audio/recreation_soundtrack.wav] [--from 0 --to length] [--fps 60]
    [--film gallery] (read eras_gallery.js) [--solo <id> --stills 0.2,0.6 --no-counter]
uv run --with playwright python render.py --spec clip.json --out clip.mp4 [--alpha] [--stills 0.5,2]
    Parameterized clip (\"animation segment\" of the narration pipeline, see references/09 for the contract): duration strictly = spec.duration (number of frames round(duration×fps)),
    Width and height/fps read from spec; default silent H.264 yuv420p, one keyframe per second (GOP=fps, pipeline renderer seeks per second), --alpha out ProRes 4444 with transparency (.mov). The image path in spec is relative to the spec file.
There is a pageerror or console.error (scene error, missing glyph) on the page → non-zero exit after rendering.
"""
import argparse, base64, http.server, json, socketserver, subprocess, threading, functools, time, urllib.parse
from pathlib import Path
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--out', required=True)
ap.add_argument('--audio')
ap.add_argument('--fps', type=int, default=60)
ap.add_argument('--from', dest='t0', type=float, default=0)
ap.add_argument('--to', dest='t1', type=float, default=None, help='Default = length calculated from paragraph table window.__total')
ap.add_argument('--stills', help='Comma separated seconds: export only pngs of these moments to the --out directory')
ap.add_argument('--solo', help='Only render a certain era (the time is the local time of this period), with --stills or --from/--to')
ap.add_argument('--film', default='', help='Movie name: read eras_<name>.js (default eras.js)')
ap.add_argument('--no-counter', action='store_true', help='--Solo does not draw the corner mark')
ap.add_argument('--crf', type=int, default=14)
ap.add_argument('--spec', help='Parameterized fragment spec.json (go to clip.html, do not read the paragraph table)')
ap.add_argument('--alpha', action='store_true', help='--spec outputs ProRes 4444 with transparency (the background is not drawn)')
a = ap.parse_args()

root = Path(__file__).parent
spec = None
if a.spec:
    sp = Path(a.spec).resolve(); spec = json.loads(sp.read_text())
    def ref(v):                                            # Local image → /__file__/< absolute path> (only files named in spec are served)
        if not v or v.startswith(('data:', 'http:', 'https:')): return v
        f = (sp.parent / v).resolve()
        if not f.exists(): raise SystemExit(f'Image referenced by spec does not exist: {v} (relative to {sp.parent} )')
        ALLOWED.add(str(f)); return '/__file__/' + urllib.parse.quote(str(f))
    ALLOWED = set()
    for q in spec.get('cues', []):
        if q.get('image'): q['image'] = ref(q['image'])
    if (spec.get('data') or {}).get('image'): spec['data']['image'] = ref(spec['data']['image'])
    if a.alpha: spec['alpha'] = True
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *x): pass
    def translate_path(self, path):
        if path.startswith('/__file__/'):
            f = urllib.parse.unquote(path[len('/__file__/'):].split('?')[0])
            return f if spec and f in ALLOWED else '/nonexistent'
        return super().translate_path(path)
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=str(root)))
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-web-security', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    errors = []
    def on_console(m):
        if m.type in ('error', 'warning'): print('[page]', m.text)
        if m.type == 'error': errors.append(m.text)
    pg.on('console', on_console)
    pg.on('pageerror', lambda e: (print('[pageerror]', e), errors.append(str(e))))
    if spec:
        pg.set_viewport_size({'width': spec.get('width', 1920), 'height': spec.get('height', 1080)})
        pg.add_init_script('window.CLIP_SPEC = ' + json.dumps(spec, ensure_ascii=False) + ';')
        pg.goto(f'http://127.0.0.1:{port}/clip.html?render=1')
    else:
        pg.goto(f'http://127.0.0.1:{port}/index.html?render=1' + (f'&film={a.film}' if a.film else ''))
    pg.wait_for_function('window.__ready === true || !!window.__bootFailed', timeout=120000)
    bf = pg.evaluate('window.__bootFailed || null')
    if bf: raise SystemExit('Scene loading failed and rendering refused: \n' + bf)
    if a.t1 is None: a.t1 = pg.evaluate('window.__total')
    if spec: a.fps = spec.get('fps', 30); a.t0 = 0; a.t1 = spec['duration']
    grab = '''async (t)=>{ await window.prepare(t); window.renderFrame(t); return window.__canvas.toDataURL('image/png').split(',')[1]; }'''
    if a.solo:
        grab = '''async (t)=>{ window.renderSolo(%s, t, {counter: %s}); return window.__canvas.toDataURL('image/png').split(',')[1]; }''' % (repr(a.solo), 'false' if a.no_counter else 'true')
    if a.stills:
        out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
        for s in a.stills.split(','):
            (out / f't{float(s):06.2f}.png').write_bytes(base64.b64decode(pg.evaluate(grab, float(s))))
        print('stills ->', out)
    else:
        Path(a.out).parent.mkdir(parents=True, exist_ok=True)
        vid = a.out if not a.audio else a.out + '.noaudio.mp4'
        enc = ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-alpha_bits', '16'] if (spec and a.alpha) else \
              ['-c:v', 'libx264', '-preset', 'slow', '-crf', str(a.crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart'] + \
              (['-g', str(a.fps), '-keyint_min', str(a.fps), '-sc_threshold', '0'] if spec else [])   # Fragments are sought by the pipeline's renderer on a per-second basis: one keyframe per second, otherwise the frame is frozen
        if spec and a.alpha and not vid.endswith('.mov'): print('Tip: ProRes 4444 generally uses .mov container')
        ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', str(a.fps), '-c:v', 'png', '-i', '-'] + enc + [vid],
                              stdin=subprocess.PIPE)
        n0, n1 = round(a.t0 * a.fps), round(a.t1 * a.fps)
        st = time.time()
        for i in range(n0, n1):
            ff.stdin.write(base64.b64decode(pg.evaluate(grab, i / a.fps)))
            if (i - n0) % 60 == 0:
                print(f'{i}/{n1}  {time.time()-st:.0f}s', flush=True)
        ff.stdin.close(); ff.wait()
        if a.audio:
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', vid, '-ss', str(a.t0), '-t', str(a.t1 - a.t0), '-i', a.audio,
                            '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', a.out], check=True)
            Path(vid).unlink()
        print('done ->', a.out)
    b.close()
srv.shutdown()
if errors: raise SystemExit(f'❌ page errors {len(errors)}  (see [page]/[pageerror] above)')
