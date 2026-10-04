import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { decodeFrames } from "../renderers/artFrames";
import { installCameraTrack, cameraAt, sceneTime } from "../animation/timeline";
const root = new URL("../../public/art/", import.meta.url);
const manifest = JSON.parse(
  readFileSync(new URL("manifest.json", root), "utf8"),
);
describe("lossless artwork atlas", () => {
  it("has a forward-only registered camera with stable scene review framing", () => {
    installCameraTrack(manifest.camera);
    for (let i = 1; i < manifest.camera.length; i++) {
      expect(manifest.camera[i][0]).toBeGreaterThan(manifest.camera[i - 1][0]);
      expect(manifest.camera[i][1]).toBeGreaterThanOrEqual(
        manifest.camera[i - 1][1],
      );
    }
    for (let i = 0; i < 20; i++)
      expect(Math.abs(cameraAt(sceneTime(i)) - i)).toBeLessThan(0.15);
    expect(cameraAt(71)).toBe(17);
    expect(cameraAt(75)).toBe(18);
    installCameraTrack([]);
  });
  it("covers every review time with continuous native-size lossless chunks", async () => {
    expect(manifest.version).toBe(1);
    expect(manifest.width).toBe(830);
    expect(manifest.scenes).toHaveLength(20);
    const size = (bytes: Uint8Array) => {
      expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe("RIFF");
      expect(new TextDecoder().decode(bytes.slice(8, 16))).toBe("WEBPVP8L");
      const packed = new DataView(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength,
      ).getUint32(21, true);
      expect((packed & 0x3fff) + 1).toBe(830);
      expect(((packed >>> 14) & 0x3fff) + 1).toBe(830);
    };
    for (let i = 0; i < 20; i++) {
      const prefix = String(i).padStart(2, "0");
      size(readFileSync(new URL(`${prefix}-base.webp`, root)));
      const track = manifest.scenes[i];
      let total = 0;
      for (let n = 0; n < Math.ceil(track.count / track.chunkSize); n++) {
        const bytes = readFileSync(
          new URL(
            `${prefix}-motion-${String(n).padStart(2, "0")}.frames`,
            root,
          ),
        );
        const frames = decodeFrames(
          bytes.buffer.slice(
            bytes.byteOffset,
            bytes.byteOffset + bytes.byteLength,
          ) as ArrayBuffer,
        );
        expect(frames.length).toBe(
          Math.min(track.chunkSize, track.count - total),
        );
        size(new Uint8Array(await frames[0].arrayBuffer()));
        total += frames.length;
      }
      expect(total).toBe(track.count);
      expect(sceneTime(i)).toBeGreaterThanOrEqual(track.first);
      expect(sceneTime(i)).toBeLessThanOrEqual(
        track.first + (track.count - 1) / track.fps,
      );
    }
  });
});
