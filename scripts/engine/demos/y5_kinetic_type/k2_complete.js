// K2 Phase 1 "Complete" (one measure = beats 4–7, 2.0–4.0s)
// In beat 4, the main word hits + giant "1" → In beat 4.5, the code card slides in and typing begins → In beat 5, the auxiliary sentence "it completes" rises, and in beat 5.25, "next line" →
// In the 6th shot, the gray completion flashes + the Tab key pops up → in the 6.5 shot, press Tab, the gray text becomes solid, and the "next line" is enlarged 1.35 times + highlighter (the words and the action say the same thing).
// Rework: The auxiliary sentence was originally produced on the 6th beat and contained 7 characters, but only 0.7s remained until it was covered by the ribbon; now it is pressed one beat ahead of time and contains 6 characters, and it can be read in 1.2s.
(() => {
const K = KT, C = K.C, b = K.b;
const { clamp } = U;
const MONO = 'Menlo';      // The code uses fixed width (rework: the first version used proportional fonts, unlike the code)
SCENES['k2_complete'] = {
  draw(c, lt, t) {
    c.fillStyle = C.coral; c.fillRect(0, 0, 1920, 1080);
    K.dots(c, t, C.white, 0.1);
    K.cam(c, t, c => {
      K.bigNum(c, t, '1', b(4), 1880, 1150, 'rgba(255,255,255,0.13)');
      TY.rise(c, 'Stage 01', 140, 250, MO.at(t, b(4), 0.3), { size: K.SZ.label, fam: 'PuHui-Bold', color: C.white, track: 6 });
      TY.underline(c, 140, 272, 170, MO.at(t, b(4.25), 0.3), C.white, 6);
      K.slam(c, 'Complete', 130, 600, t, b(4), { color: C.white, size: 180 });
      const sub = 'fills the ', key = 'next line', sw = TY.width(c, sub, K.SZ.sub, 'PuHui-Heavy'), kw = TY.width(c, key, K.SZ.sub, 'PuHui-Heavy');
      const ky = 775, kx = 150 + sw;
      TY.rise(c, sub, 140, ky, MO.at(t, b(5), 0.35), { size: K.SZ.sub, fam: 'PuHui-Heavy', color: C.white });
      const ksc = t >= b(6.5) ? 1 + 0.35 * MO.springHz(t - b(6.5), 2.5, 9) : 1;
      K.keyMarker(c, kx, ky, kw, K.SZ.sub, t, b(6.5), ksc, C.yellow);
      K.key(c, key, kx, ky, t, b(5.25), b(6.5), { size: K.SZ.sub, fam: 'PuHui-Heavy', color: t >= b(6.5) ? C.ink : C.white });
      // Code card: 4.5 beats slide in from right (expoOut 0.4s, starting point +700px, with 3.4° back to center)
      const pin = MO.expoOut(MO.at(t, b(4.5), 0.4));
      if (pin > 0) {
        const cx = 1010 + 700 * (1 - pin), cy = 330;
        c.save(); c.translate(cx, cy); c.rotate(0.06 * (1 - pin));
        c.fillStyle = 'rgba(0,0,0,0.18)'; c.beginPath(); c.roundRect(14, 18, 800, 330, 26); c.fill();
        c.fillStyle = C.code; c.beginPath(); c.roundRect(0, 0, 800, 330, 26); c.fill();
        ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(40 + i * 30, 40, 9, 0, Math.PI * 2); c.fill(); });
        const T = (s, x, y, col, a = 1) => TY.text(c, s, x, y, { size: 40, fam: MONO, color: col, align: 'left', alpha: a });
        T('1', 40, 130, '#555A72'); T('function hello() {', 96, 130, '#82AAFF');
        T('2', 40, 210, '#555A72');
        const typed = TY.typed('  const name =', MO.at(t, b(4.75), 0.5)); T(typed, 96, 210, '#E9ECF5');
        const tw = TY.width(c, typed, 40, MONO), acc = t >= b(6.5);
        // Completion: The entire gray text in the 6th shot flashes in frame 0 (completion originally appears instantly), and becomes solid color after pressing Tab
        if (t >= b(6)) T(" 'milo';", 96 + tw, 210, acc ? '#C3E88D' : 'rgba(233,236,245,0.35)');
        T('3', 40, 290, '#555A72'); if (acc) T('}', 96, 290, '#82AAFF', MO.at(t, b(6.6), 0.1));
        if (Math.floor(t * 4) % 2 === 0) { const cxr = 96 + tw + (acc ? TY.width(c, " 'milo';", 40, MONO) : 0); c.fillStyle = '#FFD23F'; c.fillRect(cxr + 4, 172, 5, 50); }
        c.restore();
      }
      // Tab keycap: Pop up at beat 6, press at 6.5 beats (14% compression, e^-18t rebound)
      const kp = MO.at(t, b(6), 0.3); if (kp > 0) {
        const press = t >= b(6.5) ? 1 - 0.14 * Math.exp(-(t - b(6.5)) * 18) : 1, s = MO.backOut(kp, 2.6) * press;
        c.save(); c.translate(1410, 790); c.scale(s, s);
        c.fillStyle = '#C24128'; c.beginPath(); c.roundRect(-130, -62, 260, 136, 22); c.fill();
        c.fillStyle = C.white; c.beginPath(); c.roundRect(-130, -76 + (1 - press) * 70, 260, 128, 22); c.fill();
        TY.text(c, 'TAB', 0, 12 + (1 - press) * 70, { size: 64, fam: 'PuHui-Black', color: C.coral });
        c.restore();
      }
    });
  },
};
})();
