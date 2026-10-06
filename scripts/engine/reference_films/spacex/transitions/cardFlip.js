// Turn over the card (S10 Ukiyo-e → S11 commentator-style financial explanation): The entire painting in the previous paragraph retreats into a paper card, and is turned around the vertical axis.
// On the back is an off-white information page. After flipping through the cards, the screen returns to full size. Perspective is sliced ​​by vertical strips: each strip is scaled in height according to depth (camera distance d), and the plane is changed by 90°.
// Parameters: o.bg The background color exposed when turning over the card (default is off-white for S11). p=0 is consistent with the old picture, p=1 is consistent with the new picture pixel by pixel.
(() => {
const W = 1920, H = 1080;
TRANSITIONS.cardFlip = (c, A, B, p, o) => {
  const e = MO.cubicInOut(U.clamp(p)), ang = e * Math.PI;
  const s = 1 - 0.24 * Math.sin(Math.PI * e);                 // The cards move away when turned over
  const front = ang < Math.PI / 2, img = front ? A : B, a = front ? ang : ang - Math.PI;
  const cs = Math.cos(a), sn = Math.sin(a), d = 2600, N = 120, sw = W / N;
  c.fillStyle = o.bg || '#F7F0E1'; c.fillRect(0, 0, W, H);
  const proj = u => { const f = d / (d + u * sn); return [W / 2 + u * cs * f * s, f]; };
  const [xl, fl] = proj(-W / 2), [xr, fr] = proj(W / 2);
  const k = Math.sin(Math.PI * e);                            // The edge and shadow of the card only appear during the turning process.
  if (k < 0.002) { c.drawImage(img, 0, 0); return; }         // Do not slice at both ends to avoid resampling.
  if (k > 0.001) {                                         // Soft shadow falling on the paper
    c.save(); c.globalAlpha = 0.16 * k; c.fillStyle = '#2B2A33';
    c.beginPath(); c.moveTo(xl + 14, H / 2 - H * fl * s / 2 + 22); c.lineTo(xr + 14, H / 2 - H * fr * s / 2 + 22);
    c.lineTo(xr + 14, H / 2 + H * fr * s / 2 + 22); c.lineTo(xl + 14, H / 2 + H * fl * s / 2 + 22); c.closePath(); c.fill(); c.restore();
  }
  for (let i = 0; i < N; i++) {
    const [x0, f0] = proj(-W / 2 + i * sw), [x1, f1] = proj(-W / 2 + (i + 1) * sw);
    const h = H * (f0 + f1) / 2 * s, lo = Math.min(x0, x1), w = Math.abs(x1 - x0) + 0.8;
    if (w < 0.85) continue;
    c.drawImage(img, i * sw, 0, sw, H, lo, H / 2 - h / 2, w, h);
  }
  if (k > 0.001) {                                            // Paper card stroke (dark line for flat infographic)
    c.save(); c.globalAlpha = k; c.strokeStyle = '#2B2A33'; c.lineWidth = 5; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(xl, H / 2 - H * fl * s / 2); c.lineTo(xr, H / 2 - H * fr * s / 2);
    c.lineTo(xr, H / 2 + H * fr * s / 2); c.lineTo(xl, H / 2 + H * fl * s / 2); c.closePath(); c.stroke(); c.restore();
  }
};
})();
