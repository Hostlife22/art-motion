import { describe, expect, it } from "vitest";
import { rasterSize } from "../renderers/rasterQuality";

describe("physical artwork resolution", () => {
  it("never stretches a cache below the displayed pixel size", () => {
    for (const size of [
      830,
      830 * 2,
      (830 * 1280 * 2) / 1920,
      (830 * 390 * 2) / 1040,
    ]) {
      expect(rasterSize(size)).toBeGreaterThanOrEqual(size);
      expect(rasterSize(size) - size).toBeLessThan(64);
    }
  });
  it("keeps small viewport changes in the same resolution bucket", () => {
    expect(rasterSize(830)).toBe(rasterSize(831));
    expect(rasterSize(1660)).toBe(rasterSize(1661));
  });
});
