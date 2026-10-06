// Data chart animation CH: scale bar, beautiful ticks, grid (come out first), column (grow from 0), polyline (drawn by time, head dot), K-line (one by one),
// Annotation (dot → leader → text), Economist style layout (top red line + red flag + title + unit subtitle + source note + "indicative data" corner mark).
// The iron law of order (accuracy + readability): coordinate system comes out first → data comes out last → mark last, mark only one thing per lens; the baseline of the histogram must be 0 (the vertical axis does not start from 0 and must be stated in the subtitle);
// The animation only changes "how it appears", not the value; the unit is written in the subtitle; the fictional/suggestive data is marked in the corner of each shot.
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // The canvas size follows U.setStage (default 1920×1080)
const { clamp, lerp } = U;
const CH = window.CH = {};
const seg = (t, a, b) => clamp((t - a) / (b - a));

// Linear scale: value → screen; f.inv reverse check
CH.lin = (d0, d1, r0, r1) => { const f = v => r0 + (v - d0) / (d1 - d0) * (r1 - r0); f.inv = y => d0 + (y - r0) / (r1 - r0) * (d1 - d0); return f; };
// Beautiful scale of 1/2/2.5/5×10^k
CH.ticks = (min, max, n = 5) => {
  const raw = (max - min) / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), steps = [1, 2, 2.5, 5, 10];
  const step = steps.map(s => s * mag).find(s => s >= raw) || 10 * mag;
  const out = []; for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(+v.toFixed(10)); return out;
};
CH.mixHex = (a, b, t) => { const A = PAINT.hex(a), B = PAINT.hex(b); return `rgb(${lerp(A[0], B[0], t) | 0},${lerp(A[1], B[1], t) | 0},${lerp(A[2], B[2], t) | 0})`; };

// ---------- Grid: Horizontal lines are drawn one by one from left to right (staggered with lag), the zero line is deeper and thicker; the scale values ​​fade in accordingly ----------
// F = {x,y,w,h} plot area; ys = scale value; yS = value→screen y; p = 0..1
CH.grid = (c, F, ys, yS, p, { col = 'rgba(0,0,0,.14)', zeroCol = '#121212', lw = 1.5, zeroLw = 3, lag = 0.12, font = '28px sans-serif', labelCol = '#5b5b5b', fmt = v => String(v), side = 'right', labelDy = -10 } = {}) => {
  c.save(); c.font = font; c.textBaseline = 'alphabetic';
  ys.forEach((v, i) => {
    const q = MO.lagged(i, ys.length, p, lag), e = MO.quintOut(q); if (q <= 0) return;
    const y = Math.round(yS(v)) + 0.5, isZero = Math.abs(v) < 1e-9;
    c.strokeStyle = isZero ? zeroCol : col; c.lineWidth = isZero ? zeroLw : lw;
    c.beginPath(); c.moveTo(F.x, y); c.lineTo(F.x + F.w * e, y); c.stroke();
    c.globalAlpha = seg(q, 0.3, 1); c.fillStyle = labelCol;
    if (side === 'right') { c.textAlign = 'right'; c.fillText(fmt(v), F.x + F.w, y + labelDy); }
    else { c.textAlign = 'left'; c.fillText(fmt(v), F.x, y + labelDy); }
    c.globalAlpha = 1;
  });
  c.restore();
};
// x-axis labels (year, etc.): fade in and move up one by one. items = [{x, label}]
CH.xLabels = (c, items, y, p, { font = '28px sans-serif', col = '#3a3a3a', lag = 0.1 } = {}) => {
  c.save(); c.font = font; c.textAlign = 'center'; c.fillStyle = col;
  items.forEach((it, i) => { const q = MO.quintOut(MO.lagged(i, items.length, p, lag)); if (q <= 0) return; c.globalAlpha = q; c.fillText(it.label, it.x, y + (1 - q) * 14); });
  c.restore();
};

