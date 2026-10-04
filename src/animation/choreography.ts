import { blend, poseAt, poses, type Keyframe, type Pose } from "./poses";
import { clamp, mix, smooth } from "./timeline";

const pose = (name: string, changes: Partial<Pose> = {}): Pose => ({
  ...poses[name],
  ...changes,
});
const keys = (...frames: Keyframe[]) => frames;
/** Hand-authored joint targets; each scene has its own action, contacts and recovery. */
export const choreography: readonly (readonly Keyframe[])[] = [
  keys(
    [
      0,
      pose("guard", {
        leftHand: [-24, 88],
        rightHand: [88, 48],
        leftFoot: [-58, 205],
        rightFoot: [38, 205],
      }),
    ],
    [0.18, "punch"],
    [0.28, "ready"],
    [0.42, "kick"],
    [0.52, "guard"],
    [0.67, "highkick"],
    [0.8, "salute"],
    [1, "run"],
  ),
  keys(
    [0, "ready"],
    [0.16, pose("punch", { rightHand: [84, 50] })],
    [0.34, "kick"],
    [0.5, "bow"],
    [0.65, "salute"],
    [0.82, "highkick"],
    [1, "run"],
  ),
  keys(
    [0, "run"],
    [0.12, "run2"],
    [0.28, pose("open", { rightFoot: [100, 149] })],
    [0.44, "low"],
    [0.58, "highkick"],
    [0.69, "fall"],
    [0.83, "bow"],
    [1, "run"],
  ),
  keys(
    [0, pose("ready", { rightHand: [56, 52], leftHand: [45, 71] })],
    [0.19, pose("cross", { leftHand: [66, 58], rightHand: [32, 42] })],
    [0.37, "block"],
    [0.55, pose("punch", { rightHand: [70, 57] })],
    [0.7, "cross"],
    [0.86, "salute"],
    [1, "guard"],
  ),
  keys(
    [0, pose("dance", { leftHand: [-39, 33], rightHand: [69, 47] })],
    [0.2, "danceStep"],
    [0.4, pose("dance", { leftFoot: [-50, 200], rightFoot: [38, 186] })],
    [0.56, "spin"],
    [0.75, "danceStep"],
    [1, "open"],
  ),
  keys(
    [0, pose("ready", { leftHand: [25, 45], rightHand: [50, 54] })],
    [0.14, "punch"],
    [0.27, pose("block", { leftHand: [8, 26], rightHand: [40, 30] })],
    [0.4, "cross"],
    [0.52, "low"],
    [0.68, pose("punch", { rightHand: [94, 43] })],
    [0.82, "ready"],
    [1, "victory"],
  ),
  keys(
    [0, "ready"],
    [0.2, pose("highkick", { rightFoot: [87, 41] })],
    [0.38, "low"],
    [0.54, pose("punch", { leftHand: [15, 46], rightHand: [78, 44] })],
    [0.75, "salute"],
    [1, "guard"],
  ),
  keys(
    [0, pose("guard", { leftFoot: [-62, 205], rightFoot: [30, 205] })],
    [0.19, "punch"],
    [0.34, "block"],
    [0.48, "kick"],
    [0.65, "cross"],
    [0.82, "salute"],
    [1, "open"],
  ),
  keys(
    [
      0,
      pose("ready", {
        leftHand: [20, 72],
        rightHand: [47, 57],
        leftFoot: [-64, 205],
        rightFoot: [25, 205],
      }),
    ],
    [0.18, pose("punch", { rightHand: [89, 56] })],
    [
      0.3,
      pose("knee", {
        leftHand: [29, 50],
        rightHand: [61, 43],
        rightFoot: [32, 143],
      }),
    ],
    [0.42, pose("punch", { rightFoot: [26, 154], leftHand: [18, 62] })],
    [0.56, "kick"],
    [0.72, "cross"],
    [0.88, "salute"],
    [1, "ready"],
  ),
  keys(
    [0, "run"],
    [0.13, "ready"],
    [0.24, "bow"],
    [0.45, "low"],
    [0.59, "ready"],
    [0.66, pose("punch", { rightHand: [67, 54], lean: 8 })],
    [0.74, pose("punch", { rightHand: [83, 54], lean: 16 })],
    [0.86, "salute"],
    [1, "run"],
  ),
  keys(
    [0, "ready"],
    [0.13, "punch"],
    [0.29, "kick"],
    [0.43, "block"],
    [0.6, "highkick"],
    [0.75, "cross"],
    [0.87, "low"],
    [1, "salute"],
  ),
  keys(
    [0, "guard"],
    [0.18, pose("punch", { leftFoot: [-55, 205], rightFoot: [20, 205] })],
    [0.32, "block"],
    [0.48, "kick"],
    [0.65, "cross"],
    [0.85, "salute"],
    [1, "ready"],
  ),
  keys(
    [0, "ready"],
    [0.16, "punch"],
    [0.34, "highkick"],
    [0.48, pose("punch", { rightHand: [99, 52] })],
    [0.64, "kick"],
    [0.82, "low"],
    [1, "salute"],
  ),
  keys(
    [0, "sit"],
    [0.16, pose("talk", { leftHand: [45, 63] })],
    [0.34, "sit"],
    [0.52, pose("talk", { rightHand: [65, 74], leftHand: [33, 80] })],
    [0.72, "sit"],
    [1, "talk"],
  ),
  keys(
    [0, "ready"],
    [0.16, "punch"],
    [0.28, "block"],
    [0.43, "kick"],
    [0.58, "highkick"],
    [0.72, "cross"],
    [0.9, "salute"],
    [1, "guard"],
  ),
  keys(
    [0, "ready"],
    [0.16, "kick"],
    [0.29, pose("highkick", { leftFoot: [-38, 184], rightFoot: [96, 57] })],
    [0.42, "open"],
    [0.6, "cross"],
    [0.79, "salute"],
    [1, "ready"],
  ),
  keys(
    [0, "ready"],
    [0.17, "punch"],
    [0.33, "block"],
    [0.48, "kick"],
    [0.64, "highkick"],
    [0.8, "cross"],
    [1, "salute"],
  ),
  keys(
    [0, pose("ready", { leftFoot: [-34, 205], rightFoot: [52, 205] })],
    [0.17, "punch"],
    [0.32, "block"],
    [0.48, pose("low", { leftHand: [35, 81], rightHand: [61, 80] })],
    [0.62, pose("punch", { rightHand: [110, 54] })],
    [0.77, "ready"],
    [0.9, "salute"],
    [1, "run"],
  ),
  keys(
    [0, "ready"],
    [0.15, "punch"],
    [0.31, "block"],
    [0.48, "highkick"],
    [0.62, "cross"],
    [0.81, "statue"],
    [1, "guard"],
  ),
  keys(
    [0, "open"],
    [0.13, "highkick"],
    [0.27, "spin"],
    [0.42, "statue"],
    [0.7, "statue"],
    [1, "statue"],
  ),
];
type Root = readonly [number, number, number, number];
const roots: readonly (readonly Root[])[] = [
  [
    [0, 217, 434, 1.3],
    [0.75, 235, 434, 1.3],
    [1, 390, 434, 1.3],
  ],
  [
    [0, 238, 434, 1.12],
    [0.8, 247, 434, 1.12],
    [1, 430, 434, 1.12],
  ],
  [
    [0, 172, 439, 0.99],
    [0.32, 255, 426, 0.99],
    [0.7, 240, 439, 0.99],
    [1, 381, 439, 0.99],
  ],
  [
    [0, 209, 440, 1.08],
    [0.5, 219, 440, 1.08],
    [1, 209, 440, 1.08],
  ],
  [
    [0, 207, 455, 1.12],
    [0.3, 230, 455, 1.12],
    [0.65, 207, 455, 1.12],
    [1, 224, 455, 1.12],
  ],
  [
    [0, 145, 402, 0.8],
    [0.5, 157, 402, 0.8],
    [1, 158, 402, 0.8],
  ],
  [
    [0, 377, 407, 0.73],
    [0.5, 389, 407, 0.73],
    [1, 382, 407, 0.73],
  ],
  [
    [0, 248, 447, 1.1],
    [0.6, 256, 447, 1.1],
    [1, 248, 447, 1.1],
  ],
  [
    [0, 194, 446, 1.16],
    [0.46, 204, 446, 1.16],
    [1, 194, 446, 1.16],
  ],
  [
    [0, 228, 420, 0.89],
    [0.25, 239, 420, 0.89],
    [1, 228, 420, 0.89],
  ],
  [
    [0, 199, 447, 1.13],
    [0.5, 211, 447, 1.13],
    [1, 219, 447, 1.13],
  ],
  [
    [0, 210, 451, 1.08],
    [0.5, 226, 451, 1.08],
    [1, 210, 451, 1.08],
  ],
  [
    [0, 225, 449, 1.08],
    [0.5, 238, 449, 1.08],
    [1, 230, 449, 1.08],
  ],
  [
    [0, 264, 357, 0.73],
    [1, 264, 357, 0.73],
  ],
  [
    [0, 193, 450, 1.13],
    [0.5, 227, 450, 1.13],
    [1, 213, 450, 1.13],
  ],
  [
    [0, 183, 444, 1.12],
    [0.3, 246, 393, 1.12],
    [0.5, 228, 444, 1.12],
    [1, 219, 444, 1.12],
  ],
  [
    [0, 229, 446, 1.08],
    [0.5, 247, 446, 1.08],
    [1, 229, 446, 1.08],
  ],
  [
    [0, 158, 433, 1.06],
    [0.5, 171, 433, 1.06],
    [1, 158, 433, 1.06],
  ],
  [
    [0, 221, 446, 1.13],
    [0.5, 236, 446, 1.13],
    [1, 217, 446, 1.13],
  ],
  [
    [0, 249, 460, 1.1],
    [0.35, 249, 421, 1.1],
    [1, 249, 421, 1.1],
  ],
];
export function performanceAt(index: number, phase: number) {
  const keys = roots[index],
    t = clamp(phase);
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i],
    b = keys[i + 1],
    p = smooth((t - a[0]) / (b[0] - a[0]));
  return {
    x: mix(a[1], b[1], p),
    y: mix(a[2], b[2], p),
    scale: mix(a[3], b[3], p),
    pose: poseAt(choreography[index], t),
  };
}
/** Continuous plank targets rather than rotating a standing person into the floor. */
export function pushUpAt(phase: number) {
  return blend(
    pose("guard", {
      lean: 65,
      hipY: 104,
      shoulderY: 94,
      head: 0.1,
      leftHand: [70, 164],
      rightHand: [76, 164],
      leftFoot: [-119, 160],
      rightFoot: [-109, 160],
    }),
    pose("guard", {
      lean: 57,
      hipY: 116,
      shoulderY: 123,
      head: 0.1,
      leftHand: [67, 164],
      rightHand: [76, 164],
      leftFoot: [-121, 160],
      rightFoot: [-109, 160],
    }),
    0.5 - 0.5 * Math.cos(phase * Math.PI * 6),
  );
}
