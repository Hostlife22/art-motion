// S03 · Four Falcon 1 launches: Photography editor’s “contact sheet”.
// The paper-cut Falcon 1 stands on the table with a black label; a film print has four frames, and the camera cuts through each frame quickly (fast pace). Each time "Failure" is said, a red crayon makes a cross.
// The date is printed on the edge of the film; the fourth frame is circled in red → full → hard cut into a large scan: it entered the orbit (the first highlight in the whole film, leaving one shot);
// Cut to a newspaper clipping, the highlighter reads "Privately developed" and "Liquid fuel".
(() => {
const ID = 's03', V = VOX, C = V.C, F = V.F, PH = V.PH, TAU = Math.PI * 2;
const { clamp, lerp } = U, seg = MO.seg, step = V.step;
const cell = V.cell(ID), X0 = cell.x, Y0 = cell.y, xy = (x, y) => ({ x: X0 + x, y: Y0 + y });
const cue = k => TM.cue(ID, k), G = k => V.cue(ID, k), t0 = V.t0(ID);
const fail = [V.cueN(ID, 'fail', 0), V.cueN(ID, 'fail', 1), V.cueN(ID, 'fail', 2)];
const T = { name: 'Falcon 1', d: ['2006', '2007', '2008.8', '2008.9'], kick: '2008.9.28', h1: 'The first privately developed,', h2: 'liquid fuel rocket into orbit', ok: 'into orbit' };

// Paper-cut Falcon 1 (Slender: 21×1.7 m)
const f1 = () => V.cutout('s03f1', 90, 800, (g, w, h) => PH.rocket(g, RK.falcon1(), w / 2, h - 30, (h - 40) / 22.7), { cell: 5, edge: 7 });
V.item({ key: 's03f1', ...xy(230, 860), r: -0.03, z: 12, at: G('The first one') - 0.1, enter: { from: [-260, 420], tilt: -0.25, dur: 0.5 }, draw(g) { V.blit(g, f1()); } });
V.item({ key: 's03name', ...xy(620, 470), r: -0.02, z: 13, at: G('falcon') - 0.12, enter: { drop: 0.25, dur: 0.25 }, draw(g, T_) { V.label(g, T.name, 82, { n: V.nTyped(T_, G('falcon'), 12) }); } });

// Film print: a strip of black film on white photographic paper, four-frame positive film (dots), date printed on the edge of the film
const SW = 1740, SH = 430, FW = 370, FH = 240, fx = i => 70 + FW / 2 + i * (FW + 40) - SW / 2, FY = -12;
const okDraw = (g, w, h) => { PH.sky(g, w, h, '#1c1c1c', '#7a7a7a'); PH.plume(g, [[w * 0.36, h * 1.02], [w * 0.42, h * 0.74], [w * 0.5, h * 0.5]], 8, 20, 17, '#e4e4e4'); PH.glow(g, w * 0.53, h * 0.45, 40, 0.9); PH.flame(g, w * 0.53, h * 0.45, 46, 13, 0.45 + Math.PI * 0); PH.rocket(g, RK.falcon1(), w * 0.53, h * 0.45, h / 70, 0.45); };
const frameDraw = [V.DRAW.failDraw(0), V.DRAW.failDraw(1), V.DRAW.failDraw(2), okDraw];
const sheet = () => V.spr('s03sheet', SW, SH, (g, w, h) => {
  V.paper(g, w, h, 17, { col: '#f2f0ea', torn: false, age: 0.12 });
  g.fillStyle = '#151515'; g.fillRect(30, 40, w - 60, h - 80);
  g.fillStyle = '#e9e5da'; for (let x = 52; x < w - 60; x += 46) { for (const y of [48, h - 66]) { g.beginPath(); g.roundRect(x, y, 22, 18, 4); g.fill(); } }
  for (let i = 0; i < 4; i++) {
    const src = CL.photo('s03fr' + i, FW * 2, FH * 2, (gg, ww, hh) => { gg.scale(2, 2); frameDraw[i](gg, FW, FH); }, { border: 0, cell: 8, contrast: 1.35 });
    g.drawImage(src, w / 2 + fx(i) - FW / 2, h / 2 + FY - FH / 2, FW, FH);
    V.text(g, T.d[i], w / 2 + fx(i) - FW / 2 + 6, h / 2 + FY + FH / 2 + 27, 24, F.type, '#d9b56a');
    V.text(g, String(i + 1), w / 2 + fx(i) + FW / 2 - 18, h / 2 + FY + FH / 2 + 27, 24, F.type, '#d9b56a', 'right');
  }
});
const SX = 1350, SY = 820, SR = 0.012;
const GX = [0, 1, 2].map(i => V.cross('s03x' + i, 118, 5 + i * 3)), GC = V.circle('s03c4', 222, 160, 9, -2.6, 1.12);
V.item({ key: 's03sheet', ...xy(SX, SY), r: SR, z: 10, at: t0 - 0.5, draw(g, T_) {
  V.blit(g, sheet()); V.tape(g, -SW / 2 + 40, -SH / 2 + 10, -0.6, 120); V.tape(g, SW / 2 - 40, -SH / 2 + 10, 0.55, 120);
  for (let i = 0; i < 3; i++) { g.save(); g.translate(fx(i), FY); V.drawCross(g, GX[i], T_, t0 + fail[i] + 0.04, { lw: 15, d: 0.17 }); g.restore(); }
  g.save(); g.translate(fx(3), FY); V.pen(g, GC, MO.cubicOut(seg(step(T_), G('four times'), G('four times') + 0.5)), { lw: 13 }); g.restore();
} });
// Clippings
const NW = 1000, NH = 420, N = xy(1500, 1390);
const news = () => V.spr('s03news', NW, NH, (g, w, h) => {
  V.paper(g, w, h, 29, { amp: 5 });
  V.text(g, T.kick, 56, 70, 34, F.type, C.ink2); g.fillStyle = C.ink; g.fillRect(56, 88, w - 112, 3); g.fillRect(56, 96, w - 112, 1);
  V.serifBold(g, T.h1, 56, 190, 76); V.serifBold(g, T.h2, 56, 286, 76);
  g.fillStyle = 'rgba(40,36,30,.26)'; [820, 760, 880].forEach((ww, i) => g.fillRect(56, 326 + i * 24, ww, 10));
});
const HL = (() => { const g = PAINT.scratch('vxmeasure').getContext('2d'); return [V.span(g, T.h1, 'Privately developed', 56, 76, F.serif), V.span(g, T.h2, 'liquid fuel', 56, 76, F.serif)]; })();
V.item({ key: 's03news', ...N, r: -0.018, z: 11, at: t0 - 0.5, draw(g, T_) {
  V.blit(g, news()); g.save(); g.translate(-NW / 2, -NH / 2); const st = step(T_);
  V.hl(g, HL[0].x - 6, 128, HL[0].w + 12, 80, MO.sineInOut(seg(st, G('private'), G('system') + 0.15)));
  V.hl(g, HL[1].x - 6, 224, HL[1].w + 12, 80, MO.sineInOut(seg(st, G('liquid'), G('material') + 0.15)));
  g.restore();
} });

// ---------- Insert shot: wide sweep of frame 4 (it's on track) ----------
const orbitDraw = (g, w, h) => {
  g.fillStyle = '#101010'; g.fillRect(0, 0, w, h); PH.stars(g, w, h, 21, 120);
  PH.earthLimb(g, w * 0.32, h * 2.05, h * 1.45, 9);
  const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([lerp(w * 0.12, w * 0.6, u), h * 0.86 - Math.sin(u * 1.5) * h * 0.5]); }
  PH.plume(g, pts, 4, 10, 41, 'rgba(230,230,230,.7)');
  PH.glow(g, w * 0.6, h * 0.41, 90, 0.8); PH.flame(g, w * 0.6, h * 0.41, 90, 24, -1.9 + Math.PI);
  PH.rocket(g, RK.falcon1(), w * 0.6, h * 0.41, h / 58, 1.24);
};
const ins0 = cue('OK, done') + 0.02, ins1 = cue('private') - 0.18;
const IC = V.circle('s03ins', 300, 150, 6, -2.8, 1.1);
const insertShot = (c, lt) => {
  const sp = V.photo('s03ins', 1680, 940, orbitDraw, { cell: 8, border: 22, S: 1 });
  const z = lerp(0.95, 0.985, MO.sineInOut(clamp((lt - ins0) / (ins1 - ins0))));
  V.insert(c, sp, lt - ins0, { z0: 0.95, z1: 0.985, d: ins1 - ins0, bg: C.desk, sy: -75 });
  const st = step(lt);
  c.save(); c.translate(960, 465); c.scale(z, z); c.translate(1680 * 0.1 + 20, 940 * -0.09 - 10); c.rotate(-0.3); V.pen(c, IC, MO.cubicOut(seg(st, ins0 + 0.1, ins0 + 0.55)), { lw: 10 }); c.restore();
  if (st >= ins0 + 0.35) { c.save(); c.translate(560, 250); c.rotate(-0.05); const s = 1 + 0.3 * (1 - MO.quartOut(clamp(step(lt - ins0 - 0.35) / 0.25))); c.scale(s, s); V.label(c, T.ok, 110, { bg: C.red2, padX: 34 }); c.restore(); }
};

// ---------- camera ----------
const at = (x, y, z, sy) => V.at(X0 + x, Y0 + y, z, sy);
const FR = i => { const a = fx(i) * Math.cos(SR) - FY * Math.sin(SR), b = fx(i) * Math.sin(SR) + FY * Math.cos(SR); return [SX + a, SY + b]; };
const frameCam = (i, z = 2.05) => { const [x, y] = FR(i); return at(x, y + 30, z, 500); };
const d1 = cue('2006'), d2 = cue('2007'), d3 = cue('2008'), d4 = cue('fourth time');
const K = [
  V.key(0, V.camEnd('s02')),
  V.key(1.0, at(620, 820, 0.98), MO.longTail),
  V.key(d1 - 0.12, at(660, 820, 1.02), MO.sineInOut),
  V.key(d1 + 0.28, frameCam(0), MO.cubicInOut),                  // Quick cut: 0.4s to jump to the first frame
  V.key(d2 - 0.12, frameCam(0, 2.1), MO.sineInOut),
  V.key(d2 + 0.22, frameCam(1), MO.cubicInOut),
  V.key(d3 - 0.12, frameCam(1, 2.1), MO.sineInOut),
  V.key(d3 + 0.22, frameCam(2), MO.cubicInOut),
  V.key(d4 - 0.12, frameCam(2, 2.1), MO.sineInOut),
  V.key(d4 + 0.22, frameCam(3, 1.7), MO.cubicInOut),
  V.key(cue('It’s done'), frameCam(3, 1.78), MO.sineInOut),
];
const push = [cue('It’s done'), ins0];
const K2 = [
  V.key(ins1, at(1500, 1330, 1.12)),
  V.key(cue('liquid'), at(1520, 1340, 1.2), MO.sineInOut),
  V.key(TM.dur(ID) - 0.55, at(1540, 1340, 1.22), MO.sineInOut),
  V.key(TM.dur(ID), at(1760, 1240, 1.14), MO.cubicIn),           // Start along the red line to the right (follow the next section)
];
const cam = (lt) => {
  if (lt >= ins1) return CAM.at(K2, lt);
  const base = CAM.at(K, lt); if (lt < push[0]) return base;
  const [x, y] = FR(3); return CAM.pushTo(base, X0 + x, Y0 + y, 6.0, MO.sineInOut(seg(lt, push[0], push[1])));
};
V.warm.push(() => V.photo('s03ins', 1680, 940, orbitDraw, { cell: 8, border: 22, S: 1 }));
V.scene(ID, {
  cam, shots: [{ t: 0 }, { t: ins0, fn: insertShot }, { t: ins1 }],
  init() { V.glyphs(ID, [[F.heavy, T.name + T.ok], [F.type, T.d.join('') + T.kick + '1234'], [F.serif, T.h1 + T.h2]]); },
});
})();
