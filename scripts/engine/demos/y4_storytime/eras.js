// Demonstration · Story-type simple characters (storytime) "I asked AI to help me write code for the first time" (8.75 seconds five shots). Grammar card: references/animation-grammars/y4_storytime.md
//   Preview index.html?film=demos/y4_storytime Render render.py --film demos/y4_storytime --out y4.mp4 (the spoken audio track is additionally provided; the mouth shape reads the envelope of vo_env.js)
// The shots are cut according to the spoken word (not according to the beat): one spoken word ≈ one shot, and the reaction shot is placed in the "silence" between the two sentences.
window.PUNCH = 0;                    // storytime no jam music beat
window.FILM_DURATION = 8.75;
window.SCENE_LIBS = ['demos/y4_storytime/vo_env.js', 'demos/y4_storytime/story.js', 'demos/y4_storytime/world.js'];
window.SCENE_DIR = 'demos/y4_storytime';
window.ERAS = [
  { id: 's1_desk', dur: 2.0 },                                                  // Medium shot: speaking to the camera
  { id: 's2_screen', dur: 2.4, transition: { type: 'whip', dur: 0.26, dir: 1 } }, // Shake the mirror → screen (over the shoulder). Leave it in the breath between two sentences, don’t cut it in the middle of the sentence
  { id: 's3_react', dur: 1.2, transition: { type: 'smash', dur: 0.32 } },        // Smashing the mirror → Close-up of reaction (silence)
  { id: 's4_wide', dur: 1.65, transition: { type: 'cut', dur: 0.02 } },          // Hard cut → Large panorama of the same room
  { id: 's5_close', dur: 1.5, transition: { type: 'cut', dur: 0.02 } },          // Jump close → close-up, laugh + freeze
];
