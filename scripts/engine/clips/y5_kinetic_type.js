// Fragments · Dynamic Text (y5): The words are the actors. One cue page: the subject slams in at the frame (spring overshoot ≈8%), and the auxiliary clause rises from the slot;
// Page change is ribbon erasure, the frame where the new page is exposed = at (erasure starts 0.3s before at).
// cues: title | point (one page: text subject (too long, automatically abbreviated, up to two lines), sub auxiliary sentence, data.label upper left small label such as "01")
//       number (a page of large numbers: data {value, prefix, suffix, decimals}, at = the moment when the number settles, the page appears 0.7s in advance and starts scrolling)
//       highlight (brush the word data.word in the current page with a highlighter + zoom in; if you don’t give word, brush the entire main word)
//       Keywords in sub: data.key Write a word in the auxiliary sentence, and use the accent color for that word (as in the demonstration film "Next Line")
//       The description of number can be written as text or sub (clip.js has been unified); data.label still exists
// More than two point pages = a list: picture progress track (01/02/03, tell the audience which number, how many in total; horizontal screen at the top right, vertical screen at the bottom) and background giant serial number (low contrast, diagonal slow drift, data.num can be specified).
// data.palette = [[background color, text color], ...] Change the color. Alpha mode does not draw the background, and the text is white with dark strokes. safe: The main word block is centered between top..H-bottom, and the progress track is also in this area.
CLIPS.y5_kinetic_type = (() => {
const { clamp, lerp } = U;
const PAL = [['#FFD23F', '#111111'], ['#FF5A36', '#FFFFFF'], ['#14213D', '#FFD23F'], ['#F4EFE6', '#111111']];
let pages, LIST;
const accentOf = col => col[0] === '#FFD23F' || col[0] === '#F4EFE6' || col[1] === '#FFD23F' ? '#FF5A36' : '#FFD23F';   // If the text itself is yellow (dark blue page), use orange, otherwise the coloring will not make it visible.
return {
  fonts: ['PuHui-Black', 'PuHui-Heavy', 'PuHui-Bold'],
  safe: true,
  init(ctx) {
    const { W, u } = ctx, pal = ctx.data.palette || PAL, g = document.createElement('canvas').getContext('2d');
    pages = ctx.of('title', 'point', 'number').map((q, i) => {
      const num = q.kind === 'number', nd = q.data || {};
      const text = num ? (nd.prefix || '') + TY.fmt(nd.value || 0, nd.decimals ?? 0) + (nd.suffix || '') : (q.text || '');
      const S0 = (ctx.portrait ? 250 : 300) * u;
      let f = TY.fit(g, text, W * 0.86, S0, 'PuHui-Black', { maxLines: 1, min: 0.55, soft: true });   // First reduce the font size and put it on one line, and then fold it into two lines; if you shrink a single long English word, it must still fit in it.
      if (!f.ok) f = num ? TY.fit(g, text, W * 0.86, S0, 'PuHui-Black', { maxLines: 1 })   // Numbers do not wrap (character by word becomes wider when scrolling, and will jump when folded): only the font size is reduced
                     : TY.fit(g, text, W * 0.86, S0, 'PuHui-Black', { maxLines: 2, min: 0.3, balance: true });
      const sf = q.sub ? TY.fit(g, q.sub, W * 0.86, (ctx.portrait ? 64 : 80) * u, 'PuHui-Heavy', { maxLines: 2, min: 0.6, balance: true }) : null;   // Complementary sentence: If you can’t fit it in, shrink it first and then fold it into two lines.
      const show = num ? q.at - 0.7 : q.at;
      return { q, i, num, nd, text, f, sf, show, col: pal[i % pal.length] };
    });
    const pts = pages.filter(p => p.q.kind === 'point'); pts.forEach((p, k) => { p.ord = k + 1; });
    LIST = pts.length >= 2 ? pts : null;
    // The highlighted word is not on the page: only alert (nothing happened before)
    for (const h of ctx.of('highlight')) { const w = h.data && h.data.word; if (!w) continue; const pg = [...pages].reverse().find(p => p.show <= h.at + 1e-6);
      if (pg && !pg.f.lines.some(l => l.includes(w))) console.warn(`y5 highlight at=${h.at}: There is no " in the subject word${w}” (subject “${pg.text}”; the highlighter only paints the main words, and the words in the auxiliary sentences are colored with data.key). This time it does nothing.`); }
  },
  draw(c, t, ctx) {
    const { W, H, u } = ctx;
    let k = -1; pages.forEach((p, i) => { if (t >= p.show - 1e-6) k = i; });
    const P = pages[Math.max(0, k)]; if (!P) return;
    const page = (p, c2) => drawPage(c2, p, t, ctx);
    // Bottom + dot matrix
    if (!ctx.alpha) { c.fillStyle = P.col[0]; c.fillRect(0, 0, W, H); dots(c, t, P.col[1], 0.07, u, W, H); }
    if (k >= 0) {
      // Shooting point micro-shooting: when each cue falls, the entire screen is enlarged by 1.5% and attenuated in 0.15s
      let bump = 1; for (const q of ctx.cues) { const l = t - q.at; if (l >= 0 && l < 0.4) bump += 0.015 * Math.exp(-l * 22); }
      const [dx, dy] = CAM.drift(t, 5 * u, 2);
      CAM.with(c, { x: W / 2 + dx, y: H / 2 + dy, z: bump, r: 0.008 * Math.sin(t * 0.8) }, cc => { ghost(cc, P, t, ctx); page(P, cc); });
      track(c, P, t, ctx);
    }
    // Page change: two ribbons are swept from left to right, and a new page is revealed behind the last one (the frame exposed = the show moment of the new page)
    const N = pages[k + 1];
    if (N && !ctx.alpha) {
      const p = (t - (N.show - 0.3)) / 0.36; if (p > 0 && p < 1) {
        const mid = ['#FFD23F', '#FF5A36', '#14213D', '#3A86FF'].find(x => x !== P.col[0] && x !== N.col[0]), cols = [mid, N.col[0]], sk = H * 0.35;   // Two items: one and an accent color with different background colors at the front and back + new background color (in the past, the first item was the text color, and the entire screen would flash a frame of white in front of the white text page)
        const edge = q => lerp(-sk - 40, W + sk + 40, MO.expoInOut(clamp(q)));
        cols.forEach((col, i) => { const x = edge((p - i * 0.12) / 0.76); c.save(); c.beginPath(); c.moveTo(-sk - 60, 0); c.lineTo(x + sk, 0); c.lineTo(x, H); c.lineTo(-sk - 60, H); c.closePath(); c.clip(); c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore(); });
      }
    }
  },
};
function dots(c, t, col, a, u, W, H) { const g = 64 * u, ox = (t * 36 * u) % g, oy = (t * 18 * u) % g; c.save(); c.globalAlpha = a; c.fillStyle = col; for (let y = -g; y < H + g; y += g) for (let x = -g; x < W + g; x += g) { c.beginPath(); c.arc(x + ox, y + oy, 4 * u, 0, Math.PI * 2); c.fill(); } c.restore(); }
function drawPage(c, P, t, ctx) {
  const { W, H, u } = ctx, q = P.q, fg = ctx.alpha ? '#FFFFFF' : P.col[1], lt = ctx.lt(t, P.num ? P.show : q.at);
  const stroke = ctx.alpha ? { stroke: '#111', strokeW: P.f.size * 0.06 } : {};
  const lines = P.num ? [P.text] : P.f.lines, size = P.f.size, lh = size * 1.08;
  const sub = q.sub, subSz = P.sf ? P.sf.size : 0, subL = P.sf ? P.sf.lines : [];
  const by0 = ctx.safe.top, by1 = H - ctx.safe.bottom - (ctx.portrait && LIST ? 220 * u : 0), cyB = ctx.portrait ? by0 + (by1 - by0) * 0.44 : (by0 + by1) / 2;
  const blockH = lines.length * lh + (sub ? subSz * (0.6 + subL.length * 1.15) : 0), y0 = cyB - blockH / 2 + size * 0.82;
  // Label (top left)
  const label = q.data && q.data.label;
  if (label) TY.rise(c, label, (ctx.portrait ? 80 : 140) * u, ctx.safe.top + (ctx.portrait ? 260 : 210) * u, MO.at(lt, 0, 0.3), { size: (ctx.portrait ? 56 : 52) * u, fam: 'PuHui-Bold', color: fg, track: 6 * u, ...(ctx.alpha ? { stroke: '#111', strokeW: 6 * u } : {}) });
  // Highlight (draw behind the words)
  const hq = ctx.of('highlight').filter(h => h.at >= (P.num ? P.show : q.at) - 1e-6).find(h => { const nx = ctx.of('title', 'point', 'number').find(z => z.at > q.at); return !nx || h.at < nx.at; });
  let hiScale = 1, knock = null;
  if (hq) {
    const hl = ctx.lt(t, hq.at), wd = hq.data && hq.data.word, found = !wd || lines.some(l => l.includes(wd));
    hiScale = hl > 0 && found ? 1 + 0.06 * MO.settle(hl, 1, 2.5, 6) : 1;                     // The word is not in the main word: no brushing or amplification (alarm in init)
    if (hl > 0) lines.forEach((ln, i) => {
      const word = wd || ln, at = ln.indexOf(word); if (at < 0) return;
      const wPre = TY.width(c, ln.slice(0, at), size), wW = TY.width(c, word, size), wl = TY.width(c, ln, size), x = W / 2 - wl / 2 + wPre, y = y0 + i * lh;
      const mc = ctx.alpha ? '#FF5A36' : (P.col[0] === '#FFD23F' ? '#FF5A36' : '#FFD23F'), mr = [x - 12 * u, y - size * 0.86, wW + 24 * u, size * 1.0, MO.at(hl, 0, 0.3)];
      TY.marker(c, ...mr, mc);
      if (mc.toLowerCase() === fg.toLowerCase()) (knock = knock || []).push({ i, mr });   // The highlighter pen and the words are the same color (dark blue page with yellow letters): the words under the pen are turned white into the background color, otherwise the whole word will be painted out
    });
  }
  // Main word: Each line is smashed in at (+0.08s/line); the number page rolls from 0 to settled
  lines.forEach((ln, i) => {
    let s = ln; if (P.num) { const k = MO.expoOut(clamp(lt / 0.7)); s = (P.nd.prefix || '') + TY.fmt((P.nd.value || 0) * k, P.nd.decimals ?? 0) + (P.nd.suffix || ''); }
    const w = TY.width(c, s, size), x = W / 2 - w / 2, y = y0 + i * lh;
    TY.slam(c, s, x, y, lt - i * 0.08, { size, color: fg, scale: hiScale, ox: W / 2, oy: y - size * 0.36, ...stroke });
    for (const k of (knock || []).filter(k => k.i === i)) {             // Only in the parallelogram of the highlighter, use the background color to hit the same line again (the same shape as TY.marker)
      const [mx, my, mw, mh, mp] = k.mr, ww = mw * MO.expoOut(clamp(mp)), sk = mh * 0.18;
      c.save(); c.beginPath(); c.moveTo(mx + sk, my); c.lineTo(mx + ww + sk, my); c.lineTo(mx + ww, my + mh); c.lineTo(mx, my + mh); c.closePath(); c.clip();
      TY.slam(c, s, x, y, lt - i * 0.08, { size, color: P.col[0], scale: hiScale, ox: W / 2, oy: y - size * 0.36 }); c.restore();
    }
  });
  if (sub) subL.forEach((ln, k) => {                                      // Auxiliary sentence (can be two lines); use the emphasis color for the word data.key
    const sw = TY.width(c, ln, subSz, 'PuHui-Heavy'), sy = y0 + (lines.length - 1) * lh + subSz * (1.7 + k * 1.15), sp = MO.at(lt, 0.35 + k * 0.08, 0.35), so = { size: subSz, fam: 'PuHui-Heavy', color: fg, ...(ctx.alpha ? { stroke: '#111', strokeW: subSz * 0.08 } : {}) };
    const key = q.data && q.data.key, ki = key ? ln.indexOf(key) : -1, x0 = W / 2 - sw / 2;
    if (ki < 0) return TY.rise(c, ln, x0, sy, sp, so);
    const pre = ln.slice(0, ki), post = ln.slice(ki + key.length), wp = TY.width(c, pre, subSz, 'PuHui-Heavy'), wk = TY.width(c, key, subSz, 'PuHui-Heavy');
    if (pre) TY.rise(c, pre, x0, sy, sp, so); TY.rise(c, key, x0 + wp, sy, sp, { ...so, color: ctx.alpha ? '#FFD23F' : accentOf(P.col) }); if (post) TY.rise(c, post, x0 + wp + wk, sy, sp, so);
  });
}
// Background giant serial number: lower right corner of the list page (vertical screen falls on the bottom half of the screen), low contrast, diagonally drifting slowly after the spring is in place; does not compete with the main word (font color 12% transparency)
function ghost(c, P, t, ctx) {
  if (!LIST || !P.ord || ctx.alpha) return;
  const { W, H, u } = ctx, lt = t - P.show, k = MO.springHz(lt, 2.0, 8), sc = lerp(1.35, 1, k), s = String((P.q.data && P.q.data.num) ?? P.ord);
  const size = (ctx.portrait ? 1000 : 900) * u, x = W - (ctx.portrait ? 40 : 60) * u + lt * 14 * u, y = H - ctx.safe.bottom + (ctx.portrait ? -120 : 70) * u - lt * 10 * u;
  TY.text(c, s, x, y, { size, fam: 'PuHui-Black', align: 'right', color: P.col[1], alpha: 0.12 * clamp(lt / 0.08), scale: sc, ox: x - size * 0.28, oy: y - size * 0.36 });
}
// Progress track: 01/02/03 three grids (several points per page), the grid on the current page lights up when the page is changed and the frame is exposed; the drawing is outside the camera and does not shake with the page
function track(c, P, t, ctx) {
  if (!LIST) return;
  const { W, H, u } = ctx, n = LIST.length, k = LIST.filter(p => p.show <= t + 1e-6).length; if (k === 0) return;
  const fg = ctx.alpha ? '#FFFFFF' : P.col[1], gap = 18 * u, seg = Math.min((ctx.portrait ? 150 : 110) * u, ((ctx.portrait ? W * 0.86 : W * 0.4) - (n - 1) * gap) / n), tot = n * seg + (n - 1) * gap;   // When there are many key points, each frame becomes narrower and the picture cannot be drawn.
  const x0 = ctx.portrait ? (W - tot) / 2 : W - (ctx.portrait ? 80 : 140) * u - tot, y = ctx.portrait ? H - ctx.safe.bottom - 130 * u : ctx.safe.top + 120 * u;
  const a = MO.expoOut(clamp((t - LIST[0].show) / 0.3));
  c.save(); c.globalAlpha = a;
  for (let i = 0; i < n; i++) { const x = x0 + i * (seg + gap), on = i < k, fill = on ? MO.expoOut(clamp((t - LIST[i].show) / 0.3)) : 0;
    c.fillStyle = fg; c.globalAlpha = a * 0.25; c.fillRect(x, y, seg, 10 * u); c.globalAlpha = a; c.fillRect(x, y, seg * fill, 10 * u);
    TY.text(c, String(i + 1).padStart(2, '0'), x, y - 20 * u, { size: (ctx.portrait ? 40 : 32) * u, fam: 'PuHui-Bold', color: fg, align: 'left', alpha: on ? 1 : 0.4, track: 2 * u, ...(ctx.alpha ? { stroke: '#111', strokeW: 5 * u } : {}) }); }
  c.restore();
}
})();
