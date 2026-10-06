// Demonstration · Whiteboard hand-drawn explanation (RSA Animate type) "How does AI learn to recognize cats" (three shots in 8 seconds). Grammar card: references/animation-grammars/y3_whiteboard.md
//   Preview index.html?film=demos/y3_whiteboard Render render.py --film demos/y3_whiteboard --out y3.mp4
// A whole big whiteboard = the world, the camera moves on the board; the three segments are the same screen function (the stroke timeline of DG.board), and the segments are just for qa storyboarding.
window.PUNCH = 0;
window.SCENE_LIBS = ['demos/_shared/hero.js', 'demos/y3_whiteboard/whiteboard.js'];
window.ERAS = [
  { id: 'y3_s1', dur: 2.5 },                                                  // Draw a cat, write "cat?", write questions
  { id: 'y3_s2', dur: 2.25, transition: { type: 'same', dur: 0.8 } },         // Mirror shake (0.8s with motion blur, pen does not leave the board)
  { id: 'y3_s3', dur: 3.25, transition: { type: 'same', dur: 0.85 } },        // Smooth movement on the board → Draw Milo, "It's a cat!" → Zoom in to see the full picture
];
