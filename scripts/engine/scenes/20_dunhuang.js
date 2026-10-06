// Dunhuang Murals (Mogao Grottoes·Prosperous Tang Dynasty) - pure code.
// Pipeline: ① Earth red ground battle (mottled, smoky, cached) → ② Top hanging curtain pattern + curly grass edge → ③ Window = Shi Qingtian: flying ribbons flying by, auspicious clouds flowing
//      → ④ Lotus tile floor, low case, oil lamp → ⑤ Cat: ocher red flat paint + iron line drawing → ⑥ Girl: Donor of the Tang Dynasty (high bun, flower mother-of-pearl, mid-color skirt, fluttering silk)
//      → ⑦ Ceiling (scattered petals) floating down → ⑧ Overlay: The paint is uneven, cracked, peeling off to reveal a white gray floor, and overall faded; peeling paint flakes occasionally fall off
SCENES['20_dunhuang'] = (() => {
  const W = 1920, H = 1080, { clamp, lerp, rng } = U, P = PAINT;
  const { ss } = U;
  const C = { red: '#a5452f', redDk: '#7a2e1e', ochre: '#e08a3a', green: '#3f8f6e', green2: '#6ab08e', blue: '#2f5f8f', blue2: '#5a86b0', white: '#ecdfc4', ink: '#2a1a14', line: '#5a2414', skin: '#f2dcc4', gold: '#d8b05a', plaster: '#d8c6a2' };
  const LW = 2.6;
  const F = (c, p, fill, lw = LW, line = C.line) => { if (fill) { c.fillStyle = fill; c.fill(p); } if (lw) { c.strokeStyle = line; c.lineWidth = lw; c.stroke(p); } };

  // ---------- Ground battle: Earthy red, mottled ----------
  const ground = () => P.cached('dh_ground', W, H, (g) => {
    g.drawImage(P.texture('dh_red', C.red, { scale: 0.003, amt: 30, grain: 16, dark: '#7a3020', seed: 3 }), 0, 0);
    // Tuanhua: Sparse light-colored round floral decoration (faded)
    const r = rng(8);
    for (let i = 0; i < 16; i++) { const x = 100 + r() * 1700, y = 260 + r() * 400; if (x > 330 && x < 840 && y < 600) continue; if (x > 1080 && x < 1520) continue;
      g.save(); g.translate(x, y); g.globalAlpha = 0.5;
      for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.fillStyle = k % 2 ? C.green2 : C.white; g.beginPath(); g.ellipse(0, -16, 7, 14, 0, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = C.blue2; g.beginPath(); g.arc(0, 0, 8, 0, Math.PI * 2); g.fill(); g.restore(); }
    // Top: rolled grass edge + hanging curtain pattern (triangular hanging tent, alternating azurite, green, earth and red)
    g.fillStyle = C.redDk; g.fillRect(0, 0, W, 34);
    g.strokeStyle = C.green2; g.lineWidth = 4; g.beginPath(); for (let x = 0; x <= W; x += 4) { const y = 17 + Math.sin(x * 0.05) * 9; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    for (let x = 0; x < W; x += 80) { g.strokeStyle = C.white; g.lineWidth = 2.5; g.beginPath(); g.arc(x + 40, 17 + Math.sin((x + 40) * 0.05) * 9, 8, 0, Math.PI * 1.5); g.stroke(); }
    const cols = [C.blue, C.green, C.white, C.red];
    for (let x = 0, k = 0; x < W; x += 64, k++) { g.fillStyle = cols[k % 4]; g.beginPath(); g.moveTo(x, 34); g.lineTo(x + 64, 34); g.lineTo(x + 32, 84); g.closePath(); g.fill(); g.strokeStyle = C.line; g.lineWidth = 2; g.stroke();
      g.fillStyle = C.gold; g.beginPath(); g.arc(x + 32, 88, 5, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = C.redDk; g.fillRect(0, 34, W, 5);
  });

  // ---------- Window: Shi Qingtian, Xiangyun, Feitian ----------
  function cloud(c, x, y, s, t, ph) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = C.white; c.strokeStyle = C.line; c.lineWidth = 2.2 / s;
    [[0, 0, 18], [-22, 6, 13], [20, 6, 14], [-8, -14, 12], [10, -12, 11]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(dx, dy, r, 0, Math.PI * 2); c.fill(); c.stroke(); });
    c.fillStyle = C.white; c.beginPath(); c.ellipse(0, 4, 32, 12, 0, 0, Math.PI * 2); c.fill();
    [[0, 0, 10], [-22, 6, 7], [20, 6, 8]].forEach(([dx, dy, r]) => { c.strokeStyle = C.green; c.beginPath(); c.arc(dx, dy, r, 0.3, Math.PI * 1.7); c.stroke(); });
    // Cloud tail: a tapering tail
    c.fillStyle = C.white; c.fill(KIT.ribbon(KIT.densify([[30, 8], [60, 14 + Math.sin(ph) * 3], [95, 6 + Math.sin(ph + 1) * 5], [120, 12]], 5), q => 16 * (1 - q) + 1)); c.restore();
  }
  function apsara(c, t, lt) {
    // Flying: The lying body flies to the left, with the head on the left, and two long streamers trailing behind it to form an S shape (traveling wave)
    const x = 760 - lt * 300, y = 300 + Math.sin(lt * 3.2) * 22;
    c.save(); c.translate(x, y); c.scale(1.35, 1.35); c.rotate(-0.12 + Math.sin(lt * 3.2) * 0.05);
    const rib = (ox, oy, len, col, ph, amp) => { const pts = []; for (let i = 0; i <= 18; i++) { const q = i / 18; pts.push([ox + q * len, oy + Math.sin(q * 5.5 - t * 7 + ph) * amp * (0.3 + q) - q * 30]); } const p = KIT.ribbon(pts, q => 15 * (1 - q * 0.7)); F(c, p, col, 2); };
    rib(40, -6, 300, C.green, 0, 26); rib(30, 10, 270, C.red, 1.6, 30);
    // The large arc streamer that goes around the top of the head (the most recognizable shape of Feitian): starts from the shoulders, arcs over the top of the head, and then throws it behind the back
    { const pts = []; for (let i = 0; i <= 30; i++) { const q = i / 30; let x, y; if (q < 0.45) { const a = Math.PI * 0.9 - q / 0.45 * Math.PI * 1.15; x = -40 + Math.cos(a) * 70; y = -30 - Math.abs(Math.sin(a)) * 80; } else { const u = (q - 0.45) / 0.55; x = -40 + Math.cos(Math.PI * 0.9 - Math.PI * 1.15) * 70 + u * 260; y = -30 - Math.abs(Math.sin(-Math.PI * 0.25)) * 80 + Math.sin(u * 5 - t * 7) * 26 * u - u * 20; } pts.push([x, y]); }
      F(c, KIT.ribbon(pts, q => 13 * (1 - q * 0.6)), C.blue2, 2); }
    // Long skirt (flowing backwards)
    F(c, RIG.smooth([[0, -16], [70, -18], [150, -10 + Math.sin(t * 6) * 6], [190, 4 + Math.sin(t * 6 + 1) * 8], [140, 20], [60, 18], [0, 14]]), C.blue, 2.2);
    for (let k = 0; k < 3; k++) { c.strokeStyle = C.white; c.lineWidth = 2; c.beginPath(); c.moveTo(30 + k * 40, -12); c.quadraticCurveTo(60 + k * 40, 0, 40 + k * 46, 16); c.stroke(); }
    // Upper body, arm support flower tray
    F(c, RIG.smooth([[-40, -18], [0, -22], [8, 0], [0, 16], [-36, 12]]), C.skin, 2.2);
    F(c, RIG.smooth([[-30, -14], [-70, -34], [-86, -30], [-78, -20], [-40, -4]]), C.skin, 2);
    c.fillStyle = C.gold; c.beginPath(); c.ellipse(-90, -36, 18, 6, -0.2, 0, Math.PI * 2); c.fill(); c.strokeStyle = C.line; c.lineWidth = 2; c.stroke();
    [[-98, -44, C.red], [-88, -46, C.white], [-80, -42, C.red]].forEach(([fx, fy, fc]) => { c.fillStyle = fc; c.beginPath(); c.arc(fx, fy, 5, 0, Math.PI * 2); c.fill(); });
    // Head: Head light (round light) + bun
    c.fillStyle = 'rgba(106,176,142,.28)'; c.beginPath(); c.arc(-56, -24, 30, 0, Math.PI * 2); c.fill(); c.strokeStyle = C.line; c.lineWidth = 1.4; c.stroke();
    c.strokeStyle = C.white; c.lineWidth = 2.5; c.beginPath(); c.arc(-56, -24, 24, 0, Math.PI * 2); c.stroke();
    F(c, (() => { const p = new Path2D(); p.ellipse(-56, -22, 15, 17, 0, 0, Math.PI * 2); return p; })(), C.skin, 2);
    c.fillStyle = '#1e1410'; c.beginPath(); c.ellipse(-52, -38, 13, 9, 0.3, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(-46, -48, 7, 0, Math.PI * 2); c.fill();
    c.fillStyle = C.line; c.fillRect(-64, -23, 4, 1.6); c.fillStyle = '#c0392b'; c.beginPath(); c.arc(-66, -14, 1.8, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  function windowPanel(c, t, lt) {
    c.save(); c.beginPath(); c.rect(370, 140, 420, 400); c.clip();
    const sg = c.createLinearGradient(0, 140, 0, 540); sg.addColorStop(0, '#2a5a86'); sg.addColorStop(1, '#4f86a8'); c.fillStyle = sg; c.fillRect(370, 140, 420, 400);
    [[460, 200, 0.9, 0], [700, 450, 1.1, 1], [520, 490, 0.8, 2], [760, 190, 0.7, 3]].forEach(([x, y, s, k]) => cloud(c, ((x - lt * (40 + k * 12) - 370 + 1000) % 520) + 330, y + Math.sin(t * 1.5 + k) * 4, s, t, t * 3 + k));
    apsara(c, t, lt);
    c.restore();
    // Window frame: curly grass pattern border (stone green + white tendrils)
    c.fillStyle = C.green; c.fillRect(348, 118, 464, 22); c.fillRect(348, 540, 464, 24); c.fillRect(348, 118, 22, 446); c.fillRect(790, 118, 22, 446);
    c.strokeStyle = C.white; c.lineWidth = 2.5;
    const vine = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(L / 34); for (let i = 0; i < n; i++) { const q = (i + 0.5) / n, x = lerp(x0, x1, q), y = lerp(y0, y1, q); c.beginPath(); c.arc(x, y, 7, i % 2 ? 0 : Math.PI, (i % 2 ? 0 : Math.PI) + Math.PI * 1.4); c.stroke(); } };
    vine(359, 129, 801, 129); vine(359, 552, 801, 552); vine(359, 140, 359, 540); vine(801, 140, 801, 540);
    c.strokeStyle = C.line; c.lineWidth = 3; c.strokeRect(348, 118, 464, 446); c.strokeRect(370, 140, 420, 400);
  }
  // ---------- Ground: Lotus Brick ----------
  const floor = () => P.cached('dh_floor', W, H, (g) => {
    g.fillStyle = '#b8654a'; g.fillRect(0, 704, W, H - 704);
    g.fillStyle = C.redDk; g.fillRect(0, 700, W, 8);
    for (let x = 0; x < W; x += 150) for (let y = 714; y < H; y += 150) {
      g.strokeStyle = 'rgba(70,30,20,.6)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, 144, 144);
      g.save(); g.translate(x + 75, y + 75);
      for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.fillStyle = k % 2 ? C.green2 : C.white; g.beginPath(); g.ellipse(0, -34, 12, 26, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = C.line; g.lineWidth = 1.6; g.stroke(); }
      g.fillStyle = C.blue2; g.beginPath(); g.arc(0, 0, 16, 0, Math.PI * 2); g.fill(); g.stroke(); g.fillStyle = C.gold; g.beginPath(); g.arc(0, 0, 6, 0, Math.PI * 2); g.fill();
      g.restore(); }
  });
  // ---------- Case and Oil Lamp ----------
  function table(c, t) {
    F(c, new Path2D('M806 616 L1214 616 L1206 650 L814 650 Z'), C.green);
    F(c, new Path2D('M830 650 L1190 650 L1190 700 L830 700 Z'), C.red);
    c.fillStyle = C.redDk; [[880, 660], [990, 660], [1100, 660]].forEach(([x, y]) => { c.beginPath(); c.moveTo(x, y + 34); c.quadraticCurveTo(x + 6, y + 4, x + 40, y + 6); c.quadraticCurveTo(x + 74, y + 4, x + 80, y + 34); c.closePath(); c.fill(); });   // arched doorway
    F(c, new Path2D('M838 700 L868 700 L862 905 L842 905 Z'), C.red); F(c, new Path2D('M1152 700 L1182 700 L1178 905 L1158 905 Z'), C.red);
    // Oil lamp: lamp + dancing flame
    F(c, new Path2D('M880 604 Q910 618 940 604 L934 616 Q910 626 886 616 Z'), C.gold, 2);
    const fl = 1 + Math.sin(t * 17) * 0.12 + Math.sin(t * 29) * 0.08, sw = Math.sin(t * 11) * 4;
    c.save(); c.globalCompositeOperation = 'lighter'; const gg = c.createRadialGradient(910, 585, 2, 910, 585, 60); gg.addColorStop(0, 'rgba(255,200,90,.45)'); gg.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = gg; c.fillRect(850, 525, 120, 120); c.restore();
    F(c, new Path2D(`M902 604 Q${898 + sw} ${598 - 14 * fl} ${910 + sw} ${574 - 14 * fl} Q${922 + sw * 0.5} ${596 - 10 * fl} 918 604 Z`), '#f2a43a', 1.8);
    c.fillStyle = '#fbe7a0'; c.beginPath(); c.ellipse(910 + sw * 0.4, 596, 4, 7 * fl, 0, 0, Math.PI * 2); c.fill();
  }

  // Silk: stone green front + white pattern, with a little flip (the narrow part reveals the earthy red lining)
  function shawl(c, pts, w, t) {
    const D = KIT.densify(pts, 3), wq = q => w * (0.75 + 0.25 * Math.sin(q * 9 - t * 5)) * (1 - q * 0.25);
    F(c, KIT.ribbon(D, wq), C.green2, 2.2);
    c.strokeStyle = C.white; c.lineWidth = 2; c.beginPath(); D.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.setLineDash([3, 9]); c.stroke(); c.setLineDash([]);
    D.forEach((p, i) => { if (i % 9 !== 4) return; c.fillStyle = C.red; c.beginPath(); c.arc(p[0], p[1], 3.2, 0, Math.PI * 2); c.fill(); });
  }
  // ---------- Girl: Provider of the Tang Dynasty ----------
  function girl(c, t, ch) {
    const G = RIG.girl({ cup: ch.cup, sip: ch.sip, breathe: ch.breathe, hair: 'bun' });
    const A = G.A;
    // Shawl (the part at the back): Put it over the shoulders, and a big S floats out from the back of the chair, with the end swinging outward (a traveling wave, the wider the swing is as it goes down)
    const pbBack = []; for (let i = 0; i <= 26; i++) { const q = i / 26; pbBack.push([A.back[0] - 10 + q * 230 + Math.sin(q * 4.2 - t * 5.5) * 64 * q, A.nape[1] - 6 + q * 400 - Math.max(0, q - 0.7) * 300 * (0.7 + 0.3 * Math.sin(t * 4))]); }
    shawl(c, pbBack, 32, t);
    F(c, G.farSleeve, C.green); F(c, G.farHand, C.skin); F(c, G.farCuff, C.red, 2);
    // Secondary color skirt: red and green vertical stripes (the most recognizable piece of women’s clothing in the Tang Dynasty)
    F(c, G.skirt, C.red);
    c.save(); c.clip(G.skirt); for (let x = 1090; x < 1470; x += 44) { c.fillStyle = C.green; c.beginPath(); c.moveTo(x + 6, 600); c.lineTo(x + 26, 600); c.lineTo(x + 12 - (x - 1300) * 0.18, 940); c.lineTo(x - 10 - (x - 1300) * 0.18, 940); c.closePath(); c.fill(); }
    c.restore(); c.strokeStyle = C.line; c.lineWidth = LW; c.stroke(G.skirt);
    G.folds.forEach(f => { c.strokeStyle = C.line; c.lineWidth = 1.6; c.stroke(f); });
    F(c, G.shoe, C.ink);
    // Undershirt: Azurite short shirt, white border and collar; high waist and red belt
    F(c, G.torso, C.blue);
    c.strokeStyle = C.white; c.lineWidth = 7; c.beginPath(); c.moveTo(A.neck[0] - 14, A.neck[1] + 2); c.quadraticCurveTo(A.chest[0] + 6, A.chest[1] - 20, A.chest[0] + 26, A.chest[1] + 40); c.stroke();
    c.fillStyle = C.red; c.beginPath(); c.moveTo(1290, 590); c.lineTo(1422, 594); c.lineTo(1424, 616); c.lineTo(1294, 614); c.closePath(); c.fill(); c.strokeStyle = C.line; c.lineWidth = 2; c.stroke();
    F(c, G.neck, C.skin);
    // High bun: Blonde hair on top of head (move the bun up and make it bigger), hairpin and gold hairpin
    F(c, G.hairBack, '#e2b850', 2);
    const top = A.headTop, bunC = [top[0] + 18, top[1] - 22];
    F(c, (() => { const p = new Path2D(); p.ellipse(bunC[0], bunC[1], 34, 30, -0.3, 0, Math.PI * 2); p.moveTo(bunC[0] + 40, bunC[1] - 6); p.ellipse(bunC[0] + 22, bunC[1] - 14, 22, 20, 0.4, 0, Math.PI * 2); return p; })(), '#e2b850', 2);
    c.strokeStyle = '#a8782a'; c.lineWidth = 1.6; for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(bunC[0], bunC[1], 10 + k * 7, -2.4, -0.4); c.stroke(); }
    c.strokeStyle = C.gold; c.lineWidth = 3.5; c.beginPath(); c.moveTo(bunC[0] - 50, bunC[1] + 6); c.lineTo(bunC[0] + 40, bunC[1] - 24); c.stroke();
    [[bunC[0] - 30, bunC[1] - 26, C.red], [bunC[0] + 4, bunC[1] - 40, C.white], [bunC[0] + 44, bunC[1] - 30, C.red]].forEach(([x, y, fc], k) => { const sw = Math.sin(t * 5 + k) * 3; for (let j = 0; j < 5; j++) { c.fillStyle = fc; c.beginPath(); c.arc(x + sw + Math.cos(j * 1.26) * 6, y + Math.sin(j * 1.26) * 6, 4.5, 0, Math.PI * 2); c.fill(); } c.fillStyle = C.gold; c.beginPath(); c.arc(x + sw, y, 3, 0, Math.PI * 2); c.fill(); });
    // Face: white face, red line (iron drawing), flower pattern, oblique red, dotted lips
    F(c, G.face, C.skin, 2.2, '#8a3a24');
    F(c, G.bangs, '#e2b850', 2);
    c.fillStyle = '#c0392b'; const fh = G.A.forehead; c.save(); c.translate(fh[0] + 10, fh[1] + 12); for (let j = 0; j < 4; j++) { c.rotate(Math.PI / 2); c.beginPath(); c.ellipse(0, -4, 2, 4, 0, 0, Math.PI * 2); c.fill(); } c.restore();
    c.strokeStyle = 'rgba(200,60,50,.32)'; c.lineWidth = 2; c.beginPath(); c.moveTo(G.eye.x + 16, G.eye.y - 4); c.quadraticCurveTo(G.eye.x + 22, G.eye.y + 10, G.eye.x + 16, G.eye.y + 22); c.stroke();
    c.strokeStyle = C.ink; c.lineWidth = ch.blink ? 2 : 2.4; c.stroke(G.lid); if (!ch.blink) { c.fillStyle = C.ink; c.beginPath(); c.ellipse(G.eye.x - 1, G.eye.y + 1.5, 3, 3.4, 0, 0, Math.PI * 2); c.fill(); }
    c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(G.eye.x - 10, G.eye.y - 14); c.quadraticCurveTo(G.eye.x + 2, G.eye.y - 20, G.eye.x + 14, G.eye.y - 15); c.stroke();     // moth eyebrow
    c.fillStyle = '#c0392b'; c.beginPath(); c.arc(G.lips[0][0] + 3, G.lips[0][1] + 3, 3.4, 0, Math.PI * 2); c.fill();
    // Near side arm: Azurite narrow sleeves + red cuffs, the front part of the shawl hangs down around the arm
    F(c, G.upperArm, C.blue); F(c, G.foreArm, C.blue); F(c, G.cuff, C.red, 2);
    const E = A.elbow; const pbF = []; for (let i = 0; i <= 22; i++) { const q = i / 22; pbF.push([E[0] + 6 - q * 70 + Math.sin(q * 5 - t * 6 + 1) * 46 * q, E[1] + 6 + q * 300 - Math.max(0, q - 0.65) * 200 * (0.7 + 0.3 * Math.sin(t * 4.6 + 1))]); }
    shawl(c, pbF, 28, t);
    F(c, G.hand, C.skin, 2, '#8a3a24');
    // Tea cup: Yue kiln celadon
    const cp = G.cup; c.save(); c.translate(cp.x, cp.y); c.rotate(cp.tilt);
    F(c, new Path2D(`M${-cp.w / 2} 0 Q0 ${cp.h * 1.3} ${cp.w / 2} 0 Z`), '#8ab89a', 2.2);
    c.restore();
    c.fillStyle = C.skin; c.beginPath(); c.arc(G.thumb[0], G.thumb[1], 6.5, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#8a3a24'; c.lineWidth = 1.6; c.stroke();
    return G;
  }
  function cat(c, t, ch) {
    const K = RIG.cat({ tail: ch.tail, blink: ch.blink, breathe: ch.breathe * 2.5, look: Math.sin(t * 2.6) });
    RIG.drawCat(c, K, { orange: C.ochre, white: C.white, stripe: '#8a3a1e', line: C.line, lw: LW, eye: '#5a9a6a', earInner: '#d88a7a' });
    // Collar: Curly Grass Bell
    c.strokeStyle = C.green; c.lineWidth = 7; c.beginPath(); c.arc(K.headC[0] - 6, K.headC[1] + 18, 52, 0.7, 2.3); c.stroke();
    const bx = K.headC[0] + 4 + Math.sin(t * 8) * 4, by = K.headC[1] + 72; c.fillStyle = C.gold; c.beginPath(); c.arc(bx, by, 9, 0, Math.PI * 2); c.fill(); c.strokeStyle = C.line; c.lineWidth = 2; c.stroke();
  }
  // ---------- Overcoat: uneven pigment, cracking, peeling, fading ----------
  const AGE_MASK = (x, y) => { const n = P.fbm(x * 0.006 + 11, y * 0.006 + 4, 4) + 0.18 * P.noise(x * 0.04, y * 0.04); const keep = (x > 1180 && x < 1360 && y > 260 && y < 470); return !keep && n > 0.33; };
  const aging = () => P.cached('dh_age', W, H, (g) => {
    const img = g.createImageData(W, H), d = img.data, pl = P.hex(C.plaster), r = rng(91);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const n = P.fbm(x * 0.0032 + 11, y * 0.0032 + 4, 5) + 0.12 * P.noise(x * 0.03, y * 0.03);
      const keep = (x > 1180 && x < 1360 && y > 260 && y < 470) || (x > 380 && x < 720 && y > 530 && y < 920) || (x > 1070 && x < 1530 && y > 240 && y < 950);   // Characters do not peel off (peeling off on people will be read as "holes in clothes")
      if (!keep && n > 0.3) { const v = (r() - 0.5) * 22 + (n - 0.3) * 60; d[i] = pl[0] + v; d[i + 1] = pl[1] + v; d[i + 2] = pl[2] + v * 0.8; d[i + 3] = 255; }
      else if (!keep && n > 0.28) { d[i] = 70; d[i + 1] = 45; d[i + 2] = 30; d[i + 3] = 150; }        // Dark lines on peeling edges
      else { const m = P.fbm(x * 0.02, y * 0.02 + 7, 3); d[i] = 255; d[i + 1] = 245; d[i + 2] = 225; d[i + 3] = clamp(m * 0.5 + 0.1) * 80; }   // Pigment turns white
    }
    g.putImageData(img, 0, 0);
    // Crack
    g.strokeStyle = 'rgba(50,25,15,.35)'; g.lineWidth = 1;
    for (let k = 0; k < 500; k++) { let x = r() * W, y = r() * H, a = r() * 6.28; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 5 + r() * 8; s++) { a += (r() - .5) * 1.4; x += Math.cos(a) * (5 + r() * 12); y += Math.sin(a) * (5 + r() * 12); g.lineTo(x, y); } g.stroke(); }
    // Top smoked
    const sg = g.createLinearGradient(0, 0, 0, 380); sg.addColorStop(0, 'rgba(40,20,10,.35)'); sg.addColorStop(1, 'rgba(40,20,10,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, 380);
  });
  const FLAKES = (() => { const r = rng(55), o = []; let n = 0; while (o.length < 10 && n < 2000) { n++; const x = 100 + r() * 1700, y = 120 + r() * 700; { const n = P.fbm(x * 0.0032 + 11, y * 0.0032 + 4, 5); if (n > 0.26 && n < 0.3) o.push([x, y, 0.05 + r() * 0.7, 8 + r() * 10, r()]); } } return o; })();

  return {
    draw(c, lt, t) {
      const ch = KIT.choreo(lt, t);
      c.drawImage(ground(), 0, 0);
      windowPanel(c, t, lt);
      c.drawImage(floor(), 0, 0);
      table(c, t);
      cat(c, t, ch);
      const G = girl(c, t, ch);
      // Heat: Several white cirrus cloud lines
      c.save(); c.strokeStyle = C.white; c.lineWidth = 3; c.lineCap = 'round'; [0, 1].forEach(k => { c.beginPath(); for (let i = 0; i <= 18; i++) { const q = i / 18, x = G.cup.x - 4 + k * 12 - q * 50 * ch.cup + Math.sin(q * 6 - t * 6 + k) * 8 * q, y = G.cup.y - 6 - q * 70; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); const e = [G.cup.x - 4 + k * 12 - 50 * ch.cup + Math.sin(6 - t * 6 + k) * 8, G.cup.y - 76]; c.beginPath(); c.arc(e[0] + 5, e[1], 5, Math.PI, Math.PI * 2.6); c.stroke(); }); c.restore();
      // Ceiling: petals scattered from the ceiling of the cave
      P.particles(30, 13, t, { x0: 0, x1: W, y0: 60, y1: H, speed: 90, drift: 50, life: 3 }).forEach(p => { c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.scale(p.s * 1.6, p.s * 1.6 * (Math.abs(Math.cos(t * 3 + p.i)) * 0.8 + 0.2));
        const fc = [C.white, C.red, C.green2, '#e8a0a0'][p.i % 4]; for (let j = 0; j < 4; j++) { c.rotate(Math.PI / 2); c.fillStyle = fc; c.beginPath(); c.ellipse(0, -7, 4, 8, 0, 0, Math.PI * 2); c.fill(); c.strokeStyle = C.line; c.lineWidth = 1.2; c.stroke(); } c.restore(); });
      // Cover
      c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = 'rgba(128,128,128,.3)'; c.fillRect(0, 0, W, H); c.restore();
      c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.5; c.drawImage(P.texture('dh_dirt', '#e8dcc8', { scale: 0.002, amt: 40, grain: 20, seed: 9 }), 0, 0); c.restore();
      c.drawImage(aging(), 0, 0);
      // Paint flakes falling off: A small piece of paint breaks off at the edge of the peeling, spins and falls
      FLAKES.forEach(([x, y, t0, s, ph], k) => { const q = (lt - t0 * 0.9); if (q < 0) return; const fy = y + q * q * 600, fx = x + Math.sin(q * 6 + ph * 6) * 12; if (fy > H) return;
        c.save(); c.translate(fx, fy); c.rotate(q * 6 + ph * 3); c.scale(1, Math.cos(q * 9 + ph)); c.fillStyle = [C.red, C.green, C.blue2][k % 3]; c.beginPath(); c.moveTo(-s, -s * 0.4); c.lineTo(s * 0.6, -s * 0.8); c.lineTo(s, s * 0.5); c.lineTo(-s * 0.3, s * 0.7); c.closePath(); c.fill(); c.restore(); });
    },
    label(c, lt) {
      // Title frame: light-colored rectangular square, ink book, with peeling
      c.save(); c.fillStyle = '#e6d6b2'; c.fillRect(1500, 52, 380, 150); c.strokeStyle = C.line; c.lineWidth = 4; c.strokeRect(1500, 52, 380, 150); c.strokeRect(1508, 60, 364, 134);
      c.restore();
      KIT.label(c, { title: 'Dunhuang murals', sub: 'Mogao Grottoes·Prosperous Tang Dynasty', tFont: '78px "LXGWWenKai-500"', sFont: '32px "LXGWWenKai-500"', tCol: '#2a1a14', sCol: C.redDk, x: 1858, y: 134, sy: 180, spacing: 6 });
      c.save(); const r = rng(4); c.fillStyle = 'rgba(216,198,162,.9)'; for (let i = 0; i < 14; i++) { const x = 1500 + r() * 380, y = 52 + r() * 150; c.beginPath(); KIT.blob(c, x, y, 4 + r() * 10, i, 0.3, 8); c.fill(); } c.restore();
    },
  };
})();
