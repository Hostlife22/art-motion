// S02 · Creation and Goals (right half of row A, x 4300–6800). The starting point is the mixed version S02: "2002" → stickman "Musk" → arrow → "SpaceX";
// The camera moves smoothly to the right: "Target" → Earth → The small rocket drags an orange dotted line and flies towards a planet with orange lines → A small house is inserted on the planet (this house will appear again on Mars at the end of the film).
WB.chapter('s02', id => {
  const q = k => WB.q(id, k), { OR, INK, SPEED } = WB, D = WB.D, X = 4360, lerp = U.lerp;
  // ----Draw a long orange road from "2002" in the S01 timeline, and lead the camera with the pen to "2002" on the right side of row A ----
  const tR0 = Math.max(WB.cur, WB.q('s01', '24 years') + 0.6);
  WB.at(tR0); WB.line(WB.ell(40, 1067, 140, 62, 0.4, 1.0, 0, 40), { col: OR, w: 6, speed: 4200 });
  const road = [...WB.dense([[-100, 1072], [-130, 1010], [-130, 900], [-130, 60]], 10), ...WB.quad([-130, 60], [-130, -80], [40, -80], 10).slice(1), ...WB.dense([[40, -80], [4440, -80]], 30).slice(1), ...WB.quad([4440, -80], [4560, -78], [4570, 60], 10).slice(1), [4572, 250]];
  const rd = WB.line(road, { col: OR, w: 8, dur: 0.95, dash: [1, 15], amp: 1.0 });
  WB.line([[4542, 216], [4572, 256], [4602, 216]], { col: OR, w: 7, smooth: false, speed: 2600 });
  const tRe = rd.t1;
  // The camera follows the pen: zooming in from the panorama, chasing along the road (with motion blur), and finally landing on the "2002" area
  const rp = u => DG.pointAt(rd.pts, rd.cum, rd.len * MO.sineInOut(u));
  WB.move(rd.t0 - 0.05, rd.t0 + 0.25, ...(([x, y]) => [x + 700, y + 250])(rp(0.2)), 0.55, { ease: MO.cubicIn });
  WB.move(rd.t0 + 0.25, rd.t0 + 0.62, ...(([x, y]) => [x, y + 300])(rp(0.7)), 0.55, { whip: true, ease: MO.linear });
  WB.texts.push('');
  // ---- First piece ----
  WB.go(q('2002') + 0.14); WB.text('2002', 260 + X, 380, 150, { rate: 11 });
  WB.go(q('Musk') - 0.3);
  WB.figure(430 + X, 790, 330, [[0, 'stand'], [q('Musk') + 0.5, 'wave'], [q('SpaceX') + 0.1, 'point']], { speed: 3000 });
  WB.text('Musk', 430 + X, 875, 66, { align: 'center', rate: 16 });
  WB.go(q('SpaceX') - 0.25);
  WB.arrow([548 + X, 620], [722 + X, 616], { head: 30 });
  WB.text('SpaceX', 768 + X, 650, 128, { rate: 18 });
  WB.line([[772 + X, 690], [960 + X, 700], [1150 + X, 688]], { col: OR, w: 9, speed: SPEED * 1.6 });
  // ---- Second block ----
  WB.go(q('Target') + 0.3); WB.text('Target', 1440 + X, 330, 118, { col: OR, rate: 11 });
  const EX = 1560 + X, EY = 640;
  WB.sk(D.earth(140), EX, EY, { speed: 3600 });
  const P0 = [EX + 95, 545], P1 = [2000 + X, 250], P2 = [2300 + X, 470];
  const bez = u => [lerp(lerp(P0[0], P1[0], u), lerp(P1[0], P2[0], u), u), lerp(lerp(P0[1], P1[1], u), lerp(P1[1], P2[1], u), u)];
  const pts = []; for (let i = 0; i <= 60; i++) pts.push(bez(i / 60));
  const cum = DG.cum(pts), L = cum[cum.length - 1];
  const R = WB.prep([{ p: [[0, -38], [10, -28], [14, 4], [14, 22], [-14, 22], [-14, 4], [-10, -28], [0, -38]] }, { p: [[-14, 8], [-26, 26], [-14, 22]] }, { p: [[14, 8], [26, 26], [14, 22]] }], 5);
  const fly0 = Math.max(WB.cur + 0.05, q('one day') + 0.2), fly1 = fly0 + 1.05;
  WB.custom({ t0: fly0, t1: fly1, handed: false, bb: [P0[0] - 60, 180, P2[0] + 60, 620], draw(g, qq, t) {
    const e = MO.sineInOut(qq), d = L * e;
    g.strokeStyle = OR; g.lineWidth = 6; DG.drawPartial(g, pts, cum, Math.max(0, d - 40)); g.setLineDash([]);
    const [x, y] = DG.pointAt(pts, cum, d), [x2, y2] = DG.pointAt(pts, cum, Math.min(L, d + 2)), a = Math.atan2(y2 - y, x2 - x) || 0.3;
    if (qq >= 1) { g.lineWidth = 6; g.beginPath(); g.moveTo(x - Math.cos(a - 0.5) * 30, y - Math.sin(a - 0.5) * 30); g.lineTo(x, y); g.lineTo(x - Math.cos(a + 0.5) * 30, y - Math.sin(a + 0.5) * 30); g.stroke(); }
    else { WB.drawPrep(g, R, x, y, 1, a + Math.PI / 2); g.fillStyle = OR; g.translate(x, y); g.rotate(a + Math.PI / 2); g.beginPath(); g.moveTo(-8, 26); g.lineTo(0, 46 + 6 * Math.sin(t * 40)); g.lineTo(8, 26); g.closePath(); g.fill(); }
    return null; } });
  WB.at(Math.max(fly0 + 0.55, q('other planet') + 0.05));
  const MX = 2420 + X, MY = 500, MR = 112;
  WB.line(WB.circ(MX, MY, MR, 1.04, Math.PI), { w: 7, speed: SPEED * 1.3 });
  WB.hatchCircle(MX, MY, MR, { gap: 21, ang: -Math.PI / 4 });
  WB.go(q('live in') + 0.62);
  WB.sk(D.house(84), MX, 394, { speed: 3000 });
  WB.text('other planet', MX, 690, 66, { align: 'center', rate: 20 });
  // ---- Camera: S01 Zoom out → plunge into the first block → pan to the second block → zoom out slightly ----
  const t0 = WB.T0(id), mv0 = Math.max(q('Target') - 0.15, t0 + 2.4), out0 = t0 + TIMING.seg[id].dur - 1.05;
  const T = t0 + TIMING.seg[id].dur;
  WB.shot(tRe - 0.3, 0.6, tRe + 0.1, q('Target'), { zmax: 1.12, ease: MO.cubicOut, add: [[4530, 200, 4620, 300]] });
  WB.shot(mv0, 0.8, q('Target'), T, { zmax: 1.1 });
  WB.shot(out0, 0.6, t0, T, { zmax: 0.85 });
});
SCENES['s02'] = WB.scene;
