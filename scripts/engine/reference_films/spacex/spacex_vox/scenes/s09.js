// S09 · Star Chain: A large piece of black cardboard with a dotted earth cutout in the middle. Satellites = confetti dots punched out by a hole punch.
// "Most of them are sending their own Starlink satellites": small paper-cut rockets climb from the edge of the earth to orbit and spit out a bunch of satellites; "2019, the first batch of 60": 60 confetti are arranged in a string to circle the earth;
// "Currently, there are more than 11,000 in orbit": Paper scraps are spread across several orbital shells in handfuls (12fps handful), and all scraps of paper slowly revolve around the earth; "More than 12 million users": Black label typing.
(() => {
const ID = 's09', V = VOX, C = V.C, F = V.F, PH = V.PH, TAU = Math.PI * 2;
const { clamp, lerp, rng } = U, seg = MO.seg, step = V.step;
const cell = V.cell(ID), X0 = cell.x, Y0 = cell.y, xy = (x, y) => ({ x: X0 + x, y: Y0 + y });
const cue = k => TM.cue(ID, k), G = k => V.cue(ID, k), t0 = V.t0(ID);
const T = { sl: 'Starlink satellite', y19: '2019 · First batch', n60: '60 pieces', now: 'Now · On orbit', n11: '11,000+ pieces', user: 'user', n12: '12 million+' };

const BW = 1560, BH = 920, B = xy(1150, 990), E = [-260, 30], R = 210;
const earth = () => V.cutout('s09earth', R * 2, R * 2, (g) => PH.globe(g, R, R, R, 11), { cell: 5, edge: 6 });
// Paper scraps: position, orbital shell, appearance time (all seeds are fixed)
const DOTS = (() => { const r = rng(91), o = [];
  for (let i = 0; i < 60; i++) o.push({ a: -1.2 + i * 0.022, rx: R * 1.42, ry: R * 0.5, tilt: -0.35, s: 7, k: 0 });                         // The first batch: a bunch
  for (let i = 0; i < 1300; i++) { const sh = r(); const rr = R * (1.16 + sh * 0.7); o.push({ a: r() * TAU, rx: rr, ry: rr * (0.35 + r() * 0.65), tilt: (r() - 0.5) * 1.6, s: 4.5 + r() * 3.5, k: 1, b: Math.floor(r() * 18) }); }
  return o; })();
const tFirst = [G('first batch'), G('60') + 0.15], tAll = [G('In orbit') - 0.1, G('1.1') + 0.25];
const dotAt = (d, T_) => { const w = 0.05 + 0.25 / (d.rx / R), a = d.a + step(T_) * w; const x = Math.cos(a) * d.rx, y = Math.sin(a) * d.ry; return [E[0] + x * Math.cos(d.tilt) - y * Math.sin(d.tilt), E[1] + x * Math.sin(d.tilt) + y * Math.cos(d.tilt), Math.sin(a)]; };
// Small rocket spits out satellites (explanation of "sending star chain")
const rocket = () => V.cutout('s09f9', 34, 200, (g, w, h) => RK.at(g, w / 2, h - 10, 2.6, 0, q => V.shadeFill(q, RK.falcon9({ payload: 'fairing' }), V.GREY)), { cell: 3, edge: 4 });
const sat = () => V.cutout('s09sat', 120, 40, (g, w, h) => { g.fillStyle = '#d8d8d8'; g.fillRect(0, 8, 44, 24); g.fillStyle = '#4a4a4a'; g.fillRect(48, 4, 70, 32); g.strokeStyle = '#999'; g.lineWidth = 2; for (let x = 58; x < 118; x += 12) { g.beginPath(); g.moveTo(x, 4); g.lineTo(x, 36); g.stroke(); } }, { cell: 3, edge: 4 });
const tRk = [t0 + 0.35, G('Starlink') + 0.1];
const RKP = (() => { const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30, a = -2.2 + u * 1.3, rr = R * (1.02 + u * 0.55); pts.push([E[0] + Math.cos(a) * rr, E[1] + Math.sin(a) * rr]); } return { p: pts, L: DG.cum(pts) }; })();

V.item({ key: 's09card', ...B, r: 0.008, z: 10, at: t0 - 1, draw(g, T_) {
  V.blit(g, V.spr('s09bk', BW, BH, (gg, w, h) => V.blackCard(gg, w, h, 97), { sh: { blur: 10, y: 6 } }));
  const st = step(T_);
  // Draw the scraps of paper on the back first (behind the earth), then the earth, then the front ones
  const nFirst = Math.round(60 * MO.sineInOut(seg(st, tFirst[0], tFirst[1]))), qa = seg(st, tAll[0], tAll[1]);
  const vis = (d, i) => d.k === 0 ? i < nFirst : d.b < Math.floor(qa * 18 + 1e-6);
  const drawDots = (front) => { g.fillStyle = '#f2efe6'; g.beginPath(); DOTS.forEach((d, i) => { if (!vis(d, i)) return; const [x, y, z] = dotAt(d, T_); if ((z > 0) !== front) return; g.moveTo(x + d.s, y); g.arc(x, y, d.s, 0, TAU); }); g.fill(); };
  g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 3; g.shadowOffsetY = 2; drawDots(false); g.restore();
  V.blit(g, earth(), E[0], E[1]);
  g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 3; g.shadowOffsetY = 2; drawDots(true); g.restore();
  // Small rocket + satellite stack
  const rq = seg(st, tRk[0], tRk[1]);
  if (rq > 0 && st < tFirst[0] + 0.4) { const L = RKP.L[RKP.L.length - 1], p = DG.pointAt(RKP.p, RKP.L, L * MO.sineInOut(Math.min(1, rq * 1.25))), p2 = DG.pointAt(RKP.p, RKP.L, Math.min(L, L * MO.sineInOut(Math.min(1, rq * 1.25)) + 6));
    g.save(); g.translate(p[0], p[1]); g.rotate(Math.atan2(p2[1] - p[1], p2[0] - p[0]) + Math.PI / 2); V.blit(g, rocket()); g.restore();
    if (rq > 0.8) for (let k = 0; k < 4; k++) { g.save(); g.translate(p[0] + 60 + k * 10, p[1] - 40 - k * 16); g.rotate(0.3); V.blit(g, sat()); g.restore(); } }
  // Tags (all on the top half/right side of the card, avoiding the subtitle strip)
  const lab = (t, x, y, s1, num, unit, size, col) => { if (st < t) return; g.save(); g.translate(x, y); g.rotate(-0.02);
    V.typed(g, s1, 0, 0, V.nTyped(T_, t, 14), 46, F.heavy, 'rgba(238,237,235,.85)');
    const tn = t + 0.25; if (st >= tn) { const k = 1 + 0.3 * (1 - MO.quartOut(clamp(step(T_ - tn) / 0.25))); g.translate(0, size * 1.16); g.scale(k, k); V.text(g, num, 0, 0, size, F.num, col); g.font = V.font(size, F.num); const w = g.measureText(num).width; V.text(g, unit, w + 10, 0, size * 0.5, F.heavy, col); }
    g.restore(); };
  if (st >= G('Starlink') - 0.1) { g.save(); g.translate(E[0] - 40, E[1] - R - 120); g.rotate(-0.02); V.label(g, T.sl, 54, { bg: C.paper, col: C.ink, n: V.nTyped(T_, G('Starlink') - 0.1, 12) }); g.restore(); }
  lab(G('2019'), 200, -330, T.y19, '60', 'grain', 110, C.paper);
  lab(G('Now'), 200, -60, T.now, '1.1', 'Ten thousand+ pieces', 120, C.yel);
  lab(G('user'), 200, 210, T.user, '1200', 'Ten thousand+', 110, C.paper);
} });

// ---------- Camera: Enter the black card to the left along the table → follow the count and push slowly ----------
const at = (x, y, z, sy) => V.at(X0 + x, Y0 + y, z, sy);
const cam = (lt) => CAM.at([
  V.key(0, at(1170, 965, 0.99)),                                // Entering the scene: The black cardboard was photographed on the table like a new piece of paper (vox_slap)
  V.key(0.85, at(1180, 960, 1.0), MO.sineInOut),
  V.key(cue('2019') - 0.1, at(1090, 980, 1.08), MO.sineInOut),
  V.key(cue('Now') + 0.1, at(1150, 960, 0.98), MO.sineInOut),
  V.key(TM.dur(ID), at(1170, 965, 1.04), MO.sineInOut),
], lt);
ERAS.find(e => e.id === ID).transition = { type: 'vox_slap', dur: 0.5, punch: 0 };
V.scene(ID, { cam, init() { V.glyphs(ID, [[F.heavy, T.sl + T.y19 + T.now + T.user], [F.num, '601.11200'], [F.heavy, 'Ten thousand+']]); } });
})();
