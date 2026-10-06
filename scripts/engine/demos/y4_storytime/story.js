// y4 This film shares: color matching, pose timeline (pose-to-pose+posture rebound), blinking, and subtitles.
// Libraries used: TOON (Milo bean, poseAt, blinkAt, alive, mouth shape reading VO_ENV), TY.text (subtitles), CAM (lens), MO (stepper, spring).
(() => {
const S = window.STORY = {};
// The background has lower saturation and contrast, and the lines are thinner and grayer; the characters lines are the darkest and thickest - the eyes always fall on the characters first.
S.C = { wall: '#DCE9EC', wall2: '#CFE0E4', floor: '#E8DCC8', desk: '#E2C29B', deskSide: '#CDA97F', bgLine: '#5B6470', line: '#1B1B1F',
  sky: '#BFE3F5', cloud: '#FFFFFF', laptop: '#C9CDD6', screen: '#20222D', glow: 'rgba(120,200,255,0.35)', void: '#3D405B' };
S.bgLW = 3;
// Oral broadcast time (seconds, full film time): consistent with the placement of Shared/audio/build_y4.py
S.LINES = [[0.12, 2.0, 'The first time I asked AI to write code for me,'], [2.13, 4.40, 'In one breath, it gave me three thousand lines.'], [5.75, 8.75, 'I asked it: Where are these... posted?']];   // Subtitles and camera cut points change in the same frame

// Pose timeline: keys = [[t, poseName, expr], ...] (full film time). Change posture = TOON.poseAt: arm 0.1s quick cut, body squeeze 7% and then spring rebound
S.poseAt = TOON.poseAt;
// Blink: fixed timetable ("random" interval 2.4–3.6s hard-coded), eyes closed 2 frames @24fps ≈ 0.083s
S.blinkAt = (t, extra = []) => TOON.blinkAt(t, [0.9, 3.4, 6.1, ...extra]);
// When speaking, tap your head to follow the syllables + breathe (1.6s cycle, ±1.2%)
S.alive = TOON.alive;

// Subtitles (Chinese platform needs to be burned; YouTube native storytime does not burn, relies on CC): white text with black outline, whole sentences cut in and out, no tricks
window.GLOBAL_OVERLAY = (c, t) => {
  for (const [a, b, s] of S.LINES) if (t >= a && t < b) {
    TY.text(c, s, 960, 1022, { size: 50, fam: 'PuHui-Bold', color: '#fff', stroke: '#1B1B1F', strokeW: 10, track: 1 });
  }
};
})();
