import { useEffect, useRef, useState } from "react";
import { GalleryRenderer } from "../renderers/gallery";
import { createBackgrounds } from "../renderers/backgrounds";
import { timelineAt, sceneTime } from "../animation/timeline";
import type { PlaybackController } from "../playback/PlaybackController";
export function Gallery({
  playback,
  seed,
}: {
  playback: PlaybackController;
  seed: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    stage = useRef<HTMLDivElement>(null),
    renderer = useRef<GalleryRenderer | null>(null);
  const [error, setError] = useState(""),
    [ready, setReady] = useState(false);
  useEffect(() => {
    const element = canvas.current,
      container = stage.current;
    if (!element || !container) return;
    const c = element.getContext("2d");
    if (!c) {
      setError(
        "This browser cannot draw the gallery. The scene catalogue is available below.",
      );
      return;
    }
    let disposed = false,
      frame = 0,
      width = 0,
      height = 0,
      dirty = true,
      previous = -1;
    const resize = () => {
      const bounds = container.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const visibility = () => playback.visibility(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const render = (now: number) => {
      if (disposed) return;
      const time = playback.advance(now);
      const mobile = window.innerWidth < 768;
      container.classList.toggle(
        "mobile-grid",
        mobile && timelineAt(time).grid > 0.995,
      );
      if (renderer.current && (dirty || time !== previous)) {
        renderer.current.render(c, width, height, time, mobile);
        previous = time;
        dirty = false;
      }
      frame = requestAnimationFrame(render);
    };
    Promise.all([
      document.fonts.ready,
      document.fonts.load('400 32px "Cormorant Garamond"'),
      document.fonts.load('italic 32px "Cormorant Garamond"'),
    ])
      .then(() => {
        if (disposed) return;
        try {
          renderer.current = new GalleryRenderer(createBackgrounds(seed));
          resize();
          setReady(true);
          frame = requestAnimationFrame(render);
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "Unable to draw the gallery.",
          );
        }
      })
      .catch((e: unknown) => {
        if (!disposed)
          setError(
            e instanceof Error ? e.message : "Unable to load gallery fonts.",
          );
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      renderer.current = null;
    };
  }, [playback, seed]);
  return (
    <div ref={stage} className="stage" aria-busy={!ready && !error}>
      <canvas
        ref={canvas}
        aria-label="Bruce Lee: twenty animated scenes from 1940 to 2005. Use the scene catalogue to select a work."
        role="img"
        onClick={(e) => {
          const box = e.currentTarget.getBoundingClientRect(),
            x = e.clientX - box.left,
            y = e.clientY - box.top;
          const hit = renderer.current?.hits.find(
            (h) =>
              x >= h.x && x <= h.x + h.size && y >= h.y && y <= h.y + h.size,
          );
          if (hit) playback.seek(sceneTime(hit.index));
        }}
      />
      {!ready && !error && (
        <p className="loading" role="status">
          Preparing the twenty moments…
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
