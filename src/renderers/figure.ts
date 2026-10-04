import { circle, line, path, type Ctx } from "./draw";
import type { Point, Pose } from "../animation/poses";
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
  paperCut?: boolean;
  gloves?: boolean;
  bald?: boolean;
  glasses?: boolean;
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
    mask: true,
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
function joint(a: Point, b: Point, length: number, bend: number): Point {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    d = Math.max(0.01, Math.hypot(dx, dy)),
    mid = Math.min(d / 2, length),
    h = Math.sqrt(Math.max(0, length * length - mid * mid));
  return [
    a[0] + dx * 0.5 - (dy / d) * h * bend,
    a[1] + dy * 0.5 + (dx / d) * h * bend,
  ];
}
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
  const pts = [...left, ...right.reverse()];
  path(
    c,
    "M" + pts.map((pt) => pt.join(" ")).join("L") + "Z",
    fill,
    outline,
    lineArt ? 1 : 0.65,
  );
}
function shoe(c: Ctx, foot: Point, color: string, facing: number) {
  path(
    c,
    `M${foot[0] - 5} ${foot[1] - 4}q8 -5 14 0l${facing * 8} 5q0 3 -10 3l-13 -1Z`,
    color,
  );
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
) {
  c.save();
  c.globalAlpha *= alpha;
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
  const le = joint([sh[0] - 8, sh[1] + 1], lh, 38, 1),
    re = joint([sh[0] + 8, sh[1] + 1], rh, 38, 1);
  const lk = joint([-6, hip[1]], pose.leftFoot, 51, -1),
    rk = joint([6, hip[1]], pose.rightFoot, 51, -1);
  const outline = costume.outline ?? "rgba(45,35,27,.22)";
  c.save();
  c.globalAlpha *= costume.lineArt || costume.paperCut ? 1 : 0.96;
  limb(
    c,
    [-6, hip[1], lk[0], lk[1], ...pose.leftFoot],
    costume.pants,
    13,
    outline,
    costume.lineArt,
  );
  if (costume.stripe)
    line(c, [-6, hip[1], lk[0], lk[1], ...pose.leftFoot], costume.stripe, 2.2);
  shoe(c, pose.leftFoot, costume.shoe, -1);
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
    costume.pants,
    14,
    outline,
    costume.lineArt,
  );
  if (costume.stripe)
    line(c, [6, hip[1], rk[0], rk[1], ...pose.rightFoot], costume.stripe, 2.2);
  shoe(c, pose.rightFoot, costume.shoe, 1);
  const bodyLength = Math.hypot(hip[0] - sh[0], hip[1] - sh[1]) || 1;
  const ux = (hip[0] - sh[0]) / bodyLength,
    uy = (hip[1] - sh[1]) / bodyLength;
  const nx = uy,
    ny = -ux;
  const at = (origin: Point, normal: number, along: number) =>
    `${origin[0] + nx * normal + ux * along} ${origin[1] + ny * normal + uy * along}`;
  const body = `M${at(sh, -14, 0)}Q${at(sh, 0, -9)} ${at(sh, 14, 0)}C${at(sh, 15, 20)} ${at(hip, 12, -15)} ${at(hip, 12, 1)}Q${at(hip, 0, 8)} ${at(hip, -12, 1)}C${at(hip, -14, -15)} ${at(sh, -14, 20)} ${at(sh, -14, 0)}Z`;
  path(c, body, costume.top, outline, 0.8);
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
  c.translate(sh[0] - ux * 23, sh[1] - uy * 23);
  c.rotate(pose.head + Math.atan2(uy, ux) - Math.PI / 2);
  c.scale(costume.paperCut ? 0.9 : 0.73, costume.paperCut ? 0.9 : 0.73);
  if (costume.paperCut) {
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
  } else {
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
