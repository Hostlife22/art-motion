// Motion effect time library MO: easing, spring, step, stagger, time signature. All are pure functions of "time → value", no clock reading, deterministic.
// Source: YouTube commentary animation-grammars 8 demo videos (references/09-video-animation-grammars.md). Convention: p is the progress of 0..1, t/lt is the second.
//   Select a sentence for slow motion: Use smooth/sineInOut for explanations (3b1b/whiteboard) to stop both ends; use appleOut/spring for press conferences; use expoOut+spring for dynamic text;
//   The collage (Vox) camera uses sineInOut or longTail, the paper is stepped at 12fps; the Kurzgesagt action uses k75, and the loop uses easyEase.
(() => {
const { clamp, lerp } = U;
const MO = window.MO = {};

// ---------- Canvas size (for fragment rendering) ----------
// The engine and all demos are 1920×1080. clip.html (parameterized clip of the narration pipeline) may be portrait 1080×1920:
// Libraries that use screen size (CAM / UI / CH / DG / CL) are registered with U.onStage, and U.setStage(w, h) is used to change them all at once when clip.js starts.
const stageHooks = [];
window.STAGE = { W: 1920, H: 1080 };
U.onStage = f => { stageHooks.push(f); };
U.setStage = (w, h) => { window.STAGE = { W: w, H: h }; stageHooks.forEach(f => f(w, h)); };

// ---------- Time slice ----------
MO.seg = (t, a, b) => clamp((t - a) / (b - a));                          // [a,b] → 0..1
MO.at = (t, t0, dur) => clamp((t - t0) / dur);                           // [t0, t0+dur] → 0..1
MO.anim = (lt, start, dur, ease = MO.smooth) => ease(clamp((lt - start) / dur));
// Step Time: Quantizes continuous time into fps steps. Collage pictures/typing/highlighter "one shot two" = 12fps; story characters 24fps; the camera is still smoothed at 60fps.
MO.step = (t, fps = 12) => Math.floor(t * fps + 1e-6) / fps;

// ---------- manim easing (3b1b/manim rate_functions.py) ----------
// smooth = 6t⁵−15t⁴+10t³: The velocity and acceleration at both ends are 0. The default easing for narrative films.
MO.smooth = t => { t = clamp(t); return t * t * t * (10 - 15 * t + 6 * t * t); };
const sig = x => 1 / (1 + Math.exp(-x));
MO.smoothCE = (t, inflection = 10) => { const e = sig(-inflection / 2); return clamp((sig(inflection * (t - 0.5)) - e) / (1 - 2 * e)); };   // ManimCE version
MO.thereAndBack = t => MO.smooth(t < 0.5 ? 2 * t : 2 * (1 - t));          // Indicate used: went and came back
MO.rushInto = t => 2 * MO.smooth(t / 2);                                  // Start slowly and rush to the finish line
MO.rushFrom = t => 2 * MO.smooth(t / 2 + 0.5) - 1;                        // Charge out, close slowly
MO.doubleSmooth = t => t < 0.5 ? 0.5 * MO.smooth(2 * t) : 0.5 * (1 + MO.smooth(2 * t - 1));
MO.wiggle = (t, wiggles = 2) => MO.thereAndBack(t) * Math.sin(wiggles * Math.PI * t);
// manim LaggedStart(lag_ratio=r): The local progress of the i-th sub-animation under the total progress p in n sub-animations. Total length = 1+(n-1)·r units, the i-th one occupies [i·r, i·r+1].
MO.lagged = (i, n, p, r = 0.05) => clamp(p * (1 + (n - 1) * r) - i * r);

// ----------Commonly used parsing easing (AE/CSS names) ----------
MO.linear = p => p;
MO.sineInOut = p => -(Math.cos(Math.PI * p) - 1) / 2;
MO.cubicIn = p => p * p * p;
MO.cubicOut = p => 1 - Math.pow(1 - p, 3);
MO.cubicInOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
MO.quartOut = p => 1 - Math.pow(1 - p, 4);
MO.quintOut = p => 1 - Math.pow(1 - p, 5);
MO.quintInOut = p => p < .5 ? 16 * p ** 5 : 1 - Math.pow(-2 * p + 2, 5) / 2;
MO.expoIn = p => p <= 0 ? 0 : Math.pow(2, 10 * p - 10);
MO.expoOut = p => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);                // The most commonly used method in motion design is "fast start, slow stop"
MO.expoInOut = p => p <= 0 ? 0 : p >= 1 ? 1 : p < .5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2;
// backOut overshoot: s=1.70158 about 10%; 2.2 about 13%; 2.6 about 17%; 3.5 about 23%
MO.backOut = (p, s = 1.70158) => { const q = p - 1; return 1 + (s + 1) * q * q * q + s * q * q; };
// Flexible settling: overshoot again and again (the sticker falls down with a "snap")
MO.elasticOut = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * (2 * Math.PI / 3)) + 1;

