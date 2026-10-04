/** Lossless WebP samples packed into a bounded, independently seekable chunk. */
export function decodeFrames(buffer: ArrayBuffer): Blob[] {
  const view = new DataView(buffer);
  if (buffer.byteLength < 8 || view.getUint32(0, false) !== 0x4c443031)
    throw new Error("Invalid artwork chunk.");
  const count = view.getUint32(4, true);
  let offset = 8 + count * 4;
  if (!count || count > 120 || offset > buffer.byteLength)
    throw new Error("Invalid artwork frame count.");
  const frames: Blob[] = [];
  for (let i = 0; i < count; i++) {
    const size = view.getUint32(8 + i * 4, true);
    if (!size || offset + size > buffer.byteLength)
      throw new Error("Truncated artwork frame.");
    frames.push(
      new Blob([buffer.slice(offset, offset + size)], { type: "image/webp" }),
    );
    offset += size;
  }
  if (offset !== buffer.byteLength)
    throw new Error("Unexpected artwork bytes.");
  return frames;
}
