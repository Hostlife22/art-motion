import {
  border,
  circle,
  floor,
  gradient,
  grain,
  line,
  palette as p,
  path,
  random,
  rect,
  text,
  vertical,
  type Ctx,
} from "./draw";

function buildings(c: Ctx, night = false) {
  const r = random(night ? 26 : 8);
  for (let x = 0; x < 500;) {
    const w = 18 + r() * 35,
      h = 45 + r() * 215;
    const y = night ? 360 - h : 260 + r() * 30;
    rect(c, x, y, w, night ? h : 440 - y, night ? "#111931" : p.red);
    for (let yy = y + 8; yy < (night ? 354 : 430); yy += 12)
      for (let xx = x + 5; xx < x + w - 3; xx += 9) {
        if (!night || r() > 0.48)
          rect(
            c,
            xx,
            yy,
            night ? 2 : 4,
            night ? 2 : 7,
            night ? (r() > 0.65 ? "#ddcf8a" : "#94a9c7") : p.cream,
          );
      }
    x += w + 5;
  }
}
function bridge(c: Ctx) {
  gradient(c, "#727770", "#d2d2c6");
  path(c, "M0 263 Q90 234 166 259 L242 296 L0 306Z", "#777d70");
  rect(c, 0, 294, 500, 100, "#b2b4a9");
  for (const x of [140, 382]) {
    for (const dx of [0, 18]) rect(c, x + dx, 75, 5, 259, "#4b514b");
    for (const y of [84, 122, 172, 218, 278])
      line(c, [x, y, x + 23, y], "#50564d", 4);
  }
  path(
    c,
    "M30 155 Q94 109 150 83 Q271 344 390 83 Q437 143 490 168",
    "",
    "#41483f",
    2,
  );
  for (let x = 30; x < 491; x += 10) {
    const y =
      x < 150
        ? 155 - (x - 30) * 0.6
        : x < 390
          ? 83 + Math.sin(((x - 150) / 240) * Math.PI) * 130
          : 83 + (x - 390) * 0.9;
    line(c, [x, y, x, 310], "#71766c", 0.65);
  }
  line(c, [0, 308, 500, 308], "#4c534a", 5);
  for (let i = 0; i < 14; i++)
    line(c, [0, 330 + i * 4, 500, 330 + i * 4], "#c5c6bb", 0.8);
  floor(c, 385, "#9b9f92", "#92988e");
  for (let x = 0; x < 500; x += 28)
    line(c, [250 + (x - 250) * 0.4, 385, x, 500], "#696f61", 0.7);
  for (let y = 390; y < 500; y += 14) line(c, [0, y, 500, y], "#747b6c", 0.8);
  rect(c, 0, 0, 22, 500, "#161a16");
  rect(c, 478, 0, 22, 500, "#161a16");
  for (let y = 8; y < 495; y += 43) {
    rect(c, 6, y, 11, 24, "#e2e3d4");
    rect(c, 484, y, 11, 24, "#e2e3d4");
  }
  rect(c, 33, 405, 61, 35, "#181e18");
  circle(c, 48, 387, 18, "#20271e", "#777b64");
  circle(c, 83, 389, 15, "#20271e", "#777b64");
  for (let a = 0; a < 5; a++)
    line(
      c,
      [48, 387, 48 + Math.cos(a * 1.26) * 16, 387 + Math.sin(a * 1.26) * 16],
      "#73796a",
    );
  line(c, [48, 438, 33, 500, 49, 456, 66, 500], "#161c15", 5);
}
function mountains(c: Ctx) {
  gradient(c, "#ebe6cc", "#cbcab9");
  circle(c, 383, 80, 32, "#d7b7a7");
  path(
    c,
    "M0 263Q38 178 76 195Q98 210 112 184Q169 63 204 100Q229 134 263 111Q311 126 332 159Q361 120 388 155Q431 181 500 235L500 360L0 360Z",
    "#c4c3ae",
  );
  path(
    c,
    "M0 318 Q83 229 149 280 Q274 181 365 250 Q430 224 500 295 L500 421L0 421Z",
    "#aaa997",
  );
  path(
    c,
    "M0 327 Q115 280 230 329 Q392 271 500 322 L500 432L0 432Z",
    "#85887a",
  );
  const g = c.createLinearGradient(0, 270, 0, 455);
  g.addColorStop(0, "#cbcdbb00");
  g.addColorStop(0.5, "#e8e5d1");
  g.addColorStop(1, "#8e9384");
  c.fillStyle = g;
  c.fillRect(0, 270, 500, 185);
  rect(c, 0, 455, 500, 45, "#5f6358");
  rect(c, 71, 249, 17, 210, "#33372e");
  line(c, [80, 311, 156, 292], "#31352c", 8);
  line(c, [80, 361, 139, 383], "#31352c", 7);
  line(c, [80, 412, 46, 428], "#31352c", 6);
  for (const x of [450, 472, 494]) {
    line(c, [x, 460, x - 5, 285, x + 13, 237], "#454a3b", 4);
    for (let y = 290; y < 435; y += 27) {
      line(c, [x - 3, y, x - 28, y - 12], "#464b3d", 2);
      path(
        c,
        `M${x - 8} ${y - 5} Q${x - 44} ${y - 18} ${x - 40} ${y - 23} Q${x - 20} ${y - 24} ${x - 8} ${y - 5}`,
        "#45493c",
      );
    }
  }
  for (let x = 0; x < 500; x += 13) line(c, [x, 460, x + 3, 446], "#343a2d", 1);
  vertical(c, "詠春", 431, 82, 52, "#22271e");
  vertical(c, "以柔制剛", 32, 64, 15, "#24291f");
  rect(c, 23, 148, 18, 25, "#ba3531");
  text(c, "李", 32, 166, 14, "#f4e6c5", "serif", "normal", "center");
}
function kid(c: Ctx) {
  gradient(c, "#eed39b", "#f4e5bc");
  path(c, "M0 316 Q181 153 349 243 L500 188L500 430L0 430Z", "#a3b692");
  for (const [x, w, col] of [
    [0, 80, "#b29c6b"],
    [393, 107, "#88a6a0"],
  ] as const) {
    rect(c, x, 120, w, 338, col);
    for (let y = 133; y < 450; y += 37)
      for (let xx = x + 8; xx < x + w - 5; xx += 17) {
        rect(c, xx, y, 9, 18, "#555c50");
        line(c, [xx - 2, y + 20, xx + 12, y + 20], "#353e38", 1);
      }
  }
  rect(c, 0, 459, 500, 41, "#b3ac8c");
  for (let y = 462; y < 500; y += 8) {
    line(c, [0, y, 500, y], "#e0d5ad");
    for (let x = (y % 16) * 2; x < 500; x += 26)
      line(c, [x, y, x, y + 8], "#ddd2ad");
  }
  line(c, [30, 146, 434, 140], "#5b5d40", 1);
  line(c, [48, 194, 403, 158], "#5b5d40", 1);
  for (let i = 0; i < 8; i++) {
    const x = 96 + i * 32,
      y = 190 - i * 2.7;
    rect(c, x, y, 16, 29, ["#c93f38", "#e8d096", "#638c9b"][i % 3]);
  }
  for (const [x, y, rx] of [
    [60, 53, 44],
    [220, 55, 55],
    [285, 107, 29],
  ]) {
    c.save();
    c.translate(x, y);
    c.scale(rx / 18, 0.25);
    circle(c, 0, 0, 18, "#fbf0d0");
    c.restore();
  }
  rect(c, 72, 160, 19, 53, "#ac302b");
  vertical(c, "茶樓", 82, 176, 14, "#f5e5ba");
  vertical(c, "細路祥", 429, 65, 46, "#ba352d");
  vertical(c, "細路祥", 426, 63, 46, "#f5d150");
  rect(c, 20, 15, 48, 18, "#bd302b");
  text(c, "香港", 44, 28, 12, "#f4e7be", "serif", "bold", "center");
  text(c, "THE KID", 20, 487, 13, "#b73330", "Georgia", "bold");
}
function ballroom(c: Ctx) {
  gradient(c, "#420f16", "#150e15");
  border(c, "#bc262c", 4, 6);
  border(c, "#d3ac56", 15, 1);
  path(c, "M18 18L86 20L54 333L18 342Z", "#69121c");
  path(c, "M482 18L412 20L446 333L482 342Z", "#69121c");
  for (let i = 0; i < 10; i++) {
    const a = i * 0.2 + 0.18;
    path(
      c,
      `M74 298L${74 + Math.cos(a) * 114} ${298 - Math.sin(a) * 125}L${74 + Math.cos(a + 0.12) * 114} ${298 - Math.sin(a + 0.12) * 125}Z`,
      "#8b642c",
    );
    path(
      c,
      `M426 298L${426 - Math.cos(a) * 114} ${298 - Math.sin(a) * 125}L${426 - Math.cos(a + 0.12) * 114} ${298 - Math.sin(a + 0.12) * 125}Z`,
      "#8b642c",
    );
  }
  path(c, "M137 355 A113 113 0 0 1 363 355", "", "#d6b34d", 2);
  path(c, "M146 355 A105 105 0 0 1 354 355", "", "#c69c3c", 1);
  rect(c, 210, 281, 65, 72, "#d1ae49");
  path(c, "M185 278L289 293L289 306L185 291Z", "#d0ae48");
  line(c, [225, 265, 225, 295], "#d0ae48", 5);
  rect(c, 299, 276, 18, 80, "#d4b452");
  circle(c, 308, 264, 10, "#d4b452");
  floor(c, 354, "#d8c7b7", "#2d1b25", 10);
  rect(c, 411, 437, 70, 28, "#861c25");
  path(c, "M432 436L444 403L455 403L466 436Z", "#d6ad39");
  circle(c, 449, 407, 14, "#ebca48");
  text(
    c,
    "CROWN COLONY CHAMPIONSHIP",
    250,
    31,
    9,
    "#957244",
    "Georgia",
    "normal",
    "center",
  );
}
function newspaper(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#e7e1c9");
  text(c, "The Sporting Post", 250, 41, 33, p.ink, "Georgia", "bold", "center");
  line(c, [20, 48, 480, 48], p.ink, 1);
  text(
    c,
    "HONG KONG   ·   1958   ·   FINAL EDITION   ·   10 CENTS",
    250,
    62,
    8,
    p.ink,
    "Arial",
    "normal",
    "center",
  );
  text(
    c,
    "LEE STOPS THE CHAMP",
    250,
    99,
    27,
    "#171913",
    "Georgia",
    "bold",
    "center",
  );
  text(
    c,
    "Schoolboy dethrones the three-time title holder in the final round",
    250,
    117,
    12,
    p.ink,
    "Georgia",
    "italic",
    "center",
  );
  gradientPhoto(c);
  rect(c, 350, 125, 132, 294, "#e4dec6");
  text(c, "St. Francis Xavier’s", 359, 141, 11, p.ink, "Georgia", "bold");
  const r = random(39);
  for (let y = 157; y < 298; y += 6)
    rect(c, 359, y, 65 + r() * 54, 0.6, "#7a7866");
  text(c, "RESULTS", 359, 321, 10, p.ink, "Georgia", "bold");
  for (let y = 334; y < 401; y += 9)
    rect(c, 359, y, 40 + r() * 48, 0.7, "#74735e");
  text(
    c,
    "Lee declared champion — Hong Kong",
    27,
    440,
    9,
    "#797767",
    "Georgia",
    "italic",
  );
  for (let col = 0; col < 4; col++)
    for (let y = 449; y < 484; y += 7)
      rect(c, 24 + col * 117, y, 95 - r() * 17, 2, "#686b5b");
  border(c, "#c5c0a6", 6, 0.8);
}
function gradientPhoto(c: Ctx) {
  const g = c.createLinearGradient(0, 125, 0, 423);
  g.addColorStop(0, "#777c72");
  g.addColorStop(1, "#bfc0ad");
  c.fillStyle = g;
  c.fillRect(28, 126, 318, 296);
  rect(c, 28, 342, 318, 76, "#454e43");
  for (let y = 0; y < 3; y++)
    line(c, [30, 351 + y * 24, 343, 351 + y * 24], "#e1e4d4", 2);
  line(c, [44, 327, 44, 418], "#e2e4d4", 5);
  line(c, [332, 327, 332, 418], "#e2e4d4", 5);
  c.strokeStyle = "#aaa994";
  c.strokeRect(27, 125, 320, 300);
}
function voyage(c: Ctx) {
  gradient(c, "#acb2a6", "#f2dda6");
  path(
    c,
    "M0 500L0 324C15 193 75 92 171 71C247 52 316 102 303 156C285 116 219 101 196 147C163 213 219 246 291 303L330 500Z",
    "#193d72",
  );
  for (let i = 0; i < 44; i++) {
    const x = 5 + i * 5;
    path(
      c,
      `M${x} 485C${x - 6} 311 ${x + 15} 108 ${197 + i * 0.95} ${80 + i * 0.35}C${260 + i * 0.2} ${83 + i * 0.6} ${296 + i * 0.1} 115 ${298 + i * 0.12} 145`,
      "",
      "#b3c9c0",
      0.55,
    );
  }
  for (let i = 0; i < 50; i++) {
    const x = 124 + i * 4,
      y = 84 + Math.sin(i * 0.15) * 10;
    path(
      c,
      `M${x} ${y}q-6 -18 -14 -11q3 10 9 13q-11 -2 -13 9q6 4 13 -1`,
      "#e0e0c4",
      "#547795",
      0.4,
    );
  }
  for (let row = 0; row < 8; row++)
    for (let col = 0; col < 27; col++) {
      const x = col * 20 + (row % 2) * 10,
        y = 438 + row * 9;
      path(
        c,
        `M${x - 10} ${y + 12}A10 10 0 0 1 ${x + 10} ${y + 12}M${x - 7} ${y + 12}A7 7 0 0 1 ${x + 7} ${y + 12}`,
        "",
        "#c2d5cc",
        0.5,
      );
    }
  rect(c, 21, 13, 27, 173, "#f5e8bc");
  vertical(c, "太平洋橫渡", 34, 35, 20, "#3c483c");
  vertical(c, "一九五九年", 62, 24, 10, "#3c483c");
  rect(c, 53, 98, 16, 26, "#ac3e33");
  for (let i = 0; i < 4; i++)
    path(
      c,
      `M${120 + i * 57} ${46 + (i % 2) * 35}q6 -6 13 0q6 -6 13 0`,
      "",
      "#4e625d",
      1,
    );
}
function philosophy(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#865d37");
  rect(c, 10, 22, 480, 405, "#2a503f");
  const r = random(5);
  for (let i = 0; i < 20; i++) {
    c.save();
    c.globalAlpha = 0.012;
    circle(c, r() * 480, r() * 400, 20 + r() * 55, "#e4ead0");
    c.restore();
  }
  text(c, "PHILOSOPHY 101", 27, 56, 27, "#e5e9d6", "Georgia", "bold");
  rect(c, 0, 430, 500, 70, "#795634");
  for (let x = 4; x < 500; x += 41) line(c, [x, 431, x, 499], "#55472c", 1);
  rect(c, 332, 470, 100, 29, "#a02d2c");
  rect(c, 339, 452, 91, 15, "#c4a87e");
  rect(c, 339, 438, 95, 14, "#2a526c");
  circle(c, 467, 478, 18, "#b72323");
  path(c, "M468 460q-5 -12 9 -14", "", "#556b35", 3);
  for (let i = 0; i < 3; i++)
    rect(c, 23 + i * 15, 421, 10, 3, ["#dedbc4", "#dab355", "#b7c6d1"][i]);
}
function school(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#f4ecd6");
  rect(c, 18, 18, 464, 464, "#795044");
  const r = random(3);
  for (let y = 26; y < 351; y += 21) {
    line(c, [18, y, 482, y], "#94614d", 1);
    for (let x = (y % 42) * 2; x < 482; x += 73)
      line(c, [x, y, x, y + 21], "#613f35", 0.8);
  }
  rect(c, 18, 354, 464, 128, "#8b744f");
  for (let i = 0; i < 9; i++)
    line(c, [250 + (i - 4) * 30, 354, 250 + (i - 4) * 76, 482], "#907242", 0.7);
  rect(c, 123, 43, 265, 63, "#bc3931");
  c.strokeStyle = "#e1a864";
  c.strokeRect(129, 49, 253, 51);
  text(c, "振藩國術館", 255, 88, 33, "#efd178", "serif", "bold", "center");
  rect(c, 156, 118, 203, 23, "#f0e5c2");
  text(
    c,
    "JUN FAN GUNG FU INSTITUTE",
    257,
    134,
    10,
    "#302a22",
    "Arial",
    "bold",
    "center",
  );
  for (let i = 0; i < 6; i++)
    line(c, [309 + i * 17, 166, 309 + i * 17, 278], "#dac393", 3);
  rect(c, 18, 167, 36, 112, "#e3d2a7");
  rect(c, 446, 168, 36, 115, "#e3d2a7");
  for (let y = 170; y < 280; y += 5) {
    line(c, [18, y, 54, y], "#b7ad8d", 0.7);
    line(c, [446, y, 482, y], "#b7ad8d", 0.7);
  }
  for (let i = 0; i < 30; i++)
    rect(c, 18 + r() * 465, 356 + r() * 125, 1, 1, "#b0915b");
}
function longBeach(c: Ctx) {
  gradient(c, "#f4eac7", "#decba0");
  border(c, "#6e633e", 8, 2);
  border(c, "#6e633e", 13, 0.7);
  rect(c, 25, 20, 450, 25, "#b83b2d");
  text(
    c,
    "◊  ED PARKER PRESENTS  ◊",
    250,
    38,
    13,
    "#f6ebc8",
    "Georgia",
    "bold",
    "center",
  );
  text(c, "LONG BEACH", 250, 98, 45, "#25261d", "Georgia", "bold", "center");
  text(
    c,
    "KARATE CHAMPIONSHIPS",
    250,
    137,
    27,
    "#b04432",
    "Georgia",
    "bold",
    "center",
  );
  line(c, [24, 149, 476, 149], "#4d4b35", 2);
  text(
    c,
    "INTERNATIONAL · AUGUST 2, 1964",
    250,
    168,
    14,
    "#34352a",
    "Georgia",
    "bold",
    "center",
  );
  line(c, [24, 181, 476, 181], "#4d4b35", 1);
  text(
    c,
    "★  ONE INCH PUNCH  ★  TWO FINGER PUSH-UPS  ★",
    250,
    205,
    12,
    "#a8362b",
    "Georgia",
    "bold",
    "center",
  );
  line(c, [25, 408, 475, 408], "#353729", 1.6);
  line(c, [144, 401, 320, 401], "#37392a", 1);
  text(
    c,
    "MUNICIPAL AUDITORIUM",
    250,
    449,
    23,
    "#303326",
    "Georgia",
    "bold",
    "center",
  );
  text(
    c,
    "LONG BEACH, CALIFORNIA",
    250,
    470,
    15,
    "#b43c2c",
    "Georgia",
    "bold",
    "center",
  );
}
function hornet(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#231d15");
  rect(c, 0, 72, 500, 357, "#1d2d54");
  text(
    c,
    "THE GREEN HORNET",
    250,
    53,
    31,
    "#74bc58",
    "Arial",
    "italic bold",
    "center",
  );
  line(c, [0, 72, 500, 72], "#629c48", 2);
  circle(c, 355, 104, 36, "#e1d9a9");
  buildings(c, true);
  rect(c, 0, 428, 500, 72, "#332c24");
  rect(c, 22, 86, 102, 32, "#e4d29d");
  text(c, "NOW INTRODUCING", 26, 97, 8, "#21271e", "Arial", "bold");
  text(c, "KATO!", 26, 111, 14, "#ba3c2b", "Arial", "italic bold");
  path(c, "M20 402L45 365Q122 349 199 365L215 398Z", "#162623");
  circle(c, 61, 410, 15, "#141a14");
  circle(c, 179, 410, 15, "#141a14");
  circle(c, 68, 394, 4, "#c8e6ad");
  path(c, "M72 394L390 364L390 421Z", "#416e57");
}
function notebook(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#f6f3e5");
  rect(c, 0, 0, 24, 500, "#61422b");
  line(c, [78, 0, 78, 500], "#d5b8ad", 0.8);
  for (let y = 20; y < 500; y += 15) line(c, [25, y, 500, y], "#dddccd", 0.7);
  for (let y = 17; y < 492; y += 23) {
    circle(c, 35, y, 5, "#605d49");
    path(c, `M18 ${y - 3}Q49 ${y - 10} 38 ${y + 5}`, "", "#e0ded0", 2);
  }
  text(c, "Jeet Kune Do — 截拳道", 103, 44, 20, "#435488", "Georgia", "italic");
  path(c, "M381 0L396 2L350 61L334 71L338 54Z", "#202e71");
  line(c, [385, 0, 342, 58], "#7783ad", 2);
  circle(c, 440, 431, 37, "", "#b8b8a3", 0.7);
  circle(c, 444, 430, 32, "", "#d2d0bc", 0.6);
  path(c, "M485 500L500 472L500 500Z", "#433d2c");
}
function marlowe(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#374036");
  rect(c, 113, 52, 263, 231, "#141915");
  for (let y = 62; y < 274; y += 10) line(c, [120, y, 368, y], "#c7cbb8", 3);
  rect(c, 27, 187, 86, 271, "#635640");
  rect(c, 35, 198, 70, 99, "#a3a28b");
  text(c, "PRIVATE", 70, 237, 9, "#585d4c", "Arial", "normal", "center");
  rect(c, 376, 140, 110, 316, "#354430");
  const r = random(77);
  for (let y = 145; y < 447; y += 61)
    for (let x = 382; x < 483;) {
      const w = 8 + r() * 12;
      rect(
        c,
        x,
        y,
        w,
        45 + r() * 8,
        ["#856c37", "#3d7180", "#ad9d5a", "#5f6853"][Math.floor(r() * 4)],
      );
      x += w + 2;
    }
  rect(c, 113, 277, 263, 180, "#828b77");
  line(c, [131, 362, 301, 362], "#6b5a39", 5);
  line(c, [148, 360, 149, 458], "#615339", 4);
  line(c, [290, 360, 290, 458], "#615339", 4);
  rect(c, 0, 459, 500, 41, "#121713");
  text(c, "MARLOWE", 20, 489, 30, "#d9bb52", "Georgia", "bold");
  text(
    c,
    "Hollywood, 1969",
    477,
    488,
    10,
    "#e0dfc9",
    "Georgia",
    "italic",
    "right",
  );
}
function television(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#b8753c");
  for (let y = 0; y < 445; y += 40)
    for (let x = 0; x < 500; x += 40) {
      circle(c, x + 20, y + 20, 11, "#bb7b3d");
      circle(c, x + 20, y + 20, 6, "#daa05b");
      circle(c, x + 22, y + 17, 3, "#e5b771");
    }
  rect(c, 19, 32, 462, 390, "#4c2c10");
  c.fillStyle = "#828981";
  c.beginPath();
  c.roundRect(43, 54, 345, 340, 30);
  c.fill();
  rect(c, 397, 54, 68, 334, "#251c0e");
  for (let y = 223; y < 374; y += 5) line(c, [405, y, 457, y], "#6d572f", 0.6);
  for (const y of [90, 153]) {
    circle(c, 431, y, 23, "#dddcc4");
    line(c, [431, y, 441, y - 16], "#494935", 2);
  }
  text(c, "COLOR TV", 430, 203, 8, "#c3ad6d", "Arial", "normal", "center");
  line(c, [250, 32, 250, 14, 197, 0], "#242b20", 1.2);
  line(c, [250, 14, 290, 0], "#242b20", 1.2);
  rect(c, 0, 453, 500, 47, "#604021");
  for (const x of [72, 425]) rect(c, x, 420, 8, 37, "#33220e");
  rect(c, 61, 285, 70, 64, "#353e33");
  circle(c, 100, 259, 14, "#424b3f");
  rect(c, 94, 276, 19, 40, "#424b3f");
  rect(c, 286, 324, 91, 28, "#4b5348");
  for (let x = 45; x < 385; x += 8)
    rect(c, x, 55, 4, 337, "rgba(215,222,205,.075)");
}
function factory(c: Ctx) {
  gradient(c, "#46565b", "#14212b");
  for (let x = 40; x < 500; x += 68) {
    path(c, `M${x} 64L${x + 55} 59L${x + 28} 443L${x + 18} 443Z`, "#263940");
    line(c, [x + 16, 78, x + 19, 151], "#8d9b9b", 2);
    path(c, `M${x + 19} 149q0 21 -8 15q-7 -4 -2 -12`, "", "#7a8c8d", 2);
  }
  for (const [x, y, w, h] of [
    [0, 210, 85, 235],
    [447, 312, 53, 133],
  ]) {
    for (let yy = y; yy < y + h; yy += 44)
      for (let xx = x; xx < x + w; xx += 43) {
        const g = c.createLinearGradient(xx, yy, xx + 43, yy + 44);
        g.addColorStop(0, "#c4e5ee");
        g.addColorStop(1, "#78aabf");
        c.fillStyle = g;
        c.fillRect(xx + 1, yy + 1, 41, 42);
        line(c, [xx + 3, yy + 3, xx + 38, yy + 3], "#e2eff0", 1);
      }
  }
  rect(c, 0, 0, 500, 63, "#ae1d28");
  text(c, "唐山大兄", 18, 49, 49, "#edcc4f", "serif", "bold");
  text(c, "李小龍", 221, 42, 17, "#efdbc7", "serif", "bold");
  rect(c, 306, 9, 181, 43, "#251313");
  text(c, "HONG KONG BOX OFFICE", 313, 24, 8, "#dcd6b6", "Arial");
  rect(c, 0, 454, 500, 46, "#090e10");
  text(c, "THE BIG BOSS", 250, 488, 35, "#f3c741", "Georgia", "bold", "center");
}
function dojo(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#7f5b32");
  rect(c, 0, 0, 500, 58, "#131610");
  rect(c, 0, 59, 500, 295, "#f0ddb3");
  for (let x = 0; x < 500; x += 26) {
    rect(c, x, 60, 4, 294, "#362c1c");
    for (let y = 95; y < 350; y += 36) line(c, [x, y, x + 26, y], "#4c3c23", 1);
  }
  for (let x = 38; x < 500; x += 108) rect(c, x, 58, 10, 297, "#312718");
  rect(c, 194, 175, 117, 162, "#4c331b");
  rect(c, 202, 183, 100, 146, "#f2e5bd");
  text(c, "病 東", 252, 227, 27, "#2b2c22", "serif", "bold", "center");
  text(c, "亞 夫", 252, 289, 27, "#2b2c22", "serif", "bold", "center");
  rect(c, 191, 28, 118, 27, "#eee4cc");
  text(c, "虹口道場", 250, 47, 19, "#242b20", "serif", "bold", "center");
  for (let x = 0; x < 500; x += 38)
    line(c, [250 + (x - 250) * 0.6, 355, x, 454], "#8f693c", 0.7);
  rect(c, 0, 455, 500, 45, "#080e0a");
  text(c, "精武門", 16, 482, 17, "#ebe4c8", "serif", "bold");
  text(
    c,
    "Shanghai, 1908 — blood and fury",
    480,
    481,
    10,
    "#e1d6b5",
    "Georgia",
    "italic",
    "right",
  );
}
function colosseum(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#dbd7c4");
  rect(c, 38, 44, 425, 400, "#d5c79e");
  rect(c, 46, 40, 408, 48, "#939d9c");
  text(
    c,
    "ROMA · MCMLXXII",
    250,
    72,
    24,
    "#32392a",
    "Georgia",
    "bold",
    "center",
  );
  for (let row = 0; row < 3; row++) {
    const y = 117 + row * 89;
    for (let col = 0; col < 13; col++) {
      const x = 56 + col * 30;
      path(
        c,
        `M${x} ${y + 64}L${x} ${y + 14}A10 14 0 0 1 ${x + 20} ${y + 14}L${x + 20} ${y + 64}Z`,
        "#7d7359",
      );
      rect(c, x - 4, y + 66, 29, 9, "#ac9e76");
    }
    line(c, [43, y + 77, 460, y + 77], "#b7a77c", 4);
  }
  const r = random(272);
  for (let i = 0; i < 30000; i++) {
    const x = r() * 500,
      y = r() * 500;
    if (x < 36 || x > 463 || y < 34 || y > 462) {
      const cols = ["#e6e0cd", "#292b29", "#72726b"];
      rect(
        c,
        Math.floor(x / 2) * 2,
        Math.floor(y / 2) * 2,
        1.7,
        1.7,
        cols[Math.floor(r() * 3)],
      );
    }
  }
  for (let y = 5; y < 500; y += 9) {
    line(c, [8, y, 32, y], "#e0ddc6", 1);
    line(c, [466, y, 492, y], "#e0ddc6", 1);
  }
  line(c, [39, 448, 463, 448], "#92885f", 2);
  c.save();
  c.globalAlpha = 0.24;
  for (let q = 36; q < 464; q += 2) {
    line(c, [q, 34, q, 462], "#e8dec5", 0.3);
    line(c, [36, q, 464, q], "#e8dec5", 0.3);
  }
  c.restore();
}
function arcade(c: Ctx) {
  gradient(c, "#5a4f95", "#f3986e");
  for (const x of [12, 359])
    path(c, `M${x - 32} 287L${x + 70} 174L${x + 166} 287Z`, "#584879");
  path(c, "M63 282L94 193L111 244L104 291Z", "#44395e");
  rect(c, 224, 174, 59, 115, "#8f3a2c");
  for (let i = 0; i < 7; i++) {
    const y = 42 + i * 25,
      w = 24 + i * 14;
    rect(c, 254 - w / 2 + 6, y, w - 12, 25, "#bd4b31");
    for (let x = 254 - w / 2 + 11; x < 254 + w / 2 - 10; x += 13)
      rect(c, x, y + 4, 5, 14, "#e2bd50");
    path(
      c,
      `M${254 - w / 2 - 8} ${y + 25}L254 ${y + 10}L${254 + w / 2 + 8} ${y + 25}Z`,
      "#34654a",
    );
  }
  floor(c, 291, "#b1b2a7", "#9da294");
  rect(c, 19, 13, 190, 20, "#10152e");
  rect(c, 22, 16, 184, 13, "#efd741");
  rect(c, 289, 13, 190, 20, "#10152e");
  rect(c, 292, 16, 184, 13, "#efd741");
  rect(c, 226, 11, 48, 43, "#0a102c");
  text(c, "99", 250, 40, 28, "#f4d54a", "monospace", "bold", "center");
  text(c, "LEE", 22, 50, 12, "#f5eed4", "monospace", "bold");
  text(c, "THE GIANT", 479, 50, 12, "#f5eed4", "monospace", "bold", "right");
  rect(c, 95, 459, 310, 24, "#1c2964");
  c.strokeStyle = "#ece4c6";
  c.strokeRect(95, 459, 310, 24);
  text(
    c,
    "FLOOR 5 · THE TOWER",
    250,
    476,
    11,
    "#f0eccd",
    "monospace",
    "bold",
    "center",
  );
}
function mirrors(c: Ctx) {
  rect(c, 0, 0, 500, 500, "#080f10");
  for (let i = 0; i < 4; i++) {
    const x = 19 + i * 120;
    const g = c.createLinearGradient(x, 0, x + 112, 500);
    g.addColorStop(0, "#54616c");
    g.addColorStop(0.5, "#1f2b36");
    g.addColorStop(1, "#0e1920");
    c.fillStyle = g;
    c.fillRect(x, 50, 110, 400);
    c.strokeStyle = "#9ca8ac";
    c.lineWidth = 2;
    c.strokeRect(x, 50, 110, 400);
    path(
      c,
      `M${x + 32} 51L${x + 91} 51L${x + 24} 450L${x} 450Z`,
      "rgba(215,222,224,.10)",
    );
  }
  rect(c, 0, 462, 500, 38, "#030a09");
  text(c, "龍爭虎鬥", 19, 487, 16, "#c4b263", "serif", "bold");
  text(
    c,
    "ENTER THE DRAGON · 1973",
    480,
    486,
    8,
    "#e3e4cd",
    "Arial",
    "normal",
    "right",
  );
}
function legend(c: Ctx) {
  gradient(c, "#090a27", "#151d42");
  buildings(c, true);
  // Recognizable Hong Kong towers, drawn independently of the reference pixels.
  path(c, "M35 359L35 46L62 46L81 23L81 359Z", "#17203a");
  for (let yy = 58; yy < 354; yy += 10)
    for (let xx = 40; xx < 77; xx += 7)
      if ((xx + yy) % 3)
        rect(c, xx, yy, 1.3, 2.2, yy % 30 ? "#a6b9ce" : "#e4d896");
  path(
    c,
    "M227 359L227 150L249 104L272 150L272 359Z",
    "#142139",
    "#52627d",
    0.8,
  );
  for (let yy = 161; yy < 350; yy += 24) {
    line(c, [227, yy, 272, yy + 24, 227, yy + 48], "#9dacc2", 0.6);
    for (let xx = 232; xx < 270; xx += 6)
      rect(c, xx, yy + 8, 1.2, 1.8, "#d6d8b3");
  }
  path(c, "M335 359L335 116L357 85L379 116L379 359Z", "#18263f");
  for (let yy = 127; yy < 355; yy += 11)
    for (let xx = 341; xx < 375; xx += 8) rect(c, xx, yy, 1.4, 1.8, "#bdc8c7");
  rect(c, 0, 359, 500, 57, "#071327");
  rect(c, 0, 413, 500, 87, "#29303c");
  for (let x = -500; x < 1000; x += 53)
    line(c, [250 + (x - 250) * 0.3, 417, x, 500], "#45505c", 0.6);
  for (let y = 419; y < 500; y += 18) line(c, [0, y, 500, y], "#38434e", 0.6);
  rect(c, 405, 390, 68, 13, "#3c8666");
  rect(c, 414, 383, 54, 9, "#e9ecd5");
  for (let i = 0; i < 10; i++)
    line(c, [i * 52, 359, i * 52, 414], "#162a3c", 2);
}

