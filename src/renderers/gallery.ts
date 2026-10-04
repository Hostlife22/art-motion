import {
  cardAt,
  clamp,
  layout,
  mix,
  smooth,
  timelineAt,
} from "../animation/timeline";
import { scenes } from "../data/scenes";
import {
  border,
  circle,
  palette as p,
  rect,
  text,
  yinYang,
  type Ctx,
} from "./draw";
import type { NativeArtwork } from "./NativeArtwork";
export interface Hit {
  x: number;
  y: number;
  size: number;
  index: number;
}
export class GalleryRenderer {
  hits: Hit[] = [];
  constructor(private artwork: NativeArtwork) {}
  render(c: Ctx, width: number, height: number, time: number, mobile: boolean) {
    const state = timelineAt(time),
      mobileGrid = mobile && state.grid > 0.995;
    const worldWidth = mobileGrid ? 384 : mobile ? 1040 : layout.width;
    const worldHeight = mobileGrid ? 2536 : layout.height;
    const scale = Math.min(width / worldWidth, height / worldHeight);
    const viewStart = mobile && !mobileGrid ? 440 : 0;
    const ox = (width - worldWidth * scale) / 2 - viewStart * scale,
      oy = (height - worldHeight * scale) / 2;
    c.clearRect(0, 0, width, height);
    c.save();
    c.translate(ox, oy);
    c.scale(scale, scale);
    this.hits = [];
    if (state.title > 0) this.title(c, time, mobileGrid);
    for (let i = 0; i < 20; i++) {
      const card = mobileGrid
        ? { x: 16 + (i % 2) * 184, y: 300 + Math.floor(i / 2) * 218, size: 168 }
        : cardAt(i, time);
      if (
        card.x + card.size < viewStart - 100 ||
        card.x > viewStart + worldWidth + 100
      )
        continue;
      const arrival = time < 1.6 ? smooth((time - i * 0.055) / 0.38) : 1;
      const flip = clamp((time - 1.58 - i * 0.041) / 0.5);
      const opening = time < 3.2;
      const back = opening && flip < 0.5;
      const faceScale = opening
        ? Math.max(0.035, Math.abs(Math.cos(flip * Math.PI)))
        : 1;
      const offsetY = opening ? (1 - arrival) * (550 + (i % 5) * 28) : 0;
      const angle = opening ? (1 - arrival) * (-0.6 + (i % 5) * 0.22) : 0;
      c.save();
      c.translate(card.x + card.size / 2, card.y + card.size / 2 + offsetY);
      c.rotate(angle);
      c.scale(faceScale, 1);
      c.translate(-card.size / 2, -card.size / 2);
      c.shadowColor = "rgba(42,37,23,.24)";
      c.shadowBlur = card.size * 0.02;
      c.shadowOffsetX = card.size * 0.008;
      c.shadowOffsetY = card.size * 0.025;
      rect(c, 0, 0, card.size, card.size, p.cream);
      c.shadowColor = "transparent";
      c.save();
      c.scale(card.size / 500, card.size / 500);
      c.beginPath();
      c.rect(0, 0, 500, 500);
      c.clip();
      if (back) this.back(c);
      else {
        this.artwork.draw(c, i, time, state.grid > 0.5);
      }
      border(c, "rgba(50,45,29,.18)", 0.5, 0.75);
      c.restore();
      c.restore();
      if (!back && faceScale > 0.7)
        this.caption(c, i, card.x, card.y + card.size, card.size, mobileGrid);
      if (arrival > 0.95 && !back)
        this.hits.push({
          x: ox + card.x * scale,
          y: oy + card.y * scale,
          size: card.size * scale,
          index: i,
        });
    }
    c.restore();
  }
  private back(c: Ctx) {
    rect(c, 0, 0, 500, 500, "#8f1e26");
    border(c, "#f1d99c", 9, 2);
    border(c, "#c39859", 20, 1);
    border(c, "#c39859", 33, 0.7);
    for (const x of [49, 451])
      for (const y of [49, 451]) {
        circle(c, x, y, 9, "", "#d3ad69", 1);
        circle(c, x + 3, y - 3, 6, "", "#d3ad69", 1);
      }
    for (const r of [104, 111, 119]) circle(c, 250, 227, r, "", "#c08b49", 1);
    yinYang(c, 250, 227, 90, "#f1deb0", "#9b2429", -0.35);
    text(c, "李小龍", 250, 374, 29, "#dcb878", "serif", "normal", "center");
    text(
      c,
      "THE LITTLE DRAGON",
      250,
      399,
      11,
      "#d2a364",
      "Arial",
      "normal",
      "center",
    );
  }
  private caption(
    c: Ctx,
    index: number,
    x: number,
    y: number,
    size: number,
    mobile: boolean,
  ) {
    const factor = size / 830,
      scene = scenes[index];
    c.save();
    c.translate(x, y + 88 * factor);
    c.scale(factor, factor);
    text(
      c,
      String(scene.year),
      0,
      0,
      49,
      p.red,
      "Cormorant Garamond",
      "italic",
    );
    c.letterSpacing = "4px";
    text(c, scene.title, 112, -12, 22, "#35362b", "Arial");
    c.letterSpacing = "0px";
    text(
      c,
      scene.caption,
      112,
      21,
      mobile ? 26 : 27,
      "#817e6c",
      "Cormorant Garamond",
      "italic",
    );
    c.restore();
  }
  private title(c: Ctx, time: number, mobile: boolean) {
    const s = timelineAt(time);
    c.save();
    c.globalAlpha = s.title;
    const x = mobile ? 192 : 416,
      y = mobile ? 91 : 419,
      scale = mobile ? 0.44 : 1;
    c.translate(x, y);
    c.scale(scale, scale);
    const reveal = time < 1.2 ? Math.ceil(clamp(time / 0.75) * 9) : 9;
    c.letterSpacing = "10px";
    text(
      c,
      "BRUCE LEE".slice(0, reveal),
      0,
      0,
      106,
      "#22251c",
      "Cormorant Garamond",
      "normal",
      "center",
    );
    c.letterSpacing = "0px";
    const year = Math.round(mix(1940, 1973, smooth(time / 1.05)));
    text(
      c,
      `1940 → ${year}`,
      0,
      83,
      56,
      p.red,
      "Cormorant Garamond",
      "italic",
      "center",
    );
    text(
      c,
      "twenty moments from the life",
      0,
      142,
      32,
      "#797769",
      "Cormorant Garamond",
      "italic",
      "center",
    );
    text(
      c,
      "of the Little Dragon",
      0,
      177,
      32,
      "#797769",
      "Cormorant Garamond",
      "italic",
      "center",
    );
    lineRule(c);
    c.letterSpacing = "4px";
    text(
      c,
      "LEE JUN-FAN · 李振藩",
      0,
      286,
      17,
      "#686b5e",
      "Arial",
      "normal",
      "center",
    );
    c.letterSpacing = "0px";
    if (!mobile) {
      text(
        c,
        "Born in the hour and the year of the Dragon.",
        0,
        548,
        25,
        "#787869",
        "Cormorant Garamond",
        "italic",
        "center",
      );
      c.letterSpacing = "3px";
      text(
        c,
        "TWENTY MOMENTS · THE LITTLE DRAGON",
        0,
        574,
        10,
        "#777a6a",
        "Arial",
        "normal",
        "center",
      );
    }
    c.restore();
  }
}
function lineRule(c: Ctx) {
  rect(c, -115, 225, 89, 1, p.red);
  rect(c, 26, 225, 89, 1, p.red);
  yinYang(c, 0, 225, 14, "#eee8d4", p.red);
}
