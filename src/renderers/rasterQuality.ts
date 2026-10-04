/** Cache artwork at their displayed physical size, including the screen pixel density. */
export const rasterQuality = {
  bucket: 64,
  motionBytes: 96 * 1024 * 1024,
  maxFrames: 32,
};
export function rasterSize(physicalPixels: number) {
  return Math.max(
    rasterQuality.bucket,
    Math.ceil(physicalPixels / rasterQuality.bucket) * rasterQuality.bucket,
  );
}
