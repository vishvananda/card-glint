// Small frame-only gray fields retain the tangential dimension that an averaged
// strip loses. Exact inverse affine sampling handles curved crowns and bezels.
import { luminance } from './pixels-pure.mjs';
import { inverseScanMatrix } from './scan-transform.mjs';
import { median } from './metrics.mjs';
function smooth(values, width, height) {
  const weights = [1, 4, 6, 4, 1],
    horizontal = new Float32Array(values.length),
    result = new Uint8Array(values.length);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      let n = 0;
      for (let k = -2; k <= 2; k++)
        n += weights[k + 2] * values[y * width + Math.max(0, Math.min(width - 1, x + k))];
      horizontal[y * width + x] = n / 16;
    }
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      let n = 0;
      for (let k = -2; k <= 2; k++)
        n += weights[k + 2] * horizontal[Math.max(0, Math.min(height - 1, y + k)) * width + x];
      result[y * width + x] = Math.round(n / 16);
    }
  return result;
}
export function framePatches(image, windows, bounds, gray = luminance(image)) {
  if (image.width !== 488 || image.height !== 680) throw Error('Expected canonical scan');
  return Object.entries(windows).flatMap(([side, [axis, lo, hi, positions, span = 8]]) =>
    positions.map((along) => {
      const [normalLo, normalHi] = bounds[side],
        width = normalHi - normalLo + 1,
        height = span * 2 + 1,
        values = new Uint8Array(width * height);
      for (let j = 0; j < height; j++)
        for (let i = 0; i < width; i++) {
          const n = normalLo + i,
            a = along - span + j;
          values[j * width + i] = Math.round(
            gray[(axis === 'x' ? a : n) * 488 + (axis === 'x' ? n : a)],
          );
        }
      if (lo <= normalLo || hi >= normalHi || lo >= hi)
        throw Error('Matching interval leaves reviewed frame field');
      return {
        side,
        axis,
        lo,
        hi,
        along,
        span,
        normalLo,
        normalHi,
        width,
        height,
        values: smooth(values, width, height),
        filter: 'binomial5-frame-only-v1',
      };
    }),
  );
}
export function packFramePatches(partitions) {
  const bytes = new Uint8Array(partitions.flat().reduce((n, p) => n + p.values.byteLength, 0));
  const view = new DataView(bytes.buffer);
  let offset = 0;
  const description = partitions.map((ps) =>
    ps.map(({ values, ...p }) => {
      const floating = values instanceof Float32Array;
      if (!floating && !(values instanceof Uint8Array))
        throw Error('Unsupported frame field encoding');
      if (floating)
        for (let i = 0; i < values.length; i++) {
          if (!Number.isFinite(values[i])) throw Error('Nonfinite frame field');
          view.setFloat32(offset + i * 4, values[i], true);
        }
      else bytes.set(values, offset);
      const r = { ...p, offset, length: values.byteLength, encoding: floating ? 'f32le' : 'u8' };
      offset += values.byteLength;
      return r;
    }),
  );
  return { bytes, description };
}
export function unpackFramePatches(bytes, description) {
  let used = 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const result = description.map((ps) =>
    ps.map((p) => {
      if (
        ![
          'binomial5-frame-only-v1',
          'native-gaussian-0.8-frame-only-v1',
          'native-grid-gaussian-0.8-frame-only-v2',
          'native-grid-gaussian-0.8-f32-frame-only-v3',
        ].includes(p.filter) ||
        p.lo <= p.normalLo ||
        p.hi >= p.normalHi
      )
        throw Error('Unsupported or invalid frame field');
      const floating = p.encoding === 'f32le';
      if (!floating && p.encoding !== undefined && p.encoding !== 'u8')
        throw Error('Unsupported frame field encoding');
      if (
        p.offset !== used ||
        p.length !== p.width * p.height * (floating ? 4 : 1) ||
        p.offset + p.length > bytes.length
      )
        throw Error('Invalid frame field offsets');
      if (p.filter === 'native-grid-gaussian-0.8-f32-frame-only-v3' && !floating)
        throw Error('Native float field requires f32le encoding');
      if (p.filter.startsWith('native-grid-')) {
        const s = p.nativeSampling;
        if (!s || !Object.values(s).every(Number.isFinite) || !(s.factor > 0))
          throw Error('Invalid native frame sampling');
      } else if (p.nativeSampling) throw Error('Unexpected native frame sampling');
      used += p.length;
      const { offset, length, encoding, ...shape } = p;
      if (!floating) return { ...shape, values: bytes.subarray(offset, offset + length) };
      const values = new Float32Array(length / 4);
      for (let i = 0; i < values.length; i++) {
        values[i] = view.getFloat32(offset + i * 4, true);
        if (!Number.isFinite(values[i])) throw Error('Nonfinite frame field');
      }
      return { ...shape, values };
    }),
  );
  if (used !== bytes.length) throw Error('Unexpected trailing frame pixels');
  return result;
}

