// t2 · Press conference: "An AI product release: three function cards"
// Shot 1 (2.6s): Soft spots of light drift slowly on a dark background; eyebrow title → product name (blurred → clear + moved up, gradient words, light sweep) → one-sentence subtitle. The camera zooms in very slowly.
// This file also contains things common to t2 (window.T2): light spot background, font, and color.
(() => {
const { clamp, lerp } = U;
const W = 1920, H = 1080;
const BASE = '#050508';
const BLOBS = [                                                   // The hue is a Stripe gradient series (purple/blue/cyan) + a little warm color; the period is avoided for 5s (HIG: avoid ~0.2Hz continuous swing)
  { x: 430, y: 300, r: 760, col: [150, 90, 238], a: 0.75, ax: 220, ay: 120, period: 11, ph: 0 },
  { x: 1520, y: 260, r: 700, col: [56, 104, 255], a: 0.7, ax: 200, ay: 160, period: 13, ph: 2.1 },
  { x: 1320, y: 930, r: 560, col: [120, 214, 255], a: 0.5, ax: 260, ay: 100, period: 9.5, ph: 4 },
  { x: 520, y: 960, r: 520, col: [255, 96, 84], a: 0.42, ax: 180, ay: 90, period: 12, ph: 1.3 },
];
const SANS = '"Inter", "NotoSansSC"', ZH = '"NotoSansSC"';
// Spot bottom: only depends on the full film time t, seamless between the three shots (the background does not jump when changing lenses)
const bg = (c, t, { dim = 0.38 } = {}) => {
  UI.mesh(c, t, { base: BASE, blobs: BLOBS, blur: 90, scale: 0.25, grain: 0.035, key: 't2mesh' });
  // Darken the center to leave contrast for the white text
  const g = c.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1000); g.addColorStop(0, `rgba(0,0,0,${dim})`); g.addColorStop(1, 'rgba(0,0,0,0.1)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
};
// Large characters: Tighten character spacing −0.02em (Apple/Linear official website 64px or above −0.015~−0.03em)
const track = (c, size, em = -0.02) => { c.letterSpacing = (size * em).toFixed(2) + 'px'; };
// The light spot drift, the card floating, and the icon rhythm all read the full film time t. PHASE: Use the phase of 8-16s when the film was arranged in the experiment, and maintain the composition of the final picture (delete or change it when changing the title)
const PHASE = 8;
window.T2 = { bg, SANS, ZH, track, BASE, PHASE };

const DUR = 2.6;
SCENES['t2_s1'] = {
  draw(c, lt, t) {
    t += T2.PHASE;
    bg(c, t);
    // Camera slow push at a constant speed: 1.0 → 1.045 (the whole lens is linear, the slow push of the press conference film does not slow down, slowing down to a stop will make the picture "dead")
    const s = lerp(1, 1.045, lt / (DUR + 0.55));
    c.save(); c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-W / 2, -H / 2);
    c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    // eyebrow question
    c.font = `500 34px ${ZH}`; c.fillStyle = '#a7a7b4'; c.letterSpacing = '6px';
    TY.blurIn(c, 'Brand new release', W / 2, 372, MO.appleOut(MO.seg(lt, 0.1, 0.8)), { blur: 10, dy: 16 });
    // Product name: Gradient calligraphy and painting enter and leave the screen → light sweep (source-atop only lights on the words) → blur → clear paste back
    const p = MO.appleOut(MO.seg(lt, 0.3, 1.3));
    if (p > 0) {
      const tx = UI.scratch('t2title', W, 420), g = tx.getContext('2d'); g.reset();
      g.font = `600 220px ${SANS}`; track(g, 220); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      const gr = g.createLinearGradient(600, 0, 1320, 0); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, '#ddd2ff'); gr.addColorStop(1, '#a8dcff');
      g.fillStyle = gr; g.fillText('Plover 2', W / 2, 300);
      UI.sheen(g, null, MO.seg(lt, 1.25, 2.15), { x0: 560, x1: 1360, width: 140, angle: -0.38, alpha: 0.85, comp: 'source-atop' });
      c.save(); c.globalAlpha = clamp(p * 1.5); const b = (1 - p) * 26; if (b > 0.3) c.filter = `blur(${b.toFixed(1)}px)`;
      c.drawImage(tx, 0, 620 - 300 + (1 - p) * 40); c.restore();               // texture baseline y=300 → screen y=620
    }
    // subtitle
    c.font = `400 50px ${ZH}`; c.fillStyle = '#c9c9d4'; c.letterSpacing = '1px';
    TY.blurIn(c, 'An AI assistant that can think, remember, and act', W / 2, 740, MO.appleOut(MO.seg(lt, 0.7, 1.6)), { blur: 12, dy: 22 });
    c.restore();
  },
};
})();
