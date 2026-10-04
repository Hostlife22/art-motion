import { clamp, DURATION } from "./timeline";
export class Clock {
  time = 0;
  playing = true;
  private previous: number | null = null;
  private hidden = false;
  tick(now: number) {
    if (this.previous !== null && this.playing && !this.hidden)
      this.time = clamp(
        this.time + Math.min((now - this.previous) / 1000, 0.1),
        0,
        DURATION,
      );
    this.previous = now;
    if (this.time >= DURATION) this.playing = false;
    return this.time;
  }
  seek(time: number) {
    this.time = clamp(Number.isFinite(time) ? time : 0, 0, DURATION);
    this.previous = null;
  }
  setPlaying(value: boolean) {
    this.playing = value;
    this.previous = null;
  }
  visibility(hidden: boolean) {
    this.hidden = hidden;
    this.previous = null;
  }
}
