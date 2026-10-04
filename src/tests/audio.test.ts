import { it, expect, vi } from "vitest";
import { AudioSync } from "../animation/audio";
import { Media } from "./helpers/Media";
it("enables sound by default and seeks before playback", () => {
  const media = new Media();
  const audio = new AudioSync(media, vi.fn());
  audio.sync(20, true);
  expect(audio.enabled).toBe(true);
  expect(media.currentTime).toBe(20);
  expect(media.muted).toBe(false);
  expect(media.play).toHaveBeenCalledTimes(1);
});
it("pauses, seeks, mutes and suspends with the visual clock", async () => {
  const media = new Media();
  const audio = new AudioSync(media, vi.fn());
  audio.setEnabled(true, 10, true);
  await Promise.resolve();
  audio.sync(10, false);
  expect(media.paused).toBe(true);
  audio.sync(25, false);
  expect(media.currentTime).toBe(25);
  audio.setEnabled(false, 25, true);
  expect(media.muted).toBe(true);
  expect(media.paused).toBe(true);
  audio.setEnabled(true, 25, true);
  audio.sync(25, true, true);
  expect(media.paused).toBe(true);
  audio.dispose();
  expect(media.paused).toBe(true);
});
it("corrects drift without seeking for ordinary frame jitter", () => {
  const media = new Media();
  const audio = new AudioSync(media, vi.fn());
  audio.setEnabled(true, 10, true);
  audio.sync(10.02, true);
  expect(media.currentTime).toBe(10);
  audio.sync(11, true);
  expect(media.currentTime).toBe(11);
});
it("reports a rejected audio start without breaking the visual clock", async () => {
  const media = new Media();
  media.play.mockRejectedValue(new Error("blocked"));
  const error = vi.fn();
  const audio = new AudioSync(media, error);
  audio.setEnabled(true, 0, true);
  await Promise.resolve();
  await Promise.resolve();
  expect(error).toHaveBeenCalledOnce();
  expect(audio.enabled).toBe(false);
});

it("keeps sound enabled after autoplay is blocked and retries only on activation", async () => {
  const media = new Media();
  media.play.mockRejectedValueOnce(
    new DOMException("Gesture required", "NotAllowedError"),
  );
  const report = vi.fn();
  const audio = new AudioSync(media, report);
  audio.sync(0, true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(audio.enabled).toBe(true);
  expect(media.muted).toBe(false);
  audio.sync(1, true);
  expect(media.play).toHaveBeenCalledTimes(1);
  audio.setEnabled(true, 2, true);
  await Promise.resolve();
  expect(media.play).toHaveBeenCalledTimes(2);
  expect(media.paused).toBe(false);
  expect(media.currentTime).toBe(2);
});
