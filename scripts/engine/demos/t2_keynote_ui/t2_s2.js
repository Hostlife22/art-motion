// t2 · Shot 2 (3.0s): Three frosted glass function cards enter the 3D space (spring, bounce 0.15, staggered 0.1s), and rotate around the Y axis;
// The numbers on the cards count; the whole group continues to float; the light sweeps across the three cards; finally the middle card is "selected" (enlarged, the others recede and dim), and then expands with shared elements.
(() => {
const { clamp, lerp } = U;
const W = 1920, H = 1080;
const CW = 480, CH_ = 580, GAP = 52, CY = 560, R = 36;
const CARDS = [
  { icon: 'wave', title: 'Live voice', desc: 'Interrupt and ask naturally', num: 320, dec: 0, unit: 'ms', label: 'end-to-end latency' },
  { icon: 'memory', title: 'Lasting memory', desc: 'Remembers your preferences', num: 1, dec: 0, unit: 'M', label: 'context tokens' },
  { icon: 'agent', title: 'Agent tasks', desc: 'Plans, uses tools, delivers', num: 87, dec: 0, unit: '%', label: 'Task completion rate' },
];
const DUR = 3.0, FOCUS = 2.15;                         // From 2.15s onwards the middle card is selected
// The state of each card at lt moment (screen center, rotation, scaling, transparency), the transition also uses the final rectangle of the middle card
const state = (i, lt, t) => {
  const t0 = 0.05 + i * 0.1;                           // Staggered by 0.1s
  const sp = MO.spring(lt - t0, { duration: 0.75, bounce: 0.15 });
  const f = MO.smooth(MO.seg(lt, FOCUS, FOCUS + 0.6));
  const floatAmp = lerp(1, i === 1 ? 0 : 0.6, f);      // The selected card stops floating, allowing the transition to unfold from a stable rectangle
  const cx = 960 + (i - 1) * (CW + GAP) + (i - 1) * 40 * f;
  const cy = CY + (1 - sp) * 170 + MO.float(t, 7, 3.4 + i * 0.45, i * 2) * floatAmp;
  const ry = (1 - sp) * (i - 1 || 0.001) * -0.55 + 0.06 * Math.sin(t * 0.9 + i) * floatAmp + (i - 1) * 0.12 * f;
  const sc = (0.9 + 0.1 * sp) * (i === 1 ? lerp(1, 1.06, f) : lerp(1, 0.94, f));
  const a = clamp((lt - t0) / 0.25) * (i === 1 ? 1 : lerp(1, 0.45, f));
  return { cx, cy, ry, sc, a, t0 };
};
const cardRectAt = (lt, t) => { const s = state(1, lt, t); return { x: s.cx - CW * s.sc / 2, y: s.cy - CH_ * s.sc / 2, w: CW * s.sc, h: CH_ * s.sc }; };

SCENES['t2_s2'] = {
  cardRectAt, CW, CH: CH_,
  draw(c, lt, t) {
    t += T2.PHASE;
    const bgc = UI.scratch('t2bg', W, H), bgx = bgc.getContext('2d');
    T2.bg(bgx, t); c.drawImage(bgc, 0, 0);
    const bd = UI.backdrop(bgc, { blur: 40, key: 't2bd' });
    // Draw the two sides first and then the middle (the middle is stuck on the top layer)
    [0, 2, 1].forEach(i => {
      const S = state(i, lt, t); if (S.a <= 0) return;
      const d = CARDS[i], cw = CW * S.sc, ch = CH_ * S.sc;
      // Card texture: frosted glass (sampling background according to the screen position of the card) + content
      const tex = UI.scratch('t2card' + i, CW + 120, CH_ + 120), g = tex.getContext('2d'); g.reset();
      const ox = 60, oy = 60;
      UI.glass(g, { x: ox, y: oy, w: CW, h: CH_, r: R, bd, sample: { x: S.cx - cw / 2, y: S.cy - ch / 2, w: cw, h: ch }, tint: 0.075, stroke: 0.2, light: 0.14, shadow: false });
      g.save(); g.translate(ox, oy);
      // Icon bottom: concentric fillet (child fillet = parent fillet − padding)
      const pad = 44; g.fillStyle = 'rgba(255,255,255,0.09)'; g.beginPath(); g.roundRect(pad, pad, 96, 96, R - 14); g.fill();
      UI.icon(g, d.icon, pad + 48, pad + 48, 60, '#f2f2f7', t);
      g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      g.font = `600 50px ${T2.ZH}`; g.fillStyle = '#f5f5f7'; g.fillText(d.title, pad, 230);
      g.font = `400 28px ${T2.ZH}`; g.fillStyle = 'rgba(235,235,245,0.62)'; g.fillText(d.desc, pad, 278);
      // divider
      g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(pad, 330, CW - pad * 2, 1.5);
      // Large numbers: count from 0.25s to 0.9s after the card settles (easeOutExpo, the last one slowly settles), and the equal-width arrangement does not shake
      const v = TY.count(lt, S.t0 + 0.35, 0.9, 0, d.num);
      g.font = `600 132px ${T2.SANS}`; T2.track(g, 132, -0.03); g.fillStyle = '#ffffff';
      const nw = TY.tabular(g, TY.fmt(v, d.dec), pad, 488);
      g.letterSpacing = '0px'; g.font = `500 52px ${T2.SANS}`; g.fillStyle = 'rgba(235,235,245,0.7)'; g.fillText(d.unit, pad + nw + 10, 488);
      g.font = `400 28px ${T2.ZH}`; g.fillStyle = 'rgba(235,235,245,0.55)'; g.fillText(d.label, pad, 535);
      g.restore();
      // Light sweep: 1.2–2.0s sweeps the entire group from left to right (each card counts its progress according to its own screen position, and it looks like the same light)
      const sp = MO.seg(lt, 1.15, 2.05), gx = lerp(-200, W + 200, sp), lx = (gx - (S.cx - cw / 2)) / cw;
      if (sp > 0 && sp < 1) UI.sheen(g, UI.rrPath(ox, oy, CW, CH_, R), clamp((lx + 0.35) / 1.7), { x0: ox, x1: ox + CW, width: 110, angle: -0.35, alpha: 0.22 });
      // Shadow (size after screen projection) + perspective map
      c.save(); c.globalAlpha = S.a;
      UI.shadow(c, S.cx - cw / 2 + 10, S.cy - ch / 2 + 20, cw - 20, ch - 20, R, { blur: 80, oy: 40, alpha: 0.55 });
      UI.persp(c, tex, { cx: S.cx, cy: S.cy, w: (CW + 120) * S.sc, h: (CH_ + 120) * S.sc, ry: S.ry, persp: 1800, strip: 3, shade: 0.4 });
      c.restore();
    });
  },
};
})();
