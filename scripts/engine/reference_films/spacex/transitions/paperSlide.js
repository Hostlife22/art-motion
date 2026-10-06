// paperSlide White paper is pushed in: a piece of whiteboard paper slides in from the right to cover the previous page (with left edge projection and a slight tilt of 1.2°), the paper is in place = the whiteboard segment begins.
// For "Color Block Page → Whiteboard Drawing": The signature of the whiteboard is "a piece of white paper", so the transition is the entry of the paper itself. Uncovering point ≈ p 0.6 (90% covered by paper).
(() => {
const { clamp } = U;
TRANSITIONS.paperSlide = (c, A, B, p, o) => {
  const W = o.W, H = o.H, e = MO.cubicInOut(clamp(p)), x = W * (1 - e) * 1.03, rot = 0.021 * (1 - e);
  c.drawImage(A, 0, 0);
  c.fillStyle = `rgba(0,0,0,${0.18 * e})`; c.fillRect(0, 0, W, H);                // The old pages were slightly darkened before being covered with paper.
  c.save(); c.translate(x, 0); c.rotate(rot);
  const g = c.createLinearGradient(-60, 0, 0, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.28)');
  c.fillStyle = g; c.fillRect(-60, -40, 60, H + 80);                                   // Projection of left edge of paper
  c.drawImage(B, 0, 0); c.fillStyle = '#FBFBFB'; c.fillRect(0, H, W, 80); c.fillRect(0, -80, W, 80);   // Fill the paper edge up and down when tilting
  c.restore();
};
})();
