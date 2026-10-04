export type Ctx = CanvasRenderingContext2D;
export const palette = {
  paper: "#eeecdf",
  ink: "#25251f",
  red: "#ae2630",
  cream: "#f5e5b4",
  gold: "#d6b450",
  blue: "#203d72",
  green: "#2b5143",
};
export function rect(
  c: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
) {
  c.fillStyle = fill;
  c.fillRect(x, y, w, h);
}
export function line(c: Ctx, points: number[], color: string, width = 1) {
  c.beginPath();
  c.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.stroke();
}
export function path(
  c: Ctx,
  d: string,
  fill: string,
  stroke?: string,
  width = 1,
) {
  const p = new Path2D(d);
  if (fill) {
    c.fillStyle = fill;
    c.fill(p);
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke(p);
  }
}
export function circle(
  c: Ctx,
  x: number,
  y: number,
  r: number,
  fill: string,
  stroke?: string,
  width = 1,
) {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function text(
  c: Ctx,
  value: string,
  x: number,
  y: number,
  size: number,
  color = palette.ink,
  font = "Georgia",
  weight = "normal",
  align: CanvasTextAlign = "left",
) {
  c.font = `${weight} ${size}px ${font}`;
  c.fillStyle = color;
  c.textAlign = align;
  c.fillText(value, x, y);
  c.textAlign = "left";
}
export function vertical(
  c: Ctx,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  [...value].forEach((ch, i) =>
    text(
      c,
      ch,
      x,
      y + i * size * 1.1,
      size,
      color,
      "serif",
      "normal",
      "center",
    ),
  );
}
export function gradient(c: Ctx, top: string, bottom: string) {
  const g = c.createLinearGradient(0, 0, 0, 500);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  c.fillStyle = g;
  c.fillRect(0, 0, 500, 500);
}
export function border(c: Ctx, color: string, inset = 9, width = 1) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.strokeRect(inset, inset, 500 - 2 * inset, 500 - 2 * inset);
}
export function random(seed: number) {
  let n = seed >>> 0;
  return () => {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
export function grain(c: Ctx, seed: number, amount = 15000) {
  const r = random(seed);
  c.save();
  for (let i = 0; i < amount; i++) {
    c.fillStyle = r() > 0.5 ? "rgba(255,255,234,.035)" : "rgba(32,25,14,.03)";
    c.fillRect(r() * 500, r() * 500, r() * 1.6 + 0.3, r() * 1.6 + 0.3);
  }
  c.restore();
}
export function yinYang(
  c: Ctx,
  x: number,
  y: number,
  r: number,
  light: string,
  dark: string,
  angle = 0,
) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  circle(c, 0, 0, r, light);
  path(
    c,
    `M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${r / 2} ${r / 2} 0 0 1 0 0 A${r / 2} ${r / 2} 0 0 0 0 ${-r}`,
    dark,
  );
  circle(c, 0, -r / 2, r / 7, light);
  circle(c, 0, r / 2, r / 7, dark);
  c.restore();
}
export function floor(
  c: Ctx,
  horizon: number,
  light: string,
  dark: string,
  rows = 9,
) {
  rect(c, 0, horizon, 500, 500 - horizon, light);
  for (let r = 0; r < rows; r++) {
    const y = horizon + (500 - horizon) * (r / rows) ** 1.8;
    const y2 = horizon + (500 - horizon) * ((r + 1) / rows) ** 1.8;
    for (let j = -10; j < 11; j++) {
      if ((r + j) % 2 !== 0) continue;
      const a = 12 + (y - horizon) * 0.28,
        b = 12 + (y2 - horizon) * 0.28;
      path(
        c,
        `M${250 + j * a} ${y} L${250 + (j + 1) * a} ${y} L${250 + (j + 1) * b} ${y2} L${250 + j * b} ${y2} Z`,
        dark,
      );
    }
  }
}
export function star(
  c: Ctx,
  x: number,
  y: number,
  r: number,
  color: string,
  points = 5,
) {
  const p = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (i * Math.PI) / points - Math.PI / 2;
    const d = i % 2 ? r * 0.4 : r;
    p.push(x + Math.cos(a) * d, y + Math.sin(a) * d);
  }
  c.beginPath();
  c.moveTo(p[0], p[1]);
  for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
  c.closePath();
  c.fillStyle = color;
  c.fill();
}
