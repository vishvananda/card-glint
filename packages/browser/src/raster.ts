import { canvas, closeRaster } from './canvas-raster.js';
export { canvas, closeRaster } from './canvas-raster.js';
import { validate_layers } from '../generated/renderer.js';
import type { CardDocument, CardLayer, Raster, RasterHost, Size } from './types.js';
export async function paintRaster(
  raster: Raster,
  host: RasterHost,
  signal: AbortSignal,
  underArt?: HTMLCanvasElement,
) {
  signal.throwIfAborted();
  const result = await raster.paint(host, signal, underArt);
  if (result.width !== raster.size[0] || result.height !== raster.size[1] || signal.aborted) {
    closeRaster(result);
    signal.throwIfAborted();
    throw Error('Raster dimensions differ from recipe');
  }
  if ('getContext' in result) return result;
  const mutable = canvas(raster.size);
  try {
    const context = mutable.getContext('2d');
    if (!context) throw Error('Canvas2D raster unavailable');
    context.drawImage(result, 0, 0);
    return mutable;
  } catch (error) {
    closeRaster(mutable);
    throw error;
  } finally {
    result.close();
  }
}
export function layersOf(document: CardDocument) {
  const layers = document.layers ?? [];
  const order = validate_layers(
    JSON.stringify(
      layers.map((layer) => ({
        id: layer.id,
        stage: layer.stage,
        order: layer.order,
        contributesToEtch: layer.contributesToEtch ?? false,
      })),
    ),
  );
  return Array.from(order, (index) => layers[index]!);
}
export function layerKey(layers: readonly CardLayer[]) {
  return JSON.stringify(layers.map((l) => [l.id, l.stage, l.order, l.raster.key, l.clip]));
}
export async function paintLayers(
  size: Size,
  layers: readonly CardLayer[],
  host: RasterHost,
  signal: AbortSignal,
  target = canvas(size),
) {
  const ctx = target.getContext('2d')!;
  try {
    for (const layer of layers) {
      const image = await paintRaster(layer.raster, host, signal);
      try {
        ctx.save();
        if (layer.clip) {
          ctx.beginPath();
          const [x, y, w, h] = layer.clip;
          ctx.rect(x * size[0], y * size[1], w * size[0], h * size[1]);
          ctx.clip();
        }
        ctx.drawImage(image, 0, 0, ...size);
        ctx.restore();
      } finally {
        closeRaster(image);
      }
    }
    return target;
  } catch (error) {
    closeRaster(target);
    throw error;
  }
}
/** Channel packing happens on edit-time Canvas data, never GPU mask readback. */
export async function paintCoverage(
  size: Size,
  layers: readonly CardLayer[],
  host: RasterHost,
  signal: AbortSignal,
) {
  const result = canvas(size),
    ctx = result.getContext('2d', { willReadFrequently: true })!,
    data = ctx.createImageData(...size);
  try {
    for (const layer of layers) {
      const channels = [
        layer.finishCoverage?.add,
        layer.finishCoverage?.exclude,
        layer.etchCoverage?.add,
        layer.etchCoverage?.exclude,
      ];
      for (let channel = 0; channel < 4; channel++) {
        const raster = channels[channel];
        if (!raster) continue;
        const mask = await paintLayers(size, [{ ...layer, raster }], host, signal);
        try {
          const values = mask.getContext('2d')!.getImageData(0, 0, ...size).data;
          for (let i = 0; i < values.length; i += 4)
            data.data[i + channel] = Math.max(data.data[i + channel]!, values[i + 3]!);
        } finally {
          closeRaster(mask);
        }
      }
    }
    closeRaster(result);
    return new Uint8Array(data.data.buffer);
  } catch (error) {
    closeRaster(result);
    throw error;
  }
}
