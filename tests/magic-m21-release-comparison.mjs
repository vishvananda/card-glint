import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const dir = 'games/magic/fixtures/accuracy/m21/';
const p = JSON.parse(await readFile(dir + 'release-0612-comparison.json'));
const zipped = await readFile(dir + p.evidence.file);
assert.equal(hash(zipped), p.evidence.sha256);
const raw = gunzipSync(zipped);
assert.equal(hash(raw), p.evidence.contentSha256);
const evidence = JSON.parse(raw);
assert.deepEqual(evidence.definition, p.definition);
assert.deepEqual(evidence.summary, p.summary);
assert.equal(evidence.status, 'complete-population-release-comparison-not-component-certification');
assert.equal(evidence.rows.length, 297);
assert.equal(new Set(evidence.rows.map((r) => r.id)).size, 297);
assert.equal(evidence.rows.filter((r) => r.nonfoil).length, 292);
assert.equal(p.definition.beforeVersion, '0.6.11');
assert.equal(p.definition.afterVersion, '0.6.12');
assert.equal(p.definition.beforeCommit, '89b320d41ed41ddaaf92e5c72f6390a5dbc9448f');
const censusDescriptor = JSON.parse(await readFile(dir + 'current-component-census.json'));
const census = JSON.parse(gunzipSync(await readFile(dir + censusDescriptor.evidence.file)));
assert.equal(p.definition.afterRendererHash, census.definition.rendererHash);
const byId = new Map(census.rows.map((r) => [r.id, r]));
const close = (a, b) => assert(Math.abs(a - b) < 1e-8);
for (const row of evidence.rows) {
  const current = byId.get(row.id);
  assert(current);
  for (const key of ['inputHash', 'referenceHash', 'poseHash'])
    assert.equal(row[key], current[key]);
  close(row.best.structure100, current.structure100);
  close(row.delta100, row.best.structure100 - row.released.structure100);
  for (const key of [
    'beforeFaceHash',
    'afterFaceHash',
    'inputHash',
    'referenceHash',
    'poseHash',
    'normalizedHash',
  ])
    assert.match(row[key], /^[a-f0-9]{64}$/);
  for (const k of ['frame100', 'artNeutralStructure100', 'commonStructure100'])
    assert.equal(
      row.released[k] === null,
      row.best[k] === null,
      'Paired regional coverage differs',
    );
  for (const side of ['released', 'best']) {
    const c = row[side].components;
    const common = Object.keys(c).filter(
      (k) => row.released.components[k]?.eligible && row.best.components[k]?.eligible,
    );
    for (const [metric, keys] of [
      ['commonStructure100', common],
      ['artNeutralStructure100', common.filter((k) => k !== 'art' && k !== 'credits')],
    ]) {
      const weight = keys.reduce((s, k) => s + c[k].weight, 0);
      close(
        row[side][metric],
        (100 * keys.reduce((s, k) => s + c[k].score * c[k].weight, 0)) / weight,
      );
    }
  }
}
for (const side of ['released', 'best'])
  close(
    evidence.rows.reduce((s, r) => s + r[side].structure100, 0) / 297,
    p.summary[side].structure100,
  );
assert.equal(evidence.rows.filter((r) => r.delta100 > 1e-8).length, 278);
assert.equal(evidence.rows.filter((r) => r.delta100 < -1e-8).length, 19);
assert.equal(p.summary.improved, 278);
assert.equal(p.summary.regressed, 19);
console.log(
  'M21 release comparison: all297 Original members, exact current census/pose identities, paired common coverage,278 improvements/19 retained regressions and immutable release0.6.11 provenance pass.',
);
