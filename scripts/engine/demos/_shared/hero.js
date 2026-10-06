// y1/y2/y3 The image of Milo in the three demonstration films. window.HERO_MODE = 'C' (default) | 'A' | 'rig'.
//   C Each film is native (used in the demo film): Each style uses gpt-image to generate a set picture (Kurzgesagt flat without strokes / Vox reuses the Kurzgesagt picture converted to grayscale as a clipping sticker /
//     whiteboard marker line drawing) and place it at demos/_shared/hero/. This is a clear exception to the main line of "pure code drawing" - the characters are textures and the rest of the screen is code.
//   A Minimalist Geometry: Q version of pure code drawing (dark curls + yellow jacket + small teal backpack), each piece is colored/lined according to the drawing method of the piece. Don't cut it when you don't want to use the texture.
//   Rig old skeleton: FK characters of lib/rig_milo.js (fallback branches in each film).
// (During the experiment, there was also direction B "G2 Picture Book Frame Library", which required 24 frames and was not included in the skill.)
(() => {
const { clamp, lerp } = U;
const H = window.HERO = {};
const MODE = () => window.HERO_MODE || 'C';
H.mode = MODE;
const PNG = n => `demos/_shared/hero/${n}.png`;
window.EXTRA_ASSETS = (window.EXTRA_ASSETS || []).concat(['c1_0', 'c1_1', 'c1_2', 'c3_line'].map(PNG));
const img = p => window.IMG[p];

// Put a picture at (x, y) according to the "center of the sole", height h; face=-1 flip horizontally
const place = (c, im, x, y, h, face = 1, anchorY = 0.97) => {
  const w = im.width * h / im.height; c.save(); c.translate(x, y); if (face < 0) c.scale(-1, 1); c.drawImage(im, -w / 2, -h * anchorY, w, h); c.restore();
};

// ---------- A: Minimalist Geometry Q version ----------
// Origin = the ground between the two feet; unit height 1 ≈ body height; opt.style: 'flat' (no stroke, one shade darker of the same color) | 'line' (black line on white background) | 'print' (flat painting + thin black line)
H.geo = (c, x, y, h, { face = 1, t = 0, style = 'flat', point = true, ink = '#1d1b19' } = {}) => {
  const s = h / 100; c.save(); c.translate(x, y); c.scale(face * s, s);
  const bob = Math.sin(t * 6.5) * 0.8;
  const line = style !== 'flat', lw = style === 'line' ? 2.2 : 1.4;
  const P = { skin:'#ffd8bd', skinSh:'#f2b493', tee:'#f5c542', teeSh:'#daa62d', shorts:'#24354c', shortsSh:'#16253b', shoe:'#fff8e8', hair:'#38271f', eye:'#211b17', pack:'#287b7c', packSh:'#185d60', strap:'#795438', cheek:'rgba(255,128,120,.45)' };
  if (style === 'line') { for (const key of ['skin','skinSh','tee','teeSh','shorts','shortsSh','shoe','pack','packSh','strap']) P[key]='#fbfbf8'; }
  // Flat faceting: first lay one level deeper, then move the original color 2.5 units to the upper left and cover it back, leaving a shadow band on the lower right (same trick as Y1's flat)
  const shape = (path, fill, sh) => { if (sh && sh !== fill) { c.save(); c.clip(path); c.fillStyle = sh; c.fill(path); c.translate(-2.5, -2); c.fillStyle = fill; c.fill(path); c.restore(); } else { c.fillStyle = fill; c.fill(path); } if (line) { c.strokeStyle = ink; c.lineWidth = lw; c.stroke(path); } };
  const rr = (x0, y0, w, hh, r) => { const p = new Path2D(); p.roundRect(x0, y0, w, hh, r); return p; };
  const el = (cx, cy, rx, ry) => { const p = new Path2D(); p.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); return p; };
  c.lineJoin = 'round'; c.lineCap = 'round';
  // Long navy trousers and cream sneakers.
  for (const lx of [-7,7]) { shape(rr(lx-3,-14,6,12,3),P.shorts,P.shortsSh); shape(el(lx+2.5,-2,7.5,4),P.shoe); }
  shape(rr(-18,-46,36,21,7),P.pack,P.packSh);
  c.translate(0, bob);
  shape(rr(-12, -26, 24, 13, 4), P.shorts, P.shortsSh);                      // Trouser waistband
  // Distal arm (natural drop, jacket sleeve)
  shape(rr(-15, -42, 6, 16, 3), P.tee, P.teeSh); shape(el(-12,-25,3.4,3.4),P.skin);
  shape(rr(-14, -46, 28, 22, 7), P.tee, P.teeSh);
  shape(rr(-9,-44,3,17,1),P.strap); shape(rr(6,-44,3,17,1),P.strap);
  c.strokeStyle=ink; c.lineWidth=0.8; c.beginPath(); c.moveTo(0,-44); c.lineTo(0,-26); c.stroke();                            // Jacket zipper
  // Near arm: pointed forward (point) or drooping
  if (point) { c.save(); c.translate(10, -42); c.rotate(-1.35 + Math.sin(t * 3.4) * 0.06); shape(rr(-3.2, 0, 6.4, 20, 3.2), P.tee, P.teeSh); shape(el(0, 21, 3.6, 3.6), P.skin); c.restore(); }
  else { shape(rr(9, -42, 6, 16, 3), P.tee, P.teeSh); shape(el(12,-25,3.4,3.4),P.skin); }
  // Head: Large round face (head-to-body ratio approximately 1:1.2). The front is easier to draw and easier to recognize than the side: dark curls, two ears and uncovered eyes
  c.translate(0, -66); c.rotate(Math.sin(t * 2.1) * 0.03);
  for (const ex of [-19, 19]) shape(el(ex, 4, 3.6, 4.6), P.skin, P.skinSh);   // Ear
  shape(el(0, 2, 19, 18.5), P.skin, P.skinSh);                               // Face
  // Dark curls remain recognizable in flat, print and outline styles.
  for (const [cx,cy,r] of [[-15,-9,8],[-11,-18,9],[-2,-22,10],[8,-21,9],[16,-14,8]]) shape(el(cx,cy,r,r),style==='line'?'#fbfbf8':P.hair);
  const blink = (t % 3.2) > 3.08;
  c.fillStyle=P.eye;
  for (const ex of [-7.5,7.5]) { if(blink) c.fillRect(ex-2.2,3,4.4,1.1); else { c.beginPath(); c.ellipse(ex,3.4,2.1,3,0,0,Math.PI*2); c.fill(); } }
  c.fillStyle = P.cheek; for (const ex of [-11, 11]) { c.beginPath(); c.ellipse(ex, 10.5, 3.2, 1.9, 0, 0, 7); c.fill(); }
  const m = 0.4 + 0.6 * Math.max(0, Math.sin(t * 9));                       // Mouth: Open and close when speaking
  c.fillStyle = '#c4473f'; c.beginPath(); c.ellipse(0, 12.5, 2.8, 0.9 + 1.7 * m, 0, 0, 7); c.fill();
  c.restore();
};

// ---------- Access points for each slice ----------
// Y1 Mirror 3: Milo stands on the left side of the grass slope and points to the black cat (sole of the foot (470,900), whole body about 440px)
H.y1 = (g, ft, flatFn) => {
  const m = MODE();
  if (m === 'A') return H.geo(g, 470, 900, 440, { face: 1, t: ft, style: 'flat' });
  if (m === 'C') {
    // Three postures in a profile are used as three key frames: waving when pulling out → pointing to the black cat when scanning → raising hands and cheering after the label pops up.
    // When changing positions, give a 0.12s squeeze rebound (108% overshoot of the Kurzgesagt pop-up), and breathe with the soles of your feet as the axis when standing.
    const l = ft - Y1.SHOTS.s3[0], k = l < 1.25 ? 1 : l < 2.3 ? 0 : 2, t0 = [0, 1.25, 2.3][[1, 0, 2].indexOf(k)];
    const pop = l - t0 < 0.14 && t0 > 0 ? 1 + 0.06 * Math.sin((l - t0) / 0.14 * Math.PI) : 1;
    const br = 1 + 0.012 * Math.sin(ft * 5.2);
    g.save(); g.translate(470, 905); g.scale(1 / Math.sqrt(br * pop), br * pop); place(g, img(PNG('c1_' + k)), 0, 0, 450, 1); g.restore(); return;
  }
  return false;
};
// Y2 Mirror 3: Paper-cut stickers, draw into sp (then add white edges and shadows uniformly), soles of feet (1500,1040), facing left
H.y2 = (g, st) => {
  const m = MODE();
  if (m === 'A') return H.geo(g, 1500, 1040, 560, { face: -1, t: st, style: 'print', ink: '#171716' }), true;
  if (m === 'C') { const k = Math.floor(st * 12); g.save(); g.translate(1500, 1015); g.rotate(((k * 7919) % 13 - 6) * 0.0012); g.filter = 'grayscale(1) contrast(1.25) brightness(1.04)'; place(g, img(PNG('c1_0')), 20, 8, 520, -1); g.restore(); return true; }   // Convert cartoon frames to grayscale and use as clipping stickers: press 12fps with slight shaking (freeze feeling)
  return false;
};
// Y3 Mirror 3: The painting revealed by zigzag strokes (world coordinates, sole (fx, fy), height hh)
H.y3 = (g, fx, fy, hh, ft) => {
  const m = MODE();
  if (m === 'A') return H.geo(g, fx, fy, hh, { face: 1, t: ft, style: 'line', ink: '#0A0503' }), true;
  if (m === 'C') { g.save(); g.globalCompositeOperation = 'multiply'; place(g, img(PNG('c3_line')), fx, fy + 4, hh * 1.08, 1); g.restore(); return true; }
  return false;
};
})();
