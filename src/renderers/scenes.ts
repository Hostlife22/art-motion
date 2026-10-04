import {
  choreography,
  performanceAt,
  pushUpAt,
} from "../animation/choreography";
import { blend, poseAt, poses, type Pose } from "../animation/poses";
import { clamp, mix, smooth, SCENE_DURATION } from "../animation/timeline";
import {
  circle,
  line,
  path,
  random,
  rect,
  star,
  text,
  yinYang,
  type Ctx,
} from "./draw";
import { costumes, drawFigure, type Costume } from "./figure";

const opponent: Costume = {
  skin: "#d4ae84",
  hair: "#383b29",
  top: "#787864",
  pants: "#293a35",
  shoe: "#192c27",
};
const teacher: Costume = {
  sleeves: true,
  skin: "#bec0a9",
  hair: "#343c2e",
  top: "#252e25",
  pants: "#252e25",
  shoe: "#242c22",
};
const partner: Costume = {
  skin: "#dcb185",
  hair: "#1f281d",
  top: "#c82e3b",
  pants: "#d8b183",
  shoe: "#b32b35",
  female: true,
};
const white: Costume = {
  sleeves: true,
  skin: "#d4b387",
  hair: "#575543",
  top: "#eae8d8",
  pants: "#eae8d8",
  shoe: "#d4c1a1",
};
const sequences = choreography;
function fall(
  c: Ctx,
  x: number,
  y: number,
  progress: number,
  costume: Costume,
  scale = 1,
  facing = -1,
) {
  const t = smooth(progress);
  drawFigure(
    c,
    x + 70 * t,
    y,
    blend(poses.recoil, poses.fall, t),
    costume,
    scale,
    facing,
    -facing * t * Math.PI * 0.47,
  );
}
function bird(c: Ctx, x: number, y: number, phase: number, color: string) {
  path(
    c,
    `M${x - 7} ${y + Math.sin(phase) * 3}Q${x - 2} ${y - 5} ${x} ${y}Q${x + 4} ${y - 5} ${x + 10} ${y + Math.sin(phase) * 3}`,
    "",
    color,
    1.2,
  );
}
function burst(
  c: Ctx,
  x: number,
  y: number,
  size: number,
  label: string,
  color = "#e6bc36",
) {
  star(c, x, y, size, "#232920", 11);
  star(c, x, y, size * 0.88, color, 11);
  c.save();
  c.translate(x, y);
  c.rotate(-0.13);
  text(
    c,
    label,
    0,
    7,
    size * 0.55,
    "#a32c28",
    "Arial",
    "italic bold",
    "center",
  );
  c.restore();
}
function impact(c: Ctx, x: number, y: number, p: number) {
  const a = 1 - clamp(p);
  if (a <= 0) return;
  c.save();
  c.globalAlpha *= a;
  star(c, x, y, 12 + clamp(p) * 20, "#f0ce54", 8);
  star(c, x, y, 6, "#fff6bc", 8);
  c.restore();
}
function dust(
  c: Ctx,
  t: number,
  x: number,
  y: number,
  color: string,
  count = 25,
) {
  const r = random(336);
  for (let j = 0; j < count; j++) {
    const phase = clamp(t),
      a = r() * Math.PI * 2,
      v = 12 + r() * 60;
    c.save();
    c.globalAlpha *= 1 - phase;
    rect(
      c,
      x + Math.cos(a) * v * phase,
      y + Math.sin(a) * v * phase + 40 * phase * phase,
      2 + r() * 3,
      2 + r() * 3,
      color,
    );
    c.restore();
  }
}
function dragon(c: Ctx, t: number) {
  const x = 330 + Math.sin(t * 1.8) * 103,
    y = 333 + Math.cos(t * 1.3) * 35;
  c.save();
  c.translate(x, y);
  c.rotate(Math.sin(t) * 0.15);
  for (let i = 17; i >= 0; i--) {
    const xx = -i * 10,
      yy = Math.sin(t * 3 - i * 0.45) * 20 + i * 1.4;
    circle(c, xx, yy, Math.max(2, 10 - i * 0.33), "#b12129", "#efcb81", 0.7);
    path(c, `M${xx - 4} ${yy - 8}l-2 -9l8 6`, "#b12129");
  }
  path(
    c,
    "M-22 -14Q-4 -37 29 -18L48 -9L28 1L4 12L-19 6Z",
    "#b12129",
    "#edce88",
    1,
  );
  circle(c, 18, -15, 3, "#f8e7b3");
  circle(c, 19, -15, 1, "#1d2c21");
  line(c, [2, -26, -8, -48, -22, -55], "#b12129", 3);
  line(c, [14, -25, 14, -42, 25, -53], "#b12129", 2);
  path(c, "M36 -5Q69 7 76 -22M33 0Q60 33 83 17", "", "#b12129", 1);
  c.restore();
  circle(c, x + 59, y - 10, 7, "#ebc749");
  for (let j = 0; j < 6; j++)
    line(
      c,
      [
        x + 59 + Math.cos(t + j) * 10,
        y - 10 + Math.sin(t + j) * 10,
        x + 59 + Math.cos(t + j) * 16,
        y - 10 + Math.sin(t + j) * 16,
      ],
      "#d8aa40",
      1,
    );
}
function mirrorBall(c: Ctx, t: number) {
  circle(c, 250, 53, 25, "#d9dedb");
  for (let y = -20; y <= 20; y += 5)
    for (let x = -20; x <= 20; x += 5)
      if (x * x + y * y < 550)
        rect(
          c,
          250 + x,
          53 + y,
          3.8,
          3.8,
          Math.floor(x / 5 + y / 5 + t * 4) % 3 ? "#b2bbc1" : "#f6f5e3",
        );
  line(c, [250, 0, 250, 28], "#a6a587", 1);
  const r = random(84);
  for (let i = 0; i < 25; i++) {
    const x = r() * 460 + 20,
      y = r() * 350 + 40;
    c.save();
    c.globalAlpha = 0.1 + (Math.sin(t * 3 + i) * 0.5 + 0.5) * 0.4;
    circle(c, x, y, 1.4, "#f2e9c4");
    c.restore();
  }
}
function chalk(c: Ctx, t: number, phase: number) {
  const lines = ["道 · the Way", "yin & yang", "“be like water”", "Mr. Lee"];
  for (let i = 0; i < lines.length; i++) {
    const show = clamp((phase - i * 0.12) * 6);
    text(
      c,
      lines[i].slice(0, Math.ceil(lines[i].length * show)),
      27,
      88 + i * 30,
      i === 3 ? 12 : 21,
      "#e6ebd5",
      "Georgia",
      i === 3 ? "italic" : "normal",
    );
  }
  c.save();
  c.translate(411, 130);
  c.rotate(t * 0.1);
  path(
    c,
    "M0 -49C-65 -49 -65 49 0 49C-33 49 -33 0 0 0C33 0 33 -49 0 -49Z",
    "",
    "#c5dac3",
    0.8,
  );
  c.save();
  c.clip(
    new Path2D(
      "M0 -49C-65 -49 -65 49 0 49C-33 49 -33 0 0 0C33 0 33 -49 0 -49Z",
    ),
  );
  for (let y = -60; y < 60; y += 3)
    line(c, [-55, y, 55, y + 22], "#b6cdb1", 0.45);
  c.restore();
  circle(c, 0, -24.5, 5, "", "#c5dac3", 0.8);
  circle(c, 0, 24.5, 5, "", "#c5dac3", 0.8);
  c.restore();
  circle(c, 411, 130, 49, "", "#c5dac3", 0.8);
}
function notebookNotes(c: Ctx, phase: number, t: number) {
  const notes = [
    "“Absorb what is useful,",
    "discard what is useless,",
    "add what is specifically",
    "your own.”",
  ];
  for (let i = 0; i < notes.length; i++) {
    const show = clamp((phase - i * 0.07) * 7);
    text(
      c,
      notes[i].slice(0, Math.ceil(notes[i].length * show)),
      96,
      94 + i * 17,
      14,
      "#3c5688",
      "Georgia",
      "italic",
    );
  }
  if (phase > 0.2) {
    yinYang(c, 397, 188, 42, "#d13042", "#14282b", t * 0.14);
    circle(c, 397, 188, 49, "", "#b5424d", 1.2);
    for (let j = 0; j < 8; j++) {
      const a = (j * Math.PI) / 4;
      text(
        c,
        "武",
        397 + Math.cos(a) * 63,
        192 + Math.sin(a) * 63,
        9,
        "#343e4b",
        "serif",
        "normal",
        "center",
      );
    }
  }
  for (let i = 0; i < 3; i++) {
    const y = 279 + i * 59;
    line(c, [305, y, 389, y + 3], "#49618e", 0.9);
    path(c, `M307 ${y}l7 -3v6Z`, "#49618e");
    text(
      c,
      ["straight lead", "stop-kick", "intercept"][i],
      392,
      y + 7,
      11,
      "#486190",
      "Georgia",
      "italic",
    );
  }
}
function cracks(c: Ctx, amount: number) {
  const r = random(719);
  for (const [x, y] of [
    [169, 229],
    [388, 227],
  ]) {
    for (let i = 0; i < 13; i++) {
      const a = r() * Math.PI * 2,
        l = 30 + r() * 260;
      line(
        c,
        [x, y, x + Math.cos(a) * l * amount, y + Math.sin(a) * l * amount],
        "#b4c3bf",
        0.7,
      );
    }
  }
}
function fireworks(c: Ctx, time: number) {
  const r = random(305);
  for (let j = 0; j < 4; j++) {
    const age = (time * 0.5 + j * 0.37) % 2,
      progress = clamp(age / 0.9);
    const x = 70 + r() * 370,
      y = 25 + r() * 110,
      color = ["#d080aa", "#dec387", "#788bbf", "#cf8c87"][j];
    if (age > 1.3) continue;
    c.save();
    c.globalAlpha = (1 - progress) * 0.75;
    for (let k = 0; k < 30; k++) {
      const a = (k * Math.PI * 2) / 30,
        reach = progress * 46;
      circle(
        c,
        x + Math.cos(a) * reach,
        y + Math.sin(a) * reach + progress * progress * 15,
        1.2,
        color,
      );
    }
    c.restore();
  }
}
function pedestal(c: Ctx, phase: number) {
  const amount = smooth((phase - 0.4) / 0.2);
  if (!amount) return;
  rect(c, 196, 426, 104, 56 * amount, "#6d767b");
  rect(c, 190, 419, 115, 8, "#8b959b");
  rect(c, 208, 437, 80, 30 * amount, "#c5a444");
  if (amount > 0.5) {
    text(c, "李小龍", 248, 450, 13, "#615126", "serif", "bold", "center");
    text(
      c,
      "BRUCE LEE · 1940–1973",
      248,
      460,
      5,
      "#615126",
      "Arial",
      "normal",
      "center",
    );
  }
}

