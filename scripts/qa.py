#!/usr/bin/env python3
# /// script
# dependencies = ["playwright", "numpy", "pillow"]
# ///
"""One command accepts a code animation project: stability, efficiency, dynamics, smoothness, numbers + puzzles. It must be run before delivery, and the numbers are written into the delivery instructions.

    uv run qa.py --project <project-directory> [--film gallery] [--ids 01_cave,09_postimp] [--fps 30] [--out <directory>]
    uv run qa.py --spec <fragment clip.json> [--out <directory>] # Parameterized fragment (animation segment of the narration pipeline): the entire segment is used as a section, and vertical screen is also acceptable; no transition is measured

Do four things piece by piece (each id in eras.js):
  1. Stable: Exit directly if scene loading fails (engine __bootErrors); cold rendering + thermal rendering are compared pixel-by-pixel twice at the same time (deterministic).
  2. Efficiency: Each frame takes time - timing includes one getImageData(1×1) to force the GPU to finish drawing (only the JS synchronization time will report a false 1ms; migration test B passed it).
  3. Dynamic: To avoid the lens impact 0.35s after the transition, press --fps to continuously take frames in the static area of ​​this section, and report the average moving area (pixel ratio of adjacent frames that change >12).
     and \"still frame pair\" ratio (adjacent frames are almost unchanged <0.05% - migration test A found that only looking at the head-to-tail difference will miss one card after another).
  4. Smoothness: Peak/median difference between adjacent frames. >6 and peak values ​​>3% are recorded as \"jumps\" (the entire screen is reshuffled at 8fps, a certain frame is crossed, and flickers will appear).
Also do \"smoke transition\": each segment with transition renders the entire frame (renderFrame) at p=.25/.5/.75, and the error is included in the page error - use renderSolo to get the frame within the segment,
The transition code will not be executed even once, and the transition will be completely green even if it crashes (stepped on when transplanting the full style sample).
The criterion is an empirical threshold, not a rule: most segments between 0.5–8% of motion look good; static frames with >40% are read as stuck; jumps >0, look at the frame first and then judge (intentional beat flickering is not a mistake).
  5. Frame scene:
     From the moment the page is loaded, the outer frame of fillText/strokeText on the screen is recorded every time, and it will be reported only after it lasts ≥0.3s when fetching——
     Half-cut words (a part of the words is cut off by the edge of the screen), overlapping words (two different strings of words are pressed against each other), and entering the subtitle tape (the words fall into the subtitle tape, and the burned subtitles will be covered);
     Another report is \"nearly blank\" (the whole screen has almost no content: the screen is full of white and black fields). They are all clues to \"go and see this frame\". They are not errors and prevent qa from failing.
     The outer frame follows the canvas: the words drawn into the off-screen buffer/elf cache (including the cache pre-drawn at startup) and then drawn from drawImage, as well as the words after the bitmap is pushed, can be measured.
     Subtitle band: The default for the entire film is y>920/1080 (--sub-band changes, 0 turns it off); --spec fragments read the safe.bottom of spec, if not, it will not be checked.
     Blind spots: ① Fetching frames starts from the max (--skip, transition duration) of each paragraph, and the problems at the beginning of the paragraph and the transition cannot be seen; as long as a pen or hand is left on the \"empty board at the beginning of the paragraph\" (accounting for >0.3%), it is not nearly blank.
     ②For the words drawn in the clip (scrolling numbers, uncovering according to stroke order), only half-words and subtitles will be checked, and overlapping words will not be judged. ③Words blocked by non-text objects (photos, paper clips, commentators, pop-up cards) cannot be found.
     When both strings are covered, double characters will be falsely reported. ④ Graphics (flames, spaceships) cannot be found in the subtitles tape, and the shallow background style uses scripts/subzone_gate.py in layers.
     ⑤ Verbatim handwritten words are reported in single characters, and you can locate them by looking at the frame; large decorative characters intentionally pressed on the subtitles or outside the picture (such as the giant watermark numbers of y5) will be reported, and you can play them after reading them.

Products: <out>/qa.json (all numbers), <out>/qa.md (table), <out>/<id>.jpg (4-frame puzzle + motion heat map).
"""
import argparse, base64, functools, http.server, io, json, socketserver, threading, urllib.parse
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
ap.add_argument('--project'); ap.add_argument('--spec', help='Parameterized fragment spec (take clip.html, the same set as render.py --spec)'); ap.add_argument('--ids'); ap.add_argument('--fps', type=float, default=30)
ap.add_argument('--out'); ap.add_argument('--film', default='', help='Movie name: read eras_<name>.js'); ap.add_argument('--skip', type=float, default=0.35, help='The number of seconds to skip at the beginning of each segment (shot blast)')
ap.add_argument('--sub-band', type=float, default=None, help='The upper edge of the subtitle band (the proportion of the picture height); the default for the entire film is 0.852 (920/1080), --spec reads safe.bottom by default; write 0 to turn off the "Enter subtitle band" check')
a = ap.parse_args()
if not (a.project or a.spec): ap.error('--project or --spec choose one')
spec, ALLOWED = None, set()
if a.spec:                                                 # The same set as render.py: local images only serve files named in the spec.
    sp = Path(a.spec).resolve(); spec = json.loads(sp.read_text())
    def ref(v):
        if not v or v.startswith(('data:', 'http:', 'https:')): return v
        f = (sp.parent / v).resolve()
        if not f.exists(): raise SystemExit(f'Image referenced by spec does not exist: {v}')
        ALLOWED.add(str(f)); return '/__file__/' + urllib.parse.quote(str(f))
    for q in spec.get('cues', []):
        if q.get('image'): q['image'] = ref(q['image'])
    if (spec.get('data') or {}).get('image'): spec['data']['image'] = ref(spec['data']['image'])