// ----------Bar: grow from baseline 0 (quintOut), numerical labels count simultaneously with the top of the bar (equal-width numbers) ----------
// data: [{x, v}]; bw column width; p 0..1 total progress; hi highlight subscript (press hiP for the rest to transition to dimCol). Return the top of each column [[x,y]]
CH.bars = (c, data, yS, bw, p, { lag = 0.18, col = '#1f5c99', hi = -1, hiP = 0, hiCol, dimCol = '#b9c3cc', label = true, fmt = v => v.toFixed(0), font = '30px sans-serif', labelCol = '#121212' } = {}) => {
  const y0 = yS(0), tops = [];
  data.forEach((d, i) => {
    const q = MO.lagged(i, data.length, p, lag), e = MO.quintOut(q);
    const v = d.v * e, y = yS(v);
    let fill = col;
    if (hi >= 0) fill = i === hi ? (hiCol || col) : CH.mixHex(col, dimCol, hiP);
    c.fillStyle = fill; c.fillRect(d.x - bw / 2, y, bw, y0 - y);
    tops.push([d.x, y]);
    if (label && q > 0) {
      c.save(); c.font = font; c.textAlign = 'center'; c.fillStyle = labelCol; c.globalAlpha = seg(q, 0.05, 0.4);
      if (d.v < 0) { c.textBaseline = 'top'; TY.tabular(c, fmt(v), d.x, y + 12, { align: 'center' }); }   // Negative number columns: Write the value below the bottom of the column, do not write it into the column.
      else TY.tabular(c, fmt(v), d.x, y - 14, { align: 'center' });
      c.restore();
    }
  });
  return tops;
};

// ---------- Polyline: drawn by x (time); head dot; optional area gradient; return to head point ----------
// pts: screen coordinates (x increments); p: 0..1 = where to draw in the x range. area = {top, base, c0, c1}
CH.line = (c, pts, p, { col = '#e3120b', lw = 5, head = true, headR = 9, area, glow } = {}) => {
  if (p <= 0) return null;
  const xEnd = lerp(pts[0][0], pts[pts.length - 1][0], clamp(p));
  const vis = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][0] <= xEnd) vis.push(pts[i]);
    else { const a = pts[i - 1], b = pts[i], q = (xEnd - a[0]) / (b[0] - a[0]); vis.push([xEnd, lerp(a[1], b[1], q)]); break; }
  }
  const hp = vis[vis.length - 1];
  if (area) {
    const g = c.createLinearGradient(0, area.top, 0, area.base); g.addColorStop(0, area.c0); g.addColorStop(1, area.c1);
    c.save(); c.beginPath(); c.moveTo(vis[0][0], area.base); vis.forEach(q => c.lineTo(q[0], q[1])); c.lineTo(hp[0], area.base); c.closePath(); c.fillStyle = g; c.fill(); c.restore();
  }
  c.save(); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round';
  if (glow) { c.shadowColor = col; c.shadowBlur = glow; }
  c.beginPath(); vis.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.restore();
  if (head && p < 1.0001) { c.save(); c.fillStyle = col; c.beginPath(); c.arc(hp[0], hp[1], headR, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 3; c.stroke(); c.restore(); }
  return hp;
};
// Polyline at y at x (label to be nailed to the line)
CH.yAt = (pts, x) => { for (let i = 1; i < pts.length; i++) if (pts[i][0] >= x) { const a = pts[i - 1], b = pts[i]; return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0])); } return pts[pts.length - 1][1]; };

// ----------K lines: Appear one by one, the entity grows from the opening price to the closing price, and the shadow line follows; the default is red for rising and green for falling (A-share convention, overseas films are changed to green for rising and red for falling and stated in the subtitle) ----------
// rows: [{o,h,l,c}]; xs: center x of each root; cw entity width; p 0..1
CH.candles = (c, rows, xs, yS, cw, p, { up = '#e0322f', down = '#11a05a', lag = 0.06, hollowUp = false } = {}) => {
  rows.forEach((r, i) => {
    const q = MO.lagged(i, rows.length, p, lag); if (q <= 0) return;
    const e = MO.quintOut(seg(q, 0, 0.7)), w = MO.quintOut(seg(q, 0.35, 1));
    const isUp = r.c >= r.o, col = isUp ? up : down, x = xs[i];
    const yo = yS(r.o), yc = lerp(yo, yS(r.c), e);
    c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.5;
    if (w > 0) { const ym = (yo + yS(r.c)) / 2; c.beginPath(); c.moveTo(x, lerp(ym, yS(r.h), w)); c.lineTo(x, lerp(ym, yS(r.l), w)); c.stroke(); }
    const top = Math.min(yo, yc), hgt = Math.max(2, Math.abs(yc - yo));
    if (isUp && hollowUp) { c.fillStyle = '#fff'; c.fillRect(x - cw / 2, top, cw, hgt); c.strokeRect(x - cw / 2, top, cw, hgt); }
    else c.fillRect(x - cw / 2, top, cw, hgt);
    c.restore();
  });
};

