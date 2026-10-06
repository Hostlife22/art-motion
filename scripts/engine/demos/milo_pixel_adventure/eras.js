// Milo's reproducible pixel showcase: choices, combos and pipe travel.
window.PUNCH = 0;
window.SCENE_LIBS = ['demos/milo_pixel_adventure/adventure.js'];
window.SCENE_DIR = 'demos/milo_pixel_adventure';
window.EXTRA_ASSETS = ['8bit_walk', '8bit_act'].flatMap(key => Array.from({length:8}, (_,i) => `demos/long_scroll/frames/${key}/${String(i+1).padStart(2,'0')}.png`));
window.ERAS = [
  {id:'milo_choice',dur:5.5},
  {id:'milo_combo',dur:5.3,transition:{type:'cut',dur:0.02}},
  {id:'milo_pipe',dur:7.7,transition:{type:'cut',dur:0.02}},
];
