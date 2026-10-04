import { describe, expect, it } from "vitest";
import { decodeFrames } from "../renderers/artFrames";

describe("artwork chunk parser", () => {
  it("preserves each encoded frame without changing its bytes", async () => {
    const bytes = new Uint8Array([
      76, 68, 48, 49, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 11, 12, 13, 21, 22,
    ]);
    const frames = decodeFrames(bytes.buffer);
    expect(frames).toHaveLength(2);
    expect([...new Uint8Array(await frames[0].arrayBuffer())]).toEqual([
      11, 12, 13,
    ]);
    expect([...new Uint8Array(await frames[1].arrayBuffer())]).toEqual([
      21, 22,
    ]);
  });
  it("rejects corrupt headers and truncated frames", () => {
    expect(() => decodeFrames(new ArrayBuffer(3))).toThrow(
      "Invalid artwork chunk",
    );
    const bytes = new Uint8Array([
      76, 68, 48, 49, 1, 0, 0, 0, 3, 0, 0, 0, 11, 12,
    ]);
    expect(() => decodeFrames(bytes.buffer)).toThrow("Truncated artwork frame");
  });
  it("rejects excessive frame counts and trailing data", () => {
    const many = new Uint8Array([76, 68, 48, 49, 121, 0, 0, 0]);
    expect(() => decodeFrames(many.buffer)).toThrow(
      "Invalid artwork frame count",
    );
    const extra = new Uint8Array([
      76, 68, 48, 49, 1, 0, 0, 0, 1, 0, 0, 0, 11, 12,
    ]);
    expect(() => decodeFrames(extra.buffer)).toThrow(
      "Unexpected artwork bytes",
    );
  });
});
