// Text animation TY: word-by-word/word-by-word pop-in, mask rise, pop-in, typing, emerge from blur, highlighter, underline, subject smash-in, keyword emphasis, number counting and fixed-width numbers.
// Convention: p is 0..1 progress; lt/t is seconds. Fonts use CSS font strings or family names (PuHui-* aliases load Inter in the English edition, see lib/fonts.js).
// Bottom line of readability (y5/y1 card): subject: auxiliary sentence: label ≈ 3.4: 1: 0.4; one auxiliary sentence takes ≥1.2s on the screen; entry is slow (0.3–0.4s) and exit is fast (≈0.18s).
(() => {
const { clamp, lerp } = U;
const TY = window.TY = {};

// ---------- Base ----------
TY.font = (size, fam = 'PuHui-Black') => `${size}px "${fam}"`;
// Draw a paragraph of text: with transparency, scaling, rotation (around ox, oy), kerning track, and stroke
TY.text = (c, s, x, y, { size = 120, fam = 'PuHui-Black', color = '#111', align = 'center', base = 'alphabetic', alpha = 1, scale = 1, rot = 0, track = 0, stroke, strokeW = 0, ox = x, oy = y } = {}) => {
  if (alpha <= 0 || scale <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.translate(ox, oy); c.rotate(rot); c.scale(scale, scale); c.translate(-ox, -oy);
  c.font = TY.font(size, fam); c.textAlign = align; c.textBaseline = base; if (track) c.letterSpacing = track + 'px';
  if (stroke && strokeW) { c.lineJoin = 'round'; c.strokeStyle = stroke; c.lineWidth = strokeW; c.strokeText(s, x, y); }
  c.fillStyle = color; c.fillText(s, x, y); c.restore();
};
TY.width = (c, s, size, fam = 'PuHui-Black', track = 0) => { c.save(); c.font = TY.font(size, fam); if (track) c.letterSpacing = track + 'px'; const w = c.measureText(s).width; c.restore(); return w; };
// Line break: Press maxW to split a paragraph into multiple lines (Chinese can be broken word by word; English/numbers can be broken by words; Chinese punctuation is not placed at the beginning of the line). font is the CSS font string
TY.wrap = (c, text, maxW, font) => {
  c.save(); if (font) c.font = font;
  const toks = String(text).match(/[A-Za-z0-9.,%+\-'’]+\s*|\s+|./gu) || [], lines = []; let cur = '';
  for (const tk of toks) {
    if (tk === '\n') { lines.push(cur); cur = ''; continue; }
    if (cur && c.measureText(cur + tk.trimEnd()).width > maxW && !/^[,.;:!?\]})”’]$/.test(tk)) { lines.push(cur.trimEnd()); cur = tk.trimStart(); }
    else cur += tk;
  }
  if (cur.trim()) lines.push(cur.trimEnd());
  c.restore(); return lines;
};
// Reduce the font size from size down until it fits: no more than maxLines lines after folding, and the width of each line is ≤ maxW (a single long English word/long number cannot be folded, and it will be too wide if you just count the number of lines). Return {size, lines, ok}
// First search in [min, 1] times; when not found, soft:true returns ok:false to let the caller change the plan (such as changing to two lines), otherwise continue to shrink (minimum 0.2 times). When balance:true, multiple lines are folded into equal lengths.
TY.fit = (c, text, maxW, size, fam, { maxLines = 2, min = 0.45, weight = '', soft = false, balance = false } = {}) => {
  const font = s => `${weight}${s}px "${fam}"`, ok = (s, lines) => { c.save(); c.font = font(s); const r = lines.length <= maxLines && lines.every(l => c.measureText(l).width <= maxW + 0.5); c.restore(); return r; };
  let s = size, lines = [String(text)], good = false;
  for (; s >= size * (soft ? min : 0.2) - 1e-9; s *= 0.94) { lines = TY.wrap(c, text, maxW, font(s)); if (ok(s, lines)) { good = true; break; } if (s < size * min && soft) break; }
  if (!good && !soft) s /= 0.94;
  if (good && balance && lines.length > 1) { const n = lines.length; let lo = maxW * 0.4, hi = maxW; for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; if (TY.wrap(c, text, m, font(s)).length > n) lo = m; else hi = m; } lines = TY.wrap(c, text, hi, font(s)); }
  return { size: s, lines, ok: good };
};

// ---------- Admission ----------
// Staggered appearance word by word: dur seconds per word, from dy upward, transparent → opaque, zoomable; Kurzgesagt title 0.5s/word, staggered 45ms. Returns the total width.
TY.charsIn = (c, str, x, y, lt, { font, color, dur = 0.35, stagger = 0.04, dy = 24, scale0 = 1, align = 'left', ease = MO.cubicOut, shadow, spacing = 0 } = {}) => {
  c.save(); c.font = font; c.textBaseline = 'alphabetic'; c.fillStyle = color; const A0 = c.globalAlpha;   // Multiply the transparency of the caller (the outer layer will fade out to take effect)
  const chars = [...str]; const ws = chars.map(ch => c.measureText(ch).width + spacing); const tw = ws.reduce((a, b) => a + b, 0) - spacing;
  let cx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
  chars.forEach((ch, i) => {
    const q = clamp((lt - i * stagger) / dur); if (q > 0) {
      const e = ease(q); c.save(); c.globalAlpha = A0 * clamp(q * 2.2);
      c.translate(cx + ws[i] / 2, y + dy * (1 - e)); const s = lerp(scale0, 1, e); c.scale(s, s);
      if (shadow) { c.shadowColor = shadow.color; c.shadowOffsetX = shadow.x || 0; c.shadowOffsetY = shadow.y || 0; c.shadowBlur = shadow.blur || 0; }
      c.fillText(ch, -ws[i] / 2 + spacing / 2, 0); c.restore();
    }
    cx += ws[i];
  });
  c.restore(); return tw;
};
// Mask lifting: the characters are pushed up from the "slot" under the baseline (the most common character creation method for dynamic text). p 0..1, o.dir=+1 goes up, -1 goes down. o Same as TY.text
TY.rise = (c, s, x, y, p, o = {}) => {
  const size = o.size || 120, e = MO.expoOut(clamp(p)), w = TY.width(c, s, size, o.fam, o.track), a = o.align || 'left';
  const x0 = a === 'left' ? x : a === 'center' ? x - w / 2 : x - w;
  c.save(); c.beginPath(); c.rect(x0 - 20, y - size * 1.05, w + 40, size * 1.32); c.clip();
  TY.text(c, s, x, y + size * 1.2 * (1 - e) * (o.dir || 1), { ...o, align: a }); c.restore();
};
// Pop-in: enlarge from 0 to 1, backOut stops after overshoot (taking the center of the character as the axis). o.over = backOut of s
TY.pop = (c, s, x, y, p, o = {}) => {
  if (p <= 0) return; const size = o.size || 120, sc = MO.backOut(clamp(p), o.over ?? 2.2) * (o.scale || 1);
  TY.text(c, s, x, y, { ...o, scale: sc, ox: x, oy: y - size * 0.36 });
};
// Emerging from blur (title of press conference): blur → clear + move up + transparent → opaque. Use font/fillStyle/textAlign set by the caller.
TY.blurIn = (c, text, x, y, p, { blur = 18, dy = 28, scale = 0 } = {}) => {
  if (p <= 0) return;
  c.save(); c.globalAlpha *= clamp(p * 1.4);
  const b = (1 - p) * blur; if (b > 0.3) c.filter = `blur(${b.toFixed(2)}px)`;
  c.translate(x, y + (1 - p) * dy); if (scale) { const s = 1 + (1 - p) * scale; c.scale(s, s); }
  c.fillText(text, 0, 0); c.restore();
};
// Typing: Truncate by number of characters (p 0..1)
TY.typed = (s, p) => [...s].slice(0, Math.round(clamp(p) * [...s].length)).join('');
// Typewriter: number of words typed at time t (rate words/second, can be stepped by fps; Vox 13 words/second + 12fps, whiteboard text 16 words/second)
TY.typedCount = (t, t0, rate, fps = 0) => Math.max(0, Math.floor(((fps ? MO.step(t, fps) : t) - t0) * rate + 1e-6) + 1);

// ---------- emphasize ----------
// Highlighter: A diagonal block of color brushed from left to right and placed behind the words (dynamic text). See CL.highlight for the raw edge of collage style multiply highlighter
TY.marker = (c, x, y, w, h, p, color = '#FFE14D', skew = 0.18) => {
  if (p <= 0) return; const e = MO.expoOut(clamp(p)), ww = w * e;
  c.save(); c.fillStyle = color; c.beginPath(); c.moveTo(x + h * skew, y); c.lineTo(x + ww + h * skew, y); c.lineTo(x + ww, y + h); c.lineTo(x, y + h); c.closePath(); c.fill(); c.restore();
};
TY.underline = (c, x, y, w, p, color, lw = 10) => { if (p <= 0) return; c.save(); c.strokeStyle = color; c.lineCap = 'round'; c.lineWidth = lw; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * MO.expoOut(clamp(p)), y); c.stroke(); c.restore(); };
// The main word "smash" comes in: from from times to 1 (spring 2.2Hz/10, overshoot ≈8%), the first 0.06s is transparent → opaque. lt = the number of seconds after the occurrence of this word
TY.slam = (c, s, x, y, lt, o = {}) => {
  if (lt < 0) return; const size = o.size || 340, k = MO.springHz(lt, o.freq || 2.2, o.decay || 10), sc = lerp(o.from || 1.7, 1, k);
  TY.text(c, s, x, y, { size, fam: 'PuHui-Black', align: 'left', ...o, scale: sc * (o.scale || 1), alpha: clamp(lt / 0.06), ox: o.ox ?? x, oy: o.oy ?? y - size * 0.36 });
};
// Keywords: tIn rises from the groove, to the "emphasis beat" tHit is enlarged to 1.35 times and pinned (spring 2.5Hz/9). Returns the current zoom (gives highlighter/underlining followed by zoom).
// The words and actions say the same thing: the "next line" zoom happens to be when Tab (y5) is pressed.
TY.keyword = (c, s, x, y, t, tIn, tHit, o) => {
  if (t < tHit) { TY.rise(c, s, x, y, MO.at(t, tIn, 0.35), { ...o, align: 'left' }); return 1; }
  const sc = lerp(1, 1.35, MO.springHz(t - tHit, 2.5, 9));
  TY.text(c, s, x, y, { ...o, align: 'left', scale: sc, ox: x, oy: y });
  return sc;
};
// Highlighter behind keywords: appear in the same shot and zoom as the keywords
TY.keywordMarker = (c, x, y, w, size, t, tHit, sc, col) => { if (t < tHit) return; TY.marker(c, x - 8, y - size * 0.98 * sc, (w + 16) * sc, size * 1.18 * sc, MO.at(t, tHit, 0.3), col); };

