import { useEffect, useState } from "react";
import { Gallery } from "./Gallery";
import { readGalleryOptions } from "./options";
import { usePlayback } from "../hooks/usePlayback";
import { DURATION, sceneAt, sceneTime } from "../animation/timeline";
import { scenes } from "../data/scenes";
function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    play: "M7 4l12 8-12 8Z",
    pause: "M8 4v16M16 4v16",
    replay: "M4 10a8 8 0 1 1 1 8M4 4v6h6",
    grid: "M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z",
    sound: "M3 9h4l5-4v14l-5-4H3ZM16 8q6 4 0 8M18 4q10 8 0 16",
    mute: "M3 9h4l5-4v14l-5-4H3ZM16 9l6 6M22 9l-6 6",
    hide: "M5 5l14 14M19 5L5 19",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function App() {
  const [options] = useState(() =>
    readGalleryOptions(
      location.search,
      matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  );
  const [hidden, setHidden] = useState(options.controlsHidden);
  const { controller, status, audioRef } = usePlayback(options);
  const active = sceneAt(status.time);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("input,button,summary,a,textarea,select") ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        controller.toggle();
      }
      if (e.key.toLowerCase() === "h") setHidden((v) => !v);
      if (e.key === "Escape") setHidden(false);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        controller.seek(controller.getSnapshot().time + 5);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        controller.seek(controller.getSnapshot().time - 5);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [controller]);
  return (
    <main className={hidden ? "reference-view" : undefined}>
      <h1 className="sr-only">
        Bruce Lee — twenty moments from the life of the Little Dragon
      </h1>
      <a className="skip-link" href="#catalogue">
        Skip to scene catalogue
      </a>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/reference-soundtrack.m4a`}
        preload="metadata"
        onPlaying={controller.mediaPlaying}
        onError={controller.mediaFailed}
      />
      <Gallery playback={controller} seed={options.seed} />
      <section
        className="controls"
        aria-label="Playback controls"
        hidden={hidden}
      >
        <div className="transport">
          <button
            onClick={controller.toggle}
            aria-label={status.playing ? "Pause" : "Play"}
          >
            <Icon name={status.playing ? "pause" : "play"} />
            <span>{status.playing ? "Pause" : "Play"}</span>
          </button>
          <button onClick={controller.replay}>
            <Icon name="replay" />
            <span>Replay</span>
          </button>
          <button onClick={controller.overview}>
            <Icon name="grid" />
            <span>Overview</span>
          </button>
          <button
            onClick={controller.toggleSound}
            aria-label={
              status.sound === "blocked"
                ? "Start sound"
                : status.sound === "on"
                  ? "Mute sound"
                  : "Enable sound"
            }
            aria-pressed={status.sound === "on"}
          >
            <Icon name={status.sound === "on" ? "sound" : "mute"} />
            <span>
              {status.sound === "blocked"
                ? "Start sound"
                : status.sound === "on"
                  ? "Sound on"
                  : "Sound off"}
            </span>
          </button>
          <span className="current-scene">
            <span>{String(active + 1).padStart(2, "0")} / 20</span>
            {scenes[active].title}
          </span>
          <button onClick={() => setHidden(true)} aria-label="Hide controls">
            <Icon name="hide" />
          </button>
        </div>
        <div className="scrubber">
          <label className="sr-only" htmlFor="time">
            Gallery time in seconds
          </label>
          <input
            id="time"
            type="range"
            min="0"
            max={DURATION}
            step="0.01"
            value={status.time}
            onChange={(e) => controller.seek(Number(e.target.value))}
            aria-valuetext={`${status.time.toFixed(1)} of ${DURATION.toFixed(1)} seconds`}
          />
          <output htmlFor="time">
            {status.time.toFixed(1)} / {DURATION.toFixed(1)}
          </output>
        </div>
      </section>
      {hidden && (
        <button
          className="restore"
          onClick={() => setHidden(false)}
          aria-label="Show controls"
        >
          <Icon name="grid" />
        </button>
      )}
      {status.message && !hidden && (
        <p className="media-note" role="status">
          {status.message}
        </p>
      )}
      <details id="catalogue" className="catalogue" hidden={hidden}>
        <summary>
          Explore the twenty moments <span>1940 — 2005</span>
        </summary>
        <ol>
          {scenes.map((s, i) => (
            <li key={s.title}>
              <button
                aria-current={active === i ? "true" : undefined}
                onClick={() => controller.seek(sceneTime(i))}
              >
                <span className="year">{s.year}</span>
                <strong>{s.title}</strong>
                <em>{s.caption}</em>
                <span className="description">{s.action}</span>
              </button>
            </li>
          ))}
        </ol>
      </details>
    </main>
  );
}
