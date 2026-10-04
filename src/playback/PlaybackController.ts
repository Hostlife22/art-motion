import { AudioSync, type AudioPort } from "../animation/audio";
import { Clock } from "../animation/clock";
import { DURATION } from "../animation/timeline";

export const OVERVIEW_TIME = 84;
const UI_INTERVAL_MS = 80;
export type SoundState = "on" | "off" | "blocked" | "error";
export interface PlaybackInitialState {
  initialTime: number | null;
  reducedMotion: boolean;
}
export interface PlaybackSnapshot {
  time: number;
  playing: boolean;
  sound: SoundState;
  message: string;
}

/** Owns playback commands and sound preference; contains no DOM or React code. */
export class PlaybackController {
  private readonly clock = new Clock();
  private audio: AudioSync | null = null;
  private hidden = false;
  private sound: SoundState = "on";
  private message = "";
  private lastNotification = 0;
  private readonly listeners = new Set<() => void>();
  private snapshot: PlaybackSnapshot;

  constructor(options: PlaybackInitialState) {
    if (options.initialTime !== null || options.reducedMotion) {
      this.clock.seek(options.initialTime ?? OVERVIEW_TIME);
      this.clock.setPlaying(false);
    }
    this.snapshot = this.readSnapshot();
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private readSnapshot(): PlaybackSnapshot {
    return {
      time: this.clock.time,
      playing: this.clock.playing,
      sound: this.sound,
      message: this.message,
    };
  }
  private publish() {
    const next = this.readSnapshot();
    if (
      next.time === this.snapshot.time &&
      next.playing === this.snapshot.playing &&
      next.sound === this.snapshot.sound &&
      next.message === this.snapshot.message
    )
      return;
    this.snapshot = next;
    this.listeners.forEach((listener) => listener());
  }
  private syncAudio() {
    this.audio?.sync(this.clock.time, this.clock.playing, this.hidden);
  }
  connectAudio(media: AudioPort) {
    this.audio?.dispose();
    const audio = new AudioSync(media, (message, blocked) => {
      this.sound = blocked ? "blocked" : "error";
      this.message = message;
      this.publish();
    });
    this.audio = audio;
    // A StrictMode reconnect must preserve an explicit mute.
    if (this.sound === "off" || this.sound === "error")
      audio.setEnabled(false, this.clock.time, false);
    return () => {
      audio.dispose();
      if (this.audio === audio) this.audio = null;
    };
  }
  advance(now: number) {
    const time = this.clock.tick(now);
    this.syncAudio();
    if (now - this.lastNotification > UI_INTERVAL_MS) {
      this.publish();
      this.lastNotification = now;
    }
    return time;
  }
  visibility(hidden: boolean) {
    this.hidden = hidden;
    this.clock.visibility(hidden);
    this.syncAudio();
  }
  seek = (time: number) => {
    this.clock.seek(time);
    this.syncAudio();
    this.publish();
  };
  toggle = () => {
    if (this.clock.time >= DURATION) this.clock.seek(0);
    this.clock.setPlaying(!this.clock.playing);
    if (this.clock.playing) this.activateSound();
    this.syncAudio();
    this.publish();
  };
  replay = () => {
    this.clock.seek(0);
    this.clock.setPlaying(true);
    this.activateSound();
    this.syncAudio();
    this.publish();
  };
  overview = () => {
    this.clock.seek(OVERVIEW_TIME);
    this.clock.setPlaying(false);
    this.syncAudio();
    this.publish();
  };
  activateSound = () => {
    if (this.sound === "off" || this.sound === "error") return;
    this.message = "";
    this.audio?.setEnabled(
      true,
      this.clock.time,
      this.clock.playing && !this.hidden,
    );
    this.publish();
  };
  toggleSound = () => {
    const enabled = this.sound !== "on";
    // Blocked audio remains labelled Start until the media reports playback.
    if (this.sound !== "blocked") this.sound = enabled ? "on" : "off";
    this.message = "";
    this.audio?.setEnabled(
      enabled,
      this.clock.time,
      this.clock.playing && !this.hidden,
    );
    this.publish();
  };
  mediaPlaying = () => {
    if (this.sound === "off" || this.sound === "error") return;
    this.sound = "on";
    this.message = "";
    this.publish();
  };
  mediaFailed = () => {
    this.sound = "error";
    this.message =
      "Soundtrack could not load. The visual gallery is still available.";
    this.audio?.setEnabled(false, this.clock.time, this.clock.playing);
    this.publish();
  };
}
