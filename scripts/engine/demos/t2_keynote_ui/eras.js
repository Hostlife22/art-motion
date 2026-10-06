// Demonstration · Press conference (Apple keynote/product release UI) "Three functions of Plover 2" (three shots in 8 seconds, product and digital fiction). Grammar card: references/animation-grammars/t2_keynote_ui.md
//   Preview index.html?film=demos/t2_keynote_ui Render render.py --film demos/t2_keynote_ui --out t2.mp4
// The bottom of the light spot only depends on the full film time t, and the three shots are seamless; card → full screen is the expansion of the shared element (rect = the screen rectangle stuck in the middle at the last frame of shot 2).
window.PUNCH = 0;
window.SCENE_DIR = 'demos/t2_keynote_ui';
window.ERAS = [
  { id: 't2_s1', dur: 2.6 },
  { id: 't2_s2', dur: 3.0, transition: { type: 'blurPush', dur: 0.55 } },
  { id: 't2_s3', dur: 2.4, transition: { type: 'expandRect', dur: 0.6, rect: { x: 705.6, y: 252.6, w: 508.8, h: 614.8 }, r: 38 } },
];
