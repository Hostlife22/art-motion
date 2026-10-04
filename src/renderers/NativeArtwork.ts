import { localTime, SCENE_DURATION } from "../animation/timeline";
import { renderBackground } from "./backgrounds";
import { SceneRenderer } from "./scenes";
import { rasterQuality, rasterSize } from "./rasterQuality";
import type { Ctx } from "./draw";

const previewPhases = [
  0.34, 0.3, 0.3, 0.4, 0.32, 0.42, 0.28, 0.42, 0.4, 0.36, 0.45, 0.38, 0.5, 0.72,
  0.46, 0.32, 0.43, 0.27, 0.56, 0.8,
];
/** Every mark and actor is drawn by code; caches contain our own static backgrounds only. */
export class NativeArtwork {
  private backgrounds = new Map<string, HTMLCanvasElement>();
  private renderer = new SceneRenderer();
  private bytes = 0;
  constructor(private seed = 1940) {}
  private background(index: number, pixels: number) {
    const key = `${index}:${pixels}`;
    let image = this.backgrounds.get(key);
    if (image) {
      this.backgrounds.delete(key);
      this.backgrounds.set(key, image);
      return image;
    }
    image = renderBackground(index, pixels, this.seed);
    this.backgrounds.set(key, image);
    this.bytes += pixels * pixels * 4;
    while (
      this.bytes > rasterQuality.backgroundBytes &&
      this.backgrounds.size > 1
    ) {
      const oldest = this.backgrounds.keys().next().value!;
      const previous = this.backgrounds.get(oldest)!;
      this.bytes -= previous.width * previous.height * 4;
      previous.width = previous.height = 0;
      this.backgrounds.delete(oldest);
    }
    return image;
  }
  draw(c: Ctx, index: number, time: number, thumbnail: boolean) {
    const physicalPixels =
      500 * Math.hypot(c.getTransform().c, c.getTransform().d);
    c.drawImage(
      this.background(index, rasterSize(physicalPixels)),
      0,
      0,
      500,
      500,
    );
    const local = thumbnail
      ? previewPhases[index] * (index === 19 ? 4 : SCENE_DURATION)
      : localTime(index, time);
    this.renderer.draw(c, index, local, thumbnail ? local : time, thumbnail);
  }
  dispose() {
    for (const image of this.backgrounds.values())
      image.width = image.height = 0;
    this.backgrounds.clear();
    this.renderer.dispose();
  }
}