root = Path(a.project).resolve() if a.project else Path(__file__).resolve().parent / 'engine'
out = Path(a.out) if a.out else (Path(a.spec).resolve().parent / 'qa' if a.spec else root.parent / 'qa'); out.mkdir(parents=True, exist_ok=True)
VW, VH = (spec.get('width', 1920), spec.get('height', 1080)) if spec else (1920, 1080)
if a.sub_band is None:   # The fragment is used by the pipeline: the subtitles are written in safe.bottom of the spec. If it is not written, it will be treated as if there are no subtitles burned.
    sb = ((spec or {}).get('safe') or {}).get('bottom', 0) if spec else None
    a.sub_band = 0.852 if sb is None else (1 - sb / VH if sb else 0)

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *x): pass
    def translate_path(self, path):
        if path.startswith('/__file__/'):
            f = urllib.parse.unquote(path[len('/__file__/'):].split('?')[0])
            return f if f in ALLOWED else '/nonexistent'
        return super().translate_path(path)
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=str(root))); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

# Frame check: wrap a layer of fillText/strokeText and note the screen outline of the words drawn on the "full screen size canvas" (after the current transformation)
TEXT_HOOK = '''(() => {
  //The outer frame of the word is recorded on "the canvas on which it was drawn"; when this canvas is pasted elsewhere by drawImage, the outer frame will change accordingly.
  // In this way, the words that are first drawn into the off-screen buffer and then pushed as a whole (the bitmap zoom of the commentator film), and the words that are drawn into the sprite cache and then pasted on the table (Vox\'s paper cut) can also be measured.
  const P = CanvasRenderingContext2D.prototype;
  const sv = P.save, rs = P.restore, cl = P.clip, di = P.drawImage, cr = P.clearRect, fr = P.fillRect;
  // Remember "whether there is a clip currently": scrolling numbers and words revealed in stroke order are drawn in the clip. The outer frame is larger than visible and is not used to judge overlapping words.
  P.save = function () { (this.__cs || (this.__cs = [])).push(!!this.__clip); return sv.apply(this, arguments); };
  P.restore = function () { if (this.__cs && this.__cs.length) this.__clip = this.__cs.pop(); return rs.apply(this, arguments); };
  P.clip = function () { this.__clip = true; return cl.apply(this, arguments); };
  // Clear the outer frame record of this canvas when "the entire canvas is covered". Otherwise, after the cached canvas is redrawn, the words in the previous paragraph will still remain in the record ("Rocket" in whiteboard s03 is falsely reported to s04)
  const full = (ctx, x, y, w, h) => { // Whether this rectangle covers the entire canvas after the current transformation (only transformations without rotation are recognized)
    const T = ctx.getTransform(); if (T.b !== 0 || T.c !== 0) return false;
    const xs = [T.a * x + T.e, T.a * (x + w) + T.e], ys = [T.d * y + T.f, T.d * (y + h) + T.f];
    return Math.min(...xs) <= 0 && Math.min(...ys) <= 0 && Math.max(...xs) >= ctx.canvas.width && Math.max(...ys) >= ctx.canvas.height;
  };
  const opaque = ctx => { const f = ctx.fillStyle; if (typeof f !== 'string') return false; const m = f.match(/^(rgba|hsla)\\(([^)]*)\\)/); return !m || +m[2].split(/[ ,\\/]+/).filter(Boolean)[3] >= 1; };
  P.clearRect = function (x, y, w, h) { if (full(this, x, y, w, h)) this.canvas.__tb = []; return cr.apply(this, arguments); };
  P.fillRect = function (x, y, w, h) { if (this.globalAlpha >= 1 && (this.globalCompositeOperation === 'copy' || (this.globalCompositeOperation === 'source-over' && opaque(this))) && full(this, x, y, w, h)) this.canvas.__tb = []; return fr.apply(this, arguments); };
  if (P.reset) { const rz = P.reset; P.reset = function () { this.canvas.__tb = []; this.__cs = []; this.__clip = false; return rz.apply(this, arguments); }; }
  const pid = P.putImageData;
  P.putImageData = function (im, x, y) { if (x <= 0 && y <= 0 && x + im.width >= this.canvas.width && y + im.height >= this.canvas.height) this.canvas.__tb = []; return pid.apply(this, arguments); };
  for (const k of [\'width\', \'height\']) { // Changing the canvas size will clear the canvas and the outer frame.
    const d = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, k);
    Object.defineProperty(HTMLCanvasElement.prototype, k, { get: d.get, set(v) { this.__tb = []; d.set.call(this, v); }, configurable: true });
  }
  const push = (ctx, rec) => { const L = ctx.canvas.__tb || (ctx.canvas.__tb = []); L.push(rec); if (L.length > 6000) L.splice(0, 3000); }; // Canvases that are only partially cleared and redrawn repeatedly will remember more and more, leaving the most recent ones
  for (const fn of ['fillText', 'strokeText']) {
    const orig = P[fn];
    P[fn] = function (text, x, y, maxW) {
      if (this.globalAlpha > 0.15 && String(text).trim()) { // Remember from loading: the words pre-drawn into the cache at startup (Vox\'s prewarm) must also have an outer frame
        const m = this.measureText(text), T = this.getTransform();
        let x0 = x - m.actualBoundingBoxLeft, x1 = x + m.actualBoundingBoxRight;
        if (maxW && x1 - x0 > maxW) x1 = x0 + maxW;
        const y0 = y - m.actualBoundingBoxAscent, y1 = y + m.actualBoundingBoxDescent;
        const xs = [], ys = [];
        for (const [px, py] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) { xs.push(T.a * px + T.c * py + T.e); ys.push(T.b * px + T.d * py + T.f); }
        push(this, [String(text).slice(0, 24), xs, ys, !!this.__clip]);
      }
      return orig.apply(this, arguments);
    };
  }
  P.drawImage = function (src, ...a) {
    if (this.globalCompositeOperation === 'copy') this.canvas.__tb = [];
    const L = src && src.__tb;
    if (L && L.length && src !== this.canvas && this.globalAlpha > 0.5) { // ≤0.5 is mostly a motion afterimage/trailing overlay, which is not transmitted (the afterimage of the whiteboard mirror will fill the screen with false overlays)
      let sx = 0, sy = 0, sw = src.width, sh = src.height, dx, dy, dw = sw, dh = sh;
      if (a.length === 2) [dx, dy] = a; else if (a.length === 4) [dx, dy, dw, dh] = a; else [sx, sy, sw, sh, dx, dy, dw, dh] = a;
      const T = this.getTransform(), kx = dw / sw, ky = dh / sh, clip = !!this.__clip || a.length === 8;
      for (const [txt, xs, ys, c0] of L) {
        if (Math.max(...xs) < sx || Math.min(...xs) > sx + sw || Math.max(...ys) < sy || Math.min(...ys) > sy + sh) continue;
        const X = [], Y = [];
        for (let k = 0; k < 4; k++) { const u = dx + (xs[k] - sx) * kx, v = dy + (ys[k] - sy) * ky; X.push(T.a * u + T.c * v + T.e); Y.push(T.b * u + T.d * v + T.f); }
        push(this, [txt, X, Y, c0 || clip]);
      }
    }
    return di.call(this, src, ...a);
  };
})();'''
GRAB = '''async ([id, lt, full]) => {
  window.__tb = true; window.__canvas.__tb = [];
  const s = performance.now();
  if (full) { await window.prepare(lt); window.renderFrame(lt); } else window.renderSolo(id, lt);
  window.__canvas.getContext(\'2d\').getImageData(0, 0, 1, 1); // Force the GPU to stop the clock after finishing drawing
  const ms = performance.now() - s;
  const M = window.__canvas, tb = (M.__tb || []).map(([t, xs, ys, c]) => [t, xs.map(v => v / M.width), ys.map(v => v / M.height), c]); window.__tb = null;
  return [ms, window.__canvas.toDataURL('image/png').split(',')[1], tb];
}'''

