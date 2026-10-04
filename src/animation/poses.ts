import { clamp, mix, smooth } from "./timeline";
export type Point = [number, number];
export interface Pose {
  lean: number;
  shoulderY?: number;
  front?: number;
  leftElbow?: Point;
  rightElbow?: Point;
  leftKnee?: Point;
  rightKnee?: Point;
  head: number;
  leftHand: Point;
  rightHand: Point;
  leftFoot: Point;
  rightFoot: Point;
  hipY: number;
  turn: number;
}
const base: Pose = {
  lean: 0,
  head: 0,
  leftHand: [-9, 82],
  rightHand: [39, 62],
  leftFoot: [-30, 205],
  rightFoot: [34, 205],
  hipY: 112,
  turn: 0,
};
export const poses: Record<string, Pose> = {
  guard: base,
  ready: {
    ...base,
    lean: 5,
    leftHand: [29, 53],
    rightHand: [48, 70],
    leftFoot: [-33, 205],
    rightFoot: [41, 205],
  },
  punch: {
    ...base,
    lean: 15,
    head: -0.05,
    leftHand: [21, 62],
    rightHand: [90, 49],
    leftFoot: [-47, 205],
    rightFoot: [33, 205],
  },
  cross: {
    ...base,
    lean: 8,
    leftHand: [76, 48],
    rightHand: [24, 63],
    leftFoot: [-21, 205],
    rightFoot: [48, 205],
  },
  kick: {
    ...base,
    lean: -16,
    head: -0.13,
    leftHand: [-10, 62],
    rightHand: [48, 68],
    leftFoot: [-29, 205],
    rightFoot: [108, 98],
  },
  highkick: {
    ...base,
    lean: -22,
    head: -0.2,
    leftHand: [-22, 78],
    rightHand: [27, 52],
    leftFoot: [-21, 205],
    rightFoot: [99, 23],
  },
  knee: {
    ...base,
    lean: 8,
    leftHand: [23, 53],
    rightHand: [49, 47],
    leftFoot: [-18, 205],
    rightFoot: [61, 123],
  },
  low: {
    ...base,
    lean: 30,
    hipY: 143,
    leftHand: [51, 91],
    rightHand: [68, 112],
    leftFoot: [-62, 205],
    rightFoot: [39, 205],
  },
  block: {
    ...base,
    lean: -9,
    leftHand: [9, 14],
    rightHand: [40, 24],
    leftFoot: [-45, 205],
    rightFoot: [30, 205],
  },
  recoil: {
    ...base,
    lean: -26,
    head: -0.15,
    leftHand: [-18, 35],
    rightHand: [11, 5],
    leftFoot: [-54, 205],
    rightFoot: [31, 205],
  },
  bow: {
    ...base,
    lean: 34,
    head: 0.5,
    leftHand: [46, 106],
    rightHand: [47, 105],
    leftFoot: [-16, 205],
    rightFoot: [18, 205],
  },
  salute: {
    ...base,
    lean: 0,
    leftHand: [26, 69],
    rightHand: [19, 65],
    leftFoot: [-16, 205],
    rightFoot: [18, 205],
  },
  open: {
    ...base,
    lean: -6,
    leftHand: [-75, 50],
    rightHand: [65, 31],
    leftFoot: [-55, 205],
    rightFoot: [23, 205],
  },
  dance: {
    ...base,
    lean: -8,
    leftHand: [-63, 58],
    rightHand: [50, 46],
    leftFoot: [-39, 205],
    rightFoot: [26, 193],
  },
  danceStep: {
    ...base,
    lean: 8,
    leftHand: [-58, 55],
    rightHand: [42, 44],
    leftFoot: [-11, 185],
    rightFoot: [49, 205],
  },
  spin: {
    ...base,
    lean: 0,
    leftHand: [-33, 17],
    rightHand: [47, 8],
    leftFoot: [-22, 205],
    rightFoot: [31, 193],
    turn: 0.8,
  },
  run: {
    ...base,
    lean: 22,
    leftHand: [-12, 61],
    rightHand: [50, 46],
    leftFoot: [-46, 171],
    rightFoot: [49, 205],
  },
  run2: {
    ...base,
    lean: 13,
    leftHand: [53, 57],
    rightHand: [-12, 66],
    leftFoot: [-40, 205],
    rightFoot: [38, 169],
  },
  victory: {
    ...base,
    leftHand: [-37, -29],
    rightHand: [33, -31],
    leftFoot: [-30, 205],
    rightFoot: [29, 205],
  },
  statue: {
    ...base,
    lean: 8,
    head: -0.05,
    leftHand: [15, 64],
    rightHand: [89, 59],
    leftFoot: [-69, 193],
    rightFoot: [25, 205],
  },
  sit: {
    ...base,
    lean: 8,
    hipY: 128,
    leftHand: [36, 90],
    rightHand: [29, 87],
    leftFoot: [56, 205],
    rightFoot: [68, 205],
  },
  talk: {
    ...base,
    lean: 11,
    hipY: 128,
    leftHand: [56, 74],
    rightHand: [45, 103],
    leftFoot: [56, 205],
    rightFoot: [68, 205],
  },
  fall: {
    ...base,
    lean: -17,
    leftHand: [-54, 24],
    rightHand: [43, 8],
    leftFoot: [-71, 184],
    rightFoot: [68, 179],
  },
};
function bendJoint(a: Point, b: Point, length: number, bend: number): Point {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    d = Math.max(0.01, Math.hypot(dx, dy));
  const height = Math.sqrt(
    Math.max(0, length * length - Math.min(d / 2, length) ** 2),
  );
  return [
    a[0] + dx * 0.5 - (dy / d) * height * bend,
    a[1] + dy * 0.5 + (dx / d) * height * bend,
  ];
}
/** Explicit joint targets override IK for contacts, planted stances and airborne poses. */
export function jointsAt(pose: Pose) {
  const y = pose.shoulderY ?? 47;
  return {
    leftElbow:
      pose.leftElbow ?? bendJoint([pose.lean - 8, y], pose.leftHand, 38, 1),
    rightElbow:
      pose.rightElbow ?? bendJoint([pose.lean + 8, y], pose.rightHand, 38, 1),
    leftKnee:
      pose.leftKnee ?? bendJoint([-6, pose.hipY], pose.leftFoot, 51, -1),
    rightKnee:
      pose.rightKnee ?? bendJoint([6, pose.hipY], pose.rightFoot, 51, -1),
  };
}
export function blend(a: Pose, b: Pose, t: number): Pose {
  const point = (p: Point, q: Point): Point => [
    mix(p[0], q[0], t),
    mix(p[1], q[1], t),
  ];
  const aj = jointsAt(a),
    bj = jointsAt(b);
  return {
    front: mix(a.front ?? 0, b.front ?? 0, t),
    leftElbow: point(aj.leftElbow, bj.leftElbow),
    rightElbow: point(aj.rightElbow, bj.rightElbow),
    leftKnee: point(aj.leftKnee, bj.leftKnee),
    rightKnee: point(aj.rightKnee, bj.rightKnee),
    lean: mix(a.lean, b.lean, t),
    shoulderY: mix(a.shoulderY ?? 47, b.shoulderY ?? 47, t),
    head: mix(a.head, b.head, t),
    leftHand: point(a.leftHand, b.leftHand),
    rightHand: point(a.rightHand, b.rightHand),
    leftFoot: point(a.leftFoot, b.leftFoot),
    rightFoot: point(a.rightFoot, b.rightFoot),
    hipY: mix(a.hipY, b.hipY, t),
    turn: mix(a.turn, b.turn, t),
  };
}
export type Keyframe = readonly [number, string | Pose];
export function poseAt(sequence: readonly Keyframe[], phase: number): Pose {
  const t = clamp(phase);
  let i = 0;
  while (i < sequence.length - 2 && t > sequence[i + 1][0]) i++;
  const a = sequence[i],
    b = sequence[i + 1];
  return blend(
    typeof a[1] === "string" ? poses[a[1]] : a[1],
    typeof b[1] === "string" ? poses[b[1]] : b[1],
    smooth((t - a[0]) / (b[0] - a[0])),
  );
}
