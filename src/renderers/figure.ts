import { circle, line, path, type Ctx } from "./draw";
import { jointsAt, type Point, type Pose } from "../animation/poses";
export interface Costume {
  skin: string;
  hair: string;
  top: string;
  pants: string;
  shoe: string;
  outline?: string;
  lineArt?: boolean;
  female?: boolean;
  stripe?: string;
  mask?: boolean;
  sleeves?: boolean;
  collar?: boolean;
  paperCut?: boolean;
  gloves?: boolean;
  bald?: boolean;
  glasses?: boolean;
  shorts?: boolean;
  hat?: boolean;
}
export const costumes: Costume[] = [
  {
    skin: "#b2222b",
    hair: "#ad2028",
    top: "#b2222b",
    pants: "#b2222b",
    shoe: "#b2222b",
    outline: "#941b25",
    paperCut: true,
  },
  {
    skin: "#bcbfaf",
    hair: "#252c24",
    top: "#737c6d",
    sleeves: true,
    pants: "#737c6d",
    shoe: "#292f24",
  },
  {
    shorts: true,
    skin: "#d7b58a",
    hair: "#242c22",
    top: "#f0efdb",
    pants: "#263c34",
    shoe: "#202a23",
  },
  {
    skin: "#989e88",
    hair: "#252d22",
    top: "#929882",
    pants: "#343e32",
    shoe: "#273124",
    outline: "#333b2f",
    lineArt: true,
  },
  {
    skin: "#d9ad79",
    hair: "#171e17",
    top: "#171e19",
    sleeves: true,
    pants: "#171e19",
    shoe: "#151c17",
  },
  {
    gloves: true,
    skin: "#b7bdab",
    hair: "#293026",
    top: "#b7bdab",
    pants: "#edeedb",
    shoe: "#e5e9d7",
  },
  {
    sleeves: true,
    skin: "#d4b085",
    hair: "#292d25",
    top: "#6a7480",
    pants: "#333e4b",
    shoe: "#242e37",
  },
  {
    skin: "rgba(210,225,197,.07)",
    hair: "#e0e6ce",
    top: "rgba(210,225,197,.07)",
    pants: "rgba(210,225,197,.07)",
    shoe: "rgba(210,225,197,.07)",
    outline: "#e8efd7",
    lineArt: true,
  },
  {
    skin: "#e0be95",
    hair: "#2c2824",
    top: "#35312b",
    pants: "#37352f",
    shoe: "#35332e",
  },
  {
    sleeves: true,
    skin: "#d6ad7a",
    hair: "#222a21",
    top: "#242b20",
    pants: "#242b20",
    shoe: "#242b20",
  },
  {
    skin: "#cda474",
    hair: "#121c1d",
    top: "#131d1e",
    pants: "#131d1e",
    shoe: "#111b1c",
    collar: true,
    mask: true,
    hat: true,
    sleeves: true,
  },
  {
    skin: "rgba(102,128,177,.07)",
    hair: "#334879",
    top: "rgba(102,128,177,.07)",
    pants: "rgba(102,128,177,.07)",
    shoe: "#b7c0cc",
    outline: "#394e85",
    lineArt: true,
  },
  {
    collar: true,
    skin: "#d5d7c3",
    hair: "#333c32",
    top: "#bcbfaf",
    sleeves: true,
    pants: "#bcbfaf",
    shoe: "#a9b19e",
  },
  {
    skin: "#b6beac",
    hair: "#243026",
    top: "#5c675b",
    sleeves: true,
    pants: "#414f42",
    shoe: "#3b483e",
  },
  {
    skin: "#d5ab7e",
    hair: "#1b2421",
    top: "#e6e8d6",
    pants: "#20344b",
    shoe: "#152930",
  },
  {
    skin: "#d8b58c",
    hair: "#242d23",
    top: "#efeddb",
    sleeves: true,
    pants: "#efeddb",
    shoe: "#d9c29c",
  },
  {
    skin: "#d3bb83",
    hair: "#34402c",
    top: "#d3bb83",
    pants: "#28372a",
    shoe: "#293a2b",
  },
  {
    skin: "#d8af7d",
    hair: "#1f2b23",
    top: "#edcf34",
    pants: "#edcf34",
    shoe: "#e4c934",
    outline: "#313221",
    stripe: "#36352a",
  },
  {
    skin: "#d8aa79",
    hair: "#17231c",
    top: "#d8aa79",
    pants: "#141f21",
    shoe: "#152122",
  },
  {
    skin: "#d2ac6b",
    hair: "#232920",
    top: "#d2ac6b",
    pants: "#192627",
    shoe: "#142122",
  },
];
function limb(
  c: Ctx,
  points: number[],
  fill: string,
  width: number,
  outline?: string,
  lineArt = false,
) {
  // Taper the upper/lower segments instead of using uniform capsule strokes.
  const left: Point[] = [],
    right: Point[] = [];
  for (let i = 0; i < points.length; i += 2) {
    const prev = Math.max(0, i - 2),
      next = Math.min(points.length - 2, i + 2);
    const dx = points[next] - points[prev],
      dy = points[next + 1] - points[prev + 1];
    const length = Math.hypot(dx, dy) || 1;
    const radius =
      width * (i === 0 ? 0.58 : i === points.length - 2 ? 0.28 : 0.45);
    left.push([
      points[i] - (dy / length) * radius,
      points[i + 1] + (dx / length) * radius,
    ]);
    right.push([
      points[i] + (dy / length) * radius,
      points[i + 1] - (dx / length) * radius,
    ]);
  }
  // Rounded contour at the elbow/knee, with a broad muscle and a narrow wrist/ankle.
  const middle = (a: Point, b: Point): Point => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  const coordinate = (p: Point) => p.join(" ");
  const contour = `M${coordinate(left[0])}L${coordinate(middle(left[0], left[1]))}Q${coordinate(left[1])} ${coordinate(middle(left[1], left[2]))}L${coordinate(left[2])}Q${coordinate([points[4], points[5]])} ${coordinate(right[2])}L${coordinate(middle(right[2], right[1]))}Q${coordinate(right[1])} ${coordinate(middle(right[1], right[0]))}L${coordinate(right[0])}Z`;
  path(c, contour, fill, outline, lineArt ? 1 : 0.65);
}
function shoe(c: Ctx, foot: Point, knee: Point, color: string, facing: number) {
  c.save();
  c.translate(...foot);
  if (foot[1] < 196)
    c.rotate(
      Math.max(
        -1.45,
        Math.min(
          1.45,
          Math.atan2(foot[1] - knee[1], foot[0] - knee[0]) - Math.PI / 2,
        ),
      ),
    );
  path(c, `M-5 -4q7 -3 11 0l${facing * 7} 4q1 4 -7 4l-12 -1Z`, color);
  c.restore();
}
export function drawFigure(
  c: Ctx,
  x: number,
  ground: number,
  pose: Pose,
  costume: Costume,
  scale = 1,
  facing = 1,
  rotation = 0,
  alpha = 1,
  shadowGround = ground,
) {
  c.save();
  c.globalAlpha *= alpha;
  if (!costume.paperCut && !costume.lineArt) {
    c.save();
    c.globalAlpha *= 0.13;
    c.fillStyle = "#27251f";
    c.beginPath();
    c.ellipse(
      x + scale * (pose.leftFoot[0] + pose.rightFoot[0]) * 0.15,
      shadowGround + 3 * scale,
      43 * scale,
      6 * scale,
      0,
      0,
      Math.PI * 2,
    );
    c.fill();
    c.restore();
  }
  c.translate(x, ground);
  c.rotate(rotation);
  // A turn changes the silhouette gently; it never collapses the actor to a line.
  const turn = 0.85 + 0.15 * Math.cos(pose.turn * Math.PI * 2);
  c.scale(scale * facing * turn, scale);
  c.translate(0, -205);
  const sh: Point = [pose.lean, pose.shoulderY ?? 47],
    hip: Point = [0, pose.hipY],
    lh = pose.leftHand,
    rh = pose.rightHand;
  const {
    leftElbow: le,
    rightElbow: re,
    leftKnee: lk,
    rightKnee: rk,
  } = jointsAt(pose);
  const outline = costume.outline ?? "rgba(45,35,27,.22)";
  c.save();
  c.globalAlpha *= costume.lineArt || costume.paperCut ? 1 : 0.96;
  limb(
    c,
    [-6, hip[1], lk[0], lk[1], ...pose.leftFoot],
    costume.shorts ? costume.skin : costume.pants,
    13,
    outline,
    costume.lineArt,
  );
  if (costume.shorts)
    limb(
      c,
      [
        -6,
        hip[1],
        -6 + (lk[0] + 6) * 0.28,
        hip[1] + (lk[1] - hip[1]) * 0.28,
        -6 + (lk[0] + 6) * 0.57,
        hip[1] + (lk[1] - hip[1]) * 0.57,
      ],
      costume.pants,
      17,
      outline,
    );
  if (costume.stripe)
    line(c, [-6, hip[1], lk[0], lk[1], ...pose.leftFoot], costume.stripe, 2.2);
  shoe(c, pose.leftFoot, lk, costume.shoe, -1);
  limb(
    c,
    [sh[0] - 8, sh[1], ...le, ...lh],
    costume.sleeves ? costume.top : costume.skin,
    8,
    outline,
    costume.lineArt,
  );
  circle(
    c,
    lh[0],
    lh[1],
    costume.gloves ? 7 : 3.6,
    costume.gloves ? costume.pants : costume.skin,
    outline,
    0.5,
  );
  c.restore();
  limb(
    c,
    [6, hip[1], rk[0], rk[1], ...pose.rightFoot],
    costume.shorts ? costume.skin : costume.pants,
    14,
    outline,
    costume.lineArt,
  );
  if (costume.shorts)
    limb(
      c,
      [
        6,
        hip[1],
        6 + (rk[0] - 6) * 0.28,
        hip[1] + (rk[1] - hip[1]) * 0.28,
        6 + (rk[0] - 6) * 0.57,
        hip[1] + (rk[1] - hip[1]) * 0.57,
      ],
      costume.pants,
      17,
      outline,
    );
  if (costume.stripe)
    line(c, [6, hip[1], rk[0], rk[1], ...pose.rightFoot], costume.stripe, 2.2);
  shoe(c, pose.rightFoot, rk, costume.shoe, 1);
  const bodyLength = Math.hypot(hip[0] - sh[0], hip[1] - sh[1]) || 1;
  const ux = (hip[0] - sh[0]) / bodyLength,
    uy = (hip[1] - sh[1]) / bodyLength;
  const nx = uy,
    ny = -ux;
  const at = (origin: Point, normal: number, along: number) =>
    `${origin[0] + nx * normal + ux * along} ${origin[1] + ny * normal + uy * along}`;
  const shoulderWidth = 12 + (pose.front ?? 0) * 4;
  const waist: Point = [
    sh[0] + (hip[0] - sh[0]) * 0.68,
    sh[1] + (hip[1] - sh[1]) * 0.68,
  ];
  const body = `M${at(sh, -shoulderWidth, 0)}Q${at(sh, 0, -7)} ${at(sh, shoulderWidth, 0)}C${at(sh, shoulderWidth + 1, 16)} ${at(waist, 8.5, -12)} ${at(waist, 8.5, 0)}Q${at(hip, 13, -8)} ${at(hip, 11, 3)}Q${at(hip, 0, 7)} ${at(hip, -11, 3)}Q${at(hip, -13, -8)} ${at(waist, -8.5, 0)}C${at(waist, -8.5, -12)} ${at(sh, -shoulderWidth, 16)} ${at(sh, -shoulderWidth, 0)}Z`;
  path(c, body, costume.top, outline, 0.8);
  if (costume.collar && !costume.lineArt && !costume.female) {
    path(
      c,
      `M${at(sh, -5, -2)}L${at(sh, 0, 15)}L${at(sh, 6, -2)}L${at(sh, 0, 2)}Z`,
      "#e8e3d1",
      outline,
      0.4,
    );
    line(c, [sh[0], sh[1] + 13, hip[0], hip[1] - 3], outline, 0.65);
  }
  if (costume.female) {
    path(
      c,
      `M-13 ${hip[1] - 3}L14 ${hip[1] - 3}L30 ${hip[1] + 71}L-29 ${hip[1] + 71}Z`,
      costume.top,
      outline,
      0.8,
    );
    line(c, [-12, hip[1], 14, hip[1]], "#521d20", 2);
  }
  if (costume.top !== costume.skin && !costume.lineArt)
    line(c, [-13, hip[1] + 3, 13, hip[1] + 3], costume.pants, 3);
  if (costume.stripe) {
    line(c, [sh[0] - 8, 47, -9, hip[1]], costume.stripe, 2);
    line(c, [sh[0] + 11, 49, 11, hip[1]], costume.stripe, 2);
  }
  limb(
    c,
    [sh[0] + 8, sh[1] + 1, ...re, ...rh],
    costume.sleeves ? costume.top : costume.skin,
    8,
    outline,
    costume.lineArt,
  );
  circle(
    c,
    rh[0],
    rh[1],
    costume.gloves ? 7 : 3.6,
    costume.gloves ? costume.pants : costume.skin,
    outline,
    0.5,
  );
  line(
    c,
    [sh[0] - ux * 8, sh[1] - uy * 8, sh[0] - ux * 16, sh[1] - uy * 16],
    costume.skin,
    6,
  );
  c.save();
  const headOffset = costume.paperCut ? 23 : 17.5;
  c.translate(sh[0] - ux * headOffset, sh[1] - uy * headOffset);
  c.rotate(pose.head);
  c.scale(costume.paperCut ? 0.9 : 0.95, costume.paperCut ? 0.9 : 0.95);
  if (costume.paperCut) {
    const front = pose.front ?? 0;
    c.save();
    c.globalAlpha *= 1 - front;
    path(
      c,
      "M-12 -11Q-12 -24 2 -23Q15 -20 13 -8L18 -1L13 2L12 8L3 16L-5 12L-9 3Z",
      costume.skin,
    );
    line(c, [5, -4, 11, -3], "#f6ddb0", 1.1);
    line(c, [8, 7, 13, 7], "#f6ddb0", 1);
    line(c, [-7, -7, -5, 5], "#f6ddb0", 0.8);
    c.restore();
    c.save();
    c.globalAlpha *= front;
    path(
      c,
      "M-15 -11Q-17 -23 0 -23Q17 -23 16 -10L14 8Q9 20 0 22Q-9 20 -14 8Z",
      costume.skin,
    );
    line(c, [-10, -3, -3, -1], "#f6ddb0", 1.5);
    line(c, [3, -1, 10, -3], "#f6ddb0", 1.5);
    line(c, [-8, 3, -3, 3], "#f6ddb0", 1.3);
    line(c, [3, 3, 8, 3], "#f6ddb0", 1.3);
    line(c, [-4, 13, 5, 13], "#f6ddb0", 1);
    c.restore();
  } else {
    const front = pose.front ?? 0;
    c.save();
    c.globalAlpha *= 1 - front;
    path(
      c,
      "M-9 -12Q-8 -22 4 -21Q13 -19 12 -10L12 -6L17 -1L13 1L12 7L5 12L-3 10L-7 4Z",
      costume.skin,
      outline,
      0.6,
    );
    if (!costume.bald)
      path(
        c,
        "M-8 7Q-16 1 -13 -12Q-11 -23 1 -25Q14 -25 14 -14L9 -10L4 -13L-1 -10L-4 1Z",
        costume.hair,
        outline,
        0.5,
      );
    circle(c, -5, 1, 2.4, costume.skin, outline, 0.4);
    line(c, [7, -6, 11, -5], costume.hair, 0.9);
    line(c, [8, 5, 12, 5], costume.hair, 0.55);
    if (costume.glasses) path(c, "M0 -8L13 -7L12 -1L3 0Z", costume.hair);
    if (costume.mask) path(c, "M-2 -9L14 -8L14 -2L1 -1Z", "#080f12");
    if (costume.hat)
      path(
        c,
        "M-17 -13L19 -13L17 -16L11 -16L9 -26L-10 -26L-13 -17L-17 -16Z",
        costume.hair,
      );
    c.restore();
    if (front > 0) {
      c.save();
      c.globalAlpha *= front;
      path(
        c,
        "M-12 -12Q-11 -24 1 -23Q15 -22 13 -10L12 5Q8 15 0 16Q-9 13 -12 4Z",
        costume.skin,
        outline,
        0.6,
      );
      if (!costume.bald)
        path(
          c,
          "M-12 1Q-18 -13 -8 -22Q4 -29 14 -18L13 -9L7 -13L-1 -11L-8 -13L-9 1Z",
          costume.hair,
          outline,
          0.6,
        );
      line(c, [-8, -3, -3, -4], costume.hair, 0.7);
      line(c, [3, -4, 8, -3], costume.hair, 0.7);
      line(c, [0, -1, -1, 5, 2, 5], outline, 0.6);
      line(c, [-3, 10, 4, 10], costume.hair, 0.55);
      if (costume.mask || costume.glasses)
        path(c, "M-11 -6L11 -6L9 1L-9 1Z", costume.hair);
      if (costume.hat)
        path(c, "M-18 -13L18 -13L11 -17L9 -26L-10 -26L-12 -17Z", costume.hair);
      c.restore();
    }
  }
  c.restore();
  if (costume.paperCut) {
    c.save();
    c.setLineDash([3, 4]);
    line(c, [sh[0] + 8, sh[1] + 1, ...re, ...rh], "#f6ddb0", 0.9);
    line(c, [6, hip[1], ...rk, ...pose.rightFoot], "#f6ddb0", 0.9);
    c.restore();
  }
  if (costume.top === costume.skin && !costume.paperCut && !costume.lineArt) {
    line(
      c,
      [sh[0] - 8, 59, sh[0], 62, sh[0] + 9, 58],
      "rgba(67,45,25,.22)",
      0.6,
    );
    line(c, [1, 72, 2, 96], "rgba(67,45,25,.18)", 0.5);
  }
  if (costume.lineArt) {
    for (const pt of [sh, hip, le, re, lk, rk, lh, rh])
      circle(c, pt[0], pt[1], pt === hip ? 9 : 4, "", outline, 0.8);
    line(
      c,
      [sh[0] - 12, 46, 12, hip[1], sh[0] + 12, 46, -12, hip[1]],
      outline!,
      0.7,
    );
  }
  c.restore();
}
