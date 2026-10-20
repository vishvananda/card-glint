// Exact whole-set footprint of the plain-rules wrapping safeguard.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash, root, sourceHash } from './common.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
const [baselineDirectory, candidateDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: abu-plain-wrap-measure.mjs BASELINE CANDIDATE OUT.json');
const baseline = await readJson(path.join(baselineDirectory, 'capture.json'));
const candidate = await readJson(path.join(candidateDirectory, 'capture.json'));
const expectedProof = JSON.parse(
  gunzipSync(
    await readFile(
      path.join(
        root,
        'games/magic/fixtures/accuracy/early-through-fourth/alpha-rules-width-trial.json.gz',
      ),
    ),
  ),
);
const expected = new Set(expectedProof.proposedFollowup.selectedPrintingIds);
const cornerBytes = await readFile(
  path.join(
    root,
    'games/magic/fixtures/accuracy/early-through-fourth/alpha-corner-recovery.json.gz',
  ),
);
const cornerProof = JSON.parse(gunzipSync(cornerBytes));
assert.equal(
  cornerProof.sourceCaptureHash,
  hash(await readFile(path.join(baselineDirectory, 'capture.json'))),
);
assert.equal(candidate.rows.length, 295);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), candidate.source.rendererHash);
const oldComponents = new Map(baseline.source.components);
for (const [url, digest] of candidate.source.components)
  assert.equal(oldComponents.get(url), digest);
const rect = [77, 410, 345, 195],
  rows = [];
for (const c of candidate.rows) {
  const b = baseline.rows.find((r) => r.id === c.id);
  assert.equal(c.set, 'lea');
  for (const key of ['referenceHash', 'scanHash', 'poseHash', 'accepted', 'controls'])
    assert.deepEqual(c[key], b[key], c.name + ': ' + key);
  let accepted = c.accepted;
  if (!accepted) {
    const proof = cornerProof.rows.find((r) => r.id === c.id);
    assert(proof?.accepted);
    assert.equal(proof.referenceHash, c.referenceHash);
    assert.equal(proof.poseHash, c.poseHash);
    accepted = true;
  }
  const changed = c.renderHash !== b.renderHash;
  assert.equal(changed, expected.has(c.id), c.name + ': unexpected native footprint');
  const row = {
    id: c.id,
    name: c.name,
    accepted,
    originalCaptureAccepted: c.accepted,
    changed,
    referenceHash: c.referenceHash,
    poseHash: c.poseHash,
    beforeHash: b.renderHash,
    afterHash: c.renderHash,
  };
  if (changed) {
    const bytes = await Promise.all([
      readFile(path.join(baselineDirectory, 'lea', c.id + '.png')),
      readFile(path.join(candidateDirectory, 'lea', c.id + '.png')),
      readFile(path.join(baselineDirectory, 'lea', c.id + '-scan.png')),
    ]);
    for (const [i, digest] of [b.renderHash, c.renderHash, b.scanHash].entries())
      assert.equal(hash(bytes[i]), digest);
    const [before, after, scan] = bytes.map((b) => PNG.sync.read(b));
    let pixels = 0,
      outside = 0;
    for (let y = 0; y < after.height; y++)
      for (let x = 0; x < after.width; x++) {
        const i = (y * after.width + x) * 4;
        if (![0, 1, 2, 3].some((k) => before.data[i + k] !== after.data[i + k])) continue;
        pixels++;
        if (x < 50 * 1.5 || x >= 450 * 1.5 || y < 405 * 1.5 || y >= 610 * 1.5) outside++;
      }
    assert.equal(outside, 0, c.name + ': changed non-rules pixels');
    const objective = new JsTextObjective(nativeGrayCrop(scan, rect), rect[2], rect[3]),
      a = objective.score(nativeGrayCrop(before, rect)),
      d = objective.score(nativeGrayCrop(after, rect));
    Object.assign(row, {
      changedPixels: pixels,
      outsideRules: outside,
      before100: a[0] * 100,
      after100: d[0] * 100,
      delta100: (d[0] - a[0]) * 100,
      chamferBefore: a[4],
      chamferAfter: d[4],
    });
    assert(row.delta100 > 0, c.name + ': regional regression');
  }
  rows.push(row);
}
const changed = rows.filter((r) => r.changed),
  mean = (key) => changed.reduce((s, r) => s + r[key], 0) / changed.length;
const result = {
  schema: 1,
  status: 'verified-native-unpublished',
  scope:
    'All 295 Alpha full native faces, paired at the exact original wording, sources, font state and independent scan poses. Four pure rules passages change; all 291 other faces and all heading controls remain byte-identical. Three old rejected poses have the separately frozen printed-corner certification; original records are retained. Regional indices out of 100, not percentages or whole-card deltas. Exploratory/reused-development references, not a new blind validation sample.',
  toolHash: hash(await readFile(new URL(import.meta.url))),
  baselineCaptureHash: hash(await readFile(path.join(baselineDirectory, 'capture.json'))),
  candidateCaptureHash: hash(await readFile(path.join(candidateDirectory, 'capture.json'))),
  cornerCertificateHash: hash(cornerBytes),
  rendererHash: candidate.source.rendererHash,
  rect,
  summary: {
    total: 295,
    changed: changed.length,
    unchanged: 295 - changed.length,
    maskEscapes: 0,
    before100: mean('before100'),
    after100: mean('after100'),
    improved: changed.length,
    regressed: 0,
  },
  rows,
};
await writeJson(output, result);
console.log(JSON.stringify({ summary: result.summary, changed }));
