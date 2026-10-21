import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { metricSourceGraph } from './module-graph.mjs';
import { normalize, luminance } from './pixels-pure.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { hash, root } from './common.mjs';
const require = createRequire(path.join(root, 'package.json')),
  { PNG } = require('pngjs');
const [native, scans, out, scorerFile] = process.argv.slice(2);
assert(
  scorerFile,
  'Usage: early-dual-crop-score.mjs INSTALLED_NATIVE NORMALIZED_SCANS CAPTURE SCORER',
);
const input = JSON.parse(await fs.readFile(path.join(native, 'inputs.json')));
const baseline = JSON.parse(await fs.readFile(path.join(native, 'capture.json')));
const metricGraph = await metricSourceGraph(scorerFile),
  { scoreRegions } = await import(pathToFileURL(path.resolve(scorerFile)));
const capture = JSON.parse(await fs.readFile(out + '/capture.json'));
const bounds = { left: [18, 43], top: [23, 36], bottom: [638, 657] };
const windows = {
  left: ['x', 18, 40, [110, 200, 300], 3],
  top: ['y', 23, 36, [400, 420, 440], 3],
  bottom: ['y', 638, 657, [400, 420, 440], 3],
};
const cosine = (a, b) => {
  let xy = 0,
    xx = 0,
    yy = 0;
  for (let i = 0; i < a.length; i++) {
    xy += a[i] * b[i];
    xx += a[i] ** 2;
    yy += b[i] ** 2;
  }
  return xy / Math.sqrt(xx * yy);
};
const rows = [];
for (const row of capture.rows) {
  const e = input.entries.find((e) => e.id === row.id),
    scanBytes = await fs.readFile(path.join(scans, row.id + '-scan.png'));
  const baselineRow = baseline.rows.find((r) => r.id === row.id);
  assert.equal(hash(scanBytes), baselineRow.scanHash);
  assert.equal(row.referenceHash, e.reference.sha256);
  assert.equal(row.poseHash, hash(JSON.stringify(e.pose.transform)));
  const scan = normalize(PNG.sync.read(scanBytes)),
    profiles = scanBoundaryProfiles(scan, windows, bounds),
    variants = [];
  for (const v of row.variants) {
    const bytes = await fs.readFile(out + '/' + v.name + '/' + row.id + '.png');
    if (hash(bytes) !== v.hash) throw Error('Raster mismatch');
    const render = normalize(PNG.sync.read(bytes)),
      score = scoreRegions(scan, render, e.card, e.face),
      rp = scanBoundaryProfiles(render, windows, bounds);
    const strips = Object.fromEntries(
      ['left', 'top', 'bottom'].map((side) => {
        const values = profiles
          .filter((p) => p.side === side)
          .map((p) =>
            cosine(p.gradient, rp.find((r) => r.side === p.side && r.along === p.along).gradient),
          );
        return [side, values.reduce((a, b) => a + b, 0) / values.length];
      }),
    );
    variants.push({
      name: v.name,
      hash: v.hash,
      structural100: score.structuralScore * 100,
      frame100: score.components.frame.score * 100,
      art100: score.components.art.score * 100,
      strips,
    });
  }
  rows.push({
    id: e.id,
    name: e.name,
    referenceHash: e.reference.sha256,
    poseHash: row.poseHash,
    scanHash: hash(scanBytes),
    variants,
  });
  console.log(
    e.name,
    variants.map((v) => [v.name, v.structural100.toFixed(2), v.strips.top.toFixed(3)]),
  );
}
const summary = Object.fromEntries(
  capture.rows[0].variants.map((v) => {
    const rs = rows.map((r) => r.variants.find((x) => x.name === v.name));
    return [
      v.name,
      {
        structural100: rs.reduce((n, r) => n + r.structural100, 0) / rs.length,
        frame100: rs.reduce((n, r) => n + r.frame100, 0) / rs.length,
        art100: rs.reduce((n, r) => n + r.art100, 0) / rs.length,
        strips: Object.fromEntries(
          ['left', 'top', 'bottom'].map((s) => [
            s,
            rs.reduce((n, r) => n + r.strips[s], 0) / rs.length,
          ]),
        ),
      },
    ];
  }),
);
await fs.writeFile(
  out + '/scores.json',
  JSON.stringify(
    {
      metricGraph,
      windows,
      bounds,
      toolHash: hash(await fs.readFile(new URL(import.meta.url))),
      captureHash: hash(await fs.readFile(out + '/capture.json')),
      scope:
        'All ten frozen-pose duals. No scan refit; native geometry-only candidates. Whole-card metric and fixed-position boundary gradient diagnostics retained independently.',
      summary,
      rows,
    },
    null,
    2,
  ) + '\n',
);
console.log(summary);
