// S05 · First stage recovery and missed approach (right section of line B, x 6350–8750). "Flight Diagram" on the whiteboard:
// Falcon 9 → An orange dotted line goes all the way up, and a star is drawn at the separation point → An orange revolving arrow circles back to the ground ("Fly back and reuse");
// "2015.12" → The first level turned around from the separation point along the swing line, ignited, deployed the landing legs, landed vertically on the circular landing point, and drew radial lines → "First time!";
// The camera moves right to "2017" → The same first stage is moved along an orange arc to the second launch pad, marked "Same", and ignited again.
WB.chapter('s05', id => {
  const q = k => WB.q(id, k), { OR, INK } = WB, D = WB.D, Y = v => WB.ROW.B + v;
  const G = Y(800), RX = 6580, RH = 560;
  WB.lead([6000, Y(320)], [6450, Y(300)], q('What next?') - 0.12 - 0.62, 0.5);   // The lead and the camera move at the same time: the pen leads the camera, and the writing begins at the moment it is placed.
  WB.go(q('What next?') - 0.12);
  const f9 = WB.sk(D.falcon9(RH, {}), RX, G, { speed: 3400, w: 6 });
  WB.line([[6370, G], [8730, G]], { speed: 9000, w: 6, nofit: true });
  WB.text('Falcon 9', RX - 60, Y(650), 50, { align: 'right', rate: 20 }); WB.text('First flight in 2010', RX - 60, Y(715), 44, { align: 'right', rate: 24 });
  // Ascending trajectory + separation point
  const SEP = [7130, Y(150)];
  WB.go(q('Level 1') - 0.2);
  WB.line(WB.quad([RX, G - RH - 20], [RX + 60, Y(120)], SEP, 26), { col: OR, w: 5, speed: 4200, smooth: false });
  WB.sk([{ p: [[-26, 0], [26, 0]], smooth: false }, { p: [[0, -26], [0, 26]], smooth: false }, { p: [[-18, -18], [18, 18]], smooth: false }, { p: [[18, -18], [-18, 18]], smooth: false }], SEP[0], SEP[1], { col: OR, w: 4.5, speed: 3000 });
  WB.arrow(SEP, [7500, Y(70)], { col: OR, bend: 10, head: 22, w: 5 });   // Level 2 continues up
  // Swingline: separation point → U-turn → fall back to landing point
  const LX = 7070, ret = [...WB.quad(SEP, [7370, Y(150)], [7250, Y(330)], 18), ...WB.quad([7250, Y(330)], [LX + 10, Y(480)], [LX, G - 24], 24).slice(1)];
  WB.go(q('fly back') - 0.1);
  WB.line(ret, { col: OR, w: 6, speed: 3600, smooth: false });
  const e = ret[ret.length - 1], p = ret[ret.length - 4], an = Math.atan2(e[1] - p[1], e[0] - p[0]);
  WB.line([[e[0] - Math.cos(an - 0.5) * 28, e[1] - Math.sin(an - 0.5) * 28], e, [e[0] - Math.cos(an + 0.5) * 28, e[1] - Math.sin(an + 0.5) * 28]], { col: OR, w: 6, smooth: false, speed: 2600 });
  WB.go(q('reuse') + 0.05); WB.text('Fly back and reuse', 7410, Y(330), 66, { col: OR, rate: 12 });
  // ---- December 2015 ----
  WB.go(q('2015') + 0.28); WB.text('2015.12', 6130, Y(440), 100, { rate: 11 });
  WB.line(WB.ell(LX, G + 4, 120, 26, Math.PI, 1.03, 0, 40), { w: 5, speed: 5200 });
  // The first level comes back along the swing line: first go small and far, then turn around, and finally land vertically and with the landing legs extended.
  const BH = 380, Bp0 = WB.prep(D.falcon9(BH, { stage: 'booster', legs: 0, fins: 1 }), 5.5), Bp1 = WB.prep(D.falcon9(BH, { stage: 'booster', legs: 1, fins: 1 }), 5.5);
  const FL = WB.prep([{ p: [[-16, 2], [0, 80], [16, 2]], o: 1, w: 0.9 }], 5.5);
  const rc = DG.cum(ret), RL = rc[rc.length - 1];
  const tR0 = q('Falcon 9') - 0.1, tR1 = q('fall back') + 0.32;
  let landed = null;
  WB.custom({ t0: tR0, t1: tR1, bb: [6850, Y(40), 7550, G + 60], draw(g, qq, t) {
    const u = MO.sineInOut(qq), d = RL * u, [x, y] = DG.pointAt(ret, rc, d), [x2, y2] = DG.pointAt(ret, rc, Math.min(RL, d + 4));
    const s = U.lerp(0.32, 1, MO.smooth(U.clamp((qq - 0.25) / 0.65)));
    const dir = Math.atan2(y2 - y, x2 - x) + Math.PI / 2, a = qq < 0.55 ? dir + Math.PI : U.lerp(dir + Math.PI, 0, MO.smooth(U.clamp((qq - 0.55) / 0.35)));
    const leg = U.clamp((qq - 0.82) / 0.14), P = leg > 0.5 ? Bp1 : Bp0, by = y + 40 * (1 - s);
    if (qq < 1) { if (qq > 0.5) WB.drawPrep(g, FL, x, by, s, a, (0.7 + 0.3 * Math.sin(t * 43)) * (1 - U.clamp((qq - 0.97) / 0.03)));
      WB.drawPrep(g, P, x, by, s, a); }
    if (qq >= 1) { const k = U.clamp((t - tR1) / 0.6); g.globalAlpha = 1 - k; g.strokeStyle = INK; g.lineWidth = 4; for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + sx * (60 + i * 26 + k * 40), G - 10 - i * 6, 10 + i * 4, Math.PI, Math.PI * 2); g.stroke(); } }
    return null; } });
  // After landing: Radiation + "For the first time!"
  WB.go(q('first time') - 0.55);
  [[-1, -0.2], [-0.8, -0.75], [0, -1], [0.8, -0.75], [1, -0.2]].forEach(([dx, dy]) => WB.line([[LX + dx * 150, G - BH * 0.55 + dy * 230], [LX + dx * 210, G - BH * 0.55 + dy * 300]], { col: OR, w: 6, speed: 3000, min: 0.03, gap: 0.01, smooth: false }));
  WB.text('orbital rocket', 7490, Y(470), 60, { rate: 14, t0: q('track') + 0.05 });
  WB.pop('First time!', 7480, Y(590), 120, { at: q('first time') + 0.3, align: 'left' });
  // ---- In 2017, the recycled first level flew into the sky again ----
  const P2X = 8150;
  WB.go(q('2017') + 0.28); WB.text('2017', 7850, Y(230), 110, { rate: 10 });
  WB.go(q('recycled') - 0.05);
  WB.arrow([LX + 110, Y(700)], [P2X - 110, Y(700)], { col: OR, bend: -40, head: 24, w: 5 });
  WB.text('The same one', (LX + P2X) / 2, Y(775), 58, { align: 'center', rate: 12, col: OR });
  WB.line(WB.ell(P2X, G + 4, 110, 24, Math.PI, 1.03, 0, 40), { w: 5, speed: 5200 });
  const b2 = WB.sk(D.falcon9(BH, { stage: 'booster', legs: 1, fins: 1 }), P2X, G - 24, { speed: 5200, w: 5.5 });
  const tUp = Math.max(WB.cur + 0.05, q('fly up') - 0.1), tUp1 = tUp + 1.7;
  b2.forEach(s => (s.until = tUp));
  WB.custom({ t0: tUp, t1: tUp1, bb: [P2X - 200, Y(-700), P2X + 200, G + 60], draw(g, qq, t) {
    const x = P2X, y = G - 24 - 1300 * MO.cubicIn(qq), fa = 1 - U.clamp((t - tUp1) / 0.5); if (fa <= 0) return null;
    g.globalAlpha = fa; g.strokeStyle = OR; g.lineWidth = 4.5; g.beginPath(); g.moveTo(x, G - 8); g.lineTo(x, Math.max(y + 80, G - 900)); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    if (qq < 1) { WB.drawPrep(g, FL, x, y, 1, 0, 0.75 + 0.25 * Math.sin(t * 43)); WB.drawPrep(g, Bp1, x, y, 1, 0); }
    return null; } });
  // The still version of the one that landed on the ground: landed → before being moved away
  WB.custom({ t0: tR1, t1: tR1 + 0.01, bb: [LX - 200, G - BH - 60, LX + 200, G + 60], draw(g, qq, t) { WB.drawPrep(g, Bp1, LX, G - 24, 1, 0); return null; } });
  // ---- camera ----
  const t0 = WB.T0(id);
  const T = t0 + TIMING.seg[id].dur;
  WB.shot(q('What next?') - 0.12 - 0.62, 0.6, t0, q('2015'), { add: [[RX - 50, G - 40, LX + 150, G + 40]] });
  WB.shot(q('2015') - 0.1, 0.8, t0, q('2017'), { zmax: 1.1, add: [[7450, Y(450), 8000, Y(600)]] });
  WB.shot(q('2017') - 0.25, 0.8, q('2015'), T, { add: [[LX - 150, G - BH - 40, P2X + 150, G + 40]] });
});
SCENES['s05'] = WB.scene;
