// Demonstration · Long time-travel film: a long horizontal scroll with several "world segments" connected end to end. The protagonist walks from left to right, and the style of painting changes when he crosses the border.
// Only 3 segments are included here (Egyptian murals → Monet's "Japanese Bridge" → 8-bit pixels), the complete film is 24 segments, see references/11-long-scroll-films.md for the method.
//   Preview index.html?film=demos/long_scroll Render render.py --film demos/long_scroll --out long_scroll.mp4
// The skeleton lib/world.js manages the timeline, the protagonist's progress, the camera that only advances but never retreats, the protagonist cut according to the boundary, and the corner mark; each segment has one file segments/<id>.js and calls WORLD.add({...}).
(() => {
  window.__bootErrors = window.__bootErrors || [];
  const base = 'demos/long_scroll/';
  const load = url => { const x = new XMLHttpRequest(); x.open('GET', url, false); x.send(); if (x.status !== 200) { __bootErrors.push(`${url} does not exist (HTTP ${x.status})`); return; }
    try { (0, eval)(x.responseText + `\n//# sourceURL=${url}`); } catch (e) { __bootErrors.push(`${url} Execution error ${e && e.stack || e}`); } };
  load(base + 'lib/crossing.js');                 // XING: characters frame library, brush stroke material, Monet world
  load(base + 'lib/acts.js');                     // ACT: Small script tools such as the trajectories of pebbles
  load(base + 'lib/world.js');                    // WORLD: long scroll skeleton
  // Movie order: change the order and add segments only here (add segments = put a file into segments/ and write the id in)
  window.FILM_ORDER = ['02_egypt', '28_monet', '14_8bit'];
  for (const id of window.FILM_ORDER) { const n = WORLD.segs.length; load(`${base}segments/${id}.js`);
    if (WORLD.segs.length === n || WORLD.segs[WORLD.segs.length - 1].id !== id) __bootErrors.push(`segments/${id}.js does not have WORLD.add({ id: '${id}', ... })`); }
  // The frame libraries (hero.walk, acts[].key, sprites) used in each segment are registered as resources at one time and are all loaded before the engine starts.
  const sprites = new Set(); WORLD.segs.forEach(s => { if (s.hero && s.hero.walk) sprites.add(s.hero.walk); (s.acts || []).forEach(a => a.key && sprites.add(a.key)); (s.sprites || []).forEach(k => sprites.add(k)); });
  try { window.EXTRA_ASSETS = (window.EXTRA_ASSETS || []).concat(XING.sprites([...sprites])); } catch (e) { __bootErrors.push('Frame library missing:' + e.message); }
  WORLD.layout();
  window.PUNCH = 0;
  window.ERAS = [{ id: 'film', dur: WORLD.total, draw: (c, lt, t) => WORLD.draw(c, t) }];
})();
