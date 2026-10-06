// Demonstration · Kurzgesagt-style flat science popularization "How does AI learn to recognize cats" (three shots in 8 seconds). Grammar card: references/animation-grammars/y1_kurzgesagt.md
//   Preview index.html?film=demos/y1_kurzgesagt Render render.py --film demos/y1_kurzgesagt --out y1.mp4
// The camera cuts according to the narration, and dur uses seconds; the commentary film should not shoot any impact (PUNCH = 0). The camera movement is all calculated based on time in the scene (CAM), and the transition only depends on how A and B fit together.
window.PUNCH = 0;
window.SCENE_LIBS = ['demos/_shared/hero.js', 'demos/y1_kurzgesagt/kurzgesagt.js'];
window.ERAS = [
  { id: 'y1_s1', dur: 2.6 },                                                                         // Hillside at night: 5-layer parallax slow-motion, robot scanning cat
  { id: 'y1_s2', dur: 2.7, transition: { type: 'lensReveal', dur: 1.0, lens: t => Y1.lensAt(t) } },  // Get into the lens: The camera index pushes the eyes forward, and inside the eyes is the next world
  { id: 'y1_s3', dur: 2.7, transition: { type: 'matchCut', dur: 0.9 } },                             // Fill and pull out: push full yellow output node → pull out from yellow eye
];
