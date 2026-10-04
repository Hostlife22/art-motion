import { clamp, DURATION } from "./timeline";
export interface AudioPort {
  currentTime: number;
  duration: number;
  readyState: number;
  paused: boolean;
  muted: boolean;
  play: () => Promise<void>;
  pause: () => void;
}
/** The visual clock remains authoritative, including seek and hidden-tab suspension. */
export class AudioSync {
  enabled = true;
  private pending = false;
  private blocked = false;
  private disposed = false;
  constructor(
    private media: AudioPort,
    private onFailure: (message: string, blocked: boolean) => void,
  ) {
    media.muted = false;
  }
  setEnabled(enabled: boolean, time: number, playing: boolean) {
    this.enabled = enabled;
    this.blocked = false;
    this.media.muted = !enabled;
    this.sync(time, playing);
  }
  sync(time: number, playing: boolean, hidden = false) {
    if (this.disposed) return;
    const active = this.enabled && playing && !hidden;
    if (!active && !this.media.paused) this.media.pause();
    if (this.enabled && this.media.readyState >= 1) {
      const target = clamp(
        time,
        0,
        Number.isFinite(this.media.duration) ? this.media.duration : DURATION,
      );
      if (Math.abs(this.media.currentTime - target) > (active ? 0.18 : 0.02))
        this.media.currentTime = target;
    }
    if (active && this.media.paused && !this.pending && !this.blocked) {
      this.pending = true;
      this.media
        .play()
        .catch((error: unknown) => {
          if (
            this.disposed ||
            (error instanceof DOMException && error.name === "AbortError")
          )
            return;
          if (
            error instanceof DOMException &&
            error.name === "NotAllowedError"
          ) {
            this.blocked = true;
            this.onFailure(
              "Autoplay was blocked. Click or press a key to start the music.",
              true,
            );
            return;
          }
          this.enabled = false;
          this.media.muted = true;
          this.onFailure(
            "Sound could not start. Press Sound to try again.",
            false,
          );
        })
        .finally(() => {
          this.pending = false;
        });
    }
  }
  dispose() {
    this.disposed = true;
    this.media.pause();
  }
}
