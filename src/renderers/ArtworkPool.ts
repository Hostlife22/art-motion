interface Job {
  key: string;
  width: number;
  blob: Blob;
  priority: boolean;
}
/** Decode and resize original artwork away from input handling and the playback clock. */
export class ArtworkPool {
  private queue: Job[] = [];
  private pending = new Set<string>();
  private slots: { worker: Worker; busy: boolean }[] = [];
  constructor(
    private complete: (key: string, bitmap: ImageBitmap) => void,
    private failed: () => void,
  ) {
    for (let i = 0; i < 3; i++) {
      const worker = new Worker(
        new URL("./artwork.worker.ts", import.meta.url),
        { type: "module" },
      );
      const slot = { worker, busy: false };
      this.slots.push(slot);
      worker.onmessage = (
        event: MessageEvent<{ key: string; bitmap?: ImageBitmap }>,
      ) => {
        slot.busy = false;
        this.pending.delete(event.data.key);
        if (event.data.bitmap) this.complete(event.data.key, event.data.bitmap);
        else {
          this.failed();
          return;
        }
        this.dispatch();
      };
      worker.onerror = () => this.failed();
    }
  }
  request(key: string, width: number, blob: Blob, priority: boolean) {
    if (priority) {
      const [scene, ordinal] = key.split(":").map(Number);
      this.queue = this.queue.filter((job) => {
        const [other, frame, size] = job.key.split(":").map(Number);
        if (size !== width || (other === scene && frame < ordinal)) {
          this.pending.delete(job.key);
          return false;
        }
        return true;
      });
    }
    if (this.pending.has(key)) {
      if (priority) {
        const index = this.queue.findIndex((job) => job.key === key);
        if (index >= 0) this.queue.unshift(this.queue.splice(index, 1)[0]);
      }
      return;
    }
    this.pending.add(key);
    const job = { key, width, blob, priority };
    if (priority) this.queue.unshift(job);
    else this.queue.push(job);
    while (this.queue.length > 12) {
      const dropped = this.queue.pop()!;
      this.pending.delete(dropped.key);
    }
    this.dispatch();
  }
  private dispatch() {
    for (const slot of this.slots) {
      if (slot.busy || !this.queue.length) continue;
      slot.busy = true;
      slot.worker.postMessage(this.queue.shift()!);
    }
  }
  dispose() {
    for (const slot of this.slots) slot.worker.terminate();
    this.slots = [];
    this.queue = [];
    this.pending.clear();
  }
}
