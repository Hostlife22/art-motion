// Demonstration · Vox-style collage explaining "How AI learned to recognize cats" (three shots in 8 seconds). Grammar card: references/animation-grammars/y2_vox.md
//   Preview index.html?film=demos/y2_vox Render render.py --film demos/y2_vox --out y2.mp4
// A large desktop = the world; the camera moves smoothly at 60fps, and the paper/highlighter/red pen/typing on the table moves at 12fps.
window.PUNCH = 0;
window.SCENE_LIBS = ['demos/_shared/hero.js', 'demos/y2_vox/vox.js'];
window.ERAS = [
  { id: 'y2_s1', dur: 2.6 },                                                 // Newspaper clippings + website photos: highlighter scanning, red pen circles, camera slow-motion
  { id: 'y2_s2', dur: 3.3, transition: { type: 'same', dur: 1.1 } },         // Pan along the red line to the investigation wall (same desktop, camera moves continuously)
  { id: 'y2_s3', dur: 2.1, transition: { type: 'cut', dur: 1 / 60 } },       // Push full of small photos → Cut to a large scan of the same picture, and then pull it out to reveal a black background collage
];
