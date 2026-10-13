/** Color-only diagnostics. Oklab reference: https://bottosson.github.io/posts/oklab/ */
export function oklab(rgb) {
  const [r, g, b] = rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export const quantile = (values, p) => {
  if (!values.length) throw Error('Empty color sample');
  const a = [...values].sort((a, b) => a - b),
    at = (a.length - 1) * p,
    lo = Math.floor(at),
    hi = Math.ceil(at);
  return a[lo] + (a[hi] - a[lo]) * (at - lo);
};
export const median = (values) => quantile(values, 0.5);
export const center = (samples) => [0, 1, 2].map((c) => median(samples.map((s) => s[c])));
export const delta = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i])) * 100;
/** Spatially eroded fixed windows, no per-card registration. Local dark-ink
 * rejection is applied equally to source paper and scans before tile medians. */
export function sampleColor(image, patches, { tileSize = 20, paper = false, dx = 0, dy = 0 } = {}) {
  const tiles = [];
  let total = 0,
    rejected = 0;
  for (const [rx, ry, rw, rh] of patches) {
    for (let y = ry; y < ry + rh; y += tileSize)
      for (let x = rx; x < rx + rw; x += tileSize) {
        const pixels = [];
        for (let yy = y; yy < Math.min(y + tileSize, ry + rh); yy++)
          for (let xx = x; xx < Math.min(x + tileSize, rx + rw); xx++) {
            const sx = xx + dx,
              sy = yy + dy;
            if (sx < 0 || sy < 0 || sx >= image.width || sy >= image.height)
              throw Error('Color patch out of bounds');
            const i = (sy * image.width + sx) * 4;
            if (image.data[i + 3] < 250) throw Error('Color patch touches transparent pixels');
            pixels.push([image.data[i] / 255, image.data[i + 1] / 255, image.data[i + 2] / 255]);
          }
        const cutoff = paper ? median(pixels.map((p) => Math.max(...p))) * 0.65 : 0;
        const kept = pixels.filter((p) => Math.max(...p) >= cutoff);
        total += pixels.length;
        rejected += pixels.length - kept.length;
        // Highly text-contaminated tiles are recorded but cannot drive a fit.
        if (kept.length / pixels.length >= 0.65) tiles.push(center(kept));
      }
  }
  if (tiles.length < 3) throw Error('Too few usable color tiles');
  const rgb = center(tiles),
    spread = quantile(
      tiles.map((t) => delta(t, rgb)),
      0.9,
    );
  return { rgb, tiles, spread, rejectedFraction: rejected / total };
}
export function fitHsb(source, references, model, math) {
  const target = center(references.map((r) => r.rgb));
  const [h, s, b] = math.rgbToHsb(source.rgb),
    [th, ts, tb] = math.rgbToHsb(target);
  const clamp = (v, [lo, hi]) => Math.max(lo, Math.min(hi, v));
  const neutral = s < model.neutralSaturation || ts < model.neutralSaturation;
  const raw = {
    hueDegrees: neutral ? 0 : ((th - h + 540) % 360) - 180,
    saturationScale: s < 0.005 ? 1 : ts / s,
    brightnessScale: tb / b,
  };
  const adjustment = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, clamp(v, model[k])]),
  );
  const flags = [];
  if (neutral) flags.push('neutral-hue-locked');
  if (Object.keys(raw).some((k) => Math.abs(raw[k] - adjustment[k]) > 1e-8))
    flags.push('model-bound');
  // Optimize the actual transformed tile distribution, not just the transform
  // of its median (nonlinear transforms and resampling need not commute).
  const score = (a) => delta(center(source.tiles.map((t) => math.adjustHsb(t, a))), target);
  let best = score(adjustment);
  for (const step of [4, 1, 0.25, 0.0625])
    for (let pass = 0; pass < 20; pass++) {
      let improved = false;
      for (const k of ['hueDegrees', 'saturationScale', 'brightnessScale']) {
        if (k === 'hueDegrees' && neutral) continue;
        const amount = k === 'hueDegrees' ? step : step / 100;
        for (const sign of [-1, 1]) {
          const a = { ...adjustment, [k]: clamp(adjustment[k] + sign * amount, model[k]) },
            loss = score(a);
          if (loss < best - 1e-7) {
            Object.assign(adjustment, a);
            best = loss;
            improved = true;
          }
        }
      }
      if (!improved) break;
    }
  return {
    adjustment,
    flags,
    target,
    fitError: best,
    calibrationSpread: quantile(
      references.map((r) => delta(r.rgb, target)),
      0.9,
    ),
  };
}
export function evaluateHsb(source, reference, adjustment, math) {
  const changed = source.tiles.map((t) => math.adjustHsb(t, adjustment)),
    afterRgb = center(changed);
  const clipping =
    source.tiles.filter((rgb) => {
      const [, s, b] = math.rgbToHsb(rgb);
      return s * adjustment.saturationScale > 1 || b * adjustment.brightnessScale > 1;
    }).length / source.tiles.length;
  return {
    before: delta(source.rgb, reference.rgb),
    after: delta(afterRgb, reference.rgb),
    sourceSpread: source.spread,
    afterSpread: quantile(
      changed.map((t) => delta(t, afterRgb)),
      0.9,
    ),
    referenceSpread: reference.spread,
    clipping,
    referenceRgb: reference.rgb,
    beforeRgb: source.rgb,
    afterRgb,
  };
}
