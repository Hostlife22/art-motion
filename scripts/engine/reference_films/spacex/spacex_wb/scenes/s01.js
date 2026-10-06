// S01 · Opening hook (left half of row A, x 0–4000). There are already "2008" and three Falcon 1s on the board at frame 0, and the first one has been crossed out in orange (conflict comes first);
// The pen then crossed off the second and third coins → "Three consecutive defeats" → Money bag → Arrow → The fourth "last shot" → 9.28 → It lifted off and entered orbit "It's done";
// The long orange arrow "18 years later" leads the camera to the right → 9.28 "same day" → 2026, the earth, and the starship orbit; finally zoom out, the pen draws a timeline from 2002 to 2026 underneath, and "24 years" pops up.
WB.chapter('s01', id => {
  const q = k => WB.q(id, k), { OR, INK } = WB, D = WB.D;
  const BASE = 860, RH = 420;
  // ----Drawed before frame 0 (conflict at the beginning)----
  WB.at(-6);
  WB.text('2008', 120, 330, 180, { dur: 0.6 });
  const RX = [215, 395, 575];
  RX.forEach(x => WB.sk(D.falcon1(RH), x, BASE));
  WB.sk(D.cross(150), RX[0], BASE - RH * 0.5);
  ['2006', '2007', '2008.8'].forEach((y, i) => WB.text(y, RX[i], BASE + 92, 46, { align: 'center', dur: 0.2 }));
  WB.at(0.5); WB.text('Year', 120 + WB.measure('2008', 180), 330, 180, { dur: 0.36 });
  // ---- Cross off the second and third coins ----
  WB.at(0.2); WB.sk(D.cross(150), RX[1], BASE - RH * 0.5, { speed: 1500 });   // Frame 0 is clean: it takes 0.2 seconds for the hand to come in from the lower right and fork the second shot.
  WB.go(q('losing streak') - 0.05); WB.sk(D.cross(150), RX[2], BASE - RH * 0.5, { speed: 2600 });
  WB.go(q('three times') - 0.05); WB.text('Lost three times in a row', 700, 700, 108, { col: OR, rate: 9 });
  WB.figure(905, 880, 150, [[0, 'stand'], [WB.cur + 0.3, 'head']], { speed: 5200, w: 6 });   // A little man holding his head
  // ---- There is only enough money for one last shot ----
  WB.go(q('money') + 0.15);
  WB.sk(D.bag(220), 1280, 650, { speed: 3400 }); WB.hatchCircle(1280, 690, 72, { gap: 19, speed: 26000 });   // Money bag: orange diagonal lines (no third color required)
  WB.text('$', 1280 - 26, 735, 110, { dur: 0.14 });
  WB.go(q('at last') + 0.05); WB.text('last shot', 1250, 430, 92, { col: OR, rate: 12, align: 'center' });
  WB.arrow([1405, 650], [1545, 650], { head: 26 });
  WB.sk(D.falcon1(RH), 1660, BASE, { speed: 4200 });
  // ---- On September 28, that one was completed ----
  WB.go(q('September') + 0.25); WB.text('9.28', 1790, 760, 140, { rate: 10 });
  const EX = 2060, EY = 250, ER = 70;
  WB.go(WB.cur + 0.02); WB.sk(D.earth(ER), EX, EY, { speed: 3400 });
  const orb = WB.ell(EX, EY, 135, 46, Math.PI, 1.0, -0.12, 48);
  WB.line(orb, { col: OR, w: 4.5, speed: 5000, smooth: false });
  // The fourth shot: The rocket stays in place, and the pen draws an orange arc from the arrow to the orbit of the small Earth; a small rocket appears on the orbit and keeps going around.
  const tL = Math.max(WB.cur + 0.02, q('That shot') + 0.02), tA = tL + 0.5;
  const P = WB.prep(D.falcon1(RH)), FL = WB.prep([{ p: [[-14, 2], [0, 70], [14, 2]], o: 1, w: 0.9 }]);
  WB.line(WB.quad([1660, BASE - RH * 1.2], [1700, 330], [EX - 132, EY + 22], 30), { col: OR, w: 5, t0: tL, dur: tA - tL, smooth: false, handed: false });
  WB.custom({ t0: tA, t1: tA + 0.2, bb: [EX - 200, EY - 120, EX + 200, EY + 120], draw(g, qq, t) {
    const w = (t - tA) * 2.2 + Math.PI * 0.92, x = EX + Math.cos(w) * 135 * 0.993 - Math.sin(w) * 46 * -0.12, y = EY + Math.cos(w) * 135 * -0.12 + Math.sin(w) * 46, a = w + Math.PI, s = 0.3 * MO.backOut(qq, 2);
    WB.drawPrep(g, FL, x, y, s, a, 0.7 + 0.3 * Math.sin(t * 40)); WB.drawPrep(g, P, x, y, s, a); return null; } });
  WB.at(q('It’s done') - 0.1); WB.sk(D.check(110), 1930, 470, { speed: 2600 });
  WB.pop('It’s done', 2090, 520, 110, { at: q('It’s done') + 0.2, rot: -0.08 });
  // ---- Exactly 18 years later on the same day ----
  WB.go(q('full') + 0.05);
  WB.arrow([2130, 712], [2660, 668], { col: OR, bend: -40, w: 7, head: 34, speed: 2600 });
  WB.text('18 years later', 2390, 620, 84, { align: 'center', rate: 14 });
  WB.go(q('same day') - 0.25); WB.text('9.28', 2800, 700, 140, { rate: 12 });
  WB.line([[2790, 730], [2960, 736], [3110, 728]], { col: OR, w: 7, speed: 4000 }); WB.line([[2800, 748], [2960, 754], [3100, 746]], { col: OR, w: 6, speed: 4500 });
  WB.pop('same day', 2955, 850, 84, { at: q('same day') + 0.55 });
  // ---- The starship entered Earth orbit for the first time ----
  WB.go(q('starship') - 0.15); WB.text('2026', 2780, 320, 180, { rate: 11 });
  const SX = 3700, SY = 590, SR = 165;
  WB.go(q('Enter') - 0.3); WB.sk(D.earth(SR), SX, SY, { speed: 3600 });
  const RX2 = 300, RY2 = 98, ROT = -0.18;
  WB.line(WB.ell(SX, SY, RX2, RY2, Math.PI * 0.9, 1.03, ROT, 64), { col: OR, w: 5, speed: 6000 });
  const SP = WB.prep(D.starship(270, 'full'), 6.5);
  const tS = WB.cur;
  WB.custom({ t0: tS, t1: tS + 0.35, bb: [SX - 420, SY - 300, SX + 420, SY + 300], draw(g, qq, t) {
    const w = (t - tS) * 0.9 + Math.PI * 1.05, x0 = Math.cos(w) * RX2, y0 = Math.sin(w) * RY2, c = Math.cos(ROT), s = Math.sin(ROT);
    const x = SX + x0 * c - y0 * s, y = SY + x0 * s + y0 * c, a = Math.atan2(Math.cos(w) * RY2, -Math.sin(w) * RX2) + ROT + Math.PI / 2;
    const front = Math.sin(w) > -0.15;   // Being blocked by the earth when turning behind it
    if (!front) { g.beginPath(); g.rect(-1e5, -1e5, 2e5, 2e5); g.arc(SX, SY, SR + 4, 0, Math.PI * 2, true); g.clip(); }
    WB.drawPrep(g, SP, x, y, 1, a, MO.smooth(qq));
    return null; } });
  WB.at(q('Earth') + 0.1); WB.text('Starship in orbit', SX, 340, 84, { align: 'center', col: OR, rate: 12 });
  // ---- Two minutes, 24 years after watching it: zoom out, timeline ----
  WB.go(q('two minutes') + 0.25);
  // A timeline spanning the entire block: 2002 and 2026 are written on both ends, with an orange brace covering the entire paragraph, and "24 years" is written on the tip of the bracket (no middle scale is marked to prevent the rocket from standing on a certain year)
  const TY = 1062, X0 = 130, X1 = 3860, XM = (X0 + X1) / 2;
  WB.text('2002', X0 - 30, TY + 30, 92, { align: 'right', rate: 26 });
  WB.line([[X0, TY], [X1, TY]], { speed: 7600, w: 7 });
  [X0, X1].forEach(x => WB.line([[x, TY - 26], [x, TY + 26]], { smooth: false, speed: 3000, min: 0.03 }));
  WB.text('2026', X1 + 30, TY + 30, 92, { rate: 26 });
  const br = []; for (let i = 0; i <= 60; i++) { const u = i / 60, k = Math.abs(u - 0.5) * 2; br.push([X0 + 10 + (X1 - X0 - 20) * u, TY - 30 - 22 * (1 - Math.pow(k, 8)) - (k < 0.04 ? 26 * (1 - k / 0.04) : 0)]); }
  WB.line(br, { col: OR, w: 7, dur: 0.28 });
  WB.pop('24 years', XM, TY - 92, 140, { at: Math.max(WB.cur + 0.3, q('24 years') + 0.2) });
  // ---- camera ----
  const T = WB.T0(id) + TIMING.seg[id].dur;
  WB.cam0(...WB.fit(-7, q('money'), { zmax: 1.15 }));
  WB.shot(q('money') - 0.15, 0.9, q('money'), q('September'));
  WB.move(q('September') - 0.05, q('September') + 0.4, 1950, 720, 1.75, { ease: MO.cubicInOut });   // Close-up: The tip of the pen writes "9.28"
  WB.shot(q('That shot') - 0.3, 0.6, q('money'), q('full'), { ease: MO.cubicInOut });
  WB.shot(q('full') - 0.05, 1.15, q('full'), q('two minutes'));
  WB.shot(q('two minutes') + 0.05, 0.95, -7, T, { zmax: 0.6, pad: 60, sy: 430, declip: false });
});
const clamp01 = x => Math.max(0, Math.min(1, x));
SCENES['s01'] = WB.scene;
