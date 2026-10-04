import type { PlaybackInitialState } from "../playback/PlaybackController";
export interface GalleryOptions extends PlaybackInitialState {
  controlsHidden: boolean;
  seed: number;
}
export function readGalleryOptions(
  search: string,
  reducedMotion: boolean,
): GalleryOptions {
  const params = new URLSearchParams(search);
  return {
    initialTime: params.has("time") ? Number(params.get("time")) : null,
    reducedMotion,
    controlsHidden: params.get("controls") === "0",
    seed: Number(params.get("seed")) || 1940,
  };
}