// ---------- CSS cubic-bezier(x1,y1,x2,y2): Newton's method finds parameters from x, and then takes y ----------
MO.bezier = (x1, y1, x2, y2) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = s => ((ax * s + bx) * s + cx) * s, Y = s => ((ay * s + by) * s + cy) * s, dX = s => (3 * ax * s + 2 * bx) * s + cx;
  return p => {
    if (p <= 0) return 0; if (p >= 1) return 1;
    let s = p; for (let k = 0; k < 8; k++) { const e = X(s) - p, d = dX(s); if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break; s -= e / d; }
    s = clamp(s); return Y(s);
  };
};
MO.appleOut = MO.bezier(0.25, 0.1, 0.25, 1);        // CSS `ease`: Apple official website/press conference transition
MO.emphasized = MO.bezier(0.2, 0, 0, 1);            // Material 3 emphasized: long tail slowdown
MO.k75 = MO.bezier(0.75, 0, 0.25, 1);               // Kurzgesagt "Other actions use 75% influence" (y1 survey §6.2)
MO.easyEase = MO.bezier(0.333, 0, 0.667, 1);        // AE Easy Ease: Loop action
MO.longTail = MO.bezier(0.33, 0, 0.2, 1);           // Vox "Chasing along the line" and "Pull out to reveal": Start fast, settle down in the long tail (y2 survey)

// ---------- Spring ----------
// SwiftUI parameterization (WWDC23 Animate with springs): stiffness=(2π/duration)², damping=4π(1-bounce)/duration → ζ=1-bounce, ω=2π/duration.
// Returns the displacement from 0→1 (can be >1 = overshoot). t is in seconds. Use this for launch UI: .smooth(bounce 0) / .snappy(0.15) / .bouncy(0.3).
MO.spring = (t, { duration = 0.5, bounce = 0, v0 = 0 } = {}) => {
  if (t <= 0) return 0;
  const w = 2 * Math.PI / duration, z = 1 - bounce;
  let x;                                                                 // x = remaining displacement (1→0)
  if (Math.abs(z - 1) < 1e-4) x = Math.exp(-w * t) * (1 + (w - v0) * t);
  else if (z < 1) { const wd = w * Math.sqrt(1 - z * z); x = Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w - v0) / wd) * Math.sin(wd * t)); }
  else { const r = Math.sqrt(z * z - 1), a = -w * (z - r), b = -w * (z + r); const A = (-v0 - b) / (a - b); x = A * Math.exp(a * t) + (1 - A) * Math.exp(b * t); }
  return 1 - x;
};
MO.smoothSpring = t => MO.spring(t, { duration: 0.5, bounce: 0 });
MO.snappy = t => MO.spring(t, { duration: 0.5, bounce: 0.15 });
MO.bouncy = t => MO.spring(t, { duration: 0.5, bounce: 0.3 });
// Frequency/decay parameterized underdamped spring step response (for dynamic text): freq Hz, decay 1/s.
//   freq 3 / decay 6 first overshoot ≈37% (big words smashed in); 2.5 / 9 ≈16% (regular pop-in); 2.2 / 10 ≈8% (main words settled)
MO.springHz = (t, freq = 2.5, decay = 9) => t <= 0 ? 0 : 1 - Math.exp(-decay * t) * Math.cos(2 * Math.PI * freq * t);
// Aftershock after being in place (Dan Ebberts inertial rebound): amp·sin(2πft)/e^(decay·t). Use it for squeezing the body when changing positions and vibrating the screen.
MO.settle = (t, amp, freq = 3, decay = 5) => t <= 0 ? 0 : amp * Math.sin(2 * Math.PI * freq * t) / Math.exp(decay * t);

// ----------Continuous micro-movement ----------
// Floating: superposition of two frequency sinusoids. Avoid a period of about 5s (HIG: continuous swing of ~0.2Hz is uncomfortable)
MO.float = (t, amp = 6, period = 4, ph = 0) => amp * (0.75 * Math.sin(2 * Math.PI * t / period + ph) + 0.25 * Math.sin(2 * Math.PI * t / (period * 0.53) + ph * 1.7));

// ----------Reverse check and time signature ----------
// The inverse function of easing (bisection): "At what time does the end of the thread/count reach y". Example: Use smooth to draw a polyline, and find the moment when it reaches a certain x (event label of mirror 2 in t3).
MO.invert = (ease, y, iters = 30) => { let a = 0, b = 1; for (let i = 0; i < iters; i++) { const m = (a + b) / 2; if (ease(m) < y) a = m; else b = m; } return (a + b) / 2; };
// Beat → Second
MO.beat = (n, bpm = 120) => n * 60 / bpm;
// The frame that reveals falls on the beat: starting point of segment = bar line − reveal point × transition duration (y5: zoom reveal point .55, color band .6, push to 90% displacement at .58)
MO.onBeat = (barTime, revealP, trDur) => barTime - revealP * trDur;
})();
