// S03 · Falcon 1 "Breaking Through" (slow push + highlight section): ① Large Falcon 1 unveiled, name tag ② Four launch pads lined up: August 2006, 2007, 2008
// Every time the rocket exploded into a cloud of smoke as soon as it took off, with a red cross covering the stage, the commentator became more and more frustrated every time. ③ The fourth time: the camera zoomed in on the fourth stage, ignited, and rushed out of the screen - green tick, colored paper, background radiation, stay for one shot
// ④ The "first" medal + three qualifier stickers are affixed in order: private development / entering orbit / liquid fuel.
(() => {
const ID = 's03', L = LIN, { C, W, H, TAU } = L, { clamp, lerp } = U;
let Q = null;
const q = () => Q || (Q = { dyk: TM.cue(ID, 'The first one'), lyh: TM.cue(ID, 'Falcon 1'),
  L1: TM.cue(ID, '2006'), F1: L.cueN(ID, 'fail', 0), L2: TM.cue(ID, '2007'), F2: L.cueN(ID, 'fail', 1), L3: TM.cue(ID, 'August 2008'), F3: L.cueN(ID, 'fail', 2),
  d4: TM.cue(ID, 'fourth time'), cl: TM.cue(ID, 'It’s done'), cw: TM.cue(ID, 'become'), dym: TM.cue(ID, 'The first one'), sr: TM.cue(ID, 'Privately developed'), jr: TM.cue(ID, 'into orbit'), yt: TM.cue(ID, 'liquid fuel'),
  end: TM.dur(ID) });

const PADS = [{ x: 760, lab: '2006' }, { x: 1010, lab: '2007' }, { x: 1260, lab: 'August 2008' }, { x: 1580, lab: 'fourth time' }], BASE = 700;
function pad(g, x, k, hot) {
  L.at(g, x, BASE, k, h => {
    h.lineWidth = 4.5; h.strokeStyle = C.ink; h.lineJoin = 'round';
    h.fillStyle = hot ? C.yel : C.steelD; h.fill(L.rrp(-80, 0, 160, 34, 10)); h.stroke(L.rrp(-80, 0, 160, 34, 10));
    h.fillStyle = C.tile; h.fill(L.rrp(-56, 34, 18, 34, 4)); h.stroke(L.rrp(-56, 34, 18, 34, 4)); h.fill(L.rrp(38, 34, 18, 34, 4)); h.stroke(L.rrp(38, 34, 18, 34, 4));
  });
}
function attempt(g, lt, i, tL, tF) {
  const P = PADS[i], kp = L.popK(lt, tL - 0.25, 0.4, 2);
  pad(g, P.x, kp, false);
  if (kp > 0) L.at(g, P.x, BASE + 120, kp, h => L.txt(h, P.lab, 0, 0, 36, { align: 'center', col: lt > tF ? C.red : C.ink }));
  if (lt < tL - 0.25) return;
  // Rocket: When he said the year, he came on stage, then took off, and when he said "failure", he exploded in the air.
  // The three times were different: the first time it exploded as soon as it left the stage, the second time it flew crookedly, and the third time it flew as high as possible.
  const HH = [190, 260, 300][i], u = clamp((lt - tL - 0.15) / (tF - tL - 0.15)), rise = lt < tL + 0.15 ? 0 : Math.pow(u, 1.7) * HH;
  const rot = i === 1 ? 0.3 * Math.sin(lt * 13) * u : i === 2 ? 0.12 * u : 0, dx = i === 1 ? 40 * Math.sin(lt * 6) * u : i === 2 ? 60 * u * u : 0;
  if (lt < tF && !(i === 0 && lt < q().L1 + 0.25)) L.rocket(g, L.F1(), P.x + dx, BASE - 4 - rise, 9.5, { fins: true, sx: 3.6, flame: lt > tL + 0.05 ? 0.9 : 0, lt, seed: i, rot });
  if (lt < q().d4 + 0.1) L.puff(g, P.x + (i === 2 ? 60 : 0), BASE - 110 - HH, lt - tF, { s: 0.9 + i * 0.06, seed: 4 + i });   // Clear out the cigarette before the fourth time
  // debris falling
  if (lt > tF && lt < tF + 0.75) { const r = U.rng(40 + i); for (let j = 0; j < 6; j++) { const k = lt - tF, vx = (r() - 0.5) * 340, vy = -120 - r() * 160;
      g.save(); g.translate(P.x + vx * k, BASE - 110 - HH + vy * k + 900 * k * k); g.rotate(k * (r() * 12 - 6)); g.fillStyle = j % 2 ? C.white : C.red; g.strokeStyle = C.ink; g.lineWidth = 3;
      g.beginPath(); g.rect(-9, -5, 18, 10); g.fill(); g.stroke(); g.restore(); } }
  L.stamp(g, 'x', P.x, BASE - 70, lt - tF - 0.12, { s: 1.15, rot: -0.12 + i * 0.1 });
}
function hero(g, lt) {                             // ① Large Falcon 1 + famous brand, shrunk to the fourth position in 2.1 seconds
  const Qv = q(), sh = MO.cubicInOut(clamp((lt - (Qv.L1 - 0.25)) / 0.5));
  if (sh >= 1) return;
  const x = lerp(1200, PADS[0].x, sh), y = lerp(800, BASE - 4, sh), s = lerp(21, 9.5, sh), k = L.popK(lt, 0.05, 0.5, 1.6);   // The big rocket turns directly into the one from 2006
  g.save();
  L.at(g, x, y, k, h => L.rocket(h, L.F1(), 0, 0, s, { fins: true, sx: lerp(2.4, 3.6, sh), lw: 5 }), 0.02 * Math.sin(lt * 2));
  const kn = L.popK(lt, Qv.lyh, 0.4, 2.4) * (1 - clamp(sh * 4));
  if (kn > 0) L.at(g, 1470, 420, kn, h => { L.kw(h, 'Falcon 1', 0, 0, { size: 72, fill: C.red }); });
  const kd = L.popK(lt, Qv.dyk, 0.4, 2) * (1 - clamp(sh * 4));
  if (kd > 0) L.at(g, 1470, 300, kd, h => L.kw(h, 'first rocket', 0, 0, { size: 40, fill: C.white, col: C.ink }));
  if (kn > 0) L.arrow(g, lt, 1340, 470, 1260, 540, MO.cubicOut(clamp((lt - Qv.lyh - 0.1) / 0.3)) * (1 - sh), { seed: 9, bend: -20, lw: 6, head: 22 });
  g.restore();
}
// Fund bar: one piece is lost for each failure, and there is only a little bit of red left before the fourth time (rebate "only enough money to play the last shot")
function fund(g, lt) {
  const Qv = q(), k = L.popK(lt, Qv.L1 - 0.1, 0.4, 2) * (1 - L.outK(lt, Qv.cl + 0.4, 0.3)); if (k <= 0) return;
  const lv = [[Qv.F1, 0.62], [Qv.F2, 0.3], [Qv.F3, 0.09]]; let v = 1, tl = -9;
  for (const [t, to] of lv) if (lt > t) { const u = MO.cubicOut(clamp((lt - t) / 0.4)); v = lerp(v, to, u); tl = t; }
  const low = v < 0.15, blink = low ? 0.55 + 0.45 * Math.sin(lt * 12) : 1;
  L.at(g, 900, 190, k, h => {
    L.card(h, -230, -42, 460, 84, { fill: C.white, r: 42, lw: 4, sh: 5 });
    L.flatCoin(h, -186, 0, 26);
    L.txt(h, 'funds', -146, 2, 34, { base: 'middle' });
    h.fillStyle = '#EEE7DA'; h.fill(L.rrp(-60, -16, 270, 32, 16));
    h.save(); h.globalAlpha *= blink; h.fillStyle = low ? C.red : v < 0.4 ? C.orange : C.green; h.fill(L.rrp(-60, -16, Math.max(16, 270 * v), 32, 16)); h.restore();
    h.lineWidth = 3.5; h.strokeStyle = C.ink; h.stroke(L.rrp(-60, -16, 270, 32, 16));
    if (lt > Qv.d4 - 0.1 && lt < Qv.cl) L.at(h, 0, 90, L.popK(lt, Qv.d4 - 0.1, 0.35, 2.4), s => L.kw(s, 'Just enough for the last shot', 0, 0, { size: 40, fill: C.red }));
  }, MO.settle(lt - tl, 0.06, 4, 6));
}
function board(g, lt) {
  const Qv = q(); if (lt < Qv.L1 - 0.3) return;
  const out = L.outK(lt, Qv.cw - 0.12, 0.3); if (out >= 1) return;
  // The fourth time: the camera zooms in to the fourth station
  const push = MO.cubicInOut(clamp((lt - (Qv.d4 - 0.1)) / 0.6)) * (1 - MO.cubicInOut(clamp((lt - (Qv.cl + 0.6)) / 0.5)));
  g.save(); g.globalAlpha = 1 - out; L.cam(g, 1 + 0.16 * push, PADS[3].x, 560);
  // The radiation is left for the starship at the end to enter orbit. Here only colored paper + green check are used (downgraded one level)
  const sb = 0;
  if (sb > 0) { g.save(); g.translate(PADS[3].x, 420); g.rotate(lt * 0.25); g.globalAlpha *= 0.55 * MO.cubicOut(sb); g.fillStyle = C.yel;
    for (let i = 0; i < 14; i++) { const a = i * TAU / 14; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1100 * MO.cubicOut(sb), a, a + TAU / 28); g.closePath(); g.fill(); } g.restore(); }
  attempt(g, lt, 0, Qv.L1, Qv.F1); attempt(g, lt, 1, Qv.L2, Qv.F2); attempt(g, lt, 2, Qv.L3, Qv.F3);
  // Channel 4
  const P = PADS[3], k4 = L.popK(lt, Qv.L1 + 0.45, 0.4, 2); pad(g, P.x, k4, lt > Qv.d4);
  L.at(g, P.x, BASE + 120, L.popK(lt, Qv.d4 - 0.1, 0.4, 2.4), h => L.kw(h, 'fourth time', 0, -6, { size: 38, fill: C.yel, col: C.ink }));
  if (lt < Qv.d4 - 0.1) L.at(g, P.x, BASE + 116, k4, h => L.txt(h, '?', 0, 0, 40, { align: 'center', col: C.sub }));
  const tIg = Qv.d4 + 0.35, rise = lt < Qv.cl - 0.15 ? 0 : Math.pow(lt - (Qv.cl - 0.15), 2) * 4200;   // It rushes out of the screen at once, and the green check mark waits for it to leave before placing it again.
  const shake = lt > tIg && lt < Qv.cl ? 3 * Math.sin(lt * 70) : 0;
  g.save(); g.globalAlpha *= clamp((BASE - rise - 260) / 200);   // Fade below the vintage capsule when flushing out
  if (k4 > 0) L.at(g, P.x + shake, BASE, k4, h => L.rocket(h, L.F1(), 0, -4 - rise, 9.5, { fins: true, sx: 3.6, flame: lt > tIg ? lerp(0.7, 1.6, clamp((lt - tIg) / 0.5)) : 0, lt, seed: 7 }));
  g.restore();
  if (lt > tIg && lt < Qv.cl + 0.6) for (let j = 0; j < 5; j++) { const ph = (lt * 2 + j / 5) % 1; g.save(); g.globalAlpha = 0.5 * (1 - ph); g.fillStyle = '#E6DFD2';
    g.beginPath(); g.arc(P.x - 90 + j * 45, BASE + 10 - ph * 24, 24 + ph * 30, 0, TAU); g.fill(); g.restore(); }
  L.stamp(g, 'v', P.x, BASE - 190, lt - Qv.cl - 0.28, { s: 2.0, rot: -0.12 });
  const kc = L.popK(lt, Qv.cl + 0.3, 0.4, 2.6);
  if (kc > 0) L.at(g, P.x - 60, BASE - 400, kc, h => L.kw(h, 'Done!', 0, 0, { size: 72, fill: C.green }), -0.06);
  g.restore();
}
// ④ Medal + qualifier sticker
function medal(g, lt, k) {
  L.at(g, 820, 470, k, h => {
    h.lineWidth = 5; h.strokeStyle = C.ink; h.lineJoin = 'round';
    for (const d of [-1, 1]) { h.beginPath(); h.moveTo(d * 30, 60); h.lineTo(d * 90, 230); h.lineTo(d * 52, 214); h.lineTo(d * 30, 250); h.lineTo(d * 0, 80); h.closePath(); h.fillStyle = d < 0 ? C.red : C.blue; h.fill(); h.stroke(); }
    h.beginPath(); for (let i = 0; i < 24; i++) { const a = i * TAU / 24 + lt * 0.3, rr = i % 2 ? 150 : 166; h.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } h.closePath(); h.fillStyle = C.goldD; h.fill(); h.stroke();
    h.beginPath(); h.arc(0, 0, 130, 0, TAU); h.fillStyle = C.gold; h.fill(); h.stroke();
    h.beginPath(); h.arc(0, 0, 104, 0, TAU); h.strokeStyle = 'rgba(43,42,51,0.35)'; h.lineWidth = 4; h.stroke();
    L.txt(h, 'The first one', 0, 16, 64, { w: 'Black', align: 'center', base: 'middle' });
    h.fillStyle = 'rgba(255,255,255,0.6)'; h.beginPath(); h.ellipse(-60, -70, 26, 12, -0.7, 0, TAU); h.fill();
  }, 0.05 * Math.sin(lt * 1.7));
}
function chipIcon(g, kind, lt) {
  g.lineWidth = 4; g.strokeStyle = C.ink; g.lineJoin = 'round';
  if (kind === 0) L.person(g, 0, -6, 0.62, C.white);
  else if (kind === 1) { L.earth(g, 0, 0, 26, lt, { spin: 20 }); g.save(); g.setLineDash([7, 6]); g.lineWidth = 3; g.beginPath(); g.ellipse(0, 0, 44, 14, -0.3, 0, TAU); g.stroke(); g.restore(); }
  else { g.beginPath(); g.moveTo(0, -36); g.bezierCurveTo(16, -12, 30, 6, 30, 16); g.arc(0, 16, 30, 0, Math.PI); g.bezierCurveTo(-30, 6, -16, -12, 0, -36); g.closePath(); g.fillStyle = C.sea; g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(-12, 14, 6, 10, 0.3, 0, TAU); g.fill(); }
}
const CHIPS = [{ s: 'Privately developed', col: C.purple }, { s: 'into orbit', col: C.blue }, { s: 'liquid fuel', col: C.teal }];
function page2(g, lt) {
  const Qv = q(); if (lt < Qv.cw - 0.1) return;
  medal(g, lt, L.popK(lt, Qv.dym - 0.15, 0.5, 2));
  const ts = [Qv.sr, Qv.jr, Qv.yt];
  CHIPS.forEach((c, i) => {
    const t0 = ts[i] - 0.08, u = clamp((lt - t0) / 0.38); if (u <= 0) return;
    const x = lerp(1900, 1340, MO.backOut(u, 1.6)), y = 330 + i * 170;
    L.at(g, x, y, 1, h => { L.card(h, -40, -62, 520, 124, { fill: C.white, r: 30 }); h.save(); h.translate(46, 0); chipIcon(h, i, lt); h.restore();
      L.kw(h, c.s, 300, 0, { size: 50, fill: c.col }); }, (i - 1) * 0.025 + 0.012 * Math.sin(lt * 2 + i));
  });
  // Connecting lines: medal → three stickers
  ts.forEach((t, i) => L.arrow(g, lt, 1000, 470, 1290, 330 + i * 170, MO.cubicOut(clamp((lt - t) / 0.3)), { seed: 20 + i, bend: 0, lw: 5, head: 0, dash: [2, 12] }));
  L.underline(g, lt, 1420, 755, 280, MO.cubicOut(clamp((lt - Qv.yt - 0.3) / 0.35)), { col: C.red });
}

SCENES[ID] = {
  init() { U.assertGlyphs('PuHui-Heavy', 'The funds are only enough for the last Falcon 1, the first rocket, in 2006, 2007, and the fourth time in August 2008? Done! Private development of liquid fuel into orbit', ID); U.assertGlyphs('PuHui-Black', 'The first one', ID); },
  draw(c, lt) {
    L.CUR_T = L.T0(ID) + lt;
    L.bg(c, lt, { seed: 2613 });
    L.pageTitle(c, lt, 'Falcon 1', q().lyh - 0.1, { col: C.red, size: 44 });
    hero(c, lt); board(c, lt); fund(c, lt); page2(c, lt);
  },
};
ERAS.find(e => e.id === ID).transition = { type: 'lin_flip', dur: 0.6 };
FRONT_CONFETTI: { L.FRONT[ID] = (c, lt) => { const Qv = q(); L.confetti(c, 1580, 560, lt - Qv.cl - 0.3, { n: 60, seed: 31, spread: 900, up: 900, life: 2.4 }); }; }
L.cast(ID, [
  { t: 0.05, pose: 'point', fr: 'talk' },
  { t: q().F1 - 0.02, pose: 'sad', fr: 0 },
  { t: q().F2 - 0.02, pose: 'sad', fr: 1 },
  { t: q().F3 - 0.02, pose: 'sad', fr: 2 },
  { t: q().d4 - 0.05, pose: 'nervous', fr: 'talk' },
  { t: q().cl - 0.02, pose: 'cheer', fr: 'bounce' },
  { t: q().cw - 0.05, pose: 'thumb', fr: 'talk' },
]);
L.push(ID, q().cl - 0.1, q().cw + 0.25, 1.12, 1350, 900);
L.bustCard(ID, q().F3 - 0.02, q().d4 - 0.04, [[q().F3 - 0.02, 3]]);   // The third failure: Cut to a close-up of the commentator smiling bitterly and sweating.
L.hudHide(ID, q().F3 - 0.1, q().d4);   // Third failure: Give the commentator a close-up of his reaction
L.year(ID, [[q().L1, 2006], [q().L2, 2007], [q().L3, 2008]]);
})();
