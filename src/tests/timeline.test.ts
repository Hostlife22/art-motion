import { describe, expect, it } from "vitest";
import {
  cameraAt,
  cardAt,
  DURATION,
  entries,
  sceneAt,
  sceneTime,
  timelineAt,
} from "../animation/timeline";
import { scenes } from "../data/scenes";
import { Clock } from "../animation/clock";
import { PlaybackController } from "../playback/PlaybackController";

describe("twenty-scene timeline", () => {
  it("selects each scene at its review moment", () => {
    expect(scenes).toHaveLength(20);
    for (let i = 0; i < 20; i++) {
      expect(sceneAt(sceneTime(i))).toBe(i);
      expect(cameraAt(sceneTime(i))).toBe(i);
      expect(cardAt(i, sceneTime(i)).x).toBe(545);
    }
  });
  it("preserves ordering and keeps overlapping camera transitions continuous", () => {
    for (let t = 5; t < 81; t += 0.01) {
      const previous = cameraAt(t - 0.01),
        current = cameraAt(t);
      expect(current).toBeGreaterThanOrEqual(previous);
      expect(current - previous).toBeLessThan(0.019);
    }
    expect(entries[19]).toBeLessThan(81);
  });
  it("returns exactly the same grid at opening and ending", () => {
    expect(timelineAt(3.5).grid).toBe(1);
    expect(timelineAt(84).grid).toBe(1);
    for (let i = 0; i < 20; i++) expect(cardAt(i, 3.5)).toEqual(cardAt(i, 84));
    expect(timelineAt(DURATION).title).toBe(1);
  });
});
describe("shared playback", () => {
  it("holds the visual and audio clock while the next artwork chunk loads", () => {
    const p = new PlaybackController({
      initialTime: null,
      reducedMotion: false,
    });
    p.advance(0);
    p.advance(100);
    p.buffering(true);
    p.advance(1000);
    expect(p.getSnapshot().time).toBe(0.1);
    expect(p.getSnapshot().playing).toBe(true);
    p.buffering(false);
    p.advance(2000);
    p.advance(2100);
    expect(p.getSnapshot().time).toBe(0.2);
  });
  it("pauses hidden tabs without skipping on return and stops at the final frame", () => {
    const c = new Clock();
    c.tick(0);
    c.tick(100);
    expect(c.time).toBe(0.1);
    c.visibility(true);
    c.tick(90000);
    expect(c.time).toBe(0.1);
    c.visibility(false);
    c.tick(90001);
    c.tick(90101);
    expect(c.time).toBe(0.2);
    c.seek(DURATION - 0.05);
    c.tick(0);
    c.tick(100);
    expect(c.time).toBe(DURATION);
    expect(c.playing).toBe(false);
  });
  it("keeps pause, seek, overview and replay consistent across inputs", () => {
    const p = new PlaybackController({
      initialTime: null,
      reducedMotion: false,
    });
    p.advance(0);
    p.advance(100);
    p.toggle();
    const before = p.getSnapshot().time;
    p.advance(300);
    expect(p.getSnapshot().playing).toBe(false);
    expect(p.getSnapshot().time).toBe(before);
    p.seek(70);
    expect(p.getSnapshot().time).toBe(70);
    p.overview();
    expect(p.getSnapshot()).toMatchObject({ time: 84, playing: false });
    p.toggleSound();
    p.replay();
    expect(p.getSnapshot()).toMatchObject({
      time: 0,
      playing: true,
      sound: "off",
    });
  });
  it("opens a paused full overview for reduced motion", () => {
    const p = new PlaybackController({
      initialTime: null,
      reducedMotion: true,
    });
    expect(p.getSnapshot()).toMatchObject({ time: 84, playing: false });
  });
});
