// Brush and water: brush with white brush, single brush with pointed ends, ink smudge, long curved streamline brush, watercolor wash and dye, impasto bristle brush, scissor folding line. HANG ALL ON PAINT (P).
// Source: Transfer Test A (Ink/Munch), B (Ghibli), C (Matisse), D (Rembrandt). Deterministic: All randomization is seeded.
//   P.brush (c, pts, opt) brush: the pen pressure rises and falls + wet refill + each hair becomes white, you can press reveal to write (ink, calligraphy, white line drawing)
//   P.leaf(c, x, y, ang, L, w) A single pen with pointed ends (bamboo leaves, orchid leaves, bird wings, shrimp tails)
//   P.inkWash(c, key, grow, fn, o) Ink halo: first draw the shape to scratch, and then blur it twice with "outer halo + body" multiply onto the paper, grow 0→1 is spread
//   P.flowSeeds / P.flowLines Long curved flow line pen: The seeds are integrated into a 200–300px long pen (Munch, not Van Gogh’s short pen) along the direction of twisting over time.
//   P.deform / P.watercolor Watercolor wash and dye: Midpoint displacement deformation polygon × multi-layer low α multiply + light stroke of each layer = water mark edge (Ghibli background)
//   P.rectPts / P.ellipsePts commonly used polygon point sequences for dyeing
//   P.impasto(c, pts, w, col, hi) Impasto bristle pen: one stroke = several parallel thin bristles (Rembrandt highlight, Van Gogh impasto filling pen)
//   P.cut(pts, seed, step, amp) scissor polyline: take points at each step px along the outline + jitter, connected by straight lines (Matisse paper cutting, silhouette, woodcut)
(() => {
const W = 1920, H = 1080;
const P = window.PAINT;
const { clamp, lerp, rng, ss } = U;

// ---------- Writing brush ----------
// pts control points (can be encrypted by Catmull-Rom and then resampled by 4px equal arc length - without resampling, the white noise frequency will change with the length of the stroke)
// w maximum width; tone ink transparency (focal .9/dense .8/heavy .6/light .35/clear .15); dry 0..1 the degree of whitening (the closer to the end of the pen, the drier it becomes); reveal 0..1 writes the proportion
// head/tail ratio of starting/ending pens; bristles number of pen hairs; col ink color [r,g,b]; per encryption multiple
// Pitfalls: Each brush hair must have a continuous path (butt head); stroke+round the head individually according to small segments, and the joints will overlap into deep spots, like bamboo knots/hemp ropes.
P.brush = (c, pts, { w = 10, tone = 0.85, dry = 0.45, seed = 1, reveal = 1, bristles = 8, col = [16, 14, 12], head = 0.12, tail = 0.4, per = 5 } = {}) => {
  if (reveal <= 0) return;
  const D = KIT.resample(KIT.densify(pts, per), 4), n = D.length, m = Math.max(2, Math.ceil(n * clamp(reveal)));
  const r = rng(seed * 7919);
  const prof = q => ss(0, head, q) * (1 - 0.7 * ss(1 - tail, 1, q)) * (0.85 + 0.15 * P.noise(seed * 3.3, q * 6)) + 0.08;
  c.save(); c.lineCap = 'butt'; c.lineJoin = 'round';
  const N = [];
  for (let i = 0; i < n; i++) { const A = D[Math.max(0, i - 1)], B = D[Math.min(n - 1, i + 1)]; let dx = B[0] - A[0], dy = B[1] - A[1]; const d = Math.hypot(dx, dy) || 1; N.push([-dy / d, dx / d]); }
  const core = q => w * prof(q) * (1 - dry * 0.85 * Math.pow(q, 0.8));
  // Wet refill: It is present throughout the pen, becoming thinner and lighter towards the back (when the ink is used up)
  c.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${tone * 0.72})`; c.fill(KIT.ribbon(D.slice(0, m), (q, i) => core(i / (n - 1))));
  // Bristles: each one is a continuous line, broken according to the noise (whitening = paper exposed between the bristles), the more broken it is towards the end of the pen
  for (let k = 0; k < bristles; k++) {
    const off = (k / (bristles - 1) - 0.5) * 0.95, bw = w / bristles * (0.9 + r() * 0.9), ph = r() * 50;
    c.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${tone * (0.45 + r() * 0.35)})`; c.lineWidth = Math.max(0.7, bw);
    c.beginPath(); let on = false;
    for (let i = 0; i < m; i++) {
      const q = i / (n - 1), dryness = dry * Math.pow(q, 1.2);
      const vis = P.noise(k * 1.9 + ph, i * 0.09) * 0.5 + 0.5 > dryness * 0.95 + 0.05;
      const o = off * w * prof(q), x = D[i][0] + N[i][0] * o, y = D[i][1] + N[i][1] * o;
      if (vis) { on ? c.lineTo(x, y) : c.moveTo(x, y); on = true; } else on = false;
    }
    c.stroke();
  }
  c.restore();
};
// Single pen with pointed ends (character bamboo leaf, orchid leaf, bird wing): length L along the ang direction, maximum width wmax, slightly curved
P.leaf = (c, x, y, ang, L, wmax, tone = 0.88, col = [16, 14, 12]) => {
  if (!Array.isArray(col)) col = [16, 14, 12];
  const pts = []; for (let i = 0; i <= 10; i++) { const q = i / 10, bend = Math.sin(q * Math.PI) * 0.08 * L; pts.push([x + Math.cos(ang) * L * q - Math.sin(ang) * bend, y + Math.sin(ang) * L * q + Math.cos(ang) * bend]); }
  c.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${tone})`; c.fill(KIT.ribbon(pts, q => wmax * Math.pow(Math.sin(Math.PI * Math.min(1, q * 1.1)), 0.7) + 0.6));
};

// ---------- Ink halo / halo layer ----------
// fn(g) draws a shape on the scratch (solid color is enough); grow 0..1 controls the blur: the outer blur becomes wider with grow, and the main blur tightens with grow.
// halo outer halo blur radius, haloA outer halo transparency, blur body blur, alpha overall transparency. Return to scratch (can be used to make holes for blank space).
// Pit: multiply is transparent, and the ink lines behind it will smudge through (the window sill line goes through the cat's ears). First fill in a layer of paper color in the silhouette (clip and then drawImage paper) and then apply blending = "leave this area first."
P.inkWash = (c, key, grow, fn, { blur = 2, halo = 10, haloA = 0.22, alpha = 1 } = {}) => {
  const S = P.scratch('inkw_' + key), g = S.getContext('2d'); g.reset(); fn(g);
  c.save(); c.globalCompositeOperation = 'multiply';
  if (grow > 0) {
    c.globalAlpha = haloA * alpha * grow; c.filter = `blur(${(halo * (0.4 + grow)).toFixed(2)}px)`; c.drawImage(S, 0, 0);
    c.globalAlpha = alpha * ss(0, 0.6, grow); c.filter = `blur(${(blur * (1.6 - grow * 0.6)).toFixed(2)}px)`; c.drawImage(S, 0, 0);
  }
  c.filter = 'none'; c.restore();
  return S;
};

// ---------- Long curved streamline pen (Munch's "Scream" style expressionism) ----------
// Seed: cell dithering grid, each seed carries two random numbers [x, y, r1, r2]
P.flowSeeds = (cell = 24, seed = 5) => { const r = rng(seed), o = []; for (let y = -10; y < H + 10; y += cell) for (let x = -10; x < W + 10; x += cell) o.push([x + (r() - .5) * cell, y + (r() - .5) * cell, r(), r()]); return o; };
// Each seed: region(x,y,t) judgment area → Take the parameters of the region params[reg] = [steps, step, width, alpha] → Integrate along angle(x,y,t,reg); stop when crossing this region (region boundary is clean).
// color(reg, sx, sy, r1, t) returns [r,g,b]. No strokes, translucent color stacking - Munch uses a thin and long brush; copying Van Gogh's dark strokes will turn into a short caterpillar brush.
// Apply flat paint of the same color on the bottom first, so that the same color is exposed in the crevices of the pen instead of black. Length: steps 26–42, steps 6–8, one pen travels 200–300px.
P.flowLines = (c, seeds, { t = 0, region, angle, color, params, extraSteps = 8 }) => {
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [sx, sy, r1, r2] of seeds) {
    const reg = region(sx, sy, t); const pr = params[reg]; if (!pr) continue; const [steps, step, width, alpha] = pr;
    const col = color(reg, sx, sy, r1, t);
    let x = sx, y = sy; c.beginPath(); c.moveTo(x, y);
    const n = steps + ((r2 * extraSteps) | 0);
    for (let i = 0; i < n; i++) { const a = angle(x, y, t, reg); x += Math.cos(a) * step; y += Math.sin(a) * step; if (region(x, y, t) !== reg) break; c.lineTo(x, y); }
    c.strokeStyle = P.rgb(col, alpha); c.lineWidth = width * (0.7 + r2 * 0.6); c.stroke();
  }
};

// ---------- Watercolor wash and dye (Ghibli-style background art) ----------
// Midpoint displacement: Each round pushes an approximate Gaussian quantity (the sum of 3 uniform numbers) along the normal direction at the midpoint of each side. The amplitude is proportional to the side length. Each round is amp×0.6
P.deform = (pts, depth, amp, r) => {
  let out = pts;
  for (let d = 0; d < depth; d++) {
    const n = [];
    for (let i = 0; i < out.length; i++) {
      const a = out[i], b = out[(i + 1) % out.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const g = (r() + r() + r() - 1.5) * amp * Math.min(1, len / 80), nx = -(b[1] - a[1]) / (len || 1), ny = (b[0] - a[0]) / (len || 1);
      n.push(a, [(a[0] + b[0]) / 2 + nx * g, (a[1] + b[1]) / 2 + ny * g]);
    }
    out = n; amp *= 0.6;
  }
  return out;
};
const fillPts = (g, pts) => { g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); };
// One wash and dyeing: 3 rounds of deform for the base shape; 2 more rounds of deform for each layer, low alpha filling (multiply = transparent pigment overlay), alpha = edge and draw 1.6px edge of the same color (pigment deposited on the edge = water mark edge).
// fill can pass gradients; for opaque white (window frames, clouds, tablecloths) use blend:'source-over', alpha .9.
// Commonly used: large wall layers5 α.4 amp12; color halo layers3 α.045 amp40; wooden boards layers3 α.5 amp3 edge.14.
// Pitfalls: Use heavily deformed polygons (amp 60) for dark parts, don’t use rectangles - hard edges will appear at the seams of rectangles. Don’t go beyond .05×3 layers of color halo α, otherwise the room will look like moldy parchment.
P.watercolor = (g, pts, color, { layers = 7, alpha = 0.13, amp = 10, seed = 1, edge = 0.1, blend = 'multiply', fill } = {}) => {
  const r = rng(seed * 7919 + 13), base = P.deform(pts, 3, amp, r);
  g.save(); g.globalCompositeOperation = blend; g.lineJoin = 'round';
  for (let k = 0; k < layers; k++) {
    const q = P.deform(base, 2, amp * 0.55, r);
    fillPts(g, q); g.globalAlpha = alpha; g.fillStyle = fill || color; g.fill();
    if (edge) { g.globalAlpha = edge; g.strokeStyle = color; g.lineWidth = 1.6; g.stroke(); }
  }
  g.restore();
};
P.rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
P.ellipsePts = (cx, cy, rx, ry, n = 18) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * Math.PI * 2) * rx, cy + Math.sin(i / n * Math.PI * 2) * ry]);

// ---------- Thick application bristle pen ----------
// One stroke = round (w/1.3) parallel thin bristles (brightness ±17 jitter each, random shrinkage 0–25% at both ends) + a light shadow on the lower side + sporadic bright spots on the upper side → read as "a thick lump of paint that has been brushed away".
// Use only on light-receiving areas (blond hair, neckline, porcelain, pearls, white hair). Pitfall: Three neat lines drawn as "Dark Shadow + Main Pen + Light Ridge" will read as white stickers/band-aids.
P.impasto = (c, pts, w, col, hi) => {
  const base = col.startsWith('#') ? P.hex(col) : [240, 230, 210];
  const A = pts[0], B = pts[pts.length - 1], ang = Math.atan2(B[1] - A[1], B[0] - A[0]), nx = -Math.sin(ang), ny = Math.cos(ang);
  const r = rng((A[0] * 13 + A[1] * 7) | 0), nb = Math.max(3, Math.round(w / 1.3));
  c.save(); c.lineCap = 'round';
  c.strokeStyle = 'rgba(40,18,6,.28)'; c.lineWidth = w * 0.9; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0] + nx * w * 0.45 + 1, p[1] + ny * w * 0.45 + 1.5) : c.moveTo(p[0] + nx * w * 0.45 + 1, p[1] + ny * w * 0.45 + 1.5)); c.stroke();
  for (let k = 0; k < nb; k++) {
    const o = (k / (nb - 1) - 0.5) * w, s0 = r() * 0.25, s1 = 1 - r() * 0.25, sh = (r() - 0.5) * 34 + (k < nb / 2 ? 14 : -10);
    c.strokeStyle = P.rgb([base[0] + sh, base[1] + sh, base[2] + sh * 0.8], 0.55 + r() * 0.4); c.lineWidth = 1.4 + r() * 1.2; c.beginPath();
    const n = pts.length - 1; for (let i = 0; i <= 8; i++) { const q = lerp(s0, s1, i / 8), j = Math.min(n - 1, Math.floor(q * n)), f = q * n - j, x = lerp(pts[j][0], pts[j + 1][0], f) + nx * o, y = lerp(pts[j][1], pts[j + 1][1], f) + ny * o; i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
  }
  c.fillStyle = hi || 'rgba(255,250,232,.7)'; for (let k = 0; k < 2 + w / 3; k++) { const q = r(), x = lerp(A[0], B[0], q) - nx * w * 0.3, y = lerp(A[1], B[1], q) - ny * w * 0.3; c.beginPath(); c.arc(x, y, 0.9 + r(), 0, Math.PI * 2); c.fill(); }
  c.restore();
};

// ---------- Scissor fold line ----------
// Resample a circle of (closed) points by step, add ±amp seed dithering to each point, and connect them with a straight line → the edge of the hand-cut paper. RIG parts can be recut by feeding them in path.pts.
P.cut = (pts, seed, step = 18, amp = 2.5) => {
  const r = rng(seed), out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step));
    for (let k = 0; k < n; k++) { const q = k / n; out.push([lerp(a[0], b[0], q) + (r() - 0.5) * amp * 2, lerp(a[1], b[1], q) + (r() - 0.5) * amp * 2]); }
  }
  return U.poly(out);
};
})();
