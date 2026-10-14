import { blur } from './edges.mjs';
import { compareRegion } from './metrics.mjs';
import { cropGray } from './pixels-pure.mjs';
/** Additional dark-lettering metric. Local contrast suppresses faint Saga
 * motifs. Report beside ordinary edge F1: neither is a calibrated percentage
 * of visual accuracy, and pale print/foil should not use this threshold. */
export function strongSagaInk(gray, width, height) {
  const smooth = blur(gray, width, height),
    paper = blur(smooth, width, height, 10);
  return Float32Array.from(smooth, (v, i) => (paper[i] - v > 32 ? 0 : 255));
}
export function sagaTextMetric(reference, rendered, rect) {
  return compareRegion(
    ...[reference, rendered].map((image) =>
      strongSagaInk(cropGray(image, rect).gray, rect[2], rect[3]),
    ),
    rect[2],
    rect[3],
  );
}
