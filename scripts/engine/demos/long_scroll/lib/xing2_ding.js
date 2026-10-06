// A set of gadgets shared by segments (shared by 27_kirby, 13_pop, 14_8bit, 25_ghibli, 26_vaporwave, and 16_2026 in the complete movie; only 14_8bit is used in this demonstration). Do not change world.js / crossing.js.
// Use D4.need() at the beginning of the segment file to load this file synchronously (index.html does not need to be changed).
//   D4.hero(seg, s) reproduces the frame-taking logic of world.js drawHero: returns { key, i, o:{x,y,h}, hat:[x,y], act, u} (screen coordinates), and draws props in the front to align the hand/hat
//   D4.since(seg, s, k) The number of seconds since the start of the k-th interaction in this segment (negative before interaction) - events in the segment are always timed relative to the interaction, and the pace will not be adjusted if the pace is changed.
//   D4.frameCanvas(key, i, tag, fn) takes the original image of the i-th frame and gives it to fn(g, im) to process it into a new canvas and cache it (style materials: pixelation, posterization, neon strokes...)
//   D4.drawFrame(c, key, i, o, cv) draws the processed frame to (o.x, o.y) according to the anchor point rules of XING.actor, and cv.pad is the edge left during processing.
(() => {
const D4 = window.D4 = {};
D4.SCALE = {};    // The ref_h of some interactive frame libraries (full body + bust, standing + sitting mixed arrangement) is pulled to the side: press the key to add a full set of zoom, D4.hero and hero.draw are shared
const { clamp } = U;
D4.hero = (seg, s) => {
  const WD = WORLD, hero = WD.heroAt(s.t), H0 = seg.hero || {};
  let key = H0.walk, i;
  if (hero.p.kind === 'act' && hero.p.seg === seg) { key = hero.p.act.key || H0.walk; i = hero.p.act.frame ? hero.p.act.frame(hero.u) : 0; }
  else { const walked = WD.plan.filter(q => q.kind === 'walk' && q.t0 <= s.t).reduce((a, q) => a + Math.min(s.t, q.t1) - q.t0, 0); i = Math.floor(walked * (H0.fps || 8.5) * WD.V / 330) % XING.nFrames(key); }   // Same as world.js: cadence is proportional to pace
  const lx = hero.x - seg.x0;
  const gy = (hero.p.kind === 'act' && hero.p.seg === seg && hero.p.act.y) ? hero.p.act.y(lx, hero.u) : (seg.ground ? seg.ground(lx) : WD.GROUND);
  const o = { x: lx - s.camX, y: gy, h: H0.h || WD.HERO_H, scale: D4.SCALE[key] || 1 };
  return { key, i, o, lx, hat: XING.hatTop(key, i, o), act: hero.p.kind === 'act' && hero.p.seg === seg ? hero.p.act : null, u: hero.u };
};
const FC = {};
D4.img = (key, i) => window.IMG[`demos/long_scroll/frames/${key}/${XING.SPR[key].meta.frames[i].file}`];
D4.frameCanvas = (key, i, tag, fn) => {
  const k = key + '|' + i + '|' + tag; if (FC[k]) return FC[k];
  const im = D4.img(key, i); const cv = fn(im); FC[k] = cv; return cv;
};
D4.drawFrame = (c, key, i, o, cv, alpha) => {
  const f = XING.SPR[key].meta.frames[i], s = o.h / XING.SPR[key].meta.ref_h * (o.scale || 1), pad = cv.pad || 0, k = cv.k || 1;
  const fx = o.flip ? -1 : 1;
  c.save(); if (alpha != null) c.globalAlpha *= alpha;
  if (o.shadow) { c.fillStyle = o.shadow; c.beginPath(); c.ellipse(o.x, o.y + 2, o.h * 0.2, o.h * 0.035, 0, 0, Math.PI * 2); c.fill(); }
  c.translate(o.x, o.y); c.scale(fx, 1);
  if (cv.pixel) c.imageSmoothingEnabled = false;
  c.drawImage(cv, -(f.ax + pad) * s, -(f.ay + pad) * s, cv.width / k * s, cv.height / k * s);
  c.restore();
};
// an im → margin canvas
D4.padded = (im, pad) => { const cv = PAINT.canvas(im.width + 2 * pad, im.height + 2 * pad); cv.getContext('2d').drawImage(im, pad, pad); cv.pad = pad; return cv; };
// Parabola: from a to b (u 0..1), return [x,y,u]
D4.arc = (a, b, u, peak = 200) => { const e = clamp(u); return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - Math.sin(e * Math.PI) * peak, e]; };
D4.since = (seg, s, k = 0) => s.t - WORLD.actT(seg, k);
})();
