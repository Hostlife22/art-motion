/** Cache artwork at their displayed physical size, including the screen pixel density. */
export const rasterQuality = {
  bucket: 64,
  backgroundBytes: 64 * 1024 * 1024,
};
export function rasterSize(physicalPixels: number) {
  return Math.max(
    rasterQuality.bucket,
    Math.ceil(physicalPixels / rasterQuality.bucket) * rasterQuality.bucket,
  );
}
