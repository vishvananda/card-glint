import { center, delta, median, quantile } from './hsb-color.mjs';
/** Fit one transform to every component, with equal weight per material and
 * component. A Huber loss limits unusually processed scan cohorts. */
export function fitSharedHsb(pairs, model, math) {
  const targets = pairs.map((p) => ({ ...p, target: center(p.references.map((r) => r.rgb)) }));
  const bounds = (k) => model[k],
    clamp = (x, k) => Math.max(bounds(k)[0], Math.min(bounds(k)[1], x));
  const loss = (a) =>
    targets.reduce((sum, p) => {
      const d = delta(center(p.source.tiles.map((t) => math.adjustHsb(t, a))), p.target);
      return sum + (d <= 3 ? d * d : 6 * d - 9);
    }, 0) / targets.length;
  const seeds = [
    math.IDENTITY_HSB,
    ...targets.map((p) => {
      const [h, s, b] = math.rgbToHsb(p.source.rgb),
        [th, ts, tb] = math.rgbToHsb(p.target);
      return {
        hueDegrees:
          s < model.neutralSaturation || ts < model.neutralSaturation
            ? 0
            : ((th - h + 540) % 360) - 180,
        saturationScale: s < 0.005 ? 1 : ts / s,
        brightnessScale: tb / b,
      };
    }),
  ];
  const hueLocked = targets.every(
    (p) =>
      math.rgbToHsb(p.source.rgb)[1] < model.neutralSaturation ||
      math.rgbToHsb(p.target)[1] < model.neutralSaturation,
  );
  let best = null;
  for (const seed of seeds) {
    const a = Object.fromEntries(
      Object.entries(seed).map(([k, v]) => [k, clamp(hueLocked && k === 'hueDegrees' ? 0 : v, k)]),
    );
    let score = loss(a);
    for (const step of [4, 1, 0.25, 0.0625])
      for (let pass = 0; pass < 30; pass++) {
        let changed = false;
        for (const k of ['hueDegrees', 'saturationScale', 'brightnessScale']) {
          if (k === 'hueDegrees' && hueLocked) continue;
          for (const sign of [-1, 1]) {
            const next = {
                ...a,
                [k]: clamp(a[k] + sign * (k === 'hueDegrees' ? step : step / 100), k),
              },
              value = loss(next);
            if (value < score - 1e-8) {
              Object.assign(a, next);
              score = value;
              changed = true;
            }
          }
        }
        if (!changed) break;
      }
    if (!best || score < best.loss) best = { adjustment: a, loss: score, hueLocked };
  }
  return best;
}
/** Eroded mana-disc interior: fixed printed geometry, no per-scan search.
 * The brightest fifth suppresses black glyph ink; paired offset sensitivity stays
 * visible instead of being used to move individual scans. */
export function manaDiscColor(image, cx, cy) {
  const pixels = [];
  for (let y = Math.floor(cy - 10); y <= Math.ceil(cy + 10); y++)
    for (let x = Math.floor(cx - 10); x <= Math.ceil(cx + 10); x++) {
      if (Math.hypot(x - cx, y - cy) > 10) continue;
      const i = (y * image.width + x) * 4;
      if (image.data[i + 3] < 250) continue;
      pixels.push([0, 1, 2].map((c) => image.data[i + c] / 255));
    }
  // Rank selection avoids including every black pixel when the quantile is
  // tied inside a dense historic sun/skull. The bright fifth samples the disc.
  const tiles = pixels
      .sort((a, b) => Math.max(...b) - Math.max(...a))
      .slice(0, Math.max(1, Math.ceil(pixels.length * 0.2))),
    rgb = center(tiles);
  return {
    rgb,
    tiles,
    spread: quantile(
      tiles.map((t) => delta(t, rgb)),
      0.9,
    ),
  };
}
export function costCenters(set, symbols) {
  const [right, cy, pitch] =
    set === '3ed' ? [435, 44.5, 27] : set === 'leb' ? [435.5696, 47.328, 25.1] : [432, 46, 27];
  return symbols
    .map((symbol, i) => ({
      symbol: /^\d+$/.test(symbol) ? 'N' : symbol,
      cx: right - (symbols.length - 1 - i) * pitch,
      cy,
    }))
    .filter((s) => ['W', 'U', 'B', 'R', 'G', 'N'].includes(s.symbol));
}
export function perCardMana(image, set, symbols) {
  const bySymbol = new Map();
  for (const { symbol, cx, cy } of costCenters(set, symbols)) {
    const color = manaDiscColor(image, cx, cy);
    const sensitivity = Math.max(
      ...[
        [2, 0],
        [-2, 0],
        [0, 2],
        [0, -2],
      ].map(([dx, dy]) => delta(color.rgb, manaDiscColor(image, cx + dx, cy + dy).rgb)),
    );
    const rows = bySymbol.get(symbol) ?? [];
    rows.push({ ...color, sensitivity });
    bySymbol.set(symbol, rows);
  }
  return [...bySymbol].map(([symbol, colors]) => ({
    symbol,
    rgb: center(colors.map((c) => c.rgb)),
    tiles: colors.map((c) => c.rgb),
    spread: median(colors.map((c) => c.spread)),
    sensitivity: Math.max(...colors.map((c) => c.sensitivity)),
  }));
}
