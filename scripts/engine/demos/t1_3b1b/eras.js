// Demonstration · 3b1b / manim-style explanation of "how the first layer of the neural network turns pixels into "cats"" (three shots in 8 seconds). Grammar card: references/animation-grammars/t1_3b1b.md
//   Preview index.html?film=demos/t1_3b1b Render render.py --film demos/t1_3b1b --out t1.mp4
// Shot 1→2 has no transition: first frame = last frame of the previous shot, Transform continues (100 pixels become a column of neurons). Shot 2→3 penetrates a hidden layer neuron to see what it is looking for.
window.PUNCH = 0;
window.SCENE_DIR = 'demos/t1_3b1b';
window.ERAS = [
  { id: 't1_s1', dur: 2.6 },
  { id: 't1_s2', dur: 2.8 },
  // cx,cy = the screen position of the target neuron in the last frame of shot 2 (r = 22×1.1); live: shot 2 continues to push the camera in the transition (vector redraw)
  { id: 't1_s3', dur: 2.6, transition: { type: 'zoomThrough', dur: 0.75, cx: 850, cy: 391.5, zoom: 48, r0: 24.2, live: true, focus: [640, 585] } },
];
