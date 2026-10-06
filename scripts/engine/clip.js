// Parameterized fragment runtime: a spec (JSON) → an animation with a duration strictly equal to spec.duration. Use it as an "animation segment" for the oral video pipeline.
// For the contract, see references/09-video-animation-grammars.md "Fragment Contract". The difference from engine.js: there is no paragraph table/transition, one syntax is draw(c, t, ctx), and the canvas size is read from spec (portrait screen is also acceptable).
//
// spec = { grammar, duration, fps=30, width=1920, height=1080, safe?: {top,bottom,left,right (px, left for subtitles/platform UI), fill? (the left edge is painted with this color)}, theme?, alpha?, data?, cues: [{at, kind, text?, sub?, data?, image?, dur?}] }
// Grammar file clips/<grammar>.js registration CLIPS[grammar] = { init?(ctx), draw(c, t, ctx), safe?: true (write only after typesetting according to ctx.safe / ctx.box, otherwise spec.safe will alert) }.
// Alignment convention (CLIP.lt): The "uncovered frame" of the cue = the frame where at is located - the element is first visible in the frame t = at, and the internal time of the animation is calculated from at − 1 frame.
(() => {
const cv = document.getElementById('c'), c = cv.getContext('2d');
window.__canvas = cv;
window.CLIPS = window.CLIPS || {};
const C = window.CLIP = {};
const fail = msg => { window.__bootFailed = msg; console.error('CLIP BOOT FAILED\n' + msg); };

// ---------- Gadget for grammar files ----------
// In-film time: cue is first visible in frame at
C.lt = (t, at, fps) => t - at + 1 / fps;
// Progress: Dur seconds from at to 0→1 (at this frame is already >0)
C.p = (t, at, dur, fps) => U.clamp(C.lt(t, at, fps) / dur);
// Put it into the frame in equal proportions (contain, not cut): return {x, y, w, h}
C.fit = (iw, ih, bx, by, bw, bh) => { const s = Math.min(bw / iw, bh / ih); const w = iw * s, h = ih * s; return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h, s }; };
// Normalized rectangle [x,y,w,h] (0..1, relative to the picture) → picture rectangle
C.sub = (r, box) => ({ x: box.x + r[0] * box.w, y: box.y + r[1] * box.h, w: r[2] * box.w, h: r[3] * box.h });
C.text = (cue, ...fallback) => (cue && (cue.text ?? cue.data?.text)) ?? fallback.find(v => v != null) ?? '';

async function boot() {
  let spec = window.CLIP_SPEC;
  if (!spec) {                                                           // Preview:?spec=<path relative to engine>
    const u = new URLSearchParams(location.search).get('spec');
    if (!u) return fail('No spec: render.py --spec will inject window.CLIP_SPEC; use clip.html?spec=examples/<name>.json for preview');
    spec = await (await fetch(u)).json();
    const base = u.replace(/[^/]*$/, '');
    const fix = p => p && !/^(data:|https?:|\/)/.test(p) ? base + p : p;
    (spec.cues || []).forEach(q => { if (q.image) q.image = fix(q.image); });
    if (spec.data && spec.data.image) spec.data.image = fix(spec.data.image);
  }
  if (location.search.includes('render=1')) document.body.classList.add('render');
  const W = spec.width || 1920, H = spec.height || 1080, FPS = spec.fps || 30;
  if (!spec.grammar) return fail('spec lacks grammar');
  if (!(spec.duration > 0)) return fail('spec.duration must > 0');
  cv.width = W; cv.height = H; U.setStage(W, H);
  // Syntax file (synchronous XHR + eval, with sourceURL, error reporting can be located)
  const x = new XMLHttpRequest(); x.open('GET', `clips/${spec.grammar}.js`, false);
  try { x.send(); } catch (e) { return fail('Requesting grammar file failed ' + e); }
  if (x.status !== 200) return fail(`There is no such syntax: clips/${spec.grammar}.js(HTTP ${x.status})`);
  try { (0, eval)(x.responseText + `\n//# sourceURL=clips/${spec.grammar}.js`); } catch (e) { return fail(`clips/${spec.grammar}.js execution error ${e.stack || e}`); }
  const G = CLIPS[spec.grammar]; if (!G || typeof G.draw !== 'function') return fail(`clips/${spec.grammar}.js is not registered CLIPS['${spec.grammar}'] = { draw }`);
  // picture
  const IMG = {}, urls = new Set();
  (spec.cues || []).forEach(q => q.image && urls.add(q.image)); if (spec.data && spec.data.image) urls.add(spec.data.image);
  try { await Promise.all([...urls].map(u => new Promise((res, rej) => { const im = new Image(); im.onload = () => { IMG[u] = im; res(); }; im.onerror = () => rej(u); im.src = u; }))); }
  catch (u) { return fail('Image loading failed:' + u); }
  // Font + glyph check (the missing glyph in the spec only warns: the font will still be rendered when the system is rolled back, but it will change when changing the machine)
  for (const f of (window.FONT_FACES || [])) { const ff = new FontFace(f.family, `url(${f.url})`, f.desc || {}); await ff.load(); document.fonts.add(ff); }
  await document.fonts.ready; await U.loadCmaps();
  const cues0 = (spec.cues || []).map((q, i) => ({ ...q, i, at: +q.at || 0 })).sort((a, b) => a.at - b.at || a.i - b.i);
  for (const q of cues0) if (q.at > spec.duration + 1e-9) console.warn(`cue ${q.kind} at=${q.at} Clip duration exceeded ${spec.duration}s, cannot be seen, has been discarded (does not occupy space)`);
  const cues = cues0.filter(q => q.at <= spec.duration + 1e-9);   // Invisible cues are not included in the syntax: otherwise they will still occupy the layout position and the progress track will still count them.
  // The syntax of the description field of number used to be different (t2/t3 was recognized as text, y5 was recognized as sub). If it was written incorrectly, no error would be reported, but there would be no words. Unification: text and sub are aliases for each other, data.text also counts
  for (const q of cues) if (q.kind === 'number') { const cap = q.text ?? q.sub ?? (q.data && q.data.text); if (cap != null) { q.text = cap; q.sub = cap; } }
  const safe = { top: 0, bottom: 0, left: 0, right: 0, ...(spec.safe || {}) };   // Side to get out of the way (px): Pipeline burning subtitles and platform UI are pressed here, and the syntax with words is not arranged inward.
  const box = { x: safe.left, y: safe.top, w: W - safe.left - safe.right, h: H - safe.top - safe.bottom };   // Get rid of the content box after that, use it for syntax typesetting (ctx.box)
  const ctx = { spec, data: spec.data || {}, theme: spec.theme || {}, cues, W, H, FPS, u: Math.min(W, H) / 1080, portrait: H > W, alpha: !!spec.alpha, IMG, dur: spec.duration, safe, box,
    of: (...kinds) => cues.filter(q => kinds.includes(q.kind)), lt: (t, at) => C.lt(t, at, FPS), p: (t, at, d) => C.p(t, at, d, FPS) };
  if (G.fonts) { const txt = cues.map(q => [q.text, q.sub, q.data && q.data.text].filter(Boolean).join('')).join('') + JSON.stringify(spec.data || {});
    for (const fam of G.fonts) { const miss = U.missingGlyphs(fam, [...txt].filter(ch => ch.codePointAt(0) >= 0x2E80).join(''));   /* Only search Chinese characters and full-width symbols: Latin/Greek/mathematical symbols have different fonts for each grammar */ if (miss.length) console.warn(`Font "${fam}"Missing word:${miss.join('')}(System fonts will be rolled back; commonly used characters are already in the GB2312 subset, and rare characters can be supplemented with scripts/font_subset.py --text)`); } }
  if (spec.safe && (safe.top || safe.bottom || safe.left || safe.right) && !G.safe)
    console.warn(`grammar ${spec.grammar} Safe has not been connected yet (there is no safe: true in the syntax object), spec.safe is ignored: the subtitles may be pressed on the words`);
  if (G.init) G.init(ctx);
  window.CLIP_CTX = ctx;
  window.__total = spec.duration; window.__fps = FPS; window.__size = [W, H];
  // safe.fill: The open side is painted with this color (for vertical screens, the chart is made into the same "card" as the adjacent contain material, and the outside is the background color of the film); not painted in transparent mode
  const band = (safe.fill && !spec.alpha) ? (cc => { cc.fillStyle = safe.fill; const { top: t0, bottom: b0, left: l0, right: r0 } = safe;
    if (t0) cc.fillRect(0, 0, W, t0); if (b0) cc.fillRect(0, H - b0, W, b0); if (l0) cc.fillRect(0, 0, l0, H); if (r0) cc.fillRect(W - r0, 0, r0, H); }) : null;
  window.renderFrame = t => { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.save(); G.draw(c, t, ctx); c.restore(); if (band) band(c); };
  window.prepare = async () => {};
  window.__ready = true;
  window.renderFrame(0);
  const sc = document.getElementById('scrub'), tt = document.getElementById('tt'); sc.max = spec.duration; sc.step = 1 / FPS;
  sc.oninput = () => { window.renderFrame(+sc.value); tt.textContent = (+sc.value).toFixed(3); };
}
boot().catch(e => fail(String(e && e.stack || e)));
})();
