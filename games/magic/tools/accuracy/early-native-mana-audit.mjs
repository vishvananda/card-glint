// Measure native original-printing mana discs without changing scan poses.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { center, delta, median, quantile } from './hsb-color.mjs';
const [nativeDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-native-mana-audit.mjs NATIVE_CAPTURE OUTPUT');
const raw = await Promise.all(
  ['capture.json', 'inputs.json'].map((f) => readFile(path.join(nativeDirectory, f))),
);
const [capture, inputs] = raw.map((b) => JSON.parse(b));
assert.equal(capture.source.rendererHash, inputs.source.rendererHash);
assert(
  inputs.entries.every(
    (e) => e.set === '2ed' && e.face.wordingMode === 'original' && e.pose.accepted,
  ),
  'These perimeter search bounds are measured for Unlimited originals',
);
const circleOptions = { x: 433, y: 47, range: 5, radiusRange: [9.5, 14] };
const pigment = (image, circle) => {
  const pixels = [];
  for (
    let y = Math.ceil(circle.y - circle.radius * 0.92);
    y <= circle.y + circle.radius * 0.92;
    y++
  )
    for (
      let x = Math.ceil(circle.x - circle.radius * 0.92);
      x <= circle.x + circle.radius * 0.92;
      x++
    ) {
      if (Math.hypot(x - circle.x, y - circle.y) > circle.radius * 0.92) continue;
      const at = (y * image.width + x) * 4;
      pixels.push([0, 1, 2].map((c) => image.data[at + c] / 255));
    }
  pixels.sort((a, b) => Math.max(...a) - Math.max(...b));
  const ink = pixels.slice(0, Math.ceil(pixels.length * 0.05)),
    paper = pixels.slice(Math.floor(pixels.length * 0.8));
  const disc = center(paper),
    glyph = center(ink);
  return {
    disc,
    glyph,
    separation: Math.max(...disc) - Math.max(...glyph),
    discSpread: quantile(
      paper.map((p) => delta(p, disc)),
      0.9,
    ),
  };
};
const rows = [];
for (const e of inputs.entries) {
  const cost = e.face.manaSymbols ?? [];
  if (!cost.length) continue;
  const symbol = /^\d+$/.test(cost.at(-1)) ? 'N' : cost.at(-1);
  assert(/^[WUBRGN]$/.test(symbol));
  const r = capture.rows.find((r) => r.id === e.id);
  assert(r?.accepted);
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.poseHash, hash(JSON.stringify(e.pose.transform)));
  const bytes = await Promise.all(
    ['.png', '-scan.png'].map((s) => readFile(path.join(nativeDirectory, e.set, e.id + s))),
  );
  assert.equal(hash(bytes[0]), r.renderHash);
  assert.equal(hash(bytes[1]), r.scanHash);
  const measurements = [];
  for (const b of bytes) {
    const native = PNG.sync.read(b);
    assert.deepEqual([native.width, native.height], [732, 1020]);
    const image = normalize(native),
      circle = outerManaCircle(image, circleOptions);
    measurements.push({ circle, ...pigment(image, circle) });
  }
  const [render, scan] = measurements;
  const failures = measurements.flatMap((m, i) => [
    ...(m.circle.status === 'measured' ? [] : [(i ? 'scan' : 'render') + '/' + m.circle.status]),
    ...(m.separation > 0.15 ? [] : [(i ? 'scan' : 'render') + '/weak-ink-separation']),
  ]);
  rows.push({
    id: e.id,
    name: e.name,
    material: e.material,
    symbol,
    cohort: e.pose.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    faceHash: r.renderHash,
    scanHash: r.scanHash,
    accepted: failures.length === 0,
    failures,
    render,
    scan,
    discDeltaE: delta(render.disc, scan.disc),
    glyphDeltaE: delta(render.glyph, scan.glyph),
    geometry: {
      dx: scan.circle.x - render.circle.x,
      dy: scan.circle.y - render.circle.y,
      diameter: 2 * (scan.circle.radius - render.circle.radius),
    },
  });
  if (rows.length % 25 === 0) console.log(rows.length, e.name);
}
const groups = Object.fromEntries(
  ['W', 'U', 'B', 'R', 'G', 'N'].map((symbol) => {
    const rr = rows.filter((r) => r.symbol === symbol),
      accepted = rr.filter((r) => r.accepted);
    const summarize = (a) => ({
      count: a.length,
      geometry: Object.fromEntries(
        ['dx', 'dy', 'diameter'].map((k) => [
          k,
          a.length ? median(a.map((r) => r.geometry[k])) : null,
        ]),
      ),
      discDeltaE: a.length ? median(a.map((r) => r.discDeltaE)) : null,
      glyphDeltaE: a.length ? median(a.map((r) => r.glyphDeltaE)) : null,
      targetDiscRgb: a.length ? center(a.map((r) => r.scan.disc)) : null,
    });
    const train = accepted.filter((r) => r.cohort === 'calibration'),
      validation = accepted.filter((r) => r.cohort === 'validation'),
      target = train.length ? center(train.map((r) => r.scan.disc)) : null;
    return [
      symbol,
      {
        total: rr.length,
        accepted: accepted.length,
        all: summarize(accepted),
        calibration: summarize(train),
        validation: summarize(validation),
        colorTargetProbe:
          target && validation.length
            ? {
                beforeMedian: median(validation.map((r) => r.discDeltaE)),
                afterMedian: median(validation.map((r) => delta(target, r.scan.disc))),
                worstRegression: Math.max(
                  0,
                  ...validation.map((r) => delta(target, r.scan.disc) - r.discDeltaE),
                ),
              }
            : null,
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'native-perimeter-and-pigment-diagnostic-not-adopted',
  scope:
    'Every original Unlimited printing with a mana cost, one rightmost disc per printing. Native full-card and frozen frame-normalized scan hashes are verified. A perimeter search measures centers/radii for diagnostics only; it never registers scoring rasters or creates printing overrides. Bright-disc and dark-ink quantiles are separate pigment probes. Shared targets use calibration names only, with reused-development validation and all measurement failures retained. This is not glyph-size/numeral/pitch calibration or whole-card scoring.',
  rendererHash: capture.source.rendererHash,
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    ['abu-mana-ring.mjs', 'pixels-pure.mjs', 'hsb-color.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  circleOptions,
  total: rows.length,
  accepted: rows.filter((r) => r.accepted).length,
  groups,
  rows,
});
console.log(
  JSON.stringify({ total: rows.length, accepted: rows.filter((r) => r.accepted).length, groups }),
);
