// World Camera CAM: The commentary film is not "sequences + transitions", but "a continuous canvas of the world + a camera".
// Iron rule: the camera only calculates the total film time (or this time), and the scene is redrawn according to the camera vector in each frame - the zoom transition is always clear and will not blur the 1920 bitmap by 20 times;
//       In the transition window, the engine will continue to press t to draw the previous segment into the A buffer, so "continue pushing the camera of the previous shot" is naturally established (live advancement).
// cam = { x, y, z, r }: The world point (x,y) falls in the center of the screen, zoom z (>1 to push closer), and rotate r (radians) around the center. Default x=960, y=540, z=1, r=0.
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // The canvas size follows U.setStage (default 1920×1080)
const { clamp, lerp } = U;
const CAM = window.CAM = {};
const n = cam => ({ x: cam.x ?? W / 2, y: cam.y ?? H / 2, z: cam.z ?? 1, r: cam.r || 0 });

// Apply the camera transformation to c (not save/restore, the caller is responsible)
CAM.apply = (c, cam) => { const k = n(cam); c.translate(W / 2, H / 2); if (k.r) c.rotate(k.r); c.scale(k.z, k.z); c.translate(-k.x, -k.y); };
// Draw fn(c) under the camera, automatically save/restore
CAM.with = (c, cam, fn) => { c.save(); CAM.apply(c, cam); fn(c); c.restore(); };
// world → screen / screen → world
CAM.toScreen = (cam, x, y) => { const k = n(cam); let dx = (x - k.x) * k.z, dy = (y - k.y) * k.z; if (k.r) { const cs = Math.cos(k.r), sn = Math.sin(k.r); [dx, dy] = [dx * cs - dy * sn, dx * sn + dy * cs]; } return [W / 2 + dx, H / 2 + dy]; };
CAM.toWorld = (cam, sx, sy) => { const k = n(cam); let dx = sx - W / 2, dy = sy - H / 2; if (k.r) { const cs = Math.cos(-k.r), sn = Math.sin(-k.r); [dx, dy] = [dx * cs - dy * sn, dx * sn + dy * cs]; } return [k.x + dx / k.z, k.y + dy / k.z]; };

// ---------- Zoom ----------
// Logarithmic interpolation: z0 → z1 Each frame is enlarged by the same factor, and the audience feels "crossing the scale at a uniform speed"; linear interpolation will be slow and sharp at the same time. It is used for all push and pull zooms.
CAM.zlerp = (z0, z1, e) => z0 * Math.pow(z1 / z0, e);
// "Pass through a circular opening of radius r, and the opening should cover the screen before the transition ends." The minimum magnification required = the distance from the center of the opening to the farthest corner of the screen / r.
// When the opening is at the center of the screen ≈ 1101/r ("Magnification ≥ 1100/radius" written on the card). If it is too small, it will jump if the opening of the last frame is not fully covered.
CAM.coverZoom = (r, cx = W / 2, cy = H / 2) => Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) / r;
// Let world point (wx,wy) appear on screen (sx,sy) at zoom z: Return to camera. When you push something closer, move it smoothly to the center of the frame.
CAM.anchor = (wx, wy, z, sx, sy) => ({ x: wx - (sx - W / 2) / z, y: wy - (sy - H / 2) / z, z });
// Advance a world point: Starting from the base camera, the zoom is logarithmically interpolated to Z (progress e); the point is moved on the screen from its original position toward the center of the frame (progress k, default = e; k=0 = push around it).
// Used to "drill into the lens" (y1), "push the photo full and then cut hard" (y2), "advance the latest data point" (t3, k=0).
CAM.pushTo = (base, wx, wy, Z, e, k = e, to = [W / 2, H / 2]) => {
  const s0 = CAM.toScreen(base, wx, wy), z = CAM.zlerp(n(base).z, Z, e);
  return CAM.anchor(wx, wy, z, lerp(s0[0], to[0], k), lerp(s0[1], to[1], k));
};

// ---------- Keyframe ----------
// keys = [{t, x, y, z, r, ease}]; ease works "from the previous key to this key", and defaults to cubicInOut; z uses logarithmic interpolation.
// Panning along a path (panning/swinging on the Vox desktop and whiteboard) is a series of keyframes: sineInOut is used for smooth movement, cubicInOut+motion blur is used for long jumps, and MO.longTail is used for pursuit along the line.
CAM.at = (keys, t) => {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) { const e = (b.ease || MO.cubicInOut)(MO.seg(t, a.t, b.t));
      return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), z: CAM.zlerp(a.z, b.z, e), r: lerp(a.r || 0, b.r || 0, e), v: e }; }
  }
  return { ...keys[keys.length - 1] };
};

// ---------- Parallax ----------
// d=1 is the main plane, d<1 is far and d>1 is close. Press d linearly for far layer displacement and z^d for zoom: the distant view almost moves when pushing deeply, which is the sense of depth of field (Kurzgesagt 5-layer parallax).
CAM.layer = (c, cam, d, fn) => { const k = n(cam); c.save(); CAM.apply(c, { x: lerp(W / 2, k.x, d), y: lerp(H / 2, k.y, d), z: Math.pow(k.z, d) }); fn(c); c.restore(); };

// ---------- sports ----------
// The instantaneous speed of the camera on screen (pixels/frame, 60fps): camFn(t) → cam. For use with motionBlur.
CAM.velocity = (camFn, t, dt = 1 / 60) => { const a = camFn(t), b = camFn(t - dt); const z = n(a).z; return [(n(a).x - n(b).x) * z, (n(a).y - n(b).y) * z]; };
// Dynamic blur: stack the entire frame n times along the speed direction (for fast panning/panning; speed <1.5px automatically degenerates into one draw). Blur length should be shorter than camera displacement (PremiumBeat).
CAM.motionBlur = (c, src, vx, vy, k = 7) => {
  const sp = Math.hypot(vx, vy); if (sp < 1.5) { c.drawImage(src, 0, 0); return; }
  c.save(); for (let i = 0; i < k; i++) { const q = i / (k - 1) - 0.5; c.globalAlpha = i === 0 ? 1 : 1 / (i + 1); c.drawImage(src, -vx * q, -vy * q); } c.restore();
};
// The handheld feeling is slightly drifting: two sinusoids with different periods (continuous time, no flickering), return [dx, dy] pixels
CAM.drift = (t, amp = 6, seed = 0) => [amp * Math.sin(t * 0.9 + seed) + amp * 0.4 * Math.sin(t * 2.3 + seed * 2), amp * 0.7 * Math.sin(t * 1.1 + seed * 3)];
})();