function sample(p, x, y) {
  const n = p.axis === 'x' ? x : y,
    a = p.axis === 'x' ? y : x;
  const s = p.nativeSampling;
  const u = Math.max(
      0,
      Math.min(
        p.width - 1,
        s ? (n - s.normalPad + 0.5) / s.factor - 0.5 - s.normalStart : n - p.normalLo,
      ),
    ),
    v = Math.max(
      0,
      Math.min(
        p.height - 1,
        s ? (a - s.alongPad + 0.5) / s.factor - 0.5 - s.alongStart : a - p.along + p.span,
      ),
    );
  const i = Math.floor(u),
    j = Math.floor(v),
    r = Math.min(i + 1, p.width - 1),
    b = Math.min(j + 1, p.height - 1),
    fx = u - i,
    fy = v - j;
  return (
    (p.values[j * p.width + i] * (1 - fx) + p.values[j * p.width + r] * fx) * (1 - fy) +
    (p.values[b * p.width + i] * (1 - fx) + p.values[b * p.width + r] * fx) * fy
  );
}
export function patchGradient(p, transform = { matrix: [1, 0, 0, 1, 0, 0] }) {
  const m = inverseScanMatrix(transform),
    result = [];
  const at = (x, y) =>
    sample(
      p,
      244 + m[0] * (x - 244) + m[2] * (y - 340) + m[4],
      340 + m[1] * (x - 244) + m[3] * (y - 340) + m[5],
    );
  // Preserve four tangential bins instead of averaging a curve into one strip.
  // Each bin averages two samples. Dividing each by two keeps the raw-signal
  // energy scale equal to the earlier single averaged gradient vector.
  for (let q = p.lo; q <= p.hi; q++)
    for (const center of [-3, -1, 1, 3]) {
      let sum = 0;
      for (const k of [center - 0.5, center + 0.5]) {
        const x = p.axis === 'x' ? q : p.along + k,
          y = p.axis === 'y' ? q : p.along + k;
        sum +=
          p.axis === 'x' ? (at(x + 1, y) - at(x - 1, y)) / 2 : (at(x, y + 1) - at(x, y - 1)) / 2;
      }
      result.push(sum / 4);
    }

  return result;
}
export function patchSupport(patches, templates, transform) {
  const matches = patches.map((p, i) => {
    const t = templates[i];
    if (!t || p.side !== t.side || p.along !== t.along || p.lo !== t.lo || p.hi !== t.hi)
      throw Error('Frame field identity differs');
    const a = patchGradient(p, transform),
      b = t.gradient;
    if (a.length !== b.length) throw Error('Frame feature identity differs');
    const aa = a.reduce((n, x) => n + x * x, 0),
      bb = b.reduce((n, x) => n + x * x, 0);
    return {
      side: p.side,
      along: p.along,
      score:
        aa < 10 || bb < 10
          ? null
          : Math.max(-1, Math.min(1, a.reduce((n, x, j) => n + x * b[j], 0) / Math.sqrt(aa * bb))),
    };
  });
  const sides = Object.fromEntries(
    ['left', 'right', 'top', 'bottom'].map((s) => [
      s,
      median(matches.filter((r) => r.side === s).map((r) => r.score ?? -1)),
    ]),
  );
  const confidence = Object.values(sides).reduce((a, b) => a + b, 0) / 4,
    objective = matches.reduce((n, r) => n + (r.score ?? -1), 0) / matches.length,
    count = matches.filter((r) => r.score !== null).length;
  return {
    confidence,
    objective,
    sides,
    count,
    matches,
    accepted: count >= 8 && confidence >= 0.7 && Object.values(sides).every((s) => s >= 0.5),
  };
}