/** Foreground effects and independently posed actors. No frame images are used. */
export class SceneRenderer {
  private mosaic = document.createElement("canvas");
  private mosaicContext: Ctx;
  constructor() {
    this.mosaic.width = 500;
    this.mosaic.height = 500;
    const context = this.mosaic.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Cannot create scene renderer");
    this.mosaicContext = context;
  }
  draw(
    c: Ctx,
    index: number,
    local: number,
    global: number,
    thumbnail = false,
  ) {
    const phase = clamp(local / SCENE_DURATION),
      t = global;
    const { x, y, scale, pose } = performanceAt(index, phase);
    const showHero = thumbnail || (local >= -0.75 && local <= 4.15);
    if (index === 0) dragon(c, t);
    if (index === 1) {
      const r = random(Math.floor(t * 11) + 40);
      c.save();
      c.globalAlpha = 0.13;
      for (let j = 0; j < 10; j++)
        rect(c, r() * 456 + 22, 0, 0.5, 500, "#f1f0dc");
      c.restore();
      if (phase > 0.06) {
        rect(c, 169, 413, 164, 45, "#273025");
        text(
          c,
          "GOLDEN GATE GIRL",
          251,
          430,
          10,
          "#e6e8d5",
          "Georgia",
          "bold",
          "center",
        );
        text(
          c,
          "Starring · Lee Jun-fan",
          251,
          446,
          10,
          "#d8ddc8",
          "Georgia",
          "italic",
          "center",
        );
      }
    }
    if (index === 2) {
      for (let j = 0; j < 9; j++)
        bird(
          c,
          ((t * 9 + j * 51) % 410) + 80,
          145 + Math.sin(j * 3 + t) * 6,
          t * 4 + j,
          "#3d4a36",
        );
      drawFigure(
        c,
        367,
        442,
        phase < 0.47
          ? poseAt(
              [
                [0, "ready"],
                [0.4, "punch"],
                [0.7, "recoil"],
                [1, "guard"],
              ],
              phase,
            )
          : poses.guard,
        { ...opponent, top: "#85794c", pants: "#263e38" },
        0.98,
        -1,
      );
      if (phase > 0.65 && phase < 0.78) {
        drawFigure(
          c,
          x,
          408,
          poses.fall,
          costumes[index],
          scale,
          1,
          -Math.PI * (phase - 0.65) * 8,
        );
        return;
      }
    }
    if (index === 3)
      drawFigure(
        c,
        344,
        440,
        poseAt(
          [
            [0, "guard"],
            [0.28, "block"],
            [0.55, "punch"],
            [0.8, "recoil"],
            [1, "salute"],
          ],
          phase,
        ),
        teacher,
        1,
        -1,
      );
    if (index === 4) {
      mirrorBall(c, t);
      drawFigure(
        c,
        314 + Math.sin(phase * Math.PI * 4) * 24,
        458,
        poseAt(
          [
            [0, "danceStep"],
            [0.2, "dance"],
            [0.42, "spin"],
            [0.65, "dance"],
            [0.85, "danceStep"],
            [1, "open"],
          ],
          phase,
        ),
        partner,
        0.94,
        -1,
      );
      if (phase > 0.6) {
        path(
          c,
          "M65 70L435 70L421 100L435 132L65 132L78 100Z",
          "#ad242c",
          "#d6ab48",
        );
        text(
          c,
          "CHAMPION 1958",
          250,
          108,
          25,
          "#f1d58f",
          "Georgia",
          "bold",
          "center",
        );
      }
    }
    if (index === 5) {
      if (phase < 0.64)
        drawFigure(
          c,
          264,
          402,
          poseAt(
            [
              [0, "ready"],
              [0.16, "block"],
              [0.32, "punch"],
              [0.47, "recoil"],
              [0.65, "recoil"],
              [1, "fall"],
            ],
            phase,
          ),
          { ...costumes[5], pants: "#5c6b58" },
          0.78,
          -1,
        );
      else
        fall(
          c,
          260,
          402,
          (phase - 0.64) * 6,
          { ...costumes[5], pants: "#5c6b58" },
          0.78,
        );
      if (phase > 0.74) {
        drawFigure(
          c,
          217,
          402,
          poses.victory,
          { ...costumes[5], top: "#d9dbc6", pants: "#7c8575" },
          0.76,
        );
        text(
          c,
          String(Math.min(10, Math.floor((phase - 0.74) * 36) + 1)),
          288,
          245,
          22,
          "#323e2f",
          "Georgia",
          "bold",
        );
      }
      if (phase > 0.28 && phase < 0.42) impact(c, 215, 277, (phase - 0.28) * 7);
    }
    if (index === 6) {
      c.save();
      c.translate(0, 65 + Math.sin(t * 2) * 3);
      path(c, "M288 348L500 348L500 384L312 384L299 371Z", "#141f24");
      rect(c, 306, 323, 194, 25, "#ece9cf");
      rect(c, 337, 303, 126, 20, "#e7e4c9");
      for (const xx of [344, 376]) {
        rect(c, xx, 282, 12, 23, "#e9e7cf");
        rect(c, xx, 288, 12, 7, "#be342f");
      }
      for (let xx = 304; xx < 500; xx += 10) rect(c, xx, 328, 3, 4, "#152c30");
      rect(c, 295, 364, 205, 7, "#b92e2a");
      text(
        c,
        "PRESIDENT WILSON",
        402,
        360,
        7,
        "#e2e2c7",
        "Arial",
        "bold",
        "center",
      );
      c.restore();
      for (let j = 0; j < 4; j++)
        bird(
          c,
          320 + ((j * 47 + t * 7) % 170),
          133 + j * 15,
          t * 3 + j,
          "#636d55",
        );
    }
    if (index === 7) chalk(c, t, phase);
    if (index === 8) {
      c.save();
      c.translate(74, 167);
      c.rotate(Math.sin(t * 2.5) * 0.08);
      line(c, [0, -24, 0, 1], "#343b2b", 1);
      path(c, "M-21 6Q0 -1 21 6L21 144Q0 156 -21 144Z", "#2e3a2e");
      rect(c, -22, 82, 44, 18, "#b93730");
      c.restore();
      for (let j = 0; j < 3; j++) {
        const p = poseAt(sequences[8], clamp(phase - j * 0.065));
        drawFigure(
          c,
          305 + j * 62,
          441 - j * 3,
          p,
          { ...costumes[8], skin: "#d9b589", top: "#eee7cb", pants: "#3e473a" },
          0.66,
        );
      }
    }
    if (index === 9) {
      const reaction = smooth((phase - 0.64) / 0.16);
      if (phase > 0.7)
        fall(c, 317, 397, reaction, { ...costumes[9], top: "#293129" }, 0.82);
      else
        drawFigure(
          c,
          347,
          397,
          poses.salute,
          { ...costumes[9], top: "#293129" },
          0.82,
          -1,
        );
      if (phase > 0.68 && phase < 0.83) {
        burst(c, 353, 259, 30, "BAM!", "#f2e1b4");
        for (let j = 0; j < 3; j++) {
          circle(c, 67 + j * 44, 251, 13, "", "#aa3d2a", 1.4);
          text(
            c,
            String(j + 1),
            67 + j * 44,
            256,
            13,
            "#aa3d2a",
            "Georgia",
            "bold",
            "center",
          );
        }
      }
      if (phase > 0.25 && phase < 0.59) {
        drawFigure(
          c,
          240,
          445,
          pushUpAt((phase - 0.25) / 0.34),
          costumes[9],
          0.89,
        );
        return;
      }
    }
    if (index === 10) {
      for (let j = 0; j < 2; j++) {
        const progress = clamp((phase - 0.28 - j * 0.27) * 5);
        if (progress > 0)
          fall(
            c,
            324 + j * 67,
            433,
            progress,
            { ...opponent, top: "#4f5550", pants: "#343d36" },
            1,
          );
        else
          drawFigure(
            c,
            324 + j * 67,
            433,
            poses.ready,
            { ...opponent, top: "#4f5550" },
            1,
            -1,
          );
      }
      if (phase > 0.22 && phase < 0.36) burst(c, 324, 234, 38, "POW!");
      if (phase > 0.52 && phase < 0.68) burst(c, 364, 195, 40, "KRAK!");
    }
    if (index === 11) notebookNotes(c, phase, t);
    if (index === 12) {
      const broken = smooth((phase - 0.45) / 0.3);
      if (broken < 0.2) {
        line(c, [334, 267, 334, 457], "#b29b4e", 2);
        path(c, "M307 260L318 224L350 224L363 260Z", "#e8cc70");
        circle(c, 334, 225, 3, "#f2e4a7");
      } else {
        path(
          c,
          `M${mix(307, 395, broken)} ${mix(260, 445, broken)}l27 -34l27 34Z`,
          "#e8cc70",
        );
        line(
          c,
          [334, 457, 334 + 88 * broken, 267 + 180 * broken],
          "#b29b4e",
          2,
        );
        dust(c, broken, 348, 339, "#e1ddbe", 40);
      }
      for (let j = 0; j < 12; j++) {
        const progress = clamp((phase - 0.43) * 2);
        const a = j * 0.57;
        rect(
          c,
          190 + Math.cos(a) * progress * 190,
          233 + Math.sin(a) * progress * 95 + progress * progress * 130,
          8,
          3,
          "#e1e2cb",
        );
      }
    }
    if (index === 13) {
      const tv = costumes[13];
      drawFigure(
        c,
        105,
        354,
        poses.sit,
        { ...tv, top: "#303d31", pants: "#303d31" },
        0.61,
        -1,
      );
      const quote =
        phase < 0.34
          ? "Empty your mind. Be formless."
          : phase < 0.69
            ? "Shapeless, like water."
            : "Be water, my friend.";
      rect(c, 102, 355, 227, 23, "#202b24");
      text(c, quote, 216, 370, 13, "#e0e4cf", "Georgia", "italic", "center");
      c.save();
      c.beginPath();
      c.roundRect(43, 54, 345, 340, 30);
      c.clip();
      if (phase < 0.08 || (phase > 0.46 && phase < 0.52)) {
        const r = random(Math.floor(t * 35));
        for (let j = 0; j < 1600; j++)
          rect(
            c,
            r() * 500,
            r() * 400,
            1 + r() * 2,
            1,
            r() > 0.5 ? "#d8dfc5" : "#2c382e",
          );
      }
      for (let yy = 58; yy < 394; yy += 3)
        rect(c, 43, yy, 345, 0.7, "rgba(12,26,15,.18)");
      c.restore();
    }
    if (index === 14) {
      for (let j = 0; j < 2; j++) {
        const progress = clamp((phase - 0.3 - j * 0.25) * 5);
        if (progress > 0)
          fall(
            c,
            333 + j * 66,
            443,
            progress,
            { ...opponent, top: j ? "#c7a878" : "#626f58" },
            1,
          );
        else
          drawFigure(
            c,
            333 + j * 66,
            443,
            poses.ready,
            { ...opponent, top: "#888c68" },
            1,
            -1,
          );
      }
      text(
        c,
        `HK$ ${Math.round(mix(467772, 3197417, smooth(phase / 0.7))).toLocaleString("en-US")}`,
        392,
        44,
        15,
        "#d9bf61",
        "monospace",
        "bold",
        "center",
      );
      if (phase > 0.59) {
        c.save();
        c.translate(413, 96);
        c.rotate(-0.25);
        circle(c, 0, 0, 36, "", "#b72630", 2);
        text(c, "RECORD!", 0, 6, 15, "#bb2630", "Arial", "bold", "center");
        c.restore();
      }
      if (phase > 0.38 && phase < 0.63)
        dust(c, (phase - 0.38) * 4, 438, 370, "#b1d7e1", 45);
    }
    if (index === 15) {
      for (let j = 0; j < 3; j++) {
        const progress = clamp((phase - 0.28 - j * 0.08) * 4);
        if (progress > 0)
          fall(
            c,
            314 + j * 52,
            437,
            progress,
            { ...white, pants: "#2b3441" },
            0.96,
          );
        else
          drawFigure(
            c,
            314 + j * 52,
            437,
            poses.ready,
            { ...white, pants: "#2b3441" },
            0.96,
            -1,
          );
      }
      if (phase > 0.3) {
        rect(c, 202, 183, 100, 146, "#d8c19a");
        dust(c, clamp((phase - 0.3) * 3), 255, 247, "#f4e6b9", 25);
      }
    }
    if (index === 16) {
      this.drawMosaic(c, pose, phase, showHero, x);
      this.cat(c, t);
      return;
    }
    if (index === 17) {
      const health = 1 - smooth((phase - 0.24) / 0.44);
      rect(c, 292 + 184 * health, 16, 184 * (1 - health), 13, "#b73236");
      const giant: Costume = {
        bald: true,
        glasses: true,
        skin: "#765d40",
        hair: "#423d2c",
        top: "#1b2530",
        pants: "#1b2530",
        shoe: "#e7e9dc",
      };
      if (phase < 0.6)
        drawFigure(
          c,
          349,
          428,
          poseAt(
            [
              [0, { ...poses.ready, leftHand: [21, 21], rightHand: [45, 16] }],
              [0.32, "block"],
              [0.47, "kick"],
              [0.59, "ready"],
              [1, "recoil"],
            ],
            phase,
          ),
          giant,
          1.35,
          -1,
        );
      else fall(c, 349, 428, clamp((phase - 0.6) * 5), giant, 1.35);
      if (phase > 0.3 && phase < 0.4) impact(c, 250, 301, (phase - 0.3) * 10);
      if (phase > 0.6 && phase < 0.74) impact(c, 292, 260, (phase - 0.6) * 7);
      if (phase > 0.74) {
        text(c, "K.O.", 253, 241, 64, "#142020", "monospace", "bold", "center");
        text(c, "K.O.", 250, 238, 64, "#e5bf42", "monospace", "bold", "center");
      }
      if (phase > 0.12 && phase < 0.3) {
        drawFigure(
          c,
          x - 18,
          y,
          poses.punch,
          costumes[index],
          scale,
          1,
          0,
          0.13,
        );
      }
    }
    if (index === 18) {
      for (let j = 0; j < 4; j++)
        drawFigure(c, 40 + j * 113, 437, pose, costumes[18], 0.62, 1, 0, 0.18);
      const progress = clamp((phase - 0.5) * 5);
      if (progress > 0)
        fall(
          c,
          361,
          438,
          progress,
          { ...white, bald: true, hair: "#9b9576" },
          1,
        );
      else
        drawFigure(
          c,
          362,
          437,
          poses.ready,
          { ...white, bald: true, hair: "#9b9576" },
          1,
          -1,
        );
      if (phase > 0.47) {
        cracks(c, smooth((phase - 0.47) / 0.15));
        dust(c, clamp((phase - 0.48) * 2), 250, 263, "#d3e1db", 48);
      }
    }
    if (index === 19) {
      for (let j = 0; j < 6; j++) star(c, j * 63 + 34, 488, 9, "#b49950");
      for (let j = 0; j < 4; j++) {
        line(
          c,
          [60 + j * 129, 44 + (j % 2) * 19, 10 + j * 160, 0],
          "#60738e",
          0.7,
        );
      }
      pedestal(c, phase);
      fireworks(c, t);
      const r = random(115);
      c.save();
      c.globalAlpha = 0.25;
      for (let j = 0; j < 90; j++) {
        const xx = r() * 500,
          yy = (r() * 500 + t * 53) % 500;
        line(c, [xx, yy, xx - 2, yy + 8], "#a1b1c6", 0.5);
      }
      c.restore();
      if (phase > 0.35) {
        const bronze: Costume = {
          skin: "#bd9952",
          hair: "#68502c",
          top: "#bd9952",
          pants: "#604624",
          shoe: "#5c4626",
          outline: "#d6b871",
        };
        if (showHero) drawFigure(c, x, y, poses.statue, bronze, scale);
        return;
      }
    }
    if (!showHero) return;
    if (index === 5 && phase > 0.82)
      drawFigure(c, x, y, poses.victory, costumes[index], scale);
    else drawFigure(c, x, y, pose, costumes[index], scale);
    if (index === 0) {
      const r = random(90);
      c.save();
      c.globalAlpha = 0.5;
      for (let j = 0; j < 80; j++) {
        const xx = x + r() * 90 - 40,
          yy = 220 + r() * 208;
        circle(c, xx, yy, 0.65, "#eedda4");
      }
      c.restore();
    }
  }
  private drawMosaic(
    c: Ctx,
    pose: Pose,
    phase: number,
    showHero: boolean,
    x: number,
  ) {
    const m = this.mosaicContext;
    m.clearRect(0, 0, 500, 500);
    if (showHero) drawFigure(m, x - 31, 446, pose, costumes[16], 1.08);
    const other: Costume = { ...white, skin: "#d4b77e", hair: "#b29464" };
    if (phase < 0.61)
      drawFigure(
        m,
        324,
        438,
        poseAt(
          [
            [0, "ready"],
            [0.3, "block"],
            [0.5, "recoil"],
            [0.7, "kick"],
            [1, "fall"],
          ],
          phase,
        ),
        other,
        0.97,
        -1,
      );
    else fall(m, 320, 438, (phase - 0.61) * 5, other, 0.97);
    const pixels = m.getImageData(0, 0, 500, 500).data;
    for (let y = 166; y < 480; y += 2)
      for (let x = 80; x < 488; x += 2) {
        const i = (y * 500 + x) * 4;
        if (pixels[i + 3] < 60) continue;
        c.fillStyle = `rgb(${pixels[i]} ${pixels[i + 1]} ${pixels[i + 2]})`;
        c.fillRect(x, y, 1.7, 1.7);
      }
  }
  dispose() {
    this.mosaic.width = this.mosaic.height = 0;
  }
  private cat(c: Ctx, t: number) {
    const x = 438 + Math.sin(t) * 3;
    path(c, `M${x - 22} 451q-3 -14 13 -13l9 -8l7 4v12l-14 8Z`, "#b38e53");
    path(c, `M${x - 21} 447q-21 6 -21 -12q0 -10 7 -11`, "", "#b38e53", 3);
    path(c, `M${x} 432l-1 -9l6 6l6 -6l-1 11`, "#b38e53");
  }
}
