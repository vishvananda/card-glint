import init, { PixelKernels } from '../generated/pixels.js';
let initialized: Promise<unknown> | undefined;
export interface KernelOptions {
  wasmUrl?: string | URL | Uint8Array;
}
export async function initializeKernels(options: KernelOptions = {}): Promise<void> {
  initialized ??= init(options.wasmUrl ? { module_or_path: options.wasmUrl } : undefined).catch(
    (error: unknown) => {
      initialized = undefined;
      throw error;
    },
  );
  await initialized;
}
/** Explicit lifetime for reusable Rust scratch; no canvas or graphics context. */
export async function createPixelKernels(options: KernelOptions = {}) {
  await initializeKernels(options);
  const kernels = new PixelKernels();
  let disposed = false;
  return {
    etch(
      width: number,
      height: number,
      rgba: Uint8Array | Uint8ClampedArray,
      threshold = 20,
    ): Uint8Array {
      if (disposed) throw Error('Pixel kernels disposed');
      if (
        ![width, height, threshold].every(Number.isInteger) ||
        width < 1 ||
        height < 1 ||
        threshold < 0 ||
        threshold > 255 ||
        width * height > 4_194_304 ||
        rgba.byteLength !== width * height * 4
      )
        throw RangeError('Invalid edge dimensions or threshold');
      return kernels.etch(
        width,
        height,
        new Uint8Array(rgba.buffer, rgba.byteOffset, rgba.byteLength),
        threshold,
      );
    },
    dispose() {
      if (!disposed) {
        disposed = true;
        kernels.free();
      }
    },
  };
}