def frame_issues(tb, band):
    """Frame problem in one frame: [(category, text)]. The coordinates are all proportions of the screen."""
    out, vis = [], []
    for txt, cxs, cys, clipped in tb:
        x0, y0, x1, y1 = min(cxs), min(cys), max(cxs), max(cys)
        ang = float(np.arctan2((cys[1] - cys[0]) * VH, (cxs[1] - cxs[0]) * VW))
        w, h = x1 - x0, y1 - y0
        if w <= 0 or h <= 0 or h < 0.008: continue                 # Don’t care if the characters are too small (<9px)
        ix0, iy0, ix1, iy1 = max(x0, 0), max(y0, 0), min(x1, 1), min(y1, 1)
        if ix1 <= ix0 or iy1 <= iy0: continue                      # The whole thing is off-screen: the camera didn’t capture it, so it doesn’t count.
        frac = (ix1 - ix0) * (iy1 - iy0) / (w * h)
        if frac < 0.9 and frac > 0.1: out.append(('Half a word', txt))
        if band and iy1 > band + 0.004 and frac > 0.1: out.append(('into subtitles', txt))
        if not clipped: vis.append((txt, ang, cxs, cys))
    def box(v, ang):                                                    # Go to the coordinate system of ang and get the outer frame: the two lines of the diagonally placed label will not "overlap" each other because the outer frame becomes larger.
        c, s_ = np.cos(-ang), np.sin(-ang)
        u = [x * c - y * s_ * VH / VW for x, y in zip(v[2], v[3])]; w = [x * s_ * VW / VH + y * c for x, y in zip(v[2], v[3])]
        return min(u), min(w), max(u), max(w)
    for i in range(len(vis)):
        for j in range(i + 1, len(vis)):
            a, b = vis[i], vis[j]
            if a[0] == b[0]: continue                                   # Draw the same string of words twice (stroke + coloring, projection)
            same = abs(a[1] - b[1]) < 0.02; ang = a[1] if same else 0.0
            A, B = box(a, ang), box(b, ang)
            if not same:                                                # Different angles (handwriting shakes word by word): the outer frame will be fatter, and each will shrink inward by 12%.
                A, B = [(r[0] + (r[2] - r[0]) * .12, r[1] + (r[3] - r[1]) * .12, r[2] - (r[2] - r[0]) * .12, r[3] - (r[3] - r[1]) * .12) for r in (A, B)]
            ow = min(A[2], B[2]) - max(A[0], B[0]); oh = min(A[3], B[3]) - max(A[1], B[1])
            if ow <= 0 or oh <= 0: continue
            small = min((A[2] - A[0]) * (A[3] - A[1]), (B[2] - B[0]) * (B[3] - B[1]))
            if ow * oh / small > 0.3: out.append(('Duplicate words', a[0] + '｜' + b[0]))
    return out

