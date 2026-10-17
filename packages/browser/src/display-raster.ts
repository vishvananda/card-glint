export interface DisplayRaster {
  /** Native-resolution target for rendering/compositing. */
  source: HTMLCanvasElement;
  /** Filter the completed frame before CSS scales or projects the output. */
  present(): void;
  dispose(): void;
}

/** Avoid halftone moiré when a native raster is projected by a CSS host.
 * The native source size stays fixed; display density changes only the output.
 * No animation loop, pixel readback, or per-frame resource allocation. */
export function createDisplayRaster(
  canvas: HTMLCanvasElement,
  size: readonly [number, number] = [canvas.width, canvas.height],
): DisplayRaster {
  const [width, height] = size;
  if (![width, height].every((v) => Number.isSafeInteger(v) && v > 0))
    throw Error('Invalid native display raster size');
  const context = canvas.getContext('2d');
  if (!context) throw Error('Display raster requires a 2D output canvas');
  const source = document.createElement('canvas');
  source.width = width;
  source.height = height;
  let cssWidth = canvas.clientWidth,
    cssHeight = canvas.clientHeight,
    density: MediaQueryList;
  function present() {
    context!.globalCompositeOperation = 'copy';
    context!.imageSmoothingEnabled = true;
    context!.imageSmoothingQuality = 'high';
    context!.drawImage(source, 0, 0, canvas.width, canvas.height);
  }
  function resize() {
    const ratio = devicePixelRatio || 1;
    const scale =
      cssWidth > 0 && cssHeight > 0
        ? Math.min(1, (cssWidth * ratio) / width, (cssHeight * ratio) / height)
        : 1;
    const w = Math.max(1, Math.round(width * scale)),
      h = Math.max(1, Math.round(height * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      present();
    }
  }
  const observer = new ResizeObserver(([entry]) => {
    if (!entry) return;
    cssWidth = entry.contentRect.width;
    cssHeight = entry.contentRect.height;
    resize();
  });
  function watchDensity() {
    density?.removeEventListener('change', watchDensity);
    density = matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`);
    density.addEventListener('change', watchDensity);
    resize();
  }
  observer.observe(canvas);
  window.addEventListener('resize', resize);
  watchDensity();
  return {
    source,
    present,
    dispose() {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      density.removeEventListener('change', watchDensity);
      source.width = source.height = 0;
    },
  };
}
