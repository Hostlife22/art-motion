// Transition library: each function (c, A, B, p, o) - A=old screen canvas, B=new screen canvas, p∈[0,1],
// o: {W,H,lt,t,tmp,IMG, ...the parameters of this transition in eras.js}. Deterministic: The random number is always U.rng (seed).
// Each transition takes the most recognizable formal elements of the "new era" (see "Transitions" in the experience log).
(() => {
const W = 1920, H = 1080;
const { clamp, lerp, ease, rng } = U, TAU = Math.PI * 2;
const seg = (p, a, b) => clamp((p - a) / (b - a));          // Pull the [a,b] segment of p to 0..1

// Caching: Precomputation (tile table, off-screen canvas...) that does not change over time in the same transition.
// Only cache things that are "irrelevant to the screen content" (geometry tables, scratch canvases). Do not cache things that depend on the content of the A/B screen:
// What is cached is the frame that is called for the first time. If a transition with the same name is used for the second time in the film, the content of the first time will be drawn. When rendering out of order, it also depends on the calling order (migration test B ②-10).
// It is necessary to pass the entry segment id with the key of o:once(k, f, o) when caching by segment.
const cache = {};
const once = (k, f, o) => { const kk = o ? `${o.id}|${k}` : k; return cache[kk] || (cache[kk] = f()); };

const mkc = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

const T = window.TRANSITIONS = {
  crossfade(c, A, B, p) { c.drawImage(A, 0, 0); c.globalAlpha = p; c.drawImage(B, 0, 0); c.globalAlpha = 1; },
  cut(c, A, B, p) { c.drawImage(p < 0.5 ? A : B, 0, 0); },

  // ① Cave → Egypt: The new screen is broken into stones of different sizes, put together from left to right (with randomization), and when placed, "build" them from a slightly off side.
  tiles(c, A, B, p, o) {
    const tiles = once('tiles', () => {
      const r = rng(7), out = [];
      // Mixing of three block sizes: first lay out a large grid, and then randomly split a part into small blocks
      const bw = 240, bh = 180;
      for (let y = 0; y < H; y += bh) for (let x = 0; x < W; x += bw) {
        if (r() < 0.45) { for (let yy = 0; yy < 2; yy++) for (let xx = 0; xx < 2; xx++) out.push({ x: x + xx * bw / 2, y: y + yy * bh / 2, w: bw / 2, h: bh / 2 }); }
        else out.push({ x, y, w: bw, h: bh });
      }
      out.forEach(t => { t.t = clamp((t.x + t.w / 2) / W * 0.62 + r() * 0.3); t.dx = (r() - 0.5) * 60; t.dy = -30 - r() * 50; t.rot = (r() - 0.5) * 0.12; });
      return out;
    });
    c.drawImage(A, 0, 0);
    for (const t of tiles) {
      const q = clamp((p - t.t * 0.7) / 0.28); if (q <= 0) continue;
      const e = ease.outBack(q);
      c.save();
      c.translate(t.x + t.w / 2 + t.dx * (1 - e), t.y + t.h / 2 + t.dy * (1 - e));
      c.rotate(t.rot * (1 - e));
      const s = 1.08 - 0.08 * e; c.scale(s, s);
      if (q < 1) { c.shadowColor = 'rgba(30,15,5,.55)'; c.shadowBlur = 18 * (1 - q); c.shadowOffsetY = 10 * (1 - q); }
      c.drawImage(B, t.x, t.y, t.w, t.h, -t.w / 2, -t.h / 2, t.w, t.h);
      c.restore();
    }
  },

  // ② Egypt → Greece: The cube rotates around the vertical axis (the old side turns left and the new side turns right), with light and dark on the surface
  cube(c, A, B, p) {
    const e = ease.inOut(p), th = e * Math.PI / 2;
    c.fillStyle = '#0d0a08'; c.fillRect(0, 0, W, H);
    const face = (img, ang, side) => {
      // Orthogonal approximate perspective: face width = W*cos(ang), far side shortened by k
      const w = W * Math.cos(ang); if (w < 2) return;
      const N = 48, k = 0.18 * Math.sin(ang);
      for (let i = 0; i < N; i++) {
        const u0 = i / N, u1 = (i + 1) / N;
        const far = side === 'left' ? 1 - u0 : u0;                 // The far end is on the side that turns out
        const sh = 1 - k * far, hh = H * sh;
        const x = side === 'left' ? u0 * w : W - w + u0 * w;
        c.drawImage(img, u0 * W, 0, W / N + 1, H, x, (H - hh) / 2, w / N + 1, hh);
      }
      c.fillStyle = `rgba(0,0,0,${0.55 * Math.sin(ang)})`;
      c.fillRect(side === 'left' ? 0 : W - w, 0, w, H);
    };
    face(A, th, 'left');
    face(B, Math.PI / 2 - th, 'right');
  },

  // ③ Greece → Rome: The small mosaic bricks are turned over - spreading outward from the cat's position, and the dark brick back is instantly exposed when turned over
  mosaic(c, A, B, p, o) {
    const tw = 18, th = 34, ox = W * 0.27, oy = H * 0.72;
    const grid = once('mosaic', () => {
      const r = rng(11), g = [], maxd = Math.hypot(W, H) * 0.8;
      for (let y = 0; y < H; y += th) for (let x = 0; x < W; x += tw) {
        const d = Math.hypot(x - ox, (y - oy) * 1.3) / maxd;
        g.push({ x, y, t: clamp(d * 0.75 + r() * 0.25) });
      }
      return g;
    });
    c.drawImage(A, 0, 0);
    for (const g of grid) {
      const q = (p - g.t * 0.78) / 0.16;
      if (q <= 0) continue;
      if (q >= 1) { c.drawImage(B, g.x, g.y, tw, th, g.x, g.y, tw, th); continue; }
      // Flip: The width is scaled according to |cos|, the first half shows the dark brick back, and the second half shows the new brick
      const sx = Math.abs(Math.cos(q * Math.PI));
      c.fillStyle = '#17110d'; c.fillRect(g.x, g.y, tw, th);
      const w = tw * sx;
      if (q > 0.5) c.drawImage(B, g.x, g.y, tw, th, g.x + (tw - w) / 2, g.y, w, th);
      else { c.fillStyle = '#2a1c14'; c.fillRect(g.x + (tw - w) / 2, g.y, w, th); }
    }
  },

  // ④ Roman → Gothic: The parchment is turned over, the edge is swept from right to left, and the back is parchment with a faint old painting print.
  pageTurn(c, A, B, p) {
    const e = ease.inOut(p);
    const band = 260;
    const x = lerp(W + band, -band * 1.4, e);          // Hem position
    c.drawImage(B, 0, 0);
    // Old page: curled left
    c.save(); c.beginPath(); c.rect(0, 0, Math.max(0, x - band * 0.15), H); c.clip(); c.drawImage(A, 0, 0); c.restore();
    // Rolled back page: parchment color + mirror image of old painting + cylindrical light and shade
    c.save();
    c.beginPath(); c.rect(x - band * 0.15, 0, band, H); c.clip();
    c.fillStyle = '#e9dcc0'; c.fillRect(x - band * 0.15, 0, band, H);
    c.globalAlpha = 0.18; c.save(); c.translate(2 * x + band * 0.7, 0); c.scale(-1, 1); c.drawImage(A, 0, 0); c.restore(); c.globalAlpha = 1;
    const g = c.createLinearGradient(x - band * 0.15, 0, x + band * 0.85, 0);
    g.addColorStop(0, 'rgba(60,40,20,.45)'); g.addColorStop(0.18, 'rgba(255,248,230,.25)'); g.addColorStop(0.55, 'rgba(120,90,50,.12)'); g.addColorStop(1, 'rgba(40,25,10,.55)');
    c.fillStyle = g; c.fillRect(x - band * 0.15, 0, band, H);
    c.restore();
    // The shadow cast by the curled edge on the new page
    const sg = c.createLinearGradient(x + band * 0.85, 0, x + band * 0.85 + 90, 0);
    sg.addColorStop(0, 'rgba(30,20,10,.35)'); sg.addColorStop(1, 'rgba(30,20,10,0)');
    c.fillStyle = sg; c.fillRect(x + band * 0.85, 0, 90, H);
  },

  // ⑤ Gothic→Renaissance: Golden light bursts out of the window, old paintings fade away and new paintings emerge in the light
  godRays(c, A, B, p, o) {
    const cx = o.cx || 440, cy = o.cy || 300;
    c.drawImage(A, 0, 0);
    c.globalAlpha = ease.out(seg(p, 0.05, 0.5)); c.drawImage(B, 0, 0); c.globalAlpha = 1;
    // halo
    const glow = Math.sin(Math.PI * Math.pow(seg(p, 0, 1), 0.6));
    const rg = c.createRadialGradient(cx, cy, 0, cx, cy, 520);
    rg.addColorStop(0, `rgba(255,246,210,${0.85 * glow})`); rg.addColorStop(0.35, `rgba(255,220,140,${0.35 * glow})`); rg.addColorStop(1, 'rgba(255,220,140,0)');
    c.globalCompositeOperation = 'lighter'; c.fillStyle = rg; c.fillRect(0, 0, W, H);
    // light
    const r = rng(5), n = 34, rot = p * 0.35;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + rot + r() * 0.08, len = 2400, wd = 0.006 + r() * 0.01;
      const al = glow * (0.25 + r() * 0.45);
      c.fillStyle = `rgba(255,214,120,${al})`;
      c.beginPath(); c.moveTo(cx, cy);
      c.lineTo(cx + Math.cos(a - wd) * len, cy + Math.sin(a - wd) * len);
      c.lineTo(cx + Math.cos(a + wd) * len, cy + Math.sin(a + wd) * len); c.fill();
    }
    c.globalCompositeOperation = 'source-over';
  },

  // ⑥ Renaissance → Ukiyo-e: The huge waves in the Great Wave of Kanagawa sweep from left to right, with white foam claws + splashing waves on the top of the waves, and a new picture behind the waves.
  wave(c, A, B, p) {
    const e = ease.inOut(p);
    const bw = 300;                                     // Wave bandwidth
    const x0 = lerp(-bw - 120, W + 260, e);             // left edge of wave zone
    const edge = y => x0 + Math.sin(y / H * Math.PI * 1.6 + 0.6) * 70;   // S shape
    c.drawImage(A, 0, 0);
    // New screen: Left side of the wave belt
    c.save(); c.beginPath(); c.moveTo(-10, 0);
    for (let y = 0; y <= H; y += 20) c.lineTo(edge(y) + 10, y);
    c.lineTo(-10, H); c.closePath(); c.clip(); c.drawImage(B, 0, 0); c.restore();
    // Wave belt body
    c.save(); c.beginPath();
    for (let y = 0; y <= H; y += 20) c.lineTo(edge(y), y);
    for (let y = H; y >= 0; y -= 20) c.lineTo(edge(y) + bw, y);
    c.closePath(); c.fillStyle = '#1f3f8a'; c.fill(); c.clip();
    // Ripple: several parallel light blue curves
    c.strokeStyle = 'rgba(170,200,240,.75)'; c.lineWidth = 6;
    for (let k = 1; k < 7; k++) {
      c.beginPath();
      for (let y = 0; y <= H; y += 20) c.lineTo(edge(y) + k * bw / 7 + Math.sin(y / 60 + k) * 6, y);
      c.stroke();
    }
    c.restore();
    // Wave-headed Foam Claw (serrated right edge)
    c.fillStyle = '#fbf7ec'; c.strokeStyle = '#1b2a55'; c.lineWidth = 2;
    for (let y = -20; y < H + 40; y += 54) {
      const ex = edge(y) + bw;
      c.beginPath(); c.moveTo(ex - 6, y);
      c.quadraticCurveTo(ex + 40, y + 6, ex + 58, y + 22);
      c.quadraticCurveTo(ex + 30, y + 26, ex + 22, y + 40);
      c.quadraticCurveTo(ex + 10, y + 46, ex - 6, y + 54); c.closePath(); c.fill(); c.stroke();
    }
    // Droplets
    const r = rng(19);
    for (let i = 0; i < 70; i++) {
      const y = r() * H, ex = edge(y) + bw + 30 + r() * 170, rr = 3 + r() * 7;
      c.globalAlpha = 0.9 * (1 - r() * 0.5);
      c.beginPath(); c.arc(ex, y, rr, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
  },

  // ⑦ Ukiyo-e → Impressionism: "painting" a new picture with short colorful strokes
  dabs(c, A, B, p) {
    const D = once('dabs', () => {
      const r = rng(23), out = [];
      for (let i = 0; i < 2600; i++) out.push({ x: r() * W, y: r() * H, a: -0.9 + r() * 0.5, l: 34 + r() * 46, w: 10 + r() * 10, t: r() });
      return out;
    });
    c.drawImage(A, 0, 0);
    const q = ease.out(seg(p, 0, 0.7));
    c.save(); c.beginPath();
    let any = false;
    for (const d of D) {
      if (d.t > q) continue; any = true;
      const s = clamp((q - d.t) / 0.12);
      c.moveTo(d.x + Math.cos(d.a) * d.l * s / 2, d.y + Math.sin(d.a) * d.l * s / 2);
      c.ellipse(d.x, d.y, d.l * s / 2, d.w / 2, d.a, 0, Math.PI * 2);
    }
    if (any) { c.clip(); c.drawImage(B, 0, 0); }
    c.restore();
    // Scattered bright strokes floating on top (impressionist light spots)
    const r = rng(29), al = Math.sin(Math.PI * p) * 0.8;
    const cols = ['#f6e27a', '#f2a7c3', '#b9d9f2', '#c6e8a8', '#ffffff'];
    for (let i = 0; i < 260; i++) {
      const x = r() * W, y = r() * H, a = -0.8 + r() * 0.4, l = 20 + r() * 30, col = cols[(r() * cols.length) | 0];
      if (r() > al) continue;
      c.fillStyle = col; c.globalAlpha = 0.75; c.beginPath(); c.ellipse(x, y, l / 2, 4 + r() * 3, a, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    if (p > 0.7) { c.globalAlpha = seg(p, 0.7, 1); c.drawImage(B, 0, 0); c.globalAlpha = 1; }
  },

  // ⑧ Impressionism → Van Gogh: Starry sky vortex - the vortex with the window as the center is twisted, the new picture is rolled in with rotation, and finally straightened
  swirl(c, A, B, p, o) {
    const cx = o.cx || 420, cy = o.cy || 300;
    const S = 2;                                        // Pixel distortion at half resolution
    const w = W / S, h = H / S;
    const src = once('swirlSrc', () => ({ a: mkc(w, h), b: mkc(w, h), out: mkc(w, h) }));
    const sa = src.a.getContext('2d'), sb = src.b.getContext('2d'), so = src.out.getContext('2d');
    sa.drawImage(A, 0, 0, w, h); sb.drawImage(B, 0, 0, w, h);
    const da = sa.getImageData(0, 0, w, h).data, db = sb.getImageData(0, 0, w, h).data;
    const out = so.createImageData(w, h), d = out.data;
    const e = ease.out(p);
    const R = 1100 / S, ccx = cx / S, ccy = cy / S;
    const twA = e * 5.0, twB = (1 - e) * 4.2, rotB = -(1 - e) * 0.9;
    const mixR = e * 2.4;                               // The radius occupied by the new screen outward from the center (relative to R)
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = x - ccx, dy = y - ccy, r = Math.hypot(dx, dy), ang = Math.atan2(dy, dx), f = Math.max(0, 1 - r / R);
      const useB = r / R < mixR - 0.15 + Math.sin(ang * 3 + r / 40) * 0.08;
      let a2, sd;
      if (useB) { a2 = ang + twB * f * f + rotB * Math.min(1, f * 1.6); sd = db; } else { a2 = ang - twA * f * f; sd = da; }
      let sx = (ccx + Math.cos(a2) * r) | 0, sy = (ccy + Math.sin(a2) * r) | 0;
      sx = sx < 0 ? 0 : sx >= w ? w - 1 : sx; sy = sy < 0 ? 0 : sy >= h ? h - 1 : sy;
      const i = (y * w + x) * 4, j = (sy * w + sx) * 4;
      d[i] = sd[j]; d[i + 1] = sd[j + 1]; d[i + 2] = sd[j + 2]; d[i + 3] = 255;
    }
    so.putImageData(out, 0, 0);
    c.imageSmoothingQuality = 'high'; c.drawImage(src.out, 0, 0, W, H);
    if (p > 0.85) { c.globalAlpha = seg(p, 0.85, 1); c.drawImage(B, 0, 0); c.globalAlpha = 1; }
  },

  // ⑨ Van Gogh → Art Nouveau: An organic shape with a gold edge grows from the character's head (Mucha-style curved outline), growing outward to engulf the painting
  organic(c, A, B, p, o) {
    const cx = o.cx || 1500, cy = o.cy || 330;
    const e = ease.out(p) * 0.7 + p * 0.3;
    const R = e * 2300;
    const path = () => {
      c.beginPath();
      for (let i = 0; i <= 120; i++) {
        const a = i / 120 * Math.PI * 2;
        const rr = R * (1 + 0.22 * Math.sin(a * 3 + 0.7) + 0.12 * Math.sin(a * 5 + 2.1) + 0.06 * Math.sin(a * 9 + p * 3));
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.92;
        i ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.closePath();
    };
    c.drawImage(A, 0, 0);
    if (R < 1) return;
    c.save(); path(); c.clip(); c.drawImage(B, 0, 0); c.restore();
    path(); c.lineJoin = 'round';
    c.strokeStyle = '#6b4a24'; c.lineWidth = 14; c.stroke();
    c.strokeStyle = '#d9b25a'; c.lineWidth = 8; c.stroke();
  },

  // ⑩ Art Nouveau → Cubism: The picture is broken into geometric fragments, the fragments are misaligned and rotated, and the fragments of the new picture are put together and put into place.
  shards(c, A, B, p) {
    const tris = once('shards', () => {
      const r = rng(31), nx = 9, ny = 6, pts = [];
      for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
        const edge = i === 0 || j === 0 || i === nx || j === ny;
        pts.push([i / nx * W + (edge ? 0 : (r() - 0.5) * W / nx * 0.8), j / ny * H + (edge ? 0 : (r() - 0.5) * H / ny * 0.8)]);
      }
      const out = [];
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const a = pts[j * (nx + 1) + i], b = pts[j * (nx + 1) + i + 1], cc = pts[(j + 1) * (nx + 1) + i], d = pts[(j + 1) * (nx + 1) + i + 1];
        const flip = r() < 0.5;
        const t1 = flip ? [a, b, d] : [a, b, cc], t2 = flip ? [a, d, cc] : [b, d, cc];
        for (const t of [t1, t2]) out.push({ p: t, cx: (t[0][0] + t[1][0] + t[2][0]) / 3, cy: (t[0][1] + t[1][1] + t[2][1]) / 3, t: r(), dx: (r() - 0.5) * 160, dy: (r() - 0.5) * 120, rot: (r() - 0.5) * 0.5, sh: 0.75 + r() * 0.5 });
      }
      return out;
    });
    const draw = (img, tr, q, out) => {
      c.save(); c.beginPath(); tr.p.forEach((v, i) => i ? c.lineTo(v[0], v[1]) : c.moveTo(v[0], v[1])); c.closePath();
      c.translate(tr.cx, tr.cy);
      const k = out ? q : 1 - q;                       // Old films: becoming more and more biased; new films: becoming more and more positive
      c.translate(tr.dx * k, tr.dy * k); c.rotate(tr.rot * k); c.translate(-tr.cx, -tr.cy);
      c.clip(); c.drawImage(img, 0, 0);
      c.fillStyle = `rgba(${out ? '60,45,30' : '255,250,235'},${0.12 * tr.sh * Math.sin(Math.PI * q)})`; c.fill();
      c.strokeStyle = 'rgba(40,30,20,.35)'; c.lineWidth = 2; c.stroke();
      c.restore();
    };
    c.fillStyle = '#cbbfa8'; c.fillRect(0, 0, W, H);
    for (const tr of tris) {
      const qo = ease.inOut(clamp((p - tr.t * 0.4) / 0.45));   // Old piece fragmentation progress
      const qi = ease.out(clamp((p - 0.25 - tr.t * 0.45) / 0.3)); // New film placement progress
      if (qi > 0) draw(B, tr, qi, false); else draw(A, tr, qo, true);
    }
  },

  // ⑪ Stereo → Bauhaus: The composition of blue square + red circle + yellow triangle is rotated and enlarged. The off-white circle in the center is a new picture, and finally the swept-out picture is formed.
  bauhaus(c, A, B, p, o) {
    const cx = o.cx || 1010, cy = o.cy || 560;
    c.drawImage(A, 0, 0);
    const s = Math.pow(30, ease.out(seg(p, 0, 0.7))) * 0.35;   // exponential amplification
    const rot = -0.5 + p * 0.9;
    const shift = ease.in(seg(p, 0.4, 1)) * -1600;          // Sweep to the left as a whole
    c.save(); c.translate(cx + shift, cy); c.rotate(rot); c.scale(s, s);
    c.fillStyle = '#1d4fa3'; c.fillRect(-170, -170, 340, 340);
    c.rotate(-rot * 0.6);
    c.fillStyle = '#d0262b'; c.beginPath(); c.arc(0, 0, 150, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#f2c81c'; c.beginPath(); c.moveTo(0, -150); c.lineTo(130, 75); c.lineTo(-130, 75); c.closePath(); c.fill();
    c.restore();
    // Inside the off-white circle is a new picture (do not follow the overall sweep, continue to zoom in until it is filled)
    const rr = Math.pow(40, ease.inOut(seg(p, 0.15, 0.85))) * 30;
    c.save(); c.beginPath(); c.arc(cx, cy, rr, 0, Math.PI * 2); c.clip(); c.drawImage(B, 0, 0); c.restore();
  },

  // ⑫ Bauhaus→Pop: Yellow lightning split + Bendai dotization, the old picture becomes dots, and the new picture develops from the dots
  zigzag(c, A, B, p) {
    const halftone = (img, amt, key) => {
      const sc = 16;
      const sm = once('ht_' + key, () => mkc(W / sc, H / sc));
      const sg = sm.getContext('2d'); sg.drawImage(img, 0, 0, W / sc, H / sc);
      const d = sg.getImageData(0, 0, W / sc, H / sc).data;
      c.globalAlpha = 1; c.drawImage(img, 0, 0); c.fillStyle = 'rgba(244,236,216,.55)'; c.fillRect(0, 0, W, H);
      for (let y = 0; y < H / sc; y++) for (let x = 0; x < W / sc; x++) {
        const i = (y * W / sc + x) * 4, L = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255;
        const r = sc * 0.62 * (0.35 + (1 - L) * 0.85) * amt + 1;
        c.fillStyle = `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`;
        c.beginPath(); c.arc(x * sc + sc / 2 + (y % 2) * sc / 2, y * sc + sc / 2, r, 0, Math.PI * 2); c.fill();
      }
    };
    if (p < 0.35) c.drawImage(A, 0, 0);
    else if (p < 0.55) halftone(A, 1, 'a');
    else if (p < 0.75) halftone(B, 1, 'b');
    else { c.drawImage(B, 0, 0); c.globalAlpha = 1 - seg(p, 0.75, 1); halftone(B, 1, 'b'); c.globalAlpha = 1; }
    // Lightning: yellow zigzag strip with black edges, striking from upper left to lower right
    const q = seg(p, 0.05, 0.6); if (q <= 0 || q >= 1) return;
    const pts = [], n = 9;
    for (let i = 0; i <= n; i++) pts.push([lerp(780, 1450, i / n) + (i % 2 ? 90 : -90), lerp(-40, H + 40, i / n)]);
    const k = Math.min(n, Math.floor(q * 2 * n) + 1);
    c.save(); c.lineJoin = 'miter';
    c.beginPath(); pts.slice(0, k + 1).forEach((v, i) => i ? c.lineTo(v[0], v[1]) : c.moveTo(v[0], v[1]));
    c.strokeStyle = '#111'; c.lineWidth = 34; c.stroke(); c.strokeStyle = '#ffe02a'; c.lineWidth = 22; c.stroke();
    c.restore();
    // starting point starburst
    if (q < 0.5) {
      c.save(); c.translate(70, 990); c.fillStyle = '#ffe02a'; c.strokeStyle = '#111'; c.lineWidth = 4; c.beginPath();
      for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, r = i % 2 ? 70 : 105; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      c.closePath(); c.fill(); c.stroke(); c.restore();
    }
  },

  // ⑬ Pop → 8-bit: The pixel blocks in the old picture become larger and larger. After switching to the new picture, the pixel blocks change from large to small until they are clear.
  pixelate(c, A, B, p) {
    const img = p < 0.5 ? A : B;
    const q = p < 0.5 ? p / 0.5 : 1 - (p - 0.5) / 0.5;
    const bs = Math.max(1, Math.round(lerp(1, 72, ease.in(q))));
    if (bs <= 1) { c.drawImage(img, 0, 0); return; }
    const sm = once('px', () => mkc(W, H)), sg = sm.getContext('2d');
    const w = Math.ceil(W / bs), h = Math.ceil(H / bs);
    sg.imageSmoothingEnabled = true; sg.clearRect(0, 0, w, h); sg.drawImage(img, 0, 0, w, h);
    c.imageSmoothingEnabled = false; c.drawImage(sm, 0, 0, w, h, 0, 0, w * bs, h * bs); c.imageSmoothingEnabled = true;
  },

  // ⑭ 8-bit→Light tracing: green neon line frame on black background (edge ​​of new picture + perspective grid ground), scan line from top to bottom to "calculate" the rendering result
  wireframe(c, A, B, p) {
    const edges = (() => {                                   // Each frame is recalculated from the current B (half-resolution Sobel, about 10ms): cache will be segmented, dependent on rendering order
      const s = 2, w = W / s, h = H / s, sm = once('edgesCanvas', () => mkc(w, h)), g = sm.getContext('2d', { willReadFrequently: true });
      g.clearRect(0, 0, w, h); g.drawImage(B, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data, out = g.createImageData(w, h), o = out.data;
      const L = (x, y) => { const i = (y * w + x) * 4; return d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11; };
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const gx = L(x + 1, y) - L(x - 1, y), gy = L(x, y + 1) - L(x, y - 1), m = Math.hypot(gx, gy);
        const i = (y * w + x) * 4, v = m > 38 ? 255 : 0;
        o[i] = 60; o[i + 1] = 255; o[i + 2] = 150; o[i + 3] = v;
      }
      g.putImageData(out, 0, 0); return sm;
    })();
    const wire = () => {
      c.fillStyle = '#02060a'; c.fillRect(0, 0, W, H);
      // perspective grid floor
      c.strokeStyle = 'rgba(60,255,150,.8)'; c.lineWidth = 2;
      const hy = 640, vx = W / 2;
      for (let i = -24; i <= 24; i++) { c.beginPath(); c.moveTo(vx + i * 30, hy); c.lineTo(vx + i * 260, H); c.stroke(); }
      for (let k = 0; k < 12; k++) { const y = hy + Math.pow(k / 12, 2) * (H - hy); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      c.shadowColor = '#3cff96'; c.shadowBlur = 8; c.drawImage(edges, 0, 0, W, H); c.shadowBlur = 0;
    };
    if (p < 0.12) { c.drawImage(A, 0, 0); c.globalAlpha = p / 0.12; wire(); c.globalAlpha = 1; return; }
    wire();
    const q = ease.inOut(seg(p, 0.3, 1)), yy = q * H;
    if (yy > 0) { c.save(); c.beginPath(); c.rect(0, 0, W, yy); c.clip(); c.drawImage(B, 0, 0); c.restore(); }
    if (q > 0 && q < 1) { c.fillStyle = 'rgba(200,255,230,.9)'; c.fillRect(0, yy - 3, W, 6); }
  },

  // ⑮ Light chasing → 2026: Three-color concentric rings expand linearly from the cup (992,601), with an outer diameter of about 143px/frame, and a thickness of each ring of 137px. The innermost ring is a new picture (storyboard T15)
  iris(c, A, B, p, o) {
    const cx = o.cx || 992, cy = o.cy || 601;
    const R = 19 + p * (1159 - 19 + 3 * 137 + 900);           // Linear; when p=1, the innermost ring also exceeds the diagonal corner of the screen
    c.drawImage(A, 0, 0);
    const ring = (r, col) => { if (r <= 0) return; c.fillStyle = col; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill(); };
    ring(R, 'rgb(33,42,81)'); ring(R - 137, 'rgb(234,124,107)'); ring(R - 274, 'rgb(250,246,235)');
    const ri = R - 411;
    if (ri > 0) { c.save(); c.beginPath(); c.arc(cx, cy, ri, 0, Math.PI * 2); c.clip(); c.drawImage(B, 0, 0); c.restore(); }
  },

  // ===================== The transitions included in the migration test A–D (the names are the same as the recipe cards in references/style-recipes) =====================
  // Each one is based on the signature language of the "entering paragraph" style: first look for the physical process that will "appear/light up/sweep" in the new style, the old painting will be contaminated by it first, and the new painting will emerge from its shape.
  // ---- A: Ink/Klimt/Munch/Dunhuang/Kusama ----
  // Ink → Klimt: Gold foil is applied piece by piece. Square gold foil (with spiral/eye-shaped/concentric circle embossing) falls from the girl’s head in a spiral order,
  // After being applied firmly, the golden color fades away to reveal a new picture. q<0.5 is applied with gold foil (from 1.3 times, with rotation and placement), 0.5..1 gold foil becomes transparent and B is exposed.
  goldLeaf(c, A, B, p, o) {
    const ts = 72, cx = o.cx || 1300, cy = o.cy || 380;
    const tiles = once('goldLeaf', () => { const r = rng(21), out = [], maxd = Math.hypot(W, H) * 0.8;
      for (let y = 0; y < H; y += ts) for (let x = 0; x < W; x += ts) { const mx = x + ts / 2, my = y + ts / 2; const d = Math.hypot(mx - cx, my - cy) / maxd, a = (Math.atan2(my - cy, mx - cx) / (Math.PI * 2) + 1) % 1;
        out.push({ x, y, key: d * 0.78 + a * 0.12 + r() * 0.08, rot: (r() - .5) * 0.8, m: (r() * 3) | 0 }); }
      return out; });
    c.drawImage(A, 0, 0);
    for (const t of tiles) {
      const q = clamp((p * 1.32 - t.key) / 0.32); if (q <= 0) continue;
      if (q >= 1) { c.drawImage(B, t.x, t.y, ts, ts, t.x, t.y, ts, ts); continue; }
      const mx = t.x + ts / 2, my = t.y + ts / 2;
      if (q > 0.5) c.drawImage(B, t.x, t.y, ts, ts, t.x, t.y, ts, ts);
      const u = q < 0.5 ? q / 0.5 : 1, fadeOut = q < 0.5 ? 1 : 1 - (q - 0.5) / 0.5;
      c.save(); c.translate(mx, my); c.rotate(t.rot * (1 - ease.out(u))); const s = 1.3 - 0.3 * ease.out(u); c.scale(s, s);
      c.globalAlpha = Math.min(1, u * 2.5) * fadeOut;
      const g = c.createLinearGradient(-ts / 2, -ts / 2, ts / 2, ts / 2); const sh = clamp(u);
      g.addColorStop(0, '#a8741e'); g.addColorStop(clamp(0.2 + sh * 0.5), '#fbe6a0'); g.addColorStop(1, '#c8962e');
      c.fillStyle = g; c.fillRect(-ts / 2, -ts / 2, ts, ts);
      c.strokeStyle = 'rgba(70,40,10,.75)'; c.lineWidth = 2.2; c.beginPath();
      if (t.m === 0) { for (let a = 0; a < Math.PI * 5; a += 0.25) { const rr = 26 * a / (Math.PI * 5); a ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(0, 0); } }
      else if (t.m === 1) { c.moveTo(-24, 0); c.quadraticCurveTo(0, -20, 24, 0); c.quadraticCurveTo(0, 20, -24, 0); c.moveTo(7, 0); c.arc(0, 0, 7, 0, Math.PI * 2); }
      else { [8, 16, 24].forEach(rr => { c.moveTo(rr, 0); c.arc(0, 0, rr, 0, Math.PI * 2); }); }
      c.stroke(); c.restore();
    }
  },
  // Klimt → Munch: The bloody sky in “The Scream” “flows” across the screen from top to bottom. Old paintings are sinusoidally distorted row by row, with increasing amplitude;
  // Above the wavy front is a new picture (the distortion amplitude changes from large to small), with 4 yellow, orange and red bands pressing on the front.
  screamWarp(c, A, B, p, o) {
    const e = ease.inOut(p), ph = o.lt * 9;
    const yF = x => lerp(-180, H + 220, e) + 80 * Math.sin(x * 0.0055 + p * 7);
    c.fillStyle = '#3a1410'; c.fillRect(0, 0, W, H);
    KIT.warpRows(c, A, y => 70 * e * Math.sin(y * 0.014 + ph) + 20 * e * Math.sin(y * 0.05 - ph), 6, 92 * e);
    const tg = o.tmp.getContext('2d'); tg.reset(); tg.fillStyle = '#3a1410'; tg.fillRect(0, 0, W, H);
    KIT.warpRows(tg, B, y => 60 * (1 - e) * Math.sin(y * 0.013 - ph), 6, 62 * (1 - e));
    c.save(); c.beginPath(); c.moveTo(0, -10); for (let x = 0; x <= W; x += 24) c.lineTo(x, yF(x)); c.lineTo(W, -10); c.closePath(); c.clip(); c.drawImage(o.tmp, 0, 0); c.restore();
    c.save(); c.lineCap = 'round';
    ['#b82a1e', '#e2541c', '#f08a24', '#f4c03a'].forEach((col, k) => { c.strokeStyle = col; c.lineWidth = 26; c.beginPath(); for (let x = -20; x <= W + 20; x += 16) { const y = yF(x) - k * 22 + 10 * Math.sin(x * 0.02 + ph + k); x > -20 ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); });
    c.restore();
  },
  // Munch → Dunhuang: The flying ribbon sweeps from right to left, followed by murals; at the front, the old paintings peel off into pieces and fall.
  apsara(c, A, B, p, o) {
    const e = ease.inOut(p);
    const xF = y => lerp(W + 260, -300, e) + 110 * Math.sin(y * 0.006 + p * 5);
    c.drawImage(A, 0, 0);
    c.save(); c.beginPath(); c.moveTo(W + 10, -10); for (let y = -10; y <= H + 10; y += 20) c.lineTo(xF(y), y); c.lineTo(W + 10, H + 10); c.closePath(); c.clip(); c.drawImage(B, 0, 0); c.restore();
    // Peeling: The old painting fragments on the left side of the front edge (take the pixels of A) rotate and fall
    const fl = once('apsaraFlakes', () => { const r = rng(33), o2 = []; for (let i = 0; i < 70; i++) o2.push([r() * H, 20 + r() * 34, 10 + r() * 26, r() * 6.28, r()]); return o2; });
    fl.forEach(([y0, s, dx, rot, k]) => { const born = clamp(1 - (xF(y0) + 40) / (W + 300)); const age = e - born * 0.9; if (age < 0) return;
      const x = xF(y0) - dx + age * 120, y = y0 + age * age * 900; if (y > H + 40) return;
      c.save(); c.translate(x, y); c.rotate(rot + age * 9); c.scale(1, Math.cos(age * 12 + k * 6)); c.drawImage(A, clamp(x, 0, W - s), clamp(y0, 0, H - s), s, s * 0.7, -s / 2, -s * 0.35, s, s * 0.7); c.restore(); });
    // Three streamers are rolled along the front edge (stone green, earth red, and stone blue) with white flowers.
    [['#6ab08e', 0, 44], ['#a5452f', 70, 38], ['#5a86b0', 140, 32]].forEach(([col, off, w], k) => {
      const pts = []; for (let y = -60; y <= H + 60; y += 18) pts.push([xF(y) + off + 46 * Math.sin(y * 0.011 - p * 14 + k * 1.7), y]);
      const path = KIT.ribbon(pts, q => w * (0.6 + 0.4 * Math.sin(q * 14 + p * 10 + k)));
      c.fillStyle = col; c.fill(path); c.strokeStyle = '#5a2414'; c.lineWidth = 2.4; c.stroke(path);
      c.strokeStyle = '#ecdfc4'; c.lineWidth = 2; c.setLineDash([4, 10]); c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.setLineDash([]);
    });
  },
  // Dunhuang → Kusama: Wave dots grow out from the cat's position in circles, and the dots are new pictures; when the dots swell to connect with each other, the whole picture is changed.
  dotBloom(c, A, B, p, o) {
    const sp = 58, cx = o.cx || 540, cy = o.cy || 760, maxd = Math.hypot(W, H);
    c.drawImage(A, 0, 0);
    const pts = once('dotBloom', () => { const r = rng(44), out = []; for (let y = 0, j = 0; y < H + sp; y += sp * 0.87, j++) for (let x = (j % 2) * sp / 2; x < W + sp; x += sp) out.push([x + (r() - .5) * 8, y + (r() - .5) * 8, Math.hypot(x - cx, y - cy) / maxd, r()]); return out; });
    const path = new Path2D(), rims = [];
    for (const [x, y, d, k] of pts) { const q = clamp((p * 1.55 - d * 1.1 - k * 0.08) / 0.42); if (q <= 0) continue; const r = ease.outBack(q) * sp * 0.74; path.moveTo(x + r, y); path.arc(x, y, r, 0, Math.PI * 2); if (q < 1) rims.push([x, y, r, q]); }
    c.save(); c.clip(path); c.drawImage(B, 0, 0); c.restore();
    c.lineWidth = 5; rims.forEach(([x, y, r, q]) => { c.strokeStyle = `rgba(251,246,238,${1 - q})`; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); });
  },
  // ---- C: Kirby / Monet / Seurat / Matisse / Haring ----
  // ① Kirby → Monet: The old picture "falling into the water" - the horizontal sinusoidal dislocation (the jitter of the water surface reflection) becomes stronger and stronger line by line;
  //    The new image spreads out from the cup with "horizontal short strokes" (ripples are composed of brush strokes), with short horizontal lines of bright water flashing.
  ripple(c, A, B, p, o) {
    const cx = o.cx || 1000, cy = o.cy || 600, e = ease.inOut(p);
    const amp = 46 * Math.sin(Math.PI * Math.min(1, p * 1.2)), rowH = 6;
    for (let y = 0; y < H; y += rowH) { const d = Math.abs(y - cy) / H, dx = Math.sin(y * 0.045 - p * 26) * amp * (0.4 + d); c.drawImage(A, 0, y, W, rowH, dx, y, W, rowH); }
    const S = once('rip', () => { const r = rng(41), out = []; for (let i = 0; i < 3600; i++) { const x = r() * W, y = r() * H; out.push({ x, y, l: 40 + r() * 70, h: 9 + r() * 8, d: Math.hypot(x - cx, (y - cy) * 1.9) / 1700 + r() * 0.06 }); } return out; });
    const front = e * 1.15 - 0.05;
    c.save(); c.beginPath(); let any = false;
    for (const s of S) { if (s.d > front) continue; any = true; const k = clamp((front - s.d) / 0.06); c.ellipse(s.x, s.y, s.l * k / 2 + 1, s.h / 2, 0, 0, TAU); }
    if (any) { c.clip(); c.drawImage(B, 0, 0); }
    c.restore();
    // Ripple front: several circles of light-colored dotted ellipses + watery short horizontal lines
    c.save(); c.lineCap = 'round';
    for (let k = 0; k < 3; k++) { const R = front * 2300 - k * 70; if (R <= 0) continue; c.strokeStyle = `rgba(240,246,255,${0.7 - k * 0.2})`; c.lineWidth = 10 - k * 2; c.setLineDash([46, 22]); c.lineDashOffset = -p * 300; c.beginPath(); c.ellipse(cx, cy, R, R / 1.9, 0, 0, TAU); c.stroke(); }
    c.setLineDash([]);
    const r = rng(7 + Math.floor(p * 30)), al = Math.sin(Math.PI * p);
    for (let i = 0; i < 140; i++) { const x = r() * W, y = r() * H; c.strokeStyle = ['#fffbe8', '#f8e0ec', '#e8f4ff'][i % 3]; c.globalAlpha = al * 0.8; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 18 + r() * 30, y); c.stroke(); }
    c.restore();
    if (p > 0.7) { c.globalAlpha = seg(p, 0.7, 0.95); c.drawImage(B, 0, 0); c.globalAlpha = 1; }
  },

  // ② Monet → Seurat: The picture "crystallizes" into dots of the same size - dots grow out of the old picture first (the dots grow larger, and the bottom becomes paper-colored),
  //    Click the diagonal wave one by one to change the color of the new picture. Finally, the new picture is developed below the point and the point is retracted.
  pointill(c, A, B, p, o) {
    const pitch = 14, rowh = pitch * 0.866;
    const sa = once('ptA', () => mkc(W, H)), sb = once('ptB', () => mkc(W, H));
    const ga = sa.getContext('2d', { willReadFrequently: true }), gb = sb.getContext('2d', { willReadFrequently: true });
    ga.drawImage(A, 0, 0); gb.drawImage(B, 0, 0);
    const da = ga.getImageData(0, 0, W, H).data, db = gb.getImageData(0, 0, W, H).data;
    // Bottom: old picture → paper color → new picture
    c.drawImage(A, 0, 0);
    c.fillStyle = `rgba(246,238,220,${seg(p, 0.05, 0.4)})`; c.fillRect(0, 0, W, H);
    if (p > 0.6) { c.globalAlpha = seg(p, 0.6, 0.95); c.drawImage(B, 0, 0); c.globalAlpha = 1; }
    const grow = ease.out(seg(p, 0, 0.3)), shrink = 1 - ease.in(seg(p, 0.7, 1)), R = pitch * 0.46 * grow * shrink;
    if (R < 0.4) return;
    for (let j = 0, y = pitch / 2; y < H + pitch; j++, y += rowh) for (let x = (j % 2) * pitch / 2; x < W + pitch; x += pitch) {
      const sw = clamp(((x / W) * 0.6 + (y / H) * 0.4) * 0.5 + U.hash(x | 0, y | 0) * 0.25 + 0.15);   // Color changing time: upper left first, with random
      const useB = p > sw;
      const i = (clamp(y | 0, 0, H - 1) * W + clamp(x | 0, 0, W - 1)) * 4, d = useB ? db : da;
      // The click will "jump" (get bigger) when the color changes.
      const pop = Math.abs(p - sw) < 0.04 ? 1.35 : 1;
      c.fillStyle = `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`; c.beginPath(); c.arc(x, y, R * pop, 0, TAU); c.fill();
    }
  },

  // ③ Seurat → Matisse: A large piece of cobalt blue paper (scissor edge) brushed with gouache is swept from right to left, with white seaweed, yellow stars, and pink paper pieces (with projection) nailed to the paper;
  //    Where the paper passed, a new picture appeared behind it.
  cutouts(c, A, B, p, o) {
    const e = ease.inOut(p), w = 1100;                       // paper width
    const x0 = lerp(W + 40, -w - 360, e);                   // left edge of paper
    const edge = (y, side) => { const r = Math.sin(y * 0.021 + side * 3) * 26 + Math.sin(y * 0.067 + side) * 12; return r; };
    // The new picture is behind the right edge of the paper
    c.drawImage(A, 0, 0);
    c.save(); c.beginPath(); c.moveTo(W + 10, 0); for (let y = 0; y <= H; y += 18) c.lineTo(x0 + w + edge(y, 1), y); c.lineTo(W + 10, H); c.closePath(); c.clip(); c.drawImage(B, 0, 0); c.restore();
    // Paper (with projection)
    const sheet = new Path2D(); for (let y = 0; y <= H; y += 18) sheet.lineTo(x0 + edge(y, 0), y); for (let y = H; y >= 0; y -= 18) sheet.lineTo(x0 + w + edge(y, 1), y); sheet.closePath();
    c.save(); c.shadowColor = 'rgba(10,20,40,.45)'; c.shadowOffsetX = 14; c.shadowOffsetY = 10; c.shadowBlur = 12; c.fillStyle = '#1d4fb8'; c.fill(sheet); c.restore();
    c.save(); c.clip(sheet);
    const r0 = rng(83); c.lineCap = 'round';
    for (let i = 0; i < 260; i++) { const x = x0 + r0() * w, y = r0() * H; c.strokeStyle = r0() < 0.5 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'; c.lineWidth = 8 + r0() * 14; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 160, y - 40); c.stroke(); }
    // Paper-cuts on paper: seaweed (stems + fingers), stars, discs; move with the paper and sway individually
    const pin = (fn, col, x, y, rot) => { c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(10,20,40,.35)'; c.shadowOffsetX = 6; c.shadowOffsetY = 7; c.shadowBlur = 4; c.fillStyle = col; c.fill(fn); c.restore(); };
    const algae = once('ctAlg', () => { const p2 = new Path2D(); p2.addPath(RIG.limb([0, 0], [0, -420], 50, 26));
      for (let k = 0; k < 7; k++) { const u = 0.12 + k * 0.12, s = k % 2 ? 1 : -1, A0 = [0, -u * 420], th = s * (1.0 - 0.5 * u), L = 190 * (1 - 0.45 * u), d = [Math.sin(th), -Math.cos(th)];
        p2.addPath(RIG.limb(A0, [A0[0] + d[0] * L, A0[1] + d[1] * L], 64 * (1 - 0.3 * u), 56 * (1 - 0.3 * u))); } return p2; });
    const star = once('ctStar', () => KIT.star(0, 0, 120, 52, 6));
    pin(algae, '#f7f3e8', x0 + 260, 900, Math.sin(p * 9) * 0.1);
    pin(algae, '#f7d21e', x0 + 760, 1060, -0.2 + Math.sin(p * 11) * 0.1);
    pin(star, '#f7d21e', x0 + 540, 260, p * 3);
    pin(star, '#ef6f9a', x0 + 900, 520, -p * 2.5);
    const blob = once('ctBlob', () => { const q = new Path2D(); q.ellipse(0, 0, 130, 90, 0, 0, TAU); return q; }); pin(blob, '#e2322a', x0 + 180, 300, 0.3);
    c.restore();
  },

  // ④ Matisse → Haring: A thick black silhouette of a dancing figure (with arms in a V shape) is enlarged from the cup, and a new picture is inside the body.
  //    There is a Haring-esque line of radiating action around it; the figure grows larger and larger until its body fills the entire frame.
  radiant(c, A, B, p, o) {
    const cx = o.cx || 1000, cy = o.cy || 600, s = 0.15 * Math.pow(320, ease.inOut(p));
    const pose = { head: [0, -224], neck: [0, -182], hip: [0, -100], hl: [-84, -256], hr: [84, -256], kl: [-40, -54], kr: [40, -54], fl: [-60, -14], fr: [60, -14] };
    const T = q => [cx + q[0] * s, cy + (q[1] + 130) * s];
    const parts = [RIG.limb(T(pose.neck), T(pose.hip), 70 * s, 60 * s), RIG.limb(T(pose.neck), T(pose.hl), 36 * s, 32 * s), RIG.limb(T(pose.neck), T(pose.hr), 36 * s, 32 * s),
      RIG.limb(T(pose.hip), T(pose.kl), 38 * s, 34 * s), RIG.limb(T(pose.kl), T(pose.fl), 34 * s, 32 * s), RIG.limb(T(pose.hip), T(pose.kr), 38 * s, 34 * s), RIG.limb(T(pose.kr), T(pose.fr), 34 * s, 32 * s)];
    const hd = new Path2D(), hc = T(pose.head); hd.arc(hc[0], hc[1], 42 * s, 0, TAU); parts.push(hd);
    c.drawImage(A, 0, 0);
    // Black outline (thick outline + black filling)
    c.save(); c.lineJoin = 'round'; c.strokeStyle = '#111'; c.lineWidth = 30; c.fillStyle = '#111'; parts.forEach(q => { c.stroke(q); c.fill(q); }); c.restore();
    // There is a new picture in the body: masking off the screen
    const m = once('rdM', () => mkc()), mg = m.getContext('2d'); mg.globalCompositeOperation = 'source-over'; mg.clearRect(0, 0, W, H);
    mg.fillStyle = '#fff'; parts.forEach(q => mg.fill(q)); mg.globalCompositeOperation = 'source-in'; mg.drawImage(B, 0, 0);
    c.drawImage(m, 0, 0);
    // Radial action line (8fps jump)
    const st = Math.floor(o.t * 8), r = rng(300 + st); c.save(); c.strokeStyle = '#111'; c.lineCap = 'round'; c.lineWidth = 14;
    const R0 = 300 * s + 30;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + r() * 0.2, L = 50 + r() * 60; c.beginPath(); c.moveTo(cx + Math.cos(a) * R0, cy + Math.sin(a) * R0 * 0.9); c.lineTo(cx + Math.cos(a) * (R0 + L), cy + Math.sin(a) * (R0 + L) * 0.9); c.stroke(); }
    c.restore();
    if (p > 0.82) { c.globalAlpha = seg(p, 0.82, 1); c.drawImage(B, 0, 0); c.globalAlpha = 1; }
  },
  // ---- D: Rembrandt / Rubber Tube / Shadow Puppet / Makoto Shinkai / Blue Period ----
  // Rembrandt → Rubber tube cartoon: The old painting first fades into sepia old film (flickers + scratches), the black aperture reaches the mouth of the girl's cup, and then "bounces" away from the same point (outBack overshoot)
  irisFilm(c, A, B, p, o) {
    const cx = o.cx || 960, cy = o.cy || 540, R0 = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 20;
    const close = p < 0.5, q = close ? seg(p, 0, 0.5) : seg(p, 0.5, 1);
    if (close) { c.save(); c.filter = `sepia(${q}) grayscale(${q * 0.7}) contrast(${1 + q * 0.3})`; c.drawImage(A, 0, 0); c.restore(); }
    else c.drawImage(B, 0, 0);
    const R = close ? R0 * (1 - ease.in(q)) : R0 * ease.outBack(q);
    c.save(); c.fillStyle = '#0b0906'; c.beginPath(); c.rect(0, 0, W, H);
    // Slight hand shake at the edge of the aperture (12fps shape change)
    const wr = rng(Math.floor(o.t * 12) + 9); c.moveTo(cx + Math.max(0, R), cy);
    for (let i = 1; i <= 48; i++) { const a = i / 48 * Math.PI * 2, rr = Math.max(0, R * (1 + (wr() - 0.5) * 0.015)); c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    c.fill('evenodd'); c.restore();
    filmDirt(c, o.t, close ? q : 1 - q * 0.5);
  },
  // Rubber tube → Shadow puppet: The old film is pressed into a dark brown silhouette like a light goes out; the oil lamp behind the scenes lights up from the center, the warm aperture (with a flickering flame on the edge) pushes outward, and a new picture appears in the light
  lampGlow(c, A, B, p, o) {
    const cx = o.cx || 960, cy = o.cy || 470;
    c.drawImage(A, 0, 0);
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(70,34,12,${Math.min(1, p * 2.2)})`; c.fillRect(0, 0, W, H); c.restore();
    const fl = Math.sin(o.t * 37) * 0.04 + Math.sin(o.t * 23) * 0.03;
    const R = 1500 * ease.inOut(seg(p, 0.12, 1)) * (1 + fl);
    if (R > 1) {
      const T = o.tmp, g = T.getContext('2d'); g.reset(); g.drawImage(B, 0, 0);
      g.globalCompositeOperation = 'destination-in'; const m = g.createRadialGradient(cx, cy, R * 0.55, cx, cy, R); m.addColorStop(0, '#000'); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(0, 0, W, H);
      c.drawImage(T, 0, 0);
    }
    c.save(); c.globalCompositeOperation = 'lighter'; const gl = Math.sin(Math.PI * seg(p, 0.05, 1)), rg = c.createRadialGradient(cx, cy, 0, cx, cy, 300 + R * 0.4);
    rg.addColorStop(0, `rgba(255,200,110,${0.7 * gl})`); rg.addColorStop(1, 'rgba(255,170,60,0)'); c.fillStyle = rg; c.fillRect(0, 0, W, H);
    // The flame itself: a small flame in the heartbeat of light
    c.fillStyle = `rgba(255,240,190,${gl})`; c.beginPath(); c.ellipse(cx, cy, 14 * (1 + fl * 4), 34 * (1 + fl * 3), 0, 0, 7); c.fill(); c.restore();
  },
  // Shadow puppet → Makoto Shinkai: A diagonal strong light sweeps from left to right (light leakage), and behind the light strip is a new picture; with horizontal drawing, colorful light spots and floating light particles
  flareSweep(c, A, B, p, o) {
    const e = ease.inOut(p), X = lerp(-500, W + 700, e), k = 0.35;
    c.drawImage(A, 0, 0);
    c.save(); c.beginPath(); c.moveTo(-10, 0); c.lineTo(X, 0); c.lineTo(X - H * k, H); c.lineTo(-10, H); c.closePath(); c.clip(); c.drawImage(B, 0, 0); c.restore();
    c.save(); c.globalCompositeOperation = 'lighter';
    const band = (w, a, col) => { c.save(); c.translate(X - H * k / 2, H / 2); c.transform(1, 0, -k, 1, 0, 0); const g = c.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(0.5, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(-w, -H, 2 * w, 2 * H); c.restore(); };
    band(520, 0.55, '255,236,200'); band(160, 0.85, '255,255,250'); band(60, 0.6, '200,240,255');
    const hz = c.createLinearGradient(0, 0, W, 0); hz.addColorStop(0, 'rgba(150,210,255,0)'); hz.addColorStop(clamp(X / W), `rgba(220,240,255,${0.7 * Math.sin(Math.PI * p)})`); hz.addColorStop(1, 'rgba(150,210,255,0)'); c.fillStyle = hz; c.fillRect(Math.max(0, X - 700), 300, 1400, 5);
    const r = rng(77);
    for (let i = 0; i < 40; i++) { const x = X - H * k * r() + (r() - 0.5) * 500, y = r() * H - p * 120 * r(), rr = 3 + r() * 14, a = (1 - Math.abs(x - X) / 700) * 0.6; if (a <= 0) continue;
      const g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(255,252,235,${a})`); g.addColorStop(1, 'rgba(255,252,235,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill(); }
    [[0.3, 40, '120,255,200'], [0.6, 24, '255,170,120'], [0.9, 60, '140,170,255']].forEach(([f, rr, col]) => { const x = lerp(X, W - X, f), y = lerp(300, 780, f); c.fillStyle = `rgba(${col},${0.18 * Math.sin(Math.PI * p)})`; c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.fill(); });
    c.restore();
  },
  // Shinkai Makoto → Blue Period: First, the color of the old painting is "taken away" to leave only blue (color mixing), and then six wide dry brush strokes are brushed from left to right, and the brush is a new painting; the tip of the brush has bristle drag marks
  blueBrush(c, A, B, p, o) {
    c.drawImage(A, 0, 0);
    c.save(); c.globalCompositeOperation = 'color'; c.fillStyle = `rgba(45,90,148,${Math.min(1, p * 2.2)})`; c.fillRect(0, 0, W, H); c.restore();
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(90,120,170,${Math.min(0.6, p * 1.5)})`; c.fillRect(0, 0, W, H); c.restore();
    const N = 6, bh = H / N + 90, r = rng(21);
    for (let k = 0; k < N; k++) {
      const s = ease.inOut(seg(p, 0.12 + k * 0.07, 0.62 + k * 0.07)), x1 = lerp(-120, W + 260, s); if (s <= 0) continue;
      const y0 = k * (H / N) - 20 + (k % 2 ? 10 : -10), tilt = (k % 2 ? 1 : -1) * 18;
      const path = new Path2D(); path.moveTo(-20, y0 + tilt); const n = 24;
      for (let i = 0; i <= n; i++) { const x = lerp(-20, x1, i / n); path.lineTo(x, y0 + tilt * (1 - i / n) + Math.sin(i * 1.7 + k) * 6); }
      path.quadraticCurveTo(x1 + 70, y0 + bh / 2, x1, y0 + bh);
      for (let i = n; i >= 0; i--) { const x = lerp(-20, x1, i / n); path.lineTo(x, y0 + bh + tilt * (1 - i / n) + Math.cos(i * 1.3 + k) * 7); }
      path.closePath();
      c.save(); c.clip(path); c.drawImage(B, 0, 0);
      // Bristle drag marks: dark and light lines within 260px behind the pen tip (the paint has not been evenly applied yet)
      for (let i = 0; i < 26; i++) { const y = y0 + 6 + r() * (bh - 12), L = 80 + r() * 200; const g = c.createLinearGradient(x1 - L, 0, x1, 0); g.addColorStop(0, 'rgba(15,30,60,0)'); g.addColorStop(1, `rgba(${r() < .5 ? '15,30,60' : '170,195,220'},.5)`);
        c.strokeStyle = g; c.lineWidth = 1 + r() * 3; c.beginPath(); c.moveTo(x1 - L, y); c.lineTo(x1 + 10, y + (r() - 0.5) * 4); c.stroke(); }
      c.restore();
    }
  },
};

// Group D transitions are shared: flickers, vertical scratches, dust of old film (replaced once at 24fps)
const filmDirt = (c, t, amt = 1) => {                       // 24fps change: flicker, vertical scratches, dust
  const r = rng(Math.floor(t * 24) * 7919 + 3);
  c.fillStyle = `rgba(255,248,230,${(0.03 + r() * 0.1) * amt})`; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 3; k++) { const x = r() * W; c.strokeStyle = `rgba(${r() < .5 ? '255,250,235' : '20,16,10'},${0.5 * amt})`; c.lineWidth = 1 + r() * 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + (r() - .5) * 10, H); c.stroke(); }
  for (let k = 0; k < 12; k++) { c.fillStyle = `rgba(20,16,10,${0.6 * amt})`; c.beginPath(); c.arc(r() * W, r() * H, 1 + r() * 3, 0, 7); c.fill(); }
};

// ---- B: Constructivism / Dali / Hopper / Ghibli / Vaporwave ----
// ① Constructivism → Dali: The new picture "flows" from top to bottom like paint - the lower edge edge(x) is the overall falling line + a row of round-headed droplets
//    (Section (1-(dx/w)²)^0.3: long bar + round head, hanging downward); the old picture was pressed down and drooped column by column (melted); there was a highlight + a dark edge on the liquid surface.
T.melt = function (c, A, B, p) {
  const r = rng(41), drips = [];
  for (let i = 0; i < 26; i++) drips.push([r() * W, 10 + r() * 22, 60 + r() * 220, r() * 0.25]);
  const e = ease.inOut(p), fall = lerp(-160, H + 40, e);
  const edge = x => { let d = 0; for (const [dx, w, h, t0] of drips) { const u = (x - dx) / w; if (u > -1 && u < 1) d = Math.max(d, h * seg(p, t0, t0 + 0.5) * Math.pow(1 - u * u, 0.3)); } return fall + d + Math.sin(x * 0.005 + 1) * 24; };
  // The old picture droops column by column (the closer to the liquid level, the more pressure is applied)
  const sw = 4;
  for (let x = 0; x < W; x += sw) { const ed = edge(x), sag = Math.max(0, ed) * 0.22 * e; c.drawImage(A, x, 0, sw, H, x, sag, sw, H + sag * 0.3); }
  // New image: Above the liquid level
  c.save(); c.beginPath(); c.moveTo(0, -10); for (let x = 0; x <= W; x += 4) c.lineTo(x, edge(x)); c.lineTo(W, -10); c.closePath(); c.clip(); c.drawImage(B, 0, 0); c.restore();
  // Liquid level: inner dark edge (thickness) + highlight
  c.save(); c.beginPath(); for (let x = 0; x <= W; x += 4) { const y = edge(x); x ? c.lineTo(x, y) : c.moveTo(x, y); }
  c.strokeStyle = 'rgba(40,20,10,.35)'; c.lineWidth = 9; c.filter = 'blur(3px)'; c.stroke(); c.filter = 'none';
  c.translate(0, -5); c.strokeStyle = 'rgba(255,250,232,.7)'; c.lineWidth = 3; c.stroke(); c.restore();
};

// ② Dali → Hopper: A hard-edged oblique light block cuts in from the left - inside the light block is a new picture (with warm light), and the old picture outside the light block gradually sinks into a cold green shadow;
//    There is a vertical shadow of a window lattice in the light block following it. Finally, the warm light faded, leaving only a new picture.
T.sunShaft = function (c, A, B, p) {
  const e = ease.out(p) * 0.4 + ease.inOut(p) * 0.6, slant = 260;
  const xR = lerp(-slant, W + slant + 60, e), xL = lerp(-slant - 20, -slant - 900, e) ;   // The right edge sweeps across the entire screen, and the left edge stays outside the left
  const band = () => { c.beginPath(); c.moveTo(xL, 0); c.lineTo(xR, 0); c.lineTo(xR - slant, H); c.lineTo(xL - slant, H); c.closePath(); };
  c.drawImage(A, 0, 0);
  c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(70,120,110,${0.7 * Math.min(1, p * 2)})`; c.fillRect(0, 0, W, H); c.restore();
  c.save(); band(); c.clip(); c.drawImage(B, 0, 0);
  const warm = 0.45 * (1 - seg(p, 0.6, 1));
  c.globalCompositeOperation = 'screen'; c.fillStyle = `rgba(255,214,140,${warm})`; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(80,120,110,${0.8 * (1 - seg(p, 0.7, 1))})`;
  const mx = xR - 420; c.beginPath(); c.moveTo(mx, 0); c.lineTo(mx + 34, 0); c.lineTo(mx + 34 - slant, H); c.lineTo(mx - slant, H); c.closePath(); c.fill();
  c.restore();
  // A bright edge on the front edge of the light block
  c.save(); c.strokeStyle = `rgba(255,236,190,${0.8 * (1 - seg(p, 0.8, 1))})`; c.lineWidth = 6; c.beginPath(); c.moveTo(xR, 0); c.lineTo(xR - slant, H); c.stroke(); c.restore();
};

// ③ Hopper → Ghibli: Watercolor spreads on wet paper. Several color haloes bloomed from the window one after another, and the boundaries were circles disturbed by noise.
//    There is a dark water mark of pigment deposits on the edge + a bright halo diluted by water on the outside; inside the color halo is a new picture.
//    The α of the water mark/bright halo fades out according to the "expansion progress of this group", otherwise the grown water mark line will cross the new screen (stepped on in the first version).
T.bleed = function (c, A, B, p, o) {
  const cx = o.cx || 580, cy = o.cy || 330;
  const blobs = [[cx, cy, 0, 1.0], [1300, 420, 0.14, 0.75], [520, 880, 0.24, 0.6], [1650, 860, 0.3, 0.6], [1050, 100, 0.34, 0.55]];
  const st = blobs.map(([x, y, t0, k]) => ({ x, y, q: ease.inOut(seg(p, t0, t0 + 0.66)), k }));
  const one = (i) => { const b = st[i], R = b.q * 1400 * b.k; if (R <= 0) return;
    for (let j = 0; j <= 90; j++) { const a = j / 90 * Math.PI * 2, n = PAINT.fbm(Math.cos(a) * 1.6 + i * 7, Math.sin(a) * 1.6 + p * 0.8, 3);
      const rr = R * (1 + 0.28 * n + 0.05 * Math.sin(a * 9 + i)); const X = b.x + Math.cos(a) * rr, Y = b.y + Math.sin(a) * rr; j ? c.lineTo(X, Y) : c.moveTo(X, Y); }
    c.closePath(); };
  c.drawImage(A, 0, 0);
  // Water marks are only present when they first bloom (q<0.55 and fade to 0 within q<0.55) - the film reviewer caught the grown-up residual circle crossing the screen
  st.forEach((b, i) => { if (b.q <= 0 || b.q >= 1) return; c.save(); c.beginPath(); one(i); c.strokeStyle = `rgba(255,250,236,${0.6 * (1 - b.q)})`; c.lineWidth = 70; c.filter = 'blur(18px)'; c.stroke(); c.restore(); });
  c.save(); c.beginPath(); st.forEach((b, i) => one(i)); c.clip(); c.drawImage(B, 0, 0); c.restore();
  st.forEach((b, i) => { if (b.q <= 0 || b.q >= 0.55) return; c.save(); c.beginPath(); one(i); c.globalCompositeOperation = 'multiply'; c.strokeStyle = `rgba(150,110,70,${0.6 * Math.pow(1 - b.q / 0.55, 2)})`; c.lineWidth = 5; c.filter = 'blur(1.2px)'; c.stroke(); c.restore(); });
};

// ④ Ghibli → Vaporwave: VHS tape glitch. The first half of the old picture was torn horizontally + RGB separation, and in the middle part, "field synchronization was lost" and the entire frame was scrolled up + black bars.
//    The second half of the new picture stabilizes with gradually converging tearing.
T.vhs = function (c, A, B, p) {
  const f = Math.floor(p * 18), r = rng(900 + f), amp = Math.sin(Math.PI * p);
  const src = p < 0.5 ? A : B;
  const roll = p > 0.38 && p < 0.62 ? (seg(p, 0.38, 0.62) * H * 0.8) | 0 : 0;
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  if (roll) { c.drawImage(src, 0, roll); c.drawImage(src, 0, roll - H - 40); c.fillStyle = '#05010a'; c.fillRect(0, roll - 40, W, 40); }
  else c.drawImage(src, 0, 0);
  // Tear zone (taken from A or B, laterally dislocated)
  let y = 0; while (y < H) { const h = 6 + r() * 48, use = r() < p ? B : A;
    if (r() < 0.55 * amp + 0.08) { const dx = (r() - 0.5) * 260 * amp; c.drawImage(use, 0, y, W, h, dx, y, W, h); }
    y += h; }
  // RGB separation: magenta/cyan translucency misalignment
  c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.45 * amp;
  const T2 = PAINT.scratch('vhsT'), tg = T2.getContext('2d');
  [['#ff00ff', 14 * amp], ['#00ffff', -14 * amp]].forEach(([col, dx]) => { tg.globalCompositeOperation = 'source-over'; tg.clearRect(0, 0, W, H); tg.drawImage(src, 0, 0); tg.globalCompositeOperation = 'multiply'; tg.fillStyle = col; tg.fillRect(0, 0, W, H); c.drawImage(T2, dx, 0); });
  c.restore();
  // snowflake line
  c.save(); c.globalAlpha = 0.7 * amp; for (let i = 0; i < 160; i++) { c.fillStyle = r() < 0.5 ? '#fff' : '#9a9a9a'; c.fillRect(r() * W, r() * H, 30 + r() * 200, 2); } c.restore();
};


// ---- 4 samples added: A-D. The first paragraph of each group does not enter the transition at the beginning of the film. Click "Enter the signature language of the paragraph" to make up ----
Object.assign(T, {
  // Entering ink: the old painting is first "washed" into rice paper (removing color, brightening, and reducing contrast). Several groups of ink dots spread out from the place where the pen was written, with an ink halo around the edge. The new painting appears in the ink.
  inkBloom(c, A, B, p, o) {
    const cx = o.cx || 560, cy = o.cy || 740;
    c.save(); c.filter = `grayscale(${seg(p, 0, 0.5)}) brightness(${1 + 0.35 * seg(p, 0, 0.6)}) contrast(${1 - 0.3 * seg(p, 0, 0.6)})`; c.drawImage(A, 0, 0); c.restore();
    const blobs = once('inkBloom', () => { const r = rng(17), out = [[cx, cy, 0, 1.0]]; for (let i = 0; i < 6; i++) out.push([200 + r() * 1520, 120 + r() * 840, 0.08 + r() * 0.3, 0.45 + r() * 0.4]); return out; });
    const outline = (g, x, y, R) => { g.beginPath(); for (let j = 0; j <= 72; j++) { const a = j / 72 * TAU, n = PAINT.fbm(Math.cos(a) * 1.8 + x * 0.01, Math.sin(a) * 1.8 + y * 0.01, 3), rr = R * (1 + 0.35 * n); j ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); };
    const st = blobs.map(([x, y, t0, k]) => { const q = ease.out(seg(p, t0, t0 + 0.7)); return [x, y, q, q * 1500 * k]; });
    // Masks and ink edges are drawn at 1/4 resolution and then enlarged (edges are inherently soft; full resolution blur takes ~170ms)
    const sm = once('inkBloomSm', () => [mkc(W / 4, H / 4), mkc(W / 4, H / 4)]), [mk, rim] = sm, mg = mk.getContext('2d'), rg = rim.getContext('2d');
    mg.reset(); mg.scale(0.25, 0.25); mg.filter = 'blur(3px)'; mg.fillStyle = '#000';
    st.forEach(([x, y, q, R]) => { if (q > 0) { outline(mg, x, y, R); mg.fill(); } });
    rg.reset(); rg.scale(0.25, 0.25); rg.filter = 'blur(2.5px)'; rg.lineWidth = 34;                  // The ink halo edge: it is thick when it first spreads, and fades out when it grows up (otherwise, the remaining circle will cross the new screen)
    st.forEach(([x, y, q, R]) => { if (q <= 0 || q >= 1) return; rg.strokeStyle = `rgba(30,26,22,${0.55 * Math.pow(1 - q, 1.5)})`; outline(rg, x, y, R); rg.stroke(); });
    c.save(); c.globalCompositeOperation = 'multiply'; c.drawImage(rim, 0, 0, W, H); c.restore();
    const T2 = o.tmp, g = T2.getContext('2d'); g.reset(); g.drawImage(B, 0, 0); g.globalCompositeOperation = 'destination-in'; g.drawImage(mk, 0, 0, W, H);
    c.drawImage(T2, 0, 0);
    if (p > 0.8) { c.globalAlpha = seg(p, 0.8, 1); c.drawImage(B, 0, 0); c.globalAlpha = 1; }
  },
  // Entering Constructivism: Lissitzky's "Red Wedge in a White Circle" - a red wedge pierces the picture diagonally from the lower left, and behind the tip of the wedge is a new picture; three black typographic strips rush in following the wedge
  redWedge(c, A, B, p, o) {
    const e = ease.inOut(p), ang = -0.32, ca = Math.cos(ang), sa = Math.sin(ang);
    const X = lerp(-700, W + 900, e);                                           // The position of the wedge tip along the oblique axis
    const tf = (u, v) => [960 + (u - 960) * ca - (v - 540) * sa, 540 + (u - 960) * sa + (v - 540) * ca];
    c.drawImage(A, 0, 0);
    c.save(); c.beginPath(); [tf(-2000, -2000), tf(X - 420, -2000), tf(X - 420, 3000), tf(-2000, 3000)].forEach((q, i) => i ? c.lineTo(...q) : c.moveTo(...q)); c.closePath(); c.clip(); c.drawImage(B, 0, 0); c.restore();
    c.save(); c.fillStyle = '#c8231c'; c.beginPath(); [tf(X, 540), tf(X - 520, 540 - 330), tf(X - 520, 540 + 330)].forEach((q, i) => i ? c.lineTo(...q) : c.moveTo(...q)); c.closePath(); c.fill();
    c.fillStyle = '#151311'; [[-150, 26, 0], [120, 18, 0.12], [260, 34, 0.2]].forEach(([dv, h, lag]) => { const x1 = lerp(-700, W + 900, ease.inOut(clamp(p - lag))) - 560;
      c.beginPath(); [tf(-2000, 540 + dv), tf(x1, 540 + dv), tf(x1, 540 + dv + h), tf(-2000, 540 + dv + h)].forEach((q, i) => i ? c.lineTo(...q) : c.moveTo(...q)); c.closePath(); c.fill(); });
    c.restore();
  },
  // Enter Kirby comics: new pictures are "smashed" in according to the comic grid (from 1.18 times positioning, black grid line), and the old pictures that have not been replaced are first covered with a layer of Bendai dots
  comicPanels(c, A, B, p, o) {
    const cells = once('comicPanels', () => [[0, 0, 820, 520, 0], [820, 0, 1100, 520, 0.12], [0, 520, 640, 560, 0.24], [640, 520, 700, 560, 0.34], [1340, 520, 580, 560, 0.44]]);
    c.drawImage(A, 0, 0);
    c.save(); c.globalAlpha = Math.min(1, p * 2.5) * 0.85; c.fillStyle = PAINT.dotPattern(c, 'comicTr', 12, 3.4, '#e0287a', null, 75); c.fillRect(0, 0, W, H); c.restore();
    for (const [x, y, w, h, t0] of cells) {
      const q = seg(p, t0, t0 + 0.32); if (q <= 0) continue; const s = 1.18 - 0.18 * ease.outBack(q);
      c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
      c.translate(x + w / 2, y + h / 2); c.scale(s, s); c.translate(-x - w / 2, -y - h / 2); c.drawImage(B, 0, 0); c.restore();
      c.save(); c.strokeStyle = '#141212'; c.lineWidth = 14 * (1 - seg(p, 0.8, 1)); if (c.lineWidth > 0.5) c.strokeRect(x, y, w, h); c.restore();
    }
  },
  // Enter Rembrandt: the old painting sinks into dark brown (the dark corners close in from all sides), then a beam of light slanting down from the window illuminates the new picture, and finally the dark parts slowly develop
  chiaroscuro(c, A, B, p, o) {
    const sx = o.cx || 580, sy = o.cy || 300;
    c.drawImage(A, 0, 0);
    c.save(); c.globalCompositeOperation = 'multiply'; const d = seg(p, 0, 0.45);
    const vg = c.createRadialGradient(960, 540, lerp(1100, 80, d), 960, 540, lerp(1400, 700, d)); vg.addColorStop(0, 'rgba(255,255,255,1)'); vg.addColorStop(1, `rgba(28,18,10,${0.9 * d + 0.1})`);
    c.fillStyle = vg; c.fillRect(0, 0, W, H); c.fillStyle = `rgba(40,26,14,${0.85 * d})`; c.fillRect(0, 0, W, H); c.restore();
    const q = ease.inOut(seg(p, 0.25, 0.9)); if (q <= 0) return;
    const T2 = o.tmp, g = T2.getContext('2d'); g.reset(); g.drawImage(B, 0, 0); g.globalCompositeOperation = 'destination-in'; g.filter = 'blur(40px)'; g.fillStyle = '#000';
    const spread = lerp(60, 1400, q); g.beginPath(); g.moveTo(sx - 180, sy - 200); g.lineTo(sx + 180, sy - 200); g.lineTo(sx + 500 + spread, sy + 900); g.lineTo(sx - 200 - spread * 0.6, sy + 900); g.closePath(); g.fill();
    g.beginPath(); g.arc(sx + 420, sy + 260, lerp(40, 1500, q), 0, TAU); g.fill(); g.filter = 'none';
    c.drawImage(T2, 0, 0);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.35 * Math.sin(Math.PI * q); c.fillStyle = 'rgba(255,214,150,1)'; c.beginPath(); c.moveTo(sx - 140, sy - 160); c.lineTo(sx + 140, sy - 160); c.lineTo(sx + 420 + spread * 0.5, sy + 900); c.lineTo(sx - 120 - spread * 0.3, sy + 900); c.closePath(); c.filter = 'blur(30px)'; c.fill(); c.restore();
    if (p > 0.8) { c.globalAlpha = seg(p, 0.8, 1); c.drawImage(B, 0, 0); c.globalAlpha = 1; }
  },
});

// ================= YouTube explanation of grammar transition (references/09-video-animation-grammars.md) =================
// The transition principles of the commentary film are opposite to those of the art speed pass: do not steal the scene, maintain spatial continuity (the audience knows "where the camera went") - mostly camera movement and shared elements.
// The camera movement is calculated based on time in the scene (CAM), and the transition is only responsible for "how A and B fit together." These segments are generally written as punch: 0 or film-level window.PUNCH = 0 (turn off punch point punch).
Object.assign(T, {
  // [Same world] same: A and B are originally the same painting (canvas in the same world, camera moves continuously), so use B directly. Use it for Vox desktop quick shake and whiteboard panning.
  same(c, A, B) { c.drawImage(B, 0, 0); },
  // [Kurzgesagt]lensReveal Entering the lens: In A, the camera is advancing exponentially into a certain circle (eye/lens), and B is only exposed in this circle. As the circle advances, the circle grows to cover the screen, with a halo around the edge.
  //   o.lens(t) → {x, y, r} The circle on the screen (calculated by the camera of the previous lens, must be synchronized with the advancement of A); o.ring the halo color. The circle should cover the entire screen: advance multiple ≥ CAM.coverZoom(r).
  lensReveal(c, A, B, p, o) {
    const L = o.lens(o.t);
    c.drawImage(A, 0, 0);
    if (L.r < 1) return;
    c.save(); c.beginPath(); c.arc(L.x, L.y, L.r, 0, TAU); c.clip(); c.drawImage(B, 0, 0); c.restore();
    const ring = Math.max(3, L.r * 0.06), col = o.ring || [120, 240, 255], col2 = o.ring2 || [70, 230, 255];
    c.save(); c.strokeStyle = `rgba(${col},.85)`; c.lineWidth = ring; c.beginPath(); c.arc(L.x, L.y, L.r + ring / 2, 0, TAU); c.stroke();
    c.strokeStyle = `rgba(${col2},.25)`; c.lineWidth = ring * 3; c.beginPath(); c.arc(L.x, L.y, L.r + ring * 2, 0, TAU); c.stroke(); c.restore();
  },
  // [Kurzgesagt] matchCut is filled and then pulled out: A is pushed until a certain color block fills the screen, and B is pulled out from something of the same color; it only crosses and dissolves within o.at (default midpoint) ±o.width/2 (±3 frames). The colors on both sides are originally the same, and the cutting point is invisible.
  matchCut(c, A, B, p, o) {
    const w = o.width || 0.06, q = clamp((p - (o.at ?? 0.5) + w / 2) / w);
    if (q <= 0) { c.drawImage(A, 0, 0); return; }
    if (q >= 1) { c.drawImage(B, 0, 0); return; }
    c.drawImage(A, 0, 0); c.globalAlpha = q; c.drawImage(B, 0, 0); c.globalAlpha = 1;
  },
  // [storytime]whip: The old picture is thrown out at an accelerated speed, the new picture is thrown in at a reduced speed, and the entire screen is horizontally motion blurred in the middle (sampling ≤8px per picture, anything less will be read as an afterimage). o.dir=1 swing to the left
  whip(c, A, B, p, o) {
    const e = MO.expoInOut(p), dir = o.dir || 1, off = e * W * dir;
    const v = Math.max(0, 1 - Math.abs(p - 0.5) * 2.2);
    const n = 1 + Math.round(v * 40), spread = v * 320;
    for (let k = 0; k < n; k++) {
      const d = n === 1 ? 0 : (k / (n - 1) - 0.5) * spread * dir;
      c.globalAlpha = 1 / (k + 1) > 0.999 ? 1 : 1 / (k + 1);
      c.drawImage(A, -off + d, 0); c.drawImage(B, W * dir - off + d, 0);
    }
    c.globalAlpha = 1;
  },
  // [storytime] Smash: The first frame is a new picture, with 1.22x magnification from fierce to stop (spring, clamped at ≥1 anti-black border), and the first two frames flash white. For reaction close-up
  smash(c, A, B, p, o) {
    const lt = p * o.dur, s = Math.max(1, 1 + 0.22 * (1 - MO.springHz(lt, o.freq || 3, o.decay || 11)));
    c.save(); c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-W / 2, -H / 2); c.drawImage(B, 0, 0); c.restore();
    if (lt < 2 / 60) { c.fillStyle = 'rgba(255,255,255,0.55)'; c.fillRect(0, 0, W, H); }
  },
  // [Dynamic text] fillZoom rushes into the color block: the camera rushes into a certain shape in the old picture (o.cx, o.cy; the color of the shape o.fill = the background color of the new picture). After filling the screen, the new picture falls back from 1.25 to 1.
  //   Reveal point = o.k (default .55): starting point of stuck period = bar line − k×dur (MO.onBeat). o.maxZoom rushes into the multiple (exponential scaling itself is acceleration, don’t use expoIn)
  fillZoom(c, A, B, p, o) {
    const k = o.k || 0.55;
    if (p < k) { const q = Math.pow(p / k, 2.2), s = Math.pow(o.maxZoom || 40, q);
      c.save(); c.translate(o.cx, o.cy); c.scale(s, s); c.translate(-o.cx, -o.cy); c.drawImage(A, 0, 0); c.restore(); }
    else { const q = MO.expoOut((p - k) / (1 - k)), s = lerp(1.25, 1, q);
      c.fillStyle = o.fill || '#000'; c.fillRect(0, 0, W, H);
      c.save(); c.globalAlpha = clamp(q * 3); c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-W / 2, -H / 2); c.drawImage(B, 0, 0); c.restore(); }
  },
  // [Dynamic text] bands Color band erasure: o.colors Several diagonal color bands are swept across in succession (interval o.gap), and a new picture follows the last one. Uncovering point ≈ .6
  bands(c, A, B, p, o) {
    const cols = o.colors || ['#FFD23F', '#FF5A36', '#14213D'], n = cols.length, sk = H * 0.35, gap = o.gap || 0.13;
    const edge = q => lerp(-sk - 40, W + sk + 40, MO.expoInOut(clamp(q)));
    c.drawImage(A, 0, 0);
    const clipTo = x => { c.beginPath(); c.moveTo(-sk - 60, 0); c.lineTo(x + sk, 0); c.lineTo(x, H); c.lineTo(-sk - 60, H); c.closePath(); };
    for (let i = 0; i < n; i++) { const x = edge((p - i * gap) / (1 - (n - 1) * gap)); c.save(); clipTo(x); c.clip(); c.fillStyle = cols[i]; c.fillRect(0, 0, W, H); c.restore(); }
    const xb = edge((p - n * gap) / (1 - (n - 1) * gap));
    c.save(); clipTo(xb); c.clip(); c.drawImage(B, 0, 0); c.restore();
  },
  // [Dynamic text] push page: the new and old ones are panned together (expoInOut), like a camera sliding to the next piece on a long canvas. o.dir: 'left' (default) | 'up'. to 90% displacement at p≈.58
  push(c, A, B, p, o) {
    const e = MO.expoInOut(p);
    if (o.dir === 'up') { c.drawImage(A, 0, -e * H); c.drawImage(B, 0, H - e * H); }
    else { c.drawImage(A, -e * W, 0); c.drawImage(B, W - e * W, 0); }
  },
  // [3b1b / Finance] zoomThrough: the camera is pushed to (cx, cy), and a new picture grows "from inside" the object.
  //   o: {cx, cy, zoom, r0=object radius (circular opening; 0=no crop), live, bg, focus:[x,y] new screen subject position, bScale0, ease}
  //   live:true = The old lens will continue to push the camera during the transition (vector redraw, the lines will not be blurred; recommended); otherwise, A will be enlarged as a bitmap (above 10× will be blurred).
  //   When there is r0, the zoom must be ≥ CAM.coverZoom(r0, cx, cy) (≈1100/r0), otherwise the screen will not be covered from the beginning to the end, and the last frame will jump.
  zoomThrough(c, A, B, p, o) {
    const cx = o.cx, cy = o.cy, Z = o.zoom || 7, e = (o.ease || MO.smooth)(p);
    const sA = Math.pow(Z, e);
    c.fillStyle = o.bg || '#000'; c.fillRect(0, 0, W, H);
    c.save(); if (!o.live) { c.translate(cx, cy); c.scale(sA, sA); c.translate(-cx, -cy); }
    c.globalAlpha = 1 - (o.bScale0 ? seg(p, 0.5, 0.8) : o.r0 ? seg(p, 0.45, 0.8) : seg(p, 0.6, 0.95));   // The old picture outside the opening will be retired early, and there will be no afterimage when the title of the new shot comes out.
    c.drawImage(A, 0, 0); c.restore();
    c.save();
    if (o.r0) {
      const R = o.r0 * sA; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
      c.fillStyle = o.bg || '#000'; c.globalAlpha = seg(p, 0.18, 0.45); c.fillRect(0, 0, W, H);   // Across the surface of an object: the bright surface fades into the interior
    }
    // The new screen goes from "1/Z size, subject focus alignment (cx,cy)" to the original full screen; when there is no circular opening, use bScale0 (such as 0.6) starting from the larger size and melting in later, so as not to look like a floating small card
    const [fx, fy] = o.focus || [W / 2, H / 2], sB = o.bScale0 ? Math.pow(o.bScale0, 1 - e) : Math.pow(Z, e - 1);
    c.globalAlpha = o.r0 ? seg(p, 0.22, 0.55) : o.bScale0 ? seg(p, 0.45, 0.85) : seg(p, 0.25, 0.7);
    const m = MO.smooth(seg(e, 0.55, 1));                // Before the opening covers the whole screen, the subject stays in the center of the opening; it finally returns to its original position.
    c.translate(lerp(cx, fx, m), lerp(cy, fy, m)); c.scale(sB, sB); c.translate(-fx, -fy); c.drawImage(B, 0, 0);
    c.restore();
  },
  // [Conference] blurPush blur advancement: the old picture retreats (0.92) + blurs + darkens, the new picture drops from 1.06 with blur to 1.0 clear; place an enlarged old picture with heavy blur under it to prevent black edges
  blurPush(c, A, B, p) {
    const e = MO.appleOut(p);
    c.save(); c.filter = 'blur(30px)'; c.translate(W / 2, H / 2); c.scale(1.08, 1.08); c.translate(-W / 2, -H / 2); c.drawImage(A, 0, 0); c.restore();
    const draw = (img, s, blur, a) => { if (a <= 0) return; c.save(); c.globalAlpha = a; if (blur > 0.3) c.filter = `blur(${blur.toFixed(1)}px)`;
      c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-W / 2, -H / 2); c.drawImage(img, 0, 0); c.restore(); };
    draw(A, lerp(1, 0.92, e), 24 * e, 1 - seg(p, 0.2, 0.75));
    draw(B, lerp(1.06, 1, e), 24 * (1 - e), seg(p, 0.15, 0.7));
  },
  // [Conference] expandRect card expands to full screen (shared element): o.rect={x,y,w,h} is the screen rectangle of the card at the last frame of the previous shot, o.r rounded corners; the spring expands, a new picture is installed inside, and the old picture recedes and becomes dark.
  //   The first frame of the new image is loaded into the card opaquely (the hard cut inside the card is covered by the unfolding movement): any welding when the card is translucent will see the old and new layers stacked together.
  expandRect(c, A, B, p, o) {
    const e = MO.spring(p * (o.dur || 0.6), { duration: 0.55, bounce: 0 });
    const R = o.rect, x = lerp(R.x, 0, e), y = lerp(R.y, 0, e), w = lerp(R.w, W, e), h = lerp(R.h, H, e), r = lerp(o.r || 28, 0, e);
    c.save(); c.filter = 'blur(30px)'; c.translate(W / 2, H / 2); c.scale(1.08, 1.08); c.translate(-W / 2, -H / 2); c.drawImage(A, 0, 0); c.restore();
    c.save(); c.globalAlpha = 1 - 0.6 * e;
    const s = lerp(1, 0.94, e); c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-W / 2, -H / 2); c.drawImage(A, 0, 0); c.restore();
    c.save(); c.beginPath(); c.roundRect(x, y, w, h, r); c.clip();
    const k = Math.max(w / W, h / H); c.translate(x + w / 2, y + h / 2); c.scale(k, k); c.translate(-W / 2, -H / 2);
    c.drawImage(B, 0, 0); c.restore();
  },
  // [Finance] slidePush panel push horizontally: the new panel is pushed in from the right, the old panel is pushed out to the left (bezier .7,0,.2,1), a brand color vertical bar o.bar leads the way
  slidePush(c, A, B, p, o) {
    const e = MO.bezier(0.7, 0, 0.2, 1)(p), dx = -W * e;
    c.drawImage(A, dx, 0); c.drawImage(B, dx + W, 0);
    if (o.bar) { c.fillStyle = o.bar; c.fillRect(dx + W - 14, 0, 14, H); }
  },
  // [3b1b]fadeShift fade out and move up/fade in and move up (manim FadeOut(shift=UP) + FadeIn(shift=UP)), o.shift shifts pixels
  fadeShift(c, A, B, p, o) {
    const d = o.shift || 60, a = MO.smooth(seg(p, 0, 0.6)), b = MO.smooth(seg(p, 0.4, 1));
    c.fillStyle = o.bg || '#000'; c.fillRect(0, 0, W, H);
    c.save(); c.globalAlpha = 1 - a; c.drawImage(A, 0, -d * a); c.restore();
    c.save(); c.globalAlpha = b; c.drawImage(B, 0, d * (1 - b)); c.restore();
  },
});

// The project's own transition (transitions/<name>.js) can reuse these tools.
window.TR_UTIL = { once, seg, mkc };
})();
