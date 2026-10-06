// K1 title: "AI writes code" comes in two beats → "The 3 stages" falls on the third beat → The rest of the words quickly exit on the fourth beat, leaving only "3", and the camera rushes into the direction of 3.
// Slow entry (0.3–0.4s spring), fast exit (0.18s expoIn) – exiting faster than entering, the audience’s attention has already gone.
(() => {
const K = KT, C = K.C, b = K.b;
const { clamp, lerp } = U;
// Exit: 0.18s from t0, shrink to 0.6, drop 60px, transparent
const exitK = (t, t0) => MO.expoIn(clamp((t - t0) / 0.18));
SCENES['k1_title'] = {
  draw(c, lt, t) {
    c.fillStyle = C.yellow; c.fillRect(0, 0, 1920, 1080);
    K.dots(c, t, C.ink, 0.08);
    K.cam(c, t, c => {
      // Line 1: AI | Writing code
      const s1 = 245, wAI = TY.width(c, 'AI', s1), wCode = TY.width(c, 'codes', s1), gap = 50, x0 = 960 - (wAI + gap + wCode) / 2, y1 = 470;
      const ex = [exitK(t, 1.45), exitK(t, 1.48), exitK(t, 1.51), exitK(t, 1.54)];
      // AI: Beat 0 comes in, with a rotation of -8° → 0° back to normal
      if (t >= 0) { const k = MO.springHz(t, 2.2, 10), e = ex[0];
        TY.text(c, 'AI', x0, y1 + 60 * e, { size: s1, align: 'left', color: C.ink, scale: lerp(1.7, 1, k) * (1 - 0.4 * e), rot: -0.14 * (1 - k), alpha: clamp(t / 0.06) * (1 - e), ox: x0 + wAI / 2, oy: y1 - s1 * 0.36 }); }
      // Write code: Beat 1 rises from the slot (mask), 0.35s expoOut
      { const e = ex[1]; c.save(); c.globalAlpha = 1 - e; c.translate(0, 60 * e);
        TY.rise(c, 'codes', x0 + wAI + gap, y1, MO.at(t, b(1), 0.35), { size: s1, color: C.ink }); c.restore(); }
      // The second line: ｜ (3) ｜ stages, center of circle (960, 773) - transition rushes in from here
      const cy = 773, r = 165;
      const pc = MO.at(t, b(2), 0.42);
      if (pc > 0) {
        const k = MO.backOut(pc, 3.0) * (t > b(3) ? 1 + 0.12 * MO.expoOut(clamp((t - b(3)) / 0.2)) : 1);
        c.save(); c.translate(960, cy); c.scale(k, k); c.rotate(0.25 * (1 - MO.expoOut(pc)));
        c.fillStyle = C.coral; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
        TY.text(c, '3', 0, 92, { size: 270, color: C.white });
        c.restore();
      }
      { const e = ex[2]; TY.text(c, 'in', 960 - r - 40, cy + 40 + 60 * e, { size: 120, fam: 'PuHui-Heavy', align: 'right', color: C.ink, alpha: MO.at(t, b(1.75), 0.08) * (1 - e) }); }
      { const e = ex[3]; c.save(); c.globalAlpha = 1 - e; c.translate(0, 60 * e);
        TY.rise(c, 'stages', 960 + r + 40, cy + 52, MO.at(t, b(2.25), 0.35), { size: 150, fam: 'PuHui-Heavy', color: C.ink }); c.restore(); }
    });
  },
};
})();
