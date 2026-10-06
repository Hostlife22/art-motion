// Milo traveler skeleton: side-view FK joints, compatible with the existing pose API.
// Identity: dark brown curls, yellow jacket, navy trousers, cream sneakers, small teal backpack.
// Coordinates: local units 1 = 1px from the side view of the set; origin = ground between feet; y upward is negative; native left (-x is front). Total height 740 units.
// usage:
//   const H = MILO.build({ x, y, s: 0.6, face: 1 /*1 facing right -1 facing left* /, pose: MILO.pose('walk', phase) });
//   MILO.draw(c, H, pal) //Default flat drawing method; pal.mode: 'fill' | 'line' | 'both'
//   H.parts = [{ name, role, path, z }] // In order of drawing; roles: skin, shirt (jacket), shorts (trousers), hair, shoe, backpack, strap
//   H.J = { hip, knee1, ankle1, toe1, knee2, ..., shoulder1, elbow1, wrist1, ..., neck, head, headTop, mouth, eye }
// Angle agreement: 0 = droop naturally; positive = turn in the direction of the face (forward); a big head and a small body cannot reach the top of the head with hands: Raise the hand = the proximal arm is raised forward (~1.9), the far side is raised backward (~-1.9), forming a V shape when viewed from the side, not straight up. 1 = proximal limb (drawn first), 2 = distal.
(() => {
const HS = window.MILO = {};
const { lerp, clamp } = U;
const D = (a, b, c, d, e, f) => new DOMMatrix([a, b, c, d, e, f]);
const P2 = (pts, closed = true) => (RIG && RIG.smooth) ? RIG.smooth(pts, closed) : (() => { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(...q) : p.moveTo(...q)); if (closed) p.closePath(); return p; })();
const add = (dst, path, m) => { dst.addPath(path, m); return dst; };
const tf = (m, x, y) => { const p = m.transformPoint(new DOMPoint(x, y)); return [p.x, p.y]; };

// ---------- Local shape (respective bone coordinate system, origin = starting point joint of the bone, downward along +y) ----------
const SHAPE = {
  // Head: origin = neck point; face facing -x
  face: P2([[-30, -158], [-78, -150], [-108, -128], [-122, -98], [-124, -66], [-118, -38], [-102, -14], [-80, 2], [-50, 8], [-18, 2], [8, -14], [22, -40], [24, -78], [10, -120]]),
  hairBack: P2([[-70, -168], [-10, -176], [56, -168], [102, -140], [118, -96], [112, -58], [86, -30], [52, -18], [26, -28], [20, -62], [8, -110], [-30, -140], [-62, -140]]),
  bangs: P2([[-122, -120], [-110, -146], [-76, -164], [-34, -166], [-10, -150], [-28, -138], [-52, -132], [-70, -118], [-86, -132], [-102, -116]]),
  curls: (() => { const p = new Path2D(); for (const [x, y, r] of [[-95,-156,35],[-65,-186,38],[-24,-202,40],[20,-196,40],[62,-171,36],[85,-138,32],[-113,-130,26]]) { p.moveTo(x+r,y); p.arc(x,y,r,0,Math.PI*2); } return p; })(),
  backpack: (() => { const p = new Path2D(); p.roundRect(45,-242,110,178,34); return p; })(),
  strap: P2([[31,-258],[49,-256],[69,-48],[52,-48]]),
  ear: (() => { const p = new Path2D(); p.ellipse(16, -66, 17, 22, 0.15, 0, Math.PI * 2); return p; })(),
  // Torso (yellow jacket): origin = hip; shoulder approx. (0,-250)
  shirt: P2([[-18, -272], [-40, -258], [-60, -200], [-72, -120], [-82, -42], [-84, -32], [74, -34], [72, -40], [70, -140], [62, -230], [44, -262], [14, -274]]),
  collar: P2([[-18, -272], [0, -262], [14, -274]], false),
  shorts: P2([[-74, -44], [76, -42], [80, 18], [70, 44], [-70, 46], [-78, 16]]),
  // Thigh leg: origin = hip joint; length 62
  thigh: P2([[-40, -6], [38, -6], [42, 58], [-40, 62]]),
  // Calf: origin = knee; length 66
  shin: P2([[-24, 0], [22, 0], [21, 66], [-21, 66]]),
  // Cream sneakers: origin = ankle; toe points toward -x
  shoe: P2([[-104, 26], [-100, 6], [-80, -4], [-50, -8], [-20, -12], [18, -10], [46, -2], [58, 18], [56, 46], [40, 60], [-60, 62], [-96, 54], [-106, 40]]),
  // Sleeves: origin = shoulder; length 112
  sleeve: P2([[-40, -10], [36, -14], [44, 100], [-34, 112]]),
  upper: P2([[-19, 0], [19, 0], [18, 126], [-18, 126]]),
  fore: P2([[-18, 0], [18, 0], [16, 74], [-16, 74]]),
  hand: (() => { const p = new Path2D(); p.ellipse(0, 18, 22, 25, 0, 0, Math.PI * 2); return p; })(),
};

// ---------- Posture Library ----------
// Each pose returns the joint angle (radians) and root offset. phase is used for loop actions (0..1).
HS.pose = (name, ph = 0, k = {}) => {
  const s = Math.sin(2 * Math.PI * ph), c = Math.cos(2 * Math.PI * ph);
  const P = { lean: 0, head: 0, bob: 0, dx: 0, th1: 0, sh1: 0, ft1: 0, th2: 0, sh2: 0, ft2: 0, ua1: 0, fa1: 0, ua2: 0, fa2: 0, pocket1: 0, pocket2: 0, mouth: 0.3, blink: 0 };
  switch (name) {
    case 'idle': Object.assign(P, { pocket1: 1, pocket2: 1, ua1: -0.05, fa1: 0.25, ua2: -0.05, fa2: 0.25, bob: 2 * s, head: 0.03 * s }); break;
    case 'walk': Object.assign(P, { lean: 0.05, bob: -6 * Math.abs(c), th1: 0.42 * s, sh1: -0.55 * Math.max(0, -s) - 0.15, ft1: 0.1 * s, th2: -0.42 * s, sh2: -0.55 * Math.max(0, s) - 0.15, ft2: -0.1 * s,
      ua1: -0.45 * s, fa1: 0.35, ua2: 0.45 * s, fa2: 0.35, head: 0.03 * c }); break;
    case 'run': Object.assign(P, { lean: 0.22, bob: -14 * Math.abs(c), th1: 0.8 * s + 0.1, sh1: -1.1 * Math.max(0, -s) - 0.3, th2: -0.8 * s + 0.1, sh2: -1.1 * Math.max(0, s) - 0.3,
      ua1: -0.9 * s, fa1: 1.4, ua2: 0.9 * s, fa2: 1.4, head: -0.06, mouth: 0.6 }); break;
    case 'crouch': Object.assign(P, { lean: 0.35, bob: 52, th1: 1.25, sh1: -1.9, ft1: 0.5, th2: 1.05, sh2: -1.8, ft2: 0.6, ua1: 0.5, fa1: 0.4, ua2: 0.3, fa2: 0.5, head: -0.2 }); break;
    case 'jump': Object.assign(P, { lean: 0.05, th1: 0.7, sh1: -1.2, th2: 0.2, sh2: -0.6, ua1: 1.95, fa1: 0.7, ua2: -1.95, fa2: -0.7, head: -0.15, mouth: 1 }); break;
    case 'wave': Object.assign(P, { pocket2: 1, ua2: -0.05, fa2: 0.25, ua1: 2.15, fa1: 0.15 + 0.5 * (0.5 + 0.5 * s), head: 0.08, mouth: 0.8, bob: 2 * s }); break;
    case 'sit': Object.assign(P, { bob: 62, th1: 1.55, sh1: -1.55, th2: 1.5, sh2: -1.5, ua1: 0.5, fa1: 0.9, ua2: 0.4, fa2: 0.9, lean: -0.05 }); break;
    case 'point': Object.assign(P, { pocket2: 1, ua2: -0.05, fa2: 0.25, ua1: 1.45, fa1: 0.05, head: -0.05, mouth: 0.7 }); break;
    case 'think': Object.assign(P, { pocket2: 1, ua2: -0.05, fa2: 0.25, ua1: 0.6, fa1: 2.3, head: -0.1, mouth: 0.1 }); break;
    case 'cheer': Object.assign(P, { ua1: 2.05, fa1: 0.55, ua2: -2.05, fa2: -0.55, bob: -10 * Math.abs(s), head: -0.12, mouth: 1 }); break;
    // Throw sideways (failed): ph 0→1 = Accumulate power → Release → Follow the swing
    case 'throw': { const w = ph < 0.45 ? ph / 0.45 : 1, r = ph < 0.45 ? 0 : clamp((ph - 0.45) / 0.25), f = clamp((ph - 0.7) / 0.3);
      Object.assign(P, { lean: lerp(lerp(0, -0.12, w), 0.32, r), bob: lerp(0, 34, w) - 10 * r, th1: lerp(0, 0.65, w) - 0.3 * r, sh1: lerp(0, -0.9, w) + 0.4 * r, th2: lerp(0, -0.35, w) + 0.25 * r, sh2: lerp(-0.1, -0.5, w),
        ua1: lerp(lerp(0, -1.3, w), 1.1, r) + 0.3 * f, fa1: lerp(lerp(0.3, 0.9, w), 0.15, r), ua2: lerp(0, 0.9, w) - 0.5 * r, fa2: 0.6, head: lerp(0, -0.05, w), mouth: 0.5 + 0.5 * r }); break; }
  }
  return Object.assign(P, k);
};

// ---------- Assembly ----------
// o: { x, y, s, face, pose, squash } squash = vertical squeeze (0.85 for landing, 1.1 for take-off)
HS.build = (o = {}) => {
  const { x = 960, y = 900, s = 0.6, face = 1, pose = HS.pose('idle'), squash = 1, rot = 0 } = o;
  const P = pose;
  // Root: First move to the world coordinates, mirror according to the direction (original left, face=1 to turn right), extrusion with the sole of the foot as the axis
  const root = new DOMMatrix().translate(x, y).rotate(rot * 180 / Math.PI).scale(-face * s, s * squash);
  const hip = root.translate(P.dx, -185 + P.bob).rotate(-P.lean * 180 / Math.PI);  // lean>0 lean forward; local front=-x, rotate negative angle to make the upper body fall towards -x
  const deg = a => a * 180 / Math.PI;
  const parts = [], J = {};
  const push = (name, role, shape, m, z) => parts.push({ name, role, path: add(new Path2D(), shape, m), z, m });
  const leg = (i, th, sh, ft, zBase) => {
    const hipJ = hip.translate(i === 1 ? -8 : 10, 0);
    const mT = hipJ.rotate(deg(th));                       // Thigh forward (-x): positive angle rotate → (0,1) turn -x ✓
    const knee = mT.translate(0, 60), mS = knee.rotate(deg(sh)), ankle = mS.translate(0, 64), mF = ankle.rotate(deg(ft));
    push('thigh' + i, 'shorts', SHAPE.thigh, mT, zBase + 2);
    push('shin' + i, 'shorts', SHAPE.shin, mS, zBase);
    push('shoe' + i, 'shoe', SHAPE.shoe, mF, zBase + 1);
    J['hip' + i] = tf(hipJ, 0, 0); J['knee' + i] = tf(knee, 0, 0); J['ankle' + i] = tf(ankle, 0, 0); J['toe' + i] = tf(mF, -104, 40); J['heel' + i] = tf(mF, 56, 46);
    J['shoeM' + i] = mF;
  };
  const arm = (i, ua, fa, pocket, zBase) => {
    const sh = hip.translate(i === 1 ? -4 : 14, -250);
    const mU = sh.rotate(deg(ua)), elbow = mU.translate(0, 124), mFo = elbow.rotate(deg(fa)), wrist = mFo.translate(0, 70);
    push('sleeve' + i, 'shirt', SHAPE.sleeve, mU, zBase + 3);
    push('upper' + i, 'shirt', SHAPE.upper, mU, zBase);
    if (!pocket) { push('fore' + i, 'shirt', SHAPE.fore, mFo, zBase + 1); push('hand' + i, 'skin', SHAPE.hand, wrist, zBase + 2); }
    else push('fore' + i, 'shirt', SHAPE.fore, mFo, zBase - 30);
    J['shoulder' + i] = tf(sh, 0, 0); J['elbow' + i] = tf(elbow, 0, 0); J['wrist' + i] = tf(wrist, 0, 0); J['hand' + i] = tf(wrist, 0, 18); J['handM' + i] = wrist;
  };
  // far side behind
  leg(2, P.th2, P.sh2, P.ft2, 0);
  push('backpack', 'backpack', SHAPE.backpack, hip, 8);
  arm(2, P.ua2, P.fa2, P.pocket2, 10);
  push('shorts', 'shorts', SHAPE.shorts, hip, 40);
  push('shirt', 'shirt', SHAPE.shirt, hip, 50);
  leg(1, P.th1, P.sh1, P.ft1, 60);
  push('shortsFront', 'shorts', SHAPE.shorts, hip, 64);
  push('shirtFront', 'shirt', SHAPE.shirt, hip, 66);
  push('strap', 'strap', SHAPE.strap, hip, 67);
  // head
  const neck = hip.translate(6, -272), mH = neck.rotate(deg(-P.head));
  push('hairBack', 'hair', SHAPE.hairBack, mH, 80);
  push('face', 'skin', SHAPE.face, mH, 81);
  push('ear', 'skin', SHAPE.ear, mH, 82);
  push('bangs', 'hair', SHAPE.bangs, mH, 83);
  push('curls', 'hair', SHAPE.curls, mH, 85);
  arm(1, P.ua1, P.fa1, P.pocket1, 70);
  parts.sort((a, b) => a.z - b.z);
  J.hip = tf(hip, 0, 0); J.neck = tf(neck, 0, 0); J.head = tf(mH, -40, -80); J.headTop = tf(mH, 0, -242); J.mouth = tf(mH, -104, -34); J.eye = tf(mH, -104, -88);
  J.chest = tf(hip, -40, -180); J.face = face; J.s = s;
  return { parts, J, mH, root, hip, P, s, face };
};

// Facial features and detail lines (drawn in head coordinates)
HS.details = (c, H, pal) => {
  const L = pal.line || '#151515', lw = (pal.lw ?? 5);
  c.save(); c.setTransform(c.getTransform().multiply(H.mH)); c.lineCap = 'round'; c.lineJoin = 'round';
  // Uncovered eye; expressions preserve the existing blink and mouth controls.
  if (!H.P.blink) { c.fillStyle = pal.eye || L; c.beginPath(); c.ellipse(-104, -86, 9, 13, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(-107, -91, 3, 0, Math.PI * 2); c.fill(); }
  else { c.strokeStyle = pal.eye || L; c.lineWidth = lw * 0.8; c.beginPath(); c.arc(-104, -90, 9, 0.2, Math.PI - 0.2); c.stroke(); }
  c.strokeStyle = L; c.lineWidth = lw; c.beginPath(); c.moveTo(-115, -111); c.quadraticCurveTo(-105, -120, -91, -113); c.stroke();
  // Mouth: mouth 0 close your mouth and smile → 1 open your mouth
  const m = H.P.mouth;
  c.strokeStyle = L; c.lineWidth = lw * 0.8;
  if (m < 0.5) { c.beginPath(); c.moveTo(-112, -40); c.quadraticCurveTo(-100, -28 - 8 * m, -88, -38); c.stroke(); }
  else { c.fillStyle = pal.mouthFill || '#7a2e2e'; c.beginPath(); c.ellipse(-102, -34, 9, 6 + 6 * m, 0, 0, Math.PI * 2); c.fill(); c.stroke(); }
  // Blush, ear pinna
  if (pal.cheek) { c.fillStyle = pal.cheek; c.beginPath(); c.ellipse(-70, -48, 14, 9, 0, 0, Math.PI * 2); c.fill(); }
  c.strokeStyle = pal.earLine || 'rgba(190,110,90,.8)'; c.lineWidth = lw * 0.6; c.beginPath(); c.arc(16, -66, 8, -1.2, 1.6); c.stroke();
  c.restore();
  // Cream sneakers have a clean sole line rather than perforated footwear.
  for (const i of [1,2]) { const m2=H.J['shoeM'+i]; c.save(); c.setTransform(c.getTransform().multiply(m2)); c.strokeStyle=pal.line||L; c.lineWidth=3; c.beginPath(); c.moveTo(-90,43); c.lineTo(43,43); c.stroke(); c.restore(); }
};

HS.PAL = { skin: '#fbd9bf', hair: '#38271f', shirt: '#f5c542', shorts: '#24354c', backpack: '#287b7c', strap: '#795438', shoe: '#fbfaf0', line: '#151515', lw: 5, cheek: 'rgba(245,140,120,.35)' };

// Default drawing method: "Fill → Draw" part by part, naturally only visible lines remain (correct occlusion)
HS.draw = (c, H, pal = HS.PAL) => {
  pal = { ...HS.PAL, ...pal };
  const mode = pal.mode || 'both', L = pal.line, lw = pal.lw / H.s * H.s;   // Line width in world pixels
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  for (const p of H.parts) {
    const col = pal[p.role] ?? pal.skin;
    if (mode !== 'line') { c.fillStyle = col; c.fill(p.path); }
    if (mode !== 'fill' && lw) {
      if (mode === 'line') { c.save(); c.globalCompositeOperation = 'destination-out'; c.fill(p.path); c.restore(); }   // Line drawing mode: The parts drawn later are dug out of the previous lines first.
      c.strokeStyle = L; c.lineWidth = lw; c.stroke(p.path);
    }
  }
  HS.details(c, H, pal);
  c.restore();
};
})();
