// S1 medium shot: Milo is sitting behind the table talking to the camera. Oral broadcast "This is the first time I let AI help me write code,"
// Movements: mouth shape (narration envelope, one beat and two beats), speaking and nodding, breathing, changing postures and rebounding (talk → point), eyes and hands, blinking, clouds outside the window, slow camera roll + slight drift.
// The room, table, and notebook are all in world.js (S4/S5 changes lenses in the same room).
(() => {
const S = STORY;
const KEYS = [[0, 'talk', 'happy'], [1.12, 'point', 'talk']];
SCENES['s1_desk'] = {
  draw(c, lt, t) {
    const ts = MO.step(t, 24);                                     // Characters move at 24fps (Flash’s default frame rate), and lenses are smoothed at 60fps.
    const zoom = 1.01 + 0.035 * MO.expoOut(Math.min(1, lt / 2.0)) + 0.03 * (1 - MO.expoOut(Math.min(1, lt / 0.5)));   // Opening 1.04→1.01 settled, then slowly pushed 3.5%
    const [dx, dy] = CAM.drift(t, 4, 1);
    CAM.with(c, { x: 900 + dx, y: 520 + dy, z: zoom }, c => {
      const st = S.poseAt(KEYS, ts), al = S.alive(ts, 165);
      S.world(c, t, { pose: st.pose, expr: st.expr, mouth: TOON.mouth(t), blink: S.blinkAt(ts), look: ts > 1.12 ? [1, 0] : [0, 0], squash: st.squash * al.breathe, bob: al.bob, tilt: ts > 1.12 ? 0.05 : -0.03 });
    });
  },
};
})();
