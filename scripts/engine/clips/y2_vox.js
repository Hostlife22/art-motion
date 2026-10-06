// Fragment · Vox-style collage (y2): a big desktop = the world, the materials are placed on the table in the order of appearance and connected by red lines; the camera smoothly pursues it at 60fps,
// Things on the table (slide in, highlighter, red circle, typing) are stepped at 12fps "one beat two".
// cues: image | clip (screenshot/photo/clipping: image path; text optional = black background label attached below; data.halftone:true converts to grayscale dots, retaining the original color by default; at this frame starts to slide in)
//       title (Borders-style label strip with black background and white text, typing 13 words/second) · point (horizontal index card, typing)
//       highlight (data.rect=[x,y,w,h] (0..1, relative to the picture) on the current picture: sweep the highlighter at at → circle with the red pen → push the camera closer to that area)
// The screenshots are placed in the same proportion (without cropping), and only the white edge of the paper and tape are added; the horizontal screen materials are arranged from left to right, and the vertical screen is from top to bottom. The camera follows the red line (long tail easing + short motion blur).
CLIPS.y2_vox = (() => {
const { clamp, lerp, rng } = U;
const C = { desk: '#e4ddcf', ink: '#171716', red: '#b8433f', paper: '#eeedeb', card: '#f6f4ee' };
const BOLD = '"PuHui-Heavy"', TXT = '"PuHui-Bold"';
let items, keys, strings;
// In-film time of one shot and two: at This frame is >0
const ls = (t, at) => MO.step(t - at + 1e-6, 12) + 1 / 12;
return {
  fonts: ['PuHui-Heavy', 'PuHui-Bold'],
  safe: true,
  init(ctx) {
    const { W, H, u, portrait } = ctx, r = rng(7), g = document.createElement('canvas').getContext('2d');
    items = []; let cur = 0, prev = null;
    for (const q of ctx.of('image', 'clip', 'title', 'point')) {
      let w, h, kind = q.kind === 'clip' ? 'image' : q.kind, lines = null, size = 0;
      if (kind === 'image') {
        const im = ctx.IMG[q.image]; if (!im) continue;
        const bw = W * (portrait ? 0.84 : 0.62), bh = H * (portrait ? 0.46 : 0.62), f = CLIP.fit(im.width, im.height, 0, 0, bw, bh);
        w = f.w + 32 * u; h = f.h + 32 * u + (q.text ? 70 * u : 0);
      } else {
        if (!String(q.text ?? '').trim()) { console.warn(`y2 ${q.kind} at=${q.at}: text is empty, this card is skipped`); continue; }   // The width of the empty card is −Infinity, and the tearing point column will loop endlessly.
        size = (kind === 'title' ? 64 : 48) * u;
        lines = TY.wrap(g, q.text || '', W * (portrait ? 0.74 : 0.5), `${size}px ${kind === 'title' ? BOLD : TXT}`);
        g.font = `${size}px ${kind === 'title' ? BOLD : TXT}`;
        w = Math.max(...lines.map(l => g.measureText(l).width)) + (kind === 'title' ? 80 : 110) * u; h = lines.length * size * 1.45 + (kind === 'title' ? 50 : 100) * u;
      }
      const gap = 260 * u, jitter = (r() - 0.5) * (portrait ? W * 0.12 : H * 0.12);
      const x = portrait ? W / 2 + jitter : (prev ? prev.x + prev.w / 2 + gap + w / 2 : W / 2);
      const y = portrait ? (prev ? prev.y + prev.h / 2 + gap + h / 2 : H / 2) : H / 2 + jitter;
      const it = { q, kind, x, y, w, h, rot: (r() - 0.5) * 0.07, lines, size, seed: 11 + items.length * 7 };
      items.push(it); prev = it; cur++;
    }
    // The typing speed and "reading completion" time of the text card: the default is 13 words/second; when the next item is too close, the speed will be increased (up to 40 words/second) to ensure that the typing is completed before the camera leaves, and then paused for 0.5 seconds for the person to finish reading.
    items.forEach((it, i) => {
      if (it.kind === 'image') { it.done = it.q.at + 0.6; return; }
      const nC = [...(it.q.text || '')].length, next = items[i + 1] ? items[i + 1].q.at : ctx.dur;
      it.cps = clamp(nC / Math.max(0.3, next - it.q.at - 0.95 - 0.5), 13, 40);
      it.done = it.q.at + nC / it.cps + 0.5;
    });
    // Red line: Nail the right edge of the previous piece (lower edge of the vertical screen) to the left edge (upper edge) of the next piece
    strings = items.slice(1).map((b, i) => { const a = items[i];
      const pa = portrait ? [a.x + a.w * 0.2, a.y + a.h / 2 - 20 * u] : [a.x + a.w / 2 - 30 * u, a.y + a.h * 0.25];
      const pb = portrait ? [b.x - b.w * 0.2, b.y - b.h / 2 + 20 * u] : [b.x - b.w / 2 + 30 * u, b.y - b.h * 0.25];
      const pts = CL.stringPts(pa, pb, 0.06); return { a: pa, b: pb, pts, cum: DG.cum(pts), at: b.q.at }; });
    // Camera keyframe: start chasing each piece ≈0.9s before it arrives (long tail), and settle before its at; when highlighting, push that piece closer
    const Hs = H - ctx.safe.top - ctx.safe.bottom;                           // Allow the available height behind the subtitles; move the center of the screen down/up synchronously (translate in draw)
    const zFor = it => clamp(Math.min(W * 0.82 / it.w, Hs * 0.8 / it.h), 0.5, 1.6);
    keys = []; let last = null;
    const hls = ctx.of('highlight');
    const events = [...items.map(it => ({ at: it.q.at, it })), ...hls.map(h => ({ at: h.at, h }))].sort((a, b) => a.at - b.at);
    let curItem = null;
    for (const e of events) {
      if (e.it) {
        const tgt = { x: e.it.x, y: e.it.y, z: zFor(e.it) };
        if (!last) { keys.push({ t: 0, ...tgt }); }
        else { const t0 = Math.max(last.t + 0.25, e.at - 0.95, Math.min(curItem ? curItem.done : 0, e.at - 0.4)), t1 = Math.max(t0 + 0.35, e.at - 0.05);   // The camera will not leave until the last card is read (starts at −0.4 at the latest)
          keys.push({ t: t0, x: last.x, y: last.y, z: last.z }); keys.push({ t: t1, ...tgt, ease: MO.longTail }); }
        last = keys[keys.length - 1]; curItem = e.it;
      } else if (curItem && curItem.kind === 'image' && e.h.data && e.h.data.rect) {
        const im = ctx.IMG[curItem.q.image], R = e.h.data.rect, ib = imgBox(curItem, im, u);
        const cx = curItem.x + (ib.x + (R[0] + R[2] / 2) * ib.w) - curItem.w / 2, cy = curItem.y + (ib.y + (R[1] + R[3] / 2) * ib.h) - curItem.h / 2;
        const rw = R[2] * ib.w, rh = R[3] * ib.h;
        let zFit = Math.min(W * 0.8 / (rw * 1.4 + 32 * u), Hs * 0.8 / (rh * 1.44 + 20 * u));   // After the red circle (the ellipse of the drawItem below) is pushed closer, the entire circle remains in the painting, leaving 10% on the left and right sides (review: at 0.9, the circle with shaking hands and motion blur will still appear in the painting)
        if (R[2] >= 0.5) zFit = Math.min(zFit, Math.max(last.z, W * 0.96 / curItem.w));          // The frame occupies more than half of the picture: pushing it closer will only cut off the words on both sides of the picture, without pushing it
        const z = Math.min(clamp(Math.min(W * (ctx.portrait ? 0.78 : 0.55) / rw, Hs * 0.55 / rh), last.z, last.z * 2.6), zFit);   // Vertical screen width is the bottleneck: push the frame to about 80% of the picture width
        // The starting point of the frame (the highlighter is swept from the left edge) is visible in the current camera: draw first, at+0.2 and then zoom in; invisible (it is outside the frame after the last zoom):
        // First move the camera over, and the previous frame is in place, and then reveal it - otherwise, the frame that is revealed will be off-screen, and the audience will not see it until more than 0.2s later (7 frames later in the vertical screen test in 2026-10)
        const x0 = cx - rw / 2, inView = Math.abs(x0 - last.x) * last.z < W / 2 - 20 * u && Math.abs(cy - last.y) * last.z < Hs / 2 - rh * last.z / 2;
        const t0 = inView ? Math.max(last.t + 0.1, e.at + 0.2) : Math.max(last.t + 0.1, e.at - 0.8), t1 = inView ? t0 + 1.0 : Math.max(t0 + 0.35, e.at - 1 / ctx.FPS);
        keys.push({ t: t0, x: last.x, y: last.y, z: last.z }); keys.push({ t: t1, x: cx, y: cy, z, ease: MO.sineInOut });
        last = keys[keys.length - 1];
      }
    }
    if (!keys.length) keys.push({ t: 0, x: W / 2, y: H / 2, z: 1 });
    const end = keys[keys.length - 1]; keys.push({ t: Math.max(end.t + 0.01, ctx.dur), x: end.x, y: end.y, z: end.z * (1 + 0.01 * Math.max(0, ctx.dur - end.t)), ease: MO.linear });   // 1%/s slow push after stopping
  },
  draw(c, t, ctx) {
    const { W, H, u } = ctx, cam = CAM.at(keys, t);
    const buf = UI.scratch('clip_vox', W, H), g = buf.getContext('2d'); g.reset();
    g.save(); g.translate(0, (ctx.safe.top - ctx.safe.bottom) / 2); CAM.apply(g, cam);
    if (!ctx.alpha) { g.fillStyle = g.createPattern(CL.paperTile('clipdesk', C.desk, { amt: 12, fibers: 320, fiberCol: [110, 95, 70] }), 'repeat'); const s = 4 / cam.z; g.fillRect(cam.x - W * s, cam.y - H * s, W * 2 * s, H * 2 * s); }
    // Red line: trace as the next item arrives (12fps)
    for (const s of strings) { const q = MO.sineInOut(clamp(ls(t, s.at - 0.9) / 0.7)); if (t < s.at - 0.9) continue;
      CL.string(g, s.pts, s.cum, s.cum[s.cum.length - 1] * q, { col: C.red, lw: 5 * u }); CL.pin(g, s.a[0], s.a[1], C.red); if (q >= 1) CL.pin(g, s.b[0], s.b[1], C.red); }
    for (const it of items) {
      const q = it.q; if (t < q.at - 1e-6) continue;
      // One shot and two are calculated from at (ls), not from the absolute 12fps grid: rounding according to the grid will cause the material to be exposed 1–2 frames earlier than the cue (2026-10 vertical screen measurement is 2 frames earlier)
      CL.slideIn(g, q.at + ls(t, q.at), q.at, it.x, it.y, it.rot, gg => drawItem(gg, it, t, ctx), { from: ctx.portrait ? [120 * u, 360 * u] : [420 * u, -60 * u], tilt: 0.2, dur: 0.55, fps: 1e6 });
    }
    g.restore();
    const [vx, vy] = CAM.velocity(tt => CAM.at(keys, tt), t);
    if (Math.hypot(vx, vy) >= 1.5) c.drawImage(buf, 0, 0);   // First, pad a non-offset one: motionBlur. The first one is offset, and a semi-transparent circle will be left on the four sides of the screen (the output film will be gray edges)
    CAM.motionBlur(c, buf, vx * 0.6, vy * 0.6, 7);
    if (!ctx.alpha) {                                                   // Vignetting + static grain (the paper texture is tightly adhered and does not shake frame by frame)
      const v = PAINT.cached('clip_vox_vig' + W + 'x' + H, W, H, gg => { const r = gg.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.max(W, H) * 0.62); r.addColorStop(0, 'rgba(40,30,20,0)'); r.addColorStop(1, 'rgba(40,30,20,.34)'); gg.fillStyle = r; gg.fillRect(0, 0, W, H); });
      c.drawImage(v, 0, 0);
    }
  },
};
function imgBox(it, im, u) { const f = CLIP.fit(im.width, im.height, 16 * u, 16 * u, it.w - 32 * u, it.h - 32 * u - (it.q.text ? 70 * u : 0)); return f; }
function drawItem(g, it, t, ctx) {
  const { u } = ctx, q = it.q, w = it.w, h = it.h;
  if (it.kind === 'image') {
    const im = ctx.IMG[q.image], f = imgBox(it, im, u);
    CL.shadowed(g, () => { g.fillStyle = '#f2f0ea'; g.fillRect(-w / 2, -h / 2, w, h); }, { blur: 12 * u, x: 3 * u, y: 7 * u });
    if (q.data && q.data.halftone) { const src = PAINT.canvas(Math.round(f.w), Math.round(f.h)); src.getContext('2d').drawImage(im, 0, 0, src.width, src.height); g.drawImage(CL.halftone('clipimg' + it.seed, src, { cell: 5 * u, contrast: 1.25 }), -w / 2 + f.x, -h / 2 + f.y, f.w, f.h); }
    else g.drawImage(im, -w / 2 + f.x, -h / 2 + f.y, f.w, f.h);
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(214,205,185,.18)'; g.fillRect(-w / 2, -h / 2, w, h); g.restore();   // Printed on paper: press a layer of old paper color
    CL.tape(g, -w / 2 + 40 * u, -h / 2 + 8 * u, -0.6, 120 * u); CL.tape(g, w / 2 - 40 * u, -h / 2 + 8 * u, 0.5, 120 * u);
    if (q.text) { const fs = TY.fit(g, q.text, w - 72 * u, 34 * u, 'PuHui-Bold', { maxLines: 1, min: 0.5 }); g.font = `${fs.size}px ${TXT}`;   // The label strip is measured according to the word width. If it cannot fit, it will be shortened.
      g.fillStyle = C.ink; g.fillRect(-w / 2 + 16 * u, h / 2 - 72 * u, g.measureText(q.text).width + 40 * u, 56 * u); g.fillStyle = C.paper; g.textBaseline = 'middle'; g.fillText(q.text, -w / 2 + 36 * u, h / 2 - 43 * u); }
    // Highlight: highlighter (multiply, swipe twice in one shot) → red pen circle
    for (const hq of ctx.of('highlight')) {
      if (!hq.data || !hq.data.rect || hq.at < q.at) continue;
      const own = ctx.of('image', 'clip').filter(z => z.at <= hq.at).pop(); if (own !== q) continue;
      const l = t - hq.at; if (l < -1e-6) continue;
      const R = hq.data.rect, x0 = -w / 2 + f.x + R[0] * f.w, y0 = -h / 2 + f.y + R[1] * f.h, rw = R[2] * f.w, rh = R[3] * f.h;
      CL.highlight(g, x0 - 6 * u, y0 - 4 * u, rw + 12 * u, rh + 8 * u, MO.sineInOut(clamp(ls(t, hq.at) / 0.6)));
      const cq = MO.cubicOut(clamp((ls(t, hq.at) - 0.5) / 0.6));
      const newer = ctx.of('highlight').find(z => z.at > hq.at && z.at <= t + 1e-6 && z.data && z.data.rect && ctx.of('image', 'clip').filter(y => y.at <= z.at).pop() === q);
      const fa = newer ? 1 - 0.75 * clamp((t - newer.at) / 0.3) : 1;   // The same picture is circled next: the old red circle has faded into a faint mark, so that the two circles will not overlap and the old circle will be out of the picture.
      if (cq > 0) { const pts = DG.hand(DG.ellipsePts(x0 + rw / 2, y0 + rh / 2, rw * 0.7 + 16 * u, rh * 0.72 + 10 * u, -2.6, 1.08, 44), { amp: 2.2 * u, seed: it.seed }), L = DG.cum(pts);
        g.save(); g.globalAlpha *= fa; g.strokeStyle = C.red; g.lineWidth = 7 * u; g.lineCap = 'round'; g.lineJoin = 'round'; DG.drawPartial(g, pts, L, L[L.length - 1] * cq); g.restore(); }
    }
  } else {
    const n = Math.ceil(ls(t, q.at) * (it.cps || 13)), title = it.kind === 'title';
    CL.shadowed(g, () => { g.fillStyle = title ? C.ink : C.card; g.save(); g.translate(-w / 2, -h / 2); CL.tornRect(g, w, h, it.seed, 3 * u); g.fill(); g.restore(); }, { blur: 10 * u, x: 3 * u, y: 6 * u });
    if (!title) { g.strokeStyle = 'rgba(80,140,200,.3)'; g.lineWidth = 2 * u; for (let y = -h / 2 + 90 * u; y < h / 2; y += it.size * 1.45) { g.beginPath(); g.moveTo(-w / 2, y); g.lineTo(w / 2, y); g.stroke(); }
      g.strokeStyle = 'rgba(184,67,63,.5)'; g.beginPath(); g.moveTo(-w / 2, -h / 2 + 56 * u); g.lineTo(w / 2, -h / 2 + 56 * u); g.stroke(); }
    g.fillStyle = title ? C.paper : C.ink; g.font = `${it.size}px ${title ? BOLD : TXT}`; g.textBaseline = 'alphabetic';
    let k = 0; it.lines.forEach((ln, li) => { let x = -w / 2 + (title ? 40 : 55) * u; const y = -h / 2 + (title ? 25 * u : 70 * u) + (li + 1) * it.size * 1.3;
      for (const ch of ln) { if (k < n) g.fillText(ch, x, y); x += g.measureText(ch).width; k++; } });
  }
}
})();
