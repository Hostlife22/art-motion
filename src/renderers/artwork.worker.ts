const scope = globalThis as unknown as {
  onmessage: (
    event: MessageEvent<{ key: string; width: number; blob: Blob }>,
  ) => void;
  postMessage: (value: unknown, transfer: Transferable[]) => void;
};
let surface: OffscreenCanvas | null = null;
scope.onmessage = async ({ data }) => {
  let source: ImageBitmap | undefined;
  try {
    source = await createImageBitmap(data.blob);
    if (!surface || surface.width !== data.width)
      surface = new OffscreenCanvas(data.width, data.width);
    const context = surface.getContext("2d", { alpha: false });
    if (!context) throw new Error("Artwork canvas unavailable.");
    context.imageSmoothingQuality = "high";
    context.drawImage(source, 0, 0, data.width, data.width);
    source.close();
    source = undefined;
    const bitmap = surface.transferToImageBitmap();
    scope.postMessage({ key: data.key, bitmap }, [bitmap]);
  } catch (error) {
    source?.close();
    scope.postMessage({ key: data.key, error: String(error) }, []);
  }
};
