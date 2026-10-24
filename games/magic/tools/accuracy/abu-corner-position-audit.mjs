// Independent printed-corner diagnostics; never fit to artwork or typography.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile } from './common.mjs';
import { measurePrintedCorners } from './scan-corner-certification.mjs';
const [inputFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-corner-position-audit.mjs CURRENT_INPUTS OUTPUT_GZ');
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
const seedFile = 'games/magic/fixtures/accuracy/early-through-fourth/alpha-bottom-corners.json';
const sb = await readFile(seedFile),
  seed = JSON.parse(sb);
const entries = inputs.entries.filter((e) => ['lea', 'leb'].includes(e.set));
assert.equal(entries.length, 597);
const rows = [];
for (const e of entries) {
  const b = await readFile(objectFile(e.reference));
  assert.equal(hash(b), e.reference.sha256);
  const measured = measurePrintedCorners(PNG.sync.read(b), e.pose.transform, seed);
  rows.push({
    id: e.id,
    set: e.set,
    name: e.name,
    material: e.material,
    cohort: e.pose.cohort,
    primaryAccepted: e.pose.accepted,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(e.pose)),
    transform: e.pose.transform,
    corners: measured.corners,
  });
  if (rows.length % 100 === 0) console.log(rows.length + '/597');
}
const median = (a) => {
  const b = [...a].sort((a, b) => a - b);
  assert(b.length);
  return (b[Math.floor((b.length - 1) / 2)] + b[Math.ceil((b.length - 1) / 2)]) / 2;
};
const good = (c) => c.detected && c.shape >= 0.94 && c.contrast >= 80;
const groups = {};
for (const key of [...new Set(rows.map((r) => r.set + '/' + r.material))]) {
  const sample = rows.filter(
    (r) => r.set + '/' + r.material === key && r.cohort === 'calibration' && r.primaryAccepted,
  );
  const corners = seed.corners.map((c, index) => {
    const byName = new Map();
    for (const r of sample) {
      const v = r.corners[index];
      if (!good(v)) continue;
      const a = byName.get(r.name) ?? [];
      a.push(v);
      byName.set(r.name, a);
    }
    assert(byName.size >= 5, 'Insufficient distinct calibration names: ' + key);
    return {
      id: c.id,
      point: [
        median([...byName.values()].map((v) => median(v.map((v) => v.x)))),
        median([...byName.values()].map((v) => median(v.map((v) => v.y)))),
      ],
      calibrationNames: byName.size,
      members: sample.filter((r) => good(r.corners[index])).map((r) => r.id),
    };
  });
  groups[key] = {
    scope:
      'robust name-weighted positions from old-accepted calibration members only; development observations',
    corners,
  };
}
for (const r of rows) {
  const target = groups[r.set + '/' + r.material].corners;
  r.residuals = r.corners.map((c, i) =>
    good(c)
      ? {
          id: c.id,
          dx: c.x - target[i].point[0],
          dy: c.y - target[i].point[1],
          distance: Math.hypot(c.x - target[i].point[0], c.y - target[i].point[1]),
        }
      : null,
  );
  r.status = r.residuals.some((v) => !v)
    ? 'corner-evidence-unavailable'
    : r.residuals.some((v) => v.distance > 1.5)
      ? 'needs-independent-anchor-review'
      : 'consistent-with-corner-positions';
  r.coherentVertical =
    r.status === 'needs-independent-anchor-review' &&
    r.residuals.every((v) => v && Math.abs(v.dy) > 1.5) &&
    Math.sign(r.residuals[0].dy) === Math.sign(r.residuals[1].dy) &&
    Math.abs(r.residuals[0].dy - r.residuals[1].dy) < 0.75;
}
const summary = Object.fromEntries(
  ['lea', 'leb'].map((set) => [
    set,
    {
      total: rows.filter((r) => r.set === set).length,
      counts: Object.fromEntries(
        [...new Set(rows.map((r) => r.status))].map((status) => [
          status,
          rows.filter((r) => r.set === set && r.status === status).length,
        ]),
      ),
      verticalReview: rows
        .filter((r) => r.set === set && r.coherentVertical)
        .map((r) => ({ id: r.id, name: r.name, material: r.material, residuals: r.residuals })),
    },
  ]),
);
const files = ['scan-corner-certification.mjs', 'scan-transform.mjs', 'pixels-pure.mjs'];
await writeFile(
  output,
  gzipSync(
    Buffer.from(
      JSON.stringify({
        schema: 1,
        status: 'independent-corner-position-diagnostics-not-new-pose-approval',
        scope:
          '597 Alpha/Beta references and unchanged primary poses. The old Alpha-black template is used only as a patch/shape locator; position targets are robust, per-set/material name-weighted calibration medians. Missing marks are inconclusive. Disagreements require independent source-profile checks; this artifact never changes normalization acceptance or renderer values. No holdout claim.',
        source: {
          inputHash: hash(ib),
          seedFile,
          seedHash: hash(sb),
          toolHash: hash(await readFile(new URL(import.meta.url))),
          kernels: Object.fromEntries(
            await Promise.all(
              files.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
            ),
          ),
        },
        summary,
        groups,
        rows,
      }) + '\n',
    ),
    { mtime: 0 },
  ),
);
console.log(JSON.stringify(summary));
