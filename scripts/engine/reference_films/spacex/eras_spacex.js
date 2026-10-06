// 24 years of SpaceX · Paragraph sheet. The segment length comes from spacex/timing.js (generated according to the actual measurement of narration, do not change it by hand);
// The entry transition of each segment is written by the scene file of the segment when loading: ERAS.find(e => e.id === 'sXX').transition = { type, dur }.
window.PUNCH = 0;
window.FPS_HINT = 30;
window.SCENE_LIBS = ['spacex/timing.js', 'spacex/tm.js', 'spacex/rockets.js'];
window.SCENE_DIR = 'spacex/scenes';
window.ERAS = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12'].map(id => ({ id, get dur() { return TIMING.seg[id].dur; } }));
