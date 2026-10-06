// S4 large panorama (same room zoomed out to 0.5x): little Milo sitting in the big room. Oral broadcast "I asked it: these..."
// Panoramic views make one feel small and helpless – the vistas themselves are the basis for the laughs. Rework: Add "glance at the computer and then look at the camera" in the two pauses, and refer to the computer when saying "these".
// Movements: mouth shape, eyes (6.2 glance at the computer → 6.6 return to the camera), changing postures and rebounding (talk → point), chandelier swing, clouds floating, screen light flashing, camera zooming out very slowly.
(() => {
const S = STORY;
SCENES['s4_wide'] = {
  draw(c, lt, t) {
    const ts = MO.step(t, 24);
    const zoom = 0.53 - 0.03 * MO.quintOut(Math.min(1, lt / 1.65));          // 0.53 → 0.50
    CAM.with(c, { x: 900, y: 470, z: zoom }, c => {
      const st = S.poseAt(S.KEYS_END, ts), al = S.alive(ts, 165);
      S.world(c, t, { pose: st.pose, expr: st.expr, mouth: TOON.mouth(t), blink: S.blinkAt(ts), look: S.lookEnd(ts), squash: st.squash * al.breathe, bob: al.bob, lw: 10 });
    });
  },
};
})();