const drawers = [
  paperCut,
  bridge,
  kid,
  mountains,
  ballroom,
  newspaper,
  voyage,
  philosophy,
  school,
  longBeach,
  hornet,
  notebook,
  marlowe,
  television,
  factory,
  dojo,
  colosseum,
  arcade,
  mirrors,
  legend,
];
function paperBuildings(c: Ctx) {
  for (const [x, y, w] of [
    [12, 245, 105],
    [124, 279, 90],
    [221, 259, 90],
    [320, 263, 90],
    [420, 281, 69],
  ]) {
    rect(c, x, y, w, 192, p.red);
    path(
      c,
      `M${x - 5} ${y}Q${x + w / 2} ${y - 24} ${x + w + 6} ${y}L${x + w} ${y + 8}L${x} ${y + 8}Z`,
      p.red,
    );
    for (let yy = y + 21; yy < 434; yy += 24)
      for (let xx = x + 12; xx < x + w - 5; xx += 20)
        rect(c, xx, yy, 7, 12, p.cream);
  }
}
function paperCut(c: Ctx) {
  gradient(c, "#f3d79d", "#f8e7b4");
  rect(c, 0, 0, 500, 500, p.red);
  rect(c, 9, 9, 482, 427, p.cream);
  border(c, "#e7c27b", 6, 1);
  rect(c, 15, 14, 470, 420, "#f5dfa7");
  paperBuildings(c);
  rect(c, 0, 437, 500, 63, p.red);
  for (let x = 28; x < 500; x += 58) {
    path(
      c,
      `M${x - 9} 473q12 -14 22 -4q4 11 -8 11q-9 -1 -1 -6`,
      "",
      "#f0d19c",
      1.4,
    );
  }
  for (const [x, words] of [
    [44, "庚辰龍年"],
    [453, "金山李振藩"],
  ] as const) {
    rect(c, x - 15, 17, 30, 152, p.red);
    c.strokeStyle = "#deb95c";
    c.strokeRect(x - 11, 22, 22, 142);
    vertical(c, words, x, 42, 24, "#f1d278");
  }
  for (let i = 0; i < 17; i++)
    path(c, `M25 ${15 + i * 24}l-12 7v6l12 -6l11 6v-6Z`, p.red);
  for (let row = 0; row < 2; row++) {
    const y = 61 + row * 42;
    path(c, `M70 ${y} Q265 ${y + 55} 480 ${y}`, "", "#55482a", 0.8);
    for (let i = 0; i < 5; i++) {
      const x = 103 + i * 76 + row * 27,
        yy = y + 13 + Math.sin(((x - 70) / 410) * Math.PI) * 26;
      line(c, [x, yy - 11, x, yy], p.red, 0.7);
      circle(c, x, yy + 11, 12, p.red);
      line(c, [x - 4, yy + 2, x - 4, yy + 21], "#c56a33", 1);
      line(c, [x + 4, yy + 2, x + 4, yy + 21], "#c56a33", 1);
      rect(c, x - 2, yy + 24, 4, 10, "#d7b046");
    }
  }
}
export function renderBackground(index: number, pixels: number, seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = pixels;
  const c = canvas.getContext("2d");
  if (!c) throw new Error("Canvas 2D is unavailable.");
  c.scale(pixels / 500, pixels / 500);
  drawers[index](c);
  grain(c, seed + index, 12000);
  return canvas;
}
