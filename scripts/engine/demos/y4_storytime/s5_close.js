// Close shot of S5 (jump close: same camera, cut directly to 1.9 times): "Where to stick it?" - Spread your hands, raise the inner ends of your eyebrows, pop up the "?" on top of your head, and then freeze for 0.95 seconds to smile.
// Rework: In the first version, this sentence was placed in the panorama. The face was only 110px high and the expression could not be seen clearly. The film was over after "?" came out in 0.4 seconds.
(() => {
const S = STORY;
SCENES['s5_close'] = {
  draw(c, lt, t) {
    const ts = MO.step(t, 24);
    const zoom = 1.9 + 0.08 * MO.quintOut(Math.min(1, lt / 1.5));           // After jumping very slowly, push again 4%
    CAM.with(c, { x: 870, y: 470, z: zoom }, c => {
      const st = S.poseAt(S.KEYS_END, ts), al = S.alive(ts, 165);
      const info = S.world(c, t, { pose: st.pose, expr: st.expr, mouth: TOON.mouth(t), blink: S.blinkAt(ts, [8.3]), look: S.lookEnd(ts), squash: st.squash * al.breathe, bob: al.bob, tilt: ts >= 7.45 ? -0.07 : 0, browUp: ts >= 7.45 ? 0.04 : 0 });
      // "?": pops up at the moment after asking (overshoot 30%), and then shakes ±3°
      const q = MO.at(t, 7.80, 0.26);
      if (q > 0) { c.save(); c.translate(info.head[0] + 165 * 1.4, info.head[1] - 165 * 0.5); c.rotate(0.14 + 0.05 * Math.sin(t * 6)); TOON.mark(c, '?', 0, 0, q, 120); c.restore(); }
    });
  },
};
})();
