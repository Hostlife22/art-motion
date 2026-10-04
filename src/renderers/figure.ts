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
}
export const costumes: Costume[] = [
  {
    skin: "#b2222b",
    hair: "#ad2028",
    top: "#b2222b",
    pants: "#b2222b",
    shoe: "#b2222b",
    outline: "#efcc86",
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
    skin: "#d4ae82",
    hair: "#253128",
    top: "#3d3d2b",
    pants: "#3b3c2d",
    shoe: "#33372c",
  },
  {
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
    top: "#28372a",
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
  if (lineArt) {
    const left: Point[] = [],
      right: Point[] = [];
    for (let i = 0; i < points.length; i += 2) {
      const prev = Math.max(0, i - 2),
        next = Math.min(points.length - 2, i + 2),
        dx = points[next] - points[prev],
        dy = points[next + 1] - points[prev + 1],
        length = Math.hypot(dx, dy) || 1;
      const r = width / 2;
      left.push([
        points[i] - (dy / length) * r,
        points[i + 1] + (dx / length) * r,
      ]);
      right.push([
        points[i] + (dy / length) * r,
        points[i + 1] - (dx / length) * r,
      ]);
    }
    const pts = [...left, ...right.reverse()];
    path(
      c,
      "M" + pts.map((pt) => pt.join(" ")).join("L") + "Z",
      fill,
      outline,
      1,
    );
    return;
  }
  c.lineCap = "round";
  c.lineJoin = "round";
  if (outline) line(c, points, outline, width + 1.5);
  line(c, points, fill, width);
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
  c.scale(scale * facing, scale);
  c.translate(0, -205);
  const sh: Point = [pose.lean, 47],
    hip: Point = [0, pose.hipY],
    lh = pose.leftHand,
    rh = pose.rightHand;
  const le = joint([sh[0] - 8, sh[1] + 1], lh, 38, 1),
    re = joint([sh[0] + 8, sh[1] + 1], rh, 38, 1);
  const lk = joint([-6, hip[1]], pose.leftFoot, 51, -1),
    rk = joint([6, hip[1]], pose.rightFoot, 51, -1);
  const outline = costume.outline;
  c.save();
  c.globalAlpha *= 0.82;
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
  circle(c, lh[0], lh[1], 4.5, costume.skin, outline, 0.7);
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
  const body = `M${sh[0] - 13} 44Q${sh[0]} 40 ${sh[0] + 13} 47L13 ${hip[1] - 9}L10 ${hip[1] + 6}L-13 ${hip[1] + 6}L-15 ${hip[1] - 4}Z`;
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
  circle(c, rh[0], rh[1], 4.5, costume.skin, outline, 0.7);
  line(c, [sh[0] + 1, 39, sh[0] + 1, 48], costume.skin, 9);
  c.save();
  c.translate(sh[0], 24);
  c.rotate(pose.head);
  c.scale(0.85, 0.85);
  path(
    c,
    "M-10 -5Q-11 -20 2 -20Q13 -19 14 -7L18 -1L13 2L12 11L3 17L-7 10Z",
    costume.skin,
    outline,
    0.8,
  );
  path(
    c,
    "M-11 7Q-18 -5 -9 -17Q-2 -27 9 -21Q18 -18 13 -10Q8 -16 5 -10L-1 -6L-4 4L-7 9Z",
    costume.hair,
    outline,
    0.6,
  );
  circle(c, -1, 3, 2.5, costume.skin);
  line(c, [9, -2, 12, -2], costume.hair, 1.2);
  line(c, [11, 8, 14, 8], costume.hair, 0.7);
  if (costume.mask) path(c, "M-2 -7L15 -6L15 2L2 3Z", "#080f12");
  c.restore();
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
