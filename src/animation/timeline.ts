export const DURATION = 86.917;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function smooth(v: number) {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
}
// Entries measured against the half-second contact sheets; transitions overlap actions.
export const SCENE_DURATION = 3.75;
export const CAMERA_DURATION = 1.5;
export const entries = [
  4.65, 8.75, 12.5, 16.25, 20, 23.75, 27.5, 31.25, 35, 38.75, 42.5, 46.25, 50,
  53.75, 57.5, 61.25, 65, 68.75, 72.5, 76.25,
];
export const sceneTime = (index: number) => entries[index] + 1.25;
export function sceneAt(time: number) {
  let index = 0;
  for (let i = 1; i < entries.length; i++) if (time >= entries[i]) index = i;
  return index;
}
export function localTime(index: number, time: number) {
  return time - entries[index];
}
let measuredCamera: readonly [number, number][] = [];
export function installCameraTrack(track: readonly [number, number][]) {
  measuredCamera = track;
}
export function cameraAt(time: number) {
  if (measuredCamera.length && time >= measuredCamera[0][0]) {
    let lo = 0,
      hi = measuredCamera.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (measuredCamera[mid][0] <= time) lo = mid;
      else hi = mid - 1;
    }
    const a = measuredCamera[lo],
      b = measuredCamera[Math.min(lo + 1, measuredCamera.length - 1)];
    return a[0] === b[0]
      ? a[1]
      : mix(a[1], b[1], clamp((time - a[0]) / (b[0] - a[0])));
  }
  let position = 0;
  for (let i = 1; i < entries.length; i++)
    position += smooth(
      (time - entries[i] + CAMERA_DURATION / 2) / CAMERA_DURATION,
    );
  return position;
}
export function timelineAt(time: number) {
  const t = clamp(time, 0, DURATION);
  const grid =
    t < 4.1
      ? 1
      : t < 4.85
        ? 1 - smooth((t - 4.1) / 0.75)
        : smooth((t - 81.05) / 1.45);
  return {
    time: t,
    index: sceneAt(t),
    grid,
    camera: cameraAt(t),
    title:
      t < 4.1
        ? smooth(t / 0.85)
        : t < 4.85
          ? 1 - smooth((t - 4.1) / 0.4)
          : smooth((t - 82.1) / 0.7),
  };
}
export const layout = {
  width: 1920,
  height: 1080,
  poster: 830,
  pitch: 885,
  top: 40,
  left: 545,
  gridX: 834,
  gridY: 60,
  thumb: 194,
  gapX: 14,
  gapY: 52,
};
export function cardAt(index: number, time: number) {
  const s = timelineAt(time);
  const x = layout.left + (index - s.camera) * layout.pitch;
  return {
    x: mix(
      x,
      layout.gridX + (index % 5) * (layout.thumb + layout.gapX),
      s.grid,
    ),
    y: mix(
      layout.top,
      layout.gridY + Math.floor(index / 5) * (layout.thumb + layout.gapY),
      s.grid,
    ),
    size: mix(layout.poster, layout.thumb, s.grid),
  };
}
