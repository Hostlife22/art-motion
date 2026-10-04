import { describe, it, expect } from "vitest";
import {
  choreography,
  performanceAt,
  pushUpAt,
} from "../animation/choreography";
import camera from "../animation/referenceCamera.json";
import { installCameraTrack, cameraAt, sceneTime } from "../animation/timeline";

describe("native scene performances", () => {
  it("keeps the measured camera aligned with every scene", () => {
    installCameraTrack(camera as [number, number][]);
    for (let i = 1; i < camera.length; i++) {
      expect(camera[i][0]).toBeGreaterThan(camera[i - 1][0]);
      expect(camera[i][1]).toBeGreaterThanOrEqual(camera[i - 1][1]);
    }
    for (let i = 0; i < 20; i++)
      expect(Math.abs(cameraAt(sceneTime(i)) - i)).toBeLessThan(0.15);
    expect(cameraAt(71)).toBe(17);
    expect(cameraAt(75)).toBe(18);
    installCameraTrack([]);
  });
  it("provides twenty distinct, finite performances at arbitrary seek times", () => {
    expect(choreography).toHaveLength(20);
    const motions = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const samples = [];
      for (let n = 0; n <= 100; n++) {
        const sample = performanceAt(i, n / 100);
        const numbers = [
          sample.x,
          sample.y,
          sample.scale,
          sample.pose.lean,
          sample.pose.hipY,
          sample.pose.turn,
          sample.pose.head,
          ...sample.pose.leftHand,
          ...sample.pose.rightHand,
          ...sample.pose.leftFoot,
          ...sample.pose.rightFoot,
        ];
        expect(numbers.every(Number.isFinite)).toBe(true);
        expect(sample.scale).toBeGreaterThan(0);
        samples.push(sample);
      }
      motions.add(JSON.stringify(samples));
      const a = performanceAt(i, 0.1234),
        b = performanceAt(i, 0.1235);
      expect(Math.abs(a.x - b.x)).toBeLessThan(1);
      expect(Math.abs(a.pose.rightHand[0] - b.pose.rightHand[0])).toBeLessThan(
        1,
      );
    }
    expect(motions.size).toBe(20);
  });
  it("push-ups preserve hand and foot contacts while lowering the body", () => {
    const up = pushUpAt(0),
      down = pushUpAt(1 / 6);
    expect(down.hipY).toBeGreaterThan(up.hipY);
    expect(Math.abs(down.rightHand[0] - up.rightHand[0])).toBeLessThan(2);
    expect(Math.abs(down.leftFoot[0] - up.leftFoot[0])).toBeLessThan(3);
    expect(up.leftFoot[1]).toBeGreaterThan(up.hipY);
  });
});