// ---------- Annotation: Dot pop-up (spring) → Pulse ring → Lead line drawing → Text fade-in. The time is expressed in seconds for easy broadcasting ----------
// lt seconds; t0 starting time; (x, y) data point; (tx, ty) text anchor point; lines use font for the first line and font2 for the rest (numbers are mentioned first, comparisons are followed)
CH.callout = (c, lt, t0, { x, y, tx, ty, lines = [], col = '#121212', dotCol = '#e3120b', font = '600 30px sans-serif', font2, align = 'left', r = 11 }) => {
  const k = lt - t0; if (k <= 0) return;
  const s = MO.spring(k, { duration: 0.45, bounce: 0.25 });
  c.save();
  c.fillStyle = dotCol; c.beginPath(); c.arc(x, y, r * Math.max(0, s), 0, Math.PI * 2); c.fill();
  const pr = seg(k, 0, 0.6); if (pr > 0 && pr < 1) { c.strokeStyle = dotCol; c.globalAlpha = 1 - pr; c.lineWidth = 3; c.beginPath(); c.arc(x, y, r + pr * 34, 0, Math.PI * 2); c.stroke(); c.globalAlpha = 1; }
  const lp = MO.quintOut(seg(k, 0.12, 0.45));
  if (lp > 0) { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(lerp(x, tx, lp), lerp(y, ty, lp)); c.stroke(); }
  const fp = MO.quintOut(seg(k, 0.3, 0.7));
  if (fp > 0) {
    c.globalAlpha = fp; c.fillStyle = col; c.textAlign = align; c.textBaseline = 'alphabetic';
    const dx = align === 'left' ? 12 : align === 'right' ? -12 : 0;
    lines.forEach((L, i) => { c.font = i === 0 ? font : (font2 || font); c.fillText(L, tx + dx + (1 - fp) * (align === 'right' ? 16 : -16), ty + 8 + i * 40); });
  }
  c.restore();
};

// ---------- Format ----------
CH.tag = (c, x, y, w = 64, h = 14, col = '#e3120b') => { c.fillStyle = col; c.fillRect(x, y, w, h); };
// "Suggested data" corner mark: lower right rounded box. Fictional data must be included in every shot
CH.demoBadge = (c, text = 'Schematic data', { x = W - 40, y = 1040, font = '600 24px sans-serif', col = '#7a7a7a', box = 'rgba(0,0,0,.06)' } = {}) => {
  c.save(); c.font = font; c.textAlign = 'right'; c.textBaseline = 'middle';
  const w = c.measureText(text).width + 28; c.fillStyle = box; c.beginPath(); c.roundRect(x - w, y - 22, w, 44, 8); c.fill();
  c.strokeStyle = col; c.globalAlpha = 0.5; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;
  c.fillStyle = col; c.fillText(text, x - 14, y + 1); c.restore();
};
// The Economist-style full-page layout (drawing on each mirror): white background → thin red line at the top drawn from the left → small red flag on the upper left → title → subtitle (unit/calibre) → source on the lower left → “indicative data” on the lower right.
// lt = local mirror time (the layout is all in place within 0.6s, and then exits the coordinate system). badge passes false and does not draw the badge (when using real data).
CH.frame = (c, lt, { title, sub, source = 'Source: schematic data', badge = 'Schematic data', bg = '#FFFFFF', red = '#E3120B', ink = '#0C0C0C', subCol = '#4F5B61', srcCol = '#7c868b',
  font = '"NotoSansSC"', x = 90 } = {}) => {
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  const p = MO.quintOut(MO.seg(lt, 0, 0.45));
  c.fillStyle = red; c.fillRect(0, 0, W * p, 8);
  CH.tag(c, x, 56, 96 * p, 22, red);
  c.save(); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  const tp = MO.quintOut(MO.seg(lt, 0.05, 0.5));
  c.globalAlpha = tp; c.font = `700 58px ${font}`; c.fillStyle = ink; c.fillText(title, x, 150 + (1 - tp) * 18);
  const sp = MO.quintOut(MO.seg(lt, 0.15, 0.6));
  c.globalAlpha = sp; c.font = `400 34px ${font}`; c.fillStyle = subCol; c.fillText(sub, x, 205 + (1 - sp) * 14);
  c.globalAlpha = 1; c.font = `400 26px ${font}`; c.fillStyle = srcCol; c.fillText(source, x, 1040);
  c.restore();
  if (badge) CH.demoBadge(c, badge, { x: W - 60, y: 1030, font: `700 28px ${font}`, col: red, box: 'rgba(227,18,11,0.06)' });
};
})();
