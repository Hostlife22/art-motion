// S04 · NASA contract and Dragon spacecraft (middle row B, x 3650–6000). An orange arrow "Three months later" is drawn to lead the camera to the right;
// A contract (NASA is written on the top) → the word "1.6 billion U.S. dollars" pops up and a line is drawn → a cargo box flies to the space station along the dotted line ("delivery");
// The camera moves to the right again: "2012" → The Dragon spacecraft flies along the dotted line to dock with the space station → "The first private spacecraft", "the first" is surrounded by an orange circle.
WB.chapter('s04', id => {
  const q = k => WB.q(id, k), { OR, INK } = WB, D = WB.D, Y = v => WB.ROW.B + v;
  // ---- Three months later ----
  WB.go(q('three months later') - 0.3);
  WB.arrow([3640, Y(760)], [4060, Y(700)], { col: OR, bend: -30, w: 7, head: 30, speed: 2600 });
  WB.text('three months later', 3850, Y(820), 64, { align: 'center', rate: 12 });
  // ---- NASA gave it a contract ----
  const DX = 4300, DY = Y(450);
  WB.go(q('NASA') + 0.1); WB.sk(D.doc(300), DX, DY, { speed: 3000 });
  WB.go(q('contract') + 0.05); WB.text('NASA', DX, Y(275), 76, { align: 'center', rate: 14 }); WB.text('2008.12', DX, Y(668), 46, { align: 'center', rate: 24 });
  // ---- US$1.6 billion ----
  WB.pop('$1.6 billion', 4780, Y(500), 140, { at: q('Dollar') + 0.05 });
  WB.go(q('Dollar') + 0.2); WB.line([[4510, Y(530)], [4780, Y(540)], [5050, Y(526)]], { col: OR, w: 8, speed: 3600 });
  // ---- Delivery to the space station ----
  const IX = 5450, IY = Y(560), IS = 540;
  WB.go(q('To the space station') - 0.1); WB.sk(D.iss(IS), IX, IY, { speed: 9000, min: 0.014, gap: 0.006 });
  WB.go(q('deliver goods') - 0.3); WB.sk(D.box(100), 4330, Y(760), { speed: 5200 });
  const port = WB.issPort(IX, IY, IS);
  const bx0 = [4400, Y(730)], bx1 = [port[0] - 10, port[1] + 30];
  WB.line(WB.quad(bx0, [4900, Y(820)], bx1, 30), { col: INK, w: 3.5, speed: 6000, smooth: false });
  WB.text('deliver goods', 4870, Y(840), 60, { align: 'center', rate: 18 });
  // ---- In 2012, the Dragon spacecraft became the first private spacecraft to visit the International Space Station ----
  WB.go(q('2012') + 0.25); WB.text('2012', 4720, Y(240), 120, { rate: 10 });
  const CW = 100, CP = WB.prep(D.dragon(CW, { trunk: true }), 5.5);
  const c0 = [4950, Y(830)], c1 = [5330, Y(870)], cEnd = [port[0], port[1] + CW * 1.2];
  const cz = u => [(1 - u) ** 2 * c0[0] + 2 * u * (1 - u) * c1[0] + u * u * cEnd[0], (1 - u) ** 2 * c0[1] + 2 * u * (1 - u) * c1[1] + u * u * cEnd[1]];
  const path = []; for (let i = 0; i <= 30; i++) path.push(cz(i / 30)); const pc = DG.cum(path);
  const tF0 = q('Dragon spacecraft') - 0.05, tF1 = q('first ship') + 0.15;
  WB.custom({ t0: tF0, t1: tF1, bb: [4800, Y(380), 5500, Y(950)], draw(g, qq, t) {
    const e = MO.sineInOut(qq), [x, y] = cz(e), [x2, y2] = cz(Math.min(1, e + 0.02));
    g.strokeStyle = OR; g.lineWidth = 4; DG.drawPartial(g, path, pc, pc[pc.length - 1] * e); g.setLineDash([]);
    const a = qq < 0.98 ? Math.atan2(y2 - y, x2 - x) + Math.PI / 2 : 0;
    WB.drawPrep(g, CP, x, y, 1, U.lerp(a, 0, MO.smooth(U.clamp((qq - 0.55) / 0.45))));
    if (qq >= 1) { const k = U.clamp((t - tF1) / 0.5); if (k < 1) { g.strokeStyle = OR; g.lineWidth = 4; g.globalAlpha = 1 - k; for (let i = 0; i < 5; i++) { const an = -0.3 + i * 0.6 + Math.PI * 0, r0 = 30 + 40 * k; g.beginPath(); g.moveTo(port[0] + Math.cos(an) * r0, port[1] + Math.sin(an) * r0); g.lineTo(port[0] + Math.cos(an) * (r0 + 26), port[1] + Math.sin(an) * (r0 + 26)); g.stroke(); } } }
    return null; } });
  WB.go(q('first ship') + 0.08);
  WB.text('first ship', 5250, Y(300), 84, { col: OR, rate: 9 });
  WB.line(WB.ell(5250 + WB.measure('first ship', 84) / 2, Y(270), WB.measure('first ship', 84) * 0.62, 66, -2.9, 1.07, 0, 44), { col: OR, w: 6, speed: 4200 });
  WB.text('Dragon spacecraft', 5370, Y(790), 58, { align: 'right', rate: 14 });
  WB.go(q('private spaceship') + 0.05); WB.text('private spaceship', 5250 + WB.measure('first ship', 84) + 14, Y(300), 84, { rate: 10 });
  // ---- camera ----
  const t0 = WB.T0(id), T = t0 + TIMING.seg[id].dur;
  WB.shot(q('three months later') - 0.6, 0.8, t0, q('To the space station'));
  WB.shot(q('To the space station') - 0.15, 0.75, q('NASA'), q('2012'));
  WB.shot(q('2012') - 0.05, 0.85, q('To the space station'), T, { add: [[cEnd[0] - 60, cEnd[1] - 60, cEnd[0] + 60, cEnd[1] + 60]] });
});
SCENES['s04'] = WB.scene;
