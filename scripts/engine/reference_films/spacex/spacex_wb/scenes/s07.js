// S07 · Crew Dragon (middle row C, x 2800–5000). "May 2020" → A large capsule of the Crew Dragon spacecraft, with an opaque helmet (two astronauts) in each of the two portholes →
// It flies along the dotted line to dock with the small space station in the upper right corner; the camera moves to the right: a timeline from 2011 to 2020, with an orange bracket "near 9 years" popping up in the middle.
// In 2020, a small rocket took off from the "homeland"; at the end, it popped up "for the first time" with the words "A private company's spacecraft sends people into orbit."
WB.chapter('s07', id => {
  const q = k => WB.q(id, k), { OR, INK } = WB, D = WB.D, Y = v => WB.ROW.C + v;
  WB.lead([2420, Y(600)], [2950, Y(620)], q('2020') - 0.12 - 0.62, 0.5);   // The lead and the camera move at the same time: the pen leads the camera, and the writing begins at the moment it is placed.
  WB.go(q('2020') - 0.12); WB.text('May 2020', 2820, Y(250), 120, { rate: 10 });
  const CX = 3100, CY = Y(760), CW = 250;
  WB.go(q('manned') - 0.05);
  const cap = WB.sk(D.dragon(CW, {}), CX, CY, { speed: 3400, w: 7 });
  WB.go(q('two') - 0.1); WB.figure(CX + 210, CY, 150, [[0, 'stand'], [q('astronaut') + 0.3, 'wave'], [q('space station') + 0.2, 'stand'], [q('USA') + 0.1, 'wave']], { helmet: true, speed: 3800, w: 6 }); WB.figure(CX + 300, CY, 150, [[0, 'stand'], [q('astronaut') + 0.5, 'cheer'], [q('space station') + 0.4, 'stand']], { helmet: true, speed: 3800, w: 6 });
  WB.text('two astronauts', CX + 255, CY + 80, 58, { align: 'center', rate: 12 });
  // Space station + fly over and dock
  const IX = 3720, IY = Y(310), IS = 380;
  WB.go(q('send to') - 0.1); WB.sk(D.iss(IS), IX, IY, { speed: 7000, w: 5.5 });
  const port = WB.issPort(IX, IY, IS), SC = WB.prep(D.dragon(70, {}), 5);
  const p0 = [CX + 60, CY - CW * 1.0], p1 = [CX + 420, Y(560)], p2 = [port[0], port[1] + 70 * 0.95];
  const bz = u => [(1 - u) ** 2 * p0[0] + 2 * u * (1 - u) * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * u * (1 - u) * p1[1] + u * u * p2[1]];
  const path = []; for (let i = 0; i <= 30; i++) path.push(bz(i / 30)); const pc = DG.cum(path);
  const tF0 = q('space station') - 0.25, tF1 = tF0 + 0.95;
  WB.custom({ t0: tF0, t1: tF1, bb: [CX, Y(200), IX + 260, Y(760)], draw(g, qq, t) {
    const e = MO.sineInOut(qq), [x, y] = bz(e), [x2, y2] = bz(Math.min(1, e + 0.02));
    g.strokeStyle = OR; g.lineWidth = 4; DG.drawPartial(g, path, pc, pc[pc.length - 1] * e); g.setLineDash([]);
    const a = U.lerp(Math.atan2(y2 - y, x2 - x) + Math.PI / 2, 0, MO.smooth(U.clamp((qq - 0.5) / 0.5)));
    WB.drawPrep(g, SC, x, y, 1, qq >= 1 ? 0 : a); return null; } });
  WB.text('space station', IX + 70, Y(505), 56, { rate: 14, t0: Math.max(tF1 - 0.1, WB.cur + 0.02) });
  // ----After nearly 9 years, the United States is sending people to heaven again from its homeland ----
  const L0 = 3650, L1 = 4700, LY = Y(760);
  WB.go(q('USA') + 0.15);
  WB.line([[L0, LY], [L1, LY]], { speed: 6000, w: 6 });
  [L0, L1].forEach(x => WB.line([[x, LY - 24], [x, LY + 24]], { smooth: false, speed: 3200, min: 0.03 }));
  WB.text('2011', L0, LY + 80, 60, { align: 'center', rate: 30 });
  WB.text('2020', L1, LY + 80, 60, { align: 'center', rate: 30 });
  // Braces (opening facing down)
  WB.go(q('time lapse') - 0.05);
  const br = []; const bw = L1 - L0 - 40, bx = L0 + 20, by = LY - 40;
  for (let i = 0; i <= 40; i++) { const u = i / 40, x = bx + bw * u, k = Math.abs(u - 0.5) * 2, y = by - 22 * (1 - Math.pow(k, 6)) - (u > 0.47 && u < 0.53 ? 24 * (1 - Math.abs(u - 0.5) / 0.03) : 0); br.push([x, y]); }
  WB.line(br, { col: OR, w: 6, speed: 4400 });
  const p9 = WB.pop('nearly 9 years', (L0 + L1) / 2, LY - 110, 104, { at: Math.max(WB.cur + 0.3, q('nearly 9 years') + 0.25) }); WB.at(p9.t1 + 0.03);
  // These idle years: a spider web hanging under the timeline (it has been idle for too long)
  { const cx = (L0 + L1) / 2 - 260, cy = LY + 6, R = 70; const web = [];
    for (let k = 0; k < 5; k++) { const a = Math.PI * (0.1 + k * 0.2); web.push({ p: [[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], w: 0.45, smooth: false }); }
    for (const r of [0.35, 0.7]) web.push({ p: Array.from({ length: 5 }, (_, k) => { const a = Math.PI * (0.1 + k * 0.2); return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r]; }), w: 0.45, smooth: false });
    web.push({ p: [[cx + 30, cy], [cx + 30, cy + 95]], w: 0.4, smooth: false }, { p: WB.circ(cx + 30, cy + 104, 9, 1.05), w: 0.7 });
    WB.sk(web, 0, 0, { speed: 9000, w: 5 }); }
  // 2020 Over There: Homegrown Launch
  WB.go(q('local') - 0.1); WB.text('local', L1 + 70, LY - 30, 58, { rate: 12 });
  const RP = WB.prep(D.falcon9(260, { payload: 'dragon' }), 5), FL = WB.prep([{ p: [[-10, 2], [0, 56], [10, 2]], o: 1, w: 0.9 }], 5);
  const tU = q('Heaven') - 0.4;
  const r0 = WB.sk(D.falcon9(260, { payload: 'dragon' }), L1, LY - 8, { speed: 5600, w: 5 });
  WB.go(tU); r0.forEach(s => (s.until = tU));
  WB.custom({ t0: tU, t1: tU + 1.3, bb: [L1 - 120, Y(-600), L1 + 120, LY + 20], draw(g, qq, t) {
    const y = LY - 8 - 900 * MO.cubicIn(qq), fa = 1 - U.clamp((t - tU - 1.3) / 0.5); if (fa <= 0) return null;
    g.globalAlpha = fa; g.strokeStyle = OR; g.lineWidth = 4; g.beginPath(); g.moveTo(L1, LY - 10); g.lineTo(L1, Math.max(y + 60, LY - 700)); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    if (qq < 1) { WB.drawPrep(g, FL, L1, y, 1, 0, 0.75 + 0.25 * Math.sin(t * 43)); WB.drawPrep(g, RP, L1, y, 1, 0); } return null; } });
  // ---- It is also the first time that a private company's spacecraft has sent people into orbit ----
  WB.pop('first', 4220, Y(290), 120, { at: q('first') + 0.2, rot: -0.04 });
  WB.go(q('private company') + 0.05); WB.text('Private company\'s spaceship', 4220, Y(395), 64, { align: 'center', rate: 9 });
  WB.go(q('Send people in') + 0.05); WB.text('Send people into orbit', 4220, Y(480), 64, { align: 'center', rate: 9 });
  // ---- camera ----
  const t0 = WB.T0(id);
  const T = t0 + TIMING.seg[id].dur;
  WB.shot(q('2020') - 0.12 - 0.62, 0.6, t0, q('USA'), { dx: 130 });   // Go 130 more: the thread in the previous section is completely out of the picture
  WB.shot(q('USA') - 0.2, 0.8, q('USA'), q('Too'), { add: [[IX - 200, IY - 170, IX + 200, IY + 120]] });
  WB.shot(q('first') - 0.3, 0.7, q('USA'), T, { add: [[4000, Y(240), 4450, Y(340)]] });
});
SCENES['s07'] = WB.scene;
