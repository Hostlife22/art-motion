// Snippet · Conference-style interface (t2), the easiest way to do tutorials, functions, and parameters: dark light spots, one screen does one thing; words emerge from the blur, cards are made of frosted glass, and bounce back into place lightly.
// data: { eyebrow? (small text above the title), title?, subtitle?, accent?:'#3d6bff' }
// cues: title (at this frame the title begins to emerge from the blur; text/sub overwrites data)
//       card | step | image (a card: text card title, sub description, image screenshot path; at this frame the card starts popping up; the step numbers are in the order of appearance 01, 02..., data.step can be specified)
//         · There is an image: one screen per screen, and the screenshots are put into the card in equal proportions (contain, not cropped). Horizontal pictures are horizontal cards; vertical pictures (mobile phone screenshots) are "left words and right pictures" in the horizontal screen, and the picture fills the height
//         · No image: function card. Several consecutive cards (up to 3) stand side by side on the screen, and the old cards give way when new cards come in (like the three cards in the demo film);
//           There is an icon on the card (data.icon: wave agent memory clock phone layers chart code check play bolt lock, if you don’t write it, draw the step number),
//           Big title, description, optional a big number (data.value / prefix / suffix / decimals + data.label, count after the card is settled)
//       highlight (frame a piece of the current screenshot card: data.rect = [x, y, w, h], relative to 0..1 of the screenshot; text optional label)
//       number (large numbers on a separate screen: data {value, prefix, suffix, decimals, label? (small print above the number)}; at = the moment the number settles, start counting 0.9s in advance,
//               The previous screen begins to exit at this time and is not stacked on the card; the instructions are text or sub.)
// Vertical screen: When the first card comes in, the title is reduced to a header and remains at the top (leaving the upper and lower sections empty); the card is enlarged according to the remaining height. safe: The layout is only arranged between top..H−bottom.
// alpha: No light spots are drawn on the bottom; the card is padded with a dark layer and the text is projected, so it can be seen clearly even if it is pressed against a bright screen.
CLIPS.t2_keynote_ui = (() => {
const { clamp, lerp } = U;
const SANS = '"Inter", "PuHui-Medium"', SANSB = '"Inter", "PuHui-Bold"', ZH = '"PuHui-Medium"', ZHB = '"PuHui-Bold"';
let BL, slides, scr = {}, G;
const track = (c, size, em = -0.02) => { c.letterSpacing = (size * em).toFixed(2) + 'px'; };
// This grammar comes with several linear icons (UI.icon only has wave/memory/agent): unit box ±0.5, round head and other line widths
const ICON = {
  clock: c => { c.beginPath(); c.arc(0, 0, 0.42, 0, 7); c.stroke(); c.beginPath(); c.moveTo(0, -0.24); c.lineTo(0, 0); c.lineTo(0.18, 0.1); c.stroke(); },
  phone: c => { c.beginPath(); c.roundRect(-0.25, -0.45, 0.5, 0.9, 0.1); c.stroke(); c.beginPath(); c.moveTo(-0.08, 0.32); c.lineTo(0.08, 0.32); c.stroke(); },
  layers: c => { for (let k = 0; k < 3; k++) { const y = -0.22 + k * 0.22; c.globalAlpha = k ? 0.6 : 1; c.beginPath(); c.moveTo(-0.45, y); c.lineTo(0, y - 0.18); c.lineTo(0.45, y); c.lineTo(0, y + 0.18); c.closePath(); c.stroke(); } c.globalAlpha = 1; },
  chart: c => { c.beginPath(); c.moveTo(-0.42, -0.42); c.lineTo(-0.42, 0.4); c.lineTo(0.44, 0.4); c.stroke(); c.beginPath(); c.moveTo(-0.28, 0.18); c.lineTo(-0.06, -0.04); c.lineTo(0.1, 0.06); c.lineTo(0.36, -0.26); c.stroke(); },
  code: c => { c.beginPath(); c.moveTo(-0.18, -0.28); c.lineTo(-0.42, 0); c.lineTo(-0.18, 0.28); c.moveTo(0.18, -0.28); c.lineTo(0.42, 0); c.lineTo(0.18, 0.28); c.moveTo(0.08, -0.38); c.lineTo(-0.08, 0.38); c.stroke(); },
  check: c => { c.beginPath(); c.arc(0, 0, 0.42, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-0.2, 0); c.lineTo(-0.05, 0.16); c.lineTo(0.22, -0.16); c.stroke(); },
  play: c => { c.beginPath(); c.moveTo(-0.22, -0.34); c.lineTo(0.34, 0); c.lineTo(-0.22, 0.34); c.closePath(); c.fill(); },
  bolt: c => { c.beginPath(); c.moveTo(0.08, -0.46); c.lineTo(-0.28, 0.06); c.lineTo(0, 0.06); c.lineTo(-0.08, 0.46); c.lineTo(0.28, -0.06); c.lineTo(0, -0.06); c.closePath(); c.fill(); },
  lock: c => { c.beginPath(); c.roundRect(-0.32, -0.04, 0.64, 0.46, 0.08); c.stroke(); c.beginPath(); c.arc(0, -0.04, 0.2, Math.PI, 0); c.stroke(); },
};
const icon = (g, kind, x, y, s, col, t) => {
  if (['wave', 'memory', 'agent'].includes(kind)) return UI.icon(g, kind, x, y, s, col, t);
  const f = ICON[kind]; if (!f) return false;
  g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 0.075; g.lineCap = 'round'; g.lineJoin = 'round'; f(g); g.restore();
};
// Only if it can fit: TY.fit measure the width of each line, and fold multiple lines into equal lengths (leaving no words in the description hanging on the next line)
const fitB = (g, text, maxW, size, fam, o = {}) => TY.fit(g, text, maxW, size, fam, { ...o, balance: true });
const fmtNum = (d, k) => (d.prefix || '') + TY.fmt((+d.value || 0) * k, d.decimals ?? 0) + (d.suffix || '');
return {
  fonts: ['PuHui-Medium', 'PuHui-Bold'],
  safe: true,
  init(ctx) {
    const { W, H, u, safe } = ctx;
    BL = [{ x: .22 * W, y: .28 * H, r: .4 * Math.max(W, H), col: [150, 90, 238], a: .75, ax: .11 * W, ay: .11 * H, period: 11, ph: 0 },
      { x: .79 * W, y: .24 * H, r: .37 * Math.max(W, H), col: [56, 104, 255], a: .7, ax: .1 * W, ay: .15 * H, period: 13, ph: 2.1 },
      { x: .69 * W, y: .86 * H, r: .3 * Math.max(W, H), col: [120, 214, 255], a: .5, ax: .13 * W, ay: .09 * H, period: 9.5, ph: 4 },
      { x: .27 * W, y: .89 * H, r: .27 * Math.max(W, H), col: [255, 96, 84], a: .42, ax: .09 * W, ay: .08 * H, period: 12, ph: 1.3 }];
    const hasTitle = ctx.of('title').length > 0, hdr = ctx.portrait && hasTitle;
    G = { y0: safe.top + (hdr ? 250 * u : 40 * u), y1: H - safe.bottom - 40 * u, hdrY: safe.top + 150 * u, hdr };
    G.cy = (G.y0 + G.y1) / 2; G.bh = G.y1 - G.y0;
    // Split screen: one screenshot card per screen; a maximum of 3 connected non-picture cards per screen; number per screen alone
    slides = []; let k = 0;
    for (const q of ctx.cues) {
      if (['card', 'step', 'image'].includes(q.kind)) {
        const n = q.data && q.data.step != null ? q.data.step : ++k, im = q.image && ctx.IMG[q.image], cd = { q, n, im };
        const last = slides[slides.length - 1];
        if (!im && last && last.type === 'cards' && last.cards.length < 3) last.cards.push(cd);
        else slides.push({ type: im ? 'img' : 'cards', cards: [cd], start: q.at });
      } else if (q.kind === 'number') slides.push({ type: 'num', q, start: q.at - 0.9 });
    }
    slides.forEach((s, i) => { s.next = slides[i + 1] ? slides[i + 1].start : 1e9; });
    // The layout of the screenshot card: title row + screenshot area; the screenshot area is determined according to the proportion of the screenshot. Change the vertical image to "left word and right image" in horizontal screen
    const maxW = W * (ctx.portrait ? 0.9 : 0.8), maxH = G.bh * (ctx.portrait ? 0.92 : 0.86), head = (ctx.portrait ? 230 : 130) * u, pad = 36 * u;
    for (const s of slides) if (s.type === 'img') {
      const cd = s.cards[0], ar = cd.im.width / cd.im.height;
      if (!ctx.portrait && ar < 0.9) {                                         // Display vertical pictures in horizontal screen: left word and right picture, picture fills up the card height
        const ih = maxH - 2 * pad, iw = ih * ar, tw = 560 * u;
        cd.box = { w: tw + iw + 3 * pad, h: maxH, img: { x: tw + 2 * pad, y: pad, w: iw, h: ih }, side: tw };
      } else {
        let iw = maxW - 2 * pad, ih = iw / ar; if (ih > maxH - head - 2 * pad) { ih = maxH - head - 2 * pad; iw = ih * ar; }
        const cw = Math.max(iw + 2 * pad, Math.min(maxW, 760 * u)), ch = ih + head + 2 * pad;
        cd.box = { w: cw, h: ch, img: { x: (cw - iw) / 2, y: head + pad, w: iw, h: ih } };
      }
    }
  },
  draw(c, t, ctx) {
    const { W, H, u, data: d } = ctx, acc = d.accent || '#3d6bff';
    // ---- Bottom: light spot (only depends on segment time, continuous) ----
    let bd = null;
    if (!ctx.alpha) {
      const bgc = UI.scratch('clip_t2bg', W, H), g = bgc.getContext('2d'); g.clearRect(0, 0, W, H);   // Clear first: If it is not clear, the residue of the previous frame will pass through the translucent edge, and will be rendered successively at the same time with a difference of 1 color level (qa certainty ✗)
      UI.mesh(g, t, { base: '#050508', blobs: BL, blur: 90, scale: 0.25, grain: 0.035, key: 'clip_t2mesh' });
      const vg = g.createRadialGradient(W / 2, H / 2, 100 * u, W / 2, H / 2, Math.max(W, H) * 0.55); vg.addColorStop(0, 'rgba(0,0,0,0.38)'); vg.addColorStop(1, 'rgba(0,0,0,0.1)');
      g.fillStyle = vg; g.fillRect(0, 0, W, H); c.drawImage(bgc, 0, 0); bd = UI.backdrop(bgc, { blur: 40, key: 'clip_t2bd' });
    }
    const shadowText = g => { if (ctx.alpha) { g.shadowColor = 'rgba(0,0,0,0.75)'; g.shadowBlur = 18 * u; g.shadowOffsetY = 3 * u; } };
    // ---- Title: Headline → Main title (blurred → clear + moved up) → subtitle; when the first screen comes in: the horizontal screen retreats to the back, and the vertical screen shrinks into a header and stays at the top ----
    const qt = ctx.of('title')[0], first = slides[0] ? slides[0].start : 1e9;
    if (qt) {
      const out = MO.appleOut(MO.seg(t, first - 0.15, first + 0.5));
      const keep = G.hdr, title = qt.text ?? d.title ?? '', eb = (qt.data && qt.data.eyebrow) ?? d.eyebrow, sub = qt.sub ?? d.subtitle;
      if (out < 1 || keep) {
        c.save(); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; shadowText(c);
        let sz = TY.fit(c, title, W * 0.86, (ctx.portrait ? 150 : 190) * u, 'Inter', { maxLines: 1, min: 0.55, weight: '600 ', soft: true });   // First reduce the font size and put it on one line. If it cannot fit, fold it into two lines.
        if (!sz.ok) sz = fitB(c, title, W * 0.86, (ctx.portrait ? 150 : 190) * u, 'Inter', { maxLines: 2, weight: '600 ' });
        const cy = G.cy - (sz.lines.length - 1) * sz.size * 0.55;
        // Vertical screen: The entire page shrinks to the header (main title → about 64px), and the header title and subtitle fade out
        const hs = keep ? Math.min(1, 68 * u / sz.size) : 1, sc = keep ? lerp(1, hs, out) : lerp(1, 0.92, out), ty = keep ? lerp(0, G.hdrY - cy, out) : 0;
        c.translate(W / 2, cy + ty); c.scale(sc, sc); c.translate(-W / 2, -cy);
        const aSide = 1 - out;
        if (!keep) { c.globalAlpha = 1 - out; if (out > 0) c.filter = `blur(${(20 * out * u).toFixed(1)}px)`; }
        if (eb && aSide > 0) { c.save(); c.globalAlpha *= keep ? aSide : 1; c.font = `500 ${34 * u}px ${ZH}`; c.fillStyle = '#a7a7b4'; c.letterSpacing = `${6 * u}px`; TY.blurIn(c, eb, W / 2, cy - sz.size * 0.95, MO.appleOut(ctx.p(t, qt.at, 0.7)), { blur: 10 * u, dy: 16 * u }); c.restore(); }
        c.font = `600 ${sz.size}px ${SANSB}`; track(c, sz.size); c.fillStyle = '#f5f3ff';
        sz.lines.forEach((ln, i) => TY.blurIn(c, ln, W / 2, cy + i * sz.size * 1.1, MO.appleOut(ctx.p(t, qt.at + 0.15 + i * 0.12, 1.0)), { blur: 26 * u, dy: 40 * u }));
        if (sub && aSide > 0) { c.save(); c.globalAlpha *= keep ? aSide : 1; c.letterSpacing = '0px'; c.font = `400 ${46 * u}px ${ZH}`; c.fillStyle = '#c9c9d4';
          TY.wrap(c, sub, W * 0.84).forEach((ln, i) => TY.blurIn(c, ln, W / 2, cy + (sz.lines.length - 1) * sz.size * 1.1 + 110 * u + i * 62 * u, MO.appleOut(ctx.p(t, qt.at + 0.5, 0.9)), { blur: 12 * u, dy: 22 * u })); c.restore(); }
        c.restore();
      }
    }
    // ----Each screen: When the next screen starts, move back to the left (0.65s) and do not overlap with the content of the next screen ----
    slides.forEach((s, si) => {
      if (t < s.start - 1e-6) return;
      const nx = slides[si + 1], leave = MO.appleOut(MO.seg(t, s.next - 0.15, s.next + (nx && nx.type === 'num' ? 0.3 : 0.5))); if (leave >= 1) return;
      if (s.type === 'num') return drawNumber(c, s, t, leave, ctx, shadowText);
      if (s.type === 'img') return drawCard(c, s.cards[0], 0, t, leave, ctx, bd, cardGeoImg(s.cards[0], ctx), 'i' + si);
      // Cards without pictures are arranged side by side: the position when there are n cards; when a new card comes in, the old card moves to the new position according to the spring
      const vis = s.cards.filter(cd => t >= cd.q.at - 1e-6), n = vis.length, last = vis[n - 1]; ctx._stat = s.cards.some(cd => cd.q.data && cd.q.data.value != null);
      const rf = n > 1 ? MO.spring(t - last.q.at, { duration: 0.7, bounce: 0.12 }) : 1;
      vis.forEach((cd, j) => { const A = rowGeo(j, n, ctx, s.cards.length), Bp = j < n - 1 ? rowGeo(j, n - 1, ctx, s.cards.length) : A;
        const geo = { cx: lerp(Bp.cx, A.cx, rf), cy: lerp(Bp.cy, A.cy, rf), w: lerp(Bp.w, A.w, rf), h: lerp(Bp.h, A.h, rf), focus: j === n - 1 ? 1 : 1 - 0.25 * rf };
        drawCard(c, cd, j, t, leave, ctx, bd, geo, 'c' + si + '_' + j); });
    });
  },
};
// Screen geometry of screenshot card
function cardGeoImg(cd, ctx) { return { cx: ctx.W / 2, cy: G.cy, w: cd.box.w, h: cd.box.h, focus: 1 }; }
// No picture card: the horizontal screen is arranged in one row (one picture is wider), and the vertical screen is stacked in one column; total = how many pictures will be on this screen in the end (the layout is based on the current number of pictures, but the upper limit of the size is based on the final number of pictures, and the size will not change when shifting)
function rowGeo(j, n, ctx, total) {
  const { W, u } = ctx, gap = 44 * u;
  if (ctx.portrait) { const w = W * 0.86, h = Math.min(400 * u, (G.bh - (total - 1) * gap) / total), y0 = G.cy - (n * h + (n - 1) * gap) / 2; return { cx: W / 2, cy: y0 + j * (h + gap) + h / 2, w, h }; }
  const w = total === 1 ? 760 * u : Math.min(540 * u, (W * 0.9 - (total - 1) * gap) / total), h = Math.min((ctx._stat ? 660 : 540) * u, G.bh * 0.9), x0 = W / 2 - (n * w + (n - 1) * gap) / 2;
  return { cx: x0 + j * (w + gap) + w / 2, cy: G.cy, w, h };
}
// A card: the spring rises from below + rotates around the Y axis; the content is drawn into the off-screen texture (the frosted glass is sampled according to the screen position of the card), and then pasted back in pseudo 3D
function drawCard(c, cd, i, t, leave, ctx, bd, geo, key) {
  const { u, data: d } = ctx, q = cd.q, lt = ctx.lt(t, q.at); if (lt <= 0) return;
  const sp = MO.spring(lt, { duration: 0.7, bounce: 0.15 }), acc = d.accent || '#3d6bff';
  const Bw = geo.w, Bh = geo.h, cx = geo.cx - leave * ctx.W * 0.35, cy = geo.cy + (1 - sp) * 170 * u + MO.float(t, 5 * u, 3.6, i);
  const sc = (0.9 + 0.1 * sp) * (1 - 0.12 * leave) * lerp(0.97, 1, geo.focus), ry = (1 - sp) * -0.45 + 0.03 * Math.sin(t * 0.9 + i) - 0.35 * leave, a = clamp(lt / 0.2) * (1 - leave) * lerp(0.6, 1, geo.focus);
  const pad = 60, tex = scr[key] || (scr[key] = document.createElement('canvas')); tex.width = Math.ceil(Bw + 2 * pad); tex.height = Math.ceil(Bh + 2 * pad);
  const g = tex.getContext('2d'); g.reset();
  const sw = Bw * sc, sh = Bh * sc;
  if (ctx.alpha) { g.fillStyle = 'rgba(12,12,22,0.62)'; g.beginPath(); g.roundRect(pad, pad, Bw, Bh, 34 * u); g.fill(); }
  UI.glass(g, { x: pad, y: pad, w: Bw, h: Bh, r: 34 * u, bd, sample: { x: cx - sw / 2, y: cy - sh / 2, w: sw, h: sh }, tint: ctx.alpha ? 0.08 : 0.075, stroke: 0.22, light: 0.14, shadow: false });
  g.save(); g.translate(pad, pad);
  if (cd.im) imgContent(g, cd, Bw, Bh, t, ctx, acc); else featContent(g, cd, Bw, Bh, lt, t, ctx, acc);
  UI.sheen(g, UI.rrPath(0, 0, Bw, Bh, 34 * u), MO.seg(lt, 0.4, 1.2), { x0: 0, x1: Bw, width: 120 * u, angle: -0.35, alpha: 0.16 });   // Light scans the entire card (0.4s after entry)
  g.restore();
  c.save(); c.globalAlpha = a;
  UI.shadow(c, cx - sw / 2 + 10 * u, cy - sh / 2 + 20 * u, sw - 20 * u, sh - 20 * u, 34 * u, { blur: 80 * u, oy: 40 * u, alpha: 0.55 });
  UI.persp(c, tex, { cx, cy, w: tex.width * sc, h: tex.height * sc, ry, persp: 1800 * u, strip: 3, shade: 0.35 });
  c.restore();
}
// Step number badge
function badge(g, x, y, s, n, acc, u) { g.fillStyle = acc; g.beginPath(); g.roundRect(x, y, s, s, s * 0.28); g.fill();
  g.fillStyle = '#fff'; g.font = `700 ${s * 0.5}px ${SANSB}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n).padStart(2, '0'), x + s / 2, y + s / 2 + 2 * u); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; }
// Contents of screenshot card: step number + title + description, screenshot contain; highlight frame
function imgContent(g, cd, Bw, Bh, t, ctx, acc) {
  const { u } = ctx, q = cd.q, B = cd.box, I = B.img, hp = 40 * u, bs = 70 * u;
  badge(g, hp, hp, bs, cd.n, acc, u);
  if (B.side) {                                                           // Words on the left and pictures on the right: Titles and descriptions are arranged downwards in the left column.
    const tw = B.side - hp, tl = fitB(g, q.text || '', tw, 58 * u, 'PuHui-Bold', { maxLines: 3, weight: '600 ' });
    g.font = `600 ${tl.size}px ${ZHB}`; g.fillStyle = '#f5f5f7'; tl.lines.forEach((ln, k) => g.fillText(ln, hp, hp + bs + 70 * u + k * tl.size * 1.25));
    if (q.sub) { const sl = fitB(g, q.sub, tw, 34 * u, 'PuHui-Medium', { maxLines: 5 }); g.font = `400 ${sl.size}px ${ZH}`; g.fillStyle = 'rgba(235,235,245,0.66)';
      sl.lines.forEach((ln, k) => g.fillText(ln, hp, hp + bs + 70 * u + tl.lines.length * tl.size * 1.25 + 30 * u + k * sl.size * 1.4)); }
  } else {
    const tx = hp + bs + 26 * u, tw = Bw - tx - hp;
    if (ctx.portrait) {                                                    // Vertical screen: The header is taller, and the title and description are larger.
      const tl = fitB(g, q.text || '', tw, 56 * u, 'PuHui-Bold', { maxLines: 2, weight: '600 ', min: 0.7 }); g.font = `600 ${tl.size}px ${ZHB}`; g.fillStyle = '#f5f5f7';
      tl.lines.forEach((ln, k) => g.fillText(ln, tx, hp + tl.size * 0.85 + k * tl.size * 1.2));
      // When the title occupies two lines, please leave only one line so that the card can be accommodated.
      if (q.sub) { const sl = fitB(g, q.sub, tw, 34 * u, 'PuHui-Medium', { maxLines: tl.lines.length > 1 ? 1 : 2, min: 0.75 }); g.font = `400 ${sl.size}px ${ZH}`; g.fillStyle = 'rgba(235,235,245,0.66)';
        sl.lines.forEach((ln, k) => g.fillText(ln, tx, hp + tl.size * 0.85 + (tl.lines.length - 1) * tl.size * 1.2 + 24 * u + sl.size + k * sl.size * 1.35)); }
    } else {
    const tl = TY.fit(g, q.text || '', tw, 46 * u, 'PuHui-Bold', { maxLines: 1, weight: '600 ' });
    g.font = `600 ${tl.size}px ${ZHB}`; g.fillStyle = '#f5f5f7'; g.fillText(tl.lines[0] || '', tx, hp + (q.sub ? 32 * u : 48 * u));
    if (q.sub) { const sl = TY.fit(g, q.sub, tw, 28 * u, 'PuHui-Medium', { maxLines: 1 }); g.font = `400 ${sl.size}px ${ZH}`; g.fillStyle = 'rgba(235,235,245,0.62)'; g.fillText(sl.lines[0] || '', tx, hp + 74 * u); }
    }
  }
  const f = CLIP.fit(cd.im.width, cd.im.height, I.x, I.y, I.w, I.h);
  g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 30 * u; g.shadowOffsetY = 12 * u; g.fillStyle = '#000'; g.beginPath(); g.roundRect(f.x, f.y, f.w, f.h, 10 * u); g.fill(); g.restore();
  g.save(); g.beginPath(); g.roundRect(f.x, f.y, f.w, f.h, 10 * u); g.clip(); g.drawImage(cd.im, f.x, f.y, f.w, f.h); g.restore();
  g.strokeStyle = 'rgba(255,255,255,0.22)'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(f.x + .75, f.y + .75, f.w - 1.5, f.h - 1.5, 10 * u); g.stroke();
  // Frame the highlight: at This frame begins to pop up, and then breathes; a light sweeps across the frame (only the highlight that falls on the screen is recognized)
  const nxAt = (() => { const i = ctx.cues.indexOf(q); const n = ctx.cues.slice(i + 1).find(z => ['card', 'step', 'image', 'number'].includes(z.kind)); return n ? (n.kind === 'number' ? n.at - 0.9 : n.at) : 1e9; })();
  for (const qh of ctx.of('highlight')) {
    if (qh.at < q.at || qh.at >= nxAt || !qh.data || !qh.data.rect) continue;
    const hl = ctx.lt(t, qh.at); if (hl <= 0) continue;
    const R = CLIP.sub(qh.data.rect, f), s = MO.spring(hl, { duration: 0.45, bounce: 0.25 }), e = 8 * u * (1 - s);
    g.save(); g.fillStyle = 'rgba(0,0,0,0.38)'; g.beginPath(); g.rect(f.x, f.y, f.w, f.h); g.roundRect(R.x - e, R.y - e, R.w + 2 * e, R.h + 2 * e, 10 * u); g.globalAlpha = clamp(hl / 0.3); g.fill('evenodd'); g.restore();
    g.save(); g.strokeStyle = acc; g.lineWidth = 5 * u; g.shadowColor = acc; g.shadowBlur = 18 * u * (0.7 + 0.3 * Math.sin(hl * 5)); g.globalAlpha = clamp(hl / 0.15);
    g.beginPath(); g.roundRect(R.x - e, R.y - e, R.w + 2 * e, R.h + 2 * e, 10 * u); g.stroke(); g.restore();
    UI.sheen(g, UI.rrPath(R.x, R.y, R.w, R.h, 10 * u), MO.seg(hl, 0.25, 1.0), { x0: R.x, x1: R.x + R.w, width: Math.max(60 * u, R.w * 0.2), alpha: 0.35 });
    if (qh.text) { g.font = `600 ${30 * u}px ${ZHB}`; const lw = g.measureText(qh.text).width + 36 * u, ly = R.y + R.h + 16 * u + 48 * u > f.y + f.h ? R.y - 64 * u : R.y + R.h + 16 * u;
      g.save(); g.globalAlpha = clamp((hl - 0.15) / 0.25); g.fillStyle = acc; g.beginPath(); g.roundRect(clamp(R.x, f.x, f.x + f.w - lw), ly, lw, 48 * u, 24 * u); g.fill(); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(qh.text, clamp(R.x, f.x, f.x + f.w - lw) + 18 * u, ly + 25 * u); g.restore(); }
  }
}
// Contents of the function card without pictures: icon (or step number) → big title → description → (optional) big number count. For horizontal screens, vertical cards are arranged up and down, and for vertical screens, horizontal cards are arranged left and right.
function featContent(g, cd, Bw, Bh, lt, t, ctx, acc) {
  const { u } = ctx, q = cd.q, dd = q.data || {}, hasNum = dd.value != null, pad = 48 * u, tile = (ctx.portrait ? 110 : 120) * u;
  const drawTile = (x, y) => { g.fillStyle = 'rgba(255,255,255,0.10)'; g.beginPath(); g.roundRect(x, y, tile, tile, 26 * u); g.fill();
    if (!dd.icon || icon(g, dd.icon, x + tile / 2, y + tile / 2, tile * 0.6, '#f2f2f7', t) === false) {
      g.fillStyle = acc; g.beginPath(); g.roundRect(x, y, tile, tile, 26 * u); g.fill(); g.fillStyle = '#fff'; g.font = `700 ${tile * 0.46}px ${SANSB}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(cd.n).padStart(2, '0'), x + tile / 2, y + tile / 2 + 3 * u); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; } };
  const num = (x, y, size, align) => { const v = MO.expoOut(clamp((lt - 0.35) / 0.9)); g.save(); g.font = `600 ${size}px ${SANSB}`; track(g, size, -0.03); g.fillStyle = '#fff';
    TY.tabular(g, fmtNum(dd, v), x, y, { align }); g.restore(); if (dd.label) { g.font = `400 ${28 * u}px ${ZH}`; g.fillStyle = 'rgba(235,235,245,0.6)'; g.textAlign = align; g.fillText(dd.label, x, y + 46 * u); g.textAlign = 'left'; } };
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  if (!ctx.portrait) {
    drawTile(pad, pad);
    const tl = fitB(g, q.text || '', Bw - 2 * pad, 64 * u, 'PuHui-Bold', { maxLines: 2, weight: '600 ', min: 0.6 });
    let y = pad + tile + 40 * u + tl.size; g.font = `600 ${tl.size}px ${ZHB}`; g.fillStyle = '#f5f5f7'; tl.lines.forEach((ln, k) => g.fillText(ln, pad, y + k * tl.size * 1.2)); y += (tl.lines.length - 1) * tl.size * 1.2;
    if (q.sub) { const sl = fitB(g, q.sub, Bw - 2 * pad, (hasNum ? 32 : 38) * u, 'PuHui-Medium', { maxLines: hasNum ? 2 : 4, min: 0.75 }); g.font = `400 ${sl.size}px ${ZH}`; g.fillStyle = 'rgba(235,235,245,0.66)';
      sl.lines.forEach((ln, k) => g.fillText(ln, pad, y + 26 * u + sl.size + k * sl.size * 1.45)); }
    if (hasNum) { g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(pad, Bh - pad - 200 * u, Bw - 2 * pad, 1.5); num(pad, Bh - pad - 66 * u, Math.min(128 * u, (Bw - 2 * pad) / Math.max(3, fmtNum(dd, 1).length) * 1.6), 'left'); }
  } else {
    drawTile(pad, (Bh - tile) / 2);
    const tx = pad + tile + 34 * u, nw = hasNum ? Math.min(340 * u, Bw * 0.36) : 0, tw = Bw - tx - pad - nw;
    const tl = fitB(g, q.text || '', tw, 62 * u, 'PuHui-Bold', { maxLines: 2, weight: '600 ', min: 0.6 });   // If the title cannot fit, fold it into two lines instead of cutting off the second half of the sentence.
    const sl = q.sub ? fitB(g, q.sub, tw, 38 * u, 'PuHui-Medium', { maxLines: tl.lines.length > 1 ? 1 : 2, min: 0.75 }) : { lines: [], size: 0 };
    const tH = tl.size + (tl.lines.length - 1) * tl.size * 1.15, blk = tH + (sl.lines.length ? 22 * u + sl.lines.length * sl.size * 1.4 : 0), y0 = (Bh - blk) / 2 + tl.size * 0.85;
    g.font = `600 ${tl.size}px ${ZHB}`; g.fillStyle = '#f5f5f7'; tl.lines.forEach((ln, k) => g.fillText(ln, tx, y0 + k * tl.size * 1.15));
    const ys = y0 + (tl.lines.length - 1) * tl.size * 1.15;
    g.font = `400 ${sl.size}px ${ZH}`; g.fillStyle = 'rgba(235,235,245,0.66)'; sl.lines.forEach((ln, k) => g.fillText(ln, tx, ys + 22 * u + sl.size + k * sl.size * 1.4));
    if (hasNum) num(Bw - pad, Bh / 2 + 20 * u, Math.min(96 * u, nw / Math.max(3, fmtNum(dd, 1).length) * 1.7), 'right');
  }
}
// Large numbers on one screen: at settled (start rolling 0.9s in advance); there can be a small label above the number, and a description below (text or sub)
function drawNumber(c, s, t, leave, ctx, shadowText) {
  const { W, u } = ctx, q = s.q, nd = q.data || {}, k = MO.expoOut(clamp((t - s.start) / 0.9)), a = MO.appleOut(clamp((t - s.start - 0.12) / 0.3)) * (1 - leave);
  const cap = q.text ?? q.sub;
  c.save(); c.globalAlpha = a; shadowText(c); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  if (leave > 0) { c.filter = `blur(${(16 * leave * u).toFixed(1)}px)`; }
  const str = fmtNum(nd, k), full = fmtNum(nd, 1);
  c.font = `600 ${220 * u}px ${SANSB}`; track(c, 220 * u, -0.03); let size = 220 * u; const fw = c.measureText(full).width; if (fw > W * 0.88) size *= W * 0.88 / fw;
  c.font = `600 ${size}px ${SANSB}`; track(c, size, -0.03); c.fillStyle = '#fff';
  const y = G.cy + size * 0.32 - (cap ? 30 * u : 0);
  TY.tabular(c, str, W / 2, y, { align: 'center' });
  c.letterSpacing = '0px';
  if (nd.label) { c.font = `500 ${34 * u}px ${ZH}`; c.fillStyle = '#a7a7b4'; c.fillText(nd.label, W / 2, y - size * 0.85); }
  if (cap) { c.font = `400 ${(ctx.portrait ? 46 : 44) * u}px ${ZH}`; c.fillStyle = 'rgba(235,235,245,0.78)'; TY.wrap(c, cap, W * 0.84).forEach((ln, i) => c.fillText(ln, W / 2, y + 100 * u + i * 60 * u)); }
  c.restore();
}
})();
