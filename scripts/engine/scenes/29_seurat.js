// 1884 Seurat's "Sunday Afternoon on the Island of La Grande Jatte" - pure code pointillism.
// Pipeline: ① The entire flat painting manuscript (including characters, redrawing every frame, a few milliseconds)
//   → ② Bottom layer: The manuscript is blurred and brightened as the "base color" (the gaps between dots are exposed)
//   → ③ Pointillism renderer: fixed hexagonal grid, consistent point size (pitch 10, r 4.5); click "Visual Color Mixing" for each point to select from the 14-color solid color palette:
//       Find a pair of solid colors (i,j) and the ratio w∈{0,¼,½,¾,1} so that w·Pi+(1-w)·Pj is closest to the target color, and then use lattice hashing < w to decide whether this point is i or j
//       + 12% probability of changing to complementary color points (orange in green, orange in blue, blue in orange) + light penetration at the junction of light and dark (white on the bright side, darker blue on the dark side)
//   → ④Seurat’s own pointillism border (dark blue + orange)
// Jingmu: The position of the dots does not change. Only the dots change color where the draft has changed. Motif: sailboat drifting on the river, flashes on the water (6fps for hash), butterfly flapping, steamboat smoking.
SCENES['29_seurat'] = (() => {
  const W = 1920, H = 1080, TAU = Math.PI * 2, { clamp, lerp } = U, P = PAINT;
  const PAL = ['#1a2058', '#2a3a9a', '#3f6fd0', '#6aaee6', '#1f6a52', '#2f9a5a', '#a8c83a', '#f2cf3a', '#f08a2a', '#e0432a', '#c0306a', '#7a4aa8', '#f8f4e8', '#e8b48a', '#f6e49a', '#f6c48a', '#cfe08a', '#b0cff0', '#f2b8c8', '#c99a4a', '#9a7ac8'];
  // Complementary color index: the "contrast color" corresponding to each solid color
  const COMP = { 0: 8, 1: 8, 2: 8, 3: 9, 4: 9, 5: 10, 6: 11, 7: 11, 8: 2, 9: 5, 10: 5, 11: 7, 12: 17, 13: 17, 14: 20, 15: 17, 16: 18, 17: 15, 18: 16, 19: 2, 20: 14 };

  // ---- Manuscript ----
  const WIN = [372, 142, 416, 396];
  const inWater = (x, y) => x > 372 && x < 788 && y > 300 && y < 380;
  function base(g, t, ch, G, K) {
    // Wall: sunny custard, turning cold on the right side
    const wg = g.createLinearGradient(0, 0, W, 0); wg.addColorStop(0, '#f0d488'); wg.addColorStop(0.55, '#ecc88e'); wg.addColorStop(1, '#b4aecc'); g.fillStyle = wg; g.fillRect(0, 0, W, 700);
    // Spots of light cast by windows on the wall
    g.fillStyle = '#f8e8a0'; g.beginPath(); g.moveTo(880, 140); g.lineTo(1120, 180); g.lineTo(1120, 560); g.lineTo(880, 560); g.closePath(); g.fill();
    // Floor: Warm Orange Wood, Shaded Purple
    const fg = g.createLinearGradient(0, 700, 0, H); fg.addColorStop(0, '#c08a58'); fg.addColorStop(1, '#dca86a'); g.fillStyle = fg; g.fillRect(0, 700, W, H - 700);
    g.fillStyle = '#5a4a7a'; g.fillRect(0, 696, W, 10);
    g.fillStyle = 'rgba(70,50,110,.55)'; g.beginPath(); g.ellipse(560, 915, 170, 22, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(1010, 910, 220, 18, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(1300, 930, 200, 18, 0, 0, TAU); g.fill();
    // ---- Window: La Grande Jatte ----
    g.save(); g.beginPath(); g.rect(...WIN); g.clip();
    const sg = g.createLinearGradient(0, 142, 0, 300); sg.addColorStop(0, '#bcd4ec'); sg.addColorStop(1, '#e8eef0'); g.fillStyle = sg; g.fillRect(372, 142, 416, 160);
    g.fillStyle = '#3f7a4a'; g.beginPath(); g.moveTo(372, 300); for (let x = 372; x <= 788; x += 26) g.lineTo(x, 280 - Math.abs(Math.sin(x * 0.04)) * 30); g.lineTo(788, 302); g.closePath(); g.fill();   // tree on the other side
    g.fillStyle = '#3d6fc0'; g.fillRect(372, 300, 416, 80);   // seine river
    // Sailing boat (drift) + steamboat smoke
    [[0, 470, 1], [1, 690, 0.8]].forEach(([k, x0, s]) => { const x = 372 + ((x0 - 372 + t * 40 * (k ? -0.7 : 1)) % 416 + 416) % 416, y = 336 + k * 12;
      g.fillStyle = '#f8f4e8'; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 46 * s); g.lineTo(x + 28 * s, y); g.closePath(); g.fill(); g.fillStyle = '#7a4a3a'; g.fillRect(x - 18 * s, y, 50 * s, 7 * s); });
    const sx = 420 + t * 18; g.fillStyle = '#2a2a3a'; g.fillRect(sx, 316, 46, 10); g.fillRect(sx + 26, 300, 7, 16);
    for (let i = 0; i < 5; i++) { const q = (t * 0.8 + i / 5) % 1; g.fillStyle = `rgba(200,200,210,${0.9 - q * 0.6})`; g.beginPath(); g.arc(sx + 30 - q * 40, 292 - q * 50, 8 + q * 14, 0, TAU); g.fill(); }
    // Grassland: sunny yellow-green in the foreground, green shade
    g.fillStyle = '#b8c84a'; g.fillRect(372, 380, 416, 160);
    g.fillStyle = '#2f6a4a'; g.beginPath(); g.moveTo(372, 430); g.quadraticCurveTo(520, 400, 640, 440); g.lineTo(640, 540); g.lineTo(372, 540); g.closePath(); g.fill();
    // Trunk (right) + crown
    g.fillStyle = '#4a3a3a'; g.fillRect(730, 150, 22, 390); g.fillStyle = '#1f5a3a'; g.beginPath(); g.ellipse(740, 150, 120, 60, 0, 0, TAU); g.fill();
    // Silhouette of a lady holding an umbrella (the symbol of La Grande Jatte: bustle + parasol) + little monkey
    const lx = 600, ly = 520;
    g.fillStyle = '#23244a'; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx + 4, ly - 70); g.quadraticCurveTo(lx + 30, ly - 60, lx + 34, ly - 30); g.quadraticCurveTo(lx + 44, ly - 10, lx + 36, ly); g.closePath(); g.fill();   // Skirt + bustle
    g.beginPath(); g.ellipse(lx + 6, ly - 84, 8, 12, 0, 0, TAU); g.fill(); g.fillRect(lx - 1, ly - 76, 14, 14);
    g.fillStyle = '#c8603a'; g.beginPath(); g.ellipse(lx + 4, ly - 112, 30, 12, 0, Math.PI, TAU); g.fill(); g.strokeStyle = '#23244a'; g.lineWidth = 2; g.beginPath(); g.moveTo(lx + 4, ly - 112); g.lineTo(lx + 8, ly - 70); g.stroke();
    g.fillStyle = '#4a3a3a'; g.beginPath(); g.ellipse(lx - 30, ly - 6, 10, 7, 0, 0, TAU); g.fill(); g.strokeStyle = '#4a3a3a'; g.lineWidth = 3; g.beginPath(); g.moveTo(lx - 40, ly - 6); g.quadraticCurveTo(lx - 54, ly - 20, lx - 44, ly - 28); g.stroke();
    // Butterfly (flapping wings)
    const bx = 470 + Math.sin(t * 2.2) * 60, by = 420 + Math.sin(t * 3.7) * 30, fl = Math.abs(Math.sin(t * 22));
    g.fillStyle = '#f08a2a'; g.beginPath(); g.ellipse(bx - 8, by, 10 * fl + 2, 7, -0.4, 0, TAU); g.ellipse(bx + 8, by, 10 * fl + 2, 7, 0.4, 0, TAU); g.fill();
    g.restore();
    // Window frame (white) + window sill
    g.lineWidth = 22; g.strokeStyle = '#f2ede0'; g.strokeRect(357, 127, 446, 426); g.fillStyle = '#f2ede0'; g.fillRect(570, 142, 18, 396); g.fillRect(330, 548, 500, 28);
    // Bent wood chair (Soneite)
    g.strokeStyle = '#4a2a2a'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(1450, 900); g.lineTo(1452, 520); g.quadraticCurveTo(1478, 470, 1500, 530); g.lineTo(1486, 900); g.stroke(); g.beginPath(); g.ellipse(1474, 600, 18, 60, 0, 0, TAU); g.stroke();
    // Table: white tablecloth
    g.fillStyle = '#f2eee0'; g.fillRect(806, 616, 404, 140); g.fillStyle = '#9aa6d8'; for (let x = 830; x < 1200; x += 60) g.fillRect(x, 640, 14, 116);
    g.fillStyle = '#6a3a2a'; g.fillRect(846, 756, 22, 148); g.fillRect(1150, 756, 22, 148);
    // Teapot (white porcelain) + a bouquet of poppies
    g.fillStyle = '#f6f2ea'; g.beginPath(); g.ellipse(900, 590, 40, 30, 0, 0, TAU); g.fill(); g.fillStyle = '#e0432a'; [[1030, 540], [1052, 520], [1074, 546]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 14, 0, TAU); g.fill(); });
    g.strokeStyle = '#2f9a5a'; g.lineWidth = 5; [[1030, 540], [1052, 520], [1074, 546]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y + 12); g.lineTo(1052, 616); g.stroke(); });
    // characters (flat painting, stippling)
    RIG.drawCat(g, K, { lw: 0, orange: '#ec8a34', white: '#f8f2e4', stripe: '#c0501a', stripeW: 9, face: (c, K) => {
      K.eyes.forEach(e => { c.fillStyle = K.blink ? '#c0501a' : '#2f9a5a'; c.beginPath(); c.arc(e.x, e.y, 9, 0, TAU); c.fill(); if (!K.blink) { c.fillStyle = '#1a2058'; c.beginPath(); c.arc(e.x + 2, e.y, 4, 0, TAU); c.fill(); } });
      c.fillStyle = '#e0605a'; c.beginPath(); c.arc(K.nose[0], K.nose[1], 6, 0, TAU); c.fill(); } });
    RIG.drawGirl(g, G, { lw: 0, line: '#111', locks: false, skin: '#f2cca8', hair: '#f0c850', dress: '#2c2c64', sleeve: '#2c2c64', cuff: '#f2eee0', shoe: '#1a2058', cupBody: '#f6f2ea', cupRim: '#9a5a2a',
      features: (c, G) => { c.fillStyle = '#1a2058'; c.beginPath(); c.arc(G.eye.x, G.eye.y, 4.5, 0, TAU); c.fill(); c.fillStyle = '#d8584a'; c.beginPath(); c.arc(G.lips[1][0] - 2, G.lips[1][1] + 2, 4, 0, TAU); c.fill();
        c.fillStyle = 'rgba(232,120,110,.6)'; c.beginPath(); c.arc(G.cheek[0], G.cheek[1], 11, 0, TAU); c.fill(); },
      hooks: {
        back: (c, G) => { // 1880s bustle (bulge in the back)
          const w = G.A.waist; c.fillStyle = '#2c2c64'; c.beginPath(); c.moveTo(w[0] - 10, w[1] - 10); c.quadraticCurveTo(w[0] + 110, w[1] - 6, w[0] + 98, w[1] + 90); c.quadraticCurveTo(w[0] + 60, w[1] + 140, w[0] - 10, w[1] + 120); c.closePath(); c.fill(); },
        torso: (c, G) => { // High collar white lace + row of orange buttons on the front
          const n = G.A.neck; c.fillStyle = '#f2eee0'; c.fillRect(n[0] - 18, n[1] - 26, 34, 30);
          c.fillStyle = '#f08a2a'; [0, 1, 2, 3].forEach(i => { c.beginPath(); c.arc(G.A.chest[0] + 4, G.A.chest[1] - 30 + i * 28, 5, 0, TAU); c.fill(); }); },
        head: (c, G) => { // Small round hat + red feather (Large Bowl Hat)
          const h = G.A.headTop; c.save(); c.translate(h[0], h[1]); c.rotate(G.tilt - 0.15);
          c.fillStyle = '#2a3a9a'; c.beginPath(); c.ellipse(0, 4, 64, 12, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(4, -10, 36, 22, 0, Math.PI, TAU); c.fill();
          c.fillStyle = '#e0432a'; c.beginPath(); c.ellipse(34, -20, 26, 8, -0.6, 0, TAU); c.fill(); c.restore(); } } });
    // A folded parasol rests on the back of the chair
    g.strokeStyle = '#4a2a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(1510, 900); g.lineTo(1556, 560); g.stroke();
    g.fillStyle = '#e0432a'; g.beginPath(); g.moveTo(1550, 610); g.lineTo(1560, 560); g.lineTo(1528, 760); g.lineTo(1518, 752); g.closePath(); g.fill();
    // The butterfly in the room (the one in the center of the picture of Dawan Island) is fluttering around the table.
    { const bx = 1000 + Math.sin(t * 2.6) * 120, by = 400 + Math.sin(t * 4.1) * 50 - t * 20, fl = 0.25 + 0.75 * Math.abs(Math.sin(t * 20)), dir = Math.cos(t * 2.6) > 0 ? 1 : -1;
      g.save(); g.translate(bx, by); g.scale(dir, 1); g.fillStyle = '#f08a2a'; g.beginPath(); g.ellipse(-14, -6, 22 * fl, 16, -0.5, 0, TAU); g.ellipse(14, -6, 22 * fl, 16, 0.5, 0, TAU); g.fill();
      g.fillStyle = '#e0432a'; g.beginPath(); g.ellipse(-10, 10, 12 * fl, 9, -0.2, 0, TAU); g.ellipse(10, 10, 12 * fl, 9, 0.2, 0, TAU); g.fill(); g.fillStyle = '#1a2058'; g.fillRect(-2, -14, 4, 28); g.restore(); }
    // The border of Seurat's painting: dark blue band
    g.fillStyle = '#1e2a78'; g.fillRect(0, 0, W, 28); g.fillRect(0, H - 28, W, 28); g.fillRect(0, 0, 28, H); g.fillRect(W - 28, 0, 28, H);
  }

  return {
    draw(c, lt, t) {
      const ch = P.choreo(lt, t);
      const G = RIG.girl({ cup: ch.cup, sip: ch.sip, hair: 'bun', breathe: ch.breathe });
      const K = RIG.cat({ tail: ch.tail, blink: ch.blink, breathe: ch.breathe });
      const b = P.scratch('seBase'), bg = b.getContext('2d', { willReadFrequently: true }); bg.reset(); base(bg, t, ch, G, K);
      // Base: blur and highlight
      c.save(); c.filter = 'blur(4px) saturate(0.85) brightness(1.06)'; c.drawImage(b, 0, 0); c.restore();
      // Pointillism: P.pointillism - juxtaposition of equal large dots and solid color plates to create visual color mixing; water surface dots 6fps re-roll = ripples; 12 = white dots, 0 = dark blue dots for light penetration
      P.pointillism(c, b, { pal: PAL, comp: COMP, t, fps: 6, shimmer: inWater, white: 12, dark: 0 });
      // A thin deep line along the inner edge of the frame (the closing edge of Seurat's frame)
      c.strokeStyle = 'rgba(20,24,70,.8)'; c.lineWidth = 3; c.strokeRect(29, 29, W - 58, H - 58);
    },
  };
})();
