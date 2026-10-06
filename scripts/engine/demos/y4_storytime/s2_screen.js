// S2 looked over his shoulder at the screen: He only typed one line, "Help me build a website," and the AI ​​replied with a whole wall of code, scrolling faster and faster, and the counter hit "3,000 lines" on the word "three thousand."
// Movements: typing, accelerated code waterfall scrolling, line counting, 3000 smash + screen shake, Milo in the foreground, the back of his head shaking with his breathing.
(() => {
const S = STORY, C = S.C, W = 1920, H = 1080;
const { clamp, lerp, rng } = U;
const T_TYPE = 2.30, T_SEND = 2.78, T_SLAM = 3.70;          // Full film time; 3.70 = narration of "Three Thousand"
// Lines of code (represented by color blocks, which look like code from a distance; the colors are based on common editor themes)
const COLS = ['#C792EA', '#82AAFF', '#C3E88D', '#F78C6C', '#89DDFF', '#FFCB6B', '#676E95'];
const LINES = (() => { const r = rng(42), out = []; let ind = 0;
  for (let i = 0; i < 400; i++) { if (r() < 0.18) ind = Math.min(4, ind + 1); else if (r() < 0.2) ind = Math.max(0, ind - 1);
    const toks = []; let x = ind * 34; const n = 1 + (r() * 4 | 0); for (let k = 0; k < n; k++) { const w = 30 + r() * 150; toks.push([x, w, COLS[(r() * COLS.length) | 0]]); x += w + 14; }
    out.push(toks); } return out; })();
// Scroll position: Starts 0.25s after sending, accelerates (cubic), reaches a visual speed of thousands of lines per second during SLAM
const scrollAt = t => { const q = Math.max(0, t - T_SEND - 0.25); return 46 * (q * 6 + Math.pow(q * 2.6, 3) * 6); };
const countAt = t => t >= T_SLAM ? 3000 : Math.min(2999, Math.floor(Math.pow(Math.max(0, (t - T_SEND - 0.25)) / (T_SLAM - T_SEND - 0.25), 2.4) * 2999));
SCENES['s2_screen'] = {
  draw(c, lt, t) {
    const slam = t - T_SLAM;
    const shake = slam > 0 && slam < 0.3 ? MO.settle(slam, 14, 9, 14) : 0;   // Shock: 9Hz, attenuated within 0.3s
    const zoom = 1.0 + 0.02 * Math.min(1, lt / 2.2) + (slam > 0 ? 0.04 * MO.expoOut(clamp(slam / 0.12)) : 0);
    c.fillStyle = '#15161C'; c.fillRect(0, 0, W, H);
    CAM.with(c, { x: 960 + shake, y: 540 - shake * 0.5, z: zoom }, c => {
      // screen border
      c.fillStyle = '#2B2D36'; c.beginPath(); c.roundRect(150, 40, 1620, 1000, 34); c.fill();
      c.save(); c.beginPath(); c.roundRect(190, 80, 1540, 920, 14); c.clip();
      c.fillStyle = C.screen; c.fillRect(190, 80, 1540, 920);
      // My line: right bubble, typing
      const sent = MO.at(t, T_SEND, 0.18), scr = scrollAt(t);
      const bubY = 200 - Math.min(scr, 400);
      const msg = TY.typed('Help me make a website', MO.at(t, T_TYPE, 0.4));
      if (bubY > 60) {
        c.fillStyle = sent > 0 ? '#3B82F6' : '#2F3342'; const bw = TY.width(c, 'Help me make a website', 40, 'PuHui-Bold') + 60;
        c.beginPath(); c.roundRect(1680 - bw, bubY - 52, bw, 78, 24); c.fill();
        TY.text(c, msg + (sent <= 0 && Math.floor(t * 4) % 2 ? '|' : ''), 1680 - bw + 30, bubY + 2, { size: 40, fam: 'PuHui-Bold', color: '#fff', align: 'left' });
      }
      // AI's reply: Code wall, start from below the bubble and scroll up
      if (t > T_SEND + 0.1) {
        const top = 300 - scr, lh = 46;
        const i0 = Math.max(0, Math.floor((150 - top) / lh)), i1 = Math.min(LINES.length * 8, Math.ceil((1000 - top) / lh));
        for (let i = i0; i < i1; i++) { const y = top + i * lh; if (y < 150 || y > 1000) continue;
          const shown = MO.at(t, T_SEND + 0.1 + Math.min(i, 12) * 0.03, 0.05); if (shown <= 0) continue;   // The first few lines emerge line by line
          c.fillStyle = '#4A4F66'; c.fillRect(220, y - 12, 44, 16);
          for (const [x, w, col] of LINES[i % LINES.length]) { c.fillStyle = col; c.globalAlpha = 0.9; c.beginPath(); c.roundRect(300 + x, y - 14, w * shown, 20, 10); c.fill(); }
          c.globalAlpha = 1; }
        // Speed ​​line sense: when scrolling too fast, a layer of vertical smear is added to the entire screen
        const v = (scrollAt(t + 1 / 60) - scr) * 60; if (v > 1500) { c.fillStyle = `rgba(32,34,45,${clamp((v - 1500) / 6000) * 0.5})`; c.fillRect(190, 150, 1540, 850); }
      }
      // Top bar (drawn after content: content that scrolls up slides underneath it)
      c.fillStyle = '#2A2D3A'; c.fillRect(190, 80, 1540, 64);
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(232 + i * 34, 112, 10, 0, Math.PI * 2); c.fill(); });
      TY.text(c, 'AI assistant', 960, 124, { size: 30, fam: 'PuHui-Bold', color: '#9AA3B8' });
      const n = countAt(t);
      if (t > T_SEND + 0.2) TY.text(c, `${n}OK`, 1700, 124, { size: 32, fam: 'PuHui-Bold', color: n >= 3000 ? '#FFCB6B' : '#9AA3B8', align: 'right' });
      // Line 3000: Smashed out (backOut overshoot 23%) + base plate darkened
      if (slam > 0) {
        c.fillStyle = `rgba(10,10,16,${0.6 * MO.expoOut(clamp(slam / 0.15))})`; c.fillRect(190, 80, 1540, 920);
        TY.pop(c, '3000 lines', 960, 600, clamp(slam / 0.24), { size: 230, fam: 'PuHui-Black', color: '#FFCB6B', over: 3.5, stroke: '#15161C', strokeW: 18 });
      }
      c.restore();
    });
    // Foreground: Milo's back (over the shoulder). Don't push with the camera, just rise and fall with your breathing - the parallax between the foreground and the screen gives the lens "space".
    // Rework: The first version was a pure black silhouette, and the reviewer read it as "another shadow person". Now draw the identification points on the back of the protagonist: dark curls, ears, yellow jacket and small teal backpack, and add a cold outline light on the side of the screen.
    const by = 840 + 6 * Math.sin(2 * Math.PI * t / 1.6) + (slam > 0 ? -MO.settle(slam, 18, 4, 7) : 0), hx = 330, L = C.line;
    c.save(); c.lineWidth = 7; c.strokeStyle = L; c.lineJoin = 'round'; c.lineCap = 'round';
    c.fillStyle = '#F5C542'; c.beginPath(); c.ellipse(hx, by + 300, 330, 200, 0, Math.PI, 0); c.fill(); c.stroke();            // Yellow jacket shoulders
    c.fillStyle = '#FFE2CC'; c.beginPath(); c.roundRect(hx - 70, by + 120, 140, 110, 30); c.fill(); c.stroke();                 // nape of neck
    c.strokeStyle = '#E6E6EA'; c.lineWidth = 16; c.beginPath(); c.moveTo(hx - 95, by + 205); c.quadraticCurveTo(hx, by + 175, hx + 95, by + 205); c.stroke(); c.strokeStyle = L; c.lineWidth = 7;   // neckline
    for (const sx of [-1, 1]) { c.fillStyle = '#FFE2CC'; c.beginPath(); c.ellipse(hx + sx * 196, by + 40, 34, 52, sx * 0.2, 0, Math.PI * 2); c.fill(); c.stroke(); }   // ear
    c.fillStyle = '#1B1B1F'; c.beginPath(); c.ellipse(hx, by + 40, 190, 175, 0, 0, Math.PI * 2); c.fill();                     // Back of head (short black hair)
    // Milo's curls, backpack and jacket identify the reverse shot.
    c.fillStyle='#38271F'; c.strokeStyle=L; c.lineWidth=7;
    for (const [dx,dy,r] of [[-150,-40,65],[-100,-115,75],[-10,-155,82],[85,-125,78],[160,-45,65]]) { c.beginPath(); c.arc(hx+dx,by+dy,r,0,Math.PI*2); c.fill(); c.stroke(); }
    c.fillStyle='#287B7C'; c.beginPath(); c.roundRect(hx-150,by+215,300,260,65); c.fill(); c.stroke();
    c.strokeStyle='#795438'; c.lineWidth=24; for(const side of [-1,1]) { c.beginPath(); c.moveTo(hx+side*175,by+185); c.lineTo(hx+side*150,by+370); c.stroke(); }
    c.restore();
  },
};
})();