// ---------- number ----------
// Thousands format; use true minus sign "-" for negative signs
TY.fmt = (v, dec = 0, sep = true) => { const s = Math.abs(v).toFixed(dec); const [i, f] = s.split('.'); const ii = sep ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : i; return (v < 0 ? '−' : '') + ii + (f ? '.' + f : ''); };
// Count: roll from a to b within [start, start+dur]; default expoOut (fast first, then slow, the last one is settled). Figures and animation only change "how to appear", not the caliber.
TY.count = (lt, start, dur, a, b, ease = MO.expoOut) => lerp(a, b, ease(clamp((lt - start) / dur)));
// Arrangement of equal-width numbers: Canvas cannot open tnum, and the width of the numbers will shake when scrolling. Each number must occupy the same width grid and be arranged by itself. Use font/fillStyle set by the caller. Return total width
TY.tabular = (c, str, x, y, { align = 'left', digitW } = {}) => {
  const dw = digitW || c.measureText('0').width;
  const ws = [...str].map(ch => /[0-9]/.test(ch) ? dw : c.measureText(ch).width);
  const total = ws.reduce((s, w) => s + w, 0);
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  const ta = c.textAlign; c.textAlign = 'center';
  [...str].forEach((ch, i) => { c.fillText(ch, cx + ws[i] / 2, y); cx += ws[i]; });
  c.textAlign = ta; return total;
};
})();
