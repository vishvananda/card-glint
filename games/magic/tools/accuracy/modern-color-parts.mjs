import { fitHsb, evaluateHsb, center, quantile } from './hsb-color.mjs';
import { poolColorTiles, colorScaleLimits } from './modern-color-fit-sampling.mjs';

/** Shared source-level objective. Missing fixed patches never become zero loss. */
export function fitModernColorParts(group, windows, model, maxClipping, math) {
  const parts = {};
  for (const part of Object.keys(windows)) {
    const rows = group.rows.filter((r) => r.parts[part]);
    if (!rows.length) {
      parts[part] = {
        status: 'insufficient-clean-patches',
        totalCards: group.rows.length,
        measuredCards: 0,
      };
      continue;
    }
    const samples = rows.map((r) => r.parts[part].source);
    const allTiles = samples.flatMap((s) => s.tiles),
      tiles = poolColorTiles(samples),
      rgb = center(samples.map((s) => s.rgb));
    const source = {
      rgb,
      tiles,
      spread: quantile(
        tiles.map((t) => Math.hypot(...t.map((v, i) => v - rgb[i]))),
        0.9,
      ),
    };
    const references = rows.map((r) => r.parts[part].reference);
    // Bound the upper tail before optimizing; a median-only color match can
    // otherwise flatten saturated highlights while reporting a small delta.
    const limits =
      maxClipping === undefined ? undefined : colorScaleLimits(allTiles, maxClipping, math);
    const constrainedModel = limits
      ? {
          ...model,
          saturationScale: [
            model.saturationScale[0],
            Math.min(model.saturationScale[1], limits[0]),
          ],
          brightnessScale: [
            model.brightnessScale[0],
            Math.min(model.brightnessScale[1], limits[1]),
          ],
        }
      : model;
    const fit = fitHsb(source, references, constrainedModel, math);
    const evaluations = rows.map((r) => ({
      id: r.id,
      ...evaluateHsb(r.parts[part].source, r.parts[part].reference, fit.adjustment, math),
    }));
    parts[part] = {
      status: 'measured',
      totalCards: group.rows.length,
      measuredCards: rows.length,
      ...fit,
      model: constrainedModel,
      optimizationTiles: tiles.length,
      pooledTiles: allTiles.length,
      sourceRgb: rgb,
      beforeMean: evaluations.reduce((s, r) => s + r.before, 0) / evaluations.length,
      afterMean: evaluations.reduce((s, r) => s + r.after, 0) / evaluations.length,
      worse: evaluations.filter((r) => r.after > r.before).length,
      meanClipping: evaluations.reduce((s, r) => s + r.clipping, 0) / evaluations.length,
      evaluations,
    };
  }
  return parts;
}