def persistent(ts, per_frame, min_s=0.3):
    """The same problem occurs continuously for ≥min_s seconds before reporting (it is normal for half-frames when the camera pans past)."""
    runs, open_ = [], {}
    for k, t in enumerate(ts):
        cur = set(per_frame[k])
        for key in list(open_):
            if key not in cur:
                t0, t1 = open_.pop(key)
                if t1 - t0 >= min_s: runs.append((key, t0, t1))
        for key in cur:
            if key in open_: open_[key] = (open_[key][0], t)
            else: open_[key] = (t, t)
    runs += [(key, t0, t1) for key, (t0, t1) in open_.items() if t1 - t0 >= min_s]
    return sorted(runs, key=lambda r: r[1])

def merge_runs(runs):
    """The words typed out word by word will be one by one: those of the same type and time intersecting will be combined into one, and the words will be connected."""
    out = []
    for (kind, txt), t0, t1 in sorted(runs, key=lambda r: (r[0][0], r[1])):
        if out and out[-1][0] == kind and t0 <= out[-1][3] + 0.05:
            o = out[-1]; o[3] = max(o[3], t1)
            if txt and txt not in o[1].split(',') and len(o[1]) < 60: o[1] = (o[1] + ',' + txt).strip(',')
        else: out.append([kind, txt, t0, t1])
    return sorted(out, key=lambda r: r[2])

