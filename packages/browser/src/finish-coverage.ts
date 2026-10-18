import { canvas, closeRaster, layersOf, paintCoverage } from './raster.js';
import type { CardDocument, RasterHost } from './types.js';
import { validateDocument } from './validation.js';

export async function prepareFinishCoverage(
  document: CardDocument,
  host: RasterHost,
  signal: AbortSignal,
): Promise<HTMLCanvasElement> {
  signal.throwIfAborted();
  validateDocument(document);
  const size = document.recipe.color.size,
    base = document.recipe.finishCoverageBase ?? 1,
    layers = layersOf(document)
      .filter((layer) => layer.finishCoverage)
      .map((layer) => ({ ...layer, etchCoverage: undefined })),
    coverage = await paintCoverage(size, layers, host, signal);
  signal.throwIfAborted();
  const result = canvas(size);
  try {
    const context = result.getContext('2d')!;
    for (let i = 0; i < coverage.length; i += 4) {
      const value = Math.round(Math.max(base * 255, coverage[i]!) * (1 - coverage[i + 1]! / 255));
      coverage[i] = coverage[i + 1] = coverage[i + 2] = value;
      coverage[i + 3] = 255;
    }
    signal.throwIfAborted();
    context.putImageData(
      new ImageData(
        new Uint8ClampedArray(coverage.buffer, coverage.byteOffset, coverage.byteLength),
        ...size,
      ),
      0,
      0,
    );
    return result;
  } catch (error) {
    closeRaster(result);
    throw error;
  }
}
