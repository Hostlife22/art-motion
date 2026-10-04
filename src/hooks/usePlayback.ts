import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PlaybackController } from "../playback/PlaybackController";
import type { GalleryOptions } from "../app/options";

/** React/media boundary. The controller supplies the same actions to every input. */
export function usePlayback(options: GalleryOptions) {
  const [controller] = useState(() => new PlaybackController(options));
  const status = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!audioRef.current) return;
    const disconnect = controller.connectAudio(audioRef.current);
    const activate = (event: Event) => {
      if (event.isTrusted) controller.activateSound();
    };
    window.addEventListener("click", activate);
    window.addEventListener("keydown", activate);
    return () => {
      window.removeEventListener("click", activate);
      window.removeEventListener("keydown", activate);
      disconnect();
    };
  }, [controller]);
  return { controller, status, audioRef };
}