def near_blank(f):
    """The proportion of pixels with a difference of >24 and <0.3% from the main color of the screen is read as \"almost no content\"."""
    med = np.median(f.reshape(-1, 3), axis=0)
    return float((np.abs(f - med).max(axis=2) > 24).mean()) < 0.003
def img(b64, w=480): return np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB').resize((w, round(w * VH / VW)))).astype(np.int16)   # Shrink according to the frame size, vertical screen will not be flattened

report = {'project': str(root), 'segments': []}
errors = []
with sync_playwright() as p:
    br = p.chromium.launch(args=['--enable-gpu-rasterization', '--ignore-gpu-blocklist'])
    pg = br.new_page(viewport={'width': VW, 'height': VH})
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append('console.error: ' + m.text) if m.type == 'error' else None)   # Missing glyphs, etc. are reported by console.error
    pg.add_init_script(TEXT_HOOK)
    if spec:
        pg.add_init_script('window.CLIP_SPEC = ' + json.dumps(spec, ensure_ascii=False) + ';')
        pg.goto(f'http://127.0.0.1:{port}/clip.html?render=1')
    else:
        pg.goto(f'http://127.0.0.1:{port}/index.html?render=1' + (f'&film={a.film}' if a.film else ''))
    pg.wait_for_function('window.__ready === true || !!window.__bootFailed', timeout=180000)
    bf = pg.evaluate('window.__bootFailed || null')
    if bf: raise SystemExit('❌ Scene loading failed: \n' + bf)
    segs = [{'id': Path(a.spec).resolve().parent.name, 't0': 0, 't1': spec['duration'], 'tr': 0}] if spec else \
        pg.evaluate('ERAS.map(e => ({id: e.id, t0: e.t0, t1: Math.min(e.t1, window.__total), tr: e.transition ? e.transition.dur + (e.transition.delay || 0) : 0}))')
    want = set(a.ids.split(',')) if a.ids else None
    for s in segs:
        if want and s['id'] not in want: continue
        dur = s['t1'] - s['t0']; lt0 = max(a.skip, s['tr']) if s['t0'] > 0 else 0.0
        lt1 = max(lt0 + 0.2, dur - 0.02)
        n = max(4, int((lt1 - lt0) * a.fps))
        ts = [lt0 + (lt1 - lt0) * i / (n - 1) for i in range(n)]
        full = bool(spec)                                   # The fragment does not have renderSolo, the whole frame is rendered
        cold_ms, cold, _ = pg.evaluate(GRAB, [s['id'], ts[-1], full])
        frames, ms, tbs = [], [], []
        for t in ts:
            m, b64, tb = pg.evaluate(GRAB, [s['id'], t, full]); ms.append(m); frames.append(img(b64)); tbs.append(tb or [])
        _, again, _ = pg.evaluate(GRAB, [s['id'], ts[-1], full])
        det = int(np.abs(img(again) - frames[-1]).max()); det_cold = int(np.abs(img(cold) - frames[-1]).max())
        diffs = np.array([(np.abs(frames[i + 1] - frames[i]).max(axis=2) > 12).mean() * 100 for i in range(len(frames) - 1)])
        med = float(np.median(diffs)) if len(diffs) else 0
        if spec:   # Most of the clips are "move and freeze": the median of the whole clip is ≈ 0, and the continuous push/slide will be recorded as a jump. The clip recognizes only isolated jumps: 6 times larger than the median of 3 pairs before and after
            loc = lambda i: float(np.median(np.r_[diffs[max(0, i - 3):i], diffs[i + 1:i + 4]])) if len(diffs) > 1 else 0
            spikes = [round(ts[i + 1], 3) for i, d in enumerate(diffs) if d > 3 and d > 6 * max(loc(i), 0.05)]
        else:
            spikes = [round(ts[i + 1], 3) for i, d in enumerate(diffs) if d > 3 and d > 6 * max(med, 0.05)]
        still = float((diffs < 0.05).mean() * 100)
        heat = np.zeros(frames[0].shape[:2]); [heat.__iadd__((np.abs(frames[i + 1] - frames[i]).max(axis=2) > 12)) for i in range(len(frames) - 1)]
        rec = {'id': s['id'], 'window_lt': [round(lt0, 3), round(lt1, 3)], 'frames': n,
               'ms_mean': round(float(np.mean(ms)), 1), 'ms_max': round(float(np.max(ms)), 1), 'ms_cold': round(cold_ms, 1),
               'deterministic': det == 0 and det_cold == 0, 'det_maxdiff': max(det, det_cold),
               'motion_pct': round(float(diffs.mean()), 2), 'motion_max': round(float(diffs.max()), 2), 'still_pairs_pct': round(still, 1),
               'spike_ratio': round(float(diffs.max() / max(med, 0.05)), 1), 'spikes_at_lt': spikes}
        frame_runs = merge_runs(persistent(ts, [frame_issues(tb, a.sub_band) for tb in tbs]) +
                                persistent(ts, [[('near blank', '')] if near_blank(f) else [] for f in frames]))
        rec['framing'] = [{'kind': k, 'text': txt, 'lt': [round(t0, 2), round(t1, 2)], 't': [round(s['t0'] + t0, 2), round(s['t0'] + t1, 2)]} for k, txt, t0, t1 in frame_runs]
        rec['text_tracked'] = sum(map(len, tbs))
        report['segments'].append(rec)
        # Jigsaw: 4 frames + heatmap
        pick = [frames[int(k)] for k in np.linspace(0, n - 1, 4)]
        H_, W_ = frames[0].shape[:2]; S = Image.new('RGB', (W_ * 5, H_ + 20), 'white'); dr = ImageDraw.Draw(S)
        for k, f in enumerate(pick): S.paste(Image.fromarray(f.astype(np.uint8)), (k * W_, 20))
        hm = np.clip(heat / max(1, heat.max()) * 255, 0, 255).astype(np.uint8)
        base = Image.fromarray(pick[0].astype(np.uint8)).convert('L').convert('RGB'); red = np.zeros((H_, W_, 3), np.uint8); red[..., 0] = hm
        S.paste(Image.blend(base, Image.fromarray(red), 0.6), (4 * W_, 20))
        dr.text((4, 4), f"{s['id']}  motion {rec['motion_pct']}%  still frame pairs {rec['still_pairs_pct']}%  spikes {len(spikes)}  {rec['ms_mean']}/{rec['ms_max']}ms  deterministic {'✓' if rec['deterministic'] else '✗'}", fill='black')
        S.save(out / f"{s['id']}.jpg", quality=85)
        print(f"{s['id']:<18} motion {rec['motion_pct']:>5}%  still frame pairs {rec['still_pairs_pct']:>5}%  spikes {len(spikes)}  {rec['ms_mean']:>6}/{rec['ms_max']:>6}ms  deterministic {'✓' if rec['deterministic'] else '✗ ' + str(rec['det_maxdiff'])}  framing {len(rec['framing'])}")
        for r in rec['framing']: print(f"    {r['kind']}  {r['t'][0]:.2f}–{r['t'][1]:.2f}s  {r['text']}")
    # Smoke in transition: only checks whether it can be rendered and how much time it takes, and does not participate in the movement/fluency criteria
    report['transitions'] = []
    for s in ([] if spec else pg.evaluate('ERAS.map(e => ({id: e.id, t0: e.t0, tr: e.transition ? {type: e.transition.type, dur: e.transition.dur, delay: e.transition.delay || 0} : null}))')):
        if not s['tr'] or (want and s['id'] not in want): continue
        ms_tr = []
        for p in (0.25, 0.5, 0.75):
            t = s['t0'] + s['tr']['delay'] + s['tr']['dur'] * p
            try:
                m, *_ = pg.evaluate(GRAB, [s['id'], t, True]); ms_tr.append(m)
            except Exception as ex:
                errors.append(f"Transition  {s['tr']['type']} (entering  {s['id']} )p={p}: {str(ex).splitlines()[0]}")
        report['transitions'].append({'id': s['id'], 'type': s['tr']['type'], 'ms_max': round(max(ms_tr), 1) if ms_tr else None})
    if report['transitions']: print('Smoke in transition', len(report['transitions']), 'one, the slowest', max((r['ms_max'] or 0, r['type']) for r in report['transitions']))
    br.close()
