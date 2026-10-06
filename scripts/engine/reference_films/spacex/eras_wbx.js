// SpaceX in these 24 years · Single style version (wbx: whiteboard reference implementation). The paragraph length comes from spacex/timing.js (same as the mixed style version), do not change the paragraph length manually.
// The transition of each segment is written in the scene file of the segment: ERAS.find(e => e.id === 'sXX').transition = { type, dur } (same is commonly used in single-style films = the same canvas camera movement is the transition).
window.PUNCH = 0;
window.SCENE_LIBS = ['spacex/timing.js', 'spacex/tm.js', 'spacex/rockets.js', 'spacex_wb/assets/strokes.js', 'spacex_wb/common.js'];   // The film's own shared scripts can be appended here (such as 'spacex_wb/common.js')
window.SCENE_DIR = 'spacex_wb/scenes';
window.EXTRA_ASSETS = ['spacex_wb/assets/hand_1.png', 'spacex_wb/assets/hand_2.png', 'spacex_wb/assets/hand_3.png'];   // The hand holding the pen (gpt-image line drawing, green screen cutout, see assets/make_hand.py)
window.ERAS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12'].map(id => ({ id, get dur() { return TIMING.seg[id].dur; } }));
