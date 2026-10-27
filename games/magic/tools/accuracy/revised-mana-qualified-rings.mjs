// Requalify direct native perimeters using physical priors and independent polarity.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { nativeReferenceWindow } from './native-reference-window.mjs';
import { referenceManaCircle } from './reference-mana-circle.mjs';
import { median, quantile } from './hsb-color.mjs';
const [inputFile, poseFile, nativeDirectory, priorFile, output] = process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-qualified-rings.mjs INPUTS POSES NATIVE DIRECT_NATIVE_RINGS NEW_OUTPUT',
);
const files = [inputFile, poseFile, path.join(nativeDirectory, 'capture.json'), priorFile],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, prior] = bytes.map((b) => JSON.parse(b)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  moduleNames = [
    'reference-mana-circle.mjs',
    'abu-mana-ring.mjs',
    'native-reference-window.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'hsb-color.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        moduleNames.map(async (n) => [n, hash(await fs.readFile(new URL(n, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  rows = [],
  s = 1.5;
assert.equal(prior.rendererHash, rendererHash);
assert.equal(capture.rendererHash, rendererHash);
assert.equal(prior.mode, 'full');
assert.equal(capture.status, 'complete');
assert.equal(prior.sources.capture, hash(bytes[2]));
assert.equal(prior.sources.inputs, hash(bytes[0]));
assert.equal(prior.sources.poses, hash(bytes[1]));
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
for (const r of prior.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    p = Object.values(poses.groups)
      .flatMap((g) => g.rows)
      .find((p) => p.id === r.id),
    n = capture.rows.find((n) => n.id === r.id),
    data = await fs.readFile(objectFile(e.reference)),
    rect = r.nativeWindow;
  assert(p.accepted);
  assert.equal(hash(data), r.referenceHash);
  assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
  assert.equal(n.modes.original.sha256, r.nativeHash);
  const scan = nativeReferenceWindow(PNG.sync.read(data), rect, p.transform, s),
    discs = [];
  for (const d of r.discs) {
    const native = d.circles.render,
      raw = referenceManaCircle(scan, {
        x: native.raw.x,
        y: native.raw.y,
        radius: 11.7 * s,
        range: 2 * s,
        radiusTolerance: 0.5 * s,
      }),
      reference =
        raw.status === 'measured'
          ? {
              ...raw,
              x: rect[0] + (raw.x + 0.5) / s - 0.5,
              y: rect[1] + (raw.y + 0.5) / s - 0.5,
              radius: raw.radius / s,
              raw: { x: raw.x, y: raw.y, radius: raw.radius },
            }
          : raw;
    discs.push({
      index: d.index,
      rightIndex: d.rightIndex,
      symbol: d.symbol,
      anchor: d.anchor,
      nativeControlPassed: d.nativeControlPassed,
      native,
      reference,
      previousReference: d.circles.scan,
      previousAccepted: d.accepted,
      accepted: d.nativeControlPassed && reference.status === 'measured',
      reason: !d.nativeControlPassed
        ? 'native-control-rejected'
        : reference.status === 'measured'
          ? null
          : reference.reason,
    });
  }
  rows.push({
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    nativeHash: r.nativeHash,
    poseHash: r.poseHash,
    discs,
  });
  if (rows.length % 25 === 0) console.log('Qualified native circles', rows.length);
}
const flat = rows.flatMap((r) =>
  r.discs.map((d) => ({ ...d, id: r.id, name: r.name, material: r.material, cohort: r.cohort })),
);
const summarize = (rs) => {
    const ok = rs.filter((d) => d.accepted),
      stats = (k) => {
        const v = ok.map((d) => k(d));
        return v.length
          ? { median: median(v), p10: quantile(v, 0.1), p90: quantile(v, 0.9) }
          : null;
      };
    return {
      circles: rs.length,
      accepted: ok.length,
      previousAccepted: rs.filter((d) => d.previousAccepted).length,
      flippedPolarity: ok.filter((d) => d.reference.polarity !== d.native.polarity).length,
      dx: stats((d) => d.reference.x - d.native.x),
      dy: stats((d) => d.reference.y - d.native.y),
      radiusDifference: stats((d) => d.reference.radius - d.native.radius),
      unresolvedReasons: Object.fromEntries(
        [...new Set(rs.filter((d) => !d.accepted).map((d) => d.reason))].map((k) => [
          k,
          rs.filter((d) => !d.accepted && d.reason === k).length,
        ]),
      ),
    };
  },
  groups = Object.fromEntries(
    [
      ['all', flat],
      ...['calibration', 'validation'].map((c) => [c, flat.filter((d) => d.cohort === c)]),
      ...['W', 'U', 'B', 'R', 'G', 'A'].map((m) => [m, flat.filter((d) => d.material === m)]),
    ].map(([k, rs]) => [k, summarize(rs)]),
  );
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
assert.deepEqual(await identities(), modules);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
await writeJson(output, {
  schema: 1,
  status: 'qualified-native-circles-not-adopted',
  scope:
    'Direct732px scan windows and frozen frame poses. Native controls remain explicit. Reference searches are limited to2canonical pixels and radius11.7plus/minus0.5;contrast polarity is chosen independently. Weak,boundary and ambiguous perimeters remain unresolved rather than substituted by glyph/frame edges. No renderer positions or colors change.',
  rendererHash,
  toolHash,
  modules,
  sources: Object.fromEntries(files.map((f, i) => [path.basename(f), hash(bytes[i])])),
  groups,
  rows,
  excluded: prior.excluded,
});
console.log(JSON.stringify(groups));