srv.shutdown()
report['page_errors'] = errors
json.dump(report, open(out / 'qa.json', 'w'), ensure_ascii=False, indent=1)
rows = ['| Segments | Motion % | Still Frame Pairs % | Jumps | Avg/Peak ms | Cold Start ms | Deterministic | Frame |', '|---|---|---|---|---|---|---|---|']
for r in report['segments']:
    rows.append(f"| {r['id']} | {r['motion_pct']} | {r['still_pairs_pct']} | {len(r['spikes_at_lt'])} {r['spikes_at_lt'][:3]} | {r['ms_mean']}/{r['ms_max']} | {r['ms_cold']} | {'✓' if r['deterministic'] else '✗'} | {len(r['framing'])} |")
fr = [(r['id'], x) for r in report['segments'] for x in r['framing']]
if fr: rows += ['', 'Frame clues (full film seconds, duration ≥0.3s; watch this frame and judge):'] + [f"- {x['kind']} {x['t'][0]:.2f}–{x['t'][1]:.2f}s({i} ){x['text']}" for i, x in fr]
if report.get('transitions'): rows += ['', 'Transition smoke (full frame, peak ms):' + ','.join(f"{r['type']}→{r['id']} {r['ms_max']}" for r in report['transitions'])]
(out / 'qa.md').write_text('\n'.join(rows) + ('\n\n page error: \n' + '\n'.join(errors) if errors else '') + '\n')
print('->', out / 'qa.md')
if not spec and root != Path(__file__).resolve().parent / 'engine':   # Return to the bottom (first quarter of No. 11): qa must be run before delivery. Here is a reminder to prevent qa from failing.
    import re, time
    draft = next((d / 'feedback-draft.md' for d in (root.parent, root.parent.parent) if (d / 'feedback-draft.md').exists()), None)
    if not draft: print(f'Feedback reminder: project root ({root.parent.name}) has no feedback-draft.md yet. Add findings after each revision; see references/12-narrated-films-and-feedback.md.')
    else:
        txt = draft.read_text(); age = (time.time() - draft.stat().st_mtime) / 60
        tail = txt.rsplit('> Watermark', 1)[-1] if '> Watermark' in txt else txt     # Below the water mark = the skill has not been written back yet
        n = len(re.findall(r'^### \[', tail, re.M))
        print(f'Feedback reminder: feedback-draft.md was last updated {age:.0f} minutes ago; entries not yet integrated into the skill: {n}  (integrate findings before delivery, then append a > Watermark <time> line to the draft).')
if errors: raise SystemExit('❌ There are %d errors when running the page, see qa.md' % len(errors))
