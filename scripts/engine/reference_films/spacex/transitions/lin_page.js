// The page turning transition of the commentator version (lin): the commentator and the top column are drawn on the overlay of the entire film and do not participate in the transition - only "this page" is changed.
// There are four types of registrations for one file (load it first in SCENE_LIBS of eras_lin.js):
//   lin_page = Alias ​​of lin_slide (entry automatically loaded by file name)
//   lin_slide slides the entire page: o.dir 'left' (default) / 'up' / 'right'; the edge of the new page has a paper card projection
//   lin_iris circular expansion revealed: o.x, o.y circle center (picture coordinates), o.col circle edge ribbon color
//   lin_wipe oblique color ribbon sweep: o.cols ribbon color (2–3 strips), o.dir 1 from left to right / -1 from right to left
//   lin_flip flips the paper card around the vertical axis (retreat → flip → return to full screen), o.bg is the background color exposed when flipping the card
// p=0 is consistent with the old picture, p=1 is consistent with the new picture pixel by pixel.
(() => {
const W = 1920, H = 1080, INK = '#2B2A33';
const cl = x => Math.max(0, Math.min(1, x));
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

TRANSITIONS.lin_slide = (c, A, B, p, o) => {
  if (p <= 0) { c.drawImage(A, 0, 0); return; } if (p >= 1) { c.drawImage(B, 0, 0); return; }
  const e = ease(cl(p)), dir = o.dir || 'left';
  const [dx, dy] = dir === 'up' ? [0, -H] : dir === 'right' ? [W, 0] : [-W, 0];
  const ax = dx * e, ay = dy * e, bx = ax - dx, by = ay - dy;
  c.drawImage(A, ax, ay);
  c.save(); c.fillStyle = 'rgba(43,42,51,0.16)';                       // The projection of the new page on top of the old page
  if (dir === 'up') c.fillRect(0, by - 14, W, 14); else if (dir === 'right') c.fillRect(bx + W, 0, 18, H); else c.fillRect(bx - 18, 0, 18, H);
  c.restore();
  c.drawImage(B, bx, by);
};
TRANSITIONS.lin_page = TRANSITIONS.lin_slide;

TRANSITIONS.lin_iris = (c, A, B, p, o) => {
  if (p <= 0) { c.drawImage(A, 0, 0); return; } if (p >= 1) { c.drawImage(B, 0, 0); return; }
  const x = o.x ?? W / 2, y = o.y ?? H / 2, Rmax = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 60;
  const e = p < 0.5 ? 0.5 * Math.pow(2 * p, 2.2) : 1 - 0.5 * Math.pow(2 - 2 * p, 1.6), R = Rmax * e, band = 34 * (1 - e * 0.4);
  c.drawImage(A, 0, 0);
  c.save(); c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.clip(); c.drawImage(B, 0, 0); c.restore();
  c.save(); c.lineWidth = band; c.strokeStyle = o.col || '#FFD447'; c.beginPath(); c.arc(x, y, R + band / 2, 0, Math.PI * 2); c.stroke();
  c.lineWidth = 5; c.strokeStyle = INK; c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(x, y, R + band, 0, Math.PI * 2); c.stroke(); c.restore();
};

TRANSITIONS.lin_wipe = (c, A, B, p, o) => {
  if (p <= 0) { c.drawImage(A, 0, 0); return; } if (p >= 1) { c.drawImage(B, 0, 0); return; }
  const cols = o.cols || ['#FFD447', '#4C8DF6'], d = o.dir || 1, sl = 420, bw = 150, n = cols.length;
  const span = W + sl + bw * n + 40, e = ease(cl(p)), lead = -sl - bw * n + span * e;   // The left side of the first ribbon (from left to right)
  const quad = (x0, x1) => { c.beginPath(); c.moveTo(x0 + sl, 0); c.lineTo(x1 + sl, 0); c.lineTo(x1, H); c.lineTo(x0, H); c.closePath(); };
  const flip = d < 0;
  c.save(); if (flip) { c.translate(W, 0); c.scale(-1, 1); }
  // New Page: Behind the Ribbon
  c.save(); c.beginPath(); c.moveTo(-sl - 10, 0); c.lineTo(lead + sl, 0); c.lineTo(lead, H); c.lineTo(-sl - 10, H); c.closePath(); c.clip();
  if (flip) { c.translate(W, 0); c.scale(-1, 1); } c.drawImage(B, 0, 0); c.restore();
  c.save(); c.beginPath(); c.moveTo(lead + bw * n + sl, 0); c.lineTo(W + sl + 10, 0); c.lineTo(W + sl + 10, H); c.lineTo(lead + bw * n, H); c.closePath(); c.clip();
  if (flip) { c.translate(W, 0); c.scale(-1, 1); } c.drawImage(A, 0, 0); c.restore();
  for (let i = 0; i < n; i++) { const x0 = lead + i * bw; quad(x0, x0 + bw); c.fillStyle = cols[n - 1 - i]; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); }
  c.restore();
};

// lin_zoom push through: the old page zooms in and fades out with (o.x,o.y) as the center, the new page zooms in from 0.86 times to full screen (the commentator and the top bar do not move)
TRANSITIONS.lin_zoom = (c, A, B, p, o) => {
  if (p <= 0) { c.drawImage(A, 0, 0); return; } if (p >= 1) { c.drawImage(B, 0, 0); return; }
  const e = ease(cl(p)), x = o.x ?? W / 2, y = o.y ?? H / 2;
  c.fillStyle = o.bg || '#F8F2E6'; c.fillRect(0, 0, W, H);
  const za = 1 + 2.2 * e, zb = 0.86 + 0.14 * e;
  c.save(); c.globalAlpha = 1 - cl(e * 1.6); c.translate(x, y); c.scale(za, za); c.translate(-x, -y); c.drawImage(A, 0, 0); c.restore();
  c.save(); c.globalAlpha = cl((e - 0.25) / 0.6); c.translate(W / 2, H / 2); c.scale(zb, zb); c.translate(-W / 2, -H / 2); c.drawImage(B, 0, 0); c.restore();
};
TRANSITIONS.lin_flip = (c, A, B, p, o) => {
  if (p <= 0) { c.drawImage(A, 0, 0); return; } if (p >= 1) { c.drawImage(B, 0, 0); return; }
  const e = ease(cl(p)), ang = e * Math.PI, s = 1 - 0.24 * Math.sin(Math.PI * e);
  const front = ang < Math.PI / 2, img = front ? A : B, a = front ? ang : ang - Math.PI;
  const cs = Math.cos(a), sn = Math.sin(a), dist = 2600, N = 120, sw = W / N;
  c.fillStyle = o.bg || '#F8F2E6'; c.fillRect(0, 0, W, H);
  const proj = u => { const f = dist / (dist + u * sn); return [W / 2 + u * cs * f * s, f]; };
  const [xl, fl] = proj(-W / 2), [xr, fr] = proj(W / 2), k = Math.sin(Math.PI * e);
  c.save(); c.globalAlpha = 0.16 * k; c.fillStyle = INK;
  c.beginPath(); c.moveTo(xl + 14, H / 2 - H * fl * s / 2 + 22); c.lineTo(xr + 14, H / 2 - H * fr * s / 2 + 22); c.lineTo(xr + 14, H / 2 + H * fr * s / 2 + 22); c.lineTo(xl + 14, H / 2 + H * fl * s / 2 + 22); c.closePath(); c.fill(); c.restore();
  for (let i = 0; i < N; i++) {
    const [x0, f0] = proj(-W / 2 + i * sw), [x1, f1] = proj(-W / 2 + (i + 1) * sw);
    const h = H * (f0 + f1) / 2 * s, lo = Math.min(x0, x1), w = Math.abs(x1 - x0) + 0.8;
    if (w < 0.85) continue;
    c.drawImage(img, i * sw, 0, sw, H, lo, H / 2 - h / 2, w, h);
  }
  c.save(); c.globalAlpha = k; c.strokeStyle = INK; c.lineWidth = 5; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(xl, H / 2 - H * fl * s / 2); c.lineTo(xr, H / 2 - H * fr * s / 2); c.lineTo(xr, H / 2 + H * fr * s / 2); c.lineTo(xl, H / 2 + H * fl * s / 2); c.closePath(); c.stroke(); c.restore();
};
})();
