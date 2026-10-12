import { luminance, WIDTH, HEIGHT } from './pixels.mjs';
import { median } from './metrics.mjs';

export const SCAN_TRANSLATION_VERSION = 'normal-scan-translation-v1';

// Frame-only strips: no title/rules ink, mana, type lettering or set symbols.
// Scan landmarks are compared with a frozen frame template, never with the
// candidate renderer. Thus changing a painter cannot change registration.
export const SCAN_FRAME_STRIPS = [
  ...[90, 215, 340].flatMap((along) => [
    { group: 'artTop', axis: 'y', range: [60, 79], along, count: 55, kind: 'fall' },
    { group: 'artBottom', axis: 'y', range: [371, 385], along, count: 55, kind: 'ridge' },
  ]),
  ...[80, 165, 300].map((along) => ({
    group: 'rulesBottom',
    axis: 'y',
    range: [623, 640],
    along,
    count: 45,
    kind: 'fall',
  })),
  ...[130, 260, 470].flatMap((along) => [
    { group: 'outerLeft', axis: 'x', range: [13, 29], along, count: 55, kind: 'rise' },
    { group: 'outerRight', axis: 'x', range: [458, 474], along, count: 55, kind: 'fall' },
  ]),
];

export function measureScanFrame(image) {
  if (image.width !== WIDTH || image.height !== HEIGHT || image.data.length !== WIDTH * HEIGHT * 4)
    throw Error('Scan translation requires a canonical RGBA card');
  const gray = luminance(image);
  return SCAN_FRAME_STRIPS.map((strip) => {
    const {
      axis,
      range: [lo, hi],
      along,
      count,
      kind,
    } = strip;
    const stride = axis === 'x' ? 1 : WIDTH;
    const values = [];
    for (let p = lo - 1; p <= hi + 1; p++) {
      let sum = 0;
      for (let q = along; q < along + count; q++) {
        const i = axis === 'x' ? q * WIDTH + p : p * WIDTH + q;
        sum +=
          kind === 'ridge'
            ? (gray[i - 2 * stride] + gray[i + 2 * stride]) / 2 - gray[i]
            : (kind === 'rise' ? 1 : -1) * (gray[i + stride] - gray[i - stride]);
      }
      values.push(sum / count);
    }
    const peaks = values.flatMap((value, i) =>
      i > 0 && i < values.length - 1 && value > values[i - 1] && value >= values[i + 1]
        ? [{ i, value }]
        : [],
    );
    peaks.sort((a, b) => b.value - a.value);
    // The lower title bevel has several ridges. Its first strong inward
    // paper-to-border transition is stable; the darkest subsequent art ridge
    // depends on the illustration and must not win registration.
    const peak =
      strip.group === 'artTop' && peaks.length
        ? peaks
            .filter((p) => p.value >= Math.max(8, peaks[0].value * 0.55))
            .sort((a, b) => a.i - b.i)[0]
        : peaks[0];
    if (!peak || peak.value < 8) return { ...strip, status: 'missing', position: null };
    const i = peak.i,
      a = values[i - 1],
      b = values[i],
      c = values[i + 1];
    const position = lo - 1 + i + (a - c) / (2 * (a - 2 * b + c));
    const ambiguous =
      strip.group !== 'artTop' && peaks.some((p) => Math.abs(p.i - i) > 3 && p.value > b * 0.75);
    return {
      ...strip,
      position,
      strength: b,
      status:
        position < lo + 0.5 || position > hi - 0.5
          ? 'boundary'
          : ambiguous
            ? 'ambiguous'
            : 'measured',
    };
  });
}

/** Freeze once from a named baseline frame cohort, retaining raster hashes. */
export function scanTranslationTemplate(samples) {
  if (samples.length < 12) throw Error('Scan template needs at least twelve baseline frames');
  return SCAN_FRAME_STRIPS.map((strip, i) => {
    const values = samples.flatMap((sample) =>
      sample[i].status === 'measured' ? [sample[i].position] : [],
    );
    return {
      ...strip,
      countSamples: values.length,
      position: values.length >= 8 ? median(values) : null,
    };
  });
}

/** At most one translation per axis. Ambiguous/inconsistent axes stay at zero. */
export function scanTranslation(measured, template) {
  if (measured.length !== SCAN_FRAME_STRIPS.length || template.length !== measured.length)
    throw Error('Incompatible scan landmarks');
  const axes = {};
  for (const axis of ['x', 'y']) {
    // The lower rules boundary changes with the holo-stamp treatment. Retain
    // it as a diagnostic, but use the widely separated art edges for y.
    const groups = [
      ...new Set(
        SCAN_FRAME_STRIPS.filter((s) => s.axis === axis && s.group !== 'rulesBottom').map(
          (s) => s.group,
        ),
      ),
    ];
    const offsets = groups.map((group) => {
      const deltas = measured.flatMap((p, i) =>
        p.group === group && p.status === 'measured' && template[i].position !== null
          ? [template[i].position - p.position]
          : [],
      );
      const offset = deltas.length >= 2 ? median(deltas) : null;
      return {
        group,
        count: deltas.length,
        offset,
        spread: offset === null ? null : Math.max(...deltas.map((d) => Math.abs(d - offset))),
      };
    });
    const complete = offsets.every((g) => g.offset !== null && g.spread <= 0.8);
    const proposed = complete ? median(offsets.map((g) => g.offset)) : null;
    const residual = complete
      ? Math.max(...offsets.map((g) => Math.abs(g.offset - proposed)))
      : null;
    const status = !complete
      ? 'insufficient-landmarks'
      : Math.abs(proposed) > 4
        ? 'out-of-bounds'
        : residual > 0.8
          ? 'inconsistent-geometry'
          : 'accepted';
    axes[axis] = { status, proposed, residual, groups: offsets };
  }
  return {
    version: SCAN_TRANSLATION_VERSION,
    axes,
    transform: {
      tx: axes.x.status === 'accepted' ? axes.x.proposed : 0,
      ty: axes.y.status === 'accepted' ? axes.y.proposed : 0,
      scale: 1,
      rotation: 0,
    },
  };
}
