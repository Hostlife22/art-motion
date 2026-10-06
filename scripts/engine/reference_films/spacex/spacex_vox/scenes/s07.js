// S07 · 2020.5 Manned Dragon spacecraft: vertical dot photo (Falcon 9 lifts off with Crew Dragon) + two paper-cut astronauts (the masks are opaque and have no faces) sliding in;
// "Nearly 9 years later": A paper ruler on the table, from 2011 to 2020, with a red pen filling in the blank line in the middle, and the brackets marking "nearly 9 years" (the translation of the growth of the color blocks on the Vox map);
// "First time... private company's spaceship": newspaper clipping, red circle "first time", highlighter followed by "private company's spaceship".
(() => {
const ID = 's07', V = VOX, C = V.C, F = V.F, PH = V.PH, TAU = Math.PI * 2;
const { clamp, lerp } = U, seg = MO.seg, step = V.step;
const cell = V.cell(ID), X0 = cell.x, Y0 = cell.y, xy = (x, y) => ({ x: X0 + x, y: Y0 + y });
const cue = k => TM.cue(ID, k), G = k => V.cue(ID, k), t0 = V.t0(ID);
const T = { lab: '2020.5', crew: 'two astronauts', gap: 'nearly 9 years', y11: 'space shuttle retired', y20: 'Crew Dragon spacecraft', h0: 'first,', h1: 'spaceships by private companies', h2: 'Send people into orbit', kick: '2020.5' };

// Photo: Falcon 9 + Crew Dragon liftoff (night)
const crewDraw = (g, w, h) => {
  PH.sky(g, w, h, '#141414', '#5a5a5a');
  PH.smoke(g, w * 0.5, h * 1.02, 150, 16, 9, '#e8e8e8', 1.5);
  PH.plume(g, [[w * 0.5, h * 1.02], [w * 0.5, h * 0.72]], 30, 60, 3, '#e2e2e2');
  PH.glow(g, w * 0.5, h * 0.68, 150, 1);
  PH.flame(g, w * 0.5, h * 0.66, 170, 34);
  PH.rocket(g, RK.falcon9({ payload: 'dragon' }), w * 0.5, h * 0.66, h / 125);
};
const P = xy(1880, 840), PW = 500, PHh = 700;
V.item({ key: 's07ph', ...P, r: 0.025, z: 10, at: t0 - 1, draw(g) { V.blit(g, V.photo('s07crew', PW, PHh, crewDraw, { cell: 6, border: 15 })); V.tape(g, -PW / 2 + 30, -PHh / 2 - 6, -0.55, 120); V.tape(g, PW / 2 - 30, -PHh / 2 - 6, 0.5, 120); } });
V.item({ key: 's07lab', ...xy(1760, 1140), r: -0.02, z: 12, at: G('2020') - 0.05, enter: { drop: 0.25, dur: 0.25 }, draw(g, T_) { V.label(g, T.lab, 78, { fam: F.num, n: V.nTyped(T_, G('2020'), 10) }); } });
// Cut the paper of the Manned Dragon spacecraft (capsule + tail section). When you say "Manned Dragon spacecraft", slide it in and circle it with a red pen.
const capsule = () => V.cutout('s07cap', 200, 300, (g, w, h) => RK.at(g, w / 2, h - 6, 41, 0, q => V.shadeFill(q, RK.dragon({ trunk: true }), { ...V.GREY, window: '#d8d8d8', trunk: '#9a9a9a', nose: '#cfcfcf' })), { cell: 4, edge: 7 });   // Frustum cabin + cylindrical tail section (no portholes are drawn to avoid reading it as a face)
const CC = V.circle('s07cap', 150, 190, 5);
V.item({ key: 's07cap', ...xy(1120, 930), r: 0.04, z: 12, at: G('manned') - 0.25, enter: { from: [-420, -160], tilt: 0.2, dur: 0.45 }, draw(g, T_) {
  V.blit(g, capsule()); g.save(); g.translate(0, 10); V.pen(g, CC, MO.cubicOut(seg(step(T_), G('Dragon spacecraft'), G('Dragon spacecraft') + 0.55)), { lw: 8 }); g.restore();
  g.save(); g.translate(0, 230); g.rotate(-0.02); V.label(g, T.y20, 46, { n: V.nTyped(T_, G('manned'), 12) }); g.restore();
} });
// Paper-cut astronaut: white spacesuit + opaque black mask (no facial features)
const astro = (k) => V.cutout('s07astro' + k, 170, 380, (g, w, h) => {
  g.fillStyle = '#ececec';
  g.beginPath(); g.ellipse(w / 2, 62, 58, 62, 0, 0, TAU); g.fill();                                // helmet
  g.beginPath(); g.roundRect(w / 2 - 70, 112, 140, 150, 34); g.fill();                              // trunk
  g.beginPath(); g.roundRect(w / 2 - 92, 126, 34, 120, 16); g.roundRect(w / 2 + 58, 126, 34, 120, 16); g.fill();   // arm
  g.beginPath(); g.roundRect(w / 2 - 60, 250, 54, 126, 18); g.roundRect(w / 2 + 6, 250, 54, 126, 18); g.fill();     // leg
  g.fillStyle = '#9a9a9a'; g.fillRect(w / 2 - 70, 200, 140, 14); g.fillRect(w / 2 - 60, 340, 120, 10);
  g.fillStyle = '#1a1a1a'; g.beginPath(); g.ellipse(w / 2 + (k ? 6 : -6), 66, 40, 34, 0, 0, TAU); g.fill();   // face mask
  g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(w / 2 + (k ? -8 : -20), 52, 10, 6, -0.5, 0, TAU); g.fill();
}, { cell: 4, edge: 7 });
V.item({ key: 's07a', ...xy(1410, 900), r: -0.03, z: 12, at: G('two') - 0.12, enter: { from: [-380, 120], tilt: -0.2, dur: 0.45 }, draw(g, T_) {
  V.blit(g, astro(0), -90, 0); V.blit(g, astro(1), 90, 10);
  g.save(); g.translate(0, -250); g.rotate(0.02); g.fillStyle = C.paper; g.fillRect(-150, -36, 300, 72); V.typed(g, T.crew, -122, 18, V.nTyped(T_, G('two'), 12), 50, F.heavy, C.ink); g.restore();
} });
// Paper ruler: 2011 → 2020, red pen lines in the blank space
const R = xy(900, 1440), RW = 1360, RH = 130, yx = y => -RW / 2 + 90 + (y - 2011) * (RW - 180) / 9;
const ruler = () => V.spr('s07ruler', RW, RH, (g, w, h) => {
  V.paper(g, w, h, 37, { col: '#ece3c8', torn: false, age: 0.2 });
  g.fillStyle = C.ink; for (let y = 2011; y <= 2020; y++) { const x = w / 2 + yx(y); g.fillRect(x - 1.5, h - 46, 3, 46); V.text(g, String(y), x, 44, 32, F.type, C.ink, 'center'); for (let m = 1; m < 4 && y < 2020; m++) g.fillRect(x + m * (w - 180) / 36 - 1, h - 22, 2, 22); }
});
const HATCH = (() => { const a = yx(2011.55), b = yx(2020.4), o = []; for (let x = a, k = 0; x < b; x += 26, k++) o.push(V.handPts('s07h' + k, [[x, 58], [x + 30, 124]], { amp: 1, seed: k, per: 6 })); return o; })();
const BR = V.handPts('s07br', [[yx(2011.55), 6], [yx(2011.55), -24], [yx(2020.4), -24], [yx(2020.4), 6]], { amp: 1.4, seed: 2 });
const tH = [G('time lapse') - 0.05, G('nearly 9') + 0.3];
V.item({ key: 's07ruler', ...R, r: -0.012, z: 11, at: G('USA') - 0.2, enter: { from: [0, 340], tilt: -0.06, dur: 0.4 }, draw(g, T_) {
  V.blit(g, ruler()); const st = step(T_), q = seg(st, tH[0], tH[1]);
  g.save(); g.translate(0, -RH / 2); HATCH.forEach((H, k) => VOX.pen(g, H, clamp(q * HATCH.length - k), { lw: 6, col: C.red })); g.restore();
  g.save(); g.translate(0, -RH / 2 - 36); V.pen(g, BR, MO.cubicOut(seg(st, G('nearly 9') - 0.1, G('nearly 9') + 0.35)), { lw: 6 });
  if (st >= G('nearly 9') + 0.05) { g.translate((yx(2011.55) + yx(2020.4)) / 2, -70); g.rotate(-0.02); V.label(g, T.gap, 74, { bg: C.red2, padX: 30 }); } g.restore();
  // Small print at both ends: 2011 Space Shuttle retirement / 2020 Manned Dragon spacecraft
  if (st >= tH[0]) { V.text(g, T.y11, yx(2011), RH / 2 + 52, 34, F.bold, C.ink2, 'center'); }
  if (st >= G('again')) { V.text(g, T.y20, yx(2020), RH / 2 + 52, 34, F.bold, C.red, 'center'); V.pin(g, yx(2020), -RH / 2 + 6); }
} });
// Clippings: First time/private company spacecraft
const NW = 1000, NH = 400, N = xy(600, 640);
const news = () => V.spr('s07news', NW, NH, (g, w, h) => {
  V.paper(g, w, h, 43, { amp: 5 }); V.text(g, T.kick, 56, 70, 34, F.type, C.ink2); g.fillStyle = C.ink; g.fillRect(56, 88, w - 112, 3); g.fillRect(56, 96, w - 112, 1);
  V.serifBold(g, T.h0 + T.h1, 56, 190, 70); V.serifBold(g, T.h2, 56, 282, 70);
  g.fillStyle = 'rgba(40,36,30,.26)'; [700, 660].forEach((ww, i) => g.fillRect(56, 320 + i * 26, ww, 10));
});
const SP = (() => { const g = PAINT.scratch('vxmeasure').getContext('2d'); return [V.span(g, T.h0 + T.h1, 'first', 56, 70, F.serif), V.span(g, T.h0 + T.h1, 'Private company\'s spaceship', 56, 70, F.serif)]; })();
const NC = V.circle('s07first', 128, 56, 31);
V.item({ key: 's07news', ...N, r: 0.018, z: 12, at: G('Too') - 0.45, enter: { from: [-520, -120], tilt: -0.14, dur: 0.4 }, draw(g, T_) {
  V.blit(g, news()); g.save(); g.translate(-NW / 2, -NH / 2); const st = step(T_);
  V.hl(g, SP[1].x - 6, 128, SP[1].w + 12, 80, MO.sineInOut(seg(st, G('private'), t0 + V.cueN(ID, 'spaceship', 1) + 0.25)));
  g.translate(SP[0].x + SP[0].w / 2, 164); V.pen(g, NC, MO.cubicOut(seg(st, G('first'), G('first') + 0.55)), { lw: 7 }); g.restore();
} });

// ---------- camera ----------
const at = (x, y, z, sy) => V.at(X0 + x, Y0 + y, z, sy);
const cam = (lt) => CAM.at([
  V.key(0, at(1630, 855, 1.04)),                                // Entering the scene: a piece of paper was pulled away from the previous image (vox_pull)
  V.key(0.85, at(1640, 860, 1.06), MO.sineInOut),
  V.key(cue('USA') - 0.2, at(1600, 870, 1.12), MO.sineInOut),
  V.key(cue('time lapse') + 0.15, at(1000, 1300, 1.06), MO.cubicInOut),
  V.key(cue('Too') - 0.15, at(990, 1310, 1.1), MO.sineInOut),
  V.key(cue('first') + 0.05, at(470, 600, 1.2), MO.cubicInOut),
  V.key(TM.dur(ID) - 0.4, at(470, 605, 1.24), MO.sineInOut),
  V.key(TM.dur(ID), at(380, 620, 1.22), MO.cubicIn),
], lt);
ERAS.find(e => e.id === ID).transition = { type: 'vox_pull', dur: 0.5, punch: 0 };
V.scene(ID, { cam, init() { V.glyphs(ID, [[F.num, T.lab], [F.heavy, T.crew + T.gap], [F.bold, T.y11 + T.y20], [F.type, '20112020.5'], [F.serif, T.h0 + T.h1 + T.h2]]); } });
})();
