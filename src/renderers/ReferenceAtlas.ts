import {
  clamp,
  sceneAt,
  installCameraTrack,
  layout,
  timelineAt,
} from "../animation/timeline";
import type { Ctx } from "./draw";
import { ArtworkPool } from "./ArtworkPool";
import { decodeFrames } from "./artFrames";
import { rasterSize, rasterQuality } from "./rasterQuality";

interface Track {
  first: number;
  fps: number;
  count: number;
  chunkSize: number;
}
interface Manifest {
  version: number;
  width: number;
  camera: [number, number][];
  scenes: Track[];
}
interface Scene {
  preview: ImageBitmap;
  chunks: Map<number, Blob[]>;
  pending: Map<number, Promise<void>>;
}

/** Original scene artwork without palette reduction or contour approximation. */
export class ReferenceAtlas {
  private abort = new AbortController();
  private scenes: Scene[] = [];
  private previews = new Set<ImageBitmap>();
  private cache = new Map<string, ImageBitmap>();
  private decoding = new Set<string>();
  private pool: ArtworkPool | null = null;
  private cacheBytes = 0;
  private rasterWidth = rasterSize(layout.poster);
  private active = 0;
  private time = 0;
  private disposed = false;
  private tracks: Track[] = [];
  private failures = new Map<number, string>();
  private constructor(private invalidate: () => void) {
    if (typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined")
      this.pool = new ArtworkPool(
        (key, bitmap) => {
          if (
            this.disposed ||
            Number(key.split(":").at(-1)) !== this.rasterWidth
          ) {
            bitmap.close();
            return;
          }
          this.remember(key, bitmap);
          this.invalidate();
        },
        () => {
          this.pool?.dispose();
          this.pool = null;
          this.invalidate();
        },
      );
  }
  private async fetch(name: string) {
    const response = await fetch(`${import.meta.env.BASE_URL}art/${name}`, {
      signal: this.abort.signal,
    });
    if (!response.ok) throw new Error(`Unable to load scene artwork: ${name}`);
    return response;
  }
  static async create(time: number, invalidate: () => void) {
    const atlas = new ReferenceAtlas(invalidate);
    try {
      const manifest = (await (
        await atlas.fetch("manifest.json")
      ).json()) as Manifest;
      if (manifest.version !== 1 || manifest.scenes.length !== 20)
        throw new Error("Unknown artwork atlas version.");
      installCameraTrack(manifest.camera);
      atlas.tracks = manifest.scenes;
      atlas.active = sceneAt(time);
      atlas.time = time;
      atlas.scenes = await Promise.all(
        Array.from({ length: 20 }, async (_, i) => {
          const preview = await createImageBitmap(
            await (
              await atlas.fetch(`${String(i).padStart(2, "0")}-base.webp`)
            ).blob(),
          );
          if (atlas.disposed) {
            preview.close();
            throw new Error("Artwork loading cancelled.");
          }
          atlas.previews.add(preview);
          return {
            preview,
            chunks: new Map<number, Blob[]>(),
            pending: new Map<number, Promise<void>>(),
          };
        }),
      );
      if (timelineAt(time).grid <= 0.5)
        await Promise.all(
          atlas.nearby().map((i) => atlas.load(i, atlas.chunkAt(i, time))),
        );
      return atlas;
    } catch (error) {
      atlas.dispose();
      throw error;
    }
  }
  private nearby() {
    return [this.active - 1, this.active, this.active + 1].filter(
      (i) => i >= 0 && i < 20,
    );
  }
  private chunkAt(index: number, time: number) {
    const track = this.tracks[index];
    return Math.floor(
      clamp(Math.round((time - track.first) * track.fps), 0, track.count - 1) /
        track.chunkSize,
    );
  }
  private sample(index: number, time: number) {
    const track = this.tracks[index];
    const ordinal = Math.round(
      clamp((time - track.first) * track.fps, 0, track.count - 1),
    );
    const chunk = Math.floor(ordinal / track.chunkSize),
      frame = ordinal % track.chunkSize;
    const blob = this.scenes[index]?.chunks.get(chunk)?.[frame];
    return blob
      ? { blob, ordinal, key: `${index}:${ordinal}:${this.rasterWidth}` }
      : null;
  }
  private load(index: number, chunk: number): Promise<void> {
    const scene = this.scenes[index];
    if (!scene || scene.chunks.has(chunk) || this.disposed)
      return Promise.resolve();
    const pending = scene.pending.get(chunk);
    if (pending) return pending;
    const request = this.fetch(
      `${String(index).padStart(2, "0")}-motion-${String(chunk).padStart(2, "0")}.frames`,
    )
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        if (this.disposed) return;
        if (
          Math.abs(index - this.active) <= 1 &&
          Math.abs(chunk - this.chunkAt(index, this.time)) <= 2
        )
          scene.chunks.set(chunk, decodeFrames(buffer));
        this.invalidate();
      })
      .catch((error) => {
        if (this.disposed) return;
        this.failures.set(
          index,
          error instanceof Error
            ? error.message
            : "Unable to load scene motion.",
        );
        this.invalidate();
        throw error;
      })
      .finally(() => scene.pending.delete(chunk));
    scene.pending.set(chunk, request);
    return request;
  }
  private remember(key: string, bitmap: ImageBitmap) {
    const old = this.cache.get(key);
    if (old) {
      this.cacheBytes -= old.width * old.height * 4;
      old.close();
    }
    this.cache.delete(key);
    this.cache.set(key, bitmap);
    this.cacheBytes += bitmap.width * bitmap.height * 4;
    // Keep the three currently visible samples while pruning older and speculative samples.
    const required = new Set(
      this.nearby().map((i) => this.sample(i, this.time)?.key),
    );
    while (
      this.cache.size > rasterQuality.maxFrames ||
      this.cacheBytes > rasterQuality.motionBytes
    ) {
      const oldest = [...this.cache.keys()].find(
        (candidate) => !required.has(candidate),
      );
      if (!oldest) break;
      const image = this.cache.get(oldest)!;
      this.cacheBytes -= image.width * image.height * 4;
      image.close();
      this.cache.delete(oldest);
    }
  }
  private prepare(index: number, time: number, priority = true) {
    const sample = this.sample(index, time);
    if (
      !sample ||
      this.cache.has(sample.key) ||
      this.decoding.has(sample.key) ||
      this.decoding.size >= 8 ||
      this.failures.has(index)
    )
      return;
    const width = this.rasterWidth;
    if (this.pool) {
      this.pool.request(sample.key, width, sample.blob, priority);
      return;
    }
    this.decoding.add(sample.key);
    // The browser decodes/resamples off the rendering path, directly from the native lossless asset.
    void createImageBitmap(sample.blob, {
      resizeWidth: width,
      resizeHeight: width,
      resizeQuality: "high",
    })
      .then((bitmap) => {
        if (this.disposed || width !== this.rasterWidth) {
          bitmap.close();
          return;
        }
        this.remember(sample.key, bitmap);
      })
      .catch((error) => {
        if (!this.disposed)
          this.failures.set(
            index,
            error instanceof Error
              ? error.message
              : "Unable to decode artwork.",
          );
      })
      .finally(() => {
        this.decoding.delete(sample.key);
        if (!this.disposed) this.invalidate();
      });
  }
  prefetch(time: number, physicalCardSize: number, thumbnail: boolean) {
    this.active = sceneAt(time);
    this.time = time;
    const width = rasterSize(physicalCardSize);
    if (width !== this.rasterWidth) {
      this.rasterWidth = width;
      for (const image of this.cache.values()) image.close();
      this.cache.clear();
      this.cacheBytes = 0;
    }
    for (let i = 0; i < 20; i++) {
      const current = this.chunkAt(i, time);
      for (const chunk of this.scenes[i].chunks.keys())
        if (Math.abs(i - this.active) > 1 || Math.abs(chunk - current) > 2)
          this.scenes[i].chunks.delete(chunk);
    }
    if (thumbnail) return;
    for (const i of this.nearby()) {
      if (this.failures.has(i)) continue;
      const current = this.chunkAt(i, time),
        last = Math.floor(
          (this.tracks[i].count - 1) / this.tracks[i].chunkSize,
        );
      for (const chunk of [current, Math.min(last, current + 1)])
        void this.load(i, chunk).catch(() => {});
      this.prepare(i, time);
    }
    for (let ahead = 1; ahead <= 3; ahead++)
      this.prepare(
        this.active,
        time + ahead / this.tracks[this.active].fps,
        false,
      );
  }
  ready(index: number, precise = true) {
    return [index - 1, index, index + 1]
      .filter((i) => i >= 0 && i < 20)
      .every(
        (i) =>
          this.scenes[i]?.chunks.has(this.chunkAt(i, this.time)) &&
          (!precise || this.cache.has(this.sample(i, this.time)?.key ?? "")),
      );
  }
  get error() {
    return this.failures.size ? [...this.failures.values()][0] : "";
  }
  draw(c: Ctx, index: number, time: number, thumbnail: boolean) {
    const scene = this.scenes[index];
    if (!scene) return;
    if (thumbnail) {
      c.drawImage(scene.preview, 0, 0, 500, 500);
      return;
    }
    const sample = this.sample(index, time);
    if (!sample) return;
    let image = this.cache.get(sample.key);
    if (image) {
      this.cache.delete(sample.key);
      this.cache.set(sample.key, image);
    } else {
      this.prepare(index, time);
      let distance = Infinity;
      for (const [key, bitmap] of this.cache) {
        const [sceneIndex, ordinal, width] = key.split(":").map(Number);
        const delta = sample.ordinal - ordinal;
        if (
          sceneIndex === index &&
          width === this.rasterWidth &&
          delta >= 0 &&
          delta < distance
        ) {
          image = bitmap;
          distance = delta;
        }
      }
    }
    if (image) c.drawImage(image, 0, 0, 500, 500);
  }
  dispose() {
    this.disposed = true;
    this.abort.abort();
    this.pool?.dispose();
    for (const image of this.cache.values()) image.close();
    for (const image of this.previews) image.close();
    this.cache.clear();
    this.previews.clear();
    this.scenes = [];
  }
}
